import Library from "@/models/library.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { id }: { id: string } = await request.json();
        const videos = await Library
        .aggregate([
            {
                $match: {
                    playlistId: id
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
                        $mergeObjects: ["$videoDetails", { libraryId: "$_id" }]
                    }
                }
            }
        ])
        if(videos.length == 0) return NextResponse.json({message: "No videos found"}, {status: 404});
        return NextResponse.json({data: videos, message: "Playlist videos fetched successfully"}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
