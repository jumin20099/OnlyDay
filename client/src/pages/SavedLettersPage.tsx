import { BrandMark, GlassCard, ProductContainer, ProductShell } from "@/components/product/Primitives";
import { useAuthState } from "@/hooks/useAuth";
import { useSavedLetters } from "@/hooks/useCakeLetterApi";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft, MailOpen } from "lucide-react";

export default function SavedLettersPage() {
  const { isAuthenticated } = useAuthState();
  const [, setLocation] = useLocation();
  const { data: letters = [] } = useSavedLetters({ enabled: isAuthenticated });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProductShell tone="mint">
      <ProductContainer className="pb-14 pt-5">
        <header className="flex items-center justify-between gap-3">
          <Link href="/cakes">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-2 text-xs font-black text-slate-700 shadow-sm backdrop-blur">
              <ChevronLeft className="h-4 w-4" />
              내 케이크
            </span>
          </Link>
          <BrandMark />
          <span className="w-[66px]" />
        </header>

        <main className="mx-auto max-w-3xl pt-10">
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">다시 꺼내보는 마음</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-slate-950">저장한 편지</h1>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">계속 보고 싶은 고마운 편지를 모아두는 곳이에요.</p>
          </div>

          {letters.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <MailOpen className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 text-sm font-black text-slate-600">아직 보관된 편지가 없어요.</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">고마운 편지를 하나씩 담아보세요.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {letters.map((letter) => (
                <GlassCard key={letter.savedLetterId} className="p-5">
                  <p className="flex items-center gap-2 text-sm font-black text-slate-950">
                    <MailOpen className="h-4 w-4 text-indigo-500" />
                    {letter.nickname}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">{letter.content}</p>
                  <p className="mt-4 text-xs font-bold text-slate-400">{letter.savedAt}</p>
                </GlassCard>
              ))}
            </div>
          )}
        </main>
      </ProductContainer>
    </ProductShell>
  );
}
