import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const MONO = "ui-monospace, SFMono-Regular, monospace";
const C_CYAN   = "#22d3ee";
const C_BRIGHT = "#67e8f9";

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, imageSrc }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${title}: ${description}`}
      className="relative h-[400px] overflow-hidden cursor-pointer"
      style={{
        border:          isHovered
          ? `1px solid rgba(34,211,238,0.45)`
          : `1px solid rgba(34,211,238,0.18)`,
        background:      "rgba(0, 4, 8, 0.88)",
        backdropFilter:  "blur(12px)",
        boxShadow:       isHovered
          ? "0 0 40px rgba(34,211,238,0.08), inset 0 0 60px rgba(34,211,238,0.02)"
          : "none",
        transition:      "border 0.3s ease, box-shadow 0.3s ease",
      }}
      variants={{
        hidden:  { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsHovered(!isHovered);
          e.preventDefault();
        }
      }}
      whileHover={prefersReducedMotion ? {} : { y: -6 }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Corner accents — top-left */}
      <span
        className="pointer-events-none absolute top-0 left-0 h-px w-12 transition-all duration-300"
        style={{ background: `linear-gradient(90deg, ${isHovered ? C_BRIGHT : C_CYAN}, transparent)` }}
      />
      <span
        className="pointer-events-none absolute top-0 left-0 w-px h-10 transition-all duration-300"
        style={{ background: `linear-gradient(180deg, ${isHovered ? C_BRIGHT : C_CYAN}, transparent)` }}
      />
      {/* Corner accents — bottom-right */}
      <span
        className="pointer-events-none absolute bottom-0 right-0 h-px w-12 transition-all duration-300"
        style={{ background: `linear-gradient(270deg, ${isHovered ? C_BRIGHT : C_CYAN}, transparent)` }}
      />
      <span
        className="pointer-events-none absolute bottom-0 right-0 w-px h-10 transition-all duration-300"
        style={{ background: `linear-gradient(0deg, ${isHovered ? C_BRIGHT : C_CYAN}, transparent)` }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">

        {/* Top label */}
        <p
          style={{
            fontFamily:    MONO,
            fontSize:      "9px",
            letterSpacing: "0.35em",
            textTransform: "uppercase" as const,
            color:         "rgba(34,211,238,0.35)",
            margin:        0,
          }}
        >
          — PROFILE
        </p>

        {/* Bottom: title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3
            style={{
              fontFamily:    MONO,
              fontSize:      "clamp(18px, 2.2vw, 26px)",
              fontWeight:    600,
              letterSpacing: "0.08em",
              color:         isHovered ? 'whitesmoke' : 'white',
              textShadow:    isHovered
                ? `0 0 20px rgba(103,232,249,0.8), 0 0 40px rgba(34,211,238,0.4)`
                : `0 0 12px rgba(34,211,238,0.4)`,
              margin:        0,
              transition:    "color 0.3s ease, text-shadow 0.3s ease",
            }}
          >
            {title}
          </h3>

          <motion.p
            style={{
              fontFamily:    MONO,
              fontSize:      "12px",
              letterSpacing: "0.04em",
              lineHeight:    1.75,
              color:         "rgba(34,211,238,0.55)",
              margin:        0,
              overflow:      "hidden",
            }}
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{
              opacity:   isHovered ? 1 : 0,
              maxHeight: isHovered ? 200 : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
