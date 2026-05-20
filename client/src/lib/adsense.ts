declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

const CLIENT = (import.meta.env.VITE_ADSENSE_CLIENT ?? "").trim();
const SLOT = (import.meta.env.VITE_ADSENSE_SLOT ?? "").trim();
const SCRIPT_ID = "adsense-loader";

export const adsenseClient = CLIENT || null;
export const adsenseDefaultSlot = SLOT || null;

export function isAdSenseEnabled(): boolean {
  return Boolean(adsenseClient && adsenseDefaultSlot);
}

export function ensureAdSenseScript() {
  if (!adsenseClient || typeof document === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClient)}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

export function pushAdSenseSlot() {
  if (!adsenseClient) return;
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    /* AdSense 미준비 / 중복 push 등은 조용히 무시 */
  }
}
