import type { Letter } from "@/types/api";
import { LETTER_CONTENT_UNLOCK_STEP, requiredCandlesForLetterIndex } from "@/lib/letterUnlock";
import { GlassCard } from "./Primitives";
import { Bookmark, Lock, MailOpen } from "lucide-react";
import { useState } from "react";

type Props = {
  letters: Letter[];
  candleCount: number;
  canReadLetters: boolean;
  lettersPending?: boolean;
  onSaveLetter?: (letterId: string) => void;
  saveLetterPending?: boolean;
};

export function LetterWall({
  letters,
  candleCount,
  canReadLetters,
  lettersPending = false,
  onSaveLetter,
  saveLetterPending = false,
}: Props) {
  const unlocked = letters.filter((letter) => letter.unlocked);
  const locked = letters.filter((letter) => !letter.unlocked);

  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">letter vault</p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:mt-2 sm:text-2xl">편지 보관함</h2>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm">
          {unlocked.length}/{letters.length} open
        </span>
      </div>

      {!canReadLetters ? (
        <div className="mt-3 rounded-[1.3rem] border border-dashed border-slate-300 bg-white/55 p-4 text-xs font-semibold leading-5 text-slate-500 sm:mt-5 sm:rounded-[1.5rem] sm:p-5 sm:text-sm sm:leading-6">
          편지 본문은 케이크 주인이 생일 당일에만 확인할 수 있어요. 지금은 촛불과 참여자만 공개됩니다.
        </div>
      ) : null}

      {lettersPending ? (
        <div className="mt-3 rounded-[1.3rem] bg-white/55 p-4 text-sm font-bold text-slate-500 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">편지를 불러오는 중...</div>
      ) : null}

      {canReadLetters && !lettersPending && letters.length === 0 ? (
        <div className="mt-3 rounded-[1.3rem] bg-white/55 p-4 text-sm font-bold text-slate-500 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">아직 도착한 편지가 없어요.</div>
      ) : null}

      {canReadLetters && unlocked.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:mt-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">unlocked</p>
          {unlocked.map((letter) => (
            <OpenLetterCard
              key={letter.letterId}
              letter={letter}
              onSaveLetter={onSaveLetter}
              saveLetterPending={saveLetterPending}
            />
          ))}
        </div>
      ) : null}

      {canReadLetters && locked.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:mt-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">locked teasers</p>
          {locked.map((letter) => {
            const index = letters.findIndex((candidate) => candidate.letterId === letter.letterId);
            return (
              <LockedLetterTeaser
                key={letter.letterId}
                nickname={letter.nickname}
                ordinal={index + 1}
                required={requiredCandlesForLetterIndex(index, LETTER_CONTENT_UNLOCK_STEP)}
                candleCount={candleCount}
              />
            );
          })}
        </div>
      ) : null}
    </GlassCard>
  );
}

function OpenLetterCard({
  letter,
  onSaveLetter,
  saveLetterPending,
}: {
  letter: Letter;
  onSaveLetter?: (letterId: string) => void;
  saveLetterPending: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const body = letter.content?.trim() || "(빈 편지)";
  return (
    <article className="rounded-[1.3rem] border border-white/80 bg-white/70 p-3 shadow-sm sm:rounded-[1.5rem] sm:p-4">
      <button type="button" className="flex w-full items-center justify-between gap-3 text-left" onClick={() => setExpanded((v) => !v)}>
        <span>
          <span className="flex items-center gap-2 text-sm font-black text-slate-950">
            <MailOpen className="h-4 w-4 text-indigo-500" />
            {letter.nickname}
          </span>
          <span className="mt-1 block text-xs font-semibold text-slate-500">열린 편지</span>
        </span>
        <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-black text-white">
          {expanded ? "접기" : "읽기"}
        </span>
      </button>
      {expanded ? (
        <div className="mt-4 space-y-3">
          <p className="whitespace-pre-wrap text-sm font-medium leading-6 text-slate-700 sm:leading-7">{body}</p>
          {letter.imageUrl ? <img src={letter.imageUrl} alt="" className="max-h-56 w-full rounded-2xl object-contain" /> : null}
          {onSaveLetter ? (
            <button
              type="button"
              disabled={saveLetterPending}
              onClick={() => onSaveLetter(letter.letterId)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 disabled:opacity-50"
            >
              <Bookmark className="h-4 w-4" />
              {saveLetterPending ? "저장 중" : "보관함 저장"}
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function LockedLetterTeaser({
  nickname,
  ordinal,
  required,
  candleCount,
}: {
  nickname: string;
  ordinal: number;
  required: number;
  candleCount: number;
}) {
  const remaining = Math.max(0, required - candleCount);
  const pct = Math.min(100, Math.round((candleCount / Math.max(required, 1)) * 100));
  return (
    <article className="overflow-hidden rounded-[1.3rem] border border-white/80 bg-white/60 p-3 shadow-sm sm:rounded-[1.5rem] sm:p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-slate-950">
            <Lock className="h-4 w-4 text-slate-400" />
            {nickname}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {ordinal}번째 편지 · 촛불 {required}개에 열림
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-500">
          {remaining > 0 ? `+${remaining}` : "soon"}
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200/70">
        <div className="h-full rounded-full bg-gradient-to-r from-slate-900 to-indigo-400" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 select-none rounded-2xl bg-slate-100/80 p-3 text-sm font-bold text-transparent blur-[3px] sm:mt-4">
        생일 축하해. 이 문장은 아직 촛불이 더 모이면 공개돼요.
      </div>
    </article>
  );
}
