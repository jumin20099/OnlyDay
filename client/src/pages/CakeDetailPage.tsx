import {
  useCakeByShareToken,
  useCandles,
  useCreateLetter,
  useDeleteLetter,
  useLetters,
  useSaveLetter,
  useUnlockStates,
} from "@/hooks/useCakeLetterApi";
import { useAuthState } from "@/hooks/useAuth";
import { UNLOCK_FEATURE_ORDER } from "@/lib/onlydayTheme";
import { CakeStage } from "@/components/product/CakeStage";
import { LetterComposer, type LetterComposerValue } from "@/components/product/LetterComposer";
import { LetterWall } from "@/components/product/LetterWall";
import { ShareLinkCard } from "@/components/product/ShareLinkCard";
import { AdSlot, BrandMark, GlassCard, MobileSheet, ProductContainer, ProductShell } from "@/components/product/Primitives";
import { PremiumRail } from "@/components/product/PremiumRail";
import { getWriteWindowState } from "@/components/product/WriteWindowNotice";
import { UnlockCelebrationModal } from "@/components/onlyday/UnlockCelebrationModal";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useParams } from "wouter";
import { ChevronLeft, ImageIcon, Lock, MailOpen, PenLine, Share2 } from "lucide-react";
import { toast } from "sonner";
import { isCakeBirthdayTodayKst } from "@/lib/birthdayToday";

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
  const createLetter = useCreateLetter();
  const saveLetter = useSaveLetter();
  const deleteLetter = useDeleteLetter();
  const [pendingDeleteLetterId, setPendingDeleteLetterId] = useState<string | null>(null);
  const [unlockPop, setUnlockPop] = useState<{ key: string } | null>(null);
  const [activeSheet, setActiveSheet] = useState<"share" | "letters" | "write" | null>(null);
  const prevUnlocked = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (unlockStates.length === 0) return;
    const now = new Set(unlockStates.filter((u) => u.unlocked).map((u) => u.featureKey));
    if (prevUnlocked.current === null) {
      prevUnlocked.current = now;
      return;
    }
    let first: string | null = null;
    for (const key of UNLOCK_FEATURE_ORDER) {
      if (now.has(key) && prevUnlocked.current !== null && !prevUnlocked.current.has(key)) {
        first = key;
        break;
      }
    }
    if (first !== null && isOwner) {
      setUnlockPop((cur) => (cur === null ? { key: first! } : cur));
    }
    prevUnlocked.current = now;
  }, [unlockStates, isOwner]);

  const closeUnlockCelebration = () => {
    setUnlockPop(null);
  };

  const writeWindowState = useMemo(() => (cake ? getWriteWindowState(cake.openAt, cake.closeAt) : "closed"), [cake]);
  const canSubmit = writeWindowState === "open";
  const nextUnlock = unlockStates.find((u) => !u.unlocked);
  const remainToNext = Math.max(0, (nextUnlock?.thresholdCount ?? cake?.candleCount ?? 0) - (cake?.candleCount ?? 0));

  const copyLink = async () => {
    const u = shareUrl(shareToken!);
    try {
      await navigator.clipboard.writeText(u);
      toast.success("링크를 복사했어요.");
    } catch {
      toast.error("복사하지 못했어요.");
    }
  };

  const shareLink = async () => {
    const u = shareUrl(shareToken!);
    try {
      if (navigator.share) {
        await navigator.share({ title: cake?.title ?? "단하루", text: "여기에 촛불 하나 남겨줘", url: u });
      } else {
        await copyLink();
      }
    } catch {
      /* user cancelled */
    }
  };

  const submitLetter = async (value: LetterComposerValue) => {
    if (!value.nickname.trim() || !value.content.trim()) {
      toast.message("닉네임과 편지를 채워주세요.");
      return;
    }
    if (!canSubmit) {
      toast.message("지금은 남길 수 없는 시간이에요.");
      return;
    }
    try {
      await createLetter.mutateAsync({
        cakeShareToken: shareToken!,
        nickname: value.nickname.trim(),
        content: value.content.trim(),
        candleColor: value.candleColor,
        candleStyle: value.candleStyle,
        positionX: 0.18 + Math.random() * 0.64,
        positionY: 0.18 + Math.random() * 0.64,
      });
      toast.success("촛불과 편지를 남겼어요.");
      setActiveSheet(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "남기지 못했어요.");
      throw e;
    }
  };

  if (isLoading || !cake) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 text-sm font-bold text-slate-500">
        케이크를 불러오는 중…
      </div>
    );
  }

  const url = shareUrl(shareToken!);
  const saveLetterAction =
    isOwner && isAuthenticated && isBirthdayKst
      ? (id: string) =>
          saveLetter.mutate(id, {
            onSuccess: () => toast.success("보관함에 담았어요."),
            onError: (e) => toast.error(e instanceof Error ? e.message : "보관함에 담지 못했어요."),
          })
      : undefined;
  const deleteLetterAction =
    isOwner && isAuthenticated && isBirthdayKst
      ? (id: string) => {
          setPendingDeleteLetterId(id);
          deleteLetter.mutate(id, {
            onSuccess: () => toast.success("편지와 촛불을 삭제했어요."),
            onError: (e) => toast.error(e instanceof Error ? e.message : "편지 삭제에 실패했어요."),
            onSettled: () => setPendingDeleteLetterId((prev) => (prev === id ? null : prev)),
          });
        }
      : undefined;

  return (
    <ProductShell>
      <ProductContainer className="pb-[5.75rem] pt-3 lg:pb-12 lg:pt-5">
        <header className="flex items-center justify-between gap-2">
          <Link href="/">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-2 text-xs font-black text-slate-700 shadow-sm backdrop-blur">
              <ChevronLeft className="h-4 w-4" />
              홈
            </span>
          </Link>
          <BrandMark className="scale-90" />
          <Link href={`/cake/${shareToken}/result`}>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-2 text-xs font-black text-slate-700 shadow-sm backdrop-blur">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">공유 </span>이미지
            </span>
          </Link>
        </header>

        <main className="pt-3 lg:hidden">
          <CakeStage
            cake={cake}
            candles={candles}
            unlockStates={unlockStates}
            forceUnlocked={isBirthdayKst}
            caption={
              letterQueryOn
                ? "편지는 아래에서 바로 확인해요."
                : "친구가 편지를 남길수록 케이크가 더 화려해져요."
            }
            compact
          />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MiniStat label="촛불" value={`${cake.candleCount}`} />
            <MiniStat label="참여자" value={`${candles.length}`} />
            <MiniStat label="다음 변화까지" value={!isBirthdayKst ? "잠김" : nextUnlock ? `+${remainToNext}` : "완료"} />
          </div>
        </main>

        <main className="hidden gap-6 pt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            <CakeStage
              cake={cake}
              candles={candles}
              unlockStates={unlockStates}
              forceUnlocked={isBirthdayKst}
              caption="공유할수록 편지가 쌓이고, 케이크가 계속 변해요."
            />

            <LetterWall
              letters={letters}
              candleCount={cake.candleCount}
              canReadLetters={letterQueryOn}
              lettersPending={letterQueryOn && lettersPending}
              onSaveLetter={saveLetterAction}
            onDeleteLetter={deleteLetterAction}
              saveLetterPending={saveLetter.isPending}
            deleteLetterPending={deleteLetter.isPending}
            pendingDeleteLetterId={pendingDeleteLetterId}
            />

            {!letterQueryOn ? <PublicLockedPreview names={candles.map((c) => c.nickname)} candleCount={cake.candleCount} /> : null}

            <LetterComposer
              windowState={writeWindowState}
              openAt={cake.openAt}
              closeAt={cake.closeAt}
              isOwner={isOwner}
              pending={createLetter.isPending}
              onSubmit={submitLetter}
            />
          </section>

          <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
            <ShareLinkCard url={url} candleCount={cake.candleCount} onCopy={copyLink} onShare={shareLink} />
            <PremiumRail />
            <AdSlot />
          </aside>
        </main>
      </ProductContainer>

      <div className="fixed inset-x-0 bottom-0 z-[120] border-t border-white/70 bg-white/82 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_45px_-30px_rgba(15,23,42,0.65)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <MobileDockButton icon={<Share2 className="h-4 w-4" />} label="공유" onClick={() => setActiveSheet("share")} />
          <MobileDockButton icon={<MailOpen className="h-4 w-4" />} label="편지" onClick={() => setActiveSheet("letters")} />
          <MobileDockButton
            icon={<PenLine className="h-4 w-4" />}
            label={isOwner ? "안내" : "편지 쓰기"}
            primary
            onClick={() => setActiveSheet("write")}
          />
        </div>
      </div>

      <MobileSheet open={activeSheet === "share"} title="공유하기" onClose={() => setActiveSheet(null)}>
        <ShareLinkCard url={url} candleCount={cake.candleCount} onCopy={copyLink} onShare={shareLink} />
      </MobileSheet>

      <MobileSheet open={activeSheet === "letters"} title="편지 보기" onClose={() => setActiveSheet(null)}>
        {letterQueryOn ? (
          <LetterWall
            letters={letters}
            candleCount={cake.candleCount}
            canReadLetters={letterQueryOn}
            lettersPending={letterQueryOn && lettersPending}
            onSaveLetter={saveLetterAction}
            onDeleteLetter={deleteLetterAction}
            saveLetterPending={saveLetter.isPending}
            deleteLetterPending={deleteLetter.isPending}
            pendingDeleteLetterId={pendingDeleteLetterId}
            quickRead
          />
        ) : (
          <PublicLockedPreview names={candles.map((c) => c.nickname)} candleCount={cake.candleCount} />
        )}
      </MobileSheet>

      <MobileSheet open={activeSheet === "write"} title={isOwner ? "안내" : "편지 쓰기"} onClose={() => setActiveSheet(null)}>
        {isOwner ? (
          <OwnerGuideCard
            candleCount={cake.candleCount}
            onOpenShare={() => setActiveSheet("share")}
            onOpenLetters={() => setActiveSheet("letters")}
          />
        ) : (
          <LetterComposer
            windowState={writeWindowState}
            openAt={cake.openAt}
            closeAt={cake.closeAt}
            isOwner={isOwner}
            pending={createLetter.isPending}
            onSubmit={submitLetter}
          />
        )}
      </MobileSheet>

      <UnlockCelebrationModal
        open={unlockPop !== null}
        featureKey={unlockPop?.key ?? null}
        onClose={closeUnlockCelebration}
      />
    </ProductShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 px-3 py-2 text-center shadow-sm backdrop-blur">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function MobileDockButton({
  icon,
  label,
  onClick,
  primary = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`u-btn px-3 py-3 text-xs shadow-sm ${
        primary ? "u-btn-primary text-white" : "u-btn-secondary text-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PublicLockedPreview({ names, candleCount }: { names: string[]; candleCount: number }) {
  const visibleNames = names.slice(0, 4);
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">공개 전 편지</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">편지 내용은 아직 비공개예요</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            지금까지 모인 촛불 {candleCount}개는 모두가 볼 수 있어요.
          </p>
        </div>
        <Lock className="h-5 w-5 text-slate-400" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(visibleNames.length > 0 ? visibleNames : ["아직 첫 번째 축하를 기다리는 중"]).map((name, index) => (
          <div key={`${name}-${index}`} className="rounded-[1.5rem] bg-white/65 p-4 shadow-sm">
            <p className="text-sm font-black text-slate-950">{name}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">공개 전 미리보기</p>
            <div className="mt-3 select-none rounded-2xl bg-slate-100/80 p-3 text-sm font-bold text-transparent blur-[3px]">
              생일 축하해. 이 문장은 생일 당일 주인공에게 공개돼요.
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function OwnerGuideCard({
  candleCount,
  onOpenShare,
  onOpenLetters,
}: {
  candleCount: number;
  onOpenShare: () => void;
  onOpenLetters: () => void;
}) {
  return (
    <GlassCard className="space-y-4 p-5 sm:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">for owner · 단하루</p>
      <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">촛불이 모일수록 케이크가 더 화려해져요.</h3>
      <div className="space-y-2 rounded-2xl bg-slate-50 px-4 py-3">
        <p className="text-sm font-bold text-slate-700">지금까지 촛불 {candleCount}개가 쌓였어요.</p>
        <p className="text-xs font-semibold leading-5 text-slate-500">
          링크를 공유해서 촛불을 모으고, 케이크를 화려하게 만들어봐요.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="u-btn u-btn-secondary px-3 py-3 text-xs" onClick={onOpenLetters}>
          받은 편지 보기
        </button>
        <button type="button" className="u-btn u-btn-primary px-3 py-3 text-xs" onClick={onOpenShare}>
          링크 공유하기
        </button>
      </div>
      <p className="text-xs font-semibold leading-5 text-slate-500">
        단하루, 잊지 못 할 생일을 만들어봐요.
      </p>
    </GlassCard>
  );
}
