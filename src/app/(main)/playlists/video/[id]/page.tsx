"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { api } from '@/config/config';
import { ILibrary, IUserNote, IVideoDetails } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Grid2X2, List, ListFilter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import NotesListCard from '@/components/cards/NotesListCard';
import AddNoteDialog from '@/components/cards/AddNoteDialog';
import NotesFilterDialog from '@/components/dialogs/NotesFilterDialog';
function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<IVideoDetails | null>(null);
  const [library, setLibrary] = useState<ILibrary | null>(null);
  const [loading, setLoading] = useState(false);
  const [userNotes, setUserNotes] = useState<IUserNote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<IUserNote[]>([]);
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [addNoteDialogCategory, setAddNoteDialogCategory] = useState("");
  const [notesFilterDialogOpen, setNotesFilterDialogOpen] = useState(false);
  const [keyPointFilter, setKeyPointFilter] = useState(false);
  const [todoFilter, setTodoFilter] = useState(false);
  const [questionFilter, setQuestionFilter] = useState(false);
  useEffect(() => {
    setSearchQuery("");
  }, [id])
  useEffect(() => {
    setFilteredNotes(
      userNotes.filter((note) => {
        const matchesSearch = note.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = (
          (!keyPointFilter && !todoFilter && !questionFilter) ||
          (keyPointFilter && note.category === "key point") ||
          (todoFilter && note.category === "todo") ||
          (questionFilter && note.category === "question")
        );
        return matchesSearch && matchesCategory;
      })
    )
  }, [searchQuery, keyPointFilter, todoFilter, questionFilter, userNotes])
  const fetchNotes = async () => {
    const response = await api.post(`/library/notes`, { id });
    setUserNotes(response.data.data);
    setFilteredNotes(response.data.data);
  }
  useEffect(() => {
    setLoading(true);
    api.post(`/library/videos/getbyid`,{id, type: "playlist_entry"}).then((res) => {
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
  return (
    <div>
      <div className='w-full h-[20vh] relative'>
        <Image src={!loading && video?.thumbnailUrl ? video?.thumbnailUrl : "/images/playlist.png"} alt='thumbnail' width={100} height={100} className='w-full h-full object-cover rounded-lg' style={{filter: "brightness(0.2)"}}/>
        <div className='absolute top-0 left-0 w-full h-full flex flex-col gap-4 justify-center items-center'>
            <div className='text-2xl font-bold hover:underline line-clamp-1'>
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
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Plus size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            Add Note
                        </DropdownMenuLabel>
                       {["key point", "todo", "question"].map((category) => (
                        <DropdownMenuItem key={category} onClick={() => {
                            setAddNoteDialogOpen(true);
                            setAddNoteDialogCategory(category);
                        }}>
                            {category}
                        </DropdownMenuItem>
                       ))}
                      
                    </DropdownMenuContent>

                </DropdownMenu>
                {(
                        <AddNoteDialog open={addNoteDialogOpen} setOpen={setAddNoteDialogOpen} fetchNotes={fetchNotes} category={addNoteDialogCategory} setCategory={setAddNoteDialogCategory} libraryId={library?._id!} />
                       )}
                <Input placeholder='Search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <div className='relative'>
                <ListFilter onClick={() => setNotesFilterDialogOpen(true)} size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
                {(keyPointFilter || todoFilter || questionFilter) && <div className='absolute top-0 right-0 w-fit h-fit bg-black opacity-50'>
                  {[keyPointFilter, todoFilter, questionFilter]
                  .reduce((acc, curr) => {
                    if(curr) {
                      acc += 1;
                    }
                    return acc;
                  }, 0)
                  }
                </div>}
                </div>
                  
            </div>
            {(
                        <NotesFilterDialog open={notesFilterDialogOpen} setOpen={setNotesFilterDialogOpen} keyPointFilter={keyPointFilter} setKeyPointFilter={setKeyPointFilter} todoFilter={todoFilter} setTodoFilter={setTodoFilter} questionFilter={questionFilter} setQuestionFilter={setQuestionFilter} />
            )}
        </div>
      </div>
      <div className="usernotes m-5">
        <div className='flex flex-col gap-2'>
            {filteredNotes.map((note) => (
                <NotesListCard key={note.text} note={note} videoDetails={video!} />
            ))}
            {filteredNotes.length === 0 && <div className='text-center text-muted-foreground'>No notes found</div>}
        </div>
      </div>
    </div>
  )
}

export default VideoPage
