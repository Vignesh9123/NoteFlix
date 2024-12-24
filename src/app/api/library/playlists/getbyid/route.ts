import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";
import Library from "@/models/library.model";
import connectDB from "@/dbConfig/connectDB";
import mongoose from "mongoose";
connectDB();
export async function POST(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id }: { id: string } = await request.json();
        const playlist = await Library
            .aggregate([
                {
                    $match: {
                        userId: request.user?._id,
                        playlistId: new mongoose.Types.ObjectId(id),
                        type: "playlist_entry"
                    }
                },
                {
                    $lookup: {
                        from: "playlists",
                        localField: "playlistId",
                        foreignField: "_id",
                        as: "playlistDetails",
                    }
                },
                {
                    $unwind: "$playlistDetails"
                },
                {
                    $lookup: {
                        from: "videos",
                        localField: "videoId",
                        foreignField: "_id",
                        as: "videoDetails",
                    }
                },
                {
                    $unwind: "$videoDetails"
                },
                {
                    $addFields: {
                        videoDetails: {
                            $mergeObjects: ["$videoDetails", { libraryId: "$_id" }]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$playlistId",
                        playlistDetails: { $first: "$playlistDetails" },
                        videoDetails: { $push: "$videoDetails" }
                    }
                },
                
                {
                    $project: {
                        _id: 0,
                        playlistDetails: 1,
                        videoDetails: 1
                    }
                }
            ])
        if (playlist.length == 0) return NextResponse.json({ error: "Playlist not found in library" }, { status: 404 });
        return NextResponse.json({ data: playlist[0] }, { status: 200 });
    } catch (error) {
        console.log("Error getting playlist from library", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}