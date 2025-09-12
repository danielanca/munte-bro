import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styles from './ThreeJSBackground.module.css'; // Import the CSS module

const ThreeJSBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const worldURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg";

    // Scene and Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;

    // Textures
    const textureLoader = new THREE.TextureLoader();
    const worldTexture = textureLoader.load(worldURL);

    // World Sphere Geometry
    const worldGeometry = new THREE.SphereGeometry(1000, 60, 60);
    const worldMaterial = new THREE.MeshBasicMaterial({
      map: worldTexture,
      side: THREE.BackSide,
    });
    const world = new THREE.Mesh(worldGeometry, worldMaterial);
    scene.add(world);

    // Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    scene.add(hemiLight);

    // Directional Light
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-100, 10, 50);
    scene.add(light);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      world.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    // Handle Window Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize, false);

    return () => {
      window.removeEventListener("resize", onResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.backgroundContainer} />;
};

export default ThreeJSBackground;
