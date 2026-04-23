import type { Candle, Letter } from "@/types/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

type Props = {
  candles: Candle[];
  lettersByCandleId: Map<string, Letter>;
  /** 해금 시각 효과 강도 (0~2) */
  visualTier: number;
  className?: string;
};

export function OrganicCandles({ candles, lettersByCandleId, visualTier, className = "" }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sorted = useMemo(
    () => [...candles].sort((a, b) => a.candleId.localeCompare(b.candleId)),
    [candles]
  );

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {sorted.map((c) => {
        const letter = lettersByCandleId.get(c.candleId);
        const isOpen = activeId === c.candleId;
        const glow = 8 + visualTier * 6 + (isOpen ? 12 : 0);
        return (
          <div
            key={c.candleId}
            className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${c.positionX * 100}%`,
              top: `${c.positionY * 100}%`,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveId(isOpen ? null : c.candleId)}
              className="relative flex flex-col items-center gap-0.5 outline-none"
              aria-label={`${c.nickname} 촛불`}
            >
              <motion.div
                animate={{ scale: isOpen ? 1.15 : 1, filter: isOpen ? "brightness(1.15)" : "brightness(1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="relative"
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 10 + visualTier * 2,
                    height: 10 + visualTier * 2,
                    background: `radial-gradient(circle, #fef08a 0%, #f59e0b 45%, transparent 70%)`,
                    boxShadow: `0 0 ${glow}px ${c.candleColor}aa, 0 0 ${glow * 0.5}px #fff8`,
                    filter: "blur(0.2px)",
                  }}
                />
                <div
                  className="absolute left-1/2 top-full h-5 w-2.5 -translate-x-1/2 rounded-b-md"
                  style={{
                    backgroundColor: c.candleColor,
                    boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.12)`,
                  }}
                />
              </motion.div>
              <span className="max-w-[4.5rem] truncate text-[10px] font-medium text-foreground/70">
                {c.nickname}
              </span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 6 }}
                  transition={{ duration: 0.22 }}
                  className="pointer-events-none absolute left-1/2 top-0 z-20 w-48 -translate-x-1/2 -translate-y-full rounded-2xl border border-white/40 bg-white/90 px-3 py-2 text-left shadow-lg backdrop-blur-md"
                >
                  <p className="text-xs font-semibold text-foreground">{c.nickname}</p>
                  {letter?.unlocked && letter.content ? (
                    <p className="mt-1 text-xs leading-relaxed text-foreground/85">{letter.content}</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      본문은 생일 당일, 케이크 주인만 열 수 있어요.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
