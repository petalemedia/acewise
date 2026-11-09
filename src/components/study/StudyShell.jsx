import { useEffect } from 'react'
import { useNotesScrollLock } from '@/lib/use-notes-scroll-lock'
import { defaultProgress, useLocalStorage } from '@/lib/use-local-storage'
import { StudySidebar } from './StudySidebar'
import { StudyTopbar } from './StudyTopbar'
import { useStudyNavigation } from './StudyNavigation'

export function StudyShell({ active, outline = false, menu, children }) {
  useNotesScrollLock()
  const [pinned, setPinned] = useLocalStorage('study-menu-pinned', false)
  const { hovered, setHovered } = useStudyNavigation()
  const [, setProgress] = useLocalStorage('chemistry-progress', defaultProgress)
  const open = pinned || hovered
  useEffect(() => {
    const now = new Date()
    const today = now.toLocaleDateString('en-CA')
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    setProgress(current => current.lastStudied === today ? current : { ...current, lastStudied: today, streak: current.lastStudied === yesterday.toLocaleDateString('en-CA') ? current.streak + 1 : 1 })
  }, [setProgress])
  return <div className={`notes-shell study-shell ${open ? 'rail-expanded' : ''} ${outline ? 'outline-visible' : ''}`} data-study-page={active}>
    <StudyTopbar menu={menu}/>
    <StudySidebar open={open} pinned={pinned} onTogglePin={() => setPinned(!pinned)} onHoverChange={setHovered}/>
    {children}
  </div>
}
