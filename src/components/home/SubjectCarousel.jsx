import { useRef, useState } from 'react'
import { subjects } from '@/data/subjects'
import SubjectBook from './SubjectBook'

export default function SubjectCarousel({ onOpen, disabled }) {
  const [center, setCenter] = useState(1)
  const [hovered, setHovered] = useState(null)
  const hoverPosition = useRef(null)
  const hoverTimer = useRef(null)
  const [drag, setDrag] = useState(0)
  const gesture = useRef(null)
  const suppressClick = useRef(false)
  const [dragging, setDragging] = useState(false)
  const select = index => setCenter(Math.max(0, Math.min(subjects.length - 1, index)))
  const hoverBook = (event, index) => {
    if (event.pointerType !== 'mouse' || disabled || gesture.current) return
    const previous = hoverPosition.current
    // A moving card must not select itself just because it passes under a stationary cursor.
    if (previous && Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 12) return
    hoverPosition.current = { x: event.clientX, y: event.clientY }
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => {
      setHovered(index)
      select(index)
    }, 140)
  }
  const finishDrag = event => {
    if (!gesture.current) return
    const distance = event.clientX - gesture.current.x
    if (Math.abs(distance) > 35) { select(center + (distance < 0 ? 1 : -1)); suppressClick.current = true }
    gesture.current = null; setDragging(false); setDrag(0)
  }
  return <section className={`home-subjects subject-carousel ${dragging ? 'is-dragging' : ''}`} aria-label="Choose a subject" aria-roledescription="carousel"
    onKeyDown={event => { if (!disabled && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); select(event.key === 'Home' ? 0 : event.key === 'End' ? subjects.length - 1 : center + (event.key === 'ArrowRight' ? 1 : -1)) } }}
    onPointerDown={event => { if (disabled || event.button !== 0) return; suppressClick.current = false; gesture.current = { x: event.clientX, width: event.currentTarget.clientWidth }; }}
    onPointerMove={event => { if (!gesture.current) return; const delta = event.clientX - gesture.current.x; if (Math.abs(delta) > 6) { setDragging(true); setDrag(Math.max(-Math.min(.65, subjects.length - 1 - center), Math.min(Math.min(.65, center), delta / (Math.max(1, gesture.current.width) * .32)))); } }}
    onPointerUp={finishDrag} onPointerLeave={event => {
      const wasDragging = Boolean(gesture.current)
      if (wasDragging) finishDrag(event)
      clearTimeout(hoverTimer.current)
      setHovered(null)
      hoverPosition.current = null
      if (!wasDragging) select(1)
    }} onPointerCancel={() => {
      clearTimeout(hoverTimer.current)
      gesture.current = null
      setDragging(false)
      setDrag(0)
      setHovered(null)
      hoverPosition.current = null
      suppressClick.current = true
    }}>
    {subjects.map((subject, index) => {
      const offset = index - center + drag
      const hidden = Math.abs(index - center) > 1
      return <div className="subject-carousel-card" key={subject.id} data-center={index === center} data-open={index === center && hovered === index} data-hidden={hidden} onPointerEnter={event => hoverBook(event, index)} onPointerMove={event => { if (hovered !== index) hoverBook(event, index) }} inert={hidden} aria-hidden={hidden} style={{ '--offset': offset, '--depth': -Math.abs(offset) * 110, zIndex: 3 - Math.abs(index - center) }}>
        <SubjectBook subject={subject} disabled={disabled} actionLabel={index === center ? undefined : `Center ${subject.title}`} onOpen={() => { if (suppressClick.current) { suppressClick.current = false; return } if (index !== center) select(index); else onOpen(subject) }}/>
      </div>
    })}
    <div className="subject-carousel-dots" aria-label="Select a subject">{subjects.map((subject, index) => <button key={subject.id} disabled={disabled} aria-label={`Center ${subject.title}`} aria-pressed={center === index} onClick={() => select(index)}/>)}</div>
  </section>
}
