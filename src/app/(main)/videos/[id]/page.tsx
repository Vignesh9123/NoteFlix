"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { api } from '@/config/config';
import { ILibrary, IUserNote, IVideoDetails } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Grid2X2, List, Plus, Stars } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NotesListCard from '@/components/cards/NotesListCard';
import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader';
import AddNoteDialog from '@/components/cards/AddNoteDialog';
function VideoPage() {
  const flag: number = 1;
  const { id } = useParams();
  const [video, setVideo] = useState<IVideoDetails | null>(null);
  const [library, setLibrary] = useState<ILibrary | null>(null);
  const [loading, setLoading] = useState(false);
  const [userNotes, setUserNotes] = useState<IUserNote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<IUserNote[]>([]);
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [AILoading, setAILoading] = useState(false);
  const [note, setNote] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(0);
  useEffect(() => {
    setSearchQuery("");
  }, [id])
  useEffect(() => {
    setFilteredNotes(
      userNotes.filter((note) => {
        const matchesSearch = note.text.toLowerCase().includes(searchQuery.toLowerCase()) || note.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    )
  }, [searchQuery])

  const handleAISummaryClick = async () => {
    if (flag == 0) {
      setAILoading(true);
      try {
        await api.post('/youtube/getaudio', { videoId: video?.youtubeId });
        setLoadingIndex(1);
        const res = await api.post('/youtube/gettranscript', { videoId: video?.youtubeId });
        setLoadingIndex(2);
        console.log('Transcript extracted', res);
        const transcript = res.data.data
        const summary = await api.post('/gemini/generatesummary', { transcript, videoId: video?.youtubeId });
        // setLoadingIndex(2);
        setNote(summary.data.data.toString());
        setNoteTitle("Summary of the video");
        setAddNoteDialogOpen(true);
      }
      catch (error) {
        console.log(error)
      }
      finally {
        setAILoading(false);
        setLoadingIndex(0);
      }
    }
    else{
      setAILoading(true);
      try {
        await api.post('/youtube/getaudio', { videoId: video?.youtubeId });
        setLoadingIndex(1);
        const res = await api.post('/gemini/audiosummarizer', { videoId: video?.youtubeId });
        setNote(res.data.data.toString());
        setNoteTitle("Summary of the video");
        setAddNoteDialogOpen(true);
      } catch (error) {
        console.log(error);
      }
      finally {
        setAILoading(false);
        setLoadingIndex(0);
      }
    }
  }
  const fetchNotes = async () => {
    const response = await api.post(`/library/notes`, { id });
    setUserNotes(response.data.data);
    setFilteredNotes(response.data.data);
  }
  useEffect(() => {
    setLoading(true);
    api.post(`/library/videos/getbyid`, { id, type: "standalone" }).then((res) => {
      console.log("res", res.data.data)
      setVideo(res.data.data.videoDetails);
      setLibrary(res.data.data);
      setUserNotes(res.data.data.userNotes);
      setFilteredNotes(res.data.data.userNotes);
    })
      .finally(() => {
        setLoading(false);

      })
  }, [id])
  const loadingStates = [
    {
      text: "Listening to the video",
    },
    {
      text: "Getting the transcript",
    },
    {
      text: "Generating the summary",
    }
  ]
  return (
    <div>
      <Loader loadingStates={loadingStates} duration={60000} loading={AILoading} value={loadingIndex} />

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
      <div className="filterheader m-5">
        <div className='flex justify-between items-center'>
          <div className="flex gap-2">
            <List size={27} className='text-gray-500 cursor-pointer bg-muted duration-150' />
            <Grid2X2 size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
          </div>
          <div className='flex gap-2 items-center'>

            <Plus onClick={() => setAddNoteDialogOpen(true)} size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
            <Stars size={27} onClick={handleAISummaryClick} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
            {(
              addNoteDialogOpen && <AddNoteDialog youtubeId={video?.youtubeId!} open={addNoteDialogOpen} setOpen={setAddNoteDialogOpen} fetchNotes={fetchNotes} libraryId={library?._id!} text={note} noteTitle={noteTitle} />
            )}
            <Input placeholder='Search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

        </div>
      </div>
      <div className="usernotes m-5">
        <div className='flex flex-col gap-2'>
          {loading && [1, 2, 3, 4, 5, 6].map((index) => <div key={index} className='h-40 w-full bg-muted animate-pulse'></div>)}
          {filteredNotes.map((note, index) => (
            <NotesListCard key={note._id} note={note} videoDetails={video!} index={index} />
          ))}
          {!loading &&( filteredNotes.length === 0 )&& <div className='text-center text-muted-foreground'>No notes found</div>}
        </div>
      </div>
    </div>
  )
}

export default VideoPage
