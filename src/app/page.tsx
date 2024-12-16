"use client";
import React, { useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { useAuth } from "@/context/AuthContext";
export default function Home() {
  const { user } = useAuth();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  return (
    <>
      <div
        className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] relative pt-10 overflow-clip"
        ref={ref}
    >
      <GoogleGeminiEffect
        title={user ? `Welcome to VidScribe, ${user?.name?.split(" ")[0]}` : "Welcome to VidScribe" }
        description="Transform how you watch YouTube videos with personalized playlists, time-stamped notes, and content organization all in one place."        
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
       
    </>
  );
}
