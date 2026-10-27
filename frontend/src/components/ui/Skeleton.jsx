export default function PageSkeleton() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8 lg:pt-28">
      <div className="animate-pulse">
        {/* Header Mock */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <div className="h-3 w-24 rounded bg-[#8d8a86] sm:h-4 sm:w-32"></div>
            <div className="h-10 w-48 rounded-lg bg-[#8d8a86] sm:h-12 sm:w-64"></div>
            <div className="h-4 w-64 rounded bg-[#8d8a86] sm:h-6 sm:w-96"></div>
          </div>
          <div className="h-12 w-32 rounded-full bg-[#8d8a86] sm:w-36"></div>
        </div>

        {/* Stats Row Mock */}
        <div className="mb-10 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#8d8a86]/60"></div>
          ))}
        </div>

        {/* Grid Mock */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-3xl bg-[#8d8a86]/40"></div>
          ))}
        </div>
      </div>
    </div>
  );
}