import { IVideoDetails } from '@/types'
import { Calendar, Clock, EllipsisVertical } from 'lucide-react'
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
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
function VideoGridCard({videoDetails, type, index, videoList, setVideoList, playlistId, isSelected, selectMode}: {videoDetails: IVideoDetails, type: string, index: number, videoList: IVideoDetails[], setVideoList: (videoList: IVideoDetails[]) => void, playlistId?: string, isSelected?: boolean, selectMode?: boolean}) {
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [animationClass, setAnimationClass] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);

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
    <motion.div initial={{opacity: 0, y: 100, scale: 0.6, filter:"blur(10px)"}} animate={{opacity: 1, y: 0, scale: 1, filter:"blur(0px)"}} whileHover={{scale: 1.05, transition: { duration: 0.2 , delay:0}}} transition={{delay: index * 0.1, duration: 0.3}} exit={{ opacity: 0, y: 100, scale: 0.6, filter: "blur(10px)" }}
    className={`flex relative w-full ${isDeleting ? 'animate-fade-out' : ''} ${isSelected ? 'bg-muted' : ''}`} >

    <Link href={selectMode ? '#' : type === "standalone" ? `/videos/${videoDetails.libraryId}` : `/playlists/video/${videoDetails.libraryId}`} className='w-full'>
   
    <Card className={`w-full h-full ${isSelected ? 'bg-muted' : ''}`}>
          <CardHeader className=''>
            <Image src={videoDetails.thumbnailUrl} alt={videoDetails.title} width={200} height={200} className='w-full h-60 object-cover rounded-lg' />
          </CardHeader>
          <CardContent>
          <div className='flex flex-col gap-2'>
            <p title={videoDetails.title} className='text-lg font-semibold line-clamp-1'>{videoDetails.title}</p>
            <p className='text-gray-500 line-clamp-1'>{videoDetails.channelName}</p>
            <p className='text-gray-500 flex gap-2'><Calendar /> {new Date(videoDetails.publishedAt).toLocaleDateString('en-IN')}</p><p className='text-gray-500 flex gap-2'><Clock /> {secondsToTime(Number(videoDetails.duration))}</p>
          </div>
          </CardContent>
          <CardFooter>
            <div className='flex gap-2'>
                <Badge className={animationClass} variant={'secondary'}>{videoDetails.status}</Badge>
            </div>
          </CardFooter>
        </Card>
    </Link>
    <DropdownMenu>
    <DropdownMenuTrigger disabled={isSelected} asChild>
    <div title='More' onClick={(e) => e.stopPropagation()} className={`flex absolute top-4 right-4 ${isSelected ? 'bg-muted-foreground' : 'bg-muted'} rounded-full p-2 h-fit my-auto cursor-pointer items-center gap-2`}>
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

export default VideoGridCard
