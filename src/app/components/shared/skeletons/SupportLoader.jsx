import LoaderLayout from "./LoaderLayout";

export default function SupportLoader() {
  return (
    <LoaderLayout>
      {/* Header */}
      <div className="text-center space-y-6 mb-16">
        <div className="h-12 w-1/2 mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="h-4 w-2/3 mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
      </div>

      {/* Support Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[500px] rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10 relative overflow-hidden"
          >
            {/* Inner shimmer details */}
            <div className="p-6 space-y-6">
              <div className="h-8 w-1/2 bg-white/5 rounded" />
              <div className="h-12 w-3/4 bg-white/5 rounded" />
              <div className="space-y-3 pt-8">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-3 w-full bg-white/5 rounded" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-10 w-48 mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer border border-white/10"
          />
        ))}
      </div>
    </LoaderLayout>
  );
}
