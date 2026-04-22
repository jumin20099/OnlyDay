import { api } from "@/lib/api";
import { clearSession, getStoredUser, setSession } from "@/lib/auth-storage";
import type { ApiResponse, AuthResponse, UserPayload } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

type LoginInput = { email: string; password: string };
type SignupInput = { email: string; password: string; displayName: string };

export function useAuthState() {
  const user = useMemo(() => getStoredUser<UserPayload>(), []);
  return { user, isAuthenticated: Boolean(user) };
}

export function useLogin() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", input);
      if (!data.success) throw new Error(data.error?.message ?? "로그인 실패");
      setSession(data.data.accessToken, data.data.user);
      return data.data;
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async (input: SignupInput) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/signup", input);
      if (!data.success) throw new Error(data.error?.message ?? "회원가입 실패");
      setSession(data.data.accessToken, data.data.user);
      return data.data;
    },
  });
}

export function logout() {
  clearSession();
  window.location.href = "/login";
}
