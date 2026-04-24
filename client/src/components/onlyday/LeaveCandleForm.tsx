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
      <section className="mx-auto w-full max-w-md space-y-2 rounded-2xl border border-amber-200/40 bg-amber-50/30 px-4 py-3 text-center text-sm text-amber-900/80">
        <p className="font-medium">이 케이크의 주인은 촛불을 남길 수 없어요</p>
        <p className="text-xs text-amber-900/60">친구들만 마음을 올릴 수 있어요. 링크를 공유해 보세요.</p>
        <p className="text-[10px] text-amber-900/50">로그인한 상태이면 케이크 주인 계정으로 쓰기는 막혀 있어요.</p>
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
    <section className="mx-auto w-full max-w-md space-y-3 px-4 pb-2">
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">leave a candle</p>
        <h2 className="font-serif text-lg text-rose-400/90">촛불에 마음을 담아보세요</h2>
        <p className="text-[11px] text-muted-foreground">닉네임·편지는 생일 케이크에만 켜져요. 로그인 없이도 남길 수 있어요.</p>
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
              className={`shrink-0 snap-start rounded-full border-2 px-2.5 py-1.5 text-xs font-medium transition-all ${
                color === s.color
                  ? "border-rose-300 bg-white/80 shadow-md"
                  : "border-transparent bg-white/40"
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
        <label className="text-[11px] font-medium text-muted-foreground">닉네임</label>
        <input
          className="mt-0.5 w-full rounded-2xl border border-white/40 bg-white/60 px-3 py-2 text-sm shadow-inner outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-pink-200/80"
          placeholder="예) 오랜 친구"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={!canSubmit}
          maxLength={40}
        />
      </div>
      <div>
        <label className="text-[11px] font-medium text-muted-foreground">편지</label>
        <textarea
          className="mt-0.5 max-h-28 min-h-[80px] w-full resize-y rounded-2xl border border-white/40 bg-white/60 px-3 py-2 text-sm shadow-inner outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-pink-200/80"
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
        className="w-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:opacity-95 disabled:opacity-40"
      >
        {createLetter.isPending ? "보내는 중…" : "촛불 남기기"}
      </button>
    </section>
  );
}
