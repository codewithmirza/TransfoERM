'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KnowledgeBase } from './KnowledgeBase'
import { KnowledgeSearch } from './KnowledgeSearch'
import { FileUpload } from './FileUpload'
import { AIChat } from './AIChat'

export function KnowledgeBaseDashboard() {
  const [activeTab, setActiveTab] = useState('search')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleContentAdded = () => {
    setRefreshTrigger(prev => prev + 1)
    setActiveTab('search')
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="add">Add Content</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="search">
            <KnowledgeSearch key={refreshTrigger} />
          </TabsContent>

          <TabsContent value="add">
            <KnowledgeBase onAdd={handleContentAdded} />
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload onUploadComplete={handleContentAdded} />
          </TabsContent>

          <TabsContent value="chat">
            <AIChat />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
} 