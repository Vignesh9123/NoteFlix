import {useState} from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { IPlaylist } from '@/types'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EllipsisVertical, ListVideo } from 'lucide-react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import DeletePlaylist from '../dialogs/DeletePlaylist'
import UpdatePlaylist from '../dialogs/UpdatePlaylist'
function PlaylistGridCard({playlist, index, playlists, setPlaylists}: {playlist: IPlaylist, index: number, playlists: IPlaylist[], setPlaylists: (playlists: IPlaylist[]) => void}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  return (
    <motion.div initial={{opacity: 0, y: 100, scale: 0.6}} animate={{opacity: 1, y: 0, scale: 1}} transition={{delay: index * 0.1, duration: 0.3}} className='h-full w-full'>
    <div className='h-full w-full'>
       <Card className='hover:scale-105 transition-all duration-300 hover:bg-gray-900 w-full h-full'>
            <CardContent className='p-0 cursor-pointer '>
                <Link href={`/playlists/${playlist._id}`}>
                <Image src="https://images.unsplash.com/photo-1549210338-a03623c2bde3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Playlist" width={300} height={300} className='h-full w-full object-fill' />
                <div className='p-4'>

                <p className="font-bold text-lg line-clamp-1">{playlist.name}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{playlist.description}</p>
                </div>
                </Link>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className='flex items-center gap-2'>
                      <ListVideo className='h-4 w-4' /> {playlist.videoCount}
                  </div>
                  <div className=" bg-muted p-[4px] rounded-full">
                  <DropdownMenu>
    <DropdownMenuTrigger asChild>
    <div title='More' onClick={(e) => e.stopPropagation()} className='flex p-2 h-fit my-auto items-center cursor-pointer gap-2'>
        <EllipsisVertical className='text-gray-500 cursor-pointer hover:text-white duration-150' />
    </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className=''>
        <DropdownMenuItem onClick={() =>{setUpdateDialogOpen(true)}}> Update Details </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {setDeleteDialogOpen(true)}}> Delete </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
                  </div>
                </div>
                {deleteDialogOpen && <DeletePlaylist playlists={playlists} setPlaylists={setPlaylists} open={deleteDialogOpen} setOpen={setDeleteDialogOpen} playlistDetails={playlist} />}
                {updateDialogOpen && <UpdatePlaylist playlistList={playlists} setPlaylistList={setPlaylists} open={updateDialogOpen} setOpen={setUpdateDialogOpen} playlistDetails={playlist} />}
            </CardFooter>
        </Card>
    </div>
    </motion.div>
  )
}

export default PlaylistGridCard
