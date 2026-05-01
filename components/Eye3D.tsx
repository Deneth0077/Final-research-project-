'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus, Circle, Float, Stars, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function NeuralEnergyEye() {
  const neuralTex = useTexture('/neural-eye.png');
  const groupRef = useRef<THREE.Group>(null);
  const layersRef = useRef<THREE.Group>(null);
  const layer1Ref = useRef<THREE.Mesh>(null);
  const layer2Ref = useRef<THREE.Mesh>(null);
  const layer3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Smooth 3D tracking of the mouse pointer
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (mouse.x * Math.PI) / 3, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (-mouse.y * Math.PI) / 3, 0.08);
    }
    if (layersRef.current) {
      // Gentle breathing/pulsing effect on the neural network
      layersRef.current.position.z = Math.sin(t * 1.5) * 0.05;
    }
    
    // Constant infinite animation: Neural branches constantly swirling and growing
    if (layer1Ref.current) layer1Ref.current.rotation.z += 0.0005; // Slow clockwise
    if (layer2Ref.current) layer2Ref.current.rotation.z -= 0.001;  // Med counter-clockwise
    if (layer3Ref.current) layer3Ref.current.rotation.z += 0.002;  // Fast clockwise
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        
        {/* Main 3D Neural Eye Structure */}
        {/* Centered slightly left and restored to the perfectly balanced size */}
        <group ref={groupRef} position={[1.5, 0, 0]} scale={[1.2, 1.2, 1.2]}>
          
          {/* Pure Black Background Void to absorb any light behind it */}
          <Circle args={[3, 64]} position={[0, 0, -0.5]}>
             <meshBasicMaterial color="#000000" />
          </Circle>

          {/* Layered Parallax Neural Network */}
          <group ref={layersRef}>
            
            {/* Layer 1: Outer glowing aura/branches (Farthest back) */}
            <Circle ref={layer1Ref} args={[3.2, 64]} position={[0, 0, -0.2]}>
              <meshBasicMaterial
                 map={neuralTex}
                 transparent={true}
                 blending={THREE.AdditiveBlending}
                 depthWrite={false}
                 opacity={0.4}
                 color="#0284c7" // Deep blue tint
              />
            </Circle>

            {/* Layer 2: Main Neural Iris (Center) */}
            <Circle ref={layer2Ref} args={[2.5, 64]} position={[0, 0, 0]}>
              <meshBasicMaterial
                 map={neuralTex}
                 transparent={true}
                 blending={THREE.AdditiveBlending}
                 depthWrite={false}
                 color="#ffffff" // Original bright colors
              />
            </Circle>

            {/* Layer 3: Inner energy core (Closest to front) */}
            <Circle ref={layer3Ref} args={[1.8, 64]} position={[0, 0, 0.2]}>
              <meshBasicMaterial
                 map={neuralTex}
                 transparent={true}
                 blending={THREE.AdditiveBlending}
                 depthWrite={false}
                 color="#7dd3fc" // Bright cyan tint
              />
            </Circle>
            
          </group>

          {/* 3D Black Pupil protruding forward */}
          <Sphere args={[0.5, 32, 32]} position={[0, 0, 0.25]} scale={[1, 1, 0.5]}>
             <meshBasicMaterial color="#020617" />
          </Sphere>

          {/* 3D Energy Rings rotating around the eye to enhance the 3D feel */}
          <Torus args={[2.2, 0.005, 16, 100]} position={[0, 0, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
             <meshBasicMaterial color="#0ea5e9" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
          </Torus>
          <Torus args={[2.4, 0.003, 16, 100]} position={[0, 0, -0.1]} rotation={[-Math.PI / 3, Math.PI / 8, 0]}>
             <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
          </Torus>

        </group>

        {/* Dense glowing data particles/synapses */}
        <Sparkles count={400} scale={7} size={2.5} speed={0.8} opacity={0.8} color="#7dd3fc" />
      </Float>
      
      {/* Background Starfield */}
      <Stars radius={50} depth={50} count={1500} factor={3} saturation={0} fade speed={1} />
    </group>
  );
}

export default function Eye3D() {
  return (
    <div className="w-full h-full relative z-10 cursor-move">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1} />
        <NeuralEnergyEye />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.5}
          minPolarAngle={Math.PI / 2 - 0.5}
          maxAzimuthAngle={0.5}
          minAzimuthAngle={-0.5}
        />
      </Canvas>
    </div>
  );
}
