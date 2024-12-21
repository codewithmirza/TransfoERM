export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface FileValidationOptions {
  maxSize?: number
  allowedTypes?: string[]
  maxFiles?: number
}

export class FileValidator {
  static readonly DEFAULT_MAX_SIZE = 10 * 1024 * 1024 // 10MB
  static readonly DEFAULT_ALLOWED_TYPES = [
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  static validateFile(file: File, options: FileValidationOptions = {}): ValidationResult {
    const {
      maxSize = this.DEFAULT_MAX_SIZE,
      allowedTypes = this.DEFAULT_ALLOWED_TYPES
    } = options

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`
      }
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size ${file.size} bytes exceeds maximum size of ${maxSize} bytes`
      }
    }

    return { isValid: true }
  }

  static validateFiles(files: File[], options: FileValidationOptions = {}): ValidationResult {
    const { maxFiles = 10 } = options

    if (files.length > maxFiles) {
      return {
        isValid: false,
        error: `Number of files (${files.length}) exceeds maximum allowed (${maxFiles})`
      }
    }

    for (const file of files) {
      const result = this.validateFile(file, options)
      if (!result.isValid) {
        return result
      }
    }

    return { isValid: true }
  }
} 