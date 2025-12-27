// import { Innertube } from "youtubei.js";
import { parseStringPromise } from 'xml2js';
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
// This version is obselete now
// export const getYoutubeTranscript = async (videoId: string): Promise<GetYoutubeTranscriptResponse> => {
//     try {
//         const youtube = await Innertube.create();
//         const info = await youtube.getInfo(videoId);
//         try {
//             console.log("Info", info)
//             const transcript = await info.getTranscript();
//             console.log("Transceopt", transcript)
//             const timeStampedTranscript = transcript?.transcript?.content?.body?.initial_segments?.map((segment) => ({
//                 start_ms: Number(segment.start_ms),
//                 end_ms: Number(segment.end_ms),
//                 text: segment.snippet.text
//             }));
//             console.log('Timestamped Transcript', timeStampedTranscript)
//             const formattedTranscript = transcript?.transcript?.content?.body?.initial_segments
//                 ?.map((segment) => segment.snippet.text)
//                 .join(' ');
//             return { success: true, transcript: timeStampedTranscript, formattedTranscript };
//         } catch(e) {
//             console.log("Caption error", e);
//             const captionURL = info.captions?.caption_tracks?.[0]?.base_url;
//             if (!captionURL) {
//                 return { success: false, error: "Failed to fetch transcript" };
//             }
//             try {
//                 console.log('Caption response:', captionURL);
//                 const response = await fetch(captionURL);
//                 const data = await response.text();
//                 console.log('Caption data:', data);
//                 const transcriptText = data.match(/<text[^>]*>(.*?)<\/text>/g)
//                     ?.map(tag => tag.replace(/<\/?text[^>]*>/g, '').trim())
//                     .join(' ');
//                 return { success: true, formattedTranscript: transcriptText };
//             } catch {
//                 return { success: false, error: "Failed to fetch transcript" };
//             }
//         }
//     } catch {
//         return { success: false, error: "Failed to fetch transcript" };
//     }
// }

export const getYoutubeTranscript = async (videoId: string, language: string = 'en'): Promise<GetYoutubeTranscriptResponse> => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
    try {
      const html = await fetch(videoUrl).then(res => res.text());
      const apiKeyMatch = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
      if (!apiKeyMatch) throw new Error("INNERTUBE_API_KEY not found.");
      const apiKey = apiKeyMatch[1];
    
      const playerData = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "ANDROID",
              clientVersion: "20.10.38"
            }
          },
          videoId
        })
      }).then(res => res.json());
    
      const tracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      if (!tracks) throw new Error("No captions found.");
      let track = tracks.find((t: any) => t.languageCode === language);
      if (!track) {
        const defaultLanguageCode = tracks[0].languageCode;
        track = tracks.find((t: any) => t.languageCode === defaultLanguageCode);
      }
      if (!track) {
        throw new Error("No captions found.");
      }
    
      const baseUrl = track.baseUrl.replace(/&fmt=\w+$/, "");
    
      const xml = await fetch(baseUrl).then(res => res.text());
      const parsed = await parseStringPromise(xml);
        const transcript =  parsed.transcript.text.map((entry:any) => ({
            text: entry._,
            start_ms: parseFloat(String(entry.$.start * 1000)),
            end_ms: parseFloat(String(entry.$.start * 1000)) + parseFloat(String(entry.$.dur * 1000))
        }));
        const formattedTranscript = transcript.map((entry:any) => (entry.text)).join(' ');
    
        return {
          success: true,
          transcript,
          formattedTranscript
        }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Failed to fetch transcript"
      }
    }
  }