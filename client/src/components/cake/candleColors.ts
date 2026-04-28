import type { CandleColor } from "./types";

export const CANDLE_COLOR_HEX: Record<CandleColor, { body: string; shadow: string; wick: string }> = {
  red: { body: "#ef4444", shadow: "#b91c1c", wick: "#7f1d1d" },
  orange: { body: "#fb923c", shadow: "#ea580c", wick: "#7c2d12" },
  yellow: { body: "#facc15", shadow: "#ca8a04", wick: "#713f12" },
  green: { body: "#22c55e", shadow: "#15803d", wick: "#14532d" },
  lime: { body: "#a3e635", shadow: "#65a30d", wick: "#365314" },
  blue: { body: "#60a5fa", shadow: "#2563eb", wick: "#1e3a8a" },
  navy: { body: "#1e3a8a", shadow: "#172554", wick: "#020617" },
  purple: { body: "#a78bfa", shadow: "#7c3aed", wick: "#4c1d95" },
  black: { body: "#111827", shadow: "#020617", wick: "#020617" },
  white: { body: "#f8fafc", shadow: "#cbd5e1", wick: "#64748b" },
  pink: { body: "#f9a8d4", shadow: "#ec4899", wick: "#831843" },
};

export function normalizeCandleColor(value: string | undefined, fallback: CandleColor = "yellow"): CandleColor {
  const lower = value?.toLowerCase();
  if (lower && lower in CANDLE_COLOR_HEX) return lower as CandleColor;
  if (!value) return fallback;
  if (value.startsWith("#")) {
    const color = value.toLowerCase();
    if (color.startsWith("#ef") || color.startsWith("#fb71")) return "red";
    if (color.startsWith("#fb9") || color.startsWith("#fd")) return "orange";
    if (color.startsWith("#fa") || color.startsWith("#fe")) return "yellow";
    if (color.startsWith("#22") || color.startsWith("#16")) return "green";
    if (color.startsWith("#a3") || color.startsWith("#84")) return "lime";
    if (color.startsWith("#60") || color.startsWith("#3b")) return "blue";
    if (color.startsWith("#1e") || color.startsWith("#0f")) return "navy";
    if (color.startsWith("#a7") || color.startsWith("#8b") || color.startsWith("#c4")) return "purple";
    if (color.startsWith("#11") || color.startsWith("#00")) return "black";
    if (color.startsWith("#f8") || color.startsWith("#ff")) return "white";
    if (color.startsWith("#f9") || color.startsWith("#ec")) return "pink";
  }
  return fallback;
}
