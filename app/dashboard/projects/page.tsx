"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import Sidebar from "../../../components/Sidebar";

type ProgressItem = {
  id: string;
  name: string;
  expectedDate: string;
  completedAt: string;
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
  files: string[];
};

const defaultProjects: Project[] = [
  {
    id: "nebula-branding",
    name: "Nebula Branding",
    clientName: "Stellar Systems",
    clientEmail: "hello@stellarsystems.com",
    deadline: "2025-09-15",
    status: "In Progress",
    progressItems: [
      {
        id: "p1-1",
        name: "Discovery & Brand Strategy",
        expectedDate: "2025-06-20",
        completedAt: "2025-06-18",
      },
      {
        id: "p1-2",
        name: "Visual Identity Exploration",
        expectedDate: "2025-07-10",
        completedAt: "2025-07-08",
      },
      {
        id: "p1-3",
        name: "Collateral Design & Typography",
        expectedDate: "2025-08-03",
        completedAt: "",
      },
      {
        id: "p1-4",
        name: "Final Delivery & Brand Guidelines",
        expectedDate: "2025-09-10",
        completedAt: "",
      },
    ],
    progressPercent: 50,
    files: [],
  },
  {
    id: "ecommerce-flow",
    name: "E-commerce Flow",
    clientName: "Aurora Goods",
    clientEmail: "contact@auroragoods.com",
    deadline: "2025-10-01",
    status: "Review",
    progressItems: [
      {
        id: "p2-1",
        name: "Discovery & Brand Strategy",
        expectedDate: "2025-06-12",
        completedAt: "2025-06-12",
      },
      {
        id: "p2-2",
        name: "Visual Identity Exploration",
        expectedDate: "2025-07-05",
        completedAt: "2025-07-04",
      },
      {
        id: "p2-3",
        name: "Collateral Design & Typography",
        expectedDate: "2025-08-10",
        completedAt: "",
      },
      {
        id: "p2-4",
        name: "Final Delivery & Brand Guidelines",
        expectedDate: "2025-09-20",
        completedAt: "",
      },
    ],
    progressPercent: 50,
    files: [],
  },
  {
    id: "ui-revamp",
    name: "UI Revamp",
    clientName: "TechStack Inc",
    clientEmail: "team@techstackinc.com",
    deadline: "2025-08-25",
    status: "Completed",
    progressItems: [
      {
        id: "p3-1",
        name: "Discovery & Brand Strategy",
        expectedDate: "2025-05-06",
        completedAt: "2025-05-06",
      },
      {
        id: "p3-2",
        name: "Visual Identity Exploration",
        expectedDate: "2025-05-30",
        completedAt: "2025-05-30",
      },
      {
        id: "p3-3",
        name: "Collateral Design & Typography",
        expectedDate: "2025-06-20",
        completedAt: "2025-06-20",
      },
      {
        id: "p3-4",
        name: "Final Delivery & Brand Guidelines",
        expectedDate: "2025-07-10",
        completedAt: "2025-07-10",
      },
    ],
    progressPercent: 100,
    files: [],
  },
  {
    id: "landing-page-build",
    name: "Landing Page Build",
    clientName: "Bright Labs",
    clientEmail: "hello@brightlabs.com",
    deadline: "2025-11-01",
    status: "In Progress",
    progressItems: [
      {
        id: "p4-1",
        name: "Discovery & Brand Strategy",
        expectedDate: "2025-07-03",
        completedAt: "2025-07-02",
      },
      {
        id: "p4-2",
        name: "Visual Identity Exploration",
        expectedDate: "2025-08-01",
        completedAt: "",
      },
      {
        id: "p4-3",
        name: "Collateral Design & Typography",
        expectedDate: "2025-09-10",
        completedAt: "",
      },
      {
        id: "p4-4",
        name: "Final Delivery & Brand Guidelines",
        expectedDate: "2025-10-20",
        completedAt: "",
      },
    ],
    progressPercent: 25,
    files: [],
  },
];

const STORAGE_KEY = "polar-dashboard-projects";

function createProjectId() {
  return `project-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`;
}

function createProgressItem(name = "New step") {
  return {
    id: `progress-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`,
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftProject, setDraftProject] = useState<Project | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProjects(
          JSON.parse(stored).map((project: Partial<Project>) =>
            normalizeProject(project),
          ),
        );
      }
    } catch {
      setProjects(defaultProjects);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const openProject = (project: Project) => {
    setDraftProject(normalizeProject(project));
    setIsModalOpen(true);
  };

  const openNewProject = () => {
    setDraftProject(buildEmptyProject());
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

  const addFiles = (files: FileList | null) => {
    if (!files || !draftProject) return;
    const fileNames = Array.from(files).map((file) => file.name);
    setDraftProject((current) =>
      current
        ? {
            ...current,
            files: Array.from(new Set([...current.files, ...fileNames])),
          }
        : current,
    );
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

  const saveProject = () => {
    if (!draftProject) return;

    const updatedProject = {
      ...draftProject,
      progressPercent: draftProgressPercent,
    };

    setProjects((current) => {
      const existing = current.find(
        (project) => project.id === updatedProject.id,
      );
      if (existing) {
        return current.map((project) =>
          project.id === updatedProject.id ? updatedProject : project,
        );
      }

      return [updatedProject, ...current];
    });

    setIsModalOpen(false);
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

        <section className="p-8">
          <div className="bg-surface border border-default rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 px-5 py-3 text-xs text-muted border-b border-default">
              <span className="col-span-5">Project</span>
              <span className="col-span-4">Client</span>
              <span className="col-span-3 text-right">Status</span>
            </div>
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => openProject(project)}
                className="grid grid-cols-12 items-center px-5 py-3 hover:bg-surface-2 transition cursor-pointer"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-surface-2 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">
                      {project.id === "ui-revamp"
                        ? "palette"
                        : project.id === "ecommerce-flow"
                          ? "web"
                          : project.id === "landing-page-build"
                            ? "code"
                            : "architecture"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">{project.name}</span>
                  </div>
                </div>
                <div className="col-span-4 text-sm text-muted">
                  {project.clientName}
                </div>
                <div className="col-span-3 text-right">
                  <span
                    className={`text-[11px] px-2 py-1 rounded-md ${statusClass(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {draftProject ? (
          <div
            className={`${isModalOpen ? "flex" : "hidden"} fixed inset-0 bg-black/40 items-center justify-center z-50 px-4 py-6`}
          >
            <div className="bg-surface w-full max-w-2xl rounded-xl border border-default shadow-md overflow-hidden">
              <div className="relative">
                <div className="max-h-[90vh] overflow-y-auto">
                  <div className="p-5 border-b border-default flex justify-between items-center sticky top-0 bg-surface z-20 rounded-t-xl">
                    <div>
                      <h3 className="text-base font-semibold">
                        Project details
                      </h3>
                      <p className="text-xs text-muted mt-1">
                        Details are stored in local storage.
                      </p>
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
                            {/* Check Button */}
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

                            {/* Step Name */}
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

                            {/* Date */}
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

                            {/* Delete */}
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
                          or use the button below
                        </p>
                        <label className="rounded-md bg-[#3525CD] px-4 py-2 text-sm text-white cursor-pointer">
                          Select files
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {draftProject.files.length > 0 ? (
                        <div className="mt-4 space-y-2">
                          {(draftProject.files ?? []).map((fileName) => (
                            <div
                              key={fileName}
                              className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm border border-default"
                            >
                              <span className="truncate">{fileName}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-5 border-t border-default flex flex-col gap-3 md:flex-row justify-end sticky bottom-0 bg-surface z-20 rounded-b-xl">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm text-muted cursor-pointer hover:text-black"
                    >
                      Cancel
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
      </main>
    </>
  );
}
