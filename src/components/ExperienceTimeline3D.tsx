// @ts-nocheck
/**
 * ExperienceTimeline3D — chase-cam 3D spaceship timeline for the Experience page.
 *
 * Scene layout:
 *   - Camera follows behind a spaceship flying along the -Z axis.
 *   - Experience entries are anchored alternately at X=±CARD_X, evenly spaced along Z.
 *   - HTML cards (CSS2DRenderer) are always visible at full opacity — no distance fade.
 *   - Collapsed state: compact logo badge.  Click to expand in place.
 *   - Scroll wheel or ↑↓ arrow keys drive navigation.
 *
 * Raw Three.js (no R3F) — same pattern as SolarSystem.tsx.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import getStarfield from "./solar-system/src/getStarfield.js";
import getNebula from "./getExperienceNebula.js";
import getAurora from "./getAurora.js";
import { getConstellationLines, CONSTELLATIONS } from "./getConstellationLines.js";
import { professionalExperience, academicExperience } from "@/lib/experience";

// ── Feature flags ─────────────────────────────────────────────────────────────

// ── Constants ─────────────────────────────────────────────────────────────────
const CARD_SPACING = 22; // world units between entries along Z
const CARD_X = 5.2; // world units cards sit from the spine (left/right)
const FOV = 62;
const CAM_Z_OFFSET = 10; // camera is this far behind the action point
const SHIP_Z_OFFSET = -1; // ship is this far ahead of the action point

// ── Warp intro animation ───────────────────────────────────────────────────
const WARP_DUR = 1.9; // hyperspeed beam phase duration (seconds)
let warpIntroSeen = false; // resets on page refresh, persists during SPA navigation
const RESOLVE_DUR = 0.55; // beam fade-out phase duration (seconds)
const LANDING_DUR = 2.0; // ship decelerates onto ring after warp resolves
const BEAM_COUNT = 300; // number of hyperspeed beam segments

// ── Ship & boost tuning ───────────────────────────────────────────────────────
const SHIP_X = 1.7; // resting horizontal offset (positive = right)
const SHIP_Y = 1; // resting vertical height (negative = lower)
const SHIP_BOB_AMP = 0.12; // bobbing amplitude (world units)
const SHIP_BOB_SPEED = 0.9; // bobbing speed (radians/s)
const SHIP_MOUSE_X_AMP = 0.22; // lateral drift with mouse
const SHIP_YAW_AMP = 0.07; // yaw (rotation.y) response to mouse X
const SHIP_PITCH_AMP = 0.04; // pitch (rotation.x) response to mouse Y
const SHIP_PITCH_BIAS = -0.04; // constant pitch-down bias
const SHIP_ROLL_AMP = 0.08; // roll (rotation.z) response to mouse X

const BOOST_X_OFFSET = -1.86; // boost X relative to ship center (negative = left)
const BOOST_Y_OFFSET = -0.3; // boost Y relative to ship center
const BOOST_Z_OFFSET = 1.65; // boost Z behind ship (toward camera)
const BOOST_LENGTH = 3; // cylinder length
const BOOST_RADIUS_TOP = 0.13; // radius at ship end
const BOOST_RADIUS_BOT = 0.05; // radius at tail (tapered)

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseStartDate(dateStr: string) {
  return new Date(dateStr.split(" - ")[0]);
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ── Card builder ──────────────────────────────────────────────────────────────
// Collapsed: hero banner + logo badge + title row
// Expanded:  scrollable body with description / skills / overview / responsibilities / links
// section param drives the color palette: indigo for professional, teal for academic
function buildCard(
  entry: any,
  section: "professional" | "academic",
  side: "left" | "right",
): { el: HTMLElement; close: () => void } {
  const CARD_W = 390;
  const CARD_W_OPEN = 600;
  const HERO_H = 160;
  const CLOSED_H = HERO_H + 94; // hero + info header

  const isPro = section === "professional";

  // Professional: indigo/blue  —  Academic: teal/cyan
  const B_IDLE = isPro ? "rgba(70, 90, 180, 0.38)" : "rgba(36, 155, 160, 0.38)";
  const B_HOVER = isPro
    ? "rgba(110, 145, 255, 0.62)"
    : "rgba(55, 200, 210, 0.62)";
  const B_OPEN = isPro
    ? "rgba(120, 155, 255, 0.85)"
    : "rgba(65, 215, 225, 0.85)";
  const S_IDLE = isPro
    ? "0 4px 28px rgba(30, 50, 160, 0.20), inset 0 1px 0 rgba(255,255,255,0.04)"
    : "0 4px 28px rgba(20, 130, 145, 0.20), inset 0 1px 0 rgba(255,255,255,0.04)";
  const S_HOVER = isPro
    ? "0 6px 36px rgba(50, 80, 220, 0.30), inset 0 1px 0 rgba(255,255,255,0.06)"
    : "0 6px 36px rgba(30, 160, 175, 0.30), inset 0 1px 0 rgba(255,255,255,0.06)";
  const S_OPEN = isPro
    ? "0 8px 48px rgba(60, 100, 255, 0.40), inset 0 1px 0 rgba(255,255,255,0.07)"
    : "0 8px 48px rgba(40, 185, 200, 0.42), inset 0 1px 0 rgba(255,255,255,0.07)";

  // ── Root ──────────────────────────────────────────────────────────────────
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    width: ${CARD_W}px;
    max-height: ${CLOSED_H}px;
    overflow: hidden;
    background: linear-gradient(160deg, rgba(12,14,34,0.96) 0%, rgba(8,10,26,0.98) 100%);
    border: 1px solid ${B_IDLE};
    border-radius: 18px;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
    cursor: pointer;
    transition: max-height 0.52s cubic-bezier(0.4,0,0.2,1),
                width 0.52s cubic-bezier(0.4,0,0.2,1),
                margin-left 0.52s cubic-bezier(0.4,0,0.2,1),
                border-color 0.28s ease,
                box-shadow 0.28s ease,
                opacity 0.35s ease;
    backdrop-filter: blur(22px);
    box-shadow: ${S_IDLE};
    user-select: none;
    position: relative;
  `;

  // ── Hero banner ────────────────────────────────────────────────────────────
  const heroWrap = document.createElement("div");
  heroWrap.style.cssText = `
    position: relative;
    width: 100%;
    height: ${HERO_H}px;
    overflow: hidden;
    border-radius: 17px 17px 0 0;
  `;

  const heroImg = document.createElement("img");
  heroImg.src = entry.hero;
  heroImg.alt = entry.altText;
  heroImg.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  `;

  // Dark gradient over bottom of hero so text below reads cleanly
  const heroGrad = document.createElement("div");
  heroGrad.style.cssText = `
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.10) 0%,
      rgba(8,10,26,0.85) 100%
    );
    pointer-events: none;
  `;

  // Logo badge — bottom-left of hero
  const logoBadge = document.createElement("div");
  logoBadge.style.cssText = `
    position: absolute;
    bottom: 12px;
    left: 14px;
    width: 50px;
    height: 50px;
    border-radius: 13px;
    border: 1.5px solid rgba(140, 165, 255, 0.45);
    overflow: hidden;
    background: rgba(12, 16, 48, 0.88);
    box-shadow: 0 2px 16px rgba(0,0,0,0.60);
    flex-shrink: 0;
  `;
  const logoImg = document.createElement("img");
  logoImg.src = entry.imageSrc;
  logoImg.alt = entry.altText;
  logoImg.style.cssText =
    "width:100%;height:100%;object-fit:cover;display:block;";
  logoBadge.appendChild(logoImg);

  // Date chip — bottom-right of hero
  const dateChip = document.createElement("div");
  dateChip.style.cssText = `
    position: absolute;
    bottom: 12px;
    right: 12px;
    font-size: 11px;
    font-family: ui-monospace, monospace;
    letter-spacing: 0.10em;
    color: rgba(210, 222, 255, 0.92);
    background: rgba(10, 14, 40, 0.78);
    border: 1px solid rgba(100, 130, 255, 0.30);
    border-radius: 20px;
    padding: 4px 11px;
    backdrop-filter: blur(8px);
  `;
  dateChip.textContent = entry.date;

  heroWrap.appendChild(heroImg);
  heroWrap.appendChild(heroGrad);
  heroWrap.appendChild(logoBadge);
  heroWrap.appendChild(dateChip);

  // ── Info header (always visible below hero) ────────────────────────────────
  const infoHeader = document.createElement("div");
  infoHeader.style.cssText = `
    padding: 14px 16px 22px 16px;
    position: relative;
  `;

  const titleEl = document.createElement("div");
  titleEl.style.cssText = `
    font-size: 18px;
    font-weight: 700;
    color: rgba(240, 244, 255, 1.0);
    margin-bottom: 5px;
    line-height: 1.2;
    letter-spacing: -0.01em;
  `;
  titleEl.textContent = entry.title;

  const companyRow = document.createElement("div");
  companyRow.style.cssText = `
    font-size: 13px;
    color: rgba(180, 196, 255, 0.80);
    display: flex;
    align-items: center;
    gap: 6px;
  `;
  companyRow.textContent = `${entry.workplace}  ·  ${entry.location}`;

  const arrow = document.createElement("div");
  arrow.style.cssText = `
    position: absolute;
    bottom: 8px;
    right: 14px;
    font-size: 11px;
    color: rgba(110, 140, 228, 0.55);
    transition: transform 0.38s ease, color 0.28s ease;
    pointer-events: none;
    line-height: 1;
  `;
  arrow.textContent = "▼";

  infoHeader.appendChild(titleEl);
  infoHeader.appendChild(companyRow);
  infoHeader.appendChild(arrow);

  // ── Expandable body ────────────────────────────────────────────────────────
  const body = document.createElement("div");
  body.style.cssText = `
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.52s cubic-bezier(0.4,0,0.2,1);
    padding: 0 18px;
    scrollbar-width: thin;
    scrollbar-color: rgba(100,130,255,0.30) transparent;
  `;

  const hr = document.createElement("hr");
  hr.style.cssText = `
    border: none;
    border-top: 1px solid rgba(100, 130, 255, 0.18);
    margin: 0 0 14px 0;
  `;
  body.appendChild(hr);

  // Description
  if (entry.description) {
    const descEl = document.createElement("p");
    descEl.style.cssText = `
      font-size: 13.5px;
      color: rgba(200, 210, 248, 0.88);
      margin: 0 0 14px 0;
      line-height: 1.65;
    `;
    descEl.textContent = entry.description;
    body.appendChild(descEl);
  }

  const accentRgb = isPro ? "100, 128, 218" : "60, 195, 205";
  const chipBorder = isPro
    ? "rgba(80, 108, 215, 0.38)"
    : "rgba(40, 175, 185, 0.38)";
  const chipBg = isPro ? "rgba(22, 32, 90, 0.55)" : "rgba(12, 72, 80, 0.55)";
  const chipColor = isPro
    ? "rgba(168, 185, 255, 0.88)"
    : "rgba(100, 225, 235, 0.88)";

  const sectionLabel = (text: string) => {
    const el = document.createElement("div");
    el.style.cssText = `
      font-size: 10px;
      color: rgba(${accentRgb}, 0.75);
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-family: ui-monospace, monospace;
      margin: 16px 0 8px 0;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(${accentRgb}, 0.15);
    `;
    el.textContent = text;
    return el;
  };

  // Skills chips
  if (entry.skills?.length) {
    body.appendChild(sectionLabel("Skills"));
    const wrap2 = document.createElement("div");
    wrap2.style.cssText =
      "display:flex;flex-wrap:wrap;gap:5px;margin-bottom:4px;";
    entry.skills.slice(0, 9).forEach((s: string) => {
      const chip = document.createElement("span");
      chip.style.cssText = `
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 20px;
        border: 1px solid ${chipBorder};
        background: ${chipBg};
        color: ${chipColor};
        letter-spacing: 0.01em;
      `;
      chip.textContent = s;
      wrap2.appendChild(chip);
    });
    body.appendChild(wrap2);
  }

  // Overview
  if (entry.overview) {
    body.appendChild(sectionLabel("Overview"));
    const ovEl = document.createElement("p");
    ovEl.style.cssText = `
      font-size: 13.5px;
      color: rgba(195, 208, 245, 0.85);
      line-height: 1.68;
      margin: 0 0 4px 0;
    `;
    ovEl.textContent = entry.overview;
    body.appendChild(ovEl);
  }

  // Key responsibilities
  if (entry.key_responsibilities?.length) {
    body.appendChild(sectionLabel("Key Responsibilities"));
    const ul = document.createElement("ul");
    ul.style.cssText = "padding-left: 18px; margin: 0 0 8px 0;";
    entry.key_responsibilities.forEach((r: string) => {
      const li = document.createElement("li");
      li.style.cssText = `
        font-size: 13px;
        color: rgba(192, 204, 244, 0.85);
        line-height: 1.68;
        margin-bottom: 6px;
      `;
      li.textContent = r;
      ul.appendChild(li);
    });
    body.appendChild(ul);
  }

  // Links
  if (entry.links && Object.keys(entry.links).length) {
    body.appendChild(sectionLabel("Links"));
    const linksWrap = document.createElement("div");
    linksWrap.style.cssText =
      "display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;";
    Object.entries(entry.links).forEach(([label, url]: [string, any]) => {
      const a = document.createElement("a");
      a.style.cssText = `
        font-size: 12.5px;
        color: rgba(168, 192, 255, 0.92);
        text-decoration: none;
        padding: 5px 14px;
        border: 1px solid rgba(80, 115, 230, 0.38);
        border-radius: 14px;
        background: rgba(16, 26, 78, 0.55);
        transition: border-color 0.2s, background 0.2s;
        letter-spacing: 0.01em;
      `;
      a.textContent = "↗ " + label;
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.addEventListener("mouseover", () => {
        a.style.borderColor = "rgba(120, 160, 255, 0.55)";
        a.style.background = "rgba(28, 46, 120, 0.60)";
      });
      a.addEventListener("mouseout", () => {
        a.style.borderColor = "rgba(80, 115, 230, 0.32)";
        a.style.background = "rgba(16, 26, 78, 0.52)";
      });
      a.addEventListener("click", (e) => e.stopPropagation());
      linksWrap.appendChild(a);
    });
    body.appendChild(linksWrap);
  }

  // ── Toggle ────────────────────────────────────────────────────────────────
  let expanded = false;

  const shift = (CARD_W_OPEN - CARD_W) / 2;
  const open = () => {
    expanded = true;
    wrap.style.width = `${CARD_W_OPEN}px`;
    wrap.style.marginLeft = `${side === "right" ? shift : -shift}px`;
    wrap.style.maxHeight = "760px";
    wrap.style.borderColor = B_OPEN;
    wrap.style.boxShadow = S_OPEN;
    body.style.maxHeight = "520px";
    body.style.overflowY = "auto";
    heroImg.style.transform = "scale(1.05)";
    arrow.style.transform = "rotate(180deg)";
    arrow.style.color = isPro
      ? "rgba(148, 178, 255, 0.90)"
      : "rgba(80, 220, 230, 0.90)";
  };
  const close = () => {
    expanded = false;
    wrap.style.width = `${CARD_W}px`;
    wrap.style.marginLeft = "0";
    wrap.style.maxHeight = `${CLOSED_H}px`;
    wrap.style.borderColor = B_IDLE;
    wrap.style.boxShadow = S_IDLE;
    body.style.maxHeight = "0";
    body.style.overflowY = "hidden";
    heroImg.style.transform = "scale(1)";
    arrow.style.transform = "rotate(0deg)";
    arrow.style.color = isPro
      ? "rgba(110, 140, 228, 0.52)"
      : "rgba(50, 185, 195, 0.52)";
  };

  wrap.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).tagName === "A") return;
    expanded ? close() : open();
  });
  wrap.addEventListener("mouseenter", () => {
    if (!expanded) {
      wrap.style.borderColor = B_HOVER;
      wrap.style.boxShadow = S_HOVER;
      heroImg.style.transform = "scale(1.03)";
    }
  });
  wrap.addEventListener("mouseleave", () => {
    if (!expanded) {
      wrap.style.borderColor = B_IDLE;
      wrap.style.boxShadow = S_IDLE;
      heroImg.style.transform = "scale(1)";
    }
  });

  wrap.appendChild(heroWrap);
  wrap.appendChild(infoHeader);
  wrap.appendChild(body);

  return { el: wrap, close };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ExperienceTimeline3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;

    // Play the warp intro on every fresh page load; skip if already seen this session
    const showWarpIntro = !warpIntroSeen;
    let w = container.clientWidth;
    let h = container.clientHeight;

    // ── Entry ordering: professional first, then academic ─────────────────────
    const profCount = professionalExperience.length;
    const allEntries = [...professionalExperience, ...academicExperience];

    const entryZ = allEntries.map((_, i) => -i * CARD_SPACING);
    const entryX = allEntries.map((_, i) => (i % 2 === 0 ? CARD_X : -CARD_X));
    const MIN_Z = -(allEntries.length - 1) * CARD_SPACING;

    // Divider sits in the gap between last professional entry and first academic
    const dividerZ = (entryZ[profCount - 1] + entryZ[profCount]) / 2;

    // targetZ values that place the ship exactly on each ring
    // ship.position.z = currentZ + SHIP_Z_OFFSET  →  currentZ = ringWorldZ - SHIP_Z_OFFSET
    const RING_PRO_STOP = 6 - SHIP_Z_OFFSET; // ship on entrance ring (Z=+6)
    const RING_DIV_STOP = dividerZ - SHIP_Z_OFFSET; // ship on divider ring

    // All snap stops, descending (entrance ring → entries → divider ring → entries)
    const snapStops = [
      RING_PRO_STOP,
      ...allEntries.map((_, i) => entryZ[i]),
      RING_DIV_STOP,
    ].sort((a, b) => b - a);

    // ── WebGL renderer ────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── CSS2D renderer ────────────────────────────────────────────────────────
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(w, h);
    Object.assign(labelRenderer.domElement.style, {
      position: "absolute",
      top: "0",
      left: "0",
      pointerEvents: "none", // root layer: none; individual cards set auto
      zIndex: "5",
    });
    container.appendChild(labelRenderer.domElement);

    // ── Scene & camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05060f);
    const camera = new THREE.PerspectiveCamera(FOV, w / h, 0.1, 500);
    camera.position.set(0, 3.5, CAM_Z_OFFSET);

    // ── Bloom ─────────────────────────────────────────────────────────────────
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      0.45,
      0.4,
      0.42,
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x334466, 0.9));
    const frontLight = new THREE.DirectionalLight(0x8899ff, 1.6);
    frontLight.position.set(0, 5, 10);
    scene.add(frontLight);
    const engineLight = new THREE.PointLight(0xff6020, 3.5, 10, 2);
    scene.add(engineLight);

    // ── Backgrounds (hidden during warp, revealed on idle) ────────────────────
    // Three size layers for variation — total ~1300 stars, sizes between 0.05 (skills) and 0.32 (old)
    const stars = new THREE.Group();
    stars.add(getStarfield({ numStars: 900, size: 0.1, saturation: 0.12 }));
    stars.add(getStarfield({ numStars: 300, size: 0.17, saturation: 0.12 }));
    stars.add(getStarfield({ numStars: 100, size: 0.24, saturation: 0.12 }));
    const nebula1 = getNebula({
      hue: 0.65,
      numSprites: 12,
      opacity: 0.06,
      radius: 50,
      size: 95,
      z: -100,
      sat: 0.28,
    });
    const nebula2 = getNebula({
      hue: 0.0,
      numSprites: 10,
      opacity: 0.08,
      radius: 40,
      size: 75,
      z: 30,
    });
    // stars/nebula visible from the start — they show through the warp beams
    scene.add(stars);
    scene.add(nebula1);
    scene.add(nebula2);

    // ── Faint colour tints over the blue nebula ────────────────────────────────
    const auroraGroup = new THREE.Group();
    auroraGroup.add(
      getAurora({
        hue: 0.35,
        numSprites: 8,
        opacity: 0.02,
        radius: 75,
        size: 130,
        z: -100,
        sat: 0.7,
      }),
    ); // green
    auroraGroup.add(
      getAurora({
        hue: 0.92,
        numSprites: 7,
        opacity: 0.02,
        radius: 70,
        size: 115,
        z: -95,
        sat: 0.65,
      }),
    ); // pink
    scene.add(auroraGroup);

    // ── Constellations — one per career entry, world-space (not parented to stars) ──
    // Spawn offsets are relative to each entry's base position (entryX[i], 0, entryZ[i]).
    // Edit these to reposition individual constellations: [dX, dY, dZ]
    // Positive dX = further right, negative = further left. Negative dZ = deeper background.
    const CONSTELLATION_OFFSETS: ([number, number, number] | null)[] = [
      [3, 0, -5], // entry 0
      null, // entry 1
      [-24, -5, -15], // entry 2
      null, // entry 3
      [4, 3, -5], // entry 4
      null, // entry 5
      [-18, -5, -8], // entry 6
      [16, 1, -5], // entry 7
    ];

    const circleTexture = new THREE.TextureLoader().load(
      "/textures/circle.png",
    );
    const constellationProgress = new Float32Array(allEntries.length);
    const constellations = allEntries.map((_, i) => {
      const off = CONSTELLATION_OFFSETS[i];
      if (off == null) return null; // catches both null (explicit skip) and undefined (out of bounds)
      return getConstellationLines({  // also returns null if definition is null in getConstellationLines.js
        position: new THREE.Vector3(
          entryX[i] + off[0],
          off[1],
          entryZ[i] + off[2],
        ),
        definitionIndex: i,
        circleTexture,
        isPro: i < profCount,
        scale: 0.7,
      });
    });
    constellations.forEach((c) => c && scene.add(c.group));

    // ── Raycaster for constellation hover ────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 2.5 };
    const constellationStarPoints = constellations.map(
      (c) => c?.starsPoints ?? null,
    );

    // ── Asteroid field (reuses Rock1/Rock2/Rock3 OBJ assets from solar system) ─
    // Zinc/cool-grey palette — varied roughness so each rock reads differently under bloom
    const astMats = [
      new THREE.MeshStandardMaterial({
        color: 0xa1a1aa,
        roughness: 0.88,
        metalness: 0.08,
      }), // zinc-400
      new THREE.MeshStandardMaterial({
        color: 0x71717a,
        roughness: 0.93,
        metalness: 0.06,
      }), // zinc-500
      new THREE.MeshStandardMaterial({
        color: 0x52525b,
        roughness: 0.95,
        metalness: 0.04,
      }), // zinc-600
      new THREE.MeshStandardMaterial({
        color: 0x3f3f46,
        roughness: 0.97,
        metalness: 0.03,
      }), // zinc-700
      new THREE.MeshStandardMaterial({
        color: 0x8b8b96,
        roughness: 0.9,
        metalness: 0.07,
      }), // zinc-400/500 mid
    ];
    const asteroidMeshes: THREE.Mesh[] = [];
    const astRotVel: { x: number; y: number; z: number }[] = [];
    const astLoadedGeos: THREE.BufferGeometry[] = [];

    const astZSpan = Math.abs(MIN_Z) + 40;

    // Spawn a single asteroid at a given world position + scale
    const spawnAsteroid = (
      geo: THREE.BufferGeometry,
      x: number,
      y: number,
      z: number,
      s: number,
    ) => {
      const mesh = new THREE.Mesh(
        geo,
        astMats[Math.floor(Math.random() * astMats.length)],
      );
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(s);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      );
      astRotVel.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.42,
        z: (Math.random() - 0.5) * 0.24,
      });
      scene.add(mesh);
      asteroidMeshes.push(mesh);
    };

    const objLoader = new OBJLoader();
    ["Rock1", "Rock2", "Rock3"].forEach((name) => {
      objLoader.load(`/rocks/${name}.obj`, (obj) => {
        if (disposed) return;
        let rockGeo: THREE.BufferGeometry | null = null;
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !rockGeo) {
            rockGeo = (child as THREE.Mesh).geometry;
          }
        });
        if (!rockGeo) return;
        astLoadedGeos.push(rockGeo);

        // ── Scattered individuals (10 per rock type) ──────────────────────────
        for (let i = 0; i < 10; i++) {
          const sign = Math.random() > 0.5 ? 1 : -1;
          spawnAsteroid(
            rockGeo,
            sign * (5.5 + Math.random() * 10),
            (Math.random() - 0.5) * 18,
            20 - Math.random() * astZSpan,
            0.14 + Math.random() * 0.22,
          );
        }

        // ── Clusters (3 per rock type, 4–8 rocks each) ────────────────────────
        for (let c = 0; c < 3; c++) {
          const sign = Math.random() > 0.5 ? 1 : -1;
          const cx = sign * (6 + Math.random() * 9);
          const cy = (Math.random() - 0.5) * 14;
          const cz = 20 - Math.random() * astZSpan;
          const radius = 1.8 + Math.random() * 2.0; // cluster spread radius
          const count = 4 + Math.floor(Math.random() * 5); // 4–8 members

          // Anchor rock — slightly larger, at the cluster center
          spawnAsteroid(rockGeo, cx, cy, cz, 0.22 + Math.random() * 0.18);

          // Surrounding rocks — scattered within the cluster radius
          for (let r = 1; r < count; r++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const d = radius * (0.3 + Math.random() * 0.7);
            spawnAsteroid(
              rockGeo,
              cx + d * Math.sin(phi) * Math.cos(theta),
              cy + d * Math.sin(phi) * Math.sin(theta),
              cz + d * Math.cos(phi),
              0.08 + Math.random() * 0.18,
            );
          }
        }
      });
    });

    // ── Timeline spine ────────────────────────────────────────────────────────
    const spineLen = (allEntries.length - 1) * CARD_SPACING;
    const spineCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 6),
      new THREE.Vector3(0, 0, -(spineLen + 6)),
    ]);
    const spine = new THREE.Mesh(
      new THREE.TubeGeometry(spineCurve, 60, 0.015, 8, false),
      new THREE.MeshBasicMaterial({ color: 0xcccccc, toneMapped: false }),
    );
    spine.visible = !showWarpIntro;
    scene.add(spine);

    // ── Entry nodes + connectors + CSS2D cards ────────────────────────────────
    const nodeGeo = new THREE.SphereGeometry(0.13, 10, 10);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      toneMapped: false,
    });

    // Preload hero images now so they're cached when cards are built later
    allEntries.forEach((entry) => {
      if (entry.hero) {
        new Image().src = entry.hero;
      }
    });

    // cards[i] = { el, close } — null until buildAllCards() runs after fly-in
    const cards: Array<{ el: HTMLElement; close: () => void } | null> = [];
    // card anchors created immediately (needed for 3D positioning); CSS2DObjects added later
    const cardAnchors: THREE.Object3D[] = [];

    // Collect nodes + connectors so they can be hidden during warp and revealed together
    const timelineNodes: THREE.Mesh[] = [];
    const timelineConns: THREE.Line[] = [];

    allEntries.forEach((entry, i) => {
      const z = entryZ[i];
      const x = entryX[i];

      // Glowing node on spine
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(0, 0, z);
      node.visible = !showWarpIntro;
      scene.add(node);
      timelineNodes.push(node);

      // Connector: spine → card anchor
      const conn = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, z),
          new THREE.Vector3(x, 0, z),
        ]),
        new THREE.LineBasicMaterial({
          color: 0x999999,
          transparent: true,
          opacity: 0.4,
          toneMapped: false,
        }),
      );
      conn.visible = !showWarpIntro;
      scene.add(conn);
      timelineConns.push(conn);

      cards.push(null); // deferred — built in buildAllCards()

      const anchor = new THREE.Object3D();
      anchor.position.set(x, 0, z);
      scene.add(anchor);
      cardAnchors.push(anchor);
    });

    // Build all card DOM elements and attach CSS2DObjects — called once fly-in ends
    const buildAllCards = () => {
      allEntries.forEach((entry, i) => {
        if (cards[i]) return;
        const section = i < profCount ? "professional" : "academic";
        const side = entryX[i] > 0 ? "right" : "left";
        const card = buildCard(entry, section, side);
        cards[i] = card;
        card.el.style.opacity = "0";
        card.el.style.pointerEvents = "none";
        cardAnchors[i].add(new CSS2DObject(card.el));
      });
    };

    // ── Professional entrance ring + label ────────────────────────────────────
    // Sits at the spine entry point (Z=+6) — the "gateway" to the career timeline

    const proRingGeo = new THREE.TorusGeometry(1.6, 0.025, 8, 56);
    const proRingMat = new THREE.MeshBasicMaterial({
      color: 0x33ee77,
      toneMapped: false,
    });
    const proRing = new THREE.Mesh(proRingGeo, proRingMat);
    proRing.rotation.x = Math.PI * 0.5;
    proRing.position.set(0, 0, 6);
    proRing.visible = !showWarpIntro;
    scene.add(proRing);

    // Label floated below the ring
    const proLabelEl = document.createElement("div");
    proLabelEl.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      width: 340px;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.8s ease;
    `;
    const mkProLine = () => {
      const d = document.createElement("div");
      d.style.cssText =
        "flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(100,136,255,0.45),transparent);";
      return d;
    };
    const proLabelText = document.createElement("div");
    proLabelText.style.cssText = `
      font-size: 9px;
      font-family: ui-monospace, monospace;
      letter-spacing: 0.24em;
      color: rgba(120, 160, 255, 0.72);
      text-transform: uppercase;
      white-space: nowrap;
      padding: 3px 10px;
      border: 1px solid rgba(100, 136, 255, 0.22);
      border-radius: 20px;
      background: rgba(10, 14, 48, 0.72);
      backdrop-filter: blur(8px);
    `;
    proLabelText.textContent = "Professional Experience";
    proLabelEl.appendChild(mkProLine());
    proLabelEl.appendChild(proLabelText);
    proLabelEl.appendChild(mkProLine());

    const proLabelAnchor = new THREE.Object3D();
    proLabelAnchor.position.set(0, -0.7, 6);
    scene.add(proLabelAnchor);
    proLabelAnchor.add(new CSS2DObject(proLabelEl));

    // ── Academic section divider: torus ring between professional and academic ─
    const ringGeo = new THREE.TorusGeometry(1.4, 0.022, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x33ee77,
      toneMapped: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.5;
    ring.position.set(0, 0, dividerZ);
    ring.visible = !showWarpIntro;
    scene.add(ring);

    const divEl = document.createElement("div");
    divEl.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      width: 340px;
      pointer-events: none;
      margin-top: -6px;
    `;
    const mkLine = () => {
      const d = document.createElement("div");
      d.style.cssText =
        "flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(50,215,225,0.45),transparent);";
      return d;
    };
    const divLabel = document.createElement("div");
    divLabel.style.cssText = `
      font-size: 9px;
      font-family: ui-monospace, monospace;
      letter-spacing: 0.24em;
      color: rgba(60, 215, 225, 0.70);
      text-transform: uppercase;
      white-space: nowrap;
      padding: 3px 10px;
      border: 1px solid rgba(50, 200, 215, 0.22);
      border-radius: 20px;
      background: rgba(8, 40, 48, 0.70);
      backdrop-filter: blur(8px);
    `;
    divLabel.textContent = "Academic & Leadership";
    divEl.appendChild(mkLine());
    divEl.appendChild(divLabel);
    divEl.appendChild(mkLine());

    const divAnchor = new THREE.Object3D();
    divAnchor.position.set(0, -0.6, dividerZ);
    scene.add(divAnchor);
    divAnchor.add(new CSS2DObject(divEl));

    // ── Navigation dots ───────────────────────────────────────────────────────
    let targetZ = RING_PRO_STOP;

    const navContainer = document.createElement("div");
    Object.assign(navContainer.style, {
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: "9px",
      zIndex: "20",
      pointerEvents: "auto",
    });
    const navDots: HTMLElement[] = [];
    allEntries.forEach((entry, i) => {
      const isPro = i < profCount;
      const dotColor = isPro
        ? "rgba(248, 113, 113, 0.55)"
        : "rgba(252, 165, 165, 0.45)";
      const dotActive = isPro ? "#ff4444" : "#ff6666";
      const dot = document.createElement("div");
      Object.assign(dot.style, {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        border: `1px solid ${dotColor}`,
        background: "transparent",
        cursor: "pointer",
        transition: "all 0.3s ease",
      });
      dot.dataset.activeColor = dotActive;
      dot.title = entry.workplace;
      dot.addEventListener("click", () => {
        if (introPhase !== "idle") return;
        targetZ = entryZ[i];
      });
      navContainer.appendChild(dot);
      navDots.push(dot);
    });
    container.appendChild(navContainer);
    navContainer.style.opacity = showWarpIntro ? "0" : "1";
    navContainer.style.transition = "opacity 0.8s ease";

    // ── Scroll hint ───────────────────────────────────────────────────────────
    const hint = document.createElement("div");
    Object.assign(hint.style, {
      position: "absolute",
      bottom: "28px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "rgba(150, 170, 255, 0.65)",
      fontFamily: "ui-monospace, monospace",
      fontSize: "11px",
      letterSpacing: "0.18em",
      opacity: "0",
      transition: "opacity 1s ease",
      pointerEvents: "none",
      zIndex: "20",
      whiteSpace: "nowrap",
    });
    hint.innerHTML = "↓ &nbsp;SCROLL OR ↑↓ TO NAVIGATE&nbsp; ↓";
    container.appendChild(hint);

    // ── Constellation hover tooltip ───────────────────────────────────────────
    const CONST_DESCRIPTIONS: Record<string, string> = {
      'Big Dipper':  'Seven stars forming the iconic bowl-and-handle ladle. The two outer bowl stars point toward Polaris.',
      'Orion':       'The hunter — belt anchors the figure, with raised club (left) and shield/bow (right) framing the silhouette.',
      'Cassiopeia':  'Queen of Ethiopia — a compact W-shaped zigzag of five bright stars, circumpolar and instantly recognizable.',
      'Cygnus':      'The swan in flight. Spine forms the Northern Cross; wings fan outward from Sadr at the hub.',
      'Scorpius':    'The scorpion — Antares marks the heart, claws fan upward, and a J-hook tail curves back to the stinger.',
    };
    const constTooltip = document.createElement("div");
    Object.assign(constTooltip.style, {
      position: "absolute",
      pointerEvents: "none",
      zIndex: "30",
      background: "rgba(8,10,32,0.88)",
      border: "1px solid rgba(100,136,255,0.35)",
      borderRadius: "8px",
      padding: "10px 14px",
      maxWidth: "220px",
      opacity: "0",
      transition: "opacity 0.15s ease",
      backdropFilter: "blur(8px)",
    });
    constTooltip.innerHTML = `
      <div id="ct-name" style="font-family:ui-monospace,monospace;font-size:14px;letter-spacing:0.14em;color:rgba(200,215,255,0.95);margin-bottom:5px;"></div>
      <div id="ct-desc" style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:0.05em;color:rgba(140,170,255,0.65);line-height:1.55;"></div>
    `;
    container.appendChild(constTooltip);
    const ctName = constTooltip.querySelector("#ct-name") as HTMLElement;
    const ctDesc = constTooltip.querySelector("#ct-desc") as HTMLElement;
    let lastHoveredConstIdx = -1;

    let hintDismissed = false;
    const dismissHint = () => {
      if (hintDismissed) return;
      hintDismissed = true;
      hint.style.opacity = "0";
    };

    // ── Intro state machine ───────────────────────────────────────────────────
    // warp → resolve → landing → idle  (waiting = resolve done but ship GLTF not yet loaded)
    type IntroPhase = "warp" | "resolve" | "waiting" | "landing" | "idle";
    let introPhase: IntroPhase = showWarpIntro ? "warp" : "idle";
    let introProg = 0; // 0→1 within current phase
    if (!showWarpIntro) buildAllCards();

    const PHASE_DUR = {
      warp: WARP_DUR,
      resolve: RESOLVE_DUR,
      landing: LANDING_DUR,
    };

    // ── Hyperspeed warp beams (LineSegments along Z — rush directly at camera) ──
    const BEAM_N = BEAM_COUNT;
    const bAngle = new Float32Array(BEAM_N);
    const bSpread = new Float32Array(BEAM_N);
    const bSpeed = new Float32Array(BEAM_N);
    const bZ = new Float32Array(BEAM_N);
    const bLen = new Float32Array(BEAM_N);

    for (let i = 0; i < BEAM_N; i++) {
      bAngle[i] = Math.random() * Math.PI * 2;
      bSpread[i] = Math.random() * 5.5 + 0.3; // 0.3–5.8 units from Z axis
      bSpeed[i] = Math.random() * 45 + 25; // 25–70 units/s
      bZ[i] = Math.random() * 160 - 160; // –160 to 0 initially
      bLen[i] = Math.random() * 18 + 4; // 4–22 unit base length
    }

    const beamPos = new Float32Array(BEAM_N * 6); // 2 pts × 3 coords
    const beamCol = new Float32Array(BEAM_N * 6);
    const beamGeo = new THREE.BufferGeometry();
    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPos, 3));
    beamGeo.setAttribute("color", new THREE.BufferAttribute(beamCol, 3));
    const warpLines = new THREE.LineSegments(
      beamGeo,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(warpLines);
    warpLines.visible = showWarpIntro;

    const resetBeamsAhead = () => {
      const camZ = currentZ + CAM_Z_OFFSET;
      for (let i = 0; i < BEAM_N; i++) {
        bZ[i] = camZ - Math.random() * 160;
      }
    };

    // ── Spaceship ─────────────────────────────────────────────────────────────
    let ship: THREE.Object3D | null = null;
    let rimOverlay: THREE.Object3D | null = null;

    // Rim lights — warm amber (engine rear) + cool blue (upper hull)
    const shipWarmLight = new THREE.PointLight(0xff7030, 10, 11, 2);
    const shipCoolLight = new THREE.PointLight(0x7799cc, 5, 10, 2);
    scene.add(shipWarmLight);
    scene.add(shipCoolLight);

    // Engine boost (separate mesh, updated every frame)
    const boostTex = new THREE.TextureLoader().load(
      "/textures/energy-beam-opacity.png",
    );
    const engineBoost = new THREE.Mesh(
      new THREE.CylinderGeometry(
        BOOST_RADIUS_BOT,
        BOOST_RADIUS_TOP,
        BOOST_LENGTH,
        12,
      ),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(3.5, 1.2, 0.06),
        alphaMap: boostTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        blendDst: THREE.OneFactor,
        blendEquation: THREE.AddEquation,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    engineBoost.rotation.x = Math.PI * 0.5;
    engineBoost.visible = false; // hidden until ship lands
    scene.add(engineBoost);

    // THREE.Cache keeps loaded files in memory for the session lifetime.
    // If the user navigates away and back, GLTFLoader serves the GLB from
    // memory instead of re-fetching — fly-in starts instantly on revisit.
    THREE.Cache.enabled = true;

    const gltfLoader = new GLTFLoader();
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    gltfLoader.load("/models/spaceship.glb", (gltf) => {
      ship = gltf.scene;
      ship.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.roughness = Math.max(0.2, m.roughness - 0.1);
            m.metalness = Math.min(1.0, m.metalness + 0.15);
          }
        });
      });
      ship.scale.setScalar(0.25);
      ship.rotation.y = Math.PI;
      // Place ship at its idle position immediately — camera flies in to meet it
      ship.position.set(SHIP_X, SHIP_Y, RING_PRO_STOP + SHIP_Z_OFFSET);
      ship.visible = false; // hidden until fly-in begins (avoids close-spawn pop during warp)
      scene.add(ship);

      // ── Rim glow overlay (fresnel silhouette, same as homepage ship) ──────
      const rimMat = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.FrontSide,
        uniforms: {
          uWarm: { value: new THREE.Color(2.2, 0.38, 0.05) },
          uPower: { value: 2.2 },
          uIntensity: { value: 0.65 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vViewNormal;
          varying vec3 vViewDir;
          void main() {
            vViewNormal = normalize(normalMatrix * normal);
            vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
            vViewDir    = normalize(-mvPos.xyz);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3  uWarm;
          uniform float uPower;
          uniform float uIntensity;
          varying vec3  vViewNormal;
          varying vec3  vViewDir;
          void main() {
            float rim = 1.0 - abs(dot(vViewNormal, vViewDir));
            rim = pow(rim, uPower) * uIntensity;
            float rightBoost = mix(0.2, 1.8, clamp(-vViewNormal.x * 0.8 + 0.5, 0.0, 1.0));
            rim *= rightBoost;
            gl_FragColor = vec4(uWarm * rim, rim);
          }
        `,
        toneMapped: false,
      });
      rimOverlay = ship.clone(true);
      rimOverlay.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.material = rimMat;
        mesh.renderOrder = 1;
      });
      scene.add(rimOverlay);

      // If resolve already finished while we were loading, start landing;
      // if warp intro is disabled entirely, show ship immediately in idle.
      if (introPhase === "waiting") {
        warpLines.visible = false;
        ship.visible = true;
        rimOverlay.visible = true;
        engineBoost.visible = true;
        introProg = 0;
        introPhase = "landing";
      } else if (introPhase === "idle") {
        ship.visible = true;
        rimOverlay.visible = true;
        engineBoost.visible = true;
      }
    });

    // ── Mouse ─────────────────────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let mouseClientX = 0;
    let mouseClientY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / w) * 2 - 1;
      mouseY = -((e.clientY / h) * 2 - 1);
      mouseClientX = e.clientX;
      mouseClientY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Controls (scroll snaps to nearest entry after idle) ───────────────────
    let snapTimer: ReturnType<typeof setTimeout> | null = null;
    const nearestStopIdx = () =>
      snapStops.reduce(
        (best, s, i) =>
          Math.abs(s - targetZ) < Math.abs(snapStops[best] - targetZ)
            ? i
            : best,
        0,
      );
    const snapToNearest = () => {
      isSnapping = true;
      scrollWarpFactor = 0;
      targetZ = snapStops[nearestStopIdx()];
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (introPhase !== "idle") return;
      dismissHint();
      targetZ = Math.max(
        MIN_Z,
        Math.min(RING_PRO_STOP, targetZ - e.deltaY * 0.032),
      );
      if (e.deltaY > 0) {
        if (scrollWarpFactor < 0.05) resetBeamsAhead();
        scrollWarpFactor = Math.min(1, scrollWarpFactor + e.deltaY * 0.004);
      }
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(snapToNearest, 380);
    };
    const onKeydown = (e: KeyboardEvent) => {
      if (introPhase !== "idle") return;
      const idx = nearestStopIdx();
      if (e.key === "ArrowDown" || e.key === "s") {
        dismissHint();
        if (idx < snapStops.length - 1) {
          targetZ = snapStops[idx + 1];
          if (scrollWarpFactor < 0.05) resetBeamsAhead();
          scrollWarpFactor = Math.min(1, scrollWarpFactor + 0.5);
        }
      } else if (e.key === "ArrowUp" || e.key === "w") {
        dismissHint();
        if (idx > 0) targetZ = snapStops[idx - 1];
      }
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeydown);

    // ── Animation loop ────────────────────────────────────────────────────────
    let animId: number;
    let currentZ = 0;
    let prevCurrentZ = 0;
    let boostFactor = 0; // 0 = idle flame, 1 = full throttle
    let scrollWarpFactor = 0; // 0 = no flash, 1 = full warp flash; decays each frame
    let isSnapping = false; // true while auto-calibrating to nearest stop
    let starsWarpOffset = 0; // transient Z nudge for scroll warp rush; decays to 0
    let prevActiveIdx = -1;
    let lastT = 0;
    let raycastFrame = 0;
    let hoveredConstIdx = -1;

    function animate(t = 0) {
      animId = requestAnimationFrame(animate);
      const time = t * 0.001;
      const delta = lastT === 0 ? 0 : Math.min((t - lastT) * 0.001, 1 / 20);
      lastT = t;

      // ── Asteroids (hidden during warp intro, visible only in idle) ───────────
      const showAsteroids = introPhase === "idle";
      asteroidMeshes.forEach((mesh, i) => {
        mesh.visible = showAsteroids;
        mesh.rotation.x += astRotVel[i].x * delta;
        mesh.rotation.y += astRotVel[i].y * delta;
        mesh.rotation.z += astRotVel[i].z * delta;
      });

      // ── Warp & Resolve phases ────────────────────────────────────────────────
      if (introPhase === "warp" || introPhase === "resolve") {
        if (delta > 0) {
          introProg = Math.min(1, introProg + delta / PHASE_DUR[introPhase]);

          const warpFactor =
            introPhase === "warp" ? easeInOutCubic(introProg) : 1.0;
          const fadeAlpha =
            introPhase === "resolve" ? 1 - easeOutCubic(introProg) : 1.0;

          for (let i = 0; i < BEAM_N; i++) {
            bZ[i] += bSpeed[i] * delta;
            if (bZ[i] > CAM_Z_OFFSET + 5) bZ[i] -= 175; // wrap to far end

            // Fixed radial spread (no perspective math — beams stay put laterally)
            const x = Math.cos(bAngle[i]) * bSpread[i];
            const y = Math.sin(bAngle[i]) * bSpread[i];
            const len = bLen[i] * (0.3 + warpFactor * 2.8); // grows with warp

            // Back endpoint (far, dim blue)
            beamPos[i * 6 + 0] = x;
            beamPos[i * 6 + 1] = y;
            beamPos[i * 6 + 2] = bZ[i];
            // Front endpoint (close, bright white-blue)
            beamPos[i * 6 + 3] = x;
            beamPos[i * 6 + 4] = y;
            beamPos[i * 6 + 5] = bZ[i] + len;

            const bright = (1.0 + Math.sin(bAngle[i] * 2.3) * 0.3) * fadeAlpha;
            beamCol[i * 6 + 0] = 0.2 * bright;
            beamCol[i * 6 + 1] = 0.35 * bright;
            beamCol[i * 6 + 2] = bright;
            beamCol[i * 6 + 3] = 0.7 * bright;
            beamCol[i * 6 + 4] = 0.85 * bright;
            beamCol[i * 6 + 5] = bright;
          }
          beamGeo.attributes.position.needsUpdate = true;
          beamGeo.attributes.color.needsUpdate = true;

          // ── Star rush ───────────────────────────────────────────────────────────────
          // Slide the starfield toward the camera matching warp intensity.
          // Total advance (~30 units max) stays inside sphere radius so stars
          // stay visible throughout. Resolve ramps speed to 0 for a clean handoff.
          const starSpeed =
            introPhase === "warp"
              ? easeInOutCubic(introProg) * 30
              : (1 - easeOutCubic(introProg)) * 30;
          stars.position.z += starSpeed * delta;

          if (introProg >= 1) {
            if (introPhase === "warp") {
              introPhase = "resolve";
              introProg = 0;
            } else {
              // resolve done — reveal scene, go straight to idle
              warpLines.visible = false;
              proRing.visible = true;
              ring.visible = true;
              spine.visible = true;
              timelineNodes.forEach((n) => {
                n.visible = true;
              });
              timelineConns.forEach((c) => {
                c.visible = true;
              });
              stars.visible = true;
              nebula1.visible = true;
              nebula2.visible = true;
              auroraGroup.visible = true;
              starsWarpOffset = stars.position.z; // capture offset for landing decay
              if (ship) {
                ship.visible = true;
                rimOverlay.visible = true;
                introProg = 0;
                introPhase = "landing";
              } else {
                introPhase = "waiting";
              }
            }
          }
        }

        // Fixed forward-looking camera during warp/resolve
        camera.position.set(0, 0.3, CAM_Z_OFFSET + 2);
        camera.lookAt(0, 0, 0);
        composer.render();
        return;
      }

      // ── Waiting (ship GLTF still loading) ────────────────────────────────────
      if (introPhase === "waiting") {
        camera.position.set(0, 0.3, CAM_Z_OFFSET + 2);
        camera.lookAt(0, 0, 0);
        composer.render(); // background + rings are visible now — use bloom
        return;
      }

      // ── Landing (ship decelerates from warp onto ring) ────────────────────────
      if (introPhase === "landing") {
        if (delta > 0) introProg = Math.min(1, introProg + delta / LANDING_DUR);

        // Ship Z: easeOutCubic — moderate start, smooth deceleration onto ring
        const shipT = easeOutCubic(introProg);
        const shipZ = 28 + (6 - 28) * shipT; // 28 → 6
        const shipX = SHIP_X * shipT; // 0 → 1.7 (drifts right out of beam)

        ship.position.set(shipX, SHIP_Y, shipZ);
        const shipInView = shipZ < camera.position.z;
        ship.visible = shipInView;
        ship.rotation.set(
          SHIP_PITCH_BIAS + -0.18 * (1 - shipT), // nose-down at speed, levels off
          Math.PI,
          0,
        );
        if (rimOverlay) {
          rimOverlay.visible = shipInView;
          rimOverlay.position.copy(ship.position);
          rimOverlay.rotation.copy(ship.rotation);
          rimOverlay.scale.copy(ship.scale);
        }

        // Lights follow ship
        engineBoost.visible = shipInView;
        engineBoost.position.set(
          shipX + BOOST_X_OFFSET,
          SHIP_Y + BOOST_Y_OFFSET,
          shipZ + BOOST_Z_OFFSET,
        );
        engineLight.position.set(shipX, SHIP_Y, shipZ + 1.4);
        shipWarmLight.position.set(shipX + 0.3, SHIP_Y - 1.0, shipZ + 2.5);
        shipCoolLight.position.set(shipX - 0.8, SHIP_Y + 1.2, shipZ + 2.8);

        // Camera: smooth pull back + up from warp position to idle position
        const camT = easeInOutCubic(introProg);
        camera.position.set(
          0,
          0.3 + (3.5 - 0.3) * camT, // 0.3 → 3.5
          12 + (17 - 12) * camT, // 12  → 17
        );
        camera.lookAt(
          0,
          0 + (-0.5 - 0) * camT, // 0   → -0.5
          0 + (4 - 0) * camT, // 0   → 4
        );

        // Decay the warp star rush back to origin
        starsWarpOffset *= Math.exp(-3.0 * delta);
        stars.position.z = starsWarpOffset;

        proRing.rotation.z += delta * 0.6;

        if (introProg >= 1) {
          currentZ = RING_PRO_STOP;
          targetZ = RING_PRO_STOP;
          buildAllCards();
          introPhase = "idle";
          warpIntroSeen = true;
          hint.style.opacity = "1";
          navContainer.style.opacity = "1";
          proLabelEl.style.opacity = "1";
        }

        composer.render();
        return;
      }

      // ── Idle ─────────────────────────────────────────────────────────────────
      prevCurrentZ = currentZ;
      currentZ += (targetZ - currentZ) * 0.06;

      // Forward velocity (positive when moving toward lower Z — forward in timeline)
      const vel = Math.max(0, prevCurrentZ - currentZ);
      // Suppress boost during auto-snap so the exhaust beam doesn't re-extend
      if (isSnapping && Math.abs(currentZ - targetZ) < 0.05) isSnapping = false;
      const targetBoost = isSnapping ? 0 : Math.min(1, vel / 0.18);
      boostFactor += (targetBoost - boostFactor) * 0.1;

      // Chase camera
      camera.position.set(
        mouseX * 0.4,
        3.5 + mouseY * 0.25,
        currentZ + CAM_Z_OFFSET,
      );
      camera.lookAt(0, -0.5, currentZ + SHIP_Z_OFFSET - 2);

      // Ship
      if (ship) {
        const sz = currentZ + SHIP_Z_OFFSET;
        ship.position.set(
          SHIP_X + mouseX * SHIP_MOUSE_X_AMP,
          SHIP_Y + Math.sin(time * SHIP_BOB_SPEED) * SHIP_BOB_AMP,
          sz,
        );
        ship.rotation.y = Math.PI + mouseX * SHIP_YAW_AMP;
        ship.rotation.x = mouseY * SHIP_PITCH_AMP + SHIP_PITCH_BIAS;
        ship.rotation.z = -mouseX * SHIP_ROLL_AMP;
        // Anchor the ship-facing end; let the tail extend only behind the ship
        const boostScaleY = 1 + boostFactor * 1.5;
        const boostZ =
          sz + BOOST_Z_OFFSET + (BOOST_LENGTH / 2) * (boostScaleY - 1);
        engineBoost.position.set(
          ship.position.x + BOOST_X_OFFSET,
          ship.position.y + BOOST_Y_OFFSET,
          boostZ,
        );

        // Boost beam stretches and brightens with forward velocity, then fades back
        engineBoost.scale.y = boostScaleY;
        const bMat = engineBoost.material as THREE.MeshBasicMaterial;
        bMat.color.setRGB(3.5 + boostFactor * 8, 1.2 + boostFactor * 2.5, 0.06);

        engineLight.position.set(ship.position.x, ship.position.y, sz + 1.4);
        engineLight.intensity = 3.5 + boostFactor * 8;

        // Rim overlay mirrors ship exactly
        if (rimOverlay) {
          rimOverlay.position.copy(ship.position);
          rimOverlay.rotation.copy(ship.rotation);
          rimOverlay.scale.copy(ship.scale);
        }
        // Rim point lights — warm amber behind engine, cool blue upper-left
        shipWarmLight.position.set(
          ship.position.x + 0.3,
          ship.position.y - 1.0,
          sz + 2.5,
        );
        shipCoolLight.position.set(
          ship.position.x - 0.8,
          ship.position.y + 1.2,
          sz + 2.8,
        );
      }

      // Card visibility: active (full) + peek (dim) + rest (hidden)
      // At ring stops, no card is active — only preview the next entry ahead.
      const atProRing = targetZ > entryZ[0];
      const atDivRing = Math.abs(targetZ - RING_DIV_STOP) < CARD_SPACING * 0.4;
      let activeIdx: number;
      let peekIdx: number;
      if (atProRing) {
        activeIdx = -1;
        peekIdx = 0;
      } else if (atDivRing) {
        activeIdx = -1;
        peekIdx = profCount;
      } else {
        activeIdx = Math.max(
          0,
          Math.min(allEntries.length - 1, Math.round(-currentZ / CARD_SPACING)),
        );
        peekIdx = Math.min(allEntries.length - 1, activeIdx + 1);
      }

      if (activeIdx !== prevActiveIdx) {
        if (prevActiveIdx >= 0) cards[prevActiveIdx]?.close();
        prevActiveIdx = activeIdx;
      }

      cards.forEach((card, i) => {
        if (!card) return;
        const { el } = card;
        if (i === activeIdx) {
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
          el.style.transform = "scale(1)";
        } else if (i === peekIdx) {
          el.style.opacity = "0.35";
          el.style.pointerEvents = "none";
          el.style.transform = "scale(0.78)";
        } else {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.style.transform = "scale(0.78)";
        }
      });

      // Nav dots
      navDots.forEach((dot, i) => {
        const active = i === activeIdx;
        const c = dot.dataset.activeColor || "#6688ff";
        dot.style.background = active ? c : "transparent";
        dot.style.boxShadow = active ? `0 0 8px ${c}` : "none";
        dot.style.transform = active ? "scale(1.5)" : "scale(1)";
      });

      // Constellation trail — stack model:
      //   i < activeIdx  → trail: maintain (stay fully visible)
      //   i === activeIdx → current: draw in
      //   i > activeIdx  → ahead: fade out
      //   atProRing      → back at start: fade everything out
      for (let i = 0; i < constellations.length; i++) {
        const c = constellations[i];
        if (!c) continue; // null = no constellation for this entry
        const p = constellationProgress[i];
        if (!atProRing && activeIdx >= 0 && i === activeIdx) {
          if (p < 1) {
            constellationProgress[i] = Math.min(1, p + delta * 0.65);
            c.revealTo(constellationProgress[i]);
          }
        } else if (!atProRing && activeIdx >= 0 && i < activeIdx) {
          if (p > 0) c.revealTo(p);
          else c.hide();
        } else {
          if (p > 0) {
            constellationProgress[i] = Math.max(0, p - delta * 0.65);
            c.revealTo(constellationProgress[i]);
          } else {
            c.hide();
          }
        }
      }

      // Constellation hover — highlight any visible (trail + active) constellation
      raycastFrame = (raycastFrame + 1) % 3;
      if (raycastFrame === 0) {
        hoveredConstIdx = -1;
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
        const visiblePoints = constellationStarPoints.filter(Boolean);
        const hits = visiblePoints.length
          ? raycaster.intersectObjects(visiblePoints)
          : [];
        const hitObj = hits.length > 0 ? hits[0].object : null;
        constellations.forEach((c, i) => {
          if (!c) return;
          const visible =
            !atProRing &&
            activeIdx >= 0 &&
            i <= activeIdx &&
            constellationProgress[i] > 0;
          const isHit = visible && constellationStarPoints[i] === hitObj;
          c.setHighlight(isHit);
          if (isHit) hoveredConstIdx = i;
        });
      }

      // Update tooltip
      if (hoveredConstIdx >= 0) {
        const def = CONSTELLATIONS[hoveredConstIdx % CONSTELLATIONS.length];
        if (def) {
          if (hoveredConstIdx !== lastHoveredConstIdx) {
            ctName.textContent = def.name;
            ctDesc.textContent = CONST_DESCRIPTIONS[def.name] ?? "";
            lastHoveredConstIdx = hoveredConstIdx;
          }
          const rect = container.getBoundingClientRect();
          const tx = mouseClientX - rect.left + 18;
          const ty = mouseClientY - rect.top - 12;
          // Keep tooltip within container bounds
          constTooltip.style.left = `${Math.min(tx, rect.width - 240)}px`;
          constTooltip.style.top = `${Math.max(4, ty)}px`;
          constTooltip.style.opacity = "1";
        }
      } else {
        constTooltip.style.opacity = "0";
        lastHoveredConstIdx = -1;
      }

      // Ring labels — only visible when near their own ring
      proLabelEl.style.opacity = atProRing ? "1" : "0";
      divEl.style.opacity = atDivRing ? "1" : "0";

      // Slow ring spin in idle
      proRing.rotation.z += delta * 0.3;
      ring.rotation.z += delta * 0.25;

      // ── Scroll warp flash ──────────────────────────────────────────────────
      scrollWarpFactor *= Math.exp(-8.0 * delta); // decay ~0.09s half-life

      // Burst forward on each scroll, then decay to a small residual (stars
      // stay slightly ahead of the camera between scrolls).  Decaying to ~2
      // rather than 0 gives the "stay there" feel while keeping the rush
      // repeatable — offset never saturates so every scroll fires the effect.
      starsWarpOffset += scrollWarpFactor * 22 * delta;
      starsWarpOffset = 2 + (starsWarpOffset - 2) * Math.exp(-4 * delta);
      stars.position.z = currentZ + starsWarpOffset;

      // Nebula stays ahead — push it further in -Z as the ship scrolls forward
      // so the ship never flies through it.  Sprites start at world z≈-100;
      // group offset = min(0, currentZ+40) keeps them ≥60 units ahead.
      nebula1.position.z = Math.min(0, currentZ + 40);
      auroraGroup.position.z = Math.min(0, currentZ + 40);
      // bloomPass.strength = 0.45 + scrollWarpFactor * 1.5;

      if (scrollWarpFactor > 0.01) {
        warpLines.visible = true;
        const wf = scrollWarpFactor * 0.55; // cap intensity well below full warp
        const camZ = currentZ + CAM_Z_OFFSET;
        for (let i = 0; i < BEAM_N; i++) {
          bZ[i] += bSpeed[i] * delta * scrollWarpFactor * 0.6;
          if (bZ[i] > camZ + 5) bZ[i] = camZ - Math.random() * 160;
          const x = Math.cos(bAngle[i]) * bSpread[i];
          const y = Math.sin(bAngle[i]) * bSpread[i];
          const len = bLen[i] * (0.2 + wf * 0.8);
          beamPos[i * 6 + 0] = x;
          beamPos[i * 6 + 1] = y;
          beamPos[i * 6 + 2] = bZ[i];
          beamPos[i * 6 + 3] = x;
          beamPos[i * 6 + 4] = y;
          beamPos[i * 6 + 5] = bZ[i] + len;
          const bright = (0.5 + Math.sin(bAngle[i] * 2.3) * 0.2) * wf;
          beamCol[i * 6 + 0] = 0.2 * bright;
          beamCol[i * 6 + 1] = 0.35 * bright;
          beamCol[i * 6 + 2] = bright;
          beamCol[i * 6 + 3] = 0.7 * bright;
          beamCol[i * 6 + 4] = 0.85 * bright;
          beamCol[i * 6 + 5] = bright;
        }
        beamGeo.attributes.position.needsUpdate = true;
        beamGeo.attributes.color.needsUpdate = true;
      } else {
        warpLines.visible = false;
      }

      composer.render();
      labelRenderer.render(scene, camera);
    }
    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      if (snapTimer) clearTimeout(snapTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
      if (container.contains(labelRenderer.domElement))
        container.removeChild(labelRenderer.domElement);
      if (container.contains(navContainer)) container.removeChild(navContainer);
      if (container.contains(hint)) container.removeChild(hint);
      if (container.contains(constTooltip)) container.removeChild(constTooltip);
      if (rimOverlay) scene.remove(rimOverlay);
      scene.remove(shipWarmLight);
      scene.remove(shipCoolLight);
      disposed = true;
      auroraGroup.children.forEach((layer) => {
        layer.children.forEach((sprite) => {
          sprite.material.map?.dispose();
          sprite.material.dispose();
        });
      });
      constellations.forEach((c) => c?.dispose());
      beamGeo.dispose();
      asteroidMeshes.forEach((m) => scene.remove(m));
      astLoadedGeos.forEach((g) => g.dispose());
      astMats.forEach((m) => m.dispose());
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "calc(100vh - var(--nav-height, 64px))",
        position: "relative",
        overflow: "hidden",
        background: "#05060f",
      }}
    />
  );
}
