import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";
import youtube from "@/config/ytapiconfig";
import connectDB from "@/dbConfig/connectDB";
connectDB();

export async function GET(req: NextRequest) {
    try{
        const auth = await authMiddleware(req);
        if(auth.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const query = req.nextUrl.searchParams.get("q");
        const response = await youtube.search.list({
            part:["snippet"],
            maxResults:20,
            q:query!        
        }, {params: {type:'video'}});
        const videosWithDuration = await Promise.all(
            response.data.items?.map(async (video: any) => {
                try {
                    const durationRes = await youtube.videos.list({
                        part: ["contentDetails"],
                        id: video.id.videoId
                    });
                    return {
                        ...video,
                        contentDetails: durationRes.data.items?.[0]?.contentDetails
                    };
                } catch (error) {
                    console.log("Error fetching video duration", error);
                    return video;
                }
            }) || []
        );
        const videos = videosWithDuration.map((video: any) => ({
            id: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
            duration: video.contentDetails?.duration || null,
            publishedAt: video.snippet.publishedAt
        }));
        return NextResponse.json({data: videos }, { status: 200 });
    }
    catch(error){
        console.log("Error fetching videos", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}