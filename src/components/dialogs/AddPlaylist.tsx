import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogHeader, DialogDescription, DialogContent, DialogTitle } from '../ui/dialog'
import { Plus } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { api } from '@/config/config'
function AddPlaylist({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const handleCreatePlaylist = async () => {
        setLoading(true)
        api.post('/playlist', { name: playlistName, description: playlistDescription })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err))
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
