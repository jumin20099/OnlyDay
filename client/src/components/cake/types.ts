export type CakeFlavor =
  | "chocolate"
  | "strawberry"
  | "vanilla"
  | "cheese"
  | "mango"
  | "matcha"
  | "lemon"
  | "greenGrape"
  | "redGrape"
  | "blueberry";

export type CandleColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "lime"
  | "blue"
  | "navy"
  | "purple"
  | "black"
  | "white"
  | "pink";

export type ToppingKind =
  | "chunks"
  | "slices"
  | "pearls"
  | "crumbs"
  | "cubes"
  | "powder"
  | "zest"
  | "grapes"
  | "berries";

export type CakeTheme = {
  id: CakeFlavor;
  label: string;
  base: {
    top: string;
    mid: string;
    bottom: string;
    sideShadow: string;
  };
  cream: {
    top: string;
    drip: string;
    highlight: string;
  };
  topping: {
    kind: ToppingKind;
    primary: string;
    secondary: string;
    accent: string;
  };
  glow: string;
};

export type CakeThemeOverride = Partial<{
  label: string;
  base: Partial<CakeTheme["base"]>;
  cream: Partial<CakeTheme["cream"]>;
  topping: Partial<CakeTheme["topping"]>;
  glow: string;
}>;

export type CakeProps = {
  flavor: CakeFlavor;
  candleCount: number;
  candleColors: CandleColor[];
  unlocked: boolean;
  className?: string;
  progressGoal?: number;
  themeOverride?: CakeThemeOverride;
  premiumGlow?: boolean;
  "aria-label"?: string;
};

export type CakeLayerProps = {
  theme: CakeTheme;
  locked: boolean;
  idPrefix: string;
};
