import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronsUpDown, ChevronDown, CircleHelp, NotebookPen, Files, Layers } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useLocalStorage } from '@/lib/use-local-storage'
import { getSubject, subjectStorageKey } from '@/data/subjects'
import { resumeStudyHref } from '@/lib/study-resume'
import { isStudyFeatureEnabled } from '@/lib/study-features'
import './home-navigation.css'

export default function HomeNavigation() {
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const pinned = useRef(false)
  const closeTimer = useRef(null)
  const returnFocus = useRef(false)
  const featuresTrigger = useRef(null)
  const cancelClose = () => clearTimeout(closeTimer.current)
  useEffect(() => () => clearTimeout(closeTimer.current), [])
  const enterFeatures = event => {
    if (event.pointerType !== 'mouse') return
    cancelClose()
    setFeaturesOpen(true)
  }
  const leaveFeatures = event => {
    if (event.pointerType !== 'mouse' || pinned.current) return
    // Bridge the small gap between the trigger and its portalled menu.
    cancelClose()
    closeTimer.current = setTimeout(() => {
      if (!pinned.current) { returnFocus.current = false; setFeaturesOpen(false) }
    }, 120)
  }
  const changeFeatures = open => {
    cancelClose()
    returnFocus.current = pinned.current
    pinned.current = open
    setFeaturesOpen(open)
  }
  const [lastSubject] = useLocalStorage('study-last-subject', 'chemistry')
  const subject = getSubject(lastSubject)
  const [locations] = useLocalStorage(subjectStorageKey(subject, 'study-locations'), {})
  return <nav className="home-navigation" aria-label="Study options">
    <DropdownMenu><DropdownMenuTrigger className="home-level-trigger">IGCSE<ChevronsUpDown/></DropdownMenuTrigger><DropdownMenuContent className="home-level-menu" align="center" sideOffset={8}>
      {['IGCSE', 'GCSEs'].map(level => <DropdownMenuItem key={level} disabled={level !== 'IGCSE'} aria-current={level === 'IGCSE' ? 'true' : undefined} className="home-level-option"><span>{level}</span></DropdownMenuItem>)}
    </DropdownMenuContent></DropdownMenu>
    <DropdownMenu open={featuresOpen} onOpenChange={changeFeatures} modal={false}><DropdownMenuTrigger ref={featuresTrigger} className="home-features-trigger" onPointerEnter={enterFeatures} onPointerLeave={leaveFeatures}
      onPointerDown={event => {
        if (event.button !== 0 || event.ctrlKey) return
        event.preventDefault()
        cancelClose()
        pinned.current = true
        setFeaturesOpen(true)
        event.currentTarget.focus()
      }} onKeyDown={event => { if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) pinned.current = true }}>
      Features<ChevronDown/>
    </DropdownMenuTrigger><DropdownMenuContent className="home-features-menu" align="center" sideOffset={8} onPointerEnter={enterFeatures} onPointerLeave={leaveFeatures}
      onInteractOutside={event => { if (featuresTrigger.current?.contains(event.target)) event.preventDefault() }}
      onOpenAutoFocus={event => { if (!pinned.current) event.preventDefault() }} onCloseAutoFocus={event => { if (!returnFocus.current) event.preventDefault() }}>
      {[
        ['questions', 'Question bank', CircleHelp, 'purple'], ['notes', 'Revision notes', NotebookPen, 'blue'],
        ['worksheets', 'Worksheets', Files, 'amber'], ['flashcards', 'Flashcards', Layers, 'teal'],
      ].map(([id, label, Icon, color]) => {
        const enabled = isStudyFeatureEnabled(id)
        const content = <><span className={`home-feature-icon ${color}`}><Icon/></span><span>{label}</span></>
        return enabled ? <DropdownMenuItem key={id} asChild><Link to={resumeStudyHref(id, locations, subject)}>{content}</Link></DropdownMenuItem> : <DropdownMenuItem key={id} disabled>{content}</DropdownMenuItem>
      })}
    </DropdownMenuContent></DropdownMenu>
  </nav>
}
