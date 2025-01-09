import { IPlaylist } from '@/types'
import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog'
import { Button } from '../ui/button'
import { api } from '@/config/config'
import toast from 'react-hot-toast'
function DeletePlaylist({playlistDetails, open, setOpen, playlists, setPlaylists}:{playlistDetails: IPlaylist, open: boolean, setOpen: (open: boolean) => void, playlists: IPlaylist[], setPlaylists: (playlists: IPlaylist[]) => void}) {
    const deleteClick = async () => {
        api.delete('/playlist', {data: {id: playlistDetails._id}})
        .then(() =>{
            setPlaylists(playlists.filter((playlist) => playlist._id.toString() !== playlistDetails._id.toString()));
        })
        .catch((err) => toast.error(err.response.data.message || "Something went wrong, please try again later."))
        .finally(() => setOpen(false));
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Delete {playlistDetails.name} Playlist
                </DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this playlist? This action cannot be undone
                </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={deleteClick}>Delete</Button>
        </DialogContent>
    </Dialog>
  )
}

export default DeletePlaylist
