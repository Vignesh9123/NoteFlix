'use client'
import React, { useState, useEffect } from 'react'
import VideoListCard from '@/components/cards/VideoListCard'
import { Input } from '@/components/ui/input'
import { CheckSquare2, Grid2X2, ListVideo, Loader2, Plus, Square, Star } from 'lucide-react'
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
  const [selectedVideos, setSelectedVideos] = useState<IVideoDetails[]>([])
  const [selectMode, setSelectMode] = useState(false)
  const [moveToPlaylistOpen, setMoveToPlaylistOpen] = useState(false)
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid')
  
  useEffect(() => {
    const filteredVideos = videoList.filter((video) => {
      const matchesSearchText = video.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesDuration = durationFilter === 'all' || (
        durationFilter === 'short' && Number(video.duration) <= 300 ||
        durationFilter === 'medium' && Number(video.duration) > 300 && Number(video.duration) <= 1200 ||
        durationFilter === 'long' && Number(video.duration) > 1200
      );
      return matchesSearchText && matchesDuration;
    });
    setFilteredVideoList(filteredVideos);
  }, [searchText, videoList, durationFilter]);

  const handleGetVideoDetails = async () => {
    try {
      setLoading(true)
      const videoId = youtubeUrl.split('v=')[1] || youtubeUrl.split('youtu.be/')[1]
      if (!videoId) return

      const response = await api.post(`/youtube/getvideodetails`, { videoId })
      setVideoDetails(response.data.data)
      console.log(response.data.data)
      setYtLinkDialogOpen(false)
      setYoutubeUrl('')
      setOpenAddVideoDialog(true)
    } catch (error) {
      console.log(error)
      setOpenAddVideoDialog(false)
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
      console.log(error)
    }
    }

  const handleSelectVideo = (video: IVideoDetails) => {
    if (selectedVideos.some((v) => v._id === video._id)) {
      setSelectedVideos(selectedVideos.filter((v) => v._id !== video._id))
    } else {
      setSelectedVideos([...selectedVideos, video])
    }
  }

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true)
      const response = await api.get('/library/videos')
      const responseData = response.data.data
      const videos = responseData.map((data: any) => ({
        ...data.videoDetails,
      }))
      setVideoList(videos)
      setFilteredVideoList(videos)
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoadingVideos(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleFavoriteClick = async(video: IVideoDetails) => {
    try {
      video.isFavourite = !video.isFavourite
      setVideoList([...videoList])
      await api.post(`/library/videos/favourite`,{libraryId:video.libraryId} )
    } catch (error) {
      console.log(error)
      video.isFavourite = !video.isFavourite
      setVideoList([...videoList])
    }
  }

  return (
    <div className='m-5'>
      <div className='flex w-full justify-between items-center mb-5'>
        <div className='flex m-1 items-center gap-2'>
          <ListVideo size={27} className={`text-gray-500 cursor-pointer ${displayMode === 'list' ? 'bg-muted' : ''} duration-150`} onClick={() => setDisplayMode('list')} />
          <Grid2X2 size={27} className={`text-gray-500 cursor-pointer ${displayMode === 'grid' ? 'bg-muted' : ''} duration-150`} onClick={() => setDisplayMode('grid')} />
        </div>
        <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-16 mx-2'>
              {durationFilter === 'all' ? 'All' : durationFilter === 'short' ? 'Short' : durationFilter === 'medium' ? 'Medium' : 'Long'}
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
          </DropdownMenuContent>
        </DropdownMenu>
        <div className=' mx-2'>
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
                <Button onClick={handleGetVideoDetails}>{loading ? <div className='flex items-center gap-2'><Loader2 size={20} className='animate-spin' /></div> : 'Proceed'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {videoDetails && <AddVideo open={openAddVideoDialog} setOpen={setOpenAddVideoDialog} videoDetails={videoDetails} setVideoDetails={setVideoDetails} videoList={videoList} setVideoList={setVideoList} />}
        </div>
      </div>
      { moveToPlaylistOpen && <MoveToPlaylist  open={moveToPlaylistOpen} setOpen={setMoveToPlaylistOpen} videoList={videoList} setVideoList={setVideoList} bulkVideos={selectedVideos} bulk={true} />}

      <div className='flex flex-col gap-4'>
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
      {displayMode === 'list' && (loadingVideos ? [1,2,3,4,5].map((num)=> <VideoListCardSkeleton key={num} />): filteredVideoList.map((video, index) => (
        <div onClick={()=>{
          if(selectMode) handleSelectVideo(video)}} key={video._id} className='flex gap-4 items-center'>
          {selectMode && (selectedVideos.includes(video) ?( <CheckSquare2 size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />): <Square size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />)}
        <VideoListCard key={video.youtubeId} videoDetails={video} type="standalone" index={index} videoList={videoList} setVideoList={setVideoList} isSelected={selectedVideos.some((selectedVideo) => selectedVideo._id === video._id)} selectMode={selectMode} />
        </div>
      ))) }
        {displayMode === 'grid' && <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
        {loadingVideos ? [1,2,3,4,5].map((num)=> <VideoListCardSkeleton key={num} />): 
        filteredVideoList.map((video, index) => (
          <div onClick={()=>{
            if(selectMode) handleSelectVideo(video)
          }} key={video._id} className='flex relative gap-4 items-center'>
            {selectMode ? (selectedVideos.includes(video) ?( <CheckSquare2 size={27} className=' cursor-pointer bg- absolute z-50 bottom-4 right-4 duration-150' onClick={() => handleSelectVideo(video)} />): <Square size={27} className=' absolute z-50 bottom-4 right-4  cursor-pointer hover:bg-muted duration-150' onClick={() => handleSelectVideo(video)} />):
              <Star size={27} onClick={()=>handleFavoriteClick(video)} className={`cursor-pointer absolute z-50 bottom-4 right-4 ${video.isFavourite ? 'text-yellow-400 fill-yellow-300' : 'text-gray-500'}`}/>
            }
       <VideoGridCard key={video.youtubeId} videoDetails={video} type="standalone" index={index} videoList={videoList} setVideoList={setVideoList} isSelected={selectedVideos.some((selectedVideo) => selectedVideo._id === video._id)} selectMode={selectMode}/>
        </div>
        ))}
        </div>}

        {filteredVideoList.length === 0 && !loadingVideos && <p className='text-center text-gray-500'>No videos found</p>}
      </div>
    </div>
  )
}

export default VideosPage