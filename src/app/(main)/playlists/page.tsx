'use client'
import PlaylistGridCard from '@/components/cards/PlaylistGridCard'
import React , {useState, useEffect} from 'react'
import {api} from '@/config/config'
import { IPlaylist } from '@/types'
import { Loader2 } from 'lucide-react'

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/library/playlists').then((res) => {
      console.log(res.data)
      setPlaylists(res.data.data)
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])
  return (
<   div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 m-5'>     
    {loading ? <div className='flex col-span-3 md:col-span-2 lg:col-span-3 justify-center items-center h-screen'><Loader2 className='animate-spin text-gray-500' /></div> : playlists.map((playlist) => (
      <PlaylistGridCard key={playlist._id} playlist={playlist} />
    ))}
    </div>
  )
}

export default PlaylistsPage
