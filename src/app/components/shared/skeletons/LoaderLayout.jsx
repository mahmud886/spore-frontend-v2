export default function LoaderLayout({ children }) {
  return (
    <div className="min-h-screen bg-black/90 w-full">
      {/* Navbar Shimmer - Common across all pages */}
      <div className="w-full h-20 border-b border-white/10 bg-black/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="w-32 h-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded" />
          <div className="hidden md:flex gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-24 h-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer rounded"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">{children}</div>
    </div>
  );
}
