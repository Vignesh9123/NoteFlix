import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";
import Library from "@/models/library.model";
import connectDB from "@/dbConfig/connectDB";
import mongoose from "mongoose";
connectDB();
export async function POST(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { id }: { id: string } = await request.json();
        const video = await Library
        .aggregate([
            {
                        $match: {
                            userId: request.user?._id,
                            type: "standalone",
                            videoId: new mongoose.Types.ObjectId(id)
                        },
                    },
                    {
                        $lookup: {
                            from: "videos",
                            localField: "videoId",
                            foreignField: "_id",
                            as: "videoDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$videoDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "notes",
                            localField: "userNotes",
                            foreignField: "_id",
                            as: "userNotes",
                        },
                    },
                    {
                        $addFields: {
                            videoDetails: "$videoDetails",
                        },
                    },
                    {
                        $project: {
                            videoId: 0,
                        },
                    },
            ]);
        if (video.length == 0) return NextResponse.json({ error: "Video not found in library" }, { status: 404 });
        return NextResponse.json({ data: video }, { status: 200 });
    } catch (error) {
        console.log("Error getting video from library", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
