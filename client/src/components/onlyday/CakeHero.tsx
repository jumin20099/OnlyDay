import type { Cake, Candle, Letter } from "@/types/api";
import { FLAVOR_THEME } from "@/lib/onlydayTheme";
import { OrganicCandles } from "./OrganicCandles";
import { Lock } from "lucide-react";

type Props = {
  cake: Cake;
  candles: Candle[];
  lettersByCandleId: Map<string, Letter>;
  lettersPending: boolean;
  isCakeOwner: boolean;
  isAuthenticated: boolean;
  isBirthdayKst: boolean;
  onSaveLetter?: (letterId: string) => void;
  saveLetterPending?: boolean;
  unlockBits: { sparkle: boolean; fancy: boolean; golden: boolean };
};

export function CakeHero({
  cake,
  candles,
  lettersByCandleId,
  lettersPending,
  isCakeOwner,
  isAuthenticated,
  isBirthdayKst,
  onSaveLetter,
  saveLetterPending,
  unlockBits,
}: Props) {
  const t = FLAVOR_THEME[cake.flavor];
  const visualTier = (unlockBits.fancy ? 1 : 0) + (unlockBits.golden ? 1 : 0);

  return (
    <section
      className="relative mx-auto flex w-full max-w-md flex-col items-center px-3 pb-1 pt-3"
      style={{
        minHeight: "min(52dvh, 420px)",
      }}
    >
      <p className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.35em] text-muted-foreground">FOR</p>
      <h1
        className="font-serif text-2xl font-semibold sm:text-3xl"
        style={{ color: t.accent }}
      >
        {cake.title}
      </h1>
      <p className="mt-1 text-center text-[11px] text-muted-foreground">오늘은, 오직 당신만의 하루예요.</p>

      <div
        className="relative z-0 mt-4 aspect-square w-full max-w-[min(100%,300px)] overflow-hidden rounded-full shadow-[0_8px_40px_-12px_rgba(244,114,182,0.45)]"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${t.hero[0]} 0%, transparent 45%),
            radial-gradient(circle at 70% 80%, ${t.hero[1]} 0%, transparent 50%),
            linear-gradient(160deg, ${t.hero[0]} 0%, ${t.hero[1]} 45%, ${t.hero[2]} 100%)`,
        }}
      >
        {unlockBits.sparkle && (
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-xs opacity-60"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 100}%`,
                  animation: `twinkle ${2.2 + (i % 3) * 0.4}s ease-in-out infinite`,
                  animationDelay: `${(i % 5) * 0.2}s`,
                }}
              >
                ✨
              </span>
            ))}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          {cake.cakeImageUrl ? (
            <img
              src={cake.cakeImageUrl}
              alt={cake.title}
              className="h-[78%] w-[78%] rounded-full object-cover shadow-inner ring-4 ring-white/30"
            />
          ) : (
            <div className="relative flex h-[72%] w-[72%] flex-col items-center justify-end rounded-full bg-gradient-to-b from-white/50 to-white/20 pb-[18%] text-7xl shadow-inner ring-4 ring-white/25 backdrop-blur-[2px] sm:text-8xl">
              <span className="drop-shadow-md">{t.emoji}</span>
              {unlockBits.golden && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-200/25 to-transparent" />
              )}
            </div>
          )}
        </div>

        {!unlockBits.golden && (
          <div className="pointer-events-none absolute bottom-[12%] right-[10%] flex items-center gap-1 rounded-full bg-white/30 px-2 py-0.5 text-[10px] text-foreground/60 backdrop-blur-sm">
            <Lock className="h-3 w-3" />
            <span>30촛불 시 골든 레이어</span>
          </div>
        )}

        <OrganicCandles
          candles={candles}
          lettersByCandleId={lettersByCandleId}
          lettersPending={lettersPending}
          isCakeOwner={isCakeOwner}
          isAuthenticated={isAuthenticated}
          isBirthdayKst={isBirthdayKst}
          onSaveLetter={onSaveLetter}
          saveLetterPending={saveLetterPending}
          visualTier={visualTier}
        />
      </div>
    </section>
  );
}
