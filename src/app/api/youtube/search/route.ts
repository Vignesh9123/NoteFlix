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
            // eslint-disable-next-line
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
        // eslint-disable-next-line
        const videos = videosWithDuration.map((video: any) => ({
            youtubeId: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            channelName: video.snippet.channelTitle,
            thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
            duration:  Number(String(video.contentDetails.duration).match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)?.slice(1).reduce((acc: number, v: string, i: number) => acc + (v ? parseInt(v) * [3600, 60, 1][i] : 0), 0))|| null,
            publishedAt: video.snippet.publishedAt
        }));
        return NextResponse.json({data: videos }, { status: 200 });
    }
    catch(error){
        console.log("Error fetching videos", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}