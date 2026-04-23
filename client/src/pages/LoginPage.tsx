import { useLogin, useSignup } from "@/hooks/useAuth";
import { useState } from "react";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [, navigate] = useLocation();
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
    navigate("/cakes");
  };
  const message =
    (login.error as Error | null)?.message ||
    (signup.error as Error | null)?.message ||
    "";

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center p-4 bg-gradient-to-b from-pink-50/95 via-background to-violet-50/40">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_50%_at_50%_0%,rgba(253,186,200,0.45),transparent)]" />
      <div className="w-full max-w-md space-y-5 rounded-[2rem] border border-white/50 bg-white/60 p-8 shadow-xl backdrop-blur-md">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">only · day</p>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-rose-500/90">
            {mode === "login" ? "다시 만나서 반가워요" : "하루를 함께 케이크에 담아요"}
          </h1>
        </div>
        <div className="space-y-3">
          <input
            className="w-full rounded-2xl border border-white/50 bg-white/70 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-pink-200/80"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {mode === "signup" && (
            <input
              className="w-full rounded-2xl border border-white/50 bg-white/70 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-pink-200/80"
              placeholder="닉네임 (표시 이름)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}
          <input
            className="w-full rounded-2xl border border-white/50 bg-white/70 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-pink-200/80"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>
        <button
          type="button"
          className="w-full rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-300/30 disabled:opacity-50"
          onClick={submit}
          disabled={login.isPending || signup.isPending}
        >
          {login.isPending || signup.isPending ? "잠시만…" : mode === "login" ? "로그인" : "가입하고 시작"}
        </button>
        <button
          type="button"
          className="w-full text-center text-xs text-muted-foreground underline"
          onClick={() => setMode((v) => (v === "login" ? "signup" : "login"))}
        >
          {mode === "login" ? "계정이 없다면 가입" : "이미 계정이 있어요"}
        </button>
        {message && <p className="text-center text-xs text-red-500/90">{message}</p>}
      </div>
    </div>
  );
}
