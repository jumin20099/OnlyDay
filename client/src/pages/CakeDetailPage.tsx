import {
  useCakeByShareToken,
  useCandles,
  useLetters,
  useSaveLetter,
  useUnlockStates,
} from "@/hooks/useCakeLetterApi";
import { useAuthState } from "@/hooks/useAuth";
import { FLAVOR_THEME, UNLOCK_FEATURE_ORDER } from "@/lib/onlydayTheme";
import { addOwnerSeenUnlockKey, getOwnerSeenUnlockKeys } from "@/lib/ownerUnlockSeen";
import { CakeHero } from "@/components/onlyday/CakeHero";
import { LeaveCandleForm } from "@/components/onlyday/LeaveCandleForm";
import { ProgressUnlockStrip } from "@/components/onlyday/ProgressUnlockStrip";
import { UrgencyBanner } from "@/components/onlyday/UrgencyBanner";
import { UnlockCelebrationModal } from "@/components/onlyday/UnlockCelebrationModal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { isAfter, isBefore, parseISO } from "date-fns";
import { ChevronLeft, ImageIcon, Link2 } from "lucide-react";
import { toast } from "sonner";
import { isCakeBirthdayTodayKst } from "@/lib/birthdayToday";
import { LETTER_CONTENT_UNLOCK_STEP } from "@/lib/letterUnlock";
import { WriteWindowBadge } from "@/components/onlyday/WriteWindowBadge";

function shareUrl(shareToken: string) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/cake/${shareToken}`;
}

export default function CakeDetailPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { isAuthenticated, user } = useAuthState();
  const { data: cake, isLoading } = useCakeByShareToken(shareToken!);
  const { data: candles = [] } = useCandles(cake?.cakeId, { enabled: Boolean(cake?.cakeId) });
  const { data: unlockStates = [] } = useUnlockStates(cake?.cakeId, { enabled: Boolean(cake?.cakeId) });
  const isBirthdayKst = useMemo(
    () => Boolean(cake) && isCakeBirthdayTodayKst(cake!.birthday),
    [cake]
  );
  const isOwner = Boolean(cake && user && cake.ownerId === user.id);
  const letterQueryOn = Boolean(cake?.cakeId) && isAuthenticated && isOwner && isBirthdayKst;
  const {
    data: letters = [],
    isPending: lettersPending,
  } = useLetters(cake?.cakeId, { enabled: letterQueryOn });
  const saveLetter = useSaveLetter();
  const [unlockPop, setUnlockPop] = useState<{ key: string } | null>(null);
  const prevUnlocked = useRef<Set<string> | null>(null);

  const tryShowOwnerPendingUnlock = useCallback(() => {
    if (!isOwner || !cake?.cakeId || unlockStates.length === 0) return;
    setUnlockPop((current) => {
      if (current !== null) return current;
      const now = new Set(unlockStates.filter((u) => u.unlocked).map((u) => u.featureKey));
      const seen = getOwnerSeenUnlockKeys(cake.cakeId);
      const next = UNLOCK_FEATURE_ORDER.find((k) => now.has(k) && !seen.has(k));
      return next ? { key: next } : null;
    });
  }, [isOwner, cake?.cakeId, unlockStates]);

  const lettersByCandleId = useMemo(() => {
    const m = new Map<string, (typeof letters)[0]>();
    for (const l of letters) {
      m.set(l.candleId, l);
    }
    return m;
  }, [letters]);

  /** 백엔드 `order by createdAt asc, id asc` 와 동일한 배열 순서 */
  const letterIndexByCandleId = useMemo(() => {
    const m = new Map<string, number>();
    letters.forEach((l, i) => m.set(l.candleId, i));
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

  const unlockStateSignature = useMemo(
    () => unlockStates.map((u) => `${u.featureKey}:${u.unlocked ? 1 : 0}`).join(","),
    [unlockStates]
  );

  useEffect(() => {
    if (unlockStates.length === 0) return;
    const now = new Set(unlockStates.filter((u) => u.unlocked).map((u) => u.featureKey));
    if (prevUnlocked.current === null) {
      prevUnlocked.current = now;
      tryShowOwnerPendingUnlock();
      return;
    }
    let first: string | null = null;
    now.forEach((k) => {
      if (first === null && prevUnlocked.current !== null && !prevUnlocked.current.has(k)) {
        first = k;
      }
    });
    if (first !== null) {
      setUnlockPop((cur) => (cur === null ? { key: first! } : cur));
    }
    prevUnlocked.current = now;
  }, [unlockStates, tryShowOwnerPendingUnlock]);

  /**
   * 로그인 직후 주인으로 확정되거나, 해금 데이터가 늦게 도착한 경우에만
   * “이미 해금된 뒤 첫 방문” 축하를 보충 (쿼리 refetch마다 불필요 호출 최소화)
   */
  useEffect(() => {
    if (!isOwner || !cake?.cakeId) return;
    tryShowOwnerPendingUnlock();
  }, [isOwner, cake?.cakeId, unlockStateSignature, tryShowOwnerPendingUnlock]);

  const closeUnlockCelebration = () => {
    if (unlockPop?.key && isOwner && cake?.cakeId) {
      addOwnerSeenUnlockKey(cake.cakeId, unlockPop.key);
    }
    setUnlockPop(null);
    setTimeout(() => {
      tryShowOwnerPendingUnlock();
    }, 0);
  };

  const inWriteWindow = useMemo(() => {
    if (!cake) return false;
    const a = parseISO(cake.openAt);
    const b = parseISO(cake.closeAt);
    const n = new Date();
    return isAfter(n, a) && isBefore(n, b);
  }, [cake]);

  const copyLink = async () => {
    const u = shareUrl(shareToken!);
    try {
      await navigator.clipboard.writeText(u);
      toast.success("링크를 복사했어요.");
    } catch {
      toast.error("복사에 실패했어요.");
    }
  };

  const shareLink = async () => {
    const u = shareUrl(shareToken!);
    try {
      if (navigator.share) {
        await navigator.share({ title: cake?.title ?? "Only Day", text: "케이크에 촛불을 달아줘", url: u });
      } else {
        await copyLink();
      }
    } catch {
      /* user cancelled */
    }
  };

  if (isLoading || !cake) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4 text-sm text-muted-foreground">
        케이크를 불러오는 중…
      </div>
    );
  }

  const theme = FLAVOR_THEME[cake.flavor];

  return (
    <div
      className="flex min-h-dvh flex-col overflow-y-auto overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${theme.hero[0]} 0%, var(--background) 38%, ${theme.hero[2]} 100%)`,
      }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_85%_45%_at_50%_-8%,oklch(0.94_0.02_285_/_0.16),transparent)]" />

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/40 bg-card/70 px-3 py-2 backdrop-blur-md">
        <Link href="/">
          <span className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-xs font-medium text-muted-foreground transition hover:bg-muted/80 hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            홈
          </span>
        </Link>
        <span className="font-serif text-[10px] font-semibold tracking-[0.25em] text-foreground/80">ONLY · DAY</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition hover:bg-muted/90 hover:text-foreground"
            title="링크 복사"
          >
            <Link2 className="h-3.5 w-3.5" />
            복사
          </button>
          <button
            type="button"
            onClick={shareLink}
            className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition hover:bg-muted/90 hover:text-foreground"
            title="시스템 공유"
          >
            공유
          </button>
          <Link
            href={`/cake/${shareToken}/result`}
            className="inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-medium text-muted-foreground transition hover:bg-muted/90 hover:text-foreground"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            이미지
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-md flex-col items-center px-4">
        <WriteWindowBadge openAt={cake.openAt} closeAt={cake.closeAt} className="mb-1" />
        <UrgencyBanner openAt={cake.openAt} closeAt={cake.closeAt} />
      </div>

      <CakeHero
        cake={cake}
        candles={candles}
        lettersByCandleId={lettersByCandleId}
        letterIndexByCandleId={letterIndexByCandleId}
        lettersPending={letterQueryOn && lettersPending}
        isCakeOwner={isOwner}
        isAuthenticated={isAuthenticated}
        isBirthdayKst={isBirthdayKst}
        onSaveLetter={
          isOwner && isAuthenticated && isBirthdayKst
            ? (id) =>
                saveLetter.mutate(id, {
                  onSuccess: () => toast.success("보관함에 담았어요."),
                  onError: (e) =>
                    toast.error(e instanceof Error ? e.message : "보관함 저장에 실패했어요."),
                })
            : undefined
        }
        saveLetterPending={saveLetter.isPending}
        unlockBits={unlockBits}
        unlockStepCandles={LETTER_CONTENT_UNLOCK_STEP}
      />

      <div className="shrink-0">
        <ProgressUnlockStrip
          candleCount={cake.candleCount}
          unlockStates={unlockStates}
          letterUnlockStepCandles={LETTER_CONTENT_UNLOCK_STEP}
        />
      </div>

      <div className="mx-auto w-full max-w-md px-4 pb-2">
        <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">촛불을 모으고 싶다면</span>{" "}
          <button
            type="button"
            onClick={copyLink}
            className="rounded-md font-semibold text-primary underline decoration-primary/30 underline-offset-2 transition hover:decoration-primary/80"
          >
            케이크 링크를 복사
          </button>
          해서 친구들에게 보내 주세요.
        </p>
      </div>

      <LeaveCandleForm shareToken={shareToken!} canSubmit={inWriteWindow} isOwner={isOwner} />

      <UnlockCelebrationModal
        open={unlockPop !== null}
        featureKey={unlockPop?.key ?? null}
        onClose={closeUnlockCelebration}
      />
    </div>
  );
}
