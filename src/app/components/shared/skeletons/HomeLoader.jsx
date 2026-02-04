import LoaderLayout from "./LoaderLayout";

export default function HomeLoader() {
  return (
    <LoaderLayout>
      {/* Hero Section */}
      <div className="w-full h-[60vh] rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer relative overflow-hidden border border-white/10 mb-16">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Synopsis/Prologue Text Blocks */}
      <div className="max-w-4xl mx-auto space-y-6 text-center mb-24">
        <div className="h-8 w-3/4 mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="h-4 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="h-4 w-5/6 mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="h-4 w-4/5 mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
      </div>

      {/* Episodes Grid */}
      <div className="space-y-8">
        <div className="h-10 w-48 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10"
            />
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="space-y-8 mt-16">
        <div className="h-10 w-48 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10"
            />
          ))}
        </div>
      </div>
    </LoaderLayout>
  );
}
