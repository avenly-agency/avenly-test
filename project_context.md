# Project Context — Avenly Web

## Czym jest ten projekt

Strona internetowa agencji marketingowej **Avenly**. Prezentuje ofertę, portfolio, blog i umożliwia kontakt. Zbudowana jako statyczny export Next.js (hosting bez backendu na **Cloudflare Pages** od 2026-09-19), dwujęzyczna (PL na roocie, EN pod `/en/`).

## Stan strony (2026-10-08)

| Metryka | Wartość |
|---|---|
| Hosting | ✅ Cloudflare Pages (2026-09-19, migracja z Hostingera) — `npm run deploy`, `public/_headers` + `public/_redirects`, `.htaccess` usunięty; poczta na Hostingerze |
| Wersja EN | ✅ Sesja 28 — `/en/` z przetłumaczonymi slugami, hreflang, sitemap z alternates |
| Hero | ✅ Sesja 29 — scena 12a (planeta WebGL + logotyp + niebo z konstelacją usług), render planety = LCP; **2026-10-09 nowy logotyp z wejściem „chirurgiczne cięcie”** (cały napis wschodzi zza planety, gwiazda jak spadająca gwiazda przecina go po łuku orbity, połówki zsuwają się po łuku; cząstki usunięte; reszta strony głównej, czat i baner cookies ożywają dopiero po wejściu - `lib/hero-intro.ts`) - zaakceptowane, lokalnie |
| Logo | 🆕 2026-10-09 — **nowe logo** (AVENLY przecięte linią zakończoną gwiazdą): `public/logo/`, `lib/brand/logo.ts`, `components/ui/AvenlyLogo.tsx`; nawigacja, czat, ikony i `og-default.png` (`scripts/brand-icons.mjs`); stare logo w `Desktop/avenly/logo/stare logo/`; historia `docs/sekcje/hero-logo.md` - lokalnie, niewdrożone |
| TechStack (pasek pod hero) | ✅ 2026-09-24 — ikony w granatowym szkle, 8 faktów z oferty |
| Realizacje (homepage) | ✅ Sesje 30-31 + 2026-09-24 — zastąpiły dawne Portfolio; mgławica WebGL, automat 5 s, jednorazowa odsłona sekcji, osobny układ na dotyku, płynne przejście do „Dlaczego Avenly” |
| „Dlaczego Avenly” (Impact) | ✅ 2026-09-26 — wybór właściciela: **Stos warstw + Konstelacje**; karty w głębokiej czerni z zakładką (numer + kategoria), teren z warstwic na całej karcie (jasno przy wizualizacji, czysto pod tekstem), konstelacja z historią krok po kroku (napis kroku na dole karty), karty 2 i 4 w lustrze, stos z efektami przewijania na każdej szerokości (także telefon), kształty tła w kolorze karty na ekranie. ✅ 2026-09-27: tło sekcji = **Mapa warstwic**, tekst w karcie = **U góry** (reszta wariantów i przełączniki usunięte). Historia 11 rund: progress.md |
| Asystent AI (sekcja z pokazem rozmowy) | ❌ 2026-09-27 — **usunięta ze strony głównej** (decyzja właściciela: zbędna, asystent jest w „Dlaczego Avenly”, Realizacjach, Ofercie i w czacie); po Opiniach od razu Oferta |
| Proces | ✅ 2026-09-27 — wybory właściciela: **Wstęga** w materiale **Szkło** + tło **Głębia** (szklane wstęgi w oddali z paralaksą) - przezroczysta szklana wstęga rozwija się przy przewijaniu i prowadzi zygzakiem przez 4 etapy (także na telefonie: wzdłuż tekstu na przemian po lewej i prawej, między krokami łuk przez cały ekran) do „Bezpłatnej konsultacji”; WebGL (zapas canvas 2D), barwa etapu z akcentów Impactu; sekcja zamknięta |
| Oferta | ✅ 2026-09-27 — wybory właściciela: układ **Plan** (teczka rysunków technicznych: rysunek usługi rysuje się piórem, potem ożywa scenką w 3 krokach z kamerą najeżdżającą na akcję), indeks **Karty**, zegar karty **Obwódka** (ubywa do zmiany usługi), tło **Bez tła**; telefon: mocniejsze zbliżenia kamery, swipe z obrazem za palcem, linia od pigułki do deski; sekcja zamknięta. ✅ 2026-09-28: nowe copy usług (chwyt + konkret, wzór „To już nie tylko strona, to uczucie.”), bez WordPressa / CMS i bez obietnicy integracji z kurierami (także w `/uslugi`, na podstronie sklepu i w metadanych), UI/UX i audyt jako dodatki, AI w CRM jako opcja, przycisk „Cała oferta” w kolorze usługi z płynnym przejściem (PRODUCT.md „Co obiecujemy w ofercie”) |
| Blog (sekcja + podstrony) | ✅ 2026-09-29 — sekcja na stronie głównej = Panorama; `/blog` = „Wierna” (wersja z czerwca 2026 w nowym języku strony), wpis = „Okładka + Nagłówek na liniach” |
| Podstrony etapu 2 | ✅ `/uslugi` + `/uslugi/strony-www` (katalog: góra „Kropka”, karty Kadr, wejście Obrys, tło Mgławica - 2026-10-01), `/kontakt` (Obok siebie + Opływ - 2026-09-29), `/realizacje` + case studies (Plansze + Mgławica - 2026-10-01; case study przebudowane 2026-10-08: wersja „Klasyczna”); 🔎 `/o-nas` przebudowana od zera 2026-10-09 (sceny SVG na nowym logo, sterowane przewijaniem); 2026-10-09 propozycje w dwóch przełącznikach (4 wersje podstrony, 5 pełnoekranowych wejść) i **wybrane wejście „Panorama z cięciem”**, 2026-10-12 dopracowane z właścicielem (rundy 6-13), otwarte: co pod wejściem i sprzątanie propozycji |
| Usługi | 7 usług w 3 kategoriach; „Projekt UI/UX” usunięty jako osobna usługa 2026-10-01 (301 z `/uslugi/design*`); „Strona szyta na miarę” → „Strona interaktywna” 2026-10-06 (adres bez zmian) |
| Wdrożenie | 2026-10-14, `b349e699` (Cloudflare Pages; podgląd linku z hero i `favicon.ico`, wcześniej tego dnia `e22e7cd0`) - cały stan repozytorium: nowe tytuły i opisy stron, nowe logo i hero z cięciem, O nas (sekcje 1-7 wybrane), przejście przez gwiazdę w Realizacjach strony głównej / menu na telefonie / case study / Kontakcie, lepsza planeta w hero, strona główna bez wyniku PageSpeed, NIP JDG w danych firmy; podstrony w pracy w wariantach domyślnych (lista: `progress.md` „Stan wdrożenia”) |
| Git | 2026-10-14: commit `903f887` (2026-10-14, polecenie właściciela „na GitHuba też zpushuj”) na `main`, wypchnięty na GitHuba; poprzedni: `4baae40` z 2026-10-08; 2026-10-08: cała praca od czerwca w commicie `4baae40` na `main`, wypchniętym na GitHuba (`avenly-agency/avenly-test`, publiczne); dawny projekt testowy na Vercelu (`avenly-test.vercel.app`) usunięty |
| Etykiety sekcji | ✅ 2026-09-26 — wybór właściciela: **Gwiazda** (gwiazdki jak w hero + cienkie linie); wspólny `components/ui/SectionLabel.tsx` we wszystkich sekcjach strony głównej, pozostałe propozycje usunięte |
| Czat | ✅ 2026-09-24/25 — granatowe okno i bąbel, pełne tło bez `backdrop-filter` |
| Copywriting | ✅ Sesja 27+ — głos korzyści, jeden CTA „Bezpłatna konsultacja”, zero fabrykowanych metryk (PRODUCT.md) |
| Cookie consent (RODO) | ✅ Sesja 27 — baner 4-kategoriowy (`lib/cookie-consent.ts` + `components/cookie/CookieConsent.tsx`), montowany w DeferredClientWidgets |
| Polityka prywatności | ✅ Sesja 27 — pełne 12 sekcji RODO, dane z `lib/seo-data` |
| Navbar theming per podstrona | ✅ Sesja 27 — `getNavbarTheme()` zwraca obiekt `NavTheme`; Sesja 29/31: linki w osi strony, przełącznik PL/EN, tło bez granatu |
| PageSpeed | ostatni pomiar PSI (Sesja 22): mobile **85** / desktop **99**; lokalny Lighthouse po nowym hero: desktop 95-97 (LCP 1,0-1,2 s, CLS 0) — do ponownego pomiaru w PSI |
| Accessibility issues | 0 zgłoszonych (kontrasty AA w hero i Realizacjach poprawione względem makiet) |
| SEO setup | 9 typów JSON-LD (w tym ItemList realizacji), OG image, favicon set, robots 2026-ready, hreflang; tytuły i opisy stron odświeżone 2026-10-08 (lokalnie, przed wdrożeniem); grafika `og-default.png` w starym stylu - do zrobienia od nowa |
| AI search visibility | Google AI Overviews aktywnie cytuje z linkiem |
| WebGL shaders | stan 2026-10-14: tabela „WebGL shaders” w CLAUDE.md (od 2026-10-13 O nas ma jedną mgławicę na całą podstronę - `o-nas/page-sky.tsx`; planeta hero do DPR 2) (strona główna, `/kontakt`, `/blog`, `/uslugi`, `/realizacje`, 6 podstron usług, `/o-nas`: wersje SVG bez WebGL, ale wybrane wejście „Panorama” (2026-10-12) używa mgławicy szkieletu podstron usług `_usluga/sky.tsx`); stare shadery podstron usług nieaktywne (+2 w nieużywanym `Portfolio.tsx`) |
| Production navigation | ✅ Sesja 20 (Next.js 16 RSC bug — `scripts/flatten-rsc.mjs`) + Sesja 28: `scripts/copy-404.mjs` (custom 404 przy dwóch root layoutach) |
| Safari mobile compatibility | ✅ Sesja 21+22 — dvh, filter scroll, **overflow-x-clip** (nie hidden - łamało sticky), -webkit prefixes, viewportFit cover |
| Podstrony usług | ✅ one-page przebudowana i zamknięta 2026-10-02 (film w trzech scenach, szkielet `app/(pl)/uslugi/_usluga/`); ✅ strona firmowa zamknięta wg właściciela 2026-10-08 (w kodzie został przełącznik wersji kart do sprzątnięcia); 🔧 Strona interaktywna (dawniej „szyta na miarę”), sklep, system CRM, chatboty AI w pracy (etap 3 pracy równoległej - stan w PRACA-ROWNOLEGLA.md); stare wersje `*Client.tsx` nieimportowane |

## Wersja EN (Sesja 28 — 2026-07-07)

Cała strona (poza blogiem i polityką prywatności) ma wersję angielską pod `/en/` z PRZETŁUMACZONYMI slugami (`/en/about-us`, `/en/contact`, `/en/work`, `/en/services/websites/online-store` itd. — mapa segmentów `PL_TO_EN_SEGMENT` w `lib/i18n/locale.ts`; PL zostaje na roocie bez zmian URL-i). Architektura: route groups `app/(pl)` + `app/(en)/en` z dwoma root layoutami (poprawny `<html lang>`), wspólny `AppShell`, słowniki w `lib/i18n/` podawane przez props z server pages (RSC payload, nie bundle). Toggle PL/EN w Navbarze (desktop przy CTA + menu mobile). hreflang (`pl-PL`/`en`/`x-default`) + canonical per język na każdej przetłumaczonej parze + sitemap z alternates. Chatbot wysyła `language` do n8n (workflow musi przełączać prompt); EN welcome fallback w kodzie, quick replies na EN wymagają `label_en` w `chatbot_config`. Szczegóły i checklist nowej strony: sekcja „i18n" w [CLAUDE.md](./CLAUDE.md).

## Stack technologiczny

| Warstwa | Technologie |
|---------|-------------|
| Framework | Next.js 16.1.1 (Turbopack), React 19.2.3 |
| Stylowanie | Tailwind CSS v4 (PostCSS) |
| Animacje | Framer Motion 12, GSAP 3 + @gsap/react + ScrollTrigger |
| Smooth scroll | Lenis 1.3 (`SmoothScrolling.tsx` provider) |
| Formularze | React Hook Form + Web3Forms (klient-only, bez backendu) |
| Ikony | Lucide React, React Icons |
| Treść bloga | Raw HTML string (`dangerouslySetInnerHTML`) — NIE Portable Text |
| Hosting | Cloudflare Pages (od 2026-09-19; `public/_headers` + `public/_redirects`, deploy przez `wrangler`) |
| Browserslist | Chrome/Edge/FF 100+, Safari 15+, iOS 15+ (bez polyfilli ES6+) |

**Usunięte 2026-05-22** (były zainstalowane, ale nigdzie nieużywane): `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `next-sanity`, `@sanity/vision`, `@sanity/image-url`, `@portabletext/react`, `@types/three`. **Zaoszczędzone: 953 paczki z node_modules.**

## Sekcje strony głównej (kolejność z `components/home/HomeClient.tsx`)

1. **Hero** — scena 12a (Sesja 29): planeta WebGL + nowy logotyp AVENLY (od 2026-10-09: wschód zza planety i cięcie gwiazdą po łuku orbity, `hero/logo.ts`) + niebo z konstelacją usług + blok CTA (h1, „Bezpłatna konsultacja”, „Zobacz realizacje”). Szczegóły: CLAUDE.md „Hero strony głównej”
2. **TechStack** — pasek marquee „Co dostajesz”: 8 faktów z oferty (strona, która ładuje się od razu - od 2026-10-14 bez wyniku PageSpeed 98/100, projekt pod telefon, BLIK i karta, asystent AI, rezerwacje online, panel do zarządzania firmą, hosting na Cloudflare, lokalne SEO) z ikonami w granatowym szkle (`.ts-ico`, wybór właściciela 2026-09-24); pętla bez szwu (4 kopie, -50%), pauza po najechaniu; zostaje bezpośrednio pod hero (decyzja właściciela, Sesja 30)
3. **Realizacje** (Sesja 30, handoff 8b „Kurtyna”; `components/sections/Realizacje.tsx` + `realizacje/{scene,nebula}.ts`, CSS `.rz-*`) — ZASTĄPIŁA dawne Portfolio: tło mgławicy WebGL w barwach aktywnej realizacji (Sesja 31), kadr 1200×675 ze screenshotem (odbicie w podłodze z makiety usunięte - Sesja 31), indeks 4 projektów. Kadry zmieniają się SAME co 5 s (bez scroll-locka - decyzja właściciela), klik w indeks / swipe / strzałki ręcznie, pauza przy kursorze nad indeksem; desktop z myszą = scena 100vh, dotyk/<1024 = jedna kolumna z paskiem 4 miniatur (przebudowa 2026-09-24). **Wejście sekcji (2026-09-24):** shader „maluje” mgławicę i zapala gwiazdy, a na komputerze strona jednorazowo dociąga się do sekcji i blokuje scroll na ~2 s (jedyny wyjątek od zasady bez scroll-locka; na dotyku bez blokady). Dół sekcji przechodzi płynnie w czerń sekcji Impact. Szczegóły: CLAUDE.md „Realizacje strony głównej”. Dawne `Portfolio.tsx` + `lib/i18n/home/portfolio.ts` nieużywane (do usunięcia)
4. **Impact („Dlaczego Avenly”)** — **Stos warstw** (wybór właściciela 2026-09-26): 4 karty `position: sticky` jedna na drugiej na KAŻDEJ szerokości (kolejna nasuwa się, poprzednia cofa się w głąb bez rozmycia; na telefonie wysoka karta przykleja się, gdy widać jej dół). Karta: głęboka czerń, zakładka z numerem i kategorią (w stosie widać zakładki przykrytych kart), teren z cienkich warstwic w shaderze na całej karcie (`impact/shader.tsx`, 4 kolory; jasno przy wizualizacji, czysto pod tekstem), **konstelacja** z historią krok po kroku (`impact/viz.tsx`, napis kroku na dole karty); od 1024 px tekst obok wizualizacji, karty 2 i 4 w lustrze; 98/100 PageSpeed, link „Chatboty AI”, pod stosem „Sprawdź ofertę”. Tło sekcji (`impact/backdrop.tsx`) = Mapa warstwic w kolorze karty na ekranie; tekst w karcie u góry (wybór 2026-09-27). Bez efektów najechania. Szczegóły: CLAUDE.md „Sekcja Dlaczego Avenly”. **(Sesja 26: przesunięty PRZED Process)**
5. **Process** (#proces) — **Szklana wstęga + tło Głębia** (wybory właściciela 2026-09-27): przezroczysta szklana wstęga (WebGL na płótnie o wysokości toru, zapas canvas 2D; szkło, skręt i przejście przez krawędź w `process/silk.ts`) rozwija się przy przewijaniu (czoło w 64% okna), przy każdym z 4 etapów (Plan i strategia → Projekt graficzny → Budowa i technologia → Start i wsparcie) biegnie po stronie bez tekstu (komputer: zygzak 73% / 27%; telefon: wzdłuż tekstu na przemian po lewej i prawej, między krokami łuk S przez cały ekran) i schodzi na CTA „Bezpłatna konsultacja”; krok zapala się, gdy dojdzie do niego czoło. Tło Głębia (`process/backdrop.tsx`): dwie przygaszone szklane wstęgi w oddali z paralaksą, w kolorze etapu na ekranie, wygaszane pod tekstem. Style w `components/sections/process/process.css`. Szczegóły: CLAUDE.md „Sekcja Proces”
6. **Testimonials („Opinie”)** — układ Redakcja (wybór właściciela 2026-09-27): rozkładówka magazynu - nagłówek „Nie wierz nam na słowo. Uwierz klientom.”, 2 opinie Google cytowane dosłownie (pierwsza jako wielki cytat, druga w węższej szpalcie) z zakreślonym wspólnym słowem „polecam”, cytaty „w cudzysłowie” (znaki “ ” rysowane kreską na liniach nad i pod cytatami, co 8 s obiega je plamka światła) (#opinie). Bez oceny „5,0” i gwiazdek (2026-09-28, decyzja właściciela) i bez JSON-LD (Review usunięty 2026-09-30 po błędzie w Search Console „Wiele weryfikacji bez obiektu aggregateRating”). Pliki: `components/sections/Testimonials.tsx` + `testimonials/*` (`editorial.tsx`, `shared.tsx`, `testimonials.css`). Szczegóły: CLAUDE.md „Sekcja Opinie”
7. **Services („Oferta”)** (#oferta na wrapperze + `id="uslugi"` na sekcji) — układ **Plan** (wybory właściciela 2026-09-27): oferta jako teczka rysunków technicznych. Komputer: karty usług w kategoriach po lewej (zegar automatu 8 s = obwódka wybranej karty, która ubywa), czarna deska po prawej - rysunek usługi rysuje się linia po linii z piórem kreślarskim, potem ożywa krótką scenką w 3 krokach (co usługa robi dla klienta) z kamerą najeżdżającą na akcję i podpisem kroku jak napisy; pod deską nazwa, zdanie korzyści, legenda 1-3 i link. Telefon / tablet: pasek pigułek z linią do deski, mocniejsze zbliżenia kamery, swipe z obrazem za palcem. Tło sekcji = czysta czerń; kolor otwartej usługi płynnie (1,3 s) przechodzi na krawędź deski, linie sekcji i przycisk „Cała oferta”. Copy (2026-09-28): każda usługa zaczyna od własnego chwytu o tym, co klient czuje lub zyskuje (strona na miarę „To już nie tylko strona, to uczucie.”, rysunek z moodboardem marki), potem fakty; bez WordPressa / CMS, bez obietnicy integracji z kurierami, UI/UX i audyt jako dodatki, AI w CRM jako opcja (PRODUCT.md „Co obiecujemy w ofercie”). Pliki: `components/sections/Services.tsx` + `components/sections/services/*` (`plan.tsx`, `nav.tsx`, `drawings.tsx`, `shared.tsx`, `services.css`), teksty `lib/i18n/services.ts` (`ServicesSectionDict`). Szczegóły: CLAUDE.md „Sekcja Oferta”
8. **BlogTeaser („Blog”, tylko PL)** — układ **Panorama** (wybór właściciela 2026-09-29): 3 najnowsze wpisy jako duże okładki; przewijanie = jazda kamery w bok (scena sticky na pełną szerokość ekranu, zdjęcia z paralaksą, okładki poza kadrem przygasają, licznik „01 / 03” z linią postępu). Nagłówek „Konkretna wiedza. Bez żargonu.” jest w scenie, a wszystko stoi przy krawędziach wrappera (okładka, tytuł wpisu i licznik przy lewej, „Wszystkie wpisy” przy prawej); szerokość okładki mierzona tak, żeby scena mieściła się w oknie. Ograniczony ruch = zwykłe karty. Pliki: `components/sections/BlogTeaser.tsx` + `blog-teaser/*` (`pan.tsx`, `shared.tsx`, `cards.tsx`, `data.ts`, `blog-teaser.css`), teksty `lib/i18n/home/blog-teaser.ts`. Szczegóły: CLAUDE.md „Sekcja Blog”
9. ~~**CallToAction**~~ — **usunięta 2026-09-27** (decyzja właściciela: sekcja „Gotowy na cyfrową dominację?” zbędna). Strona kończy się Blogiem (PL) / Ofertą (EN) i stopką; przycisk w nawigacji i link „Kontakt” w stopce prowadzą prosto na `/kontakt` (dawniej przewijały do kotwicy `#kontakt`).

**Usunięta 2026-09-27: sekcja „Asystent AI” (`AiConsultant`, pokaz rozmowy z asystentem między Opiniami a Ofertą).** Decyzja właściciela po trzech rundach propozycji: „nie pasuje do reszty, jest trochę zbędna”. Asystenta pokazują już: karta 2 w „Dlaczego Avenly” (historia + link „Chatboty AI”), „Wirtualny Asystent AI” w Realizacjach („Porozmawiaj z asystentem”), konstelacja hero, pasek pod hero, Oferta i prawdziwy czat w rogu każdej strony. Pliki (`components/sections/AiConsultant.tsx`, `components/sections/ai-consultant/`, `lib/i18n/home/ai-consultant.ts`) i pole `aiConsultant` w `lib/i18n/home/index.ts` usunięte. Nie przywracać bez prośby; historia propozycji w `docs/sekcje/asystent-ai.md`.

**Po zamknięciu sekcji (2026-10-01 → 2026-10-06):** Oferta ma 7 pozycji w 3 kategoriach („Projekt UI/UX” usunięty jako osobna usługa), a „Strona szyta na miarę” nazywa się „Strona interaktywna” (Oferta, konstelacja hero - węzeł „Strony interaktywne”, stopka z 6 usługami, etykieta w formularzu). 2026-10-05: optymalizacja hero (planeta w dwóch przebiegach, tempo rysowania z czasu, scena stoi przy < 30% widoczności, przycisk „Zobacz realizacje” bez `backdrop-filter`) i sekcji Realizacje (mgławica nie liczy się przed odsłoną sekcji).

Wszystkie sekcje poza Hero ładowane przez `next/dynamic` (lazy loading). Wrapper `.render-optimize` istnieje (trzyma kotwice `#proces`/`#oferta`/...), ale **`content-visibility` zostało USUNIĘTE (Sesja 26)** — łamało piny GSAP ScrollTrigger ([#465](https://github.com/greensock/GSAP/issues/465)) + powodowało przeskakiwanie scrolla po F5. Perf zapewnia sam lazy-load + IO-pauza shaderów. NIE przywracać.

## Architektura warstwy globalnej

Dwa root layouty (`app/(pl)/layout.tsx`, `app/(en)/layout.tsx`) renderują wspólny `components/layout/AppShell.tsx` (prop `locale`), który opakowuje treść w:
- **`<html lang={locale} className="dark bg-[#050505]">`** (tło chroni przed białym mignięciem przy nawigacji)
- **JSON-LD w `<head>`**: Organization + ProfessionalService + WebSite (zbudowane przez `lib/schemas.ts`)
- **Preconnect**: `https://kyfsjvgixmcmafvaiyak.supabase.co` (300ms LCP saving)
- **DNS prefetch**: `n8n.avenly.pl`, `images.unsplash.com` (używane po interakcji)
- **Favicon set** + `manifest.webmanifest` + `theme-color: #050505`
- **SmoothScrolling** (`components/providers/SmoothScrolling.tsx`):
  - `ReactLenis` z `duration: 1.2`, `syncTouch: !isMobile` (na telefonie natywne przewijanie)
  - integracja `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.lagSmoothing(0)`
  - **globalny reset scrolla** przy każdej zmianie `pathname` — odłożony do `requestAnimationFrame` (Sesja 20), bez `ScrollTrigger.refresh()` (refresh racował z unmountującymi się pinami homepage = race conditions + silent navigation fail)
  - `AnchorManager` — obsługa `?target=sectionId` z auto-korekcją w `onComplete` (retry x3)
- **Navbar** (sticky, dynamiczny motyw granicy per pathname)
- **Footer** (`dynamic` z SSR — osobny chunk, lazy hydration)
- **DeferredClientWidgets** (`'use client'` wrapper — ładuje LifecycleManager + Chatbot + **CookieConsent**, wszystkie `dynamic` z `ssr: false`, montowane po `requestIdleCallback` (timeout 1500 ms) - Sesja 28):
  - **LifecycleManager** — `lenis.stop()` gdy `document.hidden`, restart + resize po powrocie (lazy z `ssr: false`)
  - **Chatbot** — globalny widget z bubble (lazy z `ssr: false`, po idle)
  - **CookieConsent** (Sesja 27) — baner RODO (`components/cookie/CookieConsent.tsx`, lazy z `ssr: false`)

## Kategorie usług i routing

| Kategoria | Slug | Podstrony (aktywne) | Wkrótce |
|-----------|------|---------------------|---------|
| Strony WWW | `strony-www` | One-page, Strona firmowa, Strona interaktywna (adres `strona-szyta-na-miare`), Sklep internetowy, System CRM i automatyzacje AI | — |
| ~~Design~~ | ~~`design`~~ | usunięta 2026-10-01 razem z usługą „Projekt UI/UX” (projekt do akceptacji jest częścią każdej budowy); 301 na `/uslugi/strony-www/` | — |
| Automatyzacja AI | `automatyzacje-ai` | Chatboty AI (`/uslugi/automatyzacje-ai/chatboty-ai`) | — |
| Marketing i Sprzedaż | `marketing` | — | Audyt SEO i Wydajności |

`/uslugi/` i `/uslugi/strony-www/` renderuje ten sam katalog `app/(pl)/uslugi/_katalog/Catalog.tsx` (zakres `hub` / `www`): niska góra z jednym zdaniem i kropką marki, filtr kategorii (Wszystkie / Strony WWW / Automatyzacja AI / Marketing i sprzedaż), galeria kart z animowanymi rysunkami Oferty (karta Kadr, wejście Obrys), box „Nie wiesz, co wybrać?”, tło Mgławica. Audyt wyświetla „Wkrótce” bez linku. Szczegóły: CLAUDE.md „Katalog usług”, notatki `docs/podstrony/uslugi.md`.

### Wzorzec podstron usług (od 2026-10-02)

Każda podstrona = `page.tsx` (server: `metadata` z `i18nAlternates` + `ServicePageSchema` + komponent z `copy.pl`) + komponent korzenia `'use client'` na szkielecie **`app/(pl)/uslugi/_usluga/`** (`ServiceShell`: kolor podstrony z adresu, tło-mgławica, wejście z czerni; `ServiceHead`, `ServiceEnding`, `usePin` / `useFrame`, `Dock` dla przełączników propozycji) + sceny w osobnych plikach + własny arkusz CSS z prefiksem + słownik `lib/i18n/uslugi/<podstrona>.ts` (typ `…Copy`, PL przez `typo()`). Trasa EN importuje komponent PL i podaje `copy.en`.

| Podstrona | Korzeń | Prefiks | Stan |
|---|---|---|---|
| one-page | `OnePage.tsx` | `one-` | ✅ zamknięta 2026-10-02 (film → stos kart → zakres z pokazem) |
| strona-firmowa | `StronaFirmowa.tsx` | `sf-` | ✅ zamknięta wg właściciela 2026-10-08 (film „Piętra”, karty podstron, stos, zakres; przełącznik wersji kart do sprzątnięcia) |
| strona-szyta-na-miare (usługa „Strona interaktywna”) | `CustomWebsite.tsx` | `sm-` | 🔧 w pracy (film „Horyzont”, Nić, Technologia, Detal, zakres) |
| sklep-internetowy | `Shop.tsx` | `sk-` | 🔧 w pracy (scena zakupu z mini sklepem, „Na tle szablonów”, stos, panel nocą, zakres) |
| system-crm | `SystemCrm.tsx` | `cr-` | 🔧 w pracy (sześć scen bez klikania; inna usługa: narzędzie) |
| chatboty-ai | `Chatboty.tsx` | `ch-` | 🔧 w pracy (pole pytań, „22:00”, Wiedza, Języki, Plan; inna usługa: rozmowa) |

Stare wersje (`CorporateWebsiteClient.tsx`, `DedicatedWebsiteClient.tsx`, `ShopClient.tsx`, `AppWebClient.tsx`, `ChatbotsAIClient.tsx`) i `components/templates/ServiceTemplate.tsx` leżą na dysku nieimportowane (źródło tekstów do zamknięcia podstron). Opis szkieletu i stanu: CLAUDE.md „Podstrony usług - szkielet i one-page” oraz „Podstrony usług w pracy - fala 2”; notatki `docs/podstrony/usluga-*.md`.

Każda aktywna podstrona usługi dostaje automatycznie:
- **Service JSON-LD** (rich result dla "wycena strony one page" itp.)
- **BreadcrumbList JSON-LD** (rich breadcrumbs w SERP)
- Pełne metadata z OG + Twitter Card + canonical + keywords

## Portfolio

Projekty w `app/data/projects.ts` (tłumaczenia EN: `EN_PROJECT` w `lib/i18n/projects.ts`). Aktualnie **4 projekty**. Sekcja Realizacje na stronie głównej ma własny słownik `lib/i18n/home/realizacje.ts` (kolejność = tablica `ORDER`: RKS → Kardyś → Wirtualny Asystent AI → Mcentrumfizjoterapia, decyzja właściciela) i kadry z `public/portfolio/stage/`.

| slug | Klient | hasCaseStudy | openChat |
|------|--------|--------------|----------|
| `grawerstwo-kardys` | Grawerstwo Józef Kardyś (grawerstwomielec.pl) | tak - pracownia od 1990 r.: przestarzała strona na WordPressie i niedziałający sklep → nowa strona, sklep z płatnościami online (BLIK, karta, przelew) i panel do zarządzania stroną oraz sklepem (Next.js, Supabase, Przelewy24). **Bez personalizacji graweru w sklepie** (poprawka właściciela 2026-09-25). Kategoria "Sklep internetowy" → filtr Sklepy | — |
| `mcentrumfizjoterapia` | Mcentrum Fizjoterapia | tak (case study + galeria) | — |
| `klub-sportowy` | Radzyński Klub Sportowy (nazwa wyświetlana „Klub Sportowy RKS”) | tak - **modernizacja strony klubu** (klub miał wcześniej stronę na WordPressie - poprawka właściciela 2026-10-08) + aplikacja klubowa (składki, kalendarz treningów, obecności, komunikacja; Next.js, Supabase, Resend, Cloudflare) + prowadzenie social mediów | — |
| `wirtualny-asystent-ai` | Avenly | nie | **tak** (kliknięcie otwiera chatbot przez `avenly:open-chat`) |

Pola projektu: `slug`, `title`, `category`, `year`, `client`, `description`, `mainImage`, `mockupImage`, `gallery[]`, `hasCaseStudy`, `externalLink`, `openChat?`, `techStack[]`, `stats[]`, `challenge`, `solution`.

`/realizacje/[slug]` ma `generateStaticParams` filtrujące po `hasCaseStudy: true`, generuje **CreativeWork** + **BreadcrumbList** JSON-LD oraz pełne OG (`mockupImage` jako preview).
**Podstrona `/realizacje` (zamknięta 2026-10-01):** nagłówek na cały pierwszy ekran („Dowód, nie obietnice.” + kadry w głębi z żywymi stronami klientów), Plansze 01-04 (przypięte sceny: wielka nazwa → kadr ze stroną klienta przewijaną razem z przewijaniem), „Wszystkie realizacje” (filtr, siatka, karta „Twoja firma może być następna”), mgławica za całą podstroną. **Case study (od 2026-10-08, wersja „Klasyczna” - wybór właściciela z dziesięciu propozycji):** nagłówek z opisem i linkiem do strony klienta obok nazwy (bez liczb „w skrócie”), przyklejony kadr „Strona na żywo” na szerokość wrappera (cała strona klienta przewija się w nim), punkt wyjścia i rozwiązanie w dwóch równych kolumnach, zakres i technologia, galeria, pytanie z „Bezpłatną konsultacją”, zapowiedź następnej realizacji; tytuł strony z rodzajem realizacji i marką (`title.absolute`), dane strukturalne przez `caseStudySchema(project, opts)`. Pliki: `_rl/case.tsx` + `_rl/case.css`. Kod listy: `app/(pl)/realizacje/RealizacjeClient.tsx` + `_rl/*`; kolejność, nazwy wyświetlane, skróty i akcenty: `WORK_ORDER` / `workByLocale` w `lib/i18n/projects.ts`; obrazy całych stron klientów: `public/realizacje/` (mastery `assets/realizacje/`). `StatsSpotlight` usunięty. Szczegóły: CLAUDE.md „Podstrona Realizacje”.

## Blog

Posty w `app/data/posts.ts`. Routing: `/blog/[slug]`. Aktualnie **3 posty** (wszystkie datowane styczeń 2026).

**Treść to raw HTML string** (`content: string`), renderowany przez `dangerouslySetInnerHTML` w kolumnie `.bl-body` (style w `components/blog/blog.css`). Pakiet `@portabletext/react` był zainstalowany — usunięty 2026-05-22 (nieużywany).

**Stan od 2026-09-29** (właściciel odrzucił redesign z 2026-09-28 i wrócił do wersji z czerwca 2026, zmodernizowanej do języka strony): `/blog` = układ „Wierna” - wyśrodkowany nagłówek „Wiedza, która napędza Twój rozwój.” na liniach bloga (`components/blog/BlogBackdrop.tsx`, WebGL), pigułki kategorii liczone z wpisów, sortowanie i wyszukiwarka, najnowszy wpis jako karta pół na pół, reszta w siatce (`components/blog/BlogIndex.tsx`, `cards.tsx`, `data.ts`). `/blog/[slug]` = „Okładka + Nagłówek na liniach”: duże zdjęcie, na nie nachodzi karta z nagłówkiem, treść ~46rem, cytat na końcu jako karta z przyciskiem „Bezpłatna konsultacja”, „Czytaj dalej”. Style `components/blog/blog.css` (prefiks `bl-`). Sekcja Blog na stronie głównej (Panorama) ma własne karty i dane w `components/sections/blog-teaser/`. Szczegóły: CLAUDE.md „Blog”, notatki `docs/podstrony/blog.md`.

`/blog/[slug]` generuje **BlogPosting** + **BreadcrumbList** JSON-LD, używa `post.mainImage` jako OG image, dodaje `article:published_time`, `authors`, `articleSection`.

## Formularz kontaktowy

- Komponent: `app/(pl)/kontakt/page.tsx` + `ContactSection.tsx` + `useContactForm.ts` + `ServiceSelect.tsx` + `Backdrop.tsx` (tło Opływ) + `kontakt.css` (EN: `app/(en)/en/contact/`)
- **Wygląd (2026-09-29, praca równoległa etap 2):** układ „Obok siebie” (nagłówek „Zacznijmy.” i dane po lewej, formularz po prawej), czarne tło z animacją „Opływ” (WebGL: włosowe linie przepływu opływają formularz, kreski w kolorze marki, kursor rozsuwa linie, pisanie przyspiesza przepływ, wysłanie = pas światła), formularz „Bez karty” wprost na czerni z polami „na linii”. Szczegóły: rozdział „Strona Kontakt” w [CLAUDE.md](./CLAUDE.md), historia rund: `docs/podstrony/kontakt.md`.
- Integracja: **Web3Forms** (`access_key: 'ca77c076-...'` zaszyte w kodzie)
- Walidacja: React Hook Form (formularz `noValidate` - komunikaty tylko w stylu strony)
- Pola: imię, email, telefon, usługa (lista `ServiceSelect` - etykiety jak w Ofercie; od 2026-10-01 bez kategorii „Design i UI/UX”, od 2026-10-06 z etykietą „Strona interaktywna”; **wartości wysyłane do Web3Forms bez zmian** - ta opcja nadal wysyła `Strona Szyta na Miarę`), wiadomość, zgoda RODO
- Honeypot: ukryte pole `botcheck`
- **Dwa numery telefonu (Sesja 27)**: `lib/seo-data.ts` CONTACT ma `phone` + `phoneDisplay` (`+48 668 124 367`) oraz `phone2: '+48531104402'` + `phone2Display` (`+48 531 104 402`). `ContactSection.tsx` pokazuje oba jako klikalne linki `tel:` (na telefonie obok siebie). E-mail, telefony i godziny (`CONTACT.hours`) tylko z `seo-data.ts`.
- Znany błąd w stopce (zamrożona w etapie 2): na `/kontakt/` przycisk „Bezpłatna konsultacja” nie przewija do formularza (`Footer.tsx` porównuje ścieżkę bez końcowego `/`) - patrz „Niespójności” w CLAUDE.md.

## Pełna mapa routingu

Pliki stron PL leżą w `app/(pl)/…`, EN w `app/(en)/en/…` (mirror z przetłumaczonymi slugami: `/en/about-us`, `/en/contact`, `/en/work`, `/en/services/websites/...` - mapa w `lib/i18n/locale.ts`). Blog i polityka prywatności tylko PL.

```
/                          — strona główna (Home)
/uslugi/                   — katalog usług (_katalog/Catalog: filtr, galeria kart z rysunkami, tło Mgławica)
/uslugi/strony-www/        — kategoria (ten sam katalog: 5 kart + box)
  one-page/                — ✅ film w trzech scenach + Service JSON-LD
  strona-firmowa/          — ✅ zamknięta wg właściciela 2026-10-08
  strona-szyta-na-miare/   — 🔧 w pracy; usługa „Strona interaktywna” (adres bez zmian)
  sklep-internetowy/       — 🔧 w pracy
  system-crm/              — 🔧 w pracy
/uslugi/automatyzacje-ai/
  chatboty-ai/             — 🔧 w pracy
/uslugi/design/, /uslugi/design/ui-ux/   — USUNIĘTE 2026-10-01 (301 → /uslugi/strony-www/)
/uslugi/marketing/                       — ⚠️ return null + noindex (placeholder)
/uslugi/marketing/audyt-wydajnosci-seo/  — ⚠️ return null + noindex (placeholder)
/realizacje/               — nagłówek z kadrami, Plansze 01-04, „Wszystkie realizacje” z filtrem
/realizacje/[slug]/        — case study (tylko gdy hasCaseStudy) ze „Stroną na żywo” + CreativeWork JSON-LD
/blog/                     — lista wpisów („Wierna”: kategorie, sortowanie, wyszukiwarka)
/blog/[slug]/              — wpis + BlogPosting JSON-LD
/o-nas/                    — przebudowa od zera 2026-10-09; ✅ sekcje 1-2 zamknięte 2026-10-13: wejście „Panorama z cięciem” + „Plakat” (h1), „Dla kogo pracujemy” = „Portal” (strony klientów w kadrze otwierane gwiazdą z logo); 🔎 dalsze sekcje (Nasz znak, Zasady, Pytania, Zakończenie) w propozycjach (przełączniki tylko w dev); jedna mgławica na całą podstronę; FAQPage JSON-LD
/kontakt/
/polityka-prywatnosci/     — "Polityka prywatności i cookies" (12 sekcji RODO, dark glassmorphism); layout.tsx z metadata (page jest 'use client')
/nie-znaleziono/           — trasa strony 404 (noindex; skrypt copy-404.mjs kopiuje ją do out/404.html)
/en/...                    — wersja angielska (patrz wyżej)
sitemap.xml + robots.txt   — force-static
manifest.webmanifest       — PWA-ready
_headers, _redirects       — konfiguracja Cloudflare Pages (cache + bezpieczeństwo + 301)
```

## Nawigacja

- Logo → `/` (na home: scroll-to-top przez Lenis)
- Usługi → `/uslugi/`
- Proces → `#proces` (kotwica, na innych stronach → `/?target=proces`)
- O nas → `/o-nas`
- Realizacje → `/realizacje`
- Blog → `/blog`
- Kontakt → `/kontakt`

`Navbar` ma dynamiczny motyw zależny od pathname. **Sesja 27:** `getNavbarTheme(pathname)` zwraca teraz pełny obiekt `NavTheme` (rekord `NAV_THEMES`), NIE tylko string klas granicy. Motyw obejmuje: kolor linii z gwiazdą w logo (od 2026-10-09 logo SVG `AvenlyLogo`, klasa `navTheme.dot` + przejście koloru w CSS; dawna kropka z tweenem Framer Motion usunięta), hover underline+glow linków desktop, hover hamburgera, blob menu mobile, hover linków+kropka mobile, hover social, hover CTA. Wszystkie klasy verbatim (Tailwind v4 JIT — zero concat dynamic). Kolory per podstrona:
- `/strony-www/sklep-internetowy` → amber (`#f59e0b`)
- `/strony-www/system-crm` → sky (`#0ea5e9`)
- `/strony-www/strona-szyta-na-miare` → **rose** (`#f43f5e`) - usługa „Strona interaktywna” (nazwa od 2026-10-06, adres bez zmian)
- `/strony-www/one-page` → blue (`#3b82f6`)
- `/strony-www/strona-firmowa` → emerald (`#10b981`)
- `/automatyzacje-ai/chatboty-ai` → orange (`#f97316`) (Sesja 26, był teal — Navbar + service-theme.ts + Chatbot widget + AvenlyAICta)
- domyślny → slate/blue (homepage, /uslugi/, /o-nas, /realizacje, /blog itp.)

## Branding

- **Nazwa:** Avenly (logo od 2026-10-09: napis AVENLY przecięty linią zakończoną czteroramienną gwiazdą, linia z gwiazdą w kolorze marki - `public/logo/`, `lib/brand/logo.ts`, `components/ui/AvenlyLogo.tsx`; dawniej `AVENLY.` z niebieską kropką)
- **Kolory:** ciemne tło `#050505` / `#080808` / `#0a0a0a`, white text; **jeden kolor marki = kropka logo `#3b82f6`** (od 2026-10-09 linia z gwiazdą nowego logo) (`--brand` w `globals.css`, `--brand-hi` `#60a5fa` na hover / fokus) - akcenty nagłówków, etykiety sekcji, ozdoby, scrollbar; bez pastelowych błękitów (2026-09-28, szczegóły: CLAUDE.md „Schemat kolorów”)
- **Ton:** profesjonalny, nowoczesny, technologiczny (patrz [PRODUCT.md](./PRODUCT.md))
- **Język:** polski (PL)
- **Założenie:** 2026
- **Wizytówka Google:** `https://share.google/YgHXGeqFgrSX4FEGs` (wpięta jako `sameAs` w Organization schema)

## Pliki kluczowe do edycji treści

| Co edytować | Plik |
|-------------|------|
| Dane firmy (NIP, adres, social, Wizytówka Google) | `lib/seo-data.ts` |
| Schema.org buildery (Organization, Service, FAQ itp.) | `lib/schemas.ts` |
| Teksty stron i sekcji (PL + EN) | `lib/i18n/` (np. `home/hero.ts`, `home/impact.ts`, `home/realizacje.ts`, `uslugi/*.ts`, `o-nas.ts`) |
| Usługi na stronie głównej (sekcja „Oferta”, układ Plan) | `components/sections/Services.tsx` + `components/sections/services/*`; teksty sekcji (PL + EN, w tym podpisy scenek `story`) = `lib/i18n/services.ts` (`ServicesSectionDict`), kolejność / adresy = `app/data/services.ts`, rysunki, scenki i kamera = `components/sections/services/drawings.tsx` |
| Katalog usług `/uslugi/` i `/uslugi/strony-www/` (nagłówki, filtr, opisy kafli, box) | `lib/i18n/uslugi/kategorie.ts` (`catalogDict`) + `app/(pl)/uslugi/_katalog/*`; nazwy, legendy i scenki kart = Oferta (`lib/i18n/services.ts`) |
| Metadane katalogu i kategorii | `app/(pl)/uslugi/page.tsx`, `strony-www/page.tsx` (+ mirror w `app/(en)/en/services/...`) |
| Podstrony konkretnych usług | `app/(pl)/uslugi/<kategoria>/<slug>/page.tsx` + komponent korzenia i sceny w tym katalogu, teksty `lib/i18n/uslugi/<slug>.ts` (typ `…Copy`), szkielet `app/(pl)/uslugi/_usluga/` (+ mirror w `app/(en)/en/services/...`) |
| Projekty portfolio i podstrona `/realizacje` | `app/data/projects.ts` + `lib/i18n/projects.ts` (`workByLocale`, `WORK_ORDER`, `RealizacjeDict`, `EN_PROJECT`); kod `app/(pl)/realizacje/_rl/*` |
| Realizacje na stronie głównej (teksty, kolejność, kadry) | `lib/i18n/home/realizacje.ts` + `components/sections/Realizacje.tsx` |
| Artykuły bloga | `app/data/posts.ts` (lista i wpis: `components/blog/*`, `app/(pl)/blog/*`) |
| FAQ na /o-nas (też zasila FAQPage schema) | `app/(pl)/o-nas/faq-data.ts` |
| Sekcja Hero | `components/sections/Hero.tsx` + `lib/i18n/home/hero.ts` |
| Opinie (bez JSON-LD od 2026-09-30) | `lib/i18n/home/testimonials.ts` + `components/sections/Testimonials.tsx` / `testimonials/*` |
| „Dlaczego Avenly” - teksty (tytuły, opisy, kategorie zakładek, historie kroków) | `lib/i18n/home/impact.ts` |
| „Dlaczego Avenly” - karty stosu / wizualizacje / shader / tło sekcji | `components/sections/impact/stack.tsx` / `viz.tsx` / `shader.tsx` / `backdrop.tsx` (+ nagłówek w `components/sections/Impact.tsx`) |
| Sekcja „Proces” - teksty / wstęga / tło | `lib/i18n/home/process.ts` (także `short` = słowo etapu) / `components/sections/Process.tsx` + `process/ribbon.tsx`, `process/backdrop.tsx`, `process/silk.ts`, `process/process.css` |
| Etykiety sekcji strony głównej („Gwiazda”) | `components/ui/SectionLabel.tsx` (style `.sl-*` w `globals.css`) |
| Przełączniki propozycji (tylko `npm run dev`) | `components/utils/proposals.tsx` |
| Kafel warstwic (maska) - tło „Mapa warstwic” w „Dlaczego Avenly” | `public/impact/contours.svg` (generator `scripts/impact-contours.mjs`) |
| O nas (sekcje 1-2 ✅ zamknięte 2026-10-13, dalsze 🔎 w propozycjach; notatki `docs/podstrony/o-nas.md`, opis w CLAUDE.md „O nas”) | `app/(pl)/o-nas/ONasClient.tsx` (układ, przełączniki dalszych sekcji, panel `dock.tsx`), `page-sky.tsx` (jedna mgławica), `heroes.tsx` + `poster.tsx` (wejście i „Plakat”), `sec-clients-portal.tsx` + `sec-clients-parts.tsx` + `sec-wow.tsx` („Portal”), `scene-kit.tsx` (klocki scen), `blueprint.tsx` / `principles.tsx` / `faq.tsx` / `ending.tsx` + propozycje `*-alt.tsx`, części `mark.tsx`, `parts.tsx`, `shared.ts`, `sky.tsx`; style `*.css` obok (prefiks `on-`); teksty `lib/i18n/o-nas.ts`; strony klientów w kadrze `public/o-nas/portal/` (`scripts/o-nas-portal-pages.mjs`); archiwum `docs/archiwum/o-nas-2026-09/` i `docs/archiwum/o-nas-2026-10/` |
| Logo (SVG, części, sygnet) | `public/logo/`, `lib/brand/logo.ts`, `components/ui/AvenlyLogo.tsx`; ikony i `og-default.png`: `scripts/brand-icons.mjs` |
| Stopka (Kropka „Nad i”: tytuł, kolumny, pasek prawny) | `components/layout/Footer.tsx` + `components/layout/footer/dot.tsx` / `shared.tsx` + `footer.css`, teksty `lib/i18n/footer.ts` (dane firmy z `lib/seo-data.ts`) |
| Sekcja „Blog” na stronie głównej (Panorama) | `components/sections/BlogTeaser.tsx` + `blog-teaser/pan.tsx`, `blog-teaser.css`, teksty `lib/i18n/home/blog-teaser.ts` (wpisy z `app/data/posts.ts`) |
| Nawigacja | `components/layout/Navbar.tsx` |
| Cookie consent (kategorie, teksty banera) | `lib/cookie-consent.ts` + `components/cookie/CookieConsent.tsx` |
| Polityka prywatności (treść 12 sekcji) | `app/(pl)/polityka-prywatnosci/page.tsx` |

## Chatbot AI (`components/chatbot/Chatbot.tsx`)

Floating bubble (z-30, niżej niż mobile menu z-40) + okno czatu. **Lazy-loaded** przez `DeferredClientWidgets` (po `requestIdleCallback` — nie blokuje LCP). Wygląd (2026-09-24/25): klasy `.cb-*` w `globals.css`, granatowe okno i bąbel z obwódką świecącą od góry, akcent w kolorze motywu podstrony, **bez `backdrop-filter`** (pełne tło - właściciel nie chce „matowego efektu”). Do n8n wysyła `language: 'pl' | 'en'`.

| Co | Jak |
|---|---|
| Endpoint | `NEXT_PUBLIC_N8N_CHATBOT_URL` (n8n webhook bezpośrednio, NIE przez `/api/chat`) |
| Autoryzacja | Header `x-chatbot-secret: NEXT_PUBLIC_CHATBOT_SECRET` |
| Historia in-progress | `sessionStorage: avenly_chat_current` |
| Historia ukończonych | `localStorage: avenly_chat_sessions` (max 15) |
| Zapis wiadomości do bazy | Supabase `chat_messages` (anon INSERT) — **sekwencyjny**: user → then assistant (gwarantuje kolejność `created_at`) |
| Konfiguracja z DB | Pobiera `welcome_message` + `quick_replies` z `chatbot_config` (Supabase, anon SELECT) |
| Otwarcie z innych miejsc | Dispatch `window.dispatchEvent(new Event("avenly:open-chat"))` (używane w: sekcja Realizacje na stronie głównej, lista i karty `/realizacje`, podstrona Chatboty AI - „Przetestuj na sobie”, FAQ na `/o-nas`; pełna lista: CLAUDE.md „Cross-component events”) |
| A11y | `aria-label` dynamiczny (Otwórz/Zamknij czat), `aria-expanded`, `aria-haspopup="dialog"` |

### Quick Replies
- `triggers: ('start' | 'always' | 'keyword')[]` — multi-trigger per button
- `start` → pod wiadomością powitalną; `always` → nad inputem; `keyword` → po dopasowaniu w odpowiedzi bota (case-insensitive `includes`)
- Backward compat: stary format `trigger: string` obsługiwany przez `hasTrigger()` helper
- Zarządzane z CRM (Tab Konfiguracja w `/chatbot` w projekcie `avenly-crm`)

### Zmienne środowiskowe (`.env.local`)
```
NEXT_PUBLIC_N8N_CHATBOT_URL=https://n8n.avenly.pl/webhook/chatbot
NEXT_PUBLIC_CHATBOT_SECRET=avenly-chatbot-2026
NEXT_PUBLIC_SUPABASE_URL=https://kyfsjvgixmcmafvaiyak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Cookie consent (RODO) — Sesja 27

System zgody na cookies zgodny z RODO, gotowy do bramkowania przyszłych skryptów analitycznych/marketingowych (GA, Meta Pixel).

### Logika — `lib/cookie-consent.ts`
- **4 kategorie zgody**: `necessary` (zawsze aktywne), `functional`, `analytics`, `marketing`
- `readConsent()` / `saveConsent(...)` — persystencja w `localStorage` (klucz `avenly-cookie-consent`) **oraz** cookie `cookie_consent` (wygaśnięcie **365 dni**), z wersjonowaniem przez `CONSENT_VERSION` (zmiana wersji → ponowna prośba o zgodę)
- `hasConsent('analytics')` — helper do warunkowego ładowania skryptów (np. `if (hasConsent('analytics')) loadGA()`)
- **Eventy**: `avenly:cookie-consent-change` (dispatch po zapisie — nasłuchują go przyszłe loadery skryptów) + `avenly:open-cookie-settings` (otwiera baner z poziomu Footera)

### UI — `components/cookie/CookieConsent.tsx`
- Baner RODO: **desktop bottom-left**, **mobile full-width bottom** — nie koliduje z bubble chatbota (z-index niżej / inny róg)
- Widok **compact** + rozwijane **granularne ustawienia** (toggle per kategoria; `necessary` = "Zawsze aktywne" disabled, reszta domyślnie **OFF** = privacy-first)
- Równorzędne przyciski "Odrzuć wszystkie" / "Akceptuj wszystkie" (RODO — odrzucenie tak samo łatwe jak akceptacja); przycisk **X tylko gdy zgoda już istnieje** (nie da się zamknąć banera bez decyzji za pierwszym razem)
- Bez widocznego paska scroll (`.no-scrollbar` w `globals.css`), responsywne `max-h` w `dvh`
- Montowany w **DeferredClientWidgets** (`dynamic`, `ssr: false`)
- Footer ma link **"Ustawienia cookies"** → `dispatchEvent(new Event('avenly:open-cookie-settings'))` (ponowne otwarcie banera w dowolnym momencie)

## SEO setup (kompletny — szczegóły w INSTRUKCJA-SEO.md)

### Structured Data (JSON-LD) — 9 typów
- **Organization** + **ProfessionalService** + **WebSite** — globalnie w `components/layout/AppShell.tsx`
- **BreadcrumbList** — na wszystkich podstronach (blog, realizacje, usługi)
- **Service** — na 6 aktywnych podstronach usług (PL i EN; UI/UX usunięta 2026-10-01)
- **BlogPosting** — na każdym poście
- **CreativeWork** — na case studies (`/realizacje/[slug]`, `caseStudySchema`)
- **ItemList** (4× CreativeWork, spójne `@id`) — sekcja Realizacje na stronie głównej (`featuredWorkSchema`)
- **FAQPage** — na `/o-nas`
- ~~**Review**~~ — usunięty z sekcji Opinie 2026-09-30: Search Console zgłaszał błąd krytyczny „Wiele weryfikacji bez obiektu aggregateRating” (kilka Review przy Organization bez AggregateRating), a AggregateRating nie wraca (ocena nie jest pokazywana na stronie; opinie o firmie na jej własnej stronie i tak nie dają gwiazdek). Nie przywracać.

### Metadata
- Globalny OG + Twitter Card z fallback `/og-default.png` (1200×630; od 2026-10-14 KADR Z HERO: planeta z renderu hero, napis AVENLY po łuku orbity z cięciem gwiazdą w stanie końcowym (geometria z `hero/logo.ts`), niebo z gwiazdami, bez tekstu - generuje `node scripts/brand-icons.mjs`, który robi też `public/favicon.ico` (16 / 32 / 48))
- Każda podstrona: tytuł SEO do ok. 60 znaków razem z „ | Avenly”, description do ok. 160 znaków, canonical, keywords PL long-tail, pełny blok Open Graph i karta Twittera (przegląd 2026-10-08; zasady i miejsca zmian: CLAUDE.md „SEO patterns”)
- Strona główna: stałe `HOME_TITLE` / `HOME_DESCRIPTION` w `app/(pl)/layout.tsx` (EN w `app/(en)/layout.tsx`); podstrona usługi: obiekt `SERVICE` w jej `page.tsx`
- `/blog/[slug]`: OG z `post.mainImage`, `article:published_time`, `authors`
- `/realizacje/[slug]`: OG z `project.mockupImage`

### Robots.txt — 2026-ready
- **Allow retrieval bots:** Google-Extended (AI Overviews), OAI-SearchBot (ChatGPT Search), PerplexityBot, ChatGPT-User, Claude-SearchBot, Applebot-Extended
- **Block training bots:** GPTBot, CCBot, anthropic-ai, ClaudeBot, Bytespider, FacebookBot
- Strategia: "Block AI training, allow AI search" — strona pojawia się w AI search results bez bycia trenowanym

### Favicon set + PWA
- favicon-16/32, apple-touch-icon (180×180), icon-192/512, `app/icon.png` - od 2026-10-09 z nowym logo, generowane przez `node scripts/brand-icons.mjs` (sharp, źródło `public/logo/avenly-kafel-ciemny.svg`)
- manifest.webmanifest z `theme_color: #050505`, `display: standalone`

### Performance hints
- Preconnect dla Supabase (300ms LCP saving), DNS prefetch dla n8n + Unsplash

### Wersja EN
- hreflang `pl-PL` / `en` / `x-default` (→ PL) przez `i18nAlternates()` + canonical per język; blog i polityka bez alternates
- Sitemap: pary PL/EN z `xhtml:link`; stare adresy `/en/<polski-slug>` → 301 w `public/_redirects`

## WebGL Shaders pipeline

**Stan 2026-10-08:** pełna lista lokalizacji i parametry są w tabeli „WebGL shaders” w CLAUDE.md. Tabela niżej opisuje stronę główną i zbiorczo podstrony (tylko aktywne strony). Shadery to kod inline w plikach sekcji albo vanilla TS sceny (bez bibliotek 3D); inspiracja patternów: [Paper Design Shaders library](https://github.com/paper-design/shaders).

| Lokalizacja | Shader(y) | Typ pattern | Gate | Perf |
|---|---|---|---|---|
| **`components/sections/hero/planet.ts`** (Hero 12a, Sesja 29 — zastąpił `AuroraBackground`) | planeta | Liquid-glass sfera (3× fbm 5 okt. + fresnel + bliki) w dwóch przebiegach od 2026-10-05 (szum w połowie rozdzielczości do tekstury, światło i krawędź w pełnej), canvas tylko na pas planety; logotyp od 2026-10-09 na canvasie 2D (`hero/logo.ts`, cząstki i ich renderer GPU usunięte), planeta WebGL kompiluje się dopiero po wejściu logotypu | **desktop only** (mobile = statyczny render WebP, element LCP) + idle defer + IO/visibility pause + async compile; scena stoi przy < 30% widoczności hero | tempo z czasu: ~30 fps przy aktywności, ~20 fps w spoczynku, DPR 1.25 |
| **`components/sections/realizacje/nebula.ts`** (tło sekcji Realizacje, Sesja 31, przebudowa 2026-09-24) | `createNebula` | Dwa przebiegi: gaz (domain warp fbm, kolor projektu jako poświata wokół kadru) do tekstury + kompozycja z ostrymi gwiazdami w pełnej rozdzielczości; `u_reveal` = malowanie przy wejściu sekcji | każda szerokość (bez Save-Data i telefonów ≤ 2 GB RAM) + IO pause + visibility + async compile; reduced = 1 klatka | gaz ~15 fps (0,6× CSS), kompozycja ~30 fps (DPR ≤ 1,5, dotyk 1,25) |
| **`components/sections/impact/shader.tsx`** (×4, karty stosu) | `ShaderCanvas` z 4 FS: TOPO/ORBS/VOLTAGE/SCAN + `VIZ_GLSL` | Cienkie „rytowane” warstwice na całej karcie + wtopiona konstelacja (sceny z `impact/viz.tsx`); rozkład jasności wg układu karty (jasno przy wizualizacji, czysto pod tekstem) | `!shouldReduceMotion` + lazy warm IO + IO pause + pauza pod przykryciem w stosie | 30fps, DPR 2 (także dotyk; Save-Data / ≤ 2 GB RAM: 1,25) |
| **Podstrony (2026-09-29 → 2026-10-06)** | linie bloga (`components/blog/BlogBackdrop.tsx`), mgławica katalogu (`uslugi/_katalog/sky.tsx` + `nebula.ts`), mgławica Realizacji (`realizacje/_rl/sky.tsx` + `nebula.ts`), mgławica szkieletu podstron usług (`uslugi/_usluga/sky.tsx`, wariant `liveGlow`), głębia kart (`depth.tsx` w one-page, stronie firmowej, sklepie i Stronie interaktywnej), Opływ (`kontakt/Backdrop.tsx`), pole światła O nas (`o-nas/intro.tsx`) | ostre linie i mgławice z gwiazdami; żadne tło nie reaguje na kursor (2026-10-05) | wszystkie urządzenia; zapasy bez WebGL (poświata CSS / czerń / papier kreślarski), pauza poza ekranem i przy ukrytej karcie | parametry: tabela w CLAUDE.md |

### Wspólny wzorzec (host JS)

```ts
// Pattern: inline component per shader, useEffect setup, useEffect cleanup
const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    // compile VS + FS, link program, bind buffers
    // ResizeObserver dla canvas size
    // rAF loop z optional throttling
    // IntersectionObserver pauza gdy poza viewport
    return () => { /* full cleanup: cancelAnimationFrame, disconnect observers, deleteProgram/Shader/Buffer */ };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" />;
};
```

### „Dlaczego Avenly” — karty stosu: paleta + rozkład terenu (2026-09-26)

| Karta | Kolor (`--ic`) | Kategoria zakładki | Wizualizacja (historia) |
|---|---|---|---|
| **1. Inwestycja, nie koszt** | Blue `59 130 246` | Sprzedaż | Ruch na stronie → Zapytanie → Nowy klient |
| **2. Wirtualny asystent** (lustro) | Indigo `129 140 248` | Obsługa klienta | Pytania klientów → Asystent AI → Do Ciebie |
| **3. Wydajność i SEO** | Amber `245 190 60` | Widoczność w Google | Łuk 0-100 wypełnia się do 98 |
| **4. Stabilność i bezpieczeństwo** (lustro) | Green `87 199 115` | Ciągłość działania | Odwiedzający → Cloudflare (atak zatrzymany) → Twoja strona |

Rozkład jasności terenu (`vTileF`) liczony z UKŁADU karty (położenie tekstu względem wizualizacji, nie proporcje): obok siebie = „kałuża światła” przesunięta ku górnemu rogowi po stronie wizualizacji + słabsza w rogu naprzeciw tekstu, całość do sześcianu (jak dawne a³); jedno pod drugim (telefon) = kałuża przy wizualizacji. Pod tytułem i opisem, pod dodatkiem (98/100, link) i pod napisem kroku osobne miękkie wygaszenia (elipsy z DOM). Każdy kafel ma inne tempo szumu (0,04-0,05), częstotliwość i gęstość warstwic (2,5-3,2) - różnorodność w ramach jednej rodziny.

### Perf budget shaderów

- **2026-10-05 / 06:** tempo rysowania hero, mgławic i scen liczone z czasu (nie z numeru klatki) i zależne od aktywności; planeta hero w dwóch przebiegach; tła podstron bez reakcji na kursor; mgławica szkieletu podstron usług w wariancie `liveGlow` (blask i front odsłony w kompozycji, gaz jako dwie przenikające się klatki kluczowe). Szczegóły: CLAUDE.md, tabela shaderów i „Performance patterns”.
- **Hero shader (LCP-critical):** desktop only. Mobile = statyczny render planety WebP (element LCP na każdej szerokości) + logotyp na canvasie 2D. Bez tej zasady mobile TBT = 6800ms. IO pause, tab visibility pause, ~30 fps przy aktywności i ~20 fps w spoczynku, DPR 1.25. **Od Sesji 28**: kompilacja asynchroniczna — bez sync status checks (wymuszały 100–300ms stall w oknie intro), gotowość pollowana przez `KHR_parallel_shader_compile` w rAF. **Sesja 29**: start sceny rozbity na osobne taski ≤ ~50 ms (sampling → siatka → GPU → planeta → raster napisu).
- **Lazy init below-the-fold (Sesja 28):** Impact ShaderCanvas ×4 i głębia kart na podstronach usług — pełny setup WebGL (getContext + compile) dopiero przy pierwszym zbliżeniu do viewportu ("warm" IO, `rootMargin: '600px 0px'`), nie na mount (inaczej kompilacje idą równolegle z intro Hero). DeferredClientWidgets (Chatbot/Cookie/Lifecycle) montowane po `requestIdleCallback` (timeout 1500ms) z tego samego powodu.
- **Impact shadery (4×):** 30fps throttle; DPR 2 także na dotyku od 2026-09-26 (1,25 na ekranie 3x dawało miękkie warstwice; Save-Data / ≤ 2 GB RAM: 1,25). Wizualizacja kafla liczona w tym samym przebiegu, ale tylko w obszarze sceny (`u_vb`); przykryta karta w stosie stoi (pauza); budżet uniformów ~46 z 64 vec4 WebGL1.
- **Mgławica Realizacji:** drogi gaz co drugi render w 0,6× CSS + tania kompozycja z gwiazdami; pętla rAF staje, gdy nic się nie rusza.
- **IntersectionObserver pauza:** **wszystkie** shadery — gdy poza viewport, `cancelAnimationFrame`, zero GPU work.
- **Ograniczony ruch:** shadery rysują jedną nieruchomą klatkę albo nie startują (zapas CSS).
- **WebGL cleanup:** każdy useEffect ma return z `gl.deleteProgram/Shader/Buffer` + `disconnect()` observers + `removeEventListener` (zapobiega context loss przy unmount, memory leaks).

## Blog content automation (2 slash commands)

Cały workflow w `.claude/commands/` + `docs/`:

```
.claude/commands/
  new-post.md           # /new-post [temat] — generuje post w stylu Avenly 1:1
                        # /new-post (puste) — multi-source research → 6 propozycji
  blog-research.md      # /blog-research — odświeża backlog o 10-15 trending tematów
docs/
  blog-style-guide.md   # konwencja: 400-600 słów, 2× h2 + 2-3× h3, 1× lista, CTA blockquote
  blog-ideas.md         # backlog: 🔥 Trending (auto-found) + TOP PRIORITY + OPUBLIKOWANE
```

### Workflow

| Command | Use case | Częstotliwość |
|---|---|---|
| `/new-post [temat]` | Konkretny temat z głowy | Co tydzień |
| `/new-post` | "Nie wiem o czym pisać — Claude, zaproponuj" | Co tydzień |
| `/blog-research` | Odświeżenie backlog'a o trending | Raz w miesiącu |

### Research mode (multi-source WebSearch)

Slash commands robią research z 4 źródeł:
- **HOT NOW** — newsy ostatnich 30 dni (Google updates, AI announcements, nowe frameworki) — spike 1-2 tyg
- **EMERGING** — trendy na fali (AI agents, server-side AI) — hot za 3-6 mies
- **SEASONAL** — pasujące do bieżącego kwartału (Q4 e-commerce, Q1 plany roczne)
- **EVERGREEN** — z backlog'a statycznego, długoterminowy traffic

Każdy znaleziony temat jest **auto-dopisywany** do `docs/blog-ideas.md` (sekcja "🔥 Trending") — historia research'u zachowana, najnowsze na górze.

### Style postów (gwarancja 1:1 z istniejącymi)

Wszystkie posty mają **identyczną** strukturę z 3 istniejącymi (post #1: Voiceflow, post #2: Szybkość, post #3: Strona WWW 2026):
- 400-600 słów (5-6 min)
- 2× `<h2>` (drugi zawsze "Podsumowanie: ...")
- 2-3× `<h3>` (sub-pytania)
- 1× lista `<ul>`/`<ol>` z `<strong>:</strong>` pattern
- `<blockquote>` CTA do `/kontakt` (NIGDY `/audyt`)
- "W Avenly..." w 1-2 miejscach
- TAB indentation w `app/data/posts.ts`, 6-space indent w `content`

Pełny style guide: [docs/blog-style-guide.md](./docs/blog-style-guide.md).

## Performance setup (wdrożone)

### Cloudflare Pages (`public/_headers` + `public/_redirects`, od 2026-09-19)
- **Cache 1 rok immutable** dla `_next/static/*` (hash w nazwie = safe)
- **Cache 30 dni** dla `/portfolio/*` i renderu planety hero (`/hero-planet-*`) - podmiana obrazu = nowa nazwa pliku
- **HTML bez cache** (`max-age=0, must-revalidate` + ETag) - świeża treść od razu po deployu, bez purge
- **Nagłówki bezpieczeństwa**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- `X-Robots-Tag: noindex` na adresach `*.pages.dev` (produkcyjny i preview)
- 301 ze starych adresów w `_redirects`; HTTPS, Brotli, trailing slash i `/404.html` robi Pages sam
- `.htaccess` usunięty (na Pages byłby publicznie pobieralnym plikiem) - nie przywracać

### Code splitting
- Sekcje Home → `next/dynamic` (Hero sync, reszta lazy)
- Footer → `dynamic` z SSR (osobny chunk)
- Chatbot + LifecycleManager → `dynamic` z `ssr: false` przez `DeferredClientWidgets`

### GPU optimization
- `translateZ(0)` na sticky kontenerach + scroll containers
- Sceny przewijane podstron (2026-10): `position: sticky` + własny postęp przewijania w zmiennych CSS (`usePin` / `useFrame`), zmienna pisana co klatkę na najbliższym elemencie, który ją czyta, `will-change` tylko na czas ruchu (dawny zoom hero na /o-nas z GSAP usunięty)
- Proces (Wstęga): WebGL na płótnie o wysokości toru (natywny scroll = wstęga nie rozjeżdża się z tekstem), pasek trójkątów z CPU ~30 fps, AA z `fwidth`, DPR z budżetu pikseli i limitu GPU, IO pauza; zapas canvas 2D (pas przy oknie, strażnik jakości). Tło: WebGL na płótnie sticky (rozmiar okna) z MSAA, rysowane w każdej klatce przewijania (paralaksa) i ~30 fps w spoczynku, wygaszenie pod tekstem w shaderze
- Realizacje: style pisane tylko przy zmianie wartości, wskaźnik indeksu `translateX + scaleX`, cień kadru jako osobna warstwa z animowaną opacity (bez repaintu `box-shadow`)
- Impact: napisy historii i pasek kroków przez WAAPI (opacity / transform), pauza poza ekranem; stos kart = jedna pętla rAF przy scrollu (`transform: scale` + `--sh`), wysokości kart mierzone tylko przy zmianie rozmiaru (`ResizeObserver`); odcień kształtów tła = zmienna `--im-tint` z przejściem w CSS (`@property`)

### Bundle slim
- Inter font: pominięty italic (`style: ['normal']`) — **-66 KiB** woff2
- Browserslist nowoczesny — **-13 KiB** polyfilli (Next runtime nadal transpiluje swoje internals)
- 953 paczki usunięte z node_modules (unused 3D/Sanity deps)

### Marquee optimization
- TechStack (2026-09-24): 4 identyczne kopie + przesunięcie o -50% toru = pętla bez szwu (dawne 3 kopie przeskakiwały co cykl); czytnik ekranu czyta 1 kopię, reszta `aria-hidden`; stała wysokość = bez CLS

## Heading hierarchy (zweryfikowane)

```
h1: Twój biznes ma potencjał. Zamień go w klientów.   (Hero 12a, Sesja 29)
├─ h2: sekcje Home (Realizacje, Impact, Process, Testimonials, Services, BlogTeaser)
│  └─ h3: subsections + cards (nazwy realizacji w panelach, 4 steps Process, 4 karty Impact, nazwy usług pod deską Oferty itp.)
└─ Footer (od 2026-09-28): h2 „Postaw kropkę nad i” + h2 nagłówki kolumn (Usługi, Na skróty, Kontakt)
```

Zasady: jeden h1 na stronie, kolejność h1 → h2 → h3 bez przeskoków; napisy w makietach i scenach to `<p>`, autor opinii to `<cite>`, etykiety pól formularza nie są nagłówkami.

## Deploy flow

```
1. npm run deploy        (~40 s) = npm run build (next build + flatten-rsc.mjs + copy-404.mjs)
                                   + npx wrangler@4 pages deploy out --project-name=avenly-web --branch=main
   Logowanie Avenly (kontakt@avenly.pl) leży w osobnym profilu - wdrażaj z XDG_CONFIG_HOME=C:/Users/Start/.wrangler-avenly
   (CLAUDE.md „Deploy flow”); samo `npm run deploy` użyje globalnego logowania RKS. Test: npm run deploy:preview
   Ostatnie wdrożenie: 2026-10-14 b349e699 (lista: progress.md „Stan wdrożenia”)
2. Purge cache NIE jest potrzebny (HTML max-age=0; chunki z hashem)
3. (Opcjonalnie) PageSpeed Insights
Rollback: dashboard Cloudflare → Workers & Pages → avenly-web → Deployments → „Rollback to this deployment”
```

## Znane ograniczenia / pułapki

### Architektura
- **Static export** — brak API routes, brak SSR. Chatbot strzela bezpośrednio do n8n po stronie klienta (martwy `app/api/chat/route.ts` został usunięty 2026-05-22).
- **Obrazy** muszą być w `public/` lub na hostach zdefiniowanych w `next.config.ts` (`images.unoptimized: true` + `remotePatterns` dla `images.unsplash.com`).
- **Lenis + GSAP ScrollTrigger** wymagają synchronizacji — `SmoothScrolling.tsx` jest providerem; nie modyfikuj scroll behavior globalnie.
- **Reset scrolla przy zmianie pathname** wymaga `setTimeout(300)` w `AnchorManager` żeby nie kolidować z `?target=`.
- **Tailwind v4** — `tailwind.config.ts` to legacy v3 config; większość pól ignorowana. Realna konfiguracja w `app/globals.css` (`@theme inline`).
- **`dynamic` z `ssr: false` w server component** zablokowane w Next 15+. Używaj client wrapperów (`DeferredClientWidgets`).
- **Dwa root layouty (Sesja 28)**: przejście PL ↔ EN = pełne przeładowanie (toggle to zwykły `<a>`); globalne 404 trzeba podmieniać skryptem `scripts/copy-404.mjs` (Next nie używa `not-found.tsx` z grupy).
- **Next.js 16 RSC payload bug (KRYTYCZNE — Sesja 20)**: dla nested routes generowane są pliki RSC payload z **slashami** w nazwie (`__next.uslugi/strony-www/one-page.txt`) — serwer (dawniej Apache, dziś Cloudflare Pages) traktuje to jako foldery. Browser jednak fetchuje URL z **kropkami** (flat name) → 404 → client-side router silent fail → wszystkie `<Link>` na produkcji nie działają na lewy klik (middle click bypassa router więc działa). **Fix**: `scripts/flatten-rsc.mjs` jako post-build script kopiuje nested pliki na flat names. Zintegrowane z `npm run build`. **BEZ TEGO ŻADEN LINK NIE ZADZIAŁA NA PRODUKCJI.**
- **Safari mobile quirks (Sesja 21)**: 6 osobnych pułapek znalezionych w pełnym audicie projektu:
  - `100vh` zawiera URL bar Safari → sticky `h-screen` overflow'uje. Fix: `h-dvh` / `100svh`. Długości przypiętych scen (`340vh`, `600vh`) zostają w `vh` — dvh dynamic powoduje skoki sceny.
  - `overflow-x-auto + w-max + mx-auto` blokuje touch scroll w lewo na Safari mobile. Fix pattern: `flex justify-center + min-w-max + px-6 wrapper`.
  - `overflow-x-clip` wymaga Safari 16+ (browserslist Safari 15+ → ignoruje, fallback to visible). Sesja 21 zamieniła na `overflow-x-hidden`, ale to łamało sticky piny (scroll container) → **Sesja 22 cofnęła do `overflow-x-clip`** (drobny poziomy scroll na Safari 15 jest akceptowalny).
  - `flex-1` na dziecku `flex-col` nie daje pełnej szerokości (grow na main axis, nie cross). Fix dla responsive cards: `w-full md:flex-1`.
  - Inline `backdropFilter` bez `WebkitBackdropFilter` → iOS WebView / Safari 14- ignoruje. Fix: para zawsze. Tailwind utility `backdrop-blur-*` auto-prefix'uje (te są OK).
  - Brak `viewportFit: 'cover'` → czarne marginesy notch. `<main min-h-screen>` → footer chowa się pod URL barem. Fix: `viewportFit: 'cover'` w viewport config + `min-h-dvh` na `<main>`.

### Bugi w danych (do naprawy w przyszłości)
- `app/(pl)/uslugi/marketing/page.tsx` i `.../audyt-wydajnosci-seo/page.tsx` zwracają `return null` (placeholdery z metadata `noindex`) → do wypełnienia albo usunięcia.
- `components/sections/Portfolio.tsx` + `lib/i18n/home/portfolio.ts` — martwy kod od Sesji 30 (do usunięcia).
- **Propozycje czekające na wybór właściciela (stan 2026-10-14):** O nas - sekcje po „Portalu” (Nasz znak: „Z bliska” / „Trzy poprawki” / stara „Konstrukcja”; Zasady, Pytania, Zakończenie: obecna + dwie nowe); strona główna, Realizacje: przejście Gwiazda / Kurtyna (2026-10-13), Strona interaktywna (krajobraz, Technologia, Detal, Zakres), sklep (tekst hero, scena zakupu), chatboty (Wiedza) - tabela w PRACA-ROWNOLEGLA.md „Stan”. Strona firmowa jest zamknięta, ale w kodzie został przełącznik wersji kart (do sprzątnięcia po potwierdzeniu wybranej). Strona główna i podstrony etapu 2 nie mają otwartych propozycji.
- Grafika udostępniania `public/og-default.png` - od 2026-10-14 kadr z hero (łuk AVENLY nad planetą), bez tekstu (służy też wersji EN; brak pliku fontu Inter TTF do renderu w skrypcie).
- Stare wersje podstron usług (`*Client.tsx` + stare słowniki), nieimportowane pliki chatbotów, martwy kod po UI/UX, `ServiceTemplate` / `AvenlyAICta` / `ProcessAccordion` — do usunięcia przy porządkach (lista: PRACA-ROWNOLEGLA.md „Chat 0”).

### Chatbot
- Wszystkie callsy client-side przez `NEXT_PUBLIC_*` zmienne — baked-in at build time → zmiana endpointu lub secretu wymaga rebuildu i `npm run deploy`.
- `sendMessage` przyjmuje opcjonalny `overrideText?: string` — używany przez quick reply buttons; onClick na przycisku send to `() => sendMessage()`, NIE `sendMessage` (inaczej `MouseEvent` przekazany jako string).
- Wymaga w Supabase tabeli `chat_messages` z RLS policy `anon INSERT` oraz `chatbot_config` z `anon SELECT`.

### Deploy
- **Wrangler musi być zalogowany na konto Avenly** (kontakt@avenly.pl) - inne konto Cloudflare (np. klubu RKS przy `rksweb`) daje błąd autoryzacji projektu `avenly-web`. Od 2026-09-30 logowanie Avenly leży w osobnym katalogu `C:\Users\Start\.wrangler-avenly` (globalne zostaje dla RKS) - wdrażać z `XDG_CONFIG_HOME=C:/Users/Start/.wrangler-avenly` (polecenia w CLAUDE.md „Deploy flow”).
- **Purge nie jest potrzebny**, poza podmianą obrazu w `public/portfolio/` pod tą samą nazwą (cache 30 dni) - zmień nazwę pliku albo zrób purge.
- Poczta `@avenly.pl` zostaje na Hostingerze (MX/SPF/DKIM w DNS Cloudflare) - przy zmianach DNS nie ruszać tych rekordów.

### Inne
- Footer ma `href: '#uslugi'` — sekcja `Services` ma jednocześnie `id="oferta"` (wrapper z page.tsx) i `id="uslugi"` (sama `<section>`). Dwa id na ten sam obszar — kompatybilność wsteczna, ale do uporządkowania.
- Wszystkie 3 posty bloga datowane styczeń 2026 — wygląda jak content seed; warto rozłożyć daty lub dodać świeżą treść.
