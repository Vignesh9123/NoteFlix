'use client'
import { Button } from "@/components/ui/button";
import { FaYoutube, FaStar, FaSearch } from "react-icons/fa";
import { MdNoteAdd, MdSummarize, MdExplore } from "react-icons/md";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {useAuth} from "@/context/AuthContext"
import Link from "next/link";
export default function VidScribeLanding() {
  const [descriptionIndex, setDescriptionIndex] = useState(0);
  const {user,loading} = useAuth()
  const descriptions = [
    "Your personalized YouTube library to curate playlists.",
    "Take rich-text notes with timestamps.",
    "Summarize videos with AI and explore new content.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDescriptionIndex((prevIndex) => (prevIndex + 1) % descriptions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col items-center justify-center p-8">
      <div className="w-full flex justify-center md:justify-end mb-6 md:mb-0">
        {
          loading ? <Button className="px-6 py-3 w-32 h-8 animate-pulse text-lg bg-blue-500 hover:bg-blue-700 rounded-2xl shadow-lg">
          
          </Button>:
        user ? <Link href={'/dashboard'} className="px-6 py-3  text-lg bg-blue-500 hover:bg-blue-700 rounded-2xl shadow-lg">
          Dashboard
        </Link> : <Link href={'/login'}><Button className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-700 rounded-2xl shadow-lg">
          Get Started
        </Button>
        </Link>
        }
      </div>
      <motion.h1 whileHover={{scale:1.1}} transition={{ease:"easeInOut", duration:1}} className="text-5xl font-bold text-center mb-6 text-primary">
        {user ? `Welcome to VidScribe, ${user.name?.split(' ')[0]? user.name?.split(' ')[0] :user.name}` : "Welcome to VidScribe"}
      </motion.h1>
      <motion.p 
        className="text-lg text-center max-w-3xl mb-8"
        key={descriptionIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.5, duration: 1.5 }}
      >
        {descriptions[descriptionIndex].split(" ").map((word, i) => (
          <motion.span key={i} className="inline-block mr-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: i * 0.2 }}>
            {word}
          </motion.span>
        ))}
      </motion.p>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 my-12">
        <div className="w-96 h-56 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
          Placeholder for Image
        </div>
        <div className="w-96 h-56 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
          Placeholder for Video
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <FeatureCard icon={<FaYoutube size={50} />} title="Add Videos" description="Save your favorite YouTube videos to your library with ease." />
        <FeatureCard icon={<MdNoteAdd size={50} />} title="Rich Notes" description="Add timestamped notes with rich text formatting." />
        <FeatureCard icon={<MdSummarize size={50} />} title="AI Summarization" description="Get AI-generated summaries of your videos." highlight={true} />
        <FeatureCard icon={<FaStar size={50} />} title="Star Favorites" description="Highlight your top picks and access them quickly." />
        <FeatureCard icon={<FaSearch size={50} />} title="Search Videos" description="Find and add videos directly from YouTube." />
        <FeatureCard icon={<MdExplore size={50} />} title="Explore Content" description="Discover videos similar to your favorites." />
      </div>
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description, highlight }: { icon: React.ReactNode; title: string; description: string; highlight?: boolean }) {
  return (
    <motion.div 
      className={`bg-[#111c35] p-6 rounded-2xl shadow-lg flex flex-col items-center text-blue-400 ${highlight ? 'border-4 border-blue-500' : ''}`}
      whileHover={{ scale: 1.1, rotate: 1 }}
      transition={{ type: "spring", stiffness: 150 }}
    >
      <motion.div animate={{ rotate: highlight ? 360 : 0 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
        <div className="mb-4 text-blue-400">{icon}</div>
      </motion.div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function Footer() {
  return (
    <div className="w-full bg-[#111c35] text-center py-6 mt-10 text-gray-400">
      © 2025 VidScribe. All rights reserved.
    </div>
  );
}
