import { authMiddleware } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server"
import Video from "@/models/video.model";
import youtube from "@/config/ytapiconfig";
import { getYoutubeTranscript } from "@/utils/getYoutubeTranscript";
export const GET = async (request: NextRequest) => {
    try {
        const auth = await authMiddleware(request);
        if(auth.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const youtubeId = request.nextUrl.searchParams.get("v");
        if(!youtubeId) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        let video = await Video.findOne({ youtubeId });
        if(!video){
         const response = await youtube.videos.list({
             part: ['snippet', 'contentDetails'],
             id: [youtubeId]
         })
         if(response.data?.items?.length === 0) {
            return NextResponse.json({error: "Video not found"}, {status: 404})
         }
         const data = {
            youtubeId: youtubeId,
            title: response.data?.items?.[0]?.snippet?.title,
            channelName: response.data?.items?.[0]?.snippet?.channelTitle,
            thumbnailUrl: response.data?.items?.[0]?.snippet?.thumbnails?.maxres?.url || response.data?.items?.[0]?.snippet?.thumbnails?.standard?.url || response.data?.items?.[0]?.snippet?.thumbnails?.high?.url || response.data?.items?.[0]?.snippet?.thumbnails?.medium?.url || response.data?.items?.[0]?.snippet?.thumbnails?.default?.url,
            duration: response.data?.items?.[0]?.contentDetails?.duration,
            publishedAt: response.data?.items?.[0]?.snippet?.publishedAt,
         }
            video = await Video.create({
                youtubeId: youtubeId,
                title: data.title,
                channelName: data.channelName,
                thumbnailUrl: data.thumbnailUrl,
                duration: typeof data.duration === 'string' ? Number(data.duration.match(/PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?/)?.slice(1).reduce((acc: number, v: string, i: number) => acc + (v ? parseInt(v) * [3600, 60, 1][i] : 0), 0)) : data.duration,
                publishedAt: new Date(data.publishedAt!)
            });
        }
        if(video.transcript) {
            return NextResponse.json({ message: "Transcript fetched successfully"}, {status: 200})
        }
        if(video.formattedTranscript) {
            return NextResponse.json({ message: "Formatted transcript fetched successfully"}, {status: 200})
        }
        const { success,transcript, formattedTranscript, error } = await getYoutubeTranscript(youtubeId);
        if (!success) return NextResponse.json({ error: error || "Sorry, the transcript is not available" }, { status: 500 });
        if(transcript) {
            video.transcript = transcript;
        }
        if(formattedTranscript) {
            video.formattedTranscript = formattedTranscript;
        }
        await video.save();
        return NextResponse.json({ message: "Transcript fetched successfully" }, { status: 200 });
    } catch (error) {
        console.log("Error fetching transcript", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}   