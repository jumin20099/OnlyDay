import { LETTER_CONTENT_UNLOCK_STEP, requiredCandlesForLetterIndex } from "@/lib/letterUnlock";
import { MailOpen } from "lucide-react";

type Props = {
  ordinal: number;
  currentCandles: number;
  isBirthdayToday: boolean;
};

export function MyLetterStatusCard({ ordinal, currentCandles, isBirthdayToday }: Props) {
  const required = requiredCandlesForLetterIndex(ordinal - 1, LETTER_CONTENT_UNLOCK_STEP);
  const remaining = Math.max(0, required - currentCandles);
  const pct = Math.min(100, Math.round((currentCandles / Math.max(required, 1)) * 100));

  return (
    <article className="rounded-[1.5rem] border border-violet-200/80 bg-gradient-to-b from-violet-50/95 to-rose-50/55 p-4 shadow-sm sm:rounded-[2rem] sm:p-5">
      <div className="flex items-center gap-2 text-violet-900">
        <MailOpen className="h-4 w-4" />
        <p className="text-sm font-black">내가 남긴 편지</p>
      </div>
      <p className="mt-2 text-xs leading-5 font-semibold text-violet-900/85">
        {ordinal}번째로 마음을 남겼어요.{" "}
        {isBirthdayToday
          ? "오늘 주인공에게 공개됐어요."
          : "생일 당일 0시에 모두에게 공개돼요."}
      </p>
      {!isBirthdayToday ? (
        <>
          <p className="mt-1 text-xs leading-5 text-violet-900/65">
            지금 촛불 {currentCandles}개 · 필요 {required}개
            {remaining > 0 ? ` · 남은 ${remaining}개` : " · 도달했어요"}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-300 via-rose-300 to-rose-400 transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      ) : null}
      <p className="mt-3 text-[11px] leading-4 text-violet-900/55">
        보관함에 담기지 않은 편지는 생일 +14일에 사라져요.
      </p>
    </article>
  );
}
