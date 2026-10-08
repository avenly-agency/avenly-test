# Opinie - notatki chatu 1 (praca równoległa)

## Stan
- 2026-09-27: **wybrana i dopracowana REDAKCJA**. Pozostałe propozycje (Scena, Gwiazdy, Certyfikat), ich style i przełącznik „Układ opinii” usunięte.
- Co jest w sekcji (`testimonials/editorial.tsx`, style `.op-ed-*` w `testimonials/testimonials.css`):
  - Rozkładówka magazynu: nagłówek po lewej, ogromne cienkie „5,0” (Inter 200, do 232 px) po prawej, pierwsza opinia jako wielki cytat (cudzysłów „ wysunięty na margines), druga w węższej szpalcie za włosową linią kolumny, stopka jak przypis („Cytaty bez skrótów i poprawek.” + link do profilu Google).
  - **Część z cytatami stoi „w cudzysłowie”**: linia nad nią zaczyna się dużym znakiem “ (ze Sceny), linia pod nią kończy się znakiem ”. Znaki rysują się kreską i wypełniają, linia biegnie od znaku / do znaku; potem co 8 s ostra plamka światła obiega znak (krótka kreska, bez poświaty; tylko na ekranie).
  - **Wspólne słowo**: obie opinie zawierają „polecam” (EN: „recommend”) - słowo jest zakreślone w obu cytatach i w opisie oceny („Wspólne słowo w każdej opinii: polecam.”). Zakreślenie = ostry, półprzezroczysty pas akcentu pod dolną częścią słowa, przeciągany od lewej po wejściu słów. NIE podkreślenie w kolorze akcentu (wyglądało jak link).
  - **„5,0” jak druk**: wysuwa się ze szczeliny jako cienki kontur i „nasiąka” bielą, gwiazdki zapalają się po kolei; lekka paralaksa przy przewijaniu (liczba płynie wolniej niż strona, `--op-par` z `editorial.tsx`).
  - Każda strefa (góra, linia “, cytaty, linia ”, stopka) wchodzi, gdy sama pojawi się na ekranie (wcześniej cytaty animowały się, zanim użytkownik do nich doszedł).

## Zmiana 2026-09-28 (po zamknięciu sekcji, na polecenie właściciela)
- **Bez „5,0” i gwiazdek** („tak, usuń 5,0 na Google” - słaby social proof): górna strefa to już tylko nagłówek w jednej kolumnie. Zdanie „Wspólne słowo w każdej opinii: polecam.” też usunięte (właściciel: brzmiało źle) - „polecam” jest nadal zakreślone w cytatach. Usunięte: `.op-ed-score` / `.op-ed-num` / gwiazdki, paralaksa liczby, `Stars`, `useReducedMotionPref`, pola słownika `ratingValue` / `ratingLabel` / `ratingOutOf` / `starsAriaLabel` (`ratingDescription` → `keyWordNote`), AggregateRating i `reviewRating` w JSON-LD. Opisy „5,0” niżej są historyczne.
- Copy: etykieta „Opinie”, nagłówek „Nie wierz nam na słowo. Uwierz klientom.”, podtytuł „Tak o współpracy z Avenly piszą klienci w Google.” (zamiast „Opinie z profilu Avenly w Google, cytowane dosłownie. Każdą sprawdzisz sam.”), link „Sprawdź opinie w Google”.

## Responsywność (2026-09-27, prośba właściciela: „dostosuj do mobile i ogólnie responsywność”)
- **Telefon (< 640 px):** „5,0” (32vw, 100-150 px) po lewej, gwiazdki i „Średnia ocen w Google” obok, wyrównane do dołu liczby; opis ze wspólnym słowem pod spodem na całą szerokość (`.op-ed-meta` = `display: contents`, siatka na `.op-ed-score`). Główny cytat clamp(23px, 6,6vw, 30px) - na 320 px 6 linii zamiast 9. Podpis autora 14 px i krótsza kreska do 400 px (mieści się w jednej linii). Mniejsze cudzysłowy (70 / 52 px) i paralaksa 12 px.
- **Tablet (640-1023 px):** „5,0” 156 px, gwiazdki, podpis i opis obok liczby; główny cytat clamp(30px, 4,6vw, 40px); druga opinia max 38rem (~65 znaków w wierszu); cudzysłowy 88 / 64 px.
- **Komputer (≥ 1024 px):** bez zmian (nagłówek i ocena w dwóch kolumnach, cytaty w szpaltach 7 / 5, paralaksa 26 px). **2K+ (≥ 2560 px):** liczba 264 px, główny cytat 50 px, druga opinia 19 px / max 44rem.
- **Link do profilu:** tekst liniowy zamiast flex - przy zawinięciu strzałka zostaje przy ostatnim słowie (`.op-link-end`, nowrap); cel dotyku 44 px (padding); efekty najechania tylko w `@media (hover: hover)`, na dotyku krótkie przygaszenie (`:active`), bez szarego błysku (`-webkit-tap-highlight-color`).
- Grubość kreski cudzysłowu: przy każdej zmianie szerokości znaku przelicz `--sw` = 84 / szerokość (px) i `--sw2` ≈ 1,65 × `--sw`.
- Weryfikacja: zrzuty 320 × 640, 360 × 780 (EN), 390 × 844 (także reduced motion), 430 × 932, 844 × 390 (telefon poziomo), 768 × 1024, 1024 × 768, 1366 × 768, 1920 × 1080, 2560 × 1440; ESLint i tsc czysto.

## Decyzje właściciela (cytaty + data)
- 2026-09-27: „zrób kilka wersji tej sekcji i toggle” → 4 propozycje.
- 2026-09-27: „wybieram redakcję, ale podrasuj sekcję, dodaj gdzieś te animowane cudzysłowy ze sceny i w ogóle dodaj duszy tej sekcji, żeby nie była taka miałka”.
- 2026-09-27: „dostosuj tą sekcję do mobile i ogólnie responsywność”.

## Pliki
- `components/sections/Testimonials.tsx` - sekcja + JSON-LD (bez zmian: Review ×2 + AggregateRating 5.0).
- `components/sections/testimonials/editorial.tsx` - układ, znaki cudzysłowu (`QuoteMark`, `MarkRule`), paralaksa.
- `components/sections/testimonials/shared.tsx` - `OpHead`, `Stars`, `ProfileLink`, `Words` (tekst na słowa, cudzysłowy przyklejone do pierwszego / ostatniego słowa, `mark` = zakreślone słowo bez interpunkcji, całość dla czytnika jednym ciągiem), `useReveal` (`data-live` / `data-in` / `data-vis`), `useReducedMotionPref` (bez framer-motion w chunku).
- `components/sections/testimonials/testimonials.css` - style (import w `Testimonials.tsx`).
- `lib/i18n/home/testimonials.ts` - pola: `lead`, `ratingOutOf`, `ratingDescription` + `keyWord` (słowo obecne w KAŻDEJ opinii danego języka - po dodaniu opinii sprawdzić), `sourceLabel`, `verbatimNote`, `newTab`, `quoteOpen` / `quoteClose` (PL „…”, EN “…”); usunięte nieużywane `googleReviews`, `initials`. Treść i autorzy opinii bez zmian.

## Pułapki i ważne szczegóły
- **Stany startowe animacji tylko pod `[data-live]`** (JS działa) i tylko w `@media (prefers-reduced-motion: no-preference)`. Bez JS / przy ograniczonym ruchu treść stoi od razu, bez paralaksy i bez plamki światła. Jeśli strefa jest już na ekranie przy starcie, `data-live` i `data-in` wchodzą razem - bez migania.
- **Znak cudzysłowu bez `vector-effect: non-scaling-stroke`**: przy nim Chrome liczy długość kreski z `pathLength` niedokładnie (przerwa na końcu obrysu). Znak ma stałą szerokość w CSS, a grubość kreski jest podana w jednostkach viewBoxa (`--sw` = 1 px, `--sw2` = plamka) - zmiana szerokości znaku = przelicz `--sw` (84 / szerokość w px). Rysowanie w `@keyframes op-ed-draw` kończy się `stroke-dasharray: none`.
- ” = ten sam kształt co “ obrócony o 180° (`rotate(180 42 34)`).
- **Pseudo-elementy nie mogą być w `:is()`** (cała reguła jest odrzucana) - osobne selektory. Stan startowy z `:nth-child()` ma wyższą specyficzność niż `[data-in] :is(...)` - wtedy stan końcowy z tą samą specyficznością.
- **Daty opinii**: w słowniku są daty względne z Google („tydzień temu”, „2 miesiące temu”) skopiowane w styczniu 2026 - dziś nieprawdziwe, więc sekcja ich NIE pokazuje. Do uzupełnienia prawdziwymi datami (miesiąc i rok), jeśli właściciel chce je pokazać.
- Link „Zobacz profil firmy” to długi adres wyszukiwarki z `authuser=4` (bez zmian ze starej wersji). Pytanie do właściciela: zamienić na `GOOGLE_BUSINESS.profileUrl` z `lib/seo-data.ts`?
- Wspólny dev server: strona chwilowo nie kompilowała się przez niedokończone zmiany innych chatów (Process, Services) - skrypt zrzutów czeka, aż zniknie „Build Error”. Bez JS w trybie dev leniwe sekcje `HomeClient` pokazują placeholder strumieniowania (Next), choć HTML z serwera zawiera sekcję i JSON-LD.

## Propozycje dla zamrożonych części (nie wprowadzone)
- Navbar: przycisk „Darmowa Wycena” (EN „Free quote”) łamie zasadę jednego CTA „Bezpłatna konsultacja” (PRODUCT.md) i jest w Title Case.
- Hero: linia dowodów renderuje się wersalikami („BEZPŁATNIE · BEZ ZOBOWIĄZAŃ…” w `innerText`) - sprawdzić z zasadą „bez rozstrzelonych wersalików”.
- ~~Asystent AI (chat 2): ostrzeżenie o niezgodności hydratacji - współrzędne `<text>` w SVG tarczy różnią się na ostatnich cyfrach między serwerem a przeglądarką; zaokrąglić.~~ Nieaktualne: tarcza zniknęła z propozycjami, a cała sekcja „Asystent AI” została usunięta 2026-09-27 (dopisek chatu 2).

## Do dokumentacji głównej
- ✅ **Przeniesione 2026-09-29** (konsolidacja, chat 4 na polecenie właściciela): CLAUDE.md „Sekcja „Opinie” - REDAKCJA”, project_context.md, README.md, progress.md; PRODUCT.md - reguła 4 (słowo w słowo, bez dat względnych) i Design Principles 12 (dusza sekcji). Punkty niżej zostają jako zapis.
- do CLAUDE.md: rozdział „Sekcja Opinie - Redakcja” (opis wyżej, pliki, pułapki: znak bez non-scaling-stroke + `--sw`, `:is()` + pseudo-elementy, `keyWord` musi występować w każdej opinii, strefy z własnym wejściem).
- do PRODUCT.md (kandydaci na zasady, do potwierdzenia przez właściciela): opinie klientów cytujemy słowo w słowo (także literówki) z dopiskiem, że to cytat bez poprawek; bez nieaktualnych dat względnych i bez kółek-awatarów z inicjałami. Sekcja czysto typograficzna bez żywego detalu jest „miałka” - potrzebny jeden znak-motyw z ruchem i opowieść (tu: cudzysłów + wspólne słowo).

## Weryfikacja
- 2026-09-27 (po dopracowaniu): zrzuty 1440 × 900 i 390 × 844 (całość po przewinięciu sekcji), reduced motion (wszystko od razu, bez ruchu), EN (`/en/`: „recommend” zakreślone w obu cytatach i w opisie), zbliżenia: zakreślenie w dużym cytacie, plamka światła na znaku (animacja zamrożona w trakcie okrążenia).
- `npx eslint components/sections/Testimonials.tsx components/sections/testimonials lib/i18n/home/testimonials.ts` - czysto; `tsc --noEmit` - brak błędów w plikach sekcji.
