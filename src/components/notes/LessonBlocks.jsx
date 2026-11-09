import { Info, CircleAlert, KeyRound } from 'lucide-react'
import { ChainFormula } from './OrganicBlocks'

export function Callout({ kind = 'example', title, children }) {
  const Icon = kind === 'mistake' ? CircleAlert : kind === 'exam' ? KeyRound : Info
  const label = kind === 'mistake' ? 'Common Mistake' : kind === 'exam' ? 'Exam technique' : 'Example'
  return <div className={`lesson-callout ${kind}`}>
    <div className="callout-label"><Icon aria-hidden="true"/><span>{label}</span></div>
    {title && <h3>{title}</h3>}
    {children}
  </div>
}

export function Molecule({ acid = false }) {
  return <ChainFormula carbons={2} group={acid ? 'acid' : undefined} caption={acid ? 'Displayed formula of ethanoic acid, CH₃COOH.' : 'Displayed formula of ethane, CH₃CH₃.'}/>
}

export function MatchingExample() {
  return <Callout title="Matching formulae to their series"><ul>
    <li><span className="chem">C₈H₁₈</span> has <span className="chem">2(8) + 2 = 18</span> hydrogen atoms, so it fits <span className="chem">CₙH₂ₙ₊₂</span> and is an <strong>alkane</strong>.</li>
    <li><span className="chem">C₅H₁₀</span> has <span className="chem">2(5) = 10</span> hydrogen atoms, so it fits <span className="chem">CₙH₂ₙ</span> and, with one C=C bond in an open chain, is an <strong>alkene</strong>.</li>
    <li><span className="chem">C₄H₉OH</span> ends in <span className="chem">OH</span> and its chain part fits <span className="chem">CₙH₂ₙ₊₁</span> with <span className="chem">n = 4</span>, so it is an <strong>alcohol</strong>.</li>
    <li><span className="chem">C₃H₇COOH</span> ends in <span className="chem">COOH</span> with <span className="chem">n = 3</span>, so it is a <strong>carboxylic acid</strong> with four carbon atoms in total.</li>
  </ul></Callout>
}

export function CommonMistakes() {
  return <Callout kind="mistake"><ul>
    <li>Do not take <span className="chem"><i>n</i></span> as the total number of carbon atoms in a carboxylic acid written as <span className="chem">CₙH₂ₙ₊₁COOH</span>, because the <span className="chem">–COOH</span> group adds one more.</li>
    <li>Do not use <span className="chem">2n + 2</span> for an alkene, because the double bond means an alkene has two fewer hydrogen atoms than the alkane with the same number of carbons.</li>
    <li>Do not leave out the hydrogen atom of the <span className="chem">O – H</span> bond when you draw an alcohol or carboxylic acid.</li>
    <li>Do not draw a carbon atom with three or five bonds, because carbon always has four.</li>
  </ul></Callout>
}

export function AcidExample() {
  return <Callout title="Spotting the carboxyl group"><ul>
    <li>The displayed formula of <strong>ethanoic acid</strong> has one ordinary carbon on the left and a second carbon on the right.</li>
  </ul><Molecule acid/><ul>
    <li>The right-hand carbon has a <strong>double bond to oxygen</strong> and a <strong>single bond to an <span className="chem">O – H</span></strong>, which together make the <span className="chem">–COOH</span> group.</li>
    <li>This group is the functional group, so the compound is a <strong>carboxylic acid</strong>.</li>
    <li>The <span className="chem">O – H</span> here is part of <span className="chem">–COOH</span>, so it does not make ethanoic acid an alcohol.</li>
  </ul></Callout>
}

export function TeachingIllustration() {
  return <svg className="teaching-illustration" viewBox="0 0 280 210" aria-hidden="true">
    <path d="M164 190c-7-34-45-37-47-86-2-47 31-63 70-76 16-5 35-19 39-12 7 10-7 15 3 26 37 37 49 89 12 113-23 15-49 15-64 34-5 6-12 8-13 1z" fill="#d743a8" stroke="#f2d9e9" strokeWidth="10" strokeLinejoin="round"/>
    <path d="M30 78c-8-17 4-24 20-18 16 5 24 9 44 18 35 16 43 54 20 77-24 25-77 16-85-14-6-22 0-42 11-49z" fill="#15d9c8" stroke="#ddf6ef" strokeWidth="8"/>
    <g fill="#061d24"><ellipse cx="63" cy="118" rx="12" ry="15"/><ellipse cx="96" cy="116" rx="12" ry="15"/><path d="M145 91c0-24 31-25 31 0v7c-12-5-17-5-31 0zm45-3c0-24 31-25 31 0v7c-12-5-17-5-31 0z"/></g>
    <g fill="white"><circle cx="68" cy="111" r="6"/><circle cx="101" cy="109" r="6"/><rect x="143" y="81" width="15" height="8" rx="4"/><rect x="187" y="77" width="15" height="8" rx="4"/></g>
    <g fill="#fff"><circle cx="31" cy="167" r="15"/><circle cx="53" cy="173" r="18"/><circle cx="76" cy="167" r="18"/><circle cx="100" cy="171" r="18"/><circle cx="119" cy="162" r="16"/></g>
    <path d="m117 143 22-30" stroke="#f5b20d" strokeWidth="6" strokeLinecap="round"/><path d="m139 101 3 8 8 1-6 6 1 8-7-4-7 4 1-8-6-6 9-1z" fill="#ffcd23"/>
    <ellipse cx="228" cy="60" rx="8" ry="14" transform="rotate(-40 228 60)" fill="#f58bc9"/>
  </svg>
}
