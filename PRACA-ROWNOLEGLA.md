# Praca równoległa - etap 3: copywriting podstron i przebudowa podstron usług

> Obowiązuje od 2026-10-01 do konsolidacji (koniec tego pliku).
> Archiwum: etap 1 - strona główna: [docs/praca-rownolegla-etap-1.md](./docs/praca-rownolegla-etap-1.md) · etap 2 - podstrony: [docs/praca-rownolegla-etap-2.md](./docs/praca-rownolegla-etap-2.md).
> Czytają: właściciel oraz każdy chat Claude, który pracuje przy tym repo.

## Start: jedno zdanie wystarczy

**Właściciel** otwiera nowy chat w katalogu `avenly-web` i pisze tylko, czym chat ma się zająć, np.:

> zajmij się one-page i zacznij pracę

> zajmij się copywritingiem i zacznij pracę

Nic więcej nie trzeba wklejać. Zadania i ich hasła są w tabeli „Przydział” niżej.

**Chat, który dostał taką wiadomość, robi po kolei:**

1. **Znajduje swoje zadanie** w tabeli „Przydział” po haśle albo nazwie z wiadomości właściciela. Numer chatu bierze z tabeli. Pasują dwa zadania albo żadne - pyta jednym zdaniem, o które chodzi. Właściciel wymienił kilka zadań - robi je po kolei, w podanej kolejności.
2. **Sprawdza status zadania:**
   - ⏳ do startu - bierze je;
   - 🔧 w toku albo 🔎 czeka na wybór - pracował nad nim inny chat: czyta jego notatki z `docs/podstrony/` i kontynuuje od miejsca, w którym tamten skończył (nie zaczyna od zera);
   - ⛔ zablokowane - mówi właścicielowi, co je blokuje, i nie zaczyna, dopóki właściciel wprost nie potwierdzi, że mimo to ma ruszać;
   - ✅ zamknięte - mówi o tym i pyta, co dokładnie poprawić.
3. **Czyta:** ten plik w całości, `PRODUCT.md` w całości, lekturę wskazaną w sekcji swojego zadania.
4. **Wpisuje status** w swoim wierszu tabeli „Przydział”: `🔧 w toku od <data>` (narzędziem Edit, tylko swój wiersz).
5. **Sprawdza serwer** deweloperski Avenly na http://localhost:3001 jednym `curl` (zasada 10). Przeglądarki nie uruchamia - sekcja „Bez weryfikacji w trakcie pracy” niżej.
6. **Wykonuje „Pierwsze kroki”** z sekcji swojego zadania i pokazuje właścicielowi pierwszy wynik. Nie dopytuje o rzeczy, które są opisane w tym pliku - pyta tylko o decyzje oznaczone jako „do właściciela”.
7. **Prowadzi notatki** w `docs/podstrony/` (plik podany w sekcji zadania, szablon na końcu) i po każdej rundzie aktualizuje status w tabeli.

## Bez weryfikacji w trakcie pracy (zasada właściciela 2026-10-04)

Właściciel: „żeby nie używali narzędzi do weryfikacji typu odpalanie w tle przeglądarki za każdym razem, bo zbyt laguje - dopiero przy końcu, jak dam znać”. Kilka chatów puszczających naraz przeglądarkę w tle zamula komputer, na którym właściciel sam ogląda stronę. **Ta zasada jest ważniejsza niż każde „sprawdź”, „obejrzyj” i „zrób zrzuty” w dalszej części tego pliku i w notatkach chatów.** Dotyczy wszystkich chatów, także tych, które już pracują.

**W trakcie pracy NIE uruchamiasz:**
- przeglądarki w tle (headless Chrome, CDP, Puppeteer, Playwright), zrzutów ekranu, nagrywania klatek, testów e2e, Lighthouse;
- `tsc`, ESLint ani `npm run build` po każdej zmianie albo „dla pewności”;
- pętli, które czekają na serwer albo raz po raz odpytują stronę.

**Zamiast tego:**
- piszesz kod starannie i oddajesz zmianę od razu;
- właściciel ogląda wynik sam, w swojej przeglądarce, na http://localhost:3001 - podajesz adres, co się zmieniło, gdzie patrzeć i który przełącznik w panelu wybrać;
- piszesz wprost, że nic nie było sprawdzane, i wymieniasz, czego nie jesteś pewien (telefon, EN, ograniczony ruch);
- obecną wersję podstrony poznajesz z kodu i słownika, nie ze zrzutów;
- wolno: jedno `curl` ze statusem strony (czy serwer żyje i strona się kompiluje), czytanie kodu, `git diff` swoich plików.

**Weryfikacja dopiero na sygnał właściciela** („sprawdź”, „weryfikuj”, „zrób zrzuty”, „domykamy”). Wtedy jedna pełna runda: zrzuty 1440 × 900 i 390 × 844, telefon, ograniczony ruch, EN, bez JS, `tsc` i ESLint na swoich plikach - a po niej usunięcie profilu Chrome i zrzutów. Sygnał dotyczy tego chatu i tej jednej rundy, nie jest zgodą na sprawdzanie po każdej kolejnej zmianie. Właściciel zgłasza błąd, którego nie umiesz znaleźć w kodzie? Zapytaj, czy możesz odpalić przeglądarkę, zamiast robić to sam.

## Gdzie jesteśmy

| Etap | Zakres | Stan |
|---|---|---|
| 1 | strona główna (6 sekcji) | ✅ zamknięty i wdrożony 2026-09-29 |
| 2 | podstrony: Usługi (katalog i kategorie), Blog, Kontakt, Realizacje | ✅ zamknięte 2026-09-29 / 2026-10-01 (notatki `docs/podstrony/*.md`) |
| 2 | podstrona O nas | 🔎 czeka na wybór właściciela |
| **3** | **copywriting 3 podstron (Usługi, Realizacje, Kontakt) + przebudowa podstron usług** | 🔧 w toku - copywriting ✅ (2026-10-01), **one-page (pilot) ✅ zamknięta 2026-10-02**, fala 2 w pracy: strona firmowa, Strona interaktywna, sklep, system CRM i chatboty AI - każda czeka na wybory albo ocenę właściciela (stan 2026-10-07) |

### Stan na 2026-10-07 (przegląd koordynatora)

**Zrobione:**
- strona główna (etap 1) oraz podstrony Usługi (katalog), Blog, Kontakt, Realizacje (etap 2) - opisy w `CLAUDE.md` (rozdziały „Blog”, „Katalog usług”, „Podstrona Realizacje”, „Strona Kontakt”);
- copywriting Usług, Realizacji i Kontaktu (chat 6, 2026-10-01);
- one-page i wspólny szkielet podstron usług `_usluga/` (chat 7, 2026-10-02);
- „Projekt UI/UX” usunięty jako osobna usługa (2026-10-01) - podstron `/uslugi/design*` nie ma, zadanie chatu 12 odpadło;
- przekrojowa optymalizacja wydajności i tła bez interakcji z kursorem (2026-10-05 / 06, sekcja „Wydajność podstron usług” niżej);
- usługa „Strona szyta na miarę” nazywa się **„Strona interaktywna”** (2026-10-06; adres bez zmian);
- dokumentacja główna zaktualizowana 2026-10-07 (`CLAUDE.md`, `PRODUCT.md`, `progress.md`, `project_context.md`, `README.md`, `INSTRUKCJA-SEO.md`).

**W toku - każda pozycja czeka na ruch właściciela:**

| Zadanie | Na co czeka |
|---|---|
| Strona firmowa (chat 8) | wybór wersji kart podstron (Stół / Siatka / Harmonijka / Taśma), ocena telefonu (runda 8), termin realizacji, zdania „do decyzji” |
| Strona interaktywna (chat 9) | ocena rund 5-6 i poprawek z 2026-10-06 (wejście „Wschód”, gwiazda nici, płynność tła); wybory: krajobraz horyzontu, scena „Technologii”, „Detal”, „Zakres”; termin realizacji; teksty „do decyzji” |
| Sklep (chat 10) | wybór tekstu hero (pięć wersji), ocena telefonu z rund 7-10, wybór sceny zakupu (Witryna / Dwa ekrany / Taśma), termin, teksty „do decyzji” |
| System CRM (chat 11) | obejrzenie podstrony (wszystkie wersje wybrane, bez przełączników) i sygnał do weryfikacji; osiem pytań z notatek (m.in. moduł „Portal klienta”, nagłówek, mniejszy tytuł na telefonie) |
| Chatboty AI (chat 13) | ocena rundy 6 (hero bez odbicia, karta skrzynki), wybór wersji Wiedzy (Ściana / Konkrety), pytania o obietnice ze starego tekstu i o termin |
| O nas (chat 1) | wybór wejścia (Kropka / Planeta / Linia) i układu (Korekta / List / Bez pośredników / Manifest) - czeka od 2026-09-29 |
| Opisy kafli katalogu (chat 6) | ocena opisów Chatbotów AI i Audytu; firmowa / interaktywna / sklep / CRM zostają przy chwycie z Oferty |

**Do zrobienia:**
- **porządki (chat 0)** - lista w sekcji „Chat 0”: jeden moduł mgławicy, sprzątanie starych wersji i martwego kodu, błąd przycisku w stopce na `/kontakt/`, propozycje do szkieletu;
- **decyzje właściciela:** przycisk „Darmowa Wycena” w nawigacji, puste `/uslugi/marketing*`, terminy realizacji (firmowa, interaktywna), wartość opcji „Strona Szyta na Miarę” w formularzu (temat maila), zmiana adresu Strony interaktywnej (po pracy równoległej, z 301), commit do git;
- **na koniec, na sygnał właściciela:** weryfikacja wszystkich podstron (zrzuty, telefon, ograniczony ruch, EN, bez JS), `tsc` / ESLint / build, Lighthouse, wdrożenie.

**Wdrożenia etapu 3** (wszystkie na polecenie właściciela; każde = cały bieżący stan repozytorium, podstrony w pracy w wariantach domyślnych przełączników, bez panelu propozycji; build ze sprawdzaniem typów; produkcja sprawdzana tylko `curl`-em - nic nie było oglądane w przeglądarce; szczegóły: `progress.md`, „Stan wdrożenia”):

| Data | Wdrożenie | Co doszło |
|---|---|---|
| 2026-10-05 | `bc047217` | cały stan etapu 3: zamknięte podstrony etapu 2, nowe teksty, bez UI/UX, one-page, podstrony w pracy |
| 2026-10-05 | `74b14420` | optymalizacja podstron usług, tło podstron usług bez interakcji z kursorem |
| 2026-10-05 | `fad591c2` | tło `/uslugi` i `/realizacje` bez interakcji z kursorem |
| 2026-10-05 | `f2f29804` | strona główna: optymalizacja hero (planeta w dwóch przebiegach) i sekcji Realizacje |
| 2026-10-06 | `90723428` | CRM: „zbudowany” zamiast „szyty”, bez linii dowodów, optymalizacja sekcji modułów (chat 11) |
| 2026-10-06 | `9afa4557` | nowa nazwa usługi „Strona interaktywna” w całym serwisie (chat 9) |
| 2026-10-06 | `292f5691` | chatboty: bez mignięcia hero na wejściu (`sv-wait` w szkielecie), akcent Wiedzy „Nie zmyśla.” (chat 13) |
| 2026-10-06 | `1a4a7f4a` | Strona interaktywna: wejście „Wschód”, gwiazda na czole nici, przegląd wydajności (chat 9) |
| 2026-10-06 | `6bd06458` | mgławica podstron usług: blask liczony w każdej klatce - `liveGlow` (chat 9, pliki wspólne) |
| 2026-10-06 | `1f8381e3` | mgławica podstron usług: płynna odsłona przy wejściu (chat 9, pliki wspólne) |
| 2026-10-06 | `a6a206db` | mgławica podstron usług: gaz bez „poklatkowania” (dwie klatki kluczowe) |
| 2026-10-08 | **`9410dac7`** | case study realizacji przebudowane („Klasyczna” - wybór właściciela; SEO, telefon, dostępność), teksty RKS (modernizacja strony z WordPressa + aplikacja klubowa, także w sekcji Realizacje na stronie głównej), Strona interaktywna bez etykiety „Premium ⁄ 2026” w makiecie; jak zawsze cały bieżący stan repozytorium (podstrony w pracy w wariantach domyślnych) - **ostatnie wdrożenie** (chat spoza tabeli „Przydział”, na polecenie właściciela „wrzuć wszystko na avenly.pl”; notatki: `docs/podstrony/realizacje.md`) |

Produkcja = bieżący stan repozytorium (sprawdzone 2026-10-07: po buildzie z 2026-10-06 14:50 nie zmienił się żaden plik źródłowy; kolejność wdrożeń potwierdzona poleceniem `wrangler pages deployment list`). **Po zamknięciu podstron w pracy trzeba wdrożyć ponownie.** 2026-10-07 serwer deweloperski na :3001 nie działał (port wolny) - uruchamia go pierwszy chat, który go potrzebuje (zasada 10).

### Wydajność podstron usług (2026-10-05, zmiana przekrojowa na polecenie właściciela)

Właściciel: „usuń na każdej podstronie w usłudze hover na tle i dystorsję, bo laguje i zoptymalizuj te podstrony wszystkie”. Zmiany dotknęły plików wszystkich sześciu podstron i szkieletu - **chaty 7-13: zanim ruszysz swoje pliki, przeczytaj je od nowa** (komentarze „wydajność, 2026-10-05” w kodzie). Wygląd i ruch miały zostać bez zmian; **nic nie było oglądane w przeglądarce** (tylko `curl` = 200 na 6 podstronach i `/realizacje`); sprawdzanie typów przeszło przy buildzie do wdrożenia `74b14420` (2026-10-05), ESLint nie był puszczany - do weryfikacji końcowej.

- **Tło (szkielet `_usluga/sky.tsx`, wszystkie podstrony):** bez interakcji z kursorem, palcem i kliknięciami (bez czarnej dziury, smugi, fal) - nie przywracać. ~30 fps przy przewijaniu, ~20 fps w spoczynku, gaz co 2.-3. klatkę w 0,6× CSS, pomiar `data-sky` tylko po przewinięciu, pauza poza ekranem. `realizacje/_rl/nebula.ts` dostał opcje `still` / `gasEvery` / `gasBusy` (domyślne = dawne zachowanie, `/realizacje` bez zmian).
- **Tło podstron usług - trzy poprawki 2026-10-06 (pliki wspólne `_usluga/sky.tsx` i `realizacje/_rl/nebula.ts`, zmienione przez chat 9 na polecenie właściciela; chaty 7-13: przeczytajcie je od nowa):** (1) „efekty na nebuli lagują, np. to z podświetleniem, co się dzieje przy scrollu” → nowa opcja modułu `liveGlow` (domyślnie wyłączona - `/realizacje` i katalog bez zmian): blask wokół sceny `data-sky` i winietę liczy tania kompozycja w każdej klatce, drogi gaz jest przerysowywany rzadko; przy ruchu tło rysuje do 60 kl./s, jeśli sprzęt utrzymał tempo w czasie odsłony, inaczej ~30 (wdrożone `6bd06458`). (2) „pierwsze pojawianie się nebuli po wejściu nie jest płynne i szarpie” → także front odsłony liczy kompozycja (gaz nie jest już rysowany w każdej klatce odsłony), a zegar odsłony to suma kroków przyciętych do 34 ms (`1f8381e3`). (3) „pojawianie się jest w chuj płynne, ale potem, jak już jest shader, to jest poklatkowany” → gaz to dwie klatki kluczowe z płynnym przenikaniem (`gasMs` 140 ms), spoczynek ~30 kl./s zamiast ~20 (`a6a206db`). Wszystko sprawdzone tylko statycznie (nawiasy i uniformy wariantów shadera), niekompilowane w przeglądarce; przy błędzie budowania wariantu moduł sam wraca do zwykłego. Czeka na ocenę płynności przez właściciela.
- **Szkielet - klasa `sv-wait` (2026-10-06, `_usluga/usluga.css`, dopisana przez chat 13 przy poprawce hero chatbotów):** treść, którą JS dopiero przestawia w scenę, bez stanu „przed wejściem” miga w układzie statycznym przed `data-live` - `sv-wait` chowa ją do `data-live` (bezpiecznik 6 s, `<noscript>` pokazuje od razu).
- **Wskazówka z wejścia „Wschód” (Strona interaktywna, 2026-10-06):** element `.sv-late` z maską albo wieloma warstwami, który czeka na `data-on` z samym kryciem 0, jest składany w każdej klatce odsłony mgławicy - daj mu `visibility: hidden` pod `.sv[data-live]:not([data-on])`.
- **Katalog `/uslugi` i kategorie (`_katalog/sky.tsx`, `_katalog/nebula.ts`) - wdrożone `fad591c2`:** to samo co tło podstron usług - bez interakcji z kursorem (właściciel: „z podstrony /uslugi też usuń ten efekt”), blask i kolor mgławicy idą za kartą najbliżej środka okna (już nie za kartą pod kursorem), te same progi klatek i opcje `still` / `gasEvery` / `gasBusy` w kopii modułu mgławicy. Zamknięta podstrona zmieniona na wyraźne polecenie właściciela; nieoglądane w przeglądarce.
- **Realizacje - lista i case studies (`realizacje/_rl/sky.tsx`, `_rl/versions.tsx`) - wdrożone `fad591c2`:** to samo - tło bez interakcji z kursorem i palcem (właściciel: „z realizacji też usuń”), blask i kolor idą za kadrem najbliżej środka okna, etykieta „Wszystkie realizacje” bierze kolor z tego samego kadru (bez pierwszeństwa karty pod kursorem; po kliknięciu filtra przelicza się raz). Paralaksa kadrów w nagłówku Realizacji za kursorem (`_rl/hero.tsx`) zostaje - to scena, nie tło (zapis raz na klatkę i tylko przy nagłówku na ekranie). Zamknięta podstrona zmieniona na wyraźne polecenie właściciela; nieoglądane w przeglądarce.
- **Strona główna - hero i Realizacje (zamrożone, zmienione na polecenie właściciela: „zoptymalizuj pierwszą sekcję strony głównej oraz drugą, bo lagują”) - wdrożone `f2f29804`:** tempo rysowania liczone z czasu, nie z numeru klatki (na monitorach 120 / 144 Hz planeta, niebo i mgławica szły 2× szybciej, niż zakładano), i zależne od tego, czy coś się dzieje. `hero/scene.ts` + `hero/sky.ts` (`busy`): niebo do ~60 kl./s i planeta ~30 przy aktywności (wejście, ruch myszy, podświetlony węzeł, spadająca gwiazda), w spoczynku ~30 i ~20. `realizacje/scene.ts`: mgławica ~30 kl./s przy przejściu kadrów / zmianie barw / odsłonie / ruchu kursora, ~20 w spoczynku. Potem („zoptymalizuj hero na stronie głównej całe, żeby nie lagowało”): `hero/planet.ts` przepisany na dwa przebiegi (trzy fbm w połowie rozdzielczości do tekstury, światło i krawędź w pełnej - ten sam obraz za ok. 1/3 kosztu), scena hero stoi, gdy widać mniej niż 30% sekcji, szklany przycisk „Zobacz realizacje” bez `backdrop-filter` (`globals.css`, jedyna zmiana mogąca być widoczna - pod przyciskiem jest gładkie, ciemne wnętrze planety). Nieoglądane w przeglądarce i bez `tsc` - **nowy shader planety trzeba obejrzeć przed wdrożeniem** (błąd kompilacji = zostaje statyczny obraz planety). Potem („teraz drugą sekcję strony głównej realizacje”): `realizacje/scene.ts` + `nebula.ts` + `.rz-slab[data-off]` w `globals.css` - przed odsłoną sekcji mgławica rysuje jedną czarną klatkę zamiast liczyć gaz i kompozycję w pełnym tempie (dawniej szło to równolegle ze sceną hero), gaz w spoczynku co 3. wywołanie, znikający kadr („duch”) bez rozmycia tła pod sobą (zostaje barwa szkła), ukryte kadry bez `backdrop-filter`. Nieoglądane w przeglądarce i bez `tsc`. Niezrobione, bo zmienia wygląd (do decyzji właściciela): rozmycie tła w szklanej ramie WIDOCZNEGO kadru Realizacji (`backdrop-filter: blur(22px)` nad żywą mgławicą).
- **Karty stosu - `depth.tsx` (one-page, firmowa, sklep, na miarę):** shadery kompilują się w tle (`KHR_parallel_shader_compile`), bez zamrożenia przewijania przy dojeździe do kart. Nowe kopie `depth.tsx` rób z obecnej wersji.
- **Stos kart i zakres (`cases.tsx` / `cards.tsx`, `scope.tsx` - one-page, firmowa, sklep, na miarę):** sekcja daleko od ekranu nic nie liczy, listy elementów pobierane raz, odczyty układu przed zapisami; przyciemnienie przykrywanej karty (`::after`) na własnej warstwie.
- **Sklep:** pływanie ściany i przechył za kursorem na zmiennych, które nie dziedziczą (`--sk-wf`, `--sk-wg`, `--sk-mx`, `--sk-my` na `.sk-w-float`), zmienne kafli na `.sk-w-wall`, po odsłonie szkicu maska sklepu schodzi (`data-rv`).
- **Strona na miarę:** ekrany makiety w filmie, których nie widać, nie są rysowane (`data-v1..4` na `.sm-a`), „Nić” liczy igłę tylko przy zmianie postępu, niewidoczne rysunki „Deski” nie są składane (`data-off` / `data-clear`), kadr bez `will-change` po najeździe kamery.
- **CRM:** okno sceny głównej przed rozejściem nie jest rysowane (`data-veil`), skala kamery pisana wprost na `.cr1c-wincam`, widoki „Klucza” przed wejściem ukryte (`data-veil`).
- **Chatboty:** refleksy i kropki dymków stoją, gdy pierwszy ekran zjedzie z ekranu (`data-off`), zmienne kursora na liście dymków, `--p` sceny „22:00” na niebie, krycie rozmowy i skrzynki na kompozytorze.
- **2026-10-06, podstrony:** Strona interaktywna - plany pierwszego ekranu makiety jako osobne warstwy (pięć rysunków SVG grzbietów), własna warstwa nici, maska obłoków ekranu realizacji schodzi po wejściu, animacje sekcji dalekiej od ekranu stoją (`data-idle`); CRM - szew okna modułów „W dół” pisany jako `clip-path` wprost na dwóch elementach zamiast zmiennych CSS na przodkach okna (właściciel: „niemiłosiernie laguje”). Bez pomiaru i bez oglądania.
- **Zasada na dalszą pracę:** zmienną CSS, którą scena pisze co klatkę, ustawiaj na najbliższym elemencie, który ją czyta (albo rejestruj z `inherits: false` pod unikalną nazwą) - zapis na korzeniu sceny przelicza style wszystkich potomków. Callback `useFrame` zaczynaj od wyjścia, gdy sekcja jest daleko od ekranu.
- **Niezrobione (większa ingerencja, do decyzji przy weryfikacji):** przeniesienie zmiennych filmów firmowej / na miarę / sklepu z korzenia sceny na poszczególne kadry, `will-change` na czas przejazdów ekranów w scenie zakupu sklepu, „W dół” i „Tory” w CRM (zmienne na korzeniu okna), usunięcie niewybranych wariantów z paczki produkcyjnej.

**Po co etap 3.** Wygląd podstron jest już na poziomie strony głównej. Zostały dwie rzeczy:

1. **Teksty** na podstronach Usługi, Realizacje i Kontakt pisało kilka chatów przy okazji przebudowy wyglądu. Trzeba je przejść jednym piórem, żeby cała strona mówiła jednym głosem.
2. **7 podstron usług** (one-page, strona firmowa, strona szyta na miarę, sklep, system CRM, UI/UX, chatboty AI) wygląda jeszcze po staremu: tekst z gradientem, rozmyte szkło, wersaliki, obietnice bez pokrycia. Do przebudowy na poziom „totalny high-end”, zaczynając od one-page.

## Przydział

| Chat | Hasło właściciela | Zadanie | Trasy PL / EN | Prefiks CSS | Kiedy | Status |
|---|---|---|---|---|---|---|
| **6** | **copywriting** (copy, teksty podstron) | teksty podstron: Usługi (katalog i kategorie) → Realizacje → Kontakt | patrz „Chat 6” | bez nowych stylów | fala 1 | 🔎 w toku (wznowione 2026-10-01) - opisy kafli w katalogu usług, czeka na ocenę właściciela (Chatboty AI, Audyt). **Uwaga dla wszystkich chatów: „Projekt UI/UX” USUNIĘTY jako osobna usługa (decyzja właściciela 2026-10-01, wykonane - podstrony `/uslugi/design*` nie istnieją, zadanie chatu 12 odpada)**; szczegóły i lista dla koordynatora w `docs/podstrony/copy.md` |
| **7** | **one-page** | pilot przebudowy podstron usług + wspólny szkielet dla pozostałych | `/uslugi/strony-www/one-page` · `/en/services/websites/one-page` | `sv-` (szkielet), `one-` (strona; nie `op-` - to Opinie) | fala 1 | ✅ **zamknięte 2026-10-02** (właściciel: „super, podstrona dopięta”) - podstrona = film w trzech scenach (kadr z zaprojektowaną stroną klienta i kamerą, stos kart z rysunkami i scenkami, zakres z pokazem w kadrze), telefon i teksty PL / EN przyjęte, wzorzec dla fali 2 opisany w `docs/podstrony/usluga-one-page.md`. Termin „Start w 3-5 dni” potwierdzony przez właściciela, stary `OnePageClient.tsx` i `onePageDict` usunięte za jego zgodą (2026-10-02). Otwarte, nie blokuje: przegląd końcowy (prawdziwy telefon, bez JS, fokus klawiatury) |
| 8 | **strona firmowa** | przebudowa podstrony, poziom 2 | `/uslugi/strony-www/strona-firmowa` · `…/company-website` | `sf-` | fala 2 | 🔎 runda 8 czeka na wybór właściciela (2026-10-02; sekcja „3 podstrony…” = **karty podstron na całą sekcję**, sekcja nieprzypięta - jego prośby „bardziej whole section i żeby można było hoverować”, potem „chodziło mi o karty, nie o spis, daj kilka wersji”; cztery wersje w panelu: Stół / Siatka / Harmonijka / Taśma; komputer przyjęty: najechanie pokazuje kartę z bliska („na kompach elegancko działa już”); **telefon / tablet: dotknięcie otwiera podgląd** z przesuwaniem palcem między podstronami zamiast karty rosnącej w miejscu („na telefonie się chujowo używa, popraw UX”), Harmonijka = pas przesuwany palcem; tytuł filmu po najeździe kamery na telefonie większy i w dwóch liniach) - scena główna **„Piętra” przyjęta** („banger”; stos pięter w rzucie aksonometrycznym skręcony w spiralę, częściowo za ekranem, kamera zjeżdża piętro po piętrze jak winda - **chat 9: nie brać bliźniaczych „Warstw”**), makieta bez klikania (decyzja właściciela); **makieta strony klienta przemalowana na czerń, biel i szmaragd podstrony** (właściciel: „mniej pastelowe i pasujące do całej strony, żeby nikt nie pomyślał, że to jest ta strona, tylko makieta” - uwaga także dla chatów 9 i 10: przykładowa strona w kadrze ma czytać się jako makieta, nie jak osobna strona w obcych pastelach); wersje sekcji z rundy 2 (Wieża / Mapa / Konstelacja / Menu) są w kodzie poza przełącznikiem, do usunięcia po wyborze. Do właściciela: wybór wersji z kartami, termin realizacji (zaślepka „w ? dni”), zdania „do decyzji” z tabeli tekstów. Pracuje **jednocześnie z chatami 9 i 10** (sekcja „Chat 8”); notatki `docs/podstrony/usluga-strona-firmowa.md` |
| 9 | **strona szyta na miarę** (działa też: „strona interaktywna”) | przebudowa podstrony, poziom 3 - usługa od 2026-10-06 nazywa się **„Strona interaktywna”** (EN „Interactive website”) | `/uslugi/strony-www/strona-szyta-na-miare` · `…/custom-website` (adres bez zmian) | `sm-` | fala 2 | 🔧 **w toku - czeka na ocenę i wybory właściciela (stan 2026-10-06).** Oddane, nieoglądane w przeglądarce: runda 5 (scena 1 = **Horyzont** w czterech krajobrazach do wyboru: Grzbiety / Tafla / Orbita / Szczyt; scena 2 = **Nić** z kamerą za igłą; scena 3 = trzy nowe sceny: Deska / Światy / Kadry; sceny 4 i 5 bez decyzji: Kula / Litery / Próbki, Pokaz w kadrze / Oś / Plan), runda 6 (czwarty ekran makiety „Realizacje” - lot kamery w głąb kolumnady, film 600vh), 2026-10-06: wejście pierwszego ekranu „Wschód”, gwiazda na czole nici, przegląd wydajności podstrony. Przełączniki w panelu na dole ekranu: „1. Horyzont”, „3. Technologia”, „4. Detal”, „5. Zakres”. **Nazwa usługi zmieniona wszędzie** (Oferta, dane usług, konstelacja hero, stopka, etykieta w formularzu, opis kategorii) - adres, nazwy plików, prefiks i hasło zadania zostają; adres zmienimy po zakończeniu pracy równoległej, z 301. Zasady z tej podstrony: bez porównywania z innymi usługami (analogia „firmowa poziom wyżej / avenly.pl” to informacja dla nas, nie treść), bez oczywistości wspólnych dla wszystkich usług stron (kod od zera, szablony / wtyczki), makieta i film jako ujęcia z kamerą, przejścia ekranów „rozejściem” (bez linii światła i kurtyn), tło = sama mgławica szkieletu (**chat 8: scena „Piętra” wybrana na firmowej - tu nie brać bliźniaczych „Warstw”**). Zmiany we wspólnym tle podstron usług z 2026-10-06 (`_usluga/sky.tsx`, `realizacje/_rl/nebula.ts` - opcja `liveGlow`) opisane w sekcji „Wydajność podstron usług”; wdrożenia tego dnia - w tabeli w sekcji „Stan”. Do właściciela: wybory wersji, termin realizacji (na stronie tymczasowo „ustalamy z Tobą”), dwa nowe teksty kart i teksty „do decyzji”, dwa zdania grające słowami „na miarę”. Pracuje **jednocześnie z chatami 8 i 10** (sekcja „Chat 9”); notatki `docs/podstrony/usluga-strona-szyta-na-miare.md` (pełna historia, także wszystkich wdrożeń z 2026-10-06) |
| 10 | **sklep** | przebudowa podstrony, poziom 2-3 (sprzedaż) | `/uslugi/strony-www/sklep-internetowy` · `…/online-store` | `sk-` | fala 2 | 🔎 **runda 11 (2026-10-02, copywriting sekcja po sekcji): czeka na wybór tekstu hero** z pięciu wersji w panelu na dole ekranu; poprawki telefonu z rund 8-10 czekają na ocenę. Wcześniej (runda 7, 2026-10-02: **telefon i tablet** - przegląd całej podstrony na 390 / 360 / 320 px, tablecie i telefonie bokiem; runda 6 przyjęta: „zajebiste” - zakres w kolejności zakupu, ruch kafli szablonów przy przewijaniu). Wybrane: **„nie gubi klienta” = stos**, **„Nie szablon. Twoja marka.” = „Na tle szablonów”** (ściana szablonów w perspektywie, kamera wlatuje w sklep marki). **Makiety w kadrach ciemne, w palecie strony, bez pasteli, z etykietą „Przykładowy sklep”** (decyzja właściciela - może dotyczyć też innych podstron usług); jedna marka sklepu (ceramika), krój Instrument Serif tylko na tej podstronie; **płatność przez przekierowanie do Przelewy24 / Stripe** (dotyczy też Oferty na stronie głównej, szczegóły w notatkach); w scenach jedno zdanie narratora naraz. Otwarte: scena zakupu (Witryna / Dwa ekrany / Taśma - jedyny przełącznik w panelu na dole ekranu), termin realizacji, teksty „do decyzji”. Notatki: `docs/podstrony/usluga-sklep-internetowy.md`. Pracuje **jednocześnie z chatami 8 i 9** (sekcja „Chat 10”) |
| 11 | **CRM** | przebudowa podstrony - **inna usługa niż strony WWW: własny pomysł na całą podstronę** (sekcja „Chat 11”) | `/uslugi/strony-www/system-crm` · `…/crm-system` | `cr-` | fala 2 | 🔎 **wszystkie wersje wybrane, podstrona bez przełączników - czeka na obejrzenie i sygnał do weryfikacji (2026-10-05)**. Sześć sekcji: scena główna „Z punktów”, „Nic już nie ginie” = „Kanały”, „Każdy widzi to, co powinien” = „Klucz” (tylko role wewnątrz firmy), „Bębny” bez nagłówka, moduły „W dół”, „AI to opcja, nie obowiązek” = „Tory”; zakres usunięty. Decyzje właściciela z 2026-10-05, ważne także dla chatu 13 (chatboty) i koordynatora: (1) **bez lecących linii światła, kurtyn i zamiany szkieletu w interfejs** - rzeczy pojawiają się „rozejściem” (kilka mniejszych kłębów gazu od lewej do prawej; generator `scripts/crm-bloom.mjs`); (2) **w scenach bez przypięcia odsłona startuje przy wejściu elementu na ekran i gra sama do końca** - nie może być elementu widocznego w całości, a odsłoniętego w części; (3) **AI i widok / portal klienta tylko jako opcje, nazwane wprost** - zdanie typu „jeśli chcesz, AI zrobi…” właściciel czyta jak zapewnienie; (4) bez sekcji do klikania. Tego dnia także: przegląd tekstów, dostosowanie do telefonów i tabletów (rachunkiem z kodu), optymalizacja wydajności (usunięte niewybrane wersje - kopie w `docs/archiwum/usluga-system-crm/`, mniejsze arkusze, sceny poniżej pierwszego ekranu doładowywane po bezczynności). **Wdrożone na avenly.pl 2026-10-06 (`90723428`) na polecenie właściciela („wrzuć na avenly.pl”)** - poszedł cały bieżący stan repozytorium (także inne podstrony w pracy, w wariantach domyślnych przełączników); build przeszedł razem ze sprawdzaniem typów (odnotowane w tabeli wdrożeń w sekcji „Stan” i w `progress.md`). 2026-10-06: słowo „szyty” zastąpione przez „zbudowany” (właściciel: „frajersko brzmi”), linia dowodów pod przyciskiem usunięta, sekcja modułów zoptymalizowana (szew okna bez dziedziczonych zmiennych CSS w klatce przewijania). **NIC z rund 3-4 i poprawek z 2026-10-05 nie było oglądane w przeglądarce** (tylko `curl` PL / EN 200 i jeden `tsc` po sprzątaniu słownika). Propozycja do szkieletu: `usePin` liczy z `window.innerHeight` (drgnięcie scen przy chowaniu paska adresu na telefonie). 2026-10-05 port 3001 był wolny - serwer deweloperski uruchomiony ponownie przez chat 11 (zasada 10). Notatki: `docs/podstrony/usluga-system-crm.md` |
| 12 | **UI/UX** | przebudowa podstrony, poziom 1 (dodatek) | `/uslugi/design/ui-ux` · `/en/services/design/ui-ux` | `ux-` | - | ✖ odpada - „Projekt UI/UX” usunięty jako osobna usługa 2026-10-01, podstrony `/uslugi/design*` nie istnieją (patrz wiersz chatu 6) |
| 13 | **chatboty** | przebudowa podstrony - **inna usługa niż strony WWW: własny pomysł na całą podstronę** (sekcja „Chat 13”) | `/uslugi/automatyzacje-ai/chatboty-ai` · `/en/services/ai-automation/ai-chatbots` | `ch-` | fala 2 | 🔎 **runda 6 czeka na ocenę właściciela** (właściciel 2026-10-05: „usuń ten bounce pod koniec animacji tych pytań w hero, bardziej premium zrób tę animację”; karta „Rano w Twojej skrzynce”: „zrób bardziej pasujący do designu, bo trochę odstaje”; Wiedza: „nie czuję tej sekcji jakoś z tych propozycji aktualnych, wymyśl coś innego”) - **hero: dymki wsuwają się i stają (bez skoku skali, unoszenia i cofania kamery), refleks na krawędzi szkła; karta skrzynki = nowa wiadomość w materiale dymków; Wiedza: dwie nowe propozycje na cały ekran - Ściana (wielkie pasy faktów firmy, zapalają się fakty z odpowiedzi) / Konkrety (konkret wielkim pismem, pytanie spoza wiedzy = pusty znak zapytania)**; sześć wcześniejszych wersji Wiedzy odrzuconych i zdjętych z panelu. Runda 6 nieoglądana (tylko `curl`). Wcześniej, runda 5 (właściciel po rundzie 4: „weź wiedzę, daj 3 inne propozycje tej sekcji, bardziej premium animacje; zrób w hero te pytania bardziej premium i feeling taki, bo teraz jest tak meh - rozmieszczenie, wielkość itp.”) - **hero: tekst w wąskiej kolumnie pośrodku, po bokach kaskady dużych szklanych dymków z obwódką świecącą od góry, plany głębi, dymki „ktoś pisze”, ruch za kursorem, w filmie nowe pytania wyłaniają się z głębi; Wiedza: trzy nowe propozycje w panelu - Warstwy / W środku / Przypisy** (stare zostały do porównania). Runda 5 nieoglądana (tylko `curl`). Wcześniej, runda 4 (w toku od 2026-10-04; po rundzie 3 właściciel: „chcę, żeby te pytania były na całym tle, jakby dobrze rozmieszczone, i w środku tekst (…) i ten pasek na środku z gwiazdą usuń i przebuduj ładnie; w zakresie wybieram plan, w głos wybieram języki, ale nebulę daj trochę ciemniejszą, bo kontrast się psuje”) - **hero: tekst pośrodku, pytania klientów dookoła na całym tle (kolumny po bokach, pasy nad i pod tekstem), bez linii z gwiazdą; Głos = „Języki” (mgławica w sekcji przyciemniona), Zakres = „Plan”** - odrzucone wersje obu sekcji usunięte z kodu; druga sekcja = „22:00” z ogromnym zegarem (runda 3); do wyboru została tylko Wiedza (Konstelacja / Dokumenty / Granica w panelu). Rundy 3 i 4 nieoglądane (tylko `curl` 200). Historia: runda 3 - „to z setki pytań każdego dnia chciałbym jako hero i potem taki cinematic scroll effect na full ekranie (…) i 22:00 przesuń sekcję w dół i też cinematic przebuduj”; po rundzie 1 (cztery pomysły na całą podstronę) właściciel: „rób od razu kilka wersji każdej sekcji i zrób więcej sekcji, ale też żeby dorównywało poziomowi i cinematic jak reszta podstron”. Podstrona = **pięć sekcji, każda w trzech wersjach** w panelu na dole ekranu: 1. scena główna (Noc / Przelot / Napisy - przypięty film ze scenką Oferty), 2. pytania (Napływ / Wyścig / Wszyscy naraz), 3. wiedza (Konstelacja / Dokumenty / Granica), 4. głos (Twoja branża / Pokrętło / Języki), 5. zakres (Pokaz / Rozmowa / Plan). Bohaterem scen jest rozmowa (dymki, asystent jako gwiazda), nie makieta strony. **Zweryfikowane 2026-10-04 na sygnał właściciela** (`tsc` i ESLint czysto, zrzuty 15 wersji na 1440 × 900 i 390 × 844, ograniczony ruch, bez JS, EN, kliknięcia; dziesięć znalezionych błędów poprawionych - lista w notatkach). Do właściciela: obietnice ze starego tekstu (integracje, panel statystyk, „co miesiąc dostrajamy”). **Teksty przejrzane 2026-10-05** („weź się za weryfikację copywritingu”, potem „? dni zastąp czymś, napraw wszystko generalnie”): głos „my” zamieniony na głos korzyści, zaślepka terminu → „Wycena i termin \| w 24 h” (wzór sklepu), linia dowodów w hero „wycena w 24 h”, podpis odpowiedzi „z Twoich materiałów:”; tabela zmian w notatkach. Notatki: `docs/podstrony/usluga-chatboty-ai.md` |
| 1 | **O nas** | dokończenie podstrony z etapu 2 | `/o-nas` · `/en/about-us` | `on-` | trwa | 🔎 czeka na wybór właściciela (wejście + układ) |
| 0 | **porządki** (koordynacja, dokumentacja, wdrożenie) | zaległości po etapie 2, scalanie notatek, build i wdrożenia | - | - | cały czas | 🔧 dokumentacja główna zaktualizowana 2026-10-07 (opisy Bloga, katalogu Usług i Realizacji w `CLAUDE.md`, nowe zasady w `PRODUCT.md`, log etapów 2-3 i lista wdrożeń w `progress.md`); pozostałe zaległości czekają na kolejność od właściciela - sekcja „Chat 0” |

**Dlaczego dwie fale.** One-page jest pilotem: tam właściciel wybiera kierunek (kompozycja, tło, wejście, sposób pokazania usługi), a chat 7 zapisuje go jako wspólny szkielet. Dopiero potem rusza 6 pozostałych podstron, już na gotowym szkielecie. Gdyby wszystkie 7 ruszyło jednocześnie, powstałoby 7 różnych stylów i każdy wybór trzeba by powtarzać 7 razy.

**Dlaczego copywriting to jeden chat, a nie trzy.** Teksty 3 podstron mają mówić jednym głosem i używać tych samych nazw usług. Chat 6 idzie podstrona po podstronie i każdą zamyka z właścicielem.

**Poza tym etapem:** strona główna (zamknięta), **blog** (właściciel 2026-10-01: „blog wywal z tej pracy, bo tam copywriting git” - teksty listy, wpisu i 3 wpisów zostają bez zmian), puste `/uslugi/marketing*` (decyzja właściciela: wypełnić albo usunąć), polityka prywatności, strona 404.

## Hierarchia podstron usług (decyzja właściciela 2026-10-01)

Właściciel: „chcę hierarchię, że np. one-page najmniej zaawansowany, firmowa pośrodku i szyta na miarę najbardziej, sklep trochę inaczej”. Zasada: **podstrona usługi jest próbką produktu, który sprzedaje.** Klient ma poczuć różnicę między usługami, zanim przeczyta opis.

| Podstrona | Poziom | Charakter | Co to znaczy na stronie |
|---|---|---|---|
| One-page | **1 - esencja** | strona | Najkrótsza: jedna historia, jedna scena, jeden cel. Mało elementów, każdy dopracowany do końca. Sama działa jak wzorowy one-page |
| Strona firmowa | **2 - rozbudowana** | strona | Więcej rozdziałów i dwie sceny. Pokazuje firmę z wieloma usługami, z których każda ma swoje miejsce. Spokojna i solidna |
| Strona interaktywna (do 2026-10-06 „strona szyta na miarę”) | **3 - pełne widowisko** | strona | Najbogatsza podstrona w serwisie: autorski moment w każdej sekcji, cztery przypięte sceny z kamerą, wolno jej łamać szkielet. Tło = mgławica szkieletu (własna warstwa tła i reakcja tła na kursor odpadły - decyzje właściciela 2026-10-02 i 2026-10-05). „To już nie tylko strona, to uczucie” ma być widać, a nie tylko napisane |
| Sklep internetowy | 2-3, inna oś | sprzedaż | Sceną jest ścieżka zakupu (produkt → koszyk → płatność → paczka) i elementy, które da się kliknąć. Energia zamiast spokoju |
| System CRM | 2, **inna usługa** | narzędzie | To nie strona WWW, więc podstrona nie jest kolejnym „filmem o stronie”. Bohaterem jest przykładowy system (panel, dane, porządek) pokazany w kinowych scenach sterowanych przewijaniem - **bez sekcji do klikania** (decyzja właściciela 2026-10-04). Własny pomysł na całą podstronę - sekcja „CRM i chatboty” |
| ~~Projekt UI/UX~~ | - | - | Usunięty jako osobna usługa 2026-10-01 (część każdej budowy) - podstrony nie ma |
| Chatboty AI | 2, **inna usługa** | rozmowa | To nie strona WWW: bohaterem każdej sceny jest rozmowa (dymki, asystent jako gwiazda, zapytanie w skrzynce) w kinowych scenach sterowanych przewijaniem. Dowodem jest prawdziwy czat w rogu strony. Własny pomysł na całą podstronę - sekcja „CRM i chatboty” |

- **Z poziomem rośnie:** liczba scen, bogactwo ujęć kamery, długość strony i liczba miejsc, w których podstrona odchodzi od szkieletu. (Stan po rundach: tło jest wspólne - mgławica szkieletu bez reakcji na kursor, decyzja właściciela 2026-10-05; kliknięcia w scenach zostały tylko tam, gdzie je wybrał - mini sklep, karty podstron na firmowej, kadr „Twoja kolej” na Stronie interaktywnej.)
- **Z poziomem NIE rośnie:** jakość wykonania, typografia, teksty, płynność, telefon, dostępność, wydajność. Poziom 1 to nie gorsza strona - to mniej elementów, każdy na tym samym poziomie dopracowania.
- **Drabina ma być czytelna przy przeklikaniu** one-page → firmowa → na miarę po kolei: zakres i termin w tych samych miejscach, scena za każdym razem wyraźnie bogatsza.
- **Poziom usługi ma być widać po efektowności podstrony (właściciel 2026-10-02):** „pamiętaj tam o poziomach zaawansowania usługi, czyli jak było ze stroną szytą na miarę 3, to tak samo ma być efektownie przedstawione na podstronie firmowa i sklep internetowy to samo”. Czyli: **każda podstrona jest efektowna, a skala widowiska odpowiada poziomowi usługi** - tak samo wyraźnie, jak poziom 3 jest opisany dla strony szytej na miarę. Strona firmowa (poziom 2) i sklep (poziom 2-3) to nie „spokojniejsze wersje” - mają własne, mocne sceny, wyraźnie bogatsze niż one-page. „Spokojna i solidna” przy stronie firmowej opisuje charakter (porządek, pewność), nie mniejszą efektowność. Konkretnie, co ma każdy poziom - sekcje „Chat 8”, „Chat 9”, „Chat 10” niżej.
- **Poziom 1 jest gotowy (one-page, 2026-10-02):** jedna przypięta scena (film: droga klienta przez jedną stronę do formularza), stos czterech kart z rysunkami, zakres z pokazem w kadrze, tło-mgławica szkieletu, interakcja tylko przewijaniem. Tabela „co dochodzi na poziomie 2 i 3”: `docs/podstrony/usluga-one-page.md`, rozdział „Szkielet podstrony usługi”, punkt 5.
- **Szkielet (chat 7) jest wspólną podstawą, a nie sufitem:** poziom 1 i 2 trzymają się go ściśle, poziom 3 i podstrony „na innej osi” biorą z niego język (nagłówek, tło, wejście, typografia, zakończenie) i układają środek po swojemu.
- **CRM i chatboty to inne usługi, więc inne podstrony (właściciel 2026-10-04):** „CRM i chatboty mają być inne, bo to inna usługa (…) jakoś ciekawie, fajnie”. Cztery podstrony stron WWW (one-page, firmowa, na miarę, sklep) tworzą jedną rodzinę: strona klienta w kadrze i kamera. CRM i chatboty do tej rodziny nie należą - dostają własne pomysły na całą podstronę, a ze stron WWW biorą tylko język marki. Szczegóły: sekcja „CRM i chatboty - inne usługi, inne podstrony”.

## Chat 6 - Copywriting podstron (hasło: „copywriting”)

**Zadanie właściciela:** copywriting każdej z podstron: Usługi, Realizacje, Kontakt. Blog wypadł z zakresu (2026-10-01: copy bloga jest dobre - nie ruszasz `app/data/posts.ts` ani napisów w `components/blog/*`). **Tylko teksty** - układ, style i animacje zostają bez zmian.

**Pierwsze kroki (robisz od razu):**
1. Lektura: `PRODUCT.md` (cały), w `CLAUDE.md` rozdział „Sekcja Oferta” (punkty o copy usług i „Co Oferta obiecuje”), notatki `docs/podstrony/uslugi.md`, `realizacje.md`, `kontakt.md` (decyzje właściciela o tekstach).
2. Poznaj `/uslugi` i `/uslugi/strony-www` z kodu i słowników, także EN (bez przeglądarki - sekcja „Bez weryfikacji w trakcie pracy”; `/uslugi/design` już nie istnieje).
3. Zrób **spis tekstów Usług**: każdy nagłówek, opis, przycisk, etykieta, podpis, `alt`, `aria-label`, tytuł i opis w metadanych, Open Graph - z oceną wg `PRODUCT.md`.
4. Pokaż właścicielowi **tabelę „było → jest”** dla Usług: dla zdań kluczowych (h1, opis pod nim, box „Nie wiesz, co wybrać?”, metadane) 2-3 warianty do wyboru, dla reszty jedna propozycja. Czekasz na wybór.
5. Po wyborze: wdrożenie PL i EN, wpis w notatkach; właściciel ogląda sam na :3001 (zrzuty 1440 oraz 360 / 390 / 430 px dopiero na jego sygnał). Potem to samo dla Realizacji (lista i 3 case studies), na końcu Kontakt.

**Jak pisać:**
- Wzór tonu od właściciela: „To już nie tylko strona, to uczucie.” - krótki, pewny chwyt o tym, co klient czuje albo zyskuje, potem jedno zdanie faktów. Każdy element ma własny chwyt, bez jednej formułki powtórzonej kilka razy.
- PL i EN razem (EN wg `PRODUCT.md`: głos korzyści, sentence case, bez myślników). EN to nie kalka - ma brzmieć naturalnie.
- **Tekst musi się zmieścić w istniejącym układzie.** Zasady typografii na telefonie: twarda spacja (U+00A0, jako prawdziwy znak w pliku) po jednoliterowych słowach i w zbitkach typu „asystent AI”, „24 godzin”, bez wiszących słów i sierotek, nazwy nie mogą się łamać w środku. Jeśli tekst wymaga zmiany układu albo stylu - nie zmieniasz ich, zapisujesz w notatkach dla koordynatora.
- Nagłówki w stylu „jedno zdanie z kropką marki” („Od strony po system.”, „Dowód, nie obietnice.”, „Zacznijmy.”) to wybory właściciela z etapu 2. Możesz zaproponować lepsze, ale domyślnie zostają.
- Zasady treści (skrót, pełne w `PRODUCT.md`): głos korzyści („Ty / dostajesz / zyskujesz”), chwyt, potem konkret, sentence case, zero myślników em / en, „i” zamiast „&”, jedyne CTA „Bezpłatna konsultacja”, liczby tylko obronne (98/100 PageSpeed, odpowiedź w 24 h), bez oceny „5,0 na Google”, bez obietnic bez pokrycia (WordPress / CMS, integracja z kurierami, „testy użyteczności”, AI w CRM jako pewnik), fakty o realizacjach bez zmian.

**Pliki i pułapki, podstrona po podstronie:**

1. **Usługi** - `lib/i18n/uslugi/kategorie.ts` (`catalogDict`: zdania nagłówków, opisy, filtr, box „Nie wiesz, co wybrać?” z `undecidedStory`, karta Design), metadane w `app/(pl)/uslugi/page.tsx`, `strony-www/page.tsx`, `design/page.tsx` i w ich odpowiednikach EN.
   - **Uwaga:** nazwy usług, chwyty, legendy 1-3 i podpisy scenek na kartach katalogu pochodzą z `servicesSectionDict.items` w `lib/i18n/services.ts` - to teksty sekcji Oferta na stronie głównej (zamknięte i zaakceptowane 2026-09-28) i etykiety listy usług w formularzu kontaktu. Zmiana tam zmienia stronę główną, więc tylko za wyraźną zgodą właściciela (decyzja „do właściciela”), narzędziem Edit, ze zrzutem Oferty po zmianie.
   - Opisy w `app/data/services.ts` i `EN_CARD`: sprawdź, czy cokolwiek je jeszcze wyświetla; nazw (`title`), adresów, kolejności i ikon nie ruszasz.
2. **Realizacje** - `lib/i18n/projects.ts` (`RealizacjeDict`, `workByLocale`, `EN_PROJECT`), teksty w `app/data/projects.ts` (opis, wyzwanie, rozwiązanie, etykiety liczb), metadane w `app/(pl)/realizacje/layout.tsx`, `[slug]/page.tsx` i EN.
   - Fakty zostają: Kardyś bez personalizacji graweru (punkt wyjścia: przestarzała strona na WordPressie i sklep bez zamówień), RKS = strona + aplikacja klubowa, asystent AI otwiera czat. Bez wymyślonych metryk.
   - Do właściciela: liczby Mcentrum „Nr 1” i „< 1 s”, technologia „CMS” przy Mcentrum, pisownia „CloudFlare”.
   - Nie zmieniasz: `slug`, `title`, `client`, `externalLink`, ścieżek obrazów, `hasCaseStudy`, `openChat`, kolejności. Te dane zasilają też sekcję Realizacje na stronie głównej i sitemapę.
3. **Kontakt** - `lib/i18n/kontakt.ts`, metadane w `app/(pl)/kontakt/layout.tsx` i `app/(en)/en/contact/layout.tsx`. Chat 4 przepisał już teksty w głosie korzyści, więc to szlif i spójność z resztą. **Wartości opcji listy usług (`value`) nie zmieniasz** - trafiają do Web3Forms jako temat wiadomości.

**Nie Twoje:** strona główna, blog (`/blog`, wpisy, `docs/blog-style-guide.md`, `/new-post`), O nas (teksty prowadzi chat 1), 7 podstron usług (teksty pisze chat przebudowy danej podstrony), Navbar, stopka, czat, baner cookies. Błąd w tekście poza zakresem = wpis w notatkach.

**Notatki:** `docs/podstrony/copy.md` (dla każdej podstrony: tabela „było → jest”, wybory właściciela z cytatem i datą).

## Chat 7 - One-page: pilot przebudowy podstron usług (hasło: „one-page”)

> **✅ ZAMKNIĘTE 2026-10-02.** Stan końcowy, wzorzec dla fali 2 i decyzje właściciela: `docs/podstrony/usluga-one-page.md`. Opis niżej to pierwotne zlecenie (stan sprzed przebudowy) - zostaje jako historia; „Zasady z etapu 2” obowiązują także w fali 2. Hasło „one-page” = poprawki zamkniętej podstrony (zapytaj, co dokładnie poprawić).

**Zadanie właściciela:** przebudowa podstrony one-page - dostosowanie do nowego designu, nowe pomysły, „high-end totalny”. To pierwsza z 7 podstron usług, więc wybory z tej podstrony stają się wzorem dla pozostałych.

**Miejsce w hierarchii: poziom 1 - esencja** (patrz „Hierarchia podstron usług”). One-page ma być najprostszą z podstron stron WWW: jedna historia, jedna scena, jeden cel - i żadnego elementu, który nie jest dopracowany do końca. „High-end” robi tu jakość i pomysł, nie liczba efektów. Dzisiejsza podstrona ma dwie przypięte sceny po 400vh, bento z 4 shaderami i kartę CTA - to więcej niż poziom 1, część z tego odchodzi albo przechodzi na wyższe poziomy.

**Stan dziś** (`OnePageClient.tsx`, ~1440 linii, `lib/i18n/uslugi/one-page.ts`): hero z shaderem promieni (`RaysBackground`), przypięta makieta przeglądarki na 400vh z odsłoną szkic → gotowa strona (to znak rozpoznawczy podstrony - właściciel o tym ruchu przy Ofercie: „zajebiście mi się podoba ten motion reveal elementów na makietach”), sekcja „Makieta = fragment”, bento 4 kafli z shaderami i `GlassEdge` (`backdrop-filter`), przypięte „Zakres prac” na 400vh, karta CTA „Gotowy na cyfrową Dominację?” z shaderem. Łamie dzisiejsze zasady: tekst z gradientem, rozmyte szkło, wersaliki, Title Case („Społeczny Dowód”), hasło w stylu hype, licznik „3” obok „-5 dni”, widoczny link powrotu.

**Pierwsze kroki (robisz od razu):**
1. Lektura: `PRODUCT.md` (cały), w `CLAUDE.md` rozdziały o hero, Realizacjach, „Dlaczego Avenly”, Ofercie i „Strona Kontakt”, notatki `docs/podstrony/uslugi.md` i `realizacje.md` (jak wyglądały rundy z właścicielem i co odrzucał).
2. Obejrzyj na :3001 stronę główną, `/uslugi`, `/realizacje` i obecną podstronę one-page. Zrób jej zrzuty (1440 i 390, cała długość) i spisz, co jest w niej wartościowe.
3. Zbuduj **rundę 1: 3-5 naprawdę różnych kierunków całej podstrony** (inna scena i kompozycja, nie odcienie jednego pomysłu), przełącznik w panelu na dole ekranu. **Jeden z kierunków = obecna narracja w nowym języku** (hero → makieta z odsłoną → zakres → szczegóły): trzy razy w etapie 2 właściciel wracał do pierwotnego rozmieszczenia („zrób mniej więcej co było”). Pozostałe to nowe pomysły.
4. Pokaż właścicielowi zrzuty kierunków (1440 i 390) razem z **planem drabiny**: krótko, jak każdy kierunek urósłby na poziom 2 (firmowa) i 3 (na miarę) i co dostają sklep, CRM, UI/UX i chatboty. Zadaj też pytanie o kartę CTA (niżej, „Zakończenie podstrony”). Czekasz na wybór.
5. Po wyborze kierunku: kolejne rundy na elementach (tło, wejście, sposób pokazania usługi, zakres), potem telefon i tablet (te same efekty, nie uboższa wersja), ograniczony ruch, bez JS, EN, sprzątanie propozycji.
6. Na końcu: szkielet w `_usluga/` i rozdział „Szkielet podstrony usługi” w notatkach (niżej). Właściciel zatwierdza one-page i drabinę - dopiero wtedy koordynator odblokowuje falę 2.

**Zasady z etapu 2 (decyzje właściciela - obowiązują także tutaj):**
- **Świat strony głównej.** Motywy wyrastają z marki i strony głównej: mgławica z gwiazdami (Realizacje, katalog usług), animowane rysunki techniczne z Oferty (one-page ma własny rysunek ze scenką w `components/sections/services/drawings.tsx`), kropka marki, gwiazdy i krawędź planety z hero. Abstrakcyjne materiały (lakier, szafir, zorza, światłowody, płynny błękit) były odrzucane jako „niepasujące do marki / do strony głównej”.
- **Wejście:** czerń → tło rodzi się z czerni → tekst po kolei → treść (jak `/uslugi` i `/realizacje`).
- **Nagłówek:** jedno mocne zdanie z kropką na końcu (jak „AVENLY.”) i krótki opis. Bez pigułki z wersalikami, bez widocznej ścieżki i linków „Wróć” (BreadcrumbList zostaje w danych strukturalnych).
- **Tło podstron usług BEZ interakcji z kursorem (decyzja właściciela 2026-10-05: „usuń na każdej podstronie w usłudze hover na tle i dystorsję, bo laguje i zoptymalizuj te podstrony wszystkie”):** mgławica szkieletu (`_usluga/sky.tsx`) nie reaguje na kursor, palec ani kliknięcia - bez „czarnej dziury”, smugi i fal. Nie przywracaj tego i nie dokładaj własnego tła reagującego na wskaźnik; płynność jest ważniejsza niż efekt. Tego samego dnia właściciel zdjął efekt także z katalogu: „z podstrony /uslugi też usuń ten efekt” (`_katalog/sky.tsx` - blask przy karcie najbliżej środka okna, bez przeskakiwania na kartę pod kursorem). Potem także z Realizacji: „z realizacji też usuń” (`realizacje/_rl/sky.tsx`). (Dawna zasada z etapu 2 - kursor jako „czarna dziura”, samo zniekształcenie bez obwódek, fale po kliknięciach nakładają się - **nie obowiązuje już nigdzie**: żadne tło-mgławica na podstronach nie reaguje na kursor.) **Nigdy** czarnego prostokąta ani maski wygaszającej tło za nagłówkiem - spokój pod tekstem daje sama kompozycja.
- **Elementy w siatce nie zmieniają pozycji przy przewijaniu** - ruch kinowy siedzi w wejściach i tłach.
- **Animacja tłumaczy się sama:** podpis bieżącego kroku, ok. 3 s na krok (PRODUCT.md, Design Principles 6).
- **Kolor:** one-page ma motyw niebieski (`lib/service-theme.ts`) - ten sam co kolor marki `#3b82f6`. Bez pastelowych błękitów i fioletu.
- **Zakończenie podstrony (do właściciela):** stopka z „Bezpłatną konsultacją” zamyka każdą stronę, a końcowe CTA nad stopką właściciel usunął ze strony głównej jako zbędne. Karta „Gotowy na cyfrową Dominację?” jest dziś zapisana w `PRODUCT.md` (Copy Voice 5), ale kłóci się z nowszymi decyzjami - zapytaj w rundzie 1, czy znika, czy dostaje nową formę.

**Teksty podstrony piszesz Ty** (chat 6 jej nie rusza): `PRODUCT.md`, w tym „Co obiecujemy w ofercie”. Nazwa i chwyt usługi zgodne z Ofertą („…pisze do Ciebie, zanim zdąży się rozmyślić”), termin „3-5 dni” tylko jeśli właściciel potwierdzi, żadnych wymyślonych liczb.

**Wspólny szkielet dla 6 pozostałych podstron (druga połowa zadania):**
- Wszystko, co po wyborach właściciela ma być wspólne dla podstron usług (górna część strony, tło i jego sterowanie, wejście, panel przełączników, blok zakresu, zakończenie, typografia, odstępy), budujesz jako części wielokrotnego użytku w **`app/(pl)/uslugi/_usluga/`** (katalog prywatny, nie jest trasą; style `sv-` w `_usluga/usluga.css`). Kolor podstrony wchodzi parametrem (`getServiceTheme`), nie jest wpisany na sztywno.
- Część specyficzna dla one-page (jej scena, makieta, teksty) zostaje w `app/(pl)/uslugi/strony-www/one-page/`.
- W notatkach rozdział **„Szkielet podstrony usługi”**: kolejność sekcji, które części są wspólne, co każda podstrona robi po swojemu (własna scena pokazująca usługę), jak podpiąć kolor motywu, co dochodzi na poziomie 2 i 3 hierarchii i gdzie wyższy poziom może odejść od szkieletu, lista decyzji właściciela, których nie wolno otwierać na nowo w fali 2.
- Mgławica ma dziś dwie kopie (`app/(pl)/realizacje/_rl/nebula.ts` - pełniejsza, i `app/(pl)/uslugi/_katalog/nebula.ts`). Jeśli jej potrzebujesz, **nie rób trzeciej kopii** - zapisz to w notatkach i powiedz właścicielowi, żeby zlecił koordynatorowi („porządki”) scalenie jej we wspólny moduł; do tego czasu importuj z `_rl/nebula.ts` bez zmieniania go.

**Pliki:** `app/(pl)/uslugi/strony-www/one-page/*`, `app/(pl)/uslugi/_usluga/*` (nowy), `lib/i18n/uslugi/one-page.ts`, `app/(en)/en/services/websites/one-page/page.tsx`, assety w `public/uslugi/one-page/`. Tylko używasz: `components/sections/services/drawings.tsx` (rysunki Oferty), `components/seo/ServicePageSchema.tsx`, `lib/service-theme.ts`.

**Notatki:** `docs/podstrony/usluga-one-page.md`.

## Chaty 8-13 - pozostałe podstrony usług, fala 2 (hasła: „strona firmowa”, „strona szyta na miarę”, „sklep”, „CRM”, „chatboty”)

**Odblokowane 2026-10-02.** Właściciel przyjął one-page („super, podstrona dopięta”) i zlecił start **strony firmowej (chat 8), strony szytej na miarę (chat 9) i sklepu internetowego (chat 10) jednocześnie** („skoro już blueprint mamy”, potem „dodaj jeszcze sklep internetowy do pracy równolegle”). Wzorzec jest gotowy: `docs/podstrony/usluga-one-page.md` - rozdziały „Gotowa podstrona w skrócie”, „Szkielet podstrony usługi - wzorzec dla fali 2”, „Decyzje właściciela” i „Pułapki”. CRM (chat 11) i chatboty (chat 13) ruszyły 2026-10-04 na hasło właściciela. UI/UX odpada (usługa usunięta 2026-10-01).

Każdy chat: jedna podstrona + jej słownik + trasa EN. Bierze szkielet z `_usluga/` (tylko używa; potrzebna zmiana szkieletu = wpis w notatkach dla koordynatora i lokalne obejście we własnym pliku) i dokłada **własne sceny pokazujące usługę** oraz teksty - **na swoim poziomie hierarchii**: firmowa wyraźnie bogatsza od one-page, na miarę wyraźnie bogatsza od firmowej, sklep, CRM i chatboty z własnym charakterem. Kierunku wybranego na one-page (film ze scenami i kamerą, kadr z zaprojektowaną stroną klienta, czarne karty ze światem linii w tle, zakres z terminem, zakończenie) nie otwiera na nowo - propozycje dotyczą tego, co dla podstrony własne. **Wyjątek: CRM (chat 11) i chatboty (chat 13)** - to inne usługi niż strony WWW, wzorzec one-page ich nie obowiązuje i mają własne „Pierwsze kroki” (sekcja „CRM i chatboty - inne usługi, inne podstrony” niżej).

**Pierwsze kroki (wspólne dla fali 2, robisz od razu):**
1. Lektura: `PRODUCT.md` (cały, zwłaszcza „Co obiecujemy w ofercie”), `docs/podstrony/usluga-one-page.md` (cztery rozdziały wymienione wyżej), `docs/podstrony/copy.md` (co właściciel przyjął i odrzucił w tekstach), sekcje „Hierarchia podstron usług”, „Standard jakości”, „Jak pracować z właścicielem” i zasady z etapu 2 w sekcji „Chat 7”, na końcu sekcja swojej podstrony niżej.
2. Poznaj gotową one-page **z kodu**: `OnePage.tsx`, `film.tsx`, `cases.tsx`, `drawings.tsx`, `depth.tsx`, `scope.tsx` i `one-page.css` (opis scen: `docs/podstrony/usluga-one-page.md`). Tak samo rysunek i scenkę swojej usługi w Ofercie (`components/sections/services/drawings.tsx`) oraz obecną wersję swojej podstrony (stary `*Client.tsx` i słownik). Bez przeglądarki i zrzutów - sekcja „Bez weryfikacji w trakcie pracy”.
3. Spisz w notatkach: co w obecnej wersji jest wartościowe, co łamie dzisiejsze zasady, jakie obietnice bez pokrycia znikają („Na co uważać” w sekcji podstrony). Zrób **spis tekstów pierwotnej wersji** (ze starego słownika) - to z nich składasz teksty nowej podstrony (akapit „Teksty fali 2” niżej).
4. **Runda 1:** zbuduj nową podstronę na szkielecie, od razu w jakości pilota, z **3-4 naprawdę różnymi propozycjami sceny głównej** (pierwszy ekran + przypięta scena w kadrze) w panelu na dole ekranu (`Dock` z `_usluga/dock.tsx`). Pozostałe sekcje w jednej wersji. Napisz właścicielowi, co jest do obejrzenia (adres na :3001, nazwy propozycji w panelu, po jednym zdaniu o każdej), i czekaj na wybór. Bez zrzutów, testów i weryfikacji - oddajesz szybko i piszesz wprost, że nic nie było sprawdzane (sekcja „Bez weryfikacji w trakcie pracy”).
5. Po wyborze: dopracowanie scen, teksty PL i EN (z pierwotnej wersji podstrony - akapit niżej), telefon i tablet (te same efekty co na komputerze), ograniczony ruch, bez JS, sprzątanie propozycji, notatki, status w tabeli. Weryfikacja całości (zrzuty, telefon, EN, `tsc`, ESLint) dopiero na sygnał właściciela.

**Teksty fali 2 - z pierwotnych wersji podstron (decyzja właściciela 2026-10-02: „copywriting niech biorą z pierwotnych wersji stron”).** Tak samo było na one-page („co do copywritingu masz wszystkie potrzebne teksty na pierwotnej wersji tej podstrony”):
- **Źródłem tekstów jest dotychczasowa podstrona**: stary słownik (`corporateDict`, `dedicatedDict`, `shopDict` - PL i EN) i stary komponent `*Client.tsx`. Bierzesz stamtąd nagłówki, opisy, punkty zakresu, nazwy sekcji i podpisy, i rozkładasz je w nowych scenach. **Nie piszesz tekstów od zera i nie przepisujesz zdań, które działają.** Stare pliki zostają na dysku właśnie jako źródło.
- **Zmieniasz tylko to, co musi się zmienić**, i każdą zmianę wpisujesz do tabeli „było → jest” w notatkach: (1) obietnice bez pokrycia z listy „Na co uważać” Twojej podstrony (WordPress / CMS, WooCommerce, integracje z przewoźnikami, niepotwierdzone płatności, wymyślone liczby) - usuwasz albo zastępujesz zdaniem zgodnym z `PRODUCT.md`; (2) przycisk zawsze „Bezpłatna konsultacja”; (3) zapis: sentence case zamiast Title Case, bez myślników em / en, „i” zamiast „&”; (4) to, czego nowa scena już nie pokazuje (np. podpisy usuniętej makiety panelu).
- **Brakujący tekst do nowej sceny** (podpis kroku, podpis rysunku) piszesz w tonie reszty strony; chwyt i scenka z Oferty (sekcja „Sedno usługi”) to gotowe, zaakceptowane zdania, z których możesz skorzystać.
- **Szlif całości tylko na prośbę właściciela.** Na one-page poprosił o niego po akceptacji designu („każdy tekst pod względem copywritingu zoptymalizuj, bo niektóre są frajerskie”), a potem część krótkich, rzeczowych zdań przywrócił do pierwotnego brzmienia. Zdania, które Twoim zdaniem są słabe, pokaż mu w tabeli z propozycją - nie zmieniaj ich sam.
- **Wspólne dla wszystkich podstron usług, nie z pierwotnej wersji:** zakończenie „Zacznijmy od rozmowy.” + „Opowiedz nam o swojej firmie, a dopasujemy … do Twojego biznesu.” (słowa właściciela, zastępuje kartę „Gotowy na cyfrową Dominację?”) oraz linia dowodów pod przyciskiem.

| Chat | Podstrona | Poziom | Pliki | Kolor motywu | Na co uważać |
|---|---|---|---|---|---|
| 8 | Strona firmowa | 2 | `strony-www/strona-firmowa/*`, `lib/i18n/uslugi/strona-firmowa.ts` | szmaragd | bez WordPressa i panelu CMS; sedno: podstrona dla każdej usługi |
| 9 | Strona interaktywna (do 2026-10-06 „strona szyta na miarę”) | 3 | `strony-www/strona-szyta-na-miare/*`, `lib/i18n/uslugi/strona-szyta-na-miare.ts` | róż | „To już nie tylko strona, to uczucie.”; bez CMS i panelu admina (usunięte w rundzie 1); bez porównywania z innymi usługami |
| 10 | Sklep internetowy | 2-3, sprzedaż | `strony-www/sklep-internetowy/*`, `lib/i18n/uslugi/sklep-internetowy.ts` | bursztyn | bez WooCommerce (pasek „WooCommerce vs Headless”, chipy „InPost / DPD”); „wysyłka kurierem lub do paczkomatu”, płatności BLIK / karta |
| 11 | System CRM | 2, inna usługa (narzędzie) | `strony-www/system-crm/*`, `lib/i18n/uslugi/system-crm.ts` | niebo | nie wzorzec stron WWW - sekcja „Chat 11”; AI jako opcja („na życzenie”), nie pewnik |
| ~~12~~ | ~~Projekt UI/UX~~ | - | - | - | odpada: usługa usunięta 2026-10-01, podstron nie ma |
| 13 | Chatboty AI | 2, inna usługa (rozmowa) | `automatyzacje-ai/chatboty-ai/*`, `lib/i18n/uslugi/chatboty-ai.ts` | pomarańcz | nie wzorzec stron WWW - sekcja „Chat 13”; liczba obronna: odpowiedź w ok. 2 s; prawdziwy czat w rogu strony to najlepszy dowód - podstrona może do niego prowadzić (`avenly:open-chat`) |

Ścieżki w kolumnie „Pliki” liczone od `app/(pl)/uslugi/`; do tego odpowiednia trasa w `app/(en)/en/services/…` i assety w `public/uslugi/<podstrona>/`. Notatki: `docs/podstrony/usluga-<nazwa>.md`.

### Chat 8 - Strona firmowa (hasło: „strona firmowa”) - poziom 2

> **Stan 2026-10-07 - korekty po rundach (ważniejsze niż opis niżej, który jest pierwotnym zleceniem):** makieta w filmie BEZ klikania (decyzja właściciela 2026-10-02 - punkt „interakcja: przewijanie + kliknięcia w kadrze” niżej nie obowiązuje); podstrona ma jedną przypiętą scenę z kamerą („Piętra”) i nieprzypiętą sekcję kart podstron (najechanie / dotknięcie); makieta w palecie podstrony (czerń, biel, szmaragd), bez pasteli. Aktualny stan: wiersz chatu 8 w tabeli „Przydział” i `docs/podstrony/usluga-strona-firmowa.md`.

**Zadanie:** przebudowa podstrony `/uslugi/strony-www/strona-firmowa` (EN `/en/services/websites/company-website`) na wzorcu one-page, o poziom bogatsza. Prefiks CSS `sf-`, kolor szmaragdowy (przychodzi sam z adresu - `ServiceShell`), notatki `docs/podstrony/usluga-strona-firmowa.md`.

**Sedno usługi (teksty Oferty, zaakceptowane 2026-09-28 - kontekst dla scen; same teksty podstrony bierzesz z jej pierwotnej wersji):** „Twoja firma wygląda w sieci tak solidnie, jak pracuje na co dzień. Klient bez szukania trafia do usługi, której potrzebuje.” Punkty: Podstrona dla każdej usługi · Opinie Google i mapa dojazdu · Każdy klient w swoim języku. Scenka Oferty: „Każda usługa dostaje własną podstronę.” → „Treść opowiada o ofercie Twoim językiem.” → „Klient trafia na nią prosto z menu.” (rysunek: nowa podstrona dołącza do menu strony).

**Poziom 2 - jak ma być pokazany (efektownie, wyraźnie bogaciej niż one-page):**
- kadr pokazuje **STRUKTURĘ**: stronę z menu i podstronami, w której każda usługa ma swoje miejsce (one-page pokazuje jedną stronę przewijaną do formularza). Widowiskiem jest tu **ruch kamery między podstronami**: np. klient wybiera usługę z menu i kadr przelatuje na jej podstronę, mapa strony rozrasta się o kolejne podstrony i kamera odjeżdża, żeby pokazać całość, trzech klientów trafia z Google prosto na trzy różne podstrony. To punkty wyjścia, propozycje wymyślasz sam;
- **dwie przypięte sceny z kamerą** zamiast jednej i więcej rozdziałów - podstrona wyraźnie dłuższa i pełniejsza od one-page, każda scena z własnym mocnym momentem (odpowiednikiem najazdu kamery i odsłony szkicu z one-page);
- **interakcja:** przewijanie + kliknięcia w kadrze (zakładki menu, przejście na podstronę) - odwiedzający może sam „przejść się” po przykładowej stronie firmowej;
- rysunki ze scenkami i światy w tle kart na poziomie pilota albo wyżej (więcej zdarzeń w scence, własne sceny głębi dobrane do treści);
- charakter „spokojna i solidna” = porządek, pewność, czytelna struktura. **Nie oznacza mniejszej efektowności.** Dla poziomu 3 zostają tylko: własne tło z interakcją, autorski moment w KAŻDEJ sekcji i łamanie układu szkieletu;
- szkielet trzymany ściśle: nagłówek z kropką przy lewej krawędzi, kadr na pierwszym ekranie, sekcja z rysunkami w języku Oferty, zakres z terminem na linii wymiarowej w tym samym miejscu co na one-page, zakończenie „Zacznijmy od rozmowy.”.

**Na co uważać:**
- **bez WordPressa i panelu CMS** - dziś metadane mówią „z prostym panelem CMS. Sam dodajesz podstrony, blog i ofertę, bez pomocy programisty” (PL i EN, `page.tsx`): do usunięcia razem z tytułem „…witryna z CMS”;
- **teksty bierzesz ze starego słownika `corporateDict`** (akapit „Teksty fali 2”); nowy typ `…Copy` zakładasz w tym samym pliku (`lib/i18n/uslugi/strona-firmowa.ts`), stary słownik zostaje jako źródło. Do zmiany z urzędu: karta „Gotowy na cyfrową Dominację?” (zastępuje ją wspólne zakończenie) i „Darmowa konsultacja” (→ „Bezpłatna konsultacja”). Zdania z żargonem („Kinowy projekt graficzny”, „nastawiony na konwersję”, „Zbieranie leadów”, chipy „Multi-język / Formularze custom”) zostają w pierwotnym brzmieniu, dopóki właściciel nie zdecyduje inaczej - pokaż mu je w tabeli z propozycją;
- **termin realizacji tylko po potwierdzeniu właściciela** (do właściciela) - nie wpisuj liczby z głowy;
- stary `CorporateWebsiteClient.tsx` (92 KB) zostaje na dysku, nieimportowany (praca nie jest w git) - usuwa go koordynator za zgodą właściciela.

**Pliki:** `app/(pl)/uslugi/strony-www/strona-firmowa/*`, `app/(en)/en/services/websites/company-website/page.tsx`, `lib/i18n/uslugi/strona-firmowa.ts`, `public/uslugi/strona-firmowa/`.

### Chat 9 - Strona szyta na miarę (hasło: „strona szyta na miarę”) - poziom 3

> **Stan 2026-10-07 - korekty po rundach (ważniejsze niż opis niżej, który jest pierwotnym zleceniem):** usługa nazywa się **„Strona interaktywna”** (2026-10-06; hasło zadania i adres bez zmian - działa też hasło „strona interaktywna”). Odpadły: własne tło z interakcją (nić za kursorem i gwiazdy na klik usunięte 2026-10-02, tło podstron bez reakcji na kursor od 2026-10-05) oraz porównywanie ze stroną firmową. Kadr pokazuje przykładową stronę FIRMY zrobioną na najwyższym poziomie (analogia poziomu: avenly.pl - informacja dla nas, nie treść). Aktualny stan i wybory: wiersz chatu 9 w tabeli „Przydział” i `docs/podstrony/usluga-strona-szyta-na-miare.md`.

**Zadanie:** przebudowa podstrony `/uslugi/strony-www/strona-szyta-na-miare` (EN `/en/services/websites/custom-website`) - **najbogatsza podstrona w serwisie**. Prefiks CSS `sm-`, kolor różowy, notatki `docs/podstrony/usluga-strona-szyta-na-miare.md`.

**Sedno usługi (teksty Oferty, zaakceptowane 2026-09-28):** „To już nie tylko strona, to uczucie. Projekt od pierwszej kreski, płynny ruch i nastrój Twojej marki, który klient zapamiętuje.” (pierwsze zdanie to słowa właściciela). Punkty: Projekt od pierwszej kreski · Ruch, który prowadzi wzrok · Nastrój Twojej marki. Scenka Oferty: „Klient od pierwszej chwili czuje nastrój Twojej marki.” → „Ruch płynnie prowadzi jego wzrok.” → „Strona odpowiada na każdy gest klienta.” (rysunek: kolor z moodboardu marki maluje nagłówek, ruch po torze, kursor dotyka kształtu, a ten odpowiada falą).

**Poziom 3 - jak ma być pokazany (pełne widowisko, wyraźnie bogaciej niż firmowa i sklep):**
- kadr pokazuje **NASTRÓJ**: kolor, ruch i reakcję strony na gest klienta - „to uczucie” ma być widać, a nie tylko napisane;
- **autorski moment w każdej sekcji**, trzy przypięte sceny lub więcej, kursor i kliknięcia w scenach (na telefonie dotyk - równie efektownie, nie uboższa wersja);
- **wolno własne tło z interakcją** (`<ServiceShell sky={false}>` albo własna warstwa nad mgławicą) i wolno ułożyć środek podstrony po swojemu. Ze szkieletu zostaje język: nagłówek z kropką, wejście z czerni, typografia, zakres z terminem na linii wymiarowej, zakończenie „Zacznijmy od rozmowy.”;
- motywy nadal ze świata strony głównej (mgławica, gwiazdy, krawędź planety, warstwice, rysunki techniczne, kropka marki). Abstrakcyjne materiały (lakier, szafir, zorza, płynny kolor) właściciel odrzucał. Czerń luksusowa, róż tylko w akcentach, nigdy jako zalane tło.

**Na co uważać:**
- **bez CMS i panelu admina** - dziś: „Panel CMS (Sanity / Strapi)”, „z opcjonalnym panelem CMS”, „Panel CMS do samodzielnej edycji”, makieta z fazami logowania i panelu (`twoja-marka.pl/panel`), „Strefa klienta”, „Potężny backend”. Do usunięcia w PL i EN: słownik `dedicatedDict` oraz metadane w `page.tsx` (tytuł „Strona Szyta na Miarę - Next.js + Headless CMS · premium”, opis „…z Headless CMS (Sanity, Strapi lub Payload do wyboru)… treści edytujesz sam przez nowoczesny panel CMS”, słowa kluczowe i `serviceType` z „Headless CMS”); tytuł w sentence case;
- **nie opowiadaj etapu szkicu.** „Projekt od pierwszej kreski” znaczy „projekt od zera, tylko dla Ciebie”, a nie „zaczynamy od szkicu” (właściciel na one-page: „nie zaczyna się strona od szkicu”). Szkic wolno pokazać wyłącznie jako obraz, nigdy jako krok historii ani etykietę;
- **teksty bierzesz ze starego słownika `dedicatedDict`** (akapit „Teksty fali 2”) - poza obietnicami CMS / panelu wymienionymi wyżej, kartą „Gotowy na cyfrową Dominację?” (zastępuje ją wspólne zakończenie) i „Darmową konsultacją” (→ „Bezpłatna konsultacja”);
- wygląd bez tekstu z gradientem, `GlassEdge` i rozmyć (dzisiejsza wersja „dramatic premium”);
- **termin realizacji tylko po potwierdzeniu właściciela** (do właściciela);
- wydajność: najbogatsza nie znaczy najcięższa - zasady WebGL ze „Standardu jakości” (start po idle, pauza poza ekranem, ~30 fps w spoczynku, budżet pikseli, zapas bez WebGL);
- stary `DedicatedWebsiteClient.tsx` (104 KB) zostaje na dysku, nieimportowany.

**Pliki:** `app/(pl)/uslugi/strony-www/strona-szyta-na-miare/*`, `app/(en)/en/services/websites/custom-website/page.tsx`, `lib/i18n/uslugi/strona-szyta-na-miare.ts`, `public/uslugi/strona-szyta-na-miare/`.

### Chat 10 - Sklep internetowy (hasło: „sklep”) - poziom 2-3, oś „sprzedaż”

> **Stan 2026-10-07 - korekty po rundach (ważniejsze niż opis niżej, który jest pierwotnym zleceniem):** płatność = przekierowanie do operatora (Przelewy24 albo Stripe) - kod BLIK wpisuje się na stronie operatora, nie w sklepie (tak czytać punkt „kod BLIK się wpisuje” niżej); przykładowy sklep jednej marki, zaprojektowany pod markę (ciemna paleta, etykieta „Przykładowy sklep”); w scenach jedno zdanie narratora naraz. Aktualny stan: wiersz chatu 10 w tabeli „Przydział” i `docs/podstrony/usluga-sklep-internetowy.md`.

**Zadanie:** przebudowa podstrony `/uslugi/strony-www/sklep-internetowy` (EN `/en/services/websites/online-store`) na wzorcu one-page. Prefiks CSS `sk-`, kolor bursztynowy (przychodzi sam z adresu), notatki `docs/podstrony/usluga-sklep-internetowy.md`.

**Sedno usługi (teksty Oferty, zaakceptowane 2026-09-28):** „Sklep, który sprzedaje także wtedy, gdy Ty odpoczywasz. Klient płaci BLIK-iem lub kartą, a zamówienia czekają na Ciebie w jednym panelu.” Punkty: BLIK, karta i Przelewy24 · Kurier lub paczkomat · Zamówienia w jednym panelu. Scenka Oferty: „Klient wybiera produkt i wrzuca go do koszyka.” → „Płaci tak, jak lubi: BLIK-iem albo kartą.” → „Paczka już jedzie, a Ty masz kolejne zamówienie.” (rysunek: koszyk → BLIK → paczka → panel). Dowód z realizacji: Kardyś (sklep z płatnościami online i panel do zarządzania stroną i sklepem; bez personalizacji graweru).

**Poziom 2-3 na osi „sprzedaż” - jak ma być pokazany (efektownie, wyraźnie bogaciej niż one-page, inaczej niż firmowa):**
- kadr pokazuje **ZAKUP**: sceną jest ścieżka klienta produkt → koszyk → płatność → paczka → zamówienie u właściciela sklepu. Widowiskiem jest **transakcja, która naprawdę się dzieje** na oczach odwiedzającego: produkt wpada do koszyka, kod BLIK się wpisuje, płatność przechodzi, paczka rusza, w panelu pojawia się nowe zamówienie;
- **elementy, które da się kliknąć** - to wyróżnik tej podstrony: odwiedzający sam dodaje produkt do koszyka, zmienia wariant, przechodzi do płatności (mini sklep w kadrze). Na telefonie to samo dotykiem. Bez JS i przy ograniczonym ruchu: statyczna ścieżka w krokach;
- **dwie przypięte sceny lub więcej** (np. zakup oczami klienta, potem to samo zamówienie oczami właściciela sklepu w panelu) i więcej rozdziałów niż one-page;
- **energia zamiast spokoju:** szybszy rytm, więcej zdarzeń w scenkach, liczniki i stany („w koszyku”, „opłacone”, „wysłane”) - ale nadal czerń luksusowa, ostre linie i jeden kolor akcentu (bursztyn), bez krzykliwych banerów promocyjnych w roli ozdoby;
- rysunki ze scenkami i światy w tle kart na poziomie pilota albo wyżej;
- względem poziomu 3 (na miarę): sklep nie potrzebuje własnego tła ani łamania układu szkieletu - jego siłą jest interakcja. Tło-mgławica szkieletu, nagłówek z kropką przy lewej krawędzi, zakres z terminem na linii wymiarowej, zakończenie „Zacznijmy od rozmowy.”.

**Na co uważać:**
- **bez WooCommerce i „Headless Commerce”** (PRODUCT.md, „Co obiecujemy w ofercie”) - dziś: tytuł w metadanych „Sklep Internetowy - WooCommerce lub Headless Commerce”, słowa kluczowe i `serviceType` z WooCommerce / Headless, plakietka „Headless Commerce / WooCommerce”, sekcja porównania „Headless E-commerce” / „WooCommerce” z chipami („Headless API”, „Integracje z hurtowniami”). Do usunięcia w PL i EN (`page.tsx`, słownik `shopDict`); tytuł w sentence case;
- **bez obietnicy integracji z przewoźnikami** - chip „InPost / DPD” znika; piszemy „wysyłka kurierem lub do paczkomatu”;
- **płatności:** metody z Oferty - BLIK i karta; operator płatności do wyboru: **Przelewy24 albo Stripe** (właściciel 2026-10-02: „możliwość Stripe, Przelewy24”). Apple Pay, Google Pay i płatności odroczone ze starego tekstu nie są potwierdzone - nie przenoś ich bez pytania właściciela;
- panel = „zamówienia w jednym panelu” (jak w Ofercie i u Kardysia), nie „CMS” i nie obietnica samodzielnej edycji strony;
- **teksty bierzesz ze starego słownika `shopDict`** (akapit „Teksty fali 2”) - poza obietnicami wymienionymi wyżej, kartą „Gotowy na cyfrową Dominację?” (zastępuje ją wspólne zakończenie) i „Darmową konsultacją” (→ „Bezpłatna konsultacja”). „Sklep, który zarabia od pierwszego dnia” to obietnica wyniku - pokaż właścicielowi z propozycją. Bez wymyślonych liczb sprzedaży. Treści przykładowego sklepu w kadrze („Darmowa dostawa od 200 zł”, „Zwroty 30 dni”) nie mogą wyglądać jak obietnice Avenly;
- **termin realizacji tylko po potwierdzeniu właściciela** (do właściciela);
- bursztyn na czerni: sprawdź kontrast drobnego tekstu w akcencie (AA) - drobny tekst raczej jasny, bursztyn w liniach, numerach i przyciskach scen;
- stary `ShopClient.tsx` (79 KB) i `shopDict` zostają na dysku, nieimportowane (źródło tekstów) - usuwa je koordynator za zgodą właściciela po zamknięciu podstrony.

**Pliki:** `app/(pl)/uslugi/strony-www/sklep-internetowy/*`, `app/(en)/en/services/websites/online-store/page.tsx`, `lib/i18n/uslugi/sklep-internetowy.ts`, `public/uslugi/sklep-internetowy/`.

### Chaty 8, 9 i 10 pracują jednocześnie - zasady

1. **Każdy rusza tylko swoje:** katalog podstrony, jej trasę EN, jej słownik, swoje assety, swoje notatki i swój wiersz statusu w tabeli „Przydział”.
2. **`app/(pl)/uslugi/_usluga/*` (szkielet) i `strony-www/one-page/*` (zamknięta podstrona) są tylko do czytania i używania.** Ze szkieletu importujesz; z `one-page/` nic nie importujesz - wzorce (kadr, film na `usePin`, stos, rysunki ze scenkami, głębia kart, zakres z pokazem) kopiujesz do swojego katalogu z własnym prefiksem i dopasowujesz. Potrzebujesz innego zachowania szkieletu? Nadpisz styl we własnym pliku pod własną klasą korzenia (np. `.sf .sv-title { … }`) albo zrób lokalny komponent, a propozycję zmiany zapisz w notatkach („Propozycje do szkieletu”) - wprowadza ją koordynator po fali 2.
3. **Drabina bez spotkań:** na górze swoich notatek prowadź trzy linijki „Co ma moja podstrona” (liczba przypiętych scen, interakcje, tło, liczba sekcji). Przed każdą rundą propozycji przeczytaj te linijki w notatkach dwóch pozostałych chatów. **Każda z trzech podstron ma być efektowna na swoim poziomie** (zasada właściciela w „Hierarchii podstron usług”): firmowa i sklep wyraźnie bogatsze od one-page, na miarę wyraźnie bogatsza od obu. Własne tło z interakcją i łamanie układu szkieletu zostają dla chatu 9.
4. **Żeby podstrony nie wyszły bliźniacze:** firmowa pokazuje strukturę (wiele podstron, menu, kamera między podstronami), na miarę pokazuje nastrój (kolor, ruch, gest), sklep pokazuje zakup (koszyk, płatność, paczka, elementy do kliknięcia). Nie bierz motywu innej podstrony. Przykładowa strona klienta w kadrze - każdy projektuje własną (inna firma, inna paleta, inny układ), nie kopię `site.tsx` z one-page.
5. **Zakończenie, linia dowodów i przycisk są wspólne** (szkielet, słowa właściciela). Zdanie zakończenia dopasuj do usługi jednym słowem („…a dopasujemy stronę do Twojego biznesu”); większa zmiana tylko na prośbę właściciela.
6. **Serwer :3001 jest jeden, a przeglądarki w tle nie uruchamia nikt** (zasada właściciela 2026-10-04, sekcja „Bez weryfikacji w trakcie pracy”): trzy chaty ze zrzutami naraz zamulały komputer. Zrzuty i testy tylko na sygnał właściciela, pojedynczo; profil Chrome i zrzuty we własnym scratchpadzie, usuwane po testach (dysk: 23 GB wolne, stan 2026-10-07).
7. **Decyzja właściciela, która dotyczy także innych podstron** (termin, zakończenie, wspólny element): zapisz w swoich notatkach z dopiskiem „dotyczy też chatów 8 / 9 / 10”.

### CRM i chatboty - inne usługi, inne podstrony (decyzja właściciela 2026-10-04)

Właściciel: „CRM i chatboty mają być inne, bo to inna usługa (…) jakoś ciekawie, fajnie”. One-page, firmowa, na miarę i sklep sprzedają **stronę**, więc pokazują stronę klienta w kadrze i prowadzą po niej kamerę. System CRM to **narzędzie do pracy**, chatbot to **rozmowa**. Ich podstrony nie są piątym i szóstym odcinkiem tego samego filmu.

> **Korekta po rundach (decyzje właściciela 2026-10-04 → 2026-10-06, ważniejsze niż punkty niżej - te zostają jako pierwotne zlecenie):**
> - **Pełna podstrona i kilka wersji każdej sekcji od pierwszej rundy, na kinowym poziomie pozostałych podstron** („rób od razu kilka wersji każdej sekcji i zrób więcej sekcji, ale też żeby dorównywało poziomowi i cinematic jak reszta podstron”) - przypięte sceny, kamera, skala, narrator; sama interakcja w płaskim układzie to za mało. Punkt 3 „Pierwszych kroków” (tylko pierwszy ekran każdego pomysłu) już nie obowiązuje.
> - **CRM bez sekcji do klikania** („fajne pomysły generalnie, ale pierwszą zrób o wiele ładniej i bardziej cinematic i nie rób interaktywnych”) - zdanie „do użycia, nie do oglądania” nie dotyczy CRM: wszystkim steruje przewijanie. Na chatbotach kliknięcie zostało jako dodatek (przycisk „Przetestuj na sobie” otwiera prawdziwy czat), sceny prowadzi przewijanie.
> - **Bez lecących linii światła, kurtyn i zamiany szkieletu w interfejs** - rzeczy pojawiają się „rozejściem” (kilka mniejszych kłębów, które rosną i zlewają się od lewej do prawej; generator `scripts/crm-bloom.mjs`).
> - **Odsłona w scenie bez przypięcia rusza przy wejściu elementu na ekran i gra do końca na czas** - nie może być elementu widocznego w całości, a odsłoniętego w części.
> - **AI oraz widok / portal klienta tylko jako opcje, nazwane wprost** - zdanie typu „jeśli chcesz, AI zrobi…” właściciel czyta jak zapewnienie; role w CRM pokazują tylko ludzi z firmy.
> - **Ruch bez odbicia** (chatboty: „usuń ten bounce”) - element dojeżdża i staje; drobne karty interfejsu z tego samego materiału co scena.
> - Słowo „szyty” nie pojawia się w tekstach („frajersko brzmi”) - piszemy „zbudowany”.
> - Stan obu podstron: wiersze chatów 11 i 13 w tabeli „Przydział”.

**Co to znaczy dla chatów 11 i 13:**
- **Nie bierzesz wzorca stron WWW.** Bez kadru z przykładową stroną klienta, bez filmu „droga klienta przez stronę”, bez stosu kart z rysunkami jako głównego układu i bez kolejności sekcji z one-page. Ktoś, kto przeklikał cztery podstrony stron, ma na Twojej od pierwszego ekranu poczuć, że wszedł w inny rodzaj usługi.
- **Podstrona jest próbką produktu - do użycia, nie do oglądania.** Na podstronie CRM odwiedzający dotyka działającego systemu, na podstronie chatbotów rozmawia. To jest tutaj „ciekawie i fajnie”: pomysł i interakcja, nie kolejny efekt przewijania.
- **Wspólny zostaje tylko język marki:** czerń luksusowa, ostre linie, Inter, nagłówek-zdanie z kropką w kolorze podstrony, wejście z czerni, biały przycisk „Bezpłatna konsultacja”, zakończenie „Zacznijmy od rozmowy.”, motywy ze świata strony głównej. Klient nadal ma się dowiedzieć, co dostaje i kiedy (zakres i termin), ale forma jest Twoja. Ze szkieletu `_usluga/` bierzesz to, co pasuje (`ServiceShell`, `ServiceHead`, `ServiceEnding`, `Dock`, `usePin` / `useFrame`), środek układasz po swojemu; tło to mgławica szkieletu albo własne (`sky={false}`).
- **Runda 1 = 3-5 naprawdę różnych pomysłów na CAŁĄ podstronę,** nie tylko na scenę główną - tu kierunek nie jest jeszcze wybrany. Każdy pomysł to inna odpowiedź na pytanie „jak dać odwiedzającemu spróbować tej usługi”. Jeden z nich może być pierwotną narracją podstrony w nowym języku.
- **Skala:** obie podstrony na poziomie strony firmowej i sklepu - wyraźnie bogatsze niż one-page, tylko mierzone interakcją i pomysłem, nie liczbą ujęć kamery.
- **CRM i chatboty nie mogą wyjść bliźniacze.** CRM = panel, dane, porządek, system robi robotę za ludzi. Chatboty = rozmowa, język, charakter asystenta. AI jest w obu: w CRM jako opcja („na życzenie”), w chatbotach jako sam produkt. Podstrona CRM nie robi z okna czatu głównej sceny, podstrona chatbotów nie robi głównej sceny z panelu.
- **Decyzje właściciela z fali 2, które obowiązują także tutaj** (szczegóły w notatkach chatów 8-10): przykładowy interfejs w palecie podstrony (czerń, biel, akcent - bez pasteli) i wyraźnie przykładowy; w scenie jedno zdanie i jedno miejsce akcji naraz, bez podpisów rozrzuconych po ekranie; przejścia spokojne, z postojami; karty z obrazem zamiast list nazw; przykład ma wyglądać jak zrobiony dla konkretnej firmy, nie jak szablon.
- **Teksty:** jak w fali 2 - zdania, które działają, bierzesz ze starego słownika podstrony; obietnice bez pokrycia i żargon pokazujesz właścicielowi w tabeli „było → jest”. Nowy układ wymaga nowych zdań - piszesz je w tonie Oferty.

**Pierwsze kroki (chaty 11 i 13, zamiast wspólnych kroków fali 2):**
1. Lektura: `PRODUCT.md` (cały), ta sekcja i sekcja swojej podstrony, „Standard jakości”, „Jak pracować z właścicielem”, `docs/podstrony/usluga-one-page.md` (tylko rozdziały o szkielecie i decyzjach właściciela - żeby znać język, nie żeby kopiować sceny), rozdziały „Decyzje właściciela” w notatkach chatów 8, 9 i 10.
2. Poznaj z kodu obecną wersję swojej podstrony (stary `*Client.tsx` i słownik) oraz rysunek i scenkę swojej usługi w Ofercie (`components/sections/services/drawings.tsx`). Spisz w notatkach, co wartościowe, co łamie zasady, i teksty pierwotnej wersji.
3. Zbuduj rundę 1: **3-5 różnych pomysłów na całą podstronę** w panelu na dole ekranu (`Dock`). Na tym etapie wystarczy pierwszy ekran i główna interakcja każdego pomysłu - reszta podstrony po wyborze.
4. Napisz właścicielowi, co jest do obejrzenia (adres na :3001, nazwy pomysłów w panelu, po jednym zdaniu o każdym), i czekaj na wybór. Bez przeglądarki w tle, zrzutów i testów (sekcja „Bez weryfikacji w trakcie pracy”).
5. Po wyborze: cała podstrona, teksty PL i EN, telefon równie dobry jak komputer (dotyk zamiast kursora), ograniczony ruch, bez JS, sprzątanie propozycji, notatki, status w tabeli.

### Chat 11 - System CRM (hasło: „CRM”) - inna usługa: narzędzie

**Zadanie:** przebudowa podstrony `/uslugi/strony-www/system-crm` (EN `/en/services/websites/crm-system`). Adres zostaje w kategorii stron WWW (SEO), ale podstrona ma własny pomysł. Prefiks CSS `cr-`, kolor „niebo” (przychodzi z adresu), notatki `docs/podstrony/usluga-system-crm.md`.

**Sedno usługi (teksty Oferty, zaakceptowane 2026-09-28):** „Koniec z arkuszami i karteczkami. Całą firmę widzisz w jednym systemie szytym pod Twój proces, a na życzenie AI przejmie żmudne zadania.” Punkty: Każdy widzi to, co powinien · Spięty z pocztą i kalendarzem · Opcjonalnie automatyzacje AI. Scenka: „Wpada zapytanie i nic już nie ginie.” → „Jeśli chcesz, AI zrobi ręczną robotę za Ciebie.” → „Klient dostaje maila, a Ty masz wolną głowę.” Dowody z realizacji: aplikacja klubowa RKS (składki, kalendarz treningów, obecności, komunikacja) i panel zamówień w sklepie Kardysia.

**Punkty wyjścia (pomysły do rozwinięcia, nie lista do odhaczenia):**
- **Z bałaganu w system:** arkusz, karteczki, skrzynka i telefon leżą rozrzucone po ekranie, a ruch odwiedzającego zbiera je w jeden panel - dosłownie „koniec z arkuszami i karteczkami”.
- **Działający mini-system:** wpada zapytanie, odwiedzający sam przesuwa je między etapami, przypisuje osobę, odhacza zadanie, a system odpowiada (powiadomienie, mail do klienta, wpis w kalendarzu).
- **Każdy widzi swoje:** przełącznik ról (właściciel / pracownik / klient) - ten sam system, trzy różne widoki.
- **Szyty pod Twój proces:** odwiedzający wybiera branżę albo układa własne etapy, a panel przebudowuje się pod niego na jego oczach.
- **Z AI i bez:** przełącznik pokazuje, co system robi sam z siebie, a co dochodzi dopiero „na życzenie”.

**Na co uważać:**
- **AI to opcja** („na życzenie”, „opcjonalnie”), nigdy pewnik - PRODUCT.md, „Co obiecujemy w ofercie”;
- dane w panelu przykładowe i wyraźnie przykładowe: bez nazw prawdziwych klientów i bez wymyślonych wyników („+40% sprzedaży”);
- stary słownik (`lib/i18n/uslugi/system-crm.ts`) i `AppWebClient.tsx` są źródłem tekstów, ale etapy procesu mają żargon i obietnice do pokazania właścicielowi: „Klikalne makiety w Figmie. Testujesz przepływy użytkownika”, „Automatyczne testy jednostkowe i integracyjne”, „ERP”, „CI/CD”, „Deploy & wsparcie”;
- kolor „niebo” jest blisko niebieskiego marki - akcent w liniach, punktach i stanach, bez pastelowego błękitu w tekście i bez zalanych teł;
- telefon: panel ma być używalny palcem (własny układ na wąski ekran), a nie pomniejszona makieta z pismem 7 px;
- **do właściciela:** termin realizacji; czy wolno powiedzieć, że Avenly sama pracuje na własnym CRM (mocny dowód, ale bez pokazywania prawdziwych danych).

**Pliki:** `app/(pl)/uslugi/strony-www/system-crm/*`, `app/(en)/en/services/websites/crm-system/page.tsx`, `lib/i18n/uslugi/system-crm.ts`, `public/uslugi/system-crm/`.

### Chat 13 - Chatboty AI (hasło: „chatboty”) - inna usługa: rozmowa

**Zadanie:** przebudowa podstrony `/uslugi/automatyzacje-ai/chatboty-ai` (EN `/en/services/ai-automation/ai-chatbots`). Prefiks CSS `ch-`, kolor pomarańczowy (przychodzi z adresu), notatki `docs/podstrony/usluga-chatboty-ai.md`.

**Sedno usługi (teksty Oferty, zaakceptowane 2026-09-28):** „Twój najlepszy sprzedawca pracuje także w nocy. Asystent AI zna Twoją ofertę, odpowiada klientom od razu i przekazuje Ci gotowe zapytania.” Punkty: Zna Twoją ofertę na pamięć · Rozmawia w wielu językach · Gotowe zapytania w skrzynce. Scenka: „Klient pyta o ofertę o drugiej w nocy.” → „Asystent odpowiada w kilka sekund, konkretnie.” → „Rano gotowe zapytanie czeka w Twojej skrzynce.” Dowód: prawdziwy asystent Avenly w rogu każdej strony.

**Punkty wyjścia (pomysły do rozwinięcia, nie lista do odhaczenia):**
- **Podstrona, która sama jest rozmową:** zamiast przewijać sekcje, odwiedzający pyta (albo wybiera gotowe pytanie), a strona odpowiada treścią - co asystent umie, jak wygląda wdrożenie, co dostajesz.
- **Zapytaj o swoją branżę:** odwiedzający wybiera, czym się zajmuje (salon, warsztat, sklep, gabinet), a przykładowa rozmowa odgrywa się dla jego firmy.
- **Druga w nocy:** firma śpi, klient pisze, asystent odpowiada; rano w skrzynce czeka gotowe zapytanie - scenka Oferty rozegrana na całej podstronie.
- **Jedna rozmowa, kilka języków naraz** - „Rozmawia w wielu językach” pokazane, nie napisane.
- **Wie, czego nie wie:** pytanie spoza wiedzy, a asystent nie zmyśla, tylko przekazuje klienta człowiekowi (najmocniejszy wyróżnik ze starej wersji).
- **Prawdziwy czat jako bohater:** przycisk w treści otwiera asystenta z rogu strony (`window.dispatchEvent(new Event('avenly:open-chat'))`) - odwiedzający sprawdza produkt na sobie.

**Na co uważać:**
- okna czatu (`components/chatbot/`) nie ruszasz - tylko je otwierasz zdarzeniem. Rozmowa odgrywana w scenie ma być wyraźnie przykładem, nie drugim czatem udającym prawdziwy;
- strona jest statyczna: **żadnych nowych wywołań API ani backendu** - scena to z góry napisany scenariusz albo prawdziwy czat z rogu;
- liczby tylko obronne (odpowiedź w ok. 2 s), bez „+X% sprzedaży”, bez nazw modeli („GPT”);
- żargon ze starej wersji („leady”, „kwalifikuje potrzeby”) → „zapytania”, jak w Ofercie;
- **do właściciela** (obietnice ze starego tekstu - czy mają pokrycie): integracje „CRM, e-mail, WhatsApp, kalendarz, n8n”, panel ze statystykami rozmów, „co miesiąc dostrajamy”, sekcja „Liczby”; termin wdrożenia;
- wnioski z usuniętej sekcji „Asystent AI” na stronie głównej (`docs/sekcje/asystent-ai.md`): sama makieta rozmowy była „miałka, bez duszy”; dusza = asystent jako postać i rozmowa o biznesie odwiedzającego, a pokaz ma się mieścić w wysokości ekranu;
- pomarańcz na czerni: drobny tekst raczej jasny, pomarańcz w liniach, dymkach i przyciskach scen (kontrast AA).

**Pliki:** `app/(pl)/uslugi/automatyzacje-ai/chatboty-ai/*`, `app/(en)/en/services/ai-automation/ai-chatbots/page.tsx`, `lib/i18n/uslugi/chatboty-ai.ts`, `public/uslugi/chatboty-ai/`.

## Chat 1 - O nas, dokończenie (hasło: „O nas”)

Podstrona czeka na dwa wybory właściciela: **wejście** (Kropka / Planeta / Linia) i **układ** (Korekta / List / Bez pośredników / Manifest). Oba przełączniki są w panelu na dole ekranu na `/o-nas`.

**Pierwsze kroki (robisz od razu):**
1. Lektura: `docs/podstrony/o-nas.md` (cały stan, pliki, pułapki), opis zadania w `docs/praca-rownolegla-etap-2.md` (sekcja „Chat 1 - O nas”).
2. Sprawdź jednym `curl`, że `/o-nas` na :3001 odpowiada (bez przeglądarki - sekcja „Bez weryfikacji w trakcie pracy”).
3. Przypomnij właścicielowi w jednej wiadomości, co czeka na wybór: adres `/o-nas` na :3001, trzy wejścia i cztery układy w panelu na dole ekranu, po jednym zdaniu o każdym. Czekasz na wybór.
4. Po wyborze: telefon równie efektowny jak komputer, szerokości 768 / 1024 / 1920 / 2560, ograniczony ruch, bez JS, EN, metadane w sentence case, usunięcie odrzuconych wariantów i przełączników, notatki. Przegląd zrzutami dopiero na sygnał właściciela.

Teksty O nas prowadzi ten chat (głos „my” - jedyny wyjątek od głosu korzyści). Do właściciela: podpis „Michał i Bartek, założyciele Avenly” i zdanie o powodzie założenia Avenly (propozycje chatu, niepotwierdzone).

**Pliki:** `app/(pl)/o-nas/*`, `lib/i18n/o-nas.ts`, `app/(en)/en/about-us/*`. **Notatki:** `docs/podstrony/o-nas.md`.

## Chat 0 - porządki i koordynacja (hasło: „porządki”)

Koordynator nie bierze podstrony. Jako jedyny edytuje dokumentację główną i pliki z listy „Zamrożone” (tylko w zakresie niżej), buduje i wdraża - **build i wdrożenie wyłącznie na wyraźne polecenie właściciela**.

**Pierwsze kroki (robisz od razu):** zacznij od punktu 1 (dokumentacja - nie koliduje z niczyją pracą), potem pokaż właścicielowi listę punktów 2-5 i zapytaj o kolejność. Przed zmianą pliku, którego używa działający chat (status 🔧 w tabeli), sprawdź, czy nie wejdziesz mu w drogę.

1. **Dokumentacja - ✅ zrobione 2026-10-07:** opisy Bloga, katalogu Usług i Realizacji są w `CLAUDE.md` (rozdziały „Blog”, „Katalog usług”, „Podstrona Realizacje”), tabela shaderów i drzewo tras odpowiadają stanowi kodu, historyczne rozdziały o starych podstronach usług są oznaczone, nowe zasady marki w `PRODUCT.md` (motywy z marki i strony głównej, bez prostokąta za nagłówkiem, telefon równie efektowny, typografia na telefonie, podstrona usługi jako film, makiety w palecie podstrony, rozejście zamiast linii światła, bez odbicia, nazwy usług), `progress.md` (log etapów 2-3, lista wdrożeń), `project_context.md`, `README.md`, `INSTRUKCJA-SEO.md`. **Zostaje po zamknięciu podstron w pracy:** pełne opisy pięciu podstron usług i O nas (dziś skrót „Podstrony usług w pracy - fala 2” w `CLAUDE.md` + notatki chatów).
2. **Mgławica - jeden moduł** zamiast dwóch kopii (różnica: wzmocnienie na ekranie pionowym z rundy 18 Realizacji - do właściciela: czy katalog też je dostaje).
3. **Sprzątanie:** po zamknięciu podstron usług i za zgodą właściciela usunąć ich stare wersje (`CorporateWebsiteClient.tsx`, `DedicatedWebsiteClient.tsx`, `ShopClient.tsx`, `AppWebClient.tsx`, `ChatbotsAIClient.tsx`) razem ze starymi słownikami - dopóki podstrona jest w pracy, są źródłem tekstów; nieimportowane pliki chatbotów (`scena.*`, `pytania.*`, `wiedza-warstwy.*`, `wiedza-srodek.*`, `wiedza-przypisy.*`) i wersje sekcji strony firmowej poza przełącznikiem (`map.tsx`: Wieża / Mapa / Konstelacja / Menu) - po decyzji właściciela; `app/(pl)/o-nas/parts.tsx.tmp.14912.677fcb60cdbf` (plik tymczasowy po przerwanym zapisie); martwy kod po usunięciu usługi UI/UX (lista w `docs/podstrony/copy.md` i w `CLAUDE.md`, „Niespójności w danych”); `components/templates/ServiceTemplate.tsx`, `components/AvenlyAICta.tsx`, `components/ProcessAccordion.tsx` (używały ich tylko stare wersje); zrzuty z rund w `docs/podstrony/zrzuty/` (7,6 MB) do usunięcia po zamknięciu podstron; skrypty zrzutów z `docs/podstrony/realizacje-skrypty/` do `scripts/`; nieużywane pola słowników (dawne pola Oferty w `services.ts`, `allServices` w `catalogDict`, martwe opisy w `app/data/services.ts`); martwy `Portfolio.tsx`; nieaktualne komentarze w `globals.css` i `blog-teaser/*`. `app/(pl)/realizacje/_rl/dock.tsx` **zostaje** do końca etapu 3 jako wzór panelu przełączników. Kopie usuniętych wersji: `docs/archiwum/` (UI/UX, sekcje CRM).
4. **Drobne błędy i propozycje zgłoszone przez chaty:** stopka nie rozpoznaje `/kontakt/` ze slashem (przycisk nie przewija do formularza); propozycja łagodniejszej końcówki przewijania w `SmoothScrolling` (do właściciela - zmienia odczucie całej strony). **Do szkieletu `_usluga/` po fali 2:** `usePin` liczy z `window.innerHeight` (drgnięcie scen przy chowaniu paska adresu na telefonie - propozycja: stała miara `svh`) i mógłby zwracać „czy scena jest na ekranie”; `Steps` pokazuje na komputerze trzy podpisy naraz (sklep i chatboty mają lokalnego narratora z jednym zdaniem - przenieść do szkieletu); `ServiceHead` bez miejsca na drugi przycisk i na łamanie nagłówka w zadanym miejscu; kadr, silnik rysunków ze scenkami, głębia kart i stos są już w czterech kopiach - wynieść wspólne części; `createChoice` czyta `localStorage` także na produkcji. **Zamrożona strona główna:** rysunek i legenda sklepu w Ofercie po decyzji o płatności przez przekierowanie; twarda spacja w „u Ciebie”; okno czatu mogłoby przyjmować pytanie startowe z podstrony chatbotów (do właściciela).
5. **Do właściciela:** przycisk „Darmowa Wycena” w nawigacji (zgłosiło kilka chatów: łamie zasadę jednego CTA), puste `/uslugi/marketing*`, commit do git (praca od czerwca jest niezacommitowana), terminy realizacji na podstronach usług (firmowa, Strona interaktywna - dziś zaślepki), wartość opcji formularza `Strona Szyta na Miarę` (temat maila) po zmianie nazwy usługi, zmiana adresu Strony interaktywnej po pracy równoległej (z 301), baza wiedzy i szybkie odpowiedzi chatbota (Supabase `chatbot_config`, prompt w n8n) - mogą dalej wymieniać „Projekt UI/UX” i „stronę szytą na miarę”.
6. **Po fali 1:** przenieść decyzje z `docs/podstrony/copy.md` i `usluga-one-page.md` do dokumentacji (lista w notatkach one-page, rozdział „Do dokumentacji głównej”; krótki opis szkieletu i one-page chat 7 dopisał do `CLAUDE.md` 2026-10-02 na polecenie właściciela). Statusy fali 2 zmienione 2026-10-02 przez chat 7 na polecenie właściciela (⛔ → ⏳). Stary `OnePageClient.tsx` i `onePageDict` usunięte, termin „3-5 dni” potwierdzony (2026-10-02). Do zrobienia przy okazji: przegląd końcowy one-page (prawdziwy telefon, bez JS, fokus klawiatury).
7. **Build i wdrożenie** na polecenie właściciela (konto wranglera Avenly - patrz „Deploy flow” w `CLAUDE.md`). Konsolidacja końcowa - ostatnia sekcja tego pliku.

## Zamrożone: tych rzeczy nie ruszamy

Cała strona główna (sekcje, `HomeClient.tsx`, `lib/i18n/home/*`, `components/sections/**` - w tym `services/drawings.tsx` i `blog-teaser/*`), Navbar, stopka, okno czatu, baner cookies, `AppShell` i oba root layouty, `SmoothScrolling`, `components/ui/*`, `components/Reveal.tsx`, `components/AvenlyAICta.tsx`, `components/utils/*`, `lib/service-theme.ts`, `lib/seo-data.ts`, `lib/schemas.ts`, `lib/i18n/locale.ts`, `app/sitemap.ts`, `app/globals.css`, `public/_headers`, `public/_redirects`. Wygląd i kod zamkniętych podstron (`/uslugi` z kategoriami, `/realizacje`, `/kontakt`, `/blog`) - chat 6 zmienia wyłącznie teksty trzech pierwszych, blog zostaje w całości bez zmian. Podstrony usług poza tą, którą masz w przydziale - w tym **zamknięta one-page (`strony-www/one-page/*`, `lib/i18n/uslugi/one-page.ts`) i wspólny szkielet `app/(pl)/uslugi/_usluga/*`** (szkielet tylko używasz, z one-page tylko czytasz wzorce). Uważasz, że coś z tej listy wymaga zmiany? Zapisz propozycję w notatkach („Propozycje dla zamrożonych części”) i powiedz o niej właścicielowi - wprowadza ją koordynator.

## Zasady, dzięki którym chaty sobie nie przeszkadzają

1. **`app/globals.css` - nie edytujesz.** Style trzymasz we własnym pliku CSS obok komponentu, z własnym prefiksem. Klasy i tokeny z `globals.css` (`.im-title`, `.im-accent`, `.im-lead`, `--brand`, `--brand-hi`) wolno używać, nie zmieniać.
2. **Słowniki:** tylko swoje pliki z przydziału, zawsze PL i EN. Pola dopisujesz w tym samym pliku, w typie słownika.
3. **Wersja EN** jest częścią zadania - każdą zmianę tekstu i układu robisz od razu także w słowniku i trasie EN (przegląd w przeglądarce dopiero przy weryfikacji na sygnał właściciela).
4. **SEO zostaje:** metadane z canonical i hreflang (`i18nAlternates`), dane strukturalne z builderów `lib/schemas.ts` (`ServicePageSchema` na podstronach usług), jeden h1, kolejność h1 → h2 → h3. Adresy stron i `slug` bez zmian.
5. **Wspólne komponenty tylko używasz.** Potrzebujesz innego zachowania - zrób lokalny komponent w swoim katalogu.
6. **Bez nowych zależności** (`package.json`, `npm install`) bez zgody właściciela.
7. **Assety** w `public/<twoja-podstrona>/`. Obrazów w `public/portfolio/` nie podmieniasz pod tą samą nazwą (cache 30 dni).
8. **Dokumentacja:** nie edytujesz `CLAUDE.md`, `progress.md`, `project_context.md`, `README.md`, `PRODUCT.md` ani tego pliku (poza wierszem statusu swojego zadania w tabeli „Przydział” oraz linią w tabeli wdrożeń w sekcji „Stan”, gdy wdrażasz na polecenie właściciela - narzędziem Edit). Prowadzisz własne notatki w `docs/podstrony/` (szablon niżej). Nowa zasada marki od właściciela = wpis z dopiskiem „do PRODUCT.md”. Wyjątek: koordynator.
9. **Git:** bez commitów. **Nigdy** `git checkout`, `git restore`, `git stash`, `git reset`, `git clean` - w jednym drzewie roboczym pracuje kilka chatów. Do odczytu: `git show`, `git log`, `git diff -- <twoje pliki>`.
10. **Serwer deweloperski Avenly działa na http://localhost:3001** (na :3000 stoi inny projekt - RKS; sprawdź tytuł strony, zanim zaczniesz testować). Nie uruchamiasz drugiego, nie zabijasz procesów `node`, nie kasujesz `.next`. Serwer nie odpowiada? Uruchom `npm run dev -- -p 3001` w tle tylko wtedy, gdy port 3001 jest wolny, i zapisz to w notatkach. Wszystkie podstrony poza `/` zwracają 404 = uszkodzony cache Turbopacka - naprawa (stop, usunięcie `.next/dev`, start) tylko za zgodą właściciela.
11. **Przeglądarka w tle, zrzuty i testy tylko na sygnał właściciela** (sekcja „Bez weryfikacji w trakcie pracy”). Gdy sygnał padnie: jeden profil Chrome na sesję w scratchpadzie, losowy port debugowania, krótka seria, po niej usuwasz profil i zrzuty. **Dysk:** 23 GB wolne (91% zajęte, stan 2026-10-07; 2026-10-04 było 17 GB) - zrzutów nie odkładasz w repo.
12. **Bez `npm run build` i bez wdrożeń z własnej inicjatywy** - robi je koordynator. **Wyjątek: wyraźne polecenie właściciela wydane w Twoim chacie** („wrzuć na avenly.pl”) - wtedy `npm run build` i wdrożenie z profilu wranglera Avenly (`CLAUDE.md`, „Deploy flow”), sprawdzenie produkcji `curl`-em i **jedna linia w tabeli wdrożeń w sekcji „Stan”** (data, identyfikator, co doszło). Pamiętaj, że wdrożenie niesie CAŁY bieżący stan repozytorium, także cudze podstrony w pracy.
13. **`tsc` i ESLint też dopiero przy weryfikacji na sygnał właściciela**, i tylko na swoich plikach (`npx eslint <pliki>`); błędy `tsc` w cudzych plikach ignoruj, Twoje mają być wtedy czyste.
14. **Zmiany plików:** skryptami (node, sed) tylko własne pliki. Pliki wspólne (`lib/i18n/services.ts`, `app/data/*.ts`, `lib/i18n/projects.ts`) wyłącznie narzędziem Edit. Po zapisie CSS skryptem „dotknij” plik narzędziem Edit (Turbopack potrafi go nie zauważyć).
15. **Chat 6 i chaty przebudowy nie spotykają się w plikach:** chat 6 ma słowniki zamkniętych podstron, chaty 7-13 słowniki swoich podstron usług. Wspólny punkt to `lib/i18n/services.ts` (Oferta) - zmienia go tylko chat 6 i tylko za zgodą właściciela.

## Standard jakości

Właściciel ocenia każdą podstronę na tle strony głównej i zamkniętych podstron (`/uslugi`, `/realizacje`, `/kontakt`).

- **Czerń luksusowa:** tło `#050505`, karty w głębokiej neutralnej czerni z ostrym refleksem u góry, ostre włosowe linie, jeden kolor marki `--brand` `#3b82f6` (`--brand-hi` `#60a5fa`) jako punkt światła. Kolor motywu podstrony usługi to kodowanie treści - w akcentach, nie jako zalane tło.
- **Bez:** tekstu z gradientem, pigułek z wersalikami i pulsującą kropką, rozmytych kul światła, `backdrop-filter` i `GlassEdge`, cieni i prostokątów za tekstem, kart unoszących się lub świecących po najechaniu, reflektora za kursorem, wielkiego logotypu, widocznej ścieżki i linków „Wróć”.
- **Dusza:** każda podstrona ma jeden żywy motyw wyrastający z jej treści i małą historię zrozumiałą bez tłumaczenia (PRODUCT.md, Design Principles 12).
- **„N wersji” = N różnych scen.** Przestawienie parametrów jednej sceny nie jest nową propozycją.
- **Ruch:** płynnie (ease-out, od 0,6 s wzwyż), nic nie „wskakuje”; stany ukryte przed wejściem bez przejść w drugą stronę (karta nie może mignąć gotowa, a potem się odsłaniać). **Bez odbicia** (właściciel 2026-10-05: „usuń ten bounce”): bez przestrzelenia skali przy wejściu, kołysania w spoczynku i cofania ruchu na końcu sceny - element dojeżdża i staje.
- **Pojawianie się rzeczy:** nowych odsłon nie rób lecącą linią światła ani kurtyną, która zamienia szkic w interfejs albo A w B (właściciel na podstronie CRM 2026-10-05; przyjęte też na Stronie interaktywnej; odsłona szkicu na zamkniętej one-page zostaje) - elementy wchodzą „rozejściem”: kilka mniejszych kłębów, które rosną i zlewają się wzdłuż osi. W scenie bez przypięcia odsłona rusza przy wejściu elementu na ekran i gra do końca na czas - nie może być elementu widocznego w całości, a odsłoniętego w części.
- **Scena do ogarnięcia przez przeciętnego klienta:** jedno zdanie narratora i jedno miejsce akcji naraz, bez podpisów rozrzuconych po ekranie; kamera między ekranami powoli, z postojami; pokaz w kadrze zakresu idzie w jedną stronę.
- **Makiety w kadrach:** w palecie podstrony (czerń, biel, włosowe linie, akcent), bez pasteli, podpisane jako przykład i zrobione jak dla konkretnej marki, nie jak szablon; bez czarnych nakładek odcinających tło równą krawędzią.
- **Telefon równie efektowny jak komputer.** Właściciel sprawdza telefon osobno. Wersję na telefon piszesz od razu (nie „potem”), a przy weryfikacji na sygnał właściciela sprawdzasz ją na 390 × 844 (tło oglądane też bez treści) i porównujesz z 1440 × 900. Shadery strojone na szerokim ekranie na pionowym wychodzą blado - gęstszy wzór i jaśniejszy blask tylko dla ekranu pionowego. Typografia na telefonie: wyważone linie, bez wiszących słów, twarde spacje, przewijane paski gasną przy krawędzi zamiast ucinać słowo.
- **Ograniczony ruch i brak JS:** wszystko widać od razu, animowane historie jako statyczna lista kroków.
- **Wydajność:** WebGL wg zasad z `CLAUDE.md` (start po idle, pauza poza ekranem i przy ukrytej karcie, ~30 fps w spoczynku, budżet pikseli, `loseContext()` w sprzątaniu, zapas bez WebGL). Przypięte sceny bez `overflow-x-hidden` na przodkach (`overflow-x-clip`).
- **Dostępność:** kontrast AA (tekst drugoplanowy `#94a3b8` lub jaśniejszy), `aria-label` na przyciskach z samą ikoną, cele dotyku ≥ 44 px, widoczny fokus, automat da się zatrzymać (WCAG 2.2.2).

## Jak pracować z właścicielem

- Właściciel **wybiera z propozycji**: przełączniki tylko w `npm run dev` (`createChoice('avenly-<podstrona>-<co>', …)` z `components/utils/proposals.tsx`, klucz unikalny). Po wyborze usuwasz pozostałe warianty, ich style i przełącznik.
- **Przełączniki zawsze poza stroną, w panelu na dole ekranu** (zasada właściciela 2026-09-30): jeden stały, zwijany panel przyklejony do dołu okna (portal do `<body>`, `position: fixed`), nigdy w treści strony. Na telefonie zostawia wolny prawy dolny róg (bąbel czatu). Wzór: `app/(pl)/realizacje/_rl/dock.tsx` + `.rl-dock` w `realizacje.css` - robisz własną kopię z własnym prefiksem (chat 7 w `_usluga/`, dla całej fali 2).
- **Właściciel ogląda efekt sam, w swojej przeglądarce** - po każdej rundzie podajesz adres na :3001, co się zmieniło, gdzie patrzeć i który przełącznik wybrać. Zrzutów nie robisz (sekcja „Bez weryfikacji w trakcie pracy”); zrzuty 1440 × 900 i 390 × 844, ograniczony ruch i EN dopiero na jego sygnał. Właściciel przysyła własne zrzuty z uwagami - pracujesz na nich.
- Odpowiadaj po polsku, konkretnie, bez żargonu. Decyzje zapisuj w notatkach z cytatem i datą.
- Właściciel pisze krótko. Gdy wiadomość to tylko wybór („wybieram 2”, „to drugie”), wykonujesz następny krok z „Pierwszych kroków” bez dopytywania.

## Szablon notatek: `docs/podstrony/<nazwa>.md`

```markdown
# <Zadanie> - notatki chatu <nr> (praca równoległa, etap 3)

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

## Weryfikacja (dopiero na sygnał właściciela)
- niesprawdzone: ... (uzupełniasz po każdej rundzie)
- po sygnale: zrzuty (1440, 390, reduced motion, EN) / eslint / ...
```

Chat 7 dodatkowo: rozdział „Szkielet podstrony usługi”. Chat 6: tabele „było → jest” dla każdej podstrony. Chaty fali 2: na górze notatek trzy linijki „Co ma moja podstrona” (przypięte sceny, interakcje, tło) i rozdział „Propozycje do szkieletu”.

## Konsolidacja końcowa (chat 0)

1. Po fali 2: pełne opisy 5 podstron usług i O nas do dokumentacji (dziś w `CLAUDE.md` jest skrót „Podstrony usług w pracy - fala 2”), usunięcie historycznych rozdziałów o starych podstronach (`GlassEdge`, scope cards, wireframe → blueprint, stary wiersz tabeli shaderów), usunięcie nieużywanych komponentów (`AvenlyAICta`, `ServiceTemplate`, `ProcessAccordion` z `process-accordion.ts` - dziś używają ich tylko stare, nieimportowane `*Client.tsx`) i wzoru panelu `_rl/dock.tsx`.
2. Przegląd całości: każda podstrona PL i EN na komputerze, tablecie i telefonie, ograniczony ruch, linki z katalogu, stopki, konstelacji hero i Oferty do podstron usług, formularz kontaktu (wysyłka testowa za zgodą właściciela).
3. `tsc` i ESLint całego projektu, `npm run build`, Lighthouse / PageSpeed (7 podstron usług miało najcięższe shadery - porównać przed i po).
4. Wdrożenie tylko za akceptacją właściciela. Do decyzji: commit do git, zakończenie pracy równoległej.
