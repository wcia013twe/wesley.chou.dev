/**
 * MovingRays - Animated light rays background component
 *
 * Creates horizontal moving light streaks similar to the Threlte Stars component.
 * Uses instanced rendering for performance with 350+ animated rays.
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface Ray {
  position: THREE.Vector3;
  length: number;
  speed: number;
  radius: number;
  color: THREE.Color;
}

const RAYS_COUNT = 100;
const COLORS = ['#fcaa67', '#C75D59', '#ffffc7', '#8CC5C6', '#A5898C'];

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function resetRay(ray: Ray): void {
  // Start at bottom-right, varying depth layers
  if (Math.random() > 0.8) {
    ray.position.set(
      random(10, 40),      // Right side (positive X)
      random(-15, -10),    // Bottom (negative Y)
      random(6, -6)
    );
    ray.length = random(1.5, 15);
  } else {
    ray.position.set(
      random(15, 45),      // Far right
      random(-20, -15),    // Lower bottom
      random(30, -45)
    );
    ray.length = random(2.5, 20);
  }

  ray.speed = random(19.5, 42);
  ray.radius = random(0.04, 0.07);

  const colorHex = COLORS[Math.floor(Math.random() * COLORS.length)];
  ray.color = new THREE.Color(colorHex).convertSRGBToLinear().multiplyScalar(0.4);
}

export default function MovingRays() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Load star texture for alpha map
  const starTexture = useTexture('/textures/star.png');

  // Initialize rays data
  const rays = useMemo<Ray[]>(() => {
    const raysArray: Ray[] = [];
    for (let i = 0; i < RAYS_COUNT; i++) {
      const ray: Ray = {
        position: new THREE.Vector3(),
        length: 0,
        speed: 0,
        radius: 0,
        color: new THREE.Color(),
      };
      resetRay(ray);
      raysArray.push(ray);
    }
    return raysArray;
  }, []);

  // Reused across frames — avoids allocating a new Object3D every frame
  const dummy = useRef(new THREE.Object3D());

  // Animate rays
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    rays.forEach((ray, i) => {
      // Move ray diagonally (bottom-right to top-left)
      ray.position.x -= ray.speed * delta;
      ray.position.y += ray.speed * delta / 3;

      // Reset if off-screen (reached top-left)
      if (ray.position.x < -40 || ray.position.y > 40) {
        resetRay(ray);
      }

      // Update instance transform
      dummy.current.position.copy(ray.position);
      dummy.current.scale.set(ray.length, 1, 1);
      dummy.current.rotation.set(0, -0.8, 0);
      dummy.current.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.current.matrix);
      meshRef.current!.setColorAt(i, ray.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RAYS_COUNT]}>
      <planeGeometry args={[1, 0.05]} />
      <meshBasicMaterial
        side={THREE.DoubleSide}
        alphaMap={starTexture}
        transparent
        depthWrite={false}
      />
    </instancedMesh>
  );
}
