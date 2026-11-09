"""Import the five supplied 0620 June 2026 MCQ papers.
Run with: python3 scripts/import-0620-june-2026.py --input-dir /path/to/papers
Requires pymupdf. Topic, level, difficulty and published answer-key review is
kept separately in src/data/past-papers/0620-june-2026-review.json.
No PDF text is treated as an instruction. The supplied PDFs remain unchanged.
"""
from pathlib import Path
import argparse, json, re, shutil, subprocess, sys
import pymupdf

root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--input-dir',type=Path,required=True)
args=parser.parse_args()
review=json.loads((root/'src/data/past-papers/0620-june-2026-review.json').read_text())
papers=root/'public/past-papers'
papers.mkdir(parents=True,exist_ok=True)
titles=dict(re.findall(r"\['(\d+\.\d+)', '([^']+)'",(root/'src/data/chemistry-syllabus.js').read_text()))
output=[]

def clean(text):
    paragraphs=re.split(r'\n\s*\n',text.strip())
    return '\n\n'.join(re.sub(r'\s+',' ',p).strip() for p in paragraphs if p.strip())

def text_in(page,rect):
    # Select whole words by their centres. PDF clipping can otherwise extract
    # just the descenders of a word from the preceding answer (e.g. stray 'g').
    words=[w for w in page.get_text('words') if rect.contains(pymupdf.Point((w[0]+w[2])/2,(w[1]+w[3])/2)) and w[3]-w[1]<23]
    lines=[]
    for word in sorted(words,key=lambda w:((w[1]+w[3])/2,w[0])):
        centre=(word[1]+word[3])/2
        line=next((line for line in reversed(lines) if abs(line[0]-centre)<3),None)
        if line is None:lines.append([centre,[word]])
        else:line[1].append(word)
    result='';previous=None
    for y,items in lines:
        text=' '.join(w[4] for w in sorted(items,key=lambda w:w[0]))
        separator='' if previous is None else '\n\n' if y-previous>18 else '\n' if re.match(r'^(?:[1-4]\s|•)',text) else ' '
        result+=separator+text;previous=y
    return result.strip()

def spans(page,top,bottom):
    return [s for b in page.get_text('dict')['blocks'] for line in b.get('lines',[]) for s in line['spans']
            if top-2<=s['bbox'][1]<bottom and 58<=s['bbox'][0]<565
            and not any(x in s['text'] for x in ['PapaCambridge','papacambridge','Trace ID','Licensed for','Re-uploading'])
            and s['size']<17]


for variant,meta in review['papers'].items():
    filename=f'0620_s26_qp_{variant}.pdf'
    original=args.input_dir/filename
    doc=pymupdf.open(original)
    shutil.copyfile(original,papers/filename)
    starts=[]
    for pi,page in enumerate(doc):
        for x0,y0,x1,y1,text,*_ in page.get_text('words'):
            if 42<x0<56 and 50<y0<760 and re.fullmatch(r'\d{1,2}',text) and 1<=int(text)<=40:
                starts.append((int(text),pi,y0))
    assert [x[0] for x in starts]==list(range(1,41)),variant
    for index,(number,pi,top) in enumerate(starts):
        page=doc[pi]
        bottom=starts[index+1][2]-10 if index<39 and starts[index+1][1]==pi else 774
        ss=spans(page,top,bottom)
        labels=sorted([s for s in ss if re.fullmatch('[ABCD]',s['text'].strip()) and 'Bold' in s['font']],key=lambda s:s['text'].strip())
        assert len(labels)==4,(variant,number,'option labels')
        boxes=[pymupdf.Rect(s['bbox']) for s in labels]
        visual=number in meta['visual']
        diagram_options=number in meta['diagramOptions']
        shared=number in meta.get('sharedDiagram',[])
        content_bottom=max([s['bbox'][3] for s in ss]+[r['rect'].y1 for r in page.get_drawings() if r['rect'].y0>=top-2 and r['rect'].y1<bottom and r['rect'].x0>=58]+[boxes[-1].y1])+5
        content_bottom=min(bottom,content_bottom)
        same_row=max(b.y0 for b in boxes)-min(b.y0 for b in boxes)<3
        grid=not same_row and abs(boxes[0].y0-boxes[1].y0)<3 and abs(boxes[2].y0-boxes[3].y0)<3
        vertical=not same_row and not grid
        # Diagram rows may have O/H labels above the A–D labels; keep them.
        padding=32 if diagram_options and vertical else 12 if diagram_options and same_row else 4
        option_top=max(top+17,min(b.y0 for b in boxes)-padding)
        prompt=text_in(page,pymupdf.Rect(64,top-2,565,option_top))
        row_rects=[]
        for choice,b in enumerate(boxes):
            if same_row:
                right=boxes[choice+1].x0-5 if choice<3 else 565
                row_rects.append(pymupdf.Rect(b.x1+4,option_top,right,content_bottom))
            elif grid:
                middle=(boxes[0].x0+boxes[1].x0)/2
                right=choice%2==1
                lower=choice>=2
                row_rects.append(pymupdf.Rect(middle if right else 64,b.y1+5,565 if right else middle,content_bottom if lower else boxes[2].y0-8))
            else:
                before=(boxes[choice-1].y0+b.y0)/2 if choice else option_top
                after=(b.y0+boxes[choice+1].y0)/2 if choice<3 else content_bottom
                row_rects.append(pymupdf.Rect(b.x1+4,before,565,after))
        # Four diagrams in one horizontal row need complete cells rather than
        # clipping from a label positioned above the centre of each drawing.
        if diagram_options and same_row and (variant,number) in [('22',3),('23',37)]:
            centres=[(b.x0+b.x1)/2 for b in boxes]
            for choice,b in enumerate(boxes):
                left=(centres[choice-1]+centres[choice])/2 if choice else 64
                right=(centres[choice]+centres[choice+1])/2 if choice<3 else 565
                row_rects[choice]=pymupdf.Rect(left,b.y1+5,right,content_bottom)
        option_text=[text_in(page,r) for r in row_rects]
        options=[text or f'Diagram {chr(65+i)}' for i,text in enumerate(option_text)]
        if str(number) in meta.get('optionOverrides',{}):options=meta['optionOverrides'][str(number)]
        entry={
            'id':f'cie-0620-s26-{variant}-q{number:02}',
            'topic':titles[meta['topics'][index]],'subtopicId':meta['topics'][index],
            'prompt':prompt,'options':options,'answer':ord(meta['answers'][index])-65,
            'difficulty':{'e':'easy','m':'medium','h':'hard'}[meta['difficulty'][index]],
            'level':'extended' if number in meta['extended'] else 'core','paper':variant[0],
            'estimatedFirstTryRate':{'e':85,'m':65,'h':45}[meta['difficulty'][index]],
            'explanation':f'The published Cambridge mark scheme for 0620/{variant}, May/June 2026, question {number}, gives answer {meta["answers"][index]}.',
            'source':{'pdfUrl':'/past-papers/'+filename,'originalUrl':review['markSchemeBase']+filename,'page':pi+1,'questionNumber':number,'top':round(top),'paperCode':f'0620/{variant}','session':review['session'],'markSchemeUrl':review['markSchemeBase']+f'0620_s26_ms_{variant}.pdf#page={2 if number<=28 else 3}','answerVerified':True},
        }
        if shared:
            entry['options']=[f'{"Outlet" if variant=="21" else "Label"} {letter}' for letter in 'ABCD']
        if str(number) in meta.get('answerDescriptions',{}):entry['answerDescription']=meta['answerDescriptions'][str(number)]
        assert entry['prompt'],entry['id']
        output.append(entry)
assert len(output)==200
path=root/'src/data/past-papers/june-2026-questions.js'
path.write_text('// Generated from the five user-supplied PDFs; see scripts/import-0620-june-2026.py.\nexport const june2026Questions = '+json.dumps(output,ensure_ascii=False,indent=2)+'\n')
print(f'Imported {len(output)} source-linked questions.')
subprocess.run([sys.executable, str(root/'scripts/format-0620-june-2026.py')], check=True)
