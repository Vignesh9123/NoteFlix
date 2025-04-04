import { NextRequest, NextResponse } from "next/server";
import Voice from "@/models/voice.model";
import Video from "@/models/video.model";
export const GET = async (request: NextRequest) => {
    try {
        const voiceId = request.nextUrl.searchParams.get("v");
        if(!voiceId) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        const voice = await Voice.findOne({ _id: voiceId });
        if(!voice) return NextResponse.json({ error: "Voice not found" }, { status: 404 });
        const video = await Video.findOne({ _id: voice.videoId });
        if(!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });
        if(video.transcript || video.formattedTranscript) {
            if(voice.chats.length > 10) {
                return NextResponse.json({ error: "Chat limit exceeded" }, { status: 400 });
            }
            return NextResponse.json({ message: "Transcript fetched successfully", chats: voice.chats }, { status: 200 });
        }
        return NextResponse.json({ message: "Transcript not available" }, { status: 500 });
    } catch (error) {
        console.log("Error fetching transcript", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
