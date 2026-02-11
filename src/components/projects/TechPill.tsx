import { motion } from 'motion/react';

/**
 * TechPill Component
 *
 * A glowing pill component that displays technology names with category-based color coding.
 * Features gradient background with bottom border accent in category color.
 *
 * @param name - Technology name (e.g., "React", "Python", "MongoDB")
 * @param category - Technology category determining border color
 * @param variant - Display variant: 'card' (no hover) or 'modal' (with hover effects)
 */

export type TechCategory = 'frontend' | 'backend' | 'database' | 'ai' | 'devops';

interface TechPillProps {
  name: string;
  category: TechCategory;
  variant?: 'card' | 'modal';
}

/**
 * Category color mapping from design specification
 */
const techColors: Record<TechCategory, string> = {
  frontend: '#9333ea',  // Purple (React, Next.js, TypeScript, Tailwind)
  backend: '#3b82f6',   // Blue (Python, FastAPI, Node.js, Express)
  database: '#10b981',  // Green (MongoDB, Firebase, SQLite, Supabase)
  ai: '#ec4899',        // Pink (Gemini, TensorFlow, OpenCV)
  devops: '#f59e0b',    // Orange (Docker, APIs, Websockets)
};

export default function TechPill({
  name,
  category,
  variant = 'card'
}: TechPillProps) {
  const categoryColor = techColors[category];
  const isModal = variant === 'modal';

  return (
    <motion.div
      className={`
        relative
        bg-gradient-to-r from-gray-800/50 to-gray-700/50
        border border-white/10
        rounded-full
        whitespace-nowrap
        ${isModal ? 'px-4 py-2.5 text-sm font-medium' : 'px-3 py-1 text-xs'}
        text-white/80
      `}
      style={{
        borderBottom: `2px solid ${categoryColor}`,
      }}
      whileHover={
        isModal
          ? {
              scale: 1.05,
              backgroundColor: 'rgba(75, 85, 99, 0.6)', // from-gray-700/60 to-gray-600/60
              boxShadow: `0 10px 15px -3px ${categoryColor}30`,
            }
          : undefined
      }
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
    >
      {name}
    </motion.div>
  );
}
