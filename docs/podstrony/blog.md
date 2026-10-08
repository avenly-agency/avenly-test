# Blog - notatki chatu 3 (praca równoległa, etap 2)

## Stan
- **ZAMKNIĘTE (2026-09-29).** Lista `/blog` i wpis `/blog/[slug]` zaakceptowane przez właściciela („jest git, zamykam ten etap” - lista; „zajebiście, zostawmy tak” - wpis). Bez przełączników i propozycji w kodzie.
- **Lista `/blog`:** wersja z czerwca 2026 zmodernizowana do języka strony głównej w układzie **„Wierna”**, dopracowana na telefon i tablet.
- **Wpis `/blog/[slug]`:** układ **„Okładka” + „Nagłówek na liniach”** - na liniach bloga duże zdjęcie, na nie nachodzi karta z wyśrodkowanym nagłówkiem, treść na środku, na końcu „Czytaj dalej”.
- Zaktualizowane przeze mnie (dotyczą tylko bloga, nie są na liście zamrożonych): `docs/blog-style-guide.md` i `.claude/commands/new-post.md` (wygląd cytatu-CTA, zajawka, kategorie, kadrowanie zdjęć, `.bl-body` zamiast `prose`).
- Do przeniesienia przez koordynatora: `CLAUDE.md` (gotowy tekst niżej, „Do dokumentacji głównej”) i dwa komentarze w zamrożonych plikach.
- 2026-09-29: wspólny serwer deweloperski przestał odpowiadać (port 3000 wolny) - uruchomiłem `npm run dev` w tle zgodnie z zasadą 10. Turbopack sam skasował swój cache („previously detected an internal error”), podstrony odpowiadają.

## Decyzje właściciela (cytaty + data, wszystkie 2026-09-29)
- Plan koordynatora: „przywrócić wersję pierwotną sprzed jakiegokolwiek redesignu” - pokazałem styczeń (`9a9577d`) i czerwiec (`dc008c2`) na przełączniku.
- „czerwiec 2026 wybieram i z tego trzeba modernizować do aktualnego designu strony który robiliśmy, przekmiń i daj kilka opcji” - trzy propozycje w strukturze czerwca: Przy krawędzi / Wierna / Okładka (+ oryginał do porównania).
- „wierna” - wybrana dla listy (i wtedy wpisu w tym samym stylu).
- „git, dostosuj do urządzeń mobilnych, podoba mi się” - dopracowanie telefonu i tabletu.
- „jest git, zamykam ten etap” (lista), potem „teraz podstronę wpisu bloga zmodernizuj” - trzy propozycje wpisu: Nagłówek na liniach / Spis treści / Okładka.
- „połącz okładkę z nagłówek na liniach” - obecny wpis; „Spis treści” odrzucony.
- „zajebiście zostawmy tak, zaktualizuj pliki .md” - koniec pracy nad blogiem.
- Wcześniej odrzucony (przez powrót do starej wersji): wrześniowy redesign z 2026-09-28 (karty jak na stronie głównej, bez filtrów, wyszukiwarki, karty wyróżnionej i tła z liniami). Usunięty; był niezacommitowany, więc nie ma go w git.

## Co jest na stronie
- **Lista `/blog` („Wierna” = kompozycja czerwca 1:1 w nowym języku):** wyśrodkowany nagłówek: etykieta „Gwiazda” „Blog”, h1 „Wiedza, która napędza Twój rozwój.” (akcent w kolorze marki `.im-accent`, bez gradientu; „Twój&nbsp;rozwój” nierozdzielne), podtytuł z czerwca. Tło: linie z czerwcowego shadera (to samo pole falowe) jako ostre linie ~1 px w kolorze marki, co czwarta grubsza, bez fioletu i poświaty, wolniejszy ruch, wygaszone za tekstem (maska eliptyczna) i przed paskiem kategorii. Pasek: pigułki kategorii (aktywna biała) liczone z wpisów, sortowanie „Najnowsze / Najstarsze”, wyszukiwarka (styl pól z kontaktu). Najnowszy wpis: karta pół na pół (zdjęcie w ramce, „Najnowszy wpis” z gwiazdką, kategoria · data · czas, tytuł, zajawka, autor, biały przycisk „Czytaj artykuł”). Pozostałe: siatka 1 / 2 / 3 kolumny, karty w czerni luksusowej (kategoria · data, tytuł, zajawka, „Czytaj wpis →” + czas). Brak wyników: karta z „Wyczyść filtry”. Liczba wyników ogłaszana czytnikom (`aria-live`).
- **Wpis `/blog/[slug]` („Okładka” + „Nagłówek na liniach”):** na liniach bloga (`BlogBackdrop`, maska na całą szerokość - widoczne nad zdjęciem i obok niego) „Wróć do listy wpisów” na środku, duże zdjęcie w ramce (4:3 telefon, 21:9 od 768 px), na nie nachodzi karta w czerni luksusowej (−40 / −56 / −128 px) z wyśrodkowanym nagłówkiem: etykieta z kategoriami z liniami i gwiazdkami po obu stronach (na telefonie tylko gwiazdki), tytuł, zajawka, autor · data · czas. Treść ~46rem na środku (listy z kreską marki, numery w kolorze marki, linki `--brand-hi`), cytat na końcu = karta z niebieską krawędzią po lewej, `<strong>` = tytuł, link = biały przycisk „Bezpłatna konsultacja”. „Czytaj dalej”: etykieta „Blog”, h2, „Wszystkie wpisy →” przy prawej krawędzi, do 3 pozostałych wpisów od najnowszego (dwa wpisy = 2 kolumny).
- **Poprawione względem czerwca:** bez rozmytych kul i siatki kropek (i tak były niewidoczne - `-z-10` pod własnym tłem), bez gradientowego tekstu i pigułek z wersalikami („BLOG AVENLY”, „WYRÓŻNIONE”), bez `backdrop-blur` na plakietkach, bez unoszenia / poświaty / powiększania zdjęcia kart po najechaniu, kategorie z danych (w czerwcu 5 pustych przycisków i brak „Performance” / „Strategia”), kategorie po polsku („AI i automatyzacja”, „Wydajność”), „Twój” wielką literą, bez podwójnego `<main>`, bez framer-motion (karty widoczne także bez JS), daty po polsku, bez martwych klas `prose-*`.

## Telefon i tablet
- Meta (kategoria · data · czas; na wpisie autor · data · czas): kropki rysuje `.bl-mi > *::before`, lista przesunięta w lewo o szerokość kropki i przycięta przez rodzica - przy zawijaniu nie ma kropki na końcu ani początku linii. Na wyśrodkowanej meta wpisu trik nie działa - tam pierwsza pozycja bez kropki, a < 400 px czas czytania w osobnej linii.
- Nagłówek listy na telefonie: „Wiedza, która / napędza / Twój rozwój.”; podtytuł 16 px < 480 px.
- Pasek listy: pigułki i narzędzia obok siebie dopiero od 1280 px (na 1024 wyszukiwarka spychała „Wydajność” do drugiego rzędu); < 1024 pigułki przewijane palcem od krawędzi do krawędzi ekranu; < 360 px sortowanie jako sama ikona (nazwa w `aria-label`).
- Karta wyróżniona: tytuł 24-28 px < 480 px; 640-1023 px zdjęcie 2:1.
- Wpis < 480 px: tytuł 28-34 px, zajawka 17 px, tekst 17 px, śródtytuły 24 / 19 px, cytat-CTA z przyciskiem na całą szerokość, karta nagłówka na pełną szerokość (−40 px na zdjęciu).
- Tło z liniami: bez shadera przy Save-Data i ≤ 2 GB RAM (czysta czerń).
- Sprawdzone: 320, 375, 390, 430, 768, 1024, 1280, 1440 - bez poziomego przewijania, cele dotyku ≥ 44 px, ograniczony ruch.

## Pliki
- `app/(pl)/blog/page.tsx` - metadane + `<BlogIndex posts={blogPosts.map(toCard)} />`.
- `app/(pl)/blog/[slug]/page.tsx` - `generateStaticParams`, metadane (canonical, OG, Twitter), JSON-LD (BlogPosting + BreadcrumbList), wpis `<article className="bl bl-post">` z `BlogBackdrop`, „Czytaj dalej”; importuje `components/blog/blog.css`.
- `components/blog/BlogIndex.tsx` - lista (client: filtr, sortowanie, wyszukiwarka, karta wyróżniona); importuje `blog.css`.
- `components/blog/cards.tsx` - `Meta` (kropki `.bl-mi`) i `PostCard` (karta w siatce, `level` h2 / h3) - wspólne dla listy i „Czytaj dalej”.
- `components/blog/BlogBackdrop.tsx` - shader linii (WebGL, `OES_standard_derivatives`, 30 fps, pauza IO / ukryta karta, reduced = 1 klatka, start po idle, DPR 1,5 / dotyk 1,25, bez shadera przy Save-Data / ≤ 2 GB RAM, płótno tworzone przy montażu + `loseContext` w sprzątaniu, bez WebGL = czerń).
- `components/blog/data.ts` - `toCard` (kategorie i daty przez `categoryLabel` / `formatDate` z `components/sections/blog-teaser/data.ts` - tylko import), `postsLabel` (1 wpis / 2 wpisy / 5 wpisów).
- `components/blog/blog.css` - wszystkie style bloga, prefiks `.bl-` (lista, karty, wpis `.bl-post*`, treść `.bl-body`, „Czytaj dalej” `.bl-more*`).
- Usunięte: `BlogList.tsx`, `BlogHero.tsx`, `BlogHeroBackground.tsx` (czerwiec), `BlogGrid.tsx`, `ReadingProgress.tsx` (wrzesień), wszystkie pliki tymczasowe propozycji (przełączniki, oryginały, spis treści).
- Nie ruszone: `components/sections/blog-teaser/*` (sekcja Blog na stronie głównej, zamrożona) - `/blog` tylko importuje stamtąd `categoryLabel` i `formatDate`.

## Pułapki i ważne szczegóły
- Cytat-CTA we wpisie zaczyna się od `<strong>…</strong><br>` - `.bl-body blockquote strong + br { display: none }` (strong jest blokiem). Nowe wpisy z `/new-post` muszą trzymać ten wzorzec (zapisane w przewodniku i komendzie).
- Kategorie w filtrze powstają z `posts.ts` (najczęstsze pierwsze) - nowa kategoria we wpisie = nowa pigułka sama.
- Linie w tle listy gasną przed paskiem (maska `--bl-my`); przy zmianie wysokości nagłówka poprawić maskę / wysokość `.bl-bg` (600 / 640 px). Wpis nadpisuje `--bl-mx` (linie na całą szerokość - środek zasłania zdjęcie).
- Etykieta `SectionLabel align="start"` we wpisie jest „odkrywana” do wersji wyśrodkowanej regułami w `blog.css` (linie i druga gwiazdka) - na telefonie linie znowu ukryte, bo z nimi etykieta była szersza niż 320 px.
- Dev overlay Next.js pokazuje błędy kompilacji innych chatów na każdej stronie - przy zrzutach usuwać `nextjs-portal`.

## Propozycje dla zamrożonych części (nie wprowadzone)
- `app/globals.css` ~linia 270: komentarz „Style treści wpisów bloga: components/blog/blog.css (.ba-body, redesign 2026-09-28) - dawne .blog-content usunięte.” → „Style bloga: components/blog/blog.css (.bl-*, treść wpisu .bl-body)”.
- `components/sections/blog-teaser/cards.tsx` (~linia 17: „Używana też na stronach bloga (components/blog/BlogGrid.tsx)”) i `blog-teaser/data.ts` („`toBtPost` / `byNewest` używa też /blog”) - nieaktualne; `/blog` bierze z `data.ts` tylko `categoryLabel` i `formatDate`.

## Do dokumentacji głównej
> **✅ Przeniesione przez koordynatora 2026-10-07:** opis bloga w `CLAUDE.md` („Konwencje → Komponenty” i nowy rozdział „Blog”), wiersz „Linie bloga” w tabeli shaderów, poprawki w rozdziale „Sekcja Blog - PANORAMA”, drzewo tras. Zostają dwa nieaktualne komentarze w zamrożonych plikach (sekcja „Propozycje dla zamrożonych części” wyżej) - zadanie „porządki”.

- **do CLAUDE.md, „Konwencje → Komponenty”, punkt o blogu** - zastąpić cały opis „Blog (redesign 2026-09-28 …)” tekstem:
  > Komponenty bloga: `components/blog/` (+ `components/projects/`). **Blog (2026-09-29, wersja z czerwca 2026 zmodernizowana do języka strony; właściciel wrócił do niej po odrzuceniu redesignu z 2026-09-28)**: `/blog` = układ „Wierna” - wyśrodkowany nagłówek (etykieta „Blog”, h1 „Wiedza, która napędza Twój rozwój.” z `.im-accent`) na liniach bloga (`BlogBackdrop.tsx`), pigułki kategorii liczone z wpisów + sortowanie + wyszukiwarka, najnowszy wpis jako karta pół na pół z białym „Czytaj artykuł”, reszta w siatce 1 / 2 / 3 (`BlogIndex.tsx`, karty `cards.tsx`). `/blog/[slug]` = „Okładka + Nagłówek na liniach” - na liniach duże zdjęcie (4:3 / 21:9), na nie nachodzi karta z wyśrodkowanym nagłówkiem (kategorie, tytuł, zajawka, autor · data · czas), treść ~46rem na środku (`.bl-body`: listy z kreską marki, cytat-CTA = karta z niebieską krawędzią i białym „Bezpłatna konsultacja”), na końcu „Czytaj dalej” (te same karty). Style: `components/blog/blog.css` (prefiks `bl-`); kategorie i daty z `categoryLabel` / `formatDate` (`components/sections/blog-teaser/data.ts`). Dawne `BlogHero`, `BlogHeroBackground`, `BlogList`, `BlogGrid`, `ReadingProgress`, `.blog-content`, `.ba-*` USUNIĘTE; nie przywracać. Notatki: `docs/podstrony/blog.md`.
- **do CLAUDE.md, „Sekcja Blog - PANORAMA”, „Pliki”:** skreślić, że `toBtPost` / `byNewest` / `BlogCards` używa `/blog` i że `blog-teaser.css` jest importowany na `/blog` (dziś tylko `categoryLabel` / `formatDate`).
- **do CLAUDE.md, tabela shaderów, nowy wiersz:** „Linie bloga (2026-09-29) | `components/blog/BlogBackdrop.tsx` | pole falowe z czerwcowego shadera, linie o stałej grubości z `fwidth` (co czwarta grubsza), kolor marki, maska CSS (lista: wygaszone za tekstem, wpis: na całą szerokość) | wszystkie urządzenia (bez Save-Data / ≤ 2 GB RAM) + start po idle + IO pause + visibility; reduced = 1 klatka | 30 fps | 1,5 (dotyk 1,25)”.
- **do CLAUDE.md, „Blog content workflow”:** zdanie „Style postów (1:1 z istniejącymi 3)” bez zmian; ewentualnie dopisać, że zajawka pokazuje się pod tytułem wpisu, a zdjęcie jest kadrowane 21:9 / 4:3 (szczegóły już w przewodniku).
- **`docs/blog-style-guide.md` i `.claude/commands/new-post.md`:** ZROBIONE przeze mnie 2026-09-29 (koordynator nie musi).
- **do PRODUCT.md:** nic nowego.

## Weryfikacja
- ESLint `app/(pl)/blog` + `components/blog`: czysto. Trasy `/blog/`, wpisy i `/` odpowiadają 200.
- Zrzuty headless 2026-09-29 (wersje końcowe): lista 320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440, wpis 320 / 390 / 768 / 1024 / 1440 i 390 przy ograniczonym ruchu; sekcja Blog na stronie głównej bez zmian. Konsola bez błędów i ostrzeżeń hydratacji (tylko ostrzeżenia Next o obrazie LCP i framer-motion o ograniczonym ruchu).
- EN: blog tylko PL - nic do sprawdzenia.
