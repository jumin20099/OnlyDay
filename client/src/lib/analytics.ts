declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = (import.meta.env.VITE_GA_ID ?? "").trim();
const SCRIPT_ID = "ga4-loader";

export function initAnalytics() {
  if (!GA_ID || typeof document === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;

  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  // SPA 라우트 변경마다 직접 page_view 를 보낼 거라 자동 전송은 끔.
  window.gtag("config", GA_ID, { send_page_view: false });
}

export function trackPageView(path: string) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
