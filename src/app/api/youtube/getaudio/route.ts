import { authMiddleware } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import ytdlp from 'ytdlp-nodejs';
import Video from "@/models/video.model";
import connectDB from "@/dbConfig/connectDB";
connectDB();
export async function POST(request: NextRequest) {
    let videoId: string;
    return;
    // try {
    //     const auth = await authMiddleware(request);
    //     if (auth.status == 401) {
    //         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //     }
    //     ({ videoId } = await request.json());
    //     if (!videoId) {
    //         return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    //     }
    //     const dbVideo = await Video.findOne({ youtubeId: videoId });
    //     if (!dbVideo) {
    //         return NextResponse.json({ error: "Video not found" }, { status: 404 });
    //     }
    //     if(Number(dbVideo.duration) > 900){
    //         return NextResponse.json({ error: "Video duration is too long" }, { status: 400 });
    //     }
    //     if(request.user?.creditsUsed! >= 5){
    //         return NextResponse.json({ error: "You have reached your credit limit" }, { status: 400 });
    //     }
    //     if(dbVideo.summary){
    //         return NextResponse.json({ message: "Audio downloaded successfully" }, { status: 200 });
    //     }
    //     if (fs.existsSync(`public/${videoId}.mp3`)) {
    //         return NextResponse.json({message: "Audio downloaded successfully"}, {status: 200});
    //     }
    //     const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    //     await new Promise<void>((resolve, reject) => {
    //         const stream = ytdlp.stream(videoUrl, { filter: 'audioonly', command: ['-x', '--audio-format', 'mp3'] });
    //         const writeStream = fs.createWriteStream(`public/${videoId}.mp3`);

    //         stream.pipe(writeStream);

    //         // Listen for stream events
    //         writeStream.on('finish', () => {
    //             console.log('Audio downloaded successfully');
    //             resolve();
    //         });

    //         writeStream.on('error', (error) => {
    //             console.error('Error writing to file:', error);
    //             reject(error);
    //         });

    //         stream.on('error', (error) => {
    //             console.error('Error in stream:', error);
    //             reject(error);
    //         });
    //     });

    //     return NextResponse.json({ message: "Audio downloaded successfully" }, { status: 200 });
    // } catch (error) {
    //     console.log(error);
    //     fs.unlinkSync(`public/${videoId!}.mp3`);
    //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    // }
}