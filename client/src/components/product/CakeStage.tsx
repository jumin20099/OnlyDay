import type { Cake, Candle, UnlockState } from "@/types/api";
import { FLAVOR_THEME, completionGoalCandleCount, UNLOCK_LABELS } from "@/lib/onlydayTheme";
import { GlassCard, ProgressBar } from "./Primitives";
import { Flame, Lock, Sparkles } from "lucide-react";

type Props = {
  cake: Cake;
  candles: Candle[];
  unlockStates: UnlockState[];
  caption?: string;
  compact?: boolean;
};

export function CakeStage({ cake, candles, unlockStates, caption, compact = false }: Props) {
  const theme = FLAVOR_THEME[cake.flavor];
  const goal = completionGoalCandleCount(unlockStates);
  const nextUnlock = unlockStates.find((u) => !u.unlocked);

  return (
    <GlassCard className={`overflow-hidden ${compact ? "p-2" : "p-3 sm:p-4"}`}>
      <div
        className={`relative overflow-hidden rounded-[1.35rem] sm:rounded-[1.75rem] ${compact ? "p-3" : "p-4 sm:p-5"}`}
        style={{
          background: `radial-gradient(circle at 20% 10%, ${theme.hero[0]} 0%, transparent 36%),
            radial-gradient(circle at 85% 15%, #dbeafe 0%, transparent 30%),
            linear-gradient(155deg, ${theme.hero[0]} 0%, ${theme.hero[1]} 52%, ${theme.hero[2]} 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500/80 sm:text-[10px]">birthday cake</p>
            <h1 className="mt-0.5 line-clamp-1 text-2xl font-black tracking-[-0.06em] text-slate-950 sm:mt-1 sm:text-3xl">{cake.title}</h1>
            <p className="mt-0.5 text-xs font-semibold text-slate-600 sm:mt-1 sm:text-sm">{theme.label} · {cake.birthday}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-black text-slate-800 shadow-sm sm:px-3 sm:py-1.5 sm:text-xs">
            {cake.candleCount} candles
          </span>
        </div>

        <div className={`relative mx-auto grid aspect-square place-items-center ${compact ? "mt-3 max-w-[min(68dvh,280px)]" : "mt-5 max-w-[330px] sm:mt-7 sm:max-w-[360px]"}`}>
          <div className="absolute inset-0 rounded-full bg-white/35 blur-2xl" />
          <div className="relative grid h-[78%] w-[78%] place-items-center rounded-full bg-white/55 shadow-inner ring-1 ring-white/60 backdrop-blur">
            {cake.cakeImageUrl ? (
              <img src={cake.cakeImageUrl} alt={cake.title} className="h-[86%] w-[86%] rounded-full object-cover" />
            ) : (
              <span className={`${compact ? "text-7xl" : "text-7xl sm:text-8xl"} drop-shadow-sm`}>{theme.emoji}</span>
            )}
          </div>
          {candles.slice(0, compact ? 28 : 36).map((c, index) => (
            <span
              key={c.candleId}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{
                left: `${c.positionX * 100}%`,
                top: `${c.positionY * 100}%`,
              }}
              title={c.nickname}
            >
              <span
                className={`${compact ? "h-2.5 w-2.5" : "h-3 w-3"} rounded-full`}
                style={{
                  background: `radial-gradient(circle, #fff7b2 0%, ${c.candleColor} 58%, transparent 72%)`,
                  boxShadow: `0 0 ${10 + (index % 4) * 3}px ${c.candleColor}`,
                }}
              />
              <span className={`${compact ? "mt-0.5 h-3 w-1" : "mt-1 h-4 w-1.5"} rounded-full`} style={{ backgroundColor: c.candleColor }} />
            </span>
          ))}
        </div>

        <div className={`rounded-[1.2rem] bg-white/60 backdrop-blur sm:rounded-[1.5rem] ${compact ? "mt-3 p-3" : "mt-5 p-4"}`}>
          <ProgressBar value={cake.candleCount} max={goal} label="케이크 성장도" />
          <div className={`${compact ? "mt-2 hidden sm:flex" : "mt-4 flex"} flex-wrap gap-2`}>
            {unlockStates.map((state) => (
              <span
                key={state.featureKey}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-black ${
                  state.unlocked ? "bg-slate-950 text-white" : "bg-white/70 text-slate-500"
                }`}
              >
                {state.unlocked ? <Sparkles className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {UNLOCK_LABELS[state.featureKey] ?? state.featureKey} · {state.thresholdCount}
              </span>
            ))}
          </div>
          <p className={`${compact ? "mt-2 line-clamp-2 text-[11px] leading-4" : "mt-3 text-xs leading-5"} font-semibold text-slate-500`}>
            {caption ??
              (nextUnlock
                ? `다음 보상까지 ${Math.max(0, nextUnlock.thresholdCount - cake.candleCount)}개의 촛불이 더 필요해요.`
                : "모든 장식 보상이 열렸어요.")}
          </p>
        </div>

        <div className={`${compact ? "hidden" : "hidden sm:block"} pointer-events-none absolute right-5 top-24 rounded-full bg-slate-950/85 px-3 py-2 text-xs font-black text-white shadow-lg`}>
          <Flame className="mr-1 inline h-3.5 w-3.5 text-amber-300" />
          Tap-worthy cake
        </div>
      </div>
    </GlassCard>
  );
}
