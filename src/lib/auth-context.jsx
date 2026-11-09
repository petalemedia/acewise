import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { account, databases, DATABASE_ID, COLLECTION_PROFILES_ID, ID, Query, Permission, Role } from './appwrite'
import { defaultProgress, readStudyValue, writeStudyValue, setStorageOwner, snapshotStudyEntries, restoreStudyEntries } from './use-local-storage'
import { syncedStudyKeys, mergeStudyEntries, cloudPreferences } from './study-cloud-progress'

const AuthContext = createContext(null)
const dateString = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const today = () => dateString(new Date())
const profileFrom = user => {
  const progress = readStudyValue('chemistry-progress', defaultProgress)
  const entries = snapshotStudyEntries()
  const answeredCount = syncedStudyKeys.filter(key => key.endsWith('-question-answers')).reduce((total, key) => total + Object.values(entries[key]?.value || {}).filter(answer => answer?.submitted).length, 0)
  const notes = new Set(syncedStudyKeys.filter(key => key.endsWith('-completed-topics')).flatMap(key => (entries[key]?.value || []).map(id => `${key}:${id}`)))
  if (progress.completed) notes.add('chemistry-completed-topics:11.1')
  return { answeredCount, completedNoteCount: notes.size, username: user.name || user.email.split('@')[0], xp: progress.xp, streak: progress.streak, lastLoginDate: progress.lastStudied }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true), [syncStatus, setSyncStatus] = useState('local'), [syncError, setSyncError] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false), [authModalMode, setAuthModalMode] = useState('login')
  const current = useRef(null), hydrated = useRef(false), timer = useRef(null), pending = useRef(false), running = useRef(null), sessionVersion = useRef(0)

  const flush = useCallback(async () => {
    if (!current.current || !hydrated.current) return
    pending.current = true
    if (running.current) return running.current
    const owner = current.current, version = sessionVersion.current
    const task = async () => {
      try {
        while (pending.current && current.current?.$id === owner.$id && sessionVersion.current === version) {
          pending.current = false
          setSyncStatus('saving'); setSyncError('')
          const local = snapshotStudyEntries()
          const prefs = await account.getPrefs()
          if (sessionVersion.current !== version) return
          const entries = mergeStudyEntries(prefs.studyProgress?.entries, local)
          await account.updatePrefs({ prefs: cloudPreferences(prefs, entries) })
          if (sessionVersion.current !== version) return
          // Restore merged records only when there were no newer edits during the request.
          if (!pending.current) {
            hydrated.current = false
            restoreStudyEntries(mergeStudyEntries(entries, snapshotStudyEntries()))
            hydrated.current = true
          }
          setProfile(profileFrom(owner)); setSyncStatus('saved')
        }
      } catch (error) {
        if (sessionVersion.current !== version) return
        setSyncStatus('error'); setSyncError(error.message || 'Could not save progress. Your changes remain on this device.')
      } finally { running.current = null }
    }
    running.current = task()
    return running.current
  }, [])

  const hydrate = useCallback(async (activeUser, { importGuest = false } = {}) => {
    const version = ++sessionVersion.current
    const guest = importGuest ? snapshotStudyEntries() : {}
    clearTimeout(timer.current); hydrated.current = false; current.current = activeUser
    setStorageOwner(activeUser.$id); setUser(activeUser); setSyncStatus('loading')
    try {
      const prefs = await account.getPrefs()
      if (sessionVersion.current !== version) return
      const remote = prefs.studyProgress?.version === 1 ? prefs.studyProgress.entries : {}
      const local = snapshotStudyEntries()
      let entries = mergeStudyEntries(remote, mergeStudyEntries(guest, local))
      if (!entries['chemistry-progress']) {
        let legacy
        // Read the existing XP/streak profile once for accounts created before cloud study sync.
        try {
          const result = await databases.listDocuments(DATABASE_ID, COLLECTION_PROFILES_ID, [Query.equal('userId', activeUser.$id)])
          legacy = result.documents[0]
          if (legacy) await databases.updateDocument(DATABASE_ID, COLLECTION_PROFILES_ID, legacy.$id, {}, [Permission.read(Role.user(activeUser.$id)), Permission.update(Role.user(activeUser.$id))])
        } catch { /* A fresh account needs no profiles collection. */ }
        if (sessionVersion.current !== version) return
        entries['chemistry-progress'] = { value: { ...defaultProgress, xp: legacy?.xp || 0, streak: legacy?.streak || 1, lastStudied: legacy?.lastLoginDate }, updatedAt: Date.now() }
      }
      const progress = entries['chemistry-progress'].value
      if (progress.lastStudied !== today()) {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
        entries = { ...entries, 'chemistry-progress': { value: { ...progress, streak: progress.lastStudied === dateString(yesterday) ? (progress.streak || 0) + 1 : 1, xp: (progress.xp || 0) + 15, lastStudied: today() }, updatedAt: Date.now() } }
      }
      restoreStudyEntries(entries)
      setProfile(profileFrom(activeUser)); hydrated.current = true
      await flush()
    } catch (error) {
      if (sessionVersion.current !== version) return
      setProfile(profileFrom(activeUser)); setSyncStatus('error'); setSyncError(error.message || 'Could not restore cloud progress. Retry before continuing.')
    }
  }, [flush])

  useEffect(() => {
    let live = true
    account.get().then(activeUser => live && hydrate(activeUser)).catch(() => { if (live) { current.current = null; setStorageOwner(null); setUser(null); setProfile(null); setSyncStatus('local') } }).finally(() => { if (live) setLoading(false) })
    return () => { live = false; clearTimeout(timer.current) }
  }, [hydrate])

  useEffect(() => {
    const change = event => {
      const key = event.type === 'storage' ? event.key?.split(':').at(-1) : event.detail
      if (!hydrated.current || !current.current || !syncedStudyKeys.includes(key)) return
      pending.current = true; setProfile(profileFrom(current.current)); setSyncStatus('saving')
      clearTimeout(timer.current); timer.current = setTimeout(flush, 800)
    }
    const retry = () => { if (current.current) { if (hydrated.current) void flush(); else void hydrate(current.current) } }
    const leave = () => { if (document.visibilityState === 'hidden') void flush() }
    window.addEventListener('study-storage-change', change); window.addEventListener('storage', change); window.addEventListener('online', retry); document.addEventListener('visibilitychange', leave)
    return () => { window.removeEventListener('study-storage-change', change); window.removeEventListener('storage', change); window.removeEventListener('online', retry); document.removeEventListener('visibilitychange', leave); clearTimeout(timer.current) }
  }, [flush, hydrate])

  const register = async (username, email, password) => {
    const created = await account.create({ userId: ID.unique(), email, password, name: username })
    await account.createEmailPasswordSession({ email, password })
    await hydrate(await account.get(), { importGuest: true }); setAuthModalOpen(false)
    return created
  }
  const login = async (email, password) => {
    await account.createEmailPasswordSession({ email, password })
    const activeUser = await account.get(); await hydrate(activeUser); setAuthModalOpen(false)
    return activeUser
  }
  const logout = async () => {
    await flush()
    // A failed sign-out must not claim the session ended.
    await account.deleteSession({ sessionId: 'current' })
    sessionVersion.current += 1; clearTimeout(timer.current); hydrated.current = false; current.current = null; pending.current = false
    setStorageOwner(null); setUser(null); setProfile(null); setSyncStatus('local'); setSyncError('')
  }
  const addXP = async amount => {
    const progress = readStudyValue('chemistry-progress', defaultProgress)
    writeStudyValue('chemistry-progress', { ...progress, xp: progress.xp + amount })
    await flush()
  }
  return <AuthContext.Provider value={{ user, profile, loading, login, register, logout, addXP, syncStatus, syncError, retrySync: () => hydrated.current ? flush() : current.current && hydrate(current.current), openAuthModal: (mode = 'login') => { setAuthModalMode(mode); setAuthModalOpen(true) }, closeAuthModal: () => setAuthModalOpen(false), authModalOpen, authModalMode, setAuthModalMode }}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within an AuthProvider')
  return value
}
