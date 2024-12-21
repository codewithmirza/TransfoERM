import { GlobalWorkerOptions, version } from 'pdfjs-dist'

// Configure the worker
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`

// Initialize PDF.js
import 'pdfjs-dist/build/pdf' 