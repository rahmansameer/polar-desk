export const metadata = {
  title: "Client Portal",
};

export default function ClientPortalPage() {
  return (
    <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <section className="bg-surface rounded-xl p-8 border border-default">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Project Progress
                </h2>
              </div>

              <span className="text-4xl font-black tracking-tighter">68%</span>
            </div>

            <div className="w-full h-3 bg-surface-2 rounded-full overflow-hidden mb-12">
              <div
                className="h-full rounded-full"
                style={{ width: "68%", background: "var(--gradient-primary)" }}
              ></div>
            </div>

            <div className="space-y-6 divide-y divide-[rgb(var(--border))]/20">
              <div className="flex items-start gap-4 pb-6">
                <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    Discovery & Brand Strategy
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Completed on Oct 12, 2023
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6">
                <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    Visual Identity Exploration
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Completed on Nov 05, 2023
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6">
                <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary/30">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    Collateral Design & Typography
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    In Progress Expected Dec 15
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 opacity-40">
                <div className="mt-1 w-6 h-6 rounded-full border-2 border-default/30"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    Final Delivery & Brand Guidelines
                  </h3>
                  <p className="text-xs text-muted mt-1">Future Phase</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface rounded-xl p-8 border border-default">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-extrabold tracking-tight">
                Shared Files
              </h2>
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Download All
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-surface hover:bg-surface-2 transition cursor-pointer border border-default">
                <span className="text-sm font-semibold">
                  Brand_Strategy_v2.pdf
                </span>
                <span className="material-symbols-outlined text-muted">
                  download
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg bg-surface hover:bg-surface-2 transition cursor-pointer border border-default">
                <span className="text-sm font-semibold">
                  Logo_Drafts_Sheet.jpg
                </span>
                <span className="material-symbols-outlined text-muted">
                  download
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg bg-surface hover:bg-surface-2 transition cursor-pointer border border-default">
                <span className="text-sm font-semibold">
                  Color_Palette_Spec.ase
                </span>
                <span className="material-symbols-outlined text-muted">
                  download
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg bg-surface hover:bg-surface-2 transition cursor-pointer border border-default">
                <span className="text-sm font-semibold">
                  Animation_Teaser.mp4
                </span>
                <span className="material-symbols-outlined text-muted">
                  download
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 sticky top-24 h-[calc(100vh-160px)]">
          <section className="bg-surface rounded-xl flex flex-col h-full border border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-default flex items-center justify-between bg-surface-2/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                <div>
                  <h3 className="text-sm font-bold">Julian Marcus</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                    Project Lead
                  </p>
                </div>
              </div>

              <span className="material-symbols-outlined text-muted hover:text-primary cursor-pointer">
                more_vert
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="bg-surface-2 p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm leading-relaxed">
                    Hi there! I've just uploaded the updated color palette
                    reflecting our discussion yesterday. Let me know what you
                    think!
                  </p>
                </div>
                <span className="text-[10px] text-muted ml-1">10:42 AM</span>
              </div>

              <div className="flex flex-col gap-2 max-w-[85%] ml-auto items-end">
                <div className="bg-[#3525CD] text-white p-4 rounded-2xl rounded-tr-none">
                  <p className="text-sm leading-relaxed">
                    Thanks Julian. The indigo feels much deeper now. This is
                    exactly the "Architect" vibe we were looking for.
                  </p>
                </div>
                <span className="text-[10px] text-muted mr-1">10:45 AM</span>
              </div>

              <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="bg-surface-2 p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm leading-relaxed">
                    Perfect. I'm moving onto the Collateral phase now. Should
                    have some drafts for the stationery set by Friday.
                  </p>
                </div>
                <span className="text-[10px] text-muted ml-1">11:02 AM</span>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-[1px] bg-surface-3"></div>
                <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                  Today
                </span>
                <div className="flex-1 h-[1px] bg-surface-3"></div>
              </div>

              <div className="flex flex-col gap-2 max-w-[85%] ml-auto items-end">
                <div className="bg-[#3525CD] text-white p-4 rounded-2xl rounded-tr-none">
                  <p className="text-sm leading-relaxed">
                    Sounds great. Can we also include the business card mockups
                    in that batch?
                  </p>
                </div>
                <span className="text-[10px] text-muted mr-1">Just now</span>
              </div>
            </div>

            <div className="p-6 bg-surface border-t border-default">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Reply to Julian..."
                  className="w-full pl-4 pr-12 h-12 border border-default rounded-xl text-sm focus:outline-none"
                />

                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center justify-center cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-sm text-primary"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    send
                  </span>
                </button>
              </div>

              <div className="flex justify-between items-center mt-3 px-1">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-muted hover:text-primary cursor-pointer">
                    attach_file
                  </span>
                  <span className="material-symbols-outlined text-muted hover:text-primary cursor-pointer">
                    mood
                  </span>
                </div>

                <span className="text-[10px] text-muted">
                  Press Enter to send
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
