import { IVideoDetails } from '@/types'
import { Calendar, EllipsisVertical } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
function VideoListCard({videoDetails, type}: {videoDetails: IVideoDetails, type: string}) {
  return (
    <div className='flex'>

    <Link href={type === "standalone" ? `/videos/${videoDetails.libraryId}` : `/playlists/video/${videoDetails.libraryId}`} className='w-full'>
<div className='flex hover:bg-muted duration-150 rounded-md p-4 h-[150px] gap-4 w-full border-b border-muted'>

<div className='flex justify-between w-full gap-4 '>
    <div className='flex gap-4'>
    <div className='min-w-[200px] h-full object-cover'>

    <Image src={videoDetails.thumbnailUrl} alt='logo' width={100} height={100} className='w-[200px] h-full object-cover' />
    </div>
    <div className='flex flex-col items-start gap-2'>
        <h1 className='text-md md:text-xl lg:text-2xl font-bold'>{videoDetails.title.slice(0, 30)+ (videoDetails.title.length > 30 ? '...' : '')}</h1>
        {/* <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>100k views</span>
            <span className='text-sm text-gray-500'>100k likes</span>
        </div> */}
        <div className='flex items-center gap-2'>
            <Calendar size={16} className='text-gray-500 text-sm' />
            <span className='text-sm text-gray-500'>{new Date(videoDetails.publishedAt).toLocaleDateString('en-IN')}</span>
        </div>
    </div>
    </div>
   
</div>
</div>
    </Link>
    <div title='More' onClick={(e) => e.stopPropagation()} className='flex p-2 items-center gap-2'>
        <EllipsisVertical className='text-gray-500 cursor-pointer hover:text-white duration-150' />
    </div>
    </div>
  )
}

export default VideoListCard
