'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileUploadProps {
  onUpload?: (file: File) => Promise<void>
  path: string
}

export function FileUpload({ onUpload, path }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', `${path}/${file.name}`)

      const response = await fetch('/api/storage', {
        method: 'POST',
        body: formData,
      })

      interface UploadResponse {
        url: string
        error?: string
      }

      const data = (await response.json()) as UploadResponse
      if (!response.ok) throw new Error(data.error)

      onUpload?.(file)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <label htmlFor="file-upload">
        <Button 
          variant="outline" 
          className="cursor-pointer" 
          disabled={isUploading}
        >
          <span>
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload File
          </span>
        </Button>
      </label>
    </div>
  )
}
