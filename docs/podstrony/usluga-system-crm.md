# System CRM - notatki chatu 11 (praca równoległa, etap 3, fala 2)

> Zasada właściciela 2026-10-04 („zbyt laguje”): bez przeglądarki w tle, zrzutów, testów, `tsc` i ESLint w trakcie pracy. Zmiana oddawana od razu, właściciel ogląda sam na :3001. Weryfikacja dopiero na jego sygnał. Szczegóły: `PRACA-ROWNOLEGLA.md`, sekcja „Bez weryfikacji w trakcie pracy”.
>
> **Od koordynatora, 2026-10-07:** Twoje decyzje i propozycje są w dokumentacji głównej: korekta zlecenia w `PRACA-ROWNOLEGLA.md` (sekcja „CRM i chatboty”: pełna podstrona od pierwszej rundy, bez klikania, rozejście, odsłony na czas, AI i portal jako opcje), `PRODUCT.md` („Co obiecujemy w ofercie” pkt 4, Design Principles 16 i 19, Copy Voice 10 - bez „szyty”), `CLAUDE.md` (skrót podstrony, `scripts/crm-bloom.mjs`, płótno 2D sceny głównej). Propozycja `usePin` → `svh` jest na liście „Chat 0” (po fali 2). Wdrożenie `90723428` odnotowane; ostatnie wdrożenie całości: `a6a206db`. Każde kolejne wdrożenie na polecenie właściciela dopisz jedną linią do tabeli wdrożeń w planie (zasada 12).

## Co ma moja podstrona (dla chatu 13 - chatboty, żeby podstrony nie wyszły bliźniacze)
- **Inna usługa niż strony WWW:** bez kadru ze stroną klienta i bez drogi klienta przez stronę. Bohaterem jest narzędzie: przykładowy system wymyślonej firmy („Pracownia Dąb - meble na wymiar”: Ola - biuro, Marek - pomiary i montaż, Tomek - stolarnia). Okno systemu ma etykietę „Przykładowy system”, bez paska adresu przeglądarki.
- **Bez interakcji** (decyzja właściciela po rundzie 2): żadna sekcja nie wymaga klikania, najeżdżania, przeciągania ani wpisywania. Wszystkim steruje przewijanie.
- **Jeden sposób pojawiania się rzeczy: „rozejście”** - element odsłania się kilkoma mniejszymi kłębami gazu, które pojawiają się po kolei od lewej do prawej, rosną, dryfują i zlewają się. Bez lecących linii światła, kurtyn, zamiany szkieletu w interfejs, jednej plamy i jednego czoła.
- **Odsłony w scenach bez przypięcia grają na czas** od wejścia elementu na ekran i nigdy się nie cofają (właściciel: nie może być elementu widocznego w całości, a odsłoniętego w części).
- **Niczego nie obiecujemy „w każdym systemie”:** role pokazują tylko ludzi z firmy (bez widoku klienta), AI jest wprost opcją („AI to opcja, nie obowiązek.”) - zdanie typu „jeśli chcesz, AI zrobi…” właściciel czyta jak zapewnienie.
- **Sześć sekcji + zakończenie** (zakres i termin usunięte).
- **Czego NIE biorę:** okna rozmowy jako sceny (to chatboty).

## Stan (2026-10-05)
- **Wszystkie wersje wybrane, podstrona bez przełączników.** Czeka na obejrzenie przez właściciela i na sygnał do weryfikacji. **Nic z rund 3-4 ani z poprawek z 2026-10-05 nie było oglądane w przeglądarce** (tylko `curl`: PL i EN 200, wszystkie sekcje w HTML; jeden `tsc --noEmit` po sprzątaniu głównego słownika - 0 błędów w plikach podstrony; po późniejszych zmianach - telefon, wydajność, usunięcie wersji - `tsc` już nie był puszczany).
- Adres: http://localhost:3001/uslugi/strony-www/system-crm/ (EN: `/en/services/websites/crm-system/`).
- **Serwer deweloperski:** 2026-10-05 port 3001 był wolny (serwer nie działał po przerwaniu sesji) - uruchomiłem `npm run dev -- -p 3001` w tle zgodnie z zasadą 10.

### Sekcje
| # | Sekcja | Wersja (wybrana przez właściciela) | Pliki |
|---|---|---|---|
| 1 | Scena główna (pierwszy ekran + przypięta scena 360vh) | **Z punktów**: chmura punktów-gwiazd (canvas 2D; 1400 punktów, telefon 560) zbiera się w układ systemu, prawdziwe okno wchodzi rozejściem (odcinek 0,64-0,84), punkty gasną pod nim dopełnieniem tej samej maski. Ruch z bezwładnością (sprężyna `INERTIA_MS` 210 ms, dotyk 120 ms), w spoczynku wolne kołysanie i mruganie gwiazd | `hero-points.tsx`, `hero-points-field.ts`, `hero-points-system.tsx`, `hero-points.css` (`cr1c-`) |
| 2 | „Nic już nie ginie.” | **Kanały** (bez przypięcia): formularz, e-mail i telefon płyną torami do jednej listy; każdy wiersz odsłania się na czas i dostaje osobę, termin i potwierdzenie; okno = nagłówek + lista wisząca pod nim. To, co robi każdy CRM, bez słów jednej branży | `lead-channels.tsx`, `lead-kit.tsx`, `lead.css` (`cr7-`) |
| 3 | „Każdy widzi to, co powinien.” | **Klucz** (przypięta 300vh): klucz jedzie po szynie ról właściciel → biuro → pracownik → właściciel (tylko role wewnątrz firmy), widok następnej roli wchodzi rozejściem, kłódki modułów naprawdę się zamykają (otwarte 6 → 4 → 2 → 6), montaż odhacza się w ujęciu pracownika (`TICK` 0,66), u właściciela zmieniają się liczby | `eyes-key.tsx`, `eyes-ui.tsx`, `eyes.css` (`cr3-`), `roles.tsx` |
| 4 | Twój proces | **Bębny** (przypięta): napisy okna obracają się na kolejną branżę. Bez widocznego tytułu i opisu (h2 tylko dla czytników ekranu) | `reels.tsx`, `.cr-p-*` w `system-crm.css` |
| 5 | „Trzy ekrany to początek. System rośnie z Tobą.” | **W dół** (bez przypięcia): okno rośnie w dół piętrami; pasek stanu z licznikiem przyklejony nisko (`min(90% wysokości ekranu, wysokość - 92 px)`), treść piętra odsłania się na czas (1,1 s), gdy piętro wchodzi do okna. Mini-ekrany modułów nieruchome | `mods-down.tsx`, `mods-ui.tsx`, `mods.css` (`cr8-`) |
| 6 | „AI to opcja, nie obowiązek.” | **Tory** (przypięta 340vh): karty zadań z treścią; tor AI wchodzi rozejściem po włączeniu znacznika „Opcja: AI”, karta naprawdę jedzie, znak „Do akceptacji”, decyzje zostają jako „Twoja decyzja”; telefon: tory jeden pod drugim, karta jedzie w dół | `aiscene-lanes.tsx`, `aiscene-parts.tsx`, `aiscene.css` (`cr6-`) |
| - | Zakończenie | „Zacznijmy od rozmowy.” (szkielet) | - |

Usunięte wersje (kopie tekstowe sekcji 2 i 5 w `docs/archiwum/usluga-system-crm/`; wcześniejsze do odtworzenia z zapisów subagentów): sceny główne „Porządek”, „Jedno okno”; zlecenie „Tor”, „Historia”, „Trzy ekrany”; „Lejek”, „Karta klienta”; role „Trzy okna”, „Tryptyk”; proces „Przebudowa”, „Cztery układy”; moduły „Rośnie” (dwie odsłony), „Rzut”, „Konstelacja”, „Menu rośnie”; AI „Dwa dni”, „Do akceptacji”; zakres (Oś / Plan / Lista).

### Co warto obejrzeć w pierwszej kolejności (wszystko liczone z kodu, bez podglądu)
- **Rozejście w ruchu:** czy kłęby czytają się jak rozlewający się gaz; wszystkie elementy mają ten sam układ kłębów (może być widać przy kilku naraz); w małych elementach kłęby są drobne albo spłaszczone; odsłona kończy się ok. 0,9 postępu.
- **Scena główna:** bezwładność (czy nie wygląda na spóźnioną - `INERTIA_MS`), pusty środek pierwszego ekranu między odjazdem nagłówka a pierwszymi lądowaniami, kołysanie i mruganie, zgranie gaszenia punktów z kłębami okna. **Telefon:** tytuł h1 jest tu mniejszy niż na innych podstronach usług (`clamp(32px, 10.2vw, 54px)`, 2 linie zamiast 3) - świadoma cena za miejsce dla chmury, do decyzji właściciela.
- **„Kanały”:** wiersz startuje dopiero, gdy cały jest nad narratorem (`GAP` 16 px, telefon 8 px) - na niskim telefonie pusty pas nad narratorem do ok. 1/4 ekranu; styk nagłówka okna z pierwszym wierszem; telefon: nowy układ pod pion (karty źródeł u góry, tory w dół, lista na całą szerokość).
- **„Klucz”:** widok roli wchodzi zawsze od lewej; telefon: zwarty układ zależny od wysokości przypiętego ekranu (`@container`), poniżej 620 px wysokości scena stoi jako lista; **laptop z niskim oknem (100svh 560-700 px): okno pomniejszane do 0,6-0,83 - nieruszone, do zrobienia na życzenie.**
- **„Bębny”:** wejście w scenę bez nagłówka; telefon: etap i karta w jednym wierszu (dawny układ miał 763 px przy ok. 664 px miejsca i był ucinany).
- **„W dół”:** okno kończy się 12 px nad bąblem czatu; telefon: zwarty start (trzy paski), tabela „Kto co widzi” obrócona, kalendarz z samymi godzinami; pasek stanu przy chowaniu paska adresu.
- **„Tory”:** telefon (jazda w dół), przypięcie włączane z pomiaru `svh` (`data-pin`), poniżej 625 px wysokości scena stoi; pusta prawa połowa okna przed włączeniem opcji AI (decyzja kompozycyjna).
- **Narratorzy na telefonie:** w kilku scenach bez numeru w kółku poniżej 360-480 px (żeby zdanie miało 3 linie).
- **Przy chowaniu paska adresu** każda przypięta scena może drgnąć o ok. 1-3% postępu: `usePin` w szkielecie liczy z `window.innerHeight` (poza moimi plikami - propozycja niżej).
- **Doładowywanie scen:** kod sekcji poniżej pierwszego ekranu wchodzi po pierwszej bezczynności; do tego czasu sekcja pokazuje stan „przed” z CSS - sprawdzić szybkie przewinięcie tuż po wejściu na stronę.
- **EN:** dłuższe napisy mogą się łamać albo kończyć wielokropkiem.

### Do decyzji właściciela
1. Moduł „Portal klienta” w sekcji modułów („Klient sam sprawdza status swojego zlecenia.”) - opcjonalny moduł, ale pokazuje widok klienta; gotowa zamiana na moduł „Dokumenty”.
2. Kanał „E-mail” w „Kanałach” zakłada, że wiadomości z poczty trafiają do systemu same.
3. Mini-ekrany modułów nieruchome (subagent usunął razem z liniami także odhaczanie, kłódki i dorastające słupki) - czy odhaczanie i kłódki mają wrócić.
4. Mniejszy tytuł h1 na telefonie w scenie głównej.
5. Nagłówek - dziś pierwotny „Systemy CRM pod Twój proces.”, do rozważenia „Koniec z arkuszami i karteczkami.”.
6. Czy wolno napisać, że Avenly sama pracuje na własnym CRM.
7. Ciaśniejszy układ „Klucza” na laptopach z niskim oknem.
8. Nazwa usługi w danych strukturalnych „System CRM i automatyzacje AI” (jak w Ofercie - poza moim zakresem).

## Decyzje właściciela (cytaty + data)
- 2026-10-04 (zlecenie): „przeczytaj pliki .md i zacznij pracę z pracy równoległej CRM podstronę, dostosuj się do wszystkich zasad pracy równoległej”.
- 2026-10-04 (plan, `PRACA-ROWNOLEGLA.md`): „CRM i chatboty mają być inne, bo to inna usługa (…) jakoś ciekawie, fajnie”.
- 2026-10-04, po rundzie 1: „rób od razu kilka wersji każdej sekcji i zrób więcej sekcji, ale też żeby dorównywało poziomowi i cinematic jak reszta podstron, wiesz o co chodzi”.
- 2026-10-04: „teraz zweryfikuj wszystko” (jednorazowy sygnał dla rundy 2).
- 2026-10-04, po rundzie 2: „fajne pomysły generalnie, ale pierwszą zrób o wiele ładniej i bardziej cinematic i nie rób interaktywnych, jak coś daj kilka propozycji dla każdej sekcji, użyj subagentów”. „Bez interakcji” przyjąłem dla całej podstrony (właściciel tego nie sprostował). **Dla koordynatora:** to zmienia założenie z planu („podstrona do użycia, nie do oglądania”); chat 13 powinien zapytać właściciela, czy to samo dotyczy rozmowy.
- 2026-10-04, po rundzie 3: „scena główna wybieram z punktów”; „2. zlecenie zrób inne, trochę bardziej uniwersalne dla każdych CRM, wiesz o co biega”; „w 3. klucz wybieram”; „w Szyty pod Twój proces… usuń: »Szyty pod Twój proces. Nie sprzedajemy gotowych szablonów. System powstaje wokół tego, jak naprawdę pracuje Twoja firma.« i zostaw bębny wersję”; „5. moduły przerób na nowe, te 3 usuń i zrób od nowa, bo mi się nie podoba; rośnie mi się najbardziej podoba, więc coś w tym stylu, tylko ładniej i bardziej pasujące”; „6. wybieram tory, ale zrób ładniej to”; „7. zakres usuń”.
- 2026-10-05: „te wszystkie animacje linii, która leci i zmienia wireframe na coś lub coś na coś, coś się pojawia - wywal i zrób animację taką pojawiania płynną, tak jak się nebula rozchodzi”.
- 2026-10-05: „tylko zrób to z axisem, np. od lewej do prawej, i tak wiesz, nieregularnie, a nie że jednym kształtem się pojawia, wiesz o co chodzi, taki zajebisty efekt”.
- 2026-10-05: „git, tylko nie chcę, żeby to był jedną linią i statyczny na końcu, tylko taki fluid, nieregularny, że nie cały element, tylko kilka mniejszych, wiesz o co chodzi, w tej animacji odkrywania; plus jak się scrolluje i gwiazdy się tak przesuwają w pierwszej sekcji, to zrób bardziej premium i ładniej, bo tak clanky jest strasznie”.
- 2026-10-05: „2. kanały fajne, ale inaczej to zrób trochę i chcę, żeby te animacje co są reveal nie było sytuacji, kiedy użytkownik już zescrollował i widzi cały element, a część nie jest revealed na dole. 5. w dół fajne, tylko daj o wiele niżej ten pasek, gdzie się odkrywa”. → wybór „Kanałów” i „W dół”; „inaczej to zrób trochę” zrozumiałem jako zmianę sposobu odsłaniania (na czas, od wejścia na ekran) - właściciel tego nie sprostował.
- 2026-10-05: „a klient swoje zlecenie w »Każdy widzi to, co powinien« to nie jest to, co chcę tam widzieć, bo to nie zapewnienie i nie mogę tego obiecać, że to będzie w każdym systemie, wiesz o co biega; a w ostatnim z AI to AI jest opcjonalne, a nie zapewnienie, że będzie; jak to wszystko naprawisz, weź się za weryfikację copywritingu”.
- 2026-10-05: „dostosuj całą podstronę do urządzeń mobilnych”.
- 2026-10-05: „zoptymalizuj całą podstronę względem wydajności”. → przy tej okazji usunąłem niewybrane wersje sekcji 2 i 5 (dwa razy pytałem o zgodę i nie dostałem odpowiedzi, a właściciel dalej pracował na „Kanałach” i „W dół”); kopie w archiwum.
- 2026-10-06: „teraz copywriting: 1. system szyty dokładnie, szyty trzeba zmienić, bo frajersko brzmi; 2. »Bezpłatnie · bez zobowiązań · odpowiedź w 24 h« to usuń; plus poza copywritingiem zoptymalizuj sekcję »Trzy ekrany to początek. System rośnie z Tobą.« - jak się mockup rozwija przy scrollu, to niemiłosiernie laguje”. → „szyty” zastąpione przez „zbudowany” (opis w nagłówku, tytuł i opis w metadanych, ukryty nagłówek „Bębnów”) - słowa „szyty” nie używać w tekstach tej podstrony; linia dowodów pod przyciskiem usunięta w PL i EN (`head.proof` = pusta lista + `.sv.cr .sv-proof { display: none }`); sekcja modułów - patrz „Wydajność”.
- Obowiązują decyzje z fali 2 (notatki chatów 8-10): przykładowy interfejs w palecie podstrony (czerń, biel, akcent - bez pasteli) i wyraźnie przykładowy; w scenie jedno zdanie i jedno miejsce akcji naraz; przejścia spokojne, z postojami.

## Teksty
- Wszystkie w słownikach: `lib/i18n/uslugi/system-crm.ts` (główny: nagłówek, przykładowa firma, role, branże, moduły, AI, zakończenie; PL przez `typo()` - twarde spacje) + słowniki scen `system-crm-hero-points.ts`, `-lead.ts`, `-eyes.ts`, `-mods.ts`, `-ai.ts`. Stary `appWebDict` zostaje w głównym pliku jako źródło tekstów pierwotnej wersji.
- **Przegląd tekstów 2026-10-05** (na polecenie właściciela): rola klienta → biuro; AI wprost jako opcja (tytuł sekcji, znacznik „Opcja: AI”, narrator, opis w nagłówku strony „Opcjonalnie dołożymy do niego automatyzacje AI.”, tytuł i opis w metadanych, słowa kluczowe bez „portal klienta”); kanał „Telefon” nie udaje przechwytywania połączeń („Prosi o oddzwonienie w sprawie wyceny.”); „System zbiera je w jednym miejscu.”; z głównego słownika usunięte teksty usuniętych wersji (szły w props do klienta i siedziały w źródle strony).
- Tabela „było → jest” względem pierwotnej wersji: h1 bez zmian w treści; opis bez żargonu i z AI jako opcją; pigułka nad h1, drugi przycisk, karta „Gotowy na cyfrową Dominację?”, 20 chipów modułów z żargonem, sześć punktów zakresu i tekst „Nie sprzedajemy gotowych szablonów…” - usunięte; moduły = 8 nazw językiem klienta + „+ to, czego potrzebuje Twoja firma”; zakończenie = wspólne „Zacznijmy od rozmowy.”.
- Nieużyte kafle pierwotnej wersji (do decyzji): „React & Next.js - stos liderów…”, „Własna baza danych… bez limitów…”, „Bezpieczeństwo i role… szyfrowanie danych i audyt logów”.

## Pliki
- `app/(pl)/uslugi/strony-www/system-crm/`: `page.tsx`, `SystemCrm.tsx` (składanie sekcji; sceny poniżej pierwszego ekranu przez `next/dynamic` po pierwszej bezczynności), `types.ts`, `scene.tsx` (`SecHead`, `offsetTo`), `ui.tsx` (`Win`, `Av`), `roles.tsx` (`RoleBody`), `reels.tsx`, `system-crm.css` (wspólne + „Bębny”), `bloom.css` i `bloom-layers.ts` (GENEROWANE), pliki scen z tabeli wyżej; stary `AppWebClient.tsx` zostaje, nieimportowany.
- `app/(en)/en/services/websites/crm-system/page.tsx` - ten sam komponent, `systemCrmCopy.en`.
- Poza katalogiem podstrony (nowe pliki chatu 11): `scripts/crm-bloom.mjs` (generator maski rozejścia), `docs/archiwum/usluga-system-crm/` (kopie usuniętych wersji sekcji 2 i 5).
- **Zostało do sprzątania przy zamknięciu (razem z `tsc`):** nieużywane eksporty w `mods-ui.tsx` (`pinProgress`, `useKick`, `bloomTo`, `bloomOff`), martwe `--bloom-x / --bloom-y` tam, gdzie jeszcze są, drobne pola słownika do sprawdzenia, typ `SceneVersion` (używa go już tylko scena główna).

## Pułapki i ważne szczegóły
- **Kontrakt scen:** każda scena renderuje CAŁĄ sekcję (`<section>` z nagłówkiem). Sceny mają własny CSS i własny słownik - nie edytować wspólnego arkusza pod jedną scenę. Nadpisania szkieletu tylko pod `.sv.cr`. Narrator = `Steps` ze szkieletu pod `.cr-narr`.
- **„Rozejście” (`.cr-bloom` / `.cr-bloom-out`):** `--bloom` 0-1 pisze scena (albo przejście CSS - `--bloom` jest zarejestrowane przez `@property`), `data-bloomed` po zakończeniu (maska zdjęta / warstwa schodząca schowana). JEDYNE źródło prawdy to `scripts/crm-bloom.mjs`: tekstury kłębów (`TEXTURES`), listy warstw (`LAYERS` - 8 małych kłębów + duży ze środka; `LAYERS_SMALL` dla ekranów węższych niż 768 px - 4 większe kłęby zygzakiem + duży) i z nich GENEROWANE `bloom.css` (tekstury w data URI ok. 17 KB + reguły ok. 6 KB; listy maski w zmiennych `--bl-img / --bl-size / --bl-pos`, bez ręcznych `-webkit-`) oraz `bloom-layers.ts` (te same listy dla płótna sceny głównej). `node scripts/crm-bloom.mjs --preview <katalog>` zapisuje `bloom-steps.png` i `bloom-steps-small.png` (maska w 12 chwilach postępu) - jedyny sposób oceny bez przeglądarki. Po wygenerowaniu „dotknąć” `bloom.css` narzędziem Edit; plików generowanych nie edytować ręcznie i nie czytać w całości. Mała warstwa ma rozmiar < 1 (wzór na `mask-position` dzieli przez 1 - rozmiar), warstwa większa od elementu stoi w środku; przy `--bloom` = 1 duży kłąb kryje cały element (skrypt to sprawdza). `.cr-bloom-out` = pełna warstwa z `mask-composite: exclude` nad sumą kłębów; lista `mask-composite` ma tyle pozycji, ile warstw. Para wchodzi / schodzi musi leżeć w tym samym prostokącie z tym samym postępem. Maska przycina do prostokąta elementu. Tekstury są w data URI celowo (maska z pliku, który się nie wczytał, schowałaby treść). NIE wracać do linii światła, kurtyn, `clip-path` jako sposobu odsłaniania, okrągłej plamy ani jednego czoła.
- **Odsłony na czas** („Kanały”, „W dół”): scena stawia atrybut (`data-on` / `data-open`), `--bloom` dogrywa przejście CSS, po `transitionend` (albo zapasowym czasie) `data-bloomed`; nigdy wstecz.
- **Scena główna:** `usePin` podaje tylko cel (`field.seek(p)`), płótno ma jedną pętlę i z wygładzonego postępu pisze też zmienne DOM (`apply`); stałe ruchu w bloku „STROJENIE RUCHU” w `hero-points-field.ts`; płótno czyta tekstury rozejścia ze zmiennych CSS (`setMask`) i wybiera listę warstw po `phone`.
- **Przypięcie zależne od zmierzonego `svh`** (nie od `@media (max-height)`, które przeskakuje przy chowaniu paska adresu): „Tory” (`data-pin`, `MIN_SVH_*`), „Klucz” (`data-pin`, `useShort`), scena główna (`PIN_MIN_H*`). Poniżej progu scena stoi jako zwykła sekcja w stanie końcowym.
- **Role:** `CrmRole = 'owner' | 'office' | 'staff'`; `roles.portal` to dane mini-ekranu opcjonalnego modułu „Portal klienta”, nie rola. NIE wracać do roli klienta.
- **„Tory”:** ikony i linie „skąd przyszło” są przypisane po kolejności `t.ai.tasks`.
- **Bębny:** najdłuższa nazwa branży wyznacza rozmiar pisma; reguły `.cr-d-card > b / > span` są na dzieci bezpośrednie; telefon = wiersze „etap | karta”.
- **Element siatki z `margin: auto`** kurczy się do treści - musi mieć `width: 100%`.
- **Narzędzia:** skrypty pisać narzędziem Write (heredok w Bashu gubi apostrofy i ukośniki); po zmianie CSS skryptem „dotknąć” pliku Editem (Turbopack).
- **Skrypt zmieniający plik projektu zawsze zapisuje do KOPII**, wynik oglądam (liczba linii, klamry, użyte klasy), dopiero potem podmieniam. WPADKA 2026-10-04: skrypt „sprzątający” z błędnym wyrażeniem regularnym uciął `eyes.css` z 279 do 16 linii; pliki scen nie są w gicie (i `git restore` jest zakazany), ratunkiem było odtworzenie pliku z zapisu pracy subagenta (`~/.claude/projects/<projekt>/<sesja>/subagents/agent-*.jsonl`: ostatni `Write` + kolejne `Edit`).
- **Subagenci** (`frontend-specialist`): w zleceniu wprost wyłączyć nieaktualne polecenia z ich opisu (`obsidian-vault`, `content-visibility`, skill `verify`); nie mają Basha (nie usuną plików, nie odpalą przeglądarki ani `tsc`); nowe wersje pisać pod nowymi nazwami plików; po przerwaniu sesji można ich wznowić wiadomością - zachowują kontekst własnych plików.

## Telefon i tablet (2026-10-05, „dostosuj całą podstronę do urządzeń mobilnych”)
Wszystko rachunkiem z CSS i treści dla 390 × 844, 360 × 740, 320 × 640, 430 × 932, niskiego telefonu ok. 375 × 660, tabletów 768 × 1024 i 820 × 1180 oraz telefonu poziomo 844 × 390; szerokości napisów z przybliżonych metryk Inter (zapas 4-10%). Znalezione realne błędy: „Bębny” (763 px treści przy ok. 664 px `100svh` - ucinane), „Klucz” (okno 698 px przy 557 px - skala 0,8, pismo ok. 10 px), „Kanały” (dopiski w 3 liniach, narrator w 4). Lżejsza maska rozejścia poniżej 768 px. Telefon poziomo i bardzo niskie ekrany: sceny przypięte stoją jako zwykłe sekcje. Szczegóły progów i stałych - w komentarzach plików scen.

## Wydajność (2026-10-05, „zoptymalizuj całą podstronę względem wydajności”)
Bez pomiarów (zakaz Lighthouse i przeglądarki) - zmiany z przeglądu kodu:
- usunięte niewybrane wersje sekcji 2 i 5 z kodu, stylów i słowników oraz panel przełączników (`proposals`, `Dock` nie wchodzą już do paczki);
- arkusz maski rozejścia 62 KB → 23,5 KB (wspólne listy w zmiennych, mniejsze tekstury 192 / 192 / 224 px, bez ręcznych przedrostków);
- przycięte `lead.css` (41 → 19 KB), `mods.css` (55 → 32 KB), `system-crm.css` (22 → 18 KB); arkusz strony w trybie deweloperskim 193 KB → 135 KB;
- sceny poniżej pierwszego ekranu w osobnych kawałkach JS, wczytywane po pierwszej bezczynności (wzorzec strony głównej), style wszystkich scen od razu w arkuszu strony;
- teksty usuniętych wersji nie idą już w props do klienta;
- lżejsza maska na telefonie, krótsza bezwładność i 24 kl./s w spoczynku na dotyku, przebudowa chmury tylko przy realnej zmianie rozmiaru.
- **2026-10-06, sekcja modułów „W dół” („niemiłosiernie laguje”, gdy okno rośnie przy przewijaniu):** przyczyna w kodzie - szew okna szedł przez zmienne CSS `--cy` / `--cut` pisane CO KLATKĘ na przodkach całego okna (`.cr8-c-sys`, `.cr8-c-wrap`); zmienne się dziedziczą, więc przeglądarka przeliczała w każdej klatce style wszystkich pięter i mini-ekranów, a zmiana `clip-path` malowała od nowa płytę okna z dużym rozmytym cieniem i całą listę pięter. Teraz scena pisze `clip-path` WPROST na dwóch elementach (płyta `.cr8-c-win`, lista `.cr8-c-floors`), tylko przy zmianie; oba mają własne warstwy (`will-change: transform` - nic tam nie jest skalowane); licznik `--cn` stoi na pasku stanu i zmienia się tylko, gdy wchodzi piętro. Nieoglądane i niemierzone. Jeśli nadal będzie ciężko, następny kandydat to maska rozejścia piętra (9 warstw na dużym elemencie przez 1,1 s, `--bloom` dziedziczone w dół mini-ekranu).
Do sprawdzenia po sygnale: Lighthouse PL (telefon i komputer), płynność przewijania na prawdziwym telefonie, koszt stałej pętli płótna na pierwszym ekranie obok mgławicy tła.

## Propozycje do szkieletu (nie wprowadzone)
- `usePin` (`_usluga/shared.tsx`) liczy postęp z `window.innerHeight` - na telefonie przy chowaniu paska adresu postęp każdej przypiętej sceny drga o 1-3%; propozycja: wysokość ze stałej miary `svh`.
- „Pierwsze kroki” chatów 11 i 13 w `PRACA-ROWNOLEGLA.md` do poprawy po uwagach właściciela: pełna podstrona i wersje każdej sekcji od pierwszej rundy; bez sekcji do klikania; bez lecących linii światła; AI i widok klienta tylko jako opcje.

## Propozycje dla zamrożonych części (nie wprowadzone)
- Brak nowych. (Znane: „Darmowa Wycena” w nawigacji.)

## Do dokumentacji głównej
- do CLAUDE.md: po zamknięciu podstrony - opis sekcji, drzewo plików `system-crm/`, tabela shaderów (stare `RaysBackground` i bento z `AppWebClient.tsx` znikają; nowa podstrona ma tylko mgławicę szkieletu i canvas 2D w scenie „Z punktów”), `scripts/crm-bloom.mjs`.
- do PRODUCT.md: CRM = narzędzie w roli głównej, bez sekcji do klikania; AI i widok klienta tylko jako opcje, nazwane wprost; przykład w sekcji „Nic już nie ginie” uniwersalny dla każdej firmy.

## Weryfikacja
- **Wdrożenie 2026-10-06 (`90723428`, polecenie właściciela „wrzuć na avenly.pl”):** `npm run build` przeszedł (sprawdzanie typów całego projektu czyste, 128 plików RSC spłaszczonych, 404 podmienione), wdrożenie z konta kontakt@avenly.pl (`XDG_CONFIG_HOME=C:/Users/Start/.wrangler-avenly`). Na produkcji sprawdzone `curl` (systemowy `C:/Windows/System32/curl.exe`): 200 na stronie głównej, 6 podstronach usług, `/uslugi`, `/realizacje`, `/o-nas`, `/kontakt`, `/blog` i wersji EN podstrony CRM; nowe teksty CRM w HTML; pliki RSC podstrony CRM 200 (nazwa zawiera grupę tras: `__next.!KHBsKQ.uslugi.strony-www.system-crm.txt`). Tuż po wdrożeniu domena przez kilka sekund oddawała jeszcze starą wersję. Nadal bez przeglądarki, ESLint i Lighthouse.
- **Zmiany z 2026-10-06 (teksty, optymalizacja „W dół”): NIESPRAWDZONE w przeglądarce**, tylko `curl` (PL i EN 200, nowe teksty w HTML, „szyty” i linia dowodów zniknęły). Serwer deweloperski znów nie działał (port 3001 wolny) - uruchomiony ponownie.
- **Stan po zmianach z 2026-10-05: NIESPRAWDZONY w przeglądarce.** `curl`: PL i EN 200, wszystkie sekcje w HTML, w arkuszu i w źródle strony nie ma stylów ani tekstów usuniętych wersji. `tsc --noEmit` puszczony raz (po sprzątaniu głównego słownika, przed pracą nad telefonem i wydajnością): 0 błędów w plikach podstrony (8 w generowanym `.next/types/validator.ts`, poza moim zakresem).
- **Po sygnale właściciela:** `tsc` i ESLint na plikach podstrony i słownikach; zrzuty 1440 × 900, 1366 × 768, 390 × 844, 360 × 740, 320 × 640 każdej sceny w kilku punktach przewijania; EN; ograniczony ruch; bez JS; Lighthouse; potem sprzątanie resztek.
- **Runda 2 (archiwum):** pełna weryfikacja na sygnał właściciela - ESLint i `tsc` czysto (dotyczyła wersji, których już nie ma).
