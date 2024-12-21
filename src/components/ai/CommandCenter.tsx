'use client'

import { Mic, Send } from 'lucide-react'

export function CommandCenter() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-700">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700">
            <Mic className="h-6 w-6 text-white" />
          </button>
          <input 
            type="text"
            placeholder="Ask anything..."
            className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
          />
          <button className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700">
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
} 