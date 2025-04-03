import { Innertube } from "youtubei.js";
import { YT } from "youtubei.js"

interface GetYoutubeTranscriptResponse {
    success: boolean;
    transcript?: {
        start_ms: number;
        end_ms: number;
        text: string | undefined;
    }[]
    error?: string;
    formattedTranscript?: string
}
export const getYoutubeTranscript = async (videoId: string): Promise<GetYoutubeTranscriptResponse> => {
    try {
        const youtube = await Innertube.create();
        const info = await youtube.getInfo(videoId);
        try {
            const transcript = await info.getTranscript();
            const timeStampedTranscript = transcript?.transcript?.content?.body?.initial_segments?.map((segment) => ({
                start_ms: Number(segment.start_ms),
                end_ms: Number(segment.end_ms),
                text: segment.snippet.text
            }));
            console.log('Timestamped Transcript', timeStampedTranscript)
            const formattedTranscript = transcript?.transcript?.content?.body?.initial_segments
                ?.map((segment) => segment.snippet.text)
                .join(' ');
            return { success: true, transcript: timeStampedTranscript, formattedTranscript };
        } catch (error) {
            const captionURL = info.captions?.caption_tracks?.[0]?.base_url;
            if (!captionURL) {
                return { success: false, error: "Failed to fetch transcript" };
            }
            try {
                const response = await fetch(captionURL);
                const data = await response.text();
                console.log('Caption data:', data);
                const transcriptText = data.match(/<text[^>]*>(.*?)<\/text>/g)
                    ?.map(tag => tag.replace(/<\/?text[^>]*>/g, '').trim())
                    .join(' ');
                return { success: true, formattedTranscript: transcriptText };
            } catch (fetchError) {
                return { success: false, error: "Failed to fetch transcript" };
            }
        }
    } catch (error) {
        return { success: false, error: "Failed to fetch transcript" };
    }
}