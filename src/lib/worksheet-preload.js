import { worksheets } from '../data/worksheets.js'

const files = new Map()
let preloadTask

// Keep original bytes here: PDF.js transfers its input buffer to the worker,
// so each reader must receive a copy rather than detach the cached buffer.
export function getWorksheetFile(file) {
  const cached = files.get(file)
  return cached ? { data: new Uint8Array(cached.slice(0)) } : file
}
export function preloadWorksheets(workerSrc) {
  if (preloadTask) return preloadTask
  const pdfFiles = new Set(worksheets.map(worksheet => worksheet.file))
  const resources = [...pdfFiles, ...(workerSrc ? [workerSrc] : [])]
  preloadTask = Promise.allSettled(resources.map(async file => {
    try {
      const response = await fetch(file, { cache: 'force-cache' })
      if (!response.ok) return
      const data = await response.arrayBuffer()
      if (pdfFiles.has(file)) files.set(file, data)
    } catch { /* A failed background fetch must not prevent navigation or the reader's normal retry. */ }
  }))
  return preloadTask
}
