import { supabase } from "../../../src/lib/supabaseClient";

export const metadata = {
  title: "Client Portal",
};

interface PageProps {
  params: { token: string };
}

async function getProjectData(token: string) {
  let projectId: string | null = null;

  const { data: magicLink } = await supabase
    .from("magic_links")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (magicLink) {
    projectId = magicLink.project_id;

    if (magicLink.expires_at) {
      if (new Date(magicLink.expires_at).getTime() < Date.now()) {
        return null;
      }
    }
  } else {
    projectId = token;
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) return null;

  const { data: steps } = await supabase
    .from("project_steps")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: true });

  const { data: files } = await supabase
    .from("project_files")
    .select("*")
    .eq("project_id", project.id);

  return {
    project,
    steps: steps || [],
    files: files || [],
  };
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ClientPortalPage({ params }: PageProps) {
  const data = await getProjectData(params.token);

  if (!data) {
    return (
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Invalid Link</h1>
          <p className="text-muted">This project is not available.</p>
        </div>
      </main>
    );
  }

  const { steps, files } = data;

  console.log("SERVER STEPS:", data?.steps);

  const completed = steps.filter((s) => !!s.completed_at);
  const progress = steps.length
    ? Math.round((completed.length / steps.length) * 100)
    : 0;

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

              <span className="text-4xl font-black tracking-tighter">
                {progress}%
              </span>
            </div>

            <div className="w-full h-3 bg-surface-2 rounded-full overflow-hidden mb-12">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "var(--gradient-primary)",
                }}
              ></div>
            </div>

            <div className="space-y-6 divide-y divide-[rgb(var(--border))]/20">
              {steps.map((step, index) => {
                const isCompleted = !!step.completed_at;

                const isInProgress = !isCompleted && index === completed.length;

                const isFuture = !isCompleted && index > completed.length;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-4 ${
                      isFuture ? "opacity-40" : "pb-6"
                    } ${isCompleted ? "pb-6" : ""}`}
                  >
                    <div
                      className={`mt-1 flex items-center justify-center w-6 h-6 rounded-full ${
                        isCompleted
                          ? "bg-primary/10 text-primary"
                          : isInProgress
                            ? "border-2 border-primary/30"
                            : "border-2 border-default/30"
                      }`}
                    >
                      {isCompleted ? (
                        <span
                          className="material-symbols-outlined text-sm"
                          style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                          check_circle
                        </span>
                      ) : isInProgress ? (
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{step.name}</h3>
                      <p className="text-xs text-muted mt-1">
                        {isCompleted && step.completed_at
                          ? `Completed on ${formatDate(step.completed_at)}`
                          : isInProgress
                            ? `In Progress${
                                step.expected_date
                                  ? ` · Expected ${formatDate(step.expected_date)}`
                                  : ""
                              }`
                            : "Future Phase"}
                      </p>
                    </div>
                  </div>
                );
              })}
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
              {files.map((file) => (
                <a
                  key={file.id}
                  href={file.file_url}
                  target="_blank"
                  download
                  rel="noopener noreferrer"
                  className="flex justify-between items-center p-4 rounded-lg bg-surface hover:bg-surface-2 transition cursor-pointer border border-default"
                >
                  <span className="text-sm font-semibold">
                    {file.file_name}
                  </span>
                  <span className="material-symbols-outlined text-muted">
                    download
                  </span>
                </a>
              ))}
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
                    Freelancer
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
