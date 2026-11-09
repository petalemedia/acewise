import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { useLocalStorage } from '@/lib/use-local-storage'
import './legal.css'

export function CookieSettingsButton({ children = 'Cookie settings' }) {
  return <button type="button" onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}>{children}</button>
}

export default function CookieConsent() {
  const [choice, setChoice] = useLocalStorage('study-cookie-choice', null)
  const [now] = useState(Date.now)
  const [reopened, setReopened] = useState(false)
  const { authModalOpen } = useAuth()
  useEffect(() => {
    const open = () => setReopened(true)
    window.addEventListener('open-cookie-settings', open)
    return () => window.removeEventListener('open-cookie-settings', open)
  }, [])
  const valid = choice?.version === 1 && now - choice.savedAt < 180 * 86400000
  const choose = optional => { setChoice({ version: 1, optional, savedAt: Date.now() }); setReopened(false) }
  if (authModalOpen || valid && !reopened) return null
  return <section className="cookie-consent" aria-label="Cookie choices">
    <img src="/cookiesicon.png" width="88" height="88" alt="" draggable={false}/>
    <h2>A little note about cookies</h2>
    <p>This site uses cookie tracking technologies. Learn more in our <Link to="/cookies">Cookie Policy</Link>.</p>
    <div className="cookie-consent-actions"><button onClick={() => choose(false)}>Reject optional</button><button onClick={() => choose(true)}>Allow</button></div>
  </section>
}
