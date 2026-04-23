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
    <div className="p-6 max-w-3xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold">저장된 편지</h1>
      {letters.map((letter) => (
        <div key={letter.savedLetterId} className="border rounded p-3">
          <p className="font-semibold">{letter.nickname}</p>
          <p>{letter.content}</p>
          <p className="text-sm text-gray-500">{letter.savedAt}</p>
        </div>
      ))}
      {letters.length === 0 && <p className="text-gray-500">저장된 편지가 없습니다.</p>}
    </div>
  );
}
