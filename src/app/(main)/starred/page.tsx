'use client'
import {useEffect, useState} from 'react'
import { api } from '@/config/config'
import { Input } from '@/components/ui/input'
import { Grid2X2, ListVideo, Filter, Star, CheckSquare2, Square } from 'lucide-react';
import { ILibrary, IPlaylist, IVideoDetails } from '@/types';
import VideoGridCard from '@/components/cards/VideoGridCard';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import VideoListCardSkeleton from '@/components/skeletons/VideoListCardSkeleton';
import { useDebouncedCallback } from 'use-debounce';
import VideoListCard from '@/components/cards/VideoListCard';
import MoveToPlaylist from '@/components/dialogs/MoveToPlaylist';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

function Starred() {
    const [searchQuery, setSearchQuery] = useState('');
    const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
    const [videos, setVideos] = useState<IVideoDetails[]>([]);
    const [filteredVideos, setFilteredVideos] = useState<IVideoDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [durationFilter, setDurationFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [selectedVideos, setSelectedVideos] = useState<IVideoDetails[]>([])
    const [selectMode, setSelectMode] = useState(false)
    const [moveToPlaylistOpen, setMoveToPlaylistOpen] = useState(false)
    const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

    useEffect(() => {
        setFilteredVideos(
          videos.filter((video) => {
            const matchesSearchText = video.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDuration = durationFilter === 'all' || (
              durationFilter === 'short' && Number(video.duration) <= 300 ||
              durationFilter === 'medium' && Number(video.duration) > 300 && Number(video.duration) <= 1200 ||
              durationFilter === 'long' && Number(video.duration) > 1200
            );
            const matchesType = typeFilter === 'all' || (typeFilter === 'playlist_entry' && video.playlistId) || (typeFilter === 'standalone' && !video.playlistId);
            return matchesSearchText && matchesDuration && matchesType;
          })
        );
    },[searchQuery, videos,durationFilter, typeFilter]);
    const fetchAllStarredVideos = async()=>{
        setLoading(true)
        try{
            const response = await api.get('/library/videos/starred?type=all')
            const libraries = response.data.data
            const videos = libraries.map((library: ILibrary) => library.videoDetails)
            const playlist = libraries.map((library: ILibrary) => library.playlistDetails != null ? library.playlistDetails : null)
            setPlaylists(playlist)          
            setVideos(videos)
            setFilteredVideos(videos)
        }catch(e){
          if(e instanceof AxiosError){
            setVideos([])
            setFilteredVideos([])
            toast.error(e.response?.data.message || "Something went wrong, please try again later.");
          }
          else{
            toast.error("Something went wrong, please try again later.");
          }
        }
        finally{
            setLoading(false)
        }
    }
    const handleFavoriteClick = useDebouncedCallback(async(video: IVideoDetails) => {
        try {
          video.isStarred = !video.isStarred
          await api.post(`/library/videos/starred`,{libraryId:video.libraryId} )
          setVideos(
            videos.filter((v) => (v._id !== video._id))
          )
        } catch (error) {
          video.isStarred = !video.isStarred
        }
      },500)

      const handleSelectVideo = (video: IVideoDetails) => {
        if (selectedVideos.some((v) => v._id === video._id)) {
          setSelectedVideos(selectedVideos.filter((v) => v._id !== video._id))
        } else {
          setSelectedVideos([...selectedVideos, video])
        }
      }
    const handleDelete = async () => {
        try {
          setLoading(true)
          const ids = selectedVideos.map((video) => video.libraryId)
          const response = await api.delete(`/library/videos/bulk`,  { data:{libraryIds:ids} })
          fetchAllStarredVideos()
          setSelectedVideos([])
        } catch (error) {
          if(error instanceof AxiosError){
            toast.error(error.response?.data.message || "Something went wrong, please try again later.");
          }
          else{
            toast.error("Something went wrong, please try again later.");
          }
        }
    }
    useEffect(()=>{
        fetchAllStarredVideos()
    },[])
  return (
    <div className='m-5'>
      <div className="flex my-5">
      <div className='flex m-1 items-center gap-2'>
          <ListVideo size={27} className={`text-gray-500 cursor-pointer ${displayMode === 'list' ? 'bg-muted' : ''} duration-150`} onClick={() => setDisplayMode('list')} />
          <Grid2X2 size={27} className={`text-gray-500 cursor-pointer ${displayMode === 'grid' ? 'bg-muted' : ''} duration-150`} onClick={() => setDisplayMode('grid')} />
        </div>
        <Input type='text' placeholder='Search' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-16 mx-2 relative'>
              <Filter size={20} />
              {[durationFilter, typeFilter].some((filter) => filter !== 'all') && <span className='absolute top-0 right-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-500'>
                {[durationFilter, typeFilter].filter((filter) => filter !== 'all').length}
                </span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Duration</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={durationFilter} onValueChange={setDurationFilter}>
              <DropdownMenuRadioItem value='all'>All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='short'>Short &lt; 5m</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='medium'>Medium &gt; 5m - &lt; 20m</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='long'>Long &gt; 20m</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuLabel>Type</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={typeFilter} onValueChange={setTypeFilter}>
              <DropdownMenuRadioItem value='all'>All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='playlist_entry'>Playlist</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='standalone'>Standalone</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='mb-5'>
      {selectMode && 
        <div className='flex gap-4 items-center'>
        <Button onClick={() => {setSelectMode(false); setSelectedVideos([])}} variant='secondary' className='w-16 mx-2'>Cancel</Button>
        <Button onClick={() => setSelectedVideos([])} variant='destructive' className='w-16 mx-2'>Clear</Button>
        <Button onClick={() =>{setSelectedVideos(filteredVideos)}} variant='secondary' className='w-16 mx-2'>Select All</Button>
        <Button onClick={()=>setMoveToPlaylistOpen(true)} variant='secondary' className=''>Move to Playlist</Button>
        <Button onClick={handleDelete} variant='secondary' className='w-16 mx-2'>Delete</Button>
        </div>
        }
        {
          !selectMode &&
          <div className='flex gap-4 items-center'>
          <Button  onClick={() => setSelectMode(true)} variant='secondary' className='w-16 ml-auto'>Select</Button>
          </div>
        }
      </div>
      { moveToPlaylistOpen && <MoveToPlaylist  open={moveToPlaylistOpen} setOpen={setMoveToPlaylistOpen} bulkVideos={selectedVideos} bulk={true} />}
      {displayMode === 'grid' && <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
        {loading ? [1,2,3,4,5].map((num)=> <VideoListCardSkeleton key={num} />): 
        filteredVideos.map((video, index) => (
          <div onClick={()=>{
            if(selectMode) handleSelectVideo(video)
          }} key={video._id} className='flex relative gap-4 items-center'>
            {selectMode ? (selectedVideos.includes(video) ?( <CheckSquare2 size={27} className=' cursor-pointer bg- absolute z-50 bottom-4 right-4 duration-150' onClick={() => handleSelectVideo(video)} />): <Square size={27} className=' absolute z-50 bottom-4 right-4  cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />):
              <Star size={27} onClick={()=>handleFavoriteClick(video)} className={`cursor-pointer absolute z-50 bottom-4 right-4 ${video.isStarred ? 'text-yellow-400 fill-yellow-300 duration-300' : 'text-gray-500'}`}/>
            }
       <VideoGridCard key={video.youtubeId} videoDetails={video} type={video.playlistId?'playlist_entry':'standalone'} index={index} videoList={videos} setVideoList={setVideos} isSelected={selectedVideos.some((selectedVideo) => selectedVideo._id === video._id)} selectMode={selectMode} playlistId={video.playlistId} playlistDetails={playlists.find((playlist) => playlist!=null && playlist._id === video.playlistId)} />
        </div>
        ))}
        </div>}
        {displayMode === 'list' && (loading ? [1,2,3,4,5].map((num)=> <VideoListCardSkeleton key={num} />): filteredVideos.map((video, index) => (
        <div onClick={()=>{
          if(selectMode) handleSelectVideo(video)}} key={video._id} className='flex gap-4 items-center'>
          {selectMode ? (selectedVideos.includes(video) ?( <CheckSquare2 size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />): <Square size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />): <Star size={27} onClick={()=>handleFavoriteClick(video)} className={`cursor-pointer ${video.isStarred ? 'text-yellow-400 fill-yellow-300 duration-300' : 'text-gray-500'}`}/>}
        <VideoListCard key={video.youtubeId} videoDetails={video} type={video.playlistId?'playlist_entry':'standalone'} index={index} videoList={videos} setVideoList={setVideos} isSelected={selectedVideos.some((selectedVideo) => selectedVideo._id === video._id)} selectMode={selectMode} playlistId={video.playlistId} playlistDetails={video.playlistId ? playlists.find((playlist) => playlist!=null && playlist._id === video.playlistId) : undefined}/>
        </div>
      ))) }
      {!loading && filteredVideos.length === 0 && <p className='text-center text-gray-500'>No videos found</p>}
    </div>
  )
}

export default Starred
