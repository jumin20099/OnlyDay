import { CANDLE_PRESET_SWATCHES } from "@/lib/onlydayTheme";
import { useCreateLetter } from "@/hooks/useCakeLetterApi";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  shareToken: string;
  disabled: boolean;
};

export function LeaveCandleForm({ shareToken, disabled }: Props) {
  const createLetter = useCreateLetter();
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<string>(CANDLE_PRESET_SWATCHES[0].color);
  const [style] = useState("classic");

  const submit = async () => {
    if (!nickname.trim() || !content.trim()) {
      toast.message("닉네임과 편지를 입력해 주세요.");
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
    <section className="mx-auto w-full max-w-md space-y-4 px-4 pb-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          leave a candle
        </p>
        <h2 className="font-serif text-xl text-rose-400/90">촛불에 마음을 담아보세요</h2>
        <p className="text-xs text-muted-foreground">당신의 촛불이 이 케이크의 일부가 됩니다.</p>
      </div>

      <div
        className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex w-max gap-2 snap-x snap-mandatory px-0.5">
          {CANDLE_PRESET_SWATCHES.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={disabled}
              onClick={() => setColor(s.color)}
              className={`snap-start rounded-full border-2 px-3 py-2 text-xs font-medium transition-all ${
                color === s.color
                  ? "border-rose-300 bg-white/80 shadow-md"
                  : "border-transparent bg-white/40"
              }`}
            >
              <span
                className="mr-1.5 inline-block h-3 w-3 rounded-full align-middle"
                style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}88` }}
              />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">닉네임</label>
        <input
          className="mt-1 w-full rounded-2xl border border-white/40 bg-white/60 px-4 py-3 text-sm shadow-inner outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-pink-200/80"
          placeholder="예) 너의 오랜 친구"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={disabled}
          maxLength={40}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">편지</label>
        <textarea
          className="mt-1 min-h-[120px] w-full resize-none rounded-2xl border border-white/40 bg-white/60 px-4 py-3 text-sm shadow-inner outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-pink-200/80"
          placeholder="생일을 맞은 친구에게 따뜻한 한 마디를 남겨주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={disabled}
          maxLength={200}
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {content.length}/200 · 편지는 생일 당일에 본인만 볼 수 있어요
        </p>
      </div>
      <button
        type="button"
        disabled={disabled || createLetter.isPending}
        onClick={submit}
        className="w-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:opacity-95 disabled:opacity-40"
      >
        {createLetter.isPending ? "보내는 중…" : "촛불 남기기"}
      </button>
    </section>
  );
}
