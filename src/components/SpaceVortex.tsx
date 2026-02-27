// // @ts-nocheck
// /**
//  * SpaceVortex - 3D space tunnel background
//  *
//  * Inspired by the "3D Space Rail Shooter with Three.js" article series.
//  * Renders a cylindrical tunnel viewed from the inside (BackSide material)
//  * with a procedurally generated space texture. Animates by scrolling the
//  * texture forward and gently rotating the tunnel for a vortex effect.
//  */
// import { useEffect, useRef } from "react";
// import * as THREE from "three";

// interface SpaceVortexProps {
//   className?: string;
// }

// // Draw a single blurred color blob onto ctx. The blur filter is applied at the
// // pixel level so adjacent blobs with different colors physically bleed into each
// // other — producing smooth, painterly nebula blends without hard centers.
// function drawBlob(
//   ctx: CanvasRenderingContext2D,
//   cx: number, cy: number, r: number,
//   rgb: [number, number, number], alpha: number, blur: number
// ) {
//   ctx.save();
//   ctx.filter = `blur(${blur}px)`;
//   ctx.globalCompositeOperation = "screen";
//   ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
//   ctx.beginPath();
//   ctx.arc(cx, cy, r, 0, Math.PI * 2);
//   ctx.fill();
//   ctx.restore();
// }

// function buildSpaceTexture(): THREE.CanvasTexture {
//   const size = 1024;
//   const canvas = document.createElement("canvas");
//   canvas.width = size;
//   canvas.height = size;
//   const ctx = canvas.getContext("2d")!;

//   // Near-black base
//   ctx.fillStyle = "#00000a";
//   ctx.fillRect(0, 0, size, size);

//   // ── Base layer — large, very blurry anchor zones ──────────────────────────
//   // These establish the broad hue regions. The high blur (120-140px) means
//   // each blob's color dissolves for hundreds of pixels, fully overlapping
//   // neighbors and merging smoothly.
//   //                cx    cy    r    rgb                  alpha  blur
//   drawBlob(ctx,    240,  260,  240, [140,  22,  10], 0.70, 130); // dusty red
//   drawBlob(ctx,    790,  260,  230, [ 10,  22, 115], 0.70, 130); // deep blue
//   drawBlob(ctx,    510,  730,  240, [ 72,   8,  98], 0.65, 125); // muted purple
//   drawBlob(ctx,    140,  780,  210, [ 18,  70,  14], 0.62, 120); // olive green
//   drawBlob(ctx,    870,  790,  210, [ 98,  44,   8], 0.62, 120); // brown

//   // ── Bridge layer — medium blobs placed between adjacent base zones ─────────
//   // Where two base colors overlap they already blend; these mid-placed blobs
//   // explicitly mix neighboring hues (e.g. red+purple → maroon/magenta).
//   drawBlob(ctx,    400,  480,  170, [ 95,  14,  54], 0.55,  85); // red × purple
//   drawBlob(ctx,    660,  560,  160, [ 12,  45,  78], 0.52,  80); // blue × green
//   drawBlob(ctx,    590,  370,  155, [ 90,  32,  10], 0.50,  78); // red × brown
//   drawBlob(ctx,    310,  620,  150, [ 42,  40,  60], 0.50,  78); // purple × green
//   drawBlob(ctx,    700,  430,  145, [ 10,  14,  90], 0.48,  75); // blue × purple
//   drawBlob(ctx,    200,  450,  140, [ 80,  20,  30], 0.48,  75); // red × purple

//   // ── Detail layer — smaller puffs for local variation ──────────────────────
//   drawBlob(ctx,    480,  200,  110, [110,  18,  10], 0.50,  50); // red accent
//   drawBlob(ctx,    820,  560,  105, [ 10,  30,  95], 0.48,  48); // blue accent
//   drawBlob(ctx,    350,  820,  100, [ 55,   8,  80], 0.46,  46); // purple accent
//   drawBlob(ctx,    680,  850,   95, [ 80,  36,   8], 0.45,  44); // brown accent
//   drawBlob(ctx,    160,  340,   95, [ 15,  60,  12], 0.45,  44); // green accent
//   drawBlob(ctx,    600,  620,   90, [ 60,  24,  50], 0.42,  42); // maroon accent
//   drawBlob(ctx,    420,  560,   85, [ 20,  50,  40], 0.40,  40); // teal accent

//   // ── Faint wide wash — pulls the whole image together ──────────────────────
//   drawBlob(ctx,    512,  512,  420, [ 38,  10,  52], 0.28, 160); // deep purple wash
//   drawBlob(ctx,    300,  700,  360, [ 70,  18,   8], 0.20, 150); // warm wash
//   drawBlob(ctx,    750,  350,  340, [ 10,  18,  80], 0.20, 150); // cool wash

//   // ── Stars — drawn after nebulae, sharp, no blur ───────────────────────────
//   ctx.filter = "none";
//   ctx.globalCompositeOperation = "source-over";
//   for (let i = 0; i < 1600; i++) {
//     const x = Math.random() * size;
//     const y = Math.random() * size;
//     const r = Math.random() < 0.06 ? 1.1 + Math.random() * 0.9 : 0.3 + Math.random() * 0.55;
//     const alpha = 0.20 + Math.random() * 0.40;
//     const roll = Math.random();
//     // Tinted to match palette: warm red-white, cool blue-white, or neutral grey
//     let color: string;
//     if (roll < 0.12)      color = `rgba(255,210,185,${alpha})`;
//     else if (roll < 0.22) color = `rgba(185,205,255,${alpha})`;
//     else                  color = `rgba(210,210,210,${alpha})`;
//     ctx.fillStyle = color;
//     ctx.beginPath();
//     ctx.arc(x, y, r, 0, Math.PI * 2);
//     ctx.fill();
//   }

//   const tex = new THREE.CanvasTexture(canvas);
//   tex.wrapS = THREE.RepeatWrapping;
//   tex.wrapT = THREE.RepeatWrapping;
//   tex.repeat.set(4, 8);
//   return tex;
// }

// export default function SpaceVortex({ className = "" }: SpaceVortexProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const initializedRef = useRef(false);

//   useEffect(() => {
//     if (!containerRef.current || initializedRef.current) return;
//     initializedRef.current = true;

//     const container = containerRef.current;
//     let w = container.clientWidth;
//     let h = container.clientHeight;

//     // --- Scene ---
//     const scene = new THREE.Scene();
//     scene.fog = new THREE.FogExp2(0x000022, 0.0009);

//     // --- Camera ---
//     const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 3000);
//     camera.position.set(0, 0, 0);

//     // --- Renderer ---
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
//     renderer.setSize(w, h);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.setClearColor(0x000022, 1);
//     container.appendChild(renderer.domElement);

//     // --- Space texture ---
//     const spaceTexture = buildSpaceTexture();

//     // --- Tunnel mesh: cylinder viewed from inside ---
//     const tunnel = new THREE.Mesh(
//       new THREE.CylinderGeometry(90, 90, 2500, 32, 32, true),
//       new THREE.MeshBasicMaterial({
//         map: spaceTexture,
//         side: THREE.BackSide,
//       })
//     );
//     // Lay the cylinder along the Z axis (camera looks down -Z)
//     tunnel.rotation.x = -Math.PI / 2;
//     scene.add(tunnel);

//     // --- Animation ---
//     let animationId: number;
//     let t = 0;

//     function animate() {
//       animationId = requestAnimationFrame(animate);
//       t += 0.0004;

//       // Scroll texture forward — simulates flying through the vortex
//       spaceTexture.offset.y = t;

//       // Gentle spiral rotation for the vortex feel
//       tunnel.rotation.z = t * 0.08;

//       // Very subtle camera drift (side-to-side sway)
//       camera.position.x = Math.sin(t * 0.6) * 2;
//       camera.position.y = Math.cos(t * 0.4) * 1.5;

//       renderer.render(scene, camera);
//     }

//     animate();

//     // --- Resize ---
//     const handleResize = () => {
//       if (!container) return;
//       w = container.clientWidth;
//       h = container.clientHeight;
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//       renderer.setSize(w, h);
//     };
//     window.addEventListener("resize", handleResize);

//     // --- Cleanup ---
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       cancelAnimationFrame(animationId);
//       if (container.contains(renderer.domElement)) {
//         container.removeChild(renderer.domElement);
//       }
//       spaceTexture.dispose();
//       renderer.dispose();
//       initializedRef.current = false;
//     };
//   }, []);

//   return <div ref={containerRef} className={className} />;
// }
