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
    <div className="relative min-h-dvh overflow-x-hidden bg-gradient-to-b from-pink-50/90 via-background to-violet-50/50">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(253,186,200,0.5),transparent)]" />

      <header className="border-b border-white/30 bg-background/25 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">only · day</p>
            <h1 className="font-serif text-lg font-semibold">안녕, {user?.displayName ?? "친구"}</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate("/saved-letters")}
              className="rounded-full border border-white/50 bg-white/50 px-3 py-1.5 text-xs font-medium text-foreground/90"
            >
              보관함
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-full p-2 text-muted-foreground"
              title="로그아웃"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-8 px-4 py-6">
        <div className="text-center">
          <Sparkles className="mx-auto h-5 w-5 text-pink-300" />
          <h2 className="mt-2 font-serif text-xl text-rose-400/90">새 케이크 올리기</h2>
          <p className="text-xs text-muted-foreground">맛·날짜를 고르면 공유 링크가 생겨요. 좌우로 훑어 맛을 골라 보세요.</p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground">이름</label>
          <input
            className="w-full rounded-2xl border border-white/40 bg-white/60 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-pink-200/80"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">맛 (가로로 스와이프) · 미리보기</p>
          <div
            className="mt-2 flex gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  className={`shrink-0 snap-center rounded-2xl border-2 p-0 text-left text-sm transition ${
                    on
                      ? "border-pink-300 bg-white/90 shadow-md"
                      : "border-transparent bg-white/40"
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
          <label className="text-xs font-medium text-muted-foreground">생일 (월·일, KST) — 20070123</label>
          <input
            className="mt-2 w-full rounded-2xl border border-white/40 bg-white/60 px-4 py-3 text-sm shadow-inner"
            type="text"
            inputMode="numeric"
            placeholder="예) 20070123 또는 2007-01-23"
            value={birthdayRaw}
            onChange={(e) => setBirthdayRaw(e.target.value)}
            autoComplete="bday"
          />
          {birthdayRaw && !parsedBirthday && (
            <p className="mt-1 text-[10px] text-amber-700/90">8자리 숫자(YYYYMMDD) 형식이면 자동으로 나눠서 저장돼요.</p>
          )}
        </div>

        <button
          type="button"
          onClick={create}
          disabled={!parsedBirthday || createCake.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-300/30 disabled:opacity-40"
        >
          <Heart className="h-4 w-4" />
          {createCake.isPending ? "만드는 중…" : "케이크 만들기"}
        </button>

        <div>
          <h3 className="mb-2 font-serif text-sm font-semibold text-foreground/80">내 케이크</h3>
          {cakes.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">아직 케이크가 없어요. 하나 만들어 볼까요?</p>
          ) : (
            <ul className="space-y-2">
              {cakes.map((c) => (
                <li
                  key={c.cakeId}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-white/40 bg-white/50 p-3 backdrop-blur-sm"
                >
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.birthday} · {FLAVOR_THEME[c.flavor].label} · {c.candleCount}촛불
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/cake/${c.shareToken}`)}
                      className="rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-medium"
                    >
                      열기
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(c.cakeId, c.title)}
                      disabled={deleteCake.isPending}
                      className="rounded-full p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"
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
