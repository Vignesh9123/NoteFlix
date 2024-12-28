import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {GoogleGenerativeAI} from '@google/generative-ai'
import Video from "@/models/video.model";
import connectDB from '@/dbConfig/connectDB'
connectDB();
export async function POST(request: NextRequest) {
    let videoId: string;
    try {
        ({videoId} = await request.json());
        const video = await Video.findOne({youtubeId: videoId});
        if(!video) {
            return NextResponse.json({error: "Video not found"}, {status: 404});
        }
        if(video?.summary) {
            if(fs.existsSync(`public/${videoId}.mp3`)) {
                fs.unlinkSync(`public/${videoId}.mp3`);
            }
            return NextResponse.json({data: video.summary, message: "Summary generated successfully"}, {status: 200});
        }
        const base64Audio = fs.readFileSync(`public/${videoId}.mp3`);
        const base64AudioString = base64Audio.toString('base64');
        const client = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        const model = client.getGenerativeModel({
            model: "gemini-1.5-flash"
        })
       
        const result = await model.generateContent(
            [
                {
                    inlineData: {
                        mimeType: "audio/mp3",
                        data: base64AudioString,
                    },
                },
                {text:'Summarize the given audio to a format like : <h2>Title,</h2><p>this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:</p><pre><code class="language-css">body {display: none;}</code></pre><p>I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.</p><blockquote><p>Wow, that’s amazing. Good work, boy! 👏 <br>— Momma</p><p><s>dddd Burt np</s></p></blockquote><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>flour</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>baking powder</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>salt</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>sugar</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>milk</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>eggs</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>butter</p></div></li></ul><p></p><pre><code class="language-js">console.log("Hello world");</code></pre><p></p>Don\'t add \'\'\'html to the response and please dont add any other text except html and you can also generate tasklist as provided for any todos, please dont add \'\'\'html to the response '}
            ]
        )
        let summary = result.response.candidates?.[0].content.parts?.[0].text;
        summary = summary?.replaceAll('```html','')
        summary = summary?.replaceAll('```','')
        summary = summary?.replaceAll('`','')
        video.summary = summary!;
        await video.save();
        if(fs.existsSync(`public/${videoId}.mp3`)) {
            fs.unlinkSync(`public/${videoId}.mp3`);
        }
        return NextResponse.json({ data:summary, message: "Summary extracted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        if(fs.existsSync(`public/${videoId!}.mp3`)) {
            fs.unlinkSync(`public/${videoId!}.mp3`);
        }
        return NextResponse.json({ error: error }, { status: 500 });
    }
}