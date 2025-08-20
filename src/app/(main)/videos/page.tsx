'use client'
import React, { useState, useEffect, use } from 'react'
import VideoListCard from '@/components/cards/VideoListCard'
import { Input } from '@/components/ui/input'
import { CheckSquare2, ChevronLeftSquare, ChevronRightSquare, Filter, Grid2X2, ListVideo, Loader2, Plus, Square, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/config/config'
import { IVideoDetails } from '@/types'
import AddVideo from '@/components/dialogs/AddVideoUsingYTDetails'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu'
import VideoListCardSkeleton from '@/components/skeletons/VideoListCardSkeleton'
import MoveToPlaylist from '@/components/dialogs/MoveToPlaylist'
import VideoGridCard from '@/components/cards/VideoGridCard'
import { useDebouncedCallback } from 'use-debounce'
import { toast } from 'react-hot-toast'
import { AxiosError } from 'axios'
import { extractVideoId } from '@/lib/utils'
import PlaylistGridCardSkeleton from '@/components/skeletons/PlaylistGridCardSkeleton'
function VideosPage() {
  const [ytLinkDialogOpen, setYtLinkDialogOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoDetails, setVideoDetails] = useState<IVideoDetails | null>(null)
  const [videoList, setVideoList] = useState<IVideoDetails[]>([])
  const [filteredVideoList, setFilteredVideoList] = useState<IVideoDetails[]>([])
  const [openAddVideoDialog, setOpenAddVideoDialog] = useState(false)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [durationFilter, setDurationFilter] = useState<string>('all')
  const [starredFilter, setStarredFilter] = useState<string>('all')
  const [selectedVideos, setSelectedVideos] = useState<IVideoDetails[]>([])
  const [selectMode, setSelectMode] = useState(false)
  const [moveToPlaylistOpen, setMoveToPlaylistOpen] = useState(false)
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  useEffect(() => {
    setFilteredVideoList(videoList)
  },[videoList])

  const handleGetVideoDetails = async () => {
    try {
      setLoading(true)
      const videoId = extractVideoId( youtubeUrl)
      if (!videoId) return

      const response = await api.post(`/youtube/getvideodetails`, { videoId })
      setVideoDetails(response.data.data)
      setYtLinkDialogOpen(false)
      setYoutubeUrl('')
      setOpenAddVideoDialog(true)
    } catch (error) {
      setOpenAddVideoDialog(false)
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message || "Something went wrong, please try again later")
      }else{
        toast.error("Something went wrong, please try again later")
      }
    }
    finally {
      setLoading(false)
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
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message || "Something went wrong, please try again later")
      }else{
        toast.error("Something went wrong, please try again later")
      }
    }
    finally {
      setLoading(false)
    }
  }

  const handleSelectVideo = (video: IVideoDetails) => {
    if (selectedVideos.some((v) => v._id === video._id)) {
      setSelectedVideos(selectedVideos.filter((v) => v._id !== video._id))
    } else {
      setSelectedVideos([...selectedVideos, video])
    }
  }

  const fetchVideos = useDebouncedCallback(async () => {
    try {
      setLoadingVideos(true);
  
      // Extract filter values from state or props
      const title = searchText; 
      const status = '' // Assuming selectedStatus is a state variable
      const isStarred = starredFilter == 'all'?'':starredFilter; // Assuming selectedIsStarred is a state variable
      const type = ''; // Assuming selectedType is a state variable
      const duration = durationFilter == 'all'?'': durationFilter; // Assuming selectedDuration is a state variable
      const playlistId = ''; // Assuming selectedPlaylistId is a state variable
  
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (title) queryParams.append('title', title);
      if (status) queryParams.append('status', status);
      if (isStarred) queryParams.append('isStarred', isStarred);
      if (type) queryParams.append('type', type);
      if (duration) queryParams.append('duration', duration);
      if (playlistId) queryParams.append('playlistId', playlistId);
      queryParams.append('currentPage', currentPage.toString());
  
      // Make API request with query parameters
      const response = await api.get(`/library/videos?${queryParams}`);
      const responseData = response.data.data;
      const videos = responseData.map((data: any) => ({
        ...data.videoDetails,
      }));
      setVideoList(videos);
      setTotalPages(response.data.totalPages);
      setFilteredVideoList(videos);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Something went wrong, please try again later');
      } else {
        toast.error('Something went wrong, please try again later');
      }
    } finally {
      setLoadingVideos(false);
    }
  }, 500);

  useEffect(() => {
    fetchVideos()
  }, [searchText, durationFilter, starredFilter, currentPage]);

  const handleFavoriteClick = useDebouncedCallback(async(video: IVideoDetails) => {
    try {
      video.isStarred = !video.isStarred
      setVideoList([...videoList])
      await api.post(`/library/videos/starred`,{libraryId:video.libraryId} )
    } catch (error) {
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message || "Something went wrong, please try again later")
      }
      else{
        toast.error("Something went wrong, please try again later")
      }
      video.isStarred = !video.isStarred
      setVideoList([...videoList])
    }
  },500)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  useEffect(() => {
    setLoadingVideos(true)
    if(currentPage < 1) setCurrentPage(1)
    if(currentPage > totalPages) setCurrentPage(totalPages)
    fetchVideos()
  }, [currentPage])

  return (
    <div className='m-5'>
      <div className='flex w-full justify-between items-center mb-5'>
        <div className='hidden md:flex m-1 items-center gap-2'>
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
        <div className='mx-2'>
          <Dialog open={ytLinkDialogOpen} onOpenChange={setYtLinkDialogOpen}>
            <DialogTrigger className='bg-primary p-2 rounded-full'>
              <Plus size={20} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Video From YouTube</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder='Enter YouTube Video URL' />
              </DialogDescription>
              <DialogFooter>
                <Button disabled={loading} onClick={handleGetVideoDetails}>{loading ? <div className='flex items-center gap-2'><Loader2 size={20} className='animate-spin' /></div> : 'Proceed'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {videoDetails && <AddVideo open={openAddVideoDialog} setOpen={setOpenAddVideoDialog} videoDetails={videoDetails} setVideoDetails={setVideoDetails} videoList={videoList} setVideoList={setVideoList} />}
        </div>
      </div>
      { moveToPlaylistOpen && <MoveToPlaylist  open={moveToPlaylistOpen} setOpen={setMoveToPlaylistOpen} videoList={videoList} setVideoList={setVideoList} bulkVideos={selectedVideos} bulk={true} />}

      <div className='flex  flex-col gap-4'>
        {selectMode && 
        <div className='flex flex-wrap justify-around gap-4 items-center'>
        <Button onClick={() => {setSelectMode(false); setSelectedVideos([])}} variant='secondary' className='w-16 mx-2'>Cancel</Button>
        <Button disabled={selectedVideos.length === 0} onClick={() => setSelectedVideos([])} variant='secondary' className='w-16 mx-2'>Clear</Button>
        <Button disabled={filteredVideoList.length === selectedVideos.length} onClick={() =>{setSelectedVideos(filteredVideoList)}} variant='secondary' className='w-16 mx-2'>Select All</Button>
        <Button disabled={selectedVideos.length === 0} onClick={()=>setMoveToPlaylistOpen(true)} variant='secondary' className=''>Move to Playlist</Button>
        <Button disabled={selectedVideos.length === 0} onClick={handleDelete} variant='destructive' className='w-16 mx-2'>Delete</Button>
        </div>
        }
        {
          !selectMode &&
          <div className='flex gap-4 items-center'>
          <Button  onClick={() => setSelectMode(true)} variant='secondary' className='w-16 ml-auto'>Select</Button>
          </div>
        }
      {displayMode === 'list' && (loadingVideos ? [1,2,3,4,5].map((num)=> <VideoListCardSkeleton key={num} />): filteredVideoList.map((video, index) => (
        <div onClick={()=>{
          if(selectMode) handleSelectVideo(video)}} key={video._id} className='flex gap-4 items-center'>
          {selectMode ? (selectedVideos.includes(video) ?( <CheckSquare2 size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />): <Square size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />): <Star size={27} onClick={()=>handleFavoriteClick(video)} className={`cursor-pointer ${video.isStarred ? 'text-yellow-400 fill-yellow-300 duration-300' : 'text-gray-500'}`}/>}
        <VideoListCard key={video.youtubeId} videoDetails={video} type="standalone" index={index} videoList={videoList} setVideoList={setVideoList} isSelected={selectedVideos.some((selectedVideo) => selectedVideo._id === video._id)} selectMode={selectMode} />
        </div>
      ))) }
        {displayMode === 'grid' && <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
        {loadingVideos ? [1,2,3,4,5].map((num)=> <PlaylistGridCardSkeleton key={num} />): 
        filteredVideoList.map((video, index) => (
          <div onClick={()=>{
            if(selectMode) handleSelectVideo(video)
          }} key={video._id} className='flex relative gap-4 items-center'>
            {selectMode ? (selectedVideos.includes(video) ?( <CheckSquare2 size={27} className=' cursor-pointer bg- absolute z-50 bottom-4 right-4 duration-150' onClick={() => handleSelectVideo(video)} />): <Square size={27} className=' absolute z-50 bottom-4 right-4  cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />):
              <Star size={27} onClick={()=>handleFavoriteClick(video)} className={`cursor-pointer absolute z-50 bottom-4 right-4 ${video.isStarred ? 'text-yellow-400 fill-yellow-300 duration-300' : 'text-gray-500'}`}/>
            }
       <VideoGridCard key={video.youtubeId} videoDetails={video} type="standalone" index={index} videoList={videoList} setVideoList={setVideoList} isSelected={selectedVideos.some((selectedVideo) => selectedVideo._id === video._id)} selectMode={selectMode}/>
        </div>
        ))}
        </div>}
        {!loadingVideos && filteredVideoList.length === 0  && <p className='text-center text-gray-500'>No videos found</p>}

        <div className='flex gap-4 items-center justify-around'>
          <ChevronLeftSquare size={27} className={` duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted'}`} onClick={()=>{
            if(currentPage > 1) handlePrevPage()
          }} />
          <div>
            <p className='text-sm text-gray-500'>Page {currentPage} / {totalPages}</p>
            <p className='text-sm text-gray-500'>{filteredVideoList.length} results</p>
          </div>
          <ChevronRightSquare size={27} className={`  duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted'}`} onClick={()=>{
            if(currentPage < totalPages) handleNextPage()
          }} />

        </div>

      </div>
    </div>
  )
}

export default VideosPage