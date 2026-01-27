import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

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

interface FloatingShapeProps {
  geometry: 'box' | 'sphere' | 'torus' | 'icosahedron';
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  material: 'standard' | 'wireframe';
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
  prefersReducedMotion: boolean;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  geometry,
  position,
  rotationSpeed,
  material,
  mousePosRef,
  prefersReducedMotion,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += rotationSpeed[0] * delta;
      meshRef.current.rotation.y += rotationSpeed[1] * delta;
      meshRef.current.rotation.z += rotationSpeed[2] * delta;

      // Mouse parallax - read from ref
      if (!prefersReducedMotion) {
        const targetX = position[0] + mousePosRef.current.x * 0.5;
        const targetY = position[1] + mousePosRef.current.y * 0.5;

        meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
        meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
      }
    }
  });

  const renderGeometry = () => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.6, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.2, 16, 100]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.7, 0]} />;
    }
  };

  const renderMaterial = () => {
    if (material === 'wireframe') {
      return <meshBasicMaterial color="#9333ea" wireframe />;
    }
    return <meshStandardMaterial color="#a78bfa" metalness={0.5} roughness={0.2} />;
  };

  return (
    <mesh ref={meshRef} position={position}>
      {renderGeometry()}
      {renderMaterial()}
    </mesh>
  );
};

interface Hero3DPlaygroundProps {
  className?: string;
}

const Hero3DPlayground: React.FC<Hero3DPlaygroundProps> = ({ className }) => {
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
    <div className={`fixed inset-0 -z-10 ${className || ''}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {/* Floating shapes */}
        <FloatingShape
          geometry="box"
          position={[-3, 2, 0]}
          rotationSpeed={[0.5, 0.3, 0]}
          material="wireframe"
          mousePosRef={mousePositionRef}
          prefersReducedMotion={prefersReducedMotion}
        />
        <FloatingShape
          geometry="sphere"
          position={[3, -1, -2]}
          rotationSpeed={[0.2, 0.4, 0.1]}
          material="standard"
          mousePosRef={mousePositionRef}
          prefersReducedMotion={prefersReducedMotion}
        />
        <FloatingShape
          geometry="torus"
          position={[0, -2, 1]}
          rotationSpeed={[0.3, 0.2, 0.5]}
          material="wireframe"
          mousePosRef={mousePositionRef}
          prefersReducedMotion={prefersReducedMotion}
        />
        <FloatingShape
          geometry="icosahedron"
          position={[-2, -1, -1]}
          rotationSpeed={[0.1, 0.5, 0.2]}
          material="standard"
          mousePosRef={mousePositionRef}
          prefersReducedMotion={prefersReducedMotion}
        />
        <FloatingShape
          geometry="box"
          position={[2, 2, -1]}
          rotationSpeed={[0.4, 0.1, 0.3]}
          material="standard"
          mousePosRef={mousePositionRef}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Canvas>
    </div>
  );
};

export default Hero3DPlayground;
