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
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        fontSize: isModal ? '12px' : '10px',
        letterSpacing: '0.1em',
        color: categoryColor,
        background: `${categoryColor}12`,
        border: `1px solid ${categoryColor}40`,
        borderRadius: '3px',
        padding: isModal ? '5px 12px' : '3px 8px',
        whiteSpace: 'nowrap',
      }}
      whileHover={
        isModal
          ? {
              scale: 1.04,
              background: `${categoryColor}22`,
              boxShadow: `0 0 12px ${categoryColor}30`,
            }
          : undefined
      }
      transition={{
        duration: 0.15,
        ease: 'easeOut',
      }}
    >
      {name}
    </motion.div>
  );
}
