import React from 'react'
import VideoListCard from '@/components/cards/VideoListCard'
import { Input } from '@/components/ui/input'
import { Grid2X2, ListVideo } from 'lucide-react'
function VideosPage() {
  return (
    <div className='m-5'>
        <div className='flex justify-between items-center mb-5'>
            <div className='flex m-1 items-center gap-2'>
                    <ListVideo size={27} className='text-gray-500 cursor-pointer bg-muted duration-150' />
                    <Grid2X2 size={27} className='text-gray-500 cursor-pointer hover:bg-muted duration-150' />
            </div>
            <Input placeholder='Search' />
            
        </div>
        <VideoListCard />
    </div>
  )
}

export default VideosPage
