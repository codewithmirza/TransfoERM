'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Line, Html } from '@react-three/drei'
import { cn } from "@/lib/utils"

interface FinanceData {
  revenue: number[]
  expenses: number[]
  cashFlow: number[]
  projections: number[]
}

interface Finance3DSpaceProps {
  data: FinanceData
  isExpanded: boolean
}

export function Finance3DSpace({ data, isExpanded }: Finance3DSpaceProps) {
  return (
    <motion.div
      className={cn(
        "relative w-full rounded-xl overflow-hidden",
        "bg-black/40 backdrop-blur-xl border border-white/10",
        isExpanded ? "h-[600px]" : "h-[300px]"
      )}
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls 
          enableZoom={isExpanded}
          enablePan={isExpanded}
          maxDistance={30}
          minDistance={10}
        />
        
        {/* Grid Helper */}
        <gridHelper 
          args={[30, 30, '#1a365d', '#1a365d']}
          position={[0, -5, 0]}
          rotation={[0, 0, 0]}
        />

        {/* Revenue Tower */}
        <RevenueTower 
          data={data.revenue}
          position={[-5, -5, 0]}
          color="#3b82f6"
        />

        {/* Expenses Tower */}
        <ExpensesTower 
          data={data.expenses}
          position={[5, -5, 0]}
          color="#ef4444"
        />

        {/* Cash Flow Stream */}
        <CashFlowStream 
          data={data.cashFlow}
          position={[0, 0, 0]}
          color="#10b981"
        />

        {/* Projections */}
        <ProjectionLines 
          data={data.projections}
          position={[0, 5, 0]}
          color="#8b5cf6"
        />

        {/* Labels */}
        <Html position={[-5, -7, 0]}>
          <div className="text-blue-400 text-sm">Revenue</div>
        </Html>
        <Html position={[5, -7, 0]}>
          <div className="text-red-400 text-sm">Expenses</div>
        </Html>
      </Canvas>

      {/* Controls Overlay */}
      {isExpanded && (
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex justify-between items-center bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="flex gap-4">
              <button className="text-sm text-white/60 hover:text-white/90 transition-colors">
                Revenue View
              </button>
              <button className="text-sm text-white/60 hover:text-white/90 transition-colors">
                Cash Flow View
              </button>
              <button className="text-sm text-white/60 hover:text-white/90 transition-colors">
                Projections
              </button>
            </div>
            <div className="text-sm text-white/60">
              Drag to rotate • Scroll to zoom
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Revenue Tower Component
function RevenueTower({ data, position, color }: any) {
  const mesh = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    mesh.current.rotation.y += 0.01
  })

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[2, data[data.length - 1] / 10, 2]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.7}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

// Expenses Tower Component
function ExpensesTower({ data, position, color }: any) {
  const mesh = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    mesh.current.rotation.y -= 0.01
  })

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[2, data[data.length - 1] / 10, 2]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.7}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

// Cash Flow Stream Component
function CashFlowStream({ data, position, color }: any) {
  const points = data.map((value: number, i: number) => 
    new THREE.Vector3(
      Math.sin(i * 0.2) * 5,
      i - data.length / 2,
      Math.cos(i * 0.2) * 5
    )
  )

  return (
    <Line
      points={points}
      color={color}
      lineWidth={2}
      dashed={false}
    />
  )
}

// Projection Lines Component
function ProjectionLines({ data, position, color }: any) {
  const points = data.map((value: number, i: number) => 
    new THREE.Vector3(
      i - data.length / 2,
      value / 10,
      0
    )
  )

  return (
    <Line
      points={points}
      color={color}
      lineWidth={2}
      dashed={true}
    />
  )
} 