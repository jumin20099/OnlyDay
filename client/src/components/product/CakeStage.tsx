import type { Cake, Candle, UnlockState } from "@/types/api";
import { FLAVOR_THEME, completionGoalCandleCount, UNLOCK_LABELS } from "@/lib/onlydayTheme";
import { GlassCard, ProgressBar } from "./Primitives";
import { Flame, Lock, Sparkles } from "lucide-react";
import { Cake as SvgCake, apiCandlesToCandleColors, apiFlavorToCakeFlavor } from "@/components/cake";

type Props = {
  cake: Cake;
  candles: Candle[];
  unlockStates: UnlockState[];
  caption?: string;
  compact?: boolean;
  forceUnlocked?: boolean;
};

export function CakeStage({ cake, candles, unlockStates, caption, compact = false, forceUnlocked = false }: Props) {
  const theme = FLAVOR_THEME[cake.flavor];
  const goal = completionGoalCandleCount(unlockStates);
  const nextUnlock = unlockStates.find((u) => !u.unlocked);
  const visualUnlocked = forceUnlocked || cake.candleCount > 0 || unlockStates.some((u) => u.unlocked);
  const cakeFlavor = apiFlavorToCakeFlavor(cake.flavor);
  const candleColors = apiCandlesToCandleColors(candles);
  const progressPct = Math.min(1, cake.candleCount / Math.max(goal, 1));

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
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500/80 sm:text-[10px]">생일 케이크</p>
            <h1 className="mt-0.5 line-clamp-1 text-2xl font-black tracking-[-0.06em] text-slate-950 sm:mt-1 sm:text-3xl">{cake.title}</h1>
            <p className="mt-0.5 text-xs font-semibold text-slate-600 sm:mt-1 sm:text-sm">{theme.label} · {cake.birthday}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-black text-slate-800 shadow-sm sm:px-3 sm:py-1.5 sm:text-xs">
            촛불 {cake.candleCount}개
          </span>
        </div>

        <div className={`relative mx-auto grid aspect-square place-items-center ${compact ? "mt-2 max-w-[min(62dvh,280px)]" : "mt-4 max-w-[330px] sm:mt-6 sm:max-w-[360px]"}`}>
          <div
            className="pointer-events-none absolute inset-[12%] rounded-full blur-3xl transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle, ${theme.accent} 0%, transparent 66%)`,
              opacity: 0.14 + progressPct * 0.26,
            }}
          />
          <SvgCake
            flavor={cakeFlavor}
            candleCount={cake.candleCount}
            candleColors={candleColors}
            unlocked={visualUnlocked}
            progressGoal={goal}
            premiumGlow={unlockStates.some((u) => u.unlocked) || progressPct >= 0.7}
            aria-label={`${theme.label} 케이크, 촛불 ${cake.candleCount}개`}
          />
        </div>

        <div
          className={`rounded-[1.2rem] bg-white/60 backdrop-blur transition-shadow duration-700 sm:rounded-[1.5rem] ${compact ? "mt-3 p-3" : "mt-5 p-4"}`}
          style={{
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), 0 0 ${8 + progressPct * 22}px ${theme.accent}33`,
          }}
        >
          <ProgressBar value={cake.candleCount} max={goal} label="촛불 개수" />
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
                ? `다음 케이크 변화까지 촛불 ${Math.max(0, nextUnlock.thresholdCount - cake.candleCount)}개 남았어요.`
                : "케이크 변화가 모두 적용됐어요.")}
          </p>
        </div>

        <div className={`${compact ? "hidden" : "hidden sm:block"} pointer-events-none absolute right-5 top-24 rounded-full bg-slate-950/85 px-3 py-2 text-xs font-black text-white shadow-lg`}>
          <Flame className="mr-1 inline h-3.5 w-3.5 text-amber-300" />
          마음이 모이는 중
        </div>
      </div>
    </GlassCard>
  );
}
