'use client'

import { useState, useRef } from 'react'
import { useRAG } from '@/hooks/useRAG'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Upload, File, X, Loader2 } from 'lucide-react'

const ALLOWED_TYPES = [
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface FileUploadProps {
  onUploadComplete?: () => void
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addFile, loading } = useRAG()

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'File type not supported'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit'
    }
    return null
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter(file => !validateFile(file))
    setFiles(prev => [...prev, ...validFiles])
    e.target.value = '' // Reset input
  }

  const handleUpload = async () => {
    setProgress(0)
    const total = files.length

    for (let i = 0; i < files.length; i++) {
      try {
        await addFile(files[i], {
          type: 'document',
          uploadedAt: new Date().toISOString()
        })
        setProgress(((i + 1) / total) * 100)
      } catch (error) {
        console.error(`Failed to upload ${files[i].name}:`, error)
      }
    }

    setFiles([])
    onUploadComplete?.()
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600">
            Click or drag files to upload
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supported formats: TXT, MD, CSV, PDF, XLSX
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleFileSelect}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {progress > 0 && progress < 100 && (
          <Progress value={progress} className="w-full" />
        )}

        <Button
          className="w-full"
          disabled={files.length === 0 || loading}
          onClick={handleUpload}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload {files.length} file{files.length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </Card>
  )
} 