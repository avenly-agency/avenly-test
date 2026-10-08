# Archiwum - case study realizacji sprzed przebudowy na film (2026-10-08)

Kopie tekstowe wersji case study zamkniętej 2026-10-01 (układ pierwotny w nowym języku: nagłówek z liczbami obok,
przyklejony kadr „Strona na żywo”, punkt wyjścia i rozwiązanie w dwóch kolumnach, zakres obok technologii, karta
z „Bezpłatną konsultacją”, galeria, „Następna realizacja”). Zastąpiona 2026-10-08 filmem na prośbę właściciela
(„zmodernizować podstrony od realizacji, zrób zajebiście, tak żeby pasowały do poziomu innych”).

- `case.tsx.txt` - dawny `app/(pl)/realizacje/_rl/case.tsx`.
- `case-css.txt` - blok stylów `.rl-cs-*`, `.rl-stat`, `.rl-more*` z `realizacje.css` (w chwili archiwizacji nadal
  leży w `realizacje.css`, nieużywany - do usunięcia po przyjęciu nowej wersji).

Pliki mają rozszerzenie `.txt`, żeby nie wchodziły do kompilacji ani lintera. Żeby przywrócić starą wersję: skopiować
`case.tsx.txt` z powrotem jako `_rl/case.tsx` (style nadal są w `realizacje.css`) i usunąć import `./case.css`.

## propozycje-2026-10-08/

Stan z 2026-10-08 tuż przed sprzątaniem po wyborze właściciela („wybieram klasyczną”): dziesięć propozycji całej
podstrony pod przełącznikiem w panelu (Plansza, Wlot, Obok, Taśma, Seans, Klasyczna, Głębia, Redakcja, Droga, Kropka).
`case.tsx.txt` (przełącznik, wspólne klocki, Plansza / Wlot / Obok / Taśma / Głębia / Seans), `case-more.tsx.txt`
(Klasyczna, Redakcja, Droga, Kropka), `case.css.txt` (style wszystkich). W repozytorium została tylko Klasyczna.

Opis wybranej wersji i historia rund: `docs/podstrony/realizacje.md`, rozdziały „Case study - Klasyczna” i „historia rund”.
