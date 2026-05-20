import type { Cake, UnlockState } from "@/types/api";
import { FLAVOR_THEME } from "@/lib/onlydayTheme";
import { buildSplendorPreviewSteps, defaultSplendorGoal } from "@/lib/splendorPreview";
import { ProgressBar } from "./Primitives";
import { Cake as SvgCake, apiFlavorToCakeFlavor } from "@/components/cake";
import { Eye, Lock, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  title: string;
  flavor: Cake["flavor"];
};

export function CreateCakeSplendorPreview({ title, flavor }: Props) {
  const theme = FLAVOR_THEME[flavor];
  const cakeFlavor = apiFlavorToCakeFlavor(flavor);
  const unlockStates = useMemo((): UnlockState[] => [], []);
  const goal = defaultSplendorGoal(unlockStates);
  const previewSteps = useMemo(() => buildSplendorPreviewSteps(goal, unlockStates), [goal, unlockStates]);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    setPreviewIndex(0);
  }, [flavor]);

  const step = previewSteps[previewIndex] ?? previewSteps[0];
  const previewCandleCount = step.candleCount;
  const simulatedUnlocks = unlockStates.map((u) => ({
    ...u,
    unlocked: previewCandleCount >= u.thresholdCount,
  }));
  const visualUnlocked = true;
  const progressPct = Math.min(1, previewCandleCount / Math.max(goal, 1));
  const premiumGlowSim = simulatedUnlocks.some((u) => u.unlocked) || progressPct >= 0.7;
  const candleColors = ["yellow", "pink", "lime", "blue"] as const;

  return (
    <div className="space-y-3">
      <div className={`relative mx-auto grid aspect-square max-h-44 max-w-[15rem] place-items-center -translate-y-4 sm:max-h-52 sm:translate-y-0`}>
        <div
          className="pointer-events-none absolute inset-[12%] rounded-full blur-3xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle, ${theme.accent} 0%, transparent 66%)`,
            opacity: 0.14 + progressPct * 0.26,
          }}
        />
        <SvgCake
          flavor={cakeFlavor}
          candleCount={previewCandleCount}
          candleColors={[...candleColors]}
          unlocked={visualUnlocked}
          progressGoal={goal}
          premiumGlow={premiumGlowSim}
          displayCandleCount={5}
          aria-label={`${title || "케이크"} 미리보기, 촛불 ${previewCandleCount}개`}
        />
      </div>

      {previewSteps.length > 1 ? (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600/90">
            <Eye className="h-3.5 w-3.5 shrink-0" />
            화려함 미리보기
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {previewSteps.map((s, i) => (
              <button
                key={`${s.candleCount}-${i}`}
                type="button"
                onClick={() => setPreviewIndex(i)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black transition ${
                  i === previewIndex
                    ? "bg-slate-950 text-white shadow-md"
                    : "bg-white/75 text-slate-600 ring-1 ring-white/80 hover:bg-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="block">
            <span className="sr-only">케이크 화려함 단계</span>
            <input
              type="range"
              min={0}
              max={previewSteps.length - 1}
              value={previewIndex}
              onChange={(e) => setPreviewIndex(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-[var(--color-primary)]"
            />
          </label>
        </div>
      ) : null}

      <div
        className="rounded-[1.2rem] bg-white/60 p-3 backdrop-blur sm:p-4"
        style={{
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), 0 0 ${8 + progressPct * 22}px ${theme.accent}33`,
        }}
      >
        <ProgressBar value={previewCandleCount} max={goal} label={`미리보기 (${previewCandleCount}개)`} />
        {simulatedUnlocks.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {simulatedUnlocks.map((state) => (
              <span
                key={state.featureKey}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-black ${
                  state.unlocked ? "bg-primary text-white" : "bg-white/70 text-slate-500"
                }`}
              >
                {state.unlocked ? <Sparkles className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {state.featureKey} · {state.thresholdCount}
              </span>
            ))}
          </div>
        ) : null}
        <p className="mt-2 text-[11px] font-semibold leading-relaxed text-slate-500 sm:text-xs">
          단계를 바꿔 보면 촛불이 모일 때 케이크가 어떻게 변하는지 볼 수 있어요.
        </p>
      </div>
    </div>
  );
}
