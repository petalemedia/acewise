import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as Accordion from '@radix-ui/react-accordion'
import { Check, ChevronDown } from 'lucide-react'
import { subjectHref, subjectStorageKey } from '@/data/subjects'
import { useSubject } from '@/lib/use-subject'
import { bankQuestions } from '@/data/chemistry-practice'
import { questionsForTopic } from '@/lib/question-bank'
import { useLocalStorage } from '@/lib/use-local-storage'

export default function RevisionOutline({ completed, activeTopic = '11.1', mode = 'notes' }) {
  const subject = useSubject()
  const chemistryTopics = subject.topics
  const scrollKey = subject.id === 'chemistry' ? 'revision-guide-scroll-top' : `${subject.id}-revision-guide-scroll-top`
  const scrollPane = useRef(null)
  const [expanded, setExpanded] = useLocalStorage(subjectStorageKey(subject, 'expanded-topics'), [subject.defaultTopic.split('.')[0]])
  const [completedTopics] = useLocalStorage(subjectStorageKey(subject, 'completed-topics'), [])
  const [answers] = useLocalStorage(subjectStorageKey(subject, 'question-answers'), {})
  const chapter = activeTopic.split('.')[0]
  const open = Array.isArray(expanded) ? expanded.filter(id => chemistryTopics.some(topic => topic.id === id)) : [chapter]
  useEffect(() => {
    setExpanded(current => Array.isArray(current) && current.includes(chapter) ? current : [...(Array.isArray(current) ? current : []), chapter])
  }, [chapter, setExpanded])
  useLayoutEffect(() => {
    const pane = scrollPane.current
    if (!pane) return undefined
    const savePosition = () => {
      try { sessionStorage.setItem(scrollKey, String(pane.scrollTop)) } catch { /* Keep navigation usable when storage is unavailable. */ }
    }
    try {
      const saved = Number(sessionStorage.getItem(scrollKey))
      if (Number.isFinite(saved)) pane.scrollTop = saved
    } catch { /* Use the default scroll position when storage is unavailable. */ }
    pane.addEventListener('scroll', savePosition, { passive: true })
    return () => {
      pane.removeEventListener('scroll', savePosition)
    }
  }, [scrollKey])

  return <>
    <h2 className="revision-heading">Revision Guide</h2>
    <div className="revision-scroll" ref={scrollPane}>
      <Accordion.Root type="multiple" value={open} onValueChange={setExpanded} className="revision-tree">
        {chemistryTopics.map(topic => <Accordion.Item key={topic.id} value={topic.id} className="revision-group">
          <Accordion.Header className="revision-group-heading"><Accordion.Trigger className="revision-group-trigger"><span className="revision-group-title">{topic.id} {topic.title}</span><ChevronDown aria-hidden="true"/></Accordion.Trigger></Accordion.Header>
          <Accordion.Content className="revision-group-content"><nav className="revision-lessons" aria-label={`${topic.title} subtopics`}>
            {topic.subtopics.map(subtopic => {
              const current = subtopic.id === activeTopic
              const topicQuestions = questionsForTopic(subject.id === 'chemistry' ? bankQuestions : [], subtopic.id)
              const answered = topicQuestions.filter(question => answers[question.id]?.submitted).length
              const fraction = topicQuestions.length ? answered / topicQuestions.length : 0
              const done = mode === 'questions'
                ? topicQuestions.length > 0 && topicQuestions.every(question => answers[question.id]?.submitted)
                : completedTopics.includes(subtopic.id) || subject.id === 'chemistry' && subtopic.id === '11.1' && completed
              return <Link key={subtopic.id} to={subjectHref(subject, ['questions', 'worksheets'].includes(mode) ? mode : 'notes', subtopic.id)} data-depth={subtopic.depth || 2} className={current ? 'current-lesson' : ''} aria-current={current ? 'page' : undefined}>
                {mode === 'questions' ? <span className="lesson-status lesson-question-progress" data-complete={done} role="progressbar" aria-label={`${subtopic.id} questions answered`} aria-valuemin={0} aria-valuemax={Math.max(1, topicQuestions.length)} aria-valuenow={answered} aria-valuetext={topicQuestions.length ? `${answered} of ${topicQuestions.length} questions answered` : 'No questions available'}><svg viewBox="0 0 20 20" aria-hidden="true"><circle className="lesson-progress-track" cx="10" cy="10" r="8"/><circle className="lesson-progress-value" cx="10" cy="10" r="8" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - fraction}/><g transform="rotate(90 10 10)"><circle className="lesson-progress-complete-disc" cx="10" cy="10" r="10"/><path className="lesson-progress-check" d="m5.8 10 2.8 2.8 5.6-6" pathLength="1"/></g></svg></span> : <span className={`lesson-status ${done ? 'is-completed' : ''}`} aria-label={done ? 'Completed' : undefined}>{done && <Check aria-hidden="true"/>}</span>}
                <span className="lesson-name">{subtopic.id} {subtopic.title}</span>
              </Link>
            })}
          </nav></Accordion.Content>
        </Accordion.Item>)}
      </Accordion.Root>
    </div>
  </>
}
