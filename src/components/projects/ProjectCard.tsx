import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Project } from '@/data/projectsData';
import TechPill from './TechPill';
import NeonBorder from './NeonBorder';

/**
 * ProjectCard Component
 *
 * An enhanced 3D card component with neon borders, parallax effects, and hover interactions.
 * Features:
 * - Depth-based scaling (1.0, 0.95, 0.9)
 * - Mouse position-based tilt (±3deg)
 * - Particle trail emission on hover
 * - Sequential tech pill brightening
 * - Glassmorphic styling with neon accents
 *
 * @param project - Project data from projectsData.ts
 * @param depth - Depth layer (1, 2, or 3) for z-index and scale
 * @param parallaxOffset - Mouse-based offset from parent grid { x, y }
 * @param onClick - Handler for opening project modal
 */

interface ProjectCardProps {
  project: Project;
  depth: number;
  parallaxOffset: { x: number; y: number };
  onClick: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export default function ProjectCard({
  project,
  depth,
  parallaxOffset,
  onClick,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Depth-based scale
  const depthScale = depth === 1 ? 1.0 : depth === 2 ? 0.95 : 0.9;

  // Mouse position tracking for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth tilt following
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    damping: 15,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    damping: 15,
    stiffness: 150,
  });

  // Parse badge color to hex
  const getBadgeColorHex = (colorClass: string): string => {
    const colorMap: Record<string, string> = {
      'text-indigo-300': '#a5b4fc',
      'text-blue-300': '#93c5fd',
      'text-lime-300': '#bef264',
      'text-red-300': '#fca5a5',
      'text-purple-300': '#d8b4fe',
    };
    return colorMap[colorClass] || '#a5b4fc';
  };

  const badgeColorHex = getBadgeColorHex(project.badgeColor);

  // Handle mouse move for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to [-0.5, 0.5] range
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  // Emit particles on hover entry
  useEffect(() => {
    if (isHovered && particles.length === 0) {
      const newParticles: Particle[] = [];
      const particleCount = 6;

      // Generate particles from card corners
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: Math.random() > 0.5 ? 10 : 90, // Left or right edge
          y: Math.random() > 0.5 ? 10 : 90, // Top or bottom edge
          delay: i * 50, // Stagger emission
        });
      }

      setParticles(newParticles);

      // Clear particles after animation completes
      setTimeout(() => setParticles([]), 700);
    }
  }, [isHovered]);

  // Reset mouse position on hover exit
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer focus:outline-none"
      aria-label={`View details for ${project.title}`}
      style={{
        scale: depthScale,
        x: parallaxOffset.x,
        y: parallaxOffset.y,
      }}
      whileHover={{
        scale: depthScale * 1.03,
        z: 40,
      }}
      animate={{
        rotateX: isHovered ? rotateX.get() : 0,
        rotateY: isHovered ? rotateY.get() : 0,
      }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 150,
      }}
    >
      {/* Focus ring for accessibility */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-500 ring-offset-2 ring-offset-black opacity-0 focus-visible:opacity-100 transition-opacity pointer-events-none z-10" />

      {/* Neon border wrapper */}
      <NeonBorder
        color={badgeColorHex}
        animated={true}
        className="w-full h-full rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md shadow-xl shadow-purple-500/10 flex flex-col"
      >
        {/* Image section (top 60%) */}
        <div className="relative flex-[6] overflow-hidden min-h-0">
          <motion.img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1.0,
            }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

          {/* Featured badge */}
          {project.badge && (
            <motion.div
              className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${project.badgeColor} bg-black/80 backdrop-blur-sm`}
              style={{
                border: `2px solid ${badgeColorHex}`,
                boxShadow: `0 10px 15px -3px ${badgeColorHex}60`,
              }}
              animate={{
                boxShadow: [
                  `0 10px 15px -3px ${badgeColorHex}60`,
                  `0 10px 15px -3px ${badgeColorHex}ff`,
                  `0 10px 15px -3px ${badgeColorHex}60`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Featured
            </motion.div>
          )}
        </div>

        {/* Content section (bottom 40%) */}
        <div className="relative flex-[4] p-5 bg-black/40 flex flex-col min-h-0">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {project.title}
          </h3>

          {/* Date with calendar icon */}
          <div className="flex items-center gap-2 mb-4 text-sm text-white/60">
            <Calendar className="w-4 h-4" />
            <time dateTime={project.date}>{project.date}</time>
          </div>

          {/* Tech pills container - horizontal scrollable */}
          <div className="relative flex-1 overflow-hidden">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {project.tech.map((tech, index) => (
                <motion.div
                  key={`${tech.name}-${index}`}
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: isHovered ? 1 : 1,
                    scale: isHovered ? 1.02 : 1,
                    borderColor: isHovered ? tech.category : tech.category,
                  }}
                  transition={{
                    delay: isHovered ? index * 0.05 : 0,
                    duration: 0.2,
                  }}
                >
                  <TechPill
                    name={tech.name}
                    category={tech.category}
                    variant="card"
                  />
                </motion.div>
              ))}
            </div>

            {/* Fade gradient at right edge */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Particle trail effect */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '4px',
              height: '4px',
              backgroundColor: badgeColorHex,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: 0,
              scale: 0.5,
              x: (particle.x > 50 ? 1 : -1) * (20 + Math.random() * 10),
              y: (particle.y > 50 ? 1 : -1) * (20 + Math.random() * 10),
            }}
            transition={{
              duration: 0.6,
              delay: particle.delay / 1000,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Enhanced shadow on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              boxShadow: `0 25px 50px -12px ${badgeColorHex}30`,
            }}
          />
        )}
      </NeonBorder>
    </motion.button>
  );
}
