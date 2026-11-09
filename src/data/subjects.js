import { chemistryTopics, chemistrySyllabusSource, defaultChemistryTopic } from './chemistry-syllabus.js'
import biology from './subjects/biology-syllabus.json'
import physics from './subjects/physics-syllabus.json'

const defineSubject = data => ({ ...data, subtopics: data.topics.flatMap(topic => topic.subtopics) })
export const subjects = [
  defineSubject({ id: 'chemistry', title: 'Chemistry', code: '0620', topics: chemistryTopics, source: chemistrySyllabusSource, defaultTopic: defaultChemistryTopic.id, description: 'Your course notes, topic questions and revision resources, from states of matter to organic chemistry and practical skills.', introduction: 'Explore the reactions and patterns behind the world around you.', available: true }),
  defineSubject({ id: 'biology', title: 'Biology', code: '0610', ...biology, defaultTopic: '1.1', description: 'Explore cells, living organisms and their environment. Browse the course topics while notes and practice questions are being prepared.', introduction: 'Explore living things, from the smallest cells to whole ecosystems.', available: false }),
  defineSubject({ id: 'physics', title: 'Physics', code: '0625', ...physics, defaultTopic: '1.1', description: 'Explore motion, energy, electricity and space. Browse the course topics while notes and practice questions are being prepared.', introduction: 'Make sense of motion, energy and the forces that shape our world.', available: false }),
]
export const getSubject = id => subjects.find(subject => subject.id === id) || subjects[0]
export const subjectFromSearch = search => getSubject(new URLSearchParams(search).get('subject'))
export const findSubjectTopic = (subject, id) => subject.subtopics.find(topic => topic.id === id)
export function subjectHref(subject, mode = 'course', topicId, extras = {}) {
  const params = new URLSearchParams(extras)
  if (subject.id !== 'chemistry') params.set('subject', subject.id)
  if (topicId) params.set('topic', topicId)
  return `/${mode}${params.size ? `?${params}` : ''}`
}
export const subjectStorageKey = (subject, name) => `${subject.id}-${name}`
