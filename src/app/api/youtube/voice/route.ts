import { authMiddleware } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server"
import Video from "@/models/video.model";
import youtube from "@/config/ytapiconfig";
import { getYoutubeTranscript } from "@/utils/getYoutubeTranscript";
import { getVoiceSystemPrompt } from "@/config/voiceSystemPrompt";
import {GoogleGenerativeAI} from '@google/generative-ai'
import Voice from "@/models/voice.model";
import User from "@/models/user.model";

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
        if(video.transcript && video.transcript.length > 0) {
            console.log("Transcript", video.transcript)
            const voice = await Voice.create({
                videoId: video._id,
                chatTitle: video.title,
                userId: request.user?._id
            })
            return NextResponse.json({ message: "Transcript fetched successfully", voiceId: voice._id }, {status: 200})
        }
        if(video.formattedTranscript) {
            console.log("Formatted transcript", video.formattedTranscript)
            const voice = await Voice.create({
                videoId: video._id,
                chatTitle: video.title,
                userId: request.user?._id
            })
            return NextResponse.json({ message: "Formatted transcript fetched successfully", voiceId: voice._id }, {status: 200})
        }
        const { success,transcript, formattedTranscript, error } = await getYoutubeTranscript(youtubeId);
        console.log("Transcript", transcript)
        console.log("Formatted transcript", formattedTranscript)
        if (!success) return NextResponse.json({ error: error || "Sorry, the transcript is not available" }, { status: 500 });
        if(transcript) {
            video.transcript = transcript;
        }
        if(formattedTranscript) {
            video.formattedTranscript = formattedTranscript;
        }
        await video.save();
        const voice = await Voice.create({
            videoId: video._id,
            chatTitle: video.title,
            userId: request.user?._id
        })
        return NextResponse.json({ message: "Transcript fetched successfully", voiceId: voice._id }, { status: 200 });
    } catch (error) {
        console.log("Error fetching transcript", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const POST = async (request: NextRequest)=>{
    try {
        const auth = await authMiddleware(request);
        if(auth.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const {voiceId, question} = await request.json()
        if(!voiceId || !question) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        const voice = await Voice.findOne({ _id: voiceId });
        if(!voice) return NextResponse.json({ error: "Voice not found" }, { status: 404 });
        const video = await Video.findOne({ _id: voice.videoId });
        if(!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });
        const user = await User.findById(request.user?._id);
        if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if(user.creditsUsed >= 5) {
            return NextResponse.json({ error: "Credits limit exceeded" }, { status: 400 });
        }
        if(voice?.chats?.length >= 10) {
            return NextResponse.json({ error: "Chat limit exceeded" }, { status: 400 });
        }
        voice.chats.push({
            role: "user",
            content: question,
        })
        const systemPrompt = getVoiceSystemPrompt(JSON.stringify(video.transcript) || video.formattedTranscript || "");
        const client = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        const model = client.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemPrompt
        })
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        }
        const chatSession = model.startChat({generationConfig})
        const response = await chatSession.sendMessage(question)
        const responseText = response.response.candidates?.[0].content.parts?.[0].text
        if(!responseText) return NextResponse.json({ error: "No response" }, { status: 500 });
        voice.chats.push({
            role: "assistant",
            content: responseText
        })
        if(voice.chats.length == 2){
            if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
            user.creditsUsed += 1;
            await user.save();
        }
        await voice.save();
        return NextResponse.json({ message: responseText }, { status: 200 });
    } catch (error) {
        console.log("Error fetching transcript", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

