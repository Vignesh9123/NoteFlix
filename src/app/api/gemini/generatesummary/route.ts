import { NextRequest, NextResponse } from "next/server";
import {GoogleGenerativeAI} from '@google/generative-ai'
import { authMiddleware } from "@/middleware/auth.middleware";

export async function POST(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { transcript }:{transcript: string} = await request.json();
        if (!transcript) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
        const client = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        const model = client.getGenerativeModel({
            model: "gemini-1.5-flash"
        })
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        }
        const chatSession = model.startChat({generationConfig});
const response = await chatSession.sendMessage(transcript + 'Summarize the above text to a format like : <h2>Hi there,</h2><p>this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:</p><pre><code class=\"language-css\">body {display: none;}</code></pre><p>I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.</p><blockquote><p>Wow, that’s amazing. Good work, boy! 👏 <br>— Momma</p><p><s>dddd Burt np</s></p></blockquote><ul data-type=\"taskList\"><li data-checked=\"true\" data-type=\"taskItem\"><label><input type=\"checkbox\" checked=\"checked\"><span></span></label><div><p>flour</p></div></li><li data-checked=\"true\" data-type=\"taskItem\"><label><input type=\"checkbox\" checked=\"checked\"><span></span></label><div><p>baking powder</p></div></li><li data-checked=\"true\" data-type=\"taskItem\"><label><input type=\"checkbox\" checked=\"checked\"><span></span></label><div><p>salt</p></div></li><li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>sugar</p></div></li><li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>milk</p></div></li><li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>eggs</p></div></li><li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>butter</p></div></li></ul><p></p><pre><code class=\"language-js\">console.log(\"Hello world\");</code></pre><p></p>  Don\'t add \'\'\'html to the response also add todo\'s in the form of tasklist if required please don\'t add \'\'\'html to the response also use formatting only as specified in above html sample don\'t add any `(backticks) in this');
        return NextResponse.json({ data: response.response.candidates?.[0].content.parts?.[0].text }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}