// Change one flag to re-enable the route, sidebar, Course Home resource or gamification.
export const studyFeatures = {
  worksheets: { enabled: false, title: 'Worksheets' },
  flashcards: { enabled: false, title: 'Flashcards' },
  streaks: { enabled: false, title: 'Daily Streaks' },
  xp: { enabled: false, title: 'Experience Points' },
}
export const isStudyFeatureEnabled = id => studyFeatures[id]?.enabled ?? true
