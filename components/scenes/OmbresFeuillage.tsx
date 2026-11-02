/**
 * Ombres de feuillage qui ondulent lentement (lumière de fin d'après-midi).
 * Formes de feuilles floues en SVG, mélangées en « multiply » : aucune image.
 * Animation CSS lente, coupée par prefers-reduced-motion (règle globale).
 */
const FEUILLES: [number, number, number, number][] = [
  // x, y, rotation, échelle
  [8, 12, -30, 1.2],
  [16, 4, 20, 0.9],
  [4, 26, 60, 1],
  [22, 18, -10, 1.1],
  [12, 36, 35, 0.8],
  [28, 8, -50, 0.85],
  [30, 30, 15, 1],
  [6, 48, -20, 0.9],
  [20, 44, 50, 1.05],
  [36, 20, -35, 0.75],
  [40, 4, 10, 0.9],
  [2, 64, 30, 1.1],
  [14, 60, -45, 0.8],
];

export function OmbresFeuillage({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden mix-blend-multiply ${className}`}>
      <svg className="ombres-feuillage absolute -left-[5%] -top-[5%] h-[115%] w-[70%]" viewBox="0 0 60 80" preserveAspectRatio="xMinYMin slice">
        <defs>
          <filter id="flou-feuille" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
          <path id="feuille" d="M0 0C2.6-1.8 6.2-1.6 8 0C6.2 1.6 2.6 1.8 0 0Z" />
        </defs>
        <g filter="url(#flou-feuille)" fill="#5c472f" opacity="0.32">
          {FEUILLES.map(([x, y, r, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
              <use href="#feuille" />
              <use href="#feuille" transform="translate(5 3) rotate(35) scale(.8)" />
              <use href="#feuille" transform="translate(4 -3) rotate(-30) scale(.75)" />
              <path d="M-1 0 L10 1.5" stroke="#5c472f" strokeWidth=".25" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
