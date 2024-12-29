import { IVideoDetails } from '@/types'
import React, { useState } from 'react'
import { Dialog,DialogHeader,DialogTitle,DialogDescription, DialogContent } from '../ui/dialog';
import { Select, SelectContent,SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { api } from '@/config/config';
function UpdateVideo({video, open, setOpen, updateStatusAnimation}: {open: boolean, setOpen: (open: boolean) => void, video:IVideoDetails,  updateStatusAnimation:()=>void}) {
    const [status, setStatus] = useState(video.status);
    const handleUpdateClick = async () => {
        api.patch('/library/videos', {id: video.libraryId, status}).then(() =>{ video.status = status; updateStatusAnimation()}).catch((err) => console.log(err)).finally(() => setOpen(false));
        
    }
  return (
   <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
     <DialogHeader>

       <DialogTitle>
          Update Video Status
        </DialogTitle>
        <DialogDescription>
          Update watch status for {video.title.length > 30 ? video.title.slice(0, 30) + '...' : video.title}
        </DialogDescription>
     </DialogHeader>
        <Select value={status} onValueChange={(value) => setStatus(value as "watched" | "to_watch" | "in_progress")}>
            <SelectTrigger>
                <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Video Status</SelectLabel>
                    <SelectItem value="to_watch">To Watch</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="watched">Completed</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        <Button onClick={handleUpdateClick}>Update</Button>
        </DialogContent>
    </Dialog>
  )
}

export default UpdateVideo
