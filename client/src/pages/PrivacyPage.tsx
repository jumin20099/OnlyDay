import { BrandMark, GlassCard, ProductContainer, ProductShell } from "@/components/product/Primitives";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? "support@example.com";

export default function PrivacyPage() {
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

        <main className="mx-auto max-w-3xl pt-8">
          <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-950">개인정보 처리방침</h1>
          <p className="mt-2 text-xs font-semibold text-slate-500">시행일 2026-05-19</p>

          <GlassCard className="mt-6 space-y-6 p-6 text-sm leading-7 text-slate-700">
            <p>단하루(이하 "서비스")는 개인정보 보호법 등 관련 법령을 준수하며, 이용자의 개인정보를 다음과 같이 처리합니다.</p>

            <Section title="1. 수집하는 개인정보 항목">
              <ul className="list-disc space-y-1 pl-5">
                <li>회원 가입 시: 이메일 주소, 이름, 비밀번호(암호화 저장)</li>
                <li>케이크·편지 작성 시: 닉네임, 편지 본문, 첨부 이미지(선택)</li>
                <li>자동 수집: 접속 로그, 쿠키, 기기·브라우저 정보</li>
              </ul>
            </Section>

            <Section title="2. 처리 목적">
              <ul className="list-disc space-y-1 pl-5">
                <li>회원 식별·인증 및 케이크/편지 기능 제공</li>
                <li>서비스 운영·개선 및 부정 이용 방지</li>
                <li>법령에 따른 의무 이행</li>
              </ul>
            </Section>

            <Section title="3. 보유·이용 기간">
              <ul className="list-disc space-y-1 pl-5">
                <li>회원 정보: 회원 탈퇴 시까지</li>
                <li>편지(보관함 미저장): 작성된 케이크의 생일로부터 14일</li>
                <li>접속 로그: 3개월</li>
              </ul>
            </Section>

            <Section title="4. 제3자 제공">
              <p>서비스는 이용자의 개인정보를 외부에 제공하지 않습니다. 다만 법령에 따른 요청이 있는 경우 예외로 합니다.</p>
            </Section>

            <Section title="5. 처리 위탁">
              <ul className="list-disc space-y-1 pl-5">
                <li>Supabase (데이터베이스·스토리지 호스팅)</li>
                <li>Render (애플리케이션 호스팅)</li>
                <li>Google AdSense (광고 표시 — 쿠키·기기 식별자 사용)</li>
              </ul>
            </Section>

            <Section title="6. 이용자 권리">
              <p>이용자는 언제든지 본인의 개인정보 열람·수정·삭제·처리 정지를 요청할 수 있으며, 회원 탈퇴 시 모든 개인정보가 즉시 파기됩니다.</p>
            </Section>

            <Section title="7. 안전성 확보 조치">
              <p>비밀번호 암호화 저장, 통신 구간 TLS 적용, 접근 권한 관리, 정기적 보안 점검을 수행합니다.</p>
            </Section>

            <Section title="8. 쿠키 사용">
              <p>서비스는 로그인 유지·서비스 분석·광고 표시를 위해 쿠키 및 유사 기술을 사용합니다. 이용자는 브라우저 설정에서 쿠키 사용을 거부할 수 있습니다.</p>
            </Section>

            <Section title="9. 개인정보 보호 책임자">
              <p>
                문의: <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">{CONTACT_EMAIL}</a>
              </p>
            </Section>
          </GlassCard>
        </main>
      </ProductContainer>
    </ProductShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-black text-slate-950">{title}</h2>
      <div className="mt-2 text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}
