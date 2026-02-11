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
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { useGLTF, Stars } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// Extend R3F with postprocessing
extend({ EffectComposer, RenderPass, UnrealBloomPass });

interface SpaceshipSceneProps {
  className?: string;
  backgroundOnly?: boolean;
  spaceshipOnly?: boolean;
}

interface SpaceshipModelProps {
  mousePositionRef: React.MutableRefObject<{ x: number; y: number }>;
  prefersReducedMotion: boolean;
}

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// Bloom effect component
function Effects() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer>();

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.setSize(size.width, size.height);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.4,   // strength
      0.8,   // radius
      0.1    // threshold
    );
    composer.addPass(bloomPass);

    composerRef.current = composer;
  }, [gl, scene, camera, size]);

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  return null;
}

// Engine boost ray component
const EngineBoost: React.FC = () => {
  return (
    <mesh position={[0, 0, -3.5]} rotation-x={Math.PI * 0.5}>
      <cylinderGeometry args={[0.15, 0.05, 4, 15]} />
      <meshStandardMaterial
        color={[1.0, 0.4, 0.02]}
        emissive={[1.0, 0.4, 0.02]}
        emissiveIntensity={3}
        transparent
        opacity={0.9}
        toneMapped={false}
      />
    </mesh>
  );
};

const SpaceshipModel: React.FC<SpaceshipModelProps> = ({
  mousePositionRef,
  prefersReducedMotion
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/spaceship.glb');

  // Base rotation - spaceship faces right towards text
  const baseRotation = {
    x: Math.PI * 0.05,
    y: Math.PI * 0.25,
  };

  useFrame((_state) => {
    if (meshRef.current && !prefersReducedMotion) {
      // Mouse parallax rotation - primarily Y movement, minimal X lean
      const targetRotationY = baseRotation.y + mousePositionRef.current.x * 0.05;
      const targetRotationX = baseRotation.x - mousePositionRef.current.y * 0.3;

      // Smooth interpolation
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={scene.clone()} scale={0.25} position={[-1.5, 0, 0]} />
      <EngineBoost />
    </group>
  );
};

const SpaceshipScene: React.FC<SpaceshipSceneProps> = ({
  className,
  backgroundOnly = false,
  spaceshipOnly = false
}) => {
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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full ${className || ''}`}
      aria-hidden="true"
    >
      <Canvas
        frameloop={isInView ? 'always' : 'demand'}
        camera={{ position: [-5, 6, 10], fov: 25 }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Star field background - show in background mode or with spaceship */}
        {(backgroundOnly || spaceshipOnly) && (
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        )}

        {/* Spaceship and effects - only show in spaceship mode */}
        {spaceshipOnly && (
          <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, -5, 5]} intensity={0.5} />
            <SpaceshipModel
              mousePositionRef={mousePositionRef}
              prefersReducedMotion={prefersReducedMotion}
            />
            <Effects />
          </>
        )}
      </Canvas>
    </div>
  );
};

export default SpaceshipScene;

// Preload the model to prevent loading flicker
useGLTF.preload('/models/spaceship.glb');
