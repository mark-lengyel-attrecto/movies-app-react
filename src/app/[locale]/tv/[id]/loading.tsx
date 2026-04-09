export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="bg-subtle relative -mx-[calc(50vw-50%)] -mt-8 h-72 animate-pulse sm:h-96" />

      {/* Details */}
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="bg-subtle relative -mt-24 h-48 w-32 flex-shrink-0 animate-pulse rounded-lg sm:-mt-32 sm:h-64 sm:w-44" />

        <div className="flex flex-col gap-3">
          <div className="bg-subtle h-9 w-64 animate-pulse rounded" />
          <div className="bg-subtle h-4 w-48 animate-pulse rounded" />
          <div className="flex flex-wrap gap-4">
            <div className="bg-subtle h-4 w-12 animate-pulse rounded" />
            <div className="bg-subtle h-4 w-10 animate-pulse rounded" />
            <div className="bg-subtle h-4 w-16 animate-pulse rounded" />
            <div className="bg-subtle h-4 w-20 animate-pulse rounded" />
            <div className="bg-subtle h-4 w-24 animate-pulse rounded" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-subtle h-6 w-16 animate-pulse rounded-full" />
            <div className="bg-subtle h-6 w-20 animate-pulse rounded-full" />
            <div className="bg-subtle h-6 w-14 animate-pulse rounded-full" />
          </div>
          <div className="flex max-w-2xl flex-col gap-2">
            <div className="bg-subtle h-4 animate-pulse rounded" />
            <div className="bg-subtle h-4 animate-pulse rounded" />
            <div className="bg-subtle h-4 w-3/4 animate-pulse rounded" />
          </div>
        </div>
      </div>

      {/* Cast */}
      <div className="flex flex-col gap-4">
        <div className="bg-subtle h-7 w-12 animate-pulse rounded" />
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="bg-subtle h-16 w-16 animate-pulse rounded-full" />
              <div className="bg-subtle h-3 w-14 animate-pulse rounded" />
              <div className="bg-subtle h-3 w-10 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
