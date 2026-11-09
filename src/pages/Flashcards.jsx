import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react'
import { StudyShell } from '@/components/study/StudyShell'
import { useLocalStorage } from '@/lib/use-local-storage'
import { flashcards } from '@/data/chemistry-practice'
import { defaultChemistryTopic } from '@/data/chemistry-syllabus'

export default function Flashcards() {
  const [order, setOrder] = useLocalStorage('chemistry-flashcard-order', flashcards.map(card => card.id))
  const [position, setPosition] = useLocalStorage('chemistry-flashcard-position', 0)
  const [ratings, setRatings] = useLocalStorage('chemistry-flashcard-ratings', {})
  const [flipped, setFlipped] = useState(false)
  const [finished, setFinished] = useState(false)
  const orderedCards = order.map(id => flashcards.find(card => card.id === id)).filter(Boolean)
  const cards = orderedCards.length ? orderedCards : flashcards
  const index = Math.min(Math.max(position, 0), cards.length - 1)
  const card = cards[index] || flashcards[0]
  const known = flashcards.filter(item => ratings[item.id] === 'known').length
  useEffect(() => { setFlipped(false) }, [card.id])
  const goTo = value => { setPosition(value); setFinished(false) }
  const rate = value => {
    setRatings(current => ({ ...current, [card.id]: value }))
    if (index < cards.length - 1) goTo(index + 1)
    else setFinished(true)
  }
  const shuffle = () => {
    const next = flashcards.map(item => item.id)
    for (let i = next.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [next[i], next[j]] = [next[j], next[i]] }
    setOrder(next); setPosition(0); setFlipped(false); setFinished(false)
  }
  return <StudyShell active="flashcards"><main className="notes-main flashcards-main" tabIndex={0} aria-label="Chemistry flashcards"><div className="study-content flashcards-content">
    <header className="flashcards-page-heading"><h1 className="study-page-title">{defaultChemistryTopic.id} {defaultChemistryTopic.title}</h1><div><p>Try to recall the answer before turning the card.</p><button className="shuffle-cards" onClick={shuffle}><Shuffle/>Shuffle</button></div></header>
    <div className="flashcard-progress"><span>{finished ? 'Round complete' : `Card ${index + 1} of ${cards.length}`}</span><div>{cards.map((item, i) => <button key={item.id} aria-label={`Go to card ${i + 1}`} aria-current={i === index ? 'step' : undefined} data-known={ratings[item.id] === 'known'} onClick={() => goTo(i)}/>)}</div><span>{known} remembered</span></div>
    {finished ? <section className="practice-finished"><div className="finished-icon"><Check/></div><h2>{known} of {flashcards.length} remembered</h2><p>{known === flashcards.length ? 'All key ideas covered. Come back later to see what stays with you.' : 'Give the ideas that need another look a little more practice.'}</p><div><button className="practice-primary" onClick={() => goTo(Math.max(0, cards.findIndex(item => ratings[item.id] !== 'known')))}>Review again <RotateCcw/></button><Link className="practice-secondary" to="/questions">Try questions <ArrowRight/></Link></div></section> : <>
      <button className={`flashcard ${flipped ? 'is-flipped' : ''}`} aria-label={flipped ? 'Show question' : 'Reveal answer'} aria-pressed={flipped} onClick={() => setFlipped(!flipped)}>
        <div className="flashcard-inner"><div className="flashcard-face flashcard-front" aria-hidden={flipped}><span className="flashcard-face-label">THINK IT THROUGH</span><h2>{card.front}</h2><span className="flashcard-tap">Click to reveal <RotateCcw/></span></div><div className="flashcard-face flashcard-back" aria-hidden={!flipped}><span className="flashcard-face-label">THE KEY IDEA</span><p>{card.back}</p><span className="flashcard-tap">Click to turn back <RotateCcw/></span></div></div>
      </button>
      <div className="flashcard-rating">{flipped ? <><button className="practice-secondary" onClick={() => rate('again')}><RotateCcw/>Again</button><button className="practice-primary remembered-button" onClick={() => rate('known')}><Check/>Got it</button></> : <span>Recall it first, then check your answer.</span>}</div>
      <div className="flashcard-navigation"><button aria-label="Previous flashcard" disabled={index === 0} onClick={() => goTo(index - 1)}><ChevronLeft/></button><Link to="/notes">Need a refresher? Read the guide <ArrowRight/></Link><button aria-label="Next flashcard" disabled={index === cards.length - 1} onClick={() => goTo(index + 1)}><ChevronRight/></button></div>
    </>}
    <p className="practice-save-note">Your recall progress is saved on this device.</p>
  </div></main></StudyShell>
}
