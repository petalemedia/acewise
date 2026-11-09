import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const nextId = useRef(0)
  const timers = useRef(new Map())

  const dismiss = useCallback(id => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setNotifications(items => items.filter(item => item.id !== id))
  }, [])

  const notify = useCallback(message => {
    const id = ++nextId.current
    setNotifications(items => [...items, { id, message }].slice(-4))
    timers.current.set(id, setTimeout(() => dismiss(id), 4500))
  }, [dismiss])

  useEffect(() => {
    const activeTimers = timers.current
    return () => {
      activeTimers.forEach(clearTimeout)
      activeTimers.clear()
    }
  }, [])

  return { notifications, notify, dismiss }
}

export function Notifications({ items, onDismiss }) {
  return <div className="notification-list" aria-label="Notifications" aria-live="polite" aria-relevant="additions removals" data-stacked={items.length > 1}>
    {items.map((item, index) => {
      const depth = items.length - index - 1
      return <div key={item.id} className="toast" style={{ '--depth': depth, zIndex: index + 1 }}>
        <Check className="toast-check" aria-hidden="true"/>
        <span>{item.message}</span>
        <button aria-label="Dismiss notification" onClick={() => onDismiss(item.id)}><X/></button>
      </div>
    })}
  </div>
}
