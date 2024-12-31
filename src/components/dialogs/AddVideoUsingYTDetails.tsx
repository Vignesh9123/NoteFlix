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
import { secondsToTime } from '@/lib/utils'
function AddVideo({open, setOpen, videoDetails, setVideoDetails, setVideoList, videoList}: {open: boolean, setOpen: (open: boolean) => void, videoDetails: IVideoDetails, setVideoDetails: (videoDetails: IVideoDetails|null) => void, setVideoList: (videoList: IVideoDetails[]) => void, videoList: IVideoDetails[]}) {
    const [title, setTitle] = useState(videoDetails.title || '');
    const [duration, setDuration] = useState(videoDetails.duration || '');
    const [channelName, setChannelName] = useState(videoDetails.channelName || '');
    const [publishedAt, setPublishedAt] = useState(videoDetails.publishedAt || '');
    const [addingVideo, setAddingVideo] = useState(false);
    const [playlists, setPlaylists] = useState<IPlaylist[]>([])
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
    const [playlistLoading, setPlaylistLoading] = useState(false);
    useEffect(() => {
        setPlaylistLoading(true);
        api.get('/library/playlists').then((res) => {
            console.log("res", res)
            setPlaylists(res.data.data)
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
             title: title,
             channelName: channelName,
             thumbnailUrl: videoDetails.thumbnailUrl,
             duration: duration,
             publishedAt: publishedAt,
             isStandalone: selectedPlaylist ? false : true,
             playlistId: selectedPlaylist ? selectedPlaylist : null
         }
         const response = await api.post('/video/addvideo', data);
         console.log("response", response)
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
            isStandalone: response.data.data.isStandalone
         }
         if(videoList && newVideo.isStandalone ){
            setVideoList([...videoList, newVideo]);
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
                <Input value={title} onChange={(e) => setTitle(e.target.value)}  readOnly />
                <Label>Duration</Label>
                <Input value={typeof videoDetails.duration === 'string' ? videoDetails.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm ').replace('S', 's '): secondsToTime(videoDetails.duration)} readOnly />
                <Label>Channel Name</Label>
                <Input value={channelName} readOnly />
                <Label>Published At</Label>
                <Input value={new Date(publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} readOnly />
                <Label>Playlists</Label>
                <Select value={selectedPlaylist!} onValueChange={setSelectedPlaylist}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select a playlist'/>
                    </SelectTrigger>
                    <SelectContent>
                        {playlistLoading ? <div className='flex justify-center items-center'><Loader2 className='animate-spin' /></div> : playlists.map((playlist) => (
                            <SelectItem key={playlist._id} value={playlist._id}>{playlist.name}</SelectItem>
                        ))}
                        {!playlistLoading && playlists.length === 0 && <div className='flex justify-center items-center'>No playlists found</div>}
                    </SelectContent>
                </Select>
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
