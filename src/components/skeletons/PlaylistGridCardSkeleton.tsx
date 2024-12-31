import React from 'react'
import { Card, CardFooter } from '../ui/card'

function PlaylistGridCardSkeleton() {
  return (
    <div className='h-full w-[90%]'>
         <div className="h-full w-full animate-pulse">
        <Card className="w-full h-full">
          <div className="h-[200px] w-full bg-gray-500 rounded-md"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-500 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-500 rounded-md w-full mb-1"></div>
            <div className="h-4 bg-gray-500 rounded-md w-2/3"></div>
          </div>
          <CardFooter>
            <div className="flex w-full items-center justify-between gap-2">
              <div className="w-full h-1 bg-gray-500 rounded-md"></div>
              <div className="h-4 w-8 bg-gray-500 rounded-md"></div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default PlaylistGridCardSkeleton
