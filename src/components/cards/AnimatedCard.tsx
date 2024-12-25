import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../ui/card';

interface AnimatedCardProps {
  title: string;
  value: number;
  index: number;
}

export function AnimatedCard({ title, value, index }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
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
      className="w-[25%]"
    >
      <Card className="flex flex-col gap-4 items-center transform-gpu hover:shadow-lg transition-shadow">
        <CardHeader className="text-lg font-bold">{title}</CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-full text-2xl font-bold">
            {value}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}