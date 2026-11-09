"""Build editable prose and clean vector diagrams from the supplied paper geometry.
Called automatically by import-0620-june-2026.py. Does not alter the source PDFs.
"""
from pathlib import Path
import json,re,html
import pymupdf
root=Path(__file__).resolve().parents[1]
p=root/'src/data/past-papers/june-2026-questions.js'
s=p.read_text();questions=json.loads(s[s.index('['):])
review=json.loads((root/'src/data/past-papers/0620-june-2026-review.json').read_text())['papers']
tables={
 '11':[3,4,8,13,15,20,33],
 '12':[2,3,8,10,17,20,23,25,27,29,32,36,37],
 '21':[1,3,6,12,24,25,30],
 '22':[2,8,11,13,18,19,21,25,31],
 '23':[2,3,14,16,17,20,25,26,29,33,40],
}
# These are text/mathematical options, not drawings.
math_options={('11',6),('21',9),('22',34),('23',13)}
# Atomic symbols, reaction schemes and diagram labels stay in the diagram.
prose_exclusions={('12',23):[90,116,144],('12',36):[117,143,171],('22',3):[473]}
# Include scientific equations between the prose as typeset text.
extra_prose={('12',8):[90],('21',9):[90],('22',14):[458],('22',18):[85,86,91],('23',17):[89]}

def fmt(text):
 text=re.sub(r'[\x00-\x08]','',text)
 text=html.escape(text)
 # Formula digits following an element/group are subscripts; leading coefficients stay full size.
 text=re.sub(r'((?:[A-Z][a-z]?|\)))(\d+)',r'\1<sub>\2</sub>',text)
 text=re.sub(r'\b(cm|dm|m)([23])\b',r'\1<sup>\2</sup>',text)
 text=re.sub(r'10(2[1-4])\b',r'10<sup>\1</sup>',text)
 return text

def native_line(line):
 spans=line['spans'];base=max((v['size']for v in spans),default=11);baseline=max((v['origin'][1]for v in spans if v['size']>=base*.9),default=0)
 parts=[]
 for v in sorted(spans,key=lambda v:v['bbox'][0]):
  t=html.escape(re.sub(r'[\x00-\x08]','',v['text']))
  if v['size']<base*.85:
   tag='sup' if v['origin'][1]<baseline-1 else 'sub';t=f'<{tag}>{t}</{tag}>'
  parts.append(t)
 return ''.join(parts).strip()

def path_svg(d):
 parts=[];last=None
 def move(pt):
  nonlocal last
  if last is None or abs(last.x-pt.x)>.01 or abs(last.y-pt.y)>.01:parts.append(f'M{pt.x:.3f},{pt.y:.3f}')
 def point(pt):return f'{pt.x:.3f},{pt.y:.3f}'
 for item in d['items']:
  kind=item[0]
  if kind=='l':move(item[1]);parts.append('L'+point(item[2]));last=item[2]
  elif kind=='c':move(item[1]);parts.append('C'+point(item[2])+' '+point(item[3])+' '+point(item[4]));last=item[4]
  elif kind=='re':
   r=item[1];parts.append(f'M{r.x0},{r.y0}H{r.x1}V{r.y1}H{r.x0}Z');last=None
  elif kind=='qu':
   q=item[1];parts.append('M'+point(q.ul)+'L'+point(q.ur)+'L'+point(q.lr)+'L'+point(q.ll)+'Z');last=None
 if d['closePath']:parts.append('Z')
 def color(c):return 'none' if c is None else '#'+''.join(f'{round(v*255):02x}'for v in c)
 dash=d.get('dashes','');dash_match=re.search(r'\[([\d. ]+)\]',dash or '')
 return f'<path d="{" ".join(parts)}" fill="{color(d["fill"])}" stroke="{color(d["color"])}" stroke-width="{d.get("width") or 0}" stroke-linejoin="round" stroke-linecap="round"'+(f' stroke-dasharray="{dash_match[1]}"'if dash_match else '')+(' fill-rule="evenodd"'if d.get('even_odd')else '')+'/>'

def vector(page,rect):
 shapes=[];bounds=[]
 for d in page.get_drawings():
  # Watermark letters are separate translucent paths, not part of any diagram.
  opacity=max(d.get('fill_opacity')or 0,d.get('stroke_opacity')or 0)
  if opacity<.2 or not rect.contains(d['rect']) or d['rect'].width>530:continue
  shapes.append(path_svg(d));bounds.append(d['rect'])
 for b in page.get_text('dict')['blocks']:
  for line in b.get('lines',[]):
   for t in line['spans']:
    box=pymupdf.Rect(t['bbox']);value=t['text']
    if t['size']>=17 or not rect.contains(pymupdf.Point((box.x0+box.x1)/2,(box.y0+box.y1)/2)) or not value.strip():continue
    if any(w in value.lower()for w in ['papacambridge','licensed for','trace id','re-uploading']):continue
    value=value.replace('VH','∆H')
    if value.strip()=='V':value='∆'
    if value.strip() in ['✓','✗']:
     x,y=t['origin'];sz=t['size'];mark=f'M{x},{y-sz*.35}l{sz*.25},{sz*.3}l{sz*.55},{-sz*.7}' if value.strip()=='✓' else f'M{x},{y-sz*.65}l{sz*.65},{sz*.65}m{-sz*.65},0l{sz*.65},{-sz*.65}'
     shapes.append(f'<path d="{mark}" fill="none" stroke="#111" stroke-width="1.1" stroke-linecap="round"/>');bounds.append(box);continue
    font='Times New Roman,serif'if 'Times'in t['font']else 'Arial,sans-serif'
    weight='700'if 'Bold'in t['font']else '400'
    shapes.append(f'<text x="{t["origin"][0]}" y="{t["origin"][1]}" font-family="{font}" font-size="{t["size"]}" font-weight="{weight}" fill="#111">{html.escape(value)}</text>');bounds.append(box)
 if not bounds:return None
 box=bounds[0]
 for r in bounds[1:]:box=box|r
 box=box+(-3,-3,3,3)
 return {'viewBox':f'{box.x0:.2f} {box.y0:.2f} {box.width:.2f} {box.height:.2f}','width':round(box.width,2),'height':round(box.height,2),'markup':''.join(shapes)}

def prose_blocks(lines):
 blocks=[];current=[];last=None
 def flush():
  nonlocal current
  if current:blocks.append({'type':'paragraph','html':' '.join(current)});current=[]
 for y,bottom,value in lines:
  # PDF statement numbers are not body paragraphs. Give them a real list layout.
  match=re.match(r'^(?:([1-4])\s+|•\s*)(.+)',re.sub('<[^>]+>','',value))
  if match:
   flush()
   if not blocks or blocks[-1]['type']!='list':blocks.append({'type':'list','items':[]})
   blocks[-1]['items'].append(re.sub(r'^(?:\d|•)\s*','',value));last=bottom;continue
  if last is not None and y-last>6:flush()
  current.append(value);last=bottom
 flush();return blocks

for q in questions:
 variant=q['source']['paperCode'].split('/')[1];number=q['source']['questionNumber'];key=(variant,number)
 doc=pymupdf.open(root/'public'/q['source']['pdfUrl'].lstrip('/'));page=doc[q['source']['page']-1]
 top=q['source']['top'];starts=[]
 for w in page.get_text('words'):
  if 42<w[0]<56 and top+4<w[1]<760 and re.fullmatch(r'\d{1,2}',w[4]) and int(w[4])==number+1:starts.append(w[1])
 end=min(starts)-10 if starts else 774
 all_lines=[l for b in page.get_text('dict')['blocks']for l in b.get('lines',[]) if l['bbox'][1]>=top-3 and l['bbox'][1]<end and l.get('spans') and max(t['size']for t in l['spans'])<17]
 labels=sorted([t for l in all_lines for t in l['spans']if re.fullmatch('[ABCD]',t['text'].strip()) and 'Bold'in t['font']],key=lambda t:t['text'].strip())
 labeltop=min(t['bbox'][1]for t in labels)
 shared=number in review[variant].get('sharedDiagram',[])
 # Shared labelled diagrams have A-D inside the drawing rather than answer rows.
 narrative_end=end if shared else labeltop-3
 visual=number in review[variant]['visual']
 if not visual:
  chunks=re.split(r'\n\s*\n',q['prompt'])
  parsed=[]
  for chunk in chunks:
   for line in chunk.split('\n'):
    parsed.append((0 if not parsed else 24,12,fmt(line)))
  q['content']=prose_blocks(parsed)
 else:
  candidates=[]
  for line in sorted(all_lines,key=lambda l:l['bbox'][1]):
   x,y,_,bottom=line['bbox'];plain=''.join(t['text']for t in line['spans']).strip()
   if y>=narrative_end:continue
   extra=any(abs(y-v)<2 for v in extra_prose.get(key,[]))
   excluded=any(abs(y-v)<2 for v in prose_exclusions.get(key,[]))
   body=70<=x<74 and (len(plain)>28 or (len(plain)>13 and plain.endswith(('.', '?'))) or (candidates and 0<y-candidates[-1][1]<17))
   numbered=110<x<120 and plain in ['1','2','3','4']
   if excluded or not(body or extra or numbered):continue
   if numbered:
    same=[l for l in all_lines if abs(l['bbox'][1]-y)<2 and l['bbox'][0]>135]
    value=plain+' '+ ' '.join(native_line(l)for l in same)
   else:value=native_line(line)
   candidates.append((y,bottom,value))
  # Keep complete original option tables; choices underneath are plain A–D.
  is_table=number in tables[variant]
  boundary=end if is_table or shared else labeltop-3
  if number in review[variant]['diagramOptions'] and key not in math_options and candidates:
   boundary=max(v[1] for v in candidates)+2
  candidates=[v for v in candidates if v[0]<boundary]
  groups=[]
  for item in candidates:
   if groups and item[0]-groups[-1][-1][1]<18:groups[-1].append(item)
   else:groups.append([item])
  content=[];cursor=top-3
  for group in groups:
   drawing=vector(page,pymupdf.Rect(64,cursor,565,group[0][0]-1))
   if drawing:content.append({'type':'diagram','drawing':drawing})
   content+=prose_blocks(group);cursor=group[-1][1]+2
  drawing=vector(page,pymupdf.Rect(64,cursor,565,boundary))
  if drawing:content.append({'type':'diagram','drawing':drawing})
  q['content']=content
  if is_table:
   # The complete table includes its own A–D labels, so no row is sliced out.
   q['labelChoices']=True
  elif number in review[variant]['diagramOptions'] and key not in math_options:
   # Reconstruct answer diagrams from PDF line/curve geometry and editable text.
   boxes=[pymupdf.Rect(t['bbox'])for t in labels]
   same=max(b.y0 for b in boxes)-min(b.y0 for b in boxes)<3
   grid=not same and abs(boxes[0].y0-boxes[1].y0)<3 and abs(boxes[2].y0-boxes[3].y0)<3
   drawings=[]
   for i,b in enumerate(boxes):
    if same:
     centres=[(b.x0+b.x1)/2 for b in boxes]
     if key in [('22',3),('23',37)]:rect=pymupdf.Rect((centres[i-1]+centres[i])/2 if i else 64,b.y1+2,(centres[i]+centres[i+1])/2 if i<3 else 565,end)
     else:rect=pymupdf.Rect(b.x1+3,labeltop-32,boxes[i+1].x0-3 if i<3 else 565,end)
    elif grid:
     mid=(boxes[0].x0+boxes[1].x0)/2
     rect=pymupdf.Rect(mid if i%2 else 64,b.y1+2,565 if i%2 else mid,boxes[2].y0-4 if i<2 else end)
    else:
     # Full row height, including superscripts/atoms above the option baseline.
     rect=pymupdf.Rect(b.x1+3,(boxes[i-1].y0+b.y0)/2 if i else b.y0-33,565,(b.y0+boxes[i+1].y0)/2 if i<3 else end)
    drawings.append(vector(page,rect))
   q['optionDrawings']=drawings
 # Native equation options are set explicitly where PDF extraction merges indices.
 q['optionHtml']=[fmt(v.replace('\n',' '))for v in q['options']]
 for field in ['stemImage','optionImages']:q.pop(field,None)

# Exact mathematical typesetting, preserving the equations printed in the paper.
overrides={
 ('11',6):['<sup>12</sup><sub>6</sub>W','<sup>24</sup><sub>12</sub>X','<sup>50</sup><sub>24</sub>Y','<sup>57</sup><sub>26</sub>Z'],
 ('22',34):['CH<sub>3</sub>CH<sub>2</sub>Cl + Cl<sub>2</sub> → CH<sub>3</sub>CHCl<sub>2</sub> + HCl','CH<sub>3</sub>CH<sub>2</sub>OH → CH<sub>2</sub>=CH<sub>2</sub> + H<sub>2</sub>O','C<sub>2</sub>H<sub>5</sub>OH + 3O<sub>2</sub> → 2CO<sub>2</sub> + 3H<sub>2</sub>O','CH<sub>2</sub>=CH<sub>2</sub> + HBr → CH<sub>3</sub>CH<sub>2</sub>Br'],
}
for q in questions:
 key=(q['source']['paperCode'].split('/')[1],q['source']['questionNumber'])
 if key in overrides:q['optionHtml']=overrides[key]
 if key==('22',3):q['content']=[{'type':'paragraph','html':'○ and ● represent atoms of different elements.'}]+[b for b in q['content']if b['type']=='paragraph']
 if key==('12',3):q['content'][0]['html']='Which row identifies the particles present in the nucleus and in the shells of one atom of <sup>7</sup><sub>3</sub>Li?'
 if key==('22',18):
  q['content'][1]['html']='3SO<sub>2</sub> + Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup> + 2H<sup>+</sup> → 3SO<sub>4</sub><sup>2−</sup> + 2Cr<sup>3+</sup> + H<sub>2</sub>O'
 if key==('23',32):q['content']=[{'type':'paragraph','html':'The formulas of three hydrocarbons are listed.'},{'type':'list','items':['CH<sub>3</sub>CH(CH<sub>3</sub>)CH<sub>3</sub>','CH<sub>3</sub>CH<sub>2</sub>CH<sub>2</sub>CH=CH<sub>2</sub>','CH<sub>3</sub>CH<sub>2</sub>CH<sub>2</sub>CH<sub>2</sub>CH<sub>3</sub>']},{'type':'paragraph','html':'Which compounds are members of the same homologous series?'}]
 q['prompt']='\n\n'.join(re.sub('<[^>]+>','',b['html'])for b in q['content']if b['type']=='paragraph')
p.write_text('// Generated from the supplied PDFs; run import then format scripts.\nexport const june2026Questions = '+json.dumps(questions,ensure_ascii=False,indent=2)+'\n')
print('Formatted',len(questions),'questions with native prose and vector drawings.')
