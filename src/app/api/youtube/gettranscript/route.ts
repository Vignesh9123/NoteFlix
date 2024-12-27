import { NextRequest, NextResponse } from "next/server";
// import {getSubtitles} from 'youtube-captions-scraper'
import {createClient} from '@deepgram/sdk'
import fs from 'fs'
export async function POST(request: NextRequest) {
    try {
        // const { videoID }:{videoID: string} = await request.json();
        // const subtitles = await getSubtitles({videoID, lang: "en"});
        // const fullSubtitles = subtitles.map((subtitle) => subtitle.text).join('\n');
        // console.log(fullSubtitles);
        // return NextResponse.json({data: subtitles}, {status: 200});
        const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
        const {videoId}:{videoId: string} = await request.json();
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
        return NextResponse.json({data: result.results.channels[0].alternatives[0].transcript}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}