'use client';

import { useRef, useState, useSyncExternalStore, type CSSProperties, type RefObject } from 'react';
import { User } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { clamp01, lin, seg, useFrame, useReducedPref, useSeen } from '../../_usluga/shared';
import { Msg, Narr, SectionHead, Spark, Words, sayMs, setNarr, setVar, useBeats } from './talk';
import './wiedza.css';

// SEKCJA „WIEDZA” (runda 2) - „Zna Twoją ofertę. Nie zmyśla.” Asystent odpowiada WYŁĄCZNIE z materiałów firmy
// i pokazuje, skąd to wie; pytanie spoza wiedzy oddaje człowiekowi. Trzy RÓŻNE sceny (przełącznik w panelu dev):
//   KnowStars  „Konstelacja” - interaktywna mapa źródeł wokół gwiazdy asystenta, kamera najeżdża na źródło odpowiedzi,
//   KnowSheets „Dokumenty”   - przypięta: arkusze firmy wlatują do gwiazdy, właściwy wraca z zakreśloną linijką,
//   KnowBorder „Granica”     - przypięta: okrąg = to, co asystent wie; czwarte pytanie zatrzymuje się na granicy.
// Bez JS / ograniczony ruch / niski ekran: nagłówek, lista czterech pytań z odpowiedziami i źródłami, narrator jako
// lista (KnowList; w scenach przypiętych lista zostaje dla czytników, a scena jest aria-hidden).
// Prototyp z rundy 1: sources.tsx (tylko do czytania).

type P = { t: ChatbotsCopy; locale: Locale };
type Pt = { x: number; y: number };

/** Źródło odpowiedzi kolejnych pytań: indeks w `nodes` / `sheets`, -1 = spoza wiedzy (rozmowa trafia do człowieka). */
export const SRC = [0, 2, 3, -1];

const LOW = '(max-height: 520px)';
const subLow = (cb: () => void) => {
  const m = window.matchMedia(LOW);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
/** Spokojny tryb: ograniczony ruch albo niski ekran (telefon bokiem) - bez przypięcia, zwykły blok. */
export const useCalm = () => {
  const reduced = useReducedPref();
  const low = useSyncExternalStore(subLow, () => window.matchMedia(LOW).matches, () => false);
  return reduced || low;
};

/** Postęp przypiętej sceny `p` (0-1) oraz wjazdu `e` (0 = góra sceny przy dole okna, 1 = scena przypięta) w każdej
    klatce przewijania - scena żyje już przy wjeździe, a nie dopiero po przypięciu. Poza ekranem nic nie pisze. */
export const useScene = (ref: RefObject<HTMLElement | null>, cb: (p: number, e: number, el: HTMLElement) => void, on: boolean) => {
  useFrame((frac) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect(), vh = window.innerHeight, top = r.top - frac;
    if (top > vh * 1.3 || top + r.height < -vh * 0.3) return;
    cb(clamp01(-top / Math.max(1, r.height - vh)), clamp01(1 - top / vh), el);
  }, on);
};

/** Głębia: dwa plany drobnych czteroramiennych gwiazd (jak „klejnoty” nieba w hero). Położenia z własnego generatora
    (te same na serwerze i w przeglądarce). */
type Star = { x: number; y: number; s: number; ac: boolean };
const sky = (n: number, seed: number): Star[] => {
  let v = seed;
  const r = () => { v = (v * 16807) % 2147483647; return v / 2147483647; };
  return Array.from({ length: n }, (_, i) => ({ x: +(r() * 100).toFixed(1), y: +(r() * 100).toFixed(1), s: +(0.55 + r() * 0.9).toFixed(2), ac: i % 4 === 0 }));
};
export const FAR = sky(30, 11), NEAR = sky(8, 97);
export const Plane = ({ items, depth }: { items: Star[]; depth: 'far' | 'near' }) => (
  <div className="ch-k-pl" data-depth={depth}>
    <div className="ch-k-pl-in">
      {items.map((s, i) => (
        <i key={i} className="ch-k-star" data-ac={s.ac ? '' : undefined} style={{ left: `${s.x}%`, top: `${s.y}%`, '--s': s.s } as CSSProperties} />
      ))}
    </div>
  </div>
);

/** Zwykła lista: cztery pytania z odpowiedziami i źródłami. `sr` = w żywej scenie zostaje tylko dla czytników. */
export const KnowList = ({ t, sr = false }: { t: ChatbotsCopy; sr?: boolean }) => (
  <ol className="ch-k-list" data-sr={sr ? '' : undefined}>
    {t.know.items.map((x, i) => (
      <li key={x.q}>
        <p className="ch-k-list-q"><span className="sr-only">{t.speakers.client}: </span>{x.q}</p>
        <p className="ch-k-list-a"><span className="sr-only">{t.speakers.assistant}: </span>{x.a}</p>
        <p className="ch-k-src" data-on=""><span>{SRC[i] < 0 ? t.know.handLabel : t.know.sourceLabel}</span> {x.src}</p>
      </li>
    ))}
  </ol>
);

// ═══ 1. KONSTELACJA ═════════════════════════════════════════════════════════════════════════════════════════════
// Współrzędne w jednostkach rysunku 1000 x 760 (pole mapy ma te same proporcje - linie SVG i podpisy HTML pokrywają
// się bez przeliczeń). Węzły z podpisami leżą w lewych 3/4 mapy; dalsze gwiazdy konstelacji wychodzą za prawą krawędź
// ekranu. Kroki: 0 cisza · 1 asystent szuka (impuls ze źródła / przegląd źródeł) · 2 odpowiedź + podpis · 3 gotowe.
const CORE: Pt = { x: 430, y: 360 };
const NODES: Pt[] = [{ x: 170, y: 190 }, { x: 470, y: 96 }, { x: 740, y: 230 }, { x: 700, y: 520 }, { x: 190, y: 500 }];
const TEAM: Pt = { x: 440, y: 664 };
const OUTER: Pt[] = [{ x: 968, y: 96 }, { x: 1090, y: 404 }, { x: 930, y: 706 }];
const WEB: [Pt, Pt][] = [
  [NODES[0], NODES[1]], [NODES[1], NODES[2]], [NODES[2], NODES[3]], [NODES[4], NODES[0]],
  [NODES[2], OUTER[0]], [NODES[2], OUTER[1]], [NODES[3], OUTER[1]], [NODES[3], OUTER[2]], [OUTER[0], OUTER[1]],
];
const at = (p: Pt) => ({ left: `${(p.x / 10).toFixed(2)}%`, top: `${(p.y / 7.6).toFixed(2)}%` });
const mix = (a: Pt, b: Pt, k: number): Pt => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
/** Odcinek a -> b skrócony o `ra` przy początku i `rb` przy końcu (linia nie wchodzi w węzeł ani w gwiazdę). */
const link = (a: Pt, b: Pt, ra: number, rb: number) => {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
  const k0 = ra / d, k1 = (d - rb) / d;
  return `M${(a.x + dx * k0).toFixed(1)} ${(a.y + dy * k0).toFixed(1)}L${(a.x + dx * k1).toFixed(1)} ${(a.y + dy * k1).toFixed(1)}`;
};

export const KnowStars = ({ t }: P) => {
  const reduced = useReducedPref();
  const k = t.know;
  const mapRef = useRef<HTMLDivElement>(null);
  const seen = useSeen(mapRef, 0.3);
  const [pick, setPick] = useState(0);
  const [run, setRun] = useState(0);
  const it = k.items[pick];
  const src = SRC[pick] ?? -1;
  const n = useBeats([350, src < 0 ? 2100 : 1400, sayMs(it.a), 0], `${pick}-${run}`, seen && !reduced);
  const choose = (i: number) => { setPick(i); setRun((r) => r + 1); };

  // dwa plany gwiazd suną w różnym tempie względem mapy (--par = położenie mapy względem środka okna)
  useFrame((frac) => {
    const el = mapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect(), vh = window.innerHeight, top = r.top - frac;
    if (top > vh * 1.2 || top + r.height < -vh * 0.2) return;
    setVar(el, '--par', ((top + r.height / 2) / vh - 0.5).toFixed(4));
  }, !reduced);

  // kamera: punkt, na który najeżdża (źródło odpowiedzi / człowiek), przesunięcie ku środkowi kadru i zbliżenie
  const focus = n < 1 ? null : src >= 0 ? mix(NODES[src], CORE, 0.4) : n === 1 ? CORE : mix(TEAM, CORE, 0.4);
  const fx = focus ? focus.x / 10 : 43, fy = focus ? focus.y / 7.6 : 47;
  const cam = {
    '--fx': fx.toFixed(2), '--fy': fy.toFixed(2),
    '--dx': focus ? ((46 - fx) * 0.5).toFixed(2) : '0', '--dy': focus ? ((48 - fy) * 0.5).toFixed(2) : '0',
    '--zm': !focus ? '0' : src < 0 && n === 1 ? '0.08' : '0.2',
  } as CSSProperties;

  return (
    <section className="ch-sec ch-k ch-k-a" aria-labelledby="ch-k-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-k-h" title={k.title} accent={k.titleAccent} lead={k.lead} />
        <KnowList t={t} />
        <div className="ch-k-live ch-k-a-in">
          <div className="ch-k-a-side">
            <div className="ch-k-a-ask">
              <p className="ch-k-label" id="ch-k-a-l">{k.askLabel}</p>
              <div className="ch-chips" role="group" aria-labelledby="ch-k-a-l">
                {k.items.map((x, i) => (
                  <button key={x.q} type="button" className="ch-chip" aria-pressed={i === pick} onClick={() => choose(i)}>{x.q}</button>
                ))}
              </div>
            </div>
            <div className="ch-k-a-out" aria-live="polite">
              <p className="ch-k-meta"><span className="ch-tag">{t.sample}</span><span>{k.firm}</span></p>
              <div key={`${pick}-${run}`} className="ch-k-a-turn">
                <Msg who="client" label={t.speakers.client} text={it.q} state={n >= 0 ? 'on' : 'off'} />
                <p className="ch-k-ans ch-say" data-say={n >= 2 ? '1' : '0'}>
                  <span className="sr-only">{t.speakers.assistant}: </span>
                  <Words text={it.a} />
                </p>
                <p className="ch-k-src" data-on={n >= 2 ? '' : undefined}>
                  <span>{src < 0 ? k.handLabel : k.sourceLabel}</span> {it.src}
                </p>
              </div>
            </div>
          </div>

          <div ref={mapRef} className="ch-k-a-map" data-seek={src < 0 && n === 1 ? '' : undefined} style={cam} aria-hidden="true">
            <Plane items={FAR} depth="far" />
            <div className="ch-k-a-cam" data-sky="">
              <svg viewBox="0 0 1000 760" focusable="false">
                <ellipse className="ch-k-a-orbit" cx={CORE.x} cy={CORE.y} rx="640" ry="452" />
                <ellipse className="ch-k-a-orbit" cx={CORE.x} cy={CORE.y} rx="318" ry="226" />
                {WEB.map(([a, b], i) => <path key={i} className="ch-k-a-web" d={link(a, b, 14, 14)} />)}
                {NODES.map((p, i) => (
                  <g key={i} data-on={src === i && n >= 1 ? '' : undefined}>
                    <path className="ch-k-line" d={link(p, CORE, 14, 50)} />
                    <path className="ch-k-pulse" pathLength={1} d={link(p, CORE, 14, 50)} />
                  </g>
                ))}
                <g data-on={src < 0 && n >= 2 ? '' : undefined}>
                  <path className="ch-k-line" d={link(CORE, TEAM, 50, 30)} />
                  <path className="ch-k-pulse" pathLength={1} d={link(CORE, TEAM, 50, 30)} />
                </g>
              </svg>
              {OUTER.map((p, i) => <span key={i} className="ch-k-node ch-k-node--far" style={at(p)}><i /></span>)}
              {NODES.map((p, i) => (
                <span key={i} className="ch-k-node" data-on={src === i && n >= 1 ? '' : undefined} style={{ ...at(p), '--i': i } as CSSProperties}>
                  <i />
                  {k.nodes[i]}
                </span>
              ))}
              <span className="ch-k-node ch-k-team" data-on={src < 0 && n >= 2 ? '' : undefined} style={at(TEAM)}>
                <i><User /></i>
                {k.team}
              </span>
              <span className="ch-k-core" style={at(CORE)}>
                <Spark state={n === 1 ? 'think' : n === 2 ? 'speak' : 'idle'} />
                {k.center}
              </span>
            </div>
            <Plane items={NEAR} depth="near" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══ 2. DOKUMENTY ═══════════════════════════════════════════════════════════════════════════════════════════════
// Przypięta scena (100svh + 280vh), trzy takty narratora:
//   1. pięć arkuszy leży w perspektywie jak dokumenty na stole (wachlarz gasnący w głąb); przy przewijaniu po kolei
//      unoszą się i wlatują do gwiazdy asystenta (lot arkusza liczy CSS z --p i --i),
//   2. pytanie klienta -> z gwiazdy wysuwa się ku kamerze Cennik, jego linijki dostają zakreślenie markerem (--mk),
//      obok odpowiedź z podpisem źródła,
//   3. pytanie spoza wiedzy -> arkusze przewijają się jeden po drugim (--flip), żaden nie pasuje -> linia z impulsem
//      do człowieka (--hand), odpowiedź z podpisem „bez zgadywania”.
// Po lewej JEDNO miejsce rozmowy (pytanie + odpowiedź), po prawej jedno miejsce akcji (gwiazda i arkusze).
// `act` (stan Reacta, zmieniany tylko na progach): 0 nauka · 1 pytanie · 2 arkusz wraca · 3 odpowiedź ·
// 4 drugie pytanie · 5 przegląd arkuszy · 6 przekazanie człowiekowi.
const SHEETS_AT = [0.03, 0.36, 0.68, 1];
const SHEETS_ACT = [0.385, 0.43, 0.5, 0.69, 0.74, 0.88];

export const KnowSheets = ({ t }: P) => {
  const calm = useCalm();
  const k = t.know;
  const pin = useRef<HTMLDivElement>(null);
  const actRef = useRef(0);
  const [act, setAct] = useState(0);

  useScene(pin, (p, e, el) => {
    setVar(el, '--p', p.toFixed(4));
    setVar(el, '--e', e.toFixed(4));
    setVar(el, '--out', (seg(p, 0.42, 0.52) * (1 - seg(p, 0.62, 0.68))).toFixed(4));
    setVar(el, '--mk', seg(p, 0.5, 0.6).toFixed(4));
    setVar(el, '--flip', lin(p, 0.74, 0.85).toFixed(4));
    setVar(el, '--hand', seg(p, 0.84, 0.9).toFixed(4));
    setNarr(el, p, SHEETS_AT);
    let a = 0;
    for (const x of SHEETS_ACT) if (p >= x) a++;
    if (a !== actRef.current) { actRef.current = a; setAct(a); }
  }, !calm);

  const spark = act === 3 || act === 6 ? 'speak' : act === 1 || act === 4 ? 'idle' : 'think';

  return (
    <section className="ch-sec ch-k ch-k-b" aria-labelledby="ch-k-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-k-h" title={k.title} accent={k.titleAccent} lead={k.lead} />
        <KnowList t={t} sr />
      </div>
      <div ref={pin} className="ch-k-pin ch-k-b-pin">
        <div className="ch-k-stage">
          <div className="ch-k-stage-in container mx-auto px-6">
            <div className="ch-k-scene" aria-hidden="true">
              <Plane items={FAR} depth="far" />
              <div className="ch-k-b-talk">
                <p className="ch-k-meta"><span className="ch-tag">{t.sample}</span><span>{k.firm}</span></p>
                <div className="ch-k-turns">
                  {[0, 3].map((i, j) => {
                    const on = j ? act >= 4 : act >= 1 && act < 4;
                    const said = j ? act >= 6 : act === 3;
                    return (
                      <div key={i} className="ch-k-turn" data-on={on ? '' : undefined}>
                        <Msg who="client" label={t.speakers.client} text={k.items[i].q} state={on ? 'on' : 'off'} />
                        <p className="ch-k-ans ch-say" data-say={said ? '1' : '0'}><Words text={k.items[i].a} /></p>
                        <p className="ch-k-src" data-on={said ? '' : undefined}>
                          <span>{j ? k.handLabel : k.sourceLabel}</span> {k.items[i].src}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="ch-k-b-table">
                {/* pole blasku mgławicy: stół jest punktem 0 x 0, więc cel tła ma własny rozmiar */}
                <i className="ch-k-b-sky" data-sky="" />
                {k.sheets.map((s, i) => (
                  <div key={s.name} className="ch-k-paper ch-k-sheet" style={{ '--i': i } as CSSProperties}>
                    <b>{s.name}</b>
                    {s.lines.map((l) => <span key={l}>{l}</span>)}
                    <i /><i /><i />
                  </div>
                ))}
                {k.sheets.map((s, i) => (
                  <div key={s.name} className="ch-k-paper ch-k-b-flip" style={{ '--i': i } as CSSProperties}>
                    <b>{s.name}</b>
                    {s.lines.map((l) => <span key={l}>{l}</span>)}
                    <i /><i /><i />
                  </div>
                ))}
                <div className="ch-k-paper ch-k-b-hero">
                  <b>{k.sheets[0].name}</b>
                  {k.sheets[0].lines.map((l, i) => (
                    <span key={l}><span className="ch-k-mark" style={{ '--j': i } as CSSProperties}>{l}</span></span>
                  ))}
                  <i /><i /><i /><i />
                </div>
                <i className="ch-k-b-link" />
                <i className="ch-k-b-drop" data-on={act >= 6 ? '' : undefined} />
                <span className="ch-k-node ch-k-team ch-k-b-team" data-on={act >= 6 ? '' : undefined}>
                  <i><User /></i>
                  {k.team}
                </span>
                <span className="ch-k-core ch-k-b-core"><Spark state={spark} /></span>
              </div>
              <Plane items={NEAR} depth="near" />
            </div>
            <Narr className="ch-k-narr" items={k.steps} label={k.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══ 3. GRANICA ═════════════════════════════════════════════════════════════════════════════════════════════════
// Przypięta scena (100svh + 240vh). Wielki okrąg z włosowej linii = to, co asystent wie (w środku źródła i gwiazda),
// częściowo za krawędzią ekranu; poza nim człowiek. Pytania nadlatują pojedynczo jako dymki: trzy pierwsze przekraczają
// granicę i lądują na swoim źródle, czwarte zatrzymuje się NA granicy (--hit, kamera --zm najeżdża na to miejsce)
// i jedzie wzdłuż łuku (--ride) do człowieka. Bieżąca odpowiedź stoi w jednym miejscu (lewa krawędź / pod okręgiem).
// Jednostka położeń = promień okręgu (--R w CSS), kąty w układzie ekranu (y w dół). Dwie geometrie: szeroka (okrąg
// po prawej, pytania z lewej) i wysoka (poniżej 1024 px: okrąg u góry, pytania z góry) - próg jak w wiedza.css.
// `act` (progi BORDER_ACT): nieparzyste = widać odpowiedź (1, 3, 5 -> pytania 0-2; 7 -> czwarte), 8 = u człowieka.
const pol = (deg: number, r: number): Pt => ({ x: +(Math.cos((deg * Math.PI) / 180) * r).toFixed(4), y: +(Math.sin((deg * Math.PI) / 180) * r).toFixed(4) });
const RING = [215, 285, 150, 80, 350].map((d) => pol(d, 0.6));
type Geo = { start: Pt[]; stop: number; team: number };
const GEO_WIDE: Geo = { start: [{ x: -1.5, y: -0.74 }, { x: -1.56, y: -0.66 }, { x: -1.46, y: -0.62 }, { x: -1.52, y: -0.7 }], stop: 176, team: 214 };
const GEO_TALL: Geo = { start: [{ x: 0.55, y: -1.6 }, { x: 0.2, y: -1.65 }, { x: 0.6, y: -1.55 }, { x: 0.35, y: -1.6 }], stop: 280, team: 228 };
const TEAM_R = 1.2;
const BORDER_AT = [0.02, 0.2, 0.66, 1];
const BORDER_ACT = [0.285, 0.36, 0.435, 0.51, 0.585, 0.675, 0.79, 0.925];
/** Start lotu pytań 0-2 (lot trwa FLY postępu, potem dymek gaśnie na źródle). */
const ASK_AT = [0.2, 0.35, 0.5], FLY = 0.085;
const ray = (p: Pt) => link({ x: p.x * 100, y: p.y * 100 }, { x: 0, y: 0 }, 3.4, 9);
const arc = (a: number, b: number) => {
  const p = pol(a, 100), q = pol(b, 100);
  return `M${p.x} ${p.y}A100 100 0 0 ${b > a ? 1 : 0} ${q.x} ${q.y}`;
};
const geoVars = (() => {
  const sw = pol(GEO_WIDE.stop, 1), st = pol(GEO_TALL.stop, 1), tw = pol(GEO_WIDE.team, TEAM_R), tt = pol(GEO_TALL.team, TEAM_R);
  return {
    cam: { '--sxw': sw.x, '--syw': sw.y, '--sxt': st.x, '--syt': st.y } as CSSProperties,
    team: { '--xw': tw.x, '--yw': tw.y, '--xt': tt.x, '--yt': tt.y } as CSSProperties,
  };
})();

export const KnowBorder = ({ t }: P) => {
  const calm = useCalm();
  const k = t.know;
  const pin = useRef<HTMLDivElement>(null);
  const bubs = useRef<HTMLElement[]>([]);
  const actRef = useRef(0);
  const [act, setAct] = useState(0);

  useScene(pin, (p, e, el) => {
    if (!bubs.current[0]?.isConnected) bubs.current = Array.from(el.querySelectorAll<HTMLElement>('.ch-k-c-bub'));
    const g = window.innerWidth < 1024 ? GEO_TALL : GEO_WIDE;
    const ride = seg(p, 0.84, 0.925);
    setVar(el, '--p', p.toFixed(4));
    setVar(el, '--draw', seg(e, 0.2, 0.95).toFixed(4));
    setVar(el, '--nd', (lin(e, 0.6, 1) * 0.4 + lin(p, 0, 0.14) * 0.6).toFixed(4));
    setVar(el, '--hit', (seg(p, 0.76, 0.8) * (1 - seg(p, 0.9, 0.96))).toFixed(4));
    setVar(el, '--zm', (seg(p, 0.75, 0.84) * (1 - seg(p, 0.93, 1) * 0.6)).toFixed(4));
    setVar(el, '--ride', ride.toFixed(4));
    bubs.current.forEach((b, i) => {
      const from = g.start[i];
      let to: Pt, f: number, end: number, land: number;
      if (i < 3) {
        to = RING[SRC[i]];
        f = seg(p, ASK_AT[i], ASK_AT[i] + FLY);
        end = seg(p, ASK_AT[i] + FLY, ASK_AT[i] + FLY + 0.03);
        land = 0.35;
      } else {
        // czwarte pytanie: do granicy, postój, potem wzdłuż łuku i na zewnątrz do człowieka
        to = pol(g.stop + (g.team - g.stop) * ride, 1 + (TEAM_R - 1) * seg(ride, 0.6, 1));
        f = seg(p, 0.69, 0.765);
        end = seg(p, 0.915, 0.94);
        land = 0.25;
      }
      setVar(b, '--bx', (from.x + (to.x - from.x) * f).toFixed(4));
      setVar(b, '--by', (from.y + (to.y - from.y) * f).toFixed(4));
      setVar(b, '--bs', (1.25 - f * land - end * 0.3).toFixed(3));
      setVar(b, '--bo', (Math.min(1, f * 5) * (1 - end)).toFixed(3));
    });
    setNarr(el, p, BORDER_AT);
    let a = 0;
    for (const x of BORDER_ACT) if (p >= x) a++;
    if (a !== actRef.current) { actRef.current = a; setAct(a); }
  }, !calm);

  const ans = act === 8 ? 3 : act % 2 ? (act - 1) / 2 : -1;
  const lit = ans >= 0 ? SRC[ans] : -1;
  const spark = ans >= 0 ? 'speak' : act === 6 ? 'think' : 'idle';

  return (
    <section className="ch-sec ch-k ch-k-c" aria-labelledby="ch-k-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-k-h" title={k.title} accent={k.titleAccent} lead={k.lead} />
        <KnowList t={t} sr />
      </div>
      <div ref={pin} className="ch-k-pin ch-k-c-pin">
        <div className="ch-k-stage">
          <div className="ch-k-scene" aria-hidden="true">
            <Plane items={FAR} depth="far" />
            <div className="ch-k-c-cam" style={geoVars.cam}>
              <div className="ch-k-c-ring" data-sky="">
                <svg viewBox="-130 -130 260 260" focusable="false">
                  <circle className="ch-k-c-orbit" r="60" />
                  {RING.map((p, i) => (
                    <g key={i} data-on={lit === i ? '' : undefined}>
                      <path className="ch-k-line" d={ray(p)} />
                      <path className="ch-k-pulse" pathLength={1} d={ray(p)} />
                    </g>
                  ))}
                  <circle className="ch-k-c-edge" r="100" pathLength={1} transform="rotate(180)" />
                  <circle className="ch-k-c-hit" r="100" />
                  <path className="ch-k-c-arc" data-geo="wide" pathLength={1} d={arc(GEO_WIDE.stop, GEO_WIDE.team)} />
                  <path className="ch-k-c-arc" data-geo="tall" pathLength={1} d={arc(GEO_TALL.stop, GEO_TALL.team)} />
                </svg>
              </div>
              {RING.map((p, i) => (
                <span key={i} className="ch-k-node" data-on={lit === i ? '' : undefined} style={{ '--x': p.x, '--y': p.y, '--i': i } as CSSProperties}>
                  <i />
                  {k.nodes[i]}
                </span>
              ))}
              <span className="ch-k-node ch-k-team" data-on={act >= 8 ? '' : undefined} style={geoVars.team}>
                <i><User /></i>
                {k.team}
              </span>
              <span className="ch-k-core">
                <Spark state={spark} />
                {k.center}
              </span>
              {k.items.map((x) => <p key={x.q} className="ch-k-c-bub">{x.q}</p>)}
            </div>
            <Plane items={NEAR} depth="near" />
          </div>
          <div className="ch-k-stage-in container mx-auto px-6">
            <div className="ch-k-only ch-k-c-side" aria-hidden="true">
              <p className="ch-k-meta ch-k-c-meta"><span className="ch-tag">{t.sample}</span><span>{k.firm}</span></p>
              <div className="ch-k-turns ch-k-c-out">
                {k.items.map((x, i) => (
                  <div key={x.q} className="ch-k-turn" data-on={ans === i ? '' : undefined}>
                    <p className="ch-k-ans ch-say" data-say={ans === i ? '1' : '0'}><Words text={x.a} /></p>
                    <p className="ch-k-src" data-on={ans === i && (i < 3 || act >= 8) ? '' : undefined}>
                      <span>{SRC[i] < 0 ? k.handLabel : k.sourceLabel}</span> {x.src}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Narr className="ch-k-narr" items={k.steps} label={k.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
