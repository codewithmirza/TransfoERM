'use client'

import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import * as d3 from 'd3'

interface SalesDeal {
  id: string
  stage: string
  value: number
  probability: number
  expectedCloseDate: Date
  customerName: string
}

interface SalesVisualizationProps {
  data: SalesDeal[]
}

export function SalesVisualization({ data }: SalesVisualizationProps) {
  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <SalesFunnel data={data} />
      </Canvas>
    </div>
  )
}

function SalesFunnel({ data }: { data: SalesDeal[] }) {
  const stages = d3.group(data, d => d.stage)
  const totalValue = d3.sum(data, d => d.value)
  const maxStageValue = d3.max(Array.from(stages.values()), deals => 
    d3.sum(deals, d => d.value)
  ) || 0
  
  return (
    <group position={[0, 0, 0]}>
      {Array.from(stages).map(([stage, deals], i) => {
        const stageValue = d3.sum(deals, d => d.value)
        const height = 1
        const topWidth = 5 * (1 - i / stages.size)
        const bottomWidth = 5 * (1 - (i + 1) / stages.size)
        const y = -i * height
        
        return (
          <motion.group
            key={stage}
            position={[0, y, 0]}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <FunnelStage
              topWidth={topWidth}
              bottomWidth={bottomWidth}
              height={height}
              value={stageValue}
              totalValue={totalValue}
              deals={deals}
              stage={stage}
            />
          </motion.group>
        )
      })}
    </group>
  )
}

function FunnelStage({ 
  topWidth,
  bottomWidth,
  height,
  value,
  totalValue,
  deals,
  stage
}: { 
  topWidth: number
  bottomWidth: number
  height: number
  value: number
  totalValue: number
  deals: SalesDeal[]
  stage: string
}) {
  const percentage = (value / totalValue) * 100

  return (
    <group>
      {/* Funnel section */}
      <mesh>
        <cylinderGeometry 
          args={[topWidth / 2, bottomWidth / 2, height, 32]} 
        />
        <meshStandardMaterial 
          color={getStageColor(percentage)}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Stage label */}
      <Text
        position={[topWidth / 2 + 1, 0, 0]}
        fontSize={0.3}
        color="white"
        anchorX="left"
      >
        {`${stage} ($${value.toLocaleString()})`}
      </Text>

      {/* Percentage */}
      <Text
        position={[-topWidth / 2 - 1, 0, 0]}
        fontSize={0.3}
        color="white"
        anchorX="right"
      >
        {`${percentage.toFixed(1)}%`}
      </Text>

      {/* Deal markers */}
      {deals.map((deal, i) => (
        <motion.group
          key={deal.id}
          position={[
            (Math.random() - 0.5) * topWidth * 0.8,
            0,
            (Math.random() - 0.5) * topWidth * 0.8
          ]}
          whileHover={{ scale: 1.2 }}
        >
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial 
              color={getDealColor(deal.probability)} 
            />
          </mesh>
        </motion.group>
      ))}
    </group>
  )
}

function getStageColor(percentage: number): string {
  return d3.interpolateViridis(percentage / 100)
}

function getDealColor(probability: number): string {
  if (probability >= 0.8) return '#4CAF50'
  if (probability >= 0.5) return '#FFC107'
  return '#F44336'
} 