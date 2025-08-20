import { IPlaylist } from '@/types'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { api } from '@/config/config'
import toast from 'react-hot-toast'
function UpdatePlaylist({ open, setOpen, playlistDetails, setPlaylistList, playlistList }: { open: boolean, setOpen: (open: boolean) => void, playlistDetails: IPlaylist, setPlaylistList: (playlistList: IPlaylist[]) => void, playlistList: IPlaylist[] }) {
    const [name, setName] = useState(playlistDetails.name || '');
    const [description, setDescription] = useState(playlistDetails.description || '');
    const [updatingPlaylist, setUpdatingPlaylist] = useState(false);
    const [updateDisabled, setUpdateDisabled] = useState(false);

    if (name.length > 0 && (name !== playlistDetails.name || description !== playlistDetails.description)) setUpdateDisabled(false);
    else setUpdateDisabled(true);

    const updateClick = async () => {
        setUpdatingPlaylist(true);
        api.patch('/playlist', { id: playlistDetails._id, name, description })
            .then(() => {
                setPlaylistList(playlistList.map((playlist) => playlist._id === playlistDetails._id ? { ...playlist, name, description } : playlist));
            })
            .catch((err) => toast.error(err.response.data.message || "Something went wrong, please try again later."))
            .finally(() => {
                setUpdatingPlaylist(false);
                setOpen(false);
            });
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Update Playlist
                    </DialogTitle>
                    <DialogDescription>
                        Enter a new name for the playlist
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor='name'>Name</Label>
                <Input type='text' id='name' placeholder='Playlist Name' value={name} onChange={(e) => setName(e.target.value)} />
                <Label htmlFor='description'>Description</Label>
                <Input type='text' id='description' placeholder='Playlist Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={updateDisabled || updatingPlaylist} onClick={updateClick}>{updatingPlaylist ? 'Updating...' : 'Update'}</Button>
            </DialogContent>
        </Dialog>
    )
}

export default UpdatePlaylist
