import type { CSSProperties } from 'react';
import type { ArtId } from './shared';

// Rysunki techniczne usług (sekcja Oferta, "Plan" - wybór właściciela 2026-09-27: "zajebiście mi się
// podoba ten motion reveal elementów na makietach"). Każda usługa = precyzyjny rysunek liniowy tego,
// co klient dostaje, z trzema numerami odnośników jak w dokumentacji patentowej (= legenda pod deską).
//
// Trzy warstwy ruchu (plan.tsx steruje czasem):
// 1. REVEAL - linie rysują się po kolei (CSS: stroke-dashoffset na pathLength=1, opóźnienie --d),
//    główne ramy prowadzi "pióro" kreślarskie (jasna kropka na czole linii, JS).
// 2. HISTORIA (dusza sekcji) - po narysowaniu rysunek ożywa: krótka scenka w 3 krokach pokazuje, co
//    usługa robi dla klienta (kursor klika i wypełnia formularz, pióro dopisuje podstronę, paczka
//    jedzie do paczkomatu, lupa znajduje błędy...). Elementy `live` animuje WAAPI (pętla CYCLE),
//    podpis bieżącego kroku stoi pod rysunkiem ("Rys. 4  Klient płaci BLIK-iem lub kartą.").
// 3. ZMIANA - poprzedni rysunek "zwija się" w kierunku rysowania, nowy rysuje się od zera.
//
// Płótno 640 × 360 jednostek. Rodzaje linii (klasy .of-k-*, services.css):
//   main / thick / soft / acc  - linie o stałej grubości w px ekranu (--u mierzy plan.tsx),
//   bar / barHi / barXL / barAcc / barAccXL - "tekst" jako kreski (grubość w jednostkach rysunku),
//   dash - linie pomocnicze (przerywane, bez rysowania, tylko pojawienie się),
//   fill / accFill / lit / dot / paper / ink - płaskie wypełnienia (bez poświat; lit = podświetlenie w scenkach).

type Kind = 'main' | 'thick' | 'soft' | 'acc' | 'dash' | 'bar' | 'barHi' | 'barXL' | 'barAcc' | 'barAccXL' | 'fill' | 'accFill' | 'lit' | 'dot' | 'paper' | 'ink';
/** [rodzaj, ścieżka, 'pen' = tę linię prowadzi pióro]. Kolejność = kolejność rysowania. */
type Part = [Kind, string, 'pen'?];
/** Odnośnik: [x, y] numeru i [tx, ty] punktu, który wskazuje. */
type Mark = [number, number, number, number];
/** Ścieżka wartości w czasie cyklu historii: [ułamek cyklu 0..1, wartość]. */
type Track = [number, number | string][];
/** Element historii. `rest` = widoczny także w spoczynku (bez JS / reduced motion / przed historią). */
interface Live {
  k: Kind;
  d: string;
  rest?: boolean;
  /** Punkt odniesienia transformacji (jednostki rysunku). */
  o?: [number, number];
  op?: Track;
  tf?: Track;
  dash?: Track;
}
interface Art { parts: Part[]; marks: [Mark, Mark, Mark]; live: Live[] }

/** Cykl historii (ms) i początki trzech kroków (ułamki cyklu) - wspólne dla wszystkich rysunków. */
export const CYCLE = 5600;
export const BEATS = [0, 0.34, 0.67] as const;
/** Opóźnienie rysowania po zmianie rysunku (czas na zwinięcie poprzedniego) - zgodne z --base w CSS. */
export const BASE_MS = 300;
/** Rysowanie jednej linii (ms) - zgodne z CSS (.of-dw [pathLength], 1.1s). */
export const DRAW_MS = 1100;

const f = (n: number) => +n.toFixed(2);
const R = (x: number, y: number, w: number, h: number, r = 0) =>
  r
    ? `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
    : `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
const L = (x1: number, y1: number, x2: number, y2: number) => `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
const C = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
/** Grot strzałki w prawo z czubkiem w (x, y). */
const AR = (x: number, y: number, s = 6) => `M${f(x - s)} ${f(y - s * 0.7)}L${f(x)} ${f(y)}L${f(x - s)} ${f(y + s * 0.7)}`;

// Pomocnicze ścieżki czasu historii.
const T = (x: number, y: number, s?: number) => `translate(${f(x)}px, ${f(y)}px)${s === undefined ? '' : ` scale(${s})`}`;
const S = (s: number) => `scale(${s})`;
/** Pojawia się w t0 (do t1), znika po `off`. */
const on = (t0: number, off = 0.92, t1 = t0 + 0.035): Track => [[0, 0], [t0, 0], [t1, 1], [off, 1], [Math.min(off + 0.05, 1), 0], [1, 0]];
/** Krótki błysk. */
const blink = (t0: number, peak: number, t1: number): Track => [[0, 0], [t0, 0], [peak, 1], [t1, 0], [1, 0]];
/** Linia rysuje się między t0 a t1 (stroke-dashoffset), wraca niewidocznie na końcu cyklu. */
const type = (t0: number, t1: number): Track => [[0, 1], [t0, 1], [t1, 0], [0.975, 0], [1, 1]];

// Kursor (czubek w 0,0) i pióro (czubek w 389,337) - używane w kilku scenkach.
const CURSOR = 'M0 0L0 15L4 11L7 17.6L9.6 16.5L6.8 10H12Z';
const PENCIL = 'M394 322L430 286L440 296L404 332ZM394 322L389 337L404 332M424 292L434 302';

const card = (x0: number, y0: number): Part[] => [
  ['fill', R(x0, y0, 92, 112, 8)],
  ['main', R(x0, y0, 92, 112, 8)],
  ['soft', R(x0 + 10, y0 + 10, 72, 54, 4)],
  ['bar', L(x0 + 12, y0 + 78, x0 + 62, y0 + 78)],
  ['barHi', L(x0 + 12, y0 + 94, x0 + 34, y0 + 94)],
  ['acc', C(x0 + 72, y0 + 94, 7)],
];

const crmRows = [86, 110, 134, 158].flatMap((y, k): Part[] => [
  ['bar', L(206, y, 276, y)],
  ['bar', L(296, y, 344, y)],
  [k === 1 ? 'acc' : 'soft', R(380, y - 6, 44, 12, 6)],
  ['soft', L(206, y + 12, 504, y + 12)],
]);

const checklist = [206, 232, 258, 284].flatMap((y, k): Part[] => [
  [k < 2 ? 'acc' : 'soft', R(336, y - 7, 14, 14, 3)],
  ...(k < 2 ? ([['acc', `M339.5 ${y}L342.5 ${y + 3.5}L347 ${y - 3.5}`]] as Part[]) : []),
  ['bar', L(362, y, [444, 424, 452, 410][k], y)],
]);

// Ruch zaznaczenia (UI/UX) i lupy (audyt) - kilka elementów jedzie razem.
const SEL_MOVE: Track = [[0, T(0, 0)], [0.06, T(0, 0)], [0.22, T(91, 0)], [0.84, T(91, 0)], [0.96, T(0, 0)], [1, T(0, 0)]];
const LENS_MOVE: Track = [[0, T(0, 0)], [0.06, T(0, 0)], [0.2, T(50, -120)], [0.3, T(50, -120)], [0.44, T(-72, -38)], [0.54, T(-72, -38)], [0.66, T(0, 0)], [1, T(0, 0)]];
/** Mruganie kropek "pisze..." (czat), faza przesunięta dla kolejnych kropek. */
const typing = (p: number): Track => [[0, 0], [0.06 + p, 0], [0.08 + p, 1], [0.12 + p, 0.3], [0.16 + p, 1], [0.2 + p, 0.3], [0.24 + p, 1], [0.3, 0.3], [0.33, 0], [1, 0]];

export const ARTS: Record<ArtId, Art> = {
  // One-page: jedna długa strona (wymiar = "wszystko na jednej stronie") i ta sama strona na telefonie.
  // Historia: kursor klika przycisk, wypełnia formularz, wysyła - pojawia się potwierdzenie.
  onepage: {
    parts: [
      ['fill', R(208, 20, 176, 320, 10)],
      ['main', R(208, 20, 176, 320, 10), 'pen'],
      ['soft', L(208, 46, 384, 46)],
      ['barHi', L(224, 33, 246, 33)],
      ['bar', L(318, 33, 332, 33)],
      ['bar', L(342, 33, 356, 33)],
      ['bar', L(366, 33, 370, 33)],
      ['barXL', L(228, 76, 334, 76)],
      ['barXL', L(228, 94, 300, 94)],
      ['bar', L(228, 114, 352, 114)],
      ['bar', L(228, 126, 322, 126)],
      ['accFill', R(228, 140, 62, 20, 10)],
      ['acc', R(228, 140, 62, 20, 10)],
      ['soft', L(208, 176, 384, 176)],
      ['soft', R(228, 190, 40, 34, 6)],
      ['soft', R(276, 190, 40, 34, 6)],
      ['soft', R(324, 190, 40, 34, 6)],
      ['bar', L(232, 236, 262, 236)],
      ['bar', L(280, 236, 310, 236)],
      ['bar', L(328, 236, 358, 236)],
      ['soft', L(208, 254, 384, 254)],
      ['soft', R(228, 268, 136, 16, 4)],
      ['soft', R(228, 290, 136, 16, 4)],
      ['accFill', R(228, 314, 70, 16, 8)],
      ['acc', R(228, 314, 70, 16, 8)],
      ['soft', L(180, 20, 180, 340)],
      ['soft', L(174, 20, 186, 20)],
      ['soft', L(174, 340, 186, 340)],
      ['dash', L(392, 205, 420, 205)],
      ['acc', AR(421, 205)],
      ['fill', R(430, 110, 92, 190, 16)],
      ['main', R(430, 110, 92, 190, 16), 'pen'],
      ['soft', L(466, 122, 486, 122)],
      ['barHi', L(444, 146, 496, 146)],
      ['bar', L(444, 158, 486, 158)],
      ['acc', R(444, 168, 40, 12, 6)],
      ['soft', R(444, 192, 64, 30, 5)],
      ['soft', R(444, 234, 64, 10, 3)],
      ['soft', R(444, 250, 64, 10, 3)],
      ['acc', R(444, 268, 36, 12, 6)],
    ],
    marks: [[122, 180, 180, 180], [412, 298, 364, 298], [584, 170, 522, 170]],
    live: [
      { k: 'lit', d: R(228, 140, 62, 20, 10), op: blink(0.17, 0.2, 0.32) },
      { k: 'barHi', d: L(237, 276, 300, 276), op: on(0.4, 0.92, 0.401), dash: type(0.4, 0.5) },
      { k: 'barHi', d: L(237, 298, 284, 298), op: on(0.52, 0.92, 0.521), dash: type(0.52, 0.61) },
      { k: 'lit', d: R(228, 314, 70, 16, 8), op: blink(0.74, 0.77, 0.88) },
      { k: 'lit', d: R(444, 268, 36, 12, 6), op: blink(0.77, 0.8, 0.9) },
      { k: 'acc', d: `${C(312, 322, 7)}M308.6 322.2L311.2 324.8L315.6 319.6`, o: [312, 322], op: on(0.78, 0.92, 0.81), tf: [[0, S(0.4)], [0.78, S(0.4)], [0.84, S(1)], [1, S(1)]] },
      {
        k: 'ink', d: CURSOR, op: on(0.03, 0.9, 0.08),
        tf: [[0, T(372, 100)], [0.16, T(262, 152)], [0.185, T(262, 152, 0.82)], [0.21, T(262, 152)], [0.4, T(302, 281)], [0.5, T(302, 281)], [0.52, T(292, 303)], [0.61, T(292, 303)], [0.72, T(262, 326)], [0.745, T(262, 326, 0.82)], [0.77, T(262, 326)], [1, T(262, 326)]],
      },
    ],
  },

  // Strona firmowa: mapa strony (strona główna i podstrony), mapa z pinezką i opinie w kontakcie.
  // Historia: pióro rysuje nową podstronę w miejscu przerywanej ramki, wpisuje treść, a podstrona
  // dołącza do mapy strony (linia staje się ciągła).
  company: {
    parts: [
      ['fill', R(270, 24, 100, 70, 8)],
      ['main', R(270, 24, 100, 70, 8), 'pen'],
      ['barHi', L(284, 44, 320, 44)],
      ['bar', L(284, 58, 326, 58)],
      ['acc', R(284, 70, 34, 12, 6)],
      ['soft', R(334, 32, 26, 12, 6)],
      ['main', L(320, 94, 320, 124)],
      ['soft', L(140, 124, 500, 124)],
      ['soft', L(140, 124, 140, 150)],
      ['soft', L(260, 124, 260, 150)],
      ['soft', L(380, 124, 380, 150)],
      ['soft', L(500, 124, 500, 150)],
      ...[88, 208, 328, 448].flatMap((x0): Part[] => [['fill', R(x0, 150, 104, 74, 8)], ['main', R(x0, 150, 104, 74, 8)]]),
      ['barHi', L(100, 168, 146, 168)],
      ['soft', R(100, 180, 24, 30, 4)],
      ['soft', R(128, 180, 24, 30, 4)],
      ['soft', R(156, 180, 24, 30, 4)],
      ['barHi', L(220, 168, 266, 168)],
      ['bar', L(220, 184, 296, 184)],
      ['bar', L(220, 196, 284, 196)],
      ['bar', L(220, 208, 290, 208)],
      ['barHi', L(340, 168, 372, 168)],
      ['soft', R(340, 178, 24, 18, 3)],
      ['bar', L(372, 183, 418, 183)],
      ['bar', L(372, 191, 400, 191)],
      ['soft', R(340, 201, 24, 16, 3)],
      ['bar', L(372, 206, 418, 206)],
      ['bar', L(372, 213, 400, 213)],
      ['soft', R(460, 162, 80, 42, 4)],
      ['soft', 'M460 192C484 178 506 198 540 182'],
      ['acc', C(500, 176, 6)],
      ['acc', L(500, 182, 500, 192)],
      ...[462, 470, 478, 486, 494].map((x): Part => ['dot', C(x, 214, 2.2)]),
    ],
    marks: [[474, 338, 372, 312], [596, 180, 540, 180], [430, 38, 360, 38]],
    live: [
      { k: 'dash', d: L(320, 124, 320, 262), rest: true, op: [[0, 1], [0.8, 1], [0.84, 0], [0.97, 0], [1, 1]] },
      { k: 'dash', d: R(268, 262, 104, 64, 8), rest: true, op: [[0, 1], [0.27, 1], [0.31, 0], [0.97, 0], [1, 1]] },
      { k: 'acc', d: `${L(320, 284, 320, 304)}${L(310, 294, 330, 294)}`, rest: true, op: [[0, 1], [0.2, 1], [0.26, 0], [0.97, 0], [1, 1]] },
      { k: 'main', d: R(268, 262, 104, 64, 8), op: on(0.06, 0.92, 0.061), dash: [[0, 1], [0.06, 1], [0.28, 0], [0.975, 0], [1, 1]] },
      { k: 'fill', d: R(268, 262, 104, 64, 8), op: on(0.28, 0.92, 0.34) },
      { k: 'barHi', d: L(284, 280, 332, 280), op: on(0.33, 0.92, 0.331), dash: type(0.33, 0.43) },
      { k: 'bar', d: L(284, 294, 350, 294), op: on(0.445, 0.92, 0.446), dash: type(0.445, 0.54) },
      { k: 'bar', d: L(284, 306, 326, 306), op: on(0.555, 0.92, 0.556), dash: type(0.555, 0.62) },
      { k: 'main', d: L(320, 124, 320, 262), op: on(0.68, 0.92, 0.681), dash: type(0.68, 0.8) },
      {
        k: 'ink', d: PENCIL, rest: true,
        // Czubek pióra obiega ramkę nowej podstrony (w tempie jej rysowania), potem pisze trzy linijki.
        tf: [[0, T(0, 0)], [0.04, T(-113, -75)], [0.06, T(-113, -75)], [0.12, T(-25, -75)], [0.129, T(-17, -67)], [0.161, T(-17, -19)], [0.17, T(-25, -11)], [0.23, T(-113, -11)], [0.239, T(-121, -19)], [0.271, T(-121, -67)], [0.28, T(-113, -75)], [0.33, T(-105, -57)], [0.43, T(-57, -57)], [0.445, T(-105, -43)], [0.54, T(-39, -43)], [0.555, T(-105, -31)], [0.62, T(-63, -31)], [0.72, T(0, 0)], [1, T(0, 0)]],
      },
    ],
  },

  // Strona szyta na miarę - „to już nie tylko strona, to uczucie” (właściciel 2026-09-28: poprzednia wersja
  // „frajerska”). Autorska kompozycja w przeglądarce (własna geometria, siatka), tor animacji ze strzałką
  // i moodboard marki (zdjęcie, próbki kolorów, próbka typografii) - nastrój, z którego rośnie projekt.
  // Historia: kolor z moodboardu płynie do strony i maluje nagłówek (klient czuje nastrój marki), element
  // jedzie po torze animacji (ruch prowadzi wzrok), kursor klienta dotyka autorskiego kształtu, a ten
  // odpowiada falą (strona reaguje na człowieka). Bez CMS (decyzja właściciela 2026-09-28).
  custom: {
    parts: [
      ['fill', R(34, 120, 84, 96, 10)],
      ['main', R(34, 120, 84, 96, 10), 'pen'],
      ['soft', R(44, 130, 64, 36, 4)],
      ['soft', 'M46 162L62 148L72 156L86 142L106 162'],
      ['soft', C(96, 139, 3.5)],
      ['accFill', C(52, 180, 6)],
      ['acc', C(52, 180, 6)],
      ['soft', C(68, 180, 6)],
      ['soft', C(84, 180, 6)],
      ['barXL', L(46, 198, 78, 198)],
      ['bar', L(46, 207, 100, 207)],
      ['acc', L(118, 168, 150, 168)],
      ['acc', AR(150, 168)],
      ['fill', R(150, 40, 330, 250, 12)],
      ['main', R(150, 40, 330, 250, 12), 'pen'],
      ['soft', L(150, 64, 480, 64)],
      ['soft', C(166, 52, 3)],
      ['soft', C(177, 52, 3)],
      ['soft', C(188, 52, 3)],
      ['dash', L(315, 64, 315, 290)],
      ['barXL', L(176, 104, 292, 104)],
      ['barXL', L(176, 124, 262, 124)],
      ['bar', L(176, 150, 286, 150)],
      ['bar', L(176, 162, 266, 162)],
      ['accFill', R(176, 180, 64, 20, 10)],
      ['acc', R(176, 180, 64, 20, 10)],
      ['main', C(396, 164, 58)],
      ['soft', C(396, 164, 34)],
      ['dot', C(396, 164, 3)],
      ['dash', 'M176 256C250 216 330 286 452 244'],
      ['dot', C(176, 256, 3)],
      ['dot', C(296, 250.75, 3)],
      ['acc', 'M443.2 242.3L452 244L446.1 250.8'],
    ],
    marks: [[560, 100, 440.4, 126.7], [560, 250, 456, 244], [76, 292, 76, 216]],
    live: [
      { k: 'acc', d: 'M425 113.77A58 58 0 0 1 446.23 193', rest: true, o: [396, 164], tf: [[0, 'rotate(0deg)'], [1, 'rotate(360deg)']] },
      // Krok 1: próbka koloru z moodboardu rozbłyska, kolor płynie strzałką do strony i maluje nagłówek.
      { k: 'lit', d: C(52, 180, 6), op: blink(0.01, 0.04, 0.16) },
      {
        k: 'dot', d: C(0, 0, 4), op: [[0, 0], [0.02, 0], [0.04, 1], [0.22, 1], [0.25, 0], [1, 0]],
        tf: [[0, T(52, 180)], [0.04, T(52, 180)], [0.09, T(118, 168)], [0.14, T(150, 168)], [0.22, T(178, 106)], [1, T(178, 106)]],
      },
      { k: 'barAccXL', d: L(176, 104, 292, 104), op: on(0.22, 0.5, 0.221), dash: [[0, 1], [0.22, 1], [0.32, 0], [0.975, 0], [1, 1]] },
      { k: 'barAccXL', d: L(176, 124, 262, 124), op: on(0.27, 0.52, 0.271), dash: [[0, 1], [0.27, 1], [0.35, 0], [0.975, 0], [1, 1]] },
      {
        k: 'dot', d: C(0, 0, 4), op: [[0, 0], [0.35, 0], [0.37, 1], [0.62, 1], [0.65, 0], [1, 0]],
        tf: [[0, T(176, 256)], [0.37, T(176, 256)], [0.42, T(221.4, 243.5)], [0.47, T(269.9, 246.6)], [0.52, T(323.5, 254.9)], [0.57, T(383.5, 257.4)], [0.62, T(452, 244)], [1, T(452, 244)]],
      },
      { k: 'acc', d: 'M443.2 242.3L452 244L446.1 250.8', op: blink(0.6, 0.63, 0.74) },
      // Krok 3: kursor klienta dotyka kształtu - kształt odpowiada: rozświetla się wnętrze i rozchodzą się dwie fale.
      { k: 'acc', d: C(396, 164, 34), o: [396, 164], op: on(0.76, 0.92, 0.79), tf: [[0, S(0.8)], [0.76, S(0.8)], [0.84, S(1)], [1, S(1)]] },
      { k: 'acc', d: C(396, 164, 58), o: [396, 164], op: [[0, 0], [0.765, 0], [0.775, 0.85], [0.93, 0], [1, 0]], tf: [[0, S(1)], [0.765, S(1)], [0.93, S(1.45)], [1, S(1.45)]] },
      { k: 'acc', d: C(396, 164, 58), o: [396, 164], op: [[0, 0], [0.8, 0], [0.81, 0.6], [0.96, 0], [1, 0]], tf: [[0, S(1)], [0.8, S(1)], [0.96, S(1.3)], [1, S(1.3)]] },
      {
        k: 'ink', d: CURSOR, op: on(0.66, 0.92, 0.7),
        tf: [[0, T(520, 300)], [0.66, T(520, 300)], [0.745, T(437, 205)], [0.76, T(437, 205, 0.82)], [0.78, T(437, 205)], [1, T(437, 205)]],
      },
    ],
  },

  // Sklep: produkty, podsumowanie z płatnościami (BLIK wybrany), trasa do paczkomatu, panel zamówień.
  // Historia: produkt trafia do koszyka, klient płaci BLIK-iem, paczka jedzie do paczkomatu,
  // w panelu zapala się nowe zamówienie.
  store: {
    parts: [
      ...card(40, 40),
      ...card(144, 40),
      ...card(40, 164),
      ...card(144, 164),
      ['soft', L(240, 158, 262, 158)],
      ['soft', AR(263, 158, 5)],
      ['fill', R(270, 40, 150, 236, 12)],
      ['main', R(270, 40, 150, 236, 12), 'pen'],
      ['barHi', L(286, 62, 346, 62)],
      ['bar', L(286, 86, 380, 86)],
      ['bar', L(286, 100, 362, 100)],
      ['soft', L(286, 116, 404, 116)],
      ['accFill', R(286, 130, 118, 26, 6)],
      ['acc', R(286, 130, 118, 26, 6)],
      ['barAcc', L(298, 143, 332, 143)],
      ['dot', C(390, 143, 4)],
      ['soft', R(286, 164, 118, 26, 6)],
      ['soft', R(296, 171, 18, 12, 2)],
      ['bar', L(322, 177, 360, 177)],
      ['soft', R(286, 198, 118, 26, 6)],
      ['bar', L(298, 211, 346, 211)],
      ['accFill', R(286, 240, 118, 22, 11)],
      ['acc', R(286, 240, 118, 22, 11)],
      ['dash', 'M404 251C440 251 440 214 470 214'],
      ['acc', AR(471, 214)],
      ['fill', R(470, 90, 120, 150, 6)],
      ['main', R(470, 90, 120, 150, 6), 'pen'],
      ['soft', L(470, 140, 590, 140)],
      ['soft', L(470, 190, 590, 190)],
      ['soft', L(530, 90, 530, 240)],
      ['accFill', R(474, 194, 52, 42, 3)],
      ['acc', R(474, 194, 52, 42, 3)],
      ['fill', R(470, 262, 120, 64, 6)],
      ['main', R(470, 262, 120, 64, 6)],
      ['bar', L(482, 280, 536, 280)],
      ['dot', C(574, 280, 3)],
      ['bar', L(482, 295, 526, 295)],
      ['dot', C(574, 295, 3)],
      ['bar', L(482, 310, 544, 310)],
      ['soft', C(574, 310, 3)],
    ],
    marks: [[445, 143, 404, 143], [616, 68, 588, 94], [618, 294, 590, 294]],
    live: [
      { k: 'lit', d: C(216, 134, 7), op: blink(0.02, 0.05, 0.14) },
      { k: 'dot', d: C(0, 0, 4), op: [[0, 0], [0.05, 0], [0.07, 1], [0.24, 1], [0.27, 0], [1, 0]], tf: [[0, T(216, 134)], [0.07, T(216, 134)], [0.16, T(262, 158)], [0.25, T(300, 93)], [1, T(300, 93)]] },
      { k: 'barAcc', d: L(286, 100, 362, 100), op: [[0, 0], [0.25, 0], [0.28, 1], [0.5, 1], [0.56, 0], [1, 0]] },
      { k: 'lit', d: R(286, 130, 118, 26, 6), op: blink(0.36, 0.4, 0.52) },
      { k: 'dot', d: C(390, 143, 4), o: [390, 143], op: on(0.38, 0.9, 0.39), tf: [[0, S(1)], [0.38, S(1)], [0.41, S(1.7)], [0.47, S(1)], [1, S(1)]] },
      { k: 'lit', d: R(286, 240, 118, 22, 11), op: blink(0.54, 0.57, 0.66) },
      {
        k: 'acc', d: `${R(-6, -5, 12, 10, 1.5)}${L(-6, -1.5, 6, -1.5)}`, op: [[0, 0], [0.63, 0], [0.65, 1], [0.82, 1], [0.85, 0], [1, 0]],
        tf: [[0, T(404, 251)], [0.65, T(404, 251)], [0.69, T(425.2, 245.2)], [0.73, T(439.3, 232.5)], [0.77, T(452.1, 219.8)], [0.8, T(470, 214)], [0.83, T(500, 215)], [1, T(500, 215)]],
      },
      { k: 'lit', d: R(474, 194, 52, 42, 3), op: on(0.83, 0.93, 0.87) },
      { k: 'dot', d: C(574, 310, 3), o: [574, 310], op: on(0.86, 0.93, 0.88), tf: [[0, S(0.3)], [0.86, S(0.3)], [0.9, S(1)], [1, S(1)]] },
    ],
  },

  // CRM: panel z menu, tabelą i statusami; role (osoby i kłódka), automatyzacja AI
  // (zapytanie → AI → zadanie gotowe), integracje z pocztą i kalendarzem.
  // Historia: wpada zapytanie, AI je przetwarza, zadanie gotowe, status w tabeli, mail wychodzi.
  crm: {
    parts: [
      ['fill', R(120, 30, 400, 280, 12)],
      ['main', R(120, 30, 400, 280, 12), 'pen'],
      ['soft', L(190, 30, 190, 310)],
      ['barAcc', L(136, 62, 172, 62)],
      ['bar', L(136, 82, 166, 82)],
      ['bar', L(136, 102, 170, 102)],
      ['bar', L(136, 122, 160, 122)],
      ['soft', L(190, 62, 520, 62)],
      ['soft', R(206, 40, 120, 14, 7)],
      ['soft', C(446, 46, 8)],
      ['soft', C(466, 46, 8)],
      ['main', R(488, 44, 18, 13, 2)],
      ['main', 'M492 44V40A5 5 0 0 1 502 40V44'],
      ...crmRows,
      ['soft', R(206, 236, 78, 32, 6)],
      ['bar', L(218, 252, 266, 252)],
      ['acc', L(284, 252, 311, 252)],
      ['acc', AR(312, 252, 5)],
      ['accFill', R(312, 232, 72, 40, 10)],
      ['acc', R(312, 232, 72, 40, 10)],
      ['acc', R(338, 242, 20, 20, 3)],
      ['acc', 'M343 238V242M353 238V242M343 262V266M353 262V266M334 247H338M334 257H338M358 247H362M358 257H362'],
      ['acc', L(384, 252, 411, 252)],
      ['acc', AR(412, 252, 5)],
      ['soft', R(412, 236, 92, 32, 6)],
      ['bar', L(452, 252, 490, 252)],
      ['dash', L(520, 117, 560, 117)],
      ['dash', L(520, 189, 560, 189)],
      ['fill', R(560, 100, 48, 34, 4)],
      ['main', R(560, 100, 48, 34, 4)],
      ['main', 'M560 100L584 120L608 100'],
      ['fill', R(560, 168, 48, 42, 4)],
      ['main', R(560, 168, 48, 42, 4)],
      ['soft', L(560, 180, 608, 180)],
      ['main', L(570, 163, 570, 172)],
      ['main', L(598, 163, 598, 172)],
      ['dot', C(584, 195, 3)],
    ],
    marks: [[560, 50, 507, 50], [584, 252, 584, 210], [348, 336, 348, 272]],
    live: [
      { k: 'lit', d: R(206, 236, 78, 32, 6), op: blink(0.02, 0.05, 0.16) },
      { k: 'barAcc', d: L(218, 252, 266, 252), op: on(0.03, 0.92, 0.031), dash: type(0.03, 0.12) },
      { k: 'dot', d: R(-5, -3.5, 10, 7, 2), op: [[0, 0], [0.14, 0], [0.16, 1], [0.3, 1], [0.33, 0], [1, 0]], tf: [[0, T(284, 252)], [0.16, T(284, 252)], [0.31, T(348, 252)], [1, T(348, 252)]] },
      { k: 'lit', d: R(338, 242, 20, 20, 3), op: [[0, 0], [0.36, 0], [0.38, 1], [0.42, 0], [0.45, 1], [0.49, 0], [0.52, 1], [0.58, 0], [1, 0]] },
      { k: 'dot', d: R(-5, -3.5, 10, 7, 2), op: [[0, 0], [0.58, 0], [0.6, 1], [0.68, 1], [0.7, 0], [1, 0]], tf: [[0, T(384, 252)], [0.6, T(384, 252)], [0.69, T(430, 252)], [1, T(430, 252)]] },
      { k: 'acc', d: 'M424 252L430 258L442 246', rest: true, op: [[0, 1], [0.02, 0], [0.68, 0], [0.69, 1], [1, 1]], dash: [[0, 0], [0.02, 1], [0.69, 1], [0.76, 0], [1, 0]] },
      { k: 'acc', d: R(380, 80, 44, 12, 6), op: on(0.74, 0.92, 0.78) },
      { k: 'dot', d: C(0, 0, 4), op: [[0, 0], [0.78, 0], [0.8, 1], [0.88, 1], [0.9, 0], [1, 0]], tf: [[0, T(520, 117)], [0.8, T(520, 117)], [0.88, T(582, 117)], [1, T(582, 117)]] },
      { k: 'acc', d: 'M560 100L584 120L608 100', op: blink(0.88, 0.9, 0.99) },
    ],
  },

  // UI/UX: plansza projektu z siatką kolumn, wymiarem odstępu, zaznaczonym elementem i kursorem;
  // obok wersja na telefon, pod nią ścieżka użytkownika.
  // Historia: kursor przenosi zaznaczenie na kolejny element, klika ścieżkę klienta krok po kroku,
  // na końcu zapala wersję na telefon.
  uiux: {
    parts: [
      ['fill', R(90, 36, 300, 240, 6)],
      ['main', R(90, 36, 300, 240, 6), 'pen'],
      ['dash', L(165, 36, 165, 276)],
      ['dash', L(240, 36, 240, 276)],
      ['dash', L(315, 36, 315, 276)],
      ['bar', L(108, 56, 132, 56)],
      ['bar', L(300, 56, 370, 56)],
      ['barXL', L(110, 88, 226, 88)],
      ['barXL', L(110, 106, 196, 106)],
      ['bar', L(110, 126, 214, 126)],
      ['accFill', R(110, 140, 56, 18, 9)],
      ['acc', R(110, 140, 56, 18, 9)],
      ['soft', R(250, 74, 120, 84, 6)],
      ['soft', L(250, 74, 370, 158)],
      ['soft', L(370, 74, 250, 158)],
      ['acc', L(102, 160, 102, 184)],
      ['acc', L(98, 160, 106, 160)],
      ['acc', L(98, 184, 106, 184)],
      ['soft', R(110, 184, 78, 66, 6)],
      ['soft', R(201, 184, 78, 66, 6)],
      ['soft', R(292, 184, 78, 66, 6)],
      ['fill', R(430, 64, 96, 178, 14)],
      ['main', R(430, 64, 96, 178, 14), 'pen'],
      ['soft', L(468, 76, 488, 76)],
      ['barHi', L(444, 100, 500, 100)],
      ['bar', L(444, 112, 490, 112)],
      ['acc', R(444, 124, 40, 12, 6)],
      ['soft', R(444, 146, 68, 40, 5)],
      ['soft', R(444, 194, 68, 34, 5)],
      ['soft', C(452, 296, 8)],
      ['soft', L(460, 296, 489, 296)],
      ['soft', AR(490, 296, 4)],
      ['soft', C(498, 296, 8)],
      ['soft', L(506, 296, 535, 296)],
      ['soft', AR(536, 296, 4)],
      ['accFill', C(544, 296, 8)],
      ['acc', C(544, 296, 8)],
    ],
    marks: [[48, 120, 90, 120], [596, 296, 552, 296], [576, 100, 526, 100]],
    live: [
      { k: 'acc', d: R(198, 181, 84, 72), rest: true, tf: SEL_MOVE },
      { k: 'dot', d: `${R(195.5, 178.5, 5, 5)}${R(279.5, 178.5, 5, 5)}${R(195.5, 250.5, 5, 5)}${R(279.5, 250.5, 5, 5)}`, rest: true, tf: SEL_MOVE },
      { k: 'lit', d: C(452, 296, 8), op: on(0.38, 0.9, 0.41) },
      { k: 'acc', d: C(452, 296, 8), op: on(0.38, 0.9, 0.41) },
      { k: 'acc', d: L(460, 296, 489, 296), op: on(0.43, 0.9, 0.431), dash: type(0.43, 0.47) },
      { k: 'lit', d: C(498, 296, 8), op: on(0.48, 0.9, 0.51) },
      { k: 'acc', d: C(498, 296, 8), op: on(0.48, 0.9, 0.51) },
      { k: 'acc', d: L(506, 296, 535, 296), op: on(0.53, 0.9, 0.531), dash: type(0.53, 0.57) },
      { k: 'dot', d: C(544, 296, 3.5), o: [544, 296], op: on(0.58, 0.9, 0.6), tf: [[0, S(0.3)], [0.58, S(0.3)], [0.62, S(1)], [1, S(1)]] },
      { k: 'acc', d: R(430, 64, 96, 178, 14), op: on(0.68, 0.9, 0.681), dash: type(0.68, 0.82) },
      { k: 'lit', d: R(444, 124, 40, 12, 6), op: blink(0.72, 0.75, 0.86) },
      {
        k: 'ink', d: 'M268 232L268 258L274.5 251.5L279.5 262.5L284 260.5L279 249.5L288 249.5Z', rest: true,
        tf: [[0, T(0, 0)], [0.06, T(0, 0)], [0.22, T(91, 0)], [0.3, T(91, 0)], [0.38, T(184, 68)], [0.44, T(184, 68)], [0.48, T(230, 68)], [0.54, T(230, 68)], [0.58, T(276, 68)], [0.64, T(276, 68)], [0.72, T(196, -102)], [0.84, T(196, -102)], [0.96, T(0, 0)], [1, T(0, 0)]],
      },
    ],
  },

  // Chatbot: baza wiedzy firmy → okno rozmowy (pytanie, odpowiedź) → zapytanie w Twojej skrzynce.
  // Historia: klient pyta, asystent "pisze" i odpowiada, gotowe zapytanie leci do skrzynki.
  chat: {
    parts: [
      ['soft', R(58, 104, 74, 94, 6)],
      ['paper', R(50, 112, 74, 94, 6)],
      ['paper', R(42, 120, 74, 94, 6)],
      ['bar', L(54, 140, 102, 140)],
      ['bar', L(54, 154, 94, 154)],
      ['bar', L(54, 168, 104, 168)],
      ['bar', L(54, 182, 88, 182)],
      ['acc', L(116, 168, 169, 168)],
      ['acc', AR(170, 168)],
      ['fill', R(170, 40, 250, 280, 16)],
      ['main', R(170, 40, 250, 280, 16), 'pen'],
      ['soft', L(170, 76, 420, 76)],
      ['accFill', C(192, 58, 9)],
      ['acc', C(192, 58, 9)],
      ['barHi', L(208, 58, 258, 58)],
      ['dot', C(402, 58, 3)],
      ['soft', R(268, 94, 132, 34, 12)],
      ['bar', L(282, 111, 384, 111)],
      ['accFill', R(188, 142, 172, 52, 12)],
      ['acc', R(188, 142, 172, 52, 12)],
      ['barAcc', L(202, 160, 330, 160)],
      ['barAcc', L(202, 176, 300, 176)],
      ['soft', R(186, 280, 196, 26, 13)],
      ['bar', L(200, 293, 262, 293)],
      ['accFill', C(398, 293, 10)],
      ['acc', C(398, 293, 10)],
      ['acc', L(420, 168, 469, 168)],
      ['acc', AR(470, 168)],
      ['fill', R(470, 124, 124, 88, 8)],
      ['main', R(470, 124, 124, 88, 8), 'pen'],
      ['bar', L(484, 146, 560, 146)],
      ['bar', L(484, 158, 540, 158)],
      ['soft', 'M470 176H508L516 190H548L556 176H594'],
      ['paper', C(594, 124, 9)],
      ['accFill', C(594, 124, 9)],
      ['acc', C(594, 124, 9)],
    ],
    marks: [[79, 262, 79, 214], [452, 92, 400, 111], [532, 258, 532, 212]],
    live: [
      { k: 'soft', d: R(298, 208, 102, 30, 12), rest: true, o: [400, 238], op: [[0, 0], [0.03, 1], [0.93, 1], [0.97, 0], [1, 0]], tf: [[0, S(0.6)], [0.035, S(1)], [1, S(1)]] },
      { k: 'bar', d: L(312, 223, 384, 223), rest: true, o: [400, 238], op: [[0, 0], [0.03, 1], [0.93, 1], [0.97, 0], [1, 0]], tf: [[0, S(0.6)], [0.035, S(1)], [1, S(1)]] },
      { k: 'soft', d: C(200, 256, 3), rest: true, op: typing(0) },
      { k: 'soft', d: C(212, 256, 3), rest: true, op: typing(0.013) },
      { k: 'soft', d: C(224, 256, 3), rest: true, op: typing(0.026) },
      { k: 'lit', d: R(188, 242, 150, 30, 12), o: [188, 257], op: on(0.34, 0.93, 0.37), tf: [[0, S(0.7)], [0.34, S(0.7)], [0.39, S(1)], [1, S(1)]] },
      { k: 'acc', d: R(188, 242, 150, 30, 12), o: [188, 257], op: on(0.34, 0.93, 0.37), tf: [[0, S(0.7)], [0.34, S(0.7)], [0.39, S(1)], [1, S(1)]] },
      { k: 'barAcc', d: L(202, 257, 306, 257), op: on(0.39, 0.93, 0.391), dash: type(0.39, 0.5) },
      { k: 'dot', d: C(0, 0, 4), op: [[0, 0], [0.67, 0], [0.69, 1], [0.78, 1], [0.8, 0], [1, 0]], tf: [[0, T(420, 168)], [0.69, T(420, 168)], [0.75, T(470, 168)], [0.79, T(532, 152)], [1, T(532, 152)]] },
      { k: 'lit', d: C(594, 124, 9), o: [594, 124], op: on(0.79, 0.93, 0.8), tf: [[0, S(1)], [0.79, S(1)], [0.82, S(1.35)], [0.86, S(1)], [1, S(1)]] },
      { k: 'dot', d: C(594, 124, 3), op: on(0.8, 0.93, 0.82) },
      { k: 'acc', d: 'M470 176H508L516 190H548L556 176H594', op: blink(0.8, 0.83, 0.95) },
    ],
  },

  // Audyt: strona pod lupą z oznaczonymi błędami, wykres ładowania (jeden wolny zasób)
  // i plan naprawczy z odhaczonymi punktami.
  // Historia: lupa przesuwa się po stronie i zapala znalezione błędy, plan odhacza kolejne
  // punkty, a wolny zasób na wykresie się skraca.
  audit: {
    parts: [
      ['fill', R(80, 40, 190, 270, 10)],
      ['main', R(80, 40, 190, 270, 10), 'pen'],
      ['barHi', L(100, 70, 200, 70)],
      ['bar', L(100, 90, 236, 90)],
      ['bar', L(100, 104, 220, 104)],
      ['bar', L(100, 118, 228, 118)],
      ['soft', R(100, 136, 150, 70, 5)],
      ['bar', L(100, 226, 236, 226)],
      ['bar', L(100, 240, 210, 240)],
      ['bar', L(100, 254, 226, 254)],
      ['bar', L(100, 268, 190, 268)],
      ['acc', 'M250 56L259 72H241Z'],
      ['acc', 'M120 146L129 162H111Z'],
      ['dash', L(270, 100, 320, 100)],
      ['dash', L(270, 247, 320, 247)],
      ['fill', R(320, 40, 160, 120, 8)],
      ['main', R(320, 40, 160, 120, 8), 'pen'],
      ['soft', L(336, 54, 336, 150)],
      ['bar', L(342, 62, 376, 62)],
      ['bar', L(352, 78, 410, 78)],
      ['bar', L(368, 114, 398, 114)],
      ['bar', L(374, 130, 420, 130)],
      ['bar', L(380, 146, 400, 146)],
      ['fill', R(320, 184, 160, 126, 8)],
      ['main', R(320, 184, 160, 126, 8)],
      ...checklist,
    ],
    marks: [[300, 22, 255, 58], [528, 96, 404, 96], [528, 247, 480, 247]],
    live: [
      { k: 'barAcc', d: L(360, 96, 462, 96), rest: true, o: [360, 96], tf: [[0, 'scaleX(1)'], [0.7, 'scaleX(1)'], [0.8, 'scaleX(0.45)'], [0.93, 'scaleX(0.45)'], [1, 'scaleX(1)']] },
      { k: 'dot', d: 'M250 56L259 72H241Z', op: on(0.2, 0.92, 0.23) },
      { k: 'dot', d: 'M120 146L129 162H111Z', op: on(0.44, 0.92, 0.47) },
      { k: 'acc', d: R(336, 251, 14, 14, 3), op: on(0.7, 0.92, 0.72) },
      { k: 'acc', d: 'M339.5 258L342.5 261.5L347 254.5', op: on(0.72, 0.92, 0.721), dash: type(0.72, 0.76) },
      { k: 'acc', d: R(336, 277, 14, 14, 3), op: on(0.8, 0.92, 0.82) },
      { k: 'acc', d: 'M339.5 284L342.5 287.5L347 280.5', op: on(0.82, 0.92, 0.821), dash: type(0.82, 0.86) },
      { k: 'main', d: C(196, 196, 46), rest: true, tf: LENS_MOVE },
      { k: 'thick', d: L(229, 229, 258, 258), rest: true, tf: LENS_MOVE },
    ],
  },
};

const DRAWN = new Set<Kind>(['main', 'thick', 'soft', 'acc', 'bar', 'barHi', 'barXL', 'barAcc', 'barAccXL', 'paper', 'ink']);

/** Tempo rysowania: odstęp między liniami (ms) i koniec startów linii (ms). */
export const timing = (art: ArtId) => {
  const n = ARTS[art].parts.length;
  const step = Math.min(34, 1000 / n);
  return { step, end: Math.round(n * step) };
};

const full = (tr: Track): Track => {
  const out = [...tr];
  if (out[0][0] > 0) out.unshift([0, out[0][1]]);
  if (out[out.length - 1][0] < 1) out.push([1, out[out.length - 1][1]]);
  return out;
};

/** Klatki WAAPI elementu historii (osobna animacja na każdą właściwość). */
export const liveFrames = (i: number, art: ArtId): { prop: 'opacity' | 'transform' | 'strokeDashoffset'; frames: Keyframe[] }[] => {
  const l = ARTS[art].live[i];
  const list: { prop: 'opacity' | 'transform' | 'strokeDashoffset'; frames: Keyframe[] }[] = [];
  const add = (prop: 'opacity' | 'transform' | 'strokeDashoffset', tr?: Track) => {
    if (tr) list.push({ prop, frames: full(tr).map(([offset, v]) => ({ offset, [prop]: String(v) })) });
  };
  add('opacity', l.op);
  add('transform', l.tf);
  add('strokeDashoffset', l.dash);
  return list;
};

/** Klatki podpisu kroku `i` (0..2): wjazd z dołu na początku kroku, zjazd w górę na końcu. Krok 1 jest
    widoczny od pierwszej klatki (w czasie rysowania stoi podpis z CSS) i wraca tuż przed końcem cyklu,
    więc przejście na kolejną pętlę jest bez szwu. */
export const beatFrames = (i: number): Keyframe[] => {
  const hide = 'translateY(6px)', gone = 'translateY(-4px)', shown = 'translateY(0)';
  if (i === 0) {
    return [
      { offset: 0, opacity: 1, transform: shown },
      { offset: BEATS[1] - 0.025, opacity: 1, transform: shown },
      { offset: BEATS[1] + 0.005, opacity: 0, transform: gone },
      { offset: 0.965, opacity: 0, transform: hide },
      { offset: 1, opacity: 1, transform: shown },
    ];
  }
  const t0 = BEATS[i];
  const t1 = i === 1 ? BEATS[2] : 0.96;
  return [
    { offset: 0, opacity: 0, transform: hide },
    { offset: t0, opacity: 0, transform: hide },
    { offset: t0 + 0.035, opacity: 1, transform: shown },
    { offset: t1 - 0.025, opacity: 1, transform: shown },
    { offset: t1 + 0.005, opacity: 0, transform: gone },
    { offset: 1, opacity: 0, transform: gone },
  ];
};

// ── KAMERA (wersja kinowa, propozycja 2026-09-27: "obecną zrób bardziej cinematic"): w każdym kroku
// scenki kadr najeżdża na miejsce akcji (środek [x, y] w jednostkach rysunku + zbliżenie z), między
// krokami płynny przejazd, na końcu cyklu odjazd do planu ogólnego. Kadr nie wychodzi poza rysunek.
type Cam = [number, number, number];
const CAMS: Record<ArtId, [Cam, Cam, Cam]> = {
  onepage: [[262, 150, 1.35], [296, 290, 1.35], [400, 290, 1.25]],
  company: [[320, 292, 1.35], [320, 292, 1.5], [320, 205, 1.1]],
  custom: [[160, 150, 1.3], [314, 250, 1.3], [396, 164, 1.4]],
  store: [[230, 120, 1.25], [345, 190, 1.4], [505, 230, 1.3]],
  crm: [[285, 245, 1.4], [348, 252, 1.5], [470, 150, 1.2]],
  uiux: [[262, 215, 1.35], [498, 290, 1.5], [478, 160, 1.35]],
  chat: [[300, 225, 1.35], [262, 250, 1.4], [500, 185, 1.3]],
  audit: [[222, 110, 1.35], [150, 180, 1.35], [400, 175, 1.25]],
};
const camT = ([cx, cy, z]: Cam) => {
  const tx = Math.min(0, Math.max(640 - 640 * z, 320 - cx * z));
  const ty = Math.min(0, Math.max(360 - 360 * z, 180 - cy * z));
  return `translate(${f(tx / 6.4)}%, ${f(ty / 3.6)}%) scale(${z})`;
};
/** Klatki kamery na cykl scenki (transform-origin 0 0 na .of-dw-cam). `boost` = mocniejsze zbliżenia na małej
    desce (telefon: plan.tsx liczy z szerokości rysunku) - akcja scenki czytelna jak w zbliżeniu filmowym. */
export const camFrames = (art: ArtId, boost = 1): Keyframe[] => {
  const [a, b, c] = CAMS[art].map(([x, y, z]) => [x, y, z * boost] as Cam);
  const wide = 'translate(0%, 0%) scale(1)';
  const io = 'cubic-bezier(.65, 0, .35, 1)';
  return [
    { offset: 0, transform: wide, easing: io },
    { offset: 0.1, transform: camT(a) },
    { offset: 0.31, transform: camT(a), easing: io },
    { offset: 0.42, transform: camT(b) },
    { offset: 0.64, transform: camT(b), easing: io },
    { offset: 0.75, transform: camT(c) },
    { offset: 0.87, transform: camT(c), easing: io },
    { offset: 0.99, transform: wide },
    { offset: 1, transform: wide },
  ];
};

export const Drawing = ({ i, art, acc, on, out, head, fig, beats }: {
  i: number; art: ArtId; acc: string; on: boolean; out: boolean; head: React.ReactNode; fig: string; beats: string[];
}) => {
  const a = ARTS[art];
  const { step, end } = timing(art);
  return (
    <div className="of-dw" data-i={i} data-on={on || undefined} data-out={out || undefined} style={{ '--oc': acc } as CSSProperties} aria-hidden="true">
      {head}
      <div className="of-dw-box">
        <div className="of-dw-drag">
        <div className="of-dw-cam">
        <svg className="of-dw-svg" viewBox="0 0 640 360" focusable="false">
          {a.parts.map(([k, d, pen], j) => (
            <path
              key={j}
              d={d}
              className={`of-k-${k}`}
              pathLength={DRAWN.has(k) ? 1 : undefined}
              data-pen={pen ? j : undefined}
              style={{ '--d': `${Math.round(j * step)}ms` } as CSSProperties}
            />
          ))}
          {a.live.map((l, j) => (
            <path
              key={`l${j}`}
              d={l.d}
              data-lv={j}
              className={`of-lv of-k-${l.k}${l.rest ? ' of-lv--rest' : ''}`}
              pathLength={l.dash || (l.rest && DRAWN.has(l.k)) ? 1 : undefined}
              style={{ '--d': `${Math.round(end * 0.8)}ms`, transformOrigin: l.o ? `${l.o[0]}px ${l.o[1]}px` : undefined } as CSSProperties}
            />
          ))}
          {a.marks.map(([x, y, tx, ty], j) => (
            <g key={`m${j}`} className="of-lead" style={{ '--d': `${end + 120 + j * 140}ms` } as CSSProperties}>
              <path d={L(x, y, tx, ty)} pathLength={1} />
              <circle cx={tx} cy={ty} r={2.4} />
            </g>
          ))}
          {a.parts.map(([, , pen], j) => (pen ? <circle key={`p${j}`} className="of-pen" data-pen-dot={j} r={2.6} /> : null))}
        </svg>
        {a.marks.map(([x, y], j) => (
          <span key={j} className="of-mark" style={{ left: `${(x / 640) * 100}%`, top: `${(y / 360) * 100}%`, '--d': `${end + 60 + j * 140}ms` } as CSSProperties}>
            {j + 1}
          </span>
        ))}
        </div>
        </div>
      </div>
      <p className="of-dw-cap">
        <span className="of-dw-fig">{fig}</span>
        <span className="of-dw-beats">
          {beats.map((b, j) => <span key={j} data-beat={j}>{b}</span>)}
        </span>
      </p>
    </div>
  );
};
