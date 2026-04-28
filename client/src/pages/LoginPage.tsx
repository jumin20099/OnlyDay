import { BrandMark, GlassCard, ProductContainer, ProductShell } from "@/components/product/Primitives";
import { useLogin, useSignup } from "@/hooks/useAuth";
import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import type { ReactNode } from "react";

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
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const passwordMismatch = mode === "signup" && passwordConfirm.length > 0 && password !== passwordConfirm;

  const submit = async () => {
    try {
      if (mode === "login") {
        await login.mutateAsync({ email, password });
      } else {
        if (password !== passwordConfirm) {
          toast.error("비밀번호가 서로 달라요.");
          return;
        }
        await signup.mutateAsync({ email, password, displayName });
      }
      navigate(nextPath);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "로그인에 실패했어요.");
    }
  };
  const message =
    (login.error as Error | null)?.message ||
    (signup.error as Error | null)?.message ||
    "";

  return (
    <ProductShell tone="mint">
      <ProductContainer className="grid min-h-dvh items-center py-5 sm:py-8">
        <header className="absolute left-4 top-5 z-10 sm:left-6">
          <Link href="/">
            <span>
              <BrandMark className="text-slate-700" />
            </span>
          </Link>
        </header>

        <div className="mx-auto grid w-full max-w-5xl gap-4 pt-14 sm:gap-6 sm:pt-0 lg:grid-cols-[1fr_430px] lg:items-center">
          <div className="hidden space-y-5 sm:block">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">단하루, OnlyDay</p>
            <h1 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">
              <span className="bg-gradient-to-r from-[var(--color-primary)] to-[#d58dc8] bg-clip-text text-transparent">
                단하루
              </span>
              <br />
              <span className="text-slate-900">당신의 하루를 특별하게.</span>
            </h1>
            <p className="max-w-lg text-sm font-semibold leading-7 text-slate-500">
              당신의 특별한 단하루를 위해 케이크를 만들어봐요.
            </p>
            <div className="rounded-[1.6rem] border border-white/70 bg-white/70 p-4 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur">
              <p className="text-xs font-black text-slate-700">오늘의 한 줄</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                당신의 특별한 생일을 응원해요!
              </p>
            </div>
          </div>

          <GlassCard className="border-white/85 bg-white/78 p-4 text-slate-950 shadow-[0_28px_70px_-38px_rgba(15,23,42,0.32)] sm:p-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                {mode === "login" ? "다시 만나서 반가워요" : "처음이라 더 반가워요"}
              </p>
              <h2 className="text-2xl font-black tracking-[-0.05em] sm:text-3xl">
                {mode === "login" ? "오늘도 단하루가 함께할게요." : "특별한 생일, 단하루가 함께해요."}
              </h2>
            </div>

            <div className="mt-5 space-y-2.5 sm:mt-7 sm:space-y-3">
              <FieldIcon icon={<Mail className="h-4 w-4" />}>
                <input
                  className="w-full bg-transparent py-2.5 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 sm:py-3"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </FieldIcon>
              {mode === "signup" ? (
                <FieldIcon icon={<UserRound className="h-4 w-4" />}>
                  <input
                    className="w-full bg-transparent py-2.5 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 sm:py-3"
                    placeholder="이름"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </FieldIcon>
              ) : null}
              <FieldIcon icon={<LockKeyhole className="h-4 w-4" />}>
                <input
                  className="w-full bg-transparent py-2.5 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 sm:py-3"
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </FieldIcon>
              {mode === "signup" ? (
                <FieldIcon icon={<LockKeyhole className="h-4 w-4" />}>
                  <input
                    className="w-full bg-transparent py-2.5 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 sm:py-3"
                    type="password"
                    placeholder="비밀번호 확인"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </FieldIcon>
              ) : null}
            </div>
            {passwordMismatch ? (
              <p className="mt-3 text-xs font-bold text-red-600">비밀번호가 서로 달라요.</p>
            ) : null}

            <button
              type="button"
              className="u-btn u-btn-primary mt-6 w-full px-5 py-3.5 text-sm hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
              onClick={submit}
              disabled={login.isPending || signup.isPending || passwordMismatch}
            >
              {login.isPending || signup.isPending ? "잠시만…" : mode === "login" ? "로그인" : "가입하고 시작"}
            </button>
            <button
              type="button"
              className="mt-4 w-full text-center text-xs font-black text-slate-500 underline-offset-4 transition hover:text-slate-950 hover:underline"
              onClick={() => setMode((v) => (v === "login" ? "signup" : "login"))}
            >
              {mode === "login" ? "아직 계정이 없다면 가입하기" : "이미 계정이 있다면 로그인"}
            </button>
            {message ? <p className="mt-4 text-center text-xs font-bold text-red-600">{message}</p> : null}
          </GlassCard>
        </div>
      </ProductContainer>
    </ProductShell>
  );
}

function FieldIcon({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/88 px-4 focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[color:var(--color-primary)_/_.16]">
      <span className="text-slate-400">{icon}</span>
      {children}
    </label>
  );
}
