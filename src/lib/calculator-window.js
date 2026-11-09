const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
export function fitCalculatorWindow(rect, viewport) {
  const maxWidth = Math.max(1, viewport.width - 16)
  const maxHeight = Math.max(1, viewport.height - 16)
  const width = clamp(Number(rect.width) || 380, Math.min(280, maxWidth), maxWidth)
  const height = clamp(Number(rect.height) || 570, Math.min(350, maxHeight), maxHeight)
  return {
    width, height,
    x: clamp(Number(rect.x) || 0, 8, Math.max(8, viewport.width - width - 8)),
    y: clamp(Number(rect.y) || 0, 8, Math.max(8, viewport.height - height - 8)),
  }
}
