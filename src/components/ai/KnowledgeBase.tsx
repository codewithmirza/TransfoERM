'use client'

import { useState } from 'react'
import { useRAG } from '@/hooks/useRAG'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface KnowledgeBaseProps {
  onAdd?: () => void
}

export function KnowledgeBase({ onAdd }: KnowledgeBaseProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const { addToKnowledgeBase, loading } = useRAG()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || loading) return

    try {
      await addToKnowledgeBase(content, {
        title,
        tags,
        type: 'document'
      })

      setTitle('')
      setContent('')
      setTags([])
      onAdd?.()

      toast({
        title: 'Success',
        description: 'Document added to knowledge base'
      })
    } catch (error) {
      console.error('Knowledge Base Error:', error)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add to Knowledge Base</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            disabled={loading}
          />
        </div>

        <div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Document Content"
            rows={6}
            disabled={loading}
          />
        </div>

        <div>
          <Input
            placeholder="Add tags (comma separated)"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const newTags = e.currentTarget.value.split(',').map(t => t.trim())
                setTags(prev => [...prev, ...newTags])
                e.currentTarget.value = ''
              }
            }}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                onClick={() => setTags(prev => prev.filter((_, i) => i !== index))}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Add to Knowledge Base
        </Button>
      </form>
    </Card>
  )
} 