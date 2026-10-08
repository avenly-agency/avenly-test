import { useId, type CSSProperties } from 'react';

// PRODUKTY przykładowego sklepu w kadrze - ilustracje SVG z cieniowaniem (światło z lewej góry, rant, połysk, cień
// na podłożu), żeby sklep wyglądał jak dopracowany sklep marki, a nie makieta z brył. Kolor wariantu = zmienna CSS
// --prod (ustawia ShopProvider albo styl miniatury); odcienie liczy CSS (color-mix w sklep.css: --p-hi / --p-lo).
//   ceramika: 0 wazon, 1 butla, 2 misa, 3 kubek (szkliwo w kolorze wariantu, spód z surowej gliny).

const CERAMIC = [
  { body: 'M80 22C78 46 72 60 64 76C46 110 30 134 30 172C30 214 60 240 100 240C140 240 170 214 170 172C170 134 154 110 136 76C128 60 122 46 120 22Z', rim: [100, 22, 20, 5], raw: 204, hi: 'M50 176C48 142 62 116 76 92' },
  { body: 'M89 20V76C89 96 52 114 52 170C52 214 72 240 100 240C128 240 148 214 148 170C148 114 111 96 111 76V20Z', rim: [100, 20, 11, 3.2], raw: 208, hi: 'M68 180C66 150 78 128 92 108' },
  { body: 'M24 132C24 198 58 240 100 240C142 240 176 198 176 132Z', rim: [100, 132, 76, 13], raw: 214, hi: 'M42 160C46 190 60 210 76 222' },
  { body: 'M56 98L62 222C63 232 74 240 100 240C126 240 137 232 138 222L144 98Z', rim: [100, 98, 44, 9], raw: 212, hi: 'M70 122L74 206' },
];

export const Product = ({ k = 0, className, style }: { brand?: number; k?: number; className?: string; style?: CSSProperties }) => {
  const id = useId().replace(/:/g, '');
  const g = `skp-g-${id}`, c = `skp-c-${id}`, s = `skp-s-${id}`, r = `skp-r-${id}`;
  const cls = className ? `sk-prod ${className}` : 'sk-prod';
  const shade = (
    <linearGradient id={g} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" className="sk-prod-hi" />
      <stop offset=".42" className="sk-prod-mid" />
      <stop offset="1" className="sk-prod-lo" />
    </linearGradient>
  );
  const ground = (
    <radialGradient id={s} cx=".5" cy=".5" r=".5">
      <stop offset="0" stopColor="#1a130b" stopOpacity=".34" />
      <stop offset="1" stopColor="#1a130b" stopOpacity="0" />
    </radialGradient>
  );

  // ceramika: szkliwo w kolorze wariantu, spód z surowej gliny, rant i wnętrze, połysk po lewej
  const v = CERAMIC[k % CERAMIC.length];
  const [rx, ry, rw, rh] = v.rim;
  return (
    <svg className={cls} style={style} viewBox="0 0 200 260" aria-hidden="true" focusable="false">
      <defs>
        {ground}{shade}
        <clipPath id={c}><path d={v.body} /></clipPath>
        <linearGradient id={r} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9d7b8" /><stop offset=".45" stopColor="#d6bf9c" /><stop offset="1" stopColor="#b59a75" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="243" rx={k === 2 ? 84 : 74} ry="10" fill={`url(#${s})`} />
      <path d={v.body} fill={`url(#${g})`} />
      <g clipPath={`url(#${c})`}>
        <path d={`M0 ${v.raw}Q100 ${v.raw + 16} 200 ${v.raw}V260H0Z`} fill={`url(#${r})`} />
      </g>
      <ellipse cx={rx} cy={ry} rx={rw} ry={rh} className="sk-prod-rim" />
      <ellipse cx={rx} cy={ry + rh * 0.12} rx={rw * 0.82} ry={rh * 0.7} fill="#1a130b" opacity=".62" />
      <path d={v.hi} fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};
