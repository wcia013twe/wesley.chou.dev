import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

const texLoader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 6);
function getPlanet({ children = [], distance = 0, img = '', size = 1, rings = false, rate = -0.5, startAngle = 0 }) {
    const orbitGroup = new THREE.Group();

    const path = `/textures/${img}`;
    const map = texLoader.load(path);
    const planetMat = new THREE.MeshStandardMaterial({
      map,
    });
    const planet = new THREE.Mesh(geo, planetMat);
    planet.scale.setScalar(size);

    planet.position.x = Math.cos(startAngle) * distance;
    planet.position.z = Math.sin(startAngle) * distance;
    
    const planetRimMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0x000000 });
    const planetRimMesh = new THREE.Mesh(geo, planetRimMat);
    planetRimMesh.scale.setScalar(1.01);
    planet.add(planetRimMesh);

    if (rings) {
      const ringGeo = new THREE.RingGeometry(1.3, 1.8, 40);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc2a97a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.42;
      planet.add(ring);
    }

    children.forEach((child) => {
      child.position.x = Math.cos(startAngle) * distance;
      child.position.z = Math.sin(startAngle) * distance;
      orbitGroup.add(child);
    });

    orbitGroup.userData.update = (t) => {
      orbitGroup.rotation.y = t * rate;
      planet.rotation.y = t * 3; // slow self-rotation
      children.forEach((child) => {
        child.userData.update?.(t);
      });
    };
    orbitGroup.add(planet);
    return orbitGroup;
  }

  export default getPlanet;