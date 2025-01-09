import { NextRequest, NextResponse } from "next/server";
import Library from "@/models/library.model";
import { authMiddleware } from "@/middleware/auth.middleware";
import connectDB from "@/dbConfig/connectDB";
import mongoose from "mongoose";
connectDB();

export async function GET(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const type = request.nextUrl.searchParams.get('type') as string;
        const userId = request.user?._id.toString();
        if(type != 'standalone' && type != 'playlist_entry' && type != 'all') return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        const libraries = await Library
        .aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    type:type == 'all'?{$in: ['standalone', 'playlist_entry']}:type,
                    isStarred: true
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "videoId",
                    foreignField: "_id",
                    as: "videoDetails"
                }
            },
            {
                $unwind: "$videoDetails"
            },
            {
                $addFields: {
                    videoDetails: {
                        $mergeObjects: ["$videoDetails", { libraryId: "$_id", status: "$status", isStarred: "$isStarred", playlistId: "$playlistId" }]
                    }
                }
            },
            {
                $lookup: {
                    from: "playlists",
                    localField: "playlistId",
                    foreignField: "_id",
                    as: "playlistDetails"
                }
            },
            {
               //if playlistId is null then playlistDetails will be empty array else it will be playlistDetails[0]
               $addFields: {
                   playlistDetails: {
                       $cond: {
                           if: { $eq: ["$playlistId", null] },
                           then: null,
                           else: { $arrayElemAt: ["$playlistDetails", 0] }
                       }
                   }
               }
            },
            {
                $project: {
                    videoId:0,
                    playlistId:0,

                }
            }
        ])
        if(!libraries || libraries.length == 0) return NextResponse.json({ message: "No starred videos found" }, { status: 404 });
        return NextResponse.json({ data: libraries, message: "starred videos fetched successfully" }, { status: 200 });
    }
    catch (error) {
        
    }
}
export async function POST(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const { libraryId } = await request.json();
        if (!libraryId) return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        const library = await Library.findById(libraryId);
        if (!library) return NextResponse.json({ message: "Video not found" }, { status: 404 });
        if (library.userId.toString() != request.user?._id.toString()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        library.isStarred = !library.isStarred;
        await library.save();
        return NextResponse.json({ data: library, message: library.isStarred ? "Video starredd successfully" : "Video unfavorited successfully" }, { status: 200 });

    } catch (error) {
        console.log("Error favouriting video in library", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}