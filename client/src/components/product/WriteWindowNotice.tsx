import { format, isAfter, isBefore, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Clock, Lock, PenLine } from "lucide-react";

export type WriteWindowState = "open" | "before" | "closed";

export function getWriteWindowState(openAt: string, closeAt: string, now = new Date()): WriteWindowState {
  const open = parseISO(openAt);
  const close = parseISO(closeAt);
  if (isAfter(now, open) && isBefore(now, close)) return "open";
  if (isBefore(now, open)) return "before";
  return "closed";
}

type Props = {
  state: WriteWindowState;
  openAt: string;
  closeAt: string;
};

export function WriteWindowNotice({ state, openAt, closeAt }: Props) {
  const open = parseISO(openAt);
  const close = parseISO(closeAt);

  if (state === "open") {
    return (
      <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-950">
        <p className="flex items-center gap-2 text-sm font-black">
          <PenLine className="h-4 w-4" />
          지금 남길 수 있어요
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-emerald-800/80">
          {format(close, "M월 d일 H:mm", { locale: ko })}까지 촛불과 편지를 남길 수 있어요.
        </p>
      </div>
    );
  }

  if (state === "before") {
    return (
      <div className="rounded-[1.5rem] border border-indigo-200 bg-indigo-50/80 p-4 text-indigo-950">
        <p className="flex items-center gap-2 text-sm font-black">
          <Clock className="h-4 w-4" />
          아직 기다리는 시간
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-indigo-800/80">
          {format(open, "M월 d일 H:mm", { locale: ko })}부터 마음을 남길 수 있어요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-100/70 p-4 text-slate-700">
      <p className="flex items-center gap-2 text-sm font-black">
        <Lock className="h-4 w-4" />
        작성 시간이 끝났어요
      </p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
        지금은 남길 수 없지만, 케이크와 쌓인 마음은 계속 볼 수 있어요.
      </p>
    </div>
  );
}
