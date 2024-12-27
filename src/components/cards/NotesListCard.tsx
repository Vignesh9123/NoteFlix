import React, { useState } from 'react'
import { IUserNote, IVideoDetails } from '@/types'
import { Checkbox } from '../ui/checkbox'
import { secondsToTime } from '@/lib/utils';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { motion } from 'framer-motion'
import Editor from '../TipTap';
function NotesListCard({note, videoDetails, index}: {note: IUserNote, videoDetails: IVideoDetails, index: number}) {
  return (
    <>
   <motion.div initial={{opacity: 0, y: 100, scale: 0.6}} animate={{opacity: 1, y: 0, scale: 1}} transition={{delay: index * 0.1, duration: 0.3}} onClick={() => console.log("clicked")} key={note.text} className='flex flex-col gap-2 p-2 rounded-lg bg-muted dark:hover:bg-slate-900 duration-150 hover:scale-[1.01] cursor-pointer'>
    <div className='text-md md:text-xl lg:text-2xl font-bold'>{note.title}</div>
    {/* <li className='text-sm text-muted-foreground mt-2'> */}
        <Editor text={note.text} isEditable={false} />
    {/* </li> */}
   {note.timestamp && <TooltipProvider >
    <Tooltip >
    <TooltipTrigger className='cursor-pointer inline w-fit'>

    <Link href={`https://www.youtube.com/watch?v=${videoDetails.youtubeId}&t=${note.timestamp}s`} target='_blank' onClick={(e) => e.stopPropagation()} className='text-sm text-white mt-2 bg-blue-500 rounded-md p-1 w-fit'>{secondsToTime(note.timestamp)}</Link>
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
