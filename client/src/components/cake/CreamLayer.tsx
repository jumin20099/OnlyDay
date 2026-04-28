import type { CakeLayerProps } from "./types";

const drips = [
  "M96 199c12 10 5 35 18 48 13-12 7-36 21-48",
  "M140 211c8 14 4 43 20 56 16-14 9-41 23-56",
  "M197 217c8 12 5 34 17 44 13-11 7-33 18-44",
  "M245 212c11 12 5 39 20 51 15-12 8-38 22-51",
  "M291 198c10 10 5 31 17 41 12-10 6-31 19-41",
];

export function CreamLayer({ theme, locked, idPrefix }: CakeLayerProps) {
  return (
    <g opacity={locked ? 0.62 : 1}>
      <ellipse cx="200" cy="190" rx="122" ry="33" fill={`url(#${idPrefix}-creamTop)`} />
      <path
        d="M78 189c22 25 68 38 122 38s100-13 122-38c-8 38-58 59-122 59S86 227 78 189Z"
        fill={theme.cream.drip}
        opacity="0.94"
      />
      {drips.map((d) => (
        <path key={d} d={d} fill={theme.cream.drip} opacity="0.96" />
      ))}
      <path
        d="M88 190c25 17 63 25 112 25 48 0 88-8 113-25"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <ellipse cx="166" cy="178" rx="62" ry="13" fill={theme.cream.highlight} opacity="0.72" />
      <ellipse cx="235" cy="186" rx="40" ry="9" fill="rgba(255,255,255,0.28)" />
      <path d="M264 227c18-4 32-13 44-25" fill="none" stroke="rgba(15,23,42,0.12)" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}
