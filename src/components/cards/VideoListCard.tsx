import { IVideoDetails } from '@/types'
import { Calendar, Clock, EllipsisVertical } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { secondsToTime } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import UpdateVideo from '../dialogs/UpdateVideo'
import DeleteVideo from '../dialogs/DeleteVideo'
function VideoListCard({videoDetails, type, index, videoList, setVideoList}: {videoDetails: IVideoDetails, type: string, index: number, videoList: IVideoDetails[], setVideoList: (videoList: IVideoDetails[]) => void}) {
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [animationClass, setAnimationClass] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const updateStatusAnimation = () => {
        if (videoDetails.status) {
            setAnimationClass('animate-pulse');
            const timer = setTimeout(() => {
              setAnimationClass('');
            }, 5000);
            return () => clearTimeout(timer);
          }
    }
        
      
  return (
    <motion.div initial={{opacity: 0, y: 100, scale: 0.6, filter:"blur(10px)"}} animate={{opacity: 1, y: 0, scale: 1, filter:"blur(0px)"}} transition={{delay: index * 0.1, duration: 0.3}} exit={{ opacity: 0, y: 100, scale: 0.6, filter: "blur(10px)" }}
    className={`flex ${isDeleting ? 'animate-fade-out' : ''}`} >

    <Link href={type === "standalone" ? `/videos/${videoDetails.libraryId}` : `/playlists/video/${videoDetails.libraryId}`} className='w-full'>
<div className='flex hover:bg-muted duration-150 rounded-md p-4 h-[150px] gap-4 w-full border-b border-muted'>

<div className='flex justify-between w-full gap-4 '>
    <div className='flex gap-4'>
    <div className='min-w-[200px] h-full object-cover'>

    <Image src={videoDetails.thumbnailUrl} alt='logo' width={100} height={100} className='w-[200px] h-full object-cover' />
    </div>
    <div className='flex flex-col items-start gap-2'>
        <h1 className='text-md md:text-xl lg:text-2xl font-bold'>{videoDetails.title.slice(0, 30)+ (videoDetails.title.length > 30 ? '...' : '')}</h1>
        <div className='flex lg:flex-col flex-row items-center lg:items-start gap-4 lg:gap-1'>

        <div className='flex items-center gap-2'>
            <Calendar size={16} className='text-gray-500 text-sm' />
            <span className='text-sm text-gray-500'>{new Date(videoDetails.publishedAt).toLocaleDateString('en-IN')}</span>
        </div>
        <div className='flex items-center gap-2'>
            <Clock size={16} className='text-gray-500 text-sm' />
            <span className='text-sm text-gray-500'>{secondsToTime(Number(videoDetails.duration))}</span>
        </div>
    <Badge className={animationClass} variant={"secondary"}>{videoDetails.status}</Badge>
        </div>
        
    </div>
    </div>
   
</div>
</div>
    </Link>
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
    <div title='More' onClick={(e) => e.stopPropagation()} className='flex p-2 h-fit my-auto items-center gap-2'>
        <EllipsisVertical className='text-gray-500 cursor-pointer hover:text-white duration-150' />
    </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className=''>
        <DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}> Update watch status </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}> Delete </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
    {updateDialogOpen && <UpdateVideo open={updateDialogOpen} setOpen={setUpdateDialogOpen} video={videoDetails} updateStatusAnimation={updateStatusAnimation} />}
    {deleteDialogOpen && <DeleteVideo open={deleteDialogOpen} setIsDeleting={setIsDeleting} setOpen={setDeleteDialogOpen} videoDetails={videoDetails} setVideoList={setVideoList} videoList={videoList} />}
    </motion.div>
  )
}

export default VideoListCard
