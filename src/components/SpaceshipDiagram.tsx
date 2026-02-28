// @ts-nocheck
/**
 * SpaceshipDiagram — 3D holographic diagram for the Skills page.
 *
 * Architecture (hybrid Three.js + React):
 *   - Three.js canvas:  model, holographic materials, anchor spheres, CSS2D chips, bloom
 *   - SVG overlay:      leader line from rotating anchor sphere → card border (imperative,
 *                       updated every frame via ref — zero React re-renders)
 *   - React/Framer:     FloatingDataCard with flicker entry, 3.5D rotateY hover,
 *                       staggered typewriter text, terminal-style tags
 *
 * CALIBRATE: open console after first load — bbox/size printed there.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import type { SkillIcon } from '@/data/skillsGalaxyData';
import StackIcon from 'tech-stack-icons';
import CustomIcon from '@/components/CustomIcon';
import { GLTFLoader }    from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader }   from 'three/examples/jsm/loaders/DRACOLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass }     from 'three/addons/postprocessing/OutputPass.js';

// ─── Node data ────────────────────────────────────────────────────────────────
const TARGET_SIZE = 6.5;

const NODES = [
  {
    id: 'nose',
    title: 'Vision / Product',
    role: 'NOSE',
    shipAnchor:  [ 0.0, -0.55,  3.0],
    labelOffset: [ 0.0,  1.2,   3.6],
    detail: 'Product strategy, roadmap design, and user-centered vision. Where the ship points determines where it goes.',
    skills: [
      { name: 'Product Strategy', icon: null },
      { name: 'Roadmap', icon: null },
      { name: 'UX Research', icon: null },
    ] as SkillIcon[],
  },
  {
    id: 'cockpit',
    title: 'AI / Systems',
    role: 'COCKPIT · UPPER FUSELAGE',
    shipAnchor:  [ 0.0,  0.0,  1.1],
    labelOffset: [ 0.0,  2.2,  1.5],
    detail: 'Machine learning pipelines, intelligent system design, and the cognitive architecture that guides execution.',
    skills: [
      { name: 'Python',        icon: <StackIcon name="python" /> },
      { name: 'LangChain',     icon: <StackIcon name="langchain" /> },
      { name: 'FastAPI',       icon: <CustomIcon title="FastAPI" src="/icons/fastapi.png" size={26} /> },
      // { name: 'LLMs',          icon: null },
      // { name: 'Agents / RAG',  icon: null },
      // { name: 'System Design', icon: null },
    ] as SkillIcon[],
  },
  {
    id: 'wing',
    title: 'Frontend',
    role: 'RIGHT WING',
    shipAnchor:  [ 2.8, -1.0, -0.8],
    labelOffset: [ 3.5, 1.4, -1.5],
    detail: 'Pixel-perfect interfaces, motion design, and the surfaces users interact with. Lift comes from execution.',
    skills: [
      { name: 'React',       icon: <StackIcon name="react" /> },
      { name: 'TypeScript',  icon: <StackIcon name="typescript" /> },
      { name: 'Three.js',    icon: <StackIcon name="threejs" /> },
      { name: 'Next.js',     icon: <StackIcon name="nextjs" /> },
      { name: 'Tailwind',    icon: <StackIcon name="tailwindcss" /> },
      { name: 'HTML5',       icon: <StackIcon name="html5" /> },
    ] as SkillIcon[],
  },
  {
    id: 'libraries',
    title: 'Libraries',
    role: 'LEFT WING',
    shipAnchor:  [-2.8, -1.0, -0.8],
    labelOffset: [ -3.5, 1.4, -1.5],
    detail: 'The runtime libraries, frameworks, and data layers that form the connective tissue of every system.',
    skills: [
      { name: 'Node.js',    icon: <StackIcon name="nodejs" /> },
      { name: 'Spring',     icon: <StackIcon name="spring" /> },
      { name: 'MongoDB',    icon: <StackIcon name="mongodb" /> },
      { name: 'PostgreSQL', icon: <StackIcon name="postgresql" /> },
      { name: 'Supabase',   icon: <StackIcon name="supabase" /> },
    ] as SkillIcon[],
  },
  {
    id: 'engine',
    title: 'Backend',
    role: 'ENGINE CLUSTER',
    shipAnchor:  [ 0.0, -0.5, -2.6],
    labelOffset: [ 0.0,  0.6, -4.2],
    detail: 'APIs, databases, cloud infrastructure, and the raw power that drives the entire system forward.',
    skills: [
      { name: 'Docker',       icon: <StackIcon name="docker" /> },
      { name: 'Kubernetes',   icon: <StackIcon name="kubernetes" /> },
      { name: 'Git',          icon: <StackIcon name="git" /> },
      { name: 'DigitalOcean', icon: <StackIcon name="digitalocean" /> },
      { name: 'Linux',        icon: <StackIcon name="linux" /> },
    ] as SkillIcon[],
  },
  {
    id: 'stabilizer',
    title: 'Leadership',
    role: 'VERTICAL STABILIZER',
    shipAnchor:  [ 0.0,  0.8, -2.6],
    labelOffset: [ 0.0,  2.2, -3.8],
    detail: 'System design, technical leadership, and the structural decisions that keep everything aligned under pressure.',
    skills: [
      { name: 'Mentorship',           icon: null },
      { name: 'High Agency',          icon: null },
      { name: 'Pitching',             icon: null },
      { name: 'Project Ownership',    icon: null },
      { name: 'Stakeholder Comms',    icon: null },
    ] as SkillIcon[],
  },
];

// ─── Card position helper ─────────────────────────────────────────────────────
const CARD_W     = 300;
const CARD_H_EST = 340;
const CARD_PAD   = 24;

interface CardInfo {
  x: number; y: number;        // card top-left in container px
  leaderEndX: number;          // leader line x2 (card border)
  leaderEndY: number;          // leader line y2
  rotateDir: 1 | -1;           // whileHover rotateY sign
}

function computeCardInfo(cx: number, cy: number, cw: number, ch: number): CardInfo {
  const OFFSET = 72;
  const placeRight = cx + OFFSET + CARD_W < cw - CARD_PAD;
  const x = placeRight
    ? Math.min(cx + OFFSET, cw - CARD_W - CARD_PAD)
    : Math.max(cx - OFFSET - CARD_W, CARD_PAD);
  const y = Math.max(CARD_PAD, Math.min(cy - CARD_H_EST / 2, ch - CARD_H_EST - CARD_PAD));
  return {
    x, y,
    leaderEndX: placeRight ? x : x + CARD_W,
    leaderEndY: y + CARD_H_EST / 2,
    rotateDir:  placeRight ? 1 : -1,
  };
}

// ─── Floating data card (Framer Motion) ──────────────────────────────────────
const FLICKER = { opacity: [0, 0.65, 0.05, 0.9, 0.35, 1] };
const FLICKER_T = { duration: 0.75, times: [0, 0.18, 0.32, 0.52, 0.72, 1], ease: 'linear' as const };

function FloatingDataCard({
  node,
  info,
  onClose,
}: {
  node: typeof NODES[0];
  info: CardInfo;
  onClose: () => void;
}) {
  const words = node.detail.split(' ');

  return (
    <motion.div
      className="absolute z-30 pointer-events-none"
      style={{ left: info.x, top: info.y, width: CARD_W, perspective: 900 }}
      initial={{ opacity: 0 }}
      animate={FLICKER}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={FLICKER_T}
    >
      {/* 3.5D hover wrapper */}
      <motion.div
        className="pointer-events-auto"
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{ rotateY: info.rotateDir * 5, rotateX: -2, scale: 1.025 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        {/* Glass panel */}
        <div
          style={{
            background: 'rgba(0,4,12,0.93)',
            border: '1px solid rgba(34,211,238,0.50)',  /* border-cyan-500/50 */
            backdropFilter: 'blur(24px)',                /* backdrop-blur-xl */
            WebkitBackdropFilter: 'blur(24px)',
            clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
            boxShadow: '0 0 0 1px rgba(34,211,238,0.07), 0 12px 48px rgba(0,0,0,0.85)',
            position: 'relative',
          }}
        >
          {/* Corner accents */}
          <span style={{ position:'absolute', top:0, left:0, height:'1px', width:'44px', background:'linear-gradient(90deg,#22d3ee,transparent)' }} />
          <span style={{ position:'absolute', top:0, left:0, width:'1px',  height:'30px', background:'linear-gradient(180deg,#22d3ee,transparent)' }} />
          <span style={{ position:'absolute', bottom:0, right:0, height:'1px', width:'44px', background:'linear-gradient(270deg,#22d3ee,transparent)' }} />
          <span style={{ position:'absolute', bottom:0, right:0, width:'1px',  height:'30px', background:'linear-gradient(0deg,#22d3ee,transparent)' }} />

          <div style={{ padding: '16px 18px 14px' }}>

            {/* Header row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 6 }}>
              <motion.p
                style={{ fontFamily:'ui-monospace,monospace', fontSize:'9px', letterSpacing:'0.28em', color:'rgba(34,211,238,0.60)', textTransform:'uppercase', margin:0 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              >
                — {node.role}
              </motion.p>
              <button
                onClick={onClose}
                style={{ fontFamily:'ui-monospace,monospace', fontSize:'10px', color:'rgba(34,211,238,0.50)', background:'none', border:'none', cursor:'pointer', padding:0, lineHeight:1 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(34,211,238,0.50)')}
              >✕</button>
            </div>

            {/* Title */}
            <motion.h3
              style={{ fontFamily:'ui-monospace,monospace', fontSize:'clamp(14px,1.4vw,17px)', fontWeight:700, color:'#fff', margin:'0 0 10px', textShadow:'0 0 20px rgba(34,211,238,0.25)' }}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.22 }}
            >
              {node.title}
            </motion.h3>

            {/* Divider */}
            <motion.div
              style={{ height:'1px', background:'linear-gradient(90deg,rgba(34,211,238,0.45),transparent)', marginBottom:10 }}
              initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.35, duration: 0.3 }}
            />

            {/* Detail — word-by-word typewriter */}
            <p style={{ fontFamily:'ui-monospace,monospace', fontSize:'11px', color:'rgba(255,255,255,0.72)', lineHeight:1.65, margin:'0 0 12px' }}>
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.44 + i * 0.042, duration: 0.09 }}
                >
                  {word}{i < words.length - 1 ? ' ' : ''}
                </motion.span>
              ))}
            </p>

            {/* Skills — icon grid or terminal list */}
            {node.skills.some(s => s.icon) ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {node.skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 58, gap: 4 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.06, duration: 0.18 }}
                  >
                    <div style={{ width: 26, height: 26, filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.4))' }}>
                      {skill.icon}
                    </div>
                    <span style={{
                      fontFamily: 'ui-monospace,monospace', fontSize: '8px',
                      color: 'rgba(103,232,249,0.80)', textAlign: 'center',
                      letterSpacing: '0.05em', lineHeight: 1.2,
                      whiteSpace: 'normal', wordBreak: 'break-word',
                      maxWidth: 56,
                    }}>
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {node.skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    style={{ fontFamily: 'ui-monospace,monospace', fontSize: '10px', letterSpacing: '0.10em', color: '#67e8f9' }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.09, duration: 0.18 }}
                  >
                    <span style={{ color: 'rgba(34,211,238,0.40)', marginRight: 6 }}>{'>'}</span>
                    {skill.name}
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── CSS2D chip builder ───────────────────────────────────────────────────────
function buildChip(node: typeof NODES[0]) {
  const wrap = document.createElement('div');
  wrap.style.cssText = `
    background: rgba(0,8,16,0.80); border: 1px solid rgba(34,211,238,0.28);
    backdrop-filter: blur(10px); padding: 5px 10px 4px;
    cursor: pointer; user-select: none; pointer-events: auto;
    clip-path: polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px));
    transition: border-color .22s, background .22s; white-space: nowrap;
  `;
  const t = document.createElement('p');
  t.style.cssText = 'font-family:ui-monospace,monospace;font-size:12px;font-weight:600;letter-spacing:.06em;color:#67e8f9;margin:0 0 1px;white-space:nowrap;text-shadow:0 0 8px rgba(34,211,238,.55);';
  t.textContent = node.title;
  const r = document.createElement('p');
  r.style.cssText = 'font-family:ui-monospace,monospace;font-size:9px;letter-spacing:.16em;color:rgba(34,211,238,.48);margin:0;white-space:nowrap;';
  r.textContent = `— ${node.role}`;
  wrap.appendChild(t);
  wrap.appendChild(r);
  return wrap;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SpaceshipDiagram() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const leaderLineRef = useRef<SVGLineElement>(null);

  // Active node refs (read by animation loop without triggering re-renders)
  const activeNodeRef = useRef<{ sphere: THREE.Mesh; id: string } | null>(null);
  const cardInfoRef   = useRef<CardInfo | null>(null);

  // React state drives card visibility + Framer Motion
  const [activeNode, setActiveNode] = useState<typeof NODES[0] | null>(null);
  const [cardInfo,   setCardInfo]   = useState<CardInfo | null>(null);

  // Keep cardInfoRef in sync with React state
  useEffect(() => { cardInfoRef.current = cardInfo; }, [cardInfo]);

  // ── Three.js scene ─────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let w = container.clientWidth;
    let h = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // CSS2D overlay
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(w, h);
    Object.assign(labelRenderer.domElement.style, {
      position:'absolute', top:'0', left:'0', pointerEvents:'none', zIndex:'5',
    });
    container.appendChild(labelRenderer.domElement);

    // Scene + camera
    const scene  = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 200);
    camera.position.set(0, 1.0, 7.5);
    camera.lookAt(0, 0, 0);

    // Bloom
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0.5, 0.20);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // Lights
    scene.add(new THREE.AmbientLight(0x112244, 1.2));
    const key = new THREE.DirectionalLight(0x22d3ee, 0.6);
    key.position.set(-3, 4, 6);
    scene.add(key);

    // Starfield
    const starPos = new Float32Array(800 * 3);
    for (let i = 0; i < 800 * 3; i++) starPos[i] = (Math.random() - 0.5) * 80;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color:0xaabbcc, size:0.05, transparent:true, opacity:0.45 })));

    // Ship group — everything parented here rotates together
    const shipGroup = new THREE.Group();
    shipGroup.position.set(0, 0.4, 0);
    shipGroup.rotation.y = -Math.PI / 2;
    scene.add(shipGroup);

    // Holographic material
    const HOLO = 0x22d3ee;
    function applyHologram(model: THREE.Object3D) {
      model.traverse(child => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.material = new THREE.MeshStandardMaterial({
          color: HOLO, emissive: HOLO, emissiveIntensity: 0.0,
          transparent: true, opacity: 0.03, side: THREE.DoubleSide, depthWrite: false,
        });
        const edges = new THREE.EdgesGeometry(mesh.geometry, 12);
        mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
          color: HOLO, transparent: true, opacity: 0.95,
          blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
        })));
      });
    }

    // Anchor spheres + chips
    const sphereGeo = new THREE.SphereGeometry(0.07, 12, 12);

    NODES.forEach(node => {
      const aPos = new THREE.Vector3(...node.shipAnchor);
      const lPos = new THREE.Vector3(...node.labelOffset);

      // Red anchor sphere
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff4444, toneMapped: false });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.copy(aPos);
      shipGroup.add(sphere);

      // Connector line
      const lineGeo = new THREE.BufferGeometry().setFromPoints([aPos, lPos]);
      const lineMat = new THREE.LineBasicMaterial({
        color: HOLO, transparent: true, opacity: 0.4,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      });
      shipGroup.add(new THREE.Line(lineGeo, lineMat));

      // CSS2D chip
      const chip = buildChip(node);
      const obj  = new CSS2DObject(chip);
      obj.position.copy(lPos);
      shipGroup.add(obj);

      // Hover highlight
      const setLit = (lit: boolean) => {
        sphereMat.color.setHex(lit ? 0xff8888 : 0xff4444);
        lineMat.opacity = lit ? 0.8 : 0.4;
        chip.style.borderColor = lit ? 'rgba(34,211,238,.70)' : 'rgba(34,211,238,.28)';
        chip.style.background  = lit ? 'rgba(0,12,24,.94)' : 'rgba(0,8,16,.80)';
      };
      chip.addEventListener('mouseenter', () => setLit(true));
      chip.addEventListener('mouseleave', () => setLit(false));

      // Click → floating card
      chip.addEventListener('click', () => {
        const cRect   = container.getBoundingClientRect();
        const chipRect = chip.getBoundingClientRect();
        const clickX  = chipRect.left + chipRect.width  / 2 - cRect.left;
        const clickY  = chipRect.top  + chipRect.height / 2 - cRect.top;

        // Toggle off if same node
        if (activeNodeRef.current?.id === node.id) {
          activeNodeRef.current = null;
          cardInfoRef.current   = null;
          setActiveNode(null);
          setCardInfo(null);
          return;
        }

        const info = computeCardInfo(clickX, clickY, w, h);
        activeNodeRef.current = { sphere, id: node.id };
        cardInfoRef.current   = info;
        setActiveNode(node);
        setCardInfo(info);
      });
    });

    // Load model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load('/models/spaceship-diagram.glb', gltf => {
      const model = gltf.scene;
      const bbox  = new THREE.Box3().setFromObject(model);
      const size  = new THREE.Vector3();
      const center = new THREE.Vector3();
      bbox.getSize(size);
      bbox.getCenter(center);
      const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      const sb = new THREE.Box3().setFromObject(model);
      const ss = new THREE.Vector3(); sb.getSize(ss);
      console.log('[SpaceshipDiagram] scaled size:', ss, '| min:', sb.min, '| max:', sb.max);
      applyHologram(model);
      shipGroup.add(model);
    });

    // Mouse
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX =  (e.clientX / w) * 2 - 1;
      mouseY = -((e.clientY / h) * 2 - 1);
    };
    window.addEventListener('mousemove', onMouseMove);

    // Drag to rotate (hold to override auto-spin)
    let isDragging = false;
    let lastDragX = 0, lastDragY = 0;
    const AUTO_ROT_SPEED = 0.22; // radians/s

    const onMouseDown = (e: MouseEvent) => { isDragging = true; lastDragX = e.clientX; lastDragY = e.clientY; };
    const onMouseUp   = () => { isDragging = false; };
    const onDragMove  = (e: MouseEvent) => {
      if (!isDragging) return;
      shipGroup.rotation.y += (e.clientX - lastDragX) * 0.01;
      shipGroup.rotation.x += (e.clientY - lastDragY) * 0.01;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup',   onMouseUp);
    window.addEventListener('mousemove', onDragMove);

    // Animation loop
    let animId: number;
    let lastT = 0;
    let isVisible = true;
    const _tmpVec = new THREE.Vector3();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) animate(); // resume if paused
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    function animate(t = 0) {
      if (!isVisible) return; // paused — will be resumed by IntersectionObserver
      animId = requestAnimationFrame(animate);
      const delta = Math.min((t - lastT) * 0.001, 0.05);
      lastT = t;

      if (!isDragging) {
        shipGroup.rotation.y += delta * AUTO_ROT_SPEED;
      }

      composer.render();
      labelRenderer.render(scene, camera);

      // Leader line — updated after render so world matrices are current
      const line = leaderLineRef.current;
      const anr  = activeNodeRef.current;
      const ci   = cardInfoRef.current;
      if (line && anr && ci) {
        anr.sphere.getWorldPosition(_tmpVec);
        _tmpVec.project(camera);
        const sx = (_tmpVec.x  + 1) / 2 * w;
        const sy = (-_tmpVec.y + 1) / 2 * h;
        line.setAttribute('x1', String(sx));
        line.setAttribute('y1', String(sy));
        line.setAttribute('x2', String(ci.leaderEndX));
        line.setAttribute('y2', String(ci.leaderEndY));
      }
    }
    animate();

    // Resize
    const onResize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      visibilityObserver.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup',   onMouseUp);
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement))      container.removeChild(renderer.domElement);
      if (container.contains(labelRenderer.domElement)) container.removeChild(labelRenderer.domElement);
      renderer.dispose();
      composer.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeCard = () => {
    activeNodeRef.current = null;
    cardInfoRef.current   = null;
    setActiveNode(null);
    setCardInfo(null);
  };

  return (
    <div
      ref={containerRef}
      style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden', background:'transparent' }}
    >
      {/* SVG leader line — updated imperatively each frame, zero re-renders */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 15 }}
      >
        <defs>
          <filter id="leader-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {activeNode && (
          <line
            ref={leaderLineRef}
            stroke="#22d3ee"
            strokeWidth="1.2"
            strokeOpacity="0.70"
            strokeDasharray="5 3"
            filter="url(#leader-glow)"
          />
        )}
      </svg>

      {/* Framer Motion floating card */}
      <AnimatePresence mode="wait">
        {activeNode && cardInfo && (
          <FloatingDataCard
            key={activeNode.id}
            node={activeNode}
            info={cardInfo}
            onClose={closeCard}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
