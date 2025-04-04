import { IPlaylist, IVideoDetails } from '@/types'
import { Calendar, Clock, EllipsisVertical, ListVideo } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { secondsToTime } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import UpdateVideo from '../dialogs/UpdateVideo'
import DeleteVideo from '../dialogs/DeleteVideo'
import MoveToPlaylist from '../dialogs/MoveToPlaylist'
import { useRouter } from 'nextjs-toploader/app';
function VideoListCard({videoDetails, type, index, videoList, setVideoList, playlistId, isSelected, selectMode, playlistDetails}: {videoDetails: IVideoDetails, type: string, index: number, videoList: IVideoDetails[], setVideoList: (videoList: IVideoDetails[]) => void, playlistId?: string, isSelected?: boolean, selectMode?: boolean, playlistDetails?:IPlaylist}) {
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [animationClass, setAnimationClass] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const router = useRouter();
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
    className={`flex w-full ${isDeleting ? 'animate-fade-out' : ''} ${isSelected ? 'bg-muted' : ''}`} >

    <div onClick={()=>router.push(selectMode ? '#' : type === "standalone" ? `/videos/${videoDetails.libraryId}` : `/playlists/video/${videoDetails.libraryId}`)} className='w-full cursor-pointer'>
<div className='flex hover:bg-muted duration-150 rounded-md p-4 h-[150px] gap-4 w-full border-b border-muted'>

<div className='flex justify-between w-full gap-4 '>
    <div className='flex gap-4'>
    <div className='min-w-[200px] h-full object-cover'>

    <Image src={videoDetails.thumbnailUrl} alt='logo' width={200} height={200} className='w-[200px] h-full object-cover' />
    </div>
    <div className='flex flex-col items-start gap-2'>
        <h1 title={videoDetails.title} className='text-md md:text-xl lg:text-2xl font-bold line-clamp-1'>{videoDetails.title}</h1>
        <div className='flex lg:flex-col flex-row items-center lg:items-start gap-4 lg:gap-1'>

        <div className='flex items-center gap-2'>
            <Calendar size={16} className='text-gray-500 text-sm' />
            <span className='text-sm text-gray-500'>{new Date(videoDetails.publishedAt).toLocaleDateString('en-IN')}</span>
            
        </div>
        <div className='flex items-center gap-2'>
            <Clock size={16} className='text-gray-500 text-sm' />
            <span className='text-sm text-gray-500'>{secondsToTime(Number(videoDetails.duration))}</span>
        </div>
        <div className='flex items-center gap-2'>
            <Badge className={animationClass} variant={"secondary"}>{videoDetails.status}</Badge>
            {playlistDetails && <Badge onClick={(e) =>{
                e.stopPropagation(); 
                router.push(`/playlists/${playlistDetails._id}`)}} 
                variant={"secondary"}  className='flex gap-1'><ListVideo size={20}/>{playlistDetails.name}</Badge>}
        </div>
        </div>
        
    </div>
    </div>
   
</div>
</div>
    </div>
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
    <div title='More' onClick={(e) => e.stopPropagation()} className='flex p-2 h-fit my-auto items-center gap-2'>
        <EllipsisVertical className='text-gray-500 cursor-pointer hover:text-white duration-150' />
    </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className=''>
        <DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}> Update watch status </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMoveDialogOpen(true)}> Move to Playlist </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}> Delete </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
    {updateDialogOpen && <UpdateVideo open={updateDialogOpen} setOpen={setUpdateDialogOpen} video={videoDetails} updateStatusAnimation={updateStatusAnimation} />}
    {deleteDialogOpen && <DeleteVideo open={deleteDialogOpen} setIsDeleting={setIsDeleting} setOpen={setDeleteDialogOpen} videoDetails={videoDetails} setVideoList={setVideoList} videoList={videoList} />}
    {moveDialogOpen && <MoveToPlaylist open={moveDialogOpen} setOpen={setMoveDialogOpen} videoDetails={videoDetails} videoList={videoList} setVideoList={setVideoList} setIsDeleting={setIsDeleting} currentPlaylist={playlistId}/>}
    </motion.div>
  )
}

export default VideoListCard
