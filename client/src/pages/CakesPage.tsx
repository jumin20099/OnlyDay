import { logout, useAuthState } from "@/hooks/useAuth";
import { useCakes, useCreateCake, useDeleteCake } from "@/hooks/useCakeLetterApi";
import { parseBirthdayInputToIso, isValidCalendarDateYmd } from "@/lib/birthdayInput";
import { FLAVOR_THEME } from "@/lib/onlydayTheme";
import { useState } from "react";
import { useLocation } from "wouter";
import type { Cake } from "@/types/api";
import { Heart, LogOut, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

const FLAVORS: Cake["flavor"][] = [
  "STRAWBERRY",
  "VANILLA",
  "CHOCOLATE",
  "MATCHA",
  "MANGO",
];

export default function CakesPage() {
  const { isAuthenticated, user } = useAuthState();
  const [, navigate] = useLocation();
  const { data: cakes = [] } = useCakes({ enabled: isAuthenticated });
  const createCake = useCreateCake();
  const deleteCake = useDeleteCake();
  const [title, setTitle] = useState("내 생일 케이크");
  const [flavor, setFlavor] = useState<Cake["flavor"]>("STRAWBERRY");
  const [birthdayRaw, setBirthdayRaw] = useState("");

  const parsedBirthday = (() => {
    const iso = parseBirthdayInputToIso(birthdayRaw);
    if (!iso || !isValidCalendarDateYmd(iso)) return null;
    return iso;
  })();

  const create = async () => {
    if (!parsedBirthday) return;
    await createCake.mutateAsync({ title, flavor, birthday: parsedBirthday });
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
      toast.success("케이크를 삭제했어요.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "삭제에 실패했어요.");
    }
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_50%_at_50%_0%,oklch(0.94_0.02_285_/_0.18),transparent)]" />

      <header className="border-b border-border/60 bg-card/95 px-4 py-5 shadow-[0_1px_0_rgba(45,55,72,0.04)] backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">only · day</p>
            <h1 className="truncate font-serif text-lg font-semibold tracking-tight text-foreground">
              안녕, {user?.displayName ?? "친구"}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/saved-letters")}
              className="rounded-full border border-border/70 bg-card px-3 py-2 text-xs font-medium text-foreground shadow-sm transition hover:border-ring/40 hover:bg-secondary/50"
            >
              보관함
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="로그아웃"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-10 px-4 py-10">
        <div className="space-y-3 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-accent-pink" />
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">새 케이크 올리기</h2>
          <p className="text-[13px] font-medium leading-relaxed text-muted-foreground">맛·날짜를 고르면 공유 링크가 생겨요.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-muted-foreground">이름</label>
          <input
            className="w-full rounded-xl border-0 bg-muted/80 px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent transition focus:bg-card focus:ring-2 focus:ring-ring/35"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <p className="text-[13px] font-medium text-muted-foreground">맛 · 미리보기</p>
          <div
            className="mt-4 flex gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {FLAVORS.map((f) => {
              const th = FLAVOR_THEME[f];
              const on = flavor === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlavor(f)}
                  className={`shrink-0 snap-center rounded-2xl border-2 bg-card p-0 text-left text-sm transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out ${
                    on
                      ? "z-[1] scale-[1.03] border-primary shadow-[0_12px_32px_-10px_rgba(45,55,72,0.22)]"
                      : "border-transparent shadow-sm hover:-translate-y-1 hover:shadow-[0_10px_26px_-12px_rgba(45,55,72,0.14)]"
                  }`}
                >
                  <div
                    className="flex w-36 flex-col items-center justify-end overflow-hidden rounded-xl px-2 pb-2 pt-3"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${th.hero[0]} 0%, transparent 50%),
                        linear-gradient(160deg, ${th.hero[0]} 0%, ${th.hero[1]} 50%, ${th.hero[2]} 100%)`,
                    }}
                  >
                    <span className="text-4xl drop-shadow">{th.emoji}</span>
                    <div
                      className="mt-2 w-full rounded-full py-1.5 text-center text-xs font-medium text-white/95 shadow-inner"
                      style={{ backgroundColor: `${th.accent}cc` }}
                    >
                      {th.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-[13px] font-medium text-muted-foreground">생일 (월·일, KST) — 20070123</label>
          <input
            className="mt-2 w-full rounded-xl border-0 bg-muted/80 px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent transition focus:bg-card focus:ring-2 focus:ring-ring/35"
            type="text"
            inputMode="numeric"
            placeholder="예) 20070123 또는 2007-01-23"
            value={birthdayRaw}
            onChange={(e) => setBirthdayRaw(e.target.value)}
            autoComplete="bday"
          />
          {birthdayRaw && !parsedBirthday && (
            <p className="mt-2 text-[10px] font-medium text-muted-foreground">8자리 숫자(YYYYMMDD) 형식이면 자동으로 나눠서 저장돼요.</p>
          )}
        </div>

        <button
          type="button"
          onClick={create}
          disabled={!parsedBirthday || createCake.isPending}
          className="u-cta-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-40"
        >
          <Heart className="h-4 w-4" />
          {createCake.isPending ? "만드는 중…" : "케이크 만들기"}
        </button>

        <div>
          <h3 className="mb-4 font-serif text-base font-bold tracking-tight text-foreground">내 케이크</h3>
          {cakes.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">아직 케이크가 없어요. 하나 만들어 볼까요?</p>
          ) : (
            <ul className="space-y-4">
              {cakes.map((c) => (
                <li
                  key={c.cakeId}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-[0_4px_18px_-8px_rgba(45,55,72,0.08)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(45,55,72,0.12)]"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate font-medium text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.birthday} · {FLAVOR_THEME[c.flavor].label} · {c.candleCount}촛불
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/cake/${c.shareToken}`)}
                      className="rounded-full border border-primary/20 bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[0_3px_12px_-3px_rgba(45,55,72,0.35)] transition duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
                    >
                      열기
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(c.cakeId, c.title)}
                      disabled={deleteCake.isPending}
                      className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                      title="케이크 삭제"
                      aria-label="케이크 삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
