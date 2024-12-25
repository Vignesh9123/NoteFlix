import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { IPlaylist } from '@/types'
import Link from 'next/link'
import { motion } from 'framer-motion'
function PlaylistGridCard({playlist, index}: {playlist: IPlaylist, index: number}) {
  return (
    <motion.div initial={{opacity: 0, y: 100, scale: 0.6}} animate={{opacity: 1, y: 0, scale: 1}} transition={{delay: index * 0.1, duration: 0.3}} className='flex'>
    <div>
       <Card className='hover:scale-105 transition-all duration-300 hover:bg-gray-900'>
            <CardContent className='p-0 cursor-pointer '>
                <Link href={`/playlists/${playlist._id}`}>
                <Image src="https://images.unsplash.com/photo-1549210338-a03623c2bde3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Playlist" width={100} height={100} className='h-full w-full object-fill' />
                <div className='p-4'>

                <p className="font-bold text-lg ">{playlist.name}</p>
                <p className="text-sm text-gray-500">{playlist.description}</p>
                </div>
                </Link>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-center justify-between gap-2">

                <div className='w-full h-1 bg-gray-200'>
                    <div className='w-[50%] h-full bg-green-500'>
                    </div>
                </div>
                <div className='text-sm text-gray-500'>50%</div>
                </div>
            </CardFooter>
        </Card>
    </div>
    </motion.div>
  )
}

export default PlaylistGridCard
