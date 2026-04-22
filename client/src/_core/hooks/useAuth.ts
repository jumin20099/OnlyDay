import { getLoginUrl } from "@/const";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const userInfo = useMemo(() => {
    const raw = localStorage.getItem("manus-runtime-user-info");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("manus-runtime-user-info");
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const state = useMemo(() => {
    return {
      user: userInfo ?? null,
      loading: false,
      error: null,
      isAuthenticated: Boolean(userInfo),
    };
  }, [userInfo]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (state.loading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    state.loading,
    state.user,
  ]);

  return {
    ...state,
    refresh: async () => undefined,
    logout,
  };
}
