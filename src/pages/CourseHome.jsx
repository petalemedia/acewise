import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as Accordion from '@radix-ui/react-accordion'
import { isStudyFeatureEnabled } from '@/lib/study-features'
import { resumeStudyHref } from '@/lib/study-resume'
import { Check, ChevronDown, ChevronRight, LayoutGrid, List, Search, X } from 'lucide-react'
import { StudyShell } from '@/components/study/StudyShell'
import { defaultProgress, useLocalStorage } from '@/lib/use-local-storage'
import { subjectHref, subjectStorageKey } from '@/data/subjects'
import { useSubject } from '@/lib/use-subject'
import './course-home.css'

function CompletionCircle({ completed, total = 1, label }) {
  const done = completed === total
  return <span className="course-status-circle" data-complete={done} role="img" aria-label={label}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle className="course-status-track" cx="12" cy="12" r="9"/>{!done && completed > 0 && <circle className="course-status-value" cx="12" cy="12" r="9" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - completed / total}/>}</svg>{done && <Check aria-hidden="true"/>}
  </span>
}
function ResourceArtwork({ type }) {
  return <span className={`course-resource-art ${type}`} aria-hidden="true"><svg viewBox="0 0 96 96" fill="none">
    {type === 'flashcards' ? <><rect x="25" y="33" width="46" height="42" rx="5" fill="#b8c8dc" transform="rotate(13 25 33)"/><rect x="22" y="23" width="47" height="43" rx="5" fill="white"/><path d="M32 35h25M32 44h16" stroke="#d0d5dd" strokeWidth="5" strokeLinecap="round"/><path d="m24 15 4.5 10.5L39 30l-10.5 4.5L24 45l-4.5-10.5L9 30l10.5-4.5L24 15Z" fill="#13b8ec"/></> : <>
      {type === 'questions' && <rect x="20" y="26" width="44" height="52" rx="6" fill="#04bc88" transform="rotate(-12 20 26)"/>}
      <path d="M29 17h28l12 12v43a6 6 0 0 1-6 6H29a6 6 0 0 1-6-6V23a6 6 0 0 1 6-6Z" fill="white"/>
      <path d="M57 17v9a4 4 0 0 0 4 4h8" fill="#e8ecf1"/>
      <path d="M32 40h24M32 49h18M32 58h11" stroke="#d0d5dd" strokeWidth="5" strokeLinecap="round"/>
      {type === 'notes' && <><path d="m51 62 25-25a5 5 0 0 1 7 7L58 69l-11 4 4-11Z" fill="#ffca0a"/><path d="m51 62 7 7-11 4 4-11Z" fill="#f0b500"/></>}
      {type === 'questions' && <><circle cx="68" cy="66" r="17" fill="#04bf8b" stroke="#77e7c0" strokeWidth="4"/><path d="M63 61a5 5 0 0 1 10 0c0 4-5 4-5 8" stroke="white" strokeWidth="3" strokeLinecap="round"/><circle cx="68" cy="74" r="1.5" fill="white"/></>}
      {type === 'worksheets' && <><rect x="51" y="52" width="31" height="29" rx="7" fill="#ffaf62"/><path d="m58 66 5 5 12-13" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></>}
    </>}
  </svg></span>
}
const resources = [
  { id: 'questions', title: 'Questions', description: 'Practise topic questions and check your answers.' },
  { id: 'notes', title: 'Notes', description: 'Revision guides with diagrams and worked examples.' },
  { id: 'worksheets', title: 'Worksheets', description: 'Work through a full set of questions at your own pace.' },
  { id: 'flashcards', title: 'Flashcards', description: 'Remember key concepts with active recall.' },
]

export default function CourseHome() {
  const subject = useSubject()
  const chemistryTopics = subject.topics
  const panelId = useId()
  const [tab, setTab] = useState('topics')
  const tabs = useRef(null)
  const [underline, setUnderline] = useState({ left: 0, width: 0 })
  useLayoutEffect(() => {
    let active = true
    const measure = () => {
      const button = tabs.current?.querySelector('[aria-selected="true"]')
      if (!active || !button) return
      setUnderline(current => current.left === button.offsetLeft && current.width === button.offsetWidth ? current : { left: button.offsetLeft, width: button.offsetWidth })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(tabs.current)
    document.fonts?.ready.then(measure)
    return () => { active = false; observer.disconnect() }
  }, [tab])
  const [studyLocations] = useLocalStorage(subjectStorageKey(subject, 'study-locations'), {})
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useLocalStorage(subjectStorageKey(subject, 'course-expanded-topics'), chemistryTopics.map(topic => topic.id))
  const [completedTopics] = useLocalStorage(subjectStorageKey(subject, 'completed-topics'), [])
  const [progress] = useLocalStorage('chemistry-progress', defaultProgress)
  const isComplete = id => completedTopics.includes(id) || subject.id === 'chemistry' && id === '11.1' && progress.completed
  const matchingTopics = value => {
    const search = value.trim().toLowerCase()
    return chemistryTopics.map(chapter => ({ ...chapter, visible: `${chapter.id} ${chapter.title}`.toLowerCase().includes(search) ? chapter.subtopics : chapter.subtopics.filter(topic => `${topic.id} ${topic.title}`.toLowerCase().includes(search)) })).filter(chapter => chapter.visible.length)
  }
  const filtered = matchingTopics(query)
  const searchTopics = value => {
    setQuery(value)
    if (value.trim()) setExpanded(current => [...new Set([...(Array.isArray(current) ? current : []), ...matchingTopics(value).map(chapter => chapter.id)])])
  }
  const focusTab = (event, current) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 'topics' : event.key === 'End' ? 'resources' : current === 'topics' ? 'resources' : 'topics'
    setTab(next); document.getElementById(`${panelId}-${next}-tab`)?.focus()
  }
  return <StudyShell active="course"><main className="notes-main course-main course-overview-main" tabIndex={0} aria-label={`${subject.title} course home`}><div className="study-content course-overview">
    <header className="course-overview-heading"><h1 className="study-page-title">{subject.title} {subject.code}</h1><p className="course-description">{subject.description}</p></header>
    <div className="course-tabs" ref={tabs} role="tablist" aria-label="Course content">{[['topics', 'Topics', List], ['resources', 'Resources', LayoutGrid]].map(([id, label, Icon]) => <button key={id} type="button" role="tab" id={`${panelId}-${id}-tab`} aria-controls={`${panelId}-${id}-panel`} aria-selected={tab === id} tabIndex={tab === id ? 0 : -1} onClick={() => setTab(id)} onKeyDown={event => focusTab(event, id)}><Icon aria-hidden="true"/>{label}</button>)}<span className="course-tab-underline" style={{ width: underline.width, transform: `translateX(${underline.left}px)` }} aria-hidden="true"/></div>
    <section role="tabpanel" id={`${panelId}-topics-panel`} aria-labelledby={`${panelId}-topics-tab`} hidden={tab !== 'topics'}>
      <label className="course-topic-search"><Search aria-hidden="true"/><input type="search" aria-label="Search topics" placeholder="Search topics…" value={query} onChange={event => searchTopics(event.target.value)}/>{query && <button type="button" aria-label="Clear topic search" onClick={() => searchTopics('')}><X/></button>}</label>
      <Accordion.Root type="multiple" className="course-topic-list" value={Array.isArray(expanded) ? expanded : []} onValueChange={setExpanded}>{filtered.map(chapter => {
        const completed = chapter.subtopics.filter(topic => isComplete(topic.id)).length
        return <Accordion.Item className="course-chapter" value={chapter.id} key={chapter.id}>
          <Accordion.Header className="course-chapter-heading"><Accordion.Trigger className="course-chapter-trigger"><CompletionCircle completed={completed} total={chapter.subtopics.length} label={`${completed} of ${chapter.subtopics.length} subtopics completed`}/><span>{chapter.id} {chapter.title}</span><ChevronDown className="course-chapter-chevron" aria-hidden="true"/></Accordion.Trigger></Accordion.Header>
          <Accordion.Content className="course-chapter-content"><nav aria-label={`${chapter.title} subtopics`} className="course-subtopics">{chapter.visible.map(topic => {
            const done = isComplete(topic.id)
            return <Link key={topic.id} className="course-subtopic" data-depth={topic.depth || 2} to={subjectHref(subject, 'notes', topic.id)} aria-label={`${topic.id} ${topic.title}. ${done ? 'Completed' : 'Not completed'}.`}><CompletionCircle completed={Number(done)} label={done ? 'Completed' : 'Not completed'}/><span>{topic.id} {topic.title}</span><ChevronRight aria-hidden="true"/></Link>
          })}</nav></Accordion.Content>
        </Accordion.Item>
      })}</Accordion.Root>
      {!filtered.length && <div className="course-search-empty"><p>No topics found for “{query}”.</p><button onClick={() => searchTopics('')}>Clear search</button></div>}
    </section>
    <section role="tabpanel" id={`${panelId}-resources-panel`} aria-labelledby={`${panelId}-resources-tab`} hidden={tab !== 'resources'} className="course-resources"><h2>Study resources</h2><div className="course-resource-list">{resources.map(resource => { const enabled = isStudyFeatureEnabled(resource.id); const Element = enabled ? Link : 'button'; return <Element className="course-resource" key={resource.id} {...(enabled ? { to: resumeStudyHref(resource.id, studyLocations, subject) } : { type: 'button', disabled: true, 'aria-label': `${resource.title} — Coming soon` })}><ResourceArtwork type={resource.id}/><div className="course-resource-copy"><h3>{resource.title}</h3><p>{!enabled ? 'Coming soon' : !subject.available ? resource.id === 'notes' ? 'Browse the topic overviews.' : 'Practice questions will be added soon.' : resource.description}</p></div></Element>})}</div></section>
  </div></main></StudyShell>
}
