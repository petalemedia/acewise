export const highlightColors = ['yellow', 'mint', 'blue', 'pink', 'purple']

function record(start, end, color, text, id) {
  return {
    id, start, end, color, text: text.slice(start, end),
    prefix: text.slice(Math.max(0, start - 32), start),
    suffix: text.slice(end, end + 32),
  }
}

// Retain old locally saved annotations, and relocate them by their quote/context
// if lesson text has been edited since the annotation was made.
export function resolveHighlights(saved, text) {
  if (!Array.isArray(saved)) return []
  return saved.flatMap((item, index) => {
    if (!item || typeof item !== 'object') return []
    let { start, end } = item
    const quote = typeof item.text === 'string' ? item.text : ''
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start) return []
    if (quote && text.slice(start, end) !== quote) {
      const context = `${item.prefix || ''}${quote}${item.suffix || ''}`
      const contextual = text.indexOf(context)
      if (contextual !== -1) start = contextual + (item.prefix || '').length
      else {
        const matches = []
        let position = text.indexOf(quote)
        while (position !== -1) {
          matches.push(position)
          position = text.indexOf(quote, position + 1)
        }
        if (!matches.length) return []
        start = matches.reduce((closest, position) => Math.abs(position - item.start) < Math.abs(closest - item.start) ? position : closest)
      }
      end = start + quote.length
    }
    if (end > text.length || !text.slice(start, end).trim()) return []
    const color = item.color === 'green' ? 'mint' : highlightColors.includes(item.color) ? item.color : 'yellow'
    return [record(start, end, color, text, item.id || `legacy-${index}-${item.start}-${item.end}`)]
  })
}

export function createHighlight(start, end, color, text, id) {
  if (!highlightColors.includes(color) || start < 0 || end > text.length || end <= start) return null
  const selected = text.slice(start, end)
  const leading = selected.length - selected.trimStart().length
  const trailing = selected.length - selected.trimEnd().length
  start += leading
  end -= trailing
  if (end <= start) return null
  return record(start, end, color, text, id)
}

// A new selection replaces only the overlapping portion of older highlights.
// Separate annotations remain independently editable/deletable.
export function addHighlight(saved, incoming, text) {
  if (!incoming) return resolveHighlights(saved, text)
  const remaining = resolveHighlights(saved, text).flatMap(existing => {
    if (existing.end <= incoming.start || existing.start >= incoming.end) return [existing]
    const pieces = []
    if (existing.start < incoming.start) pieces.push(record(existing.start, incoming.start, existing.color, text, existing.id))
    if (existing.end > incoming.end) pieces.push(record(incoming.end, existing.end, existing.color, text, pieces.length ? `${existing.id}:after:${incoming.id}` : existing.id))
    return pieces
  })
  return [...remaining, incoming].sort((a, b) => a.start - b.start)
}

export function recolorHighlight(saved, id, color, text) {
  const records = resolveHighlights(saved, text)
  return highlightColors.includes(color) ? records.map(item => item.id === id ? { ...item, color } : item) : records
}

export function deleteHighlight(saved, id, text) {
  return resolveHighlights(saved, text).filter(item => item.id !== id)
}
