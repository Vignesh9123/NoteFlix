import PlaylistGridCard from '@/components/cards/PlaylistGridCard'
import React from 'react'

function PlaylistsPage() {
  return (
<   div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 m-5'>     
    <PlaylistGridCard />
    </div>
  )
}

export default PlaylistsPage
