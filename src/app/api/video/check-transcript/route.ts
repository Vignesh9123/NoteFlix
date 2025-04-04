import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/video.model";
export const GET = async (request: NextRequest) => {
    try {
        const videoId = request.nextUrl.searchParams.get("v");
        if(!videoId) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        const video = await Video.findOne({ youtubeId: videoId });
        if(!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });
        if(video.transcript || video.formattedTranscript) {
            return NextResponse.json({ message: "Transcript fetched successfully" }, { status: 200 });
        }
        return NextResponse.json({ message: "Transcript not available" }, { status: 500 });
    } catch (error) {
        console.log("Error fetching transcript", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
