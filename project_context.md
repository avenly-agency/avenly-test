# Project Context — Avenly Web

## Czym jest ten projekt

Strona internetowa agencji marketingowej **Avenly**. Prezentuje ofertę, portfolio, blog i umożliwia kontakt. Zbudowana jako statyczny export Next.js (hosting bez backendu na **Cloudflare Pages** od 2026-09-19), dwujęzyczna (PL na roocie, EN pod `/en/`).

## Stan strony (2026-10-07)

| Metryka | Wartość |
|---|---|
| Hosting | ✅ Cloudflare Pages (2026-09-19, migracja z Hostingera) — `npm run deploy`, `public/_headers` + `public/_redirects`, `.htaccess` usunięty; poczta na Hostingerze |
| Wersja EN | ✅ Sesja 28 — `/en/` z przetłumaczonymi slugami, hreflang, sitemap z alternates |
| Hero | ✅ Sesja 29 — scena 12a (planeta WebGL + logotyp z cząstek + niebo z konstelacją usług), render planety = LCP |
| TechStack (pasek pod hero) | ✅ 2026-09-24 — ikony w granatowym szkle, 8 faktów z oferty |
| Realizacje (homepage) | ✅ Sesje 30-31 + 2026-09-24 — zastąpiły dawne Portfolio; mgławica WebGL, automat 5 s, jednorazowa odsłona sekcji, osobny układ na dotyku, płynne przejście do „Dlaczego Avenly” |
| „Dlaczego Avenly” (Impact) | ✅ 2026-09-26 — wybór właściciela: **Stos warstw + Konstelacje**; karty w głębokiej czerni z zakładką (numer + kategoria), teren z warstwic na całej karcie (jasno przy wizualizacji, czysto pod tekstem), konstelacja z historią krok po kroku (napis kroku na dole karty), karty 2 i 4 w lustrze, stos z efektami przewijania na każdej szerokości (także telefon), kształty tła w kolorze karty na ekranie. ✅ 2026-09-27: tło sekcji = **Mapa warstwic**, tekst w karcie = **U góry** (reszta wariantów i przełączniki usunięte). Historia 11 rund: progress.md |
| Asystent AI (sekcja z pokazem rozmowy) | ❌ 2026-09-27 — **usunięta ze strony głównej** (decyzja właściciela: zbędna, asystent jest w „Dlaczego Avenly”, Realizacjach, Ofercie i w czacie); po Opiniach od razu Oferta |
| Proces | ✅ 2026-09-27 — wybory właściciela: **Wstęga** w materiale **Szkło** + tło **Głębia** (szklane wstęgi w oddali z paralaksą) - przezroczysta szklana wstęga rozwija się przy przewijaniu i prowadzi zygzakiem przez 4 etapy (także na telefonie: wzdłuż tekstu na przemian po lewej i prawej, między krokami łuk przez cały ekran) do „Bezpłatnej konsultacji”; WebGL (zapas canvas 2D), barwa etapu z akcentów Impactu; sekcja zamknięta |
| Oferta | ✅ 2026-09-27 — wybory właściciela: układ **Plan** (teczka rysunków technicznych: rysunek usługi rysuje się piórem, potem ożywa scenką w 3 krokach z kamerą najeżdżającą na akcję), indeks **Karty**, zegar karty **Obwódka** (ubywa do zmiany usługi), tło **Bez tła**; telefon: mocniejsze zbliżenia kamery, swipe z obrazem za palcem, linia od pigułki do deski; sekcja zamknięta. ✅ 2026-09-28: nowe copy usług (chwyt + konkret, wzór „To już nie tylko strona, to uczucie.”), bez WordPressa / CMS i bez obietnicy integracji z kurierami (także w `/uslugi`, na podstronie sklepu i w metadanych), UI/UX i audyt jako dodatki, AI w CRM jako opcja, przycisk „Cała oferta” w kolorze usługi z płynnym przejściem (PRODUCT.md „Co obiecujemy w ofercie”) |
| Blog (sekcja + podstrony) | ✅ 2026-09-29 — sekcja na stronie głównej = Panorama; `/blog` = „Wierna” (wersja z czerwca 2026 w nowym języku strony), wpis = „Okładka + Nagłówek na liniach” |
| Podstrony etapu 2 | ✅ `/uslugi` + `/uslugi/strony-www` (katalog: góra „Kropka”, karty Kadr, wejście Obrys, tło Mgławica - 2026-10-01), `/kontakt` (Obok siebie + Opływ - 2026-09-29), `/realizacje` + case studies (Plansze + Mgławica + „Strona na żywo” - 2026-10-01); 🔎 `/o-nas` czeka na wybór wejścia i układu |
| Usługi | 7 usług w 3 kategoriach; „Projekt UI/UX” usunięty jako osobna usługa 2026-10-01 (301 z `/uslugi/design*`); „Strona szyta na miarę” → „Strona interaktywna” 2026-10-06 (adres bez zmian) |
| Wdrożenie | 2026-10-06, `a6a206db` (Cloudflare Pages); produkcja = bieżące repozytorium; praca niezacommitowana w git |
| Etykiety sekcji | ✅ 2026-09-26 — wybór właściciela: **Gwiazda** (gwiazdki jak w hero + cienkie linie); wspólny `components/ui/SectionLabel.tsx` we wszystkich sekcjach strony głównej, pozostałe propozycje usunięte |
| Czat | ✅ 2026-09-24/25 — granatowe okno i bąbel, pełne tło bez `backdrop-filter` |
| Copywriting | ✅ Sesja 27+ — głos korzyści, jeden CTA „Bezpłatna konsultacja”, zero fabrykowanych metryk (PRODUCT.md) |
| Cookie consent (RODO) | ✅ Sesja 27 — baner 4-kategoriowy (`lib/cookie-consent.ts` + `components/cookie/CookieConsent.tsx`), montowany w DeferredClientWidgets |
| Polityka prywatności | ✅ Sesja 27 — pełne 12 sekcji RODO, dane z `lib/seo-data` |
| Navbar theming per podstrona | ✅ Sesja 27 — `getNavbarTheme()` zwraca obiekt `NavTheme`; Sesja 29/31: linki w osi strony, przełącznik PL/EN, tło bez granatu |
| PageSpeed | ostatni pomiar PSI (Sesja 22): mobile **85** / desktop **99**; lokalny Lighthouse po nowym hero: desktop 95-97 (LCP 1,0-1,2 s, CLS 0) — do ponownego pomiaru w PSI |
| Accessibility issues | 0 zgłoszonych (kontrasty AA w hero i Realizacjach poprawione względem makiet) |
| SEO setup | 9 typów JSON-LD (w tym ItemList realizacji), OG image, favicon set, robots 2026-ready, hreflang |
| AI search visibility | Google AI Overviews aktywnie cytuje z linkiem |
| WebGL shaders | stan 2026-10-07: tabela „WebGL shaders” w CLAUDE.md (strona główna, `/kontakt`, `/blog`, `/uslugi`, `/realizacje`, 6 podstron usług, `/o-nas` w pracy); stare shadery podstron usług nieaktywne (+2 w nieużywanym `Portfolio.tsx`) |
| Production navigation | ✅ Sesja 20 (Next.js 16 RSC bug — `scripts/flatten-rsc.mjs`) + Sesja 28: `scripts/copy-404.mjs` (custom 404 przy dwóch root layoutach) |
| Safari mobile compatibility | ✅ Sesja 21+22 — dvh, filter scroll, **overflow-x-clip** (nie hidden - łamało sticky), -webkit prefixes, viewportFit cover |
| Podstrony usług | ✅ one-page przebudowana i zamknięta 2026-10-02 (film w trzech scenach, szkielet `app/(pl)/uslugi/_usluga/`); 🔧 strona firmowa, Strona interaktywna (dawniej „szyta na miarę”), sklep, system CRM, chatboty AI w pracy (etap 3 pracy równoległej - stan w PRACA-ROWNOLEGLA.md); stare wersje `*Client.tsx` nieimportowane. Historycznie (Sesje 22-27): shadery na mobile, scope cards, makiety wireframe→blueprint, bento corner fix |

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

1. **Hero** — scena 12a (Sesja 29): planeta WebGL + logotyp AVENLY z cząstek + niebo z konstelacją usług + blok CTA (h1, „Bezpłatna konsultacja”, „Zobacz realizacje”). Szczegóły: CLAUDE.md „Hero strony głównej”
2. **TechStack** — pasek marquee „Co dostajesz”: 8 faktów z oferty (PageSpeed 98/100, projekt pod telefon, BLIK i karta, asystent AI, rezerwacje online, panel do zarządzania firmą, hosting na Cloudflare, lokalne SEO) z ikonami w granatowym szkle (`.ts-ico`, wybór właściciela 2026-09-24); pętla bez szwu (4 kopie, -50%), pauza po najechaniu; zostaje bezpośrednio pod hero (decyzja właściciela, Sesja 30)
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
  - `ReactLenis` z `duration: 1.2`, `syncTouch: true`
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
| strona-firmowa | `StronaFirmowa.tsx` | `sf-` | 🔧 w pracy (film „Piętra”, karty podstron, stos, zakres) |
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
| `klub-sportowy` | Radzyński Klub Sportowy (nazwa wyświetlana „Klub Sportowy RKS”) | tak - strona klubu z terminarzem i zapisami do akademii + aplikacja klubowa (składki, kalendarz treningów, obecności, komunikacja; Next.js, Supabase, Resend, Cloudflare) | — |
| `wirtualny-asystent-ai` | Avenly | nie | **tak** (kliknięcie otwiera chatbot przez `avenly:open-chat`) |

Pola projektu: `slug`, `title`, `category`, `year`, `client`, `description`, `mainImage`, `mockupImage`, `gallery[]`, `hasCaseStudy`, `externalLink`, `openChat?`, `techStack[]`, `stats[]`, `challenge`, `solution`.

`/realizacje/[slug]` ma `generateStaticParams` filtrujące po `hasCaseStudy: true`, generuje **CreativeWork** + **BreadcrumbList** JSON-LD oraz pełne OG (`mockupImage` jako preview).
**Podstrona `/realizacje` (zamknięta 2026-10-01):** nagłówek na cały pierwszy ekran („Dowód, nie obietnice.” + kadry w głębi z żywymi stronami klientów), Plansze 01-04 (przypięte sceny: wielka nazwa → kadr ze stroną klienta przewijaną razem z przewijaniem), „Wszystkie realizacje” (filtr, siatka, karta „Twoja firma może być następna”), case study z makietą „Strona na żywo”, mgławica za całą podstroną. Kod: `app/(pl)/realizacje/RealizacjeClient.tsx` + `_rl/*`; kolejność, nazwy wyświetlane, skróty i akcenty: `WORK_ORDER` / `workByLocale` w `lib/i18n/projects.ts`; obrazy całych stron klientów: `public/realizacje/` (mastery `assets/realizacje/`). `StatsSpotlight` usunięty. Szczegóły: CLAUDE.md „Podstrona Realizacje”.

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
  strona-firmowa/          — 🔧 w pracy
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
/o-nas/                    — 🔧 w pracy: wejście „przelot” ze znakiem AVENLY + układ do wyboru + FAQ + FAQPage JSON-LD
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

`Navbar` ma dynamiczny motyw zależny od pathname. **Sesja 27:** `getNavbarTheme(pathname)` zwraca teraz pełny obiekt `NavTheme` (rekord `NAV_THEMES`), NIE tylko string klas granicy. Motyw obejmuje: kropkę przy logo AVENLY (Framer `motion.span` z `animate={{ color: dotHex }}` + `initial={false}` = płynny tween koloru między podstronami), hover underline+glow linków desktop, hover hamburgera, blob menu mobile, hover linków+kropka mobile, hover social, hover CTA. Wszystkie klasy verbatim (Tailwind v4 JIT — zero concat dynamic). Kolory per podstrona:
- `/strony-www/sklep-internetowy` → amber (`#f59e0b`)
- `/strony-www/system-crm` → sky (`#0ea5e9`)
- `/strony-www/strona-szyta-na-miare` → **rose** (`#f43f5e`) - usługa „Strona interaktywna” (nazwa od 2026-10-06, adres bez zmian)
- `/strony-www/one-page` → blue (`#3b82f6`)
- `/strony-www/strona-firmowa` → emerald (`#10b981`)
- `/automatyzacje-ai/chatboty-ai` → orange (`#f97316`) (Sesja 26, był teal — Navbar + service-theme.ts + Chatbot widget + AvenlyAICta)
- domyślny → slate/blue (homepage, /uslugi/, /o-nas, /realizacje, /blog itp.)

## Branding

- **Nazwa:** Avenly (logo: `AVENLY.` z niebieską kropką)
- **Kolory:** ciemne tło `#050505` / `#080808` / `#0a0a0a`, white text; **jeden kolor marki = kropka logo `#3b82f6`** (`--brand` w `globals.css`, `--brand-hi` `#60a5fa` na hover / fokus) - akcenty nagłówków, etykiety sekcji, ozdoby, scrollbar; bez pastelowych błękitów (2026-09-28, szczegóły: CLAUDE.md „Schemat kolorów”)
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
| O nas (🔧 w pracy: wejście + cztery układy do wyboru) | `app/(pl)/o-nas/ONasClient.tsx`, `intro.tsx`, `parts.tsx`, `variants/*`, teksty `lib/i18n/o-nas.ts` (dawne karty statystyk z shaderem usunięte) |
| Stopka (Kropka „Nad i”: tytuł, kolumny, pasek prawny) | `components/layout/Footer.tsx` + `components/layout/footer/dot.tsx` / `shared.tsx` + `footer.css`, teksty `lib/i18n/footer.ts` (dane firmy z `lib/seo-data.ts`) |
| Sekcja „Blog” na stronie głównej (Panorama) | `components/sections/BlogTeaser.tsx` + `blog-teaser/pan.tsx`, `blog-teaser.css`, teksty `lib/i18n/home/blog-teaser.ts` (wpisy z `app/data/posts.ts`) |
| Nawigacja | `components/layout/Navbar.tsx` |
| ~~CTA do AI~~ | `components/AvenlyAICta.tsx` - martwy kod (używały go stare wersje podstron usług) |
| ~~Process Accordion~~ | `components/ProcessAccordion.tsx` - martwy kod (jw.) |
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
| Otwarcie z innych miejsc | Dispatch `window.dispatchEvent(new Event("avenly:open-chat"))` (używane w: Realizacje (panel projektu AI), AvenlyAICta, lista projektów /realizacje, /o-nas, ChatbotsAIClient, ShopClient) |
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
- Globalny OG + Twitter Card z fallback `/og-default.png` (1200×630, AVENLY brand)
- Każda podstrona: tytuł SEO (60-70 znaków), description 150-160 znaków, canonical, keywords PL long-tail
- `/blog/[slug]`: OG z `post.mainImage`, `article:published_time`, `authors`
- `/realizacje/[slug]`: OG z `project.mockupImage`

### Robots.txt — 2026-ready
- **Allow retrieval bots:** Google-Extended (AI Overviews), OAI-SearchBot (ChatGPT Search), PerplexityBot, ChatGPT-User, Claude-SearchBot, Applebot-Extended
- **Block training bots:** GPTBot, CCBot, anthropic-ai, ClaudeBot, Bytespider, FacebookBot
- Strategia: "Block AI training, allow AI search" — strona pojawia się w AI search results bez bycia trenowanym

### Favicon set + PWA
- favicon-16/32, apple-touch-icon (180×180), icon-192/512
- manifest.webmanifest z `theme_color: #050505`, `display: standalone`

### Performance hints
- Preconnect dla Supabase (300ms LCP saving), DNS prefetch dla n8n + Unsplash

### Wersja EN
- hreflang `pl-PL` / `en` / `x-default` (→ PL) przez `i18nAlternates()` + canonical per język; blog i polityka bez alternates
- Sitemap: pary PL/EN z `xhtml:link`; stare adresy `/en/<polski-slug>` → 301 w `public/_redirects`

## WebGL Shaders pipeline

**Stan 2026-10-07:** aktualna lista lokalizacji i parametry są w tabeli „WebGL shaders” w CLAUDE.md. Od przebudowy podstron (etapy 2-3 pracy równoległej) doszły: linie bloga, mgławice `/uslugi` i `/realizacje`, mgławica szkieletu podstron usług (wariant `liveGlow`), głębia kart stosu na czterech podstronach stron WWW i pole światła na `/o-nas`; stare shadery podstron usług (Rays, bento, UI/UX, Plasma chatbotów) są nieaktywne. Tabela niżej opisuje stronę główną (aktualne) i zbiorczo podstrony. Shadery to kod inline w plikach sekcji albo vanilla TS sceny (bez bibliotek 3D); inspiracja patternów: [Paper Design Shaders library](https://github.com/paper-design/shaders).

| Lokalizacja | Shader(y) | Typ pattern | Gate | Perf |
|---|---|---|---|---|
| **`components/sections/hero/planet.ts`** (Hero 12a, Sesja 29 — zastąpił `AuroraBackground`) | planeta | Liquid-glass sfera (2× fbm 5 okt. + fresnel + bliki), canvas tylko na pas planety; do tego cząstki logotypu na GPU (`particles-gl.ts`) | **desktop only** (mobile = statyczny render WebP, element LCP) + idle defer + IO/visibility pause + async compile | ~30fps (na zmianę z niebem), DPR 1.25 |
| **`components/sections/realizacje/nebula.ts`** (tło sekcji Realizacje, Sesja 31, przebudowa 2026-09-24) | `createNebula` | Dwa przebiegi: gaz (domain warp fbm, kolor projektu jako poświata wokół kadru) do tekstury + kompozycja z ostrymi gwiazdami w pełnej rozdzielczości; `u_reveal` = malowanie przy wejściu sekcji | każda szerokość (bez Save-Data i telefonów ≤ 2 GB RAM) + IO pause + visibility + async compile; reduced = 1 klatka | gaz ~15 fps (0,6× CSS), kompozycja ~30 fps (DPR ≤ 1,5, dotyk 1,25) |
| ~~**`components/sections/Portfolio.tsx`** (CTA card)~~ (martwy kod od Sesji 30) | `LiquidGlassBackground` | Liquid Glass — UV displacement + caustics + orbital specular | `!shouldReduceMotion` + IO pause | 60fps, DPR 2 |
| ~~**`components/sections/Portfolio.tsx`** (sticky bg)~~ (martwy kod od Sesji 30) | `PortfolioFlowBackground` | Aurora flow — 2-warstwowy simplex noise | `isDesktop && !shouldReduceMotion` + IO pause | 30fps, DPR 1.0 |
| **`components/sections/impact/shader.tsx`** (×4, karty stosu) | `ShaderCanvas` z 4 FS: TOPO/ORBS/VOLTAGE/SCAN + `VIZ_GLSL` | Cienkie „rytowane” warstwice na całej karcie + wtopiona konstelacja (sceny z `impact/viz.tsx`); rozkład jasności wg układu karty (jasno przy wizualizacji, czysto pod tekstem) | `!shouldReduceMotion` + lazy warm IO + IO pause + pauza pod przykryciem w stosie | 30fps, DPR 2 (także dotyk; Save-Data / ≤ 2 GB RAM: 1,25) |
| **Podstrony (2026-09-29 → 2026-10-06)** | linie bloga (`components/blog/BlogBackdrop.tsx`), mgławica katalogu (`uslugi/_katalog/sky.tsx` + `nebula.ts`), mgławica Realizacji (`realizacje/_rl/sky.tsx` + `nebula.ts`), mgławica szkieletu podstron usług (`uslugi/_usluga/sky.tsx`, wariant `liveGlow`), głębia kart (`depth.tsx` w one-page, stronie firmowej, sklepie i Stronie interaktywnej), Opływ (`kontakt/Backdrop.tsx`), pole światła O nas (`o-nas/intro.tsx`) | ostre linie i mgławice z gwiazdami; żadne tło nie reaguje na kursor (2026-10-05) | wszystkie urządzenia; zapasy bez WebGL (poświata CSS / czerń / papier kreślarski), pauza poza ekranem i przy ukrytej karcie | parametry: tabela w CLAUDE.md |
| ~~stare podstrony usług i `/o-nas`~~ | `RaysBackground` + bento ×4 (`*Client.tsx`), `HeroShader` + Dots (chatboty), `MeshGradientBackground` + `SyncedShaderCanvas` (UI/UX), `AuroraBackground` + `HoverShader` (`/o-nas`) | nieaktywne: pliki `*Client.tsx` nieimportowane, UI/UX w `docs/archiwum/usluga-ui-ux/`, `/o-nas` przebudowane | - | - |

### CTA shader na one-page + strona-firmowa (Sesja 23) — HISTORYCZNE (stare wersje podstron)
Sekcja CTA "Gotowy na cyfrową Dominację?" w `OnePageClient` (MESH_GRADIENT_FS) i `CorporateWebsiteClient` (WARP_FS) dostała shader w tle z `opacity-60` + lekka radial vignette `rgba(8,8,8,0.25→0.55→0.75)` + GlassEdge. CTA card teraz `rounded-3xl` + `border-white/15` (matching bento style).

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

### /uslugi/strony-www/one-page/ bento — paleta + shader per kafel — HISTORYCZNE (podstrona przebudowana 2026-10-02)

Tu cała paleta blue brand (jednolita), ale **inne SHADER FAMILIES** per kafel (Paper Design patterns):

| Kafel | Theme | Shader pattern | Differentiator |
|---|---|---|---|
| **1. Laserowe skupienie** (col-span-2, Target) | Focus | **Radial Pulse Rings** | 4 koncentryczne pierścienie z biasem off-center, **sharp peaks** (powers 8/10/8/6) — laser-like |
| **2. Błyskawiczna weryfikacja** (single, FastForward) | Speed | **Warp** | Domain-warped color field, smooth fluid flow (Paper Design pattern) |
| **3. Idealne pod Mobile** (single, Smartphone) | Mobile | **Warp** | Ten sam shader co Card 2 (różny aspect → naturalna wariacja) |
| **4. Kompaktowa wydajność** (col-span-2, Zap) | Energy | **Liquid Metal** | Domain-warp + `pow 5` specular peaks + chromatic 2-color blend (Paper Design pattern) |

Plus `GlassEdge` (tier Strong): `blur(16px) saturate(170%) brightness(110%)` i mask `transparent 15%` (węższy ring — blur **tylko na samych krawędziach**).

### SyncedShaderCanvas — single shader rozdystrybuowany na 4 karty (UI/UX) — HISTORYCZNE (podstrona usunięta 2026-10-01)

Tylko w `app/(pl)/uslugi/design/ui-ux/page.tsx`. Idea: 4 karty bento = 4 "okna" do jednej wirtualnej powierzchni shadera (gapy między kartami pozostają dark page bg, ale karty pokazują skoordynowane wycinki tego samego płótna).

**Mechanizm:**
- Każda karta zawiera własny `<SyncedShaderCanvas>` z `parentRef={bentoWrapperRef}` (ref na grid container)
- Module-level `SHARED_T0 = performance.now()` → wszystkie 4 instancje używają tej samej osi czasu (lock-step)
- Uniforms: `u_offset` (vec2 px) + `u_global_size` (vec2 px) — shader liczy `(gl_FragCoord + u_offset) / u_global_size` jako globalne UV
- Layout cache — pozycje canvas vs parent są cache'owane i odświeżane tylko na ResizeObserver + passive scroll listener (nie co frame, eliminuje 240 layout reads/s)
- Plus CSS `filter: blur(14px)` na canvas wrapper (`-inset-4`) — softens shader przed warstwą GlassEdge

### GlassEdge (iOS 26 Liquid Glass na obwodzie kart) — 3 tiery — HISTORYCZNE (nieużywany na żadnej aktywnej stronie)

| Tier | Blur | Saturate | Brightness | Contrast | Mask transparent | Lokalizacje |
|---|---|---|---|---|---|---|
| ~~**Medium**~~ | 16px | 170% | 110% | — | 15% | ~~Impact (homepage)~~ — usunięte 2026-09-25 (właściciel: „bez matowego efektu”) |
| **Strong** | 16px | 170% | 110% | — | 15% | 5 service subpages (one-page, strona-firmowa, strona-szyta-na-miare, sklep-internetowy, system-crm) |
| **Dramatic** | **32px** | **200%** | **120%** | **110%** | **28%** (szerszy soft ring) | UI/UX bento (4×) + UI/UX hero mockup (right side) + **/o-nas Stat Cards (4×)** — Sesja 20 |

- Ring shape przez **4 linear gradient mask layers** (right/left/top/bottom), domyślny composite `add` = opaque na krawędziach, transparent w środku, **brak hard edges** (XOR mask-composite robił widoczne "ramki w ramkach")
- Highlight stack: `inset 0 1-1.5px 0 rgba(255,255,255,0.18-0.30)` (top) + `inset 0 -1px 0 rgba(0,0,0,0.20-0.35)` (bottom), Dramatic + 1px white outline
- Border kart `border-white/15` minimum (było `/5` — niewidoczne, shader przeświecał na rounded corners)
- `z-5` (pod tekstem `z-10`+, nad shaderem `z-auto`) — blur działa na shader i dekoracje, NIE na tekst

### Perf budget shaderów

- **2026-10-05 / 06:** tempo rysowania hero, mgławic i scen liczone z czasu (nie z numeru klatki) i zależne od aktywności; planeta hero w dwóch przebiegach; tła podstron bez reakcji na kursor; mgławica szkieletu podstron usług w wariancie `liveGlow` (blask i front odsłony w kompozycji, gaz jako dwie przenikające się klatki kluczowe). Szczegóły: CLAUDE.md, tabela shaderów i „Performance patterns”.
- **Hero shader (LCP-critical):** desktop only. Mobile = statyczny render planety WebP (element LCP na każdej szerokości) + cząstki na canvasie 2D. Bez tej zasady mobile TBT = 6800ms. IO pause, tab visibility pause, ~30fps, DPR 1.25. **Od Sesji 28**: kompilacja asynchroniczna — bez sync status checks (wymuszały 100–300ms stall w oknie intro), gotowość pollowana przez `KHR_parallel_shader_compile` w rAF. **Sesja 29**: start sceny rozbity na osobne taski ≤ ~50 ms (sampling → siatka → GPU → planeta → raster napisu).
- **Lazy init below-the-fold (Sesja 28):** Impact ShaderCanvas ×4 (wtedy także Portfolio LiquidGlass + PortfolioFlow, dziś martwy kod) — pełny setup WebGL (getContext + compile) dopiero przy pierwszym zbliżeniu do viewportu ("warm" IO, `rootMargin: '600px 0px'`), nie na mount. Wcześniej 6 kompilacji szło równolegle z intro Hero. DeferredClientWidgets (Chatbot/Cookie/Lifecycle) montowane po `requestIdleCallback` (timeout 1500ms) z tego samego powodu.
- **Impact shadery (4×):** 30fps throttle; DPR 2 także na dotyku od 2026-09-26 (1,25 na ekranie 3x dawało miękkie warstwice; Save-Data / ≤ 2 GB RAM: 1,25). Wizualizacja kafla liczona w tym samym przebiegu, ale tylko w obszarze sceny (`u_vb`); przykryta karta w stosie stoi (pauza); budżet uniformów ~46 z 64 vec4 WebGL1.
- **Mgławica Realizacji:** drogi gaz co drugi render w 0,6× CSS + tania kompozycja z gwiazdami; pętla rAF staje, gdy nic się nie rusza.
- **UI/UX SyncedShaderCanvas (4×):** ten sam pipeline (30fps, DPR 1.25, IO pause), plus **cached layout reads** — zero `getBoundingClientRect()` w draw loopie (refresh tylko na ResizeObserver/scroll).
- **IntersectionObserver pauza:** **wszystkie** shadery (od Sesji 19 Hero też) — gdy poza viewport, `cancelAnimationFrame`, zero GPU work.
- **`useReducedMotion`:** respektowany na shaderach Impact + Portfolio CTA + UI/UX bento.
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
│  └─ h3: subsections + cards (nazwy realizacji w panelach, 4 steps Process, 4 kafle Impact, nazwy usług pod deską Oferty itp.)
│     └─ h4: nested cards w sekcjach z h3 (*Client cards)
└─ Footer (od 2026-09-28): h2 „Postaw kropkę nad i” + h2 nagłówki kolumn (Usługi, Na skróty, Kontakt)
```

Naprawione w iteracji a11y (2026-05-23):
- Hero notifications: `<h4>` → `<p>` (mockup UI, nie sekcje dokumentu)
- Footer Menu/Legal: `<h4>` → `<h3>`
- Testimonials autor: `<h4>` → `<cite>` (semantyka cytatu)
- Polityka cookies sub-cards: `<h4>` → `<h3>`
- Kontakt InfoCard label: `<h4>` → `<p>` (etykieta pola, nie nagłówek)

## Scope cards layout pattern (5 strony-www subpages — Sesja 23)

> HISTORYCZNE: wzorzec starych wersji podstron usług (`*Client.tsx`, dziś nieimportowane). Nowe podstrony mają zakres z terminem i pokazem w przyklejonym kadrze (CLAUDE.md „Podstrony usług - szkielet i one-page”).

Wszystkie 5 podstron strony-www (`one-page`, `strona-firmowa`, `strona-szyta-na-miare`, `sklep-internetowy`, `system-crm`) używają identycznego wzorca dla sekcji "Zakres prac":

```tsx
<section ref={scopeRef} className="relative h-[400vh] bg-[#000000] z-30">
  <div className="sticky top-0 h-dvh w-full flex flex-col items-center justify-center px-6 py-12 md:py-16">

    {/* HEADING — kompaktowy nad kartami, centered */}
    <div className="text-center max-w-2xl mb-6 md:mb-10 shrink-0">
      <div className="inline-flex items-center gap-2 ... mb-4">[Badge z ikoną/kropką brand color]</div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl ...">[Headline z brand gradient]</h2>
      <p className="text-slate-400 text-sm md:text-base ...">[Krótki opis]</p>
    </div>

    {/* CARDS MASK REGION — 2 karty widoczne naraz, centered horizontally */}
    <div className="relative w-full max-w-2xl flex-1 overflow-hidden
                    mask-[linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
      <motion.div style={{ y: scopeCardsY, willChange: 'transform' }}
                  className="flex flex-col gap-5 md:gap-6 w-full absolute top-0 left-0 pb-[20vh]">
        {scopeItems.map((item, i) => (
          <motion.div className="group relative overflow-hidden p-7 md:p-10 rounded-3xl
                                 border border-white/15 bg-[#080808] ...">
            {/* Static brand glow radial gradient — daje glassmorphismowi co blurować */}
            <div style={{ background: 'radial-gradient(ellipse 80% 60% at 80% 100%,
                            rgba(BRAND,0.18), rgba(BRAND,0.05) 40%, transparent 70%)' }} />
            {/* Big watermark number (bottom-0 right-0) */}
            {/* Content z-10 */}
            {/* Lightweight glass rim — box-shadow inset (zero GPU cost) */}
            <div style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15),
                                     inset 0 -1px 0 rgba(0,0,0,0.25)' }} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
</section>
```

**Kluczowe parametry**:
- `useSpring(scopeProgress, { stiffness: 55, damping: 32 })` — wolny pływ
- `useTransform(smoothScope, [0, 1], ['0vh', '-55%'])` — pierwsza karta widoczna od początku
- `h-[400vh]` — 33% więcej scrolla vs poprzednie 300vh
- Mask `8%-92%` (84% visible vs 60%) — 2 karty widoczne naraz
- Card: `rounded-3xl` + `border-white/15` + static brand glow + box-shadow inset rim (BEZ GlassEdge — backdrop-filter na 6 cards w sticky pin = scroll lag)
- Brand color per podstrona: blue (one-page), emerald (strona-firmowa), rose (strona-szyta-na-miare), amber (sklep-internetowy), sky (system-crm)
- **Animacja wejścia kart (Sesja 27)**: karty pojawiają się przez `whileInView` z `viewport={{ once: true, amount: 0.4 }}` (stagger per karta sterowany scrollem) + `initial={{ opacity: 0, scale: 0.96 }}` — **BEZ `y` translate** (żeby nie walczył ze spring-translatem rodzica `scopeCardsY`) + ease-out-expo `[0.16, 1, 0.3, 1]` 0.7s. Wcześniej był `y` + `viewport margin: '-10%'` = wejście "clanky" (szarpane).

## Wireframe→Blueprint reveal pattern (3 makiety — strona-firmowa, one-page, szyta-na-miare)

> HISTORYCZNE: makiety starych wersji podstron usług (`*Client.tsx`, dziś nieimportowane), w tym panel admina i fazy logowania, których już nie pokazujemy. Nowe podstrony: szkic z pomiaru gotowej treści (`_usluga/sketch.tsx`), odsłony opisane w notatkach podstron.

Trzy podstrony usług używają tego samego wzorca makiety przeglądarki ze scroll-driven reveal'em wireframe → kolorowy blueprint:

- `app/(pl)/uslugi/strony-www/one-page/OnePageClient.tsx` (lane A/B/C narracja)
- `app/(pl)/uslugi/strony-www/strona-firmowa/CorporateWebsiteClient.tsx` (4 fazy)
- `app/(pl)/uslugi/strony-www/strona-szyta-na-miare/DedicatedWebsiteClient.tsx` (4 fazy z reveal na każdej — Sesja 25)

**Kluczowa zasada 1:1 alignment (zweryfikowana przez wiele iteracji w Sesji 25):**

Wireframe i blueprint **MUSZĄ mieć identyczną strukturę JSX** w obu warstwach. Różnica tylko w klasach color span'a w treści, NIE w wymiarach/typie elementów. Span jest `inline-block` z treścią tekstową która determinuje wymiary:

```jsx
// Wireframe (gray placeholder — text-transparent + bg-white/X)
<h1 className="text-3xl md:text-5xl font-black tracking-tight">
  <span className="inline-block text-transparent bg-white/10 rounded-2xl">Twoja marka.</span>
</h1>

// Blueprint (kolor) — IDENTYCZNY outer, różnica TYLKO w span'ie
<h1 className="text-3xl md:text-5xl font-black tracking-tight">
  <span className="inline-block text-white">Twoja marka.</span>
</h1>
```

**Anti-pattern (NIE rób):** próby z `<div w-1/2 h-4 bg-white/10 rounded>` w wireframe i `<p className="text-white text-sm">` w blueprint dają RÓŻNE wymiary (line-height vs explicit h-4) → reveal nie pasuje. Zawsze identyczne tagi/klasy, różnice ograniczone do **span color**.

**Reveal mechanics (per faza):**
- `<Phase>RevealStart/End` motion values z `useTransform(mainProgress, ...)` (raw, nie smoothed — Lenis już smoothuje)
- `useMotionTemplate` na `mask-image` z 7-stopowym linear-gradient (transparent → black → transparent) sliding diagonal `to top left`
- Wireframe layer: `opacity = 1 - reveal` (znika gdy blueprint pokrywa)
- Blueprint layer: `WebkitMaskImage` + `maskImage` z dynamic gradient
- Beam scanline overlay: cienka biała linia `mix-blend-screen + blur-[1.5px]` follow'ująca front maski
- Oba layery `position: absolute inset-0` w tym samym wrapperze

**Smoothness rules:**
- Spring: `stiffness: 140, damping: 38, restDelta: 0.0005` (tight, mało overshoot)
- **Scroll-precise transformy** (URL bar opacities, page Y, form widths, cursor X/Y, dashboard, charts) → **raw `mainProgress`**, NIE `smoothMain`. Lenis już smoothuje scroll wheel; double smoothing przez spring = snap przy końcu wheel-tick (element "ucieka" za kursorem).
- Decorative fadeins (np. content opacity gdy reveal się kończy) → smoothMain OK

**Cursor unification (Sesja 25):**
- Jeden `<motion.div>` z `%` positioning cross-device (zamiast 2 osobnych dla mobile/desktop z `calc()`)
- Wygląd 1:1 między 3 makietami: `<MousePointer2 className="w-[24px] h-[24px] md:w-[34px] md:h-[34px] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" fill="white" strokeWidth={1.5} />`

**Wymiary parity (3 makiety):**
- `max-w-[88rem]` (nie `max-w-6xl`)
- `h-[78vh] md:h-[88vh]`
- Parent padding `px-3 md:px-6`

**Szczególne dla szyta-na-miare (Sesja 25):**
- Panel Admina NIE w nav makiety (tylko Home + Oferta + Zaloguj) — narracja: admin URL `/admin` jako "secret", wpisywany ręcznie
- 4 fazy z reveal (Home + Oferta + Login + Dashboard), wszystkie wordpress text-span pattern
- Dashboard BEZ `translateY` — wcześniej `-15%` powodowało że content znikał pod fixed navbarem
- Brand color: rose (`#f43f5e`) — applied do wszystkich blueprint accent'ów: buttons, links, charts, loader, glow

## WebGL dev-mode resilience pattern (Sesja 25)

> Stan 2026-10-07: zasada nadal ważna; nowe sceny rozwiązują ją prościej (płótno tworzone w efekcie przy każdym montażu + `loseContext()` w sprzątaniu). Przykład niżej pochodzi ze starych `*Client.tsx`.

Każdy długo-żyjący shader na stronie usług (Rays + 4× bento ShaderCanvas) musi handlować React 19 Strict Mode + Chrome ~16 WebGL context limit. Bez tego po 3-5 nawigacji: white flash + `console.error("Rays compile: null")` + brak shadera.

**Pattern (4 mechanizmy):**

```tsx
const canvasRef = useRef<HTMLCanvasElement>(null);
const [canvasKey, setCanvasKey] = useState(0);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  // 1. Recovery: stale lost context (Strict Mode double-mount)
  if (gl.isContextLost()) {
    setCanvasKey(k => k + 1); // forces new <canvas> DOM element
    return;
  }

  // ... shader setup, compile, link, buffers, rAF loop ...

  // 3. Runtime context loss handlers
  const onLost = (e: Event) => { e.preventDefault(); /* stop rAF */ };
  const onRestored = () => { /* re-init program + buffers */ };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  return () => {
    // ... cancelAnimationFrame, deleteProgram/Shader/Buffer, observers disconnect ...
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    // 2. Explicit context release (Chrome ~16 limit prevention)
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}, [canvasKey]);

return <canvas key={canvasKey} ref={canvasRef} ... />;
```

**4. `console.error` → `console.warn`** dla handled-state cases (np. `compileShader` returns null po zhandlowanym lost context). Next.js 16 dev overlay zamienia każdy `console.error` na fullscreen popup; warning nie przerywa DX.

## Deploy flow

```
1. npm run deploy        (~40 s) = npm run build (next build + flatten-rsc.mjs + copy-404.mjs)
                                   + npx wrangler@4 pages deploy out --project-name=avenly-web --branch=main
   Logowanie Avenly (kontakt@avenly.pl) leży w osobnym profilu - wdrażaj z XDG_CONFIG_HOME=C:/Users/Start/.wrangler-avenly
   (CLAUDE.md „Deploy flow”); samo `npm run deploy` użyje globalnego logowania RKS. Test: npm run deploy:preview
   Ostatnie wdrożenie: 2026-10-06 a6a206db (lista: progress.md „Stan wdrożenia”)
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
  - `100vh` zawiera URL bar Safari → sticky `h-screen` overflow'uje. Fix: `h-dvh` w 7 plikach (Portfolio + 6 podstron usług). NIE zmieniaj `h-[300vh]` (scroll distance pinów) — dvh dynamic powoduje pin jumps.
  - `overflow-x-auto + w-max + mx-auto` blokuje touch scroll w lewo na Safari mobile. Fix pattern: `flex justify-center + min-w-max + px-6 wrapper`. Zastosowane w Realizacje + ServicesHub filter.
  - `overflow-x-clip` wymaga Safari 16+ (browserslist Safari 15+ → ignoruje, fallback to visible). Sesja 21 zamieniła na `overflow-x-hidden`, ale to łamało sticky piny (scroll container) → **Sesja 22 cofnęła do `overflow-x-clip`** (drobny poziomy scroll na Safari 15 jest akceptowalny).
  - `flex-1` na dziecku `flex-col` nie daje pełnej szerokości (grow na main axis, nie cross). Fix dla responsive cards: `w-full md:flex-1` (Impact Stabilność karta).
  - Inline `backdropFilter` bez `WebkitBackdropFilter` → iOS WebView / Safari 14- ignoruje. Fix: para zawsze. Tailwind utility `backdrop-blur-*` auto-prefix'uje (te są OK).
  - Brak `viewportFit: 'cover'` → czarne marginesy notch. `<main min-h-screen>` → footer chowa się pod URL barem. Fix: `viewportFit: 'cover'` w viewport config + `min-h-dvh` na `<main>`.

### Bugi w danych (do naprawy w przyszłości)
- ~~`app/data/services.ts` design / marketing hrefs~~ — nieaktualne: kategoria `design` usunięta 2026-10-01; kategorie `ai` / `marketing` mapowane w `Services.tsx` przez `CATEGORY_HREF`.
- `app/(pl)/uslugi/marketing/page.tsx` i `.../audyt-wydajnosci-seo/page.tsx` zwracają `return null` (placeholdery z metadata `noindex`) → do wypełnienia albo usunięcia.
- ~~`app/data/posts.ts` post #2 blockquote linkuje `/audyt`~~ — naprawione (link do `/kontakt`).
- `components/sections/Portfolio.tsx` + `lib/i18n/home/portfolio.ts` — martwy kod od Sesji 30 (do usunięcia).
- **Propozycje czekające na wybór właściciela (stan 2026-10-07):** O nas (wejście + układ), strona firmowa (wersja kart), Strona interaktywna (krajobraz, Technologia, Detal, Zakres), sklep (tekst hero, scena zakupu), chatboty (Wiedza) - tabela w PRACA-ROWNOLEGLA.md „Stan”. Strona główna i podstrony etapu 2 nie mają otwartych propozycji.
- Stare wersje podstron usług (`*Client.tsx` + stare słowniki), nieimportowane pliki chatbotów, `app/(pl)/o-nas/parts.tsx.tmp.*`, martwy kod po UI/UX, `ServiceTemplate` / `AvenlyAICta` / `ProcessAccordion` — do usunięcia przy porządkach (lista: PRACA-ROWNOLEGLA.md „Chat 0”).

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
