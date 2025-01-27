'use client'
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { IPlaylist, IVideoDetails } from '@/types'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Image from 'next/image'
import { api } from '@/config/config'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { convertHtmlTextToPlainText, secondsToTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
function AddVideo({open, setOpen, videoDetails, setVideoDetails, setVideoList, videoList, setOtherDialogOpen}: {open: boolean, setOpen: (open: boolean) => void, videoDetails: IVideoDetails, setVideoDetails: (videoDetails: IVideoDetails|null) => void, setVideoList: (videoList: IVideoDetails[]) => void, videoList: IVideoDetails[], setOtherDialogOpen?: (open: boolean) => void}) {
    const [addingVideo, setAddingVideo] = useState(false);
    const [playlists, setPlaylists] = useState<IPlaylist[]>([])
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
    const [playlistLoading, setPlaylistLoading] = useState(false);
    useEffect(() => {
        setPlaylistLoading(true);
        api.get('/library/playlists').then((res) => {
            setPlaylists(res.data.data)
        })
        .catch((err) => {
            toast.error(err.response.data.message || "Something went wrong, please try again later.");
        })
        .finally(() => {
            setPlaylistLoading(false);
        })
        return () => {
            setPlaylists([]);
        }
    }, [])
    const handleAddVideo = async () => {
        setAddingVideo(true);
       try {
         const data = {
             youtubeId: videoDetails.youtubeId,
             title: convertHtmlTextToPlainText(videoDetails.title),
             channelName: videoDetails.channelName,
             thumbnailUrl: videoDetails.thumbnailUrl,
             duration: videoDetails.duration,
             publishedAt: videoDetails.publishedAt,
             isStandalone: selectedPlaylist ? false : true,
             playlistId: selectedPlaylist ? selectedPlaylist : null
         }
         const response = await api.post('/video/addvideo', data);
         const newVideo:IVideoDetails = {
            _id: response.data.data.videoId,
            title: videoDetails.title,
            duration: Number(String(videoDetails.duration).match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)?.slice(1).reduce((acc: number, v: string, i: number) => acc + (v ? parseInt(v) * [3600, 60, 1][i] : 0), 0)),
            channelName: videoDetails.channelName,
            thumbnailUrl: videoDetails.thumbnailUrl,
            publishedAt: videoDetails.publishedAt,
            youtubeId: videoDetails.youtubeId,
            summary: '',
            libraryId: response.data.data._id,
            status: response.data.data.status,
            isStandalone: response.data.data.type === 'standalone' ? true : false,
            isStarred: false,
            playlistId: response.data.data.playlistId || null
         }
         if(videoList && newVideo.isStandalone ){
            setVideoList([...videoList, newVideo]);
            toast.success("Video added successfully");
         }
         setOtherDialogOpen && setOtherDialogOpen(false)
         setOpen(false);
        } catch (error) {
            if(error instanceof AxiosError) {
                toast.error(error.response?.data.error || "Something went wrong, please try again later");
            }
            else {
                toast.error("Something went wrong, please try again later");
            }
        }
        finally {
           setVideoDetails(null);
            setAddingVideo(false);
       }
    }

  return (
    videoDetails && (<Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-h-[95vh]'>
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
                <Input value={convertHtmlTextToPlainText(videoDetails.title)} readOnly />
                <Label>Duration</Label>
                <Input value={typeof videoDetails.duration === 'string' ? videoDetails.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm ').replace('S', 's '): secondsToTime(videoDetails.duration)} readOnly />
                <Label>Channel Name</Label>
                <Input value={videoDetails.channelName} readOnly />
                <Label>Published At</Label>
                <Input value={new Date(videoDetails.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} readOnly />
                <Label>Playlists</Label>
                <Select value={selectedPlaylist!} onValueChange={setSelectedPlaylist}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select a playlist'/>
                    </SelectTrigger>
                    <SelectContent className='z-[1000000]'>
                        {playlistLoading ? <div className='flex justify-center items-center'><Loader2 className='animate-spin' /></div> : playlists.map((playlist) => (
                            <SelectItem key={playlist._id} value={playlist._id}>{playlist.name}</SelectItem>
                        ))}
                        {!playlistLoading && playlists.length === 0 && <div className='flex justify-center items-center'>No playlists found</div>}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className='flex justify-end gap-2'>
        <Button disabled={addingVideo} variant={'outline'} onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleAddVideo} disabled={addingVideo}>{addingVideo ? <div className='flex justify-center items-center'><Loader2 className='animate-spin' /></div> : 'Add'}</Button>
        </div>
      </DialogContent>
    </Dialog>)
  )
}

export default AddVideo
