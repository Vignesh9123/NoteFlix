import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeToSeconds(timeString: string): number {
  const timeParts = timeString.split(':').map(Number);
  
  if (timeParts.length === 3) {
    // Format is HH:MM:SS
    const [hours, minutes, seconds] = timeParts;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (timeParts.length === 2) {
    // Format is MM:SS
    const [minutes, seconds] = timeParts;
    return minutes * 60 + seconds;
  } else {
    return 0;
  }
}

export function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
export function extractVideoId(youtubeUrl: string): string | null {
  try {
    const url = new URL(youtubeUrl);
    let videoId = url.searchParams.get("v");
  
    if (!videoId && url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1);
    } else if (!videoId && url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.split("/")[2];
    } else if (!videoId && url.pathname.startsWith("/v/")) {
      videoId = url.pathname.split("/")[2];
    }
    else if(!videoId && url.pathname.startsWith("/shorts/")){
      videoId = url.pathname.split("/")[2];
    }
  
    return videoId || null;
  } catch (error) {
    return null;
  }
}

export function convertHtmlTextToPlainText(htmlText: string): string {
  const doc = new DOMParser().parseFromString(htmlText, 'text/html');
  return doc.body.textContent || "Unknown Title";
}