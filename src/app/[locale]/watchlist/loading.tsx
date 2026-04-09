export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="bg-subtle h-9 w-36 animate-pulse rounded" />
        <div className="bg-subtle mt-1 h-4 w-64 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-subtle aspect-[2/3] animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
