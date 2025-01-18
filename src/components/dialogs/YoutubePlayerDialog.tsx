import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '../ui/button'
import YoutubePlayer from '../YoutubePlayer'
import { IVideoDetails } from '@/types'
function YoutubePlayerDialog({open, setOpen, videoDetails, videoURL}:{open: boolean, setOpen: (open: boolean) => void, videoDetails?:IVideoDetails, videoURL?:string}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-[90vw] 2xl:w-[1350px] 2xl:h-[900px] w-[550px] h-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {videoDetails ?videoDetails?.title?.length > 30 ? videoDetails?.title.slice(0, 30) + '...' : videoDetails?.title : "Youtube Video"}
          </DialogTitle>
        </DialogHeader>
        <YoutubePlayer videoURL={videoURL || `https://www.youtube.com/watch?v=${videoDetails?.youtubeId}`} />
        <div className='flex items-center justify-end gap-3 mt-3'>
            <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default YoutubePlayerDialog
