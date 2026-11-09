import { Callout, MatchingExample, CommonMistakes, AcidExample } from '@/components/notes/LessonBlocks'
import { ChainFormula, ChemistryTable, Definition, DisplayedFormula, Equation, EsterFormula, Extended, PolymerStructure, Understanding } from '@/components/notes/OrganicBlocks'

const section = (id, title, objectives, content, extended = false) => ({ id, title, objectives, content, extended })
const check = (items) => <Understanding items={items}/>

export const organicLessons = {
  '11.1': { sections: [
    section('displayed-formulae', 'Displayed formulae', [1], <>
      <Definition term="Displayed formula"><p>A drawing that shows <strong>every atom</strong> in a molecule and <strong>every bond</strong> between its atoms.</p></Definition>
      <ol className="explanation"><li>Write each atom as its <strong>element symbol</strong>. Draw one line for a single covalent bond and two lines for a double bond.</li><li>Check the bond total: <strong>carbon forms four</strong>, <strong>hydrogen one</strong> and <strong>oxygen two</strong>. A double bond counts as two.</li><li>Draw the carbon chain first. Add any functional group, then fill the unused bonds with hydrogen atoms.</li></ol>
      <ChainFormula carbons={1} caption="Methane, CH₄: one carbon with four single bonds."/>
      <ChainFormula carbons={2} caption="Ethane, C₂H₆: each carbon has three C–H bonds and one C–C bond."/>
      <Callout kind="exam" title="A quick bond-count check"><p>Point to each carbon in your drawing and count its bond lines. If you get three or five, fix the drawing before counting the atoms. Writing CH₃CH₃ alone is <strong>not</strong> a displayed formula.</p></Callout>
    </>),
    section('molecular-formulae', 'Molecular and structural formulae', [7], <>
      <Definition term="Molecular formula"><p>The number of atoms of each element in <strong>one molecule</strong>.</p></Definition>
      <p>Ethanol has molecular formula <strong>C₂H₆O</strong>: two carbon atoms, six hydrogen atoms and one oxygen atom. This counts atoms but does not tell you their connections.</p>
      <Extended><Definition term="Structural formula"><p>A formula that shows <strong>how the atoms are arranged and connected</strong>, without drawing every individual bond.</p></Definition><ChemistryTable headers={['Compound', 'Structural formula', 'What to notice']} rows={[
        ['Ethene', 'CH₂=CH₂', 'The C=C bond is shown explicitly.'],['Ethanol', 'CH₃CH₂OH', '–OH is attached to the carbon chain.'],['Methyl ethanoate', 'CH₃COOCH₃', '–COO– joins the two carbon-containing parts.'],
      ]}/><p>Read a structural formula as a set of connections. In <strong>CH₃CH(CH₃)CH₃</strong>, the bracketed CH₃ is a branch attached to the middle CH.</p></Extended>
      <Callout title="Count all the hydrogen atoms"><p>CH₃CH₂OH contains <strong>3 + 2 + 1 = 6 hydrogen atoms</strong>. The hydrogen in –OH still counts. Its molecular formula is C₂H₆O, not C₂H₅O.</p></Callout>
    </>),
    section('general-formulae', 'General formulae', [2], <>
      <Definition term="General formula"><p>A rule that gives the formula of a member of a <strong>homologous series</strong> when you choose a value of <em>n</em>.</p></Definition>
      <ChemistryTable headers={['Series', 'General formula', 'Example']} rows={[
        ['Alkanes', 'CₙH₂ₙ₊₂', 'n = 3 → C₃H₈ (propane)'],['Alkenes', 'CₙH₂ₙ', 'n = 3 → C₃H₆ (propene)'],['Alcohols', 'CₙH₂ₙ₊₁OH', 'n = 2 → C₂H₅OH (ethanol)'],['Carboxylic acids', 'CₙH₂ₙ₊₁COOH', 'n = 1 → CH₃COOH (ethanoic acid)'],
      ]}/>
      <p>These alkene formulae apply to <strong>open-chain compounds with one C=C bond</strong>. A matching molecular formula alone does not prove the structure.</p>
      <Callout title="The extra carbon in –COOH"><p>In CₙH₂ₙ₊₁COOH, <em>n</em> counts the carbons in the part <strong>before COOH</strong>. For C₃H₇COOH, the whole molecule has <strong>four</strong> carbon atoms. Methanoic acid is HCOOH: the same rule with n = 0.</p></Callout>
      <MatchingExample/>
    </>),
    section('functional-groups', 'Functional groups and saturation', [3,5,6], <>
      <Definition term="Functional group"><p>The atom or group of atoms that gives a family of organic compounds its <strong>characteristic chemical reactions</strong>.</p></Definition>
      <ChemistryTable headers={['Family', 'Feature to look for', 'Example']} rows={[
        ['Alkane', 'Only single C–C bonds; contains C and H only', 'Ethane, CH₃CH₃'],['Alkene', 'C=C', 'Ethene, CH₂=CH₂'],['Alcohol', '–OH attached to a saturated carbon', 'Ethanol, CH₃CH₂OH'],['Carboxylic acid', '–C(=O)–OH, abbreviated –COOH', 'Ethanoic acid, CH₃COOH'],
      ]}/>
      <Definition term="Saturated compound"><p>A compound whose molecules have <strong>only single carbon–carbon bonds</strong>.</p></Definition>
      <Definition term="Unsaturated compound"><p>A compound whose molecules have <strong>at least one carbon–carbon bond that is not single</strong>. The alkenes in this course have C=C bonds.</p></Definition>
      <p>Check the <strong>carbon–carbon</strong> bonds. A C=O bond in a carboxylic acid is not a C=C bond.</p><AcidExample/>
    </>),
    section('homologous-series', 'Homologous series', [4,9], <>
      <Definition term="Homologous series"><p>A family of organic compounds that have the <strong>same functional group</strong> and therefore react in <strong>similar ways</strong>.</p></Definition>
      <p>Ethanol and propanol are both alcohols. Their carbon chains differ in length, but both contain the alcohol –OH group.</p>
      <Extended><p>Know these five features together:</p><ol className="explanation"><li>The <strong>same functional group</strong>.</li><li>The <strong>same general formula</strong>.</li><li>Successive members differ by <strong>CH₂</strong>.</li><li>A <strong>gradual trend in physical properties</strong>, such as increasing boiling point as the molecules get larger.</li><li><strong>Similar chemical properties</strong>, because their functional groups are the same.</li></ol></Extended>
      <Callout kind="exam" title="Explain, rather than repeat the question"><p>“They are in the same series” is not enough to explain similar reactions. Write: <strong>they contain the same functional group</strong>. For a boiling-point trend, refer to stronger intermolecular attractions between larger molecules, not stronger covalent bonds.</p></Callout>
    </>),
    section('structural-isomers', 'Structural isomers', [8], <>
      <Definition term="Structural isomers"><p>Compounds with the <strong>same molecular formula</strong> but a <strong>different arrangement of bonds between atoms</strong>.</p></Definition>
      <ChemistryTable headers={['Molecular formula', 'Structural formula 1', 'Structural formula 2']} rows={[
        ['C₄H₁₀', 'CH₃CH₂CH₂CH₃', 'CH₃CH(CH₃)CH₃'],['C₄H₈', 'CH₂=CHCH₂CH₃ (but-1-ene)', 'CH₃CH=CHCH₃ (but-2-ene)'],
      ]}/>
      <p>In the first pair, one carbon skeleton is straight and the other is <strong>branched</strong>. In the second pair, the <strong>double bond is in a different position</strong>. In each pair, count the atoms to confirm the molecular formula stays the same.</p>
      <Callout kind="mistake"><p>Turning a drawing around does <strong>not</strong> make another isomer. CH₃CH₂CH₂CH₃ and CH₃CH₂CH₂CH₃ drawn in the opposite direction have the same connections.</p></Callout>
    </>, true),
    section('test-your-understanding', 'Test your understanding', [], <><CommonMistakes/>{check([
      ['What is the molecular formula of an alkane with five carbons?', <>C₅H₁₂: substitute n = 5 into CₙH₂ₙ₊₂.</>],
      ['What must a displayed formula include?', <>Every atom and every bond, including each C–H and O–H bond.</>],
      ['How many carbon atoms are in C₂H₅COOH?', <>Three. COOH contains one carbon in addition to the two in C₂H₅.</>],
      ['Why do members of a homologous series have similar reactions?', <>They have the same functional group.</>],
      ['Extended: are CH₂=CHCH₂CH₃ and CH₃CH=CHCH₃ structural isomers?', <>Yes. Both are C₄H₈, but the double bond joins a different pair of carbon atoms.</>],
      ['Extended: write the structural formula of ethanol and explain what it tells you.', <>CH₃CH₂OH. It shows two connected carbon atoms with –OH attached to the second carbon.</>],
    ])}</>),
  ]},
  '11.2': { sections: [
    section('naming-rules', 'Read the name in two parts', [1,2], <>
      <p>The start of an organic name tells you the <strong>number of carbon atoms</strong>. The ending tells you the <strong>family</strong>. Learn the pattern so you can work out unfamiliar examples.</p>
      <ChemistryTable headers={['Carbons', 'Name stem', 'Alkane example']} rows={[[1,'meth-','methane'],[2,'eth-','ethane'],[3,'prop-','propane'],[4,'but-','butane']]}/>
      <ChemistryTable headers={['Ending', 'Family', 'Recognising feature']} rows={[
        ['-ane','Alkane','Only single C–C bonds; C and H only'],['-ene','Alkene','A C=C bond'],['-ol','Alcohol','An alcohol –OH group'],['-oic acid','Carboxylic acid','A –COOH group'],
      ]}/>
      <Callout title="Ethanoic acid"><p><strong>eth-</strong> means two carbon atoms in total. <strong>-oic acid</strong> means a carboxylic acid. One of those two carbons is the carbon in COOH, so the structural formula is <strong>CH₃COOH</strong>.</p></Callout>
      <p>A molecular formula can help identify a series when the structure is consistent with it. For example, C₂H₆ fits an alkane. For C₄H₈, inspect the displayed formula to check for <strong>C=C</strong>; the formula alone is not always enough.</p>
    </>),
    section('core-molecules', 'The five Core molecules', [1], <>
      <p>Be able to <strong>name and draw</strong> all five of these, including all atoms and bonds. Also name the products you meet in 11.4–11.7: for example chloromethane, ethane, 1,2-dibromoethane, ethanoate salts and esters.</p>
      <ChainFormula carbons={1} caption="Methane, CH₄"/><ChainFormula carbons={2} caption="Ethane, CH₃CH₃"/>
      <ChainFormula carbons={2} doubleAt={0} caption="Ethene, CH₂=CH₂"/><ChainFormula carbons={2} group="alcohol" caption="Ethanol, CH₃CH₂OH"/><ChainFormula carbons={2} group="acid" caption="Ethanoic acid, CH₃COOH"/>
      <Callout kind="exam" title="From a name to a displayed formula"><ol><li>Draw the correct number of carbons.</li><li>Add the family feature: C=C, –OH or –COOH.</li><li>Complete every carbon to four bonds with hydrogen.</li><li>Check that every oxygen has two bonds and every hydrogen has one.</li></ol></Callout>
    </>),
    section('up-to-four-carbons', 'Unbranched compounds with up to four carbons', [3], <>
      <p>The tables give <strong>structural formulae</strong>. To turn one into a displayed formula, write each H separately and draw its bond. “Unbranched” means the carbon skeleton is one continuous chain.</p>
      <ChemistryTable headers={['Family', 'Names and structural formulae']} rows={[
        ['Alkanes', 'Methane CH₄; ethane CH₃CH₃; propane CH₃CH₂CH₃; butane CH₃CH₂CH₂CH₃'],
        ['Alkenes', 'Ethene CH₂=CH₂; propene CH₂=CHCH₃; but-1-ene CH₂=CHCH₂CH₃; but-2-ene CH₃CH=CHCH₃'],
        ['Alcohols', 'Methanol CH₃OH; ethanol CH₃CH₂OH; propan-1-ol CH₃CH₂CH₂OH; propan-2-ol CH₃CH(OH)CH₃; butan-1-ol CH₃CH₂CH₂CH₂OH; butan-2-ol CH₃CH(OH)CH₂CH₃'],
        ['Carboxylic acids', 'Methanoic acid HCOOH; ethanoic acid CH₃COOH; propanoic acid CH₃CH₂COOH; butanoic acid CH₃CH₂CH₂COOH'],
      ]}/>
      <p>An alkene needs <strong>at least two carbons</strong>, so there is no “methene” in this series.</p>
      <Definition term="Position number"><p>A number showing <strong>where a functional group or double bond is attached</strong> along the carbon chain.</p></Definition>
      <ol className="explanation"><li>Number from the end giving the <strong>lowest possible number</strong> to the relevant group.</li><li><strong>But-1-ene</strong> has its double bond between carbons 1 and 2. <strong>But-2-ene</strong> has it between carbons 2 and 3.</li><li><strong>Propan-2-ol</strong> has –OH attached to the middle carbon. The OH is attached to carbon 2; it does not replace the whole carbon.</li><li>In a carboxylic acid, the <strong>COOH carbon is carbon 1</strong> and is included in the stem.</li></ol>
      <ChainFormula carbons={4} doubleAt={0} caption="But-1-ene: four carbons, with C=C starting at carbon 1."/>
      <ChainFormula carbons={4} doubleAt={1} caption="But-2-ene: the same four-carbon chain, with C=C starting at carbon 2."/>
      <ChainFormula carbons={3} group="alcohol" hydroxylAt={1} caption="Propan-2-ol: the –OH group is attached to the middle carbon, CH₃CH(OH)CH₃."/>
      <ChainFormula carbons={4} group="alcohol" hydroxylAt={1} caption="Butan-2-ol: –OH is on carbon 2, CH₃CH(OH)CH₂CH₃."/>
      <Callout kind="mistake"><p>“But-3-ene” becomes <strong>but-1-ene</strong> when numbered from the nearer end. Similarly, “butan-3-ol” is named <strong>butan-2-ol</strong>.</p></Callout>
    </>, true),
    section('ester-names', 'Naming and drawing esters', [4], <>
      <Definition term="Ester"><p>A compound with a <strong>–C(=O)–O–</strong> linkage, made when a carboxylic acid reacts with an alcohol.</p></Definition>
      <p>An ester name has <strong>two words</strong>. The alcohol gives the first word: methanol → <strong>methyl</strong>, ethanol → <strong>ethyl</strong>, propan-1-ol → <strong>propyl</strong>, butan-1-ol → <strong>butyl</strong>. The acid gives the second: ethanoic acid → <strong>ethanoate</strong>.</p>
      <Callout title="Build ethyl ethanoate"><ol><li>Ethanoic acid supplies <strong>CH₃C(=O)O–</strong>.</li><li>Ethanol supplies the <strong>–CH₂CH₃</strong> part.</li><li>Join them: <strong>CH₃C(=O)OCH₂CH₃</strong>, usually written CH₃COOCH₂CH₃.</li></ol><EsterFormula/></Callout>
      <ChemistryTable headers={['Acid ↓ / alcohol →', 'Methanol', 'Ethanol', 'Propan-1-ol', 'Butan-1-ol']} rows={[
        ['Methanoic acid','Methyl methanoate','Ethyl methanoate','Propyl methanoate','Butyl methanoate'],
        ['Ethanoic acid','Methyl ethanoate','Ethyl ethanoate','Propyl ethanoate','Butyl ethanoate'],
        ['Propanoic acid','Methyl propanoate','Ethyl propanoate','Propyl propanoate','Butyl propanoate'],
        ['Butanoic acid','Methyl butanoate','Ethyl butanoate','Propyl butanoate','Butyl butanoate'],
      ]}/>
      <p>Each starting alcohol and acid may have <strong>up to four carbons</strong>; the ester can therefore have more than four altogether. For example, <strong>butyl butanoate</strong> is CH₃CH₂CH₂COOCH₂CH₂CH₂CH₃, with eight carbons.</p>
      <Callout kind="exam" title="Draw any ester in the table"><p>Start with <strong>–C(=O)–O–</strong>. Add the acid’s carbon chain on the carbonyl-carbon side and the alcohol’s chain on the oxygen side. Expand every CH₃/CH₂ into individual C–H bonds if a <strong>displayed</strong> formula is requested.</p></Callout>
    </>, true),
    section('test-your-understanding', 'Test your understanding', [], check([
      ['Which family does a compound ending in -ol belong to?', <>Alcohols.</>],
      ['Write the structural formula of ethanoic acid. How many carbons does it contain?', <>CH₃COOH; two carbons, including the one in COOH.</>],
      ['Extended: name CH₃CH=CHCH₃.', <>But-2-ene: four carbons, with C=C between carbons 2 and 3.</>],
      ['Extended: write the structural formula of butan-2-ol.', <>CH₃CH(OH)CH₂CH₃.</>],
      ['Extended: which acid and alcohol make methyl propanoate?', <>Propanoic acid and methanol. Its structural formula is CH₃CH₂COOCH₃.</>],
      ['Extended: draw an ester from propanoic acid and butan-1-ol.', <>Join CH₃CH₂C(=O)O– to –CH₂CH₂CH₂CH₃. The ester is butyl propanoate, CH₃CH₂COOCH₂CH₂CH₂CH₃. Expand all H atoms and bonds in a displayed drawing.</>],
    ])),
  ]},
  '11.3': { sections: [
    section('fossil-fuels', 'Fossil fuels and hydrocarbons', [1,2,3,4], <>
      <p>The three fossil fuels are <strong>coal, natural gas and petroleum</strong>. They formed from ancient organic material over millions of years, so supplies are <strong>finite</strong>.</p>
      <Definition term="Hydrocarbon"><p>A compound made from <strong>carbon and hydrogen only</strong>.</p></Definition>
      <p>The main component of <strong>natural gas is methane, CH₄</strong>. <strong>Petroleum</strong>, also called crude oil, is a <strong>mixture of hydrocarbons</strong> with different molecular sizes and boiling points.</p>
      <Callout kind="mistake"><p>Ethanol is an organic compound, but it is <strong>not a hydrocarbon</strong>: it also contains oxygen. Petroleum is a mixture, so do not give it a single molecular formula or one fixed boiling point.</p></Callout>
    </>),
    section('fractional-distillation', 'Separating petroleum', [5], <>
      <Definition term="Fraction"><p>A mixture collected during fractional distillation whose components have <strong>similar boiling points</strong>.</p></Definition>
      <ol className="explanation"><li><strong>Heat petroleum</strong> so that most of it vaporises. The largest molecules may remain liquid.</li><li>Feed it into a fractionating column that is <strong>hot at the bottom and cooler at the top</strong>.</li><li>Vapours rise and cool. A hydrocarbon <strong>condenses</strong> when the temperature falls below its boiling point.</li><li><strong>High-boiling fractions</strong> condense low down. <strong>Low-boiling fractions</strong> rise further and condense higher up. Refinery gases leave at the top.</li><li>Collect fractions at different levels. Heavy residue leaves the bottom.</li></ol>
      <Callout kind="exam" title="Why does it separate?"><p>Link the method to <strong>different boiling points</strong> and the <strong>temperature gradient</strong>. Fractional distillation is a <strong>physical separation</strong>: it does not break molecules into smaller ones. That is cracking, in 11.5.</p></Callout>
    </>),
    section('fraction-trends', 'Trends up the column', [6], <>
      <ChemistryTable headers={['Moving from bottom → top', 'What changes?']} rows={[
        ['Temperature','Decreases'],['Hydrocarbon chain length','Decreases'],['Boiling point','Decreases'],['Volatility','Increases: the liquid evaporates more easily'],['Viscosity','Decreases: the liquid flows more easily'],
      ]}/>
      <Definition term="Volatility"><p>How readily a substance <strong>evaporates</strong>. A more volatile liquid generally has a lower boiling point.</p></Definition>
      <Definition term="Viscosity"><p>A liquid’s <strong>resistance to flowing</strong>. A viscous liquid is thick and flows slowly.</p></Definition>
      <Callout title="Compare petrol and bitumen"><p>Petrol contains <strong>smaller, more volatile molecules</strong> with lower boiling points. Bitumen contains very large molecules, is <strong>much more viscous</strong>, and remains as residue near the bottom of the column.</p></Callout>
    </>),
    section('fractions-and-uses', 'Fractions and their uses', [7], <>
      <p>Read this table from the <strong>top of the column to the bottom</strong>. Learn the use with the fraction, rather than learning two separate lists.</p>
      <ChemistryTable headers={['Fraction', 'Use to remember']} rows={[
        ['Refinery gases','Heating and cooking gas'],['Gasoline / petrol','Fuel for cars'],['Naphtha','Chemical feedstock: starting material for making other chemicals'],['Kerosene / paraffin','Jet fuel'],['Diesel oil / gas oil','Fuel for diesel engines'],['Fuel oil','Fuel for ships and home heating systems'],['Lubricating oil','Lubricants, waxes and polishes'],['Bitumen','Road surfacing'],
      ]}/>
      <Callout kind="mistake"><p><strong>Naphtha</strong> is the chemical feedstock, not the jet fuel. <strong>Kerosene</strong> is the jet fuel. “Paraffin” here is another name for the kerosene fraction.</p></Callout>
      <Callout kind="exam" title="A short comparison answer"><p>For “Explain why fraction A comes off above fraction B”, write: <strong>A has a lower boiling range, so its vapour rises further before it condenses in the cooler part of the column.</strong></p></Callout>
    </>),
    section('test-your-understanding', 'Test your understanding', [], check([
      ['Name the three fossil fuels and the main component of natural gas.', <>Coal, natural gas and petroleum. Natural gas is mainly methane.</>],
      ['Why is ethanol not a hydrocarbon?', <>It contains oxygen as well as carbon and hydrogen.</>],
      ['Why do different fractions condense at different heights?', <>They have different boiling points, and the column becomes cooler towards the top.</>],
      ['Moving up the column, what happens to viscosity and volatility?', <>Viscosity decreases; volatility increases.</>],
      ['Which fraction is used as a chemical feedstock, and which is used in diesel engines?', <>Naphtha is the feedstock. Diesel oil / gas oil fuels diesel engines.</>],
      ['Does fractional distillation break covalent bonds?', <>No. It separates existing molecules by boiling and condensation; cracking breaks molecules.</>],
    ])),
  ]},
  '11.4': { sections: [
    section('alkane-structure', 'What makes an alkane?', [1], <>
      <Definition term="Alkane"><p>A <strong>saturated hydrocarbon</strong>: it contains only carbon and hydrogen, and its carbon–carbon bonds are all <strong>single covalent bonds</strong>.</p></Definition>
      <p>Alkanes follow <strong>CₙH₂ₙ₊₂</strong>. Methane is CH₄, ethane C₂H₆, propane C₃H₈ and butane C₄H₁₀.</p>
      <ChainFormula carbons={3} caption="Propane: CH₃CH₂CH₃, molecular formula C₃H₈."/>
      <p>Alkanes are <strong>generally unreactive</strong> under ordinary conditions. The two reaction types you need here are <strong>combustion</strong> and <strong>substitution with chlorine</strong>.</p>
    </>),
    section('combustion', 'Combustion: using an alkane as a fuel', [2], <>
      <p>With <strong>enough oxygen</strong>, complete combustion produces <strong>carbon dioxide and water</strong> and releases energy.</p>
      <Equation>methane + oxygen → carbon dioxide + water</Equation>
      <Equation>CH₄ + 2O₂ → CO₂ + 2H₂O</Equation>
      <Callout title="Balance propane combustion"><ol><li>Three carbon atoms give <strong>3CO₂</strong>.</li><li>Eight hydrogen atoms give <strong>4H₂O</strong>.</li><li>Products contain ten oxygen atoms, so use <strong>5O₂</strong>.</li></ol><Equation>C₃H₈ + 5O₂ → 3CO₂ + 4H₂O</Equation></Callout>
      <p>With <strong>insufficient oxygen</strong>, incomplete combustion can form <strong>carbon monoxide</strong> and/or <strong>carbon (soot)</strong>, as well as water. Carbon monoxide is toxic.</p>
      <Equation>2CH₄ + 3O₂ → 2CO + 4H₂O</Equation>
      <Callout kind="mistake"><p>Water is still a combustion product even when you cannot see liquid water: it may leave as <strong>water vapour</strong>. Change the coefficients when balancing; do not change CH₄ into a different formula.</p></Callout>
    </>),
    section('chlorine-substitution', 'Substitution with chlorine', [2,3,4], <>
      <Definition term="Substitution reaction"><p>A reaction in which an atom or group in a molecule is <strong>replaced</strong> by a different atom or group.</p></Definition>
      <p>Methane reacts with chlorine in <strong>ultraviolet light</strong>. One H atom is replaced by Cl, making <strong>chloromethane</strong>. The displaced H combines with the other Cl to form <strong>hydrogen chloride</strong>.</p>
      <Equation condition="UV light">CH₄ + Cl₂ → CH₃Cl + HCl</Equation>
      <Extended><p>This is a <strong>photochemical reaction</strong>. UV light supplies the <strong>activation energy</strong> needed to start it. For this syllabus, draw products of <strong>monosubstitution</strong>: replace just one H.</p><Equation condition="UV light">CH₃CH₃ + Cl₂ → CH₃CH₂Cl + HCl</Equation><p>The organic product here is <strong>chloroethane</strong>. In a displayed product, keep the carbon skeleton unchanged and change one C–H bond into a C–Cl bond.</p></Extended>
      <DisplayedFormula width={240} atoms={[{id:'c',label:'C',x:110,y:100},{id:'l',label:'H',x:40,y:100},{id:'r',label:'Cl',x:185,y:100},{id:'t',label:'H',x:110,y:30},{id:'b',label:'H',x:110,y:170}]} bonds={[["c","l"],["c","r"],["c","t"],["c","b"]]} caption="Chloromethane: one H in methane has been replaced by Cl."/>
      <Callout kind="exam" title="Substitution or addition?"><p>For an alkane plus chlorine, write <strong>substitution</strong> and give <strong>UV light</strong>. You get an organic product <strong>and HCl</strong>. For an alkene adding bromine, you get one addition product instead.</p></Callout>
      <Callout kind="mistake"><p>Do not add two chlorine atoms to methane without removing any hydrogen: carbon would have too many bonds. Do not put “nickel catalyst” over this arrow; nickel is used for adding hydrogen to an alkene.</p></Callout>
    </>),
    section('test-your-understanding', 'Test your understanding', [], check([
      ['Why is ethane called a saturated hydrocarbon?', <>It contains only C and H and has only single carbon–carbon bonds.</>],
      ['Balance complete combustion of ethane: C₂H₆ + O₂ → CO₂ + H₂O.', <>2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O.</>],
      ['What condition is needed for methane to react with chlorine?', <>Ultraviolet light.</>],
      ['Name both products of methane reacting with chlorine in monosubstitution.', <>Chloromethane, CH₃Cl, and hydrogen chloride, HCl.</>],
      ['Extended: what does the UV light provide?', <>The activation energy to start the photochemical reaction.</>],
      ['Extended: write the equation for monosubstitution of ethane with chlorine.', <>CH₃CH₃ + Cl₂ → CH₃CH₂Cl + HCl, in UV light.</>],
    ])),
  ]},
  '11.5': { sections: [
    section('alkene-structure', 'Alkenes and their double bond', [1], <>
      <Definition term="Alkene"><p>An <strong>unsaturated hydrocarbon</strong> containing a <strong>carbon–carbon double covalent bond</strong>.</p></Definition>
      <p>For the open-chain alkenes with one double bond in this course, the general formula is <strong>CₙH₂ₙ</strong>. Ethene is C₂H₄; propene is C₃H₆.</p>
      <ChainFormula carbons={2} doubleAt={0} caption="Ethene: each carbon has two C–H bonds and a double bond to the other carbon."/>
      <p>The C=C bond is the reactive part of the molecule. In an addition reaction, it becomes a <strong>C–C single bond</strong> while new bonds form to the added atoms.</p>
    </>),
    section('cracking', 'Cracking: turning large molecules into useful smaller ones', [2,3], <>
      <Definition term="Cracking"><p>Breaking large hydrocarbon molecules into <strong>smaller molecules</strong> using a <strong>high temperature</strong> and a <strong>catalyst</strong>.</p></Definition>
      <p>Heat a large alkane to form vapour and pass it over a hot catalyst, such as <strong>aluminium oxide</strong>. Cracking can produce <strong>smaller alkanes, alkenes and hydrogen</strong>, depending on which bonds break.</p>
      <Equation condition="High temperature; catalyst">C₁₀H₂₂ → C₈H₁₈ + C₂H₄</Equation>
      <Equation condition="Another possible balanced cracking equation">C₂H₆ → C₂H₄ + H₂</Equation>
      <p>There is demand for <strong>shorter-chain fuels</strong> and for <strong>alkenes as chemical feedstocks</strong>, including for making polymers. Cracking converts less useful larger molecules into these useful products.</p>
      <Callout title="Find a missing cracking product"><p>C₁₀H₂₂ → C₆H₁₄ + ?</p><p>Subtract the atoms already used: C = 10 − 6 = 4; H = 22 − 14 = 8. The missing product is <strong>C₄H₈</strong>. Check that both sides contain exactly ten C and twenty-two H.</p></Callout>
      <Callout kind="mistake"><p>Fractional distillation <strong>separates</strong> molecules. Cracking <strong>breaks</strong> molecules. Cracking does not require adding oxygen: that would describe combustion.</p></Callout>
    </>),
    section('bromine-test', 'Testing for unsaturation', [4], <>
      <p>Add <strong>aqueous bromine</strong>, often called bromine water, and shake. Compare the colour before and after mixing.</p>
      <ChemistryTable headers={['Hydrocarbon', 'Observation with aqueous bromine']} rows={[
        ['Unsaturated: contains C=C','Orange / orange-brown → colourless'],['Saturated alkane','No colour change under normal test conditions, away from UV light'],
      ]}/>
      <p>The alkene <strong>decolourises</strong> aqueous bromine because bromine adds across C=C. State <strong>colourless</strong>, rather than “clear”: a coloured solution can also be clear.</p>
      <Callout kind="exam" title="Two parts to a test answer"><p>Give the <strong>reagent</strong> and the <strong>positive observation</strong>: “Add aqueous bromine; the orange colour disappears.” If asked for the conclusion, add “the hydrocarbon is unsaturated”.</p></Callout>
    </>),
    section('addition-reactions', 'Three addition reactions to know', [5,6], <>
      <Definition term="Addition reaction"><p>Reactants combine to make <strong>one product</strong>. For these alkenes, atoms add across the C=C bond.</p></Definition>
      <ChemistryTable headers={['Add to ethene', 'Condition', 'Product and equation']} rows={[
        ['Bromine, Br₂','Bromine or aqueous bromine; no UV needed','CH₂=CH₂ + Br₂ → CH₂BrCH₂Br; 1,2-dibromoethane'],
        ['Hydrogen, H₂','Nickel catalyst; heat','CH₂=CH₂ + H₂ → CH₃CH₃; ethane'],
        ['Steam, H₂O(g)','Acid catalyst; industrially 300 °C, 6000 kPa (60 atm)','CH₂=CH₂ + H₂O → CH₃CH₂OH; ethanol'],
      ]}/>
      <Callout title="Draw the bromine addition product"><ol><li>Keep both carbon atoms.</li><li>Change C=C into <strong>C–C</strong>.</li><li>Attach <strong>one Br to each carbon</strong>.</li><li>Keep all four original H atoms. The product is <strong>CH₂BrCH₂Br</strong>.</li></ol></Callout>
      <DisplayedFormula width={320} atoms={[
        {id:'c1',label:'C',x:110,y:100},{id:'c2',label:'C',x:210,y:100},{id:'l',label:'H',x:40,y:100},{id:'r',label:'H',x:280,y:100},{id:'t1',label:'H',x:110,y:30},{id:'t2',label:'H',x:210,y:30},{id:'b1',label:'Br',x:110,y:170},{id:'b2',label:'Br',x:210,y:170},
      ]} bonds={[["c1","c2"],["c1","l"],["c2","r"],["c1","t1"],["c2","t2"],["c1","b1"],["c2","b2"]]} caption="1,2-dibromoethane: the double bond is now single and there is one Br on each carbon."/>
      <Callout kind="mistake"><p>Do not leave C=C in the addition product. Do not remove H atoms when adding Br₂: that would change the atom balance. Hydrogenation adds <strong>H₂</strong>; hydration adds <strong>H₂O</strong>.</p></Callout>
      <Callout kind="exam" title="Apply the same rule to a new alkene"><p>For but-2-ene plus hydrogen, change CH₃CH=CHCH₃ into <strong>CH₃CH₂CH₂CH₃</strong>. Add one H to each of the two carbons that were double-bonded. You do not need a completely new reaction rule.</p></Callout>
    </>, true),
    section('test-your-understanding', 'Test your understanding', [], check([
      ['What bond makes ethene unsaturated?', <>Its carbon–carbon double bond, C=C.</>],
      ['Give the two conditions for catalytic cracking and one economic reason for it.', <>High temperature and a catalyst. It makes more useful small fuel molecules and/or alkenes from larger hydrocarbons.</>],
      ['Complete C₈H₁₈ → C₆H₁₄ + ?.', <>C₂H₄.</>],
      ['What is the positive observation with aqueous bromine?', <>Orange / orange-brown becomes colourless.</>],
      ['Extended: name the product of ethene and bromine, and give its structural formula.', <>1,2-dibromoethane, CH₂BrCH₂Br.</>],
      ['Extended: which catalyst is used with hydrogen, and which with steam?', <>Nickel for hydrogen; an acid catalyst, commonly phosphoric acid, for steam.</>],
    ])),
  ]},
  '11.6': { sections: [
    section('ethanol', 'Ethanol: structure and uses', [3], <>
      <p>Ethanol is an <strong>alcohol</strong> with structural formula <strong>CH₃CH₂OH</strong> and molecular formula <strong>C₂H₆O</strong>. Its functional group is <strong>–OH</strong>.</p>
      <ChainFormula carbons={2} group="alcohol" caption="Ethanol: two carbon atoms and an alcohol –OH group."/>
      <ChemistryTable headers={['Use', 'Why ethanol is useful']} rows={[
        ['Solvent','It dissolves many substances; used in products such as perfumes and some medicines.'],['Fuel','Its combustion releases energy; used as a fuel or mixed with petrol.'],
      ]}/>
      <p>You need <strong>two routes for manufacturing ethanol</strong>: fermentation of glucose, and addition of steam to ethene. Keep their conditions separate.</p>
    </>),
    section('fermentation', 'Manufacturing ethanol by fermentation', [1], <>
      <Definition term="Fermentation"><p>The conversion of glucose into <strong>ethanol and carbon dioxide</strong> by enzymes in yeast, <strong>without oxygen</strong>.</p></Definition>
      <Equation condition="Yeast; aqueous glucose; 25–35 °C; absence of oxygen">C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂</Equation>
      <ol className="explanation"><li>Use an <strong>aqueous glucose solution</strong> and add <strong>yeast</strong>.</li><li>Keep it at <strong>25–35 °C</strong>. Too cold makes the process slow; too hot damages the enzymes.</li><li>Exclude <strong>oxygen</strong> so fermentation occurs rather than aerobic respiration.</li><li>Carbon dioxide escapes. A fermentation lock can let gas out while limiting entry of air.</li><li>The product is a <strong>dilute solution of ethanol</strong>. Separate and concentrate the ethanol by <strong>fractional distillation</strong>.</li></ol>
      <Callout kind="exam" title="The four conditions"><p>Write <strong>aqueous glucose + yeast + 25–35 °C + no oxygen</strong>. “Warm conditions” alone misses the temperature range. Yeast provides the enzymes; do not describe yeast as a metal catalyst.</p></Callout>
    </>),
    section('hydration', 'Manufacturing ethanol from ethene', [1], <>
      <p>Ethene reacts with <strong>steam</strong> in a catalytic <strong>addition reaction</strong>. The C=C bond becomes single; H and OH add across it.</p>
      <Equation condition="300 °C; 6000 kPa / 60 atm; acid catalyst">CH₂=CH₂ + H₂O(g) ⇌ CH₃CH₂OH</Equation>
      <p>The acid catalyst is commonly <strong>phosphoric acid</strong>. Feed ethene and steam through the reactor, condense the ethanol and recycle unreacted gases. The reaction is reversible, so not every ethene molecule reacts in one pass.</p>
      <Callout kind="mistake"><p>The reagent is <strong>steam</strong>, not simply cold liquid water. <strong>Nickel</strong> is the catalyst for adding hydrogen to ethene, not for making ethanol from steam. Do not use the fermentation temperature here.</p></Callout>
    </>),
    section('comparing-routes', 'Comparing the two manufacturing routes', [4], <>
      <ChemistryTable headers={['Feature', 'Fermentation', 'Ethene + steam']} rows={[
        ['Raw material','Glucose from crops; renewable if crops are regrown','Ethene usually comes from petroleum; non-renewable'],
        ['Conditions','25–35 °C; ordinary pressure; yeast; no oxygen','300 °C; 60 atm; acid catalyst'],
        ['Speed and operation','Relatively slow; usually a batch process','Fast; suited to continuous production'],
        ['Product','Dilute ethanol solution needing separation','Ethanol can be obtained at higher concentration; unreacted gases recycled'],
        ['Costs and limitations','Low reactor temperature, but distillation needs energy; crops need land and water','High temperature and pressure need energy and suitable equipment; fossil feedstock'],
      ]}/>
      <Callout kind="exam" title="Make a comparison, not two unrelated statements"><p>Write paired points: “Fermentation uses a <strong>renewable crop feedstock</strong>, whereas hydration usually uses <strong>ethene from finite petroleum</strong>.” If asked for a disadvantage of fermentation, explain that the dilute product <strong>needs energy for distillation</strong>.</p></Callout>
      <p>“Renewable” does not mean “no environmental impact”. Crop growing, transport and distillation still use resources and energy.</p>
    </>, true),
    section('ethanol-combustion', 'Combustion of ethanol', [2], <>
      <p>With enough oxygen, ethanol burns to produce <strong>carbon dioxide and water</strong>. The reaction is <strong>exothermic</strong>, which is why ethanol is useful as a fuel.</p>
      <Equation>C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O</Equation>
      <Callout title="Balance the oxygen last"><p>Two C atoms give 2CO₂; six H atoms give 3H₂O. The products contain seven O atoms. Ethanol already supplies <strong>one</strong>, leaving six O atoms to come from <strong>3O₂</strong>.</p></Callout>
      <Callout kind="mistake"><p>Do not forget the oxygen atom already inside ethanol. Its formula C₂H₅OH contains <strong>six</strong> hydrogen atoms, not five.</p></Callout>
    </>),
    section('test-your-understanding', 'Test your understanding', [], check([
      ['Give all the conditions for producing ethanol by fermentation.', <>Aqueous glucose and yeast at 25–35 °C, in the absence of oxygen.</>],
      ['What gas is produced in fermentation, and how is ethanol separated from the mixture?', <>Carbon dioxide. Ethanol is separated and concentrated by fractional distillation.</>],
      ['Give the temperature, pressure and catalyst for hydration of ethene.', <>300 °C, 6000 kPa / 60 atm, and an acid catalyst, commonly phosphoric acid.</>],
      ['State two uses of ethanol.', <>A solvent and a fuel.</>],
      ['Write the balanced complete-combustion equation for ethanol.', <>C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O.</>],
      ['Extended: give one advantage and one disadvantage of fermentation compared with hydration.', <>It can use renewable crop material and runs at a lower temperature. It is slower and gives a dilute product that needs energy for distillation.</>],
    ])),
  ]},
  '11.7': { sections: [
    section('ethanoic-acid', 'Ethanoic acid and ethanoates', [1], <>
      <p>Ethanoic acid is a <strong>carboxylic acid</strong>, CH₃COOH. The functional group is <strong>–COOH</strong>. Its aqueous solution is acidic, and it reacts with metals, bases and carbonates in the usual acid reaction patterns.</p>
      <Definition term="Ethanoate salt"><p>A salt containing the <strong>CH₃COO⁻ ion</strong>. It forms when the acidic H in CH₃COOH is replaced by a metal ion or another positive ion.</p></Definition>
      <ChainFormula carbons={2} group="acid" caption="Ethanoic acid: the acidic hydrogen is the H in –COOH."/>
      <ChemistryTable headers={['Salt', 'Formula', 'Why this ratio?']} rows={[
        ['Sodium ethanoate','CH₃COONa','One Na⁺ balances one CH₃COO⁻'],['Potassium ethanoate','CH₃COOK','One K⁺ balances one CH₃COO⁻'],['Magnesium ethanoate','(CH₃COO)₂Mg','One Mg²⁺ needs two ethanoate ions'],['Calcium ethanoate','(CH₃COO)₂Ca','One Ca²⁺ needs two ethanoate ions'],
      ]}/>
      <Callout kind="mistake"><p>Forming a salt removes the H from <strong>COOH</strong>, not an H from CH₃. Keep the oxygen atoms: sodium ethanoate is <strong>CH₃COONa</strong>, not CH₃CONa.</p></Callout>
    </>),
    section('acid-reactions', 'Three acid reaction patterns', [1], <>
      <ChemistryTable headers={['React with ethanoic acid', 'Products', 'What you observe']} rows={[
        ['Reactive metal, e.g. magnesium','Ethanoate salt + hydrogen','Effervescence; metal dissolves'],['Base, e.g. sodium hydroxide or copper(II) oxide','Ethanoate salt + water','Neutralisation; an insoluble reacting base can dissolve'],['Carbonate, e.g. sodium carbonate','Ethanoate salt + water + carbon dioxide','Effervescence; CO₂ turns limewater milky'],
      ]}/>
      <Equation>2CH₃COOH + Mg → (CH₃COO)₂Mg + H₂</Equation>
      <Equation>CH₃COOH + NaOH → CH₃COONa + H₂O</Equation>
      <Equation>2CH₃COOH + CuO → (CH₃COO)₂Cu + H₂O</Equation>
      <Equation>2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂</Equation>
      <Callout title="Name the salt before writing its formula"><p>Ethanoic acid + calcium carbonate gives <strong>calcium ethanoate</strong>, water and carbon dioxide. Calcium is Ca²⁺, so the salt is <strong>(CH₃COO)₂Ca</strong>.</p><Equation>2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + H₂O + CO₂</Equation></Callout>
      <Callout kind="exam" title="Distinguish the gases"><p>For acid + metal, test for <strong>hydrogen</strong> with a lighted splint: a squeaky pop. For acid + carbonate, test for <strong>carbon dioxide</strong> with limewater: it turns milky. Bubbles alone do not identify the gas.</p></Callout>
    </>),
    section('oxidation-of-ethanol', 'Making ethanoic acid by oxidation', [2], <>
      <p>Ethanol can be oxidised to <strong>ethanoic acid</strong>. The carbon chain stays at two carbons; the alcohol end becomes a carboxylic acid group.</p>
      <Equation>CH₃CH₂OH + 2[O] → CH₃COOH + H₂O</Equation>
      <p><strong>[O]</strong> represents oxygen supplied by an oxidising agent; it is not the molecular formula of an actual reagent.</p>
      <ChemistryTable headers={['Route', 'Conditions and what happens']} rows={[
        ['Laboratory oxidation','Warm ethanol with acidified aqueous potassium manganate(VII). Its purple colour is lost as it is reduced. The ethanol is oxidised to ethanoic acid.'],
        ['Vinegar production','Bacteria oxidise ethanol using oxygen from the air, making ethanoic acid. Vinegar is a dilute aqueous solution containing ethanoic acid.'],
      ]}/>
      <Equation condition="Bacteria; oxygen from air">C₂H₅OH + O₂ → CH₃COOH + H₂O</Equation>
      <Callout kind="mistake"><p>Do not mix up the oxygen conditions: <strong>fermentation excludes oxygen</strong>, but <strong>bacterial oxidation to vinegar needs oxygen</strong>.</p></Callout>
    </>, true),
    section('esterification', 'Making an ester', [3], <>
      <Definition term="Esterification"><p>The reaction of a <strong>carboxylic acid</strong> with an <strong>alcohol</strong> to form an <strong>ester and water</strong>, using an acid catalyst.</p></Definition>
      <Equation condition="Acid catalyst; warm">carboxylic acid + alcohol ⇌ ester + water</Equation>
      <Equation condition="Concentrated sulfuric acid catalyst">CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O</Equation>
      <p>Ethanoic acid + ethanol gives <strong>ethyl ethanoate</strong>. Many small esters have fruity smells and are used in flavourings, fragrances or solvents.</p><EsterFormula/>
      <ol className="explanation"><li>Take the <strong>alkyl name from the alcohol</strong>: ethanol → ethyl.</li><li>Take the <strong>-oate name from the acid</strong>: ethanoic acid → ethanoate.</li><li>Join the acid and alcohol parts through <strong>–C(=O)–O–</strong>.</li><li>Show <strong>water</strong> as the other product.</li></ol>
      <Callout title="Work backwards from the ester name"><p><strong>Methyl butanoate</strong> comes from <strong>methanol + butanoic acid</strong>. Its structural formula is CH₃CH₂CH₂COOCH₃. The first word identifies the alcohol; the second identifies the acid.</p></Callout>
      <Callout kind="exam" title="Salt or ester?"><p>Ethanoic acid + <strong>sodium hydroxide</strong> gives sodium ethanoate, a salt. Ethanoic acid + <strong>ethanol</strong> gives ethyl ethanoate, an ester. Read the second reactant carefully.</p></Callout>
    </>, true),
    section('test-your-understanding', 'Test your understanding', [], check([
      ['Name the salt made by ethanoic acid and magnesium, and give its formula.', <>Magnesium ethanoate, (CH₃COO)₂Mg.</>],
      ['Write the equation for ethanoic acid reacting with sodium hydroxide.', <>CH₃COOH + NaOH → CH₃COONa + H₂O.</>],
      ['Which gas is produced with a carbonate, and how is it tested?', <>Carbon dioxide; it turns limewater milky.</>],
      ['Extended: name the oxidising reagent for converting ethanol into ethanoic acid.', <>Acidified aqueous potassium manganate(VII), with warming.</>],
      ['Extended: why is air needed when making vinegar from ethanol?', <>Bacterial oxidation needs oxygen from the air.</>],
      ['Extended: name the ester from propanoic acid and ethanol and state the other product.', <>Ethyl propanoate, CH₃CH₂COOCH₂CH₃, and water. Use an acid catalyst.</>],
    ])),
  ]},
  '11.8': { sections: [
    section('polymers-and-monomers', 'Polymers and monomers', [1,3], <>
      <Definition term="Polymer"><p>A very large molecule made by joining many small molecules called <strong>monomers</strong>.</p></Definition>
      <Definition term="Monomer"><p>A small molecule that can join with other monomer molecules to build a polymer chain.</p></Definition>
      <p>A <strong>plastic</strong> is a material made from polymers, often with additives that change properties such as flexibility or colour. Not every polymer is a plastic: proteins are natural polymers.</p>
      <Definition term="Repeat unit"><p>The section of a polymer’s structure that repeats along the chain.</p></Definition>
      <p>Brackets show the repeating section, and <strong><em>n</em></strong> shows that it occurs many times. The bonds continue through the brackets: the chain does not end at the edge of the repeat unit.</p>
    </>),
    section('addition-polymerisation', 'Addition polymerisation: poly(ethene)', [2,6,7], <>
      <p>Many <strong>ethene monomers</strong> join to make <strong>poly(ethene)</strong>. Each C=C becomes a single C–C bond as new bonds join one monomer to the next. No small molecule is lost.</p>
      <Equation>n CH₂=CH₂ → [–CH₂–CH₂–]ₙ</Equation><PolymerStructure/>
      <Callout title="Draw the repeat unit"><ol><li>Draw the <strong>two carbon atoms</strong> that were joined by C=C.</li><li>Change the double bond to a <strong>single bond</strong>.</li><li>Keep the groups already attached to each carbon in the same places.</li><li>Draw a bond out of <strong>each end</strong>, put brackets around the unit, and write <strong>n</strong> outside.</li></ol></Callout>
      <Extended><p>The same method works with substituted alkenes. From <strong>propene, CH₂=CHCH₃</strong>, the repeat unit is <strong>[–CH₂–CH(CH₃)–]ₙ</strong>. The CH₃ group stays as a side group; it does not become a third carbon in the main chain.</p><p>To go <strong>backwards</strong>, take one two-carbon repeat unit, remove the bonds continuing to adjacent units and put <strong>C=C</strong> between those carbons. Keep all the side groups. For [–CH₂–CHCl–]ₙ, the monomer is <strong>CH₂=CHCl</strong>.</p><p>If a drawing shows several units, find the <strong>shortest repeating pattern</strong>. Four backbone carbons may represent two units, not one.</p></Extended>
      <Callout kind="mistake"><p>The double bond is in the <strong>monomer</strong>, not the addition-polymer backbone. Do not add extra H atoms when opening C=C: the new bonds connect to neighbouring monomers instead.</p></Callout>
    </>),
    section('condensation-polymerisation', 'Condensation polymerisation', [6,8,9], <>
      <Definition term="Condensation polymerisation"><p>Monomers with <strong>two reactive functional groups</strong> join into a chain, releasing a <strong>small molecule</strong> when each link forms. In the examples here, that molecule is water.</p></Definition>
      <ChemistryTable headers={['Monomers', 'Link formed', 'Polymer family']} rows={[
        ['Dicarboxylic acid + diamine','Amide, –C(=O)–NH–','Polyamide'],['Dicarboxylic acid + diol','Ester, –C(=O)–O–','Polyester'],
      ]}/>
      <p><strong>Di-</strong> means two: a diol has two –OH groups, a diamine has two –NH₂ groups, and a dicarboxylic acid has two –COOH groups. Each end can react, so the molecule becomes part of a long chain rather than stopping after one link.</p>
      <ChemistryTable headers={['Feature', 'Addition', 'Condensation']} rows={[
        ['Monomer requirement','An alkene C=C bond','Two reactive functional groups on each monomer'],['What happens?','C=C opens and monomers join','Functional groups react to form links'],['Products','Polymer only','Polymer + a small molecule, e.g. water'],['Examples','Poly(ethene), poly(propene)','Nylon, PET, proteins'],
      ]}/>
      <Callout kind="exam" title="Build a repeat unit from monomers"><ol><li>Find the <strong>two functional groups</strong> on each monomer.</li><li>For acid + diol, remove <strong>OH from COOH</strong> and <strong>H from the alcohol OH</strong>; join the acid carbon to the alcohol oxygen.</li><li>For acid + diamine, remove <strong>OH from COOH</strong> and <strong>H from NH₂</strong>; join the acid carbon to the nitrogen.</li><li>Keep the middle parts of both monomers unchanged. Include one of each in the repeat unit and show bonds continuing through the brackets.</li></ol></Callout>
      <p>For the reverse task, <strong>cut each ester or amide linkage</strong>. Restore <strong>–COOH</strong> on the acid side and <strong>–OH or –NH₂</strong> on the other side. Make sure each recovered monomer has the required group at <strong>both ends</strong>.</p>
    </>, true),
    section('nylon', 'Nylon: a polyamide', [8,10], <>
      <p>Nylon forms from a <strong>diamine</strong> and a <strong>dicarboxylic acid</strong>. It has repeating <strong>amide linkages, –C(=O)–NH–</strong>.</p>
      <Equation>H₂N–(CH₂)₆–NH₂ + HOOC–(CH₂)₄–COOH → nylon + water</Equation>
      <PolymerStructure kind="nylon"/>
      <p>The carbonyl carbon <strong>C=O is directly bonded to N</strong>. That connection identifies an amide linkage; the long hydrocarbon sections between the links do not change this.</p>
      <Callout title="Recover the nylon monomers"><p>Split the chain at its <strong>C(=O)–N</strong> links. Restore OH to the carbonyl carbon and H to nitrogen. You recover <strong>HOOC–(CH₂)₄–COOH</strong> and <strong>H₂N–(CH₂)₆–NH₂</strong>.</p></Callout>
    </>, true),
    section('pet', 'PET: a polyester that can be remade', [8,10,11], <>
      <p>PET forms from a <strong>diol</strong> and a <strong>dicarboxylic acid</strong>. Its chains contain <strong>ester linkages, –C(=O)–O–</strong>. The full chemical name of PET is not required.</p>
      <Equation>HO–CH₂–CH₂–OH + HOOC–C₆H₄–COOH → PET + water</Equation>
      <PolymerStructure kind="pet"/>
      <p>Here C₆H₄ is the <strong>benzene-ring part</strong> of the acid-derived section. Preserve it when drawing the monomers or polymer; do not turn it into a straight alkane chain.</p>
      <Definition term="Hydrolysis"><p>Breaking a chemical linkage by reacting it with <strong>water</strong>.</p></Definition>
      <p>PET’s ester linkages can be broken to recover its <strong>monomers</strong>. After separation and purification, those monomers can be <strong>polymerised again</strong> to make new PET. This is chemical recycling, rather than simply melting the original plastic.</p>
      <Callout kind="mistake"><p>A polyester link contains <strong>–COO–</strong>. A polyamide link contains <strong>–CONH–</strong>. Locate the atom next to the carbonyl carbon: <strong>O for an ester; N for an amide</strong>.</p></Callout>
    </>, true),
    section('proteins', 'Proteins: natural polyamides', [12,13], <>
      <p>Proteins are <strong>natural polyamides</strong> made from <strong>amino acid monomers</strong>. Each amino acid has an <strong>–NH₂ group</strong> and a <strong>–COOH group</strong>.</p>
      <DisplayedFormula width={410} atoms={[
        {id:'n',label:'N',x:80,y:100},{id:'h1',label:'H',x:20,y:100},{id:'h2',label:'H',x:80,y:30},{id:'c1',label:'C',x:160,y:100},{id:'h3',label:'H',x:160,y:30},{id:'r',label:'R',x:160,y:170},{id:'c2',label:'C',x:240,y:100},{id:'o1',label:'O',x:240,y:30},{id:'o2',label:'O',x:310,y:100},{id:'h4',label:'H',x:375,y:100},
      ]} bonds={[["n","h1"],["n","h2"],["n","c1"],["c1","h3"],["c1","r"],["c1","c2"],["c2","o1",2],["c2","o2"],["o2","h4"]]} caption="General amino acid structure: H₂N–CH(R)–COOH. R represents the side-chain."/>
      <p><strong>R</strong> is a side-chain that differs between amino acids. During condensation, the amino group of one molecule reacts with the carboxylic acid group of another. <strong>Water is released</strong> and an <strong>amide / peptide linkage</strong> forms.</p>
      <PolymerStructure kind="protein"/>
      <p>Along the protein backbone, look for the repeating pattern <strong>–N–C–C–</strong>. The carbonyl is C=O and each amino-acid central carbon carries its <strong>H and R group</strong>. Different residues can have different R groups; a protein need not be made from just one type of amino acid.</p>
      <Callout kind="exam" title="Draw two amino acids joined together"><p>Start with H₂N–CH(R)–COOH and H₂N–CH(R′)–COOH. Remove OH and H to form water, then join the remaining carbonyl carbon to nitrogen:</p><Equation>H₂N–CH(R)–C(=O)–NH–CH(R′)–COOH + H₂O</Equation><p>The new <strong>–C(=O)–NH–</strong> is the peptide link. Keep one free amino end and one free carboxylic acid end in this two-residue molecule.</p></Callout>
    </>, true),
    section('plastics-and-disposal', 'Plastics and the environment', [4,5], <>
      <p>Many common plastics are <strong>durable, unreactive and resistant to biological breakdown</strong>. These properties make them useful, but also mean discarded material can persist for a long time. Many are lightweight and can be carried into waterways.</p>
      <ChemistryTable headers={['Disposal issue', 'Why it matters']} rows={[
        ['Landfill','Many plastics break down very slowly, occupy space and accumulate.'],['Oceans','Plastic waste persists, can entangle wildlife or be swallowed, and can fragment into small particles.'],['Burning','Combustion releases gases; some plastics can give toxic gases. Incomplete burning can produce toxic carbon monoxide.'],
      ]}/>
      <p>Reducing unnecessary use, reusing suitable products and sorting plastics for recycling reduce waste. Recycling can be difficult when different polymers or contaminants are mixed.</p>
      <Callout kind="mistake"><p>Do not write “all polymers are non-biodegradable”: <strong>natural polymers such as proteins can be broken down biologically</strong>. Do not claim all plastic burning produces the same gases; the products depend on the polymer and combustion conditions.</p></Callout>
      <Callout kind="exam" title="Connect a property to a disposal problem"><p>Write a cause and consequence: <strong>many plastics resist biodegradation, so they persist and accumulate in landfill and oceans</strong>. “Plastic is bad for the environment” does not explain the chemistry.</p></Callout>
    </>),
    section('test-your-understanding', 'Test your understanding', [], check([
      ['Define a polymer and name the monomer of poly(ethene).', <>A polymer is a large molecule built from many monomer molecules. Poly(ethene) is made from ethene, CH₂=CH₂.</>],
      ['What happens to C=C in addition polymerisation?', <>It becomes a C–C single bond, with new bonds linking the monomers. No small molecule is eliminated.</>],
      ['Give a plastic property and link it to a disposal problem.', <>Many plastics resist biological breakdown, so they persist and accumulate in landfill or oceans.</>],
      ['Extended: deduce the monomer of [–CH₂–CH(CH₃)–]ₙ.', <>Propene, CH₂=CHCH₃. Restore C=C between the two backbone carbons and keep CH₃ as a side group.</>],
      ['Extended: which monomers make a polyamide and a polyester?', <>A dicarboxylic acid + a diamine make a polyamide. A dicarboxylic acid + a diol make a polyester. Water is released in both examples.</>],
      ['Extended: identify the linkages in nylon, PET and proteins.', <>Nylon: amide, –C(=O)–NH–. PET: ester, –C(=O)–O–. Proteins: amide / peptide, –C(=O)–NH–.</>],
      ['Extended: how can PET be chemically recycled?', <>Break its ester links to recover monomers, purify them, then re-polymerise them into PET.</>],
      ['Extended: write the general formula of an amino acid and explain R.', <>H₂N–CH(R)–COOH. R is a side-chain that can differ between amino acids.</>],
    ])),
  ]},
}

export const organicSyllabus = {
  title: 'Cambridge IGCSE Chemistry 0620 · 2026–2028',
  url: 'https://www.cambridgeinternational.org/Images/697205-2026-2028-syllabus.pdf',
  objectiveCounts: { '11.1': 9, '11.2': 4, '11.3': 7, '11.4': 4, '11.5': 6, '11.6': 4, '11.7': 3, '11.8': 13 },
}
