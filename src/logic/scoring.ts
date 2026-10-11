/**
 * Calculate stars earned on an individual question.
 * @param attemptsCount Number of attempts taken (1, 2, 3)
 * @param revealed Whether the correct answer had to be automatically revealed
 * @param hintUsed Whether child explicitly pressed "Show me" hint
 */
export function calculateQuestionStars(
  attemptsCount: number,
  revealed: boolean = false,
  hintUsed: boolean = false
): number {
  if (revealed) return 0;
  if (attemptsCount === 1 && !hintUsed) return 3;
  if (attemptsCount === 2 && !hintUsed) return 2;
  return 1;
}

/**
 * Calculate level stars awarded based on question stars.
 * Child who completes the level receives between 1 and 3 stars.
 */
export function calculateLevelStars(questionStars: number[]): number {
  if (questionStars.length === 0) return 0;
  const sum = questionStars.reduce((acc, s) => acc + s, 0);
  const avg = sum / questionStars.length;
  // Round to nearest integer, minimum 1 if finished
  const rounded = Math.round(avg);
  return Math.max(1, Math.min(3, rounded));
}
