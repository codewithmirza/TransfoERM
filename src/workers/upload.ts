import { Env } from '@/types/cloudflare'
import { corsHeaders } from '@/lib/cors'
import { verifyAuth } from '@/lib/auth'
import { FileValidator } from '@/lib/files/FileValidator'
import { FileProcessor } from '@/lib/files/FileProcessor'
import { RAGService } from '@/lib/ai/rag'

export async function handleUploadRequest(request: Request, env: Env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() })
  }

  // Verify authentication
  const authResult = await verifyAuth(request, env)
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      }
    )
  }

  try {
    if (request.method === 'POST') {
      const formData = await request.formData()
      const file = formData.get('file') as File
      const metadata = JSON.parse(formData.get('metadata') as string)

      // Validate file
      const validationResult = FileValidator.validateFile(file)
      if (!validationResult.isValid) {
        throw new Error(validationResult.error)
      }

      // Process file
      const processedFile = await FileProcessor.processFile(file)

      // Store in R2 and Vectorize
      const ragService = new RAGService(env)
      await ragService.addToKnowledgeBase(processedFile.text, {
        ...metadata,
        ...processedFile.metadata,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedBy: authResult.userId,
        uploadedAt: new Date().toISOString()
      })

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      }
    )

  } catch (error) {
    console.error('Upload Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      }
    )
  }
} 