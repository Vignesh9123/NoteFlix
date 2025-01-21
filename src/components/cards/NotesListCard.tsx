import React, { useEffect, useState } from 'react'
import { IUserNote, IVideoDetails } from '@/types'
import { secondsToTime } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { motion } from 'framer-motion'
import Editor from '../TipTap';
import { useRouter } from 'nextjs-toploader/app';
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuItem } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { EllipsisVertical } from 'lucide-react';
import { api } from '@/config/config';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import YoutubePlayerDialog from '../dialogs/YoutubePlayerDialog';
import ViewNoteDialog from '../dialogs/ViewNoteDialog';
function NotesListCard({note, videoDetails, index, noteList, setNoteList}: {note: IUserNote, videoDetails: IVideoDetails, index: number, noteList: IUserNote[], setNoteList: (noteList: IUserNote[]) => void}) {
  const [youtubePlayerOpen, setYoutubePlayerOpen] = useState(false);
  const [youtubeURL, setYoutubeURL] = useState('');
  const [viewOpen, setViewOpen] = useState(false)
  const deleteClick = async () => {
    try {
        await api.delete('/video/notes', {data: {noteId: note?._id}});
        setNoteList(noteList.filter((noteItem) => noteItem._id !== note._id));
    } catch (error) {
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message || "Something went wrong, please try again later.");
      }
      else{
        toast.error("Something went wrong, please try again later.");
      }
    }    
  }

  const handlePlayerOpen = (youtubeURL?:string)=>{
    setYoutubeURL(youtubeURL || '');
    setYoutubePlayerOpen(true);
  }

  const handlePlayerClose = () => {
    setYoutubePlayerOpen(false);
    setYoutubeURL('');
  }

  useEffect(() => {
    if(!youtubePlayerOpen) setYoutubeURL('');
  }, [youtubePlayerOpen])

  const router = useRouter()
  return (
    <>
    {youtubePlayerOpen && <YoutubePlayerDialog videoURL={youtubeURL} open={youtubePlayerOpen} setOpen={setYoutubePlayerOpen}/>}
    {viewOpen && <ViewNoteDialog note={note} open={viewOpen} setOpen={setViewOpen}/>}
   <motion.div initial={{opacity: 0, y: 100, scale: 0.6}} animate={{opacity: 1, y: 0, scale: 1}} transition={{delay: index * 0.1, duration: 0.3}} onClick={() => console.log("clicked")} key={note.text} className='flex flex-col gap-2 p-2 rounded-lg bg-muted dark:hover:bg-slate-900 duration-150 hover:scale-[1.01] cursor-pointer'>
    <div className='flex items-center justify-between'>
    <div className='text-md md:text-xl lg:text-2xl font-bold'>{note.title}</div>
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline"  className='p-3 m-0'> <EllipsisVertical className='text-gray-500 cursor-pointer hover:text-white duration-150' /></Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(`/note/${note._id}`)}>
            <div>Update Note</div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={deleteClick}>
            <div>Delete Note</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
    <div className='md:max-h-[200px] max-h-[150px] xl:max-h-[300px] overflow-auto noteGrid' onClick={()=>setViewOpen(true)}>

        <Editor text={note.text} isEditable={false} />
    </div>
    {/* </li> */}
   {note.timestamp && <TooltipProvider >
    <Tooltip >
    <TooltipTrigger className='cursor-pointer inline w-fit mt-auto'>

    <div onClick={(e) =>{ 
      e.stopPropagation()
      handlePlayerOpen(`https://www.youtube.com/watch?v=${videoDetails.youtubeId}&t=${note.timestamp}s`);  
    }} className='text-sm text-white mt-2 bg-blue-500 rounded-md p-1 w-fit'>{secondsToTime(note.timestamp)}</div>
    </TooltipTrigger>
    <TooltipContent>
        <p>Go to video at {secondsToTime(note.timestamp)}</p>
    </TooltipContent>
    </Tooltip>
    </TooltipProvider>}
</motion.div>

    </>
  )
}

export default NotesListCard
