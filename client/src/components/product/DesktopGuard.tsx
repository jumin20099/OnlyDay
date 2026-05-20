import { useEffect, useState, type ReactNode } from "react";

const DISMISS_KEY = "onlyday_desktop_guard_dismissed";

export function DesktopGuard({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);

    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    setCurrentUrl(window.location.href);

    const onPop = () => setCurrentUrl(window.location.href);
    window.addEventListener("popstate", onPop);

    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* localStorage 비활성 시 무시 */
    }
  };

  return (
    <>
      {children}
      {isDesktop && !dismissed ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-8 backdrop-blur-sm">
          <div className="max-w-md rounded-3xl border border-white/80 bg-white/95 p-8 text-center shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">mobile experience</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-950">
              모바일에서 더 자연스러워요
            </h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
              단하루는 모바일 우선으로 디자인됐어요. 아래 QR 을 스캔하면 핸드폰에서 바로 열려요.
            </p>
            <div className="mt-5 inline-block rounded-2xl border border-slate-200 bg-white p-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`}
                alt="현재 페이지 QR"
                className="h-48 w-48"
              />
            </div>
            <p className="mt-3 break-all text-[10px] font-semibold text-slate-400">{currentUrl}</p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-6 text-xs font-bold text-slate-500 underline underline-offset-4"
            >
              데스크톱에서 그대로 보기
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
