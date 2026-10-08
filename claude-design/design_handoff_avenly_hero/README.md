# Handoff: Avenly.pl — Hero strony głównej (wariant 12a „Audyt”)

## Overview
Pierwsza sekcja (100vh) strony głównej avenly.pl. Scena: na dole kadru wyłania się horyzont ogromnej, idealnie okrągłej „planety” (shader WebGL, liquid-glass), nad nim po łuku orbity płynie logotyp **AVENLY** zbudowany z ~30 000 cząstek połączonych w siatkę (particle mesh), odbijający się w powierzchni planety. Nad logotypem — nocne niebo z paralaksą i konstelacją 6 usług. Na korpusie planety, wyśrodkowane: headline + „szklany” pasek inputu (adres strony → **Zbadaj stronę**) + mono-linia dowodów.

Wartość komunikowana: Avenly = szybkość / SEO / konwersja; hero prowadzi do audytu strony użytkownika (lead z realnym bólem), nie do generycznej „darmowej wyceny”.

## About the Design Files
`hero-12a.html` to **referencja designu w HTML** — działający prototyp pokazujący docelowy wygląd i ruch 1:1, nie kod do wklejenia. Zadanie: **odtworzyć tę sekcję w istniejącym stacku Avenly (Next.js + GSAP + Lenis)** zgodnie z jego wzorcami. Logika canvas/WebGL z prototypu może zostać przeniesiona niemal dosłownie (vanilla JS, zero zależności) — najlepiej jako moduły w `useEffect` z cleanupem. Jeśli w kodzie istnieje już nav/header — użyć go; opisany tu jest wyłącznie po to, by hero renderowało się kompletnie.

## Fidelity
**High-fidelity.** Kolory, typografia, odstępy, timing i easing są finalne. Odtworzyć pixel-perfect (w kadrze projektowym 1440×900; skalowanie i responsywność — patrz „Responsive”).

---

## Screens / Views

### Hero (jedyny widok) — kadr projektowy 1440 × 900, `position: relative; overflow: hidden; background: #050505`

Warstwy od tyłu do przodu (wszystkie `position:absolute`, współrzędne w px kadru 1440×900):

| # | Warstwa | Geometria | Uwagi |
|---|---|---|---|
| 1 | Glow atmosfery | div `left:-30 top:540 w:1500 h:1500 border-radius:50%`, `filter:blur(30px)` | `radial-gradient(circle at 50% 4%, rgba(96,165,250,.5), rgba(47,91,235,.35) 10%, rgba(17,43,130,.18) 24%, transparent 44%)`; fade-in 200 ms delay, 2600 ms |
| 2 | **Planeta** (WebGL) | canvas 1440×900; okrąg: środek **(720, 1902)**, promień **1300** → horyzont w y=602 | shader poniżej; fade-in 900 ms delay, 2200 ms |
| 3 | **Odbicie logotypu** (canvas 2D) | 1440×900, `opacity:.7` | odbija canvas cząstek w powierzchni planety |
| 4 | **Logotyp z cząstek** (canvas 2D) | `top:80 h:790` (0–790 lokalnie) | tryb `mesh`, wygięty po łuku R=1300+28 |
| 5 | **Niebo + konstelacja** (canvas 2D) | 1440×900 | gwiazdy, glinty, spadająca gwiazda, 6 węzłów |
| 6 | Przyciemnienie dołu | div `top:720 → bottom:0` | `linear-gradient(180deg, rgba(5,5,5,0), rgba(5,5,5,.75) 45%, rgba(5,5,5,.96))` |
| 7 | Nav | `left:48 right:48 top:0 h:88` | fade-in 400 ms delay, 1200 ms |
| 8 | Blok CTA | `left:0 right:0 top:704`, flex column, `align-items:center; gap:20` | headline → input bar → mono-linia |

### 7. Nav (`display:flex; align-items:center; justify-content:space-between`)
- **Logo** (lewo): „AVENLY” + „.” — Inter 700 20px/1, `letter-spacing:-.04em`, biały; kropka `#3b82f6`.
- **Menu** (idealnie w osi strony: `position:absolute; left:50%; transform:translateX(-50%)`), `display:flex; gap:40px`, Inter 500 14px/1, `#94a3b8`, hover `#fff` (transition .3s). Pozycje: Usługi · Proces · O nas · Realizacje · Blog · Kontakt · **EN** (700, `letter-spacing:.04em`).
- **CTA** (prawo): „Darmowa Wycena” — Inter 700 14px/1, `padding:11px 20px`, bg `#fff`, color `#020617`, `border-radius:8px`, `box-shadow:0 0 15px -5px rgba(255,255,255,.4)`; hover bg `#e2e8f0`.

### 8. Blok CTA
1. **Headline** `<h1>` — Inter 700 34px/1.1, `letter-spacing:-.035em`, `white-space:nowrap`, center, `margin:0`.
   Tekst: `Twoja strona ma potencjał. ` + gradientowy span `Sprawdź, ile go traci.`
   Gradient tekstu: `linear-gradient(90deg,#60a5fa,#a5b4fc)` + `background-clip:text; color:transparent`.
   Wrapper `overflow:hidden; padding-bottom:.1em` (maska dla animacji „rise”).
2. **Input bar** (szkło) — `display:flex; align-items:center; gap:8px; padding:8px 8px 8px 22px; border-radius:16px; background:rgba(2,6,23,.55); border:1px solid #1e293b; border-top-color:rgba(255,255,255,.14); backdrop-filter:blur(20px); box-shadow:0 30px 60px -20px rgba(0,0,0,.7)`.
   Zawartość w kolejności:
   - prefiks `https://` — Geist Mono 500 12px/1, `#64748b`, `letter-spacing:.06em`
   - pole (w prototypie statyczny placeholder) `adres-twojej-strony.pl` — Inter 400 15px/1, `#64748b`, `padding:0 14px 0 6px; min-width:300px`. **W produkcji: prawdziwy `<input type="url">`**, tekst wpisany `#f8fafc`, bez obramowania/tła, focus bez outline (focus state = jaśniejszy border całego paska `rgba(96,165,250,.5)`).
   - separator `1×24px #1e293b`
   - **przycisk „Zbadaj stronę →”** — Inter 700 15px/1, `padding:16px 26px`, bg `#fff`, color `#020617`, `border-radius:12px`, `gap:8px`, strzałka waga 500; hover `box-shadow:0 0 30px -5px rgba(255,255,255,.45)`; efekt magnetyczny (niżej).
3. **Mono-linia** — Geist Mono 400 11px/1, `letter-spacing:.14em; text-transform:uppercase`, `#64748b`:
   `Szybkość · SEO · konwersja · wynik w 60 s · bez rejestracji`

---

## Interactions & Behavior

### Choreografia wejścia (od zamontowania sekcji; czasy = delay / duration, ms)
Easing standardowy **`cubic-bezier(.16,1,.3,1)`** (expo-out); dla `fade` — `ease-out`. Wszystko `fill: both`.

| Element | Typ | delay | dur |
|---|---|---|---|
| glow atmosfery | fade 0→1 | 200 | 2600 |
| nav | fade | 400 | 1200 |
| cząstki logotypu | fizyka (niżej) | 600 (+ per-cząstka 0–900 losowo) | ~1400 per cząstka; całe wejście ≈ 3600 |
| niebo/konstelacja | start | 800 | gwiazdy 1600; węzeł i: 300 + i·260 → 900; linia k: 700 + k·240 → 1000 |
| planeta | fade | 900 | 2200 |
| headline | **rise** (`translateY(112%) → 0` pod maską) | 2800 | 1400 |
| input bar | **up** (`translateY(40px), opacity 0 → 0, 1`) | 3100 | 1300 |
| mono-linia | fade | 3500 | 1200 |

Sekcja odtwarza choreografię ponownie po powrocie na kartę (`visibilitychange`). Prototyp: spacja = replay.

### Magnetyczne przyciski (`[data-magnet]`)
Przy `mousemove` na sekcji: jeśli odległość kursora od środka przycisku `< 140px` → `transform: translate(dx*.3, dy*.3)`; inaczej `''`. `transition: transform .5s cubic-bezier(.16,1,.3,1)`. Reset na `mouseleave`. (dx, dy w px kadru — dziel przez skalę sekcji.)

### Kursor → scena
Sekcja trzyma znormalizowaną pozycję myszy `m = {x, y ∈ 0..1}` wygładzaną `m += (target - m) * .05` co klatkę oraz surową pozycję `px, py` w px kadru (−1 gdy kursor poza sekcją). Zasilają: shader planety (kierunek światła), odpychanie cząstek, paralaksę gwiazd, podświetlanie konstelacji.

### Redukcja ruchu
`prefers-reduced-motion`: pominąć fizykę cząstek (narysować logotyp od razu), wyłączyć paralaksę/spadające gwiazdy; zostawić fade-iny.

---

## Warstwa 2 — Planeta (WebGL fragment shader)
Fullscreen-triangle, `webgl` z `alpha:true, premultipliedAlpha:false`, `clearColor(0,0,0,0)`. Canvas backing = 1440×900 (bez DPR — celowo, wydajność; można podnieść do DPR 1.5).
Uniformy: `u_res` (1440,900), `u_time` (s), `u_mouse` (m.x, 1−m.y), `u_int` = 1.0 (intensywność „cieczy”), `u_c` = (720, 1902, 1300).

Pełny GLSL jest w `hero-12a.html` (`FRAG.planet`) — przenieść 1:1. Streszczenie:
- `dist = length(p − c) − R`. Poza kulą: **glow atmosfery** `exp(−dist/70)*.42 + exp(−dist/14)*.35` w kolorze `vec3(.376,.647,.98)` (blue-400), alpha = glow·1.6.
- Wewnątrz: normal sferyczny `n = (d.x, d.y, sqrt(R²−r²))`; normal zaburzony 2× fbm (5 oktaw value-noise, uv = n.xy·4.2 płynące `u_time·.04 / −.025`) siłą `.22·u_int` → efekt liquid glass.
- Paleta: deep `(.02,.02,.03)`, body `(.043,.075,.196)` ≈ #0b1332, mid `(.067,.169,.51)` ≈ #112b82, lite `(.184,.357,.922)` ≈ #2f5beb, rim `(.647,.706,.988)` ≈ #a5b4fc.
- Głębia `depth = smoothstep(0,340,−dist)` ciemni w dół kadru; diffuse od L1 `normalize(−.45 + mouse.x·.6, −.85, .55)`; fresnel `pow(1−n.z, 3.2)·1.25`; blik 1 `pow(·,110)`, blik 2 `pow(·,36)·.45`; smugi kaustyczne (fbm) `.32`; ukośny sheen `.12` oddychający `sin(u_time·.3)`; jasna krawędź horyzontu `rim·exp(−|dist+1.5|/2.2)·.95`.
- Krawędź AA: `inside = 1 − smoothstep(−1.2, 1.2, dist)`.

## Warstwa 4 — Logotyp z cząstek (canvas 2D, tryb „mesh”)
- Canvas `1440×790` @ DPR ≤ 1.5. Tekst **`AVENLY`** (kropka wyłączona), Inter **800**, `letter-spacing:-0.06em`, `textBaseline:middle`, startowo 340px, skalowany tak, by szerokość = **1440 − 250 = 1190px**; y-środek = 790/2 + 14 = 409 (przed wygięciem), tekst wyśrodkowany.
- Sampling: raster tekstu → punkt co **3px** (alpha > 128) z jitterem ±0.75px → ~30k cząstek.
- **Wygięcie po orbicie**: R₀ = 1300, gap = 28 → R = 1328; środek łuku C = (720, 602 − 80 + 1300) = (720, 1822) w układzie canvasa. Dla każdego punktu: `θ = (x − 720)/R`, `r = R + (baseline − y)` (baseline = najniższy y tekstu), `x' = 720 + r·sin θ`, `y' = C.y − r·cos θ`. Litery stoją prostopadle do orbity, ich spody leżą 28px nad horyzontem planety.
- **Sąsiedztwo**: pary punktów docelowych w odległości < L = 5.6px → krawędzie siatki. Linie rysowane gdy bieżąca odległość < 1.9·L, alpha `(1 − d/Lmax)·min(ez_p, ez_q)` skwantowane do 6 poziomów × .5, `lineWidth .7`, kolor `rgba(148,163,184,a)`; kropki `r=1.25`, `rgba(241,245,249,.9)`.
- **Fizyka** per cząstka: sprężyna `stiff = .015 + ez·.07` do celu, `damp .84`; odpychanie kursora w promieniu **150px** siłą `(1 − d/150)·4.5`. Start: cząstki rozrzucone `x = 720 ± 0.8·W, y = H/2 ± 1.5·H`; per-cząstka delay 0–900 ms; `ez = 1 − (1−k)³`, k = t/1400.
- **Optymalizacja** (ważne, ~30k punktów): po wejściu (3600 ms) siatka jest zapamiętana jako bitmapa (offscreen canvas); co klatkę: `drawImage` bitmapy, potem tylko cząstki „dynamiczne” (w zasięgu kursora lub jeszcze w ruchu) są czyszczone i przerysowane w ich bounding boxie z klipem; sąsiedzi znajdowani przez spatial hash (siatka 24px). Jeśli dynamicznych > 40% — pełny redraw.

## Warstwa 3 — Odbicie (canvas 2D)
Parametry `R=1300, topY=602, gap=260, k=.78`. Dla pasków szerokości 6px po x: `surf = topY + (R − sqrt(R² − dx²))` (powierzchnia planety), kopia paska canvasa cząstek odbita w pionie (`scale(1,−1)`), wysokość `790·k`, umieszczona od `surf − (gap − (surf − topY))·k`, alpha `1 − min(1,|dx|/R)·.35`. Następnie maska `destination-in` gradientem: `rgba(0,0,0,.5)` @ y=592 → `.22` @ 35% → `0` @ `602 + 790·.78·.95`. Cały canvas `opacity:.7`.

## Warstwa 5 — Niebo i konstelacja (canvas 2D, DPR ≤ 1.5)
- **Gwiazdy**: 3 warstwy (110 / 70 / 34 szt.) w y ∈ 0..520, promienie `.45–.8 / .8–1.3 / 1.3–2.1`; kolory 70% `226,232,240`, potem `165,180,252` / `96,165,250`; mruganie `sin(t/(900+L·500)·sp + ph)`, alpha `(.12 + .55·tw)·(.55 + L·.22)`; paralaksa za kursorem `(m−.5)·9·(L+1)` (y ×.6); największe przy `tw > .9` dostają krzyżyk 14px. Cutoff y > 560.
- **Mgławica**: radial `(720,240) r 620`: `rgba(47,91,235,.11) → rgba(17,43,130,.06) @50% → 0`.
- **Glinty** ×5: y 40–420, radial 18–28px `rgba(255,255,255,.35k) → rgba(165,180,252,.14k) @30% → 0`, oddychanie `sin(t/2400)`.
- **Spadająca gwiazda**: co 5–11 s, start x 200–1100, y 30–190, kąt .35–.75 rad, prędkość 520 px/s, czas .9 s, linia 1.2px z gradientem do białego, alpha `sin(f·π)`.
- **Węzły** (etykieta, pozycja): 01 Strony WWW (268,262) · 02 Sklepy online (452,168) · 03 Design UI/UX (668,214) · 04 Chatboty AI (870,150) · 05 Automatyzacje (1074,236) · 06 SEO & Marketing (1206,318). Dryf `±3px sin(t/2600+i)`, paralaksa `(m−.5)·14 / ·8`.
  Rysunek węzła: halo radial r 22+pulse·4 (hot: 40) `rgba(96,165,250,.28)`→`rgba(59,130,246,.08)`@45%→0; ring `r 6.5` (hot 9) `rgba(165,180,252,.35+pulse·.15)`; rdzeń biały `r 2.3` (hot 3.2); leader-line od (x+7,y−7) do (x+16,y−16) i dalej +22px w prawo, `rgba(148,163,184,.3)`; indeks `01` Geist Mono 500 11px `#60a5fa` @ (lx+28, ly−4); etykieta UPPERCASE z hair-space między literami, `rgba(203,213,225,.8)` @ (lx+52). Przy narodzinach pierścień rozchodzący 4→50px przez 1100 ms.
- **Linie**: [0-1],[1-2],[2-3],[3-4],[4-5],[2-4]; rysują się od A do B (grow ease 1000 ms), gradient wzdłuż: `.35a → a → .35a`, a = .3 (hot .75), kolor `148,163,184` (hot `96,165,250`), lineWidth 1 (hot 1.2). Po narysowaniu impuls: kropka `r 1.4` biała ze smugą 12% długości `rgba(165,180,252,.6)`, cykl `(t/2600 + k·.41) mod 1.7` (hot: `t/900`).
- **Hover**: najbliższy węzeł w promieniu 130px = `hot`; jego sąsiedzi = `warm` (halo .4).

---

## State Management
- `mouse {x,y,tx,ty,px,py}` na sekcji (ref, nie React state).
- `inputUrl: string` — kontrolowany input; submit → walidacja URL (dopuszczać bez schematu, dopisać `https://`), przejście do `/audyt?url=…` (lub wywołanie API audytu).
- Stany przycisku: default / hover / loading (spinner w miejscu strzałki, tekst „Badamy…”) / disabled gdy pole puste.
- Wszystkie rAF/listenery czyścić w unmount; pauzować rAF gdy sekcja poza viewportem (IntersectionObserver) i gdy `document.hidden`.

## Responsive
Prototyp skaluje cały kadr 1440×900 `scale(min(vw/1440, vh/900))` wyśrodkowany. Produkcyjnie zalecane:
- ≥1280: kadr 1440×900 skalowany do szerokości; wysokość sekcji = 100svh, planeta pozycjonowana względem dołu.
- <1024: nav → hamburger; headline `text-wrap:balance`, 28px; input bar łamie się w kolumnę (input full-width, przycisk pod nim); logotyp cząstek skalowany z szerokością (fitW = vw − 80); konstelacja: 4 węzły (01, 03, 04, 06).
- <640: wyłączyć odbicie i siatkę linii (same kropki), DPR 1, shader w 0.75 skali.

## Design Tokens
Kolory: `#050505` tło · `#020617` slate-950 (tekst na białym) · `#0b1332` planeta body · `#112b82` mid · `#2f5beb` lite · `#1e293b` slate-800 (bordery) · `#334155` · `#64748b` slate-500 (mono) · `#94a3b8` slate-400 (nav) · `#cbd5e1` · `#e2e8f0` · `#f1f5f9` (cząstki) · `#f8fafc` · `#fff` · `#3b82f6` blue-500 (kropka logo, akcenty) · `#60a5fa` blue-400 · `#a5b4fc` indigo-300 · `#10b981` / `#34d399` (status, nieużywane w 12a).
Typografia: **Inter** 400/500/700/800 · **Geist Mono** 400/500. Skala: 11 (mono caps, ls .14em) · 12 (mono prefix) · 14 (nav) · 15 (input, button) · 20 (logo) · 34 (headline) · logotyp cząstek ~300+ (fit 1190px).
Radius: 8 (nav CTA) · 12 (button) · 16 (input bar). Cienie: `0 0 15px -5px rgba(255,255,255,.4)` · `0 0 30px -5px rgba(255,255,255,.45)` · `0 30px 60px -20px rgba(0,0,0,.7)`. Easing: `cubic-bezier(.16,1,.3,1)`.

## Assets
Brak bitmap. Fonty z Google Fonts (Inter, Geist Mono) — w Next.js użyć `next/font`. Cała grafika generowana proceduralnie (shader + canvas). Opcjonalnie w produkcji planetę można zastąpić pętlą wideo z Google Flow / Higgsfield (poster + `<video muted loop playsinline>`), zachowując geometrię horyzontu y=602/900.

## Files
- `hero-12a.html` — samodzielny prototyp (otwórz w przeglądarce; spacja = replay). Zawiera pełny GLSL planety, silnik cząstek, odbicie, niebo/konstelację i markup z inline stylami — źródło prawdy dla wszystkich wartości powyżej.
