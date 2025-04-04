'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {motion} from 'framer-motion'
import { useState } from 'react'
import { api } from '@/config/config'
import { extractVideoId } from '@/lib/utils'
import toast from 'react-hot-toast'
import { LibrarySquare, Loader2 } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
function page() {
    const [urlInput, setUrlInput] = useState("")
    const [availabilityChecking, setAvailabilityChecking] = useState(false)
    const router = useRouter()
    const getAudioAvailability = async()=>{
        setAvailabilityChecking(true)
        if(!urlInput) return
        const videoId = extractVideoId(urlInput)
        if(!videoId) {
            toast.error("Looks like the url is not valid, please enter a valid url")
            setAvailabilityChecking(false)
            return
        }
        try {
            const response = await api.get(`/youtube/voice?v=${videoId}`)
            if(response.status !== 200) {
                toast.error("Sorry you cannot chat with this video currently")
                return
            }
            router.push(`/voice/${response.data.voiceId}`)
            
        } catch (error) {
            toast.error("Sorry you cannot chat with this video currently")
        } finally {
            setAvailabilityChecking(false)
        }
    }
  return (
    <div className="p-5 flex items-center flex-col justify-center w-full h-screen">
        <motion.div initial={{
            opacity: 0,
            filter: 'blur(5px)'
        }} 
        animate={{
            opacity:1,
            filter: 'blur(0px)'
        }}
        transition={{duration: 0.3}}
        className='text-center text-xl lg:text-3xl font-semibold flex justify-center items-center gap-[5px] lg:gap-[10px] my-2'
        >
            {"Voice Chat with your favourite YouTube video".split(" ")
            .map((word, index) => 
            <motion.p
            initial={{
                translateY: -20,
                filter: 'blur(5px)'
            }}
            animate={{
                translateY:0,
                filter: 'blur(0px)'
            }}
            transition={{duration: 0.3, delay: index*0.1}}
            key={index}>{word + " "}</motion.p>)} 
        </motion.div>
        <div className='flex justify-center items-center gap-[10px] w-[500px]'>
        <Input value={urlInput} onChange={(e)=>{
            setUrlInput(e.target.value)
        }} type="text" placeholder="Enter youtube video url" />
        <Button onClick={getAudioAvailability} disabled={availabilityChecking || urlInput === ""}>Chat</Button>
        </div>
        <div className='text-muted-foreground my-4 border border-muted-foreground px-5 py-2 rounded-md' >
            <p className='text-lg font-semibold text-center'>Note</p>
            <ul className='list-disc'>
                <li>Each conversation can have atmost 5 queries and 5 responses </li>
                <li>A conversation would cost 1 credit</li>
            </ul>
        </div>
        {availabilityChecking && <div className='flex justify-center items-center w-full h-full gap-[10px]'>
            <Loader2 className='animate-spin' />
            <p className='text-lg font-semibold'>Loading...</p>
        </div>}
    </div>
  )
}

export default page
