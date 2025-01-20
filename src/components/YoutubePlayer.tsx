import { useRef } from 'react'
import ReactPlayer from 'react-player/youtube'

const YoutubePlayer = ({videoURL}:{videoURL:string}) => {
    const playerRef = useRef<any>(null)
    console.log(videoURL, Number(new URL(videoURL).searchParams.get('t')?.replace('s', '')))
    return (
    <div className='2xl:w-[1280px] 2xl:h-[720px] md:w-[480px] md:h-[360px] '>

        <ReactPlayer url={videoURL} height={'100%'} width={'100%'} onStart={() =>{ videoURL.includes('t=') && playerRef.current?.seekTo(Number(new URL(videoURL).searchParams.get('t')?.replace('s', '')), 'seconds')}} playing={videoURL.includes('t=')} controls ref={playerRef}
        />
        </div>
    )
}

export default YoutubePlayer