import { isStudyFeatureEnabled } from './study-features.js'
import { getSubject, subjectFromSearch, findSubjectTopic, subjectHref } from '../data/subjects.js'

const modes = new Set(['questions', 'notes', 'worksheets', 'flashcards'])
export function studyLocation(location) {
  const mode = location.pathname.match(/^\/(questions|notes|worksheets|flashcards)\/?$/)?.[1]
  if (!mode || !isStudyFeatureEnabled(mode)) return null
  const subject = subjectFromSearch(location.search)
  const params = new URLSearchParams(location.search)
  const topic = findSubjectTopic(subject, params.get('topic')) || findSubjectTopic(subject, subject.defaultTopic)
  if (subject.id === 'chemistry') params.delete('subject')
  else params.set('subject', subject.id)
  if (mode === 'flashcards') return { mode, subjectId: subject.id, topicId: subject.defaultTopic, href: subjectHref(subject, mode) }
  params.set('topic', topic.id)
  return { mode, subjectId: subject.id, topicId: topic.id, href: `/${mode}?${params}${location.hash || ''}` }
}
export function resumeStudyHref(mode, saved = {}, subject = getSubject('chemistry')) {
  if (!modes.has(mode)) return subjectHref(subject)
  try {
    const url = new URL(saved?.[mode], 'https://study.local')
    if (url.origin === 'https://study.local' && url.pathname === `/${mode}` && subjectFromSearch(url.search).id === subject.id) {
      const location = studyLocation(url)
      if (location) return location.href
    }
  } catch { /* Use a valid subject/topic when a saved link is unavailable. */ }
  if (mode === 'flashcards') return subjectHref(subject, mode)
  const topic = findSubjectTopic(subject, saved?.lastTopic) || findSubjectTopic(subject, subject.defaultTopic)
  return subjectHref(subject, mode, topic.id)
}
