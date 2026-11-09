// Only these inner surfaces can consume a scroll gesture on the notes route.
const scrollSurfaces = '.notes-main, .organic-table-scroll, .organic-equation, .worksheet-strip, .worksheet-document, .revision-scroll, .genie-messages, .ui-floating-panel, .quiz-dialog, .teaching-dialog, .highlight-list, .saved-highlights-dialog, textarea, [role="menu"], [data-radix-scroll-area-viewport], [data-radix-select-viewport]'

export function canScrollPath(path, deltaX, deltaY) {
  const vertical = Math.abs(deltaY) >= Math.abs(deltaX)
  const delta = vertical ? deltaY : deltaX
  if (!delta) return false

  return path.some(node => {
    if (node?.nodeType !== 1 || !node.matches(scrollSurfaces)) return false
    // Trackpads include vertical noise during a sideways gesture. The worksheet
    // strip can still consume its horizontal component without being blocked.
    const horizontalSurface = node.matches('.worksheet-strip, .worksheet-document, .organic-table-scroll, .organic-equation')
    const nodeVertical = horizontalSurface ? false : vertical
    const nodeDelta = horizontalSurface ? deltaX : delta
    if (!nodeDelta) return false
    const position = nodeVertical ? node.scrollTop : node.scrollLeft
    const maximum = nodeVertical
      ? node.scrollHeight - node.clientHeight
      : node.scrollWidth - node.clientWidth
    if (maximum <= 0) return false
    return nodeDelta < 0 ? position > 0 : position < maximum - 1
  })
}
