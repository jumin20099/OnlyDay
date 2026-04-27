import { BrandMark, ProductContainer, ProductShell, ProgressBar } from "@/components/product/Primitives";
import { useCakeByShareToken, useCandles } from "@/hooks/useCakeLetterApi";
import { FLAVOR_THEME } from "@/lib/onlydayTheme";
import { useRef, useState } from "react";
import { Link, useParams } from "wouter";
import html2canvas from "html2canvas";
import { ChevronLeft, Download, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import type { ReactNode } from "react";

export default function CakeShareResultPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { data: cake, isLoading } = useCakeByShareToken(shareToken);
  const { data: candles = [] } = useCandles(cake?.cakeId, { enabled: Boolean(cake?.cakeId) });
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const pageUrl =
    typeof window !== "undefined" && shareToken
      ? `${window.location.origin}/cake/${shareToken}`
      : "";

  const copyPageLink = async () => {
    if (!pageUrl) return;
    try {
      await navigator.clipboard.writeText(pageUrl);
      toast.success("케이크 링크를 복사했어요.");
    } catch {
      toast.error("복사에 실패했어요.");
    }
  };

  const sharePage = async () => {
    if (!pageUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: cake?.title ?? "Only Day",
          text: "케이크에 촛불을 달아줘",
          url: pageUrl,
        });
      } else {
        await copyPageLink();
      }
    } catch {
      /* cancelled */
    }
  };

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
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 text-sm font-bold text-slate-500">
        …
      </div>
    );
  }

  const t = FLAVOR_THEME[cake.flavor];
  const names = Array.from(new Set(candles.map((c) => c.nickname))).slice(0, 10);
  const goal = 30;
  const progressPct = Math.min(100, Math.round((cake.candleCount / goal) * 100));

  return (
    <ProductShell tone="night">
      <ProductContainer className="pb-10 pt-5">
        <header className="flex flex-wrap items-center justify-between gap-2 text-white/90">
          <Link href={`/cake/${shareToken}`}>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-xs font-black backdrop-blur">
              <ChevronLeft className="h-4 w-4" />
              케이크로
            </span>
          </Link>
          <BrandMark className="text-white/80" />
          <div className="flex flex-wrap items-center justify-end gap-1">
            <ActionButton onClick={copyPageLink} icon={<Link2 className="h-3.5 w-3.5" />} label="링크 복사" />
            <ActionButton onClick={sharePage} icon={<Share2 className="h-3.5 w-3.5" />} label="공유" />
            <ActionButton onClick={downloadPng} icon={<Download className="h-3.5 w-3.5" />} label={exporting ? "저장 중" : "이미지"} disabled={exporting} />
          </div>
        </header>

        <main className="grid gap-8 pt-10 lg:grid-cols-[420px_1fr] lg:items-center">
          <div className="mx-auto flex w-full max-w-sm justify-center">
            <div
              ref={cardRef}
              className="flex aspect-[9/16] w-full max-w-[360px] flex-col justify-between overflow-hidden rounded-[2rem] p-6 text-center text-slate-950 shadow-2xl"
              style={{
                background: `radial-gradient(circle at 50% 0%, #dbeafe 0%, transparent 45%),
                  radial-gradient(circle at 20% 85%, #fde68a 0%, transparent 38%),
                  linear-gradient(165deg, ${t.hero[0]} 0%, ${t.hero[2]} 100%)`,
              }}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">only · day</p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.06em]" style={{ color: t.accent }}>
                  {cake.title}
                </h1>
                <p className="mt-2 text-xs font-black text-slate-600">{progressPct}% 마음이 모였어요</p>
              </div>
              <div
                className="relative mx-auto grid aspect-square w-[78%] place-items-center rounded-full shadow-inner"
                style={{
                  background: `radial-gradient(circle at 50% 30%, #fff8 0%, ${t.hero[1]} 58%, ${t.accent}22 100%)`,
                }}
              >
                {cake.cakeImageUrl ? (
                  <img src={cake.cakeImageUrl} alt="" className="h-[88%] w-[88%] rounded-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <span className="text-8xl drop-shadow-lg">{t.emoji}</span>
                )}
              </div>
              <div>
                <p className="text-lg font-black tracking-[-0.04em]">{cake.candleCount}명이 마음을 전했어요</p>
                {names.length > 0 ? (
                  <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-600">
                    {names.join(" · ")}
                    {candles.length > 10 ? "..." : ""}
                  </p>
                ) : null}
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">#onlyday</p>
              </div>
            </div>
          </div>

          <section className="space-y-5 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">story-ready share asset</p>
            <h2 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.07em]">
              인스타 스토리에 올리고,
              <br />
              촛불을 더 모으세요.
            </h2>
            <p className="max-w-lg text-sm font-semibold leading-7 text-white/60">
              공유 이미지는 참여를 다시 케이크로 돌려보내는 성장 루프입니다. 링크 복사와 시스템 공유를 함께 제공해 놓았습니다.
            </p>
            <div className="max-w-md rounded-[2rem] bg-white/10 p-5 backdrop-blur">
              <ProgressBar value={cake.candleCount} max={goal} label="공유 성장도" />
            </div>
          </section>
        </main>
      </ProductContainer>
    </ProductShell>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-[10px] font-black text-white backdrop-blur disabled:opacity-50"
    >
      {icon}
      {label}
    </button>
  );
}
