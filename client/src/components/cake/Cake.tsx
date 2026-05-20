import { CakeBase } from "./CakeBase";
import { Candles } from "./Candles";
import { CreamLayer } from "./CreamLayer";
import { Topping } from "./Topping";
import { resolveCakeTheme } from "./themes";
import type { CakeProps, CakeTheme, CakeVisualLevel } from "./types";
import { useId } from "react";

type TierSpec = {
  scale: number;
  topY: number;
  topping: boolean;
};

function visualLevelForCandleCount(candleCount: number): CakeVisualLevel {
  if (candleCount >= 36) return 5;
  if (candleCount >= 26) return 4;
  if (candleCount >= 16) return 3;
  if (candleCount >= 6) return 2;
  return 1;
}

function tiersForLevel(level: CakeVisualLevel): TierSpec[] {
  if (level >= 5) {
    return [
      { scale: 1, topY: 244, topping: false },
      { scale: 0.82, topY: 164, topping: false },
      { scale: 0.64, topY: 96, topping: true },
    ];
  }
  if (level >= 4) {
    return [
      { scale: 1, topY: 244, topping: false },
      { scale: 0.82, topY: 164, topping: true },
      { scale: 0.64, topY: 96, topping: true },
    ];
  }
  if (level >= 3) {
    return [
      { scale: 1, topY: 232, topping: false },
      { scale: 0.72, topY: 132, topping: true },
    ];
  }
  if (level >= 2) {
    return [{ scale: 1, topY: 214, topping: true }];
  }
  return [{ scale: 1, topY: 214, topping: false }];
}

function tierTransform({ scale, topY }: TierSpec) {
  return `translate(200 ${topY}) scale(${scale}) translate(-200 -214)`;
}

function DecorativeSparkles({ theme, level }: { theme: CakeTheme; level: CakeVisualLevel }) {
  if (level < 3) return null;
  const sparkles = [
    [96, 92, 0.8],
    [306, 112, 0.65],
    [106, 168, 0.55],
    [286, 184, 0.75],
    [165, 78, 0.5],
    [326, 222, 0.45],
    ...(level >= 4 ? ([[74, 142, 0.58], [334, 164, 0.52], [214, 72, 0.44]] as const) : []),
    ...(level >= 5 ? ([[246, 104, 0.38]] as const) : []),
  ] as const;
  return (
    <g opacity={level >= 5 ? 0.78 : level >= 4 ? 0.76 : 0.5}>
      {sparkles.map(([x, y, scale], index) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${scale})`}>
          <path d="M0-12c2 7 5 10 12 12-7 2-10 5-12 12-2-7-5-10-12-12 7-2 10-5 12-12Z" fill="#fff7cc" opacity="0.95" />
          <circle cx="0" cy="0" r="3" fill={index % 2 ? theme.topping.secondary : theme.topping.primary} opacity="0.65" />
        </g>
      ))}
    </g>
  );
}

function FloralDecor({ theme, level }: { theme: CakeTheme; level: CakeVisualLevel }) {
  if (level < 3) return null;
  const flowers = [
    [98, 267, 0.9],
    [128, 289, 0.65],
    [276, 270, 0.86],
    [307, 292, 0.62],
    ...(level >= 4 ? ([[86, 225, 0.58], [318, 235, 0.58], [152, 252, 0.54], [250, 248, 0.54]] as const) : []),
    ...(level >= 5 ? ([[196, 286, 0.5]] as const) : []),
  ] as const;
  return (
    <g opacity={level >= 5 ? 0.86 : 0.78}>
      {level >= 3 ? (
        <>
          <path d="M98 284c28-64 70-82 102-128" fill="none" stroke={theme.topping.accent} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <path d="M302 284c-32-64-76-82-110-128" fill="none" stroke={theme.topping.accent} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
          <path d="M132 238c18-2 28 7 34 20" fill="none" stroke={theme.topping.accent} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <path d="M268 236c-18-2-29 7-35 20" fill="none" stroke={theme.topping.accent} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        </>
      ) : null}
      {flowers.map(([x, y, scale]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${scale})`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-8"
              rx="5"
              ry="9"
              fill={theme.cream.highlight}
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="4" fill={theme.topping.secondary} />
        </g>
      ))}
    </g>
  );
}

function Confetti({ theme, level }: { theme: CakeTheme; level: CakeVisualLevel }) {
  if (level < 4 || level >= 5) return null;
  const pieces = [
    [118, 126, 12],
    [278, 132, -18],
    [148, 96, 26],
    [244, 88, -30],
    [84, 194, -20],
    [318, 206, 18],
    [188, 118, 36],
    [222, 144, -24],
    ...(level >= 5 ? ([[104, 250, 30], [296, 256, -26], [162, 58, 14], [304, 78, 34]] as const) : []),
  ] as const;
  return (
    <g opacity={level >= 5 ? 0.72 : 0.5}>
      {pieces.map(([x, y, rotate], index) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="5"
          height="8"
          rx="1.5"
          fill={index % 3 === 0 ? theme.topping.primary : index % 3 === 1 ? theme.topping.secondary : theme.cream.highlight}
          transform={`rotate(${rotate} ${x} ${y})`}
        />
      ))}
    </g>
  );
}

function SoftBloom({ theme, level }: { theme: CakeTheme; level: CakeVisualLevel }) {
  if (level < 5) return null;
  return (
    <g opacity="0.8" pointerEvents="none">
      <ellipse cx="200" cy="178" rx="140" ry="132" fill={theme.glow} opacity="0.18" filter="blur(8px)" />
      <ellipse cx="200" cy="198" rx="110" ry="102" fill="#ffffff" opacity="0.18" />
      <circle cx="110" cy="118" r="3" fill="#fff7cc" opacity="0.75" />
      <circle cx="292" cy="98" r="2.5" fill="#fff7cc" opacity="0.62" />
      <circle cx="326" cy="184" r="2.2" fill="#fff7cc" opacity="0.58" />
      <circle cx="78" cy="208" r="2" fill="#fff7cc" opacity="0.5" />
    </g>
  );
}

function TierFancyTrim({
  theme,
  level,
  tierIndex,
}: {
  theme: CakeTheme;
  level: CakeVisualLevel;
  tierIndex: number;
}) {
  if (level < 2) return null;
  const pearlCount = level >= 5 ? 8 : level >= 4 ? 8 : 6;
  const start = 105;
  const gap = 190 / Math.max(pearlCount - 1, 1);
  const flowerXs = level >= 5 ? [126, 274] : level >= 4 && tierIndex <= 1 ? [122, 278] : [];

  return (
    <g opacity={level >= 5 ? 0.92 : level >= 4 ? 0.78 : 0.58}>
      <path
        d="M92 248c35 15 181 16 216-1"
        fill="none"
        stroke={theme.cream.highlight}
        strokeLinecap="round"
        strokeWidth={level >= 4 ? 5 : 3.5}
        opacity="0.72"
      />
      <path
        d="M104 262c44 10 151 10 194-1"
        fill="none"
        stroke={theme.topping.secondary}
        strokeLinecap="round"
        strokeWidth={level >= 5 ? 4 : 2.5}
        opacity={level >= 4 ? 0.55 : 0.32}
      />
      {level >= 3 ? Array.from({ length: pearlCount }).map((_, index) => {
        const x = start + index * gap;
        const y = 247 + Math.sin(index * 1.2) * 3;
        return (
          <circle
            key={`${tierIndex}-${index}`}
            cx={x}
            cy={y}
            r={level >= 5 ? 4 : 3}
            fill={index % 2 ? theme.cream.highlight : theme.topping.secondary}
            opacity="0.88"
          />
        );
      }) : null}
      {flowerXs.map((x) => (
        <g key={`${tierIndex}-${x}`} transform={`translate(${x} 258) scale(${tierIndex === 0 ? 0.55 : 0.42})`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-7"
              rx="4.5"
              ry="8"
              fill={theme.cream.highlight}
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="3.5" fill={theme.topping.primary} />
        </g>
      ))}
    </g>
  );
}

function CelebrationRibbon({ theme, level }: { theme: CakeTheme; level: CakeVisualLevel }) {
  if (level < 5) return null;
  return (
    <g opacity="0.72">
      <path d="M94 316c58 15 154 15 212-2" fill="none" stroke={theme.topping.secondary} strokeWidth="9" strokeLinecap="round" opacity="0.54" />
      <path d="M136 314c-18 16-35 28-54 34 7-22 15-40 31-52" fill={theme.topping.secondary} opacity="0.56" />
      <path d="M151 316c-6 21-4 39 6 55-24-8-43-19-56-35" fill={theme.topping.primary} opacity="0.5" />
      <path d="M116 325c9 4 20 7 31 8" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

export function Cake({
  flavor,
  candleCount,
  candleColors,
  unlocked,
  className = "",
  progressGoal = 30,
  themeOverride,
  premiumGlow = false,
  hideCandles = false,
  displayCandleCount,
  "aria-label": ariaLabel,
}: CakeProps) {
  const reactId = useId().replace(/:/g, "");
  const theme = resolveCakeTheme(flavor, themeOverride);
  const locked = !unlocked;
  const progress = Math.min(1, Math.max(0, candleCount / Math.max(1, progressGoal)));
  const visualLevel = visualLevelForCandleCount(candleCount);
  const tiers = tiersForLevel(visualLevel);
  const glowOpacity = locked ? 0.16 : premiumGlow ? 0.56 : 0.24 + progress * 0.24;
  const idPrefix = `cake-${flavor}-${reactId}`;

  return (
    <figure
      className={`group relative aspect-square w-full overflow-visible ${visualLevel >= 3 && !locked ? "cake-breathing" : ""} ${className}`}
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
          <SoftBloom theme={theme} level={visualLevel} />
          {tiers.map((tier, index) => (
            <g key={`${tier.scale}-${tier.topY}-${index}`} transform={tierTransform(tier)}>
              <CakeBase theme={theme} locked={locked} idPrefix={idPrefix} />
              <CreamLayer theme={theme} locked={locked} idPrefix={idPrefix} />
              <TierFancyTrim theme={theme} level={visualLevel} tierIndex={index} />
              {tier.topping ? <Topping theme={theme} locked={locked} idPrefix={idPrefix} /> : null}
            </g>
          ))}
          <FloralDecor theme={theme} level={visualLevel} />
          <CelebrationRibbon theme={theme} level={visualLevel} />
          <Confetti theme={theme} level={visualLevel} />
          <DecorativeSparkles theme={theme} level={visualLevel} />
          {!hideCandles ? (
            <Candles
              count={displayCandleCount ?? candleCount}
              colors={candleColors}
              locked={locked}
              visualLevel={visualLevel}
            />
          ) : null}
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
