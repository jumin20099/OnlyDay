import type { Cake } from "@/types/api";
import { FLAVOR_THEME } from "@/lib/onlydayTheme";
import { GlassCard, PrimaryCTA } from "./Primitives";
import { CalendarDays, Sparkles } from "lucide-react";

export const PRODUCT_FLAVORS: Cake["flavor"][] = ["VANILLA", "MATCHA", "CHOCOLATE", "MANGO", "STRAWBERRY"];

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
  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">create cake</p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:mt-2 sm:text-2xl">생일 케이크 만들기</h2>
          <p className="mt-1 text-xs font-medium leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
            이름과 날짜만 입력하면 바로 공유 링크가 생성돼요.
          </p>
        </div>
        <span className="rounded-full bg-slate-950 p-2.5 text-white shadow-lg sm:p-3">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-4">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          케이크 이름
          <input
            className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 sm:py-3"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="예) 주민의 6월 생일"
            maxLength={100}
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          생일
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/85 px-10 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 sm:py-3"
              value={birthdayRaw}
              onChange={(e) => onBirthdayChange(e.target.value)}
              placeholder="YYYYMMDD 또는 YYYY-MM-DD"
              inputMode="numeric"
              autoComplete="bday"
            />
          </div>
          {birthdayRaw && !birthdayValid ? (
            <span className="text-xs font-semibold text-amber-700">8자리 날짜 형식으로 입력해 주세요.</span>
          ) : null}
        </label>

        <div>
          <p className="text-sm font-bold text-slate-700">케이크 무드</p>
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
          {pending ? "생성 중" : "공유 링크 만들기"}
        </PrimaryCTA>
      </div>
    </GlassCard>
  );
}
