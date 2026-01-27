import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface FloatingShapeProps {
  geometry: 'box' | 'sphere' | 'torus' | 'icosahedron';
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  material: 'standard' | 'wireframe';
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  geometry,
  position,
  rotationSpeed,
  material,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0] * delta;
      meshRef.current.rotation.y += rotationSpeed[1] * delta;
      meshRef.current.rotation.z += rotationSpeed[2] * delta;
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
        />
        <FloatingShape
          geometry="sphere"
          position={[3, -1, -2]}
          rotationSpeed={[0.2, 0.4, 0.1]}
          material="standard"
        />
        <FloatingShape
          geometry="torus"
          position={[0, -2, 1]}
          rotationSpeed={[0.3, 0.2, 0.5]}
          material="wireframe"
        />
        <FloatingShape
          geometry="icosahedron"
          position={[-2, -1, -1]}
          rotationSpeed={[0.1, 0.5, 0.2]}
          material="standard"
        />
        <FloatingShape
          geometry="box"
          position={[2, 2, -1]}
          rotationSpeed={[0.4, 0.1, 0.3]}
          material="standard"
        />
      </Canvas>
    </div>
  );
};

export default Hero3DPlayground;
