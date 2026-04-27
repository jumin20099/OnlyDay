import type { UnlockState } from "@/types/api";
import { completionGoalCandleCount, UNLOCK_LABELS } from "@/lib/onlydayTheme";
import { Lock } from "lucide-react";

type Props = {
  candleCount: number;
  unlockStates: UnlockState[];
};

export function ProgressUnlockStrip({ candleCount, unlockStates }: Props) {
  const goal = completionGoalCandleCount(unlockStates);
  const pct = Math.min(100, Math.round((candleCount / Math.max(goal, 1)) * 100));

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-4">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-foreground">
          <span className="font-serif text-base font-semibold text-foreground">{candleCount}</span>
          <span className="text-muted-foreground">개의 촛불이 켜졌어요</span>
        </span>
        <span className="text-xs text-muted-foreground">목표 {goal}개</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted/80">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">촛불을 눌러 마음을 확인해 보세요</p>

      <ul className="mt-3 space-y-2">
        {unlockStates.map((u) => (
          <li
            key={u.featureKey}
            className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-[10px] transition-[transform,box-shadow] duration-200 ease-out ${
              u.unlocked
                ? "border-accent-lavender/40 bg-card shadow-[0_4px_14px_-6px_rgba(184,192,255,0.35)]"
                : "border-transparent bg-muted/60 text-muted-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-8px_rgba(45,55,72,0.08)]"
            }`}
          >
            <span className="flex items-center gap-2">
              {!u.unlocked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
              {UNLOCK_LABELS[u.featureKey] ?? u.featureKey}
            </span>
            <span className="text-muted-foreground">{u.thresholdCount}개</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
