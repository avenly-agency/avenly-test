# Asystent AI - notatki chatu 2 (praca równoległa)

## Stan
- 2026-09-27: **sekcja „Asystent AI” (AiConsultant) USUNIĘTA ze strony głównej** na polecenie właściciela. Strona główna: Hero → TechStack → Realizacje → Dlaczego Avenly → Proces → Opinie → **Oferta** → Blog → Kontakt (Opinie przechodzą prosto w Ofertę, bez odstępu - sprawdzone).
- Nie przywracać bez prośby właściciela.

## Decyzje właściciela (cytaty + data)
- 2026-09-27: „zabierz się za 02 asystent ai, zrób kilka wersji tej sekcji i toggle”.
- 2026-09-27, o pierwszej rundzie (Nocna zmiana, Rozmowa, Gotowe zapytanie, Wielu klientów naraz): „te wszystkie lack of soul takie są, jakby poprzednia miała jakąś tam duszę, a to jest jakieś takie miałkie”. Dusza = asystent jako postać (Avenly AI żyje: słucha, myśli, odpowiada) + rozmowa o biznesie odwiedzającego, nie przykłady obcych firm.
- 2026-09-27, druga runda (Postać, Głos ze światła, Poprzednia dopracowana): wybór „ewidentnie poprzednia dopracowana, tylko dopracuj ją bardziej i zrób bardziej horyzontalnie, bo elementy się nie mieszczą w device height”; potem „zrób kilka wersji tego ulepszonego konceptu” (Konsola, Oś kroków, Identyfikator, Trzy panele).
- 2026-09-27: „mam problem, bo nie pasuje ta sekcja do reszty, nie wiem, czy jej nie wyjebać, jest trochę zbędna” → rekomendacja chatu 2: usunąć (asystent jest już w „Dlaczego Avenly” - karta 2 z historią i linkiem „Chatboty AI”, w Realizacjach - „Wirtualny Asystent AI” z „Porozmawiaj z asystentem”, w konstelacji hero i pasku pod hero, w Ofercie i jako prawdziwy czat w rogu każdej podstrony; makieta czatu w osobnej sekcji zawsze wygląda skromniej niż sceny innych sekcji) → **„usuń sekcję z chatbotami”**.

## Co zostało zrobione (2026-09-27)
- Usunięte pliki: `components/sections/AiConsultant.tsx`, katalog `components/sections/ai-consultant/` (wszystkie wersje, silnik rozmowy, style), `lib/i18n/home/ai-consultant.ts`.
- **Zmiany w plikach chatu 0 (wyjątek z polecenia właściciela, narzędziem Edit, tylko linie tej sekcji):**
  - `components/home/HomeClient.tsx`: usunięty `dynamic` import `AiConsultant` (w jego miejscu komentarz o usunięciu) i blok `{/* AI CONSULTANT */}` w JSX.
  - `lib/i18n/home/index.ts`: usunięty import `aiConsultantDict` / `AiConsultantDict` i pole `aiConsultant` (typ `HomeDict` i `build`).
- `tsc` bez błędów w tych plikach, ESLint czysto, `/` i `/en/` działają, w DOM nie ma sekcji, `#opinie` → `#oferta` bez odstępu.

## Dokumentacja główna - ZAKTUALIZOWANA (2026-09-27, na polecenie właściciela: „zaktualizuj pliki .md, że nie ma tej sekcji”)
- CLAUDE.md: kolejność sekcji w „Konwencje → Komponenty” bez AiConsultant + adnotacja o usunięciu; lista miejsc z `avenly:open-chat` bez `AiConsultant.tsx`; lista sekcji z etykietą „Gwiazda” bez Asystenta AI.
- project_context.md: wiersz „Asystent AI - usunięta” w tabeli stanu, lista „Sekcje strony głównej” przenumerowana (9 sekcji) + akapit o usunięciu, tabela czatu (`avenly:open-chat`) i hierarchia nagłówków bez AiConsultant.
- progress.md: kolejność w „Strona główna”, stan wdrożenia („Tylko lokalnie”) i wpis w logu 2026-09-27.
- PRACA-ROWNOLEGLA.md: status chatu 2 „zakończone: sekcja USUNIĘTA”, opis wyjątku (HomeClient + index.ts), wiadomość startowa oznaczona jako nieaktualna.
- PRODUCT.md: anti-reference „Sekcja, która powtarza temat pokazany już gdzie indziej” (z cytatem właściciela).
- docs/sekcje/opinie.md (notatki chatu 1): uwaga o hydratacji tarczy chatu 2 oznaczona jako nieaktualna.
- README.md: nie wymagał zmian (nie wymieniał tej sekcji).
- Historyczne wpisy w progress.md (Sesje 26-27, etykiety „Gwiazda”) zostają bez zmian - opisują stan z tamtego czasu.

## Pułapki (na przyszłość, gdyby sekcja wróciła)
- Pokaz rozmowy musiał się mieścić w wysokości ekranu (właściciel: „elementy się nie mieszczą w device height”) - okno czatu o stałej wysokości, nowe wiadomości od dołu, układ poziomy.
- Rozmowa „o Twoim biznesie” (Ty jako właściciel firmy piszesz do Avenly AI), bez cen i metryk poza „ok. 2 s”.
- Kod ostatnich wersji nie trafił do git (był niezacommitowany) - po usunięciu nie da się go odtworzyć z repozytorium.
