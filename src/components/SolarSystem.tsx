// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import getSun from './solar-system/src/getSun.js';
import getStarfield from './solar-system/src/getStarfield.js';
import getPlanet from './solar-system/src/getPlanet.js';
import getAsteroidBelt from './solar-system/src/getAsteroidBelt.js';
import getElipticLines from './solar-system/src/getElipticLines.js';
import getNebula from './solar-system/src/getNebula.js';

// ─── Data & Components ────────────────────────────────────────────────────────
// To change which projects appear on a planet:
//   • Edit `planetId` on any project in src/data/projectsData.ts
// To add/rename/reorder planets:
//   • Edit `categoryPlanets` in src/data/projectsData.ts
import { projects, categoryPlanets } from '../data/projectsData';
import ProjectsGrid from './projects/ProjectsGrid';
import ProjectModal from './projects/ProjectModal';
import HudPanel from './HudPanel';

// ─── Tunable constants ────────────────────────────────────────────────────────

/** Distance from the sun to the first planet's orbit */
const ORBIT_BASE_DISTANCE = 4.0;
/**
 * Minimum clear gap (world units) between the outer edge of one planet and the
 * inner edge of the next. Distances are computed automatically from planet sizes
 * so planets never overlap regardless of size.
 */
const MIN_ORBIT_GAP = 0.6;

/**
 * Orbital angular velocity for all planets (radians per time unit, negative = clockwise).
 * All planets share this rate so they sweep the sky at the same speed.
 */
const ORBIT_SPEED = -0.5;

/**
 * Maximum random angular deviation (degrees) added to each planet's startAngleDeg.
 * Each planet gets an independent random offset in ±(ORBIT_START_SPREAD_DEG / 2)
 * so paired planets stay roughly opposite but aren't perfectly symmetric.
 */
const ORBIT_START_SPREAD_DEG = 60;

/** Camera starting position (x, y, z) before any planet is selected */
const INITIAL_CAM_POS = [0, 5, 8] as const;

/**
 * Fallback zoom distance when a planet has no explicit `zoomDist` set.
 * Final dist = planet.size * ZOOM_DIST_SIZE_MULT + ZOOM_DIST_OFFSET
 */
const ZOOM_DIST_SIZE_MULT = 1.5;
const ZOOM_DIST_OFFSET    = 0.25;

/**
 * How far above the orbital plane the camera sits when orbiting a planet.
 * Higher = more top-down view, lower = more horizon-level view.
 */
const CAM_ELEVATION = 0.35;

/**
 * Fraction of screen width to shift the planet left when the data panel is open.
 * 0.25 = planet appears at 25% from left (centred in the visible 50% on desktop).
 * Uses camera.setViewOffset so controls.target stays on the planet — mouse drag
 * always orbits the planet, not an empty offset point.
 */
const CAM_PAN_SCREEN_FRACTION = 0.25;

/** Camera fly-in speed per frame (0–1 progress). Higher = faster approach. */
const CAM_APPROACH_SPEED = 0.008;
/** Camera fly-out speed per frame (0–1 progress). Higher = faster exit. */
const CAM_EXIT_SPEED = 0.01;

// ─────────────────────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const MONO = 'ui-monospace, SFMono-Regular, monospace';

/** Deterministic fake surface coordinates derived from planet name */
function fakeCoord(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  const lat = ((Math.abs(h) % 900) / 10).toFixed(1);
  const lng = ((Math.abs(h >> 4) % 3600) / 10).toFixed(1);
  return `${lat}°${h < 0 ? 'S' : 'N'}  ${lng}°${(h >> 4) < 0 ? 'W' : 'E'}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SolarSystem() {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);
  const initializedRef = useRef(false);

  // Three.js object refs (stable across renders)
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const raycastTargetsRef = useRef([]); // planet meshes tagged with userData.planetData
  const labelSpritesRef   = useRef([]); // label sprites for hover-scale animation

  // Overlay refs
  const sheetRef = useRef(null); // scrollable content area inside right data pane

  // Camera state machine — mutated directly from animation loop (no re-render)
  const transitionRef = useRef({
    phase: 'idle', // 'idle' | 'approaching' | 'orbit' | 'exiting'
    progress: 0,
    startCamPos: new THREE.Vector3(...INITIAL_CAM_POS),
    targetCamPos: new THREE.Vector3(...INITIAL_CAM_POS),
    startLookAt: new THREE.Vector3(0, 0, 0),
    targetLookAt: new THREE.Vector3(0, 0, 0),
    planetData: null,
  });

  // Bridge: animation loop → React state (always holds latest setter)
  const onOrbitReachedRef = useRef(null);

  const [orbitView, setOrbitView] = useState(null);    // CategoryPlanet | null
  const [selectedProject, setSelectedProject] = useState(null); // Project | null
  const [showGuide, setShowGuide] = useState(true);

  onOrbitReachedRef.current = (planetData) => {
    setOrbitView(planetData);
  };


  // Called by "Leave Orbit" button — starts simultaneous camera flyback + panel exit
  function handleExit() {
    const cam = cameraRef.current;
    const controls = controlsRef.current;
    if (!cam || !controls) return;

    cam.clearViewOffset();
    const cont = containerRef.current;
    if (cont) {
      cam.aspect = cont.clientWidth / cont.clientHeight;
      cam.updateProjectionMatrix();
    }

    setOrbitView(null);
    setSelectedProject(null);

    transitionRef.current = {
      phase: 'exiting',
      progress: 0,
      startCamPos: cam.position.clone(),
      targetCamPos: new THREE.Vector3(...INITIAL_CAM_POS),
      startLookAt: controls.target.clone(),
      targetLookAt: new THREE.Vector3(0, 0, 0),
      planetData: null,
    };
  }

  // ── Three.js setup (runs once on mount) ─────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;
    initializedRef.current = true;

    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.set(...INITIAL_CAM_POS);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controlsRef.current = controls;

    let animationId = null;
    const _lookAt = new THREE.Vector3(); // reusable temp vector

    const solarSystem = new THREE.Group();
    solarSystem.userData.update = (t) =>
      solarSystem.children.forEach((c) => c.userData.update?.(t));
    scene.add(solarSystem);

    // ── Build scene ───────────────────────────────────────────────────────────
    function initScene() {
      const sun = getSun();
      sun.scale.setScalar(2.0);
      solarSystem.add(sun);

      // Outer orbital extent of a planet — rings dominate when present.
      // RingGeometry outer radius is 1.8 (local space), scaled by planet size.
      const orbitExtent = (cat) => cat.rings ? 1.8 * cat.size : cat.size;

      // Build a map of tier → orbit radius. Planets sharing a tier share the same
      // radius; each tier is sized to its largest member so nothing overlaps.
      const tierOrder = [...new Set(categoryPlanets.map((c, i) => c.orbitTier ?? i))];
      const tierRadius = new Map();
      let orbitDist = ORBIT_BASE_DISTANCE;
      tierOrder.forEach((tier, i) => {
        const members = categoryPlanets.filter((c, ci) => (c.orbitTier ?? ci) === tier);
        const maxExtent = Math.max(...members.map(orbitExtent));
        tierRadius.set(tier, orbitDist);
        const nextTier = tierOrder[i + 1];
        if (nextTier !== undefined) {
          const nextMembers = categoryPlanets.filter((c, ci) => (c.orbitTier ?? ci) === nextTier);
          const nextMaxExtent = Math.max(...nextMembers.map(orbitExtent));
          orbitDist += maxExtent + MIN_ORBIT_GAP + nextMaxExtent;
        }
      });

      categoryPlanets.forEach((category, index) => {
        const tier = category.orbitTier ?? index;
        const distance = tierRadius.get(tier);
        const spreadRad = (Math.random() - 0.5) * (ORBIT_START_SPREAD_DEG * Math.PI / 180);
        const startAngle = ((category.startAngleDeg ?? 0) * Math.PI) / 180 + spreadRad;

        // Label sprite — large floating monospace text, no background
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 512, 80);

        // Drop shadow for legibility against any background
        ctx.shadowColor = 'rgba(0,0,0,0.95)';
        ctx.shadowBlur = 18;

        // Name text — monospace, uppercase, white
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.font = 'bold 52px ui-monospace, Menlo, "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(category.name.toUpperCase(), 256, 40);

        ctx.shadowBlur = 0;

        const LABEL_BASE_W  = 3.8;
        const LABEL_HOVER_W = 4.6;
        const LABEL_ASPECT  = 80 / 512;

        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
        );
        sprite.scale.set(LABEL_BASE_W, LABEL_BASE_W * LABEL_ASPECT, 1);
        sprite.userData.baseW  = LABEL_BASE_W;
        sprite.userData.hoverW = LABEL_HOVER_W;
        sprite.userData.aspect = LABEL_ASPECT;
        labelSpritesRef.current.push(sprite);

        // Pin label just above the planet surface
        sprite.position.set(0, category.size + 0.28, 0);

        const orbitGroup = getPlanet({
          children: [sprite],
          size: category.size,
          distance,
          img: category.img,
          rings: category.rings ?? false,
          rate: ORBIT_SPEED,
          startAngle,
        });

        // Tag planet mesh for raycasting (only the textured sphere, not rim/ring)
        orbitGroup.traverse((child) => {
          if (child.isMesh && child.material?.map) {
            child.userData.planetData = category;
            child.userData.labelSprite = sprite;
            raycastTargetsRef.current.push(child);
          }
        });

        solarSystem.add(orbitGroup);
      });

      solarSystem.add(getElipticLines());
      const starsGroup = new THREE.Group();
      starsGroup.add(getStarfield({ numStars: 900, size: 0.10, saturation: 0 }));
      starsGroup.add(getStarfield({ numStars: 300, size: 0.17, saturation: 0 }));
      starsGroup.add(getStarfield({ numStars: 100, size: 0.24, saturation: 0 }));
      scene.add(starsGroup);
      scene.add(new THREE.AmbientLight(0xffffff, 0.1));

      const dir = new THREE.DirectionalLight(0x0099ff, 1);
      dir.position.set(0, 1, 0);
      scene.add(dir);

      scene.add(getNebula({ hue: 0.6, numSprites: 10, opacity: 0.1, radius: 40, size: 80, z: -50.5 }));
      scene.add(getNebula({ hue: 0.0, numSprites: 10, opacity: 0.1, radius: 40, size: 80, z: 50.5 }));

      // ── Animation loop ───────────────────────────────────────────────────────
      function animate(t = 0) {
        const time = t * 0.00005;
        animationId = requestAnimationFrame(animate);

        solarSystem.userData.update(time);

        const tr = transitionRef.current;

        if (tr.phase === 'approaching') {
          controls.enabled = false;

          // Recompute target every frame so the camera always lands at the correct
          // sun-side angle even though the planet continues to orbit during the fly-in.
          const _curPlanetPos = new THREE.Vector3();
          tr.planetMesh.getWorldPosition(_curPlanetPos);
          const _curRadial    = _curPlanetPos.clone().normalize();
          const _curApproach  = new THREE.Vector3()
            .addScaledVector(_curRadial, -1.0)
            .addScaledVector(new THREE.Vector3(0, 1, 0), CAM_ELEVATION)
            .normalize();
          const _curDist  = tr.planetData.zoomDist ?? tr.planetData.size * ZOOM_DIST_SIZE_MULT + ZOOM_DIST_OFFSET;
          tr.targetCamPos.copy(_curPlanetPos).addScaledVector(_curApproach, _curDist);
          tr.targetLookAt.copy(_curPlanetPos);

          tr.progress = Math.min(tr.progress + CAM_APPROACH_SPEED, 1);
          const e = easeInOutCubic(tr.progress);
          camera.position.lerpVectors(tr.startCamPos, tr.targetCamPos, e);
          _lookAt.lerpVectors(tr.startLookAt, tr.targetLookAt, e);
          camera.lookAt(_lookAt);

          if (tr.progress >= 1) {
            tr.phase = 'orbit';
            controls.target.copy(_curPlanetPos); // orbit pivots around the actual planet
            controls.enabled = true;
            // Shift viewport left so planet sits in the visible half behind the panel.
            const cw = container.clientWidth, ch = container.clientHeight;
            camera.aspect = (2 * cw) / ch;
            camera.updateProjectionMatrix();
            camera.setViewOffset(2 * cw, ch, Math.round(cw * (0.5 + CAM_PAN_SCREEN_FRACTION)), 0, cw, ch);
            // Seed the planet-tracking position for the orbit phase
            tr.lastPlanetPos = new THREE.Vector3();
            tr.planetMesh.getWorldPosition(tr.lastPlanetPos);
            onOrbitReachedRef.current?.(tr.planetData);
          }
        } else if (tr.phase === 'exiting') {
          controls.enabled = false;
          tr.progress = Math.min(tr.progress + CAM_EXIT_SPEED, 1);
          const e = easeInOutCubic(tr.progress);
          camera.position.lerpVectors(tr.startCamPos, tr.targetCamPos, e);
          _lookAt.lerpVectors(tr.startLookAt, tr.targetLookAt, e);
          camera.lookAt(_lookAt);

          if (tr.progress >= 1) {
            tr.phase = 'idle';
            controls.target.set(0, 0, 0);
            controls.enabled = true;
          }
        } else if (tr.phase === 'orbit') {
          // Keep camera anchored to the planet as it orbits the sun
          if (tr.planetMesh && tr.lastPlanetPos) {
            tr.planetMesh.getWorldPosition(_lookAt);          // _lookAt = current planet pos
            _lookAt.sub(tr.lastPlanetPos);                    // _lookAt = movement delta
            camera.position.add(_lookAt);
            controls.target.add(_lookAt);
            tr.planetMesh.getWorldPosition(tr.lastPlanetPos); // store for next frame
          }
          controls.update();
        } else {
          controls.update(); // idle
        }

        // Lerp label sprite scales toward their target
        labelSpritesRef.current.forEach((s) => {
          const tw = s.userData.targetW ?? s.userData.baseW;
          s.scale.x += (tw - s.scale.x) * 0.1;
          s.scale.y += (tw * s.userData.aspect - s.scale.y) * 0.1;
        });

        renderer.render(scene, camera);
      }

      animate();
    }

    initScene();

    // ── Asteroid belt (async) ─────────────────────────────────────────────────
    const loader = new OBJLoader();
    const rockNames = ['Rock1', 'Rock2', 'Rock3'];
    let rocksLoaded = 0;
    const objs = [];

    rockNames.forEach((name) => {
      loader.load(
        `/rocks/${name}.obj`,
        (obj) => {
          obj.traverse((c) => { if (c.isMesh) objs.push(c); });
          if (++rocksLoaded === rockNames.length) {
            solarSystem.add(getAsteroidBelt(objs, 8.0));
          }
        },
        undefined,
        (err) => console.warn(`Could not load ${name}:`, err)
      );
    });

    // ── Raycasting ────────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e) => {
      if (transitionRef.current.phase !== 'idle') return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(raycastTargetsRef.current, false);
      if (!hits.length) return;

      const planetData = hits[0].object.userData.planetData;
      if (!planetData) return;

      const worldPos = new THREE.Vector3();
      hits[0].object.getWorldPosition(worldPos);

      // Approach from the sun side — camera sits between the sun and the planet,
      // looking outward. Sun is at origin so -radial points from planet back toward sun.
      const dist = planetData.zoomDist ?? planetData.size * ZOOM_DIST_SIZE_MULT + ZOOM_DIST_OFFSET;
      const radial = new THREE.Vector3().copy(worldPos).normalize(); // sun → planet
      const approachDir = new THREE.Vector3()
        .addScaledVector(radial, -1.0) // negative: place camera on sun side of planet
        .addScaledVector(new THREE.Vector3(0, 1, 0), CAM_ELEVATION) // elevation — raise for more top-down
        .normalize();
      const targetCamPos = new THREE.Vector3().addVectors(worldPos, approachDir.multiplyScalar(dist));
      const targetLookAt = worldPos.clone();

      transitionRef.current = {
        phase: 'approaching',
        progress: 0,
        startCamPos: camera.position.clone(),
        targetCamPos,
        startLookAt: controls.target.clone(),
        targetLookAt,
        planetData,
        planetMesh: hits[0].object, // actual mesh — followed during orbit phase
        lastPlanetPos: null,        // seeded when orbit begins
      };
    };

    const handleMouseMove = (e) => {
      if (transitionRef.current.phase !== 'idle') {
        renderer.domElement.style.cursor = 'default';
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(raycastTargetsRef.current, false);

      const hoveredSprite = hits.length ? hits[0].object.userData.labelSprite : null;
      labelSpritesRef.current.forEach((s) => {
        s.userData.targetW = s === hoveredSprite ? s.userData.hoverW : s.userData.baseW;
      });

      renderer.domElement.style.cursor = hits.length ? 'pointer' : 'default';
    };

    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      const isInOrbit = transitionRef.current.phase === 'orbit';
      camera.aspect = isInOrbit ? (2 * w) / h : w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (isInOrbit) {
        camera.setViewOffset(2 * w, h, Math.round(w * (0.5 + CAM_PAN_SCREEN_FRACTION)), 0, w, h);
      }
    };
    // ResizeObserver fires whenever the canvas container changes size (including
    // when it shrinks to 40% in orbit mode), so Three.js stays in sync.
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    cleanupRef.current = () => {
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      if (animationId !== null) cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      controls.dispose();
      initializedRef.current = false;
    };

    return () => cleanupRef.current?.();
  }, []);

  // ── Navigation guide: dismiss on first interaction or after 5 s ───────────
  useEffect(() => {
    const dismiss = () => setShowGuide(false);
    const timer = setTimeout(dismiss, 5000);
    window.addEventListener('mousedown', dismiss, { once: true });
    window.addEventListener('wheel',     dismiss, { once: true });
    window.addEventListener('touchstart', dismiss, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', dismiss);
      window.removeEventListener('wheel',     dismiss);
      window.removeEventListener('touchstart', dismiss);
    };
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const orbitProjects = orbitView
    ? projects.filter((p) => p.planetId === orbitView.id)
    : [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full">
      {/* Three.js canvas — always full size; the data pane overlays it */}
      <div ref={containerRef} className="w-full h-full" />

      {/* ── HUD — top-left card updates when a planet is entered ────────────── */}
      <HudPanel
        key={orbitView?.id ?? 'default'}
        title={orbitView ? orbitView.name : 'Explore Projects'}
        systemPath={orbitView ? `SYS / PROJ / ${orbitView.id.toUpperCase().replace(/-/g, ' ')}` : 'SYS / PROJ / ACTIVE'}
        coords={orbitView ? fakeCoord(orbitView.name) : '81.6°S · 38.9°W'}
        glowColor={orbitView ? orbitView.glowColor : '#22d3ee'}
        statusText={orbitView ? 'ORBIT LOCKED' : 'SYSTEMS NOMINAL'}
      />

      {/* ── Data terminal — slides in from right when in orbit ─────────────── */}
      <AnimatePresence>
        {orbitView && (
          <motion.div
            key="data-pane"
            className="orbit-panel flex flex-col backdrop-blur-2xl"
            style={{
              background: `
                linear-gradient(${orbitView.glowColor}07 1px, transparent 1px),
                linear-gradient(90deg, ${orbitView.glowColor}07 1px, transparent 1px),
                linear-gradient(to right, rgba(4,4,10,0.55) 0%, rgba(4,4,10,0.88) 55%)
              `,
              backgroundSize: '48px 48px, 48px 48px, 100% 100%',
              borderLeft: `2px solid ${orbitView.glowColor}45`,
              borderTop: `1px solid ${orbitView.glowColor}20`,
              boxShadow: `-12px 0 40px -8px ${orbitView.glowColor}18`,
            }}
            variants={{
              initial: { x: '100%', opacity: 0 },
              animate: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 100 } },
              exit:    { x: '8%', opacity: 0, transition: { duration: 0.22 } },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Header — Leave Orbit + telemetry */}
            <div
              style={{
                padding: '12px 20px',
                borderBottom: `1px solid ${orbitView.glowColor}18`,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexShrink: 0,
                fontFamily: MONO,
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              <button
                onClick={handleExit}
                style={{
                  fontFamily: MONO,
                  fontSize: '13px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: orbitView.glowColor,
                  background: `${orbitView.glowColor}10`,
                  border: `1px solid ${orbitView.glowColor}55`,
                  padding: '9px 20px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  fontWeight: 600,
                }}
              >
                ← Leave Orbit
              </button>
              <div style={{ flex: 1 }} />
              <span style={{ color: `${orbitView.glowColor}90`, fontWeight: 600 }}>{orbitView.name.toUpperCase()}</span>
              <span style={{ color: `${orbitView.glowColor}30` }}>·</span>
              <span style={{ color: `${orbitView.glowColor}60` }}>{orbitProjects.length} project{orbitProjects.length !== 1 ? 's' : ''}</span>
              <span style={{ color: `${orbitView.glowColor}30` }}>·</span>
              <span style={{ color: `${orbitView.glowColor}40` }}>{fakeCoord(orbitView.name)}</span>
            </div>

            {/* Scrollable content */}
            <div
              ref={sheetRef}
              className="command-pane flex-1 overflow-y-auto"
              style={{ '--scrollbar-color': orbitView.glowColor }}
            >
              {orbitProjects.length > 0 ? (
                <ProjectsGrid
                  projects={orbitProjects}
                  onProjectClick={(p) => setSelectedProject(p)}
                  glowColor={orbitView.glowColor}
                  disableScrollParallax
                />
              ) : (
                /* ── Sector scan diagnostic ──────────────────────────────── */
                <div className="flex flex-col items-center justify-center py-24 gap-8 select-none">
                  <div className="relative flex items-center justify-center" style={{ width: '96px', height: '96px' }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border"
                        style={{ borderColor: `${orbitView.glowColor}55` }}
                        animate={{ width: ['18px', '96px'], height: ['18px', '96px'], opacity: [0.9, 0] }}
                        transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }}
                      />
                    ))}
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: orbitView.glowColor, boxShadow: `0 0 8px ${orbitView.glowColor}` }} />
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.25em', lineHeight: 2.5, textAlign: 'center', color: `${orbitView.glowColor}85` }}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.95 }} transition={{ delay: 0.1 }}>{'// SECTOR SCAN COMPLETE'}</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{'// TARGET ········· '}{orbitView.name.toUpperCase()}</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{'// COORD ··········  '}{fakeCoord(orbitView.name)}</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.7 }}>{'// DEPLOYMENTS ···· NONE DETECTED'}</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.9 }}>{'// STATUS ·········· SECTOR VACANT'}</motion.div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project detail modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* ── Controls hint — hidden when in orbit ─────────────────────────── */}
      <AnimatePresence>
        {!orbitView && (
          <motion.div
            key="controls-hint"
            className="absolute left-6 z-20 pointer-events-none select-none"
            style={{ top: '170px' }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Left accent bar */}
              <div style={{
                width: '2px',
                background: 'linear-gradient(180deg, #f59e0b 0%, #f59e0b44 100%)',
                flexShrink: 0,
              }} />
              <div style={{
                background: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(245,158,11,0.18)',
                borderLeft: 'none',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '10px 14px 10px 12px',
              }}>
                <p style={{
                  fontFamily: MONO, fontSize: '8px', letterSpacing: '0.3em',
                  color: '#f59e0baa', textTransform: 'uppercase', margin: '0 0 8px',
                }}>
                  Controls
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                  {/* Left click — rotate */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0 }}>
                      <rect x="0.75" y="0.75" width="12.5" height="18.5" rx="6.25" stroke="rgba(245,158,11,0.45)" strokeWidth="1.5"/>
                      <line x1="7" y1="0.75" x2="7" y2="9" stroke="rgba(245,158,11,0.30)" strokeWidth="1"/>
                      {/* left button filled */}
                      <path d="M1.2 9 L1.2 5 Q1.2 1.2 7 1.2 L7 9 Z" fill="rgba(245,158,11,0.80)"/>
                    </svg>
                    <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)' }}>
                      Rotate view
                    </span>
                  </div>

                  {/* Right click — move */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0 }}>
                      <rect x="0.75" y="0.75" width="12.5" height="18.5" rx="6.25" stroke="rgba(245,158,11,0.45)" strokeWidth="1.5"/>
                      <line x1="7" y1="0.75" x2="7" y2="9" stroke="rgba(245,158,11,0.30)" strokeWidth="1"/>
                      {/* right button filled */}
                      <path d="M12.8 9 L12.8 5 Q12.8 1.2 7 1.2 L7 9 Z" fill="rgba(245,158,11,0.80)"/>
                    </svg>
                    <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)' }}>
                      Move camera
                    </span>
                  </div>

                  {/* Scroll — zoom */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0 }}>
                      <rect x="0.75" y="0.75" width="12.5" height="18.5" rx="6.25" stroke="rgba(245,158,11,0.45)" strokeWidth="1.5"/>
                      {/* scroll wheel */}
                      <rect x="5.25" y="3.5" width="3.5" height="6" rx="1.75" fill="rgba(245,158,11,0.80)"/>
                    </svg>
                    <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)' }}>
                      Zoom in / out
                    </span>
                  </div>

                  {/* Click planet — orbit */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0 }}>
                      <rect x="0.75" y="0.75" width="12.5" height="18.5" rx="6.25" stroke="rgba(245,158,11,0.45)" strokeWidth="1.5"/>
                      <line x1="7" y1="0.75" x2="7" y2="9" stroke="rgba(245,158,11,0.30)" strokeWidth="1"/>
                      {/* both buttons filled = click */}
                      <path d="M1.2 9 L1.2 5 Q1.2 1.2 7 1.2 L7 9 Z" fill="rgba(245,158,11,0.45)"/>
                      <path d="M12.8 9 L12.8 5 Q12.8 1.2 7 1.2 L7 9 Z" fill="rgba(245,158,11,0.45)"/>
                      {/* click dot */}
                      <circle cx="7" cy="14" r="1.8" fill="rgba(245,158,11,0.80)"/>
                    </svg>
                    <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)' }}>
                      Click planet · orbit
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation guide ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showGuide && !orbitView && (
          <motion.div
            key="nav-guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: '28px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontFamily: MONO,
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(34,211,238,0.50)',
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              zIndex: 20,
            }}
          >
            <span>Drag · Rotate</span>
            <span style={{ opacity: 0.25 }}>|</span>
            <span>Scroll · Zoom</span>
            <span style={{ opacity: 0.25 }}>|</span>
            <span>Click planet · Enter orbit</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
