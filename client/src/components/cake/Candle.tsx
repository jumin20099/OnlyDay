import { CANDLE_COLOR_HEX } from "./candleColors";
import type { CandleColor } from "./types";

type Props = {
  color: CandleColor;
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  locked?: boolean;
};

export function Candle({ color, x, y, scale = 1, delay = 0, locked = false }: Props) {
  const c = CANDLE_COLOR_HEX[color];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={locked ? 0.45 : 1}>
      <ellipse cx="0" cy="38" rx="7.5" ry="3.5" fill="rgba(15,23,42,0.16)" />
      <rect x="-5" y="0" width="10" height="38" rx="4" fill={c.body} />
      <path d="M-1 1h6v36h-6Z" fill={c.shadow} opacity="0.3" />
      <path d="M-3 7h6M-3 17h6M-3 27h6" stroke="rgba(255,255,255,0.38)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M0-6v8" stroke={c.wick} strokeWidth="1.8" strokeLinecap="round" />
      {!locked && (
        <g className="cake-flame" style={{ animationDelay: `${delay}ms`, transformOrigin: "0px -16px" }}>
          <ellipse cx="0" cy="-16" rx="20" ry="22" fill="#facc15" opacity="0.22" className="cake-flame-glow" />
          <ellipse cx="0" cy="-14" rx="13" ry="15" fill="#fef3c7" opacity="0.34" />
          <path d="M0-32c13 12 10 27 1 33-10-5-12-20-1-33Z" fill="#f97316" />
          <path d="M2-25c7 9 4 18-2 22-6-4-6-14 2-22Z" fill="#fff7ad" />
          <path d="M-5-24c-4 7-2 13 3 16" fill="none" stroke="#fed7aa" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        </g>
      )}
    </g>
  );
}
