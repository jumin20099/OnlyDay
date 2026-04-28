import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";

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
    <div className={`min-h-dvh overflow-x-hidden ${shellTone[tone]} ${className}`}>
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.35)_0,transparent_38%,rgba(255,255,255,0.24)_100%)]" />
      <div className="relative z-10">{children}</div>
    </div>
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

export function AdSlot({ label = "광고 영역" }: { label?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/35 p-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:rounded-3xl sm:p-4 sm:text-[11px]">
      {label}
    </div>
  );
}

export function MobileSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
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
    <div className="fixed inset-0 z-[220] lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
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
