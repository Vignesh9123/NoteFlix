'use client'
import PlaylistGridCard from '@/components/cards/PlaylistGridCard'
import React , {useState, useEffect} from 'react'
import {api} from '@/config/config'
import { IPlaylist } from '@/types'
import { Input } from '@/components/ui/input'
import AddPlaylist from '@/components/dialogs/AddPlaylist'
import PlaylistGridCardSkeleton from '@/components/skeletons/PlaylistGridCardSkeleton'
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
  },[searchText, playlists])
  return (
    <>
    <div className='flex items-center m-5 gap-4'>
      <Input placeholder='Search' className=' mx-auto' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <AddPlaylist open={addPlaylistOpen} setOpen={setAddPlaylistOpen}/>
    </div>
<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 m-5 items-center justify-items-center'>     
    {loading ? [1,2,3,4,5,6].map((index) => <PlaylistGridCardSkeleton key={index} />) :
    
    filteredPlaylists.map((playlist, index) => (
        <PlaylistGridCard playlists={playlists} setPlaylists={setPlaylists} key={playlist._id} playlist={playlist} index={index} />
    ))}
    </div>
    </>
  )
}

export default PlaylistsPage
