import { useEffect, useId, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Bookmark, BookOpen, Check, ChevronLeft, ChevronRight, ChevronsUpDown, CircleCheck, CircleHelp, Eraser, ExternalLink, Flag, ListChecks, MoreHorizontal, MoreVertical, RotateCcw, X } from 'lucide-react'
import { StudyShell } from '@/components/study/StudyShell'
import { useStudyNavigation } from '@/components/study/StudyNavigation'
import RevisionOutline from '@/components/notes/RevisionOutline'
import RevisionGuideToggle from '@/components/notes/RevisionGuideToggle'
import { findSubjectTopic, subjectHref, subjectStorageKey } from '@/data/subjects'
import { useSubject } from '@/lib/use-subject'
import { CalculatorLauncher, CalculatorProvider } from '@/components/calculator/CalculatorWindow'
import { useLocalStorage, defaultProgress } from '@/lib/use-local-storage'
import { awardQuestion, bankQuestions, QUESTIONS_PER_PAGE, questionStats } from '@/data/chemistry-practice'
import { clearQuestionAnswer, defaultBankFilters, filterQuestionBank, questionsForTopic, selectQuestionAnswer } from '@/lib/question-bank'
import { questionSourceUrl } from '@/lib/question-source'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'

import QuestionContent, { QuestionDrawing, QuestionText } from '@/components/questions/QuestionContent'

const difficultyNames = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
function FlowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 8a7 7 0 0 1 7-4m5 5a7 7 0 0 1 2 7M13 21a8 8 0 0 1-8-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><circle cx="13" cy="4" r="3" fill="currentColor"/><circle cx="20" cy="16" r="3" fill="currentColor"/><circle cx="5" cy="17" r="3" fill="currentColor"/></svg>
}
const filterOptions = {
  paper: [['all', 'All papers'], ['1', 'Paper 1'], ['2', 'Paper 2']],
  level: [['all', 'Core & Extended'], ['core', 'Core'], ['extended', 'Extended']],
  difficulty: [['all', 'All'], ['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']],
  completion: [['all', 'All'], ['unanswered', 'Unanswered'], ['answered', 'Answered'], ['correct', 'Correct'], ['incorrect', 'Incorrect'], ['bookmarked', 'Bookmarked']],
}

function BankFilter({ name, value, onChange }) {
  const [open, setOpen] = useState(false)
  const selecting = useRef(false)
  const keepSelectionOpen = event => {
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return
    const option = event.target.closest?.('[role="option"]')
    if (!option || option.hasAttribute('data-disabled')) return
    selecting.current = true
    queueMicrotask(() => { selecting.current = false })
  }
  const changeOpen = next => { if (!next && selecting.current) return; setOpen(next) }
  return <div className="qb-filter"><label id={`filter-${name}`}>{name[0].toUpperCase() + name.slice(1)}</label><Select value={value} open={open} onOpenChange={changeOpen} onValueChange={onChange}><SelectTrigger className="qb-filter-trigger" aria-labelledby={`filter-${name}`}><SelectValue/><ChevronsUpDown aria-hidden="true"/></SelectTrigger><SelectContent onPointerUpCapture={keepSelectionOpen} onClickCapture={keepSelectionOpen} onKeyDownCapture={keepSelectionOpen}>{filterOptions[name].map(([optionValue, label]) => <SelectItem key={optionValue} value={optionValue}>{label}</SelectItem>)}</SelectContent></Select></div>
}


function FirstAttemptRate({ rate }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(null)
  useEffect(() => () => clearTimeout(closeTimer.current), [])
  const show = () => { clearTimeout(closeTimer.current); setOpen(true) }
  const scheduleClose = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(false), 140) }
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild><button className="qb-accuracy" aria-label={`Estimated first-attempt success rate: ${rate}%`} onPointerEnter={event => { if (event.pointerType !== 'touch') show() }} onPointerLeave={scheduleClose} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) show() }} onBlur={scheduleClose}><span>{rate}%</span><CircleHelp/></button></PopoverTrigger>
    <PopoverContent className="qb-accuracy-dropdown" side="bottom" align="center" sideOffset={8} collisionPadding={12} onPointerEnter={show} onPointerLeave={scheduleClose} onOpenAutoFocus={event => event.preventDefault()} onCloseAutoFocus={event => event.preventDefault()}>
      <h3>First-time full marks</h3>
      <p>An estimated {rate}% of students would answer this question correctly on their first attempt.</p>
      <small>Estimated from question difficulty, not collected student results.</small>
    </PopoverContent>
  </Popover>
}

function QuestionBody({ question, number, saved, onAnswer }) {
  return <><div className="qb-prompt"><QuestionContent question={question}/><span aria-label="1 mark">[1]</span></div>{question.diagram && <figure className="qb-question-diagram"><img src={question.diagram.src} alt={question.diagram.alt} loading="lazy" draggable={false}/></figure>}<div className="qb-options" role="group" aria-label={`Options for question ${number}`}>{question.options.map((option, choice) => {
    const selected = saved?.submitted && saved.selected === choice
    const state = selected ? saved.correct ? 'correct' : 'incorrect' : 'idle'
    return <button key={choice} aria-label={question.labelChoices ? `Answer ${String.fromCharCode(65 + choice)}` : undefined} aria-pressed={Boolean(selected)} data-state={state} onClick={() => onAnswer(question, choice)}><span className="qb-letter">{state === 'correct' ? <Check/> : state === 'incorrect' ? <X/> : String.fromCharCode(65 + choice)}</span>{!question.labelChoices && (question.optionDrawings?.[choice] ? <QuestionDrawing drawing={question.optionDrawings[choice]} className="qb-option-drawing"/> : <QuestionText html={question.optionHtml?.[choice]}>{option}</QuestionText>)}</button>
  })}</div></>
}

function Markscheme({ question }) {
  return <div className="qb-markscheme-answer"><span className="qb-markscheme-letter">{String.fromCharCode(65 + question.answer)}</span><span>{question.answerDescription || <QuestionText html={question.optionHtml?.[question.answer]}>{question.options[question.answer]}</QuestionText>}{question.optionDrawings?.[question.answer] && <QuestionDrawing drawing={question.optionDrawings[question.answer]} className="qb-option-drawing"/>}</span></div>
}

function QuestionCard({ question, number, saved, onAnswer, onRetry, bookmarked, onBookmark, reported, onReport }) {
  const cardId = useId()
  const [viewReported, setViewReported] = useState(false)
  const reportViewButton = useRef(null)
  const questionMenuButton = useRef(null)
  const focusReportNotice = useRef(false)
  const obscured = reported && !viewReported
  const [markscheme, setMarkscheme] = useState(false)
  const markschemeButton = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const [walkthrough, setWalkthrough] = useState(false)
  const [hint, setHint] = useState(false)
  const stats = questionStats(saved)
  const sourceUrl = questionSourceUrl(question)
  const result = saved?.submitted ? saved.correct ? 'correct' : 'incorrect' : 'unanswered'
  const removeAnswer = () => { onRetry(question.id); setMarkscheme(false) }
  const toggleReport = () => {
    focusReportNotice.current = !reported
    setViewReported(false)
    setMarkscheme(false)
    onReport(question.id)
  }
  return <section className="qb-card" data-result={result} data-report-hidden={obscured} aria-label={obscured ? `Question ${number} — reported` : undefined} aria-labelledby={obscured ? undefined : `${cardId}-heading`}>
    {reported && viewReported && <div className="qb-report-notice"><span><Flag aria-hidden="true"/>You reported this question. View with caution.</span><button onClick={() => { setViewReported(false); requestAnimationFrame(() => reportViewButton.current?.focus({ preventScroll: true })) }}>Hide question</button></div>}
    <div className="qb-card-content" inert={obscured} aria-hidden={obscured || undefined}>
    <header className="qb-card-header"><div className="qb-meta"><h2 id={`${cardId}-heading`}>Question {number}</h2><span className="qb-score-slot">{saved?.submitted && <span key={result} className="qb-score" data-result={result} aria-label={`${saved.correct ? 1 : 0} out of 1 mark`}><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23" pathLength="1"/></svg><span>{saved.correct ? '1/1' : '0/1'}</span></span>}</span><span className="qb-difficulty" data-level={question.difficulty} aria-label={`${difficultyNames[question.difficulty]} difficulty`}><span className="qb-bars" aria-hidden="true"><i/><i/></span>{question.difficulty[0].toUpperCase()}</span><FirstAttemptRate rate={question.estimatedFirstTryRate}/></div>
      <div className="qb-tools">
        <CalculatorLauncher/>
        <button className="qb-tool qb-erase" aria-label={`Remove answer to question ${number}`} onClick={removeAnswer}><Eraser/></button>
        <Popover><PopoverTrigger asChild><button className="qb-tool qb-result" data-result={saved?.submitted ? saved.correct ? 'correct' : 'incorrect' : 'unanswered'} aria-label="View your result and statistics"><CircleCheck fill="currentColor"/></button></PopoverTrigger><PopoverContent className="qb-help" align="end"><strong>{saved?.submitted ? `${saved.correct ? '1' : '0'} / 1 mark` : 'Not answered yet'}</strong><p>{stats.attempts ? `${stats.correctAttempts} correct out of ${stats.attempts} attempts · ${stats.accuracy}% accuracy` : 'Choose an answer to record your first attempt.'}</p><p>Your attempts save on this device.</p></PopoverContent></Popover>
        <button ref={markschemeButton} className="qb-mark-button" aria-haspopup="dialog" aria-expanded={markscheme} aria-controls={`${cardId}-markscheme`} onClick={() => setMarkscheme(true)}><ListChecks/>Markscheme</button>
        <DropdownMenu><DropdownMenuTrigger asChild><button ref={questionMenuButton} className="qb-tool" aria-label={`More options for question ${number}`}><MoreVertical/></button></DropdownMenuTrigger><DropdownMenuContent align="end" onCloseAutoFocus={event => { if (focusReportNotice.current) { event.preventDefault(); reportViewButton.current?.focus({ preventScroll: true }); focusReportNotice.current = false } }}><DropdownMenuItem onSelect={() => onBookmark(question.id)}><Bookmark/>{bookmarked ? 'Remove question' : 'Save question'}</DropdownMenuItem><DropdownMenuItem onSelect={toggleReport}><Flag/>{reported ? 'Remove report' : 'Report an issue'}</DropdownMenuItem>{sourceUrl ? <DropdownMenuItem asChild><a href={sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Find question ${question.source.questionNumber} in the original paper`}><ExternalLink/>Find question</a></DropdownMenuItem> : <DropdownMenuItem disabled title="This original practice question has no verified past-paper source."><ExternalLink/>Find question</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu>
      </div>
    </header>
    <QuestionBody question={question} number={number} saved={saved} onAnswer={onAnswer}/>
    </div>
    {obscured && <div className="qb-report-overlay"><div><Flag aria-hidden="true"/><h3 id={`${cardId}-report`}>You reported this question</h3><p>It may contain an issue.</p><button ref={reportViewButton} onClick={() => { setViewReported(true); requestAnimationFrame(() => questionMenuButton.current?.focus({ preventScroll: true })) }}>View with caution</button></div></div>}
    
    <Dialog open={markscheme} onOpenChange={setMarkscheme}><DialogContent id={`${cardId}-markscheme`} className="qb-markscheme-dialog ui-floating-panel" overlayClassName="qb-markscheme-overlay" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); markschemeButton.current?.focus() }}><DialogTitle className="sr-only">Markscheme for question {number}</DialogTitle><DialogDescription className="sr-only">The correct answer is shown below.</DialogDescription><Markscheme question={question}/></DialogContent></Dialog>
    <Dialog open={expanded} onOpenChange={setExpanded}><DialogContent className="qb-expanded ui-floating-panel"><DialogTitle>Question {number}</DialogTitle><DialogDescription>{question.level === 'core' ? 'Core' : 'Extended'} · Paper {question.paper} · {difficultyNames[question.difficulty]} · 1 mark</DialogDescription><QuestionBody question={question} number={number} saved={saved} onAnswer={onAnswer}/>{saved?.submitted && <Markscheme question={question}/>}</DialogContent></Dialog>
    <Dialog open={walkthrough} onOpenChange={setWalkthrough}><DialogContent className="qb-worked ui-floating-panel"><DialogTitle>Worked solution</DialogTitle><DialogDescription>Question {number} · {question.topic}</DialogDescription><ol><li><strong>Read the question</strong><p>{question.prompt}</p></li><li><strong>Apply the chemistry</strong><p>{question.explanation}</p></li><li><strong>Choose the answer</strong><p>{String.fromCharCode(65 + question.answer)}. {question.options[question.answer]}</p></li></ol></DialogContent></Dialog>
    <Dialog open={hint} onOpenChange={setHint}><DialogContent className="qb-worked ui-floating-panel"><DialogTitle>A starting point</DialogTitle><DialogDescription>{question.hint || `Think about ${question.topic.toLowerCase()}. Compare each option with what you know before choosing.`}</DialogDescription></DialogContent></Dialog>
  </section>
}

function Pagination({ page, pages, onChange }) {
  const first = Math.max(0, Math.min(page - 1, pages - 3))
  return <nav className="bank-pagination" aria-label="Question bank pages"><button disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft/></button>{Array.from({ length: Math.min(3, pages) }, (_, index) => first + index).map(index => <button key={index} aria-label={`Page ${index + 1}`} aria-current={page === index ? 'page' : undefined} onClick={() => onChange(index)}>{index + 1}</button>)}<button disabled={page === pages - 1} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight/></button></nav>
}

export default function Questions() {
  const [params] = useSearchParams()
  const subject = useSubject()
  const subjectQuestions = subject.id === 'chemistry' ? bankQuestions : []
  const topic = findSubjectTopic(subject, params.get('topic')) || findSubjectTopic(subject, subject.defaultTopic)
  const topicQuestions = questionsForTopic(subjectQuestions, topic.id)
  const { outline, setOutline } = useStudyNavigation()
  const [view, setView] = useLocalStorage(subject.id === 'chemistry' && topic.id === subject.defaultTopic ? 'chemistry-question-bank-view' : subjectStorageKey(subject, `question-bank-view:${topic.id}`), { ...defaultBankFilters, page: 0 })
  const [answers, setAnswers] = useLocalStorage(subjectStorageKey(subject, 'question-answers'), {})
  const [bookmarks, setBookmarks] = useLocalStorage(subjectStorageKey(subject, 'question-bookmarks'), [])
  const [reportedQuestions, setReportedQuestions] = useLocalStorage(subjectStorageKey(subject, 'reported-questions'), [])
  const [, setProgress] = useLocalStorage('chemistry-progress', defaultProgress)
  const [flow, setFlow] = useState(null)
  const pane = useRef(null)
  const filters = Object.fromEntries(Object.entries(defaultBankFilters).map(([key]) => [key, filterOptions[key].some(([value]) => value === (view[key] ?? (key === 'difficulty' ? view.filter : undefined))) ? view[key] ?? view.filter : 'all']))
  const filtered = filterQuestionBank(topicQuestions, filters, answers, bookmarks)
  const pages = Math.max(1, Math.ceil(filtered.length / QUESTIONS_PER_PAGE))
  const page = Number.isInteger(view.page) ? Math.max(0, Math.min(view.page, pages - 1)) : 0
  const start = page * QUESTIONS_PER_PAGE
  const visible = filtered.slice(start, start + QUESTIONS_PER_PAGE)
  const flowQuestion = flow && subjectQuestions.find(question => question.id === flow.ids[flow.index])

  useEffect(() => { pane.current?.scrollTo({ top: 0, behavior: 'instant' }) }, [subject.id, topic.id, page, filters.paper, filters.level, filters.difficulty, filters.completion])
  useEffect(() => { setFlow(null) }, [subject.id, topic.id])

  const answer = (question, selected) => {
    const next = selectQuestionAnswer(question, selected, answers[question.id])
    setAnswers(current => ({ ...current, [question.id]: selectQuestionAnswer(question, selected, current[question.id]) }))
    if (next?.submitted) setProgress(current => awardQuestion(current, question.id, next.correct))
  }
  const retry = id => setAnswers(current => ({ ...current, [id]: clearQuestionAnswer(current[id]) }))
  const bookmark = id => setBookmarks(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const toggleReport = id => setReportedQuestions(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const resetFilters = () => setView({ ...defaultBankFilters, page: 0 })
  const startFlow = () => {
    const unanswered = filtered.filter(question => !answers[question.id]?.submitted)
    setFlow({ ids: (unanswered.length ? unanswered : filtered).map(question => question.id), index: 0 })
  }
  const cardProps = question => ({ question, number: topicQuestions.findIndex(item => item.id === question.id) + 1, saved: answers[question.id], onAnswer: answer, onRetry: retry, bookmarked: bookmarks.includes(question.id), onBookmark: bookmark, reported: reportedQuestions.includes(question.id), onReport: toggleReport })

  return <CalculatorProvider><StudyShell active="questions" outline={outline}>
    <RevisionGuideToggle open={outline} onToggle={() => setOutline(!outline)}/>
    <aside id="revision-navigation" className={`lesson-outline ${outline ? 'expanded' : ''}`} aria-label="Revision Guide" aria-hidden={!outline} inert={!outline}><RevisionOutline mode="questions" activeTopic={topic.id}/></aside>
    <main className="notes-main practice-main qb-main" ref={pane} tabIndex={0} aria-label="Question bank">
      <div className="study-content bank-content qb-content">
        <h1 className="study-page-title">{topic.id} {topic.title}</h1>
        <div className="qb-filters">{Object.keys(defaultBankFilters).map(name => <BankFilter key={name} name={name} value={filters[name]} onChange={value => setView({ ...filters, [name]: value, page: 0 })}/>)}<DropdownMenu><DropdownMenuTrigger asChild><button className="qb-filter-menu" aria-label="Question bank options"><MoreHorizontal/></button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={resetFilters}><RotateCcw/>Reset filters</DropdownMenuItem><DropdownMenuItem onSelect={() => setView({ ...defaultBankFilters, completion: 'bookmarked', page: 0 })}><Bookmark/>Show bookmarks</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
        {topicQuestions.length > 0 && <div className="qb-flow-banner"><FlowIcon/><p>Try answering questions in <em>flow</em> mode</p><button disabled={!filtered.length} onClick={startFlow}>Start<ChevronRight/></button></div>}
        {visible.length ? <><div className="qb-list">{visible.map(question => <QuestionCard key={question.id} {...cardProps(question)}/>)}</div><footer className="bank-footer"><Pagination page={page} pages={pages} onChange={next => setView({ ...filters, page: next })}/></footer></> : <div className="qb-empty"><BookOpen/><h2>{topicQuestions.length ? 'No questions match these filters' : 'No questions for this topic yet'}</h2><p>{topicQuestions.length ? 'Choose another paper, level or completion status.' : `Questions added to ${topic.id} will appear here.`}</p>{topicQuestions.length ? <button onClick={resetFilters}>Reset filters</button> : <Link to={subjectHref(subject, 'notes', topic.id)}>Read the revision guide</Link>}</div>}
      </div>
    </main>
    <Dialog open={flow !== null} onOpenChange={open => { if (!open) setFlow(null) }}><DialogContent className="qb-flow-dialog ui-floating-panel"><DialogTitle>Flow mode</DialogTitle><DialogDescription>{flowQuestion ? `Question ${flow.index + 1} of ${flow.ids.length}. Take one question at a time.` : 'You’ve reached the end of this set.'}</DialogDescription>{flowQuestion ? <><QuestionCard key={flowQuestion.id} {...cardProps(flowQuestion)}/><div className="qb-flow-controls"><button disabled={flow.index === 0} onClick={() => setFlow(current => ({ ...current, index: current.index - 1 }))}><ChevronLeft/>Previous</button><button onClick={() => setFlow(current => ({ ...current, index: current.index + 1 }))}>{answers[flowQuestion.id]?.submitted ? flow.index === flow.ids.length - 1 ? 'Finish' : 'Next question' : 'Skip'}<ChevronRight/></button></div></> : <div className="qb-flow-finished"><CircleCheck/><h2>{flow ? flow.ids.filter(id => answers[id]?.submitted && answers[id].correct).length : 0} of {flow?.ids.length || 0} correct</h2><p>Your answers and progress have been saved.</p><button onClick={() => setFlow(null)}>Back to question bank</button></div>}</DialogContent></Dialog>
  </StudyShell></CalculatorProvider>
}
