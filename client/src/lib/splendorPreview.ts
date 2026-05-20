import type { UnlockState } from "@/types/api";

export type SplendorStep = { candleCount: number; label: string };

export const SPLENDOR_PREVIEW_GOAL = 36;

const VISUAL_LEVEL_PREVIEW_STEPS: SplendorStep[] = [
  { candleCount: 0, label: "Lv.1 시작" },
  { candleCount: 6, label: "Lv.2 온기" },
  { candleCount: 16, label: "Lv.3 축적" },
  { candleCount: 26, label: "Lv.4 화려" },
  { candleCount: 36, label: "Lv.5 완성" },
];

export function buildSplendorPreviewSteps(goal: number, unlockStates: UnlockState[]): SplendorStep[] {
  void goal;
  void unlockStates;
  return VISUAL_LEVEL_PREVIEW_STEPS;
}

export function bestStepIndexForCount(candleCount: number, steps: SplendorStep[]) {
  let best = 0;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].candleCount <= candleCount) best = i;
  }
  return best;
}

/** 만들기 화면 등에서 unlockStates가 비어 있을 때 목표 촛불 수 */
export function defaultSplendorGoal(unlockStates: UnlockState[]) {
  void unlockStates;
  return SPLENDOR_PREVIEW_GOAL;
}
