import React, { useState } from 'react'
import { IUserNote, IVideoDetails } from '@/types'
import { Checkbox } from '../ui/checkbox'
import { secondsToTime } from '@/lib/utils';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { motion } from 'framer-motion'
import Editor from '../Editor';
function NotesListCard({note, videoDetails, index}: {note: IUserNote, videoDetails: IVideoDetails, index: number}) {
    const [todoCompleted, setTodoCompleted] = useState(note.todoCompleted);
  return (
    <>
    {note.category === "key point" && <motion.div initial={{opacity: 0, y: 100, scale: 0.6}} animate={{opacity: 1, y: 0, scale: 1}} transition={{delay: index * 0.1, duration: 0.3}} onClick={() => console.log("clicked")} key={note.text} className='flex flex-col gap-2 p-2 rounded-lg bg-muted dark:hover:bg-slate-900 duration-150 hover:scale-[1.01] cursor-pointer'>
    {/* <li className='text-sm text-muted-foreground mt-2'> */}
        <Editor loadText={note.text} />
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
</motion.div>}
{note.category === "todo" && <motion.div initial={{opacity: 0, y: 100, scale: 0.6}} animate={{opacity: 1, y: 0, scale: 1}} transition={{delay: index * 0.1, duration: 0.3}} onClick={() => console.log("clicked")} key={note.text} className='flex flex-col gap-2 p-2 rounded-lg bg-muted dark:hover:bg-slate-900 duration-150 hover:scale-[1.01] cursor-pointer'>
    <div className='text-sm flex items-center gap-2 text-muted-foreground mt-2'>
        <Checkbox checked={todoCompleted} onCheckedChange={() => setTodoCompleted(!todoCompleted)} onClick={(e) => e.stopPropagation()} className='w-4 h-4 dark:border-gray-500' /> <span className={`${todoCompleted ? "line-through" : ""}`}>{note.text}</span>
    </div>
</motion.div>}
{note.category === "question" && <motion.div initial={{opacity: 0, y: 100, scale: 0.6}} animate={{opacity: 1, y: 0, scale: 1}} transition={{delay: index * 0.1, duration: 0.3}} onClick={() => console.log("clicked")} key={note.text} className='flex flex-col gap-2 p-2 rounded-lg bg-muted dark:hover:bg-slate-900 duration-150 hover:scale-[1.01] cursor-pointer'>
    <div className='text-sm font-bold text-center'>{note.category}</div>
    <div className='text-sm text-muted-foreground mt-2'>{note.text}</div>
</motion.div>}
    </>
  )
}

export default NotesListCard
