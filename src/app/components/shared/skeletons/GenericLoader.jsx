import LoaderLayout from "./LoaderLayout";

export default function GenericLoader() {
  return (
    <LoaderLayout>
      {/* Hero Section Shimmer */}
      <div className="w-full h-[50vh] rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer relative overflow-hidden border border-white/10 mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Content Grid Shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10"
          />
        ))}
      </div>
    </LoaderLayout>
  );
}
