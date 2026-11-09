import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Spark, Flame } from '@/components/study/StudyIcons'
import { isStudyFeatureEnabled } from '@/lib/study-features'
import './auth-modal.css'

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isRegister = authModalMode === 'register'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isRegister) {
        if (!username.trim()) {
          throw new Error('Please choose a username.')
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long.')
        }
        await register(username.trim(), email.trim(), password)
      } else {
        await login(email.trim(), password)
      }
      // Reset form
      setUsername('')
      setEmail('')
      setPassword('')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Something went wrong. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const switchMode = (mode) => {
    setError('')
    setAuthModalMode(mode)
  }

  const showGamification = isStudyFeatureEnabled('xp') || isStudyFeatureEnabled('streaks')

  return (
    <Dialog open={authModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="auth-dialog-content">
        <DialogHeader className="auth-header">
          {showGamification && (
            <div className="auth-badge-row">
              {isStudyFeatureEnabled('xp') && (
                <span className="auth-badge xp-badge">
                  <Spark className="w-3.5 h-3.5 text-amber-500" />
                  <span>Track XP</span>
                </span>
              )}
              {isStudyFeatureEnabled('streaks') && (
                <span className="auth-badge streak-badge">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>Daily Streak</span>
                </span>
              )}
            </div>
          )}
          <DialogTitle className="auth-title">
            {isRegister ? 'Create your study account' : 'Welcome back'}
          </DialogTitle>
          <DialogDescription className="auth-description">
            {isRegister
              ? (showGamification
                  ? 'Save your progress, maintain daily streaks, and level up your XP across all your devices.'
                  : 'Save your progress, bookmarks, and question answers across all your devices.')
              : (showGamification
                  ? 'Sign in to access your study streak, earned XP, and saved answers.'
                  : 'Sign in to access your saved progress, bookmarks, and answers.')}
          </DialogDescription>
        </DialogHeader>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Create Account
          </button>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="auth-field">
              <label htmlFor="auth-username">Username</label>
              <input
                id="auth-username"
                type="text"
                placeholder="e.g. ScienceWhiz"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="auth-policy-note">By creating an account, you agree to the <Link to="/terms" onClick={closeAuthModal}>Terms of Use</Link>. Read how we handle your information in our <Link to="/privacy" onClick={closeAuthModal}>Privacy Policy</Link>.</p>
        <div className="auth-footer-prompt">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')}>
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button type="button" onClick={() => switchMode('register')}>
                Create one
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
