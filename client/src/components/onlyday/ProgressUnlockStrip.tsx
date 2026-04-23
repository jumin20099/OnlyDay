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
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-foreground">
          <span className="font-serif text-lg text-amber-700/90">{candleCount}</span>
          <span className="text-muted-foreground">개의 촛불이 켜졌어요</span>
        </span>
        <span className="text-xs text-muted-foreground">목표 {goal}개</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/40 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-300 via-fuchsia-300 to-violet-400 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">촛불을 눌러 마음을 확인해 보세요</p>

      <ul className="mt-4 space-y-2">
        {unlockStates.map((u) => (
          <li
            key={u.featureKey}
            className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-xs ${
              u.unlocked
                ? "border-pink-200/60 bg-white/50"
                : "border-white/30 bg-white/25 opacity-90 backdrop-blur-sm"
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
