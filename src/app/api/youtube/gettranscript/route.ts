import { NextRequest, NextResponse } from "next/server";
// import {getSubtitles} from 'youtube-captions-scraper'
import {createClient} from '@deepgram/sdk'
import fs from 'fs'
import Video from "@/models/video.model";
export async function POST(request: NextRequest) {
    let videoId: string;
    try {
        // const { videoID }:{videoID: string} = await request.json();
        // const subtitles = await getSubtitles({videoID, lang: "en"});
        // const fullSubtitles = subtitles.map((subtitle) => subtitle.text).join('\n');
        // console.log(fullSubtitles);
        // return NextResponse.json({data: subtitles}, {status: 200});
        ({videoId} = await request.json());
        const video = await Video.findOne({youtubeId: videoId});
        if(!video) {
            return NextResponse.json({error: "Video not found"}, {status: 404});
        };
        if(video.summary) {
            if(fs.existsSync(`public/${videoId}.mp3`)) {
                fs.unlinkSync(`public/${videoId}.mp3`);
            }
            return NextResponse.json({data: video.summary, message: "Video transcript fetched successfully"}, {status: 200});
        }
        const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
        const {result, error} = await deepgram.listen.prerecorded.transcribeFile(
            fs.readFileSync(`public/${videoId}.mp3`),
            {
                model: "nova-2",
                smart_format: true,
            }
        )
        if(error) {
            throw error;
        }
        fs.unlinkSync(`public/${videoId}.mp3`); 
        await video.save();
        return NextResponse.json({data: result.results.channels[0].alternatives[0].transcript, message: "Video transcript fetched successfully"}, {status: 200});
    } catch (error) {
        console.log(error);
        if(fs.existsSync(`public/${videoId!}.mp3`)) {
            fs.unlinkSync(`public/${videoId!}.mp3`);
        }
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}