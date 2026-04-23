import { useCakeByShareToken, useCandles } from "@/hooks/useCakeLetterApi";
import { FLAVOR_THEME } from "@/lib/onlydayTheme";
import { useRef, useState } from "react";
import { Link, useParams } from "wouter";
import html2canvas from "html2canvas";
import { ChevronLeft, Download } from "lucide-react";

export default function CakeShareResultPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { data: cake, isLoading } = useCakeByShareToken(shareToken);
  const { data: candles = [] } = useCandles(cake?.cakeId, { enabled: Boolean(cake?.cakeId) });
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const downloadPng = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "onlyday-cake.png";
      a.click();
    } finally {
      setExporting(false);
    }
  };

  if (isLoading || !cake) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-pink-50 to-violet-50/50 text-sm">
        …
      </div>
    );
  }

  const t = FLAVOR_THEME[cake.flavor];
  const names = Array.from(new Set(candles.map((c) => c.nickname))).slice(0, 10);
  const goal = 30;
  const progressPct = Math.min(100, Math.round((cake.candleCount / goal) * 100));

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#1a0a12] via-[#2d1520] to-[#1a0a12] px-4 py-6 text-foreground">
      <header className="mb-4 flex items-center justify-between text-white/90">
        <Link href={`/cake/${shareToken}`}>
          <span className="inline-flex items-center gap-1 text-sm">
            <ChevronLeft className="h-5 w-5" />
            케이크로
          </span>
        </Link>
        <button
          type="button"
          onClick={downloadPng}
          disabled={exporting}
          className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white"
        >
          <Download className="h-4 w-4" />
          {exporting ? "처리 중…" : "이미지 저장"}
        </button>
      </header>

      <p className="mb-3 text-center text-xs text-pink-200/80">1:1 인스타·스토리용</p>

      <div className="mx-auto flex w-full max-w-sm justify-center">
        <div
          ref={cardRef}
          className="flex aspect-square w-full max-w-[360px] flex-col items-center justify-between overflow-hidden rounded-[2rem] p-6 text-center shadow-2xl"
          style={{
            background: `radial-gradient(circle at 50% 0%, #ffd6e7 0%, transparent 50%),
              linear-gradient(165deg, ${t.hero[0]} 0%, ${t.hero[2]} 100%)`,
          }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/50">only · day</p>
            <h1 className="mt-1 font-serif text-2xl font-bold" style={{ color: t.accent }}>
              {cake.title}
            </h1>
            <p className="mt-1 text-xs text-foreground/65">{progressPct}% — 마음이 모였어요</p>
          </div>
          <div
            className="relative my-2 flex h-[45%] w-[72%] items-end justify-center rounded-full shadow-inner"
            style={{
              background: `radial-gradient(circle at 50% 30%, #fff6 0%, ${t.hero[1]} 60%, ${t.accent}22 100%)`,
            }}
          >
            {cake.cakeImageUrl ? (
              <img
                src={cake.cakeImageUrl}
                alt=""
                className="h-[90%] w-[90%] rounded-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <span className="mb-[8%] text-7xl drop-shadow-lg">{t.emoji}</span>
            )}
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle,transparent_40%,#fff_120%)]" />
          </div>
          <div>
            <p className="font-serif text-sm font-semibold text-foreground/90">
              {cake.candleCount}명이 마음을 전했어요
            </p>
            {names.length > 0 && (
              <p className="mt-1 line-clamp-2 text-[11px] text-foreground/70">
                {names.join(" · ")}
                {candles.length > 10 ? "…" : ""}
              </p>
            )}
            <p className="mt-3 text-xs text-foreground/60">
              Made with love by {cake.candleCount} {cake.candleCount === 1 ? "person" : "people"}
            </p>
            <p className="mt-0.5 text-[10px] text-foreground/45">#onlyday</p>
          </div>
        </div>
      </div>
    </div>
  );
}
