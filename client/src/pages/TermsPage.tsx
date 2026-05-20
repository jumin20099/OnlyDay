import { BrandMark, GlassCard, ProductContainer, ProductShell } from "@/components/product/Primitives";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? "support@example.com";

export default function TermsPage() {
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
          <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-950">이용약관</h1>
          <p className="mt-2 text-xs font-semibold text-slate-500">시행일 2026-05-19</p>

          <GlassCard className="mt-6 space-y-6 p-6 text-sm leading-7 text-slate-700">
            <Section title="제1조 (목적)">
              <p>본 약관은 단하루(이하 "서비스")가 제공하는 생일 케이크·편지 공유 서비스의 이용 조건 및 절차, 이용자와 서비스 사이의 권리·의무·책임 사항을 정함을 목적으로 합니다.</p>
            </Section>

            <Section title="제2조 (서비스의 내용)">
              <ul className="list-disc space-y-1 pl-5">
                <li>생일 케이크 생성 및 공유 링크 발급</li>
                <li>친구의 촛불·편지 작성·공개</li>
                <li>편지 보관함 및 이미지 내보내기</li>
              </ul>
            </Section>

            <Section title="제3조 (회원의 의무)">
              <ul className="list-disc space-y-1 pl-5">
                <li>타인의 정보를 도용하거나 허위 정보를 등록하지 않습니다.</li>
                <li>타인의 명예를 훼손하거나 모욕·욕설·차별·성적 표현을 포함한 콘텐츠를 게시하지 않습니다.</li>
                <li>서비스의 정상적인 운영을 방해하는 행위(자동화·크롤링·해킹 등)를 하지 않습니다.</li>
                <li>저작권·초상권 등 제3자의 권리를 침해하지 않습니다.</li>
              </ul>
            </Section>

            <Section title="제4조 (서비스 이용 제한)">
              <p>회원이 본 약관을 위반하거나 서비스 운영에 중대한 지장을 주는 경우, 서비스는 사전 통보 없이 이용 제한·계정 정지·콘텐츠 삭제 등의 조치를 취할 수 있습니다.</p>
            </Section>

            <Section title="제5조 (콘텐츠 권리)">
              <p>회원이 작성한 편지·이미지의 저작권은 회원 본인에게 있으며, 서비스는 서비스 제공·홍보·개선을 위해 필요한 범위에서 비독점적으로 이용할 수 있습니다.</p>
            </Section>

            <Section title="제6조 (편지 보존 기간)">
              <p>보관함에 담기지 않은 편지는 케이크 생일로부터 14일이 경과한 시점에 자동 삭제됩니다. 삭제된 편지는 복구할 수 없습니다.</p>
            </Section>

            <Section title="제7조 (책임의 한계)">
              <p>서비스는 천재지변, 비상사태, 통신사 장애 등 불가항력으로 인한 서비스 중단에 대하여 책임을 지지 않습니다. 회원 간 분쟁에 대해서도 서비스는 직접 개입하지 않으며 중재 의무를 부담하지 않습니다.</p>
            </Section>

            <Section title="제8조 (약관 변경)">
              <p>서비스는 필요한 경우 약관을 개정할 수 있으며, 개정된 약관은 적용일자 7일 전부터 서비스 내에 공지합니다. 회원이 개정 약관에 동의하지 않을 경우 이용을 중단하고 탈퇴할 수 있습니다.</p>
            </Section>

            <Section title="제9조 (분쟁 해결)">
              <p>본 약관과 관련된 분쟁은 대한민국 법령에 따라 처리하며, 관할 법원은 민사소송법에 따릅니다.</p>
            </Section>

            <Section title="제10조 (문의)">
              <p>
                약관 관련 문의: <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">{CONTACT_EMAIL}</a>
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
