import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";
import Library from "@/models/library.model";
import connectDB from "@/dbConfig/connectDB";
connectDB();

export async function POST(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const { videoId, playlistId } = await request.json();
        if (!videoId || !playlistId) return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        const library = await Library.findOneAndDelete({ videoId, playlistId, userId: request.user?._id, type: "playlist_entry" });
        if (!library) return NextResponse.json({ message: "Video not found in playlist" }, { status: 404 });
        return NextResponse.json({ data: library, message: "Video removed from playlist successfully" }, { status: 200 });

    } catch (error) {
        console.log("Error in removing video from playlist", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}