import { motion } from 'framer-motion';
import { useState } from 'react';

const MONO = "ui-monospace, SFMono-Regular, monospace";
const SANS = "'Montserrat', 'Ubuntu', Arial, sans-serif";
const C_BRIGHT = "#67e8f9";

const HIGHLIGHTS: Record<string, string> = {
  'AI':                            '#ec4899',
  'machine learning':              '#a78bfa',
  'Machine Learning':              '#a78bfa',
  'generative AI':                 '#ec4899',
  'University of Central Florida': '#22d3ee',
  'UCF':                           '#22d3ee',
  'software engineering':          '#60a5fa',
  'entrepreneurship':              '#34d399',
  'entrepreneurial':               '#34d399',
};

function HighlightedText({ text }: { text: string }) {
  const escaped = Object.keys(HIGHLIGHTS).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'g');
  return (
    <>
      {text.split(pattern).map((part, i) => {
        const color = HIGHLIGHTS[part];
        return color
          ? <span key={i} style={{ color, fontWeight: 600 }}>{part}</span>
          : part;
      })}
    </>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, imageSrc, badge }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -6 : 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        borderRadius: '8px',
        border: '1px solid transparent',
        background: `linear-gradient(rgba(2,6,16,0.90), rgba(2,6,16,0.90)) padding-box,
                     linear-gradient(135deg, rgba(34,211,238,${hovered ? 0.55 : 0.30}) 0%, rgba(34,211,238,0.06) 50%, rgba(34,211,238,${hovered ? 0.55 : 0.30}) 100%) border-box`,
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.5)' : 'none',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '4/3',
        transition: 'background 0.35s ease, box-shadow 0.35s ease',
        cursor: 'default',
      }}
      variants={{
        hidden:  { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {/* Badge */}
      {badge && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 20,
          background: 'rgba(2,6,16,0.75)',
          border: '1px solid rgba(34,211,238,0.4)',
          borderRadius: '20px',
          padding: '3px 10px',
          fontFamily: MONO,
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: C_BRIGHT,
          textTransform: 'uppercase',
        }}>
          {badge}
        </div>
      )}

      {/* Image */}
      <motion.img
        src={imageSrc}
        loading="lazy"
        alt={title}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        animate={{
          filter: hovered ? 'grayscale(0%) brightness(0.45)' : 'grayscale(35%) brightness(0.72)',
          scale:  hovered ? 1.06 : 1,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />

      {/* Title — always visible at bottom */}
      <motion.div
        animate={{ opacity: hovered ? 0 : 1, y: hovered ? 10 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '40px 20px 20px',
          background: 'linear-gradient(to top, rgba(2,6,16,0.92) 0%, transparent 100%)',
          zIndex: 10,
        }}
      >
        <h3 style={{
          fontFamily:    MONO,
          fontSize:      '18px',
          fontWeight:    600,
          letterSpacing: '0.06em',
          color:         'white',
          margin:        0,
        }}>
          {title}
        </h3>
      </motion.div>

      {/* Hover overlay — slides up from bottom */}
      <motion.div
        initial={false}
        animate={{ y: hovered ? '0%' : '100%' }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '24px',
          background: 'linear-gradient(to top, rgba(2,6,16,0.97) 55%, rgba(2,6,16,0.70) 100%)',
        }}
      >
        <h3 style={{
          fontFamily:    MONO,
          fontSize:      '18px',
          fontWeight:    600,
          letterSpacing: '0.06em',
          color:         'white',
          margin:        '0 0 10px',
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: SANS,
          fontSize:   '13px',
          lineHeight: 1.75,
          color:      'rgba(255,255,255,0.72)',
          margin:     0,
        }}>
          <HighlightedText text={description} />
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FeatureCard;
