import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState, useRef } from 'react';
import { Project } from '@/data/projectsData';

const MONO = 'ui-monospace, SFMono-Regular, monospace';
const GOLD = '#f0b429';

const techColors: Record<string, string> = {
  frontend: '#9333ea',
  backend:  '#3b82f6',
  database: '#10b981',
  ai:       '#ec4899',
  devops:   '#f59e0b',
};

interface ProjectCardProps {
  project: Project;
  depth: number;
  parallaxOffset: { x: number; y: number };
  onClick: () => void;
  glowColor?: string;
}

export default function ProjectCard({ project, parallaxOffset, onClick, glowColor }: ProjectCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), { damping: 20, stiffness: 200 });

  const accent = glowColor ?? '#22d3ee';
  const missionId = `MSN-${project.id.toUpperCase().slice(0, 4)}`;
  const visibleTech = project.tech.slice(0, 4);
  const extra = project.tech.length - 4;

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left - r.width / 2) / r.width);
    mouseY.set((e.clientY - r.top - r.height / 2) / r.height);
  };

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
      className="relative w-full cursor-pointer focus:outline-none text-left"
      style={{ x: parallaxOffset.x, y: parallaxOffset.y, perspective: '800px' }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      aria-label={`View details for ${project.title}`}
    >
      <motion.div style={{ rotateX: isHovered ? rotateX : 0, rotateY: isHovered ? rotateY : 0 }}>
        {/* Shell */}
        <div style={{
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
          position: 'relative',
        }}>
          {/* Blur fill */}
          <div className="absolute inset-0" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
          {/* Tint */}
          <div className="absolute inset-0" style={{ background: 'rgba(4,6,20,0.92)' }} />
          {/* Border */}
          <div className="absolute inset-0" style={{ border: `1px solid ${accent}28` }} />

          {/* Hover ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: `radial-gradient(ellipse at 19% 0%, ${accent}14 0%, transparent 65%)` }}
          />

          {/* Corner reticles */}
          <span className="absolute top-0 left-0 h-px w-8"  style={{ background: `linear-gradient(90deg,  ${accent}, transparent)` }} />
          <span className="absolute top-0 left-0 w-px h-6"  style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }} />
          <span className="absolute bottom-0 right-0 h-px w-8" style={{ background: `linear-gradient(270deg, ${accent}, transparent)` }} />
          <span className="absolute bottom-0 right-0 w-px h-6" style={{ background: `linear-gradient(0deg,   ${accent}, transparent)` }} />

          <div className="relative z-10">

            {/* Horizontal flex row */}
            <div style={{ display: 'flex', flexDirection: 'row', minHeight: '160px' }}>

              {/* LEFT: image column */}
              <div style={{ width: '38%', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                {project.imageUrl ? (
                  <motion.img
                    src={project.imageUrl}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: MONO, fontSize: '9px', color: `${accent}40`, letterSpacing: '0.2em',
                  }}>
                    NO IMG
                  </div>
                )}
                {/* Right-edge vignette to blend into content */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `linear-gradient(to right, transparent 60%, rgba(4,6,20,0.55) 100%)`,
                }} />
                {/* Left-side corner reticles only */}
                <span className="absolute top-2 left-2 h-px w-4" style={{ background: `${accent}b0` }} />
                <span className="absolute top-2 left-2 w-px h-3" style={{ background: `${accent}b0` }} />
                <span className="absolute bottom-2 left-2 h-px w-4" style={{ background: `${accent}b0` }} />
                <span className="absolute bottom-2 left-2 w-px h-3" style={{ background: `${accent}70` }} />
                {/* Featured corner ribbon */}
                {project.badge && (
                  <div style={{
                    position: 'absolute', top: '2px', left: '-44px',
                    width: '96px', textAlign: 'center',
                    background: GOLD, color: '#000',
                    fontFamily: MONO, fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '4px 0',
                    transform: 'rotate(-45deg)',
                    boxShadow: `0 2px 10px rgba(0,0,0,0.5)`,
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}>
                    ★ FEAT
                  </div>
                )}
              </div>

              {/* SEPARATOR: 1px vertical */}
              <div style={{ width: '1px', flexShrink: 0, background: `${accent}20`, alignSelf: 'stretch' }} />

              {/* RIGHT: content column */}
              <div style={{ flex: 1, minWidth: 0, padding: '12px 16px', display: 'flex', flexDirection: 'column', transform: 'translateZ(0)', WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}>

                {/* Sub-header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '9px' }}>
                  <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.22em', color: `${accent}70`, textTransform: 'uppercase', flexShrink: 0 }}>
                    {missionId}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.16em', color: `${accent}45`, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {project.date}
                  </span>
                </div>

                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <motion.span
                    style={{ width: 5, height: 5, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}`, flexShrink: 0 }}
                    animate={{ opacity: [1, 0.15, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <h3 style={{
                    fontFamily: MONO, fontSize: '16px', fontWeight: 700, color: '#fff',
                    letterSpacing: '0.05em', flex: 1, margin: 0, textTransform: 'uppercase',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {project.title}
                  </h3>
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: MONO, fontSize: '11px', lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)', margin: '0 0 8px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                }}>
                  {project.description}
                </p>

                {/* Bottom row */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  {/* Tech tags */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center', minWidth: 0 }}>
                    {visibleTech.map((tech) => {
                      const c = techColors[tech.category] ?? '#888';
                      return (
                        <span key={tech.name} style={{
                          fontFamily: MONO, fontSize: '9px', letterSpacing: '0.06em',
                          color: c, background: `${c}10`, border: `1px solid ${c}30`,
                          padding: '2px 6px', whiteSpace: 'nowrap',
                        }}>
                          {tech.name}
                        </span>
                      );
                    })}
                    {extra > 0 && (
                      <span style={{ fontFamily: MONO, fontSize: '9px', color: `${accent}55`, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                        +{extra}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                    <motion.span
                      style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.18em', color: accent, textTransform: 'uppercase' }}
                      animate={{ opacity: isHovered ? 1 : 0.4 }}
                      transition={{ duration: 0.2 }}
                    >
                      OPEN MISSION
                    </motion.span>
                    <motion.span
                      style={{ fontFamily: MONO, fontSize: '11px', color: accent, lineHeight: 1 }}
                      animate={{ x: isHovered ? 3 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}
