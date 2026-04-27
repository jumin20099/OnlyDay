import { CANDLE_PRESET_SWATCHES } from "@/lib/onlydayTheme";
import { useCreateLetter } from "@/hooks/useCakeLetterApi";
import { useState } from "react";
import { toast } from "sonner";

const MAX = 2000;

type Props = {
  shareToken: string;
  canSubmit: boolean;
  isOwner: boolean;
};

export function LeaveCandleForm({ shareToken, canSubmit, isOwner }: Props) {
  const createLetter = useCreateLetter();
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<string>(CANDLE_PRESET_SWATCHES[0].color);
  const [style] = useState("classic");

  if (isOwner) {
    return (
      <section className="mx-auto w-full max-w-md space-y-2 rounded-2xl border border-border/60 bg-accent px-4 py-4 text-center text-sm text-foreground/90 shadow-[0_4px_18px_-8px_rgba(45,55,72,0.06)]">
        <p className="font-semibold tracking-tight">이 케이크의 주인은 촛불을 남길 수 없어요</p>
        <p className="text-xs font-normal leading-relaxed text-muted-foreground">친구들만 마음을 올릴 수 있어요. 링크를 공유해 보세요.</p>
        <p className="text-[10px] font-normal text-muted-foreground/90">로그인한 상태이면 케이크 주인 계정으로 쓰기는 막혀 있어요.</p>
      </section>
    );
  }

  const submit = async () => {
    if (!nickname.trim() || !content.trim()) {
      toast.message("닉네임과 편지를 입력해 주세요.");
      return;
    }
    if (!canSubmit) {
      toast.message("지금은 작성 시간이 아니에요.");
      return;
    }
    try {
      await createLetter.mutateAsync({
        cakeShareToken: shareToken,
        nickname: nickname.trim(),
        content: content.trim(),
        candleColor: color,
        candleStyle: style,
        positionX: 0.2 + Math.random() * 0.6,
        positionY: 0.2 + Math.random() * 0.6,
      });
      setNickname("");
      setContent("");
      toast.success("촛불이 올라갔어요.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "전송에 실패했어요.");
    }
  };

  return (
    <section className="mx-auto w-full max-w-md space-y-6 px-4 pb-8">
      <div className="space-y-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">leave a candle</p>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">촛불에 마음을 담아보세요</h2>
        <p className="text-[13px] font-medium leading-relaxed text-muted-foreground">닉네임·편지는 생일 케이크에만 켜져요. 로그인 없이도 남길 수 있어요.</p>
      </div>

      <div
        className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex w-max max-w-full gap-2">
          {CANDLE_PRESET_SWATCHES.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={!canSubmit}
              onClick={() => setColor(s.color)}
              className={`shrink-0 snap-start rounded-full border-2 px-2.5 py-1.5 text-xs font-medium transition-[transform,box-shadow,border-color] duration-200 ease-out ${
                color === s.color
                  ? "scale-[1.03] border-accent-pink bg-card shadow-[0_6px_18px_-6px_rgba(255,139,167,0.35)]"
                  : "border-transparent bg-muted/80 shadow-sm hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-8px_rgba(45,55,72,0.1)]"
              }`}
            >
              <span
                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle"
                style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}88` }}
              />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-muted-foreground">닉네임</label>
        <input
          className="mt-1 w-full rounded-xl border-0 bg-muted/80 px-3 py-2.5 text-sm text-foreground outline-none ring-1 ring-transparent transition placeholder:text-muted-foreground/60 focus:bg-card focus:ring-2 focus:ring-ring/35"
          placeholder="예) 오랜 친구"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={!canSubmit}
          maxLength={40}
        />
      </div>
      <div>
        <label className="text-[13px] font-medium text-muted-foreground">편지</label>
        <textarea
          className="mt-1 max-h-28 min-h-[80px] w-full resize-y rounded-xl border-0 bg-muted/80 px-3 py-2.5 text-sm text-foreground outline-none ring-1 ring-transparent transition placeholder:text-muted-foreground/60 focus:bg-card focus:ring-2 focus:ring-ring/35"
          placeholder="따뜻한 한 마디를 남겨주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!canSubmit}
          maxLength={MAX}
        />
        <p className="mt-0.5 text-right text-[10px] text-muted-foreground">
          {content.length}/{MAX} · 당일 주인만 열어볼 수 있어요
        </p>
      </div>
      <button
        type="button"
        disabled={!canSubmit || createLetter.isPending}
        onClick={submit}
        className="u-cta-primary w-full py-3 text-sm disabled:opacity-40"
      >
        {createLetter.isPending ? "보내는 중…" : "촛불 남기기"}
      </button>
    </section>
  );
}
