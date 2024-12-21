import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'
import { ModuleRenderer } from '../modules/ModuleRenderer'
import { AIAssistant } from '../ai/AIAssistant'
import { Analytics } from '../analytics/Analytics'

export function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MainContent>
        <ModuleRenderer />
        <AIAssistant />
        <Analytics />
      </MainContent>
    </div>
  )
} 