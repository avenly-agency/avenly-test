# Kontakt - notatki chatu 4 (praca równoległa, etap 2)

> **Od koordynatora, 2026-10-07 - zmiany po zamknięciu podstrony:** lista usług w formularzu nie ma już kategorii „Design i UI/UX” (usługa usunięta 2026-10-01), a opcja „Strona szyta na miarę” ma etykietę „Strona interaktywna” (2026-10-06) - **wartość `Strona Szyta na Miarę` została** (temat maila z Web3Forms; do decyzji właściciela). Pełny blok Open Graph dopisał chat 6 (2026-10-01). Błąd przycisku w stopce na `/kontakt/` nadal czeka (zadanie „porządki”).

## Stan
- **Dokumentacja główna JUŻ ZAKTUALIZOWANA** (2026-09-29, prośba właściciela „zaktualizuj pliki .md”): CLAUDE.md (drzewo tras, rozdział „Strona Kontakt”, wiersz „Opływ” w tabeli shaderów + licznik 15, niespójności: stopka `/kontakt/` i „Darmowa Wycena”, wzmianka o opcji audytu), PRODUCT.md (anti-references: tło zalane błękitem, „tarcza” pod tekstem; wyjątek w zasadzie 7; zasada „bez sierotek”), project_context.md („Formularz kontaktowy”), progress.md (wpis z 2026-09-29, status, otwarte sprawy), README.md (struktura). Koordynator przy konsolidacji NIE musi przenosić tej podstrony - tylko sprawdzić spójność.
- **GOTOWE do przeglądu koordynatora** (2026-09-29). Wszystkie wybory właściciela zapadły, przełączniki propozycji usunięte (w kodzie strony nie ma już `components/utils/proposals`):
  - **Układ „Obok siebie”** - po lewej etykieta „Kontakt”, h1 „Zacznijmy.”, opis i dane (E-mail, Telefon, Godziny pracy) z włosową linią u góry; po prawej formularz. Na 1440 × 900 cały formularz z przyciskiem mieści się w oknie. Telefon / tablet w pionie: nagłówek → dane → formularz.
  - **Tło „Opływ”** (`Backdrop.tsx`) - włosowe linie przepływu płyną od lewej i opływają formularz (funkcja prądu wokół przeszkody), przy formularzu linie w kolorze marki, dalej biel ~7%; po co trzeciej linii suną kreski w kolorze marki (potencjał prędkości - przy formularzu przyspieszają). Kursor rozsuwa linie jak mała przeszkoda, pisanie przyspiesza przepływ, wysłanie przepuszcza przez całość pas światła. Linie biegną równo także pod tekstem (bez „tarczy” pod tekstem), czerń tylko pod nawigacją i w przejściu do stopki.
  - **Formularz „Bez karty”** - wprost na czerni, bez płyty i obwódki; przeszkodą Opływu jest zaokrąglony prostokąt (squircle, n = 4) wokół formularza z zapasem 40 px (telefon 30 px), więc kształt formularza wyznacza sam strumień; na telefonie linie układają się łukiem nad formularzem. Pola „na linii”: bez ramek, jedna włosowa linia u dołu (36% bieli = kontrast 3:1), przy fokusie od lewej narasta linia 2 px w kolorze marki, błąd = czerwona linia; tytuł „Opowiedz o projekcie” 23 / 27 px.
- **Dopasowanie do telefonu i tabletu (runda 6, „dostosuj do mobile”):**
  - dane kontaktu na telefonie zwarte (mniejsze odstępy), dwa numery telefonu obok siebie (na 320 px same się zawijają) - tytuł formularza widać już na pierwszym ekranie 390 × 844;
  - mniejsze odstępy między polami poniżej 640 px (22 zamiast 26 px);
  - 1024-1279 px (tablet w poziomie, mały laptop): dane w dwóch kolumnach (e-mail | telefon, pod spodem godziny) - w trzech łamały się „kontakt@avenly.” / „pl” i „pon-pt, 9:00-” / „17:00”;
  - twarde spacje w opisie (U+00A0: „W ciągu”, „24 godzin”, „i termin”) - bez sierotek na końcu linii (na 768 px „W” zostawało samo);
  - sprawdzone: 320, 390 (także przewinięty formularz i otwarta lista usług - panel mieści się w ekranie), 768 × 1024, 1024 × 768, 844 × 390 (telefon w poziomie), EN 390.

## Historia teł (odrzucone - NIE wracać)
- Runda 1: sama czerń (bez tła) - „spoko ale dupy nie urywa”.
- Runda 2-3: „płynny błękit” (tafla cieczy z połyskiem satyny) w wariantach Pełny błękit, Błękit z czerni, Czarna satyna, Szkło prążkowane, Raster - „te tła są zupełnie niepasujące do brandingu marki”. Wniosek: marka = czerń + ostre linie + błękit tylko jako punkt światła; zalewanie ekranu niebieskim, ciecz, szkło i raster to nie marka.
- Runda 4 (w trakcie): „Kropka” (kropka marki jako czarna tarcza z obręczą światła za formularzem) - odrzucona przeze mnie przed pokazaniem: obręcz prawie w całości chowała się za kartą i pod tekstem, światło przez większość czasu było niewidoczne.

## Co zostało zmienione (restyling, nie nowy koncept)
- Zamiast niebieskiego „zalanego” tła `#1538c8` z shaderem (`BlueMeshBackground`) - czerń `#050505` z nowym tłem (`Backdrop.tsx`, patrz „Stan”).
- Nagłówek jak w sekcjach strony głównej: `SectionLabel` („Kontakt”), h1 w `.im-title` (lokalnie powiększony, wjeżdża spod maski), kropka po „Zacznijmy” w kolorze marki (`.im-accent`, jak kropka w logo „AVENLY.” i w stopce), `.im-lead`.
- Etykiety pól i danych zwykłym Inter w pisowni zdaniowej (było 7× rozstrzelone wersaliki), etykiety pól widoczne nad polami.
- Formularz bez karty (patrz „Stan”), nagłówek formularza h2 „Opowiedz o projekcie” + „5 pól, około minuty” (było „Brief · 5 pól · 60 sek”).
- Pola na linii (patrz „Stan”); błąd = czerwona linia + komunikat z ikoną; `aria-invalid` i `aria-describedby` na polach z błędem. Pola parami (imię / e-mail, telefon / usługa), gdy kontener formularza ma ≥ 400 px (`@container` na `.kt-card`).
- Przycisk wysyłki biały jak „Bezpłatna konsultacja” w hero i stopce: „Wyślij wiadomość” (było niebieskie „Wyślij brief”); wysyłanie = kręciołek + „Wysyłanie…”, `aria-busy`.
- Stan „wysłane”: nakładka w karcie (wysokość karty bez skoku), ikona w obwódce marki, h2 „Wiadomość wysłana” dostaje fokus (czytnik ekranu), „Wyślij kolejną wiadomość” wraca fokusem do pierwszego pola. Błąd serwera: ramka z `role="alert"`.
- Lista usług (`ServiceSelect`): wygląd jak pola, panel bez framer-motion (zawsze w DOM, przejście CSS), co najmniej 19rem szerokości (w dwóch kolumnach nazwy się nie ucinają), nazwy kategorii zwykłym tekstem, zaznaczona opcja w odcieniu marki. Usunięte nieużywane warianty `theme="light"`, `variant="underline" | "mono"`.
- Ruch: animacje CSS od pierwszej klatki (fade + 18 px, ease-out 1 s, kolejno co 90 ms; h1 spod maski 1,2 s) - bez JS, więc bez błędu hydratacji. Ograniczony ruch = brak animacji i przejść. framer-motion zniknął z komponentów strony.
- Dane firmy (e-mail, dwa telefony, godziny) wyłącznie z `lib/seo-data.ts` (było na sztywno w komponencie i w słowniku). Godziny liczone z `CONTACT.hours` jak w stopce („pon-pt, 9:00-17:00”).
- Metadane: tytuł bez Title Case i bez „Darmowa” („Kontakt - bezpłatna konsultacja i wycena strony WWW”), e-mail i telefon w opisie z `seo-data.ts`. (Ktoś w trakcie usunął z opisów godziny pracy - zostawione.)

## Copy (PL / EN w `lib/i18n/kontakt.ts`)
- Opis: „Strona, sklep czy chatbot AI? Napisz, czego potrzebujesz. W ciągu 24 godzin dostaniesz konkretną odpowiedź, wycenę i termin.” (było w głosie agencji „odpowiemy” + dywiz).
- Komunikaty walidacji pełnymi zdaniami („To pole jest wymagane”, „Sprawdź adres e-mail”, „Napisz co najmniej 10 znaków”, „Zaznacz zgodę, żeby wysłać wiadomość”).
- Lista usług: etykiety = nazwy usług z Oferty (`servicesSectionDict`): „Strona one-page”, „Strona szyta na miarę”, „Sklep internetowy”, „Projekt UI/UX”, „Audyt wydajności i SEO” (było „Bezpłatny audyt strony” - bez obietnicy „bezpłatny”), „Coś innego lub jeszcze nie wiem”, kategoria „Design i UI/UX” (było „&”).
- **Wartości opcji (`value`) bez zmian** - trafiają do Web3Forms jako temat (sprawdzone: „Nowa wiadomość od: … - Sklep Internetowy”).

## Decyzje właściciela (cytaty + data)
- 2026-09-29, po rundzie 1 (sama czerń): „spoko ale dupy nie urywa generalnie tło jakieś jak tamto dał” - chce żywego tła.
- 2026-09-29, po rundzie 2: „daj kilka wersji tła pasujących”.
- 2026-09-29, po rundzie 3: „te tła są zupełnie niepasujące do brandingu marki wybierz jakieś pasujące i zajebiste układ wybieram obok siebie, tła aktualne usuń i zrób nowe” - układ „Obok siebie”, płynny błękit i odmiany usunięte.
- 2026-09-29, o rundzie 4: „fajne ale usuń ten zjebany cień za lewą częścią” - usunięte wygaszanie tła pod tekstem (dawało ciemną plamę za nagłówkiem i danymi); linie biegną równo pod całą stroną, zostaje tylko wygaszenie pod nawigacją i przejście do stopki. NIE przywracać „tarczy” pod tekstem.
- 2026-09-29: „opływ jest zajebisty tylko ten box po prawej jakoś ładniej jakby zrobić” - tło = Opływ; formularz w dwóch wariantach (Karta / Bez karty).
- 2026-09-29: „git jest dostosuj do mobile, wybieram bez karty” - formularz „Bez karty”, wariant „Karta” i przełącznik usunięte; dopasowanie do telefonu i tabletu (runda 6, patrz „Stan”).

## Pliki
- `app/(pl)/kontakt/ContactSection.tsx` - układ, dane kontaktu, formularz, stany.
- `app/(pl)/kontakt/ServiceSelect.tsx` - lista usług (combobox + react-hook-form).
- `app/(pl)/kontakt/Backdrop.tsx` - NOWY, tło (WebGL, jeden przebieg, 3 warianty).
- `app/(pl)/kontakt/kontakt.css` - NOWY, wszystkie style strony (prefiks `.kt-`), import w `ContactSection.tsx`.
- `app/(pl)/kontakt/layout.tsx`, `app/(en)/en/contact/layout.tsx` - metadane.
- `lib/i18n/kontakt.ts` - słownik: `badge` → `label`, `h1` → `title` (bez kropki), `info.hoursValue` → `info.days`, `form.briefLabel/briefMeta` → `form.heading/meta`, nowe `info.heading`.
- Bez zmian: `page.tsx` (PL i EN), `useContactForm.ts` (Web3Forms, klucz, honeypot `botcheck`, uśpiony prefill `?audyt=`).

## Pułapki i ważne szczegóły
- **Tło (Backdrop.tsx):** jeden przebieg, wszystko analitycznie w px CSS (y w górę), linie przez `hair(d, w)` = pokrycie z wygładzaniem na 1 px płótna. Płótno w rozdzielczości ekranu (DPR do 2, budżet 3,2 mln px komputer / 2,2 mln dotyk) - włosowe linie w 1 px CSS przy płótnie 1× były rozmyte na retinie. Płótno sticky 100lvh w warstwie `.kt-bg` na całą sekcję; JS co klatkę mierzy prostokąty karty, nagłówka i danych (`getBoundingClientRect`, bez zapisów do DOM), kropkę h1 (`.kt-title .im-accent`) i kontener (kolumny siatki, przy zmianie rozmiaru). Tło NIE gaśnie pod tekstem (decyzja właściciela - było „cieniem za lewą częścią”), tylko pod nawigacją (40-160 px od góry); dół sekcji gaśnie w CSS (`.kt-bg::after`). Prostokąty nagłówka i danych służą już tylko do wyboru wierszy biegaczy na Siatce (nie przecinają tekstu). Pisanie w formularzu: nasłuch `input` na `.kt-form` (energia pisania + czasy 8 ostatnich klawiszy). Wysłanie: `sent` z `ctx.isSuccess`. Przełączanie wariantów = przenikanie 0,6 s. ~30 fps, pauza poza ekranem (IO na `.kt-main`) i przy ukrytej karcie, start po idle, `KHR_parallel_shader_compile`; Save-Data / ≤ 2 GB RAM / brak WebGL lub highp = czerń; ograniczony ruch = jedna klatka (sprawdzone: 0 rysowań po pierwszej).
- Opływ: funkcja prądu ψ = y − s.y·q.y/|q|², q = (p − środek karty) / półosie (karta × 1,14 / 1,07 + 16 px), gradient liczony analitycznie (bez `OES_standard_derivatives`); kursor = drugi dublet (promień 90 px). Linie w środku przeszkody (za kartą) wygaszone. Potencjał φ = x + s.x·q.x/|q|² = współrzędna wzdłuż linii dla kresek i pasa po wysłaniu.
- Formularz ma `noValidate` - walidację pokazuje tylko react-hook-form w stylu strony (wcześniej przy złym e-mailu wyskakiwał też natywny dymek przeglądarki). Reguły walidacji bez zmian.
- `kt-card` ma `container-type: inline-size` (pola parami liczone od szerokości karty); panel listy usług ma `max-width: 100cqw`, żeby nie wychodził poza kartę.
- Klasy `.im-title` / `.im-lead` z `globals.css` tylko użyte; `.im-lead` ma tam `margin: 0 auto` - nadpisane lokalnie `.kt .kt-lead { margin: 0 }`.
- Test wysyłki bez maili: w przeglądarce testowej podmieniony `window.fetch` (sukces i błąd serwera) - nic nie poszło do Web3Forms. Prawdziwa wysyłka testowa tylko za zgodą właściciela (konsolidacja, punkt 2).
- 2026-09-29 ok. 11:30 serwer dev na :3000 przestał odpowiadać; port był wolny, więc uruchomiłem `npm run dev -- -p 3000`, ale inny chat zdążył go uruchomić chwilę wcześniej - mój start odbił się od zajętego portu (EADDRINUSE), drugi serwer nie powstał.

## Propozycje dla zamrożonych części (nie wprowadzone)
- **Stopka, `components/layout/Footer.tsx:41`**: `isContact: pathname === '/kontakt' || pathname === '/en/contact'` nie łapie `/kontakt/` (przy `trailingSlash: true` `usePathname()` zwraca ścieżkę ze slashem - sprawdzone w dev: przycisk „Bezpłatna konsultacja” na `/kontakt/` jest linkiem `<a href="/kontakt/">` ze strzałką w prawo, a nie przyciskiem przewijającym do formularza). Poprawka: porównywać ścieżkę bez końcowego `/` (np. `const p = pathname.replace(/\/$/, '')`). Sprawdzić też na buildzie statycznym.
- **Navbar**: przycisk „Darmowa Wycena” / „Free quote” łamie zasadę jednego CTA („Bezpłatna konsultacja”) i sentence case - propozycja: „Bezpłatna konsultacja” / „Free consultation”.

## Do dokumentacji głównej
- do CLAUDE.md, tabela shaderów: nowy wiersz „Opływ (kontakt)” - `app/(pl)/kontakt/Backdrop.tsx`, linie przepływu (funkcja prądu wokół squircle formularza + dublet kursora, gradient z różnic skończonych), kreski po potencjale prędkości; jeden przebieg, wszystkie urządzenia + idle start + IO / visibility pause + parallel compile, ~30 fps, DPR ≤ 2 z budżetem 3,2 / 2,2 mln px; ograniczony ruch = 1 klatka.
- do CLAUDE.md: rozdział o `/kontakt`: dawne `BlueMeshBackground` zastąpione przez `Backdrop.tsx`, style w `app/(pl)/kontakt/kontakt.css` (`.kt-*`), ruch CSS bez framer-motion, dane z `seo-data.ts`, `noValidate`, wartości opcji listy usług niezmienne. W opisie struktury tras dopisać `kontakt.css` i `Backdrop.tsx`. Punkt o 2K („Kontakt: lg:min-h-screen flex items-center”) nadal prawdziwy (`.kt-main` od 1024 px).
- do PRODUCT.md: zasada 7 („text on clean ground”) - na `/kontakt` właściciel woli linie tła biegnące równo pod tekstem niż wygaszoną „tarczę” pod nim (była widoczna jako cień za lewą kolumną); przy cienkich, przygaszonych liniach wygaszanie pod tekstem nie jest potrzebne.
- do PRODUCT.md (nowe zasady marki): **tło marki = czerń, ostre włosowe linie, błękit `#3b82f6` tylko jako punkt / linia światła; bez zalewania ekranu niebieskim, cieczy, szkła i rastra** (właściciel 2026-09-29 o płynnym błękicie i odmianach: „zupełnie niepasujące do brandingu marki”) - propozycja do anti-references.

## Weryfikacja
- Zrzuty (headless Chrome, 2026-09-29): 1440 × 900 i 390 × 844, stan błędów walidacji, otwarta lista usług, stan „wysłane”, błąd serwera (telefon), ograniczony ruch (0 animacji, h1 widoczny, brak błędu hydratacji w konsoli), EN 1440 i 390, 320 px bez poziomego przewijania (także h1), przejście do stopki.
- Runda 4 (tło): zrzuty trzech teł 1440 × 900, Opływ na telefonie 390 i w stanie „wysłane”, ograniczony ruch (0 rysowań WebGL po pierwszej klatce), przejście do stopki.
- `npx eslint app/(pl)/kontakt app/(en)/en/contact lib/i18n/kontakt.ts` - czysto; `tsc --noEmit` - brak błędów w plikach kontaktu.
- Płynność animacji i tła ocenić w realnej przeglądarce (headless bez GPU rysuje ~10 kl./s).
