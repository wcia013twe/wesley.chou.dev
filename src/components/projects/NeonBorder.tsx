import { motion } from 'motion/react';
import { ReactNode } from 'react';

/**
 * NeonBorder Component
 *
 * A wrapper component that adds an animated neon border effect to its children.
 * Supports pulsing opacity animation and optional rotating gradient effect for modals.
 *
 * @param children - Content to wrap with neon border
 * @param color - Border color in hex format (e.g., '#9333ea')
 * @param animated - Enable pulse animation (opacity 0.5 → 0.7 → 0.5, 3s cycle)
 * @param className - Additional CSS classes to apply to the wrapper
 * @param rotating - Enable rotating gradient effect for modal (4s infinite)
 */

interface NeonBorderProps {
  children: ReactNode;
  color: string;
  animated?: boolean;
  className?: string;
  rotating?: boolean;
}

export default function NeonBorder({
  children,
  color,
  animated = false,
  className = '',
  rotating = false,
}: NeonBorderProps) {
  // Convert hex color to RGB for shadow effects
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 147, g: 51, b: 234 }; // Default to purple
  };

  const rgb = hexToRgb(color);
  const shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${shadowColor}`,
      }}
      animate={
        animated
          ? {
              borderColor: [
                `${color}80`, // 50% opacity
                `${color}b3`, // 70% opacity
                `${color}80`, // 50% opacity
              ],
            }
          : undefined
      }
      transition={
        animated
          ? {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined
      }
    >
      {/* Static gradient effect for modal */}
      {rotating && (
        <div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${color} 50%, transparent 100%)`,
            opacity: 0.3,
            zIndex: -1,
          }}
        />
      )}

      {children}
    </motion.div>
  );
}
