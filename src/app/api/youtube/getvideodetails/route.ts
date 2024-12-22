import youtube from "@/config/ytapiconfig";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";
export async function POST(request: NextRequest) {
   try {
    const auth = await authMiddleware(request);
    if(auth.status === 401) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
     const { videoId } = await request.json();
     const response = await youtube.videos.list({
         part: ['snippet', 'contentDetails'],
         id: [videoId]
     })
     if(response.data?.items?.length === 0) {
        return NextResponse.json({error: "Video not found"}, {status: 404})
     }
     const data = {
        youtubeId: videoId,
        title: response.data?.items?.[0]?.snippet?.title,
        channelName: response.data?.items?.[0]?.snippet?.channelTitle,
        thumbnailUrl: response.data?.items?.[0]?.snippet?.thumbnails?.high?.url,
        duration: response.data?.items?.[0]?.contentDetails?.duration,
        publishedAt: response.data?.items?.[0]?.snippet?.publishedAt,
     }
     return NextResponse.json({data, message: "Video details fetched successfully"}, {status: 200})
   } catch (error) {
    console.log("Error fetching video details", error)
    return NextResponse.json({error: "Internal Server Error"}, {status: 500})
   }
}
