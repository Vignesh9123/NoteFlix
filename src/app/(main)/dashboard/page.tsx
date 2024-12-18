import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Library } from 'lucide-react'
function Dashboard() {
  return (
    <div className="flex justify-around w-full mt-10">
      <Card className="flex flex-col gap-4 items-center w-[25%]">
        <CardHeader className='text-lg font-bold'>Playlists</CardHeader>
        <CardContent>
          <div className='flex items-center justify-center rounded-full text-2xl font-bold'>
            10
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col gap-4 items-center w-[25%]">
        <CardHeader className='text-lg font-bold'>Videos</CardHeader>
        <CardContent>
          <div className='flex items-center justify-center rounded-full text-2xl font-bold'>
            10
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col gap-4 items-center w-[25%]">
        <CardHeader className='text-lg font-bold'>Hours Completed</CardHeader>
        <CardContent>
          <div className='flex items-center justify-center rounded-full text-2xl font-bold'>
            10
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}

export default Dashboard
