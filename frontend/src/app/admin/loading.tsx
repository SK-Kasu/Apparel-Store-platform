import { AdminSidebar } from "@/components/admin-sidebar";

const STAT_CARDS = Array.from({ length: 4 }, (_, index) => index);
const TABLE_ROWS = Array.from({ length: 6 }, (_, index) => index);

export default function AdminLoading() {
  return (
    <div className="admin-shell min-h-screen">
      <AdminSidebar />

      <div className="lg:pl-[280px]">
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-2.5 w-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
          <div className="mt-4 h-14 w-64 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900 sm:h-16" />
          <div className="mt-5 h-3 w-full max-w-xl animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
          <div className="mt-2 h-3 w-3/4 max-w-lg animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />

          <section
            aria-hidden="true"
            className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {STAT_CARDS.map((index) => (
              <div
                key={index}
                className="rounded-[1.5rem] border border-[var(--inv-border)] bg-[var(--inv-panel)] p-5"
              >
                <div className="h-10 w-10 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                <div className="mt-7 h-9 w-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                <div className="mt-3 h-2.5 w-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                <div className="mt-3 h-2.5 w-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
              </div>
            ))}
          </section>

          <section
            aria-hidden="true"
            className="mt-6 overflow-hidden rounded-[1.75rem] border border-[var(--inv-border)] bg-[var(--inv-panel)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--inv-border)] px-5 py-4">
              <div className="h-2.5 w-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
              <div className="h-7 w-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
            </div>
            <div className="divide-y divide-[var(--inv-border)]">
              {TABLE_ROWS.map((index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                    <div>
                      <div className="h-3 w-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                      <div className="mt-2 h-2.5 w-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                    <div className="h-9 w-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
