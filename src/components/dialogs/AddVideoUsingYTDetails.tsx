'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { IVideoDetails } from '@/types'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Image from 'next/image'
import { api } from '@/config/config'
import { Loader2 } from 'lucide-react'
function AddVideo({open, setOpen, videoDetails, setVideoDetails, setVideoList, videoList}: {open: boolean, setOpen: (open: boolean) => void, videoDetails: IVideoDetails, setVideoDetails: (videoDetails: IVideoDetails|null) => void, setVideoList: (videoList: IVideoDetails[]) => void, videoList: IVideoDetails[]}) {
    const [title, setTitle] = useState(videoDetails.title || '');
    const [duration, setDuration] = useState(videoDetails.duration || '');
    const [channelName, setChannelName] = useState(videoDetails.channelName || '');
    const [publishedAt, setPublishedAt] = useState(videoDetails.publishedAt || '');
    const [addingVideo, setAddingVideo] = useState(false);
    const handleAddVideo = async () => {
        setAddingVideo(true);
       try {
         const data = {
             youtubeId: videoDetails.youtubeId,
             title: title,
             channelName: channelName,
             thumbnailUrl: videoDetails.thumbnailUrl,
             duration: duration,
             publishedAt: publishedAt,
             isStandalone: true
         }
         const response = await api.post('/video/addvideo', data);
         console.log("response", response)
         if(videoList ){
            setVideoList([...videoList, videoDetails]);
         }
         setOpen(false);
        } catch (error) {
            console.log("error", error)
        }
        finally {
           setVideoDetails(null);
        setAddingVideo(false);
       }
    }
  return (
    videoDetails && (<Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Video</DialogTitle>
          <DialogDescription>Add a video to your library</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 max-h-[400px] overflow-y-auto p-1'>
            <div className='flex flex-col gap-2 justify-center items-center'>
                <div className='text-center'>Thumbnail</div>
                <Image src={videoDetails.thumbnailUrl} alt={videoDetails.title} width={300} height={300} />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                <Label>Duration</Label>
                <Input value={videoDetails.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm ').replace('S', 's ')} readOnly />
                <Label>Channel Name</Label>
                <Input value={channelName} readOnly />
                <Label>Published At</Label>
                <Input value={new Date(publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} readOnly />
            </div>
        </div>
        <div className='flex justify-end gap-2'>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleAddVideo} disabled={addingVideo}>{addingVideo ? <div className='flex justify-center items-center'><Loader2 className='animate-spin' /></div> : 'Add'}</Button>
        </div>
      </DialogContent>
    </Dialog>)
  )
}

export default AddVideo
