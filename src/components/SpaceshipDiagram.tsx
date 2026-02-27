import { useRef, useState, useEffect } from "react";
import type { SpringOptions } from "motion/react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DiagramNode {
  id: string;
  title: string;
  role: string;
  anchor: readonly [number, number];
  labelPos: readonly [number, number];
  /** Ordered waypoints in viewBox-space (0–100) */
  linePath: readonly (readonly [number, number])[];
  detail: string;
  tags: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const NODES: DiagramNode[] = [
  {
    id: "nose",
    title: "Vision / Product",
    role: "NOSE",
    anchor: [18, 55],
    labelPos: [6, 52],
    linePath: [
      [18, 55],
      [13, 55],
      [8, 52],
      [6, 52],
    ],
    detail:
      "Product strategy, roadmap design, and user-centered vision. Where the ship points determines where it goes.",
    tags: ["Strategy", "Roadmap", "User Research"],
  },
  {
    id: "cockpit",
    title: "AI / Systems",
    role: "COCKPIT · UPPER FUSELAGE",
    anchor: [32, 45],
    labelPos: [18, 25],
    linePath: [
      [32, 45],
      [26, 45],
      [26, 27],
      [18, 25],
    ],
    detail:
      "Machine learning pipelines, intelligent system design, and the cognitive architecture that guides execution.",
    tags: ["LLMs", "ML / AI", "System Design"],
  },
  {
    id: "wing",
    title: "Frontend",
    role: "RIGHT WING",
    anchor: [60, 68],
    labelPos: [82, 78],
    linePath: [
      [60, 68],
      [70, 68],
      [79, 76],
      [82, 78],
    ],
    detail:
      "Pixel-perfect interfaces, motion design, and the surfaces users interact with. Lift comes from execution.",
    tags: ["React", "TypeScript", "Motion"],
  },
  {
    id: "engine",
    title: "Backend",
    role: "ENGINE CLUSTER",
    anchor: [75, 55],
    labelPos: [94, 48],
    linePath: [
      [75, 55],
      [83, 55],
      [83, 50],
      [94, 48],
    ],
    detail:
      "APIs, databases, cloud infrastructure, and the raw power that drives the entire system forward.",
    tags: ["Node.js", "Postgres", "AWS"],
  },
  {
    id: "stabilizer",
    title: "Leadership",
    role: "VERTICAL STABILIZER",
    anchor: [63, 22],
    labelPos: [82, 8],
    linePath: [
      [63, 22],
      [71, 22],
      [71, 11],
      [82, 8],
    ],
    detail:
      "System design, technical leadership, and the structural decisions that keep everything aligned under pressure.",
    tags: ["Architecture", "Mentorship", "Coordination"],
  },
];

// ─── Tilt config ──────────────────────────────────────────────────────────────
// Higher damping + lower stiffness than TiltedCard → authoritative, not springy.
const SPRING: SpringOptions = { damping: 40, stiffness: 80, mass: 2 };
const ROTATE_X_AMP = 6; // degrees — vertical
const ROTATE_Y_AMP = 8; // degrees — horizontal
const SCALE_HOVER = 1.02; // restrained depth cue

// ─── Colour constants ─────────────────────────────────────────────────────────
const C_BASE = "#22d3ee";
const C_BRIGHT = "#67e8f9";

// ─── Component ────────────────────────────────────────────────────────────────
const SpaceshipDiagram: React.FC = () => {
  // ── Overlay state ──────────────────────────────────────────────────────────
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeNode = NODES.find((n) => n.id === activeId) ?? null;

  // ── Close panel on any click outside the diagram ──────────────────────────
  useEffect(() => {
    if (!activeId) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeId]);

  // ── Tilt motion values (same pattern as TiltedCard) ───────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const scale = useSpring(1, SPRING);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -ROTATE_X_AMP);
    rotateY.set((offsetX / (rect.width / 2)) * ROTATE_Y_AMP);
  }

  function handleMouseEnter() {
    scale.set(SCALE_HOVER);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }

  return (
    <section className="relative py-20 px-4">
      {/* Command center background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/command-center.png"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/62" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">F
        {/* ── Header ──────────────────────────────D────────────────────────── */}
        <div className="text-center mb-12">
          <p
            className="uppercase mb-2"
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontSize: "clamp(10px, 1.1vw, 12px)",
              letterSpacing: "0.35em",
              color: "rgba(34,211,238,0.65)",
            }}
          >
            SYSTEMS OVERVIEW · ENGINEERING PROFILE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            The Ship
          </h2>
        </div>

        {/* ── Perspective wrapper (outer) — defines tilt bounds ───────────── */}
        {/*   No background, border, or shadow. Pure structural container.    */}
        <div
          ref={containerRef}
          className="relative w-full select-none"
          style={{
            aspectRatio: "2048 / 1366",
            perspective: "1400px",
          }}
          onMouseMove={handleMouse}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/*
            ── Tilt surface — image only ────────────────────────────────────
            Only the ship image tilts. SVG overlay, dots, and labels are
            siblings (not children) so they stay flat and correctly positioned.
          */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale,
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
            }}
          >
            <img
              src="/spaceship.png"
              alt="Technical systems diagram"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>

          {/* SVG layer — connector lines only */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ overflow: "visible", pointerEvents: "none" }}
          >
            <defs>
              <filter
                id="glow-dim"
                x="-80%"
                y="-80%"
                width="260%"
                height="260%"
              >
                <feGaussianBlur stdDeviation="0.35" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter
                id="glow-bright"
                x="-80%"
                y="-80%"
                width="260%"
                height="260%"
              >
                <feGaussianBlur stdDeviation="0.7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {NODES.map((node) => {
              const lit = hoveredId === node.id || activeId === node.id;
              const pts = node.linePath.map(([x, y]) => `${x},${y}`).join(" ");
              return (
                <polyline
                  key={node.id}
                  points={pts}
                  fill="none"
                  stroke={lit ? C_BRIGHT : C_BASE}
                  strokeWidth={lit ? 0.38 : 0.2}
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  filter={lit ? "url(#glow-bright)" : "url(#glow-dim)"}
                  style={{
                    transition: "stroke-width 0.3s ease, stroke 0.3s ease",
                  }}
                />
              );
            })}
          </svg>

          {/* Anchor circles — HTML divs (no SVG distortion from non-square container) */}
          {NODES.map((node) => {
            const lit = hoveredId === node.id || activeId === node.id;
            const sz = lit ? 9 : 6;
            return (
              <div
                key={`dot-${node.id}`}
                className="absolute"
                style={{
                  left: `${node.anchor[0]}%`,
                  top: `${node.anchor[1]}%`,
                  width: sz,
                  height: sz,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  backgroundColor: lit ? C_BRIGHT : C_BASE,
                  boxShadow: lit
                    ? "0 0 10px 4px rgba(34,211,238,0.55)"
                    : "0 0 4px 1px rgba(34,211,238,0.25)",
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              />
            );
          })}

          {/* Labels */}
          {NODES.map((node) => {
            const isLeft = node.labelPos[0] < 50;
            const lit = hoveredId === node.id || activeId === node.id;
            const isActive = activeId === node.id;
            return (
              <div
                key={`label-${node.id}`}
                className="absolute"
                style={{
                  left: `${node.labelPos[0]}%`,
                  top: `${node.labelPos[1]}%`,
                  transform: isLeft
                    ? "translate(0, -50%)"
                    : "translate(-100%, -50%)",
                  zIndex: 20,
                }}
              >
                <button
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() =>
                    setActiveId((prev) => (prev === node.id ? null : node.id))
                  }
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: isLeft ? "left" : "right",
                  }}
                >
                  <div
                    style={{
                      borderLeft: isLeft
                        ? `1.5px solid ${lit ? C_BRIGHT : C_BASE}`
                        : "none",
                      borderRight: !isLeft
                        ? `1.5px solid ${lit ? C_BRIGHT : C_BASE}`
                        : "none",
                      paddingLeft: isLeft ? "7px" : "0",
                      paddingRight: !isLeft ? "7px" : "0",
                      background: isActive
                        ? "rgba(34,211,238,0.06)"
                        : "transparent",
                      boxShadow: lit
                        ? `${isLeft ? "-3px" : "3px"} 0 18px rgba(34,211,238,0.2)`
                        : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "ui-monospace, SFMono-Regular, monospace",
                        fontSize: "clamp(10px, 1.3vw, 14px)",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: lit ? C_BRIGHT : C_BASE,
                        textShadow: lit
                          ? "0 0 10px rgba(34,211,238,0.9)"
                          : "0 0 6px rgba(34,211,238,0.5)",
                        margin: 0,
                        whiteSpace: "nowrap",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {node.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "ui-monospace, SFMono-Regular, monospace",
                        fontSize: "clamp(7px, 0.85vw, 10px)",
                        letterSpacing: "0.18em",
                        color: lit
                          ? "rgba(103,232,249,0.8)"
                          : "rgba(34,211,238,0.52)",
                        margin: "2px 0 0",
                        whiteSpace: "nowrap",
                        transition: "all 0.3s ease",
                      }}
                    >
                      — {node.role}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}

          {/* ── Detail Panel — absolutely positioned on the diagram ────────── */}
          <AnimatePresence mode="wait">
            {activeNode &&
              (() => {
                const panelLeft = activeNode.labelPos[0] < 50;
                // Clamp vertical so panel never clips outside the diagram
                const topPct = Math.max(
                  4,
                  Math.min(55, activeNode.labelPos[1] - 15),
                );
                return (
                  <motion.div
                    key={activeNode.id}
                    initial={{ opacity: 0, x: panelLeft ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: panelLeft ? -10 : 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: `${topPct}%`,
                      transform: "translateY(-50%)",
                      ...(panelLeft
                        ? {
                            right: `calc(${100 - activeNode.labelPos[0]}% + 10px)`,
                          }
                        : { left: `calc(${activeNode.labelPos[0]}% + 10px)` }),
                      zIndex: 30,
                      width: "clamp(260px, 32%, 360px)",
                      border: "1px solid rgba(34,211,238,0.2)",
                      background: "rgba(0,4,8,0.92)",
                      backdropFilter: "blur(14px)",
                      boxShadow:
                        "0 0 0 1px rgba(34,211,238,0.06), 0 8px 40px rgba(0,0,0,0.85)",
                    }}
                  >
                    {/* Corner accents */}
                    <span
                      className="absolute top-0 left-0 h-px w-16"
                      style={{
                        background:
                          "linear-gradient(90deg, #22d3ee, transparent)",
                      }}
                    />
                    <span
                      className="absolute top-0 left-0 w-px h-8"
                      style={{
                        background:
                          "linear-gradient(180deg, #22d3ee, transparent)",
                      }}
                    />
                    <span
                      className="absolute bottom-0 right-0 h-px w-16"
                      style={{
                        background:
                          "linear-gradient(270deg, #22d3ee, transparent)",
                      }}
                    />
                    <span
                      className="absolute bottom-0 right-0 w-px h-8"
                      style={{
                        background:
                          "linear-gradient(0deg, #22d3ee, transparent)",
                      }}
                    />

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p
                          style={{
                            fontFamily:
                              "ui-monospace, SFMono-Regular, monospace",
                            fontSize: "10px",
                            letterSpacing: "0.28em",
                            color: "rgba(34,211,238,0.65)",
                            textTransform: "uppercase",
                            margin: 0,
                          }}
                        >
                          — {activeNode.role}
                        </p>
                        <button
                          onClick={() => setActiveId(null)}
                          style={{
                            fontFamily:
                              "ui-monospace, SFMono-Regular, monospace",
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            color: "rgba(34,211,238,0.52)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            flexShrink: 0,
                            padding: 0,
                            lineHeight: 1,
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) =>
                            ((
                              e.currentTarget as HTMLButtonElement
                            ).style.color = "#22d3ee")
                          }
                          onMouseLeave={(e) =>
                            ((
                              e.currentTarget as HTMLButtonElement
                            ).style.color = "rgba(34,211,238,0.35)")
                          }
                        >
                          ✕
                        </button>
                      </div>

                      <h3
                        style={{
                          fontSize: "clamp(15px, 1.6vw, 18px)",
                          fontWeight: 700,
                          color: "#fff",
                          margin: "0 0 8px",
                        }}
                      >
                        {activeNode.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "clamp(11px, 1.2vw, 13px)",
                          color: "rgba(255,255,255,0.72)",
                          lineHeight: 1.6,
                          margin: "0 0 10px",
                        }}
                      >
                        {activeNode.detail}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        {activeNode.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontFamily:
                                "ui-monospace, SFMono-Regular, monospace",
                              fontSize: "10px",
                              letterSpacing: "0.12em",
                              border: "1px solid rgba(34,211,238,0.35)",
                              color: "#67e8f9",
                              background: "rgba(34,211,238,0.07)",
                              padding: "1px 6px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
          </AnimatePresence>
        </div>
        {/* end perspective wrapper */}
      </div>
    </section>
  );
};

export default SpaceshipDiagram;
