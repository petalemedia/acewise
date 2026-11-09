import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudyTopbar } from '@/components/study/StudyTopbar'
import { subjectHref } from '@/data/subjects'
import LegalLinks from '@/components/legal/LegalLinks'
import SubjectCarousel from '@/components/home/SubjectCarousel'
import TypewriterHeading from '@/components/home/TypewriterHeading'
import './home.css'

export default function Home() {
  const navigate = useNavigate()
  const [launching, setLaunching] = useState(null)
  const loadingPanel = useRef(null)
  useEffect(() => {
    if (!launching) return
    loadingPanel.current?.focus({ preventScroll: true })
    const timer = setTimeout(() => {
      try { localStorage.setItem('study-last-subject', JSON.stringify(launching.id)) } catch { /* Navigation works without browser storage. */ }
      navigate(subjectHref(launching))
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : 700)
    const cancel = event => { if (event.key === 'Escape') setLaunching(null) }
    window.addEventListener('keydown', cancel)
    return () => { clearTimeout(timer); window.removeEventListener('keydown', cancel) }
  }, [launching, navigate])
  return <div className="home-workspace">
    <div className="home-ambience" aria-hidden="true"><span/><span/><span/></div>
    <div className="home-surface" inert={Boolean(launching)}>
      <StudyTopbar home homePage/>
      <main className="home-main"><header className="home-introduction"><TypewriterHeading/><p>Your science notes, topic questions and revision tools.<br className="home-desktop-break"/> Choose a subject and make a start.</p></header>
        <SubjectCarousel onOpen={setLaunching} disabled={Boolean(launching)}/>
      </main>
      <LegalLinks/>
    </div>
    {launching && <div className="home-launch-overlay" ref={loadingPanel} tabIndex={-1} role="status" aria-live="polite" aria-label={`Loading ${launching.title} app`}><div className="home-launch-mark" aria-hidden="true"><img src="/favicon.png" width="80" height="80" alt="" draggable={false}/><span className="home-launch-track"><span/></span></div></div>}
  </div>
}
