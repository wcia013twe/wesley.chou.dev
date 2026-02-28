import { motion } from "motion/react";

// ── Boot-flicker keyframes ────────────────────────────────────────────────────
const FLICKER_OPACITY = [0, 0, 0.75, 0.04, 0.92, 0.35, 1];
const FLICKER_TIMES   = [0, 0.08, 0.22, 0.34, 0.52, 0.72, 1];

interface HudPanelProps {
  title: string;
  /** Monospace path label above the title, e.g. "SYS / PROJ / ACTIVE" */
  systemPath?: string;
  /** Coordinate string, e.g. "81.6°S · 38.9°W" */
  coords?: string;
  /** Accent colour for borders, dots and text highlights */
  glowColor?: string;
  /** Status line text (bottom row). Defaults to "SYSTEMS NOMINAL". */
  statusText?: string;
  /** Extra classes applied to the outermost motion.div — use for positioning */
  className?: string;
}

const HudPanel = ({
  title,
  systemPath = "SYS / ACTIVE",
  coords,
  glowColor = "#22d3ee",
  statusText = "SYSTEMS NOMINAL",
  className = "absolute top-6 left-6 z-20 pointer-events-none select-none",
}: HudPanelProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: FLICKER_OPACITY }}
    transition={{ duration: 0.9, times: FLICKER_TIMES, ease: "linear", delay: 0.2 }}
  >
    {/*
      Layered construction keeps backdrop-filter + clip-path in separate
      stacking contexts to avoid compositing artefacts cross-browser.
      ① Outer shape — clip-path only
      ② Blur fill   — backdrop-filter fills the clipped region
      ③ Tint        — gradient over the blur
      ④ Border      — 1 px rect, clipped → notched outline
      ⑤ Content     — relative z-10, above all layers
    */}
    <div
      className="relative"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
        minWidth: "210px",
      }}
    >
      {/* ① Blur */}
      <div
        className="absolute inset-0"
        style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      />
      {/* ② Tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.38) 100%)",
        }}
      />
      {/* ③ Border */}
      <div
        className="absolute inset-0"
        style={{ border: "1px solid rgba(255,255,255,0.11)" }}
      />

      {/* Corner reticle accents */}
      <span className="absolute top-0 left-0 h-px w-9"
        style={{ background: `linear-gradient(90deg, ${glowColor}, transparent)` }} />
      <span className="absolute top-0 left-0 w-px h-6"
        style={{ background: `linear-gradient(180deg, ${glowColor}, transparent)` }} />
      <span className="absolute bottom-0 right-0 h-px w-9"
        style={{ background: `linear-gradient(270deg, ${glowColor}, transparent)` }} />
      <span className="absolute bottom-0 right-0 w-px h-6"
        style={{ background: `linear-gradient(0deg, ${glowColor}, transparent)` }} />

      {/* ④ Content */}
      <div className="relative z-10" style={{ padding: "16px 20px 14px" }}>

        {/* System path */}
        <p style={{
          fontFamily:    "ui-monospace, SFMono-Regular, monospace",
          fontSize:      "9px",
          letterSpacing: "0.28em",
          color:         `${glowColor}95`,
          textTransform: "uppercase",
          margin:        "0 0 9px",
        }}>
          {systemPath}
        </p>

        {/* Title */}
        <h2 style={{
          fontFamily:    "ui-monospace, SFMono-Regular, monospace",
          fontSize:      "clamp(14px, 1.4vw, 18px)",
          fontWeight:    700,
          color:         "#fff",
          margin:        "0 0 11px",
          letterSpacing: "0.02em",
          textShadow:    `0 0 20px ${glowColor}40`,
        }}>
          {title}
        </h2>

        {/* Divider */}
        <div style={{
          height:       "1px",
          background:   `linear-gradient(90deg, ${glowColor}70, transparent)`,
          marginBottom: "10px",
        }} />

        {/* Coordinates row (optional) */}
        {coords && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "9px" }}>
            <motion.span
              style={{
                width: 5, height: 5,
                borderRadius: "50%",
                background:   glowColor,
                boxShadow:    `0 0 7px ${glowColor}e6`,
                display:      "block",
                flexShrink:   0,
              }}
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <p style={{
              fontFamily:    "ui-monospace, SFMono-Regular, monospace",
              fontSize:      "10px",
              letterSpacing: "0.14em",
              color:         `${glowColor}b8`,
              margin:        0,
            }}>
              {coords}
            </p>
          </div>
        )}

        {/* Status row */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <motion.span
            style={{
              width: 4, height: 4,
              borderRadius: "50%",
              background:   glowColor,
              display:      "block",
              flexShrink:   0,
            }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear", delay: 0.55 }}
          />
          <p style={{
            fontFamily:    "ui-monospace, SFMono-Regular, monospace",
            fontSize:      "8px",
            letterSpacing: "0.24em",
            color:         `${glowColor}6a`,
            margin:        0,
            textTransform: "uppercase",
          }}>
            {statusText}
          </p>
        </div>

      </div>
    </div>
  </motion.div>
);

export default HudPanel;
