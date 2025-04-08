'use client'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/config/config';
import { Loader2, Download, Mic, Trash, X, Send } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast';
import {motion} from 'framer-motion'
type Props = {
  className?: string;
  timerClassName?: string;
  setFinalTexts: (value: React.SetStateAction<string>)=>void;
  setInterimTexts: (value: React.SetStateAction<string>)=>void;
  onSubmit: () => void;
};

type Record = {
  id: number;
  name: string;
  file: any;
};

let recorder: MediaRecorder;
let recordingChunks: BlobPart[] = [];
let timerTimeout: NodeJS.Timeout;

const padWithLeadingZeros = (num: number, length: number): string => {
  return String(num).padStart(length, "0");
};

// Utility function to download a blob
const downloadBlob = (blob: Blob) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `Audio_${new Date().getMilliseconds()}.mp3`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};


function Page() {
  const { voiceId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [interimTexts, setInterimTexts] = useState("");
  const [finalTexts, setFinalTexts] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const [messages, setMessages] = useState<{
    role: "user" | "assistant";
    message: string;
  }[]>([]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const onSubmit = async () => {
    if (!finalTexts) return;
    if(messages.length >= 10){
      toast.error("You can only have 10 messages")
      setFinalTexts("")
      return
    }
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        message: finalTexts,
      },
    ]);
    setFinalTexts("");

    try {
      setReplyLoading(true);
      const response = await api.post(`/youtube/voice`, {
        voiceId,
        question: finalTexts,
      });

      const utterThis = new SpeechSynthesisUtterance(response.data.message);
      utterThis.lang = "en-US";
      utterThis.voice = window.speechSynthesis.getVoices()[0];
      utterThis.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterThis);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: response.data.message,
        },
      ]);

      setReplyLoading(false);
    } catch (error) {
      console.log("Error getting response", error);
      toast.error("Failed to get response, please try again later");
      setReplyLoading(false);
    }
  };

  useEffect(() => {
    if (!voiceId) {
      router.push("/voice");
      return;
    }
    setLoading(true);
    const checkTranscript = async () => {
      try {
        const response = await api.get(`/video/check-transcript?v=${voiceId}`);
        if (response.status !== 200) {
          router.push("/voice");
          return;
        }
        console.log("Response", response.data);
        setMessages(response.data.chats.map((chat: { role: string; content: string }) => ({
          role: chat.role,
          message: chat.content
        })));
      } catch (error) {
        console.log("Error checking transcript", error);
        router.push("/voice");
      } finally {
        setLoading(false);
      }
    };
    checkTranscript();
  }, [voiceId]);

  useEffect(()=>{
    return ()=>{
      if(window.speechSynthesis.speaking)
        window.speechSynthesis.cancel()
    }
  }, [])

  // Scroll to bottom on messages change
  useEffect(() => {
    if (!loading && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader2 className="animate-spin" />
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col-reverse h-[90vh]">
      <AudioRecorderWithVisualizer
        onSubmit={onSubmit}
        setFinalTexts={setFinalTexts}
        setInterimTexts={setInterimTexts}
      />

      <div className="p-2 m-2 border border-muted min-h-9">
        {finalTexts}
        <span className="text-muted-foreground">{interimTexts}</span>
      </div>

      <div
        ref={messagesContainerRef}
        className="p-2 m-2 border border-muted flex flex-col gap-2 overflow-y-auto flex-grow"
      >
        {messages.length === 0 &&<div className="flex justify-center h-full items-center">
          <p className="text-muted-foreground">No messages yet. Start a conversation by asking a question by pressing the mic button below</p>
        </div>}

        {messages.map((message, index) => (
          <div
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`mb-2 p-2 max-w-[80%] break-words rounded-md ${
              message.role === "assistant" ? "bg-muted" : "self-end"
            }`}
          >
            <p
              className={`font-bold ${
                message.role === "assistant"
                  ? "text-muted-foreground"
                  : "text-primary text-right"
              }`}
            >
              {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
            </p>

            {message.role === "assistant" &&
            index === messages.length - 1 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {message.message.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0)" }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {word + " "}
                  </motion.span>
                ))}
              </motion.p>
            ) : (
              <p className={message.role === "assistant" ? "" : " text-"}>
                {message.message}
              </p>
            )}
          </div>
        ))}
        {replyLoading && (
      <div className="mb-2 p-2 max-w-[80%] break-words rounded-md bg-muted">
        <p className="font-bold text-muted-foreground">Assistant</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="animate-spin" />
        </motion.p>
      </div>
    )}
      </div>
    </div>
  );
}

export default Page


const AudioRecorderWithVisualizer = ({
  className,
  timerClassName,
  setFinalTexts,
  setInterimTexts,
  onSubmit
}: Props) => {
  const { theme } = useTheme();
  // States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingFinished, setIsRecordingFinished] =
    useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [currentRecord, setCurrentRecord] = useState<Record>({
    id: -1,
    name: "",
    file: null,
  });
  // Calculate the hours, minutes, and seconds from the timer
  const hours = Math.floor(timer / 3600);
  const minutes = Math.floor((timer % 3600) / 60);
  const seconds = timer % 60;

  // Split the hours, minutes, and seconds into individual digits
  const [hourLeft, hourRight] = useMemo(
    () => padWithLeadingZeros(hours, 2).split(""),
    [hours]
  );
  const [minuteLeft, minuteRight] = useMemo(
    () => padWithLeadingZeros(minutes, 2).split(""),
    [minutes]
  );
  const [secondLeft, secondRight] = useMemo(
    () => padWithLeadingZeros(seconds, 2).split(""),
    [seconds]
  );
  // Refs
  const mediaRecorderRef = useRef<{
    stream: MediaStream | null;
    analyser: AnalyserNode | null;
    mediaRecorder: MediaRecorder | null;
    audioContext: AudioContext | null;
  }>({
    stream: null,
    analyser: null,
    mediaRecorder: null,
    audioContext: null,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<any>(null);
  const speechRecognitionRef = useRef<SpeechRecognition>(null)
 
  function startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          setIsRecording(true);
          // ============ Analyzing ============
          const AudioContext = window.AudioContext;
          const audioCtx = new AudioContext();
          const analyser = audioCtx.createAnalyser();
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          mediaRecorderRef.current = {
            stream,
            analyser,
            mediaRecorder: null,
            audioContext: audioCtx,
          };

          const mimeType = MediaRecorder.isTypeSupported("audio/mpeg")
            ? "audio/mpeg"
            : MediaRecorder.isTypeSupported("audio/webm")
              ? "audio/webm"
              : "audio/wav";

          const options = { mimeType };
          mediaRecorderRef.current.mediaRecorder = new MediaRecorder(
            stream,
            options
          );
          mediaRecorderRef.current.mediaRecorder.start();
          recordingChunks = [];
          // ============ Recording ============
          recorder = new MediaRecorder(stream);
          recorder.start();
          recorder.ondataavailable = (e) => {
            recordingChunks.push(e.data);
          };
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognitionRef.current = new SpeechRecognition()
    let recognition = speechRecognitionRef.current
    recognition.interimResults = true
    recognition.continuous = true
    recognition.onspeechend = (e)=>{
      console.log("Speech ended", e)
    }
    recognition.onend = (e)=>{
      console.log("Recognition ended", e)
    }
    recognition.onresult = (e)=>{
      console.log('Transcript', e.results[e.results.length-1][0].transcript)
      if(e.results[e.results.length-1].isFinal){
        setFinalTexts((prev)=>prev+e.results[e.results.length-1][0].transcript)
        setInterimTexts("")
      }
      else{
        // setInterimTexts((prev)=>{
        //   const prevString = prev
        //   const currentInterim = e.results[e.results.length-1][0].transcript
        //   // Find the difference between the previous and current interim
          
        // })
        setInterimTexts((prev) => {
          const prevString = prev;
          const currentInterim = e.results[e.results.length - 1][0].transcript;
        
          const getNewPart = (oldText: string, newText: string) => {
            if (!oldText) return newText;
        
            // Try to find the largest suffix of oldText that matches the prefix of newText
            for (let i = 0; i < oldText.length; i++) {
              const suffix = oldText.slice(i);
              if (newText.startsWith(suffix)) {
                return newText.slice(suffix.length);
              }
            }
        
            // If no matching suffix, assume everything is new
            return newText;
          };
        
          const newPart = getNewPart(prevString, currentInterim);
        
          return prevString + newPart;
        });
        
        
      }
    }
    recognition.onstart = ()=>{
      console.log("Starting recognition")
    }
    recognition.start();
  }
  function stopRecording() {
    recorder.onstop = () => {
      const recordBlob = new Blob(recordingChunks, {
        type: "audio/wav",
      });
      // downloadBlob(recordBlob);
      // setCurrentRecord({
      //   ...currentRecord,
      //   file: window.URL.createObjectURL(recordBlob),
      // });
      recordingChunks = [];
    };
    
    recorder.stop();
    speechRecognitionRef.current?.stop()


    setIsRecording(false);
    setIsRecordingFinished(true);
    setTimer(0);
    clearTimeout(timerTimeout);
  }
  function resetRecording() {
    const { mediaRecorder, stream, analyser, audioContext } =
    mediaRecorderRef.current;
    
    if (mediaRecorder) {
      mediaRecorder.onstop = () => {
        recordingChunks = [];
      };
      mediaRecorder.stop();
      let recognition = speechRecognitionRef.current
      recognition?.stop()
      setFinalTexts("")
    } else {
      alert("recorder instance is null!");
    }

    // Stop the web audio context and the analyser node
    if (analyser) {
      analyser.disconnect();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
    setIsRecording(false);
    setIsRecordingFinished(true);
    setTimer(0);
    clearTimeout(timerTimeout);

    // Clear the animation frame and canvas
    cancelAnimationFrame(animationRef.current || 0);
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasCtx = canvas.getContext("2d");
      if (canvasCtx) {
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      }
    }
  }
  const handleSubmit = () => {
    stopRecording();
    const { mediaRecorder, stream, analyser, audioContext } =
    mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.onstop = () => {
        recordingChunks = [];
      };
      mediaRecorder.stop();
      let recognition = speechRecognitionRef.current
      if(recognition) recognition?.stop()
    } else {
      alert("recorder instance is null!");
    }
    if (analyser) {
      analyser.disconnect();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
    onSubmit()
  };

  // Effect to update the timer every second
  useEffect(() => {
    if (isRecording) {
      timerTimeout = setTimeout(() => {
        setTimer(timer + 1);
      }, 1000);
    }
    return () => clearTimeout(timerTimeout);
  }, [isRecording, timer]);

  useEffect(()=>{
    let recognition = speechRecognitionRef.current
    if(!recognition) return
    
  }, [speechRecognitionRef.current])

  // Visualizer
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const drawWaveform = (dataArray: Uint8Array) => {
      if (!canvasCtx) return;
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.fillStyle = "#939393";

      const barWidth = 1;
      const spacing = 1;
      const maxBarHeight = HEIGHT / 2.5;
      const numBars = Math.floor(WIDTH / (barWidth + spacing));

      for (let i = 0; i < numBars; i++) {
        const barHeight = Math.pow(dataArray[i] / 128.0, 8) * maxBarHeight;
        const x = (barWidth + spacing) * i;
        const y = HEIGHT / 2 - barHeight / 2;
        canvasCtx.fillRect(x, y, barWidth, barHeight);
      }
    };

    const visualizeVolume = () => {
      if (
        !mediaRecorderRef.current?.stream?.getAudioTracks()[0]?.getSettings()
          .sampleRate
      )
        return;
      const bufferLength =
        (mediaRecorderRef.current?.stream?.getAudioTracks()[0]?.getSettings()
          .sampleRate as number) / 100;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!isRecording) {
          cancelAnimationFrame(animationRef.current || 0);
          return;
        }
        animationRef.current = requestAnimationFrame(draw);
        mediaRecorderRef.current?.analyser?.getByteTimeDomainData(dataArray);
        drawWaveform(dataArray);
      };

      draw();
    };

    if (isRecording) {
      visualizeVolume();
    } else {
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      }
      cancelAnimationFrame(animationRef.current || 0);
    }

    return () => {
      cancelAnimationFrame(animationRef.current || 0);
    };
  }, [isRecording, theme]);

  return (
    <div
      className={cn(
        "flex h-16 rounded-md relative w-full items-center justify-center gap-2 ",
        {
          "border p-1": isRecording,
          "border-none p-0": !isRecording,
        },
        className
      )}
    >
      {isRecording ? (
        <></>
        // <Timer
        //   hourLeft={hourLeft}
        //   hourRight={hourRight}
        //   minuteLeft={minuteLeft}
        //   minuteRight={minuteRight}
        //   secondLeft={secondLeft}
        //   secondRight={secondRight}
        //   timerClassName={timerClassName}
        // />
      ) : null}
      
      <canvas
        ref={canvasRef}
        className={`h-full w-full bg-background ${!isRecording ? "hidden" : "flex"
          }`}
      />
      <div className="flex gap-2">
        {/* ========== Delete recording button ========== */}
        {isRecording ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={resetRecording}
                size={"icon"}
                variant={"destructive"}
              >
                <X size={15} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="m-2">
              <span> Reset recording</span>
            </TooltipContent>
          </Tooltip>
        ) : null}

        {/* ========== Start and send recording button ========== */}
        <Tooltip>
          <TooltipTrigger asChild>
            {!isRecording ? (
              <Button onClick={() => startRecording()} size={"icon"}>
                <Mic size={15} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} size={"icon"}>
                <Send  size={15} />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent className="m-2">
            <span>
              {" "}
              {!isRecording ? "Start Chatting" : "Send recording"}{" "}
            </span>
          </TooltipContent>
        </Tooltip>
      </div>
      
    </div>
  );
};

const Timer = React.memo(
  ({
    hourLeft,
    hourRight,
    minuteLeft,
    minuteRight,
    secondLeft,
    secondRight,
    timerClassName,
  }: {
    hourLeft: string;
    hourRight: string;
    minuteLeft: string;
    minuteRight: string;
    secondLeft: string;
    secondRight: string;
    timerClassName?: string;
  }) => {
    return (
      <div
        className={cn(
          "items-center -top-12 left-0 absolute justify-center gap-0.5 border p-1.5 rounded-md font-mono font-medium text-foreground flex",
          timerClassName
        )}
      >
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {hourLeft}
        </span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {hourRight}
        </span>
        <span>:</span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {minuteLeft}
        </span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {minuteRight}
        </span>
        <span>:</span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {secondLeft}
        </span>
        <span className="rounded-md bg-background p-0.5 text-foreground ">
          {secondRight}
        </span>
      </div>
    );
  }
);
Timer.displayName = "Timer";

/*
[
    {
        "role": "user",
        "message": "what does the speaker have to say mainly in this video"
    },
    {
        "role": "assistant",
        "message": "The speaker discusses various aspects of getting into the web3 industry, including the importance of contributing to open-source projects, learning niche skills, and networking. They also share their personal experiences of working at Backpack and building a crypto exchange. Additionally, the speaker emphasizes the value of continuous learning, adapting to industry changes, and focusing on being exceptionally good at one specific skill. They also provide insights on finding companies to contribute to, the importance of grants, and platforms for job searching. (00:00)\n"
    }
]
*/