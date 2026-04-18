"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import Sidebar from "../../../components/Sidebar";
import AuthGuard from "../../../components/AuthGuard";
import { supabase } from "../../../src/lib/supabaseClient";

type ProgressItem = {
  id: string;
  name: string;
  expectedDate: string;
  completedAt: string;
};

type ProjectFile = {
  id: string;
  file_url: string;
  file_name: string;
};

type Project = {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  deadline: string;
  status: "In Progress" | "Review" | "Completed";
  progressItems: ProgressItem[];
  progressPercent: number;
  files: ProjectFile[];
  user_id?: string;
};

function createProjectId() {
  return crypto.randomUUID();
}

function createProgressItem(name = "New step") {
  return {
    id: crypto.randomUUID(),
    name,
    expectedDate: "",
    completedAt: "",
  };
}

function buildEmptyProject(): Project {
  return {
    id: createProjectId(),
    name: "",
    clientName: "",
    clientEmail: "",
    deadline: "",
    status: "In Progress",
    progressItems: [createProgressItem("Discovery & Brand Strategy")],
    progressPercent: 0,
    files: [],
  };
}

function normalizeProject(project: Partial<Project>): Project {
  return {
    id: project.id ?? createProjectId(),
    name: project.name ?? "",
    clientName: project.clientName ?? "",
    clientEmail: project.clientEmail ?? "",
    deadline: project.deadline ?? "",
    status: project.status ?? "In Progress",
    progressItems: project.progressItems ?? [
      createProgressItem("Discovery & Brand Strategy"),
    ],
    progressPercent: project.progressPercent ?? 0,
    files: project.files ?? [],
  };
}

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftProject, setDraftProject] = useState<Project | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { file: File; status: "uploading" | "done" }[]
  >([]);
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const fetchProjects = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: projectsData, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
        return;
      }

      const projectsWithDetails: Project[] = [];

      for (const project of projectsData || []) {
        const { data: steps } = await supabase
          .from("project_steps")
          .select("*")
          .eq("project_id", project.id);

        const { data: files } = await supabase
          .from("project_files")
          .select("*")
          .eq("project_id", project.id);

        const progressItems: ProgressItem[] = (steps || []).map((step) => ({
          id: step.id,
          name: step.name,
          expectedDate: step.expected_date || "",
          completedAt: step.completed_at || "",
        }));

        const projectFiles: ProjectFile[] = (files || []).map((file) => ({
          id: file.id,
          file_url: file.file_url,
          file_name: file.file_name,
        }));

        const totalSteps = progressItems.length;
        const completedSteps = progressItems.filter(
          (s) => s.completedAt,
        ).length;
        const progressPercent =
          totalSteps === 0
            ? 0
            : Math.round((completedSteps / totalSteps) * 100);

        projectsWithDetails.push({
          id: project.id,
          name: project.name,
          clientName: project.client_name,
          clientEmail: project.client_email,
          deadline: project.deadline,
          status: project.status,
          progressItems,
          progressPercent,
          files: projectFiles,
          user_id: project.user_id,
        });
      }

      setProjects(projectsWithDetails);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const openProject = async (project: Project) => {
    setDraftProject(normalizeProject(project));
    setUploadedFiles([]);
    setMagicLink(null);
    setIsModalOpen(true);
  };

  const openNewProject = () => {
    setDraftProject(buildEmptyProject());
    setUploadedFiles([]);
    setMagicLink(null);
    setIsModalOpen(true);
  };

  const updateDraft = (partial: Partial<Project>) => {
    setDraftProject((current) =>
      current ? { ...current, ...partial } : current,
    );
  };

  const updateProgressItem = (id: string, data: Partial<ProgressItem>) => {
    setDraftProject((current) =>
      current
        ? {
            ...current,
            progressItems: current.progressItems.map((item) =>
              item.id === id ? { ...item, ...data } : item,
            ),
          }
        : current,
    );
  };

  const toggleProgressComplete = (id: string) => {
    const now = new Date().toISOString().slice(0, 10);
    setDraftProject((current) =>
      current
        ? {
            ...current,
            progressItems: current.progressItems.map((item) =>
              item.id === id
                ? {
                    ...item,
                    completedAt: item.completedAt ? "" : now,
                  }
                : item,
            ),
          }
        : current,
    );
  };

  const addProgressItem = () => {
    setDraftProject((current) =>
      current
        ? {
            ...current,
            progressItems: [...current.progressItems, createProgressItem("")],
          }
        : current,
    );
  };

  const removeProgressItem = (id: string) => {
    setDraftProject((current) =>
      current
        ? {
            ...current,
            progressItems: current.progressItems.filter(
              (item) => item.id !== id,
            ),
          }
        : current,
    );
  };

  const addFiles = async (files: FileList | null) => {
    if (!files) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || !draftProject) return;

    const userId = session.user.id;
    const projectId = draftProject.id;

    const newFiles = Array.from(files).map((file) => ({
      file,
      status: "uploading" as const,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // upload instantly
    for (const item of newFiles) {
      const file = item.file;

      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${projectId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("project-files").getPublicUrl(filePath);

      const { data, error } = await supabase
        .from("project_files")
        .insert({
          project_id: projectId,
          file_url: publicUrl,
          file_name: file.name,
        })
        .select()
        .single();

      if (!error && data) {
        // update UI instantly
        setDraftProject((prev) =>
          prev
            ? {
                ...prev,
                files: [...prev.files, data],
              }
            : prev,
        );

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file.name === file.name ? { ...f, status: "done" } : f,
          ),
        );
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    if (event.target) event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    addFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const draftProgressPercent = useMemo(() => {
    if (!draftProject) return 0;
    const total = draftProject.progressItems.length;
    const complete = draftProject.progressItems.filter(
      (item) => item.completedAt,
    ).length;
    return total === 0 ? 0 : Math.round((complete / total) * 100);
  }, [draftProject]);

  const saveProject = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!draftProject || !session) {
      alert("User not authenticated");
      return;
    }

    const userId = session.user.id;
    const projectId = draftProject.id;
    const isNewProject = !projects.find((p) => p.id === projectId);

    try {
      // 1. Save project
      const { error: projectError } = await supabase.from("projects").upsert(
        {
          id: projectId,
          user_id: userId,
          name: draftProject.name,
          client_name: draftProject.clientName,
          client_email: draftProject.clientEmail,
          deadline: draftProject.deadline || null,
          status: draftProject.status,
          progress_percent: draftProgressPercent,
        },
        { onConflict: "id" },
      );

      if (projectError) {
        console.error(projectError);
        alert("Project save failed");
        return;
      }

      // 2. Replace steps
      await supabase.from("project_steps").delete().eq("project_id", projectId);

      const stepsData = draftProject.progressItems.map((item) => ({
        id: item.id,
        project_id: projectId,
        name: item.name,
        expected_date: item.expectedDate || null,
        completed_at: item.completedAt || null,
      }));

      if (stepsData.length > 0) {
        const { data, error } = await supabase
          .from("project_steps")
          .insert(stepsData)
          .select();

        console.log("STEPS INSERT RESULT:", data, error);

        if (error) console.error(error);
      }

      // 3. Upload files
      const uploadedFileRecords: ProjectFile[] = [];

      // 4. Update UI instantly
      const updatedProject: Project = {
        ...draftProject,
        id: projectId,
        progressPercent: draftProgressPercent,
        files: [...draftProject.files, ...uploadedFileRecords],
      };

      setProjects((prev) => {
        const exists = prev.find((p) => p.id === projectId);
        if (exists) {
          return prev.map((p) => (p.id === projectId ? updatedProject : p));
        }
        return [updatedProject, ...prev];
      });

      // 5. Magic link
      if (isNewProject) {
        const token = crypto.randomUUID();

        await supabase.from("magic_links").insert({
          project_id: projectId,
          token,
          expires_at: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

        setMagicLink(`${window.location.origin}/project/${token}`);
      }

      // 6. Reset UI
      setUploadedFiles([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const statusClass = (status: Project["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-surface-2 text-[rgb(var(--success))]";
      case "Review":
        return "bg-surface-2 text-[rgb(var(--warning))]";
      default:
        return "bg-surface-2 text-primary";
    }
  };

  const copyMagicLink = () => {
    if (magicLink) {
      navigator.clipboard.writeText(magicLink);
    }
  };

  const deleteFile = async (fileId: string) => {
    await supabase.from("project_files").delete().eq("id", fileId);

    setDraftProject((prev) =>
      prev
        ? {
            ...prev,
            files: prev.files.filter((f) => f.id !== fileId),
          }
        : prev,
    );
  };

  const deleteProject = (id: string) => {
    setDeletingId(id);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(async () => {
      clearInterval(interval);

      await supabase.from("project_files").delete().eq("project_id", id);
      await supabase.from("project_steps").delete().eq("project_id", id);
      await supabase.from("magic_links").delete().eq("project_id", id);
      await supabase.from("projects").delete().eq("id", id);

      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
    }, 3000);

    setDeleteTimer(timer);
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <main className="min-h-screen bg-base pb-20 lg:ml-64 lg:pb-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--primary))]"></div>
        </main>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <main className="min-h-screen bg-base pb-20 lg:ml-64 lg:pb-0">
        <header className="sticky top-0 z-40 glass-nav px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight font-headline">
              Projects
            </h2>
            <p className="text-sm text-muted">
              Manage all your client projects
            </p>
          </div>

          <button
            type="button"
            onClick={openNewProject}
            className="bg-[#3525CD] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Project
          </button>
        </header>

        <section className="p-6 md:p-8">
          <div className="bg-white border border-default rounded-xl overflow-hidden">
            {/* header */}
            <div className="hidden md:grid grid-cols-12 px-6 py-4 text-sm font-medium text-gray-500 border-b border-gray-200 bg-gray-50">
              <span className="col-span-4">Project</span>
              <span className="col-span-3">Client</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-3 text-right">Actions</span>
            </div>

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-lg font-medium text-gray-800">
                  No projects yet
                </p>

                <button
                  onClick={openNewProject}
                  className="mt-4 px-5 py-2.5 text-sm font-medium text-white bg-[#3525CD] rounded-md"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 px-6 py-5 items-center"
                  >
                    {/* project */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      {/* icon box */}
                      <div className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                        <span className="material-symbols-outlined text-[18px] text-gray-600">
                          folder
                        </span>
                      </div>

                      {/* text */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {project.name}
                        </p>
                      </div>
                    </div>

                    {/* client */}
                    <div className="md:col-span-3">
                      <p className="text-sm font-semibold text-gray-600">
                        {project.clientName}
                      </p>
                    </div>

                    {/* status */}
                    <div className="md:col-span-2 font-medium">
                      <span
                        className={`inline-block text-xs px-2.5 py-1 rounded-md ${statusClass(
                          project.status,
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* actions */}
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-2 mt-2 md:mt-0 font-medium">
                      <button
                        onClick={() => openProject(project)}
                        className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        Open
                      </button>

                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/project/${project.id}`;
                          navigator.clipboard.writeText(link);
                        }}
                        className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        Copy link
                      </button>

                      <button
                        onClick={() => deleteProject(project.id)}
                        className="px-3 py-1.5 text-sm text-red-500 border border-gray-200 rounded-md cursor-pointer hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {draftProject ? (
          <div
            className={`${isModalOpen ? "flex" : "hidden"} fixed inset-0 bg-black/40 items-center justify-center z-50 px-4 py-6`}
          >
            <div className="bg-surface w-full max-w-2xl rounded-xl border border-default shadow-md overflow-hidden">
              <div className="relative">
                <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
                  <div className="p-5 border-b border-default flex justify-between items-center sticky top-0 bg-surface z-20 rounded-t-xl">
                    <div>
                      <h3 className="text-base font-semibold">
                        Project details
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="cursor-pointer"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div className="p-5 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="col-span-2">
                        <label className="text-xs text-muted">
                          Project Name
                        </label>
                        <input
                          value={draftProject.name}
                          onChange={(event) =>
                            updateDraft({ name: event.target.value })
                          }
                          className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted">
                          Client Name
                        </label>
                        <input
                          value={draftProject.clientName}
                          onChange={(event) =>
                            updateDraft({ clientName: event.target.value })
                          }
                          className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted">
                          Client Email
                        </label>
                        <input
                          value={draftProject.clientEmail}
                          onChange={(event) =>
                            updateDraft({ clientEmail: event.target.value })
                          }
                          type="email"
                          className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted">Deadline</label>
                        <input
                          type="date"
                          value={draftProject.deadline}
                          onChange={(event) =>
                            updateDraft({ deadline: event.target.value })
                          }
                          className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                        />
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-muted">Status</label>
                        <select
                          value={draftProject.status}
                          onChange={(event) =>
                            updateDraft({
                              status: event.target.value as Project["status"],
                            })
                          }
                          className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD] cursor-pointer"
                        >
                          <option>In Progress</option>
                          <option>Review</option>
                          <option>Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">
                            Progress steps
                          </p>
                          <p className="text-xs text-muted">
                            Add progress items and mark them complete.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={addProgressItem}
                          className="inline-flex items-center gap-2 rounded-md border border-default bg-surface px-3 py-2 text-xs font-medium transition hover:bg-surface-2"
                        >
                          <span className="material-symbols-outlined text-base">
                            add
                          </span>
                          Add step
                        </button>
                      </div>

                      <div className="space-y-3">
                        {draftProject.progressItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            <button
                              type="button"
                              onClick={() => toggleProgressComplete(item.id)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-lg transition ${
                                item.completedAt
                                  ? "border-[rgb(var(--success))] bg-[rgb(var(--success))/10] text-[rgb(var(--success))]"
                                  : "border-default bg-surface text-muted"
                              }`}
                            >
                              <span className="material-symbols-outlined text-base">
                                {item.completedAt
                                  ? "check"
                                  : "radio_button_unchecked"}
                              </span>
                            </button>

                            <input
                              value={item.name}
                              onChange={(e) =>
                                updateProgressItem(item.id, {
                                  name: e.target.value,
                                })
                              }
                              placeholder="Progress step"
                              className="flex-1 border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                            />

                            <input
                              type="date"
                              value={item.expectedDate}
                              onChange={(e) =>
                                updateProgressItem(item.id, {
                                  expectedDate: e.target.value,
                                })
                              }
                              className="w-[140px] border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                            />

                            <button
                              type="button"
                              onClick={() => removeProgressItem(item.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-default bg-surface text-[rgb(var(--error))] hover:bg-surface-2"
                            >
                              <span className="material-symbols-outlined text-base">
                                delete
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-default bg-surface-2 p-4">
                      <h4 className="text-sm font-semibold">Attachments</h4>
                      <div
                        className={`mt-4 flex min-h-35 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-6 text-sm transition ${
                          dragOver
                            ? "border-[#3525CD] bg-surface"
                            : "border-default bg-white"
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        <p className="text-sm font-medium text-on-surface">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-muted">
                          Upload files by dragging them here
                        </p>
                      </div>

                      {(draftProject.files.length > 0 ||
                        uploadedFiles.length > 0) && (
                        <div className="mt-4 space-y-2">
                          {/* uploading files */}
                          {uploadedFiles
                            .filter((f) => f.status === "uploading")
                            .map((item, idx) => (
                              <div
                                key={`${item.file.name}-${idx}`}
                                className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm border border-default border-dashed"
                              >
                                <span className="truncate">
                                  {item.file.name}
                                </span>
                                <span className="text-xs text-muted">
                                  Uploading...
                                </span>
                              </div>
                            ))}

                          {/* uploaded files (REAL FILES) */}
                          {draftProject.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm border border-default"
                            >
                              <span className="truncate">{file.file_name}</span>

                              <div className="flex items-center gap-3">
                                <a
                                  href={file.file_url}
                                  target="_blank"
                                  className="text-xs text-blue-500 cursor-pointer"
                                >
                                  Open
                                </a>

                                <button
                                  onClick={() => deleteFile(file.id)}
                                  className="text-xs text-red-500 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {magicLink && (
                      <div className="rounded-xl border border-[#3525CD]/30 bg-[#3525CD]/5 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted mb-1">
                              Project Link:
                            </p>
                            <p className="text-sm truncate text-[#3525CD]">
                              {magicLink}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={copyMagicLink}
                            className="shrink-0 bg-[#3525CD] text-white px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-95"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 border-t border-default flex flex-col gap-3 md:flex-row justify-end sticky bottom-0 bg-surface z-20 rounded-b-xl">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm text-muted cursor-pointer hover:text-black"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={saveProject}
                      className="bg-[#3525CD] text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:opacity-95 active:scale-[0.98] transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {deletingId && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-4">
            <p className="text-sm text-gray-800">
              Project deleted • Undo within {countdown}s
            </p>

            <button
              onClick={() => {
                if (deleteTimer) clearTimeout(deleteTimer);
                setDeletingId(null);
              }}
              className="text-sm font-medium text-blue-600"
            >
              Undo
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default function ProjectsPage() {
  return (
    <AuthGuard>
      <ProjectsContent />
    </AuthGuard>
  );
}
