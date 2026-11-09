import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Bookmark, Check, ChevronLeft, ChevronRight, CircleCheck, Download, Highlighter, Link as LinkIcon, MoreHorizontal, RotateCcw, ThumbsDown, ThumbsUp } from 'lucide-react'
import SyllabusTopic from './SyllabusTopic'
import { findSubjectTopic } from '@/data/subjects'
import { useSubject } from '@/lib/use-subject'
import { organicLessons } from '@/data/organic/lessons'
import { useNoteHighlights } from '@/lib/use-note-highlights'
import { highlightColors } from '@/lib/note-highlights'
import { HighlightEditor, SavedHighlights } from '@/components/notes/HighlightTools'
import { useLocalStorage as useSaved } from '@/lib/use-local-storage'
import { toggleLessonCompletion } from '@/lib/lesson-completion'
import { StudyShell } from '@/components/study/StudyShell'
import { useStudyNavigation } from '@/components/study/StudyNavigation'
import FindQuestionsButton from '@/components/questions/FindQuestionsButton'
import { Notifications, useNotifications } from '@/components/notes/Notifications'
import RevisionOutline from '@/components/notes/RevisionOutline'
import RevisionGuideToggle from '@/components/notes/RevisionGuideToggle'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { isStudyFeatureEnabled } from '@/lib/study-features'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import './organic-notes.css'

export default function Notes() {
  const [params] = useSearchParams()
  const subject = useSubject()
  const topic = findSubjectTopic(subject, params.get('topic')) || findSubjectTopic(subject, subject.defaultTopic)
  return subject.id === 'chemistry' && organicLessons[topic.id] ? <OrganicNotes key={topic.id} topic={topic}/> : <SyllabusTopic topic={topic}/>
}

function OrganicNotes({ topic }) {
  const navigate = useNavigate()
  const { outline, setOutline } = useStudyNavigation()
  const lesson = organicLessons[topic.id]
  const sections = [...lesson.sections, { id: 'your-next-step', title: 'Your next step' }]
  const storageKey = name => topic.id === '11.1' ? name : `${name}:${topic.id}`
  const [copied, setCopied] = useState(false)
  const [rating, setRating] = useSaved(storageKey('chemistry-rating'), null)
  const [active, setActive] = useState(0)
  const [saved, setSaved] = useSaved(storageKey('chemistry-bookmarked'), false)
  const [highlights, setHighlights] = useSaved(storageKey('chemistry-highlights'), [])
  const [progress, setProgress] = useSaved('chemistry-progress', { xp: 0, energy: 20, streak: 1, completed: false })
  const [completedTopics, setCompletedTopics] = useSaved('chemistry-completed-topics', [])
  const [color, setColor] = useSaved('highlight-color', 'yellow')
  const { notifications, notify, dismiss } = useNotifications()
  const [showHighlights, setShowHighlights] = useState(false)
  const article = useRef(null), scrollPane = useRef(null), selection = useRef(null)
  const highlightTools = useNoteHighlights({ article, scrollPane, highlights, setHighlights, color, selection })
  const done = topic.id === '11.1' ? progress.completed : completedTopics.includes(topic.id)
  const topicNumber = Number(topic.id.split('.')[1])

  const scrollToNote = (id, behavior = 'smooth') => {
    const pane = scrollPane.current, target = article.current?.querySelector(`#${CSS.escape(id)}`)
    if (pane && target) pane.scrollTo({ top: pane.scrollTop + target.getBoundingClientRect().top - pane.getBoundingClientRect().top - 32, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : behavior })
  }
  useEffect(() => {
    const id = requestAnimationFrame(() => { if (window.location.hash) scrollToNote(window.location.hash.slice(1), 'instant') })
    return () => cancelAnimationFrame(id)
    // A keyed lesson mounts once per topic; hash links are resolved on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 3200)
    return () => clearTimeout(id)
  }, [copied])
  useEffect(() => {
    const pane = scrollPane.current
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const top = pane.getBoundingClientRect().top + 65
        const visible = [...article.current.querySelectorAll('section[data-index]')].filter(section => section.getBoundingClientRect().top <= top)
        if (pane.scrollHeight - pane.scrollTop - pane.clientHeight < 20) setActive(lesson.sections.length)
        else setActive(visible.length ? Number(visible.at(-1).dataset.index) : 0)
      })
    }
    pane.addEventListener('scroll', update, { passive: true })
    return () => { pane.removeEventListener('scroll', update); cancelAnimationFrame(frame) }
  }, [lesson])
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/notes?topic=${topic.id}#${sections[active].id}`)
      notify('Link copied to clipboard'); setCopied(true)
    } catch { notify('Unable to copy. You can copy the link from your address bar.') }
  }
  const jump = index => { scrollToNote(sections[index].id); setActive(index) }
  const complete = () => {
    const earnsReward = topic.id === '11.1' && !done && !progress.lessonRewarded
    if (topic.id === '11.1') setProgress(toggleLessonCompletion)
    setCompletedTopics(current => done ? current.filter(id => id !== topic.id) : current.includes(topic.id) ? current : [...current, topic.id])
    notify(done ? 'Marked as incomplete' : earnsReward ? (isStudyFeatureEnabled('xp') ? 'Lesson complete! You earned 20 XP.' : 'Lesson complete!') : 'Lesson marked as done')
  }
  return <TooltipProvider delayDuration={250}><StudyShell active="notes" outline={outline} menu={<DropdownMenu><DropdownMenuTrigger asChild><button className="icon-button options-trigger" aria-label="Lesson options"><MoreHorizontal/></button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => setSaved(!saved)}><Bookmark/>{saved ? 'Remove bookmark' : 'Bookmark lesson'}</DropdownMenuItem><DropdownMenuItem onSelect={copyLink}><LinkIcon/>Copy lesson link</DropdownMenuItem><DropdownMenuItem onSelect={() => setShowHighlights(true)}><Highlighter/>Your highlights ({highlightTools.records.length})</DropdownMenuItem><DropdownMenuItem onSelect={() => window.print()}><Download/>Print / save PDF</DropdownMenuItem><DropdownMenuSeparator/><DropdownMenuItem disabled={!highlights.length} onSelect={() => { setHighlights([]); notify('Highlights cleared') }}><RotateCcw/>Clear highlights</DropdownMenuItem></DropdownMenuContent></DropdownMenu>}>
    <RevisionGuideToggle open={outline} onToggle={() => setOutline(!outline)}/>
    <aside id="revision-navigation" className={`lesson-outline ${outline ? 'expanded' : ''}`} aria-label="Revision guides" aria-hidden={!outline} inert={!outline}><RevisionOutline completed={progress.completed} activeTopic={topic.id}/></aside>
    <main className="notes-main" ref={scrollPane} tabIndex={0} aria-label="Revision guide content"><article className="study-content note-content organic-notes" ref={article} {...highlightTools.articleProps} data-highlight-mode={highlightTools.mode}>
      <h1 className="study-page-title">{topic.id} {topic.title}</h1>
      {lesson.sections.map((section, index) => <section id={section.id} data-index={index} key={section.id}>
        <h2>{section.title}{section.extended && <span className="organic-extended-label">Extended</span>}</h2>
        {section.content}
      </section>)}
      <section id="your-next-step" data-index={lesson.sections.length} className="lesson-footer">
        <div className="lesson-pagination"><button disabled={topicNumber === 1} onClick={() => navigate(`/notes?topic=11.${topicNumber - 1}`)}><ChevronLeft/>Previous</button><button className="next-lesson" onClick={() => navigate(topicNumber < 8 ? `/notes?topic=11.${topicNumber + 1}` : `/questions?topic=${topic.id}`)}>Next<ChevronRight/></button></div>
        <div className="lesson-completion"><button className={`done-button ${done ? 'completed' : ''}`} aria-pressed={done} aria-label={done ? 'Mark lesson as incomplete' : 'Mark lesson as done'} onClick={complete}><CircleCheck/>{done ? 'Done' : 'Mark as done'}</button><div className="lesson-rating"><span>How was this guide?</span>{['up','down'].map(value => <button key={value} data-rating={value} aria-label={value === 'up' ? 'This guide was helpful' : 'This guide needs improvement'} aria-pressed={rating === value} onClick={() => { setRating(rating === value ? null : value); notify('Thanks for your feedback') }}>{value === 'up' ? <ThumbsUp/> : <ThumbsDown/>}</button>)}</div></div>
      </section>
    </article></main>
    <nav className="reading-map" aria-label="Jump to a section">{sections.map((section,index) => <Tooltip key={section.id}><TooltipTrigger asChild><button aria-label={section.title} aria-current={active === index ? 'location' : undefined} className={active === index ? 'active' : ''} onClick={() => jump(index)}><span/></button></TooltipTrigger><TooltipContent side="left">{section.title}</TooltipContent></Tooltip>)}</nav>
    <div className="annotation-dock"><div className="annotation-toolbar" aria-label="Note tools"><button className="highlight-toggle" aria-pressed={highlightTools.mode} aria-describedby="highlight-mode-status" onMouseDown={event => event.preventDefault()} onClick={highlightTools.toggleMode}><Highlighter/><span>Highlight</span></button>
      <Popover><Tooltip><TooltipTrigger asChild><PopoverTrigger asChild><button className="color-picker" aria-label="Highlight colour" onMouseDown={event => event.preventDefault()}><span className={`color-dot ${color}`}/></button></PopoverTrigger></TooltipTrigger><TooltipContent side="top">Highlight colour</TooltipContent></Tooltip><PopoverContent side="top" sideOffset={10} className="color-popover" aria-label="Highlight colours" onOpenAutoFocus={event => event.preventDefault()}><div role="group" aria-label="Choose highlight colour">{highlightColors.map(value => <button key={value} aria-label={`${value === 'mint' ? 'green' : value} highlight`} aria-pressed={color === value} className={`color-dot ${value}`} onMouseDown={event => event.preventDefault()} onClick={() => setColor(value)}>{color === value && <span className="swatch-check"><Check/></span>}</button>)}</div></PopoverContent></Popover>
      <button onClick={copyLink}>{copied ? <Check/> : <LinkIcon/>}<span>{copied ? 'Copied' : 'Copy link'}</span></button><FindQuestionsButton topicId={topic.id}/>
    </div></div>
    <span id="highlight-mode-status" className="sr-only" role="status">{highlightTools.mode ? 'Highlight mode on. Select text to save it automatically. Press Escape to exit.' : 'Highlight mode off. Click a saved highlight to edit it.'}</span>
    <HighlightEditor tools={highlightTools}/><SavedHighlights tools={highlightTools} open={showHighlights} onOpenChange={setShowHighlights}/><Notifications items={notifications} onDismiss={dismiss}/>
  </StudyShell></TooltipProvider>
}
