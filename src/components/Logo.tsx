/**
 * Logo — marcador oficial do Sonora.
 * Um equalizador (barras de áudio) dentro de um badge arredondado na cor de destaque:
 * lê instantaneamente como "música/áudio" e combina com a estética minimalista.
 */
interface Props {
  size?: number;
  color?: string;
  animated?: boolean;
  className?: string;
}

export function Logo({ size = 32, color = "#8b5cf6", animated = false, className }: Props) {
  const gid = `mc-sheen-${color.replace("#", "")}`;
  // alturas estáticas (de baixo para cima) — tops calculados a partir de bottom y=36
  const bars = [
    { x: 8, h: 16 },
    { x: 15, h: 24 },
    { x: 22, h: 19 },
    { x: 29, h: 27 },
    { x: 36, h: 20 },
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Sonora"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="13" fill={color} />
      <rect x="1" y="1" width="46" height="46" rx="13" fill={`url(#${gid})`} />
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={36 - b.h}
          width="4"
          height={b.h}
          rx="2"
          fill="#ffffff"
          className={animated ? "eq-bar" : undefined}
          style={animated
            ? { transformBox: "fill-box", transformOrigin: "bottom", animation: `eq 1.1s ease-in-out ${i * 0.15}s infinite` }
            : undefined}
        />
      ))}
    </svg>
  );
}
