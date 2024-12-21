'use client'

import { useState, useEffect } from 'react'
import { RealtimeUpdate } from '@/types/realtime'

interface UseRealtimeUpdatesProps {
  onUpdate?: (update: RealtimeUpdate) => void
}

export function useRealtimeUpdates({ onUpdate }: UseRealtimeUpdatesProps = {}) {
  // ... rest of the code remains the same
} 