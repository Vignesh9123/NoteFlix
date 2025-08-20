import { useRef } from 'react'
import ReactPlayer from 'react-player/youtube'

const YoutubePlayer = ({ videoURL }: { videoURL: string }) => {
    const playerRef = useRef<ReactPlayer>(null)
    const onStart = () => { 
        videoURL.includes('t=') && playerRef.current?.seekTo(Number(new URL(videoURL).searchParams.get('t')?.replace('s', '')), 'seconds') 
    }
    return (
        <div className='2xl:w-[1280px] 2xl:h-[720px] md:w-[480px] md:h-[360px] '>

            <ReactPlayer url={videoURL} height={'100%'} width={'100%'} onStart={onStart} playing={videoURL.includes('t=')} controls ref={playerRef}
            />
        </div>
    )
}

export default YoutubePlayer