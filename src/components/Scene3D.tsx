import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { Mesh } from 'three';
import type { MemoryObject } from '../schemas/validation';

// ==================== ¿QUÉ ES REACT THREE FIBER? ====================
// Es un renderer de React para Three.js
// Permite usar Three.js como componentes de React
// Canvas: contenedor principal de la escena 3D
// mesh: objeto 3D (geometry + material)

// ==================== COMPONENTES DE FORMAS 3D ====================

/**
 * Componente para renderizar una forma 3D específica
 */
interface Shape3DProps {
  shape: 'box' | 'sphere' | 'cone' | 'torus';
  color: string;
  position: [number, number, number];
}

const Shape3D: React.FC<Shape3DProps> = ({ shape, color, position }) => {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh ref={meshRef} position={position}>
      {/* Geometry: forma del objeto */}
      {shape === 'box' && <boxGeometry args={[1, 1, 1]} />}
      {shape === 'sphere' && <sphereGeometry args={[0.6, 32, 32]} />}
      {shape === 'cone' && <coneGeometry args={[0.6, 1.2, 32]} />}
      {shape === 'torus' && <torusGeometry args={[0.5, 0.2, 16, 100]} />}
      
      {/* Material: cómo se ve la superficie */}
      <meshStandardMaterial 
        color={color} 
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================

interface Scene3DProps {
  objects: MemoryObject[];
  gridSize: number;
}

export const Scene3D: React.FC<Scene3DProps> = ({ objects, gridSize }) => {
  
  /**
   * Convierte posición de cuadrícula (row, col) a coordenadas 3D (x, y, z)
   * Ejemplo: row=1, col=1 en cuadrícula 3x3 → x=0, y=0, z=0 (centro)
   */
  const gridToWorldPosition = (row: number, col: number): [number, number, number] => {
    const spacing = 2; // Espacio entre objetos
    const offset = ((gridSize - 1) * spacing) / 2; // Centrar la cuadrícula
    
    return [
      col * spacing - offset,  // x: columna
      0,                        // y: altura fija
      row * spacing - offset    // z: fila
    ];
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas shadows>
        {/* ===== CÁMARA ===== */}
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        
        {/* ===== CONTROLES ===== */}
        {/* Permite rotar la escena con el mouse */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
        />

        {/* ===== LUCES ===== */}
        {/* Luz ambiental: ilumina todo suavemente */}
        <ambientLight intensity={0.5} />
        
        {/* Luz direccional: como el sol, genera sombras */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Luz puntual: luz desde un punto específico */}
        <pointLight position={[-10, 10, -5]} intensity={0.5} />

        {/* ===== OBJETOS 3D ===== */}
        {objects.map(obj => (
          <Shape3D
            key={obj.id}
            shape={obj.shape}
            color={obj.color}
            position={gridToWorldPosition(obj.position.row, obj.position.col)}
          />
        ))}

        {/* ===== PLANO BASE ===== */}
        {/* Piso de la escena para dar contexto espacial */}
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

        {/* ===== GRID HELPER ===== */}
        {/* Cuadrícula de referencia */}
        <gridHelper args={[20, 20, '#444', '#222']} position={[0, -0.99, 0]} />
      </Canvas>
    </div>
  );
};
