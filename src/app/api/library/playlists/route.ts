import { NextRequest, NextResponse } from "next/server";
import {authMiddleware} from "@/middleware/auth.middleware";
import Library from "@/models/library.model";
import Playlist from "@/models/playlist.model";
import connectDB from "@/dbConfig/connectDB";
import Video from "@/models/video.model";
connectDB();
export async function GET(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401) return NextResponse.json({message: "Unauthorized"}, {status: 401});
        
        const userPlaylists = await Playlist.aggregate([
            {
                $match: {
                    userId: request.user?._id,
                }
            },
            {
                $lookup: {
                    from: "libraries",
                    localField: "_id",
                    foreignField: "playlistId",
                    pipeline: [
                        {
                            $match: {
                                type: "playlist_entry"
                            }
                        }
                    ],
                    as: "videos"
                }
            },
            {
                $addFields: {
                    videoCount: { $size: "$videos" }
                }
            },
            {
                $project: {
                    videos: 0 
                }
            }
        ]);

        return NextResponse.json({
            data: userPlaylists, 
            message: "Playlists fetched successfully"
        });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}

export async function POST(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401) return NextResponse.json({message: "Unauthorized"}, {status: 401});
        const {videoId, playlistId} = await request.json();
        if(!videoId || !playlistId) return NextResponse.json({message: "Invalid request"}, {status: 400});
        const video = await Video.findById(videoId);
        if(!video) return NextResponse.json({message: "Video not found"}, {status: 404});
        const playlist = await Playlist.findById(playlistId);
        if(!playlist) return NextResponse.json({message: "Playlist not found"}, {status: 404});
        if(playlist?.userId.toString() != request.user?._id.toString()) return NextResponse.json({message: "Unauthorized"}, {status: 401});
        const existingLibrary = await Library.findOne({videoId, playlistId, userId: request.user?._id});
        if(existingLibrary) return NextResponse.json({message: "Video already in playlist"}, {status: 400});
        const library = await Library.create({videoId, playlistId, userId: request.user?._id, type: "playlist_entry", status: "to_watch"});
        return NextResponse.json({data: library, message: "Video added to playlist successfully"}, {status: 200});

    } catch (error) {
        console.log("Error in adding video to playlist", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}
