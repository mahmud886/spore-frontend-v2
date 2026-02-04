import LoaderLayout from "./LoaderLayout";

export default function ResultLoader() {
  return (
    <LoaderLayout>
      {/* Hero Header */}
      <div className="flex flex-col items-center justify-center space-y-6 mb-16 pt-8">
        <div className="h-16 w-3/4 max-w-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="h-6 w-1/2 max-w-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
      </div>

      {/* Poll Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
        <div className="h-32 rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10" />
        <div className="h-32 rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10" />
      </div>

      {/* Countdown */}
      <div className="h-24 max-w-xl mx-auto rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10 mb-16" />

      {/* Products Grid */}
      <div className="space-y-8">
        <div className="h-10 w-48 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10"
            />
          ))}
        </div>
      </div>
    </LoaderLayout>
  );
}
