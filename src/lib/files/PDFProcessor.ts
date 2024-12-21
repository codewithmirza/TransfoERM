import { getDocument, PDFDocumentProxy } from 'pdfjs-dist'
import './pdf-worker'

interface PDFMetadata {
  info: {
    Author?: string
    Title?: string
    Keywords?: string
    CreationDate?: string
    ModDate?: string
    [key: string]: string | undefined
  }
}

interface PDFContent {
  text: string
  metadata: {
    pageCount: number
    author?: string
    title?: string
    keywords?: string[]
    creationDate?: Date
    modificationDate?: Date
    pages: Array<{
      pageNumber: number
      text: string
    }>
  }
}

export class PDFProcessor {
  static async extractContent(buffer: ArrayBuffer): Promise<PDFContent> {
    const pdf = await getDocument({ data: buffer }).promise
    const pageCount = pdf.numPages
    const pages = []

    // Extract text from each page
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const text = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      
      pages.push({
        pageNumber: i,
        text
      })
    }

    // Get metadata
    const metadata = await pdf.getMetadata() as unknown as PDFMetadata

    return {
      text: pages.map(p => p.text).join('\n'),
      metadata: {
        pageCount,
        author: metadata.info?.Author,
        title: metadata.info?.Title,
        keywords: metadata.info?.Keywords?.split(',').map(k => k.trim()),
        creationDate: metadata.info?.CreationDate ? new Date(metadata.info.CreationDate) : undefined,
        modificationDate: metadata.info?.ModDate ? new Date(metadata.info.ModDate) : undefined,
        pages
      }
    }
  }
} 