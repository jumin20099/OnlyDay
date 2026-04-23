import {
  useCakeByShareToken,
  useCandles,
  useLetters,
  useSaveLetter,
  useUnlockStates,
} from "@/hooks/useCakeLetterApi";
import { useAuthState } from "@/hooks/useAuth";
import { FLAVOR_THEME } from "@/lib/onlydayTheme";
import { CakeHero } from "@/components/onlyday/CakeHero";
import { LeaveCandleForm } from "@/components/onlyday/LeaveCandleForm";
import { ProgressUnlockStrip } from "@/components/onlyday/ProgressUnlockStrip";
import { UrgencyBanner } from "@/components/onlyday/UrgencyBanner";
import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { isAfter, isBefore, parseISO } from "date-fns";
import { ChevronLeft, ImageIcon } from "lucide-react";

export default function CakeDetailPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { isAuthenticated } = useAuthState();
  const { data: cake, isLoading } = useCakeByShareToken(shareToken);
  const { data: candles = [] } = useCandles(cake?.cakeId, { enabled: Boolean(cake?.cakeId) });
  const { data: unlockStates = [] } = useUnlockStates(cake?.cakeId, { enabled: Boolean(cake?.cakeId) });
  const letterQueryOn = Boolean(cake?.cakeId) && isAuthenticated;
  const { data: letters = [] } = useLetters(cake?.cakeId, { enabled: letterQueryOn });
  const saveLetter = useSaveLetter();

  const lettersByCandleId = useMemo(() => {
    const m = new Map<string, (typeof letters)[0]>();
    for (const l of letters) {
      m.set(l.candleId, l);
    }
    return m;
  }, [letters]);

  const unlockBits = useMemo(() => {
    const s = (k: string) => unlockStates.find((u) => u.featureKey === k)?.unlocked ?? false;
    return {
      sparkle: s("TOPPING_SPARKLE"),
      fancy: s("FANCY_CANDLES"),
      golden: s("GOLDEN_LAYER"),
    };
  }, [unlockStates]);

  const inWriteWindow = useMemo(() => {
    if (!cake) return false;
    const a = parseISO(cake.openAt);
    const b = parseISO(cake.closeAt);
    const n = new Date();
    return isAfter(n, a) && isBefore(n, b);
  }, [cake]);

  if (isLoading || !cake) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-pink-50/90 via-background to-violet-50/40 text-sm text-muted-foreground">
        케이크를 불러오는 중…
      </div>
    );
  }

  const theme = FLAVOR_THEME[cake.flavor];

  return (
    <div
      className="relative min-h-dvh overflow-x-hidden pb-10"
      style={{
        background: `linear-gradient(180deg, ${theme.hero[0]} 0%, var(--background) 38%, ${theme.hero[2]} 100%)`,
      }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,192,203,0.45),transparent)]" />

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/20 bg-background/30 px-3 py-2 backdrop-blur-md">
        <Link href="/">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80">
            <ChevronLeft className="h-5 w-5" />
            홈
          </span>
        </Link>
        <span className="font-serif text-sm font-semibold tracking-widest text-foreground/90">
          ONLY · DAY
        </span>
        <Link
          href={`/cake/${shareToken}/result`}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
        >
          <ImageIcon className="h-4 w-4" />
          공유
        </Link>
      </header>

      <UrgencyBanner openAt={cake.openAt} closeAt={cake.closeAt} />

      <CakeHero
        cake={cake}
        candles={candles}
        lettersByCandleId={lettersByCandleId}
        unlockBits={unlockBits}
      />

      <ProgressUnlockStrip candleCount={cake.candleCount} unlockStates={unlockStates} />

      <LeaveCandleForm shareToken={shareToken!} disabled={!inWriteWindow} />

      {letterQueryOn && letters.length > 0 && (
        <section className="mx-auto max-w-md space-y-2 px-4 pt-2">
          <h3 className="font-serif text-sm font-semibold text-foreground/80">받은 편지 (주인 전용)</h3>
          <p className="text-[10px] text-muted-foreground">
            생일 당일·생일 케이크에만 본문이 열릴 수 있어요.
          </p>
          <ul className="space-y-2">
            {letters.map((letter) => (
              <li
                key={letter.letterId}
                className="rounded-2xl border border-white/30 bg-white/50 p-3 text-sm backdrop-blur-sm"
              >
                <p className="font-medium">{letter.nickname}</p>
                <p className="mt-1 text-foreground/85">
                  {letter.unlocked ? (letter.content ?? "…") : "아직 잠긴 편지예요."}
                </p>
                {letter.unlocked && (
                  <button
                    type="button"
                    className="mt-2 text-xs text-pink-600 underline"
                    onClick={() => saveLetter.mutate(letter.letterId)}
                  >
                    보관함에 저장
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!isAuthenticated && (
        <p className="mx-auto max-w-md px-4 pt-2 text-center text-[11px] text-muted-foreground">
          케이크 주인이 로그인하면 이 케이크에 붙은 편지를 정돈해 볼 수 있어요.
        </p>
      )}
    </div>
  );
}
