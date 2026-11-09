"""Regenerate original sample PDFs. Requires reportlab and pymupdf.
Production worksheets can be registered directly in src/data/worksheets.js.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
import pymupdf

out = Path(__file__).resolve().parents[1] / 'public' / 'worksheets'
out.mkdir(parents=True, exist_ok=True)
sets = {
'easy': [
 [('State how many covalent bonds a carbon atom usually forms.', 1), ('State how many covalent bonds a hydrogen atom forms.', 1), ('Draw the displayed formula of methane, CH4. Show every atom and bond.', 2), ('Explain what a displayed formula tells you about a molecule.', 2)],
 [('Name the two elements present in every hydrocarbon.', 2), ('State what is meant by a saturated compound.', 1), ('Draw the displayed formula of ethane, C2H6.', 2), ('Identify the functional group present in an alcohol.', 1)]
],
'medium': [
 [('Describe two features shared by members of a homologous series.', 2), ('An alkane contains six carbon atoms. Use its general formula to determine its molecular formula. Show your working.', 2), ('Draw the displayed formula of ethene, C2H4.', 2), ('Explain why ethene is described as unsaturated.', 2)],
 [('Give the general formula of an alkene with one carbon-carbon double bond.', 1), ('A compound has the formula C4H9OH. Identify its homologous series and functional group.', 2), ('Explain why members of the same homologous series have similar chemical properties.', 2), ('Describe the difference between a molecular formula and a displayed formula.', 2)]
],
'hard': [
 [('An open-chain hydrocarbon has the formula C5H10 and contains one carbon-carbon double bond. Identify its homologous series and justify your answer.', 2), ('Draw the displayed formula of ethanoic acid, CH3COOH. Identify the carboxyl group.', 3), ('Explain why the O-H bond in ethanoic acid does not mean the compound is classified as an alcohol.', 2), ('Two compounds have the molecular formula C4H10. Explain how this is possible.', 2)],
 [('A carboxylic acid has the formula C3H7COOH. State the total number of carbon atoms and write its molecular formula.', 2), ('Describe how the formulae of successive members of a homologous series differ.', 1), ('An alkane and an alkene each contain four carbon atoms. Give both molecular formulae and explain the difference in hydrogen atoms.', 3), ('Draw two different structural formulae for compounds with the molecular formula C4H10.', 2)]
]}
for difficulty, worksheets in sets.items():
 for index, questions in enumerate(worksheets, 1):
  stem = f'11-1-{difficulty}-{index}'
  path = out / f'{stem}.pdf'
  pdf = canvas.Canvas(str(path), pagesize=A4)
  pdf.setTitle(f'11.1 Formulae, functional groups and terminology - {difficulty.title()} {index}')
  pdf.setAuthor('Study - original practice worksheets')
  for page in range(2):
   pdf.setStrokeColorRGB(.82,.84,.84)
   pdf.roundRect(30, 35, 535, 770, 16)
   pdf.setFillColorRGB(.05,.65,.73)
   pdf.setFont('Helvetica-Bold', 10)
   pdf.drawString(48, 779, 'CHEMISTRY / IGCSE')
   pdf.setFillColorRGB(.07,.07,.07)
   pdf.setFont('Helvetica-Bold', 17)
   pdf.drawString(48, 749, f'11.1 Formulae and functional groups')
   pdf.setFont('Helvetica', 10)
   pdf.drawString(48, 727, f'{difficulty.title()} {index}  /  Original practice worksheet')
   pdf.setFont('Helvetica', 9)
   pdf.drawString(48, 700, 'Name: __________________________     Date: ______________')
   for slot in range(2):
    number = page * 2 + slot
    question, marks = questions[number]
    y = 652 - slot * 283
    pdf.setFont('Times-Bold', 12)
    pdf.drawString(49, y, str(number + 1))
    pdf.setFont('Times-Roman', 12)
    lines = simpleSplit(question, 'Times-Roman', 12, 442)
    for line in lines:
     pdf.drawString(75, y, line)
     y -= 18
    pdf.setStrokeColorRGB(.77,.77,.77)
    for line in range(4):
     baseline = y - 30 - line * 29
     pdf.line(75, baseline, 536, baseline)
    pdf.setFont('Times-Bold', 10)
    pdf.drawRightString(536, 431 - slot * 283, f'(Total for question {number + 1} is {marks} {"mark" if marks == 1 else "marks"})')
   pdf.setFillColorRGB(.5,.5,.5)
   pdf.setFont('Helvetica', 9)
   pdf.drawString(48, 53, 'Original practice material - not an official examination paper')
   pdf.drawRightString(546, 53, f'{page + 1} / 2')
   pdf.showPage()
  pdf.save()
  doc = pymupdf.open(path)
  assert len(doc) == 2
  assert all(len(page.get_text()) > 200 for page in doc)
  doc[0].get_pixmap(matrix=pymupdf.Matrix(.55,.55)).save(out / f'{stem}.png')
  if stem == '11-1-easy-1':
   doc[0].get_pixmap(matrix=pymupdf.Matrix(1.5,1.5)).save('/tmp/worksheet-proof.png')
print('Created six selectable, two-page sample worksheets and their previews.')
