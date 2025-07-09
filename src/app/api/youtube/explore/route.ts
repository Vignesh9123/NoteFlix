import {NextRequest, NextResponse} from "next/server";
import Library from "@/models/library.model";
import Video from "@/models/video.model";
import {authMiddleware} from "@/middleware/auth.middleware";
import connectDB from "@/dbConfig/connectDB";
import youtube from "@/config/ytapiconfig";
connectDB();

export async function GET(req: NextRequest) {
    try {
        const auth = await authMiddleware(req);
        if(auth.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const response = await Library
        .find({userId: req.user?._id, isStarred: true})
        .populate({path: "videoId",model: Video, populate: {path: "channelName"}});
        const starredVideosChannels = response.map((library:any) => library.videoId.channelName);
        // const query = starredVideos.sort(() => Math.random() - 0.5).join(" ").split("|").sort(() => Math.random() - 0.5).join(" ");
        // starredVideos.sort(() => Math.random() - 0.5) ;
        const uniqueStarredVideosChannels = Array.from(new Set(starredVideosChannels));
        const starredVideos = uniqueStarredVideosChannels.sort(() => Math.random() - 0.5);
        console.log({starredVideos});
        const res = await Promise.all(
            starredVideos.map(async (channelName: string, index: number) => {
                if(index > 2) return null;
                return await youtube.search.list({
                    part: ["snippet"],
                    maxResults: 5,
                    q: channelName,
                    type:"video"
                }, {params: {type:'video'}});
            })
        )
        res.filter((res: any) => res !== null);
        // console.log(res.data.items);
        const videosWithDuration = await Promise.all(
            res.flatMap((res: any) => res?.data.items?.map(async(video: any) => {
                if(video.id.playlistId) return null;
                try {
                    if(video.id.videoId === undefined) return null;
                    const durationRes = await youtube.videos.list({
                        part: ["contentDetails"],
                        id: video.id.videoId,
                    });
                    return {
                        ...video,
                        contentDetails: durationRes.data.items?.[0]?.contentDetails
                    };
                } catch (error) {
                    console.log("Error fetching video duration", error);
                    return video;
                }
            }) || [])
        );
        const videos = videosWithDuration.map((video: any) => {
            if(!video) return null;
            return (
                {
            
                    youtubeId: video.id.videoId,
                    title: video.snippet.title,
                    description: video.snippet.description,
                    channelName: video.snippet.channelTitle,
                    thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
                    duration:  Number(String(video.contentDetails?.duration).match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)?.slice(1).reduce((acc: number, v: string, i: number) => acc + (v ? parseInt(v) * [3600, 60, 1][i] : 0), 0))|| null,
                    publishedAt: video.snippet.publishedAt
                }    
            )
            });
        return NextResponse.json({data: videos }, { status: 200 });
    } catch (error) {
        console.log("Error fetching videos", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}