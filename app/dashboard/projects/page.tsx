"use client";

import { useEffect, useState } from "react";
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
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window === "undefined") {
      return defaultProjects;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProjects;
    } catch {
      return defaultProjects;
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftProject, setDraftProject] = useState<Project | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const openProject = (project: Project) => {
    setDraftProject(project);
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

  const saveProject = () => {
    if (!draftProject) return;

    const updatedProject = {
      ...draftProject,
      progressPercent: draftProject.progressPercent,
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
                    <p className="text-[11px] text-muted">
                      {project.progressPercent}% complete
                    </p>
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

                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-muted">Progress</label>
                        <div className="mt-2 flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={draftProject.progressPercent}
                            onChange={(event) =>
                              updateDraft({
                                progressPercent: Number(event.target.value),
                              })
                            }
                            className="h-2 w-full accent-[#3525CD]"
                          />
                          <span className="w-14 text-right text-sm font-semibold">
                            {draftProject.progressPercent}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                          <div
                            className="h-full rounded-full bg-[#3525CD]"
                            style={{
                              width: `${draftProject.progressPercent}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">
                            Progress steps
                          </p>
                          <p className="text-xs text-muted">
                            Add unlimited progress items and mark them complete.
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
                            className="rounded-xl border border-default  p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleProgressComplete(item.id)
                                  }
                                  className={`inline-flex h-10 w-10 items-center justify-center rounded-md border text-lg transition ${item.completedAt ? "border-[rgb(var(--success))] bg-[rgb(var(--success))/10] text-[rgb(var(--success))]" : "border-default bg-surface text-muted"}`}
                                  aria-label={
                                    item.completedAt
                                      ? "Mark incomplete"
                                      : "Mark complete"
                                  }
                                >
                                  <span className="material-symbols-outlined text-base">
                                    {item.completedAt
                                      ? "check"
                                      : "radio_button_unchecked"}
                                  </span>
                                </button>

                                <div className="min-w-0 flex-1">
                                  <input
                                    value={item.name}
                                    onChange={(event) =>
                                      updateProgressItem(item.id, {
                                        name: event.target.value,
                                      })
                                    }
                                    placeholder="Step description"
                                    className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                                <button
                                  type="button"
                                  onClick={() => removeProgressItem(item.id)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-default bg-surface text-[rgb(var(--error))] transition hover:bg-surface-2"
                                  aria-label="Remove step"
                                >
                                  <span className="material-symbols-outlined text-base">
                                    delete
                                  </span>
                                </button>

                                <div className="w-full min-w-40">
                                  <label className="text-xs text-muted">
                                    Expected date
                                  </label>
                                  <input
                                    type="date"
                                    value={item.expectedDate}
                                    onChange={(event) =>
                                      updateProgressItem(item.id, {
                                        expectedDate: event.target.value,
                                      })
                                    }
                                    className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 rounded-md bg-white p-3 text-sm text-muted border border-default">
                              {item.completedAt ? (
                                <span className="font-medium text-[rgb(var(--success))]">
                                  Completed on {item.completedAt}
                                </span>
                              ) : (
                                <span>
                                  In Progress — expected{" "}
                                  {item.expectedDate || "date"}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
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
