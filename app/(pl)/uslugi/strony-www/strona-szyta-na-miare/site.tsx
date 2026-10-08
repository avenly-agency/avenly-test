import type { CSSProperties } from 'react';
import { ArrowUpRight, MousePointer2 } from 'lucide-react';
import type { CustomCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';

// PRZYKŁADOWA STRONA FIRMY W KADRZE („twoja-marka.pl”) - cztery UJĘCIA, nie cztery plansze (właściciel 2026-10-02:
// „makiety i animacje motion daj bardziej cinematic”). Kinowość = język kamery znany ze strony głównej, bez dosłownych
// rekwizytów kina:
//   1 PIERWSZY EKRAN (nastrój) - ujęcie otwierające: HORYZONT ze słońcem w kolorze podstrony. Kamera powoli NAJEŻDŻA
//                                (--z): plany rosną w różnym tempie (bliższe szybciej), więc obraz ma głębię,
//   2 OFERTA (ruch)            - kamera WLATUJE W SŁOŃCE (--fly), a ekran oferty ROZCHODZI SIĘ od słońca miękką,
//                                nieregularną plamą (--iris); potem JAZDA W BOK wzdłuż dużych kart usług (--mv),
//   3 REALIZACJE (głębia)      - RUNDA 6 (właściciel 2026-10-05: „w mockupie pierwszym po usługach dodaj coś ciekawego
//                                jeszcze, jakąś sekcję cinematic, żeby ludzie widzieli, plus trochę więcej tam dodaj”):
//                                następna sekcja nadchodzi z prawej kilkoma obłokami (--rz), a kamera LECI W GŁĄB
//                                kolumnady łuków do światła na jej końcu (--fc; postój przy każdej realizacji - łuk
//                                z numerem, po lewej jej nazwa). Światło na końcu kolumnady to TEN SAM kształt co na
//                                ekranie kontaktu (ten sam znacznik .sm-st-orb, tylko daleko) - kamera dolatuje do
//                                niego i ekran kontaktu jest już pod spodem (cięcie na dopasowanie),
//   4 KONTAKT (gest)           - ekran realizacji zbiega się miękką plamą na kształcie z kręgów (--out); kursor
//                                dotyka kształtu, kamera robi krótki najazd, kształt odpowiada falą.
// RUNDA 5 (2026-10-05): właściciel wybrał scenę główną „Horyzont” i poprosił: „zrób ładniej to i daj kilka propozycji
// samego horyzontu” - cztery krajobrazy pierwszego ekranu (`scene`, przełącznik w panelu na dole ekranu):
//   ridge „Grzbiety” - pięć planów grzbietów z warstwicami (rytowane linie jak mapa warstwic strony głównej), słońce
//                      wschodzi zza nich, krawędź najdalszego grzbietu łapie jego światło, przez tarczę suną smugi chmur,
//   sea   „Tafla”    - płaski horyzont wody: słońce wynurza się z linii horyzontu, pod nim drabina odbicia z ostrych
//                      pasów, po tafli biegną rzadkie włosowe linie fal,
//   orbit „Orbita”   - krzywizna ogromnego globu (krawędź planety z hero strony głównej jako rysunek): małe słońce
//                      wychodzi zza łuku, łuk łapie światło, nad nim cienka linia atmosfery,
//   peak  „Szczyt”   - jedna monumentalna góra rytowana poziomymi warstwicami, słońce za jej ramieniem.
// Po wyborze właściciela pozostałe krajobrazy i ich style są do usunięcia.
// BEZ linii światła, która „leci” i podmienia jeden ekran na drugi, i bez kurtyn o prostej krawędzi (właściciel
// 2026-10-05 na podstronie CRM: „zrób animację taką pojawiania płynną, tak jak się nebula rozchodzi”) - ekrany 2 i 3
// pojawiają się maską z trzech miękkich plam (.sm-st-s2 / .sm-st-s3 w CSS). NIE wracać do koła z linią na krawędzi.
// Bez porównań z innymi usługami. PALETA = JĘZYK PODSTRONY: czerń, biel, włosowe linie i kolor podstrony (róż) jako
// światło; NIE wracać do jasnej / pastelowej makiety. Od Avenly odróżnia ją szeryfowy krój nagłówków i etykieta
// „Przykładowa strona”.
// Ekrany leżą jeden na drugim (kolejność w DOM: pierwszy ekran, kontakt, oferta, realizacje - to, co w opowieści
// późniejsze i zbiega się nad kontaktem, leży wyżej). Wymiary w em od jednej wielkości liczonej z okna kadru
// (cqw / cqh). Zmienne ruchu są zarejestrowane (@property w CSS), wartości początkowe = pierwszy ekran w pełnym
// świetle (bez JS i przy ograniczonym ruchu).
// --px / --py (-1..1) = położenie kursora odwiedzającego (film.tsx) - paralaksa planów.

type T = CustomCopy['site'];
export type Horizon = 'ridge' | 'sea' | 'orbit' | 'peak';

const Nav = ({ t }: { t: T }) => (
  <div className="sm-st-nav">
    <span className="sm-st-logo"><i />{t.brand}</span>
    <span className="sm-st-links">
      {t.nav.map((x) => <span key={x} className="sm-st-navlink">{x}</span>)}
      <span className="sm-st-navbtn">{t.navCta}</span>
    </span>
  </div>
);

/** Gradient krawędzi, która łapie światło słońca: biel przy bokach, kolor podstrony przy słońcu (ok. 72% szerokości). */
const RimGrad = ({ id }: { id: string }) => (
  <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
    <stop offset=".18" stopColor="#fff" stopOpacity=".2" />
    <stop offset=".72" style={{ stopColor: 'var(--c-acc)' }} stopOpacity=".95" />
    <stop offset="1" stopColor="#fff" stopOpacity=".3" />
  </linearGradient>
);

/** Górne krawędzie grzbietów od najdalszego do najbliższego (otwarte krzywe; wypełnienie domyka V / H). */
const RIDGE = [
  'M0 84C80 62 150 92 240 70S400 18 500 50S640 104 740 62S900 30 1000 56',
  'M0 116C100 86 190 124 290 100S470 50 580 88S780 132 880 96S960 76 1000 84',
  'M0 146C120 112 230 156 350 130S560 88 680 128S880 160 1000 118',
  'M0 178C140 146 270 194 410 164S640 136 770 172S930 186 1000 156',
  'M0 212C160 188 300 226 460 204S700 186 840 212S960 210 1000 198',
];

// WYDAJNOŚĆ (2026-10-06, właściciel: „zoptymalizuj całą podstronę pod względem wydajności”): każdy plan grzbietów to
// OSOBNY rysunek SVG (dawniej pięć grup w jednym). Plany rosną i przesuwają się z kamerą każdy we własnym tempie - jako
// osobne elementy są osobnymi warstwami i przeglądarka tylko je przesuwa, zamiast co klatkę przewijania rysować od nowa
// cały krajobraz razem z tekstem strony. Wygląd bez zmian (te same krzywe, kolejność i ruch - style w CSS, data-k).
const Ridges = ({ uid }: { uid: string }) => (
  <>
    {RIDGE.map((d, k) => (
      <svg key={d} className="sm-st-ridges" data-k={k} viewBox="0 0 1000 240" preserveAspectRatio="none" focusable="false">
        {k === 0 && <defs><RimGrad id={`sm-rim-${uid}`} /></defs>}
        <path className="sm-hz-fill" d={`${d}V262H0Z`} />
        {/* warstwice: ta sama krzywa niżej, coraz słabsza (rytowane linie zbocza) */}
        {[9, 20, 33].map((dy, c) => <path key={dy} className="sm-hz-cont" d={d} transform={`translate(0 ${dy})`} style={{ '--c': c } as CSSProperties} />)}
        {k === 0 ? <path className="sm-hz-rimline" d={d} stroke={`url(#sm-rim-${uid})`} /> : <path className="sm-hz-edge" d={d} />}
      </svg>
    ))}
  </>
);

/** Góra: grań (otwarta krzywa), przedpole i poziome warstwice przycięte do sylwetki. */
const PEAK = 'M0 244C110 236 190 220 262 192S372 118 430 82S478 34 506 28S566 64 606 92S712 150 772 172S904 214 1000 226';
const PEAK_LIT = 'M506 28C536 36 566 64 606 92S712 150 772 172S904 214 1000 226';
const FORE = 'M0 268C160 250 300 282 460 264S700 248 840 270S960 268 1000 260';

const Peak = ({ uid }: { uid: string }) => (
  <svg className="sm-hz-peak" viewBox="0 0 1000 300" preserveAspectRatio="none" focusable="false">
    <defs>
      <RimGrad id={`sm-rimp-${uid}`} />
      <clipPath id={`sm-pk-${uid}`}><path d={`${PEAK}V322H0Z`} /></clipPath>
    </defs>
    <g>
      <path className="sm-hz-fill" d={`${PEAK}V322H0Z`} />
      <g clipPath={`url(#sm-pk-${uid})`}>
        {Array.from({ length: 19 }, (_, k) => {
          const y = 46 + k * 14;
          return <path key={k} className="sm-hz-cont" d={`M0 ${y}Q250 ${y - 8} 500 ${y}T1000 ${y}`} style={{ '--c': k % 4 === 0 ? 0 : 2 } as CSSProperties} />;
        })}
      </g>
      <path className="sm-hz-edge" d={PEAK} />
      <path className="sm-hz-rimline" d={PEAK_LIT} stroke={`url(#sm-rimp-${uid})`} />
    </g>
    <g>
      <path className="sm-hz-fill" d={`${FORE}V322H0Z`} />
      <path className="sm-hz-cont" d={FORE} transform="translate(0 12)" style={{ '--c': 1 } as CSSProperties} />
      <path className="sm-hz-edge" d={FORE} />
    </g>
  </svg>
);

/** Ostre gwiazdy z czterema promieniami (jak „klejnoty” nieba w hero): [x %, y %, okres migotania s, opóźnienie s]. */
const GEMS: [number, number, number, number][] = [[12, 20, 5.2, 0], [31, 9, 6.4, 1.3], [48, 27, 4.6, 2.1], [64, 13, 7, 0.6], [88, 22, 5.6, 2.8], [93, 44, 6.2, 1.7]];

/** Numer porządkowy elementu jako zmienna CSS (--k). */
const ord = (n: number) => ({ '--k': n } as CSSProperties);
const nn = (n: number) => String(n + 1).padStart(2, '0');

/** Kształt z kręgów: na ekranie kontaktu z bliska, na końcu kolumnady realizacji z daleka (ten sam znacznik i te same
    style - gdy kamera do niego doleci, oba leżą dokładnie jeden na drugim). */
const Orb = () => (
  <div className="sm-st-orb">
    <i className="sm-st-orb-r" /><i className="sm-st-orb-r" /><i className="sm-st-orb-r" />
    <i className="sm-st-flare" />
    <i className="sm-st-orb-w" /><i className="sm-st-orb-w" />
    <b />
  </div>
);

/** Kolumnada realizacji: siedem łuków co pół kroku kamery; co drugi (0, 2, 4) to realizacja - jaśniejszy, z numerem. */
const GATES = [0, 1, 2, 3, 4, 5, 6];
const CASES = [0, 1, 2];

export const Site = ({ t, scene = 'ridge', uid = 'a' }: { t: T; scene?: Horizon; uid?: string }) => (
  <div className="sm-st" data-hz={scene}>
    <div className="sm-st-in">
      {/* 1 - pierwszy ekran: ujęcie otwierające */}
      <div className="sm-st-s sm-st-s1">
        <div className="sm-l sm-l-sky">
          <b /><i />
          {GEMS.map(([x, y, dur, delay]) => (
            <span key={x} className="sm-hz-gem" style={{ '--gx': `${x}%`, '--gy': `${y}%`, '--gt': `${dur}s`, '--gd': `${delay}s` } as CSSProperties} />
          ))}
        </div>
        <div className="sm-l sm-l-art">
          <span className="sm-st-sunw">
            <i className="sm-st-halo" /><i className="sm-st-halo" /><i className="sm-st-halo" />
            <i className="sm-st-flare" />
            <i className="sm-st-sun" />
          </span>
          {scene === 'ridge' && (
            <>
              <i className="sm-hz-cloud" style={ord(0)} /><i className="sm-hz-cloud" style={ord(1)} /><i className="sm-hz-cloud" style={ord(2)} />
              <Ridges uid={uid} />
            </>
          )}
          {scene === 'sea' && (
            <div className="sm-hz-water">
              <span className="sm-hz-refl">{Array.from({ length: 7 }, (_, n) => <i key={n} style={ord(n)} />)}</span>
              {Array.from({ length: 5 }, (_, n) => <b key={n} style={ord(n)} />)}
            </div>
          )}
          {scene === 'orbit' && (
            <>
              <i className="sm-hz-atmo" />
              <div className="sm-hz-planet"><i /><i /><i /><b /></div>
            </>
          )}
          {scene === 'peak' && <Peak uid={uid} />}
        </div>
        <div className="sm-l sm-l-type">
          <Nav t={t} />
          <div className="sm-st-hero">
            <p className="sm-st-h1">
              <span className="sm-st-m"><span>{t.h1a}</span></span>
              <span className="sm-st-m"><span><em>{t.h1b}</em></span></span>
            </p>
            <p className="sm-st-lead">{t.lead}</p>
            <div className="sm-st-actions">
              <span className="sm-st-btn">{t.cta}<ArrowUpRight /></span>
              <span className="sm-st-ghost">{t.more}</span>
            </div>
          </div>
          <p className="sm-st-foot"><span>01 / 04</span><i /></p>
        </div>
      </div>

      {/* 3 - kontakt (pod ekranem 2: oferta zbiega się nad nim miękką plamą) */}
      <div className="sm-st-s sm-st-s3">
        <div className="sm-st-cam3">
          <Orb />
          <Nav t={t} />
          <div className="sm-st-end">
            <p className="sm-st-h1"><em>{t.endTitle}</em></p>
            <p className="sm-st-q">{t.quote}</p>
            <p className="sm-st-qby">{t.quoteBy}</p>
            <span className="sm-st-btn">{t.endCta}<ArrowUpRight /></span>
          </div>
          <span className="sm-st-cur"><MousePointer2 /></span>
        </div>
      </div>

      {/* 2 - oferta: jazda kamery w bok wzdłuż kart usług */}
      <div className="sm-st-s sm-st-s2">
        <div className="sm-st-cam2">
          <span className="sm-st-mq"><span>{t.brand} · {t.brand} · {t.brand} · {t.brand}</span></span>
          <Nav t={t} />
          <div className="sm-st-works">
            <div className="sm-st-whead">
              <div>
                <p className="sm-st-eyebrow"><i />{t.worksEyebrow}</p>
                <p className="sm-st-h2">{t.worksTitle}</p>
              </div>
              <span className="sm-st-case">
                {t.caseCta}<ArrowUpRight />
                <span className="sm-st-case-f">{t.caseCta}<ArrowUpRight /></span>
              </span>
            </div>
            <div className="sm-st-track">
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className="sm-st-card" style={ord(n)}>
                  <span className="sm-st-card-art" data-v={n}>
                    <span><i /><i /><i /></span>
                    <b className="sm-st-card-n">{nn(n)}</b>
                    <em className="sm-st-card-go"><ArrowUpRight /></em>
                  </span>
                  <span className="sm-st-card-cap"><b>{t.project} {nn(n)}</b><span>{t.category}</span></span>
                  <span className="sm-st-card-d">{t.cardLead}</span>
                </div>
              ))}
            </div>
            <div className="sm-st-rail">
              <i />
              {[0, 1, 2, 3].map((n) => <b key={n} style={ord(n)} />)}
              <em />
            </div>
          </div>
        </div>
      </div>

      {/* realizacje (w opowieści po ofercie, przed kontaktem): lot kamery w głąb kolumnady łuków do światła */}
      <div className="sm-st-s sm-st-s4">
        <div className="sm-rz-in">
          <div className="sm-rz-cam">
            <span className="sm-rz-dust"><i /><b /></span>
            <div className="sm-rz-hall">
              <i className="sm-rz-rail sm-rz-rail--l" /><i className="sm-rz-rail sm-rz-rail--c" /><i className="sm-rz-rail sm-rz-rail--r" />
              <div className="sm-rz-far"><Orb /></div>
              {GATES.map((g) => {
                const named = g % 2 === 0 && g / 2 < CASES.length;
                return <span key={g} className="sm-rz-gate" data-p={named ? '' : undefined} style={ord(g)}>{named && <b>{nn(g / 2)}</b>}</span>;
              })}
            </div>
            <Nav t={t} />
            <div className="sm-rz-copy">
              <p className="sm-st-eyebrow"><i />{t.casesEyebrow}</p>
              <div className="sm-rz-titles">
                {CASES.map((k) => (
                  <div key={k} className="sm-rz-t" style={ord(k)}>
                    <p className="sm-st-h2">{t.caseName} {nn(k)}</p>
                    <p className="sm-rz-meta"><span>{t.category}</span><span>{nn(k)} / {nn(CASES.length - 1)}</span></p>
                  </div>
                ))}
              </div>
              <p className="sm-rz-lead">{t.caseLead}</p>
              <span className="sm-st-ghost">{t.caseOpen}<ArrowUpRight /></span>
              <span className="sm-rz-bar"><i /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
