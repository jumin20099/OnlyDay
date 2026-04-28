import type { CakeLayerProps } from "./types";

type Point = readonly [number, number];

const points: Point[] = [
  [138, 176],
  [166, 164],
  [198, 174],
  [232, 163],
  [263, 178],
  [181, 191],
  [222, 191],
] as const satisfies Point[];

export function Topping({ theme, locked }: CakeLayerProps) {
  const opacity = locked ? 0.48 : 1;
  const kind = theme.topping.kind;

  return (
    <g opacity={opacity}>
      {kind === "chunks" &&
        points.map(([x, y], i) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={16 + (i % 2) * 5}
            height={11 + (i % 3) * 3}
            rx="3"
            fill={i % 2 ? theme.topping.primary : theme.topping.secondary}
            transform={`rotate(${(i % 2 ? 1 : -1) * (12 + i * 4)} ${x} ${y})`}
          />
        ))}

      {kind === "slices" &&
        points.map(([x, y], i) => (
          <g key={`${x}-${y}`} transform={`rotate(${i * 18} ${x} ${y})`}>
            <path d={`M${x} ${y}c10-15 31-6 24 12-6 17-28 10-24-12Z`} fill={theme.topping.primary} />
            <path d={`M${x + 8} ${y + 2}c5-5 13-3 14 3`} fill="none" stroke={theme.topping.accent} strokeWidth="2" />
          </g>
        ))}

      {kind === "pearls" &&
        points.concat([[118, 190], [284, 191]] as const).map(([x, y], i) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={i % 3 === 0 ? 7 : 5} fill={i % 2 ? theme.topping.primary : theme.topping.secondary} />
        ))}

      {kind === "crumbs" &&
        Array.from({ length: 28 }).map((_, i) => {
          const x = 120 + ((i * 31) % 160);
          const y = 165 + ((i * 17) % 38);
          return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill={i % 2 ? theme.topping.primary : theme.topping.secondary} opacity="0.9" />;
        })}

      {kind === "cubes" &&
        points.map(([x, y], i) => (
          <path
            key={`${x}-${y}`}
            d={`M${x} ${y}l13-6 13 6v14l-13 7-13-7Z`}
            fill={i % 2 ? theme.topping.primary : theme.topping.secondary}
            opacity="0.95"
          />
        ))}

      {kind === "powder" &&
        Array.from({ length: 44 }).map((_, i) => {
          const x = 102 + ((i * 29) % 196);
          const y = 160 + ((i * 13) % 47);
          return <circle key={i} cx={x} cy={y} r={1.3 + (i % 3) * 0.6} fill={theme.topping.primary} opacity={0.35 + (i % 4) * 0.12} />;
        })}

      {kind === "zest" &&
        points.concat([[119, 188], [285, 189], [206, 157]] as const).map(([x, y], i) => (
          <path
            key={`${x}-${y}`}
            d={`M${x} ${y}c8-9 18-9 26-1`}
            fill="none"
            stroke={i % 2 ? theme.topping.primary : theme.topping.secondary}
            strokeLinecap="round"
            strokeWidth="4"
          />
        ))}

      {kind === "grapes" &&
        points.map(([x, y], i) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="8" fill={theme.topping.primary} />
            <circle cx={x + 9} cy={y + 6} r="7" fill={theme.topping.secondary} />
            <circle cx={x + 4} cy={y + 13} r="6" fill={i % 2 ? theme.topping.primary : theme.topping.secondary} />
          </g>
        ))}

      {kind === "berries" &&
        points.concat([[121, 190], [280, 187]] as const).map(([x, y], i) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={8 + (i % 2)} fill={theme.topping.primary} />
            <circle cx={x - 3} cy={y - 3} r="2.5" fill={theme.topping.accent} opacity="0.9" />
          </g>
        ))}
    </g>
  );
}
