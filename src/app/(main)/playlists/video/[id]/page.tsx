"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { api } from '@/config/config';
import { ILibrary, IUserNote, IVideoDetails } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Stars } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NotesListCard from '@/components/cards/NotesListCard';
import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader';
import AddNoteDialog from '@/components/cards/AddNoteDialog';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import YoutubePlayerDialog from '@/components/dialogs/YoutubePlayerDialog';
function VideoPage() {
  const flag: number = 0;
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
  const [youtubePlayerOpen, setYoutubePlayerOpen] = useState(false);
  const [youtubeURL, setYoutubeURL] = useState('');
  useEffect(() => {
    setSearchQuery("");
  }, [id])

  const handleYoutubePlayerOpen = (youtubeURL?: string) => {
    if (youtubeURL) setYoutubeURL(youtubeURL);
    setYoutubePlayerOpen(true);
  }

  const handleYoutubePlayerClose = () => {
    setYoutubePlayerOpen(false);
    setYoutubeURL('');
  }

  useEffect(() => {
    if(!youtubePlayerOpen) setYoutubeURL('');
  }, [youtubePlayerOpen])
  useEffect(() => {
    setFilteredNotes(
      userNotes.filter((note) => {
        const matchesSearch = note.text.toLowerCase().includes(searchQuery.toLowerCase()) || note.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    )
  }, [searchQuery, userNotes])

  const handleAISummaryClick = async () => {
    if (flag == 0) {
      setAILoading(true);
      try {
        // await api.post('/youtube/getaudio', { videoId: video?.youtubeId });
        setLoadingIndex(1);
        const res = await api.post('/youtube/gettranscript', { videoId: video?.youtubeId });
        setLoadingIndex(2);
        const transcript = res.data.data
        const summary = await api.post('/gemini/generatesummary', { transcript, videoId: video?.youtubeId });
        // setLoadingIndex(2);
        setNote(summary.data.data.toString());
        setNoteTitle("Summary of the video");
        setAddNoteDialogOpen(true);
      }
      catch (error) {
        if(error instanceof AxiosError){
          toast.error(error.response?.data.error || "Something went wrong, please try again later.");
        }
        else{
          toast.error("Something went wrong, please try again later.");
        }
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
        if(error instanceof AxiosError){
          toast.error(error.response?.data.error || "Something went wrong, please try again later.");
        }
        else{
          toast.error("Something went wrong, please try again later.");
        }
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
    api.post(`/library/videos/getbyid`, { id, type: "playlist_entry" }).then((res) => {
      console.log("res", res.data.data)
      setVideo(res.data.data.videoDetails);
      setLibrary(res.data.data);
      setUserNotes(res.data.data.userNotes);
      setFilteredNotes(res.data.data.userNotes);
    })
    .catch((err) => {
      if(err instanceof AxiosError){
        toast.error(err.response?.data.message || "Something went wrong, please try again later.");
      }
      else{
        toast.error("Something went wrong, please try again later.");
      }
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
          <div className='text-2xl font-bold hover:underline line-clamp-1 text-center cursor-pointer'>
            {/* <Link href={`https://www.youtube.com/watch?v=${video?.youtubeId}`} target='_blank'> */}
              {video?.title}
            {/* </Link> */}
          </div>
          <div className='text-sm text-muted-foreground'>
            {video?.channelName}
          </div>
        </div>
      </div>
      <div className="filterheader m-5">
      <div className='grid md:grid-cols-3 grid-cols-2'>
          {/* <div className="flex gap-2">
            <List size={27} className='text-gray-500 cursor-pointer bg-muted duration-150' />
            <Grid2X2 size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
          </div> */}

            <div onClick={() => setAddNoteDialogOpen(true)} className='flex flex-col md:flex-row lg:w-max items-center gap-2 hover:bg-muted duration-150 cursor-pointer p-1'>
            <Plus  size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
            <p className='text-gray-500 text-xs text-center'>Add Note</p>
            </div>
              <div onClick={handleAISummaryClick} className='flex flex-col md:flex-row lg:w-max items-center gap-2 hover:bg-muted duration-150 cursor-pointer p-1'>
            <Stars size={27}  className='text-gray-500  ' />
            <p className='text-gray-500 text-xs text-center'>Generate Summary using AI</p>
            </div>
            {(
              addNoteDialogOpen && <AddNoteDialog youtubeId={video?.youtubeId!} open={addNoteDialogOpen} setOpen={setAddNoteDialogOpen} fetchNotes={fetchNotes} libraryId={library?._id!} text={note} noteTitle={noteTitle} />
            )}
            <Input placeholder='Search' className='mt-2 md:mt-0 col-span-2 md:col-span-1' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

        </div>
      </div>
      <div className="usernotes m-5">
        <div className='flex flex-col gap-2'>
          {loading && [1, 2, 3, 4, 5, 6].map((index) => <div key={index} className='h-40 w-full bg-muted animate-pulse'></div>)}
          {filteredNotes.map((note, index) => (
            <NotesListCard setNoteList={setUserNotes} noteList={userNotes} key={note._id} note={note} videoDetails={video!} index={index} />
          ))}
          {!loading &&( filteredNotes.length === 0 )&& <div className='text-center text-muted-foreground'>No notes found</div>}
        </div>
      </div>
    </div>
  )
}

export default VideoPage
