import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { Mesh } from 'three';
import type { MemoryObject } from '../schemas/validation';

interface Shape3DProps {
  shape: 'box' | 'sphere' | 'cone' | 'torus';
  color: string;
  position: [number, number, number];
}

const Shape3D: React.FC<Shape3DProps> = ({ shape, color, position }) => {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh ref={meshRef} position={position}>
      {shape === 'box' && <boxGeometry args={[1, 1, 1]} />}
      {shape === 'sphere' && <sphereGeometry args={[0.6, 32, 32]} />}
      {shape === 'cone' && <coneGeometry args={[0.6, 1.2, 32]} />}
      {shape === 'torus' && <torusGeometry args={[0.5, 0.2, 16, 100]} />}
      
      <meshStandardMaterial 
        color={color} 
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
};

interface Scene3DProps {
  objects: MemoryObject[];
  gridSize: number;
}

export const Scene3D: React.FC<Scene3DProps> = ({ objects, gridSize }) => {
  
  const gridToWorldPosition = (row: number, col: number): [number, number, number] => {
    const spacing = 2;
    const offset = ((gridSize - 1) * spacing) / 2;
    
    return [
      col * spacing - offset,
      0, 
      row * spacing - offset
    ];
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
        />

        <ambientLight intensity={0.5} />
        
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        <pointLight position={[-10, 10, -5]} intensity={0.5} />

        {objects.map(obj => (
          <Shape3D
            key={obj.id}
            shape={obj.shape}
            color={obj.color}
            position={gridToWorldPosition(obj.position.row, obj.position.col)}
          />
        ))}

        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -1, 0]} 
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        <gridHelper args={[20, 20, '#444', '#222']} position={[0, -0.99, 0]} />
      </Canvas>
    </div>
  );
};
