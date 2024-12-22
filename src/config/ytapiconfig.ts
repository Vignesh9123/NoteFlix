import { google } from "googleapis";

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
})

export default youtube;