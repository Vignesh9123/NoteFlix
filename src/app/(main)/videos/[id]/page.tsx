"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { api } from '@/config/config';
import { ILibrary, IUserNote, IVideoDetails } from '@/types';
import Image from 'next/image';
import { Plus, Stars } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NotesListCard from '@/components/cards/NotesListCard';
import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader';
import AddNoteDialog from '@/components/cards/AddNoteDialog';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { api2Url } from '@/constants';
import YoutubePlayerDialog from '@/components/dialogs/YoutubePlayerDialog';
import { useAuth } from '@/context/AuthContext';
import AIConfirmDialog from '@/components/dialogs/AIConfirmDialog';
function VideoPage() {
  const flag: number = 0;
  const { id } = useParams();
  const { user, setUser } = useAuth();
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
  const [AIDialogOpen, setAIDialogOpen] = useState(false);
  const handleYoutubePlayerOpen = (youtubeURL?: string) => {
    if(youtubeURL) setYoutubeURL(youtubeURL);
    setYoutubePlayerOpen(true);
  }

  const handleYoutubePlayerClose = () => {
    setYoutubePlayerOpen(false);
    setYoutubeURL('');
  }

  useEffect(() => {
    if(!youtubePlayerOpen) setYoutubeURL('');
  },[youtubePlayerOpen])
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
  }, [searchQuery, userNotes])

  const handleAISummaryClick = async () => {
    if (flag == 0) {
      setAILoading(true);
      setAIDialogOpen(false);
      try {
        // await api.post('/youtube/getaudio', { videoId: video?.youtubeId });
        setLoadingIndex(1);
        const res = await api.post('/youtube/gettranscript', { videoId: video?.youtubeId });
        setLoadingIndex(2);
        const transcript = res.data.data
        const summary = await api.post('/gemini/generatesummary', { transcript, videoId: video?.youtubeId });
        // setLoadingIndex(2);
        setNote(summary.data.data.toString());
        setUser(
          {
            ...user,
            creditsUsed: user?.creditsUsed!+1
          }
        )
        setNoteTitle("Summary of the video");
        setAddNoteDialogOpen(true);
      }
      catch (error) {
        if(error instanceof AxiosError){
          toast.error(error.response?.data.error || "Something went wrong, please try again later.");
        }else{
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
        await api.post(`${api2Url}/youtube/getaudio`, { videoId: video?.youtubeId }, {headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} });
        setLoadingIndex(1);
        const res = await api.post(`${api2Url}/gemini/audiosummarizer`, { videoId: video?.youtubeId }, {headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
        setNote(res.data.data.toString());
        setNoteTitle("Summary of the video");
        setAddNoteDialogOpen(true);
      } catch (error) {
        if(error instanceof AxiosError){
          toast.error(error.response?.data.error || "Something went wrong, please try again later.");
        }else{
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
    api.post(`/library/videos/getbyid`, { id, type: "standalone" }).then((res) => {
      setVideo(res.data.data.videoDetails);
      setLibrary(res.data.data);
      setUserNotes(res.data.data.userNotes);
      setFilteredNotes(res.data.data.userNotes);
    })
      .catch((err) => {
        toast.error(err.response.data.message || "Something went wrong, please try again later.");
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
      {youtubePlayerOpen && <YoutubePlayerDialog videoURL={youtubeURL} open={youtubePlayerOpen} setOpen={setYoutubePlayerOpen}  />}
      <div className='w-full h-[20vh] relative'>
        {loading && <div className='w-full h-full flex justify-center items-center animate-pulse bg-muted'></div> }
        {!loading && video?.thumbnailUrl && <Image src={!loading && video?.thumbnailUrl } alt='thumbnail' width={1920} height={1080} quality={100} className='w-full h-full object-cover rounded-lg' style={{ filter: "brightness(0.2) contrast(1.1) blur(2px)" }} />}
        <div className='absolute top-0 left-0 w-full h-full flex flex-col gap-4 justify-center items-center'>
          <div onClick={()=>{
            handleYoutubePlayerOpen(`https://www.youtube.com/watch?v=${video?.youtubeId}`);
          }} className='text-2xl cursor-pointer font-bold hover:underline line-clamp-1 text-center'>
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

            <div onClick={() => {
              if(!loading)
                setAddNoteDialogOpen(true)
              }} className={`flex flex-col md:flex-row lg:w-max items-center gap-2 hover:bg-muted duration-150 cursor-pointer p-1 ${loading && 'opacity-50'}`}>
            <Plus  size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
            <p className='text-gray-500 text-xs text-center'>Add Note</p>
            </div>
              <div onClick={()=>{
                if(user?.creditsUsed! >= 5){
                  toast.error("You have already used your 5 credits for this month. Please try again next month.")
                  return;
                }
                if(!loading)
                  setAIDialogOpen(true)
              }} className={`flex flex-col md:flex-row lg:w-max items-center gap-2 hover:bg-muted duration-150 cursor-pointer p-1 ${loading && 'opacity-50'}`}>
            <Stars size={27}  className='text-gray-500  ' />
            <p className='text-gray-500 text-xs text-center'>Generate Summary using AI</p>
            </div>
            {(
              addNoteDialogOpen && <AddNoteDialog youtubeId={video?.youtubeId!} open={addNoteDialogOpen} setOpen={setAddNoteDialogOpen} fetchNotes={fetchNotes} libraryId={library?._id!} text={note} noteTitle={noteTitle} setText={setNote} setNoteTitle={setNoteTitle} />
            )}
      {AIDialogOpen && <AIConfirmDialog open={AIDialogOpen} setOpen={setAIDialogOpen} onConfirm={handleAISummaryClick} />}
            <Input placeholder='Search' className='mt-2 md:mt-0 col-span-2 md:col-span-1' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

        </div>
      </div>
      <div className="usernotes m-5">
        <div className='flex flex-col gap-2'>
          {loading && [1, 2, 3, 4, 5, 6].map((index) => <div key={index} className='h-40 w-full bg-muted animate-pulse'></div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>

          {filteredNotes.map((note, index) => (
            <NotesListCard setNoteList={setUserNotes} noteList={userNotes} key={note._id} note={note} videoDetails={video!} index={index} />
          ))}
          </div>
          {!loading &&( filteredNotes.length === 0 )&& <div className='text-center text-muted-foreground'>No notes found</div>}
        </div>
      </div>
    </div>
  )
}

export default VideoPage
