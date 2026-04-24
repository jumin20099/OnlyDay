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
          className="fixed inset-0 z-[180] flex items-end justify-center bg-black/55 p-4 pb-8 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="unlock-title"
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border-2 border-amber-200/50 bg-gradient-to-br from-amber-50 via-pink-50 to-fuchsia-100 p-6 shadow-2xl"
            initial={{ y: 40, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 text-7xl opacity-30">✦</div>
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-amber-800/70">
              achievement
            </p>
            <h2 id="unlock-title" className="mt-2 text-center font-serif text-2xl text-amber-900">
              디자인 해금!
            </h2>
            <p className="mt-3 text-center text-sm text-amber-900/80">{label}</p>
            <p className="mt-1 text-center text-xs text-amber-900/60">
              촛불이 쌓일수록 케이크가 더 화려해져요. 계속 응원해 주세요.
            </p>
            <button
              type="button"
              className="mt-5 w-full rounded-2xl bg-amber-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-500"
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
