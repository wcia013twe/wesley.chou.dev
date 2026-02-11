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
// @ts-expect-error - useFrame will be used in Task 3 for spaceship animation
import { Canvas, useFrame } from '@react-three/fiber';
// @ts-expect-error - useGLTF will be used in Task 3 for loading spaceship model
import { useGLTF } from '@react-three/drei';
// @ts-expect-error - useEffect/useState will be used in Task 4 for mouse tracking
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
// @ts-expect-error - THREE types will be used in Task 3 for mesh references
import * as THREE from 'three';

interface SpaceshipSceneProps {
  className?: string;
}

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
