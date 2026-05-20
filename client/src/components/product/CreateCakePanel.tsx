import type { Cake } from "@/types/api";
import { FLAVOR_THEME } from "@/lib/onlydayTheme";
import { GlassCard, PrimaryCTA } from "./Primitives";
import { CreateCakeSplendorPreview } from "@/components/product/CreateCakeSplendorPreview";
import { CalendarDays, Sparkles } from "lucide-react";

export const PRODUCT_FLAVORS: Cake["flavor"][] = [
  "VANILLA",
  "MATCHA",
  "CHOCOLATE",
  "MANGO",
  "STRAWBERRY",
  "CHEESE",
  "LEMON",
  "GREEN_GRAPE",
  "RED_GRAPE",
  "BLUEBERRY",
];

type Props = {
  title: string;
  birthdayRaw: string;
  flavor: Cake["flavor"];
  birthdayValid: boolean;
  pending?: boolean;
  onTitleChange: (value: string) => void;
  onBirthdayChange: (value: string) => void;
  onFlavorChange: (value: Cake["flavor"]) => void;
  onSubmit: () => void;
};

export function CreateCakePanel({
  title,
  birthdayRaw,
  flavor,
  birthdayValid,
  pending = false,
  onTitleChange,
  onBirthdayChange,
  onFlavorChange,
  onSubmit,
}: Props) {
  const selectedTheme = FLAVOR_THEME[flavor];

  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">첫 시작</p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:mt-2 sm:text-2xl">당신의 특별한 단하루를 위해</h2>
          <p className="mt-1 text-xs font-medium leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
            이름과 날짜만 적으면, 바로 초대 링크가 생겨요.
          </p>
        </div>
        <span className="rounded-full bg-primary p-2.5 text-white shadow-lg sm:p-3">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
      </div>

      <div
        className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/70 p-3 shadow-inner sm:mt-5 sm:rounded-[1.6rem]"
        style={{
          background: `radial-gradient(circle at 24% 8%, ${selectedTheme.hero[0]} 0%, transparent 42%),
            radial-gradient(circle at 82% 4%, #dbeafe 0%, transparent 34%),
            linear-gradient(155deg, ${selectedTheme.hero[0]} 0%, ${selectedTheme.hero[1]} 54%, ${selectedTheme.hero[2]} 100%)`,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500/80">Flavor</p>
            <p className="mt-0.5 truncate text-sm font-black text-slate-950">{selectedTheme.label}맛 케이크</p>
          </div>
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-black text-slate-600 shadow-sm">
            미리보기
          </span>
        </div>
        <CreateCakeSplendorPreview title={title.trim() || "내 생일 케이크"} flavor={flavor} />
      </div>

      <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-4">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          케이크 이름
          <input
            className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 sm:py-3"
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="예) 단하루의 n번째 생일"
            maxLength={100}
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          생일 날짜
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/85 px-10 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 sm:py-3"
              value={birthdayRaw}
              onChange={(e) => onBirthdayChange(e.target.value)}
              placeholder="예) 20070123"
              inputMode="numeric"
              autoComplete="bday"
            />
          </div>
          {birthdayRaw && !birthdayValid ? (
            <span className="text-xs font-semibold text-amber-700">날짜 형식만 맞춰서 입력해 주세요.</span>
          ) : null}
        </label>

        <div>
          <p className="text-sm font-bold text-slate-700">맛</p>
          <p className="mt-1 text-[11px] font-medium leading-4 text-slate-400">맛에 따라 케이크의 기본 색감이 정해져요.</p>
          <div className="mt-2 grid grid-cols-5 gap-1.5 sm:mt-3 sm:gap-2">
            {PRODUCT_FLAVORS.map((f) => {
              const t = FLAVOR_THEME[f];
              const selected = flavor === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => onFlavorChange(f)}
                  className={`rounded-2xl border p-1.5 text-center transition sm:p-2 ${
                    selected
                      ? "border-slate-950 bg-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.7)]"
                      : "border-white/70 bg-white/45 hover:-translate-y-0.5 hover:bg-white/80"
                  }`}
                  aria-pressed={selected}
                >
                  <span className="block text-xl sm:text-2xl">{t.emoji}</span>
                  <span className="mt-1 block truncate text-[10px] font-black text-slate-600">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <PrimaryCTA onClick={onSubmit} disabled={!birthdayValid || pending} className="w-full">
          {pending ? "케이크 굽는 중…" : "내 케이크 시작하기"}
        </PrimaryCTA>
      </div>
    </GlassCard>
  );
}
