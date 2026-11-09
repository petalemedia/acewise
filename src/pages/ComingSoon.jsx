import { Link } from 'react-router-dom'
import { ChevronLeft, Files, Layers } from 'lucide-react'
import { useSubject } from '@/lib/use-subject'
import { subjectHref } from '@/data/subjects'
import { StudyShell } from '@/components/study/StudyShell'

export default function ComingSoon({ feature }) {
  const subject = useSubject()
  const title = feature === 'worksheets' ? 'Worksheets' : 'Flashcards'
  const Icon = feature === 'worksheets' ? Files : Layers
  return <StudyShell active={feature}><main className="notes-main coming-soon-main" tabIndex={0} aria-label={`${title} coming soon`}><div className="study-content coming-soon-content"><Icon aria-hidden="true"/><h1 className="study-page-title">{title}</h1><p>Coming soon</p><Link to={subjectHref(subject)}><ChevronLeft/>Back to Course Home</Link></div></main></StudyShell>
}
