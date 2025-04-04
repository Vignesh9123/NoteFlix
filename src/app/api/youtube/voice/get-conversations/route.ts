import { NextRequest, NextResponse } from "next/server";
import Voice from "@/models/voice.model";
import { authMiddleware } from "@/middleware/auth.middleware";
import Video from "@/models/video.model";
export async function GET(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if(auth.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const voiceConversations = await Voice.find({ userId: request.user?._id }).populate(
            {path: "videoId",model: Video}
        ).select("-chats"); 
        return NextResponse.json({ voiceConversations }, { status: 200 });
    } catch (error) {
        console.log("Error getting chats", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
