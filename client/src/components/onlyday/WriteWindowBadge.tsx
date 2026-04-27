import { isAfter, isBefore, parseISO } from "date-fns";
import { PenLine, Lock, Clock } from "lucide-react";

type Props = {
  openAt: string;
  closeAt: string;
  className?: string;
};

export function WriteWindowBadge({ openAt, closeAt, className = "" }: Props) {
  const open = parseISO(openAt);
  const close = parseISO(closeAt);
  const now = new Date();
  const inWindow = isAfter(now, open) && isBefore(now, close);

  if (inWindow) {
    return (
      <p
        className={`inline-flex w-full max-w-md items-center justify-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1.5 text-center text-[10px] font-medium text-emerald-900/90 shadow-sm ${className}`}
      >
        <PenLine className="h-3.5 w-3.5 shrink-0" />
        지금은 촛불·편지를 남길 수 있어요
      </p>
    );
  }
  if (isBefore(now, open)) {
    return (
      <p
        className={`inline-flex w-full max-w-md items-center justify-center gap-1.5 rounded-full border border-muted bg-muted/40 px-3 py-1.5 text-center text-[10px] font-medium text-muted-foreground ${className}`}
      >
        <Clock className="h-3.5 w-3.5 shrink-0" />
        촛불 남기기는 곧 열려요
      </p>
    );
  }
  return (
    <p
      className={`inline-flex w-full max-w-md items-center justify-center gap-1.5 rounded-full border border-amber-200/70 bg-amber-50/80 px-3 py-1.5 text-center text-[10px] font-medium text-amber-900/80 ${className}`}
    >
      <Lock className="h-3.5 w-3.5 shrink-0" />
      촛불 남기기 기간이 끝났어요
    </p>
  );
}
