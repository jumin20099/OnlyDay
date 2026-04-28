import { CreateCakePanel } from "@/components/product/CreateCakePanel";
import { AdSlot, BrandMark, GlassCard, MobileSheet, ProductContainer, ProductShell, ProgressBar } from "@/components/product/Primitives";
import { PremiumRail } from "@/components/product/PremiumRail";
import { logout, useAuthState } from "@/hooks/useAuth";
import { useCakes, useCreateCake, useDeleteCake } from "@/hooks/useCakeLetterApi";
import { parseBirthdayInputToIso, isValidCalendarDateYmd } from "@/lib/birthdayInput";
import { FLAVOR_THEME, completionGoalCandleCount } from "@/lib/onlydayTheme";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import type { Cake } from "@/types/api";
import { Copy, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CakesPage() {
  const { isAuthenticated, user } = useAuthState();
  const [, navigate] = useLocation();
  const { data: cakes = [] } = useCakes({ enabled: isAuthenticated });
  const createCake = useCreateCake();
  const deleteCake = useDeleteCake();
  const [title, setTitle] = useState("내 생일 케이크");
  const [flavor, setFlavor] = useState<Cake["flavor"]>("VANILLA");
  const [birthdayRaw, setBirthdayRaw] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?next=/cakes");
    }
  }, [isAuthenticated, navigate]);

  const parsedBirthday = (() => {
    const iso = parseBirthdayInputToIso(birthdayRaw);
    if (!iso || !isValidCalendarDateYmd(iso)) return null;
    return iso;
  })();

  const create = async () => {
    if (!parsedBirthday) return;
    try {
      const cake = await createCake.mutateAsync({ title: title.trim() || "내 생일 케이크", flavor, birthday: parsedBirthday });
      toast.success("케이크가 열렸어요.");
      setCreateOpen(false);
      navigate(`/cake/${cake.shareToken}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "케이크를 만들지 못했어요.");
    }
  };

  const remove = async (cakeId: string, titleLabel: string) => {
    if (
      !confirm(
        `「${titleLabel}」케이크를 삭제할까요?\n연결된 촛불·편지 데이터도 함께 지워지며 되돌릴 수 없어요.`,
      )
    ) {
      return;
    }
    try {
      await deleteCake.mutateAsync(cakeId);
      toast.success("케이크를 지웠어요.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "지우지 못했어요.");
    }
  };

  const copyShare = async (shareToken: string) => {
    const url = `${window.location.origin}/cake/${shareToken}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("링크를 복사했어요.");
    } catch {
      toast.error("링크를 복사하지 못했어요.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProductShell tone="mint">
      <ProductContainer className="pb-6 pt-3 sm:pb-14 sm:pt-5">
        <header className="flex items-center justify-between gap-3">
          <BrandMark />
          <div className="flex items-center gap-2">
            <Link href="/saved-letters">
              <span className="rounded-full bg-white/70 px-4 py-2 text-xs font-black text-slate-800 shadow-sm backdrop-blur">
                보관함
              </span>
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-full bg-white/70 p-2.5 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-950"
              title="로그아웃"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="grid gap-4 pt-5 sm:gap-6 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">내 케이크</p>
              <h1 className="max-w-3xl text-3xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
                반가워요, {user?.displayName ?? "친구"}.
                <br />
                올해 생일은 단하루와 함께해요.
              </h1>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-[0_18px_35px_-18px_rgba(15,23,42,0.8)] sm:hidden"
              >
                새 케이크 만들기
              </button>
            </div>

            <div className="hidden sm:block">
              <CreateCakePanel
                title={title}
                birthdayRaw={birthdayRaw}
                flavor={flavor}
                birthdayValid={Boolean(parsedBirthday)}
                pending={createCake.isPending}
                onTitleChange={setTitle}
                onBirthdayChange={setBirthdayRaw}
                onFlavorChange={setFlavor}
                onSubmit={create}
              />
            </div>

            <GlassCard className="p-4 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">케이크 목록</p>
                  <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:mt-2 sm:text-2xl">내 케이크 목록</h2>
                </div>
                <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">{cakes.length}</span>
              </div>

              {cakes.length === 0 ? (
                <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-300 bg-white/55 p-6 text-center text-sm font-bold text-slate-500">
                  아직 케이크가 없어요. 첫 케이크로 오늘을 시작해요.
                </div>
              ) : (
                <ul className="mt-5 grid gap-3">
                  {cakes.map((cake) => (
                    <CakeListItem
                      key={cake.cakeId}
                      cake={cake}
                      onOpen={() => navigate(`/cake/${cake.shareToken}`)}
                      onCopy={() => copyShare(cake.shareToken)}
                      onRemove={() => remove(cake.cakeId, cake.title)}
                      removePending={deleteCake.isPending}
                    />
                  ))}
                </ul>
              )}
            </GlassCard>
          </section>

          <aside className="hidden space-y-4 sm:block">
            <PremiumRail />
            <AdSlot />
          </aside>
        </main>
      </ProductContainer>

      <MobileSheet open={createOpen} title="새 케이크 만들기" onClose={() => setCreateOpen(false)}>
        <CreateCakePanel
          title={title}
          birthdayRaw={birthdayRaw}
          flavor={flavor}
          birthdayValid={Boolean(parsedBirthday)}
          pending={createCake.isPending}
          onTitleChange={setTitle}
          onBirthdayChange={setBirthdayRaw}
          onFlavorChange={setFlavor}
          onSubmit={create}
        />
      </MobileSheet>
    </ProductShell>
  );
}

function CakeListItem({
  cake,
  onOpen,
  onCopy,
  onRemove,
  removePending,
}: {
  cake: Cake;
  onOpen: () => void;
  onCopy: () => void;
  onRemove: () => void;
  removePending: boolean;
}) {
  const theme = FLAVOR_THEME[cake.flavor];
  const goal = completionGoalCandleCount([]);
  return (
    <li className="rounded-[1.3rem] border border-white/80 bg-white/65 p-3 shadow-sm sm:rounded-[1.5rem] sm:p-4">
      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className="truncate text-base font-black tracking-[-0.03em] text-slate-950 sm:text-lg">{cake.title}</p>
          <p className="mt-1 text-xs font-bold text-slate-500">
            {theme.label} · {cake.birthday} · {cake.candleCount}개의 촛불
          </p>
        </button>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl sm:h-14 sm:w-14 sm:text-3xl" style={{ backgroundColor: theme.hero[1] }}>
          {theme.emoji}
        </span>
      </div>
      <ProgressBar value={cake.candleCount} max={goal} label="촛불 개수" className="mt-3 sm:mt-4" />
      <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
        <button type="button" onClick={onOpen} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
          보러 가기
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700"
        >
          <Copy className="h-3.5 w-3.5" />
          링크 복사
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={removePending}
          className="ml-auto rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
          aria-label="케이크 삭제"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
