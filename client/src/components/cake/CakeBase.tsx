import type { CakeLayerProps } from "./types";

export function CakeBase({ theme, locked, idPrefix }: CakeLayerProps) {
  const opacity = locked ? 0.58 : 1;
  return (
    <g opacity={opacity}>
      <ellipse cx="200" cy="214" rx="118" ry="28" fill={`url(#${idPrefix}-baseTop)`} />
      <path d="M82 214v76c0 15 53 28 118 28s118-13 118-28v-76Z" fill={`url(#${idPrefix}-baseSide)`} />
      <ellipse cx="164" cy="205" rx="60" ry="12" fill="rgba(255,255,255,0.32)" />
      <path d="M236 320c22-4 46-11 64-22" fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
