const TOKEN_KEY = "mmd_access_token";
const USER_KEY = "mmd_user";

/** `useSyncExternalStore`의 getSnapshot은 동일 데이터에 대해 동일 객체 참조를 돌려야 함 (매번 JSON.parse 시 무한 루프) */
let cachedUserRaw: string | null | undefined;
let cachedUser: unknown = null;

/** 같은 탭에서 setSession/clearSession 후 `useAuthState` 갱신용 */
export const AUTH_STATE_EVENT = "mmd-auth-changed";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
}

export function getStoredUser<T>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  if (raw === cachedUserRaw) {
    return (cachedUser ?? null) as T | null;
  }
  cachedUserRaw = raw;
  if (!raw) {
    cachedUser = null;
    return null;
  }
  try {
    cachedUser = JSON.parse(raw) as T;
    return cachedUser as T;
  } catch {
    cachedUser = null;
    return null;
  }
}
