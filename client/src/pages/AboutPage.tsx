import { BrandMark, GlassCard, PrimaryCTA, ProductContainer, ProductShell } from "@/components/product/Primitives";
import { CakeSlice, Gift, MessageCircle, Share2 } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function AboutPage() {
  const [, navigate] = useLocation();

  return (
    <ProductShell tone="cream">
      <ProductContainer className="pb-12 pt-5">
        <header className="flex items-center justify-between gap-3">
          <Link href="/">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-2 text-xs font-black text-slate-700 shadow-sm backdrop-blur">
              <ChevronLeft className="h-4 w-4" />
              홈
            </span>
          </Link>
          <BrandMark />
          <span className="w-[66px]" />
        </header>

        <main className="mx-auto max-w-3xl pt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">about</p>
          <h1 className="mt-2 text-4xl font-black leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-5xl">
            단하루는
            <br />
            생일 하루의 마음을 담아요.
          </h1>
          <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-slate-600">
            주인공의 생일 케이크에 친구들이 촛불과 편지를 남기고, 케이크는 마음이 모일수록 점점 화려해져요.
            편지는 생일 당일 0시에 한꺼번에 공개되고, 보관함에 담지 않은 편지는 14일이 지나면 조용히 사라져요.
          </p>

          <section className="mt-10">
            <h2 className="text-lg font-black tracking-[-0.03em] text-slate-950">3단계로 끝나요</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Step
                icon={<CakeSlice className="h-5 w-5" />}
                title="1. 케이크 만들기"
                body="이름·생일·맛만 정하면 초대 링크가 생겨요."
              />
              <Step
                icon={<Share2 className="h-5 w-5" />}
                title="2. 친구에게 공유"
                body="링크를 받은 친구는 로그인 없이 촛불과 편지를 남길 수 있어요."
              />
              <Step
                icon={<Gift className="h-5 w-5" />}
                title="3. 생일에 열기"
                body="생일 당일 0시, 쌓인 편지가 한꺼번에 공개돼요."
              />
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-black tracking-[-0.03em] text-slate-950">자주 묻는 질문</h2>
            <div className="mt-4 grid gap-3">
              <Faq
                q="편지는 누가 볼 수 있어요?"
                a="생일 당일부터 케이크 주인공이 볼 수 있어요. 친구의 편지 본문은 i번째 편지마다 촛불 i개가 모이면 공개되도록 단계적으로 해금돼요."
              />
              <Faq
                q="언제부터 편지를 남길 수 있어요?"
                a="생일 24시간 전부터 생일 당일 자정까지 가능해요. 미리 써둘 수도 있고, 생일 당일까지 추가할 수 있어요."
              />
              <Faq
                q="14일 뒤에 편지가 사라진다고요?"
                a="보관함에 담지 않은 편지는 생일 +14일에 자동으로 삭제돼요. 오래 간직하고 싶은 편지는 주인공이 보관함에 담아두면 영구 보존돼요."
              />
              <Faq q="무료인가요?" a="네, 모든 기능이 무료예요. 운영비는 광고와 후원으로 충당해요." />
              <Faq
                q="친구가 편지 남기려면 로그인해야 해요?"
                a="아니요. 링크만 있으면 로그인 없이 닉네임과 편지를 남길 수 있어요. 케이크를 직접 만들고 싶다면 그때 가입하면 돼요."
              />
              <Faq
                q="모바일에서만 작동하나요?"
                a="단하루는 모바일 우선으로 디자인됐어요. 데스크톱에서는 모바일로 옮겨주시면 더 자연스럽게 쓸 수 있어요."
              />
            </div>
          </section>

          <section className="mt-12 rounded-3xl border border-violet-100 bg-gradient-to-br from-rose-50/80 via-violet-50/80 to-indigo-50/80 p-6 text-center shadow-sm">
            <MessageCircle className="mx-auto h-6 w-6 text-violet-500" />
            <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-slate-950">너의 단하루도 시작해봐요</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">친구들의 마음으로 채워지는 생일 케이크를 만들어볼 수 있어요.</p>
            <div className="mt-4 flex justify-center">
              <PrimaryCTA onClick={() => navigate("/cakes")}>내 케이크 만들기</PrimaryCTA>
            </div>
          </section>
        </main>
      </ProductContainer>
    </ProductShell>
  );
}

function Step({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <GlassCard className="p-4">
      <div className="inline-flex rounded-full bg-primary p-2 text-white">{icon}</div>
      <p className="mt-3 text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{body}</p>
    </GlassCard>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-white/70 bg-white/65 p-4 shadow-sm backdrop-blur">
      <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-black text-slate-950">
        {q}
        <span className="text-xs font-bold text-slate-400 group-open:hidden">+</span>
        <span className="hidden text-xs font-bold text-slate-400 group-open:inline">−</span>
      </summary>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{a}</p>
    </details>
  );
}
