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
import React, { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import * as THREE from "three";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
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

// Bloom effect - manual THREE.js postprocessing (matches Svelte implementation)
function Effects() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer>();

  useEffect(() => {
    // Create effect composer
    const composer = new EffectComposer(gl);
    composer.setSize(size.width, size.height);

    // Add render pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Add bloom pass - threshold between rays (~1.3) and engine (~1.5)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.5,    // strength
      1,      // radius
      1.4     // threshold - engine passes, rays don't
    );
    composer.addPass(bloomPass);

    // Add output pass
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    composerRef.current = composer;

    return () => {
      composer.dispose();
    };
  }, [gl, scene, camera, size]);

  // Render with composer instead of default renderer
  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  return null;
}

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

  // Base rotation - spaceship faces right towards text
  const baseRotation = {
    x: Math.PI * 0.05,
    y: Math.PI * 0.25,
  };

  useFrame((_state) => {
    if (meshRef.current && !prefersReducedMotion) {
      // Mouse parallax rotation - primarily Y movement, minimal X lean
      const targetRotationY =
        baseRotation.y + mousePositionRef.current.x * 0.05;
      const targetRotationX = baseRotation.x - mousePositionRef.current.y * 0.3;

      // Smooth interpolation
      meshRef.current.rotation.y +=
        (targetRotationY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x +=
        (targetRotationX - meshRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive
        object={scene.clone()}
        scale={0.25}
        position={[-1.5, -0.9, -3.5]}
        renderOrder={1}
      />
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
        style={{ background: 'transparent' }}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
          premultipliedAlpha: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Black with 0 alpha (fully transparent)
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} />
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

// Preload the model to prevent loading flicker
useGLTF.preload("/models/spaceship.glb");
