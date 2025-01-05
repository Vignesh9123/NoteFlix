'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { api } from '@/config/config';
import { IVideoDetails } from '@/types';
import { secondsToTime } from '@/lib/utils';
import AddVideoUsingYTDetails from '@/components/dialogs/AddVideoUsingYTDetails';
function Page() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<IVideoDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [searchedQuery, setSearchedQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<IVideoDetails | null>(null);
    const [addVideoDialogOpen, setAddVideoDialogOpen] = useState(false);
    const handleSearchClick = ()=>{
        setLoading(true)
        setSearched(true);
        api.get(`/youtube/search?q=${searchQuery}`).then((res) => {
            console.log(res.data.data);
            setSearchedQuery(searchQuery);
            setSearchResults(res.data.data);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        // if (searchQuery === '') {
        //     setSearched(false);
        // }
    }, [searchQuery])

  return (
    <div className='h-full w-full'>
      <div className='w-[95%] flex gap-2 items-center justify-center mx-auto m-5'>
        <Input onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()} placeholder='Search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Button disabled={!searchQuery || loading} onClick={handleSearchClick} className=''><Search /></Button>
      </div>
      <div className='w-[95%] mx-auto'>
        {searched && <>
        <div className='text-xl font-bold'>Search Results</div>
        <div className='text-muted-foreground'>Showing search results for {searchedQuery}</div>
        </>
        }
        {
            !searched && <>
            <div className='text-xl font-bold'>Search to see results</div>
            </>
        }
      </div>
      <div className='w-[95%] mx-auto m-5 grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {!loading && searchResults.map((video,index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05,  transition: { duration: 0.2, delay: 0 } }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className='bg-gray-900 rounded-md hover:bg-muted duration-150 cursor-pointer'
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank') }
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
                <p title={video.title} className='font-bold text-lg line-clamp-1'>{video.title}</p>
                <p className='text-sm text-muted-foreground line-clamp-1'>{video.channelName}</p>
                <p className='text-sm text-muted-foreground'>{formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}</p>
              </div>
            </motion.div>
          );
        })}
        {loading && (
          <motion.div
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
        )}
        {
            searched && !loading && searchResults.length == 0 && <div className='text-xl font-bold'>No results found</div>
        }
        {addVideoDialogOpen && selectedVideo && <AddVideoUsingYTDetails open={addVideoDialogOpen} setOpen={setAddVideoDialogOpen} videoDetails={selectedVideo!} videoList={[]} setVideoList={() => {}} setVideoDetails={setSelectedVideo}/>}
      </div>
    </div>
  );
}

export default Page;