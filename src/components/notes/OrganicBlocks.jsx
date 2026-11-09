import { ListChecks } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'

export function Definition({ term, children }) {
  return <div className="definition"><div className="definition-label"><ListChecks/><span>Definition</span></div><p className="definition-term">{term}</p><div>{children}</div></div>
}
export function Extended({ children }) {
  return <div className="organic-extended-content"><span className="organic-extended-label">Extended</span>{children}</div>
}
export function ChemistryTable({ headers, rows, caption }) {
  return <div className="organic-table-scroll"><table className="organic-table">{caption && <caption>{caption}</caption>}<thead><tr>{headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div>
}
export function Equation({ children, condition }) {
  return <div className="organic-equation">{condition && <span>{condition}</span>}<div>{children}</div></div>
}
export function Understanding({ items }) {
  return <div className="organic-checks">{items.map(([question, answer], index) => <div className="organic-check" key={question}><p><strong>{index + 1}.</strong> {question}</p><details><summary>Show answer</summary><div>{answer}</div></details></div>)}</div>
}

// Atom coordinates and individual bond lines keep displayed formulae complete.
export function DisplayedFormula({ atoms, bonds, width = 500, height = 200, caption, repeat = false }) {
  const svg = useRef(null)
  useLayoutEffect(() => {
    if (!window.CanvasRenderingContext2D) return
    const context = document.createElement('canvas').getContext('2d')
    if (!context) return
    let cancelled = false
    const alignLabels = () => {
      if (cancelled) return
      svg.current?.querySelectorAll('[data-atom-x]').forEach(text => {
        const style = getComputedStyle(text)
        context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        const metrics = context.measureText(text.textContent)
        // Center the actual ink, not the font's em box or baseline. In
        // particular, C, H and O must all meet their bonds at their midpoints.
        const dx = (metrics.width + metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2
        const dy = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
        if (Number.isFinite(dx) && Number.isFinite(dy)) {
          text.setAttribute('x', Number(text.dataset.atomX) + dx)
          text.setAttribute('y', Number(text.dataset.atomY) + dy)
        }
      })
    }
    alignLabels()
    document.fonts?.ready.then(alignLabels)
    return () => { cancelled = true }
  }, [atoms])
  const lookup = Object.fromEntries(atoms.map(atom => [atom.id, atom]))
  return <figure className="organic-displayed"><svg ref={svg} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={caption}>
    <g stroke="currentColor" fill="none" strokeWidth="1.4" strokeLinecap="round">{bonds.flatMap(([from, to, order = 1], index) => {
      const a = lookup[from], b = lookup[to]
      const length = Math.hypot(b.x - a.x, b.y - a.y)
      const dx = (b.x - a.x) / length, dy = (b.y - a.y) / length
      const trimA = Math.max(17, a.label.length * 6 + 4)
      const trimB = Math.max(17, b.label.length * 6 + 4)
      return Array.from({ length: order }, (_, line) => {
        const shift = (line - (order - 1) / 2) * 5
        return <line key={`${index}-${line}`} x1={a.x + dx * trimA - dy * shift} y1={a.y + dy * trimA + dx * shift} x2={b.x - dx * trimB - dy * shift} y2={b.y - dy * trimB + dx * shift}/>
      })
    })}{repeat && <><path d={`M5 90H43M${width - 73} 90H${width - 30}`}/><path d={`M26 8H16V175H26M${width - 55} 8H${width - 45}V175H${width - 55}`}/></>}</g>
    <g fill="currentColor" fontFamily="Times New Roman, serif" fontSize="23" textAnchor="middle" letterSpacing="0">{atoms.map(atom => <text key={atom.id} x={atom.x} y={atom.y + 8} data-atom-x={atom.x} data-atom-y={atom.y}>{atom.label}</text>)}{repeat && <text x={width - 25} y="179" fontStyle="italic">n</text>}</g>
  </svg><figcaption>{caption}</figcaption></figure>
}
export function ChainFormula({ carbons = 2, doubleAt = -1, group, hydroxylAt = carbons - 1, caption }) {
  if (carbons === 2 && doubleAt === 0 && !group) {
    const hydrogenOffsetY = 35 * Math.sqrt(3)
    return <DisplayedFormula width={270} height={220} caption={caption} atoms={[
      { id: 'c0', label: 'C', x: 90, y: 110 }, { id: 'c1', label: 'C', x: 180, y: 110 },
      { id: 'h0t', label: 'H', x: 55, y: 110 - hydrogenOffsetY }, { id: 'h0b', label: 'H', x: 55, y: 110 + hydrogenOffsetY },
      { id: 'h1t', label: 'H', x: 215, y: 110 - hydrogenOffsetY }, { id: 'h1b', label: 'H', x: 215, y: 110 + hydrogenOffsetY },
    ]} bonds={[["c0","c1",2],["c0","h0t"],["c0","h0b"],["c1","h1t"],["c1","h1b"]]}/>
  }
  const atoms = [], bonds = []
  const add = (id, label, x, y, parent, order = 1) => { atoms.push({ id, label, x, y }); if (parent) bonds.push([parent, id, order]) }
  for (let i = 0; i < carbons; i++) {
    const id = `c${i}`, x = 80 + i * 80
    add(id, 'C', x, 100)
    if (i) bonds.push([`c${i - 1}`, id, doubleAt === i - 1 ? 2 : 1])
    const acidCarbon = group === 'acid' && i === carbons - 1
    let used = (i > 0 ? (doubleAt === i - 1 ? 2 : 1) : 0) + (i < carbons - 1 ? (doubleAt === i ? 2 : 1) : 0)
    if (i === 0) { add(`${id}l`, 'H', x - 60, 100, id); used++ }
    if (i === carbons - 1) {
      if (group === 'acid') { add('carbonyl', 'O', x, 30, id, 2); used += 2 }
      if (group === 'acid' || group === 'alcohol' && hydroxylAt === i) { add('oxygen', 'O', x + 70, 100, id); add('oh', 'H', x + 130, 100, 'oxygen'); used++ }
      else { add(`${id}r`, 'H', x + 60, 100, id); used++ }
    }
    if (group === 'alcohol' && hydroxylAt === i && i !== carbons - 1) {
      add('oxygen', 'O', x, 170, id); add('oh', 'H', x, 240, 'oxygen'); used++
    }
    if (!acidCarbon) for (let h = 0; h < 4 - used; h++) add(`${id}h${h}`, 'H', x, h ? 170 : 30, id)
  }
  return <DisplayedFormula atoms={atoms} bonds={bonds} width={80 * carbons + (group ? 160 : 80)} height={group === 'alcohol' && hydroxylAt !== carbons - 1 ? 275 : 200} caption={caption}/>
}
export function EsterFormula() {
  const atoms = [
    ['c1','C',60,100],['c2','C',140,100],['o','O',220,100],['c3','C',300,100],['c4','C',380,100],
    ['ox','O',140,30],['h1','H',10,100],['h2','H',60,30],['h3','H',60,170],['h4','H',300,30],['h5','H',300,170],['h6','H',380,30],['h7','H',380,170],['h8','H',440,100],
  ].map(([id,label,x,y]) => ({id,label,x,y}))
  const bonds = [['c1','c2'],['c2','o'],['o','c3'],['c3','c4'],['c2','ox',2],['c1','h1'],['c1','h2'],['c1','h3'],['c3','h4'],['c3','h5'],['c4','h6'],['c4','h7'],['c4','h8']]
  return <DisplayedFormula atoms={atoms} bonds={bonds} width={470} caption="Ethyl ethanoate: the –C(=O)–O– linkage joins the acid part to the alcohol part."/>
}
export function PolymerStructure({ kind = 'addition' }) {
  const definitions = {
    addition: { labels: ['C','C'], above: ['H','H'], below: ['H','H'], caption: 'Poly(ethene): single C–C bonds, two H atoms on each carbon, and bonds continuing through the brackets.' },
    nylon: { labels: ['C','(CH₂)₄','C','N','(CH₂)₆','N'], above: ['O',null,'O'], below: [null,null,null,'H',null,'H'], caption: 'A nylon repeat unit: –CO–(CH₂)₄–CO–NH–(CH₂)₆–NH–. Each amide linkage is –C(=O)–NH–.' },
    pet: { labels: ['O','CH₂','CH₂','O','C','C₆H₄','C'], above: [null,null,null,null,'O',null,'O'], below: [], caption: 'PET repeat unit: –O–CH₂–CH₂–O–CO–C₆H₄–CO–. C₆H₄ represents the benzene-ring part; each ester linkage is –C(=O)–O–.' },
    protein: { labels: ['N','C','C'], above: [null,'H','O'], below: ['H','R'], caption: 'A protein repeat unit: –NH–CH(R)–CO–. R is an amino acid side-chain. The peptide linkage is –C(=O)–NH–.' },
  }
  const {labels,above,below,caption} = definitions[kind]
  const spacing = kind === 'nylon' ? 90 : 72
  const atoms = labels.map((label,index) => ({id:`a${index}`,label,x:60+index*spacing,y:90}))
  const bonds = labels.slice(1).map((_,index) => [`a${index}`,`a${index+1}`])
  above.forEach((label,index) => { if (label) { atoms.push({id:`t${index}`,label,x:60+index*spacing,y:25}); bonds.push([`a${index}`,`t${index}`,label === 'O' ? 2 : 1]) } })
  below.forEach((label,index) => { if (label) { atoms.push({id:`b${index}`,label,x:60+index*spacing,y:155}); bonds.push([`a${index}`,`b${index}`]) } })
  const end = 60 + (labels.length - 1) * spacing
  return <DisplayedFormula atoms={atoms} bonds={bonds} width={end+90} height={200} caption={caption} repeat/>
}
