# Praca równoległa - etap 1: strona główna (6 chatów) - ARCHIWUM

> **Archiwum (od 2026-09-29).** Etap 1 zakończony: wszystkie sekcje strony głównej zamknięte i wdrożone, notatki scalone z dokumentacją główną. Aktualny plan (etap 2 - podstrony) jest w [PRACA-ROWNOLEGLA.md](../PRACA-ROWNOLEGLA.md). Ścieżki względne poniżej (np. `docs/sekcje/*.md`) liczone są od katalogu głównego repo.

> Obowiązuje od 2026-09-27, do czasu konsolidacji (koniec tego pliku).
> **Stan 2026-09-29: wszystkie 6 sekcji zakończone i wdrożone na avenly.pl, dokumentacja główna scalona** (szczegóły w „Konsolidacji” na końcu). Zasady niżej obowiązują, dopóki właściciel nie zdecyduje o zakończeniu pracy równoległej (wtedy ten plik staje się archiwalny, a ostrzeżenie w `CLAUDE.md` znika).
> Czytają: właściciel oraz każdy chat Claude, który pracuje przy tym repo.
> Jeśli jesteś chatem i dostałeś zadanie z tego pliku, przeczytaj go w całości, zanim cokolwiek zmienisz.

## Po co to jest

Właściciel chce szybciej unowocześnić stronę główną, więc równolegle działa 6 chatów. Każdy chat modernizuje **jedną sekcję** i dotyka **tylko swoich plików**. Wspólnych plików (style globalne, dokumentacja, układ strony głównej) nikt w tym czasie nie edytuje, poza chatem 0, który koordynuje całość i na końcu wszystko scala.

## Przydział

Kolejność sekcji na stronie głównej (stan 2026-09-27): Hero → pasek TechStack → Realizacje → Dlaczego Avenly → **Proces** → **Opinie** → **Oferta** → **Blog** → stopka. Sekcje „Asystent AI” i końcowe CTA „Gotowy na cyfrową dominację?” zostały usunięte.

| Chat | Sekcja | Kotwica / miejsce | Prefiks klas CSS | Status |
|---|---|---|---|---|
| **0 (koordynator)** | **Proces** („Jak to działa?”) | `#proces` | `pr-`, `pw-` | ✅ **zakończone** (2026-09-27): szklana wstęga w kolorach kroków + tło Głębia, dopasowane do telefonu. Notatki: `docs/sekcje/proces.md`. Chat 0 zostaje koordynatorem |
| 1 | Opinie („Co mówią o nas partnerzy biznesowi?”) | `#opinie` | `op-` | ✅ **zakończone** (2026-09-27): układ „Redakcja”, dopasowany do telefonu. Notatki: `docs/sekcje/opinie.md` |
| 2 | Asystent AI (sekcja z pokazem rozmowy z asystentem) | bez kotwicy | `aic-` | ✅ **zakończone: sekcja USUNIĘTA ze strony** (2026-09-27, decyzja właściciela). Notatki: `docs/sekcje/asystent-ai.md` |
| 3 | Oferta (usługi: taby na komputerze, akordeon na telefonie) | `#oferta` (wrapper) i `#uslugi` (sekcja) | `of-` | ✅ **zakończone** (2026-09-27): układ „Plan” (rysunki techniczne, które rysują się i ożywają scenkami), indeks „Karty”, zegar „Obwódka”, tło „Bez tła”, dopasowana do każdego urządzenia (telefon: zbliżenia kamery, swipe z obrazem za palcem). 2026-09-28 na polecenie właściciela: nowe copy usług, bez WordPressa / CMS i bez obietnicy integracji z kurierami (także `/uslugi`, podstrona sklepu i metadane - wyjątek od zamrożenia, narzędziem Edit), UI/UX i audyt jako dodatki, AI w CRM jako opcja, przycisk „Cała oferta” w kolorze usługi; dokumentacja główna i PRODUCT.md zaktualizowane. Notatki: `docs/sekcje/oferta.md` |
| 4 | Blog (zapowiedź 3 najnowszych wpisów, tylko wersja PL) | bez kotwicy | `bt-` | ✅ **zakończone** (2026-09-29): układ „Panorama” (przewijanie = jazda kamery w bok wzdłuż okładek, nagłówek w scenie, wszystko przy krawędziach wrappera; karty „Karty” zostają dla `/blog` i ograniczonego ruchu), pozostałe propozycje i przełącznik usunięte. Notatki: `docs/sekcje/blog.md` |
| 5 | Stopka (na każdej podstronie). Końcowa sekcja CTA „Gotowy na cyfrową dominację?” **usunięta 2026-09-27** (decyzja właściciela) | stopka | `ft-` | ✅ **zakończone** (2026-09-28): układ „Kropka” z zakończeniem „Nad i” (tytuł „Postaw kropkę nad i”, kropka marki spada na „i”), wyraźniejsze nagłówki kolumn, bez oceny Google. Notatki: `docs/sekcje/stopka.md` |

### Kolejność dalszych prac

1. ~~**Oferta** (chat 3)~~ - ✅ zakończona 2026-09-27 (wybory właściciela, propozycje i przełączniki usunięte, dokumentacja główna zaktualizowana).
2. ~~**Stopka** (chat 5)~~ - ✅ zakończona 2026-09-28 (Kropka „Nad i”).
3. ~~**Blog** (chat 4)~~ - ✅ zakończony 2026-09-29 (Panorama).
4. **Konsolidacja** - ✅ dokumentacja główna scalona 2026-09-29 (chat 4 na polecenie właściciela), wdrożenia 2026-09-28 (`881f01e6`) i 2026-09-29 (`e49199f5`) za zgodą właściciela. Zostało: Lighthouse / PageSpeed po wdrożeniu, ESLint całego projektu, commit do git (do decyzji właściciela), decyzja o zakończeniu pracy równoległej. Szczegóły na końcu pliku.

Propozycja na później (do decyzji właściciela, jeszcze nieprzydzielona): po stronie głównej te same zasady dla podstron, w kolejności ruchu - katalog usług `/uslugi`, podstrony usług, `/realizacje`, `/o-nas`, `/kontakt`, `/blog`.

### Pliki każdego chatu (tylko te wolno zmieniać)

**Chat 0 - Proces (zakończone):** `components/sections/Process.tsx`, `components/sections/process/*` (`ribbon.tsx`, `backdrop.tsx`, `silk.ts`, `process.css`), `lib/i18n/home/process.ts`. Plus koordynacja i końcowa aktualizacja dokumentacji.

**Chat 1 - Opinie (zakończone):** `components/sections/Testimonials.tsx`, nowy katalog `components/sections/testimonials/` (np. `testimonials.css`, podkomponenty), `lib/i18n/home/testimonials.ts`.
- Sekcja wstawia dane strukturalne (`<JsonLd id="ld-testimonials">`: Review ×2). Od 2026-09-28 BEZ AggregateRating i bez oceny „5,0” na stronie (decyzja właściciela: słaby social proof) - nie przywracać.
- Opinie są prawdziwe (Google). Nie wymyślaj nowych, nie zmieniaj ich treści ani autorów, bez fejkowych awatarów (PRODUCT.md).

**Chat 2 - Asystent AI:** `components/sections/AiConsultant.tsx`, nowy katalog `components/sections/ai-consultant/`, `lib/i18n/home/ai-consultant.ts`.
- **2026-09-27: sekcja usunięta** na polecenie właściciela („nie pasuje do reszty, jest trochę zbędna”). Powyższe pliki już nie istnieją. Wyjątek od zasad 2 i 3 (z polecenia właściciela, narzędziem Edit, tylko linie tej sekcji): w `components/home/HomeClient.tsx` usunięty import i blok sekcji, w `lib/i18n/home/index.ts` pole `aiConsultant`. Dokumentacja główna (CLAUDE.md, project_context.md, progress.md, PRODUCT.md) już zaktualizowana. Szczegóły: `docs/sekcje/asystent-ai.md`.
- Przycisk otwierający czat działa przez zdarzenie `window.dispatchEvent(new Event("avenly:open-chat"))`. Zostaw ten mechanizm. Samego czatu (`components/chatbot/`) nie ruszaj.
- Link do podstrony chatbotów: `localizeHref('/uslugi/automatyzacje-ai/chatboty-ai', locale)`.

**Chat 3 - Oferta:** `components/sections/Services.tsx`, nowy katalog `components/sections/services/`.
- Słownik `lib/i18n/services.ts` i dane `app/data/services.ts` są **współdzielone** z katalogiem usług `/uslugi` (`ServicesHub`) i podstronami. Wolno dopisywać nowe pola (także typy), ale nie zmieniaj ani nie usuwaj istniejących, bo zepsujesz `/uslugi`. Po zmianie sprawdź, czy `/uslugi/` nadal działa.
- Kotwice `#oferta` (wrapper w `HomeClient`) i `#uslugi` (sama sekcja) muszą zostać. Linkują do nich stopka i przycisk „Sprawdź ofertę” w „Dlaczego Avenly”.
- Nazwy kategorii `ai` / `marketing` mapuje `CATEGORY_HREF` / `cardHref` w `Services.tsx`, bo te kategorie nie mają własnych stron. Zachowaj to mapowanie.

**Chat 4 - Blog (zakończone):** `components/sections/BlogTeaser.tsx`, katalog `components/sections/blog-teaser/` (`pan.tsx`, `shared.tsx`, `cards.tsx`, `data.ts`, `blog-teaser.css`), `lib/i18n/home/blog-teaser.ts`.
- Wpisy pochodzą z `app/data/posts.ts`. To źródło stron `/blog`, więc tylko czytaj: nie zmieniaj treści ani pól.
- Sekcja jest tylko w wersji PL (`HomeClient` nie pokazuje jej na `/en/`).
- `cards.tsx`, `data.ts` i `blog-teaser.css` są współdzielone z `/blog` i `/blog/[slug]` (karty wpisów, „Czytaj dalej”) - po zmianie sprawdź też te strony.

**Chat 5 - Stopka (zakończone):** `components/layout/Footer.tsx`, katalog `components/layout/footer/` (`dot.tsx`, `shared.tsx`), `components/layout/footer.css`, `lib/i18n/footer.ts`. (Sekcja CTA `CallToAction.tsx` / `lib/i18n/home/cta.ts` usunięta 2026-09-27 przez chat 0 na polecenie właściciela - tych plików już nie ma. Strona główna kończy się Blogiem, na `/en/` Ofertą, potem stopka: to stopka zamyka stronę, więc warto, żeby miała spokojny, końcowy akcent z „Bezpłatną konsultacją” - do propozycji.)
- Link „Kontakt” w stopce prowadzi już na `/kontakt` (przez `localizeHref`), nie na kotwicę `#kontakt` - zostaw tak.
- **Stopka jest na każdej podstronie i w wersji EN.** Sprawdzaj więc także `/uslugi/`, `/kontakt/`, `/en/`, a nie tylko stronę główną.
- W stopce muszą zostać: link „Ustawienia cookies” (zdarzenie `OPEN_SETTINGS_EVENT` z `lib/cookie-consent.ts`), dane firmy z `lib/seo-data.ts` (nie wpisuj ich na sztywno), link do polityki prywatności (zawsze `/polityka-prywatnosci`), kotwica `#uslugi`.
- Style stopki umieść w `components/layout/footer.css`, importowanym w `Footer.tsx`.

### Zamrożone: tych rzeczy nie ruszamy

Hero, pasek pod hero (TechStack), Realizacje, „Dlaczego Avenly” (Impact), **Proces, Opinie i Oferta (zakończone 2026-09-27), Stopka (2026-09-28), Blog (2026-09-29)**, nawigacja (Navbar), okno czatu, baner cookies, etykieta sekcji `components/ui/SectionLabel.tsx` (styl „Gwiazda” wybrany przez właściciela) i wszystkie podstrony (`/uslugi/*`, `/o-nas`, `/kontakt`, `/realizacje`, `/blog`). Jeśli uważasz, że któraś z nich wymaga zmiany, zapisz to w swoim pliku notatek jako propozycję. Sam jej nie wprowadzaj.

## Zasady, dzięki którym chaty sobie nie przeszkadzają

1. **`app/globals.css` - nie edytujesz.** Style swojej sekcji trzymasz we własnym pliku CSS obok komponentu (np. `components/sections/testimonials/testimonials.css`) i importujesz go w komponencie sekcji: `import './testimonials/testimonials.css';`. Wzorzec działa i jest sprawdzony: `Process.tsx` importuje `process/process.css`, `Testimonials.tsx` - `testimonials/testimonials.css`. Wszystkie klasy zaczynaj od swojego prefiksu z tabeli. Istniejące klasy i zmienne z `globals.css` (np. `.im-title`, `.im-lead`, `.im-label`, tokeny `@theme`) wolno używać, ale nie wolno ich zmieniać.
2. **`components/home/HomeClient.tsx` - nie edytujesz.** Kolejność sekcji, leniwe ładowanie i kotwice zostają. Twoja sekcja dostaje te same propsy co dziś (`t`, `locale`). Jeśli naprawdę musisz coś tam zmienić, zapisz to w notatkach i poproś właściciela, żeby przekazał to chatowi 0.
3. **Słowniki:** rozszerzasz tylko swój plik w `lib/i18n/...` i zawsze uzupełniasz obie wersje, PL i EN (EN według PRODUCT.md: głos korzyści, sentence case, bez myślników). Nie edytujesz `lib/i18n/home/index.ts`. Jeśli dopisujesz pola, dopisz je w tym samym pliku, w typie słownika.
4. **Wspólne komponenty tylko używasz:** `components/ui/*`, `components/Reveal.tsx`, `components/utils/proposals.tsx`, `components/seo/*`, `lib/*`. Potrzebujesz innego zachowania? Zrób lokalny komponent w katalogu swojej sekcji.
5. **Bez nowych zależności.** Nie ruszasz `package.json` ani nie uruchamiasz `npm install` bez zgody właściciela.
6. **Assety** trzymasz w `public/<twoja-sekcja>/`, nie w katalogach innych sekcji.
7. **Dokumentacja.** W trakcie pracy NIE edytujesz `CLAUDE.md`, `progress.md`, `project_context.md`, `README.md` ani `PRODUCT.md`. Każdy chat prowadzi własny plik `docs/sekcje/<sekcja>.md` (szablon niżej). Na końcu chat 0 scala te pliki do dokumentacji głównej. Gdy właściciel poda nową zasadę marki, zapisz ją w swoim pliku z dopiskiem „do PRODUCT.md”.
8. **Git.** Nie robisz commitów. **Nigdy** nie uruchamiasz `git checkout`, `git restore`, `git stash`, `git reset` ani `git clean`: w jednym drzewie roboczym jest praca 6 chatów i taka komenda skasowałaby cudze zmiany. Do podglądu używaj `git diff -- <twoje pliki>`.
9. **Serwer deweloperski jest jeden:** http://localhost:3000 (od 2026-09-29 działa instancja uruchomiona przez chat 4 po resecie cache - patrz niżej). Nie uruchamiasz drugiego, nie zabijasz procesów `node`, nie kasujesz `.next`. Jeśli serwer nie odpowiada (`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/`), uruchom `npm run dev` w tle tylko wtedy, gdy port 3000 jest wolny, i zapisz to w notatkach.
   - **Uszkodzony cache Turbopacka** (2026-09-29, po zapełnieniu dysku 2026-09-28): wszystkie podstrony poza `/` zwracały 404, a `.next/dev/types/routes.d.ts` był ucięty. Zwykły restart nie pomaga. Naprawa TYLKO za zgodą właściciela: zatrzymać serwer, usunąć `.next/dev`, uruchomić `npm run dev` ponownie.
   - **Miejsce na dysku:** każdy zrzut headless z osobnym profilem Chrome zostawia w `%TEMP%` ~50 MB - po testach usuwaj swoje profile (to one zapełniły dysk 2026-09-28).
10. **Bez `npm run build` i bez wdrożeń** w trakcie pracy równoległej. Build dzieli katalog `.next` z serwerem deweloperskim, a wdrożenie wypuściłoby niedokończone sekcje innych chatów. Build i wdrożenie tylko na wyraźne polecenie właściciela (tak było 2026-09-28 i 2026-09-29), przy zatrzymanym serwerze deweloperskim albo po konsolidacji.
11. **Sprawdzanie kodu tylko na swoich plikach:** `npx eslint components/sections/<Twoja>.tsx components/sections/<twoj-katalog>`. Błędy `tsc` w cudzych plikach ignoruj, bo ktoś może być w połowie zmiany. Twoje pliki mają być czyste.
12. **Zmiany plików.** Skryptami (node, sed) zmieniasz tylko własne pliki. Gdyby wyjątkowo trzeba było zmienić plik, który może być współdzielony, używaj wyłącznie narzędzia Edit, bo wykrywa zmiany od ostatniego odczytu.
13. **Zrzuty ekranu headless** robisz we własnym katalogu tymczasowym (scratchpad swojej sesji), z losowym portem debugowania Chrome i osobnym profilem.
14. **Przejścia między sekcjami.** Każda sekcja zaczyna się i kończy na tle `#050505`, więc sąsiedzi łączą się bez widocznej granicy. Nie dodawaj jasnych elementów przy górnej ani dolnej krawędzi sekcji.

## Standard jakości: „feeling” jak w „Dlaczego Avenly”

Właściciel ocenia każdą sekcję na tle hero, Realizacji i „Dlaczego Avenly”. Te trzy są „totalnie high-endowe i luksusowe”. Nowa sekcja ma dawać to samo odczucie, ale **nie przez kopiowanie ich elementów**. Zanim zaczniesz, przeczytaj `PRODUCT.md` (zasady marki i copy) oraz w `CLAUDE.md` rozdziały o „Dlaczego Avenly”, etykietach sekcji i hero. Potem obejrzyj stronę na http://localhost:3000.

Decyzje właściciela, które obowiązują wszystkie sekcje:

- **Głęboka, neutralna czerń** („czerń luksusowa”) zamiast szaro-granatowych, matowych powierzchni. Ostre linie i obwódki, jeden kolor marki (`--brand` `#3b82f6` = kropka logo, od 2026-09-28), dużo powietrza.
- **Bez „matowego efektu”:** żadnego `backdrop-filter: blur`, mgiełek, rozmytych poświat ani cieni za tekstem. Tekst zawsze stoi na czystym tle.
- **Własny pomysł wizualny w każdej sekcji.** Bez „odgrzewanego kotleta”, czyli bez planety z hero, konstelacji, warstwic, czteroramiennych gwiazdek (poza samą etykietą sekcji) i przyklejanego stosu kart z „Dlaczego Avenly”. Wspólny zostaje tylko język: czerń, ostre linie, akcent, font Inter, etykieta sekcji.
- **Etykieta sekcji** to zawsze `<SectionLabel>` (gwiazdki + cienkie linie). Nagłówki: `.im-title` i `.im-accent` (kolor marki `--brand`, od 2026-09-28 zamiast pastelowego `#adcbfd`; bez tekstu z gradientem), podtytuł `.im-lead`. Treść sekcji przy krawędziach wrappera (kontenera), nie w wyśrodkowanej kolumnie (2026-09-29).
- **Copy:** głos korzyści („Ty / dostajesz / zyskujesz”), sentence case, zero myślników em/en, bez rozstrzelonych wersalików i monospace w etykietach, „i” zamiast „&”, jedyne CTA na stronie to „Bezpłatna konsultacja”. Liczby tylko obronne: 98/100 PageSpeed, odpowiedź w 24 h. Bez oceny „5,0 na Google” i gwiazdek (usunięte 2026-09-28 - słaby social proof). Żadnych wymyślonych metryk.
- **Ruch:** płynne przejścia (ease-out, od 0,6 s wzwyż), nic nie „wskakuje”. Bez efektów najechania na kartach z treścią. Przycisk, link albo zakładka mogą reagować na kursor.
- **Te same efekty na telefonie,** dopasowane do ekranu, nigdy z uciętą treścią. Wersja dla ograniczonego ruchu (`prefers-reduced-motion`) i działający układ bez JavaScriptu.
- **Wydajność:** sekcje są leniwie ładowane, ciężkie efekty uruchamiasz dopiero przy zbliżeniu do ekranu i pauzujesz poza nim. WebGL tylko zgodnie z zasadami z `CLAUDE.md` (DPR, 30 fps, pauza). Bez ciężkich bibliotek.
- **Dostępność:** kontrast AA (tekst drugoplanowy `#94a3b8` lub jaśniejszy), prawidłowa hierarchia nagłówków (sekcja = h2, elementy = h3), `aria-label` na przyciskach z samą ikoną, cele dotyku co najmniej 44 px.

## Jak pracować z właścicielem

- Właściciel lubi **wybierać z kilku propozycji**. Zrób 3-5 naprawdę różnych wariantów z przełącznikiem widocznym tylko w `npm run dev`: `createChoice('avenly-<sekcja>-layout', WARIANTY, 'domyślny')` z `components/utils/proposals.tsx` (wzorzec: `Services.tsx` w trakcie prac chatu 3; przebieg rund propozycji Procesu i Opinii w `docs/sekcje/proces.md` i `docs/sekcje/opinie.md`). Klucz localStorage musi być unikalny i zawierać nazwę sekcji. Po wyborze właściciela usuń pozostałe warianty, ich style i przełącznik.
- Pokazuj efekt na zrzutach: komputer 1440 × 900 i telefon 390 × 844, plus wersję dla ograniczonego ruchu.
- Odpowiadaj po polsku, konkretnie, bez żargonu.

## Szablon notatek sekcji: `docs/sekcje/<sekcja>.md`

```markdown
# <Sekcja> - notatki chatu <nr> (praca równoległa)

## Stan
- Czeka na wybór / wybrane: ...

## Decyzje właściciela (cytaty + data)
- ...

## Pliki
- ...

## Pułapki i ważne szczegóły
- ...

## Do dokumentacji głównej
- do CLAUDE.md: ...
- do PRODUCT.md (nowe zasady marki): ...

## Weryfikacja
- zrzuty / eslint / telefon / reduced motion: ...
```

## Gotowe wiadomości startowe (do wklejenia w nowym chacie)

Każdy nowy chat startuje w tym samym katalogu `avenly-web`.

**Chat 1:** (zakończone 2026-09-27 - nie uruchamiać ponownie)
> Jesteś chatem 1 z pliku PRACA-ROWNOLEGLA.md. Przeczytaj go w całości i trzymaj się zasad. Twoja sekcja to Opinie (Testimonials). Zmodernizuj ją tak, żeby dawała ten sam luksusowy, high-endowy feeling co „Dlaczego Avenly”, ale własnym pomysłem wizualnym, bez kopiowania elementów innych sekcji. Daj mi 3-5 propozycji z przełącznikiem.

**Chat 2:** (nieaktualne - sekcja usunięta 2026-09-27, nie uruchamiać)
> Jesteś chatem 2 z pliku PRACA-ROWNOLEGLA.md. Przeczytaj go w całości i trzymaj się zasad. Twoja sekcja to Asystent AI (AiConsultant). Zmodernizuj ją tak, żeby dawała ten sam luksusowy, high-endowy feeling co „Dlaczego Avenly”, ale własnym pomysłem wizualnym, bez kopiowania elementów innych sekcji. Daj mi 3-5 propozycji z przełącznikiem.

**Chat 3:** (zakończone 2026-09-27 - nie uruchamiać ponownie)
> Jesteś chatem 3 z pliku PRACA-ROWNOLEGLA.md. Przeczytaj go w całości i trzymaj się zasad. Twoja sekcja to Oferta (Services). Zmodernizuj ją tak, żeby dawała ten sam luksusowy, high-endowy feeling co „Dlaczego Avenly”, ale własnym pomysłem wizualnym, bez kopiowania elementów innych sekcji. Daj mi 3-5 propozycji z przełącznikiem.

**Chat 4:** (zakończone 2026-09-29 - nie uruchamiać ponownie)
> Jesteś chatem 4 z pliku PRACA-ROWNOLEGLA.md. Przeczytaj go w całości i trzymaj się zasad. Twoja sekcja to Blog (BlogTeaser). Zmodernizuj ją tak, żeby dawała ten sam luksusowy, high-endowy feeling co „Dlaczego Avenly”, ale własnym pomysłem wizualnym, bez kopiowania elementów innych sekcji. Daj mi 3-5 propozycji z przełącznikiem.

**Chat 5:** (zakończone 2026-09-28 - nie uruchamiać ponownie)
> Jesteś chatem 5 z pliku PRACA-ROWNOLEGLA.md. Przeczytaj go w całości i trzymaj się zasad. Twój element to stopka (Footer) - końcowa sekcja CTA została usunięta, więc stopka zamyka stronę. Zmodernizuj ją tak, żeby dawała ten sam luksusowy, high-endowy feeling co „Dlaczego Avenly”, ale własnym pomysłem wizualnym, bez kopiowania elementów innych sekcji. Pamiętaj, że stopka jest na każdej podstronie i w wersji EN. Daj mi 3-5 propozycji z przełącznikiem.

## Konsolidacja (chat 0, po zakończeniu pracy wszystkich chatów)

1. ✅ (2026-09-29) Przeczytać `docs/sekcje/*.md` i przenieść decyzje, pliki i pułapki do `CLAUDE.md`, `progress.md`, `project_context.md` i `README.md`, a nowe zasady marki do `PRODUCT.md`. Notatki sekcji zostają jako historia rund (sekcja „Do dokumentacji głównej” w każdej ma dopisek „przeniesione”).
2. Częściowo: każda sekcja sprawdzona osobno (zrzuty komputer / tablet / telefon, ograniczony ruch, EN), po wdrożeniu 2026-09-29 wszystkie strony PL / EN odpowiadają 200, 404 z własną stroną. Do zrobienia: jeden przegląd całej strony z góry na dół (przejścia między sekcjami, kotwice `#proces`, `#opinie`, `#oferta`, `#uslugi`; `#kontakt` już nie istnieje - linki kontaktu prowadzą na `/kontakt`).
3. Częściowo: `tsc` całego projektu czysto, `npm run build` przechodzi (2026-09-29). Do zrobienia: `eslint` całego projektu i Lighthouse / PageSpeed.
4. ✅ Wdrożenia za akceptacją właściciela: 2026-09-28 (`881f01e6`) i 2026-09-29 (`e49199f5`).
5. Do decyzji właściciela: zakończyć pracę równoległą (plik archiwalny, zdjąć ostrzeżenie z `CLAUDE.md`) albo zostawić go na kolejny etap (podstrony - „Propozycja na później” wyżej). Praca nadal niezacommitowana w git.
