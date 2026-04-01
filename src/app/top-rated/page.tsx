import TopRatedPageClient from "@/features/movies/components/TopRatedPageClient";

export default function TopRatedPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Top Rated Movies</h1>
        <p className="mt-1 text-muted">The best rated movies</p>
      </div>
      <TopRatedPageClient />
    </div>
  )
}
