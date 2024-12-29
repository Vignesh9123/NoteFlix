import React from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose} from '../ui/dialog'
import { IVideoDetails } from '@/types'
import { Button } from '../ui/button'
import { api } from '@/config/config'
function DeleteVideo({open, setOpen, videoDetails, setVideoList, videoList, setIsDeleting}: {open: boolean, setOpen: (open: boolean) => void, videoDetails: IVideoDetails, setVideoList: (videoList: IVideoDetails[]) => void, videoList: IVideoDetails[], setIsDeleting: (isDeleting: boolean) => void}) {
    const handleDeleteVideo = async () => {
        setIsDeleting(true);
        setTimeout(async () => {
            try {
                await api.delete('/library/videos', {data: {id: videoDetails.libraryId}});
                setVideoList(videoList.filter((video) => video.libraryId !== videoDetails.libraryId));
            } catch (err) {
                console.log(err);
            } finally {
                setOpen(false);
                setIsDeleting(false);
            }
        }, 1000);
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Delete Video
                </DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this video? This action cannot be undone
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button>
                        Cancel
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button onClick={handleDeleteVideo}>
                        Delete
                    </Button>
                    
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteVideo
