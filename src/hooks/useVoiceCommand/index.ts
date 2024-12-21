'use client'

import { useState, useCallback, useEffect } from 'react'
import { VoiceCommandResult } from '@/types/realtime'

interface UseVoiceCommandProps {
  onResult?: (result: VoiceCommandResult) => void
  language?: string
}

export function useVoiceCommand({ onResult, language = 'en-US' }: UseVoiceCommandProps = {}) {
  // ... rest of the code remains the same
} 