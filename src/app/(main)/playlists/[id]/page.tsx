'use client'
import { useParams } from 'next/navigation'
import React, {useEffect, useState} from 'react'
import { api } from '@/config/config'
import { IPlaylist, IVideoDetails } from '@/types'
import VideoListCard from '@/components/cards/VideoListCard'
import { ListVideo, Grid2X2, CheckSquare2, Square, Star, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import VideoGridCard from '@/components/cards/VideoGridCard'
import VideoListCardSkeleton from '@/components/skeletons/VideoListCardSkeleton'
import MoveToPlaylist from '@/components/dialogs/MoveToPlaylist'
import { useDebouncedCallback } from 'use-debounce'
function PlaylistIDPage() {
    const {id} = useParams()
    const [playlist, setPlaylist] = useState<IPlaylist | null>(null)
    const [loading, setLoading] = useState(true)
    const [videos, setVideos] = useState<IVideoDetails[]>([])
    const [searchText, setSearchText] = useState('')
    const [durationFilter, setDurationFilter] = useState<string>('all')
    const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid')
    const [filteredVideoList, setFilteredVideoList] = useState<IVideoDetails[]>([])
    const [selectedVideos, setSelectedVideos] = useState<IVideoDetails[]>([])
  const [selectMode, setSelectMode] = useState(false)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [moveToPlaylistOpen, setMoveToPlaylistOpen] = useState(false)
  const [starredFilter, setStarredFilter] = useState<string>('all')
    useEffect(() => {
        const filteredVideos = videos.filter((video) => {
          const matchesSearchText = video.title.toLowerCase().includes(searchText.toLowerCase());
          const matchesDuration = durationFilter === 'all' || (
            durationFilter === 'short' && Number(video.duration) <= 300 ||
            durationFilter === 'medium' && Number(video.duration) > 300 && Number(video.duration) <= 1200 ||
            durationFilter === 'long' && Number(video.duration) > 1200
          );
          const matchesStarred = starredFilter === 'all' || (starredFilter === 'starred' && video.isStarred);
          return matchesSearchText && matchesDuration && matchesStarred;
        });
        setFilteredVideoList(filteredVideos);
      }, [searchText, videos, durationFilter, starredFilter]);

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
          fetchVideos()
          setSelectedVideos([])
        } catch (error) {
          console.log(error)
        }
        }
        const fetchVideos = async () => {
          setLoading(true)
          setLoadingVideos(true)
        api.post(`/library/playlists/getbyid`, {id}).then((res) => {
            console.log(res.data.data)
            setPlaylist(res.data.data.playlistDetails)
            setVideos(res.data.data.videoDetails)
            setFilteredVideoList(res.data.data.videoDetails)
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
            setLoadingVideos(false)
        })
        }
        const handleFavoriteClick = useDebouncedCallback(async(video: IVideoDetails) => {
          try {
            video.isStarred = !video.isStarred
            setVideos([...videos])
            await api.post(`/library/videos/starred`,{libraryId:video.libraryId} )
          } catch (error) {
            console.log(error)
            video.isStarred = !video.isStarred
            setVideos([...videos])
          }
        }, 500)
    useEffect(() => {
        fetchVideos()
    }, [])
    return <div>{loading ? <div>Loading...</div> :
    <div className='m-5'>
        <div className='flex w-full justify-between items-center mb-5'>
        <div className='flex m-1 items-center gap-2'>
          <ListVideo size={27} className={`text-gray-500 cursor-pointer ${displayMode === 'list' ? 'bg-muted' : ''} duration-150`} onClick={() => setDisplayMode('list')} />
          <Grid2X2 size={27} className={`text-gray-500 cursor-pointer ${displayMode === 'grid' ? 'bg-muted' : ''} duration-150`} onClick={() => setDisplayMode('grid')} />
        </div>
        <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-16 mx-2 relative'>
              <Filter size={20} />
              {[durationFilter, starredFilter].some((filter) => filter !== 'all') && <span className='absolute top-0 right-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-500'>
                {[durationFilter, starredFilter].filter((filter) => filter !== 'all').length}
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
            <DropdownMenuLabel>Starred</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={starredFilter} onValueChange={setStarredFilter}>
              <DropdownMenuRadioItem value='all'>All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='starred'>Starred</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
       
      </div>
        <h1 className='text-2xl font-bold'>{playlist?.name}</h1>
        <p className='text-sm text-gray-500'>{playlist?.description}</p>
        {selectMode && 
        <div className='flex gap-4 items-center'>
        <Button onClick={() => {setSelectMode(false); setSelectedVideos([])}} variant='secondary' className='w-16 mx-2'>Cancel</Button>
        <Button onClick={() => setSelectedVideos([])} variant='destructive' className='w-16 mx-2'>Clear</Button>
        <Button onClick={() =>{setSelectedVideos(filteredVideoList)}} variant='secondary' className='w-16 mx-2'>Select All</Button>
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
        <div className='flex flex-col gap-4'>
            {displayMode === 'list' && (loadingVideos ? [1,2,3,4,5].map((num)=> <VideoListCardSkeleton key={num} />): filteredVideoList.map((video, index) => (
        <div onClick={()=>{
          if(selectMode) handleSelectVideo(video)}} key={video._id} className='flex gap-4 items-center'>
          {selectMode && (selectedVideos.includes(video) ?( <CheckSquare2 size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />): <Square size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />)}
        <VideoListCard key={video.youtubeId} videoDetails={video} type="playlist_entry" index={index} playlistId={id as string} videoList={videos} setVideoList={setVideos} isSelected={selectedVideos.some((selectedVideo) => selectedVideo._id === video._id)} selectMode={selectMode} />
        </div>
      )))}
 {displayMode === 'grid' && <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-5'>
        {loadingVideos ? [1,2,3,4,5].map((num)=> <VideoListCardSkeleton key={num} />): 
        filteredVideoList.map((video, index) => (
          <div onClick={()=>{
            if(selectMode) handleSelectVideo(video)
          }} key={video._id} className='flex relative gap-4 items-center'>
            {selectMode ? (selectedVideos.includes(video) ?( <CheckSquare2 size={27} className=' cursor-pointer bg- absolute z-50 bottom-4 right-4 duration-150' onClick={() => handleSelectVideo(video)} />): <Square size={27} className=' absolute z-50 bottom-4 right-4  cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />):<Star size={27} onClick={()=>handleFavoriteClick(video)} className={`cursor-pointer absolute z-50 bottom-4 right-4 ${video.isStarred ? 'text-yellow-400 fill-yellow-300 duration-300' : 'text-gray-500'}`}/>}
       <VideoGridCard key={video.youtubeId} videoDetails={video} type="playlist_entry" index={index} videoList={videos} setVideoList={setVideos} playlistId={id as string} isSelected={selectedVideos.some((selectedVideo) => selectedVideo._id === video._id)} selectMode={selectMode}/>
        </div>
        ))}
        </div>}
        { moveToPlaylistOpen && <MoveToPlaylist  open={moveToPlaylistOpen} setOpen={setMoveToPlaylistOpen} videoList={videos} setVideoList={setVideos} bulkVideos={selectedVideos}  currentPlaylist={playlist?._id} bulk={true} />}
        {filteredVideoList.length === 0 && !loadingVideos && <p className='text-center text-gray-500'>No videos found</p>}
        </div>
    </div>
    }</div>
}

export default PlaylistIDPage
