// Content is generated locally from the reviewed, supplied exam papers.
// Only escaped text and whitelisted SVG geometry are emitted by the importer.
export function QuestionDrawing({ drawing, className = '' }) {
  if (!drawing) return null
  return <svg className={`qb-vector ${className}`} viewBox={drawing.viewBox} role="img" aria-label="Question diagram" style={{ '--drawing-width': `${drawing.width * 1.45}px` }} onDragStart={event => event.preventDefault()} dangerouslySetInnerHTML={{ __html: drawing.markup }}/>
}
export function QuestionText({ html, children }) {
  return html ? <span className="qb-typeset" dangerouslySetInnerHTML={{ __html: html }}/> : <span>{children}</span>
}
export default function QuestionContent({ question }) {
  return <div className="qb-content">{question.content ? question.content.map((block, index) => {
    if (block.type === 'diagram') return <figure className="qb-content-drawing" key={index}><QuestionDrawing drawing={block.drawing}/></figure>
    if (block.type === 'list') return <ol className="qb-statement-list" key={index}>{block.items.map((item, i) => <li key={i}><QuestionText html={item}/></li>)}</ol>
    return <p key={index}><QuestionText html={block.html}/></p>
  }) : question.prompt.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
}
