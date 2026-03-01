import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { LuRocket } from "react-icons/lu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipPanel,
} from "@/components/animate-ui/components/base/tooltip";

// ── Design tokens ─────────────────────────────────────────────────────────────
const MONO    = "ui-monospace, SFMono-Regular, monospace";
const C_CYAN  = "#22d3ee";
const C_BRIGHT= "#67e8f9";
const C_DIM   = "rgba(34,211,238,0.45)";
const C_MUTED = "rgba(255,255,255,0.38)";

// ── Speculative prefetch for heavy page assets ────────────────────────────────
// Injecting a <link rel="prefetch"> queues a low-priority background fetch that
// the browser stores in HTTP cache. By the time the user clicks and the
// component mounts, the loader finds assets already cached.
let experiencePrefetchStarted = false;
function prefetchExperienceAssets() {
  if (experiencePrefetchStarted) return;
  experiencePrefetchStarted = true;
  ['/models/spaceship.glb', '/textures/energy-beam-opacity.png'].forEach((href) => {
    const link = document.createElement('link');
    link.rel  = 'prefetch';
    link.as   = 'fetch';
    link.href = href;
    document.head.appendChild(link);
  });
}

let projectsPrefetchStarted = false;
function prefetchProjectsAssets() {
  if (projectsPrefetchStarted) return;
  projectsPrefetchStarted = true;
  ['/textures/earth.png', '/textures/jupiter.png', '/textures/mars.png',
   '/textures/moon.png', '/textures/venus.png', '/textures/mercury.png'].forEach((href) => {
    const link = document.createElement('link');
    link.rel  = 'prefetch';
    link.as   = 'image';
    link.href = href;
    document.head.appendChild(link);
  });
}

let skillsPrefetchStarted = false;
function prefetchSkillsAssets() {
  if (skillsPrefetchStarted) return;
  skillsPrefetchStarted = true;
  const link = document.createElement('link');
  link.rel  = 'prefetch';
  link.as   = 'fetch';
  link.href = '/models/spaceship-diagram.glb';
  document.head.appendChild(link);
}

// ── Nav link with text-width underline ────────────────────────────────────────
const NAV_LINKS = [
  { to: "/",           label: "HOME"       },
  { to: "/experience", label: "EXPERIENCE" },
  { to: "/projects",   label: "PROJECTS"   },
  { to: "/skills",     label: "SKILLS"     },
  { to: "/gallery",     label: "GALLERY"     },

];

function NavLink({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  const [hovered, setHovered] = useState(false);
  const lit = active || hovered;

  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={() => {
        setHovered(true);
        if (to === '/experience') prefetchExperienceAssets();
        if (to === '/projects')   prefetchProjectsAssets();
        if (to === '/skills')     prefetchSkillsAssets();
      }}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        "inline-flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            "5px",
        textDecoration: "none",
        fontFamily:     MONO,
        fontSize:       "13px",
        fontWeight:     500,
        letterSpacing:  "0.3em",
        textTransform:  "uppercase" as const,
        color:          active ? C_BRIGHT : hovered ? C_CYAN : C_MUTED,
        textShadow:     active
          ? `0 0 12px ${C_CYAN}, 0 0 24px rgba(34,211,238,0.4)`
          : hovered
          ? `0 0 8px rgba(34,211,238,0.5)`
          : "none",
        transition:     "color 0.25s ease, text-shadow 0.25s ease",
        padding:        "4px 0",
      }}
    >
      {label}
      {/* Underline — expands from center, width matches text */}
      <span
        style={{
          display:      "block",
          height:       "1px",
          width:        lit ? "100%" : "0%",
          background:   active
            ? `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`
            : `linear-gradient(90deg, transparent, ${C_CYAN}, transparent)`,
          boxShadow:    lit ? `0 0 6px ${C_CYAN}` : "none",
          transition:   "width 0.3s ease, box-shadow 0.25s ease",
        }}
      />
    </Link>
  );
}

// ── Social icon wrapper ───────────────────────────────────────────────────────
function SocialIcon({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:    "inline-flex",
        alignItems: "center",
        padding:    "8px",
        color:      hovered ? C_BRIGHT : C_DIM,
        filter:     hovered ? `drop-shadow(0 0 6px ${C_CYAN})` : "none",
        transition: "color 0.2s ease, filter 0.2s ease",
        cursor:     "pointer",
      }}
    >
      {children}
    </span>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const revealHeader = () => window.dispatchEvent(new Event("nav-reveal-header"));

  const tooltipPanelStyle: React.CSSProperties = {
    fontFamily:     MONO,
    fontSize:       "10px",
    letterSpacing:  "0.2em",
    textTransform:  "uppercase",
    background:     "rgba(0,4,8,0.96)",
    border:         `1px solid rgba(34,211,238,0.22)`,
    color:          C_BRIGHT,
    boxShadow:      `0 0 20px rgba(34,211,238,0.12)`,
    padding:        "4px 10px",
  };

  return (
    <>
      {/* ── Bar ─────────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 z-50 w-full backdrop-blur-xl"
        style={{
          height:       "var(--nav-height)",
          background:   "rgba(0, 3, 8, 0.92)",
          borderBottom: `1px solid rgba(34,211,238,0.1)`,
          boxShadow:    "0 4px 40px rgba(0,0,0,0.5)",
          display:      "flex",
          alignItems:   "center",
          padding:      "0 28px",
        }}
      >
        {/* Corner accents */}
        <span className="pointer-events-none absolute top-0 left-0 h-px w-20"
          style={{ background: `linear-gradient(90deg, ${C_CYAN}, transparent)` }} />
        <span className="pointer-events-none absolute top-0 left-0 w-px h-5"
          style={{ background: `linear-gradient(180deg, ${C_CYAN}, transparent)` }} />
        <span className="pointer-events-none absolute top-0 right-0 h-px w-20"
          style={{ background: `linear-gradient(270deg, ${C_CYAN}, transparent)` }} />
        <span className="pointer-events-none absolute top-0 right-0 w-px h-5"
          style={{ background: `linear-gradient(180deg, ${C_CYAN}, transparent)` }} />

        {/* ── LEFT: Brand ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
          >
            <LuRocket style={{ fontSize: "18px", color: C_DIM, flexShrink: 0 }} />
            <span
              style={{
                fontFamily:    MONO,
                fontSize:      "12px",
                fontWeight:    600,
                letterSpacing: "0.3em",
                textTransform: "uppercase" as const,
                color:         C_DIM,
                whiteSpace:    "nowrap",
              }}
            >
              Wesley Chou
            </span>
          </Link>
        </div>

        {/* ── CENTER: Nav links (desktop) ──────────────────────────────────── */}
        <nav
          className="hidden md:flex"
          style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: "36px" }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} label={label} onClick={revealHeader} />
          ))}
        </nav>

        {/* ── RIGHT: Social icons ──────────────────────────────────────────── */}
        <div
          style={{
            flex:        1,
            display:     "flex",
            alignItems:  "center",
            justifyContent: "flex-end",
            gap:         "4px",
          }}
        >
          <Tooltip>
            <TooltipTrigger render={
              <a href="https://github.com/wcia013twe" aria-label="GitHub"
                target="_blank" rel="noopener noreferrer">
                <SocialIcon><FaGithub size={20} /></SocialIcon>
              </a>
            } />
            <TooltipPanel side="bottom" sideOffset={6} style={tooltipPanelStyle}>GitHub</TooltipPanel>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={
              <a href="https://www.linkedin.com/in/weschou013/" aria-label="LinkedIn"
                target="_blank" rel="noopener noreferrer">
                <SocialIcon><FaLinkedin size={20} /></SocialIcon>
              </a>
            } />
            <TooltipPanel side="bottom" sideOffset={6} style={tooltipPanelStyle}>LinkedIn</TooltipPanel>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={
              <a href="documents/Website_Cleaned_Resume.pdf" aria-label="Resume">
                <SocialIcon><CgFileDocument size={20} /></SocialIcon>
              </a>
            } />
            <TooltipPanel side="bottom" sideOffset={6} style={tooltipPanelStyle}>Resume</TooltipPanel>
          </Tooltip>

          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 ml-2"
            style={{ color: C_DIM, background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </header>

      {/* ── Mobile overlay ────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <nav
            className="fixed inset-0 flex flex-col items-center justify-center animate-slide-in"
            style={{ background: "rgba(0,3,8,0.97)", backdropFilter: "blur(24px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner accents */}
            <span className="pointer-events-none absolute top-0 left-0 h-px w-40"
              style={{ background: `linear-gradient(90deg, ${C_CYAN}, transparent)` }} />
            <span className="pointer-events-none absolute top-0 left-0 w-px h-20"
              style={{ background: `linear-gradient(180deg, ${C_CYAN}, transparent)` }} />
            <span className="pointer-events-none absolute bottom-0 right-0 h-px w-40"
              style={{ background: `linear-gradient(270deg, ${C_CYAN}, transparent)` }} />
            <span className="pointer-events-none absolute bottom-0 right-0 w-px h-20"
              style={{ background: `linear-gradient(0deg, ${C_CYAN}, transparent)` }} />

            {/* Close */}
            <button
              className="absolute top-5 right-5 p-2"
              style={{ color: C_DIM, background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  label={label}
                  onClick={() => { setMobileOpen(false); revealHeader(); }}
                />
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default Navbar;
