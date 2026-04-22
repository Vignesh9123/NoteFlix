// import { Innertube } from "youtubei.js";
// import { parseStringPromise } from 'xml2js';
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

// export const getYoutubeTranscript = async (videoId: string, language: string = 'en'): Promise<GetYoutubeTranscriptResponse> => {
//     const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
//     try {
//       const html = await fetch(videoUrl).then(res => res.text());
//       const apiKeyMatch = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
//       if (!apiKeyMatch) throw new Error("INNERTUBE_API_KEY not found.");
//       const apiKey = apiKeyMatch[1];
    
//       const playerData = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${apiKey}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           context: {
//             client: {
//               clientName: "ANDROID",
//               clientVersion: "20.10.38"
//             }
//           },
//           videoId
//         })
//       }).then(res => res.json());
    
//       const tracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
//       if (!tracks) throw new Error("No captions found.");
//       // eslint-disable-next-line
//       let track = tracks.find((t: any) => t.languageCode === language);
//       if (!track) {
//         const defaultLanguageCode = tracks[0].languageCode;
//         // eslint-disable-next-line
//         track = tracks.find((t: any) => t.languageCode === defaultLanguageCode);
//       }
//       if (!track) {
//         throw new Error("No captions found.");
//       }
    
//       const baseUrl = track.baseUrl.replace(/&fmt=\w+$/, "");
    
//       const xml = await fetch(baseUrl).then(res => res.text());
//       const parsed = await parseStringPromise(xml);
//       // eslint-disable-next-line
//       const transcript =  parsed.transcript.text.map((entry:any) => ({
//             text: entry._,
//             start_ms: parseFloat(String(entry.$.start * 1000)),
//             end_ms: parseFloat(String(entry.$.start * 1000)) + parseFloat(String(entry.$.dur * 1000))
//         }));
//       // eslint-disable-next-line
//       const formattedTranscript = transcript.map((entry:any) => (entry.text)).join(' ');
    
//       return {
//           success: true,
//           transcript,
//           formattedTranscript
//       }
//     } catch (error) {
//       console.error(error);
//       return {
//         success: false,
//         error: "Failed to fetch transcript"
//       }
//     }
//   }

const fetchSupadataTranscript = async (videoId: string)=>{
  const myHeaders = new Headers();
myHeaders.append("accept", "*/*");
myHeaders.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8");
myHeaders.append("cache-control", "no-cache");
myHeaders.append("content-type", "text/plain;charset=UTF-8");
myHeaders.append("pragma", "no-cache");
myHeaders.append("priority", "u=1, i");
myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-platform", "\"Windows\"");


const raw = `{\r\n    \"url\": \"https://www.youtube.com/watch?v=${videoId}\",\r\n    \"type\": \"transcript\",\r\n    \"apiKey\": \"\",\r\n    \"options\": {\r\n        \"lang\": \"auto\",\r\n        \"text\": false,\r\n        \"mode\": \"native\"\r\n    }\r\n}`;

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow" as RequestRedirect
};

return fetch("https://supadata.ai/api/run", requestOptions)
  .then((response) => response.json())
  .then((result) => result)
}

export const getYoutubeTranscript = async(videoId: string): Promise<GetYoutubeTranscriptResponse> =>{
    try {
        const transcript_content = await fetchSupadataTranscript(videoId)
        let transcript = null;
        let formatedTranscript = null;
        if(transcript_content?.success){
          if(transcript_content?.result?.content && transcript_content?.result?.content instanceof Array){
            // eslint-disable-next-line
            transcript = transcript_content?.result?.content.map((segment: any) => ({
              text: segment.text,
              start_ms: parseFloat((segment.offset)),
              end_ms: parseFloat((segment.offset + segment.duration))
            }))
            // eslint-disable-next-line
            formatedTranscript = transcript.map((segment: any) => (segment.text)).join(' ')
          }
          else if(transcript_content?.result?.content && (transcript_content?.result?.content instanceof String || typeof transcript_content?.result?.content === 'string')){
            transcript = [{
              text: transcript_content?.result?.content,
              start_ms: 0,
              end_ms: 0
            }]
            formatedTranscript = transcript_content?.result?.content
          }
          else{
            return {
              "success": false
            }
          }
          return {
            "success": true,
            "transcript": transcript,
            "formattedTranscript": formatedTranscript,
          }

        }
        else{
          return {
            "success": false
          }
        }
    } catch (error) {
        console.error(error)
        return {
          "success": false
        }
    }
}