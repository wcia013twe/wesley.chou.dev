import { motion } from "motion/react";
import ExperienceTimeline3D from "../components/ExperienceTimeline3D";
import HudPanel from "@/components/HudPanel";

const MONO = "ui-monospace, SFMono-Regular, monospace";
const ACCENT = "#6688ff";

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

          {/* Scroll wheel — navigate timeline */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0 }}>
              <rect x="0.75" y="0.75" width="12.5" height="18.5" rx="6.25" stroke={`${ACCENT}73`} strokeWidth="1.5"/>
              <rect x="5.25" y="3.5" width="3.5" height="6" rx="1.75" fill={`${ACCENT}cc`}/>
            </svg>
            <span style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)" }}>
              Navigate timeline
            </span>
          </div>

          {/* ↑ ↓ keys — step between entries */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0 }}>
              {/* Up key */}
              <rect x="1" y="0.75" width="12" height="8.5" rx="2" stroke={`${ACCENT}73`} strokeWidth="1.5" fill={`${ACCENT}1a`}/>
              <path d="M7 7 L7 3.5 M5.2 5.2 L7 3.5 L8.8 5.2" stroke={`${ACCENT}cc`} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Down key */}
              <rect x="1" y="10.75" width="12" height="8.5" rx="2" stroke={`${ACCENT}73`} strokeWidth="1.5" fill={`${ACCENT}1a`}/>
              <path d="M7 13 L7 16.5 M5.2 14.8 L7 16.5 L8.8 14.8" stroke={`${ACCENT}cc`} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)" }}>
              Step between entries
            </span>
          </div>

          {/* Left click — expand entry */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0 }}>
              <rect x="0.75" y="0.75" width="12.5" height="18.5" rx="6.25" stroke={`${ACCENT}73`} strokeWidth="1.5"/>
              <line x1="7" y1="0.75" x2="7" y2="9" stroke={`${ACCENT}4d`} strokeWidth="1"/>
              <path d="M1.2 9 L1.2 5 Q1.2 1.2 7 1.2 L7 9 Z" fill={`${ACCENT}cc`}/>
            </svg>
            <span style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)" }}>
              Expand entry
            </span>
          </div>

        </div>
      </div>
    </div>
  </motion.div>
);

const ExperiencePage = () => (
  <div className="relative overflow-hidden" style={{ height: 'calc(100vh - var(--nav-height))' }}>
    <ExperienceTimeline3D />
    <HudPanel
      title="Career Timeline"
      systemPath="SYS / EXP / ACTIVE"
      coords="49.3°N · 123.1°W"
    />
    <ControlsHint />
  </div>
);

export default ExperiencePage;
