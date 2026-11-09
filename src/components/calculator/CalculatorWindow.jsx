import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Calculator, GripHorizontal, RotateCcw, X } from 'lucide-react'
import { useLocalStorage } from '@/lib/use-local-storage'
import { fitCalculatorWindow } from '@/lib/calculator-window'

const CalculatorContext = createContext(null)
const viewport = () => ({ width: window.innerWidth, height: window.innerHeight })

function FloatingCalculator({ open, onOpenChange, trigger }) {
  const [stored, setStored] = useLocalStorage('study-calculator-window', { width: 380, height: 570, x: 960, y: 92 })
  const [rect, setRect] = useState(stored)
  const rectRef = useRef(stored)
  const gesture = useRef(null)
  const [interacting, setInteracting] = useState(false)
  const frame = useRef(null)
  const apply = useCallback(next => { rectRef.current = next; setRect(next) }, [])

  useEffect(() => {
    if (!open) return
    const resize = () => { const next = fitCalculatorWindow(rectRef.current, viewport()); apply(next); setStored(next) }
    const initial = fitCalculatorWindow(stored, viewport())
    apply(initial)
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [open, apply, setStored])

  const start = (event, mode) => {
    if (event.button !== 0) return
    event.preventDefault()
    event.currentTarget.focus()
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = { mode, x: event.clientX, y: event.clientY, rect: rectRef.current }
    setInteracting(true)
  }
  const move = event => {
    if (!gesture.current) return
    const { mode, x, y, rect: initial } = gesture.current
    const dx = event.clientX - x
    const dy = event.clientY - y
    apply(fitCalculatorWindow(mode === 'move'
      ? { ...initial, x: initial.x + dx, y: initial.y + dy }
      : { ...initial, width: initial.width + dx, height: initial.height + dy }, viewport()))
  }
  const end = () => {
    if (!gesture.current) return
    gesture.current = null
    setInteracting(false)
    setStored(rectRef.current)
  }
  const keyboard = (event, mode) => {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    const amount = event.shiftKey ? 24 : 8
    const current = rectRef.current
    const next = fitCalculatorWindow(mode === 'resize'
      ? { ...current, width: current.width + direction[0] * amount, height: current.height + direction[1] * amount }
      : { ...current, x: current.x + direction[0] * amount, y: current.y + direction[1] * amount }, viewport())
    apply(next)
    setStored(next)
  }
  const reset = () => {
    const next = fitCalculatorWindow({ width: 380, height: 570, x: window.innerWidth - 404, y: 92 }, viewport())
    apply(next)
    setStored(next)
  }
  const gestureProps = mode => ({ onPointerDown: event => start(event, mode), onPointerMove: move, onPointerUp: end, onPointerCancel: end, onLostPointerCapture: end, onKeyDown: event => keyboard(event, mode) })

  return <Dialog.Root modal={false} open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal><Dialog.Content className={`calculator-window ${interacting ? 'is-interacting' : ''}`} style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }} onInteractOutside={event => event.preventDefault()} onOpenAutoFocus={event => { event.preventDefault(); frame.current?.focus() }} onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus() }}>
      <header className="calculator-window-header"><div className="calculator-move-handle" role="button" tabIndex={0} aria-label="Move calculator. Use arrow keys to move." {...gestureProps('move')}><GripHorizontal/><Dialog.Title>Scientific calculator</Dialog.Title></div><button className="calculator-window-tool" onClick={reset} aria-label="Reset calculator size and position"><RotateCcw/></button><Dialog.Close className="calculator-window-tool" aria-label="Close calculator"><X/></Dialog.Close></header>
      <Dialog.Description className="sr-only">Casio-style fx-82 scientific simulator. Drag the header to move; drag the bottom-right corner to resize. Your calculation is kept when you close it.</Dialog.Description>
      <div className="calculator-window-body"><iframe ref={frame} title="Casio-style fx-82 scientific calculator simulator" src="/calculator/index.html" sandbox="allow-scripts allow-same-origin"/></div>
      <footer className="calculator-window-footer"><a href="/calculator/NOTICE.txt" target="_blank" rel="noreferrer">fx-82 simulator · Source & licence</a><button className="calculator-resize-handle" aria-label="Resize calculator. Use arrow keys to resize." {...gestureProps('resize')}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 16 9-9m-4 9 4-4"/></svg></button></footer>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
}

export function CalculatorProvider({ children }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef(null)
  const show = useCallback(element => { trigger.current = element; setOpen(true) }, [])
  const value = useMemo(() => ({ show, open }), [show, open])
  return <CalculatorContext.Provider value={value}>{children}<FloatingCalculator open={open} onOpenChange={setOpen} trigger={trigger}/></CalculatorContext.Provider>
}

export function CalculatorLauncher() {
  const calculator = useContext(CalculatorContext)
  return <button className="qb-tool" aria-label="Open scientific calculator" aria-haspopup="dialog" aria-expanded={calculator.open} onClick={event => calculator.show(event.currentTarget)}><Calculator/></button>
}
