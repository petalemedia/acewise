import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubject } from '@/lib/use-subject'
import { subjectHref } from '@/data/subjects'
import { Search } from 'lucide-react'

export default function FindQuestionsButton({ topicId, className = '', label = 'Find questions' }) {
  const navigate = useNavigate()
  const subject = useSubject()
  const [searching, setSearching] = useState(false)
  const timer = useRef(null)
  useEffect(() => { setSearching(false); return () => clearTimeout(timer.current) }, [topicId, subject.id])
  const find = () => {
    if (searching) return
    setSearching(true)
    // A short transition while switching from notes to the tagged question bank.
    timer.current = setTimeout(() => navigate(subjectHref(subject, 'questions', topicId)), 1800)
  }
  return <button className={`find-questions-button ${className} ${searching ? 'is-searching' : ''}`} disabled={searching} aria-busy={searching} onMouseDown={event => event.preventDefault()} onClick={find}><Search aria-hidden="true"/><span role="status" aria-live="polite">{searching ? 'Searching…' : label}</span></button>
}
