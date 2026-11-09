import './public-topbar.css'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, LogIn, LogOut, Phone } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spark, Flame } from './StudyIcons'
import { defaultProgress, useLocalStorage } from '@/lib/use-local-storage'
import { DropdownSurfaceItem } from '@/components/ui/dropdown-surface'
import HomeNavigation from '@/components/home/HomeNavigation'
import { useAuth } from '@/lib/auth-context'
import { isStudyFeatureEnabled } from '@/lib/study-features'

const hoverPopoverClosers = new Set()

function AnimatedXpValue({ value }) {
  const [digits, setDigits] = useState(() => String(value).split(''))
  const [animatingIndex, setAnimatingIndex] = useState(null)
  const previousValue = useRef(null)

  useEffect(() => {
    if (previousValue.current === null) {
      previousValue.current = value
      setDigits(String(value).split(''))
      return
    }

    const from = previousValue.current
    previousValue.current = value
    if (value - from !== 5 || String(from).length !== String(value).length) {
      setAnimatingIndex(null)
      setDigits(String(value).split(''))
      return
    }

    let cancelled = false
    const pause = () => new Promise(resolve => setTimeout(resolve, 175))
    const roll = async () => {
      const current = String(from).split('')
      for (let next = from + 1; next <= value && !cancelled; next += 1) {
        const target = String(next).split('')
        const changedIndexes = target.map((digit, index) => digit !== current[index] ? index : -1).filter(index => index !== -1).reverse()
        for (const index of changedIndexes) {
          current[index] = target[index]
          setAnimatingIndex(index)
          setDigits([...current])
          await pause()
        }
      }
      if (!cancelled) setAnimatingIndex(null)
    }
    roll()
    return () => { cancelled = true }
  }, [value])

  return <span className="xp-value" aria-live="polite" aria-atomic="true">{digits.map((digit, index) => <span className={`xp-digit ${animatingIndex === index ? 'is-rolling' : ''}`} key={`${index}-${digit}`}>{digit}</span>)}</span>
}

function HoverPopover({ trigger, children, contentClassName, ...contentProps }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(null)
  const pinned = useRef(false)
  const closeSelf = () => {
    clearTimeout(closeTimer.current)
    pinned.current = false
    setOpen(false)
  }
  const openSelf = () => {
    hoverPopoverClosers.forEach(close => { if (close !== closeSelf) close() })
    clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const cancelClose = () => clearTimeout(closeTimer.current)
  const scheduleClose = event => {
    if (event.pointerType !== 'mouse' || pinned.current) return
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }
  const lockOpen = event => {
    if (event.pointerType !== 'mouse') return
    cancelClose()
    hoverPopoverClosers.forEach(close => { if (close !== closeSelf) close() })
    pinned.current = true
    setOpen(true)
    event.preventDefault()
  }
  const changeOpen = next => {
    cancelClose()
    if (!next) pinned.current = false
    setOpen(next)
  }
  useEffect(() => {
    hoverPopoverClosers.add(closeSelf)
    return () => {
      hoverPopoverClosers.delete(closeSelf)
      clearTimeout(closeTimer.current)
    }
  })
  return <Popover open={open} onOpenChange={changeOpen} modal={false}>
    <PopoverTrigger asChild onPointerEnter={event => { if (event.pointerType === 'mouse') openSelf() }} onPointerLeave={scheduleClose} onPointerDown={lockOpen} onClick={event => {
      if (pinned.current) {
        event.preventDefault()
        event.stopPropagation()
      }
    }}>
      {trigger}
    </PopoverTrigger>
    <PopoverContent {...contentProps} className={contentClassName} onPointerEnter={cancelClose} onPointerLeave={scheduleClose} onOpenAutoFocus={event => event.preventDefault()} onCloseAutoFocus={event => event.preventDefault()}>
      {children}
    </PopoverContent>
  </Popover>
}

export function StudyTopbar({ menu, home = false, homePage = false }) {
  const navigate = useNavigate()
  const [signoutError, setSignoutError] = useState('')
  const [progress] = useLocalStorage('chemistry-progress', defaultProgress)
  const { user, profile, logout, openAuthModal } = useAuth()

  const currentXp = profile?.xp ?? progress.xp
  const currentStreak = profile?.streak ?? progress.streak
  const username = profile?.username || user?.name || ''
  const initial = username ? username.charAt(0).toUpperCase() : 'U'

  return (
    <header className={`topbar ${home ? 'home-topbar' : ''} ${homePage ? 'homepage-topbar' : ''}`}>
      {home ? (
        <Link to="/" className="home-brand" aria-label="AceWise home">
          <img className="home-brand-mascot" src="/favicon.png" alt="" width="56" height="56" draggable={false} />
          <span className="home-wordmark"><img src="/logo.png" alt="AceWise" width="2172" height="724" draggable={false}/></span>
        </Link>
      ) : (
        <button className="icon-button" aria-label="Back to workspace" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
      )}

      {home && <HomeNavigation/>}
      <div className="topbar-right">
        {menu}

        {isStudyFeatureEnabled('xp') && (
          <HoverPopover trigger={
              <button className="stat" aria-label={`${currentXp} experience points`}>
                <Spark className="xp-icon" />
                <span>
                  <AnimatedXpValue value={currentXp}/>
                  <span className="xp-label">XP</span>
                </span>
              </button>
            } contentClassName="shared-dropdown topbar-dropdown" align="center" sideOffset={8}>
              <div className="topbar-dropdown-summary"><h3>{currentXp} XP</h3><p>Earn XP as you study.</p></div>
            </HoverPopover>
        )}

        {isStudyFeatureEnabled('streaks') && (
          <HoverPopover trigger={
              <button className="stat" aria-label={`${currentStreak} day study streak`}>
                <span className="flame-icon"><Flame /></span>
                {currentStreak}
              </button>
            } contentClassName="shared-dropdown topbar-dropdown" align="center" sideOffset={8}>
              <div className="topbar-dropdown-summary"><h3>{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</h3><p>Visit each day to keep your streak.</p></div>
            </HoverPopover>
        )}

        <HoverPopover trigger={
            <button className="avatar-button" aria-label="Your profile">
              <span className="profile-initial" aria-hidden="true">{initial}</span>
            </button>
          } align="center" sideOffset={8} contentClassName="shared-dropdown topbar-dropdown profile-dropdown">
            {user ? <>
              <div className="topbar-dropdown-summary"><h3>{username}</h3><p>{user.email}</p>{signoutError && <p role="alert">{signoutError}</p>}</div>
              <DropdownSurfaceItem as={Link} to="/contact"><Phone/>Contact support</DropdownSurfaceItem>
              <DropdownSurfaceItem as="button" className="profile-signout" onClick={() => { setSignoutError(''); void logout().catch(() => setSignoutError('Could not sign out. Try again.')) }}><LogOut/>Sign out</DropdownSurfaceItem>
            </> : <>
              <DropdownSurfaceItem as="button" onClick={() => openAuthModal('login')}><LogIn/>Sign in</DropdownSurfaceItem>
              <DropdownSurfaceItem as="button" onClick={() => openAuthModal('register')}>Create account</DropdownSurfaceItem>
            </>}
          </HoverPopover>
      </div>
    </header>
  )
}
