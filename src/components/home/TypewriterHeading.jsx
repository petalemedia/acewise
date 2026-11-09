import { useEffect, useState } from 'react'

const words = ['study', 'learn', 'understand', 'revise', 'discover', 'practise', 'remember', 'explore']

export default function TypewriterHeading() {
  const [text, setText] = useState(words[0])

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer
    const start = () => {
      clearTimeout(timer)
      setText(words[0])
      if (motion.matches) return
      let wordIndex = 0
      let length = words[0].length
      let deleting = true
      const tick = () => {
        if (deleting) {
          length -= 1
          setText(words[wordIndex].slice(0, length))
          if (length === 0) {
            wordIndex = (wordIndex + 1) % words.length
            deleting = false
            timer = setTimeout(tick, 450)
            return
          }
        } else {
          length += 1
          setText(words[wordIndex].slice(0, length))
          if (length === words[wordIndex].length) {
            deleting = true
            timer = setTimeout(tick, 3200)
            return
          }
        }
        timer = setTimeout(tick, deleting ? 80 : 135)
      }
      timer = setTimeout(tick, 3200)
    }
    start()
    motion.addEventListener('change', start)
    return () => { clearTimeout(timer); motion.removeEventListener('change', start) }
  }, [])

  return <h1 className="home-typewriter-heading" aria-label="A clearer way to study, learn and understand."><span aria-hidden="true">A clearer way</span><span className="home-typewriter-line" aria-hidden="true"><span>to </span><span className="home-typewriter-word">{text}{words.includes(text) ? '.' : ''}</span></span></h1>
}
