// @ts-nocheck
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Import solar system helper functions (bypassing TypeScript checks)
import getSun from './solar-system/src/getSun.js';
import getStarfield from './solar-system/src/getStarfield.js';
import getPlanet from './solar-system/src/getPlanet.js';
import getAsteroidBelt from './solar-system/src/getAsteroidBelt.js';
import getElipticLines from './solar-system/src/getElipticLines.js';
import getNebula from './solar-system/src/getNebula.js';

// Import projects data
import { projects } from '../data/projectsData';

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
    camera.position.set(0, 6, 6); // Moved back to see larger scene

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

      // Add sun (scaled up for larger scene)
      const sun = getSun();
      sun.scale.setScalar(2.0); // Make sun 2x bigger
      solarSystem.add(sun);

      // Create planets from projects data
      const baseDistance = 3.5;
      const distanceIncrement = 1.8;

      projects.forEach((project, index) => {
        const distance = baseDistance + (index * distanceIncrement);
        const planetSize = 0.6;

        // Create text label for project
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, 512, 128);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(project.title, 256, 60);
        ctx.font = '22px Arial';
        ctx.fillText(project.date, 256, 95);

        const labelTexture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: labelTexture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(3, 0.75, 1);
        sprite.position.set(0, 1.3, 0);

        // Use different planet textures for variety
        const planetTextures = ['earth.png', 'mars.png', 'jupiter.png', 'venus.png', 'mercury.png', 'uranus.png'];
        const texture = planetTextures[index % planetTextures.length];

        const planet = getPlanet({
          children: [sprite],
          size: planetSize,
          distance: distance,
          img: texture
        });
        solarSystem.add(planet);
        console.log(`Added planet for ${project.title} at distance ${distance}`);
      });

      // Add orbital lines
      const elipticLines = getElipticLines();
      solarSystem.add(elipticLines);

      // Add starfield (more stars, larger, white color)
      const starfield = getStarfield({ numStars: 2000, size: 0.5, saturation: 0 });
      scene.add(starfield);
      console.log('Starfield added with 2000 white stars');

      // Add ambient lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);

      // Add directional light
      const dirLight = new THREE.DirectionalLight(0x0099ff, 1);
      dirLight.position.set(0, 1, 0);
      scene.add(dirLight);

      // Add nebula background layers
      const nebula = getNebula({
        hue: 0.6,
        numSprites: 10,
        opacity: 0.2,
        radius: 40,
        size: 80,
        z: -50.5,
      });
      scene.add(nebula);

      const anotherNebula = getNebula({
        hue: 0.0,
        numSprites: 10,
        opacity: 0.2,
        radius: 40,
        size: 80,
        z: 50.5,
      });
      scene.add(anotherNebula);

      // Animation loop
      const cameraDistance = 5;
      function animate(t = 0) {
        const time = t * 0.00005; // Slowed down 4x (was 0.0002)
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

    // Initialize scene
    const sceneData = { objs: [] };
    initScene(sceneData);

    // Load asteroid rocks for the belt (asynchronous)
    const loader = new OBJLoader();
    const rockNames = ['Rock1', 'Rock2', 'Rock3'];
    let rocksLoaded = 0;

    rockNames.forEach((name) => {
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

          // When all rocks loaded, add asteroid belt
          if (rocksLoaded === rockNames.length) {
            console.log('All rocks loaded, adding asteroid belt');
            const asteroidBelt = getAsteroidBelt(sceneData.objs, 8.0);
            solarSystem.add(asteroidBelt);
          }
        },
        undefined,
        (error) => console.warn(`Could not load ${name}:`, error)
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
    />
  );
}
