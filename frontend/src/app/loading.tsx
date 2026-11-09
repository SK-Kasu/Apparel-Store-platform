export default function Loading() {
  return (
    <div className="min-h-screen bg-ink text-zinc-900 dark:text-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-line bg-[#f1ece2] px-5 py-6 dark:bg-[#151515] lg:flex">
        <div className="flex items-center gap-3 px-1">
          <div className="h-11 w-11 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-2 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="mt-8 h-11 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-8 space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-line bg-[#f9f6f0]/85 backdrop-blur-xl dark:bg-[#121212]/85">
          <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-10">
            <div className="h-11 w-11 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800 lg:hidden" />
            <div className="h-6 w-36 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 lg:hidden" />
            <div className="order-3 h-12 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800 lg:order-none lg:mx-auto lg:w-auto lg:max-w-2xl lg:flex-1" />
            <div className="ml-auto flex items-center gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-11 w-11 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
                />
              ))}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1480px] px-4 pb-10 pt-5 sm:px-6 lg:px-8 xl:px-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="h-2.5 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="hidden h-2.5 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 sm:block" />
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-line bg-panel">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="flex flex-col p-6 sm:p-9 xl:p-12">
                <div className="flex items-center justify-between gap-4">
                  <div className="h-8 w-28 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-2.5 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>

                <div className="mt-10 space-y-3 sm:mt-14">
                  <div className="h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-16 w-full max-w-md animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-16 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>

                <div className="mt-6 space-y-2">
                  <div className="h-3 w-full max-w-md animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-5/6 max-w-md animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-2/3 max-w-md animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>

                <div className="mt-8 h-8 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-8 h-px bg-line" />

                <div className="mt-7 space-y-4">
                  <div className="h-2.5 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="flex gap-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <div className="h-2.5 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="grid grid-cols-4 gap-2.5">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-12 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="min-h-[520px] animate-pulse bg-zinc-200 dark:bg-zinc-800 lg:min-h-[700px]" />
            </div>

            <div className="border-t border-line p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="h-14 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800 sm:w-14" />
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="h-14 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-14 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-3">
                <div className="h-2.5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-9 w-52 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-72 max-w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="hidden h-2.5 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 sm:block" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900"
                >
                  <div className="aspect-[3/4] animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-3 p-4">
                    <div className="h-2 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="flex items-center justify-between pt-1">
                      <div className="h-4 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-3 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="h-10 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
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
