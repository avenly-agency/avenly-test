# Stopka - notatki chatu 5 (praca równoległa)

> **Od koordynatora, 2026-10-07 - zmiany po zamknięciu:** kolumna „Usługi” ma 6 pozycji + „Wszystkie usługi” („Projekt UI/UX” usunięty 2026-10-01; „Strona szyta na miarę” → „Strona interaktywna” 2026-10-06). Na podstronach usług szkielet chowa linię u góry stopki (`body:has(.sv) .ft::before { display: none }`). Błąd przycisku na `/kontakt/` (ścieżka ze slashem) nadal czeka - zadanie „porządki”.

## Stan
- 2026-09-28: **wybrana KROPKA z zakończeniem „Nad i”** („teraz mi się w chuj podoba, wybieram kropka … zakończenie wybieram: nad i”). Pozostałe propozycje (Wizytówka, Na żywo, Żaluzje, Obecna), zakończenia (Linia, Finał), oba przełączniki, ich pliki, style i teksty w słowniku USUNIĘTE - nie przywracać bez prośby.
- Co jest w stopce (`components/layout/footer/dot.tsx`):
  - **Końcowy akcent:** tytuł „Postaw kropkę nad i” (EN „Dot the i”) - kropka nad ostatnim „i” to niebieska kropka marki (kolor akcentu), która przy wejściu spada na literę; przy lądowaniu rozchodzi się jeden cienki pierścień, potem co 12 s przebiega po niej wąski błysk (pauza poza ekranem). Pod tytułem opis w głosie korzyści i biały przycisk „Bezpłatna konsultacja” (jak w hero; na `/kontakt` przewija do formularza).
  - **Kolumny:** Usługi (7 podstron + „Wszystkie usługi”), Na skróty (Oferta `#uslugi`, Proces `#proces`, Realizacje, O nas, Blog tylko PL, Kontakt `/kontakt`), Kontakt (e-mail, dwa telefony, godziny pracy). **Nagłówki kolumn wyraźnie nad linkami** (poprawka właściciela 2026-09-28: „nagłówki typu usługi lub na skróty zbyt mało się wyróżniają na tle linków”): 18 px (telefon 17 px), 600, biały; linki 15 px `#94a3b8`.
  - **Pasek prawny:** © rok, NIP (gdy uzupełniony w `seo-data.ts`), Polityka prywatności (zawsze `/polityka-prywatnosci`), Ustawienia cookies (`OPEN_SETTINGS_EVENT`), Facebook / Instagram / GitHub (44 × 44 px, bez kolorów marek), „Wróć na górę”. BEZ oceny Google (usunięta 2026-09-28, patrz decyzje).
  - **Akcent = kolor motywu podstrony** (`getServiceTheme(pathname).hex`): niebieski na stronie głównej, bursztyn na sklepie itd. - kropka nad i, kropka w tytule, hover profili.
  - **Ruch:** strefy (tytuł z opisem i przyciskiem, kolumny, pasek prawny) wchodzą, gdy same pojawią się na ekranie (fade + 18 px, ease-out). Ograniczony ruch i brak JS: wszystko od razu, kropka na miejscu.

## Decyzje właściciela (cytaty + data)
- 2026-09-27: „przeczytaj pliki .md a szczególnie praca równoległa i weź się za 5 podpunkt, dostosuj do aktualnego designu, daj kilka propozycji” → runda 1: Kropka (wielki napis AVENLY w czarnym lakierze, kropka = przycisk), Wizytówka (obracana karta z kontaktem), Na żywo (oś dnia z godziną w Polsce), Żaluzje („Twój ruch.” z lameli), Obecna.
- 2026-09-28: „nie podoba mi się ta stopka, tzn. ten napis avenly mi nie siedzi” → wielki napis AVENLY usunięty (powtarzał też logotyp z hero = „odgrzewany kotlet”), 3 zakończenia bez logo: Nad i / Linia (linia kończy się kropką-przyciskiem) / Finał (duże zdanie na dole). Nie wracać do wielkiego logotypu na dole bez prośby.
- 2026-09-28: „teraz mi się w chuj podoba, wybieram kropka, tylko te linki i nagłówki typu usługi lub na skróty zbyt mało się wyróżniają na tle linków; zakończenie wybieram: nad i” → wybór + większe nagłówki kolumn, sprzątanie propozycji.
- 2026-09-28: „usuń to 5,0 na Google wraz z gwiazdkami, słaby social proof” → ocena z gwiazdkami usunięta z paska prawnego (razem z polami `rating` / `ratingAria` w słowniku i stylami `.ft-rating` / `.ft-stars`). Nie przywracać w stopce.

## Pliki
- `components/layout/Footer.tsx` - wejście: locale, słownik, motyw podstrony (`--ft-accent`), obsługa kotwic (Lenis na stronie głównej, `?target=` z podstron), strona kontaktu.
- `components/layout/footer/dot.tsx` - układ (tytuł z kropką nad „i”, kolumny, pasek prawny).
- `components/layout/footer/shared.tsx` - klocki (`ClosingTitle`, `ConsultButton`, `ServicesCol`, `NavCol`, `ContactCol`, `Socials`, `BackToTop`, `LegalBar`), godziny pracy parsowane z `CONTACT.hours`, `useFooterReveal`, `useReducedMotionPref`.
- `components/layout/footer.css` - style (prefiks `.ft-`), import w `Footer.tsx`.
- `lib/i18n/footer.ts` - słownik (PL + EN), używany tylko przez stopkę. Pola: nagłówki kolumn, `nav` (`offer`, `process`, `projects`, `about`, `blog`, `contact`), `services`, `allServices`, `days`, `hours`, `privacyPolicy`, `cookieSettings`, `copyright`, `nip`, `socialsAria`, `newTab`, `backToTop`, `cta`, `ctaHere`, `dot` (`title` - MUSI kończyć się literą „i”, `lead`). Usunięte: `brandDescription` (opis marki nie jest już pokazywany), dawne `email` / `phone`, `rating` / `ratingAria`.

## Pułapki i ważne szczegóły
- **Kropka nad „i”:** wizualnie „ı” (U+0131, jest w podzbiorze latin fontu Inter) + osobny element kropki; czytnik ekranu czyta zwykły tekst z `sr-only`. Geometria z Inter 700 zmierzona canvasem (`measureText` przy 1000 px): kropka „i” ma średnicę .172em, środek .133em od początku litery i .695em nad linią bazową. Kropka marki .186em (8% większa), `.ft-i` ma `line-height: 1` (linia bazowa .864em od góry pola), więc `top: .076em`, `left: .04em` - skaluje się z każdym rozmiarem tytułu. **Zmiana fontu / grubości tytułu = zmierzyć ponownie.** Tytuł bez „i” na końcu = zwykły tytuł z kropką w kolorze akcentu (`ClosingTitle`).
- **Stopka jest wyższa niż ekran na telefonie.** Strefy (`.ft-rv`) wchodzą osobno; IntersectionObserver NIE zgłasza strefy, którą szybki przeskok (np. na koniec strony) przeniósł nad ekran bez przecięcia - dlatego `useFooterReveal` sprawdza też pozycję przy przewijaniu (strefa nad ekranem = weszła). Bez tego nagłówek i przycisk zostawały niewidoczne.
- **Bąbel czatu** (prawy dolny róg, `fixed`) poniżej 1440 px wchodzi na szerokość treści: pasek prawny ma pod sobą 104 px zapasu (od 1440 px 28 px), żeby przy stronie przewiniętej do końca bąbel nie zasłaniał profili ani „Wróć na górę”.
- Stany startowe animacji tylko pod `[data-live]` i przy `prefers-reduced-motion: no-preference`. Pętla błysku kropki stoi, gdy strefa jest poza ekranem (`[data-vis]`).
- Bez WebGL i bez nowych zależności (stopka jest na każdej podstronie); `framer-motion` nie jest już w chunku stopki.
- **Usunięty link Useme** - prowadził na ogólną stronę `https://useme.com`, a nie na profil Avenly. Jeśli jest adres profilu: dopisać do `SOCIAL` w `seo-data.ts` i do `SOCIALS` w `footer/shared.tsx`.
- **Zrzuty headless:** każdy start Chrome z `mkdtemp` zostawia profil w `%TEMP%` - 2026-09-28 kilkadziesiąt takich profili zapełniło dysk (ENOSPC, wyzerowany plik przy zapisie). Po testach usuwać `%TEMP%\ft-chrome-*` / `ft-c-*` (albo używać jednego profilu).

## Propozycje dla zamrożonych części (nie wprowadzone)
- `/kontakt` przy ograniczonym ruchu: błąd hydratacji w nagłówku „Zacznijmy.” (framer-motion: serwer renderuje `opacity: 0` / `translateY(12px)`, klient `opacity: 1` / `transform: none`) - widoczny jako „1 Issue” w nakładce Next. Nie pochodzi ze stopki.
- Navbar: „Darmowa Wycena” łamie zasadę jednego CTA (zgłaszał też chat 1).
- „5,0 na Google” jest jeszcze w linii dowodów hero i w sekcji Opinie - do decyzji właściciela, czy tam też usunąć (w stopce usunięte jako „słaby social proof”).

## Do dokumentacji głównej
- ✅ **Przeniesione 2026-09-29** (konsolidacja, chat 4 na polecenie właściciela): CLAUDE.md „Stopka - KROPKA „Nad i”” + „Komponenty layoutu”, project_context.md (pliki, hierarchia nagłówków), README.md, progress.md; PRODUCT.md - Design Principles 13 (nagłówki nad linkami), anti-reference „wielki logotyp na dole”, ocena Google była już w regule 4. Punkty niżej zostają jako zapis.
- do CLAUDE.md: rozdział „Stopka - KROPKA (Nad i)” (opis wyżej, pliki, pułapki: geometria kropki nad „i”, `useFooterReveal` z pozycją, zapas pod bąbel czatu); w „Konwencje / Komponenty” dopisać `components/layout/footer/` i `footer.css`; w „Dane firmy” zdanie „Zmiana tam propaguje się do … footer” jest od teraz prawdziwe (e-mail, telefony, godziny, NIP, profile); pułapka „Footer `#uslugi` vs Home `#oferta`” nadal aktualna (link „Oferta” → `#uslugi`).
- do PRODUCT.md (kandydaci, do potwierdzenia): „»5,0 na Google« z gwiazdkami to słaby social proof” (właściciel 2026-09-28 o stopce; reguła 4 w PRODUCT.md mówi dziś co innego); „Nagłówek listy / kolumny musi wyraźnie odstawać od swoich linków (rozmiar + grubość + biel)”; „Wielki logotyp na dole strony nie pasuje - powtarza logotyp z hero”.

## Weryfikacja
- 2026-09-28 (bez oceny Google): zrzuty paska prawnego 1440, 1280 i 390 px - ostatni rząd nad bąblem czatu; ESLint i `tsc` na plikach stopki czysto.
- 2026-09-28 (po wyborze): zrzuty 1440 × 900 i 390 × 844 (PL), 1440 × 900 (EN „Dot the i”).
- 2026-09-28 (runda 2): zbliżenie kropki nad „ı” ze wzorcowym „i” obok (pozycja zgodna), spadanie kropki i pierścień zatrzymane w czasie (850 / 1750 ms).
- 2026-09-27 (runda 1): wszystkie warianty na 1440 × 900 / 390 × 844 / 820 × 1180, ograniczony ruch, `/en/`, podstrona sklepu (akcent bursztynowy).
