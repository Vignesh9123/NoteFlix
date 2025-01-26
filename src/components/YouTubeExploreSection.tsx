'use client'
import React,{useEffect, useState} from 'react'
import { api } from '@/config/config'
import { IVideoDetails } from '@/types'
import toast from 'react-hot-toast'
import AddVideoUsingYTDetails from './dialogs/AddVideoUsingYTDetails'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { Button } from './ui/button'
import { convertHtmlTextToPlainText, secondsToTime } from '@/lib/utils'
import { Plus } from 'lucide-react'
import YoutubePlayerDialog from './dialogs/YoutubePlayerDialog'

function YouTubeExploreSection() {
    const [videoList, setVideoList] = useState<IVideoDetails[]>([])
    const [loading, setLoading] = useState(false)
    const [addVideoDialogOpen, setAddVideoDialogOpen] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState<IVideoDetails | null>(null)
    const [playerDialogOpen, setPlayerDialogOpen] = useState(false)
    const [playerSelectedVideo, setPlayerSelectedVideo] = useState<IVideoDetails | null>(null)
    const [youtubeUrl, setYoutubeUrl] = useState('')

    const handlePlayerDialogOpen = (url: string,video:IVideoDetails ) => {
        setYoutubeUrl(url)
        setPlayerDialogOpen(true)
        setPlayerSelectedVideo(video)
    }
    useEffect(() => {
        setLoading(true)
        const cachedDate = new Date(JSON.parse(localStorage.getItem('cachedDate')!));
        const currentDateMinusOneDay = new Date();
        currentDateMinusOneDay.setDate(currentDateMinusOneDay.getDate() - 1);
        const isCachedDateExpired = cachedDate < currentDateMinusOneDay;
        if(!isCachedDateExpired && localStorage.getItem('exploreVideos') && JSON.parse(localStorage.getItem('exploreVideos')!).length > 0){
            const data = JSON.parse(localStorage.getItem('exploreVideos')!)
            data.sort(() => Math.random() - 0.5);
            setVideoList(data!);  
            setLoading(false)
        }
        else{

                api.get('/youtube/explore').then(res => {
                    res.data.data.sort(() => Math.random() - 0.5);
                    setVideoList(res.data.data);
                    localStorage.setItem('exploreVideos', JSON.stringify(res.data.data));
                    localStorage.setItem('cachedDate', JSON.stringify(new Date()));
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err.response?.data.error || "Something went wrong, please try again later.");
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    },[])
  return (
    <div className='w-full bg-slate-950 rounded-xl p-2 my-5'>
        <h1 className='text-3xl font-bold text-center my-5'>Explore</h1>
      <div className='w-[95%] mx-auto m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {!loading && videoList && videoList.map((video,index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05,  transition: { duration: 0.2, delay: 0 } }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className='bg-gray-900 rounded-md hover:bg-muted duration-150 cursor-pointer'
              onClick={() => handlePlayerDialogOpen(`https://www.youtube.com/watch?v=${video.youtubeId}`,video) }
            >
              <div className='relative aspect-video'>
                <Image src={video.thumbnailUrl} alt='placeholder' layout='fill' className='object-cover hover:brightness-50 duration-150' />
                <div className='absolute bottom-0 right-0 bg-gray-900 rounded-t-lg text-white px-2 py-1'>{secondsToTime(Number(video?.duration))}</div>
                <Button variant='secondary' className='absolute top-1 left-2 z-10' onClick={(e) =>{
                    e.stopPropagation();
                    setSelectedVideo(video);
                    setAddVideoDialogOpen(true);
                }} size='icon'><Plus/></Button>
              </div>
              <div className='py-4 p-1'>
                <p title={convertHtmlTextToPlainText(video.title)} className='font-bold text-lg line-clamp-1'>{convertHtmlTextToPlainText(video.title)}</p>
                <p className='text-sm text-muted-foreground line-clamp-1'>{video.channelName}</p>
                <p className='text-sm text-muted-foreground'>{formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}</p>
              </div>
            </motion.div>
          );
        })}
        {loading && (
            [1,2,3,4,5,6,7,8,9,10].map((_,index) => {
                return(
                <motion.div
            key={index}
            initial={{ opacity: 0, y: 100, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className='bg-muted animate-pulse rounded-md'
          >
            <div className='relative aspect-video'>
              <div className='absolute bottom-0 right-0 bg-muted rounded-t-lg px-2 py-1 animate-pulse'></div>
            </div>
            <div className='py-4 p-1 bg-gray-900'>
              <p className='font-bold text-lg w-full h-2 bg-muted animate-pulse'></p>
              <p className='text-sm text-muted-foreground h-1'></p>
              <p className='text-sm text-muted-foreground'></p>
            </div>
          </motion.div>      
            )})
          
        )}
        {addVideoDialogOpen && selectedVideo && <AddVideoUsingYTDetails open={addVideoDialogOpen} setOpen={setAddVideoDialogOpen} videoDetails={selectedVideo!} videoList={[]} setVideoList={() => {}} setVideoDetails={setSelectedVideo}/>}
          {playerDialogOpen && playerSelectedVideo && <YoutubePlayerDialog open={playerDialogOpen} setOpen={setPlayerDialogOpen} videoDetails={playerSelectedVideo} videoURL={youtubeUrl}  addShow/>}
      </div>
        {videoList && videoList.length === 0 && !loading && <p className=' text-center '>Add Videos to Library and Star to see suggestions here</p>}
    </div>
  )
}

export default YouTubeExploreSection
