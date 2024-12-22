import { NextRequest, NextResponse } from "next/server";
import {authMiddleware} from "@/middleware/auth.middleware";
import Library from "@/models/library.model";

export async function GET(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const videos = await Library.aggregate([
            {
                $match: {
                    userId: request.user?._id,
                    type: "standalone",
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
        
        return NextResponse.json({data: videos}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});

    }
}
