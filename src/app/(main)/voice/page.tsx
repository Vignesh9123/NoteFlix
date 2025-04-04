'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {motion} from 'framer-motion'
import { useState } from 'react'
import { api } from '@/config/config'
import { extractVideoId } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
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
            return
        }
        try {
            const response = await api.get(`/youtube/voice?v=${videoId}`)
            if(response.status !== 200) {
                toast.error("Sorry you cannot chat with this video currently")
                return
            }
            router.push(`/voice/${videoId}`)
            
        } catch (error) {
            toast.error("Sorry you cannot chat with this video currently")
        } finally {
            setAvailabilityChecking(false)
        }
    }
  return (
    <div className="container p-5">
        <motion.div initial={{
            opacity: 0,
            filter: 'blur(5px)'
        }} 
        animate={{
            opacity:1,
            filter: 'blur(0px)'
        }}
        transition={{duration: 0.3}}
        className='text-center text-3xl font-semibold flex justify-center items-center gap-[10px] my-2'
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
            key={index}>{word + "   "}</motion.p>)} 
        </motion.div>
        <div className='flex justify-center items-center gap-[10px]'>
        <Input value={urlInput} onChange={(e)=>{
            setUrlInput(e.target.value)
        }} type="text" placeholder="Enter youtube video url" />
        <Button onClick={getAudioAvailability} disabled={availabilityChecking || urlInput === ""}>Chat</Button>
        </div>
        {availabilityChecking && <div className='flex justify-center items-center w-full h-full gap-[10px]'>
            <Loader2 className='animate-spin' />
            <p className='text-lg font-semibold'>Loading...</p>
        </div>}
    </div>
  )
}

export default page
