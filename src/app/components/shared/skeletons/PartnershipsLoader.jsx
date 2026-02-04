import LoaderLayout from "./LoaderLayout";

export default function PartnershipsLoader() {
  return (
    <LoaderLayout>
      {/* Header */}
      <div className="flex flex-col space-y-6 mb-16">
        <div className="h-12 w-2/3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="h-4 w-full max-w-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
      </div>

      {/* Stacked Content Sections */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col md:flex-row gap-8 items-center mb-24">
          <div className="w-full md:w-1/2 h-64 rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10" />
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 w-3/4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
            <div className="h-4 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
            <div className="h-4 w-5/6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
            <div className="h-4 w-4/5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
          </div>
        </div>
      ))}
    </LoaderLayout>
  );
}
