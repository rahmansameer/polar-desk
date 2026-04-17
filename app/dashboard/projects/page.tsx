"use client";

import { useState } from "react";
import Sidebar from "../../../components/Sidebar";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Sidebar />

      <main className="ml-64 min-h-screen bg-base">
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

            <div
              onClick={() => setIsModalOpen(true)}
              className="grid grid-cols-12 items-center px-5 py-3 hover:bg-surface-2 transition cursor-pointer"
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-surface-2 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">
                    architecture
                  </span>
                </div>
                <span className="text-sm font-medium">Nebula Branding</span>
              </div>
              <div className="col-span-4 text-sm text-muted">
                Stellar Systems
              </div>
              <div className="col-span-3 text-right">
                <span className="text-[11px] px-2 py-1 rounded-md bg-surface-2 text-primary">
                  In Progress
                </span>
              </div>
            </div>

            <div
              onClick={() => setIsModalOpen(true)}
              className="grid grid-cols-12 items-center px-5 py-3 hover:bg-surface-2 transition cursor-pointer"
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-surface-2 flex items-center justify-center text-[rgb(var(--warning))]">
                  <span className="material-symbols-outlined text-[18px]">
                    web
                  </span>
                </div>
                <span className="text-sm font-medium">E-commerce Flow</span>
              </div>
              <div className="col-span-4 text-sm text-muted">Aurora Goods</div>
              <div className="col-span-3 text-right">
                <span className="text-[11px] px-2 py-1 rounded-md bg-surface-2 text-[rgb(var(--warning))]">
                  Review
                </span>
              </div>
            </div>

            <div
              onClick={() => setIsModalOpen(true)}
              className="grid grid-cols-12 items-center px-5 py-3 hover:bg-surface-2 transition cursor-pointer"
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-surface-2 flex items-center justify-center text-[rgb(var(--success))]">
                  <span className="material-symbols-outlined text-[18px]">
                    palette
                  </span>
                </div>
                <span className="text-sm font-medium">UI Revamp</span>
              </div>
              <div className="col-span-4 text-sm text-muted">TechStack Inc</div>
              <div className="col-span-3 text-right">
                <span className="text-[11px] px-2 py-1 rounded-md bg-surface-2 text-[rgb(var(--success))]">
                  Completed
                </span>
              </div>
            </div>

            <div
              onClick={() => setIsModalOpen(true)}
              className="grid grid-cols-12 items-center px-5 py-3 hover:bg-surface-2 transition cursor-pointer"
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-surface-2 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">
                    code
                  </span>
                </div>
                <span className="text-sm font-medium">Landing Page Build</span>
              </div>
              <div className="col-span-4 text-sm text-muted">Bright Labs</div>
              <div className="col-span-3 text-right">
                <span className="text-[11px] px-2 py-1 rounded-md bg-surface-2 text-primary">
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </section>

        <div
          className={`${isModalOpen ? "flex" : "hidden"} fixed inset-0 bg-black/40 items-center justify-center z-50`}
        >
          <div className="bg-surface w-full max-w-2xl rounded-xl border border-default shadow-md overflow-hidden">
            <div className="relative">
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-[rgb(var(--surface))] to-transparent z-10"></div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-[rgb(var(--surface))] to-transparent z-10"></div>

              <div className="max-h-[90vh] overflow-y-auto">
                <div className="p-5 border-b border-default flex justify-between items-center sticky top-0 bg-surface z-20 rounded-t-xl">
                  <h3 className="text-base font-semibold">Project</h3>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="cursor-pointer"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="p-5 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs text-muted">Project Name</label>
                      <input className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]" />
                    </div>

                    <div>
                      <label className="text-xs text-muted">Client</label>
                      <input className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]" />
                    </div>

                    <div>
                      <label className="text-xs text-muted">Deadline</label>
                      <input
                        type="date"
                        className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted">Budget</label>
                      <input className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]" />
                    </div>

                    <div>
                      <label className="text-xs text-muted">Status</label>
                      <select className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD] cursor-pointer">
                        <option>In Progress</option>
                        <option>Review</option>
                        <option>Completed</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-muted">Description</label>
                      <textarea
                        rows={3}
                        className="mt-1 w-full border border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525CD]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted">Client Link</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        defaultValue="https://app.yourdomain.com/project/abc123"
                        readOnly
                        className="flex-1 border border-default rounded-md px-3 py-2 text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        className="px-3 text-sm bg-surface-2 rounded-md cursor-pointer hover:bg-surface-3 transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-muted">Attachments</label>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between border border-default px-3 py-2 rounded-md text-sm">
                        <span className="truncate">proposal.pdf</span>
                        <button
                          type="button"
                          className="text-[rgb(var(--error))] cursor-pointer hover:opacity-80"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between border border-default px-3 py-2 rounded-md text-sm">
                        <span className="truncate">design.fig</span>
                        <button
                          type="button"
                          className="text-[rgb(var(--error))] cursor-pointer hover:opacity-80"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>

                    <input
                      type="file"
                      multiple
                      className="text-xs mt-2 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-5 border-t border-default flex justify-end gap-2 sticky bottom-0 bg-surface z-20 rounded-b-xl">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm text-muted cursor-pointer hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-[#3525CD] text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:opacity-95 active:scale-[0.98] transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
