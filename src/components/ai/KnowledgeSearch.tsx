'use client'

import { useState } from 'react'
import { useRAG } from '@/hooks/useRAG'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, FileText, Download, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface SearchResult {
  id: string
  metadata: {
    content: string
    title?: string
    fileUrl?: string
    fileName?: string
    fileType?: string
    timestamp: string
  }
  score: number
}

export function KnowledgeSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const { searchKnowledge, loading } = useRAG()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    try {
      const searchResults = await searchKnowledge(query)
      setResults(searchResults)
    } catch (error) {
      console.error('Search Error:', error)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Knowledge Base</h2>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search knowledge base..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </form>

      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">
                  {result.metadata.title || 'Untitled Document'}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(result.metadata.timestamp), 'PPP')}
                </p>
              </div>
              {result.metadata.fileUrl && (
                <a
                  href={result.metadata.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                >
                  <Download className="w-4 h-4" />
                  {result.metadata.fileName}
                </a>
              )}
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                {result.metadata.content.slice(0, 200)}...
              </p>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                Score: {(result.score * 100).toFixed(1)}%
              </span>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
} 