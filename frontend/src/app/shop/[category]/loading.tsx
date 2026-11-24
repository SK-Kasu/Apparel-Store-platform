import { StoreShell } from "@/components/store-shell";

const SKELETON_CARDS = Array.from({ length: 8 }, (_, index) => index);

export default function CategoryLoading() {
  return (
    <StoreShell>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-2.5 w-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
        <div className="h-2.5 w-56 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
      </div>

      <div className="flex gap-2 overflow-hidden pb-3">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-10 w-24 shrink-0 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900"
          />
        ))}
      </div>

      <div className="mt-5 max-w-3xl">
        <div className="h-2.5 w-28 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
        <div className="mt-4 h-12 w-56 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900 sm:h-14 sm:w-72" />
        <div className="mt-4 h-3 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
        <div className="mt-2 h-3 w-4/5 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
        <div className="mt-4 h-2.5 w-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
      </div>

      <section
        aria-hidden="true"
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6"
      >
        {SKELETON_CARDS.map((index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-white/[0.07] bg-panel"
          >
            <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
            <div className="space-y-3 p-5">
              <div className="h-2 w-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
              <div className="h-5 w-3/4 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
              <div className="h-2.5 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
              <div className="h-2.5 w-2/3 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-11 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                <div className="h-11 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </StoreShell>
  );
}
