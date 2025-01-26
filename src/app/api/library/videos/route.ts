import { NextRequest, NextResponse } from "next/server";
import {authMiddleware} from "@/middleware/auth.middleware";
import Library from "@/models/library.model";
import connectDB from "@/dbConfig/connectDB";
import  mongoose  from "mongoose";
connectDB();

export async function GET(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const currentPage = request.nextUrl.searchParams.get("currentPage") || 1;
        const limit = 8;
        const skip = (limit * ( Number(currentPage)-1));
        
        const title = request.nextUrl.searchParams.get("title");
        const status = request.nextUrl.searchParams.get("status");
        const isStarred = request.nextUrl.searchParams.get("isStarred");
        const type = request.nextUrl.searchParams.get("type");
        const duration = request.nextUrl.searchParams.get("duration");
        const playlistId = request.nextUrl.searchParams.get("playlistId");

        const filter: any = { userId: request.user?._id, type: "standalone" };

        if (title) filter["videoDetails.title"] = { $regex: title, $options: "i" };
        if (status) filter.status = status;
        if (isStarred) filter.isStarred = isStarred === "starred";
        if (type) filter.type = type;
        if (duration) {
          filter["videoDetails.duration"] =
            duration === "short"
              ? { $lt: 300 }
              : duration === "medium"
              ? { $gte: 300, $lt: 1200 }
              : { $gte: 1200 };
        }
        if (playlistId) filter.playlistId = playlistId;

        const videos = await Library.aggregate([
            {
                $lookup: {
                    from: "videos",
                    localField: "videoId",
                    foreignField: "_id",
                    as: "videoDetails",
                }
            },
            {
                $match: filter
            },
            {
                $unwind: "$videoDetails"
            },
            {
                $addFields: {
                    videoDetails: {
                        $mergeObjects: [
                            "$videoDetails",
                            { 
                                libraryId: "$_id", 
                                status: "$status", 
                                isStarred: "$isStarred" 
                            }
                        ]
                    }
                }
            },
            {
                $project: {
                    videoId: 0,
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);
        
        const total = await Library
        .aggregate([
            {
                $lookup: {
                    from: "videos",
                    localField: "videoId",
                    foreignField: "_id",
                    as: "videoDetails",
                }
            },
            {
                $match: filter
            },
            {
                $count: "total"
            }
        ]);
        if(total.length == 0) return NextResponse.json({data: [], total: 0, totalPages: 0, message: "No videos found"}, {status: 200});
        const totalPages = Math.ceil(total[0].total / limit);
        return NextResponse.json({data: videos, total, totalPages,message: "Videos fetched successfully"}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});

    }
}

export async function PATCH(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const {id, status} = await request.json();
        const library = await Library.findById(id);
        if(!library) return NextResponse.json({error: "Library not found"}, {status: 404});
        if(library.userId.toString() != request.user?._id.toString()) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        library.status = status;
        await library.save();
        return NextResponse.json({data: library}, {status: 200});
    } catch (error) {
        console.log("Error updating video status in library", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}

export async function DELETE(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const {id}:{id: string} = await request.json();
        const library = await Library.findById(id);
        if(!library) return NextResponse.json({error: "Library not found"}, {status: 404});
        if(library.userId.toString() != request.user?._id.toString()) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        await Library.findOneAndDelete({_id: new mongoose.Types.ObjectId(id)});
        return NextResponse.json({data: library}, {status: 200});
    } catch (error) {
        console.log("Error deleting video from library", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}
