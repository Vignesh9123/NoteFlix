'use client'
import PlaylistGridCard from '@/components/cards/PlaylistGridCard'
import React , {useState, useEffect} from 'react'
import {api} from '@/config/config'
import { IPlaylist } from '@/types'
import { Loader2, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import AddPlaylist from '@/components/dialogs/AddPlaylist'
function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [filteredPlaylists, setFilteredPlaylists] = useState<IPlaylist[]>([])
  const [addPlaylistOpen, setAddPlaylistOpen] = useState(false)
  useEffect(() => {
    api.get('/library/playlists').then((res) => {
      console.log(res.data)
      setPlaylists(res.data.data)
      setFilteredPlaylists(res.data.data)
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])
  useEffect(() => {
    setFilteredPlaylists(playlists.filter((playlist) => playlist.name.toLowerCase().includes(searchText.toLowerCase())))
  },[searchText])
  return (
    <>
    <div className='flex items-center m-5 gap-4'>
      <Input placeholder='Search' className=' mx-auto' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <AddPlaylist open={addPlaylistOpen} setOpen={setAddPlaylistOpen}/>
    </div>
<div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-4 m-5 items-center justify-items-center'>     
    {loading ? <div className='flex col-span-3 md:col-span-2 lg:col-span-3 justify-center items-center h-screen'><Loader2 className='animate-spin text-gray-500' /></div> : 
    
    filteredPlaylists.map((playlist, index) => (
        <PlaylistGridCard key={playlist._id} playlist={playlist} index={index} />
    ))}
    </div>
    </>
  )
}

export default PlaylistsPage
