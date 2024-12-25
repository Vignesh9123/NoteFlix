'use client'
import { useParams } from 'next/navigation'
import React, {useEffect, useState} from 'react'
import { api } from '@/config/config'
import { IPlaylist, IVideoDetails } from '@/types'
import VideoListCard from '@/components/cards/VideoListCard'
function PlaylistIDPage() {
    const {id} = useParams()
    const [playlist, setPlaylist] = useState<IPlaylist | null>(null)
    const [loading, setLoading] = useState(true)
    const [videos, setVideos] = useState<IVideoDetails[]>([])
    useEffect(() => {
        setLoading(true)
        api.post(`/library/playlists/getbyid`, {id}).then((res) => {
            console.log(res.data.data)
            setPlaylist(res.data.data.playlistDetails)
            setVideos(res.data.data.videoDetails)
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
        <h1 className='text-2xl font-bold'>{playlist?.name}</h1>
        <p className='text-sm text-gray-500'>{playlist?.description}</p>
        <div className='flex flex-col gap-4'>
            {videos.map((video, index) => (
                <VideoListCard key={video.libraryId} videoDetails={video} type="playlist_entry" index={index} />
            ))}
        </div>
    </div>
    }</div>
}

export default PlaylistIDPage
