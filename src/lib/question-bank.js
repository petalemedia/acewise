import { questionStats, recordQuestionAttempt } from '../data/chemistry-practice.js'

export const defaultBankFilters = { paper: 'all', level: 'all', difficulty: 'all', completion: 'all' }

export function questionsForTopic(questions, topicId) {
  return questions.filter(question => question.subtopicId === topicId)
}

export function clearQuestionAnswer(saved) {
  const { attempts, correctAttempts } = questionStats(saved)
  return { attempts, correctAttempts, selected: null, submitted: false, correct: false }
}

export function selectQuestionAnswer(question, selected, saved) {
  if (!Number.isInteger(selected) || selected < 0 || selected >= question.options.length) return saved
  if (saved?.submitted && saved.selected === selected) return clearQuestionAnswer(saved)
  return recordQuestionAttempt(question, selected, clearQuestionAnswer(saved))
}

export function filterQuestionBank(questions, filters, answers, bookmarks = []) {
  return questions.filter(question => {
    const saved = answers[question.id]
    return (filters.paper === 'all' || question.paper === filters.paper)
      && (filters.level === 'all' || question.level === filters.level)
      && (filters.difficulty === 'all' || question.difficulty === filters.difficulty)
      && (filters.completion === 'all'
        || filters.completion === 'unanswered' && !saved?.submitted
        || filters.completion === 'answered' && saved?.submitted
        || filters.completion === 'correct' && saved?.submitted && saved.correct
        || filters.completion === 'incorrect' && saved?.submitted && !saved.correct
        || filters.completion === 'bookmarked' && bookmarks.includes(question.id))
  })
}

// A small arithmetic parser: no script evaluation or access to browser globals.
export function calculateExpression(expression) {
  const source = expression.replaceAll('×', '*').replaceAll('÷', '/').replace(/\s/g, '')
  const tokens = source.match(/(?:\d+(?:\.\d*)?|\.\d+)|[()+\-*/]/g) || []
  if (!tokens.length || tokens.join('') !== source || tokens.length > 100) throw new Error('Enter a valid calculation')
  let index = 0
  const atom = () => {
    const token = tokens[index++]
    if (token === '-') return -atom()
    if (token === '+') return atom()
    if (token === '(') {
      const result = sum()
      if (tokens[index++] !== ')') throw new Error('Close the brackets')
      return result
    }
    if (!token || !/^\d|^\.\d/.test(token)) throw new Error('Enter a number')
    return Number(token)
  }
  const product = () => {
    let result = atom()
    while (tokens[index] === '*' || tokens[index] === '/') {
      const operator = tokens[index++]
      const next = atom()
      result = operator === '*' ? result * next : result / next
    }
    return result
  }
  const sum = () => {
    let result = product()
    while (tokens[index] === '+' || tokens[index] === '-') {
      const operator = tokens[index++]
      const next = product()
      result = operator === '+' ? result + next : result - next
    }
    return result
  }
  const result = sum()
  if (index !== tokens.length || !Number.isFinite(result)) throw new Error('This calculation has no finite result')
  return Number(result.toPrecision(12)).toString()
}
