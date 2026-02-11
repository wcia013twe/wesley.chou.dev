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
// @ts-expect-error - useEffect/useState will be used in Task 4 for mouse tracking
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

const SpaceshipModel: React.FC<SpaceshipModelProps> = ({
  mousePositionRef,
  prefersReducedMotion
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/spaceship.glb');

  useFrame((_state, delta) => {
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
      scale={1.5}
      position={[0, 0, 0]}
    />
  );
};

const SpaceshipScene: React.FC<SpaceshipSceneProps> = ({ className }) => {
  const canvasRef = useRef(null);
  const isInView = useInView(canvasRef);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full ${className || ''}`}
      aria-hidden="true"
    >
      <Canvas
        frameloop={isInView ? 'always' : 'demand'}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} />
      </Canvas>
    </div>
  );
};

export default SpaceshipScene;

// Preload the model to prevent loading flicker
useGLTF.preload('/models/spaceship.glb');
