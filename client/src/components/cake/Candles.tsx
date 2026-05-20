import { Candle } from "./Candle";
import type { CandleColor } from "./types";

type Props = {
  count: number;
  colors: CandleColor[];
  locked: boolean;
  visualLevel?: number;
};

function topTierForLevel(level: number) {
  if (level >= 4) return { scale: 0.64, topY: 96 };
  if (level >= 3) return { scale: 0.72, topY: 132 };
  return { scale: 1, topY: 214 };
}

function positionFor(index: number, count: number, visualLevel: number) {
  const tier = topTierForLevel(visualLevel);
  if (count <= 1) {
    return {
      x: 200,
      y: tier.topY + (126 - 214) * tier.scale,
      scale: 0.78 + tier.scale * 0.2,
    };
  }
  const rowSize = Math.ceil(Math.sqrt(count));
  const row = Math.floor(index / rowSize);
  const col = index % rowSize;
  const rows = Math.ceil(count / rowSize);
  const itemsInRow = row === rows - 1 ? count - row * rowSize : rowSize;
  const normalizedCol = itemsInRow === 1 ? 0.5 : col / (itemsInRow - 1);
  const normalizedRow = rows === 1 ? 0.5 : row / (rows - 1);
  const rx = 88 - row * 5;
  const baseX = 200 - rx + normalizedCol * rx * 2;
  const baseY = 118 + normalizedRow * 58 + Math.sin((index + 1) * 1.7) * 4;
  const edge = Math.abs(normalizedCol - 0.5) * 2;
  const baseScale = 0.82 + (1 - edge) * 0.12 - Math.max(0, count - 24) * 0.004;

  return {
    x: 200 + (baseX - 200) * tier.scale,
    y: tier.topY + (baseY - 214) * tier.scale,
    scale: Math.max(0.5, baseScale * (0.78 + tier.scale * 0.2)),
  };
}

export function Candles({ count, colors, locked, visualLevel = 1 }: Props) {
  const safeCount = Math.max(0, Math.floor(count));
  const palette = colors.length > 0 ? colors : (["yellow"] satisfies CandleColor[]);

  return (
    <g>
      {Array.from({ length: safeCount }).map((_, index) => {
        const pos = positionFor(index, safeCount, visualLevel);
        return (
          <Candle
            key={index}
            color={palette[index % palette.length]}
            x={pos.x}
            y={pos.y}
            scale={pos.scale}
            delay={(index % 7) * 110}
            locked={locked}
            visualLevel={visualLevel}
          />
        );
      })}
    </g>
  );
}
