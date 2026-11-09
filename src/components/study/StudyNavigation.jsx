import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { subjectFromSearch, subjectStorageKey } from '@/data/subjects'
import { studyLocation } from '@/lib/study-resume'
import { useLocalStorage } from '@/lib/use-local-storage'

const StudyNavigationContext = createContext(null)

export function StudyNavigationProvider({ children }) {
  const location = useLocation()
  const subject = subjectFromSearch(location.search)
  const [, setLastSubject] = useLocalStorage('study-last-subject', 'chemistry')
  const [, setStudyLocations] = useLocalStorage(subjectStorageKey(subject, 'study-locations'), {})
  useEffect(() => {
    if (/^\/(course|notes|questions|worksheets|flashcards)\/?$/.test(location.pathname)) setLastSubject(subject.id)
    const study = studyLocation(location)
    if (!study) return
    setStudyLocations(current => current?.[study.mode] === study.href && current?.lastTopic === study.topicId ? current : { ...current, [study.mode]: study.href, lastTopic: study.topicId })
  }, [location.pathname, location.search, location.hash, subject.id, setStudyLocations, setLastSubject])
  const [outline, setOutline] = useLocalStorage('study-outline-open', false)
  const [hovered, setHovered] = useState(false)
  const value = useMemo(() => ({ outline, setOutline, hovered, setHovered }), [outline, setOutline, hovered])
  return <StudyNavigationContext.Provider value={value}>{children}</StudyNavigationContext.Provider>
}

export function useStudyNavigation() {
  return useContext(StudyNavigationContext)
}
