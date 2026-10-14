# O nas - niewybrane wejścia i wersje z 2026-10-09 / 12 (archiwum)

Kopie plików podstrony `/o-nas` ze stanu sprzed 2026-10-12, gdy właściciel potwierdził wejście „Panorama z cięciem”
(„usuń to przewiń i wybieram tą wersję”) i poprosił o nowe propozycje drugiej sekcji. Tego dnia z kodu zniknęły:

- cztery pozostałe pełnoekranowe wejścia z logo: **Okno, Odjazd, Przesunięcie, Klapka** (`heroes.tsx.txt`,
  `heroes.css.txt` - pliki w całości, razem z ówczesną wersją Panoramy),
- wersje całej podstrony: **Cięcie** (pierwszy ekran `cut.tsx.txt`; jego pozostałe sekcje zostały na stronie),
  **Gwiazdozbiór** (`atlas.*`), **Orbita** (`orbit.*`), **Przelot** (`flight.*`),
- oba przełączniki („Wersja podstrony”, „Hero (pierwszy ekran)”) - `ONasClient.tsx.txt`,
- klocki tych wersji w `parts.tsx.txt` (ujęcia `BeatText`, podpisy `Captions`, podpowiedź „Przewiń” `Hint`) i ich
  style w `o-nas.css.txt`,
- pola słownika `intro.hint` i `atlas.finale` - `lib-i18n-o-nas.ts.txt`.

Dopisane 2026-10-12 (runda 16): `endings.tsx.txt` + `endings.css.txt` - propozycje sekcji po wjeździe w gwiazdę
(Z głębi, Plakat, Cięcie zdania, Tunel, dotychczasowa kolumna) ze stanu tuż przed wyborem „Plakatu”; wybrany plakat
żyje dalej w `app/(pl)/o-nas/poster.tsx`. Przywrócenie którejś z nich wymaga też mechanizmu z ówczesnego `heroes.tsx`
(prop `end`, `END_EXTRA`, `EndingBackdrop`) - opis w `docs/podstrony/o-nas.md`, rozdział „Runda 15”.

Dopisane 2026-10-13 (runda 18): katalog `sekcja-po-plakacie/` - wszystkie wersje sekcji „Bez pośredników. Prosto do
nas.” (dotychczasowa `direct.tsx` i osiem scen `second-*.tsx` z `second.css`) razem z ówczesnymi `ONasClient.tsx`,
`o-nas.css`, `mark.tsx` i słownikiem. Właściciel odrzucił ten temat („zrób sekcje, które nie są związane z tym
formatem, czyli bez pośredników itp.”) - nie przywracać bez jego prośby.

Dopisane 2026-10-13 (runda 19): katalog `tematy-sekcji-po-plakacie/` - dwie propozycje tematu sekcji po plakacie,
których właściciel nie wybrał („Więcej i mniej” - `sec-goals.tsx`, „Co robimy” - `sec-wheel.tsx`), z ówczesnym
`sec.css`, słownikiem i `ONasClient.tsx`. Wybrany temat: „Dla kogo pracujemy” (`sec-clients*.tsx`).

Dopisane 2026-10-13 (runda 21): katalog `dla-kogo-wersje/` - wszystkie siedem wersji sceny „Dla kogo pracujemy” ze
stanu tuż przed wyborem „Portalu” („portal zajebisty”): 1. Taśma (`sec-clients.tsx`), 2. Przelot
(`sec-clients-flight.tsx`), 3. Ściana (`sec-clients-wall.tsx`), 4. Ekran (`sec-clients-screen.tsx`), 5. Portal
(`sec-clients-portal.tsx` - wybrana, żyje dalej w `app/(pl)/o-nas/`), 6. Plansze (`sec-clients-plates.tsx`),
7. Galeria (`sec-clients-gallery.tsx`), razem z klockami `sec-clients-parts.tsx`, warstwą `sec-wow.tsx`, pełnymi
arkuszami `sec.css` i `sec-wow.css` (w kodzie zostały z nich tylko reguły Portalu) i `ONasClient.tsx` z przełącznikiem.
Wersje 1-4 właściciel ocenił „niby spoko” (bez mgławicy w barwach klienta) - opis w `docs/podstrony/o-nas.md`,
rozdziały „Runda 19” i „Runda 20”.

Pliki nie były w repozytorium git (praca niezacommitowana), dlatego zostały przeniesione tutaj, a nie usunięte.
Mają dopisane `.txt`, żeby `tsc` i ESLint ich nie sprawdzały.

**Jak przywrócić wersję albo wejście:** skopiować potrzebne pliki do `app/(pl)/o-nas/` (bez `.txt`), przywrócić
potrzebne klocki w `parts.tsx`, style w `o-nas.css` i pola słownika, dopisać import w `ONasClient.tsx`. Opis każdej
wersji i wejścia: `docs/podstrony/o-nas.md` (rozdziały „Runda 2” i „Runda 4”).

## zakonczenie-wersje/ (2026-10-14)
Zakończenie podstrony: właściciel wybrał „Przez gwiazdę” („ostatnia to przez gwiazdę wybieram”; żyje w
`app/(pl)/o-nas/ending.tsx` + `ending.css`). Tu pozostałe wersje: dotychczasowa „Linia z gwiazdą”
(`ending-linia.tsx.txt` - dawna `ending.tsx`, style `.on-end-*` z `o-nas.css` w `o-nas-linia.css.txt`; używa kometki
`Comet` z `mark.tsx`) oraz pełne `ending-alt.tsx.txt` / `ending-alt.css.txt` z rundy 28 („Przez gwiazdę” w wersji
sprzed przeniesienia i „Horyzont”). Opisy: `docs/podstrony/o-nas.md`, rundy 28 i 42.

## pytania-wersje/ (2026-10-14)
Propozycje sekcji „Pytania” z rundy 28: „Rozmowa” i „Karty” (`faq-alt.tsx.txt`, `faq-alt.css.txt`), zastąpione w
rundzie 42 trzema nowymi scenami („Okno asystenta”, „Półka”, „Linia z gwiazdą”). „Rozmowa” używała pól słownika
`faqSection.chatHello` („Wybierz pytanie, a odpowiemy od razu.” / „Pick a question and get the answer right away.”)
i `chatFrom` („Avenly”), usuniętych z `lib/i18n/o-nas.ts`.
Runda 42-43 (2026-10-14): trzy sceny z rundy 42 - „Okno asystenta” (`faq-window.*`), „Półka” (`faq-shelf.*`),
„Linia z gwiazdą” (`faq-line.*`) - przeniesione tu nieoglądane, bo właściciel chciał dopracowany akordeon („chodziło mi
o akordeon (…) badge trzeba usunąć, dorównać”). Używały pól słownika `faqSection.accent` („Krótko i konkretnie.” /
„Short and to the point.”), `more` („Nie ma tu Twojego pytania? Zapytaj asystenta AI albo napisz do nas.” / „Your
question is not here? Ask the AI assistant or write to us.”), `chatName` („Asystent AI” / „AI assistant”) i
`chatInput` („Napisz wiadomość...” / „Type a message...”) - usuniętych ze słownika; „Okno asystenta” używa też klasy
`.cb` z `globals.css`. Opis scen: `docs/podstrony/o-nas.md`, runda 42.

## zasady-wersje/ (2026-10-14)
Sekcja „W co wierzymy” (zasady): właściciel wybrał scenę „Światło” („światło jest git”, żyje w
`app/(pl)/o-nas/principles-light.tsx`). Tu wszystkie pozostałe wersje: „Stacje na linii” (`principles.tsx`, dotąd
produkcyjna; style z `o-nas.css` w `o-nas-stacje.css.txt`), „Gwiazdozbiór” i „Karty” (`principles-alt.*`; o „Kartach”:
„niby spoko, ale znowu takie zwykłe”), „Przelot” (`principles-flight.*`), z rundy 40: „Manifest”, „Cięcie”, „Orbita”,
„Z mgławicy” (`principles-manifest.* / -cut.* / -orbit.* / -mist.*`) oraz pełna wersja wspólnych klocków
`principles-kit.tsx.txt` (z `Words` - słowa w maskach, używane przez „Manifest”). Opisy: `docs/podstrony/o-nas.md`,
rundy 28-29 i 39-40. Pole słownika `principles.label` („W co wierzymy” / „What we believe in”) usunięte.

## nasz-znak/ (2026-10-14)
Cała sekcja „Nasz znak” usunięta z podstrony (właściciel: „sekcje nasz znak wywala i w jej miejsce dajemy nową
sekcję”) - w jej miejscu „Co robimy” (`app/(pl)/o-nas/offer.tsx`). Kopie: stara „Konstrukcja” (`blueprint.tsx`,
`blueprint-data.ts` - dane wygenerowane z `public/logo/avenly-konstrukcja.svg`, style `.on-bp-*` były w `o-nas.css`)
oraz propozycje z rundy 29 „Z bliska” i „Trzy poprawki” (`blueprint-alt.tsx`, `blueprint-alt.css`). Teksty (pole
słownika `blueprint` z `zoom` i `fix` oraz `stepsLabel`, PL i EN): `slownik-blueprint.ts.txt`.

## runda-28-nasz-znak/ (2026-10-13)
Dwie propozycje sekcji „Nasz znak” z rundy 28: „Na Twojej stronie” (przykładowa strona z oznaczeniami siatki,
„44 px” i kontrastu) oraz „Trzy kadry” (wycinki rysunku logo z wymiarami) - `blueprint-alt.tsx` i `blueprint-alt.css`.
Właściciel o nich i o starej „Konstrukcji”: „niby spoko, ale ch.. wie, co tam się dzieje w każdej z wersji”.
Teksty „Na Twojej stronie” (pole słownika `blueprint.detail`) są w notatkach: `docs/podstrony/o-nas.md`, runda 28.
