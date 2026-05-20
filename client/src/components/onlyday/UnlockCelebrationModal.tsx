import { UNLOCK_LABELS } from "@/lib/onlydayTheme";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  featureKey: string | null;
  level?: number | null;
  onClose: () => void;
};

export function UnlockCelebrationModal({ open, featureKey, level = null, onClose }: Props) {
  if (!featureKey && !level) return null;
  const isLevelUp = typeof level === "number";
  const label = isLevelUp ? `Lv.${level} 케이크로 성장했어요` : UNLOCK_LABELS[featureKey!] ?? featureKey;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-end justify-center bg-slate-950/42 p-4 pb-8 backdrop-blur-[3px] sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="unlock-title"
            className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/92 p-7 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.55)]"
            initial={{ y: 40, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-[var(--color-accent-soft)]/35 blur-2xl" />
            <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-primary">
              {isLevelUp ? "cake level up" : "new detail"}
            </p>
            <h2 id="unlock-title" className="mt-3 text-center font-serif text-2xl font-bold tracking-tight text-foreground">
              {isLevelUp ? "케이크가 한층 더 빛나요" : "새로운 변화가 열렸어요"}
            </h2>
            <p className="mt-3 text-center text-sm font-medium text-foreground/90">{label}</p>
            <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
              {isLevelUp
                ? "모인 마음이 케이크의 분위기를 바꿨어요. 이 순간을 친구들과 함께 이어가요."
                : "촛불이 쌓일수록 케이크가 더 깊고 따뜻하게 변해요."}
            </p>
            <button
              type="button"
              className="u-btn u-btn-primary mt-6 w-full py-3 text-sm"
              onClick={onClose}
            >
              확인
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
