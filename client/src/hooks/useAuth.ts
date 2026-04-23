import { api } from "@/lib/api";
import { AUTH_STATE_EVENT, clearSession, getStoredUser, setSession } from "@/lib/auth-storage";
import type { ApiResponse, AuthResponse, UserPayload } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

type LoginInput = { email: string; password: string };
type SignupInput = { email: string; password: string; displayName: string };

function subscribeAuthStorage(onStoreChange: () => void) {
  const onStorage = () => onStoreChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_STATE_EVENT, onStorage);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_STATE_EVENT, onStorage);
  };
}

export function useAuthState() {
  const user = useSyncExternalStore(
    subscribeAuthStorage,
    () => getStoredUser<UserPayload>(),
    () => null
  );
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
