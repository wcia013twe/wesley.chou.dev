import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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

const ScrollIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      }
    };

    const timer = setTimeout(() => setIsVisible(false), 3000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible || prefersReducedMotion) return null;

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="flex flex-col items-center gap-2"
        style={{ color: "rgba(34,211,238,0.45)" }}
      >
        <span
          style={{
            fontFamily:    "ui-monospace, SFMono-Regular, monospace",
            fontSize:      "9px",
            letterSpacing: "0.35em",
            textTransform: "uppercase" as const,
          }}
        >
          Scroll
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;
