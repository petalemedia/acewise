import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { addHighlight, createHighlight, deleteHighlight, highlightColors, recolorHighlight, resolveHighlights } from './note-highlights'

function textNodes(root) {
  const nodes = []
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node
  let offset = 0
  while ((node = walker.nextNode())) {
    nodes.push({ node, start: offset, end: offset + node.length, excluded: Boolean(node.parentElement?.closest('svg')) })
    offset += node.length
  }
  return nodes
}

function rangeFor(item, nodes) {
  const start = nodes.find(node => item.start >= node.start && item.start < node.end)
  const end = nodes.find(node => item.end > node.start && item.end <= node.end)
  if (!start || !end) return null
  const range = start.node.ownerDocument.createRange()
  range.setStart(start.node, item.start - start.start)
  range.setEnd(end.node, item.end - end.start)
  return range
}

export function useNoteHighlights({ article, scrollPane, highlights, setHighlights, color, selection, contentVersion = 0 }) {
  const [mode, setMode] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [records, setRecords] = useState([])
  const [hovered, setHovered] = useState(null)
  const rendered = useRef([])
  const anchor = useRef(null)
  const dragging = useRef(false)
  const ignoreClickUntil = useRef(0)

  useLayoutEffect(() => {
    const root = article.current
    if (!root) return
    const items = resolveHighlights(highlights, root.textContent)
    const nodes = textNodes(root)
    rendered.current = items.flatMap(item => {
      const range = rangeFor(item, nodes)
      const fragments = nodes.filter(node => !node.excluded && node.end > item.start && node.start < item.end).map(node => rangeFor({ start: Math.max(item.start, node.start), end: Math.min(item.end, node.end) }, [node])).filter(Boolean)
      return range ? [{ ...item, range, fragments }] : []
    })
    setRecords(items)
    if (window.CSS?.highlights && window.Highlight) {
      for (const name of highlightColors) {
        CSS.highlights.set(name, new Highlight(...rendered.current.filter(item => item.color === name).flatMap(item => item.fragments)))
      }
    }
    return () => {
      for (const name of highlightColors) window.CSS?.highlights?.delete(name)
    }
  }, [article, highlights, contentVersion])

  const readSelection = useCallback(() => {
    const root = article.current
    const selected = window.getSelection()
    if (!root || !selected?.rangeCount || selected.isCollapsed) return null
    const range = selected.getRangeAt(0)
    if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null
    if (range.startContainer.parentElement?.closest('svg') || range.endContainer.parentElement?.closest('svg')) return null
    const before = range.cloneRange()
    before.selectNodeContents(root)
    before.setEnd(range.startContainer, range.startOffset)
    const start = before.toString().length
    const result = { start, end: start + range.toString().length, text: range.toString() }
    if (!result.text.trim()) return null
    selection.current = result
    return result
  }, [article, selection])

  const saveSelection = useCallback(() => {
    const selected = readSelection()
    if (!selected) return false
    const text = article.current.textContent
    const incoming = createHighlight(selected.start, selected.end, color, text, crypto.randomUUID())
    if (!incoming) return false
    setHighlights(saved => addHighlight(saved, incoming, text))
    setEditingId(null)
    setHovered(null)
    ignoreClickUntil.current = performance.now() + 300
    window.getSelection()?.removeAllRanges()
    return true
  }, [article, color, readSelection, setHighlights])

  useEffect(() => {
    let timer
    let frame
    const onSelectionChange = () => {
      clearTimeout(timer)
      readSelection()
      if (mode && !dragging.current) timer = setTimeout(saveSelection, 350)
    }
    const onPointerDown = event => {
      dragging.current = article.current?.contains(event.target) && !event.target.closest('button, a, input, textarea, select')
      clearTimeout(timer)
    }
    const onPointerUp = () => {
      const wasDragging = dragging.current
      dragging.current = false
      if (!wasDragging) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => { if (mode) saveSelection(); else readSelection() })
    }
    const onPointerCancel = () => { dragging.current = false; clearTimeout(timer) }
    const onKeyDown = event => {
      if (event.key === 'Shift') dragging.current = true
      if (event.key === 'Escape') { setMode(false); setEditingId(null) }
    }
    const onKeyUp = event => {
      if (event.key === 'Shift') {
        dragging.current = false
        if (mode) saveSelection()
      }
    }
    document.addEventListener('selectionchange', onSelectionChange)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('pointercancel', onPointerCancel)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
      document.removeEventListener('selectionchange', onSelectionChange)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('pointercancel', onPointerCancel)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [article, mode, readSelection, saveSelection])

  useEffect(() => {
    const pane = scrollPane.current
    const close = () => { setEditingId(null); setHovered(null) }
    pane?.addEventListener('scroll', close, { passive: true })
    return () => pane?.removeEventListener('scroll', close)
  }, [scrollPane])

  const hitTest = useCallback((x, y) => {
    for (const item of [...rendered.current].reverse()) {
      const rects = item.fragments.flatMap(fragment => [...fragment.getClientRects()])
      const index = rects.findIndex(rect => rect.width && rect.height && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)
      if (index !== -1) return { item, index }
    }
    return null
  }, [])

  const openEditor = useCallback((id, rectIndex = 0) => {
    const item = rendered.current.find(item => item.id === id)
    if (!item) return
    anchor.current = {
      contextElement: article.current,
      getBoundingClientRect: () => {
        const current = rendered.current.find(item => item.id === id)
        return current?.fragments.flatMap(fragment => [...fragment.getClientRects()])[rectIndex] || current?.range.getBoundingClientRect() || new DOMRect()
      },
    }
    setEditingId(id)
  }, [article])

  const onPointerMove = useCallback(event => {
    if (event.pointerType === 'touch' || dragging.current) return
    setHovered(hitTest(event.clientX, event.clientY)?.item.id || null)
  }, [hitTest])

  const onClick = useCallback(event => {
    if (performance.now() < ignoreClickUntil.current || !window.getSelection()?.isCollapsed) return
    if (event.target.closest('button, a, input, textarea, select')) return
    const hit = hitTest(event.clientX, event.clientY)
    if (hit) openEditor(hit.item.id, hit.index)
  }, [hitTest, openEditor])

  const toggleMode = () => {
    setMode(!mode)
    setEditingId(null)
    if (!mode) saveSelection()
  }
  const recolor = nextColor => {
    const text = article.current.textContent
    setHighlights(saved => recolorHighlight(saved, editingId, nextColor, text))
  }
  const remove = id => {
    const text = article.current.textContent
    setHighlights(saved => deleteHighlight(saved, id || editingId, text))
    setEditingId(null)
    setHovered(null)
  }
  const revisit = id => {
    const item = rendered.current.find(item => item.id === id)
    const pane = scrollPane.current
    if (!item || !pane) return
    const rect = item.range.getBoundingClientRect()
    pane.scrollTo({ top: pane.scrollTop + rect.top - pane.getBoundingClientRect().top - 40, behavior: 'instant' })
    requestAnimationFrame(() => openEditor(id))
  }

  return {
    mode, toggleMode, records, anchor,
    editing: records.find(item => item.id === editingId) || null,
    closeEditor: () => setEditingId(null), recolor, remove, revisit,
    articleProps: { onPointerMove, onPointerLeave: () => setHovered(null), onClick, style: { cursor: hovered ? 'pointer' : 'text' } },
  }
}
