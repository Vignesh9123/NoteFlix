import { NextRequest, NextResponse } from "next/server";
import {authMiddleware} from "@/middleware/auth.middleware";
import Library from "@/models/library.model";

export async function GET(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        
        const videos = await Library
        .aggregate([
            {
                $match: {userId: request.user?._id, type: "standalone"}
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
                $project: {
                    videoId: 0,
                }
            }
        ])
        return NextResponse.json({data: videos}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});

    }
}

export async function DELETE(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const {id} = await request.json();
        const library = await Library.findById(id);
        if(!library) return NextResponse.json({error: "Library not found"}, {status: 404});
        if(library.userId.toString() != request.user?._id.toString()) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        await Library.findByIdAndDelete(id);
        return NextResponse.json({data: library}, {status: 200});
    } catch (error) {
        console.log("Error deleting video from library", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}
