import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogHeader, DialogDescription, DialogContent, DialogTitle } from '../ui/dialog'
import { Plus } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { api } from '@/config/config'
import toast from 'react-hot-toast'
import { IPlaylist } from '@/types'
function AddPlaylist({ open, setOpen, setPlaylists }: { open: boolean, setOpen: (open: boolean) => void, setPlaylists:React.Dispatch<React.SetStateAction<IPlaylist[]>> }) {
    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const handleCreatePlaylist = async () => {
        setLoading(true)
        api.post('/playlist', { name: playlistName, description: playlistDescription })
        .then((res) =>{
            setPlaylistName('')
            setPlaylistDescription('') 
            setPlaylists((prev) => [...prev, {...res.data.data, videoCount: 0}])
        })
        .catch((err) => toast.error(err.response.data.message || "Something went wrong, please try again later."))
        .finally(() =>{
            setLoading(false)
            setOpen(false)
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className='bg-primary p-1 rounded-full cursor-pointer'>
                    <Plus />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Playlist
                    </DialogTitle>
                    <DialogDescription>
                        Create a playlist for your videos
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor='playlistName'>Playlist Name</Label>
                <Input placeholder='Playlist name' id='playlistName' className='' onChange={(e) => setPlaylistName(e.target.value)} value={playlistName} />
                <Label htmlFor='playlistDescription'>Playlist Description</Label>
                <Input placeholder='Playlist description' id='playlistDescription' className='' onChange={(e) => setPlaylistDescription(e.target.value)} value={playlistDescription} />
                <Button disabled={loading} onClick={handleCreatePlaylist}>Create</Button>
            </DialogContent>
        </Dialog>
    )
}

export default AddPlaylist
