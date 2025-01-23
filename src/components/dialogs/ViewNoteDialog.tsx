import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '../ui/dialog'
import Editor from '../TipTap';
import { IUserNote, IVideoDetails } from '@/types';
import { secondsToTime } from '@/lib/utils';
import { Button } from '../ui/button';
import { useRouter } from 'nextjs-toploader/app';
import YoutubePlayerDialog from '../dialogs/YoutubePlayerDialog';
import { TooltipTrigger, TooltipProvider,  TooltipContent, Tooltip } from '../ui/tooltip';

function ViewNoteDialog({
    open,
    setOpen,
    note,
    videoDetails
}:{
    open: boolean,
    setOpen: (open: boolean) => void,
    note: IUserNote,
    videoDetails: IVideoDetails
}) {
    const [youtubePlayerOpen, setYoutubePlayerOpen] = useState(false);
    const [youtubeURL, setYoutubeURL] = useState('');

    const handlePlayerOpen = (youtubeURL?:string)=>{
        setYoutubeURL(youtubeURL || '');
        setYoutubePlayerOpen(true);
      }
const router = useRouter();
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {note.title}
                </DialogTitle>
            </DialogHeader>
            <Editor className='max-h-[60vh]' text={note.text} isEditable={false} />
            {note.timestamp && <TooltipProvider >
    <Tooltip >
    <TooltipTrigger className='cursor-pointer inline w-fit mt-auto' asChild>

    <div onClick={(e) =>{ 
      e.stopPropagation()
      handlePlayerOpen(`https://www.youtube.com/watch?v=${videoDetails.youtubeId}&t=${note.timestamp}s`);  
    }} className='text-sm text-white mt-2 bg-blue-500 rounded-md p-1 w-fit'>{secondsToTime(note.timestamp)}</div>
    </TooltipTrigger>
    <TooltipContent className='z-[1000000]'>
        <p>Go to video at {secondsToTime(note.timestamp)}</p>
    </TooltipContent>
    </Tooltip>
    </TooltipProvider>}
        <DialogFooter>
            <Button onClick={()=>{
                router.push(`/note/${note._id}`);
            }}>Edit</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    {youtubePlayerOpen && <YoutubePlayerDialog videoURL={youtubeURL} open={youtubePlayerOpen} setOpen={setYoutubePlayerOpen}/>}

            </>
  )
}

export default ViewNoteDialog
