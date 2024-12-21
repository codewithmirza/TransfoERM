import { PDFProcessor } from './PDFProcessor'
import * as XLSX from 'xlsx'
import { FileValidator } from './FileValidator'

interface ProcessingResult {
  text: string
  metadata: {
    pageCount?: number
    wordCount?: number
    charCount?: number
    author?: string
    createdAt?: string
    modifiedAt?: string
  }
}

export class FileProcessor {
  static async processFile(file: File): Promise<ProcessingResult> {
    // Validate file first
    const validationResult = FileValidator.validateFile(file)
    if (!validationResult.isValid) {
      throw new Error(validationResult.error)
    }

    const buffer = await file.arrayBuffer()
    const type = file.type

    if (type.startsWith('text/')) {
      return this.processTextFile(buffer)
    }

    if (type === 'application/pdf') {
      const pdfContent = await PDFProcessor.extractContent(buffer)
      return {
        text: pdfContent.text,
        metadata: {
          pageCount: pdfContent.metadata.pageCount,
          author: pdfContent.metadata.author,
          createdAt: pdfContent.metadata.creationDate?.toISOString(),
          modifiedAt: pdfContent.metadata.modificationDate?.toISOString()
        }
      }
    }

    if (type.includes('spreadsheet') || type.includes('excel')) {
      return this.processSpreadsheetFile(buffer)
    }

    throw new Error(`Unsupported file type: ${type}`)
  }

  private static async processTextFile(buffer: ArrayBuffer): Promise<ProcessingResult> {
    const text = new TextDecoder().decode(buffer)
    return {
      text,
      metadata: {
        charCount: text.length,
        wordCount: text.split(/\s+/).length
      }
    }
  }

  private static async processSpreadsheetFile(buffer: ArrayBuffer): Promise<ProcessingResult> {
    const workbook = XLSX.read(buffer, { type: 'array' })
    let text = ''

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]
      const sheetText = XLSX.utils.sheet_to_txt(sheet)
      text += `Sheet: ${sheetName}\n${sheetText}\n\n`
    }

    return {
      text,
      metadata: {
        charCount: text.length,
        wordCount: text.split(/\s+/).length
      }
    }
  }
} 