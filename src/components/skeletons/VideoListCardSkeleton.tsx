import React from 'react'

function VideoListCardSkeleton() {
  return (
    <div className="flex animate-pulse rounded-md p-4 h-[150px] gap-4 w-full border-b border-muted">
    <div className="min-w-[200px] h-full bg-gray-500 rounded-md"></div>
    <div className="flex flex-col gap-4 w-full">
      <div className="h-6 bg-gray-500 rounded-md w-2/3"></div>
      <div className="flex items-center gap-4">
        <div className="h-4 bg-gray-500 rounded-md w-1/3"></div>
        <div className="h-4 bg-gray-500 rounded-md w-1/4"></div>
      </div>
      <div className="h-6 bg-gray-500 rounded-md w-1/2"></div>
    </div>
  </div>
  )
}

export default VideoListCardSkeleton
