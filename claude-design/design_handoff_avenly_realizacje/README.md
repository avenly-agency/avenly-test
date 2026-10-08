# Handoff: Avenly.pl — sekcja „Realizacje” (wariant 8b „Kurtyna”)

## Overview
Druga sekcja strony głównej avenly.pl, tuż pod hero. Jedna scena Full HD: na czarnym, „jedwabnym” tle (shader WebGL) stoi duży kadr ze screenshotem realizacji (1200×675, szkło), odbijający się w lakierowanej podłodze poniżej. Pod podłogą — typograficzny indeks czterech projektów z miniaturami i wędrującym hairline-wskaźnikiem. **Jeden gest scrolla = jedno przejście** do następnego/poprzedniego projektu (animacja czasowa 1,5 s, kurtyna od dołu); w trakcie animacji scroll jest ignorowany, po jej końcu natychmiast można wykonać kolejny.

## About the Design Files
`realizacje-8b.html` to **referencja designu w HTML** — samodzielny prototyp 1:1 (otwórz w przeglądarce). Nie jest to kod do wklejenia. Zadanie: **odtworzyć sekcję w istniejącym stacku Avenly (Next.js + GSAP + Lenis)** zgodnie z jego wzorcami. Logika (shader, pętla rAF, easingi) jest vanilla JS bez zależności — można ją przenieść niemal dosłownie do `useEffect` z cleanupem, albo zamienić pętlę na GSAP timeline (patrz „Interactions”).

## Fidelity
**High-fidelity.** Kolory, typografia, geometria, timing i easing są finalne. Kadr projektowy **1920×1080**; wszystkie wartości poniżej w px tego kadru.

---

## Screen — Realizacje (1920 × 1080, `background:#050505`, `overflow:hidden`)

Warstwy od tyłu (wszystkie `position:absolute`):

| # | Warstwa | Geometria | Uwagi |
|---|---|---|---|
| 1 | **Tło — shader „jedwab”** (WebGL) | canvas 960×540 rozciągnięty na 1920×1080 | GLSL w pliku; `u_mouse` = wygładzona pozycja kursora |
| 2 | Podłoga — przyciemnienie | `top:825 → bottom:0` | `linear-gradient(180deg, rgba(5,5,5,.55), rgba(5,5,5,.92) 60%)` |
| 3 | Linia horyzontu | `top:825, h:1px` | `linear-gradient(90deg, transparent, rgba(165,180,252,.45) 30%, rgba(165,180,252,.45) 70%, transparent)` |
| 4 | **Odbicie** | wrapper `top:826, w:1920, h:254`, `overflow:hidden`, `perspective:900px`, `filter:url(#ripple)`, maska `linear-gradient(180deg, rgba(0,0,0,.42), rgba(0,0,0,.12) 55%, transparent)` | w środku płaszczyzna `rotateX(34deg)` (`transform-origin:50% 0`) z 4 lustrzanymi kopiami kadru (`scale(1,-1)`) |
| 5 | **Scena** — 4 kadry (slab) | każdy 1200×675 @ `translate(360px,130px)` | szkło: `padding:8px; border-radius:16px; background:rgba(2,6,23,.85); border:1px solid #1e293b; border-top-color:rgba(255,255,255,.18)`; wewnątrz `border-radius:10px; overflow:hidden; background:#0a0f1e`, `<img object-fit:cover; object-position:top>` + element `sweep` (poświata) |
| 6 | Pułapka scrolla | `inset:0; overflow-y:auto; scrollbar-width:none` | 3 × 1080 px pustej treści; patrz „Trigger” |
| 7 | Chrome | `left/right:56, top:40` | Geist Mono 400 11px, `letter-spacing:.16em`, uppercase, `#64748b`: „Realizacje” · „Jeden scroll — jeden kadr” |
| 8 | Hairline indeksu | `top:940, h:1px, left:0→right:0` | `linear-gradient(90deg, transparent, rgba(255,255,255,.1) 20%, rgba(255,255,255,.1) 80%, transparent)`; na nim **wskaźnik** `h:1px; background:#f1f5f9` o szerokości aktywnej pozycji |
| 9 | **Indeks** | `top:962; display:flex; justify-content:center; gap:72px` | 4 pozycje (`<a>` do realizacji) |

### Pozycja indeksu (`<a>`, `display:flex; align-items:center; gap:16px; padding:6px 0`)
- Miniatura 96×54, `border-radius:6px`, `box-shadow:0 0 0 1px rgba(255,255,255,.1)`, `background:#0a0f1e`, `<img cover top>`; **opacity = .25 + .75·(1−s)** (aktywna = wygaszona, bo „jest na scenie”).
- Kolumna tekstu (`gap:6px`): indeks `01` — Geist Mono 400 10px `letter-spacing:.14em`; nazwa — Inter 500 15px/1.2 `letter-spacing:-.01em`, `white-space:nowrap`.
- Kolor pozycji: aktywna `#f1f5f9`, pozostałe `#475569`, `transition:color .6s`.
- Klik → przejście do tego projektu (ta sama animacja).

### Dane (4 projekty)
| # | Nazwa | Kategoria | URL | Link | Screenshot |
|---|---|---|---|---|---|
| 01 | Grawerstwo Józef Kardyś | Sklep internetowy | grawerstwomielec.pl | /realizacje/grawerstwo-kardys/ | /portfolio/grawerstwo-kardys.webp |
| 02 | Gabinet Fizjoterapii Mcentrum | Strona WWW | mcentrumfizjoterapia.pl | /realizacje/mcentrumfizjoterapia/ | /portfolio/mcentrumgabinet.webp |
| 03 | Klub Sportowy RKS | Strona WWW | klubsportowyrks.pl | /realizacje/klub-sportowy/ | /portfolio/klubsportowy.webp |
| 04 | Wirtualny Asystent AI | AI & Boty | avenly.pl | /uslugi/automatyzacje-ai/chatboty-ai/ | /portfolio/avenly-chatbot.webp |

Bez dat (celowo).

---

## Interactions & Behavior

### Model stanu
`idx` (0–3, aktywny projekt), `p` (ciągły postęp 0–3; w spoczynku `p = idx`), `anim {from, to, t0}` lub `null`, `lockUntil` (timestamp). Dla każdego kadru `i`: `d = p − i`, `out = d ≥ 0`, `raw = clamp(1 − |d| / 0.8, 0, 1)`, `s = ease(raw, out)`.

### Trigger — „jeden scroll = jeden kadr”
- Scroll **wywołuje** przejście, nie scrubuje go. Prototyp: natywny scroller trzymany na `scrollTop = 1080` („środek”); gdy `|scrollTop − 1080| > 24px` → `go(idx ± 1)`, reset na środek. Produkcyjnie z Lenis: nasłuchuj `wheel`/`lenis.on('scroll')` w obrębie sekcji (pinned), próg |ΔY| ≥ 24 px, kierunek = znak.
- `go(to)`: `to = clamp(to, 0, 3)`; jeśli `to === idx` lub trwa animacja — ignoruj. Ustaw `anim = {from: idx, to, t0: now}`, `idx = to`, `lockUntil = now + 1500`.
- W trakcie blokady kolejne gesty są **ignorowane** (`preventDefault` na wheel, by nie przewijać strony). **Blokada kończy się dokładnie z końcem animacji** — następny gest działa natychmiast.
- Alternatywne wejścia: strzałki ↑/↓/←/→, swipe (próg 40 px), klik w indeksie.
- Na skrajach (idx 0 w górę / idx 3 w dół) nic się nie dzieje — tu produkcyjnie należy **oddać scroll stronie** (odpięcie sekcji), by użytkownik mógł kontynuować na następną sekcję.

### Animacja przejścia — czas **1500 ms**, `p` biegnie liniowo `from → to`
Postęp `raw` liczony jak wyżej (okno ±0.8 wokół kadru ⇒ wychodzący gaśnie w pierwszych 80 % czasu, wchodzący rośnie w ostatnich 80 %, faza wspólna ≈ 60 %).

Easingi (cubic-bezier jak w CSS, patrz `bez()` w pliku):
- **wchodzący**: `cubic-bezier(.16, 1, .3, 1)` (expo-out — standard Avenly) → `s = IN(raw)`
- **wychodzący**: `cubic-bezier(.7, 0, .84, 0)` (expo-in) → `s = 1 − OUT(1 − raw)`

| Kanał | Wychodzący (`out`) | Wchodzący |
|---|---|---|
| translateY | `−16px · (1−s)` (unosi się) | `+24px · (1−s)` (wynurza się) |
| opacity | `1 − (1−raw)³` (ease-out cubic) | `raw > 0 ? 1 : 0` (odsłania go maska) |
| filter | `blur(3px · (1−s))` | brak |
| clip-path | brak | `inset((1−s)·100% 0 0 0 round 16px)` — **kurtyna od dołu** |
| z-index | 1 | 2 |
| box-shadow | `0 50s px 110s px −40px rgba(0,0,0,.95), 0 0 80s px rgba(47,91,235,.10·s)` | j.w. |
| tilt (kursor) | `rotateY((mx−.5)·3°·s) rotateX((.5−my)·2.5°·s)`, `perspective(1600px)` | j.w. |

- **Odbicie** kadru: ten sam `x`, `y` lustrzane względem `F = 825`: `translate(x, 2·825 − y − 826) … scale(1,−1)`, ten sam `rotateY`; `opacity = op · s`. Falowanie: `feTurbulence baseFrequency` animowane co klatkę: `x = .005 + .0015·sin(t/2300)`, `y = .045 + .012·sin(t/1700)`; `feDisplacementMap scale=9`; `feGaussianBlur 1`.
- **Sweep** (poświata po dojechaniu, gdy `s > .985`): pasek `width:26%`, `skewX(−14deg)`, gradient `transparent → rgba(255,255,255,.14) → transparent`; keyframes `left −30% → 110%`, opacity `0 → 1 (25 %) → 1 (75 %) → 0`, **1800 ms ease-in-out**, raz na dojazd.
- **Wskaźnik indeksu**: `translateX` = interpolacja liniowa między lewymi krawędziami pozycji `floor(p)` i `ceil(p)`; szerokość interpolowana analogicznie. Kolor pozycji aktualizuje się, gdy zmienia się kadr o największym `s`.
- **Miniatury**: `opacity = .25 + .75·(1−s)`.
- Kursor: `m += (target − m)·.05` co klatkę; zasila shader (`u_mouse`) i tilt.

### Redukcja ruchu
`prefers-reduced-motion`: przejście = crossfade 600 ms bez clip-path/blur/translate; shader statyczny (jedna klatka) lub zastąpiony `#050505` + radial `rgba(17,43,130,.35)`; bez falowania odbicia.

### Wydajność
- Shader renderuje w 960×540 (0.5×), rozciągnięty CSS — celowo. `document.hidden` → pauza; IntersectionObserver → rAF tylko gdy sekcja w viewport.
- Filtr SVG na odbiciu jest najdroższą warstwą; na `<1024px` wyłączyć displacement (zostawić blur+maskę).
- Obrazy: `<Image>` z `sizes` 1200px, `priority` dla 01.

## Responsive
Prototyp skaluje kadr 1920×1080 do okna (`scale(min(vw/1920, vh/1080))`). Produkcyjnie: sekcja `100svh`, kadr 16:9 `max-width: min(1200px, 62.5vw)`, podłoga liczona od dołu kadru + 20 px; `<1024`: indeks w 2 kolumny × 2 wiersze lub przewijany poziomo, miniatury 72×40; `<640`: bez odbicia, bez shadera (statyczny gradient), kadr `calc(100vw − 48px)`.

## Design Tokens
Kolory: `#050505` tło · `#020617` · `#0a0f1e` tło kadru · `#0b1332` planeta body (shader `body`) · `#112b82` (shader `mid`) · `#2f5beb` · `#1e293b` border szkła · `#475569` indeks nieaktywny · `#64748b` mono · `#94a3b8` · `#f1f5f9` aktywny / wskaźnik · `#a5b4fc` rim / linia horyzontu (`rgba(165,180,252,.45)`).
Typografia: **Inter** 500/600 · **Geist Mono** 400/500. Skala: 10 (mono indeks, ls .14em) · 11 (mono chrome, ls .16em) · 15 (nazwa w indeksie).
Radius: 16 (szkło) · 10 (obraz) · 6 (miniatura). Cienie: `0 50px 110px −40px rgba(0,0,0,.95)` · glow `0 0 80px rgba(47,91,235,.10)`.
Easing: `cubic-bezier(.16,1,.3,1)` (in) · `cubic-bezier(.7,0,.84,0)` (out) · czas przejścia **1500 ms** · sweep 1800 ms.

## Assets
Screenshoty realizacji z `https://avenly.pl/portfolio/*.webp` (już w projekcie). Fonty: Google Fonts (Inter, Geist Mono) → w Next.js `next/font`. Cała grafika tła proceduralna (GLSL w pliku).

## Files
- `realizacje-8b.html` — samodzielny prototyp 1:1 (markup z inline stylami, GLSL, logika triggera i animacji). Źródło prawdy dla wszystkich wartości powyżej.
