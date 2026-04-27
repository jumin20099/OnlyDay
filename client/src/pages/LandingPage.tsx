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
            <SectionLabel>how it works</SectionLabel>
            <h2 className="max-w-2xl text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
              공유가 곧 참여가 되고, 참여가 곧 생일 보상이 됩니다.
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <FlowCard icon={<Share2 className="h-5 w-5" />} title="1. 링크 공유" body="케이크를 만들면 바로 친구에게 보낼 수 있는 링크가 생겨요." />
            <FlowCard icon={<MessageCircle className="h-5 w-5" />} title="2. 촛불과 편지" body="친구들은 로그인 없이 촛불과 생일 편지를 남길 수 있어요." />
            <FlowCard icon={<Lock className="h-5 w-5" />} title="3. 잠금 해제" body="생일 당일, 촛불이 모인 만큼 편지가 차례로 열립니다." />
          </div>

          <GlassCard className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">product promise</p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">기능보다 흐름을 먼저 설계했어요</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                공개 랜딩, 생성, 공유, 참여, 성장, 보상까지 한 흐름으로 이어지고, 데이터는 기존 API에서만 가져옵니다.
              </p>
            </div>
            <Link href={isAuthenticated ? "/cakes" : "/login?next=/cakes"}>
              <span className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">
                시작하기
              </span>
            </Link>
          </GlassCard>
        </section>

        <div className="space-y-4">
          <PremiumRail />
          <AdSlot label="non-intrusive ad slot" />
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
