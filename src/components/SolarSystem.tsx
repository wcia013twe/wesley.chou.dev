// @ts-nocheck
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Import solar system helper functions (bypassing TypeScript checks)
import getSun from './solar-system/src/getSun.js';
import getNebula from './solar-system/src/getNebula.js';
import getStarfield from './solar-system/src/getStarfield.js';
import getPlanet from './solar-system/src/getPlanet.js';
import getAsteroidBelt from './solar-system/src/getAsteroidBelt.js';
import getElipticLines from './solar-system/src/getElipticLines.js';

export default function SolarSystem() {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);
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
    camera.position.set(0, 2.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000011); // Very dark blue instead of pure black
    container.appendChild(renderer.domElement);

    console.log('Solar System initialized:', { w, h, container });

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    // Animation control
    let animationId = null;
    let useAnimatedCamera = false; // Set to true for auto-rotation

    // Create solar system group
    const solarSystem = new THREE.Group();
    solarSystem.userData.update = (t) => {
      solarSystem.children.forEach((child) => {
        child.userData.update?.(t);
      });
    };
    scene.add(solarSystem);

    function initScene(data) {
      const { objs } = data;

      // Add sun
      const sun = getSun();
      solarSystem.add(sun);

      // Add planets
      const mercury = getPlanet({ size: 0.1, distance: 1.25, img: 'mercury.png' });
      solarSystem.add(mercury);

      const venus = getPlanet({ size: 0.2, distance: 1.65, img: 'venus.png' });
      solarSystem.add(venus);

      const moon = getPlanet({ size: 0.075, distance: 0.4, img: 'moon.png' });
      const earth = getPlanet({ children: [moon], size: 0.225, distance: 2.0, img: 'earth.png' });
      solarSystem.add(earth);

      const mars = getPlanet({ size: 0.15, distance: 2.25, img: 'mars.png' });
      solarSystem.add(mars);

      // Add asteroid belt if rocks are loaded
      if (objs.length > 0) {
        const asteroidBelt = getAsteroidBelt(objs);
        solarSystem.add(asteroidBelt);
        console.log('Asteroid belt added with', objs.length, 'rock types');
      } else {
        console.log('Asteroid belt skipped - no rocks loaded yet');
      }

      const jupiter = getPlanet({ size: 0.4, distance: 2.75, img: 'jupiter.png' });
      solarSystem.add(jupiter);

      const sRingGeo = new THREE.TorusGeometry(0.6, 0.15, 8, 64);
      const sRingMat = new THREE.MeshStandardMaterial();
      const saturnRing = new THREE.Mesh(sRingGeo, sRingMat);
      saturnRing.scale.z = 0.1;
      saturnRing.rotation.x = Math.PI * 0.5;
      const saturn = getPlanet({ children: [saturnRing], size: 0.35, distance: 3.25, img: 'saturn.png' });
      solarSystem.add(saturn);

      const uRingGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 64);
      const uRingMat = new THREE.MeshStandardMaterial();
      const uranusRing = new THREE.Mesh(uRingGeo, uRingMat);
      uranusRing.scale.z = 0.1;
      const uranus = getPlanet({ children: [uranusRing], size: 0.3, distance: 3.75, img: 'uranus.png' });
      solarSystem.add(uranus);

      const neptune = getPlanet({ size: 0.3, distance: 4.25, img: 'neptune.png' });
      solarSystem.add(neptune);

      // Add orbital lines
      const elipticLines = getElipticLines();
      solarSystem.add(elipticLines);

      // Add starfield (more stars, larger)
      const starfield = getStarfield({ numStars: 2000, size: 0.5 });
      scene.add(starfield);
      console.log('Starfield added with 2000 stars');

      // Add ambient lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);

      // Add directional light
      const dirLight = new THREE.DirectionalLight(0x0099ff, 1);
      dirLight.position.set(0, 1, 0);
      scene.add(dirLight);

      // Add nebulas (more visible)
      const nebula = getNebula({
        hue: 0.6,
        numSprites: 15,
        opacity: 0.4,
        radius: 40,
        size: 100,
        z: -50.5,
      });
      scene.add(nebula);
      console.log('Purple nebula added');

      const anotherNebula = getNebula({
        hue: 0.0,
        numSprites: 15,
        opacity: 0.4,
        radius: 40,
        size: 100,
        z: 50.5,
      });
      scene.add(anotherNebula);
      console.log('Orange nebula added');

      // Animation loop
      const cameraDistance = 5;
      function animate(t = 0) {
        const time = t * 0.0002;
        animationId = requestAnimationFrame(animate);
        solarSystem.userData.update(time);
        renderer.render(scene, camera);

        if (useAnimatedCamera) {
          camera.position.x = Math.cos(time * 0.75) * cameraDistance;
          camera.position.y = Math.cos(time * 0.75);
          camera.position.z = Math.sin(time * 0.75) * cameraDistance;
          camera.lookAt(0, 0, 0);
        } else {
          controls.update();
        }
      }

      animate();
    }

    // Initialize scene data
    const sceneData = { objs: [] };
    let rocksLoaded = 0;
    const totalRocks = 3;

    // Initialize scene immediately (don't wait for rocks)
    initScene(sceneData);

    // Load asteroid rocks asynchronously
    const loader = new OBJLoader();
    const objs = ['Rock1', 'Rock2', 'Rock3'];
    objs.forEach((name) => {
      const path = `/rocks/${name}.obj`;
      loader.load(
        path,
        (obj) => {
          obj.traverse((child) => {
            if (child.isMesh) {
              sceneData.objs.push(child);
            }
          });
          rocksLoaded++;

          // When all rocks are loaded, add asteroid belt
          if (rocksLoaded === totalRocks) {
            console.log('All rocks loaded, adding asteroid belt');
            const asteroidBelt = getAsteroidBelt(sceneData.objs);
            solarSystem.add(asteroidBelt);
          }
        },
        undefined,
        (error) => {
          console.warn(`Could not load ${name}:`, error);
          rocksLoaded++;
        }
      );
    });

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
      controls.dispose();
      initializedRef.current = false;
    };

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #0a0a0f 100%)' }}
    />
  );
}
