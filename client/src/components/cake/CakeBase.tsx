import type { CakeLayerProps } from "./types";

export function CakeBase({ theme, locked, idPrefix }: CakeLayerProps) {
  const opacity = locked ? 0.58 : 1;
  return (
    <g opacity={opacity}>
      <ellipse cx="200" cy="214" rx="126" ry="34" fill={`url(#${idPrefix}-baseTop)`} />
      <path
        d="M74 210c0 50 56 82 126 82s126-32 126-82v46c0 52-56 86-126 86S74 308 74 256v-46Z"
        fill={`url(#${idPrefix}-baseSide)`}
      />
      <path
        d="M80 218c14 30 62 50 120 50s106-20 120-50v37c-20 26-65 41-120 41S100 281 80 255v-37Z"
        fill="rgba(255,255,255,0.13)"
      />
      <path
        d="M222 222c49-1 86-11 104-30v62c-9 31-43 57-88 72 42-24 64-59 64-98v-26c-20 12-47 18-80 20Z"
        fill="rgba(15,23,42,0.18)"
      />
      <ellipse cx="200" cy="256" rx="126" ry="38" fill={theme.base.bottom} opacity="0.9" />
      <ellipse cx="158" cy="198" rx="70" ry="16" fill="rgba(255,255,255,0.28)" />
      <path d="M94 242c25 20 65 31 106 31s80-10 106-30" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="4" strokeLinecap="round" />
      <path d="M236 286c31-6 57-18 73-35" fill="none" stroke="rgba(15,23,42,0.16)" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}
