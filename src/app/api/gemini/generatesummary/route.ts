import { NextRequest, NextResponse } from "next/server";
import {GoogleGenerativeAI} from '@google/generative-ai'
import { authMiddleware } from "@/middleware/auth.middleware";
import Video from "@/models/video.model";
import User from "@/models/user.model";
import { getAIModelWithSystemPrompt, generationConfig } from "@/config/aiModel";

export async function POST(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { videoId }:{ videoId: string} = await request.json();
        const video = await Video.findOne({youtubeId: videoId});
        if (!video) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
        const user = await User.findById(request.user?._id);
        if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if(video.summary) {
            user.creditsUsed += 1;
            await user.save();
            return NextResponse.json({ data: video.summary, message: "Summary generated successfully" }, { status: 200 });
        }
        const transcript = video.transcript;
        if (!transcript) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
        const formattedTranscript = video.formattedTranscript || transcript.map((segment) => segment.text).join(' ');
        const model = getAIModelWithSystemPrompt()
        const chatSession = model.startChat({generationConfig});
        const response = await chatSession.sendMessage(formattedTranscript + '\nSummarize the given transcript of a video titled '+ video.title + ' to a format in english like : <h2>Title of the summary,</h2><p>this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:</p><pre><code class="language-css">body {display: none;}</code></pre><p>I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.</p><blockquote><p>Wow, that’s amazing. Good work, boy! 👏 <br>— Momma</p><p><s>dddd Burt np</s></p></blockquote><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>flour</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>baking powder</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>salt</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>sugar</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>milk</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>eggs</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>butter</p></div></li></ul><p></p><pre><code class="language-js">console.log("Hello world");</code></pre><p></p>Don\'t add \'\'\'html to the response and please dont add any other text except html and you can also generate tasklist as provided for any todos, please dont add \'\'\'html to the response');
        let summary = response.response.candidates?.[0].content.parts?.[0].text
        summary = summary?.replaceAll('```html', '')
        summary = summary?.replaceAll('```', '') 
        summary = summary?.replaceAll('`','')
        video.summary = summary!;
        await video.save();
        user.creditsUsed += 1;
        await user.save();
        

        return NextResponse.json({ data: summary , message: "Summary generated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}