'use client'
import { useParams } from 'next/navigation'
import React, {useEffect, useState} from 'react'
import { api } from '@/config/config'
import { IPlaylist, IVideoDetails } from '@/types'
import VideoListCard from '@/components/cards/VideoListCard'
import { ListVideo, Grid2X2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import VideoGridCard from '@/components/cards/VideoGridCard'
function PlaylistIDPage() {
    const {id} = useParams()
    const [playlist, setPlaylist] = useState<IPlaylist | null>(null)
    const [loading, setLoading] = useState(true)
    const [videos, setVideos] = useState<IVideoDetails[]>([])
    const [searchText, setSearchText] = useState('')
    const [durationFilter, setDurationFilter] = useState<string>('all')
    const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid')
    const [filteredVideoList, setFilteredVideoList] = useState<IVideoDetails[]>([])
    useEffect(() => {
        const filteredVideos = videos.filter((video) => {
          const matchesSearchText = video.title.toLowerCase().includes(searchText.toLowerCase());
          const matchesDuration = durationFilter === 'all' || (
            durationFilter === 'short' && Number(video.duration) <= 300 ||
            durationFilter === 'medium' && Number(video.duration) > 300 && Number(video.duration) <= 1200 ||
            durationFilter === 'long' && Number(video.duration) > 1200
          );
          return matchesSearchText && matchesDuration;
        });
        setFilteredVideoList(filteredVideos);
      }, [searchText, videos, durationFilter]);
    useEffect(() => {
        setLoading(true)
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
        })
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
       
      </div>
        <h1 className='text-2xl font-bold'>{playlist?.name}</h1>
        <p className='text-sm text-gray-500'>{playlist?.description}</p>
        <div className='flex flex-col gap-4'>
            {displayMode === 'list' && filteredVideoList.map((video, index) => (
                <VideoListCard key={video.libraryId} videoList={videos} setVideoList={setVideos} playlistId={id as string} videoDetails={video} type="playlist_entry" index={index} />
            ))}
             {displayMode === 'grid' && <div className='grid mt-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'> 
        {filteredVideoList.map((video, index) => (
          <div key={video._id} className='flex relative gap-4 items-center'>
       <VideoGridCard key={video.youtubeId} videoDetails={video} type="standalone" index={index} videoList={videos} setVideoList={setVideos} />
        </div>
        ))}
        </div>}
        </div>
    </div>
    }</div>
}

export default PlaylistIDPage
