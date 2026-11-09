import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSubject } from '@/lib/use-subject'
import { subjectHref } from '@/data/subjects'
import { StudyShell } from '@/components/study/StudyShell'

export default function NotFound() {
  const subject = useSubject()
  return <StudyShell><main className="notes-main not-found-main" tabIndex={0} aria-label="Page not found"><div className="study-content not-found-content"><span className="not-found-code">404</span><h1 className="study-page-title">Page not found</h1><p>This page may have moved, or the link may be incorrect.</p><Link to={subjectHref(subject)}><ArrowLeft aria-hidden="true"/>Back to Course Home</Link></div></main></StudyShell>
}
