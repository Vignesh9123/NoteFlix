'use client'
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedCard } from '@/components/cards/AnimatedCard';
import { api } from '@/config/config';
import toast from 'react-hot-toast';
function App() {
  const [playlistCount, setPlaylistCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const cards = [
    { title: 'Playlists', value: playlistCount },
    { title: 'Videos', value: videoCount },
    { title: 'Hours Completed', value: 0 },
  ];
  useEffect(() => {
    setLoading(true);
    api.get('/user/stats').then((res) => {
      setPlaylistCount(res.data.data.playlistCount);
      setVideoCount(res.data.data.videoCount);
    })
    .catch((err) => toast.error(err.response.data.message || "Something went wrong, please try again later."))
    .finally(() => setLoading(false));

  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 place-items-center w-full mt-10 gap-6">
        <AnimatePresence>
          {cards.map((card, index) => (
            <AnimatedCard
              key={card.title}
              title={card.title}
              value={card.value}
              index={index}
              loading={loading}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;