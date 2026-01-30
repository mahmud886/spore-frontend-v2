/**
 * ShimmerCard - Loading skeleton component for episode cards
 * Displays animated shimmer effect while content is loading
 */

export default function ShimmerCard() {
  return (
    <div
      className="h-full flex flex-col box-shadow-xl border border-transparent overflow-hidden"
      style={{ borderTopRightRadius: "20px", borderBottomLeftRadius: "20px" }}
    >
      {/* Image shimmer */}
      <div className="relative w-full aspect-[326/222] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer" />
      {/* Content shimmer */}
      <div className="p-4 space-y-3 flex-1 flex flex-col bg-black/50">
        {/* Title shimmer */}
        <div className="h-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
        {/* Description shimmer */}
        <div className="space-y-2">
          <div className="h-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
          <div className="h-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
        </div>
        {/* Footer shimmer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="h-3 w-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
          <div
            className="h-7 w-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded"
            style={{ borderTopRightRadius: "4px", borderBottomLeftRadius: "4px" }}
          />
        </div>
      </div>
    </div>
  );
}
