import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, Sparkles, X } from "lucide-react";
import {
  adsenseClient,
  adsenseDefaultSlot,
  ensureAdSenseScript,
  isAdSenseEnabled,
  pushAdSenseSlot,
} from "@/lib/adsense";

type ShellProps = {
  children: ReactNode;
  tone?: "cream" | "night" | "mint";
  className?: string;
};

const shellTone = {
  cream:
    "bg-[radial-gradient(circle_at_12%_0%,var(--color-accent-soft)_0,transparent_30%),radial-gradient(circle_at_88%_6%,var(--color-accent-warm)_0,transparent_26%),linear-gradient(180deg,var(--color-bg-main)_0,var(--color-bg-sub)_100%)]",
  night:
    "bg-[radial-gradient(circle_at_10%_0%,var(--color-primary)_0,transparent_30%),radial-gradient(circle_at_90%_10%,var(--color-accent-warm)_0,transparent_24%),linear-gradient(180deg,#2b2331_0%,#1f1a24_100%)] text-white",
  mint:
    "bg-[radial-gradient(circle_at_10%_0%,var(--color-accent-soft)_0,transparent_30%),radial-gradient(circle_at_90%_8%,var(--color-primary)_0,transparent_28%),linear-gradient(180deg,var(--color-bg-main)_0,var(--color-bg-sub)_100%)]",
};

export function ProductShell({ children, tone = "cream", className = "" }: ShellProps) {
  return (
    <div className={`flex min-h-dvh flex-col overflow-x-hidden ${shellTone[tone]} ${className}`}>
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.35)_0,transparent_38%,rgba(255,255,255,0.24)_100%)]" />
      <div className="relative z-10 flex-1">{children}</div>
      <ShellFooter />
    </div>
  );
}

const TOSS_URL = (import.meta.env.VITE_DONATE_TOSS_URL ?? "").trim();
const KAKAOPAY_URL = (import.meta.env.VITE_DONATE_KAKAOPAY_URL ?? "").trim();
const DONATIONS_ENABLED = Boolean(TOSS_URL || KAKAOPAY_URL);

export function ShellFooter() {
  return (
    <footer className="relative z-10 mt-8 border-t border-white/40 bg-white/30 backdrop-blur-sm">
      {DONATIONS_ENABLED ? (
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 pt-4 text-center">
          <p className="text-[11px] font-semibold text-slate-500">단하루가 마음에 들었다면 커피 한 잔으로 응원해주세요</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TOSS_URL ? (
              <a
                href={TOSS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-[#0064FF] px-4 py-2 text-[11px] font-black text-white"
              >
                토스로 후원
              </a>
            ) : null}
            {KAKAOPAY_URL ? (
              <a
                href={KAKAOPAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-[#FEE500] px-4 py-2 text-[11px] font-black text-[#181600]"
              >
                카카오페이로 후원
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-4 text-[11px] font-semibold text-slate-500">
        <Link href="/about">
          <span className="cursor-pointer hover:text-slate-700">소개</span>
        </Link>
        <span className="text-slate-300">·</span>
        <Link href="/privacy">
          <span className="cursor-pointer hover:text-slate-700">개인정보 처리방침</span>
        </Link>
        <span className="text-slate-300">·</span>
        <Link href="/terms">
          <span className="cursor-pointer hover:text-slate-700">이용약관</span>
        </Link>
        <span className="text-slate-300">·</span>
        <span>© 2026 단하루</span>
      </div>
    </footer>
  );
}

export function ProductContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border border-white/60 bg-white/72 shadow-[0_18px_48px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:rounded-[2rem] sm:shadow-[0_24px_70px_-34px_rgba(15,23,42,0.45)] ${className}`}
    >
      {children}
    </div>
  );
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.34em] ${className}`}>
      <span className="grid h-11 w-11 place-items-center overflow-hidden sm:h-12 sm:w-12">
        <img src="/onlyday-logo.png" alt="단하루 로고" className="h-full w-full object-contain" />
      </span>
      단하루
    </span>
  );
}

export function PrimaryCTA({
  children,
  onClick,
  href,
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}) {
  const body = (
    <>
      <span>{children}</span>
      <ArrowRight className="h-4 w-4" />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`u-btn u-btn-primary px-5 py-3 text-sm hover:-translate-y-0.5 ${className}`}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`u-btn u-btn-primary px-5 py-3 text-sm hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-45 ${className}`}
    >
      {body}
    </button>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shadow-sm">
      <Sparkles className="h-3 w-3" />
      {children}
    </p>
  );
}

export function ProgressBar({
  value,
  max,
  label,
  className = "",
}: {
  value: number;
  max: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-3 text-xs text-slate-600">
        <span>{label ?? "진행도"}</span>
        <span className="font-black text-slate-950">
          {value}/{max}
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200/70">
        <div
          className="h-full rounded-full bg-[#a5b4fc] transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AdSlot({ slot, label = "" }: { slot?: string; label?: string }) {
  const adSlot = slot ?? adsenseDefaultSlot;
  const enabled = isAdSenseEnabled() && Boolean(adSlot);

  useEffect(() => {
    if (!enabled) return;
    ensureAdSenseScript();
    pushAdSenseSlot();
  }, [enabled, adSlot]);

  if (!enabled) return null;

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={adsenseClient!}
      data-ad-slot={adSlot!}
      data-ad-format="auto"
      data-full-width-responsive="true"
      aria-label={label || undefined}
    />
  );
}

export function MobileSheet({
  open,
  title,
  onClose,
  children,
  allScreens = false,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** true면 데스크톱에서도 표시 (기본은 모바일 전용) */
  allScreens?: boolean;
}) {
  const [shouldRender, setShouldRender] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Open 시 첫 프레임에 opacity-0이 실제로 그려진 뒤 전환되도록 지연
      const timer = window.setTimeout(() => setVisible(true), 20);
      return () => window.clearTimeout(timer);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setShouldRender(false), 180);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[220] ${allScreens ? "" : "lg:hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-[180ms] ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-label="닫기"
      />
      <div className={`absolute left-1/2 top-1/2 w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.4rem] border border-white/70 bg-[#fbfaf7] shadow-2xl transition-opacity duration-[180ms] ${visible ? "opacity-100" : "opacity-0"}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/70 bg-[#fbfaf7]/95 px-4 py-3 backdrop-blur">
          <p className="text-sm font-black tracking-[-0.02em] text-slate-950">{title}</p>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[min(78dvh,42rem)] overflow-y-auto px-3 pb-4 pt-3">
          {children}
        </div>
      </div>
    </div>
  );
}
