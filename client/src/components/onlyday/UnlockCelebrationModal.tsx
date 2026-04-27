import { UNLOCK_LABELS } from "@/lib/onlydayTheme";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  featureKey: string | null;
  onClose: () => void;
};

export function UnlockCelebrationModal({ open, featureKey, onClose }: Props) {
  if (!featureKey) return null;
  const label = UNLOCK_LABELS[featureKey] ?? featureKey;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-end justify-center bg-black/40 p-4 pb-8 backdrop-blur-[2px] sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="unlock-title"
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/70 border-t-[3px] border-t-accent-pink bg-card p-8 shadow-[0_12px_40px_-12px_rgba(45,55,72,0.15)]"
            initial={{ y: 40, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-6 -top-6 text-6xl opacity-[0.12]">✦</div>
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-accent-pink">
              achievement
            </p>
            <h2 id="unlock-title" className="mt-3 text-center font-serif text-2xl font-bold tracking-tight text-foreground">
              디자인 해금!
            </h2>
            <p className="mt-3 text-center text-sm font-medium text-foreground/90">{label}</p>
            <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
              촛불이 쌓일수록 케이크가 더 화려해져요. 계속 응원해 주세요.
            </p>
            <button
              type="button"
              className="u-cta-primary mt-6 w-full py-3 text-sm"
              onClick={onClose}
            >
              좋아요!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
