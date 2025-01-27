import { IPlaylist, IVideoDetails } from '@/types'
import {useState, useEffect} from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { api } from '@/config/config'
import { Label } from '@radix-ui/react-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
function MoveToPlaylist({open, setOpen, videoDetails,videoList, setVideoList, setIsDeleting, currentPlaylist, bulk, bulkVideos}: {open: boolean, setOpen: (open: boolean) => void, videoDetails?: IVideoDetails, videoList?: IVideoDetails[], setVideoList?: (videoList: IVideoDetails[]) => void, setIsDeleting?: (isDeleting: boolean) => void, currentPlaylist?: string, bulk?: boolean, bulkVideos?: IVideoDetails[]}) {
    const [playlists, setPlaylists] = useState<IPlaylist[]>([])
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
    const [playlistLoading, setPlaylistLoading] = useState(false);
    useEffect(() => {
        setPlaylistLoading(true);
        api.get('/library/playlists').then((res) => {
            const playlists = res.data.data;
            if(currentPlaylist){
                setPlaylists(playlists.filter((playlist: IPlaylist) => playlist._id !== currentPlaylist).sort((a: IPlaylist, b: IPlaylist) => a.name.localeCompare(b.name)));
            } else {
                setPlaylists(playlists.sort((a: IPlaylist, b: IPlaylist) => a.name.localeCompare(b.name)));
            }
        })
        .catch((err) => toast.error(err.response.data.message || "Something went wrong, please try again later."))
        .finally(() => {
            setPlaylistLoading(false);
        })
        return () => {
            setPlaylists([]);
        }
    }, [])
    const handleMoveClick = async () => {
        setIsDeleting?.(true);
        setTimeout(async () => {
            try {
                if(bulk){
                    await api.post('/library/videos/bulk/movetoplaylist', {libraryIds: bulkVideos!.map((video) => video.libraryId), playlistId: selectedPlaylist!});
                    if(videoList && setVideoList)
                        setVideoList(videoList.filter((video) => !bulkVideos!.map((video) => video.libraryId).includes(video.libraryId)));

                }
                else {
                    await api.post('/library/videos/movetoplaylist', {libraryId: videoDetails?.libraryId, playlistId: selectedPlaylist!});
                    if(videoList && setVideoList)
                        setVideoList(videoList.filter((video) => video.libraryId !== videoDetails?.libraryId));
                }
            } catch (err) {
                if(err instanceof AxiosError){
                    toast.error(err.response?.data.message || "Something went wrong, please try again later.");
                }
                else {
                    toast.error("Something went wrong, please try again later.");
                }
            } finally {
                setOpen(false);
                setIsDeleting?.(false);
            }
        }, 1000);
    }
    
  return (
    (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Move to Playlist
                </DialogTitle>
                <DialogDescription>
                    Move the video to a playlist
                </DialogDescription>
            </DialogHeader>
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
                <DialogFooter>
                    <Button onClick={handleMoveClick}>Move</Button>
                    <Button variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
                </DialogFooter>
                </DialogContent>
                    
    </Dialog>
    )
)
}
export default MoveToPlaylist
