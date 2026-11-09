import { june2026Questions } from './past-papers/june-2026-questions.js'

export const difficultyLevels = ['easy', 'medium', 'hard']
export const questionBank = {
  easy: [
    { id: 'e-carbon', topic: 'Displayed formulae', prompt: 'How many covalent bonds does a carbon atom usually form in the organic compounds in this course?', options: ['One', 'Two', 'Three', 'Four'], answer: 3, hint: 'Think about methane, CH₄. Count the bonds around its carbon atom.', explanation: 'Carbon forms four covalent bonds. In methane, it shares one pair of electrons with each of four hydrogen atoms.', takeaway: 'Carbon: four bonds. Hydrogen: one. Oxygen: two.' },
    { id: 'e-pentane', topic: 'General formulae', prompt: 'An alkane contains five carbon atoms. What is its molecular formula?', options: ['C₅H₁₀', 'C₅H₁₂', 'C₅H₈', 'C₅H₁₄'], answer: 1, hint: 'Alkanes have the general formula CₙH₂ₙ₊₂. Substitute n = 5.', explanation: 'For an alkane, the number of hydrogen atoms is 2n + 2. When n = 5, this gives 2(5) + 2 = 12. The formula is C₅H₁₂.', takeaway: 'Use CₙH₂ₙ₊₂ for an alkane.' },
    { id: 'e-alcohol', topic: 'Functional groups', prompt: 'Which functional group identifies an alcohol?', options: ['–COOH', 'C=C', '–OH', 'C–C'], answer: 2, hint: 'Look at the end of the structural formula of ethanol: CH₃CH₂OH.', explanation: 'An alcohol contains a hydroxyl (–OH) group attached to a carbon atom. The –COOH group identifies a carboxylic acid.', takeaway: 'Alcohols contain –OH; carboxylic acids contain –COOH.' },
    { id: 'e-displayed', topic: 'Displayed formulae', prompt: 'What does a displayed formula show?', options: ['Only the number of atoms of each element', 'Every atom and every bond', 'Only the carbon atoms', 'Only the functional group'], answer: 1, hint: 'A molecular formula counts atoms. A displayed formula shows more detail.', explanation: 'A displayed formula shows every atom as an element symbol, and every covalent bond as a line between symbols.', takeaway: 'A displayed formula must include all the hydrogens and all the bonds.' },
    { id: 'e-series', topic: 'Homologous series', prompt: 'Successive members of a homologous series differ by which unit?', options: ['CH₂', 'CO₂', 'H₂O', 'O₂'], answer: 0, hint: 'Compare ethane, C₂H₆, with propane, C₃H₈.', explanation: 'The difference between neighbouring members is one carbon and two hydrogen atoms: CH₂.', takeaway: 'Successive members differ by CH₂.' },
  ],
  medium: [
    { id: 'm-acid', topic: 'Functional groups', prompt: 'How many carbon atoms are present in one molecule of C₃H₇COOH?', options: ['Two', 'Three', 'Four', 'Five'], answer: 2, hint: 'Count the carbon atom in the –COOH group as well as the carbons in C₃H₇.', explanation: 'C₃H₇ contains three carbon atoms and the –COOH group contains one more. The total is four.', takeaway: 'The carbon in –COOH is part of the total carbon count.' },
    { id: 'm-alkene', topic: 'General formulae', prompt: 'An open-chain hydrocarbon has one C=C bond and the molecular formula C₄H₈. Which series does it belong to?', options: ['Alkanes', 'Alkenes', 'Alcohols', 'Carboxylic acids'], answer: 1, hint: 'The functional group tells you the series; the general formula can confirm it.', explanation: 'The C=C bond is the functional group of alkenes. An open-chain alkene with one double bond follows CₙH₂ₙ, which gives C₄H₈ for n = 4.', takeaway: 'Use the functional group as well as the molecular formula.' },
    { id: 'm-ethanol', topic: 'Structural formulae', prompt: 'The structural formula of ethanol is CH₃CH₂OH. What is its molecular formula?', options: ['C₂H₅O', 'C₂H₆O', 'CH₄O', 'C₂H₄O₂'], answer: 1, hint: 'Count the hydrogen in the –OH group too.', explanation: 'There are two carbon atoms, 3 + 2 + 1 = 6 hydrogen atoms, and one oxygen atom. The molecular formula is C₂H₆O.', takeaway: 'The H in –OH counts towards the total number of hydrogen atoms.' },
    { id: 'm-double', topic: 'Displayed formulae', prompt: 'How many shared pairs of electrons are represented by a double covalent bond?', options: ['One', 'Two', 'Three', 'Four'], answer: 1, hint: 'Each line in a displayed formula represents one shared pair.', explanation: 'A double bond is drawn using two lines, representing two shared pairs of electrons.', takeaway: 'One line = one shared pair; two lines = two shared pairs.' },
    { id: 'm-properties', topic: 'Homologous series', prompt: 'Why do members of a homologous series have similar chemical properties?', options: ['They have identical molecular masses', 'They have the same boiling point', 'They have the same functional group', 'They contain the same number of carbon atoms'], answer: 2, hint: 'Which part of an organic molecule is responsible for its characteristic reactions?', explanation: 'Members have the same functional group, which determines their characteristic chemical reactions. Their physical properties change gradually with chain length.', takeaway: 'Same functional group → similar chemical reactions.' },
  ],
  hard: [
    { id: 'h-butane-isomers', topic: 'Structural formulae', prompt: 'CH₃CH₂CH₂CH₃ and CH₃CH(CH₃)CH₃ both have the molecular formula C₄H₁₀. Which statement is correct?', options: ['They have different molecular formulae', 'Their atoms are connected differently', 'They have different numbers of carbon atoms', 'Their displayed formulae are identical'], answer: 1, hint: 'Compare the straight carbon chain with the branched carbon chain.', explanation: 'Both compounds contain four carbons and ten hydrogens, but the atoms are connected differently. They are structural isomers.', takeaway: 'Structural isomers have the same molecular formula but different structural formulae.' },
    { id: 'h-double-position', topic: 'Structural formulae', prompt: 'CH₂=CHCH₂CH₃ and CH₃CH=CHCH₃ are structural isomers. What differs between these molecules?', options: ['The number of carbon atoms', 'The position of the carbon–carbon double bond', 'The number of hydrogen atoms', 'The number of oxygen atoms'], answer: 1, hint: 'Find which pair of carbon atoms is joined by the double bond in each formula.', explanation: 'Both molecules have the molecular formula C₄H₈. The double bond is between carbons 1 and 2 in the first molecule, and carbons 2 and 3 in the second.', takeaway: 'A different double-bond position can give a different structural isomer.' },
    { id: 'h-ethanoic', topic: 'Functional groups', prompt: 'Which molecular formula corresponds to ethanoic acid, CH₃COOH?', options: ['C₂H₆O', 'C₂H₄O', 'C₂H₄O₂', 'C₃H₄O₂'], answer: 2, hint: 'The –COOH group contributes one C, two O atoms and one H.', explanation: 'CH₃ contributes one carbon and three hydrogens. COOH contributes one carbon, two oxygens and one hydrogen. Together they give C₂H₄O₂.', takeaway: 'Count every atom in the functional group.' },
    { id: 'h-hydrogen', topic: 'Displayed formulae', prompt: 'Propane is C₃H₈ and propene is C₃H₆. Why does propene contain two fewer hydrogen atoms?', options: ['One carbon atom has been removed', 'Its double bond uses one extra bond on each of two carbon atoms', 'Oxygen replaces two hydrogens', 'Carbon forms only three bonds in alkenes'], answer: 1, hint: 'Carbon still needs a total of four bonds, including both lines of a double bond.', explanation: 'The additional C–C bond in a C=C double bond occupies one more bond on each carbon. Those two carbons therefore each bond to one fewer hydrogen.', takeaway: 'Carbon has four bonds in both alkanes and alkenes.' },
    { id: 'h-mass', topic: 'Homologous series', prompt: 'The relative molecular masses of successive alkanes increase by how much? Use Aᵣ(C) = 12 and Aᵣ(H) = 1.', options: ['12', '13', '14', '16'], answer: 2, hint: 'Successive members differ by CH₂.', explanation: 'The extra CH₂ unit has a relative mass of 12 + 2(1) = 14.', takeaway: 'The CH₂ difference gives a relative molecular mass increase of 14.' },
  ],
}

const additionalQuestions = {
  easy: [
    ['e-hydrogen', 'Displayed formulae', 'How many covalent bonds does a hydrogen atom form?', ['One', 'Two', 'Three', 'Four'], 0, 'Hydrogen forms one covalent bond.'],
    ['e-oxygen', 'Displayed formulae', 'How many covalent bonds does oxygen usually form in these organic compounds?', ['One', 'Two', 'Three', 'Four'], 1, 'Oxygen forms two bonds, including the two lines of a double bond.'],
    ['e-methane', 'General formulae', 'Which is the molecular formula of methane?', ['CH₂', 'C₂H₆', 'CH₄', 'C₂H₄'], 2, 'Methane has one carbon atom bonded to four hydrogen atoms.'],
    ['e-alkene-group', 'Functional groups', 'Which bond identifies an alkene?', ['C–C', 'C–H', 'O–H', 'C=C'], 3, 'Alkenes contain a carbon–carbon double bond.'],
    ['e-acid-group', 'Functional groups', 'Which group identifies a carboxylic acid?', ['–OH', '–COOH', 'C=C', '–CH₃'], 1, 'The carboxyl group, –COOH, identifies a carboxylic acid.'],
  ],
  medium: [
    ['m-hexene', 'General formulae', 'What is the molecular formula of an open-chain alkene with six carbon atoms and one double bond?', ['C₆H₁₄', 'C₆H₁₀', 'C₆H₁₂', 'C₅H₁₂'], 2, 'Use CₙH₂ₙ with n = 6 to obtain C₆H₁₂.'],
    ['m-propanol', 'Structural formulae', 'How many hydrogen atoms are in CH₃CH₂CH₂OH?', ['Six', 'Seven', 'Eight', 'Nine'], 2, 'Count 3 + 2 + 2 + 1 = 8 hydrogen atoms, including the hydrogen in –OH.'],
    ['m-saturated', 'Functional groups', 'What does saturated mean when describing a hydrocarbon?', ['It contains only single carbon–carbon bonds', 'It contains a C=C bond', 'It contains oxygen', 'It has no hydrogen atoms'], 0, 'A saturated hydrocarbon contains no carbon–carbon double or triple bonds.'],
    ['m-hydrocarbon', 'Functional groups', 'Which substance is a hydrocarbon?', ['CH₃OH', 'CH₃COOH', 'C₂H₅OH', 'C₃H₈'], 3, 'A hydrocarbon contains only carbon and hydrogen.'],
    ['m-butane', 'Structural formulae', 'Which structural formula represents butane?', ['CH₃CH₂CH₃', 'CH₃CH₂CH₂CH₃', 'CH₂=CHCH₂CH₃', 'CH₃CH₂OH'], 1, 'Butane has four carbon atoms joined by single bonds and the molecular formula C₄H₁₀.'],
  ],
  hard: [
    ['h-acid-formula', 'General formulae', 'A saturated monocarboxylic acid has the formula CₙH₂ₙ₊₁COOH. What is its molecular formula when n = 2?', ['C₂H₆O₂', 'C₃H₈O₂', 'C₃H₆O₂', 'C₂H₄O₂'], 2, 'C₂H₅COOH contains three carbon atoms, six hydrogens and two oxygens.'],
    ['h-alkane-n', 'General formulae', 'An alkane has 18 hydrogen atoms per molecule. How many carbon atoms does it contain?', ['Seven', 'Eight', 'Nine', 'Ten'], 1, 'Solve 2n + 2 = 18, giving n = 8.'],
    ['h-carbonyl', 'Displayed formulae', 'A carbon atom has one double bond to oxygen and one single bond to another carbon. How many more single bonds must it form?', ['None', 'One', 'Two', 'Three'], 1, 'The double bond counts as two bonds and the single bond as one. Carbon needs one more to reach four.'],
    ['h-alcohol-acid', 'Functional groups', 'Why is CH₃COOH classified as a carboxylic acid rather than an alcohol?', ['It contains no O–H bond', 'It contains only one oxygen atom', 'Its O–H is part of a –COOH group', 'Its carbon atoms form five bonds'], 2, 'The O–H belongs to the complete carboxyl group, –COOH, which determines its classification.'],
    ['h-series-next', 'Homologous series', 'Which molecular formula is the next member after C₄H₁₀ in the same homologous series?', ['C₄H₁₂', 'C₅H₁₀', 'C₆H₁₄', 'C₅H₁₂'], 3, 'Adding one CH₂ unit to C₄H₁₀ gives C₅H₁₂.'],
  ],
}
for (const level of difficultyLevels) {
  questionBank[level].push(...additionalQuestions[level].map(([id, topic, prompt, options, answer, explanation]) => ({ id, topic, prompt, options, answer, explanation })))
}

// Supplement concepts are tagged Extended independently of question difficulty.
const extendedQuestionIds = new Set(['e-series', 'm-ethanol', 'm-propanol', 'm-butane', 'h-butane-isomers', 'h-double-position', 'h-ethanoic', 'h-mass', 'h-series-next'])
const questionSubtopics = { 'e-methane': '11.2', 'm-butane': '11.2', 'm-hydrocarbon': '11.3' }
// Editorial estimates based on each question's demands, not collected student results.
const estimatedFirstTryRates = {
  'e-carbon': 92, 'e-pentane': 82, 'e-alcohol': 87, 'e-displayed': 89, 'e-series': 74,
  'e-hydrogen': 96, 'e-oxygen': 86, 'e-methane': 93, 'e-alkene-group': 88, 'e-acid-group': 84,
  'm-acid': 68, 'm-alkene': 76, 'm-ethanol': 71, 'm-double': 79, 'm-properties': 73,
  'm-hexene': 72, 'm-propanol': 66, 'm-saturated': 78, 'm-hydrocarbon': 81, 'm-butane': 75,
  'h-butane-isomers': 58, 'h-double-position': 62, 'h-ethanoic': 61, 'h-hydrogen': 48, 'h-mass': 57,
  'h-acid-formula': 43, 'h-alkane-n': 64, 'h-carbonyl': 56, 'h-alcohol-acid': 51, 'h-series-next': 68,
}
export const bankQuestions = [...june2026Questions, ...difficultyLevels.flatMap(difficulty => questionBank[difficulty].map(question => ({
  ...question,
  estimatedFirstTryRate: estimatedFirstTryRates[question.id],
  subtopicId: questionSubtopics[question.id] || '11.1',
  difficulty,
  level: extendedQuestionIds.has(question.id) ? 'extended' : 'core',
  paper: extendedQuestionIds.has(question.id) ? '2' : '1',
})))]
export const QUESTIONS_PER_PAGE = 10

// Older saved answers represent one attempt; preserve them when adding history.
export function questionStats(saved) {
  const attempts = Number.isInteger(saved?.attempts) && saved.attempts >= 0 ? saved.attempts : saved?.submitted ? 1 : 0
  const correctAttempts = Math.min(attempts, Math.max(0, Number.isInteger(saved?.correctAttempts) ? saved.correctAttempts : saved?.submitted && saved.correct ? 1 : 0))
  return { attempts, correctAttempts, accuracy: attempts ? Math.round(correctAttempts / attempts * 100) : null }
}

export function recordQuestionAttempt(question, selected, saved) {
  const result = questionResult(question, selected)
  if (!result || saved?.submitted) return saved
  const stats = questionStats(saved)
  return { ...result, attempts: stats.attempts + 1, correctAttempts: stats.correctAttempts + Number(result.correct) }
}

export function questionResult(question, selected) {
  return Number.isInteger(selected) && selected >= 0 && selected < question.options.length
    ? { selected, submitted: true, correct: selected === question.answer }
    : null
}

export function awardQuestion(progress, id, correct) {
  const rewarded = progress.questionRewards || []
  return !correct || rewarded.includes(id) ? progress : { ...progress, xp: progress.xp + 5, questionRewards: [...rewarded, id] }
}

export const flashcards = [
  { id: 'displayed', front: 'What does a displayed formula show?', back: 'Every atom in a molecule and every covalent bond between those atoms.' },
  { id: 'carbon', front: 'How many bonds do carbon, hydrogen and oxygen form?', back: 'Carbon forms four bonds, hydrogen forms one, and oxygen forms two.' },
  { id: 'alkanes', front: 'What is the general formula of an alkane?', back: 'CₙH₂ₙ₊₂, where n is the number of carbon atoms.' },
  { id: 'functional', front: 'Which functional groups identify alcohols and carboxylic acids?', back: 'Alcohols contain –OH. Carboxylic acids contain –COOH.' },
  { id: 'series', front: 'What do members of a homologous series have in common?', back: 'The same functional group and general formula, similar chemical properties, and a CH₂ difference between successive members.' },
  { id: 'molecular', front: 'How do molecular and structural formulae differ?', back: 'A molecular formula counts atoms of each element. A structural formula shows how the atoms are connected.' },
]
