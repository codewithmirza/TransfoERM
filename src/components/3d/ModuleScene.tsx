'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import { ModuleData } from '@/types/modules'

interface ModuleSceneProps {
  data: ModuleData[]
  onModuleSelect: (moduleId: string) => void
}

export function ModuleScene({ data, onModuleSelect }: ModuleSceneProps) {
  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <ModuleNodes data={data} onSelect={onModuleSelect} />
      </Canvas>
    </div>
  )
}

function ModuleNodes({ data, onSelect }: { 
  data: ModuleData[]
  onSelect: (id: string) => void 
}) {
  const nodes = data.map((item, index) => {
    const angle = (index / data.length) * Math.PI * 2
    const radius = 5
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    return (
      <motion.group
        key={item.id}
        position={[x, y, 0]}
        whileHover={{ scale: 1.2 }}
        onClick={() => onSelect(item.id)}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={item.metadata.status === 'active' ? '#4CAF50' : '#9E9E9E'} />
        </mesh>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {item.type}
        </Text>
      </motion.group>
    )
  })

  return <>{nodes}</>
} 