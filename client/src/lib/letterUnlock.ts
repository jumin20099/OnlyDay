/**
 * 백엔드 LetterContentUnlockPolicy 와 동일: i번째 편지(0-based) 본문 해제에
 * 필요한 촛불 = (i+1) × unlockStepCandles. 기본 1.
 */
const raw = import.meta.env.VITE_LETTER_UNLOCK_STEP;
export const LETTER_CONTENT_UNLOCK_STEP =
  raw !== undefined && raw !== "" && !Number.isNaN(Number(raw))
    ? Math.max(1, Math.floor(Number(raw)))
    : 1;

export function requiredCandlesForLetterIndex(letterIndexZero: number, step = LETTER_CONTENT_UNLOCK_STEP) {
  return (letterIndexZero + 1) * Math.max(1, step);
}

export function candlesShortUntilContentUnlock(
  letterIndexZero: number,
  totalCandles: number,
  step = LETTER_CONTENT_UNLOCK_STEP
) {
  const need = requiredCandlesForLetterIndex(letterIndexZero, step);
  return Math.max(0, need - totalCandles);
}
