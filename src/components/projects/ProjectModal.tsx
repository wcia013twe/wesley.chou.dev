import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MONO = 'ui-monospace, SFMono-Regular, monospace';
const GOLD = '#f0b429';

interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'devops';
}

interface Project {
  id: string;
  badge?: boolean;
  title: string;
  description: string;
  fullDescription?: string;
  date: string;
  imageUrl?: string;
  detailsUrl: string;
  githubUrl?: string;
  tech: string[] | TechItem[];
  awards?: string[];
  badgeColor: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const techColors: Record<string, string> = {
  frontend: '#9333ea',
  backend:  '#3b82f6',
  database: '#10b981',
  ai:       '#ec4899',
  devops:   '#f59e0b',
};

const badgeColorMap: Record<string, string> = {
  'text-indigo-300': '#a5b4fc',
  'text-blue-300':   '#93c5fd',
  'text-lime-300':   '#bef264',
  'text-red-300':    '#fca5a5',
  'text-cyan-300':   '#67e8f9',
  'text-purple-300': '#d8b4fe',
  'text-yellow-300': '#fde047',
};

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [isOpen, onClose]);

  if (!project) return null;

  const accent = badgeColorMap[project.badgeColor] ?? '#22d3ee';
  const fullDescription = project.fullDescription || project.description;
  const missionId = `MSN-${project.id.toUpperCase().slice(0, 4)}`;

  const techItems: TechItem[] =
    project.tech.length === 0 ? [] :
    typeof project.tech[0] === 'string'
      ? (project.tech as string[]).map(name => ({ name, category: 'frontend' as const }))
      : project.tech as TechItem[];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(0,0,4,0.88)', backdropFilter: 'blur(20px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blur fill */}
            <div className="absolute inset-0" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }} />
            {/* Tint */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(2,4,14,0.94) 0%, rgba(2,4,14,0.84) 100%)' }} />
            {/* Border */}
            <div className="absolute inset-0" style={{ border: `1px solid ${accent}32` }} />
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent 5%, ${accent}70 50%, transparent 95%)` }} />

            {/* Corner reticles */}
            <span className="absolute top-0 left-0 h-px w-16" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            <span className="absolute top-0 left-0 w-px h-14" style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }} />
            <span className="absolute bottom-0 right-0 h-px w-16" style={{ background: `linear-gradient(270deg, ${accent}, transparent)` }} />
            <span className="absolute bottom-0 right-0 w-px h-14" style={{ background: `linear-gradient(0deg, ${accent}, transparent)` }} />

            <div className="relative z-10">

              {/* ── Header bar ──────────────────────────────────────────── */}
              <div style={{
                borderBottom: `1px solid ${accent}1e`,
                padding: '13px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <span style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.26em', color: `${accent}65`, textTransform: 'uppercase' }}>
                  SYS / PROJ / {project.id.toUpperCase().replace(/-/g, '_')}
                </span>
                <div style={{ flex: 1 }} />
                <span style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.22em', color: `${accent}45`, textTransform: 'uppercase' }}>
                  {missionId}
                </span>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  style={{
                    fontFamily: MONO, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: accent, background: 'none', border: `1px solid ${accent}40`,
                    padding: '5px 14px', cursor: 'pointer',
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  }}
                >
                  ← CLOSE
                </button>
              </div>

              {/* ── Body ────────────────────────────────────────────────── */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.55fr)',
                  gap: '32px',
                  padding: '28px 28px 32px',
                }}
                className="flex-col-mobile"
              >

                {/* Left column */}
                <div>
                  {/* Image */}
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '18px',
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  }}>
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: MONO, fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>NO VISUAL DATA</span>
                      </div>
                    )}
                    {/* Scanlines */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                    }} />
                    {/* Four-corner reticles */}
                    <span className="absolute top-2 left-2 h-px w-5"  style={{ background: `${accent}cc` }} />
                    <span className="absolute top-2 left-2 w-px h-4"  style={{ background: `${accent}cc` }} />
                    <span className="absolute top-2 right-2 h-px w-5" style={{ background: `${accent}cc` }} />
                    <span className="absolute top-2 right-2 w-px h-4" style={{ background: `${accent}cc` }} />
                    <span className="absolute bottom-2 left-2 h-px w-5"  style={{ background: `${accent}cc` }} />
                    <span className="absolute bottom-2 left-2 w-px h-4"  style={{ background: `${accent}cc` }} />
                    <span className="absolute bottom-2 right-2 h-px w-5" style={{ background: `${accent}cc` }} />
                    <span className="absolute bottom-2 right-2 w-px h-4" style={{ background: `${accent}cc` }} />
                  </div>

                  {/* Mission data block */}
                  <div style={{ border: `1px solid ${accent}18`, padding: '16px 18px' }}>
                    <div style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.3em', color: `${accent}55`, textTransform: 'uppercase', marginBottom: '14px' }}>
                      // MISSION DATA
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                      {[
                        { label: 'STATUS',  value: project.badge ? 'FEATURED' : 'ACTIVE' },
                        { label: 'DATE',    value: project.date },
                        { label: 'SYSTEMS', value: `${techItems.length} COMPONENTS` },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.2em', color: `${accent}50`, textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
                          <span style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.70)', textAlign: 'right' }}>{value}</span>
                        </div>
                      ))}

                      {/* Awards */}
                      {project.awards && project.awards.length > 0 && (
                        <>
                          <div style={{ height: '1px', background: `${GOLD}25`, margin: '4px 0 2px' }} />
                          <div style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.3em', color: `${GOLD}70`, textTransform: 'uppercase', marginBottom: '4px' }}>
                            AWARDS
                          </div>
                          {project.awards.map((award, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 + i * 0.08 }}
                              style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}
                            >
                              <span style={{ color: GOLD, flexShrink: 0, fontSize: '11px', marginTop: '1px' }}>◈</span>
                              <span style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.04em', color: `${GOLD}cc`, lineHeight: 1.55 }}>
                                {award}
                              </span>
                            </motion.div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* Title */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <motion.span
                        style={{ width: 7, height: 7, borderRadius: '50%', background: accent, boxShadow: `0 0 10px ${accent}`, flexShrink: 0 }}
                        animate={{ opacity: [1, 0.15, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <h2
                        id="modal-title"
                        style={{ fontFamily: MONO, fontSize: 'clamp(18px, 2.2vw, 26px)', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}
                      >
                        {project.title}
                      </h2>
                      {project.badge && (
                        <span style={{
                          fontFamily: MONO, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                          color: GOLD, border: `1px solid ${GOLD}70`, padding: '3px 10px', flexShrink: 0,
                          background: `${GOLD}12`,
                        }}>
                          ★ FEATURED
                        </span>
                      )}
                    </div>
                    <div style={{ height: '1px', background: `linear-gradient(90deg, ${accent}55, transparent)` }} />
                  </div>

                  {/* Brief */}
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.26em', color: `${accent}65`, textTransform: 'uppercase', marginBottom: '12px' }}>
                      // MISSION BRIEF
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {fullDescription.split(/\n\n+/).map((para, i) => (
                        <p key={i} style={{ fontFamily: MONO, fontSize: '13px', lineHeight: 2.0, color: 'rgba(255,255,255,0.68)', margin: 0 }}>
                          {para.trim()}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Tech */}
                  {techItems.length > 0 && (
                    <div>
                      <div style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.26em', color: `${accent}65`, textTransform: 'uppercase', marginBottom: '12px' }}>
                        // SYSTEM COMPONENTS
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {techItems.map((tech, i) => {
                          const c = techColors[tech.category] ?? '#888';
                          return (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.08 + i * 0.04 }}
                              style={{
                                fontFamily: MONO, fontSize: '11px', letterSpacing: '0.08em',
                                color: c, background: `${c}10`, border: `1px solid ${c}32`,
                                padding: '4px 11px',
                              }}
                            >
                              {tech.name}
                            </motion.span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '4px', flexWrap: 'wrap' }}>
                    <a
                      href={project.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: MONO, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
                        color: '#000', background: accent, padding: '12px 24px',
                        cursor: 'pointer', textDecoration: 'none', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: '8px',
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                      }}
                    >
                      LAUNCH MISSION →
                    </a>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: MONO, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
                          color: accent, background: 'transparent', border: `1px solid ${accent}42`,
                          padding: '12px 24px', cursor: 'pointer', textDecoration: 'none',
                          display: 'flex', alignItems: 'center', gap: '8px',
                          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                        }}
                      >
                        SOURCE CODE
                      </a>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
