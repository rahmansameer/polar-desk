import Sidebar from "../../../components/Sidebar";

export default function MassagePage() {
  return (
    <>
      <Sidebar />

      <main className="ml-64 min-h-screen bg-base">
        <header className="sticky top-0 z-40 glass-nav px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight font-headline">
              Massage
            </h2>
            <p className="text-sm text-muted">
              Manage your massage schedule and client sessions.
            </p>
          </div>
        </header>

        <section className="p-8">
          <div className="bg-surface border border-default rounded-xl p-8 text-center">
            <h3 className="text-lg font-semibold">Massage Page</h3>
            <p className="mt-3 text-sm text-muted">
              This page is available at <code className="bg-surface-2 rounded px-1 py-0.5">/dashboard/massage</code>.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
