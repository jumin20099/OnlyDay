import type { Letter } from "@/types/api";
import { LETTER_CONTENT_UNLOCK_STEP, requiredCandlesForLetterIndex } from "@/lib/letterUnlock";
import { GlassCard } from "./Primitives";
import { Bookmark, Lock, MailOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  letters: Letter[];
  candleCount: number;
  canReadLetters: boolean;
  lettersPending?: boolean;
  onSaveLetter?: (letterId: string) => void;
  onDeleteLetter?: (letterId: string) => void;
  saveLetterPending?: boolean;
  deleteLetterPending?: boolean;
  pendingDeleteLetterId?: string | null;
  quickRead?: boolean;
};

export function LetterWall({
  letters,
  candleCount,
  canReadLetters,
  lettersPending = false,
  onSaveLetter,
  onDeleteLetter,
  saveLetterPending = false,
  deleteLetterPending = false,
  pendingDeleteLetterId = null,
  quickRead = false,
}: Props) {
  const unlocked = letters.filter((letter) => letter.unlocked);
  const locked = letters.filter((letter) => !letter.unlocked);

  return (
    <GlassCard className={quickRead ? "p-3" : "p-4 sm:p-6"}>
      {!canReadLetters ? (
        <div className="mt-3 rounded-[1.3rem] border border-dashed border-slate-300 bg-white/55 p-4 text-xs font-semibold leading-5 text-slate-500 sm:mt-5 sm:rounded-[1.5rem] sm:p-5 sm:text-sm sm:leading-6">
          편지 내용은 생일 당일에 공개돼요.
        </div>
      ) : null}

      {lettersPending ? (
        <div className="mt-3 rounded-[1.3rem] bg-white/55 p-4 text-sm font-bold text-slate-500 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">편지를 모아오는 중…</div>
      ) : null}

      {canReadLetters && !lettersPending && letters.length === 0 ? (
        <div className="mt-3 rounded-[1.3rem] bg-white/55 p-4 text-sm font-bold text-slate-500 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">아직 도착한 축하가 없어요.</div>
      ) : null}

      {canReadLetters && unlocked.length > 0 ? (
        <div className={`grid gap-3 ${quickRead ? "mt-3" : "mt-4 sm:mt-6"}`}>
          {unlocked.map((letter) => (
            <OpenLetterCard
              key={letter.letterId}
              letter={letter}
              onSaveLetter={onSaveLetter}
              onDeleteLetter={onDeleteLetter}
              saveLetterPending={saveLetterPending}
              deleteLetterPending={deleteLetterPending}
              pendingDeleteLetterId={pendingDeleteLetterId}
              quickRead={quickRead}
            />
          ))}
        </div>
      ) : null}

      {canReadLetters && locked.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:mt-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">공개 전 미리보기</p>
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
  onDeleteLetter,
  saveLetterPending,
  deleteLetterPending,
  pendingDeleteLetterId,
  quickRead,
}: {
  letter: Letter;
  onSaveLetter?: (letterId: string) => void;
  onDeleteLetter?: (letterId: string) => void;
  saveLetterPending: boolean;
  deleteLetterPending: boolean;
  pendingDeleteLetterId: string | null;
  quickRead: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [bodyExpanded, setBodyExpanded] = useState(false);
  const [canExpandBody, setCanExpandBody] = useState(false);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const body = letter.content?.trim() || "(내용 없음)";
  const opened = quickRead || expanded;

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || !opened) {
      setCanExpandBody(false);
      return;
    }
    setCanExpandBody(el.scrollHeight > el.clientHeight + 1);
  }, [body, opened, bodyExpanded, quickRead]);
  return (
    <article className={`rounded-[1.3rem] border border-white/80 bg-white/70 shadow-sm ${quickRead ? "p-3" : "p-3 sm:rounded-[1.5rem] sm:p-4"}`}>
      {quickRead ? (
        <div className="flex items-center gap-2 text-sm font-black text-slate-950">
          <MailOpen className="h-4 w-4 text-indigo-500" />
          {letter.nickname}
        </div>
      ) : (
        <button type="button" className="flex w-full items-center justify-between gap-3 text-left" onClick={() => setExpanded((v) => !v)}>
          <span className="flex items-center gap-2 text-sm font-black text-slate-950">
            <MailOpen className="h-4 w-4 text-indigo-500" />
            {letter.nickname}님에게서 온 편지
          </span>
          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-black text-white">
            {expanded ? "접기" : "읽기"}
          </span>
        </button>
      )}
      {opened ? (
        <div className="mt-4 space-y-3">
          <p
            ref={bodyRef}
            className={`whitespace-pre-wrap text-sm font-medium leading-6 text-slate-700 sm:leading-7 ${bodyExpanded ? "" : "line-clamp-3"}`}
          >
            {body}
          </p>
          {canExpandBody || bodyExpanded ? (
            <button
              type="button"
              onClick={() => setBodyExpanded((v) => !v)}
              className="text-xs font-black text-slate-500 underline underline-offset-2"
            >
              {bodyExpanded ? "접기" : "더보기"}
            </button>
          ) : null}
          {letter.imageUrl ? <img src={letter.imageUrl} alt="" className="max-h-56 w-full rounded-2xl object-contain" /> : null}
          {onSaveLetter || onDeleteLetter ? (
            <div className="flex flex-wrap items-center gap-2">
              {onSaveLetter ? (
                <button
                  type="button"
                  disabled={saveLetterPending}
                  onClick={() => onSaveLetter(letter.letterId)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-black text-slate-700 disabled:opacity-50"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  {saveLetterPending ? "담는 중…" : "보관함"}
                </button>
              ) : null}
              {onDeleteLetter ? (
                <button
                  type="button"
                  disabled={deleteLetterPending && pendingDeleteLetterId === letter.letterId}
                  onClick={() => onDeleteLetter(letter.letterId)}
                  className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-black text-rose-600 disabled:opacity-50"
                >
                  {deleteLetterPending && pendingDeleteLetterId === letter.letterId ? "삭제 중…" : "삭제"}
                </button>
              ) : null}
            </div>
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
            {ordinal}번째 편지 · 촛불 {required}개부터 공개
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-500">
          {remaining > 0 ? `+${remaining}` : "공개 임박"}
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200/70">
        <div className="h-full rounded-full bg-[#a5b4fc]" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 select-none rounded-2xl bg-slate-100/80 p-3 text-sm font-bold text-transparent blur-[3px] sm:mt-4">
        촛불이 더 모이면 이 문장이 보여요.
      </div>
    </article>
  );
}
