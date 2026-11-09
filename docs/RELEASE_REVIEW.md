# Release review — 8 November 2026

## Assessment

The core Notes/Questions flow is suitable for continued beta testing. A broad
public launch advertised as a complete Chemistry 0620 course is not ready yet.
Complete the content gaps below, review imported scientific
notation, and run a real browser/mobile pass before making that claim.

Worksheets and Flashcards are temporarily disabled in the sidebar and Course
Home. Direct visits show Coming soon with a working return link. Existing files,
progress and study positions are preserved. Their PDF/deck code is deferred and
worksheet preloads do not run while the feature is disabled. Both switches are
in `src/lib/study-features.js`.

## Verified in this review

- Production build passes. `git diff --check` passes.
- All 12 Course Home topic groups and 49 subtopic destinations are represented.
- All 49 Notes routes and all 49 Questions routes render in component tests.
- The 230-question bank has valid topic IDs, four options per question and valid
  answer indices. All 200 source-paper records point to existing local PDFs.
- Imported answer indices match the recorded mark-scheme keys. This is not a
  new independent chemistry review of every transcription and diagram.
- Representative text, table, equation and diagram questions render; answer
  selection, deselection, reselection and correct/incorrect states pass.
- The markscheme dialog displays the expected answer letter.
- Calculator opening/closing works; its referenced JS/CSS files exist. Actual
  calculator arithmetic and pointer dragging were not browser-tested this turn.
- All eight organic notes routes pass completion/undo, answer reveals, next-topic
  navigation, toolbar presence and preserved revision-guide state tests.
- Course tabs, search, keyboard tab changes, resume links and completion state
  were exercised in the component tests used during the recent course changes.
- Disabled resources have no navigation links or active pin controls. Direct
  route gating works and no worksheet fetch is started by the disabled app.
- Lint completes with 0 errors and 20 warnings. Warnings include existing effect,
  ref/immutability and unused-variable findings; they are not all runtime bugs.

Tests use JSDOM/component rendering and source/data checks. Native/browser access
was unavailable in this session. No claim is made that every menu, scroll gesture,
mobile layout or cross-browser behavior has been visually verified.

## Findings to check

### High: 41 subtopics have summaries rather than full revision notes

Only 11.1–11.8 currently use the detailed organic lesson content. The remaining
41 subtopics open the short Overview page, a syllabus link and related topics.

Check `/notes?topic=1.1` and `/notes?topic=9.1`, then compare with
`/notes?topic=11.1`. Do not present the full syllabus as finished revision notes
until the missing lessons are written or the release scope clearly says organic
chemistry only.

Relevant code: `src/pages/Notes.jsx`, `src/pages/SyllabusTopic.jsx`,
`src/data/organic/lessons.jsx`.

### Resolved: reports now hide the question locally

The user explicitly chose a local-only report flow. Reporting a question now
smoothly blurs its content behind a You reported this question notice. View with
caution reveals it with a reminder; it can be hidden again or the report removed.
The flag persists on the current device without changing answers or progress.
No off-device submission or promise of a review is made.

The report/reveal/re-hide/undo flow and persistence passed a component test using
the actual question menu.

### High: one imported question needs a source-fidelity decision

Check `/questions?topic=11.4`, the question “Which equation represents a
substitution reaction?”, then use Find question (0620/22, May/June 2026, Q34).
The supplied PDF visibly prints CH₃CHCl₃ in option A; the import override displays
CH₃CHCl₂. The source notation itself appears chemically problematic, but changing
it without an explicit correction means the UI is not a literal transcription.
The import also restores double bonds in equation options.

Review whether to preserve the supplied source with a correction note or replace
it with a verified clean version. Do not silently change the answer key. This
mismatch was introduced during the earlier import, not by the feature-disable
change. No question data was changed in this review.

Relevant code: `scripts/format-0620-june-2026.py`, equation overrides for (22, 34).

### Resolved: unknown URLs show a 404 page

App now has a catch-all route. Unknown URLs display Page not found and a working
Back to Course Home link. Both were verified in a component test. Production
host refresh/deep-link rewrites still need verification on the actual deployment.

### Medium: question coverage is uneven

There are 230 questions across 49 subtopics: 200 sourced questions plus 30
original practice items. Several subtopics have only one or two questions.
Examples: 11.4 has 1, 11.6 has 2, 1.2 has 1 and 9.1 has 2. The earlier target of
at least 20 questions per organic subtopic has not been reached. This is a
content gap rather than a broken topic filter.

### Resolved: subject homepage and topic overviews

The fixed Organic Chemistry workspace card has been replaced with three subject choices: Chemistry 0620, Biology 0610 and Physics 0625. Chemistry retains its content; Biology and Physics have official syllabus topic overviews only. Subject navigation, resource resume links and completion are separate. The homepage uses the favicon, shared local profile/XP/streak, an animated background and a short loading transition. Automated component checks cover all 133 new overview routes, subject isolation, loading/cancellation and existing Chemistry routes. Visual browser review is still required.

### Information to make clear to students

- First-time percentages are editorial difficulty estimates, not collected
  student statistics. The tooltip already discloses this.
- Progress, answers and highlights are stored on the current browser/device.
  There is no account sync or cloud restore. Clearing browser storage can remove
  them. The UI generally says this, but it matters when promising saved progress.

## Manual checks still required before public release

- Safari, Chrome and a phone-sized touch browser: menus, markscheme dismissal,
  annotation-toolbar placement, expanded sidebar and inner-only scrolling.
- Highlight creation/recolour/deletion and persistence in browsers supporting
  the CSS Custom Highlight API. Check behavior when that API is unavailable.
- Narrow/mobile question headers: result circle, difficulty, percentage,
  calculator and Markscheme controls together, especially after answering.
- Native PDF Find question links opening at the expected page in target browsers.
- Clipboard buttons on the actual HTTPS deployment, calculator arithmetic and
  dragging/resizing, keyboard focus and zoom.
- Initial load on a slower connection. The active main bundle is about 1.68 MB
  uncompressed / 342 KB gzip; disabled worksheet/PDF code is now deferred.
- A final subject-content review of question wording, formulae, distractors,
  diagrams, syllabus level labels and answer meanings against the sources.

## Suggested release boundary

A small, clearly labelled organic-chemistry beta is the realistic next step,
after the source mismatch is resolved and the browser checks pass. A complete IGCSE Chemistry course launch
should wait for the remaining lessons and broader question coverage.
