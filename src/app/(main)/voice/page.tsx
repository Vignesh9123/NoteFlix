'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {motion} from 'framer-motion'
import { useEffect, useState } from 'react'
import { api } from '@/config/config'
import { extractVideoId } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import { IVideoDetails } from '@/types'
import { AxiosError } from 'axios'
import { useAuth } from '@/context/AuthContext'
function page() {
    const [urlInput, setUrlInput] = useState("")
    const [availabilityChecking, setAvailabilityChecking] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const {user} = useAuth()
    const [conversations, setConversations] = useState<{
        _id: string,
        chatTitle: string,
        videoId: IVideoDetails,
        userId: string
    }[]>([])
    const getAudioAvailability = async()=>{
        setAvailabilityChecking(true)
        if(!urlInput) return
        if(!user) return
        if(user.creditsUsed >= 5) {
            toast.error("Credits limit exceeded")
            setAvailabilityChecking(false)
            return
        }
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
            if(error instanceof AxiosError){
                toast.error(error.response?.data.error || "Something went wrong, please try again later")
            }else{
                toast.error("Something went wrong, please try again later")
            }
            setUrlInput("")
        } finally {
            setAvailabilityChecking(false)
        }
    }
    useEffect(() => {
        setLoading(true)
       try {
        const fetchConversations = async () => {
            const response = await api.get('/youtube/voice/get-conversations')
            if (response.status !== 200) {
                toast.error("Failed to fetch conversations")
                setConversations([])
                setLoading(false)
                return
            }
            setConversations(response.data.voiceConversations)
        }
        fetchConversations().then(() => {
            setLoading(false)
        })
       } catch (error) {
        toast.error("Failed to fetch conversations")
        setConversations([])
        setLoading(false)
       }
       
    }, []);

    if(loading) return <div className='flex justify-center items-center w-full h-screen gap-[10px]'><Loader2 className='animate-spin' /></div>
  return (
    <div className="p-5 flex items-center flex-col justify-center w-full h-[90vh]">
        {!availabilityChecking &&<> 
        <motion.div initial={{
            opacity: 0,
            filter: 'blur(5px)'
        }} 
        animate={{
            opacity:1,
            filter: 'blur(0px)'
        }}
        transition={{duration: 0.3}}
        className='text-center text-xl lg:text-3xl font-semibold flex flex-wrap justify-center items-center gap-[5px] lg:gap-[10px] my-2'
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
        <div className='flex justify-center items-center gap-[10px] w-full md:w-[500px]'>
        <Input value={urlInput} onChange={(e)=>{
            setUrlInput(e.target.value)
        }} type="text" placeholder="Enter youtube video url" />
        <Button onClick={getAudioAvailability} disabled={availabilityChecking || urlInput === ""}>Chat</Button>
        </div>
        {conversations.length === 0 && <div className='text-muted-foreground my-4 border border-muted-foreground px-5 py-2 rounded-md' >
            <p className='text-lg font-semibold text-center'>Note</p>
            <ul className='list-disc'>
                <li>Each conversation can have atmost 5 queries and 5 responses </li>
                <li>A conversation would cost 1 credit</li>
            </ul>
        </div>}
        {conversations.length > 0 && <>
        <p className='text-lg font-semibold my-5'>Your Conversations</p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] overflow-y-scroll h-[300px] md:h-[200px]'>
            {conversations.map((conversation) => (
                <div key={conversation._id} onClick={() => router.push(`/voice/${conversation._id}`)} className='border border-muted-foreground rounded-md p-5 cursor-pointer hover:shadow-lg'>
                    <p className='text-lg font-semibold line-clamp-1'>{conversation.chatTitle || "Conversation"}</p>
                    <p className='text-muted-foreground line-clamp-2'>{conversation.videoId.title}</p>
                </div>
            ))}
        </div>
        </>}
        {loading && <div className='grid grid-cols-1 md:grid-cols-2 my-2 lg:grid-cols-3 gap-[10px]'>
            {[1,2,3,4,5,6].map((conversation) => (
                <div key={conversation} className='border border-muted-foreground rounded-md p-5 cursor-pointer hover:shadow-lg animate-pulse'>
                    <p className='text-lg font-semibold text-transparent'>A very Long Conversation title I guess please grind</p>
                    <p className='text-transparent'>A Youtube Video Title  </p>
                </div>
            ))}
        </div>}
        </>}
        {availabilityChecking && <div className='flex justify-center items-center w-full h-full gap-[10px]'>
            <Loader2 className='animate-spin' />
            <p className='text-lg font-semibold'>Loading...</p>
        </div>}
    </div>
  )
}

export default page
