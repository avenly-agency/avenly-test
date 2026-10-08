# Proces - notatki chatu 0 (praca równoległa)

## Stan
- 2026-09-27: **sekcja ZAMKNIĘTA** - układ Wstęga, materiał Szkło, tło Głębia (wybory właściciela); dopasowana do telefonu (zygzak z łukami między krokami). Dokumentacja główna zaktualizowana.

## Decyzje właściciela (cytaty + data)
- 2026-09-26: Horyzont (dopracowany) = „odgrzewany kotlet” - nie powtarzać motywów z innych sekcji.
- 2026-09-27: druga runda „niby spoko, ale poprzednia sekcja jest totalnie high-endowa i luksusowa, a proces tego nie oddaje; nie chodzi o 1:1 te same elementy, tylko o feeling”.
- 2026-09-27: „wstęga jest genialna i piękna, wybieram wstęgę, resztę wywal i trzeba ją podrasować, ładniejszą wstęgę, i coś z tłem dodać ciekawego, żeby było ładne”.

## Decyzja 2026-09-27 (runda wyglądu)
- Cytat: „na razie tło zostawmy i skupmy się na głównej wersji tej wstęgi, bo jest zbyt taka metaliczna, i zrób kilka propozycji, mogą być zupełnie inne, zamiast wstęgi coś innego, inna wstęga pasująca do poprzednich sekcji”.
- Propozycje = gałęzie jednego FS (`u_look`): Satyna, Szkło (hero / Realizacje), Linie (Impact), Pył (hero), Metal. Zapas 2D: metal lub satyna (`shadeSatin`).

## Decyzja 2026-09-27 (materiał)
- Cytat: „wybieram wstęgę szkło, ale tło sekcji daj kilka propozycji jeszcze”. Usunięte gałęzie Satyna / Linie / Pył / Metal, przełącznik „Wstęga”, `shade()` / `shadeSatin()`.
- Tło, druga runda: Kaustyki, Soczewki, Tafle (język szkła i światła). Kaustyki: klasyczna formuła „water caustic” = dym, próg na niej = płatki; dopiero krawędzie komórek (F2 - F1) + wędrujące plamy dały ostrą, lekką sieć.

## Decyzja 2026-09-27 (skrzyżowanie, szkło luksusowe)
- Cytat: „mam problem trochę z momentem tej wstęgi, jak ona się jakby krzyżuje, i to chciałbym jakoś ładniej zrobić + tło głębia również daj szklane i to szkło zrób jeszcze bardziej luksusowe i ładniejsze we wstędze i w tle”.
- Zrobione: `twistAngle()` + `crossWidth()` w `silk.ts`, wspólny `glass()` (GLASS_GLSL), Głębia szklana, Soczewki / Tafle na `glass()`. Pułapki: pochylenie w perspektywie = ząbki (pas zakłada się na siebie bez wygładzenia); `pow(h, n)` na kuli = rozmyta plama - refleksy z progiem i szerokością ~1 px; `fwidth` nie wolno liczyć w pętli z `continue` (niejednolity przepływ) - na kulach szerokość analitycznie `0,9 / r`.

## Decyzja 2026-09-27 (tło, responsywność)
- Cytat: „wybieram głębię, dostosuj teraz do responsywności, szczególnie na mobile, pamiętaj efekt wow ma zostać taki sam”. Usunięte tła Kaustyki / Soczewki / Tafle / Nici / Bez tła i przełącznik. Telefon: zygzak jak na komputerze (wstęga 34 px wzdłuż tekstu na przemian po lewej i prawej, łuk S między krokami).

## Decyzja 2026-09-27 (kolory)
- Cytat: „jakbyś zrobił, że kolory wstęgi się zmieniają w zależności od elementu i tak płynnie przechodzi między kolorami, po to, żeby wstęga się od tła wyróżniała, bo aktualnie się zlewa przez ten sam kolor”. Wstęga: barwione szkło `RIBBON_ACC` (sat 1), tło: srebro `SILVER` (sat 0, k 0,28 / 0,38).

## Decyzja 2026-09-27 (telefon, druga wersja)
- Cytat: „ten proces na telefonie trzeba zrobić ładniej, bo to nie jest to, co chcę, pomyśl” (zrzut: wstęga wciśnięta w margines przy krawędzi, łuk jak kreska). Nowa wersja: wstęga przeplata się przez ekran - przy tekście chowa się za krawędzią ekranu, między krokami przepływa łukiem S przez cały ekran; tekst na pełnej szerokości; na telefonie bez przewracania wstęgi.

## Pliki
- `components/sections/Process.tsx` (sekcja, tło, przełącznik tła, nagłówek, CTA).
- `components/sections/process/ribbon.tsx` (wstęga + kroki), `backdrop.tsx` (tło - propozycje), `silk.ts` (materiał: `shade()` 2D + `SILK_GLSL`, akcenty `ACC`), `process.css` (style, import w `Process.tsx`).
- `lib/i18n/home/process.ts` - usunięte `stepLabel`, `of`, `mock`; zostaje `short` (słowo etapu obok numeru).
- Usunięte: `prism.tsx`, `engrave.tsx`, `mockup.tsx`, `layers.tsx`, `typo.tsx`, `checklist.tsx`, `journey.tsx`, `shared.tsx` (+ ich style).

## Pułapki i ważne szczegóły
- Wstęga NIE może być na płótnie przyklejonym (sticky): rysowanie w rAF spóźnia się o klatkę względem przewijania (palec / Lenis) i wstęga „pływa” względem tekstu. Dlatego płótno ma wysokość toru i przewija się natywnie. Tło może być sticky (nie jest związane z tekstem).
- Wysokie płótno WebGL: bez MSAA (setki MB), AA z `fwidth(v)` (`OES_standard_derivatives`), DPR ograniczony budżetem pikseli i `MAX_RENDERBUFFER_SIZE` / `MAX_VIEWPORT_DIMS`.
- Płótna WebGL tworzone w efekcie przy każdym montażu (`document.createElement`) - podwójny montaż w dev + `loseContext()` w sprzątaniu nie trafiają na ten sam utracony kontekst.
- Canvas 2D (zapas): czworokąt sięgający do próbki j + 2 dawał ząbki przy skręcie, obrys - prążki; teraz zakładka 35% kroku, bez obrysu. Ostry blik (h^56) = folia i schodki - materiał to satyna (h^28 + połysk h^5).
- `shade()` (2D) i `SILK_GLSL` muszą zostać zgodne (stałe światła, perła / granat, wagi) - zmieniać razem.
- Przy zrzutach headless: chwilowe błędy kompilacji z plików innych chatów (np. brak świeżo tworzonego CSS) - poczekać i powtórzyć.

## Do dokumentacji głównej
- ✅ 2026-09-27: CLAUDE.md („Sekcja Proces - WSTĘGA”, tabela shaderów 14 lokalizacji), README, project_context, progress.
- Po wyborze tła: opisać wariant, usunąć opisy odrzuconych.

## Weryfikacja
- 2026-09-27: zrzuty 1440 × 900 i 390 × 844 (Głębia i Nici), reduced motion (cała wstęga, wszystkie kroki, tło bez ruchu); renderer WebGL działa w headless (`data-renderer="gl"`); `tsc` i ESLint czysto. Płynność ocenić w realnej przeglądarce.
