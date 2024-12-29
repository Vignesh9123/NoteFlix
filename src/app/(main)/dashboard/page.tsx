'use client'
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedCard } from '@/components/cards/AnimatedCard';

function App() {
  // TODO: Stats fetching
  const cards = [
    { title: 'Playlists', value: 10 },
    { title: 'Videos', value: 10 },
    { title: 'Hours Completed', value: 10 },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-around w-full mt-10 gap-6">
        <AnimatePresence>
          {cards.map((card, index) => (
            <AnimatedCard
              key={card.title}
              title={card.title}
              value={card.value}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;