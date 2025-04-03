import { authMiddleware } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/video.model";
import connectDB from "@/dbConfig/connectDB";
import { getYoutubeTranscript } from "@/utils/getYoutubeTranscript";
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

        const { success, formattedTranscript, error } = await getYoutubeTranscript(videoId);
        if (!success) return NextResponse.json({ error: error || "Sorry, the transcript is not available" }, { status: 500 });
        return NextResponse.json({ data: formattedTranscript, message: "Transcript fetched successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Sorry, the transcript is not available" }, { status: 500 });
    }
}
