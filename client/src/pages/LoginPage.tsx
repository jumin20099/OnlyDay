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
  const [displayName, setDisplayName] = useState("");

  const submit = async () => {
    try {
      if (mode === "login") {
        await login.mutateAsync({ email, password });
      } else {
        await signup.mutateAsync({ email, password, displayName });
      }
      navigate(nextPath);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "인증에 실패했어요.");
    }
  };
  const message =
    (login.error as Error | null)?.message ||
    (signup.error as Error | null)?.message ||
    "";

  return (
    <ProductShell tone="night">
      <ProductContainer className="grid min-h-dvh items-center py-5 sm:py-8">
        <header className="absolute left-4 top-5 sm:left-6">
          <Link href="/">
            <span>
              <BrandMark className="text-white/80" />
            </span>
          </Link>
        </header>

        <div className="mx-auto grid w-full max-w-5xl gap-4 pt-14 sm:gap-6 sm:pt-0 lg:grid-cols-[1fr_430px] lg:items-center">
          <div className="hidden space-y-5 text-white sm:block">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">secure creator access</p>
            <h1 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">
              케이크를 만들고,
              <br />
              생일 당일에만 열어보세요.
            </h1>
            <p className="max-w-lg text-sm font-semibold leading-7 text-white/60">
              로그인은 케이크 소유권과 편지 열람 조건을 지키기 위한 최소 장치입니다.
              친구들은 공유 링크에서 로그인 없이 참여할 수 있어요.
            </p>
          </div>

          <GlassCard className="p-4 text-slate-950 sm:p-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                {mode === "login" ? "welcome back" : "join only day"}
              </p>
              <h2 className="text-2xl font-black tracking-[-0.05em] sm:text-3xl">
                {mode === "login" ? "다시 만나서 반가워요" : "첫 케이크를 만들 준비"}
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
                    placeholder="닉네임 (표시 이름)"
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
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-[0_18px_35px_-18px_rgba(15,23,42,0.8)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
              onClick={submit}
              disabled={login.isPending || signup.isPending}
            >
              {login.isPending || signup.isPending ? "잠시만…" : mode === "login" ? "로그인" : "가입하고 시작"}
            </button>
            <button
              type="button"
              className="mt-4 w-full text-center text-xs font-black text-slate-500 underline-offset-4 transition hover:text-slate-950 hover:underline"
              onClick={() => setMode((v) => (v === "login" ? "signup" : "login"))}
            >
              {mode === "login" ? "계정이 없다면 가입" : "이미 계정이 있어요"}
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
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
      <span className="text-slate-400">{icon}</span>
      {children}
    </label>
  );
}
