import React, { useState } from 'react'
import { IUserNote, IVideoDetails } from '@/types'
import { Checkbox } from '../ui/checkbox'
import { secondsToTime } from '@/lib/utils';
import Link from 'next/link';
function NotesListCard({note, videoDetails}: {note: IUserNote, videoDetails: IVideoDetails}) {
    const [todoCompleted, setTodoCompleted] = useState(note.todoCompleted);
  return (
    <>
    {note.category === "key point" && <div onClick={() => console.log("clicked")} key={note.text} className='flex flex-col gap-2 p-2 rounded-lg bg-muted dark:hover:bg-slate-900 duration-150 hover:scale-[1.01] cursor-pointer'>
    <li className='text-sm text-muted-foreground mt-2'>{note.text}</li>
    <Link href={`https://www.youtube.com/watch?v=${videoDetails.youtubeId}&t=${note.timestamp}s`} target='_blank' onClick={(e) => e.stopPropagation()} className='text-sm text-white mt-2 bg-blue-500 rounded-md p-1 w-fit'>{secondsToTime(note.timestamp)}</Link>
</div>}
{note.category === "todo" && <div key={note.text} className='flex flex-col gap-2 p-2 rounded-lg bg-muted'>
    <div className='text-sm flex items-center gap-2 text-muted-foreground mt-2'>
        <Checkbox checked={todoCompleted} onCheckedChange={() => setTodoCompleted(!todoCompleted)} className='w-4 h-4 dark:border-gray-500' /> <span className={`${todoCompleted ? "line-through" : ""}`}>{note.text}</span>
    </div>
</div>}
{note.category === "question" && <div key={note.text} className='flex flex-col gap-2 p-2 rounded-lg bg-muted dark:hover:bg-slate-900 duration-150 hover:scale-[1.01] cursor-pointer'>
    <div className='text-sm font-bold text-center'>{note.category}</div>
    <div className='text-sm text-muted-foreground mt-2'>{note.text}</div>
</div>}
    </>
  )
}

export default NotesListCard
