import type { CakeLayerProps } from "./types";

export function CakeBase({ theme, locked, idPrefix }: CakeLayerProps) {
  const opacity = locked ? 0.58 : 1;
  return (
    <g opacity={opacity}>
      <ellipse cx="200" cy="214" rx="118" ry="28" fill={`url(#${idPrefix}-baseTop)`} />
      <path d="M82 214v84c0 16 53 30 118 30s118-14 118-30v-84Z" fill={`url(#${idPrefix}-baseSide)`} />
      <ellipse cx="200" cy="298" rx="118" ry="30" fill={theme.base.bottom} opacity="0.88" />
      <ellipse cx="164" cy="205" rx="60" ry="12" fill="rgba(255,255,255,0.32)" />
      <path d="M90 252c25 14 66 22 110 22s85-8 110-22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M238 314c24-4 50-12 70-24" fill="none" stroke="rgba(15,23,42,0.16)" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}
