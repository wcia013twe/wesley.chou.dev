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
import PlanetPreview from './PlanetPreview';
import ProjectsGrid from './projects/ProjectsGrid';
import ProjectModal from './projects/ProjectModal';

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

  // Overlay refs
  const overlayRef     = useRef(null); // the fixed overlay div (wheel target)
  const horizonPlanetRef = useRef(null); // full-page planet canvas (parallax)
  const sheetRef       = useRef(null); // rising bottom sheet (scrollable)
  const sheetRaisedRef = useRef(false); // tracks raised state without re-render

  // Camera state machine — mutated directly from animation loop (no re-render)
  const transitionRef = useRef({
    phase: 'idle', // 'idle' | 'approaching' | 'orbit' | 'exiting'
    progress: 0,
    startCamPos: new THREE.Vector3(0, 6, 6),
    targetCamPos: new THREE.Vector3(0, 6, 6),
    startLookAt: new THREE.Vector3(0, 0, 0),
    targetLookAt: new THREE.Vector3(0, 0, 0),
    planetData: null,
  });

  // Bridge: animation loop → React state (always holds latest setter)
  const onOrbitReachedRef = useRef(null);

  const [orbitView, setOrbitView] = useState(null);    // CategoryPlanet | null
  const [selectedProject, setSelectedProject] = useState(null); // Project | null
  const [sheetRaised, setSheetRaised] = useState(false);

  onOrbitReachedRef.current = (planetData) => {
    setOrbitView(planetData);
    // Reset sheet to hidden whenever a new planet is entered
    setSheetRaised(false);
    sheetRaisedRef.current = false;
  };

  // Wheel → raise/lower the project sheet (passive:false so we can preventDefault)
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !orbitView) return;

    function onWheel(e) {
      if (!sheetRaisedRef.current && e.deltaY > 0) {
        e.preventDefault();
        setSheetRaised(true);
        sheetRaisedRef.current = true;
      } else if (sheetRaisedRef.current && e.deltaY < 0) {
        const sheet = sheetRef.current;
        if (sheet && sheet.scrollTop === 0) {
          e.preventDefault();
          setSheetRaised(false);
          sheetRaisedRef.current = false;
        }
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [orbitView]);

  // Called by "Leave Orbit" button — starts simultaneous camera flyback + panel exit
  function handleExit() {
    const cam = cameraRef.current;
    const controls = controlsRef.current;
    if (!cam || !controls) return;

    setOrbitView(null);
    setSelectedProject(null);

    transitionRef.current = {
      phase: 'exiting',
      progress: 0,
      startCamPos: cam.position.clone(),
      targetCamPos: new THREE.Vector3(0, 6, 6),
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
    camera.position.set(0, 6, 6);
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

      const baseDistance = 3.5;
      const distanceIncrement = 1.8;

      categoryPlanets.forEach((category, index) => {
        const distance = baseDistance + index * distanceIncrement;

        // Label sprite
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 512, 96);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 46px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(category.name, 256, 60);

        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
        );
        sprite.scale.set(3.2, 0.6, 1);
        sprite.position.set(0, 1.5, 0);

        const orbitGroup = getPlanet({
          children: [sprite],
          size: category.size,
          distance,
          img: category.img,
          rings: category.rings ?? false,
        });

        // Tag planet mesh for raycasting (only the textured sphere, not rim/ring)
        orbitGroup.traverse((child) => {
          if (child.isMesh && child.material?.map) {
            child.userData.planetData = category;
            raycastTargetsRef.current.push(child);
          }
        });

        solarSystem.add(orbitGroup);
      });

      solarSystem.add(getElipticLines());
      scene.add(getStarfield({ numStars: 2000, size: 0.5, saturation: 0 }));
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
          tr.progress = Math.min(tr.progress + 0.008, 1);
          const e = easeInOutCubic(tr.progress);
          camera.position.lerpVectors(tr.startCamPos, tr.targetCamPos, e);
          _lookAt.lerpVectors(tr.startLookAt, tr.targetLookAt, e);
          camera.lookAt(_lookAt);

          if (tr.progress >= 1) {
            tr.phase = 'orbit';
            controls.target.copy(tr.targetLookAt);
            controls.enabled = true;
            onOrbitReachedRef.current?.(tr.planetData);
          }
        } else if (tr.phase === 'exiting') {
          controls.enabled = false;
          tr.progress = Math.min(tr.progress + 0.01, 1);
          const e = easeInOutCubic(tr.progress);
          camera.position.lerpVectors(tr.startCamPos, tr.targetCamPos, e);
          _lookAt.lerpVectors(tr.startLookAt, tr.targetLookAt, e);
          camera.lookAt(_lookAt);

          if (tr.progress >= 1) {
            tr.phase = 'idle';
            controls.target.set(0, 0, 0);
            controls.enabled = true;
          }
        } else {
          controls.update(); // idle or orbit
        }

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

      // Position camera (size*2 + 2) units from planet on the near side
      const toCam = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
      const targetCamPos = new THREE.Vector3().addVectors(
        worldPos,
        toCam.multiplyScalar(planetData.size * 2 + 2)
      );

      transitionRef.current = {
        phase: 'approaching',
        progress: 0,
        startCamPos: camera.position.clone(),
        targetCamPos,
        startLookAt: controls.target.clone(),
        targetLookAt: worldPos.clone(),
        planetData,
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
      renderer.domElement.style.cursor = hits.length ? 'pointer' : 'default';
    };

    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    cleanupRef.current = () => {
      window.removeEventListener('resize', handleResize);
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

  // ── Derived ───────────────────────────────────────────────────────────────
  const orbitProjects = orbitView
    ? projects.filter((p) => p.planetId === orbitView.id)
    : [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full">
      {/* Three.js canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* ── Orbit overlay — Planet hero + rising sheet ─────────────────────── */}
      <AnimatePresence>
        {orbitView && (
          <motion.div
            key="orbit-overlay"
            ref={overlayRef}
            className="fixed inset-x-0 bottom-0 z-50 overflow-hidden"
            style={{ top: 'var(--nav-height)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── Layer 1: Full-page planet (background) ──────────────────── */}
            <div ref={horizonPlanetRef} className="absolute inset-0">
              <PlanetPreview
                img={orbitView.img}
                rings={orbitView.rings ?? false}
                glowColor={orbitView.glowColor}
                scale={orbitView.previewScale ?? 2.2}
              />
            </div>

            {/* Atmosphere glow — color bloom centred on planet */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, ${orbitView.glowColor}22 0%, transparent 70%)`,
              }}
            />

            {/* Bottom vignette — darkens edge where sheet will appear */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: '40%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
              }}
            />

            {/* ── Scroll hint (visible while sheet is down) ────────────────── */}
            <AnimatePresence>
              {!sheetRaised && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.6 }}
                  style={{
                    position: 'absolute',
                    bottom: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    pointerEvents: 'none',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      fontFamily: MONO,
                      fontSize: '10px',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: `${orbitView.glowColor}80`,
                    }}
                  >
                    scroll to explore ↓
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Layer 3: Rising bottom sheet ─────────────────────────────── */}
            <motion.div
              ref={sheetRef}
              style={{
                position: 'absolute',
                top: '25%',
                left: 0, right: 0, bottom: 0,
                zIndex: 15,
                overflowY: 'auto',
                background: 'rgba(4,4,10,0.92)',
                backdropFilter: 'blur(28px)',
                borderRadius: '14px 14px 0 0',
                borderTop: `1px solid ${orbitView.glowColor}35`,
              }}
              animate={{ y: sheetRaised ? '0%' : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            >
              {/* Drag handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0', flexShrink: 0 }}>
                <div style={{ width: 36, height: 3, borderRadius: 2, background: `${orbitView.glowColor}45` }} />
              </div>

              {/* Sheet header — unified: Leave Orbit + telemetry */}
              <div
                style={{
                  padding: '10px 20px 12px',
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
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: orbitView.glowColor,
                    background: 'none',
                    border: `1px solid ${orbitView.glowColor}45`,
                    padding: '4px 12px',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    flexShrink: 0,
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

              {/* Content */}
              {orbitProjects.length > 0 ? (
                <div style={{
                  backgroundImage: `
                    linear-gradient(${orbitView.glowColor}08 1px, transparent 1px),
                    linear-gradient(90deg, ${orbitView.glowColor}08 1px, transparent 1px)
                  `,
                  backgroundSize: '48px 48px',
                }}>
                  <ProjectsGrid
                    projects={orbitProjects}
                    onProjectClick={(p) => setSelectedProject(p)}
                    glowColor={orbitView.glowColor}
                  />
                </div>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project detail modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
