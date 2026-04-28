import type { Cake } from "@/types/api";

export const FLAVOR_THEME: Record<
  Cake["flavor"],
  { label: string; hero: [string, string, string]; accent: string; emoji: string }
> = {
  STRAWBERRY: {
    label: "딸기",
    hero: ["#fff5f7", "#ffe4ec", "#fbcfe8"],
    accent: "#f472b6",
    emoji: "🍓",
  },
  VANILLA: {
    label: "바닐라",
    hero: ["#fffef9", "#fef3c7", "#fde68a"],
    accent: "#d4a574",
    emoji: "🤍",
  },
  CHOCOLATE: {
    label: "초콜릿",
    hero: ["#faf5f0", "#e7d4c8", "#d4b8a5"],
    accent: "#8b5e3c",
    emoji: "🍫",
  },
  MATCHA: {
    label: "말차",
    hero: ["#f7fcf7", "#d9f0d9", "#b6e0b6"],
    accent: "#4d7c4d",
    emoji: "🍵",
  },
  MANGO: {
    label: "망고",
    hero: ["#fffbeb", "#fef3c7", "#fde68a"],
    accent: "#f59e0b",
    emoji: "🥭",
  },
  CHEESE: {
    label: "치즈",
    hero: ["#fff8cf", "#fee68b", "#facc15"],
    accent: "#d97706",
    emoji: "🧀",
  },
  LEMON: {
    label: "레몬",
    hero: ["#fffde8", "#fef08a", "#facc15"],
    accent: "#ca8a04",
    emoji: "🍋",
  },
  GREEN_GRAPE: {
    label: "청포도",
    hero: ["#f2fee8", "#c7f9a4", "#86efac"],
    accent: "#4d7c0f",
    emoji: "🍇",
  },
  RED_GRAPE: {
    label: "적포도",
    hero: ["#f6e9ff", "#d8b4fe", "#c084fc"],
    accent: "#7e22ce",
    emoji: "🍇",
  },
  BLUEBERRY: {
    label: "블루베리",
    hero: ["#edf3ff", "#bfdbfe", "#93c5fd"],
    accent: "#1d4ed8",
    emoji: "🫐",
  },
};

export const CANDLE_PRESET_SWATCHES = [
  { id: "rose", color: "#fb7185", label: "로즈" },
  { id: "amber", color: "#fbbf24", label: "앰버" },
  { id: "peach", color: "#fda4af", label: "피치" },
  { id: "lavender", color: "#c4b5fd", label: "라벤더" },
  { id: "mint", color: "#6ee7b7", label: "민트" },
] as const;

export const UNLOCK_LABELS: Record<string, string> = {
  TOPPING_SPARKLE: "스파클 토핑",
  FANCY_CANDLES: "특별 촛불 효과",
  GOLDEN_LAYER: "골든 레이어",
};

/** 축하 팝업·주인 ‘나중에 보기’ 큐에서 사용하는 표시 순서 */
export const UNLOCK_FEATURE_ORDER = ["TOPPING_SPARKLE", "FANCY_CANDLES", "GOLDEN_LAYER"] as const;

export function completionGoalCandleCount(unlockStates: { thresholdCount: number }[]): number {
  if (unlockStates.length === 0) return 30;
  return Math.max(...unlockStates.map((u) => u.thresholdCount));
}
