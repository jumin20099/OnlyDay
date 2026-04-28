import type { CakeFlavor, CakeTheme, CakeThemeOverride } from "./types";

export const CAKE_THEMES: Record<CakeFlavor, CakeTheme> = {
  chocolate: {
    id: "chocolate",
    label: "초콜릿",
    base: { top: "#7c4a2f", mid: "#5b3425", bottom: "#3f241b", sideShadow: "#2b1813" },
    cream: { top: "#ead7c4", drip: "#d9b99b", highlight: "#fff4e6" },
    topping: { kind: "chunks", primary: "#2f1a13", secondary: "#7b4a35", accent: "#f3d6b8" },
    glow: "#c08457",
  },
  strawberry: {
    id: "strawberry",
    label: "딸기",
    base: { top: "#ffd3df", mid: "#fda4b8", bottom: "#f47295", sideShadow: "#d94d75" },
    cream: { top: "#fff7fb", drip: "#ffd8e5", highlight: "#ffffff" },
    topping: { kind: "slices", primary: "#fb7185", secondary: "#fecdd3", accent: "#fff1f2" },
    glow: "#fb7185",
  },
  vanilla: {
    id: "vanilla",
    label: "바닐라",
    base: { top: "#fff6d8", mid: "#f7dca2", bottom: "#e8bd6f", sideShadow: "#cf9b50" },
    cream: { top: "#fffdf7", drip: "#fff2c4", highlight: "#ffffff" },
    topping: { kind: "pearls", primary: "#f8fafc", secondary: "#fde68a", accent: "#c4b5fd" },
    glow: "#fde68a",
  },
  cheese: {
    id: "cheese",
    label: "치즈",
    base: { top: "#fff1a8", mid: "#facc55", bottom: "#e5a93a", sideShadow: "#bd7c22" },
    cream: { top: "#fffbea", drip: "#fde68a", highlight: "#ffffff" },
    topping: { kind: "crumbs", primary: "#f59e0b", secondary: "#fde68a", accent: "#fff7ed" },
    glow: "#fbbf24",
  },
  mango: {
    id: "mango",
    label: "망고",
    base: { top: "#ffdf7e", mid: "#fbad37", bottom: "#f97316", sideShadow: "#c75a12" },
    cream: { top: "#fff7d6", drip: "#ffd166", highlight: "#ffffff" },
    topping: { kind: "cubes", primary: "#f59e0b", secondary: "#fde047", accent: "#fff7ed" },
    glow: "#f59e0b",
  },
  matcha: {
    id: "matcha",
    label: "말차",
    base: { top: "#bfe6a8", mid: "#83bd69", bottom: "#4d7c4d", sideShadow: "#345c36" },
    cream: { top: "#f4ffe8", drip: "#d9f99d", highlight: "#ffffff" },
    topping: { kind: "powder", primary: "#3f7f40", secondary: "#86efac", accent: "#f0fdf4" },
    glow: "#86efac",
  },
  lemon: {
    id: "lemon",
    label: "레몬",
    base: { top: "#fff79a", mid: "#fde047", bottom: "#eab308", sideShadow: "#b58105" },
    cream: { top: "#fffff1", drip: "#fef08a", highlight: "#ffffff" },
    topping: { kind: "zest", primary: "#facc15", secondary: "#84cc16", accent: "#fffde7" },
    glow: "#facc15",
  },
  greenGrape: {
    id: "greenGrape",
    label: "청포도",
    base: { top: "#dcfce7", mid: "#86efac", bottom: "#4ade80", sideShadow: "#22a35a" },
    cream: { top: "#f7fee7", drip: "#d9f99d", highlight: "#ffffff" },
    topping: { kind: "grapes", primary: "#a3e635", secondary: "#bef264", accent: "#ecfccb" },
    glow: "#a3e635",
  },
  redGrape: {
    id: "redGrape",
    label: "적포도",
    base: { top: "#f0c4ff", mid: "#c084fc", bottom: "#9333ea", sideShadow: "#6b21a8" },
    cream: { top: "#fbf5ff", drip: "#e9d5ff", highlight: "#ffffff" },
    topping: { kind: "grapes", primary: "#7e22ce", secondary: "#c084fc", accent: "#f3e8ff" },
    glow: "#c084fc",
  },
  blueberry: {
    id: "blueberry",
    label: "블루베리",
    base: { top: "#c7d2fe", mid: "#818cf8", bottom: "#4f46e5", sideShadow: "#3730a3" },
    cream: { top: "#f8fbff", drip: "#dbeafe", highlight: "#ffffff" },
    topping: { kind: "berries", primary: "#3730a3", secondary: "#6366f1", accent: "#bfdbfe" },
    glow: "#818cf8",
  },
};

export function resolveCakeTheme(flavor: CakeFlavor, override?: CakeThemeOverride): CakeTheme {
  const base = CAKE_THEMES[flavor];
  return {
    ...base,
    ...override,
    base: { ...base.base, ...override?.base },
    cream: { ...base.cream, ...override?.cream },
    topping: { ...base.topping, ...override?.topping },
  };
}
