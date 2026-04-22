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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded-xl p-6 space-y-3">
        <h1 className="text-2xl font-bold">MMD 인증</h1>
        <input className="w-full border rounded p-2" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {mode === "signup" && (
          <input className="w-full border rounded p-2" placeholder="display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        )}
        <input className="w-full border rounded p-2" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-black text-white rounded p-2" onClick={submit} disabled={login.isPending || signup.isPending}>
          {mode === "login" ? "로그인" : "회원가입"}
        </button>
        <button className="text-sm underline" onClick={() => setMode((v) => (v === "login" ? "signup" : "login"))}>
          {mode === "login" ? "계정이 없으면 회원가입" : "이미 계정이 있으면 로그인"}
        </button>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
}
