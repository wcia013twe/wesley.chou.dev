/**
 * SpaceshipScene - 3D spaceship display component for homepage hero
 *
 * Renders a React Three Fiber canvas with spaceship model and mouse parallax interaction.
 * Features:
 * - Mouse parallax rotation (Task 4)
 * - Performance optimization (only renders when visible)
 * - Respects prefers-reduced-motion settings (Task 4)
 * - Responsive lighting setup
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useInView } from "framer-motion";
import * as THREE from "three";
// import { EffectComposer, Bloom, SelectiveBloom } from "@react-three/postprocessing";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import MovingRays from "./MovingRays";

interface SpaceshipSceneProps {
  className?: string;
}

interface SpaceshipModelProps {
  mousePositionRef: React.MutableRefObject<{ x: number; y: number }>;
  prefersReducedMotion: boolean;
}

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
};

// Pre-compiles all shaders and uploads textures to the GPU before the first
// animated frame.  Eliminates the shader-compilation stall that spikes delta
// and causes the fly-in to jump on first render.
function Precompile() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.compile(scene, camera);
  }, [gl, scene, camera]);
  return null;
}

// Bloom effect - manual THREE.js postprocessing
function Effects() {
  const { gl, scene, camera, size } = useThree();
  const bloomPassRef = useRef<UnrealBloomPass>();

  // useMemo initializes synchronously so the composer is ready on frame 1,
  // preventing a flash of unprocessed materials on the first render.
  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.4,   // strength
      0.35,  // radius — tight to prevent halo spread
      0.5    // threshold
    );
    bloomPassRef.current = bloomPass;
    c.addPass(bloomPass);
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera]); // no `size` — handled separately below

  useEffect(() => () => { composer.dispose(); }, [composer]);

  // Resize only — no pass recreation
  useEffect(() => {
    composer.setSize(size.width, size.height);
    bloomPassRef.current?.setSize(size.width, size.height);
  }, [size, composer]);

  useFrame(() => { composer.render(); }, 1);

  return null;
}

// Cinematic rim lights — separate ship silhouette from the black background.
// Warm point light at the engine rear (motivated by engine glow) + cool point
// light at the upper hull (ambient space).  Both live in world space so they
// shift naturally as the ship rotates with mouse parallax.
//
// Positions sit far behind the ship (deep negative Z) so they only graze the
// back-facing silhouette edges, not the camera-facing surfaces.
// Point-light falloff (decay=2) naturally produces feathered, non-uniform edges.
const RimLights: React.FC = () => (
  <>
    {/* Warm amber — engine-rear motivated.
        Intensity is high enough that specular peaks on beveled back-edges
        clear the bloom threshold (at ~2 units away: ~1.2 luminance on metal),
        while flat back-faces fall below it — producing feathered, non-uniform glow. */}
    <pointLight
      position={[0.6, -2.1, -8.3]}
      color="#ff7030"
      intensity={5}
      distance={11}
      decay={2}
    />
    {/* Cool blue-gray — ambient space fill, slightly weaker so warm side dominates. */}
    <pointLight
      position={[-2.6, 2.3, -8.8]}
      color="#7799cc"
      intensity={2.5}
      distance={10}
      decay={2}
    />
  </>
);

const BASE_ROTATION = { x: Math.PI * 0.05, y: Math.PI * 0.25 };

// Engine boost ray component - matches Threlte implementation
const EngineBoost: React.FC = () => {
  const alphaMap = useTexture('/textures/energy-beam-opacity.png');

  return (
    <mesh position={[0, -0.75, -6.7]} rotation-x={Math.PI * 0.5}>
      <cylinderGeometry args={[0.15, 0.05, 4, 15]} />
      <meshBasicMaterial
        color={[3.5, 1.2, 0.06]}
        alphaMap={alphaMap}
        transparent
        blending={THREE.CustomBlending}
        blendDst={THREE.OneFactor}
        blendEquation={THREE.AddEquation}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
};

const SpaceshipModel: React.FC<SpaceshipModelProps> = ({
  mousePositionRef,
  prefersReducedMotion,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/spaceship.glb");

  // Single clone pass — builds both the enhanced scene and the rim overlay.
  // rimScene clones from enhancedScene so BufferGeometry is shared across all
  // three (original, enhanced, rim) — no geometry is duplicated in GPU memory.
  const [enhancedScene, rimScene] = useMemo(() => {
    const clone = scene.clone(true);

    // Enhance materials for rim specular catch-lights
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const enhanced = mats.map((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return mat;
        const m = mat.clone();
        m.roughness = Math.max(0.25, m.roughness - 0.12);
        m.metalness = Math.min(1.0,  m.metalness + 0.18);
        return m;
      });
      mesh.material = Array.isArray(mesh.material) ? enhanced : enhanced[0];
    });

    // Rim overlay — clones from the already-cloned scene so geometry is shared
    const rim = clone.clone(true);
    const rimMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
      uniforms: {
        uWarm:      { value: new THREE.Color(2.2, 0.38, 0.05) },
        uPower:     { value: 2.2 },
        uIntensity: { value: 1.5 },
      },
      vertexShader: /* glsl */`
        varying vec3 vViewNormal;
        varying vec3 vViewDir;
        void main() {
          vViewNormal = normalize(normalMatrix * normal);
          vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
          vViewDir    = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */`
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
    rim.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = rimMat;
    });

    return [clone, rim];
  }, [scene]);

  // Hide for the first 2 frames while bloom render targets initialize,
  // otherwise the bright engine materials spike the bloom red on frame 1.
  const warmup = useRef(0);
  const flyIn = useRef(0);
  const FLY_IN_DURATION = 1.2;
  const FLY_IN_START_X = -20;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (warmup.current < 2) {
      warmup.current++;
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    // Fly in from the left — ease-out cubic over FLY_IN_DURATION seconds
    if (flyIn.current < FLY_IN_DURATION) {
      flyIn.current = Math.min(flyIn.current + delta, FLY_IN_DURATION);
      const t = flyIn.current / FLY_IN_DURATION;
      const eased = 1 - Math.pow(1 - t, 3);
      meshRef.current.position.x = FLY_IN_START_X * (1 - eased);
    }

    if (prefersReducedMotion) return;

    const targetRotationY = BASE_ROTATION.y + mousePositionRef.current.x * 0.05;
    const targetRotationX = BASE_ROTATION.x - mousePositionRef.current.y * 0.3;

    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={meshRef}>
      <primitive object={enhancedScene} scale={0.25} position={[-1.5, -0.9, -3.5]} renderOrder={1} />
      <primitive object={rimScene}      scale={0.25} position={[-1.5, -0.9, -3.5]} renderOrder={2} />
      <EngineBoost />
    </group>
  );
};

const SpaceshipScene: React.FC<SpaceshipSceneProps> = ({ className }) => {
  const canvasRef = useRef(null);
  const isInView = useInView(canvasRef);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full ${className || ""}`}
      aria-hidden="true"
      style={{ background: 'transparent' }}
    >
      <Canvas
        frameloop={isInView ? "always" : "demand"}
        camera={{ position: [-5, 6, 10], fov: 25 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
        gl={{
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Precompile />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} />
        <RimLights />
        <MovingRays />
        <SpaceshipModel
          mousePositionRef={mousePositionRef}
          prefersReducedMotion={prefersReducedMotion}
        />
        <Effects />
      </Canvas>
    </div>
  );
};

export default SpaceshipScene;

// Preload the model. drei's useGLTF defaults useMeshopt=true, so the
// meshopt-compressed GLB is decoded automatically via three-stdlib's decoder.
useGLTF.preload("/models/spaceship.glb");
