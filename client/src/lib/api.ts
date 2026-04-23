import axios from "axios";
import { clearSession, getAccessToken } from "./auth-storage";

/** `VITE_API_BASE_URL` 비움(또는 미설정) = 개발 시 Vite 프록시(5173→8080)로 `/api` 등 전달. 직접 8080 쓰려면 `http://localhost:8080` */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401만 전역 로그아웃. 403은 "권한 없음"(예: 남 케이크 편지 목록)도 있어서 여기서 세션을 지우면 안 됨.
    if (error?.response?.status === 401) {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
