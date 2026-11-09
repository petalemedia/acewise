// Add premade PDFs to public/worksheets, then register their topic here.
// All picker previews use the shared WorksheetCover component, not images.
// IDs must stay stable: saved highlights and share links belong to these IDs.
export const worksheets = ['easy', 'medium', 'hard'].flatMap(difficulty =>
  [1, 2].map(number => ({
    id: `11-1-${difficulty}-${number}`,
    topicId: '11.1',
    difficulty,
    number,
    title: `${difficulty[0].toUpperCase()}${difficulty.slice(1)} ${number}`,
    file: `/worksheets/11-1-${difficulty}-${number}.pdf`,
    pages: 2,
  })),
)

export const worksheetsForTopic = topicId => worksheets.filter(worksheet => worksheet.topicId === topicId)
