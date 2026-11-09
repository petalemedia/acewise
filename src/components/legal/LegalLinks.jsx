import { Link } from 'react-router-dom'
import { CookieSettingsButton } from './CookieConsent'

export default function LegalLinks() {
  return <nav className="legal-links" aria-label="Website policies"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/cookies">Cookies</Link><CookieSettingsButton/><Link to="/contact">Contact</Link></nav>
}
