// One editable cover layout for every worksheet, independent of the PDF pages.
export default function WorksheetCover({ topic, worksheet }) {
  const subject = worksheet.subject || 'Chemistry'
  const board = worksheet.board || 'CIE'
  const qualification = worksheet.qualification || 'IGCSE'
  return <span className="worksheet-cover" aria-hidden="true">
    <span className="worksheet-cover-heading">{qualification} {subject} · {board} · Exam Worksheet</span>
    <strong className="worksheet-cover-title">{topic.id} {topic.title} {worksheet.title}</strong>
    <span className="worksheet-cover-details">Exam practice questions</span>
    <span className="worksheet-cover-fields"><span>Name</span><span>Date</span></span>
  </span>
}
