export function VideoSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#181818] animate-pulse min-h-[300px] flex flex-col">
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-700 rounded-t-xl" />

      {/* Avatar + Text */}
      <div className="p-4 space-y-4">
        {/* Avatar dan title bar */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
          </div>
        </div>

        {/* Tambahan bar jika perlu */}
        <div className="h-4 bg-gray-700 rounded w-1/3" />
      </div>
    </div>
  );
}
