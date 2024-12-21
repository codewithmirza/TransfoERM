'use client'

import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import * as d3 from 'd3'

interface Employee {
  id: string
  name: string
  position: string
  department: string
  performance: number
  team: string[]
}

interface HRVisualizationProps {
  data: Employee[]
}

export function HRVisualization({ data }: HRVisualizationProps) {
  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [0, 0, 20] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <OrganizationChart data={data} />
      </Canvas>
    </div>
  )
}

function OrganizationChart({ data }: { data: Employee[] }) {
  const departments = d3.group(data, d => d.department)
  const radius = 10
  
  return (
    <group>
      {Array.from(departments).map(([dept, employees], i) => {
        const angle = (i / departments.size) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <motion.group 
            key={dept}
            position={[x, 0, z]}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Text
              position={[0, 2, 0]}
              fontSize={0.8}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {dept}
            </Text>
            <EmployeeNodes 
              employees={employees} 
              departmentPosition={[x, 0, z]} 
            />
          </motion.group>
        )
      })}
    </group>
  )
}

function EmployeeNodes({ 
  employees, 
  departmentPosition 
}: { 
  employees: Employee[]
  departmentPosition: [number, number, number]
}) {
  return (
    <group>
      {employees.map((employee, i) => {
        const angle = (i / employees.length) * Math.PI * 2
        const radius = 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <motion.group
            key={employee.id}
            position={[x, 0, z]}
            whileHover={{ scale: 1.2 }}
          >
            <mesh>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial 
                color={getPerformanceColor(employee.performance)} 
              />
            </mesh>
            <Text
              position={[0, 0.8, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {employee.name}
            </Text>
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.2}
              color="gray"
              anchorX="center"
              anchorY="middle"
            >
              {employee.position}
            </Text>
          </motion.group>
        )
      })}
    </group>
  )
}

function getPerformanceColor(performance: number): string {
  if (performance >= 0.8) return '#4CAF50'
  if (performance >= 0.6) return '#FFC107'
  return '#F44336'
} 