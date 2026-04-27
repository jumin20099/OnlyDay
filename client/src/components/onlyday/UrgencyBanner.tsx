import { format, isAfter, isBefore, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

type Props = {
  openAt: string;
  closeAt: string;
};

export function UrgencyBanner({ openAt, closeAt }: Props) {
  const open = parseISO(openAt);
  const close = parseISO(closeAt);
  const now = new Date();
  const inWindow = isAfter(now, open) && isBefore(now, close);

  if (inWindow) {
    return (
      <p className="mx-auto max-w-md px-4 pb-2 text-center text-[10px] font-normal leading-relaxed text-muted-foreground">
        이 케이크는{" "}
        <time dateTime={closeAt} className="font-semibold text-foreground/90">
          {format(close, "M월 d일 H:mm", { locale: ko })}
        </time>{" "}
        전까지 촛불을 남길 수 있어요. 편지 본문은 생일 당일, 주인만 열 수 있어요.
      </p>
    );
  }
  if (isBefore(now, open)) {
    return (
      <p className="mx-auto max-w-md px-4 pb-2 text-center text-[10px] font-normal leading-relaxed text-muted-foreground">
        촛불 남기기는{" "}
        <time dateTime={openAt} className="font-semibold text-foreground/90">
          {format(open, "M월 d일 H:mm", { locale: ko })}
        </time>
        부터 열려요.
      </p>
    );
  }
  return (
    <p className="mx-auto max-w-md px-4 pb-2 text-center text-[10px] font-medium text-muted-foreground">
      지금은 이 케이크에 촛불을 남길 수 없는 기간이에요.
    </p>
  );
}
