export function Spark({ className = '' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M11 2.7c.3-.9 1.7-.9 2 0l2.2 6.1 6.1 2.2c.9.3.9 1.7 0 2l-6.1 2.2-2.2 6.1c-.3.9-1.7.9-2 0l-2.2-6.1L2.7 13c-.9-.3-.9-1.7 0-2l6.1-2.2L11 2.7Z"/></svg>
}
export function Bolt() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.1 2.1c.6-.8 1.9-.3 1.7.7l-1 6h5.1c.9 0 1.4 1 .8 1.7L10.7 22c-.6.8-1.9.3-1.7-.7l1-6.1H5c-.9 0-1.4-1-.9-1.7l8-11.4Z" fill="currentColor"/><path d="m12.8 3.7-1.2 7.2H6.8l6-7.2Z" fill="#d7b7ff"/><path d="m11.6 10.9 5.7-.1-6.8 9 1.1-8.9Z" fill="#6f3dc0" opacity=".4"/></svg>
}
export function Flame({ className = '' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true"><path d="M12.8 1.8c-.5-.5-1.3-.1-1.3.6.1 3.6-.9 6-2.7 8.1-.9-1-1.3-2.2-1.3-3.5 0-.7-.9-1-1.3-.4C4 9.1 3 12 3.2 15c.2 4.5 3.7 7.6 8.8 7.6s8.5-3.3 8.6-7.8c.1-4.8-4.2-10-7.8-13Z" fill="currentColor"/><path d="M12.3 12.2c-.2-.3-.5-.3-.7 0-.8 1.5-2.8 3.3-2.8 5.1a3.2 3.2 0 0 0 6.4 0c0-1.8-1.6-3.7-2.9-5.1Z" fill="#fff4dd"/></svg>
}
export function Genie({ pink = false, small = false }) { return <svg className={small ? 'genie-small' : 'genie'} viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect x="3" y="3" width="58" height="58" rx="15" fill={pink ? '#f5c0e0' : '#20242b'}/><path d="M7 11c12 10 39 4 51 25v15c0 6-5 10-11 10H16C8 61 3 57 3 50V27c7-2 6-10 4-16z" fill={pink ? '#ee78b8' : '#2bdcc0'}/><path d="M19 11c14 2 31 6 38 18-15-8-29-4-38-18z" fill={pink ? '#fb9dce' : '#90f7d2'}/><path d="M19 47c0-8 10-8 10-2m10 2c0-8 10-8 10-2" stroke="#172a30" strokeWidth="5" strokeLinecap="round"/><circle cx="27" cy="46" r="2.5" fill="white"/><circle cx="47" cy="46" r="2.5" fill="white"/><path d="M30 53c2 2 4 2 6 0" stroke="#172a30" strokeWidth="2" strokeLinecap="round"/></svg> }
