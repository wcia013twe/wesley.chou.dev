import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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
      className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer border border-purple-500/20 shadow-lg hover:shadow-2xl"
      variants={{
        hidden: { opacity: 0, y: 20 },
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
      whileHover={prefersReducedMotion ? {} : { y: -8 }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <h3 className="text-3xl font-semibold text-white mb-4">{title}</h3>

        <motion.p
          className="text-lg text-white/90 leading-relaxed overflow-hidden"
          initial={{ opacity: 0, maxHeight: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            maxHeight: isHovered ? 200 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
