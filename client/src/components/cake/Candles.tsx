import { Candle } from "./Candle";
import type { CandleColor } from "./types";

type Props = {
  count: number;
  colors: CandleColor[];
  locked: boolean;
};

function positionFor(index: number, count: number) {
  if (count <= 1) return { x: 200, y: 126, scale: 1 };
  const rowSize = Math.ceil(Math.sqrt(count));
  const row = Math.floor(index / rowSize);
  const col = index % rowSize;
  const rows = Math.ceil(count / rowSize);
  const itemsInRow = row === rows - 1 ? count - row * rowSize : rowSize;
  const normalizedCol = itemsInRow === 1 ? 0.5 : col / (itemsInRow - 1);
  const normalizedRow = rows === 1 ? 0.5 : row / (rows - 1);
  const rx = 88 - row * 5;
  const x = 200 - rx + normalizedCol * rx * 2;
  const y = 118 + normalizedRow * 58 + Math.sin((index + 1) * 1.7) * 4;
  const edge = Math.abs(normalizedCol - 0.5) * 2;
  const scale = 0.82 + (1 - edge) * 0.12 - Math.max(0, count - 24) * 0.004;
  return { x, y, scale: Math.max(0.56, scale) };
}

export function Candles({ count, colors, locked }: Props) {
  const safeCount = Math.max(0, Math.floor(count));
  const palette = colors.length > 0 ? colors : (["yellow"] satisfies CandleColor[]);

  return (
    <g>
      {Array.from({ length: safeCount }).map((_, index) => {
        const pos = positionFor(index, safeCount);
        return (
          <Candle
            key={index}
            color={palette[index % palette.length]}
            x={pos.x}
            y={pos.y}
            scale={pos.scale}
            delay={(index % 7) * 110}
            locked={locked}
          />
        );
      })}
    </g>
  );
}
