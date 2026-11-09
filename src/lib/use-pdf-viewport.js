import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export const minimumPdfZoom = .5
export const maximumPdfZoom = 3
export const clampPdfZoom = value => Math.min(maximumPdfZoom, Math.max(minimumPdfZoom, value))

// Keep the point being inspected in place while the PDF changes scale.
export function usePdfViewport({ viewport, scrollPane, zoom, setZoom, width }) {
  const currentZoom = useRef(zoom)
  const anchor = useRef(null)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [panning, setPanning] = useState(false)

  const zoomTo = useCallback((value, point) => {
    const next = clampPdfZoom(value)
    const root = viewport.current
    const pane = scrollPane.current
    if (!root || !pane || next === currentZoom.current) return
    const rect = root.getBoundingClientRect()
    const paneRect = pane.getBoundingClientRect()
    const x = point?.x ?? rect.left + root.clientWidth / 2
    const y = point?.y ?? (Math.max(rect.top, paneRect.top) + Math.min(rect.bottom, paneRect.bottom)) / 2
    const frames = [...root.querySelectorAll('[data-pdf-page]')]
    const page = frames.find(frame => frame.getBoundingClientRect().bottom >= y) || frames.at(-1)
    if (page) {
      const bounds = page.getBoundingClientRect()
      anchor.current = {
        page, x, y,
        fractionX: (x - bounds.left) / Math.max(1, bounds.width),
        fractionY: (y - bounds.top) / Math.max(1, bounds.height),
      }
    }
    currentZoom.current = next
    setZoom(next)
  }, [viewport, scrollPane, setZoom])

  useLayoutEffect(() => {
    currentZoom.current = zoom
    const saved = anchor.current
    const root = viewport.current
    const pane = scrollPane.current
    if (!saved || !root || !pane) return
    const rect = saved.page.getBoundingClientRect()
    root.scrollLeft += rect.left + saved.fractionX * rect.width - saved.x
    pane.scrollTo({ top: pane.scrollTop + rect.top + saved.fractionY * rect.height - saved.y, behavior: 'instant' })
    anchor.current = null
  }, [zoom, width, viewport, scrollPane])

  useEffect(() => {
    const root = viewport.current
    const pane = scrollPane.current
    if (!root || !pane) return
    let hovered = false
    let space = false
    let drag = null
    let gestureZoom = null
    let suppressClickUntil = 0
    const editable = target => target?.closest?.('input, textarea, select, button, a, [contenteditable="true"], [role="combobox"]')
    const onWheel = event => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      if (gestureZoom !== null) return
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? root.clientWidth : 1)
      zoomTo(currentZoom.current * Math.exp(-pixels * .008), { x: event.clientX, y: event.clientY })
    }
    const onGestureStart = event => {
      event.preventDefault()
      gestureZoom = currentZoom.current
    }
    const onGestureChange = event => {
      event.preventDefault()
      if (gestureZoom === null) return
      const point = event.clientX || event.clientY ? { x: event.clientX, y: event.clientY } : undefined
      zoomTo(gestureZoom * event.scale, point)
    }
    const onGestureEnd = event => { event.preventDefault(); gestureZoom = null }
    const onEnter = () => { hovered = true }
    const onLeave = () => { hovered = false }
    const onKeyDown = event => {
      if (event.code !== 'Space' || editable(event.target) || !(hovered || root.contains(document.activeElement))) return
      event.preventDefault()
      space = true
      setSpaceHeld(true)
    }
    const onKeyUp = event => { if (event.code === 'Space') { space = false; setSpaceHeld(false) } }
    const onPointerDown = event => {
      if (!(event.button === 1 || event.button === 0 && space)) return
      event.preventDefault()
      event.stopPropagation()
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: root.scrollLeft, top: pane.scrollTop }
      root.setPointerCapture(event.pointerId)
      setPanning(true)
    }
    const onPointerMove = event => {
      if (!drag || event.pointerId !== drag.id) return
      event.preventDefault()
      event.stopPropagation()
      root.scrollLeft = drag.left - (event.clientX - drag.x)
      pane.scrollTo({ top: drag.top - (event.clientY - drag.y), behavior: 'instant' })
    }
    const endDrag = event => {
      if (!drag || event.pointerId !== drag.id) return
      event.preventDefault()
      event.stopPropagation()
      if (root.hasPointerCapture(drag.id)) root.releasePointerCapture(drag.id)
      drag = null
      suppressClickUntil = performance.now() + 300
      setPanning(false)
    }
    const onClick = event => {
      if (performance.now() >= suppressClickUntil) return
      event.preventDefault()
      event.stopPropagation()
    }
    const reset = () => {
      space = false
      if (drag && root.hasPointerCapture(drag.id)) root.releasePointerCapture(drag.id)
      drag = null
      setSpaceHeld(false)
      setPanning(false)
    }
    const nonPassive = { passive: false }
    root.addEventListener('wheel', onWheel, nonPassive)
    root.addEventListener('gesturestart', onGestureStart, nonPassive)
    root.addEventListener('gesturechange', onGestureChange, nonPassive)
    root.addEventListener('gestureend', onGestureEnd, nonPassive)
    root.addEventListener('pointerenter', onEnter)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointerdown', onPointerDown, true)
    root.addEventListener('pointermove', onPointerMove, true)
    root.addEventListener('pointerup', endDrag, true)
    root.addEventListener('pointercancel', endDrag, true)
    root.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', reset)
    return () => {
      if (drag && root.hasPointerCapture(drag.id)) root.releasePointerCapture(drag.id)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('gesturestart', onGestureStart)
      root.removeEventListener('gesturechange', onGestureChange)
      root.removeEventListener('gestureend', onGestureEnd)
      root.removeEventListener('pointerenter', onEnter)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointerdown', onPointerDown, true)
      root.removeEventListener('pointermove', onPointerMove, true)
      root.removeEventListener('pointerup', endDrag, true)
      root.removeEventListener('pointercancel', endDrag, true)
      root.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', reset)
    }
  }, [viewport, scrollPane, zoomTo])

  return { zoomTo, spaceHeld, panning }
}
