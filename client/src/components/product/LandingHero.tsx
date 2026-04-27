import { BrandMark, GlassCard, PrimaryCTA, ProductContainer, SectionLabel } from "./Primitives";
import { CakeSlice, Flame, Gift, Share2 } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  isAuthenticated: boolean;
  onCreate: () => void;
  onDashboard: () => void;
  onLogin: () => void;
};

export function LandingHero({ isAuthenticated, onCreate, onDashboard, onLogin }: Props) {
  return (
    <ProductContainer className="pb-8 pt-4 sm:pb-24 sm:pt-5">
      <header className="flex items-center justify-between gap-3">
        <BrandMark />
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onDashboard}
              className="rounded-full bg-white/70 px-4 py-2 text-xs font-bold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              내 케이크
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="rounded-full bg-white/70 px-4 py-2 text-xs font-bold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              로그인
            </button>
          )}
        </div>
      </header>

      <section className="grid min-h-[calc(100dvh-76px)] gap-6 pt-8 sm:min-h-0 sm:gap-8 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
        <div className="flex flex-col justify-center space-y-5 sm:block sm:space-y-7">
          <SectionLabel>birthday surprise loop</SectionLabel>
          <div className="space-y-3 sm:space-y-5">
            <h1 className="max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.07em] text-slate-950 sm:text-7xl">
              생일 편지를
              <br />
              케이크처럼 모으는 법
            </h1>
            <p className="max-w-xl text-sm font-medium leading-6 text-slate-600 sm:text-lg sm:leading-8">
              링크 하나로 친구들이 촛불과 편지를 남기고, 촛불이 모일수록 잠긴 마음이 하나씩 열려요.
              과한 꾸밈 없이, 공유하고 싶은 순간만 남깁니다.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <PrimaryCTA onClick={onCreate} className="w-full sm:w-auto">
              Create Cake
            </PrimaryCTA>
            <button
              type="button"
              onClick={isAuthenticated ? onDashboard : onLogin}
              className="rounded-full border border-slate-300/80 bg-white/60 px-5 py-3 text-sm font-black text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              {isAuthenticated ? "내 케이크 보기" : "먼저 로그인"}
            </button>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-2 text-xs font-bold text-slate-600">
            <MiniMetric icon={<Share2 className="h-4 w-4" />} title="Share" body="링크로 참여" />
            <MiniMetric icon={<Flame className="h-4 w-4" />} title="Grow" body="촛불 progress" />
            <MiniMetric icon={<Gift className="h-4 w-4" />} title="Unlock" body="생일 보상" />
          </div>
        </div>

        <GlassCard className="relative hidden overflow-hidden p-5 lg:block">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-200/60 blur-3xl" />
          <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-amber-200/60 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                live cake
              </span>
              <span className="text-xs text-white/60">24 candles</span>
            </div>
            <div className="mt-8 grid place-items-center">
              <div className="relative grid aspect-square w-64 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#dbeafe_0,transparent_45%),linear-gradient(145deg,#f8fafc,#fde68a)] shadow-2xl">
                <CakeSlice className="h-24 w-24 text-slate-900 drop-shadow" />
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.9)]"
                    style={{
                      left: `${18 + ((i * 23) % 64)}%`,
                      top: `${18 + ((i * 37) % 64)}%`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-7 rounded-3xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-black">3번째 편지까지 열림</p>
              <p className="mt-1 text-xs leading-5 text-white/65">친구 한 명이 더 촛불을 켜면 다음 편지가 공개돼요.</p>
            </div>
          </div>
        </GlassCard>
      </section>
    </ProductContainer>
  );
}

function MiniMetric({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/58 p-3 shadow-sm backdrop-blur">
      <div className="mb-2 inline-flex rounded-full bg-slate-950 p-2 text-white">{icon}</div>
      <p className="text-slate-950">{title}</p>
      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{body}</p>
    </div>
  );
}
