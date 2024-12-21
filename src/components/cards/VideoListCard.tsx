import { Calendar, EllipsisVertical } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function VideoListCard() {
  return (
    <div>

<div className='flex hover:bg-muted duration-150 rounded-md p-4 h-[150px] gap-4 w-full border-b border-muted'>

<div className='flex justify-between w-full gap-4 '>
    <div className='flex gap-4'>

    <Image src={'/images/playlist.png'} alt='logo' width={100} height={100} className='w-[200px] h-full object-cover' />
    <div className='flex flex-col items-start gap-2'>
        <h1 className='text-2xl font-bold'>Video Name</h1>
        <p className='text-sm text-gray-500'>Video Description</p>
        <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>100k views</span>
            <span className='text-sm text-gray-500'>100k likes</span>
        </div>
        <div className='flex items-center gap-2'>
            <Calendar size={16} className='text-gray-500 text-sm' />
            <span className='text-sm text-gray-500'>1 day ago</span>
        </div>
        </div>
    </div>
    <div title='More' className='flex p-2 items-center gap-2'>
        <EllipsisVertical className='text-gray-500 cursor-pointer hover:text-white duration-150' />
    </div>
</div>
</div>

    </div>
  )
}

export default VideoListCard
