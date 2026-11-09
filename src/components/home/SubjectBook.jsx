import { useId } from 'react'

function CoverArt({ subject }) {
  const id = useId().replaceAll(':', '')
  const palettes = {
    chemistry: ['#6edbfa', '#397beb', '#183bb4'],
    biology: ['#64cf9b', '#1c9f72', '#006858'],
    physics: ['#ffcb78', '#f17a54', '#c94153'],
  }
  const colors = palettes[subject]
  return <svg className="subject-cover-art" viewBox="0 0 220 300" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-base`} x2=".8" y2="1"><stop stopColor={colors[0]}/><stop offset=".58" stopColor={colors[1]}/><stop offset="1" stopColor={colors[2]}/></linearGradient>
      <clipPath id={`${id}-crop`}><path d="M0 0h220v300H0z"/></clipPath>
    </defs>
    <g clipPath={`url(#${id}-crop)`}>
      <path fill={`url(#${id}-base)`} d="M0 0h220v300H0z"/>
      <path d="M-40 110 165-15h95L-20 233Z" fill="white" opacity=".06"/>
      <path d="M-30 267c95-108 168-21 282-138v190H-30Z" fill="#052859" opacity=".1"/>
      {subject === 'chemistry' && <g transform="rotate(-23 115 155)">
        <path d="M82-9h80v28h-12v89l64 128c15 29 1 50-30 50H39c-30 0-44-21-29-50l64-128V19H62V-9Z" fill="#8fd8ff"/>
        <path d="M109 18h41v90l64 128c15 29 1 50-30 50H99c18-67 27-140 10-268Z" fill="#51b1f4"/>
        <path d="m47 163-37 73c-15 29-1 50 29 50h145c31 0 45-21 30-50l-37-73c-41 20-86-20-130 0Z" fill="#2529ba"/>
        <path d="M105 165c24 6 48 10 72-2l37 73c15 29 1 50-30 50h-85c11-45 14-84 6-121Z" fill="#172090"/>
        <path d="M15 233c70 14 120-3 186-24l13 27c15 29 1 50-30 50H39c-30 0-44-21-29-50Z" fill="#3945d9" opacity=".7"/>
        <path d="M82-9h80v26H62V-9Z" fill="#b4eafa"/>
        <path d="M71 17h18v89l-29 55-17-3 28-52Z" fill="#dcf8ff" opacity=".45"/>
        <ellipse cx="42" cy="204" rx="8" ry="14" fill="#8cbdff" transform="rotate(23 42 204)"/>
        <ellipse cx="163" cy="219" rx="12" ry="8" fill="#697de7"/>
      </g>}
      {subject === 'biology' && <g transform="rotate(16 115 156)">
        <path d="M149 86c63 13 77 112 20 146l-29-28c40-22 36-62 4-76Z" fill="#9dcd77"/>
        <path d="M161 93c45 25 49 101 5 131l-14-15c37-29 30-80 1-99Z" fill="#64ab61"/>
        <path d="M126 217h37v47h-37Z" fill="#a9d88a"/>
        <path d="M129 217h13v47h-13Z" fill="#d3ebaa"/>
        <path d="M61 260c0-17 14-30 31-30h79c17 0 31 13 31 30v15H61Z" fill="#c1df95"/>
        <path d="M61 260h141v15H61Z" fill="#87bb6b"/>
        <path d="M39 177h117v17H39Z" fill="#e0ecc0"/>
        <path d="M39 187h117v11H39Z" fill="#87b774"/>
        <path d="M67 174h42v4H67Z" fill="#f7f7dc"/>
        <path d="M82 39h54v87c0 10-10 19-21 19H99c-10 0-17-9-17-19Z" fill="#d9e9ac"/>
        <path d="M114 39h22v87c0 10-10 19-21 19h-9c13-30 12-68 8-106Z" fill="#a5ca7d"/>
        <path d="M77 39h64v18H77Z" fill="#eff3c9"/>
        <path d="M90 20h39v22H90Z" fill="#769d65"/>
        <ellipse cx="109" cy="20" rx="20" ry="6" fill="#dce8b5"/>
        <ellipse cx="109" cy="20" rx="13" ry="3" fill="#1d6c59"/>
        <path d="M93 143h28v20H93Z" fill="#709b62"/>
        <ellipse cx="107" cy="163" rx="14" ry="4" fill="#e0edba"/>
        <path d="M89 65h9v52h-9Z" fill="#f4f6d9" opacity=".65"/>
        <circle cx="157" cy="134" r="24" fill="#518e58"/>
        <circle cx="153" cy="131" r="21" fill="#d5e8a4"/>
        <circle cx="153" cy="131" r="11" fill="#a0c77c"/>
        <ellipse cx="146" cy="120" rx="7" ry="3" fill="#f5f6d6" transform="rotate(-25 146 120)"/>
      </g>}
      {subject === 'physics' && <g transform="rotate(-30 115 143)">
        <ellipse cx="116" cy="145" rx="131" ry="48" stroke="#ffdd83" strokeWidth="25"/>
        <circle cx="116" cy="129" r="80" fill="#ffbd58"/>
        <path d="M143 54a80 80 0 0 1-5 153c-26-34-22-112 5-153Z" fill="#f5a143"/>
        <path d="M40 102c52 17 101 8 144-16l10 25c-54 30-101 33-158 17Z" fill="#ffcd72"/>
        <path d="M38 147c54 16 101 9 155-13l-11 34c-41 14-84 16-131 5Z" fill="#ee973b"/>
        <path d="M-11 143c12 60 235 63 254-2" stroke="#e88e32" strokeWidth="27" strokeLinecap="round"/>
        <path d="M-9 138c15 47 224 51 250 0" stroke="#ffc45b" strokeWidth="15" strokeLinecap="round"/>
        <path d="M5 152c28 21 89 29 135 23" stroke="#ffdc91" strokeWidth="4" strokeLinecap="round"/>
        <ellipse cx="89" cy="74" rx="19" ry="8" fill="#fff0bd" transform="rotate(-7 89 74)"/>
        <circle cx="25" cy="81" r="4" fill="#ffe9ad"/><path d="m199 165 5 8-5 7-5-8Z" fill="#ffe9ad"/>
      </g>}
      <path d="m29 58 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" fill="#fff6d7"/>
      <path d="m183 99 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill="#fff6d7"/>
      <path d="M0 260c90-21 131 17 220-13v53H0Z" fill="#041c46" opacity=".08"/>
    </g>
  </svg>
}

const pageCount = 14
const bookPages = Array.from({ length: pageCount }, (_, index) => ({
  depth: -16 + index * 17 / (pageCount - 1),
  spread: (index / (pageCount - 1)) ** 1.35,
  delay: (1 - index / (pageCount - 1)) * 46,
}))

export default function SubjectBook({ subject, onOpen, disabled, actionLabel }) {
  return <button className={`home-subject-card ${subject.id}`} disabled={disabled} onClick={() => onOpen(subject)} aria-label={actionLabel || `Open ${subject.title} ${subject.code}`}>
    <span className="subject-book-stage" aria-hidden="true">
      <span className="subject-book">
        <span className="subject-book-back"/>
        <span className="subject-book-block"/>
        {bookPages.map((page, index) => <span className="subject-book-page" key={index} style={{ '--page-depth': `${page.depth}px`, '--page-spread': page.spread, '--page-delay': `${page.delay}ms` }}/>) }
        <span className="subject-book-cover"><CoverArt subject={subject.id}/><span className="book-cover-binding"/><span className="home-subject-name">{subject.title}</span></span>
      </span>
    </span>
  </button>
}
