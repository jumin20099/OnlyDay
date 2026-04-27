import { useLogin, useSignup } from "@/hooks/useAuth";
import { useState } from "react";
import { useLocation, useSearch } from "wouter";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const nextPath = (() => {
    const q = new URLSearchParams(search).get("next");
    if (q && q.startsWith("/")) return q;
    return "/cakes";
  })();
  const login = useLogin();
  const signup = useSignup();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const submit = async () => {
    if (mode === "login") {
      await login.mutateAsync({ email, password });
    } else {
      await signup.mutateAsync({ email, password, displayName });
    }
    navigate(nextPath);
  };
  const message =
    (login.error as Error | null)?.message ||
    (signup.error as Error | null)?.message ||
    "";

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_-5%,oklch(0.93_0.025_285_/_0.22),transparent)]" />
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border/70 bg-card p-8 shadow-[0_8px_30px_-12px_rgba(45,55,72,0.08)]">
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">only · day</p>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">
            {mode === "login" ? "다시 만나서 반가워요" : "하루를 함께 케이크에 담아요"}
          </h1>
        </div>
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border-0 bg-muted/80 px-4 py-3 text-sm text-foreground shadow-none outline-none ring-1 ring-transparent transition placeholder:text-muted-foreground/70 focus:bg-card focus:ring-2 focus:ring-ring/35"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {mode === "signup" && (
            <input
              className="w-full rounded-xl border-0 bg-muted/80 px-4 py-3 text-sm text-foreground shadow-none outline-none ring-1 ring-transparent transition placeholder:text-muted-foreground/70 focus:bg-card focus:ring-2 focus:ring-ring/35"
              placeholder="닉네임 (표시 이름)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}
          <input
            className="w-full rounded-xl border-0 bg-muted/80 px-4 py-3 text-sm text-foreground shadow-none outline-none ring-1 ring-transparent transition placeholder:text-muted-foreground/70 focus:bg-card focus:ring-2 focus:ring-ring/35"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>
        <button
          type="button"
          className="u-cta-primary w-full py-3.5 text-sm disabled:opacity-50"
          onClick={submit}
          disabled={login.isPending || signup.isPending}
        >
          {login.isPending || signup.isPending ? "잠시만…" : mode === "login" ? "로그인" : "가입하고 시작"}
        </button>
        <button
          type="button"
          className="w-full text-center text-xs font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          onClick={() => setMode((v) => (v === "login" ? "signup" : "login"))}
        >
          {mode === "login" ? "계정이 없다면 가입" : "이미 계정이 있어요"}
        </button>
        {message && <p className="text-center text-xs font-medium text-destructive">{message}</p>}
      </div>
    </div>
  );
}
