'use client'

import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { useGesture } from '@use-gesture/react'

interface FinanceData {
  date: Date
  value: number
  type: string
}

interface FinanceVisualizationProps {
  data: FinanceData[]
  width?: number
  height?: number
}

export function FinanceVisualization({ 
  data, 
  width = 800, 
  height = 400 
}: FinanceVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Clear previous
    svg.selectAll('*').remove()

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number])
      .range([innerHeight, 0])

    // Create line generator
    const line = d3.line<FinanceData>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))

    // Add axes
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))

    g.append('g')
      .call(d3.axisLeft(yScale))

    // Add line path
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4CAF50')
      .attr('stroke-width', 2)
      .attr('d', line)

    // Add interactive points
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 5)
      .attr('fill', '#4CAF50')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 5)
      })
  }, [data, width, height])

  const bind = useGesture({
    onDrag: ({ movement: [mx, my] }) => {
      // Handle drag interactions
    },
    onPinch: ({ offset: [scale] }) => {
      // Handle zoom interactions
    }
  })

  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        {...bind()}
        style={{ touchAction: 'none' }}
      />
    </motion.div>
  )
} 