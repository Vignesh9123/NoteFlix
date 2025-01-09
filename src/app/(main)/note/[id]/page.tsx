'use client'
import Editor from "@/components/TipTap";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/config/config'
import { ILibrary, IUserNote, IVideoDetails } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import  Link  from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { secondsToTime, timeToSeconds } from "@/lib/utils";
import { useRouter } from 'nextjs-toploader/app';
function NoteTestPage() {
  const [text, setText] = useState('')
  const [note, setNote] = useState<IUserNote | null>(null)
  const [library, setLibrary] = useState<ILibrary | null>(null)
  const [video, setVideo] = useState<IVideoDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const [updateDisabled, setUpdateDisabled] = useState(true)
  const { id } = useParams()

  const router = useRouter()

  const getNote = async () => {
    try {
        const response = await api.get(`/library/notes/getbyid?id=${id}`);
        setNote(response.data.data.note);
        setText(response.data.data.note.text);
        setTitle(response.data.data.note.title);
        setTimestamp(secondsToTime(response.data.data.note.timestamp));
        setLibrary(response.data.data.library);
        setVideo(response.data.data.library.videoDetails);
    } catch (error) {
        console.log(error);
    }    
  }

  useEffect(() => {
    getNote()
  }, [])

  const updateClick = async () => {
    try {
        await api.put('/video/notes', {noteId: note?._id, notes: {text, title, timestamp: timeToSeconds(timestamp)}});
        getNote();
    } catch (error) {
        console.log(error);
    }    
  }

  

  useEffect(() => {
    if(text !== note?.text || title !== note?.title || timestamp !== secondsToTime(note?.timestamp)){
      setUpdateDisabled(false)
    }
    else{
      setUpdateDisabled(true)
    }
  }, [text, title, timestamp])


  return (
    <>
    {text && <div className="m-5">
      <div className='w-full h-[20vh] relative'>
        {loading && <div className='w-full h-full flex justify-center items-center animate-pulse bg-muted'></div> }
        {!loading && video?.thumbnailUrl && <Image src={!loading && video?.thumbnailUrl } alt='thumbnail' width={1920} height={1080} quality={100} className='w-full h-full object-cover rounded-lg' style={{ filter: "brightness(0.2) contrast(1.1) blur(2px)" }} />}
        <div className='absolute top-0 left-0 w-full h-full flex flex-col gap-4 justify-center items-center'>
          <div className='text-2xl font-bold hover:underline line-clamp-1 text-center'>
            <Link href={`https://www.youtube.com/watch?v=${video?.youtubeId}`} target='_blank'>
              {video?.title}
            </Link>
          </div>
          <div className='text-sm text-muted-foreground'>
            {video?.channelName}
          </div>
        </div>
      </div>
        <div className="my-5">
          <Label>Timestamp</Label>
          <Input value={timestamp} onChange={(e) => setTimestamp(e.target.value)}  />
        </div>
        <div className="my-5">
        <Label>Title</Label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} style={{fontSize: "2rem", height: "4rem"}} className="font-bold text-5xl" />
        </div>
        <div>
      <Label>Text</Label>
      <div className="h-[260px]">

      <Editor text={text} setText={setText} isEditable={true}/>
      </div>
        </div>
        <div className="flex justify-between px-10">

        <Button disabled={updateDisabled} onClick={updateClick}>Save</Button>
        </div>
    </div>}
    </>
  )
}

export default NoteTestPage
