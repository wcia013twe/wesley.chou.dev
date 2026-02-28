import { useEffect } from "react";
import { motion } from "motion/react";
import SpaceshipDiagram from "@/components/SpaceshipDiagram";
import HudPanel from "@/components/HudPanel";

const MONO = "ui-monospace, SFMono-Regular, monospace";
const ACCENT = "#22d3ee";

const ControlsHint = () => (
  <motion.div
    className="absolute left-6 z-20 pointer-events-none select-none"
    style={{ top: "170px" }}
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
  >
    <div style={{ display: "flex", gap: "10px" }}>
      {/* Left accent bar */}
      <div style={{
        width: "2px",
        background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT}44 100%)`,
        flexShrink: 0,
      }} />

      <div style={{
        background: "rgba(0,0,0,0.45)",
        border: `1px solid ${ACCENT}2e`,
        borderLeft: "none",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "10px 14px 10px 12px",
      }}>
        <p style={{
          fontFamily: MONO, fontSize: "8px", letterSpacing: "0.3em",
          color: `${ACCENT}aa`, textTransform: "uppercase", margin: "0 0 8px",
        }}>
          Controls
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

          {/* Left click — open system detail */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0 }}>
              <rect x="0.75" y="0.75" width="12.5" height="18.5" rx="6.25" stroke={`${ACCENT}73`} strokeWidth="1.5"/>
              <line x1="7" y1="0.75" x2="7" y2="9" stroke={`${ACCENT}4d`} strokeWidth="1"/>
              <path d="M1.2 9 L1.2 5 Q1.2 1.2 7 1.2 L7 9 Z" fill={`${ACCENT}cc`}/>
            </svg>
            <span style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)" }}>
              Open system detail
            </span>
          </div>

          {/* Drag — rotate model */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0 }}>
              <rect x="0.75" y="0.75" width="12.5" height="18.5" rx="6.25" stroke={`${ACCENT}73`} strokeWidth="1.5"/>
              <line x1="7" y1="0.75" x2="7" y2="9" stroke={`${ACCENT}4d`} strokeWidth="1"/>
              {/* both buttons dim = drag */}
              <path d="M1.2 9 L1.2 5 Q1.2 1.2 7 1.2 L7 9 Z" fill={`${ACCENT}55`}/>
              <path d="M12.8 9 L12.8 5 Q12.8 1.2 7 1.2 L7 9 Z" fill={`${ACCENT}55`}/>
              {/* drag arrows on body */}
              <path d="M4 14 L7 11.5 L10 14" stroke={`${ACCENT}cc`} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M4 17 L7 19.5 L10 17" stroke={`${ACCENT}cc`} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)" }}>
              Rotate model
            </span>
          </div>

          {/* Close key — close panel */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <rect x="0.75" y="0.75" width="12.5" height="12.5" rx="2.5" stroke={`${ACCENT}73`} strokeWidth="1.5" fill={`${ACCENT}1a`}/>
              <path d="M4.5 4.5 L9.5 9.5 M9.5 4.5 L4.5 9.5" stroke={`${ACCENT}cc`} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)" }}>
              Close panel
            </span>
          </div>

        </div>
      </div>
    </div>
  </motion.div>
);

const SkillsPage = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <SpaceshipDiagram />
      <HudPanel
        title="Technical Skills"
        systemPath="SYS / SKILL / ACTIVE"
        coords="41.2°N · 12.4°E"
      />
      <ControlsHint />
    </div>
  );
};

export default SkillsPage;
