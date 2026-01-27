import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Particles from '@/components/Particles';
import ProjectCard from '@/components/projects/ProjectCard';
import { Project } from '@/data/projectsData';

/**
 * ProjectsGrid Component
 *
 * Main grid container with 3D depth layers, mouse parallax, scroll parallax,
 * and card reveal animations. Renders projects in a responsive grid with
 * different depth layers (front, mid, back) and manages parallax effects.
 *
 * Features:
 * - Depth layer system with scale and z-index
 * - Mouse parallax (desktop only)
 * - Scroll parallax
 * - Card reveal animations using Intersection Observer
 * - Background particle field
 * - Performance optimized with throttling and RAF
 */

interface ProjectsGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

// Depth layer configuration
const DEPTH_CONFIG = {
  1: { scale: 1.0, parallaxMultiplier: 10, scrollMultiplier: 1.0, zIndex: 30 },
  2: { scale: 0.95, parallaxMultiplier: 5, scrollMultiplier: 0.8, zIndex: 20 },
  3: { scale: 0.9, parallaxMultiplier: 2, scrollMultiplier: 0.6, zIndex: 10 },
} as const;

export default function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  // Mouse parallax state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [isFinePointer, setIsFinePointer] = useState(false);

  // Refs for performance optimization
  const rafIdRef = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Detect fine pointer (mouse) vs coarse pointer (touch)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Mouse parallax tracking (throttled to 60fps with RAF)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isFinePointer) return;

      // Cancel previous RAF if still pending
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const offsetX = e.clientX - centerX;
        const offsetY = e.clientY - centerY;

        setMousePosition({ x: offsetX, y: offsetY });
        rafIdRef.current = null;
      });
    },
    [isFinePointer]
  );

  // Scroll tracking
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  // Setup mouse and scroll listeners
  useEffect(() => {
    if (isFinePointer) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [handleMouseMove, handleScroll, isFinePointer]);

  // Intersection Observer for card reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute('data-card-id');
            if (cardId && !revealedCards.has(cardId)) {
              setRevealedCards((prev) => new Set(prev).add(cardId));
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger at 30% visibility
        rootMargin: '0px',
      }
    );

    // Observe all card elements
    cardRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [projects, revealedCards]);

  // Calculate parallax transform for a given depth
  const getParallaxTransform = (depth: 1 | 2 | 3, index: number) => {
    const config = DEPTH_CONFIG[depth];

    // Mouse parallax (only on fine pointer devices)
    const mouseX = isFinePointer
      ? (mousePosition.x / window.innerWidth) * config.parallaxMultiplier
      : 0;
    const mouseY = isFinePointer
      ? (mousePosition.y / window.innerHeight) * config.parallaxMultiplier
      : 0;

    // Scroll parallax
    const scrollOffset = scrollY * (1 - config.scrollMultiplier);

    // Combine transforms using translate3d for GPU acceleration
    return {
      transform: `translate3d(${mouseX}px, ${mouseY - scrollOffset}px, 0) scale(${config.scale})`,
      zIndex: config.zIndex,
    };
  };

  // Framer Motion variants for card reveal animation
  const getCardVariants = (depth: 1 | 2 | 3, index: number) => {
    const targetScale = DEPTH_CONFIG[depth].scale;

    return {
      hidden: {
        opacity: 0,
        y: 60,
        scale: 0.9,
        rotateX: 10,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: targetScale,
        rotateX: 0,
        transition: {
          duration: 0.8,
          delay: index * 0.2, // Stagger by 200ms
          ease: [0.25, 0.1, 0.25, 1], // ease-out
        },
      },
    };
  };

  return (
    <div className="relative w-full">
      {/* Background Particles */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
        <Particles
          particleCount={200}
          particleColors={['#ffffff', '#9333ea', '#a78bfa']}
          alphaParticles={true}
          particleBaseSize={80}
          sizeRandomness={1}
          speed={0.1}
          disableRotation={false}
        />
      </div>

      {/* Ambient Gradient Overlay */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
          zIndex: 0,
        }}
      />

      {/* Grid Container */}
      <div
        ref={gridRef}
        className="relative max-w-6xl mx-auto px-6 py-16 mb-20"
        style={{ perspective: '1000px' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const isRevealed = revealedCards.has(project.id);
            const parallaxStyle = getParallaxTransform(project.depth, index);
            const variants = getCardVariants(project.depth, index);

            return (
              <motion.div
                key={project.id}
                ref={(el) => {
                  if (el) {
                    cardRefs.current.set(project.id, el);
                  } else {
                    cardRefs.current.delete(project.id);
                  }
                }}
                data-card-id={project.id}
                className="relative"
                style={{
                  ...parallaxStyle,
                  willChange: isFinePointer ? 'transform' : 'auto',
                  transition: 'transform 0.1s linear', // Smooth parallax movement
                }}
                initial="hidden"
                animate={isRevealed ? 'visible' : 'hidden'}
                variants={variants}
              >
                <ProjectCard
                  project={project}
                  onClick={() => onProjectClick(project)}
                  parallaxOffset={
                    isFinePointer
                      ? {
                          x: (mousePosition.x / window.innerWidth) * DEPTH_CONFIG[project.depth].parallaxMultiplier,
                          y: (mousePosition.y / window.innerHeight) * DEPTH_CONFIG[project.depth].parallaxMultiplier,
                        }
                      : { x: 0, y: 0 }
                  }
                  depth={project.depth}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
