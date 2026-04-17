export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-subtle relative -mx-[calc(50vw-50%)] h-64 animate-pulse sm:h-96" />
      <div className="flex flex-col gap-3">
        <div className="bg-subtle h-4 w-24 animate-pulse rounded" />
        <div className="bg-subtle h-9 w-72 animate-pulse rounded" />
        <div className="flex flex-wrap gap-4">
          <div className="bg-subtle h-4 w-20 animate-pulse rounded" />
          <div className="bg-subtle h-4 w-16 animate-pulse rounded" />
          <div className="bg-subtle h-4 w-12 animate-pulse rounded" />
        </div>
        <div className="flex max-w-2xl flex-col gap-2">
          <div className="bg-subtle h-4 animate-pulse rounded" />
          <div className="bg-subtle h-4 animate-pulse rounded" />
          <div className="bg-subtle h-4 w-3/4 animate-pulse rounded" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-subtle h-7 w-28 animate-pulse rounded" />
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
