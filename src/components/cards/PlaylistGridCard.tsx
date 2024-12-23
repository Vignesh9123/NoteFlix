import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { IPlaylist } from '@/types'

function PlaylistGridCard({playlist}: {playlist: IPlaylist}) {
  return (
    <div>
       <Card className='hover:scale-105 transition-all duration-300 hover:bg-gray-900'>
            <CardContent className='p-0 cursor-pointer '>
                <Image src="https://images.unsplash.com/photo-1549210338-a03623c2bde3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Playlist" width={200} height={200} className='h-full w-full object-cover' />
                <div className='p-4'>

                <p className="font-bold text-lg ">{playlist.name}</p>
                <p className="text-sm text-gray-500">{playlist.description}</p>
                </div>
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
  )
}

export default PlaylistGridCard
