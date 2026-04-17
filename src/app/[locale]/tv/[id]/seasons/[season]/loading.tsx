export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-subtle h-4 w-32 animate-pulse rounded" />

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="bg-subtle h-64 w-44 flex-shrink-0 animate-pulse rounded-lg" />
        <div className="flex flex-col gap-3">
          <div className="bg-subtle h-9 w-48 animate-pulse rounded" />
          <div className="flex flex-wrap gap-4">
            <div className="bg-subtle h-4 w-12 animate-pulse rounded" />
            <div className="bg-subtle h-4 w-20 animate-pulse rounded" />
          </div>
          <div className="flex max-w-2xl flex-col gap-2">
            <div className="bg-subtle h-4 animate-pulse rounded" />
            <div className="bg-subtle h-4 w-3/4 animate-pulse rounded" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-subtle h-7 w-24 animate-pulse rounded" />
        <div className="border-ui divide-ui flex flex-col divide-y overflow-hidden rounded-lg border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 sm:flex-row">
              <div className="bg-subtle h-28 w-full flex-shrink-0 animate-pulse rounded sm:w-48" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="bg-subtle h-4 w-40 animate-pulse rounded" />
                <div className="bg-subtle h-3 w-28 animate-pulse rounded" />
                <div className="bg-subtle h-3 w-full animate-pulse rounded" />
                <div className="bg-subtle h-3 w-2/3 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
