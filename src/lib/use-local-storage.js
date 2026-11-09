import { isAccountStorageKey, syncedStudyKeys } from './study-cloud-progress'
import { useCallback, useRef, useSyncExternalStore } from 'react'

const cache = new Map()
const memory = new Map()
const changeEvent = 'study-storage-change'
let storageOwner = null
const physicalKey = key => storageOwner && isAccountStorageKey(key) ? `study-user:${storageOwner}:${key}` : key
export function setStorageOwner(owner) {
  storageOwner = owner || null
  window.dispatchEvent(new CustomEvent(changeEvent, { detail: '*' }))
}
export function readStudyValue(key, fallback) { return read(physicalKey(key), fallback) }
const clockKey = () => `study-clock:${storageOwner || 'guest'}`
export function snapshotStudyEntries() {
  const clock = read(clockKey(), {})
  return Object.fromEntries(syncedStudyKeys.flatMap(key => {
    const value = readStudyValue(key, undefined)
    return value === undefined ? [] : [[key, { value, updatedAt: clock[key] || 0 }]]
  }))
}
export function writeStudyValue(key, value, timestamp = Date.now()) {
  const target = physicalKey(key)
  const raw = JSON.stringify(value)
  try { localStorage.setItem(target, raw); memory.delete(target) } catch { memory.set(target, value) }
  cache.set(target, { raw, value })
  if (syncedStudyKeys.includes(key)) {
    const clock = { ...read(clockKey(), {}), [key]: timestamp }
    try { localStorage.setItem(clockKey(), JSON.stringify(clock)) } catch { memory.set(clockKey(), clock) }
  }
  window.dispatchEvent(new CustomEvent(changeEvent, { detail: key }))
}
export function restoreStudyEntries(entries) {
  for (const key of syncedStudyKeys) if (entries[key]) writeStudyValue(key, entries[key].value, entries[key].updatedAt)
}

function read(key, fallback) {
  if (memory.has(key)) return memory.get(key)
  let raw
  try { raw = localStorage.getItem(key) } catch { return fallback }
  if (raw === null) return fallback
  if (cache.get(key)?.raw === raw) return cache.get(key).value
  try {
    const value = JSON.parse(raw)
    if (value == null) return fallback
    cache.set(key, { raw, value })
    return value
  } catch { return fallback }
}

// One local store keeps shared chrome in sync when another component earns XP
// or changes a pin. The native storage event also updates other open tabs.
export function useLocalStorage(key, fallback) {
  const initial = useRef({ key, value: fallback })
  if (initial.current.key !== key) initial.current = { key, value: fallback }
  const subscribe = useCallback(listener => {
    const handle = event => {
      if (event.type === 'storage' ? event.key === physicalKey(key) || event.key === null : event.detail === key || event.detail === '*') listener()
    }
    window.addEventListener('storage', handle)
    window.addEventListener(changeEvent, handle)
    return () => {
      window.removeEventListener('storage', handle)
      window.removeEventListener(changeEvent, handle)
    }
  }, [key])
  const snapshot = useCallback(() => readStudyValue(key, initial.current.value), [key])
  const serverSnapshot = useCallback(() => initial.current.value, [])
  const value = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const setValue = useCallback(update => {
    const previous = readStudyValue(key, initial.current.value)
    const next = typeof update === 'function' ? update(previous) : update
    if (Object.is(previous, next)) return
    writeStudyValue(key, next)
  }, [key])
  return [value, setValue]
}

export const defaultProgress = { xp: 0, energy: 20, streak: 1, completed: false }
