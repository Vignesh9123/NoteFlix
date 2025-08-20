import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/note.model";
import { authMiddleware } from "@/middleware/auth.middleware";
import connectDB from "@/dbConfig/connectDB";
import mongoose from "mongoose";
connectDB();

export async function GET(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const id = request.nextUrl.searchParams.get("id") as string;
        const note = await Note
        .aggregate([
            {
                $match: {_id: new mongoose.Types.ObjectId(id)}
            },
            {
                $lookup: {
                    from: "libraries",
                    localField: "libraryId",
                    foreignField: "_id",
                    as: "library"
                }
            },
            {
                $unwind: "$library"
            },
            {
                $lookup: {
                    from:"videos",
                    localField: "library.videoId",
                    foreignField: "_id",
                    as: "videoDetails",
                    pipeline: [
                        {
                            $project: {
                                summary: 0
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from:"playlists",
                    localField: "library.playlistId",
                    foreignField: "_id",
                    as: "playlistDetails",
                }
            },
            {
                $addFields: {
                    library: {
                        $mergeObjects: ["$library", { videoDetails: { $arrayElemAt: ["$videoDetails", 0]}, playlistDetails: { $arrayElemAt: ["$playlistDetails", 0]} }]
                    }
                }   
            },
            
            {
                $project: {
                    _id: 0,
                    note: {
                        _id: '$_id',
                        title: '$title',
                        text: '$text',
                        timestamp: '$timestamp'
                    },
                    library: 1
                    // "library.video.summary": 1
                }
            }
        ])
        if(note.length == 0) return NextResponse.json({error: "Note not found"}, {status: 404})
        return NextResponse.json({data: note[0], message: "Note fetched successfully"}, {status: 200})
    } catch {
        return NextResponse.json({ error: "Error fetching note" }, { status: 500 });
    }
}