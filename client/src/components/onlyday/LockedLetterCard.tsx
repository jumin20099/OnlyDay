import { Lock } from "lucide-react";

type Props = {
  /** 이 편지(작성 순)까지 본문을 읽는 데 필요한 촛불 수 */
  required: number;
  currentCandles: number;
  /** 1 = 첫 편지, 2 = 두 번째… */
  ordinal: number;
};

export function LockedLetterCard({ required, currentCandles, ordinal }: Props) {
  const pct = Math.min(100, Math.round((currentCandles / Math.max(required, 1)) * 100));
  const remaining = Math.max(0, required - currentCandles);

  return (
    <div className="mt-3 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/95 to-rose-50/50 p-4 text-center shadow-sm ring-1 ring-amber-100/60">
      <div className="flex items-center justify-center gap-1.5 text-amber-900/90">
        <Lock className="h-4 w-4 shrink-0" />
        <span className="text-sm font-semibold">아직 잠긴 편지</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {ordinal}번째 편지 본문은 <span className="font-semibold text-foreground/90">촛불 {required}개</span>가
        켜지면 읽을 수 있어요.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        지금 {currentCandles}개 ·{remaining > 0 ? ` 앞으로 ${remaining}개 더` : " 조금만 기다리면 열려요!"}
      </p>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-300 via-rose-300 to-rose-400 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
