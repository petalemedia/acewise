import { useLayoutEffect } from 'react'
import { canScrollPath } from './scroll-boundary'

export function useNotesScrollLock() {
  useLayoutEffect(() => {
    const root = document.documentElement
    const alreadyLocked = root.classList.contains('notes-page')
    root.classList.add('notes-page')
    let touch = null

    // These listeners must be native and non-passive: a React wheel handler
    // alone cannot cancel Safari's document scrolling / rubber-band gesture.
    const onWheel = event => {
      if (event.ctrlKey) return // Preserve trackpad pinch-to-zoom.
      const deltaX = event.shiftKey ? event.deltaX || event.deltaY : event.deltaX
      const deltaY = event.shiftKey ? 0 : event.deltaY
      if (!canScrollPath(event.composedPath(), deltaX, deltaY)) {
        if (event.cancelable) event.preventDefault()
      }
    }
    const onTouchStart = event => {
      touch = event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
        : null
    }
    const onTouchMove = event => {
      if (!touch || event.touches.length !== 1) return
      const current = event.touches[0]
      const deltaX = touch.x - current.clientX
      const deltaY = touch.y - current.clientY
      touch = { x: current.clientX, y: current.clientY }
      if (!canScrollPath(event.composedPath(), deltaX, deltaY)) {
        if (event.cancelable) event.preventDefault()
      }
    }
    const onTouchEnd = () => { touch = null }
    const capture = { capture: true, passive: false }
    const passiveCapture = { capture: true, passive: true }
    document.addEventListener('wheel', onWheel, capture)
    document.addEventListener('touchstart', onTouchStart, passiveCapture)
    document.addEventListener('touchmove', onTouchMove, capture)
    document.addEventListener('touchend', onTouchEnd, passiveCapture)
    document.addEventListener('touchcancel', onTouchEnd, passiveCapture)

    return () => {
      document.removeEventListener('wheel', onWheel, true)
      document.removeEventListener('touchstart', onTouchStart, true)
      document.removeEventListener('touchmove', onTouchMove, true)
      document.removeEventListener('touchend', onTouchEnd, true)
      document.removeEventListener('touchcancel', onTouchEnd, true)
      if (!alreadyLocked) root.classList.remove('notes-page')
    }
  }, [])
}
