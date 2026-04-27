import { useAuthState } from "@/hooks/useAuth";
import { useSavedLetters } from "@/hooks/useCakeLetterApi";
import { useEffect } from "react";
import { useLocation } from "wouter";

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
    <div className="mx-auto min-h-dvh max-w-3xl space-y-8 bg-background px-4 py-10 md:px-6">
      <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">저장된 편지</h1>
      {letters.map((letter) => (
        <div
          key={letter.savedLetterId}
          className="space-y-2 rounded-2xl border border-border/60 bg-card p-5 shadow-[0_4px_18px_-8px_rgba(45,55,72,0.08)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(45,55,72,0.12)]"
        >
          <p className="font-semibold text-foreground">{letter.nickname}</p>
          <p className="text-sm font-normal leading-relaxed text-foreground/90">{letter.content}</p>
          <p className="text-xs text-muted-foreground">{letter.savedAt}</p>
        </div>
      ))}
      {letters.length === 0 && <p className="text-sm text-muted-foreground">저장된 편지가 없습니다.</p>}
    </div>
  );
}
