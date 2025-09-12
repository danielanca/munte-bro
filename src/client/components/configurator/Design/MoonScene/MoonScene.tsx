import React, { useRef, useEffect, useState } from 'react';
import { Mesh } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';  // For Three.js calculations and material management
import styles from './MoonScene.module.css';

interface MoonSceneProps {
  latitude: string;
  longitude: string;
  date: Date;
  time: { hours: string; minutes: string; period: string };
  selectedGlow: boolean;
  selectedOrientation: string; // Pass selected orientation to manage glow style
}

const Moon: React.FC<MoonSceneProps> = ({ latitude, longitude, date, time, selectedGlow, selectedOrientation }) => {
  const moonRef = useRef<Mesh>(null!);
  const glowRef = useRef<Mesh>(null!);
  const [targetRotationY, setTargetRotationY] = useState(0);
  const [targetRotationX, setTargetRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [isInitialRotation, setIsInitialRotation] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load textures for the moon
  const [texture, displacementMap] = useTexture([
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg',
  ]);

  useEffect(() => {
    const currentDate = new Date();
    const dateDifference = Math.abs((date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
    const latAdjustment = (parseFloat(latitude) / 180) * 2;
    const longAdjustment = (parseFloat(longitude) / 360) * 2;
    const dateAdjustment = dateDifference * 0.005;
    const timeAdjustment =
      parseInt(time.hours) * (time.period === 'PM' ? 0.04 : 0.02) +
      parseInt(time.minutes) * 0.0002;
  
    setTargetRotationY(latAdjustment + longAdjustment + dateAdjustment + timeAdjustment);
    setTargetRotationX((latAdjustment + timeAdjustment) * 0.75);
  }, [latitude, longitude, date, time]);

  useFrame((state, delta) => {
    if (moonRef.current) {
      if (isInitialRotation && elapsedTime < 3) {
        moonRef.current.rotation.y += 0.01;
        setElapsedTime(elapsedTime + delta);
      } else {
        setIsInitialRotation(false);

        const easing = 0.1;
        const newY = rotationY + (targetRotationY - rotationY) * easing;
        const newX = rotationX + (targetRotationX - rotationX) * easing;

        moonRef.current.rotation.y = newY;
        moonRef.current.rotation.x = newX;

        setRotationY(newY);
        setRotationX(newX);
      }
    }

    if (glowRef.current) {
      glowRef.current.rotation.copy(moonRef.current.rotation);
    }
  });

  return (
    <>
      {/* Main moon sphere */}
      <mesh ref={moonRef} position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.5, 60, 60]} />
        <meshPhongMaterial
          map={texture}
          displacementMap={displacementMap}
          displacementScale={0.06}
          bumpMap={displacementMap}
          bumpScale={0.04}
          shininess={0}
          reflectivity={0}
        />
      </mesh>

      {/* Conditional Glow Effect */}
      {selectedGlow && (
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1.55, 60, 60]} />
          <meshPhongMaterial
            color={selectedOrientation === 'south-up' ? '#f09' : '#ffffff'}
            transparent={true}
            opacity={selectedOrientation === 'south-up' ? 0.4 : 0.12}
            emissive={selectedOrientation === 'south-up' ? '#ffffff' : '#ffffff'}
            emissiveIntensity={selectedOrientation === 'south-up' ? 0.8 : 0.8}
          />
        </mesh>
        

      )}
    </>
  );
};

const Lights: React.FC = () => {
  return (
    <>
      <directionalLight position={[-100, 10, 50]} intensity={1} castShadow />
      <hemisphereLight intensity={0.1} />
    </>
  );
};

const MoonScene: React.FC<MoonSceneProps> = ({ selectedGlow, selectedOrientation, ...props }) => {
  return (
    <div className={styles.canvasContainer}>
      <Canvas shadows camera={{ position: [1, 3, 4], fov: 75 }} style={{ height: '100vh', width: '100vw' }}>
        <Lights />
        <Moon {...props} selectedGlow={selectedGlow} selectedOrientation={selectedOrientation} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};

export default MoonScene;




