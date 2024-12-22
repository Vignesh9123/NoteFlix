import { NextResponse, NextRequest } from "next/server";
import Video from "@/models/video.model";
import Library from "@/models/library.model";
import connectDB from "@/dbConfig/connectDB";
import { authMiddleware } from "@/middleware/auth.middleware";
connectDB();
export async function POST(request: NextRequest){
   try {
     const auth = await authMiddleware(request);
     if(auth.status === 401){
         return NextResponse.json({error: "Unauthorized"}, {status: 401})
     }
     const {youtubeId, title, channelName, thumbnailUrl, duration, publishedAt, playlistId, isStandalone} = await request.json();
     if(!youtubeId || !title || !channelName || !thumbnailUrl || !duration || !publishedAt || !isStandalone){
         return NextResponse.json({error: "Invalid request"}, {status: 400})
     }
     const video = await Video.findOne({youtubeId});
     let newVideo;
     if(!video){
         newVideo = await Video.create({youtubeId, title, channelName, thumbnailUrl, duration: Number(duration), publishedAt: new Date(publishedAt)});
     }
     else{
         newVideo = video;
     }
     const existingLibrary = await Library.findOne({userId: request?.user?._id, videoId: newVideo._id, type: isStandalone ? "standalone" : "playlist_entry", playlistId: isStandalone ? null : playlistId});
     if(existingLibrary){
        return NextResponse.json({error: "Video already exists in library"}, {status: 400})
     }
     const library = await Library.create({userId: request?.user?._id, videoId: newVideo._id, type: isStandalone ? "standalone" : "playlist_entry", playlistId: isStandalone ? null : playlistId, userNotes: [], watchProgress: {lastWatchedTimestamp: 0, percentageWatched: 0}, tags: [], status: "to_watch", rating: 0, addedAt: new Date(), lastUpdated: new Date()});
     return NextResponse.json({data: library, message: "Video added successfully"}, {status: 201})
   } catch (error) {
    console.log("Error adding video", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500})
   }
}