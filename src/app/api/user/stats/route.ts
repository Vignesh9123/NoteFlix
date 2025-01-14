import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";
import connectDB from "@/dbConfig/connectDB";
import Playlist from "@/models/playlist.model";
import Library from "@/models/library.model";
connectDB();
export async function GET(request: NextRequest) {
    try {
        
        const auth = await authMiddleware(request);
        if (auth.status == 401) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const userId = request.user?._id.toString();
        const playlistCount = await Playlist.countDocuments({ userId });
        const videoCount = await Library.countDocuments({ userId, type: "standalone" });
        const starredCount = await Library.countDocuments({ userId, isStarred:true });
        return NextResponse.json({
            data: {
                playlistCount,
                videoCount,
                starredCount
            },
            message: "Stats fetched successfully",
        }, {
            status: 200
        })
    } catch (error) {
        console.log("Error in fetching stats", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

}