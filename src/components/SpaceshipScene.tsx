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
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import * as THREE from 'three';

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
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

const SpaceshipModel: React.FC<SpaceshipModelProps> = ({
  mousePositionRef,
  prefersReducedMotion
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/spaceship.glb');

  useFrame((_state) => {
    if (meshRef.current && !prefersReducedMotion) {
      // Mouse parallax rotation
      const targetRotationY = mousePositionRef.current.x * 0.3;
      const targetRotationX = -mousePositionRef.current.y * 0.2;

      // Smooth interpolation
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene.clone()}
      scale={0.3}
      position={[0, 0, 0]}
      rotation={[0, Math.PI * 0.55, 0]}
    />
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} />
        <SpaceshipModel
          mousePositionRef={mousePositionRef}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Canvas>
    </div>
  );
};

export default SpaceshipScene;

// Preload the model to prevent loading flicker
useGLTF.preload('/models/spaceship.glb');
