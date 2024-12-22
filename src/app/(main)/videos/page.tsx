'use client'
import React, { useState, useEffect } from 'react'
import VideoListCard from '@/components/cards/VideoListCard'
import { Input } from '@/components/ui/input'
import { Grid2X2, ListVideo, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/config/config'
import { IVideoDetails } from '@/types'
import AddVideo from '@/components/dialogs/AddVideoUsingYTDetails'
function VideosPage() {
  const [open, setOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoDetails, setVideoDetails] = useState<IVideoDetails | null>(null)
  const [videoList, setVideoList] = useState<IVideoDetails[]>([])
  const [openAddVideoDialog, setOpenAddVideoDialog] = useState(false)
  const handleGetVideoDetails = async () => {
    try {
      setLoading(true)
      const videoId = youtubeUrl.split('v=')[1] || youtubeUrl.split('youtu.be/')[1]
      if(!videoId) return
  
      const response = await api.post(`/youtube/getvideodetails`, { videoId })
      setVideoDetails(response.data.data)
      console.log(response.data.data)
      setOpen(false)
      setYoutubeUrl('')
      setOpenAddVideoDialog(true)
    } catch (error) {
      console.log(error)
      setOpenAddVideoDialog(false)
    }
    finally {
      setLoading(false)
    }
  }
  const fetchVideos = async () => {
    try {
      const response = await api.get('/library/videos')
      const responseData = response.data.data
      const videos = responseData.map((data: any) => ({
        ...data.videoDetails,
      }))
      setVideoList(videos)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
  
    fetchVideos()
  }, [])

  return (
    <div className='m-5'>
        <div className='flex w-full justify-between items-center mb-5'>
            <div className='flex m-1 items-center gap-2'>
                    <ListVideo size={27} className='text-gray-500 cursor-pointer bg-muted duration-150' />
                    <Grid2X2 size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
            </div>
            <Input placeholder='Search' />
            <div className=' mx-2'>
              <Dialog open={open} onOpenChange={setOpen}>

              <DialogTrigger className='bg-primary p-2 rounded-full'>
                  <Plus size={20} />
                
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Video From YouTube</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder='Enter YouTube Video URL' />
                </DialogDescription>
                <DialogFooter>
                  <Button onClick={handleGetVideoDetails}>{loading ?<div className='flex items-center gap-2'><Loader2 size={20} className='animate-spin' /></div>: 'Proceed'}</Button>
                </DialogFooter>
              </DialogContent>
              </Dialog>
             {videoDetails && <AddVideo open={openAddVideoDialog} setOpen={setOpenAddVideoDialog} videoDetails={videoDetails} setVideoDetails={setVideoDetails} videoList={videoList} setVideoList={setVideoList}  />}
            </div>
            
        </div>
        <div className='flex flex-col gap-4'>
          {videoList.map((video) => (
            <VideoListCard key={video.youtubeId} videoDetails={video} />
          ))}
        </div>
    </div>
  )
}

export default VideosPage
