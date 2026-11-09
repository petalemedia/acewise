// Provenance is explicit. An authored practice question must never be given
// an exam-paper link unless that paper, question number and page are verified.
export function questionSourceUrl(question) {
  const source = question.source
  if (!source || !Number.isInteger(source.page) || source.page < 1 || !Number.isInteger(source.questionNumber) || source.questionNumber < 1) return null
  try {
    if (/^\/past-papers\/[a-zA-Z0-9_-]+\.pdf$/.test(source.pdfUrl)) return `${source.pdfUrl}#page=${source.page}&zoom=page-width`
    const url = new URL(source.pdfUrl)
    if (!['https:', 'http:'].includes(url.protocol) || !url.pathname.toLowerCase().endsWith('.pdf')) return null
    url.hash = `page=${source.page}&zoom=page-width`
    return url.href
  } catch { return null }
}
