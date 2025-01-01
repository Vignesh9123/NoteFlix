import { NextRequest, NextResponse } from "next/server";
import Library from "@/models/library.model";
import { authMiddleware } from "@/middleware/auth.middleware";
import connectDB from "@/dbConfig/connectDB";
import Playlist from "@/models/playlist.model";
connectDB();
export async function POST(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const { libraryIds, playlistId }: { libraryIds: string[]; playlistId: string } = await request.json();
        if (!libraryIds || !playlistId) return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        libraryIds.map(async (libraryId) => {
            const library = await Library.findById(libraryId);
            if (!library) return NextResponse.json({ message: "Video not found" }, { status: 404 });
            if(library.userId.toString() != request.user?._id.toString()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            if(library.type == "playlist_entry" && library.playlistId.toString() == playlistId) {
            return;
            }
            const playlist = await Playlist.findById(playlistId);
            if (!playlist) return NextResponse.json({ message: "Playlist not found" }, { status: 404 });
            if (playlist?.userId.toString() != request.user?._id.toString()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            library.playlistId = playlistId;
            library.type = "playlist_entry";
            library.status = "to_watch";
            await library.save();
        })
    } catch (error) {
        console.log("Error in adding videos to library", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}