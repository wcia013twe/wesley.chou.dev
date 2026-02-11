// @ts-nocheck
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import getStarfield from './solar-system/src/getStarfield.js';

interface Starfield3DProps {
  numStars?: number;
  size?: number;
  className?: string;
}

export default function Starfield3D({
  numStars = 1000,
  size = 0.3,
  className = ''
}: Starfield3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;
    initializedRef.current = true;

    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true // Transparent background
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Add starfield
    const starfield = getStarfield({ numStars, size });
    scene.add(starfield);

    // Animation loop
    let animationId: number | null = null;
    function animate(t = 0) {
      const time = t * 0.0001;
      animationId = requestAnimationFrame(animate);

      // Slowly rotate the starfield
      starfield.rotation.y = time * 0.05;
      starfield.rotation.x = Math.sin(time * 0.1) * 0.1;

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    cleanupRef.current = () => {
      window.removeEventListener('resize', handleResize);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      initializedRef.current = false;
    };

    return () => {
      cleanupRef.current?.();
    };
  }, [numStars, size]);

  return (
    <div
      ref={containerRef}
      className={className}
    />
  );
}
