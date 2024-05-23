// src/GLBViewer.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={[2,2,2]} />;
}

function GLBViewer({ url }) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]}  />
      <Model url={url} />
      <OrbitControls />
    </Canvas>
  );
}

export default GLBViewer;
