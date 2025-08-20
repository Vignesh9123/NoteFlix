import { NextRequest } from "next/server";
// import fs from "fs";
// import {GoogleGenerativeAI} from '@google/generative-ai'
// import { authMiddleware } from "@/middleware/auth.middleware";
export async function POST(_request: NextRequest) {
    return;
    // try {
    //     const auth = await authMiddleware(request);
    //     if(auth.status == 401){
    //         return NextResponse.json({error: "Unauthorized"}, {status: 401})
    //     }
    //     const {videoId}:{videoId: string} = await request.json();
    //     const base64Audio = fs.readFileSync(`public/${videoId}.mp3`);
    //     const base64AudioString = base64Audio.toString('base64');
    //     const client = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    //     const model = client.getGenerativeModel({
    //         model: "gemini-2.0-flash"
    //     })
    //     const generationConfig = {
    //         temperature: 1,
    //         topP: 0.95,
    //         topK: 40,
    //         maxOutputTokens: 8192,
    //         responseMimeType: "text/plain",
    //     }
    //     // const chatSession = model.startChat({generationConfig});
    //     const result = await model.generateContent(
    //         [
    //             {
    //                 inlineData: {
    //                     mimeType: "audio/mp3",
    //                     data: base64AudioString,
    //                 },
    //             },
    //             {text:'Transcribe the audio given into one full string in English.'}
    //         ]
    //     )
        
    //     return NextResponse.json({ data:result.response.candidates?.[0].content.parts?.[0].text, message: "Summary extracted successfully" }, { status: 200 });
    // } catch (error) {
        
    // }
}