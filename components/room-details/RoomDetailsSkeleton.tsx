export default function RoomDetailsSkeleton() {
  return (
    <div className="bg-surface text-on-surface min-h-screen animate-pulse">
      <div className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
          <div className="h-8 w-28 rounded-full bg-surface-container-high" />
          <div className="hidden md:flex items-center gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`nav-skeleton-${index}`}
                className="h-6 w-16 rounded-full bg-surface-container-high"
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-surface-container-high" />
            <div className="h-10 w-10 rounded-full bg-surface-container-high" />
            <div className="h-10 w-10 rounded-full bg-surface-container-high" />
          </div>
        </div>
      </div>

      <main className="pt-24 pb-20 max-w-screen-2xl mx-auto px-8">
        <div className="h-[600px] rounded-3xl bg-surface-container-high mb-12" />

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[68%] space-y-8">
            <div className="space-y-4">
              <div className="h-14 w-3/4 rounded-full bg-surface-container-high" />
              <div className="h-6 w-1/2 rounded-full bg-surface-container-high" />
            </div>

            <div className="h-px w-full bg-outline-variant/15" />

            <div className="space-y-4">
              <div className="h-8 w-56 rounded-full bg-surface-container-high" />
              <div className="h-6 w-full rounded-full bg-surface-container-high" />
              <div className="h-6 w-full rounded-full bg-surface-container-high" />
              <div className="h-6 w-5/6 rounded-full bg-surface-container-high" />
            </div>

            <div className="rounded-2xl bg-surface-container-low p-8">
              <div className="h-8 w-48 rounded-full bg-surface-container-high mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`amenity-skeleton-${index}`}
                    className="h-16 rounded-2xl bg-surface-container-high"
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm h-80" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`slot-skeleton-${index}`}
                    className="h-20 rounded-xl bg-surface-container-low"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-[32%]">
            <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_32px_rgba(27,28,28,0.08)] border border-outline-variant/10 h-[520px]" />
          </div>
        </div>
      </main>
    </div>
  );
}
