import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import { Bookmark, Check, ChevronsUpDown, Download, Highlighter, Link as LinkIcon, Minus, Plus } from 'lucide-react'
import 'react-pdf/dist/Page/TextLayer.css'
import { StudyShell } from '@/components/study/StudyShell'
import { useStudyNavigation } from '@/components/study/StudyNavigation'
import RevisionOutline from '@/components/notes/RevisionOutline'
import RevisionGuideToggle from '@/components/notes/RevisionGuideToggle'
import { defaultChemistryTopic, findChemistryTopic } from '@/data/chemistry-syllabus'
import { worksheetsForTopic } from '@/data/worksheets'
import { getWorksheetFile } from '@/lib/worksheet-preload'
import WorksheetCover from '@/components/worksheets/WorksheetCover'
import { useLocalStorage } from '@/lib/use-local-storage'
import { useNoteHighlights } from '@/lib/use-note-highlights'
import { maximumPdfZoom, minimumPdfZoom, usePdfViewport } from '@/lib/use-pdf-viewport'
import { highlightColors } from '@/lib/note-highlights'
import { HighlightEditor, SavedHighlights } from '@/components/notes/HighlightTools'
import { Notifications, useNotifications } from '@/components/notes/Notifications'
import FindQuestionsButton from '@/components/questions/FindQuestionsButton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import './worksheets.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
const pdfOptions = { standardFontDataUrl: '/pdfjs/standard_fonts/' }
const difficulties = ['all', 'easy', 'medium', 'hard']

export default function Worksheets() {
  const [params, setParams] = useSearchParams()
  const topic = findChemistryTopic(params.get('topic')) || defaultChemistryTopic
  const { outline, setOutline } = useStudyNavigation()
  const [difficulty, setDifficulty] = useState('all')
  const [toolbarHost, setToolbarHost] = useState(null)
  const scrollPane = useRef(null)
  const available = worksheetsForTopic(topic.id)
  const filtered = available.filter(item => difficulty === 'all' || item.difficulty === difficulty)
  const selected = filtered.find(item => item.id === params.get('worksheet')) || filtered[0]

  useEffect(() => { setDifficulty('all'); if (scrollPane.current) scrollPane.current.scrollTop = 0 }, [topic.id])
  const choose = worksheet => {
    setParams({ topic: topic.id, worksheet: worksheet.id }, { replace: true })
  }

  return <StudyShell active="worksheets" outline={outline}>
    <RevisionGuideToggle open={outline} onToggle={() => setOutline(!outline)}/>
    <aside id="revision-navigation" className={`lesson-outline ${outline ? 'expanded' : ''}`} aria-label="Revision guides" aria-hidden={!outline} inert={!outline}>
      <RevisionOutline activeTopic={topic.id} mode="worksheets"/>
    </aside>
    <main className="notes-main worksheets-main" ref={scrollPane}>
      <div className="worksheet-layout">
        <section className="worksheet-shelf" aria-label="Choose a worksheet">
          <div className="study-content">
            <div className="worksheet-heading-row">
              <h1 className="study-page-title">{topic.id} {topic.title}</h1>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="qb-filter-trigger worksheet-difficulty-trigger" aria-label="Worksheet difficulty"><SelectValue/><ChevronsUpDown aria-hidden="true"/></SelectTrigger>
                <SelectContent>{difficulties.map(value => <SelectItem key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {available.length > 0 && <div className="worksheet-picker">
              <TooltipProvider delayDuration={250}><div className="worksheet-strip" tabIndex={0} aria-label="Worksheets">
                {filtered.map(item => <button key={item.id} className="worksheet-preview" aria-label={`${topic.id} ${item.title} worksheet`} aria-pressed={selected?.id === item.id} onClick={() => choose(item)}>
                  <WorksheetCover topic={topic} worksheet={item}/>
                  <Tooltip><TooltipTrigger asChild><span className={`worksheet-difficulty ${item.difficulty}`} aria-label={`${item.difficulty} difficulty`}><i/><i/><i/></span></TooltipTrigger><TooltipContent side="top">{item.difficulty[0].toUpperCase() + item.difficulty.slice(1)} difficulty</TooltipContent></Tooltip>
                </button>)}
              </div></TooltipProvider>
            </div>}
          </div>
        </section>
        {selected ? <WorksheetReader key={selected.id} worksheet={selected} topic={topic} scrollPane={scrollPane} toolbarHost={toolbarHost}/> : <div className="study-content worksheet-empty"><h2>No worksheets yet</h2><p>Worksheets for {topic.id} {topic.title} will appear here when they’re added.</p></div>}
      </div>
    </main>
    <div className="annotation-dock" ref={setToolbarHost}/>
  </StudyShell>
}

function WorksheetReader({ worksheet, topic, scrollPane, toolbarHost }) {
  const pdfFile = useMemo(() => getWorksheetFile(worksheet.file), [worksheet.file])
  const article = useRef(null)
  const selection = useRef(null)
  const [pages, setPages] = useState(0)
  const [width, setWidth] = useState(700)
  const [zoom, setZoom] = useState(1)
  const [renderVersion, setRenderVersion] = useState(0)
  const [error, setError] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)
  const [highlights, setHighlights] = useLocalStorage(`worksheet-highlights:${worksheet.id}`, [])
  const [color, setColor] = useLocalStorage('highlight-color', 'yellow')
  const tools = useNoteHighlights({ article, scrollPane, highlights, setHighlights, color, selection, contentVersion: renderVersion })
  const pdfViewport = usePdfViewport({ viewport: article, scrollPane, zoom, setZoom, width })
  const { notifications, notify, dismiss } = useNotifications()
  const onTextRendered = useCallback(() => setRenderVersion(value => value + 1), [])

  useEffect(() => {
    const node = article.current
    const observer = new ResizeObserver(entries => setWidth(Math.floor(entries[0].contentRect.width)))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const copyLink = async () => {
    try {
      const url = new URL('/worksheets', window.location.origin)
      url.searchParams.set('topic', topic.id)
      url.searchParams.set('worksheet', worksheet.id)
      await navigator.clipboard.writeText(url.href)
      notify('Link copied to clipboard')
    } catch { notify('Could not copy the link. Please try again.') }
  }

  return <>
    <section className="worksheet-reader" aria-label={`${worksheet.title} PDF worksheet`}>
      <div className="study-content worksheet-reader-controls">
        <span>{worksheet.title}{pages > 0 && ` · ${pages} pages`}</span>
        <div>
          <button className="icon-button" aria-label="Zoom out" disabled={zoom <= minimumPdfZoom} onClick={() => pdfViewport.zoomTo(zoom - .25)}><Minus/></button>
          <button className="worksheet-zoom" aria-label="Reset PDF zoom to 100%" onClick={() => pdfViewport.zoomTo(1)}>{Math.round(zoom * 100)}%</button>
          <button className="icon-button" aria-label="Zoom in" disabled={zoom >= maximumPdfZoom} onClick={() => pdfViewport.zoomTo(zoom + .25)}><Plus/></button>
          <button className="icon-button" aria-label="Saved worksheet highlights" onClick={() => setSavedOpen(true)}><Bookmark/></button>
          <a className="icon-button" href={worksheet.file} download aria-label="Download worksheet PDF"><Download/></a>
        </div>
      </div>
      <article ref={article} data-pan={pdfViewport.panning ? 'active' : pdfViewport.spaceHeld ? 'ready' : undefined} tabIndex={0} aria-label="Worksheet PDF" aria-description="Use Ctrl or Command and the mouse wheel to zoom. Hold Space and drag, or use the middle mouse button, to pan." className={`study-content worksheet-document ${tools.mode ? 'highlight-mode' : ''}`} {...tools.articleProps} style={{ ...tools.articleProps.style, '--pdf-page-width': `${Math.max(200, width * zoom)}px`, cursor: pdfViewport.panning ? 'grabbing' : pdfViewport.spaceHeld ? 'grab' : tools.articleProps.style.cursor }}>
        <Document file={pdfFile} options={pdfOptions} onLoadSuccess={({ numPages }) => { setPages(numPages); setError(false) }} onLoadError={() => setError(true)} loading={null} error={<div className="worksheet-load-error" role="alert">This PDF couldn’t be loaded. <a href={worksheet.file}>Open the PDF</a></div>}>
          {Array.from({ length: pages }, (_, index) => <WorksheetPdfPage key={index} pageNumber={index + 1} width={Math.max(200, width * zoom)} onTextRendered={onTextRendered}/>)}
        </Document>
      </article>
    </section>
    {!error && toolbarHost && createPortal(<div className="annotation-toolbar" aria-label="Worksheet tools">
      <button className="highlight-toggle" aria-pressed={tools.mode} onMouseDown={event => event.preventDefault()} onClick={tools.toggleMode}><Highlighter/><span>Highlight</span></button>
      <Popover><PopoverTrigger asChild><button className="color-picker" aria-label="Highlight colour" onMouseDown={event => event.preventDefault()}><span className={`color-dot ${color}`}/></button></PopoverTrigger><PopoverContent side="top" sideOffset={10} className="color-popover" aria-label="Highlight colours" onOpenAutoFocus={event => event.preventDefault()}><div role="group" aria-label="Choose highlight colour">{highlightColors.map(value => <button key={value} aria-label={`${value === 'mint' ? 'green' : value} highlight`} aria-pressed={color === value} className={`color-dot ${value}`} onMouseDown={event => event.preventDefault()} onClick={() => setColor(value)}>{color === value && <span className="swatch-check"><Check/></span>}</button>)}</div></PopoverContent></Popover>
      <button onClick={copyLink}><LinkIcon/><span>Copy link</span></button>
      <FindQuestionsButton topicId={topic.id}/>
    </div>, toolbarHost)}
    <span className="sr-only" role="status">{tools.mode ? 'Highlight mode on. Select PDF text to save it automatically.' : 'Highlight mode off. Click a saved highlight to edit it.'}</span>
    <HighlightEditor tools={tools}/>
    <SavedHighlights tools={tools} open={savedOpen} onOpenChange={setSavedOpen} contentLabel="worksheet"/>
    <Notifications items={notifications} onDismiss={dismiss}/>
  </>
}

function WorksheetPdfPage({ pageNumber, width, onTextRendered }) {
  const canvas = useRef(null)
  const preview = useRef(null)
  const [ratio, setRatio] = useState(842 / 595)
  const [renderWidth, setRenderWidth] = useState(width)
  const onLoad = useCallback(page => setRatio(page.originalHeight / page.originalWidth), [])
  const onRendered = useCallback(() => preview.current?.replaceChildren(), [])
  // Resize the current canvas/text layer immediately, then sharpen the PDF when
  // a pinch settles. This avoids blank flashes and repeated expensive renders.
  useEffect(() => {
    if (width === renderWidth) return
    const timer = setTimeout(() => {
      const source = canvas.current
      const rect = source?.getBoundingClientRect()
      if (source?.width && source.height && source.style.visibility !== 'hidden' && rect.bottom > 0 && rect.top < window.innerHeight) {
        const copy = document.createElement('canvas')
        copy.width = source.width
        copy.height = source.height
        copy.getContext('2d').drawImage(source, 0, 0)
        preview.current?.replaceChildren(copy)
      }
      setRenderWidth(width)
    }, 120)
    return () => clearTimeout(timer)
  }, [width, renderWidth])
  return <div className="worksheet-pdf-page" data-pdf-page={pageNumber} style={{ width, height: width * ratio }}>
    <div className="worksheet-pdf-render" style={{ width: renderWidth, transform: `scale(${width / renderWidth})` }}>
      <Page pageNumber={pageNumber} width={renderWidth} canvasRef={canvas} onLoadSuccess={onLoad} onRenderSuccess={onRendered} renderAnnotationLayer={false} onRenderTextLayerSuccess={onTextRendered} loading={null}/>
    </div>
    <div className="worksheet-pdf-preview" ref={preview} aria-hidden="true"/>
  </div>
}
