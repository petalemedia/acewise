import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { StudyShell } from '@/components/study/StudyShell'
import { useStudyNavigation } from '@/components/study/StudyNavigation'
import RevisionOutline from '@/components/notes/RevisionOutline'
import RevisionGuideToggle from '@/components/notes/RevisionGuideToggle'
import FindQuestionsButton from '@/components/questions/FindQuestionsButton'
import { subjectHref, subjectStorageKey } from '@/data/subjects'
import { useSubject } from '@/lib/use-subject'
import { defaultProgress, useLocalStorage } from '@/lib/use-local-storage'

export default function SyllabusTopic({ topic }) {
  const subject = useSubject()
  const chemistrySubtopics = subject.subtopics, chemistryTopics = subject.topics, chemistrySyllabusSource = subject.source
  const { outline, setOutline } = useStudyNavigation()
  const [completedTopics, setCompletedTopics] = useLocalStorage(subjectStorageKey(subject, 'completed-topics'), [])
  const [progress] = useLocalStorage('chemistry-progress', defaultProgress)
  const pane = useRef(null)
  const index = chemistrySubtopics.findIndex(item => item.id === topic.id)
  const previous = chemistrySubtopics[index - 1]
  const next = chemistrySubtopics[index + 1]
  const chapter = chemistryTopics.find(item => item.id === topic.id.split('.')[0])
  const done = completedTopics.includes(topic.id)
  useEffect(() => { pane.current?.scrollTo({ top: 0, behavior: 'instant' }) }, [topic.id, subject.id])
  return <StudyShell active="notes" outline={outline}>
    <RevisionGuideToggle open={outline} onToggle={() => setOutline(!outline)}/>
    <aside id="revision-navigation" className={`lesson-outline ${outline ? 'expanded' : ''}`} aria-label="Revision guides" aria-hidden={!outline} inert={!outline}><RevisionOutline activeTopic={topic.id} completed={subject.id === 'chemistry' && progress.completed}/></aside>
    <main className="notes-main" ref={pane} tabIndex={0} aria-label={`${topic.id} ${topic.title} revision guide`}><article className="study-content note-content syllabus-topic">
      <h1 className="study-page-title">{topic.id} {topic.title}</h1>
      <section><h2>Overview</h2><p>{topic.summary}</p><a className="syllabus-source-link" href={`${chemistrySyllabusSource.url}#page=${topic.page}`} target="_blank" rel="noreferrer">Read the syllabus requirements<ArrowUpRight/></a></section>
      {!subject.available && <p className="subject-overview-notice">This is a topic overview. Full notes and practice questions are being prepared.</p>}
      <section><h2>Also in {chapter.title.toLowerCase()}</h2><nav className="syllabus-related" aria-label="Other subtopics">{chapter.subtopics.filter(item => item.id !== topic.id).map(item => <Link key={item.id} to={subjectHref(subject, 'notes', item.id)}>{item.id} {item.title}<ChevronRight/></Link>)}{chapter.subtopics.length === 1 && <p>This topic has one subtopic.</p>}</nav></section>
      <footer className="syllabus-topic-footer"><nav aria-label="Previous and next subtopic">{previous ? <Link to={subjectHref(subject, 'notes', previous.id)}><ChevronLeft/>Previous</Link> : <span/>}{next ? <Link to={subjectHref(subject, 'notes', next.id)}>Next<ChevronRight/></Link> : <span/>}</nav><button className="syllabus-complete" aria-pressed={done} onClick={() => setCompletedTopics(current => done ? current.filter(id => id !== topic.id) : [...current, topic.id])}><Check/>{done ? 'Completed' : 'Mark as done'}</button></footer>
    </article></main>
    <div className="annotation-dock"><div className="annotation-toolbar" aria-label="Topic tools"><FindQuestionsButton topicId={topic.id}/></div></div>
  </StudyShell>
}
