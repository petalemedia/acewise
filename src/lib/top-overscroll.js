// Keep elastic feedback inside the reading pane, including gestures that begin
// while it is already at scrollTop 0 (where native bounce can be inconsistent).
export function overscrollDistance(pull) {
  return 76 * (1 - Math.exp(-Math.max(0, pull) / 190))
}

export function createTopOverscroll(view = window) {
  let pane = null
  let pull = 0
  let offset = 0
  let target = 0
  let frame = 0
  let releaseTimer = 0

  const draw = () => {
    offset += (target - offset) * (target ? .3 : .18)
    if (Math.abs(target - offset) < .1) offset = target
    pane?.style.setProperty('--top-overscroll', `${offset.toFixed(2)}px`)
    if (offset !== target) frame = view.requestAnimationFrame(draw)
    else {
      frame = 0
      if (!offset) { pane?.style.removeProperty('--top-overscroll'); pane = null }
    }
  }
  const animate = () => { if (!frame) frame = view.requestAnimationFrame(draw) }
  const release = () => {
    view.clearTimeout(releaseTimer)
    pull = 0
    target = 0
    if (pane) animate()
  }

  return {
    handle(path, deltaX, deltaY, touch = false) {
      if (!deltaY || Math.abs(deltaX) > Math.abs(deltaY)) return false
      // A nested textarea or floating menu retains its own scrolling behavior.
      const candidate = path.find(node => node?.nodeType === 1 && node.matches('.notes-main, textarea, .ui-floating-panel, [role="menu"], [role="listbox"], [data-radix-scroll-area-viewport]'))
      if (!candidate?.matches('.notes-main') || candidate.scrollTop > .5) return false
      if (deltaY > 0 && (candidate !== pane || pull <= 0)) return false
      if (view.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
      if (candidate !== pane) {
        pane?.style.removeProperty('--top-overscroll')
        pane = candidate
        pull = offset = 0
      }
      view.clearTimeout(releaseTimer)
      pull = Math.max(0, pull - deltaY)
      target = overscrollDistance(pull)
      animate()
      if (!touch) releaseTimer = view.setTimeout(release, 100)
      return true
    },
    release,
    destroy() {
      view.clearTimeout(releaseTimer)
      view.cancelAnimationFrame(frame)
      pane?.style.removeProperty('--top-overscroll')
    },
  }
}
