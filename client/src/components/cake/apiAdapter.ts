import type { Cake as ApiCake, Candle as ApiCandle } from "@/types/api";
import { normalizeCandleColor } from "./candleColors";
import type { CakeFlavor, CandleColor } from "./types";

export function apiFlavorToCakeFlavor(flavor: ApiCake["flavor"]): CakeFlavor {
  const map: Record<ApiCake["flavor"], CakeFlavor> = {
    CHOCOLATE: "chocolate",
    STRAWBERRY: "strawberry",
    VANILLA: "vanilla",
    MANGO: "mango",
    MATCHA: "matcha",
    CHEESE: "cheese",
    LEMON: "lemon",
    GREEN_GRAPE: "greenGrape",
    RED_GRAPE: "redGrape",
    BLUEBERRY: "blueberry",
  };
  return map[flavor];
}

export function apiCandlesToCandleColors(candles: ApiCandle[]): CandleColor[] {
  return candles.map((candle, index) => {
    const fallback: CandleColor = index % 5 === 0 ? "yellow" : index % 5 === 1 ? "pink" : index % 5 === 2 ? "lime" : index % 5 === 3 ? "blue" : "orange";
    return normalizeCandleColor(candle.candleColor, fallback);
  });
}
