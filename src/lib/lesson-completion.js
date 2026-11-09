export function toggleLessonCompletion(progress) {
  // Existing completed lessons have already received their completion reward.
  const rewarded = progress.lessonRewarded ?? progress.completed
  const completed = !progress.completed
  return {
    ...progress,
    completed,
    lessonRewarded: Boolean(rewarded || completed),
    xp: progress.xp + (completed && !rewarded ? 20 : 0),
  }
}
