import { CANDLE_PRESET_SWATCHES } from "@/lib/onlydayTheme";
import { Send } from "lucide-react";
import { useState } from "react";
import { WriteWindowNotice, type WriteWindowState } from "./WriteWindowNotice";

const MAX = 2000;

export type LetterComposerValue = {
  nickname: string;
  content: string;
  candleColor: string;
  candleStyle: string;
};

type Props = {
  windowState: WriteWindowState;
  openAt: string;
  closeAt: string;
  isOwner: boolean;
  pending?: boolean;
  onSubmit: (value: LetterComposerValue) => Promise<void> | void;
};

export function LetterComposer({ windowState, openAt, closeAt, isOwner, pending = false, onSubmit }: Props) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [candleColor, setCandleColor] = useState<string>(CANDLE_PRESET_SWATCHES[0].color);
  const canSubmit = windowState === "open" && !isOwner;

  const submit = async () => {
    await onSubmit({
      nickname,
      content,
      candleColor,
      candleStyle: "classic",
    });
    setNickname("");
    setContent("");
  };

  return (
    <section className="rounded-[1.5rem] border border-white/70 bg-white/68 p-4 shadow-[0_18px_48px_-34px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">participate</p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:mt-2 sm:text-2xl">촛불과 편지 남기기</h2>
          <p className="mt-1 text-xs font-medium leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
            친구의 케이크에 한 줄을 남기면 촛불 progress가 바로 자라요.
          </p>
        </div>
      </div>

      {!isOwner ? (
        <div className="mt-3 sm:mt-5">
          <WriteWindowNotice state={windowState} openAt={openAt} closeAt={closeAt} />
        </div>
      ) : null}

      {isOwner ? (
        <p className="mt-3 rounded-2xl bg-slate-100/80 p-3 text-xs font-bold leading-5 text-slate-500">
          이 케이크의 주인은 촛불/편지를 작성할 수 없어요. 대신 도착한 편지를 확인하고 링크를 공유해 더 많은 참여를 모아보세요.
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4">
        <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {CANDLE_PRESET_SWATCHES.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={!canSubmit}
                onClick={() => setCandleColor(s.color)}
                className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                  candleColor === s.color ? "border-slate-950 bg-white text-slate-950" : "border-white/70 bg-white/50 text-slate-500"
                } disabled:opacity-45`}
              >
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle"
                  style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }}
                />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          닉네임
          <input
            className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 sm:py-3"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={!canSubmit}
            placeholder="예) 오래된 친구"
            maxLength={40}
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          편지
          <textarea
            className="min-h-24 resize-y rounded-2xl border border-slate-200 bg-white/85 px-4 py-2.5 text-sm font-medium leading-6 text-slate-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 sm:min-h-32 sm:py-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!canSubmit}
            placeholder="생일 당일에 열릴 메시지를 남겨주세요."
            maxLength={MAX}
          />
          <span className="text-right text-xs font-semibold text-slate-400">
            {content.length}/{MAX}
          </span>
        </label>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-[0_18px_35px_-18px_rgba(15,23,42,0.8)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:opacity-45"
        >
          <Send className="h-4 w-4" />
          {pending ? "전송 중" : "촛불 남기기"}
        </button>
      </div>
    </section>
  );
}
