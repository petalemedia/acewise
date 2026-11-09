// Only account study records are synced. UI settings and annotations stay local.
export const syncedStudyKeys = [
  'chemistry-progress',
  ...['chemistry', 'biology', 'physics'].flatMap(subject => ['question-answers', 'completed-topics', 'question-bookmarks', 'reported-questions', 'study-locations'].map(name => `${subject}-${name}`)),
]
export const isAccountStorageKey = key => /^(chemistry|biology|physics)-/.test(key)
export const mergeStudyEntries = (remote = {}, local = {}) => {
  const result = {}
  for (const key of syncedStudyKeys) {
    const a = remote[key], b = local[key]
    if (a || b) result[key] = b && (!a || b.updatedAt > a.updatedAt) ? b : a
  }
  return result
}
export function cloudPreferences(prefs, entries) {
  const next = { ...prefs, studyProgress: { version: 1, entries } }
  if (new TextEncoder().encode(JSON.stringify(next)).length > 62000) throw new Error('Your progress exceeds account storage capacity. It is still saved on this device. Contact support before changing devices.')
  return next
}
