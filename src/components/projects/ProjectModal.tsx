import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Project interface (to be imported from data file when available)
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
  badgeColor: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

// Tech category colors mapping
const techCategoryColors = {
  frontend: '#9333ea',    // Purple
  backend: '#3b82f6',     // Blue
  database: '#10b981',    // Green
  ai: '#ec4899',          // Pink
  devops: '#f59e0b'       // Orange
};

// Badge color to hex mapping for dynamic styling
const badgeColorMap: Record<string, string> = {
  'text-indigo-300': '#a5b4fc',
  'text-blue-300': '#93c5fd',
  'text-lime-300': '#bef264',
  'text-red-300': '#fca5a5',
  'text-cyan-300': '#67e8f9',
  'text-purple-300': '#d8b4fe',
  'text-yellow-300': '#fde047'
};

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get badge color hex from Tailwind class
  const getBadgeColorHex = (badgeColor: string): string => {
    return badgeColorMap[badgeColor] || '#a5b4fc'; // Default to indigo
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalContentRef.current) return;

      const focusableElements = modalContentRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Handle background click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Determine if tech is old string array or new TechItem array
  const getTechItems = (tech: string[] | TechItem[]): TechItem[] => {
    if (tech.length === 0) return [];

    if (typeof tech[0] === 'string') {
      // Convert string array to TechItem array with default category
      return (tech as string[]).map(name => ({
        name,
        category: 'frontend' as const
      }));
    }

    return tech as TechItem[];
  };

  if (!project) return null;

  const badgeColorHex = getBadgeColorHex(project.badgeColor);
  const techItems = getTechItems(project.tech);
  const fullDescription = project.fullDescription || project.description;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Hint text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 text-sm text-white/50 pointer-events-none"
          >
            Click outside or press ESC to close
          </motion.div>

          {/* Close button */}
          <motion.button
            ref={closeButtonRef}
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed top-6 right-6 z-[101] w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border-2 border-purple-500/40 flex items-center justify-center text-white text-2xl shadow-lg shadow-black/20 hover:rotate-90 hover:scale-110 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Close project details"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Modal content container */}
          <motion.div
            ref={modalContentRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-12"
            style={{
              border: `3px solid ${badgeColorHex}60`,
              boxShadow: `0 20px 60px -15px ${badgeColorHex}40`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated border effect - much larger so edges don't show when rotating */}
            <div
              className="absolute pointer-events-none opacity-30 rounded-3xl"
              style={{
                inset: '-100px',
                background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, ${badgeColorHex} 25%, transparent 50%, ${badgeColorHex} 75%, transparent 100%)`,
                animation: 'rotateBorder 10s linear infinite'
              }}
            />

            {/* Two-column layout for desktop, single column for mobile */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Left column - Image (40% on desktop) */}
              <div className="md:col-span-2">
                <div
                  className="aspect-video rounded-2xl overflow-hidden shadow-lg border-2 hover:scale-[1.02] transition-transform duration-300"
                  style={{
                    borderColor: `${badgeColorHex}40`,
                    boxShadow: `0 10px 30px -10px ${badgeColorHex}20`
                  }}
                >
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white/40 text-lg">
                      No image available
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Content (60% on desktop) */}
              <div className="md:col-span-3 flex flex-col">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-2">
                    <h2 id="modal-title" className="text-3xl md:text-4xl font-bold text-white flex-1">
                      {project.title}
                    </h2>
                    {project.badge && (
                      <div
                        className="bg-black/80 backdrop-blur-sm border-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg"
                        style={{
                          borderColor: badgeColorHex,
                          color: badgeColorHex,
                          boxShadow: `0 4px 12px ${badgeColorHex}60`
                        }}
                      >
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-base text-white/60 mb-6">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="inline-block"
                    >
                      <circle cx="9" cy="9" r="8" />
                      <path d="M9 4v5l3 3" />
                    </svg>
                    <time dateTime={project.date}>{project.date}</time>
                  </div>

                  {/* Divider */}
                  <div
                    className="border-t my-6"
                    style={{ borderColor: `${badgeColorHex}30` }}
                  />
                </div>

                {/* Description */}
                <div className="mb-8 flex-1">
                  <p className="text-lg text-white/90 leading-relaxed whitespace-pre-line">
                    {fullDescription}
                  </p>
                </div>

                {/* Tech Stack Section */}
                {techItems.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Technologies</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {techItems.map((tech, index) => {
                        const categoryColor = techCategoryColors[tech.category];
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-full px-4 py-2.5 text-sm font-medium text-white/90 text-center hover:scale-105 hover:from-gray-700/60 hover:to-gray-800/60 transition-all duration-200"
                            style={{
                              border: `2px solid ${categoryColor}60`,
                              boxShadow: `0 4px 12px ${categoryColor}20`
                            }}
                          >
                            {tech.name}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  {/* Primary button - View Project */}
                  <a
                    href={project.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-purple-500/40 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    View Project
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>

                  {/* Secondary button - View Code (if GitHub URL exists) */}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-transparent border-2 border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:border-purple-500 hover:bg-purple-500/20 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CSS for rotating border animation */}
          <style>{`
            @keyframes rotateBorder {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            /* Custom scrollbar for modal content */
            .overflow-y-auto::-webkit-scrollbar {
              width: 8px;
            }

            .overflow-y-auto::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.2);
              border-radius: 10px;
            }

            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: rgba(147, 51, 234, 0.4);
              border-radius: 10px;
            }

            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: rgba(147, 51, 234, 0.6);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
