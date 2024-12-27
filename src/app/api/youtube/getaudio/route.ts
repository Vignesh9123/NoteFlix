import { authMiddleware } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import ytdlp from 'ytdlp-nodejs';

export async function POST(request: NextRequest) {
    let videoId: string;
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        ({ videoId } = await request.json());
        if (!videoId) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        await new Promise<void>((resolve, reject) => {
            const stream = ytdlp.stream(videoUrl, { filter: 'audioonly', command: ['-x', '--audio-format', 'mp3'] })
                .pipe(fs.createWriteStream(`public/${videoId}.mp3`));

            stream.on('progress', (progress) => {
                console.log(progress);
            });

            stream.on('finished', () => {
                console.log('Audio downloaded successfully');
                resolve();
            });

            stream.on('error', (error) => {
                console.log(error);
                reject(error);
            });
        });

        return NextResponse.json({ message: "Audio downloaded successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        fs.unlinkSync(`public/${videoId!}.mp3`);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}