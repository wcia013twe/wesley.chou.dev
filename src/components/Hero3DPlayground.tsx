import { Canvas } from '@react-three/fiber';

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
        {/* Shapes will be added in next step */}
      </Canvas>
    </div>
  );
};

export default Hero3DPlayground;
