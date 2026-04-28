import { AdSlot, GlassCard, ProductContainer, ProductShell, SectionLabel } from "@/components/product/Primitives";
import { LandingHero } from "@/components/product/LandingHero";
import { PremiumRail } from "@/components/product/PremiumRail";
import { useAuthState } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Lock, MessageCircle, Share2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export default function LandingPage() {
  const { isAuthenticated } = useAuthState();
  const [, navigate] = useLocation();

  const goCreate = () => {
    navigate(isAuthenticated ? "/cakes?create=1" : "/login?next=/cakes%3Fcreate%3D1");
  };

  return (
    <ProductShell>
      <LandingHero
        isAuthenticated={isAuthenticated}
        onCreate={goCreate}
        onDashboard={() => navigate("/cakes")}
        onLogin={() => navigate("/login?next=/cakes")}
      />

      <ProductContainer className="hidden gap-6 pb-16 sm:grid lg:grid-cols-[1fr_320px]">
        <section className="space-y-6">
          <div className="space-y-3">
            <SectionLabel>쌓이면 달라져요</SectionLabel>
            <h2 className="max-w-2xl text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
              편지를 모을수록,
              <br />
              케이크가 더 특별해져요.
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <FlowCard icon={<Share2 className="h-5 w-5" />} title="1. 링크를 나눠요" body="링크 하나로 친구들의 축하를 모아요." />
            <FlowCard icon={<MessageCircle className="h-5 w-5" />} title="2. 편지가 쌓여요" body="친구들은 로그인 없이 편지와 촛불을 남겨요." />
            <FlowCard icon={<Lock className="h-5 w-5" />} title="3. 케이크가 변해요" body="쌓인 편지만큼 케이크 디자인과 상태가 달라져요." />
          </div>

          <GlassCard className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">우리의 약속</p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">쌓일수록 더 특별하게</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                만들고 나누면, 편지가 쌓이고 케이크가 달라지는 흐름.
              </p>
            </div>
            <Link href={isAuthenticated ? "/cakes" : "/login?next=/cakes"}>
              <span className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">
                지금 시작하기
              </span>
            </Link>
          </GlassCard>
        </section>

        <div className="space-y-4">
          <PremiumRail />
          <AdSlot label="광고 영역" />
        </div>
      </ProductContainer>
    </ProductShell>
  );
}

function FlowCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <GlassCard className="p-5">
      <div className="mb-5 inline-flex rounded-full bg-slate-950 p-3 text-white shadow-lg">
        {icon}
      </div>
      <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{body}</p>
      <Sparkles className="mt-5 h-4 w-4 text-indigo-400" />
    </GlassCard>
  );
}
