# Praca równoległa - etap 2: podstrony (5 chatów) - ARCHIWUM

> **Archiwum (od 2026-10-01).** Etap 2: Usługi (katalog), Blog, Kontakt i Realizacje zamknięte; O nas (chat 1) kończy pracę już według nowego planu. Aktualny plan (etap 3 - copywriting i podstrony usług) jest w [PRACA-ROWNOLEGLA.md](../PRACA-ROWNOLEGLA.md). Ścieżki względne poniżej liczone są od katalogu głównego repo.
>
> **Dopisek 2026-10-07:** po zamknięciu etapu 2 zmieniły się: teksty Usług, Realizacji i Kontaktu (chat 6), usunięta usługa UI/UX (bez `/uslugi/design*`), tła `/uslugi` i `/realizacje` bez interakcji z kursorem (2026-10-05). Opisy końcowe podstron: `CLAUDE.md` (rozdziały „Blog”, „Katalog usług”, „Podstrona Realizacje”, „Strona Kontakt”). O nas nadal czeka na wybór właściciela.

> Obowiązuje od 2026-09-29 do konsolidacji (koniec tego pliku).
> Etap 1 (strona główna, 6 chatów) zakończony 2026-09-29 - archiwum: [docs/praca-rownolegla-etap-1.md](./docs/praca-rownolegla-etap-1.md).
> Czytają: właściciel oraz każdy chat Claude, który pracuje przy tym repo.
> Jeśli jesteś chatem z tego planu, przeczytaj plik w całości, zanim cokolwiek zmienisz.

## Po co to jest

Strona główna jest skończona i wdrożona (hero, Realizacje, „Dlaczego Avenly”, Proces, Opinie, Oferta, Blog, stopka). Teraz podstrony mają dojść do tego samego, topowego poziomu. Pięć chatów pracuje równolegle: każdy odpowiada za **jedną podstronę razem z jej wersją EN** i dotyka **tylko swoich plików**.

Chat, który napisał ten plan, jest **koordynatorem (chat 0)**: nie bierze żadnej podstrony, odpowiada na pytania o wspólne pliki, rozstrzyga konflikty, na końcu scala notatki do dokumentacji głównej i na polecenie właściciela buduje i wdraża.

## Przydział

| Chat | Podstrona | Trasy PL / EN | Zadanie | Prefiks klas CSS | Status |
|---|---|---|---|---|---|
| **0** | koordynacja | - | plan, pytania o wspólne pliki, konsolidacja, build i wdrożenie na polecenie | - | ✅ plan gotowy |
| **1** | O nas | `/o-nas` · `/en/about-us` | modernizacja do nowego designu, 3-5 propozycji z przełącznikiem | `on-` | 🔎 czeka na wybór: wejście ze znaku marki (Kropka / Planeta / Linia) + układ (Korekta / List / Bez pośredników / Manifest) |
| **2** | Usługi (katalog i kategorie) | `/uslugi`, `/uslugi/strony-www`, `/uslugi/design` · `/en/services`, `/en/services/websites`, `/en/services/design` | modernizacja do nowego designu, 3-5 propozycji z przełącznikiem | `us-` | ✅ 2026-10-01 zamknięta: wygląd kart = Kadr (rama w ciemnym szkle jak w Realizacjach, rysunek na „ekranie”; pozostałe wersje i panel usunięte); góra na telefonie poprawiona (opis zdaniami w wyważonych liniach, pasek kategorii gaśnie przy krawędzi zamiast ucinać słowo); wejście boxów = Obrys (wybór właściciela; pozostałe efekty, przełącznik i panel usunięte; poprawione „laguje i buguje się reveal” - karta była widoczna w całości przed wejściem, tło karty wchodzi teraz samą przezroczystością; odsłona mgławicy na telefonie jak na komputerze - rozkwit wokół pierwszej karty, zegar od pierwszej klatki, ostrzejsze gwiazdy); wybrane wcześniej: góra = „Kropka” wyśrodkowana (jedno zdanie z kropką marki, filtr pośrodku), tło Mgławica z Realizacji na całą podstronę, rodzi się z czerni od razu po wejściu (`_katalog/nebula.ts` to kopia 1:1 `_rl/nebula.ts` z chatu 5 - do scalenia po zamknięciu obu podstron), układ pierwotnej wersji, Galeria z kartami „Plan”, bez etykiety, box „Nie wiesz, co wybrać?” z własnym animowanym rysunkiem. Widoczna ścieżka usunięta; na prośbę właściciela usunięte też linki „Wróć” na UI/UX i w polityce (zamrożone), chat 5 usunął `rl-back`. Uwaga: dev server Avenly jest teraz na :3001 (na :3000 działa projekt RKS) - notatki `docs/podstrony/uslugi.md` |
| **3** | Blog | `/blog`, `/blog/[slug]` (tylko PL) | **przywrócenie wersji pierwotnej sprzed jakiegokolwiek redesignu** (bez propozycji) | `bl-` | ✅ ZAMKNIĘTE 2026-09-29 (zadanie zmienione przez właściciela: czerwiec jako baza + modernizacja). Lista „Wierna”, wpis „Okładka + Nagłówek na liniach”, bez przełączników. Przewodnik bloga i `/new-post` zaktualizowane; tekst do `CLAUDE.md` gotowy w `docs/podstrony/blog.md` |
| **4** | Kontakt | `/kontakt` · `/en/contact` | **dostosowanie istniejącego układu** do aktualnego designu (bez nowego konceptu) | `kt-` | ✅ gotowe do przeglądu: układ „Obok siebie”, tło „Opływ” (WebGL), formularz „Bez karty”, dopasowane do telefonu i tabletu; przełączniki usunięte; dokumentacja główna już zaktualizowana na prośbę właściciela (szczegóły w `docs/podstrony/kontakt.md`) |
| **5** | Realizacje | `/realizacje`, `/realizacje/[slug]` · `/en/work`, `/en/work/[slug]` | modernizacja listy i case studies, 3-5 propozycji z przełącznikiem | `rl-` | ✅ ZAMKNIĘTE 2026-10-01 (właściciel: „zajebiście, brawo, udało ci się dopiąć podstronę do końca”). Przełączników brak (`_rl/dock.tsx` nieużywany - wzór panelu, do usunięcia przy konsolidacji). Do konsolidacji: dwie kopie shadera mgławicy (`_rl/nebula.ts` i `/uslugi/_katalog/nebula.ts`, różnica rundy 18), propozycja `SmoothScrolling`, tekst do `CLAUDE.md` i skrypty zrzutów - w `docs/podstrony/realizacje.md`. Historia: runda 6 - wybrane (2026-09-30): lista = Plansze (na przemian lewa / prawa, na końcu siatka wszystkich realizacji), tło = mgławica podstrony (`_rl/nebula.ts`: czarna dziura pod kursorem bez obwódki, kilwater, nakładające się fale po kliknięciach, głębia przy przewijaniu), ramka = czarne szkło (runda 7); reszta wersji, ramek, teł i odmian szkła usunięta; strzałki w kolorze realizacji; runda 7: filtr tylko w sekcji „Wszystkie realizacje”, plansze wyśrodkowane w pionie, strony w kadrach przesuwa CSS na osi przewijania; runda 8-9: nagłówek na cały pierwszy ekran z tekstem pośrodku i animowaną strzałką przewijania, pierwsza plansza podjeżdża pod nagłówek; runda 10: mgławica wyłania się od razu z czerni (od środka ekranu); runda 13: wejście jak w /uslugi (czerń → mgławica → tekst po kolei → kadry) i nagłówek w stylu /uslugi (jedno zdanie z kropką marki); runda 11-12: środek nagłówka = Kadry w głębi (żywe strony klientów, RKS i Grawerstwo duże z przodu, większy środek, czysty cień kadrów), nowe zrzuty Mcentrum (ekran po ekranie), płynna końcówka przewijania (efekty z ułamkowej pozycji Lenisa; propozycja zmiany `SmoothScrolling` w notatkach); runda 14: telefon i tablet (tytuł jak plakat, duży wachlarz kadrów w głębi z ruchem, nazwy plansz na całą szerokość, mgławica reaguje na palec także przy przewijaniu); runda 15: etykieta „Wszystkie realizacje” w kolorze realizacji na ekranie, filtr kategorii przyklejony u góry ekranu na każdej szerokości i zjeżdża pod nawigację, gdy ta wraca; runda 16: klikalne kadry (link do realizacji), najechanie na kartę zmienia barwę i blask mgławicy jak w /uslugi; runda 17: odsłona mgławicy na telefonie jak na komputerze (od pierwszej narysowanej klatki, 60 fps, front w proporcjach ekranu, ostre gwiazdy) - te same zmiany co chat 2 w kopii shadera `/uslugi`, obie kopie zgodne; runda 18: na ekranie pionowym mgławica wyraźniejsza i większa (gęstszy wzór, większy i jaśniejszy blask) - tego `/uslugi` nie ma, różnica do decyzji przy scalaniu; wszystkie propozycje wybrane |

**Poza tym etapem (zamrożone, kandydaci na etap 3):** 7 podstron usług (`/uslugi/strony-www/one-page`, `strona-firmowa`, `strona-szyta-na-miare`, `sklep-internetowy`, `system-crm`, `/uslugi/design/ui-ux`, `/uslugi/automatyzacje-ai/chatboty-ai`), puste `/uslugi/marketing*`, polityka prywatności, strona 404.

## Zadania

### Chat 1 - O nas

**Stan dziś** (`ONasClient.tsx`, ~900 linii): hero z ogromnym napisem AVENLY, zoom przy przewijaniu (GSAP) i shaderem zorzy (tylko komputer), 4 karty statystyk z shaderem fal i `GlassEdge` Dramatic (`backdrop-filter`), FAQ, kafelek „Inne pytanie? Zapytaj Avenly AI” z rozmytą poświatą. Łamie dzisiejsze zasady: rozmycia i szkło (8× `blur`), tekst z gradientem, wersaliki z rozstrzelonymi literami.

**Cel:** strona o agencji na poziomie strony głównej, z własnym pomysłem wizualnym (nie kopią hero, warstwic ani stosu kart). 3-5 propozycji z przełącznikiem.

**Uwagi:**
- `/o-nas` zostaje w **głosie „my”** - jedyny wyjątek od głosu korzyści (PRODUCT.md).
- Statystyki do przeglądu: „100% Zaangażowania” i „ROI - Twój zysk” to hasła bez pokrycia, „Szybki Kontakt” jest w Title Case. Obronne liczby: 98/100 PageSpeed, odpowiedź w 24 h.
- Wielki napis AVENLY w hero powtarza logotyp z hero strony głównej (anti-reference „wielki logotyp”, „odgrzewany kotlet”) - oceń w propozycjach, czy zostaje.
- `faq-data.ts` zasila UI i dane strukturalne FAQPage - treść pytań wolno poprawiać, struktura i schema zostają.
- Czat otwiera `window.dispatchEvent(new Event('avenly:open-chat'))` - zostaw ten mechanizm, samego czatu nie ruszaj.
- GSAP / ScrollTrigger: pułapki z `CLAUDE.md` (bez `ScrollTrigger.refresh()` przy nawigacji, sprzątanie pinów, `overflow-x-clip` zamiast `overflow-x-hidden`).

**Pliki:** `app/(pl)/o-nas/*` (`page.tsx`, `layout.tsx`, `ONasClient.tsx`, `faq-data.ts` + nowe pliki obok, np. `o-nas.css`, podkomponenty), `lib/i18n/o-nas.ts`, `app/(en)/en/about-us/*`, assety w `public/o-nas/`.

### Chat 2 - Usługi (katalog i strony kategorii)

**Stan dziś:** `ServicesHub.tsx` (filtr kategorii z animacją, kafle usług, `AvenlyAICta`), strony kategorii `WebCategory.tsx` i `DesignCategory.tsx` w tym samym stylu: tekst z gradientem, wersaliki, rozmyte poświaty.

**Cel:** katalog usług i strony kategorii na poziomie strony głównej, z własnym pomysłem (nie kopią desek z rysunkami z sekcji Oferta). 3-5 propozycji z przełącznikiem.

**Uwagi:**
- Katalog ma mówić to samo co Oferta na stronie głównej - **PRODUCT.md „Co obiecujemy w ofercie”**. W tekstach katalogu zostały „panel CMS”, „Headless CMS (Sanity / Strapi / Payload)”, „WooCommerce / WordPress + motyw Impreza”, plakietka „CMS & SEO” (`kategorie.ts`) - do usunięcia. UI/UX i audyt to skromne dodatki, AI w CRM to opcja. Wzorzec tonu: opisy usług w `servicesSectionDict.items` (chwyt, potem konkret).
- Nazwy w `app/data/services.ts` są w Title Case („Strona Szyta na Miarę”, „Audyt Wydajności & SEO”) - katalog bierze teksty z pól słownika, w sentence case (tak robi Oferta).
- Audyt SEO nie ma strony - oznaczenie „Wkrótce”. Puste `/uslugi/marketing*` nie są w zakresie.
- Kolory motywów podstron (`lib/service-theme.ts`: bursztyn sklep, pomarańcz chatboty…) to kodowanie treści - wolno ich użyć jako akcentu usługi, pliku nie zmieniasz.
- `AvenlyAICta` jest też na 7 podstronach usług - jeśli potrzebujesz innego CTA, zrób lokalny komponent w swoim katalogu.
- Katalog i kategorie linkują do 7 podstron usług (zamrożonych) - adresy i kotwice bez zmian.

**Pliki:** `app/(pl)/uslugi/page.tsx`, `ServicesHub.tsx`, `strony-www/page.tsx` + `WebCategory.tsx`, `design/page.tsx` + `DesignCategory.tsx` (+ nowe pliki obok, np. `app/(pl)/uslugi/uslugi.css`), `lib/i18n/uslugi/kategorie.ts`, `app/(en)/en/services/page.tsx`, `app/(en)/en/services/websites/page.tsx`, `app/(en)/en/services/design/page.tsx`, assety w `public/uslugi/`.

**Wspólne (ostrożnie):**
- `lib/i18n/services.ts`: `servicesHubDict` - Twój (zmieniasz i rozszerzasz, PL + EN). `servicesByLocale` zasila też Ofertę na stronie głównej (kolejność, ikony, adresy, `id`, `slug`, `cards`) - wolno zmieniać **tylko teksty opisów** i dopisywać pola; struktury, kolejności, `id`, `slug`, `href` i ikon nie ruszasz. `servicesSectionDict` (Oferta) - nie ruszasz.
- `app/data/services.ts`: zasila Ofertę i listę usług w formularzu kontaktu (chat 4). Wolno poprawić **tylko teksty opisów**; nazwy (`title`), wartości, adresy i kolejność zostają.

### Chat 3 - Blog: przywrócenie wersji pierwotnej

**Zadanie właściciela:** „przywrócić wersję pierwotną sprzed jakiegokolwiek redesignu”. To **odtworzenie, nie projektowanie** - bez propozycji i bez „poprawiania” wyglądu do dzisiejszych zasad.

**Która wersja (historia w git):**
1. **Styczeń 2026 - wersja pierwotna = CEL.** Stan z commitu `9a9577d` (2026-01-26): `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `components/blog/BlogList.tsx` (lista z filtrem kategorii i wyszukiwarką), style `.blog-content` z ówczesnego `app/globals.css` (`git show 9a9577d:app/globals.css`, blok `.blog-content`). Nagłówek „Wiedza, która napędza rozwój.”, niebieska i fioletowa kula światła.
2. Czerwiec 2026 - pierwszy redesign (commit `dc008c2` = dzisiejszy HEAD): `BlogHero` (pigułka „Blog Avenly”), `BlogHeroBackground` (shader warstwic), przepisany `BlogList`.
3. Wrzesień 2026 - drugi redesign (obecny, niezacommitowany): `BlogGrid`, `ReadingProgress`, `blog.css` z klasami `bl-` / `ba-`.

Na starcie pokaż właścicielowi wersję 1 (styczeń) i dla pewności 2 (czerwiec) przełącznikiem tylko w `npm run dev` (`createChoice('avenly-blog-version', …)`), poczekaj na potwierdzenie, potem zostaw jedną i usuń przełącznik.

**Co odtwarzasz 1:1, a co zostaje z dzisiaj:**
- Odtwarzasz: wygląd i zachowanie listy i wpisu (układ, komponenty, animacje, style `.blog-content`).
- Zostaje z dzisiaj (to nie design): trasy w `app/(pl)/blog/` (route group), importy `@/`, pełne metadane z canonical i Open Graph, dane strukturalne BlogPosting + BreadcrumbList, `generateStaticParams`, dane z `app/data/posts.ts` bez zmian (w tym link CTA „Bezpłatna konsultacja” w treści wpisów), wspólny Navbar, stopka i czat.
- Style `.blog-content` NIE wracają do `globals.css` (zamrożony) - trafiają do `components/blog/blog.css` (obecne klasy `bl-` / `ba-` z niego usuwasz).
- Świadomy wyjątek od zasad designu (rozmyte kule, tekst z gradientem, filtr kategorii) - decyzja właściciela. Nie „poprawiaj” ich bez prośby. Jeśli coś w starej wersji jest zepsute technicznie (błąd hydratacji, nieistniejący import, puste kategorie filtra, zagnieżdżony `<main>`), zapisz w notatkach i zapytaj.

**Uwagi:**
- Git **tylko do odczytu**: `git show <commit>:<ścieżka>`, `git log`, `git diff`. **Nigdy** `git checkout <commit> -- plik` ani `git restore --source` (nadpisują drzewo robocze, w którym pracuje 5 chatów). Stary plik zapisz do scratchpada, przenieś treść narzędziem Write / Edit.
- `components/sections/blog-teaser/*` (`cards.tsx`, `data.ts`, `blog-teaser.css`) należą do sekcji Blog na stronie głównej (zamrożona) - przestajesz ich używać na `/blog`, ale ich nie zmieniasz ani nie usuwasz. Po zmianach sprawdź stronę główną: sekcja Blog (także przy ograniczonym ruchu) ma działać jak dziś.
- `BlogGrid.tsx`, `ReadingProgress.tsx` i klasy `bl-` / `ba-` używa tylko `/blog` - po odtworzeniu możesz je usunąć (sprawdź `grep`, czy nic innego ich nie importuje).
- `docs/blog-style-guide.md` i `/new-post` opisują dziś wpis z CTA jako kartą z białym przyciskiem - zapisz w notatkach, co trzeba tam zmienić po odtworzeniu (poprawi koordynator przy konsolidacji).

**Pliki:** `app/(pl)/blog/**`, `components/blog/**`.

### Chat 4 - Kontakt: dostosowanie do aktualnego designu

**Zadanie właściciela:** „dostosowanie do aktualnego designu”. To **restyling istniejącego układu, nie nowy koncept** (formularz zostaje formularzem, karty kontaktu kartami). Zamiast 3-5 konceptów pokaż 1-2 warianty dopracowania; „duszę” (własny motyw) dodawaj tylko na prośbę.

**Stan dziś:** `ContactSection.tsx` (formularz + karty z danymi kontaktu, framer-motion), wersaliki z rozstrzelonymi literami (7×), gradienty; przy ograniczonym ruchu błąd hydratacji nagłówka „Zacznijmy.” (serwer `opacity: 0`, klient `opacity: 1`) - do naprawy.

**Uwagi:**
- Logika formularza zostaje: Web3Forms (klucz w kodzie), React Hook Form, honeypot `botcheck`, pola, zgoda RODO, uśpiony prefill `?audyt=` w `useContactForm.ts`, lista usług w `ServiceSelect.tsx` (wartości opcji identyczne jak dziś). Zmieniasz wygląd i teksty, nie działanie.
- Dane firmy (e-mail, dwa telefony, godziny) tylko z `lib/seo-data.ts` - nic na sztywno.
- **Formularz musi zostać na górze strony:** na `/kontakt` przycisk „Bezpłatna konsultacja” w stopce przewija do góry strony (`footer/shared.tsx`), zakładając, że tam jest formularz. Jeśli układ to zmienia, napisz do koordynatora.
- Stany formularza (wysyłanie, sukces, błąd) i komunikaty walidacji też w nowym stylu. Cele dotyku ≥ 44 px, etykiety pól widoczne (nie tylko placeholder), kontrast AA.

**Pliki:** `app/(pl)/kontakt/*` (`page.tsx`, `layout.tsx`, `ContactSection.tsx`, `ServiceSelect.tsx`, `useContactForm.ts` + nowe pliki obok, np. `kontakt.css`), `lib/i18n/kontakt.ts`, `app/(en)/en/contact/*`. Tylko odczyt: `app/data/services.ts`, `lib/seo-data.ts`.

### Chat 5 - Realizacje (lista i case studies)

**Stan dziś:** `RealizacjeClient.tsx` (filtr kategorii, karty projektów, modal „Masz pytania?” z rozmytą poświatą, karta asystenta AI otwiera czat), `CaseStudy.tsx` + `components/projects/StatsSpotlight.tsx` (reflektor za kursorem = efekt najechania na karcie treści, dziś zakazany). Rozmycia (6×), tekst z gradientem, wersaliki.

**Cel:** lista realizacji i case studies na poziomie strony głównej. Sekcja Realizacje na stronie głównej (mgławica, kurtyna, kadr w szkle) jest zamrożona i należy do strony głównej - podstrona dostaje **własny pomysł**, nie jej kopię. 3-5 propozycji z przełącznikiem.

**Uwagi:**
- Fakty o projektach bez zmian i bez wymyślonych metryk: Kardyś **bez personalizacji graweru**, punkt wyjścia = przestarzała strona na WordPressie i sklep bez zamówień; RKS = strona + aplikacja klubowa + social media; „Wirtualny Asystent AI” nie ma case study - otwiera czat (`avenly:open-chat`).
- `app/data/projects.ts` i `lib/i18n/projects.ts` zasilają też sekcję Realizacje na stronie głównej (`lib/i18n/home/realizacje.ts`) i sitemapę: nie zmieniasz `slug`, `title`, `client`, `externalLink`, ścieżek obrazów, `hasCaseStudy`, `openChat` ani kolejności. Teksty opisów wolno poprawić (fakty zostają), nowe pola wolno dopisać.
- `public/portfolio/*` to wspólne obrazy (także kadry strony głównej w `public/portfolio/stage/`, cache 30 dni) - nie podmieniasz ich pod tą samą nazwą. Nowe assety w `public/realizacje/`. Zrzuty stron klientów w wysokiej jakości: mastery w `assets/screenshots/` (tylko odczyt).
- Dane strukturalne case study (CreativeWork + BreadcrumbList, `@id` spójne z ItemList na stronie głównej) zostają.

**Pliki:** `app/(pl)/realizacje/**` (`page.tsx`, `layout.tsx`, `RealizacjeClient.tsx`, `[slug]/page.tsx`, `[slug]/CaseStudy.tsx` + nowe pliki obok, np. `realizacje.css`), `components/projects/*`, `app/(en)/en/work/**`, assety w `public/realizacje/`. Wspólne (ostrożnie, patrz wyżej): `app/data/projects.ts`, `lib/i18n/projects.ts`.

## Wspólny język podstron (żeby 5 chatów nie zrobiło 5 różnych stron)

Dotyczy chatów 1, 2, 4 i 5. **Nie dotyczy bloga** (chat 3 odtwarza starą wersję).

1. **Nagłówek strony** jak nagłówki sekcji strony głównej: etykieta `<SectionLabel>` (np. „O nas”, „Usługi”, „Kontakt”, „Realizacje”), h1 w typografii `.im-title` z akcentem `.im-accent` (kolor marki, bez gradientu) i podtytuł `.im-lead`. Klasy z `globals.css` wolno użyć i lokalnie powiększyć h1, ale nie zmieniać ich definicji. Nagłówek przy lewej krawędzi kontenera (`.container`), nie wyśrodkowany.
2. **Treść przy krawędziach wrappera** (PRODUCT.md, Design Principles 14) - karty, listy i linki zaczynają się przy lewej krawędzi kontenera, linki typu „Wszystkie…” kończą przy prawej.
3. **Czerń luksusowa**: tło strony `#050505`, karty w głębokiej neutralnej czerni z ostrym refleksem krawędzi u góry, ostre linie, jeden kolor marki `--brand` `#3b82f6` (`--brand-hi` `#60a5fa` na hover / fokus).
4. **Bez**: tekstu z gradientem, pigułek z wersalikami i pulsującą kropką, rozmytych kul światła, `backdrop-filter`, `GlassEdge`, cieni za tekstem, kart unoszących się lub świecących po najechaniu, reflektora za kursorem.
5. **Bez końcowej sekcji CTA tuż nad stopką** - stopka („Postaw kropkę nad i” + „Bezpłatna konsultacja”) zamyka każdą stronę, a osobne CTA nad nią właściciel uznał za zbędne na stronie głównej. Dawne modale „Masz pytania?” i kafelki z rozmytą poświatą znikają. CTA w treści, gdy ma sens: biały przycisk „Bezpłatna konsultacja” jak w hero i stopce.
6. **Przejścia**: strona zaczyna się pod stałym Navbarem na `#050505` i kończy na `#050505` (stopka zaczyna się od czerni) - bez jasnych elementów przy krawędziach.

## Zamrożone: tych rzeczy nie ruszamy

Cała strona główna (wszystkie sekcje, `HomeClient.tsx`, `lib/i18n/home/*`), Navbar, stopka, okno czatu, baner cookies, `AppShell` i oba root layouty, `SmoothScrolling`, `components/ui/*` (w tym `SectionLabel`), `components/Reveal.tsx`, `components/AvenlyAICta.tsx`, `components/templates/ServiceTemplate.tsx`, `components/ProcessAccordion.tsx`, `lib/service-theme.ts`, `lib/seo-data.ts`, `lib/schemas.ts`, `lib/i18n/locale.ts`, `app/sitemap.ts`, `public/_headers` i `public/_redirects`, 7 podstron usług, polityka prywatności, 404. Uważasz, że coś z tej listy wymaga zmiany? Zapisz propozycję w notatkach i napisz do koordynatora. Sam jej nie wprowadzaj.

## Zasady, dzięki którym chaty sobie nie przeszkadzają

1. **`app/globals.css` - nie edytujesz.** Style podstrony trzymasz we własnym pliku CSS obok komponentu i importujesz go w komponencie (`import './o-nas.css';`). Wszystkie nowe klasy zaczynasz od swojego prefiksu z tabeli. Istniejące klasy i tokeny z `globals.css` (`.im-title`, `.im-accent`, `.im-lead`, `--brand`, `@theme`) wolno używać, nie wolno ich zmieniać.
2. **Słowniki:** rozszerzasz tylko swój plik w `lib/i18n/…` i zawsze uzupełniasz obie wersje, PL i EN (EN według PRODUCT.md: głos korzyści, sentence case, bez myślników). Pola dopisujesz w tym samym pliku, w typie słownika.
3. **Wersja EN** jest częścią zadania: strony EN renderują Twój komponent ze słownikiem EN - po każdej większej zmianie sprawdź trasę EN. Nowa trasa = wpis w `PL_TO_EN_SEGMENT` i sitemapie, czyli prośba do koordynatora.
4. **SEO zostaje:** metadane z canonical i hreflang (`i18nAlternates`), dane strukturalne z builderów `lib/schemas.ts` (nie pisz schema ręcznie), jeden h1 na stronę, kolejność h1 → h2 → h3.
5. **Wspólne komponenty tylko używasz** (`components/ui/*`, `Reveal`, `components/seo/*`, `components/utils/proposals.tsx`, `lib/*`). Potrzebujesz innego zachowania? Zrób lokalny komponent w katalogu swojej podstrony.
6. **Bez nowych zależności.** Nie ruszasz `package.json` ani nie uruchamiasz `npm install` bez zgody właściciela.
7. **Assety** w `public/<twoja-podstrona>/`, nie w katalogach innych.
8. **Dokumentacja.** W trakcie pracy NIE edytujesz `CLAUDE.md`, `progress.md`, `project_context.md`, `README.md`, `PRODUCT.md` ani tego pliku (poza wierszem statusu swojego chatu w tabeli „Przydział” - narzędziem Edit). Każdy chat prowadzi własny plik `docs/podstrony/<podstrona>.md` (szablon niżej). Nowa zasada marki od właściciela = wpis w notatkach z dopiskiem „do PRODUCT.md”.
9. **Git.** Nie robisz commitów. **Nigdy** nie uruchamiasz `git checkout`, `git restore`, `git stash`, `git reset` ani `git clean` - w jednym drzewie roboczym pracuje 5 chatów i taka komenda skasowałaby cudze zmiany. Do odczytu: `git show`, `git log`, `git diff -- <twoje pliki>`.
10. **Serwer deweloperski jest jeden:** http://localhost:3000 (działa). Nie uruchamiasz drugiego, nie zabijasz procesów `node`, nie kasujesz `.next`. Serwer nie odpowiada (`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/`)? Uruchom `npm run dev` w tle tylko wtedy, gdy port 3000 jest wolny, i zapisz to w notatkach. Wszystkie podstrony poza `/` zwracają 404 = uszkodzony cache Turbopacka: naprawa (stop, usunięcie `.next/dev`, start) tylko za zgodą właściciela.
11. **Miejsce na dysku jest na styk** (2026-09-29: 12 GB wolne, 96% zajęte; pełny dysk 2026-09-28 zepsuł cache serwera). Zrzuty headless: jeden profil Chrome na sesję w scratchpadzie, losowy port debugowania, po testach usuwasz profil i zrzuty.
12. **Bez `npm run build` i bez wdrożeń** - build dzieli katalog `.next` z serwerem deweloperskim, a wdrożenie wypuściłoby niedokończone podstrony innych chatów. Build i wdrożenie robi koordynator na polecenie właściciela.
13. **Sprawdzanie kodu tylko na swoich plikach:** `npx eslint <twoje pliki i katalogi>`. Błędy `tsc` w cudzych plikach ignoruj (ktoś może być w połowie zmiany). Twoje pliki mają być czyste.
14. **Zmiany plików:** skryptami (node, sed) zmieniasz tylko własne pliki. Plik wspólny (`lib/i18n/services.ts`, `app/data/services.ts`, `app/data/projects.ts`, `lib/i18n/projects.ts`) wyłącznie narzędziem Edit, bo wykrywa zmiany od ostatniego odczytu. Turbopack potrafi nie zauważyć CSS zapisanego skryptem - po takim zapisie „dotknij” plik narzędziem Edit.

## Standard jakości

Właściciel ocenia każdą podstronę na tle strony głównej (hero, Realizacje, „Dlaczego Avenly”, Proces, Oferta) - poziom „totalnie high-endowy i luksusowy”. Zanim zaczniesz: przeczytaj `PRODUCT.md` (zasady marki, copy, „Co obiecujemy w ofercie”, anti-references), w `CLAUDE.md` rozdziały o sekcjach strony głównej, obejrzyj stronę główną i swoją podstronę na http://localhost:3000.

- **Własny pomysł wizualny** (chaty 1, 2, 5): bez „odgrzewanego kotleta” - bez planety, konstelacji, warstwic, szklanej wstęgi, desek z rysunkami, mgławicy i stosu kart ze strony głównej. Wspólny zostaje język: czerń, ostre linie, jeden akcent, Inter, etykieta sekcji. Każda strona ma „duszę”: jeden żywy motyw wyrastający z jej treści i małą historię zrozumiałą bez tłumaczenia (PRODUCT.md, Design Principles 12). Animacja ma się tłumaczyć sama (zasada 6).
- **Copy:** głos korzyści („Ty / dostajesz / zyskujesz”; na `/o-nas` „my”), chwyt, potem konkret, sentence case, zero myślników em / en, bez rozstrzelonych wersalików i monospace w etykietach, „i” zamiast „&”, jedyne CTA „Bezpłatna konsultacja”, liczby tylko obronne (98/100 PageSpeed, odpowiedź w 24 h), bez oceny „5,0 na Google” i gwiazdek, bez obietnic bez pokrycia (WordPress / CMS, integracja z kurierami).
- **Ruch:** płynnie (ease-out, od 0,6 s wzwyż), nic nie „wskakuje”. Bez efektów najechania na kartach z treścią - reagować mogą przyciski, linki, zakładki.
- **Te same efekty na telefonie,** dopasowane do ekranu, nigdy z uciętą treścią. Wersja dla ograniczonego ruchu (`prefers-reduced-motion`) i działający układ bez JavaScriptu.
- **Wydajność:** ciężkie efekty dopiero przy zbliżeniu do ekranu, pauza poza nim; WebGL tylko według zasad z `CLAUDE.md` (DPR, 30 fps, pauza, sprzątanie kontekstu). Bez ciężkich bibliotek.
- **Dostępność:** kontrast AA (tekst drugoplanowy `#94a3b8` lub jaśniejszy), `aria-label` na przyciskach z samą ikoną, cele dotyku ≥ 44 px, widoczny fokus.

## Jak pracować z właścicielem

- Właściciel lubi **wybierać z kilku propozycji**: 3-5 naprawdę różnych wariantów z przełącznikiem widocznym tylko w `npm run dev` - `createChoice('avenly-<podstrona>-layout', WARIANTY, 'domyślny')` z `components/utils/proposals.tsx` (klucz localStorage unikalny, z nazwą podstrony). Po wyborze usuń pozostałe warianty, ich style i przełącznik. Wyjątki: blog (odtworzenie, przełącznik tylko do potwierdzenia wersji) i kontakt (1-2 warianty dopracowania).
- **Przełączniki zawsze POZA stroną, na dole ekranu** (zasada właściciela 2026-09-30: „toggle wyjmij ze strony i daj na dole ekranu poza stroną do wyboru, i zawsze tak rób z togglami”): wszystkie przełączniki propozycji w jednym stałym, zwijanym panelu przyklejonym do dołu okna (portal do `<body>`, `position: fixed`), tylko w `npm run dev` - nigdy w treści strony (nad nagłówkiem, pod siatką itd.). Na telefonie panel zostawia wolny prawy dolny róg (bąbel czatu). Wzór: `app/(pl)/realizacje/_rl/dock.tsx` + `.rl-dock` w `realizacje.css` (każdy chat robi własną kopię z własnym prefiksem - `components/utils/*` się nie zmienia).
- Pokazuj efekt na zrzutach: komputer 1440 × 900, telefon 390 × 844, plus wersja dla ograniczonego ruchu i wersja EN.
- Odpowiadaj po polsku, konkretnie, bez żargonu. Decyzje właściciela zapisuj w notatkach z cytatem i datą.

## Szablon notatek: `docs/podstrony/<podstrona>.md`

```markdown
# <Podstrona> - notatki chatu <nr> (praca równoległa, etap 2)

## Stan
- Czeka na wybór / wybrane: ...

## Decyzje właściciela (cytaty + data)
- ...

## Pliki
- ...

## Pułapki i ważne szczegóły
- ...

## Propozycje dla zamrożonych części (nie wprowadzone)
- ...

## Do dokumentacji głównej
- do CLAUDE.md: ...
- do PRODUCT.md (nowe zasady marki): ...

## Weryfikacja
- zrzuty (1440, 390, reduced motion, EN) / eslint / ...
```

## Wiadomości startowe (do wklejenia w nowym chacie)

Każdy chat startuje w katalogu `avenly-web`.

**Chat 1 - O nas:**
> Jesteś chatem 1 z pliku PRACA-ROWNOLEGLA.md (etap 2 - podstrony). Przeczytaj go w całości i trzymaj się zasad. Twoja podstrona to O nas (`/o-nas` i `/en/about-us`). Zmodernizuj ją tak, żeby dawała ten sam luksusowy, high-endowy feeling co strona główna, ale własnym pomysłem wizualnym, bez kopiowania elementów strony głównej. Daj mi 3-5 propozycji z przełącznikiem.

**Chat 2 - Usługi:**
> Jesteś chatem 2 z pliku PRACA-ROWNOLEGLA.md (etap 2 - podstrony). Przeczytaj go w całości i trzymaj się zasad. Twoja podstrona to katalog usług i strony kategorii (`/uslugi`, `/uslugi/strony-www`, `/uslugi/design` i ich wersje EN). Zmodernizuj je tak, żeby dawały ten sam luksusowy, high-endowy feeling co strona główna, ale własnym pomysłem wizualnym, bez kopiowania elementów strony głównej. Pilnuj zasad „Co obiecujemy w ofercie” z PRODUCT.md. Daj mi 3-5 propozycji z przełącznikiem.

**Chat 3 - Blog:**
> Jesteś chatem 3 z pliku PRACA-ROWNOLEGLA.md (etap 2 - podstrony). Przeczytaj go w całości i trzymaj się zasad. Twoja podstrona to blog (`/blog` i `/blog/[slug]`, tylko PL). Przywróć wersję pierwotną sprzed jakiegokolwiek redesignu - odtworzenie 1:1 ze starego commita, nie nowy projekt. Najpierw pokaż mi wersję ze stycznia i dla porównania z czerwca na przełączniku, żebym potwierdził właściwą.

**Chat 4 - Kontakt:**
> Jesteś chatem 4 z pliku PRACA-ROWNOLEGLA.md (etap 2 - podstrony). Przeczytaj go w całości i trzymaj się zasad. Twoja podstrona to kontakt (`/kontakt` i `/en/contact`). Dostosuj istniejący układ do aktualnego designu strony (restyling, nie nowy koncept), formularz ma działać dokładnie jak dziś. Pokaż mi 1-2 warianty dopracowania.

**Chat 5 - Realizacje:**
> Jesteś chatem 5 z pliku PRACA-ROWNOLEGLA.md (etap 2 - podstrony). Przeczytaj go w całości i trzymaj się zasad. Twoja podstrona to realizacje (`/realizacje`, case studies `/realizacje/[slug]` i wersje EN `/en/work`). Zmodernizuj je tak, żeby dawały ten sam luksusowy, high-endowy feeling co strona główna, ale własnym pomysłem wizualnym, bez kopiowania sekcji Realizacje ze strony głównej. Daj mi 3-5 propozycji z przełącznikiem.

## Konsolidacja (chat 0, po zakończeniu pracy wszystkich chatów)

1. Przeczytać `docs/podstrony/*.md` i przenieść decyzje, pliki i pułapki do `CLAUDE.md`, `progress.md`, `project_context.md` i `README.md`, nowe zasady marki do `PRODUCT.md`; zaktualizować `docs/blog-style-guide.md` i `/new-post` po odtworzeniu bloga.
2. Przegląd całości: każda podstrona PL i EN na komputerze, tablecie i telefonie, ograniczony ruch, przejścia do stopki, linki między podstronami i do 7 podstron usług, formularz kontaktu (wysyłka testowa za zgodą właściciela).
3. `tsc` i ESLint całego projektu, `npm run build`, Lighthouse / PageSpeed.
4. Wdrożenie tylko za akceptacją właściciela (`npm run deploy`).
5. Do decyzji właściciela: commit do git (praca od czerwca jest niezacommitowana), etap 3 (7 podstron usług) albo zakończenie pracy równoległej.
