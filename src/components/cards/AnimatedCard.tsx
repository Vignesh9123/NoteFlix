import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../ui/card';

interface AnimatedCardProps {
  title: string;
  value: number;
  index: number;
  loading: boolean;
}

export function AnimatedCard({ title, value, index,loading  }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 , filter:'blur(10px)' }}
      animate={{ opacity: 1, scale: 1 , filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.5,
        delay: index * 0.3,
        type: "spring",
        damping: 12,
        stiffness: 100
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className={`w-[80%] ${index == 2 ? "md:col-span-2 lg:col-span-1 md:w-[90%] lg:w-[80%]" : ""}`}
    >
      <Card className="flex flex-col gap-4 items-center transform-gpu hover:shadow-lg transition-shadow">
        <CardHeader className="text-lg font-bold">{title}</CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-full text-2xl font-bold">
            {loading ? <div className='h-6 w-4 animate-pulse bg-muted'></div>: value}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}