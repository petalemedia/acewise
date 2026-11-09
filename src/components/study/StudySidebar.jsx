import { NavLink, useLocation } from 'react-router-dom'
import { CircleHelp, House, Layers, NotebookPen, PanelLeft, Files } from 'lucide-react'
import { isStudyFeatureEnabled } from '@/lib/study-features'
import { useLocalStorage } from '@/lib/use-local-storage'
import { findSubjectTopic, subjectHref } from '@/data/subjects'
import { useSubject } from '@/lib/use-subject'

const destinations = [
  { id: 'course', label: 'Course Home', path: '/course', Icon: House },
  { id: 'questions', label: 'Questions', path: '/questions', Icon: CircleHelp },
  { id: 'notes', label: 'Notes', path: '/notes', Icon: NotebookPen },
  { id: 'worksheets', label: 'Worksheets', path: '/worksheets', Icon: Files },
  { id: 'flashcards', label: 'Flashcards', path: '/flashcards', Icon: Layers },
]

function SidebarPinIcon({ pinned = false }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <g transform="rotate(45 12 12)">
      <path d="M8 3.5h8a1.25 1.25 0 0 1 0 2.5h-1v4.2c0 .5.2 1 .6 1.4l2.1 2.1c.2.2.3.4.3.7v1.1H6v-1.1c0-.3.1-.5.3-.7l2.1-2.1c.4-.4.6-.9.6-1.4V6H8a1.25 1.25 0 0 1 0-2.5Z" fill={pinned ? 'currentColor' : 'none'}/>
      <path d="M12 15.5v5"/>
    </g>
  </svg>
}

export function StudySidebar({ open, pinned, onTogglePin, onHoverChange }) {
  const location = useLocation()
  const subject = useSubject()
  const topic = findSubjectTopic(subject, new URLSearchParams(location.search).get('topic')) || findSubjectTopic(subject, subject.defaultTopic)
  const [pins, setPins] = useLocalStorage('study-sidebar-pins', [])
  const ordered = [...destinations].sort((a, b) => Number(pins.includes(b.id)) - Number(pins.includes(a.id)))
  const togglePin = id => setPins(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])
  return <nav className="nav-rail" aria-label="Course navigation"
    onPointerEnter={event => { if (event.pointerType === 'mouse') onHoverChange(true) }}
    onPointerLeave={() => onHoverChange(false)}
    onFocusCapture={() => onHoverChange(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) onHoverChange(false) }}>
    <button className="icon-button sidebar-menu-toggle" aria-label={pinned ? 'Unpin menu' : 'Pin menu open'} aria-expanded={open} aria-pressed={pinned} onClick={onTogglePin}>
      <PanelLeft/><span className="rail-label">{pinned ? 'Hide Menu' : 'Show Menu'}</span>
    </button>
    {ordered.map(({ id, label, Icon }) => <div className="sidebar-link-row" key={id} data-pinned={pins.includes(id)}>
      {!isStudyFeatureEnabled(id) ? <button className="icon-button sidebar-coming-soon" disabled aria-label={`${label} — Coming soon`}><Icon aria-hidden="true"/><span className="rail-label"><span>{label}</span><small>Coming soon</small></span></button> : <NavLink className={({ isActive }) => `icon-button ${isActive ? 'rail-active' : ''}`} to={subjectHref(subject, id, ['notes', 'questions', 'worksheets'].includes(id) ? topic.id : undefined)} aria-label={label}>
        <Icon aria-hidden="true"/><span className="rail-label">{label}</span>
      </NavLink>}
      {isStudyFeatureEnabled(id) && <button className="sidebar-pin" tabIndex={open ? 0 : -1} aria-hidden={!open} aria-label={`${pins.includes(id) ? 'Unpin' : 'Pin'} ${label}`} aria-pressed={pins.includes(id)} onClick={() => togglePin(id)}>
        <SidebarPinIcon pinned={pins.includes(id)}/>
      </button>}
    </div>)}
  </nav>
}
