import { authMiddleware } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";
import {Innertube} from 'youtubei.js'
import Video from "@/models/video.model";
import connectDB from "@/dbConfig/connectDB";
connectDB();
export async function POST(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const { videoId } = await request.json();
        if(!videoId) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        const dbVideo = await Video.findOne({ youtubeId: videoId });
        if (!dbVideo) return NextResponse.json({ error: "Video not found" }, { status: 404 });
        if(Number(request.user?.creditsUsed) >= 5) return NextResponse.json({ error: "You have reached your credit limit" }, { status: 400 });
        if(dbVideo.summary) return NextResponse.json({ data: dbVideo.summary, message: "Transcript already generated" }, { status: 200 });

        const youtube = await Innertube.create(
           
        );
        const info = await youtube.getInfo(videoId);

        try {
            const transcript = await info.getTranscript();
            const formattedTranscript = transcript?.transcript?.content?.body?.initial_segments
                ?.map((segment) => segment.snippet.text)
                .join(' ');
        
            if (formattedTranscript) {
                return NextResponse.json({ 
                    data: formattedTranscript, 
                    message: "Transcript fetched successfully" 
                }, { status: 200 });
            }
        } catch (error) {
            const captionURL = info.captions?.caption_tracks?.[0]?.base_url;
            
            if (!captionURL) {
                return NextResponse.json({ 
                    error: "Sorry, the transcript is not available" 
                }, { status: 500 });
            }
        
            try {
                const response = await fetch(captionURL);
                const data = await response.text();
        
                const transcriptText = data.match(/<text[^>]*>(.*?)<\/text>/g)
                    ?.map(tag => tag.replace(/<\/?text[^>]*>/g, '').trim())
                    .join(' ');
        
                return NextResponse.json({ 
                    data: transcriptText, 
                    message: "Transcript fetched successfully" 
                }, { status: 200 });
        
            } catch (fetchError) {
                return NextResponse.json({ 
                    error: "Sorry, the transcript is not available" 
                }, { status: 500 });
            }
        }
        
        // Final fallback if both methods fail
        return NextResponse.json({ 
            error: "Sorry, the transcript is not available" 
        }, { status: 500 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Sorry, the transcript is not available" }, { status: 500 });
    }
}
