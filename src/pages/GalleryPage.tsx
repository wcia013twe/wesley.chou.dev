import { motion } from 'motion/react';

const MONO = 'ui-monospace, SFMono-Regular, monospace';
const ACCENT = '#22d3ee';

export default function GalleryPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Horizontal scan line */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${ACCENT}55 30%, ${ACCENT}55 70%, transparent 100%)`,
          pointerEvents: 'none',
        }}
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content panel */}
      <div
        style={{
          position: 'relative',
          padding: '52px 60px',
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(2,4,14,0.88)' }} />
        <div className="absolute inset-0" style={{ border: `1px solid ${ACCENT}28` }} />

        {/* Corner reticles */}
        <span className="absolute top-0 left-0 h-px w-12" style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
        <span className="absolute top-0 left-0 w-px h-10" style={{ background: `linear-gradient(180deg, ${ACCENT}, transparent)` }} />
        <span className="absolute bottom-0 right-0 h-px w-12" style={{ background: `linear-gradient(270deg, ${ACCENT}, transparent)` }} />
        <span className="absolute bottom-0 right-0 w-px h-10" style={{ background: `linear-gradient(0deg, ${ACCENT}, transparent)` }} />

        <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {/* Route label */}
          <div style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.3em', color: `${ACCENT}55`, textTransform: 'uppercase' }}>
            SYS / GALLERY
          </div>

          {/* Pulsing dot */}
          <motion.span
            style={{
              width: 10, height: 10, borderRadius: '50%',
              background: ACCENT,
              boxShadow: `0 0 14px ${ACCENT}`,
            }}
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Heading */}
          <h1 style={{
            fontFamily: MONO,
            fontSize: 'clamp(22px, 4vw, 34px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Gallery
          </h1>

          {/* Divider */}
          <div style={{ width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${ACCENT}50, transparent)` }} />

          {/* Status */}
          <p style={{
            fontFamily: MONO,
            fontSize: '13px',
            lineHeight: 2.0,
            color: 'rgba(255,255,255,0.55)',
            margin: 0,
            letterSpacing: '0.04em',
          }}>
            This section is under construction.<br />
            Check back soon.
          </p>

          {/* Badge */}
          <div style={{
            fontFamily: MONO,
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: ACCENT,
            border: `1px solid ${ACCENT}40`,
            padding: '6px 18px',
            background: `${ACCENT}0e`,
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
          }}>
            COMING SOON
          </div>
        </div>
      </div>
    </div>
  );
}
