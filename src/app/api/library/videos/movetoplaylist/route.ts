import {NextRequest, NextResponse} from 'next/server';
import Library from "@/models/library.model";
import {authMiddleware} from "@/middleware/auth.middleware";
import Playlist from '@/models/playlist.model';
import connectDB from "@/dbConfig/connectDB";
import mongoose from 'mongoose';
connectDB();

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) return NextResponse.json({message: "Unauthorized"}, {status: 401});
        const {libraryId, playlistId}:{libraryId: string, playlistId: string} = await request.json();
        if (!libraryId || !playlistId) return NextResponse.json({message: "Invalid request"}, {status: 400});
        const existingLibrary = await Library.findOne({_id: new mongoose.Types.ObjectId(libraryId), playlistId, userId: request.user?._id, type: "playlist_entry"});
        if (existingLibrary) return NextResponse.json({message: "Video already in playlist"}, {status: 400});
        const playlist = await Playlist.findById(playlistId);
        if(!playlist) return NextResponse.json({message: "Playlist not found"}, {status: 404});
        const library = await Library.findByIdAndUpdate(libraryId, {
            $set: {playlistId: playlistId, type: "playlist_entry", status: "to_watch"}
        },{new: true});
        return NextResponse.json({data: library, message: "Video added to playlist successfully"}, {status: 200});
    } catch (error) {
        console.log("Error in adding video to playlist", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}