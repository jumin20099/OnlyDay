import type { Candle, Letter } from "@/types/api";
import { LETTER_CONTENT_UNLOCK_STEP, requiredCandlesForLetterIndex } from "@/lib/letterUnlock";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Bookmark } from "lucide-react";
import { LockedLetterCard } from "./LockedLetterCard";

type Props = {
  candles: Candle[];
  lettersByCandleId: Map<string, Letter>;
  /** `findAll` 순서와 같게: candleId → 0-based 인덱스 */
  letterIndexByCandleId: Map<string, number>;
  totalCandleCount: number;
  /** 백엔드 `unlock-step-candles` 와 맞출 것 */
  unlockStepCandles?: number;
  /** 주인+생일일 때 편지 API 로딩 중 */
  lettersPending: boolean;
  isCakeOwner: boolean;
  isAuthenticated: boolean;
  isBirthdayKst: boolean;
  onSaveLetter?: (letterId: string) => void;
  saveLetterPending?: boolean;
  /** 해금 시각 효과 강도 (0~2) */
  visualTier: number;
  className?: string;
};

export function OrganicCandles({
  candles,
  lettersByCandleId,
  letterIndexByCandleId,
  totalCandleCount,
  unlockStepCandles = LETTER_CONTENT_UNLOCK_STEP,
  lettersPending,
  isCakeOwner,
  isAuthenticated,
  isBirthdayKst,
  onSaveLetter,
  saveLetterPending = false,
  visualTier,
  className = "",
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sorted = useMemo(
    () => [...candles].sort((a, b) => a.candleId.localeCompare(b.candleId)),
    [candles]
  );
  const activeCandle = activeId ? sorted.find((c) => c.candleId === activeId) : null;
  const activeLetter = activeId ? lettersByCandleId.get(activeId) : undefined;

  const bodyHint = (() => {
    if (isCakeOwner && isAuthenticated && isBirthdayKst) {
      if (lettersPending) {
        return <p className="mt-3 text-sm text-muted-foreground">편지를 불러오는 중…</p>;
      }
      if (activeLetter?.unlocked) {
        return (
          <>
            {activeLetter.content != null && activeLetter.content.length > 0 ? (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {activeLetter.content}
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">(빈 편지)</p>
            )}
            {activeLetter.imageUrl ? (
              <img
                src={activeLetter.imageUrl}
                alt=""
                className="mt-3 max-h-48 w-full rounded-2xl object-contain"
              />
            ) : null}
          </>
        );
      }
      if (activeLetter && !activeLetter.unlocked) {
        const letterIdx = activeId != null ? letterIndexByCandleId.get(activeId) ?? 0 : 0;
        const need = requiredCandlesForLetterIndex(letterIdx, unlockStepCandles);
        return (
          <LockedLetterCard
            required={need}
            currentCandles={totalCandleCount}
            ordinal={letterIdx + 1}
          />
        );
      }
      return (
        <p className="mt-3 text-sm text-muted-foreground">
          이 촛불에 맞는 편지를 찾지 못했어요. 잠시 후 다시 열어 보세요.
        </p>
      );
    }
    if (isCakeOwner && !isAuthenticated) {
      return (
        <p className="mt-3 text-sm text-muted-foreground">
          본문을 읽으려면 케이크를 만든 계정으로 <strong>로그인</strong>한 뒤, <strong>생일 당일(KST)</strong>에 다시
          열어주세요.
        </p>
      );
    }
    if (isCakeOwner && isAuthenticated && !isBirthdayKst) {
      return (
        <p className="mt-3 text-sm text-muted-foreground">
          케이크 <strong>주인은 생일 당일(KST)</strong>에 여기서 편지 본문을 읽을 수 있어요. (오늘은 생일이
          아니에요.)
        </p>
      );
    }
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        닉네임·촛불만 함께 볼 수 있어요. <strong>편지 본문</strong>은 생일인 친구(이 케이크 주인)만 볼 수 있어요.
      </p>
    );
  })();

  return (
    <div className={`pointer-events-none absolute inset-0 z-30 ${className}`}>
      {sorted.map((c) => {
        const isOpen = activeId === c.candleId;
        const glow = 8 + visualTier * 6 + (isOpen ? 12 : 0);
        return (
          <div
            key={c.candleId}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${c.positionX * 100}%`,
              top: `${c.positionY * 100}%`,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveId(isOpen ? null : c.candleId)}
              className="pointer-events-auto relative flex flex-col items-center gap-0.5 outline-none"
              style={{ zIndex: isOpen ? 50 : 20 }}
              aria-label={`${c.nickname} 촛불, 편지 열기`}
            >
              <motion.div
                animate={{ scale: isOpen ? 1.12 : 1, filter: isOpen ? "brightness(1.12)" : "brightness(1)" }}
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
              <span className="max-w-[4.5rem] truncate text-[10px] font-medium text-foreground/80 drop-shadow-sm">
                {c.nickname}
              </span>
            </button>
          </div>
        );
      })}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activeCandle && (
              <motion.div
                className="fixed inset-0 z-[200] flex items-end justify-center bg-black/45 p-4 pb-8 sm:items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveId(null)}
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  className="max-h-[min(70dvh,480px)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/40 bg-white/95 p-5 shadow-2xl backdrop-blur-md"
                  initial={{ y: 28, opacity: 0, scale: 0.97 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-400/90">candle letter</p>
                  <h3 className="mt-1 font-serif text-xl text-foreground">{activeCandle.nickname}</h3>
                  {bodyHint}
                  {onSaveLetter && activeLetter?.unlocked && (
                      <button
                        type="button"
                        disabled={saveLetterPending}
                        onClick={() => onSaveLetter(activeLetter.letterId)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-pink-200/80 bg-pink-50/80 py-2.5 text-sm font-medium text-pink-900/90 transition hover:bg-pink-100/80 disabled:opacity-50"
                      >
                        <Bookmark className="h-4 w-4" />
                        {saveLetterPending ? "저장 중…" : "보관함에 저장"}
                      </button>
                    )}
                  <button
                    type="button"
                    className="mt-3 w-full rounded-2xl bg-rose-500/90 py-3 text-sm font-semibold text-white"
                    onClick={() => setActiveId(null)}
                  >
                    닫기
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
