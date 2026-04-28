import { CakeBase } from "./CakeBase";
import { Candles } from "./Candles";
import { CreamLayer } from "./CreamLayer";
import { Topping } from "./Topping";
import { resolveCakeTheme } from "./themes";
import type { CakeProps } from "./types";
import { useId } from "react";

export function Cake({
  flavor,
  candleCount,
  candleColors,
  unlocked,
  className = "",
  progressGoal = 30,
  themeOverride,
  premiumGlow = false,
  "aria-label": ariaLabel,
}: CakeProps) {
  const reactId = useId().replace(/:/g, "");
  const theme = resolveCakeTheme(flavor, themeOverride);
  const locked = !unlocked;
  const progress = Math.min(1, Math.max(0, candleCount / Math.max(1, progressGoal)));
  const glowOpacity = locked ? 0.16 : premiumGlow ? 0.56 : 0.24 + progress * 0.24;
  const idPrefix = `cake-${flavor}-${reactId}`;

  return (
    <figure
      className={`group relative aspect-square w-full overflow-visible ${className}`}
      aria-label={ariaLabel ?? `${theme.label} 케이크, 촛불 ${candleCount}개`}
    >
      <svg
        viewBox="0 0 400 400"
        role="img"
        className="h-full w-full overflow-visible drop-shadow-[0_14px_18px_rgba(15,23,42,0.11)] transition duration-500 ease-out group-hover:scale-[1.025]"
      >
        <defs>
          <radialGradient id={`${idPrefix}-ambient`} cx="38%" cy="30%" r="62%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={locked ? 0.1 : 0.26} />
            <stop offset="35%" stopColor={theme.glow} stopOpacity={glowOpacity} />
            <stop offset="76%" stopColor={theme.glow} stopOpacity="0.07" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${idPrefix}-baseTop`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={theme.base.top} />
            <stop offset="44%" stopColor={theme.base.mid} />
            <stop offset="100%" stopColor={theme.base.bottom} />
          </linearGradient>
          <linearGradient id={`${idPrefix}-baseSide`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={theme.base.top} />
            <stop offset="42%" stopColor={theme.base.mid} />
            <stop offset="100%" stopColor={theme.base.sideShadow} />
          </linearGradient>
          <linearGradient id={`${idPrefix}-creamTop`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={theme.cream.highlight} />
            <stop offset="45%" stopColor={theme.cream.top} />
            <stop offset="100%" stopColor={theme.cream.drip} />
          </linearGradient>
          <radialGradient id={`${idPrefix}-topLight`} cx="33%" cy="22%" r="56%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.58" />
            <stop offset="52%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${idPrefix}-bottomShade`} cx="70%" cy="76%" r="60%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.14" />
            <stop offset="70%" stopColor="#0f172a" stopOpacity="0.045" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <filter id={`${idPrefix}-softBlur`}>
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter
            id={`${idPrefix}-groundBlur`}
            x="-40%"
            y="-80%"
            width="180%"
            height="260%"
            filterUnits="objectBoundingBox"
          >
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        <ellipse
          cx="200"
          cy="322"
          rx="104"
          ry="16"
          fill="rgba(15,23,42,0.11)"
          filter={`url(#${idPrefix}-groundBlur)`}
          pointerEvents="none"
        />
        <g className={locked ? "blur-[1.2px]" : ""}>
          <CakeBase theme={theme} locked={locked} idPrefix={idPrefix} />
          <CreamLayer theme={theme} locked={locked} idPrefix={idPrefix} />
          <Topping theme={theme} locked={locked} idPrefix={idPrefix} />
          <Candles count={candleCount} colors={candleColors} locked={locked} />
        </g>

      </svg>

      {locked ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-full bg-white/10">
          <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[11px] font-black text-slate-600 shadow-sm backdrop-blur">
            잠김
          </div>
        </div>
      ) : null}
    </figure>
  );
}
