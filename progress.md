# avenly-web — Progress

## Status
**Ostatnia aktualizacja:** 2026-10-07 (przegląd koordynatora: dokumentacja główna doprowadzona do stanu po wdrożeniu `a6a206db` z 2026-10-06 - lista wdrożeń w „Stan wdrożenia”, log etapów 2 i 3 w „Iteracje zrealizowane”; nic nie było budowane ani wdrażane). Wcześniej 2026-10-06 (siedem wdrożeń, ostatnie `a6a206db`; wśród nich `292f5691`: poprawka mignięcia hero Chatbotów AI na wejściu i akcent nagłówka Wiedzy „Nie zmyśla.”; wcześniej `f2f29804`: optymalizacja hero i sekcji Realizacje na stronie głównej; wcześniej `fad591c2`: tło `/uslugi` i `/realizacje` też bez interakcji z kursorem; wcześniej `74b14420`: optymalizacja podstron usług i tło bez interakcji z kursorem; wcześniej tego dnia `bc047217`: cały bieżący stan etapu 3 na avenly.pl - patrz „Stan wdrożenia”). Wcześniej 2026-09-30 (wdrożenie `a540e815`: poprawka Search Console - Opinie bez JSON-LD Review; poszedł też bieżący stan podstron etapu 2, patrz „Stan wdrożenia”). Wcześniej 2026-09-29 (praca równoległa etap 2: strona Kontakt zamknięta - Obok siebie + tło Opływ + formularz Bez karty, lokalnie, niewdrożona). Wcześniej tego dnia: Blog na stronie głównej = Panorama, wdrożone na avenly.pl, deploy `e49199f5`. Wcześniej 2026-09-28 (Oferta: nowe copy usług, bez WordPressa / CMS i obietnic kurierskich, UI/UX i audyt jako dodatki, przycisk „Cała oferta” w kolorze usługi; zasady w PRODUCT.md „Co obiecujemy w ofercie”)
**Tracker główny:** `C:\Users\Start\Desktop\progress.md`
**Pełny kontekst projektu:** [project_context.md](./project_context.md) · **szczegóły i decyzje właściciela:** [CLAUDE.md](./CLAUDE.md)

### Stan wdrożenia (2026-10-07)
- **Na avenly.pl - stan z 2026-10-06, ostatnie wdrożenie `a6a206db`.** Produkcja = bieżący stan repozytorium (sprawdzone 2026-10-07: po buildzie z 2026-10-06 14:50 nie zmienił się żaden plik źródłowy; kolejność wdrożeń potwierdzona poleceniem `wrangler pages deployment list`). Na produkcji są: strona główna i podstrony etapu 2 w wersjach końcowych, one-page (zamknięta) oraz **podstrony w pracy w wariantach domyślnych przełączników** (strona firmowa, Strona interaktywna, sklep, system CRM, chatboty AI, O nas) - bez panelu propozycji. **Po zamknięciu tych podstron trzeba wdrożyć ponownie.**
- **Siedem wdrożeń 2026-10-06** (każde na polecenie właściciela wydane w chacie danej podstrony; każde = cały bieżący stan repozytorium; build ze sprawdzaniem typów; produkcja sprawdzona tylko `curl`-em z `C:\Windows\System32`): (1) `90723428` - CRM: „zbudowany” zamiast „szyty”, bez linii dowodów pod przyciskiem, lżejsza sekcja modułów „W dół”; (2) `9afa4557` - nowa nazwa usługi „Strona interaktywna” w całym serwisie (adres bez zmian); (3) `292f5691` - chatboty: poprawka mignięcia hero na wejściu (`sv-wait`), akcent Wiedzy „Nie zmyśla.” (szczegóły w następnym punkcie); (4) `1a4a7f4a` - Strona interaktywna: wejście pierwszego ekranu „Wschód”, gwiazda na czole nici, przegląd wydajności podstrony; (5) `6bd06458` - mgławica podstron usług: blask i winieta liczone w każdej klatce (opcja `liveGlow` w `realizacje/_rl/nebula.ts`, włączona w `_usluga/sky.tsx`); (6) `1f8381e3` - mgławica podstron usług: płynna odsłona przy wejściu (front odsłony w kompozycji, zegar odsłony krokami); (7) `a6a206db` - mgławica podstron usług: gaz jako dwie przenikające się klatki kluczowe, spoczynek ~30 kl./s. **Niesprawdzone:** żadna z tych zmian nie była oglądana w przeglądarce (warianty shadera mgławicy sprawdzone tylko statycznie - przy błędzie budowania moduł wraca do zwykłego wariantu); płynność ocenia właściciel; ESLint i Lighthouse nie były puszczane.
- **Stan lokalny 2026-10-07:** serwer deweloperski Avenly na :3001 nie działał (port wolny); dysk 23 GB wolne (91% zajęte); praca nadal niezacommitowana w git.
- **Szczegóły wdrożenia `292f5691`** (2026-10-06, trzecie z siedmiu tego dnia, na polecenie właściciela: „wrzuć wszystkie zmiany na avenly.pl”): poprawka mignięcia układu statycznego w hero Chatbotów AI na wejściu (zdanie filmu i pole pytań z klasą szkieletu `sv-wait` + reguła `.sv:not([data-live]) .sv-wait` w `usluga.css`) oraz akcent nagłówka Wiedzy „Nie zmyśla.” zamiast „Wie, czego nie wie.” (także punkt Zakresu i EN). Sprawdzone jednym `curl` na produkcji: nowy tekst i klasy są w HTML. Nie oglądane w przeglądarce.
- **Na avenly.pl - WSZYSTKO, czwarte wdrożenie 2026-10-05** (deploy `f2f29804`, na polecenie właściciela: „wrzucaj na avenly.pl”). Poszła optymalizacja dwóch pierwszych sekcji strony głównej (właściciel: „zoptymalizuj pierwszą sekcję strony głównej oraz drugą, bo lagują”, „zoptymalizuj hero całe, żeby nie lagowało”, „teraz drugą sekcję”): tempo rysowania hero i Realizacji liczone z czasu i zależne od aktywności, shader planety w dwóch przebiegach (szum w połowie rozdzielczości), pauza sceny hero przy < 30% widoczności, szklany przycisk „Zobacz realizacje” bez `backdrop-filter`, mgławica Realizacji bez liczenia przed odsłoną sekcji, znikające i ukryte kadry bez rozmycia tła (szczegóły: PRACA-ROWNOLEGLA.md „Wydajność podstron usług”, CLAUDE.md „Hero strony głównej” i tabela shaderów). Build: 43 strony, sprawdzanie typów czyste. Sprawdzone po wdrożeniu (odpowiedzi serwera, bez przeglądarki): strona główna, `/en/`, `/o-nas/`, `/uslugi/`, sklep, chatboty, `/realizacje/` + case study, `/kontakt/`, `/blog/`, `/sitemap.xml` = 200; nieistniejąca strona = 404; plik RSC strony głównej = 200; lista plików JS na produkcji zgodna z lokalnym buildem (`/`, `/realizacje`, one-page); kawałki JS ze sceną hero (nowy shader planety) i sceną Realizacji są na produkcji. **Niesprawdzone - nowy shader planety nie był oglądany w żadnej przeglądarce przed wdrożeniem** (błąd kompilacji shadera = zostaje statyczny obraz planety), wygląd i płynność na komputerze i telefonie, ESLint, Lighthouse. **Po zamknięciu podstron w pracy trzeba wdrożyć ponownie.**
- **Wcześniej tego dnia na avenly.pl - WSZYSTKO, trzecie wdrożenie 2026-10-05** (deploy `fad591c2`, na polecenie właściciela: „wrzucaj na avenly.pl”). Poszło: tło katalogu `/uslugi` z kategoriami i podstrony `/realizacje` z case studies bez interakcji z kursorem (właściciel: „z podstrony /uslugi też usuń ten efekt”, „z realizacji też usuń”) - żadne tło-mgławica na podstronach nie reaguje już na kursor; reszta jak we wdrożeniu `74b14420`. Build: 43 strony, sprawdzanie typów czyste. Sprawdzone po wdrożeniu (odpowiedzi serwera, bez przeglądarki): strona główna, `/en/`, `/o-nas/`, `/uslugi/`, `/uslugi/strony-www/`, 6 podstron usług, `/realizacje/` + case study, `/kontakt/`, `/blog/`, `/en/services/`, `/en/work/`, `/sitemap.xml` = 200; nieistniejąca strona = 404; `/uslugi/design/ui-ux/` = 301; plik RSC Realizacji = 200; lista plików JS na produkcji zgodna z lokalnym buildem (`/uslugi`, `/uslugi/strony-www`, `/en/services`, `/realizacje`, case study, one-page; `/uslugi` zgodne po kilkunastu sekundach od wdrożenia - tyle trwa rozejście się nowej wersji). **Niesprawdzone:** wygląd i płynność w przeglądarce (komputer, telefon, ograniczony ruch, EN), ESLint, Lighthouse. **Po zamknięciu podstron w pracy trzeba wdrożyć ponownie.**
- **Wcześniej tego dnia na avenly.pl - WSZYSTKO, drugie wdrożenie 2026-10-05** (deploy `74b14420`, na polecenie właściciela: „wrzuć na avenly.pl”, po przekrojowej optymalizacji podstron usług). Poszło: tło podstron usług bez interakcji z kursorem (właściciel: „usuń na każdej podstronie w usłudze hover na tle i dystorsję, bo laguje”), poprawki wydajności wszystkich sześciu podstron usług (lista w PRACA-ROWNOLEGLA.md, „Wydajność podstron usług”) oraz bieżący stan podstron w pracy (firmowa, na miarę, sklep, CRM, chatboty, O nas) w wariantach domyślnych przełączników. Build: 43 strony, sprawdzanie typów czyste (pierwsze sprawdzenie typów po optymalizacji). Sprawdzone po wdrożeniu (odpowiedzi serwera, bez przeglądarki): strona główna, `/en/`, `/o-nas/`, `/uslugi/`, `/uslugi/strony-www/`, 5 podstron stron WWW i CRM, chatboty, `/realizacje/` + case study, `/kontakt/`, `/blog/`, dwie trasy EN, `/sitemap.xml` = 200; nieistniejąca strona = 404; `/uslugi/design/ui-ux/` = 301 → `/uslugi/strony-www/`; pliki RSC one-page = 200; lista plików JS na produkcji zgodna z lokalnym buildem (one-page, sklep, chatboty). **Niesprawdzone:** wygląd i płynność w przeglądarce (komputer, telefon, ograniczony ruch, EN), Lighthouse. Uwaga: `curl` z Git Bash zwraca dla HTTPS błąd 43 - do sprawdzania produkcji używać `C:\Windows\System32\curl.exe`. **Po zamknięciu podstron w pracy trzeba wdrożyć ponownie.**
- **Wcześniej tego dnia na avenly.pl - WSZYSTKO, wdrożenie 2026-10-05** (deploy `bc047217`, na polecenie właściciela: „wszystkie zmiany do teraz wrzuć na cloudflare na avenly.pl”, w trakcie pracy równoległej etapu 3). Poszło: zamknięte podstrony etapu 2 w wersjach końcowych (Usługi - katalog, Realizacje, Kontakt, Blog), nowe teksty Usług / Realizacji / Kontaktu, usunięta usługa „Projekt UI/UX” (301 z `/uslugi/design*` działa), **one-page (zamknięta)** oraz **bieżący stan podstron w pracy**: strona firmowa, strona szyta na miarę, sklep, system CRM, chatboty AI i O nas - tam, gdzie wybory właściciela są otwarte, produkcja pokazuje wariant domyślny przełącznika (panel propozycji nie trafia do produkcji). **Po zamknięciu tych podstron trzeba wdrożyć ponownie.** Build: 43 strony, bez błędów typów, dev server na :3001 działał w tym czasie. Sprawdzone po wdrożeniu (odpowiedzi serwera, bez przeglądarki): strona główna, `/en/`, `/o-nas/`, `/uslugi/`, `/uslugi/strony-www/`, 5 podstron stron WWW i CRM, chatboty, `/realizacje/` + case study, `/kontakt/`, `/blog/`, trasy EN, `/sitemap.xml` = 200; nieistniejąca strona = 404; `/uslugi/design/ui-ux/` = 301 → `/uslugi/strony-www/`; pliki RSC = 200; nagłówki h1 na produkcji zgodne z buildem. **Niesprawdzone:** wygląd i działanie w przeglądarce (telefon, ograniczony ruch, EN), Lighthouse - do weryfikacji końcowej. **Wrangler:** wdrożenie z profilu Avenly w `C:\Users\Start\.wrangler-avenly` (kontakt@avenly.pl, wrangler 4.147.0); globalne logowanie zostaje na koncie RKS. Wrangler ostrzega o brakujących nowych uprawnieniach tokenu (`k2.read` / `k2.write`) - na wdrożenia Pages nie wpływa, odświeżenie = `wrangler login` z tą samą zmienną `XDG_CONFIG_HOME` (wymaga kliknięcia w przeglądarce zalogowanej na konto Avenly).
- **Wcześniej na avenly.pl - WSZYSTKO, wdrożenie 2026-09-30** (deploy `a540e815`, na polecenie właściciela: „wywołaj wrangler i wrzuć na produkcję”, mimo trwającej pracy równoległej etapu 2): (1) poprawka Search Console „Wiele weryfikacji bez obiektu aggregateRating” - sekcja Opinie bez JSON-LD Review (szczegóły INSTRUKCJA-SEO.md „Ocena Google”; po wdrożeniu kliknąć „Sprawdź poprawkę” w Search Console); (2) poprawka typów w `components/blog/BlogBackdrop.tsx` (build padał); (3) **razem z tym poszedł bieżący stan podstron etapu 2**: Kontakt (zamknięty), Blog (zamknięty) oraz O nas, Usługi i Realizacje w WARIANTACH DOMYŚLNYCH przełączników (O nas: Kropka + Korekta, Usługi: tło Kropla, Realizacje: Scena + ramka Szkło + tło Kurtyna) - wybory właściciela jeszcze otwarte, po nich trzeba wdrożyć ponownie. Sprawdzone po wdrożeniu: `/`, `/en/`, `/o-nas/`, `/uslugi/`, `/realizacje/`, `/kontakt/`, `/blog/`, `/en/work/` 200, nieistniejąca strona 404, pliki RSC 200, brak `"@type":"Review"` w HTML `/` i `/en/`. **Wrangler:** globalne logowanie było na koncie RKS (klubsportowyrks@gmail.com, używa go `rksweb`), a `npx wrangler@4` padał na `ECOMPROMISED` (blokada cache npm przy prawie pełnym dysku) - wdrożenie z wranglera 4.144.0 z cache npx, z logowaniem Avenly w osobnym katalogu `C:\Users\Start\.wrangler-avenly` (patrz CLAUDE.md „Deploy flow”). Build: dev server avenly-web działał w tym czasie na :3001 (:3000 zajmuje `rksweb`) - build go nie ruszył (Next 16 trzyma dev w `.next/dev`).
- **Wcześniej na avenly.pl - WSZYSTKO, wdrożenie 2026-09-29** (deploy `e49199f5`, na polecenie właściciela: „tak reset i wrzucaj na avenly.pl”): sekcja Blog na stronie głównej = układ **Panorama** (przewijanie = jazda kamery w bok wzdłuż okładek, nagłówek w scenie, wszystko przy krawędziach wrappera; ograniczony ruch = karty) - szczegóły `docs/sekcje/blog.md`. Sprawdzone po wdrożeniu: `/`, `/blog/`, wpis, `/o-nas/`, `/kontakt/`, `/realizacje/`, `/uslugi/`, `/en/` 200, nieistniejąca strona 404, pliki RSC 200, Panorama w HTML strony głównej, bez przełącznika propozycji. Przed buildem serwer deweloperski zrestartowany z czystym `.next/dev` (zgoda właściciela; po zapełnieniu dysku 2026-09-28 cache Turbopacka dawał 404 na wszystkich podstronach poza `/`) - po restarcie wszystkie podstrony 200. Praca nadal NIEZACOMMITOWANA w git.
- **Wcześniej na avenly.pl (Cloudflare Pages) - WSZYSTKO, wdrożenie 2026-09-28** (deploy `881f01e6`, na polecenie właściciela: „wrzuć wszystkie nowe zmiany na produkcję”): cała modernizacja strony głównej (Dlaczego Avenly, Proces, Opinie, Oferta, Blog, stopka), nowe copy sekcji, usunięta ocena „5,0 na Google”, jeden kolor marki. Sprawdzone po wdrożeniu: strony PL / EN 200, 404 z własną stroną, pliki RSC (`flatten-rsc`) 200, nowe teksty i token `--brand` w CSS na produkcji. Wrangler zalogowany na kontakt@avenly.pl (logowanie RKS zastąpione). Uwaga: praca nadal NIEZACOMMITOWANA w git.
- **Wcześniej na produkcji:** wszystko do poprawki tekstów realizacji Kardyś włącznie (2026-09-25).
- **Historycznie „tylko lokalnie” do 2026-09-28 (dziś już na produkcji):** płynne przejście Realizacje → „Dlaczego Avenly”, czat bez `backdrop-filter`, cała nowa sekcja „Dlaczego Avenly” (Stos warstw + Konstelacje, 11 rund z 2026-09-26: karty w głębokiej czerni z zakładką (numer + kategoria), teren z warstwic na całej karcie (jasno przy wizualizacji, czysto pod tekstem), konstelacja z historią krok po kroku (napis kroku na dole karty), karty 2 i 4 w lustrze, stos z efektami przewijania na każdej szerokości (także telefon), kształty tła w kolorze karty na ekranie), etykiety sekcji „Gwiazda” we wszystkich sekcjach strony głównej, tło „Dlaczego Avenly” = Mapa warstwic + tekst u góry, sekcja „Proces” = szklana Wstęga + tło Głębia (zamknięta), **usunięta sekcja „Asystent AI”** (2026-09-27, po Opiniach od razu Oferta), sekcja „Oferta” = układ Plan z żyjącymi rysunkami, indeks Karty, zegar Obwódka, bez tła (2026-09-27, zamknięta), a 2026-09-28 nowe copy usług i zasady „Co obiecujemy w ofercie” (bez WordPressa / CMS, bez obietnicy integracji z kurierami także w `/uslugi` i na podstronie sklepu, UI/UX i audyt jako dodatki, AI w CRM jako opcja) oraz przycisk „Cała oferta” w kolorze usługi.
- **Czeka na decyzję właściciela (chat 0):** nic - „Dlaczego Avenly” i „Proces” zamknięte. Rozstrzygnięte: 2026-09-26 „Dlaczego Avenly” = Stos warstw + Konstelacje, etykiety sekcji = Gwiazda; 2026-09-27 tło „Dlaczego Avenly” = Mapa warstwic, tekst w karcie = U góry, „Proces” = Wstęga, materiał Szkło, tło Głębia.
- **Praca równoległa (od 2026-09-27):** 6 chatów modernizuje sekcje strony głównej równolegle - podział i zasady w [PRACA-ROWNOLEGLA.md](./PRACA-ROWNOLEGLA.md), notatki chatów w `docs/sekcje/*.md` (konsolidacja do dokumentacji głównej po zakończeniu).
- **Git:** większość pracy od czerwca (Sesje 28-31 i wrzesień) jest niezacommitowana w drzewie roboczym.

## Aktualne wyniki

| Metryka | Wartość |
|---|---|
| **Hosting** | Cloudflare Pages od 2026-09-19 (`npm run deploy`), `_headers` + `_redirects`, poczta na Hostingerze |
| **PageSpeed (ostatni pomiar PSI, Sesja 22)** | mobile 85 / desktop 99 — **do ponownego pomiaru** po nowym hero i sekcjach |
| **Lighthouse lokalny (Sesje 29-31)** | desktop 95-97 (LCP 1,0-1,2 s = render planety, CLS 0); mobile z throttlingiem LCP hero 2,4-2,6 s, CLS 0 |
| **Accessibility issues** | 0 zgłoszonych (kontrasty AA poprawione względem makiet hero / Realizacji) |
| **SEO** | 9 typów JSON-LD (Service na 6 podstronach usług po usunięciu UI/UX, ItemList realizacji), hreflang PL/EN, robots 2026-ready, pełny blok Open Graph na podstronach (2026-10-01) |
| **AI search** | Google AI Overviews aktywnie cytuje z linkiem |
| **Wersja EN** | ✅ Sesja 28 — `/en/` z przetłumaczonymi slugami |
| **Strona główna** | Hero 12a (Sesja 29) → TechStack (ikony w szkle) → Realizacje (Sesje 30-31) → Impact → Process → Testimonials → Services → BlogTeaser → stopka (sekcje „Asystent AI” i CTA „Gotowy na cyfrową dominację?” usunięte 2026-09-27) |
| **Podstrony (etap 2)** | ✅ `/uslugi` + `/uslugi/strony-www` (katalog: Kadr + Obrys + Mgławica, 2026-10-01), `/blog` + wpis (Wierna / Okładka, 2026-09-29), `/kontakt` (Opływ, 2026-09-29), `/realizacje` + case studies (Plansze + Mgławica, 2026-10-01); 🔎 `/o-nas` czeka na wybór wejścia i układu |
| **Podstrony usług (etap 3)** | ✅ one-page (2026-10-02, szkielet `_usluga/`); 🔧 strona firmowa, Strona interaktywna, sklep, system CRM, chatboty AI - w pracy, na produkcji w wariantach domyślnych (stan: PRACA-ROWNOLEGLA.md) |
| **Usługi** | 7 usług w 3 kategoriach (Strony WWW ×5, Automatyzacja AI, Marketing - audyt „wkrótce”); „Projekt UI/UX” usunięty 2026-10-01; „Strona szyta na miarę” → „Strona interaktywna” 2026-10-06 |
| **WebGL shaders** | tabela w CLAUDE.md (stan 2026-10-07): strona główna (planeta hero, mgławica Realizacji, Impact ×4, Proces ×2), `/kontakt` (Opływ), `/blog` (linie), `/uslugi` i `/realizacje` (mgławice), 6 podstron usług (mgławica szkieletu + głębia kart na 4 podstronach stron WWW), `/o-nas` (pole światła, podstrona w pracy); stare shadery podstron usług (Rays, bento, UI/UX) nieaktywne (+2 w martwym `Portfolio.tsx`) |
| **GlassEdge tiers** | nieużywany na żadnej aktywnej stronie (został w starych, nieimportowanych `*Client.tsx`); Medium (Impact) usunięty 2026-09-25 |
| **„Dlaczego Avenly”** | ✅ Stos warstw + Konstelacje (2026-09-26) - stos kart z efektami przewijania na każdej szerokości; ✅ tło Mapa warstwic + tekst u góry (2026-09-27) |
| **Oferta** | ✅ Plan (2026-09-27) - rysunki techniczne usług rysują się i ożywają scenkami z kamerą; karty z zegarem Obwódka; bez tła; telefon: zbliżenia kamery, swipe z obrazem za palcem; ✅ 2026-09-28 copy „chwyt + konkret”, uczciwe obietnice (PRODUCT.md), przycisk „Cała oferta” w kolorze usługi |
| **Blog content automation** | 2 slash commands (`/new-post`, `/blog-research`), 3 posty |
| **Production navigation** | ✅ `flatten-rsc.mjs` (Sesja 20) + `copy-404.mjs` (Sesja 28) w `npm run build` |
| **Copywriting** | ✅ głos korzyści, jeden CTA, zero fabrykowanych metryk, bez em-dashy i rozstrzelonych wersalików (PRODUCT.md) |
| **Cookie consent (RODO)** | ✅ Sesja 27 — gotowe do bramkowania GA/Meta przez `hasConsent()` |

Historyczne wyniki sesji 20-27 (Safari, mobile UX, scope cards, hero perf starego hero, Portfolio depth, bento corner fix, 2K/4K, scrollbar, navbar theming, drugi telefon): opisane w logu niżej.

---

## Iteracje zrealizowane

### Sesja 1-6 (do 2026-04-30) — Chatbot
- `components/chatbot/Chatbot.tsx` — floating bubble + okno chatu
  - Framer Motion (AnimatePresence, spring transitions)
  - `data-lenis-prevent` na kontenerach scroll
  - Dwa widoki: `"chat"` i `"history"` z animowanym slide
- Lokalna historia: `avenly_chat_current` (session) + `avenly_chat_sessions` (local, max 15)
- Quick Replies — `triggers: ('start' | 'always' | 'keyword')[]`
- Welcome message z bazy danych
- Fix kolejności wiadomości: sekwencyjny zapis (user → then assistant)
- Fix onClick send: `() => sendMessage()` zamiast `sendMessage`
- `sendMessage` przyjmuje opcjonalny `overrideText?: string`

### Sesja 7 (2026-05-22) — Aktualizacja dokumentacji + pełna analiza projektu
- README.md przepisany z boilerplate'u na realny opis projektu
- CLAUDE.md, project_context.md zaktualizowane
- Pełna analiza wszystkich plików projektu, identyfikacja bugów i pułapek

### Sesja 8 (2026-05-22) — Iteracja 1 Performance
**Cel:** zoptymalizować FPS scrolla bez zmian wizualnych.

- **Impact bar chart**: `height: 0 → ${h}%` → `transform: scaleY(0→1)` z origin bottom (zero layout passes)
- **Portfolio FocusCard**: `will-change: filter, opacity, transform` (cache GPU dla blur)
- **Portfolio scroll container**: GPU layer hint przez `translateZ(0)`
- **Process progress bar**: `will-change` + `translateZ(0)`
- **Hero blob keyframes**: przeniesione z `<style dangerouslySetInnerHTML>` do `globals.css` (cacheable cross-page)
- **BlogTeaser**: `useMemo` na `latestPosts` + zamiana `<img>` → `next/image` z lazy
- **TechStack marquee**: redukcja duplikacji 4× → 3× (-7 DOM nodes)
- **/o-nas GSAP**: `backfaceVisibility: hidden` + `translateZ(0)` na textRef/bgRef + conic-gradient blobs
- **Usunięto** `app/api/chat/route.ts` (martwy kod przy static export)
- **`npm uninstall`** 10 nieużywanych deps (three, @react-three/*, postprocessing, sanity, portabletext, @types/three) — **-953 paczek z node_modules**

### Sesja 9 (2026-05-22) — SEO P0+P1 (16 zadań)
**Cel:** kompletny SEO setup od zera.

#### P0 — Critical
- `app/robots.ts` przebudowane 2026-ready: allow retrieval bots (Google-Extended, OAI-SearchBot, PerplexityBot, ChatGPT-User, Claude-SearchBot, Applebot-Extended), block training bots (GPTBot, CCBot, anthropic-ai, ClaudeBot, Bytespider, FacebookBot)
- **lib/seo-data.ts** — centralny plik z danymi firmy (NIP, adres, social, Wizytówka Google)
- **lib/schemas.ts** — buildery schema.org JSON-LD (Organization, LocalBusiness, WebSite, Breadcrumb, BlogPosting, Service, FAQPage, CreativeWork)
- **components/seo/JsonLd.tsx** — reusable wrapper renderujący `<script type="application/ld+json">`
- Globalne JSON-LD w `app/layout.tsx`: Organization + ProfessionalService + WebSite
- Globalny OG + Twitter Card + fallback `/og-default.png` (1200×630, AVENLY brand)
- **app/sitemap.ts** przebudowany: usunięte 404-ki, zróżnicowane `lastModified`, hardcoded `SERVICE_PAGES`
- **app/polityka-prywatnosci/layout.tsx** dodany dla metadata (page jest 'use client')
- Wzmocnione metadata: `/o-nas`, `/realizacje`, `/kontakt`, `/blog`, `/blog/[slug]`, `/realizacje/[slug]`

#### P1 — High Impact
- **components/seo/ServicePageSchema.tsx** — reusable Service + Breadcrumb dla 7 podstron usług
- BlogPosting + Breadcrumb JSON-LD w `/blog/[slug]`
- CreativeWork + Breadcrumb JSON-LD w `/realizacje/[slug]`
- Service + Breadcrumb JSON-LD na 7 podstronach usług
- **app/o-nas/faq-data.ts** + FAQPage JSON-LD na `/o-nas` (DRY — używane w UI i schema)
- Review + AggregateRating JSON-LD w `Testimonials` (gwiazdki w SERP)
- **Favicon set**: favicon-16/32, apple-touch-icon (180), icon-192/512, manifest.webmanifest
- GSC verification placeholder w metadata + **INSTRUKCJA-SEO.md** (krok po kroku)

### Sesja 10 (2026-05-23) — Iteracja 2 Performance (78 → 85)
**Cel:** zwiększenie PageSpeed mobile z 78.

- **public/.htaccess** — Apache config: cache 1 rok dla `_next/static/*`, kompresja Brotli/Gzip, nagłówki bezpieczeństwa (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy), Force HTTPS
- **package.json browserslist**: Chrome/Edge/FF 100+, Safari 15+, iOS 15+ (bez polyfilli ES6+)
- **Inter font**: `style: ['normal']` — pomijamy italic (**-66 KiB woff2**)
- **Preconnect cleanup**: Supabase zostaje (300ms LCP saving), n8n + Unsplash → dns-prefetch
- **next.config.ts**: `poweredByHeader: false`, `compress: true`, `reactStrictMode: true`

### Sesja 11 (2026-05-23) — Iteracja 3 Performance (85 mobile / 99 desktop final)
**Cel:** dalsze obniżenie LCP przez lazy load non-critical widgets.

- **components/utils/DeferredClientWidgets.tsx** — client wrapper z dynamic Chatbot + LifecycleManager (oba `ssr: false`, pojawiają się po hydration)
- **Footer** → `dynamic` (z SSR, ale osobny chunk = lazy hydration)
- **app/layout.tsx** zrefaktorowany: Chatbot, LifecycleManager przeniesione do DeferredClientWidgets

### Sesja 12 (2026-05-23) — A11y fixes
**Cel:** naprawa wszystkich issues raportowanych przez PageSpeed Accessibility.

- **Chatbot bubble**: dynamiczny `aria-label` (Otwórz/Zamknij czat) + `aria-expanded` + `aria-haspopup="dialog"` + `type="button"`
- **Hero notifications**: `<h4>` → `<p className="font-semibold">` (mockup UI, nie sekcje dokumentu — eliminuje skok h1→h3)
- **Footer Menu/Legal**: `<h4>` → `<h3>` (pasuje do hierarchii h2 sekcji)
- **Testimonials autor**: `<h4>` → `<cite>` (poprawna semantyka cytatu)
- **Polityka prywatności** cookies sub-cards: `<h4>` → `<h3>`
- **Kontakt InfoCard label**: `<h4>` → `<p>` (etykieta pola, nie nagłówek)

### Sesja 13 (2026-05-23) — Dane biznesowe wpięte
- **Wizytówka Google** wpięta: `https://share.google/YgHXGeqFgrSX4FEGs` w `GOOGLE_BUSINESS.profileUrl`
- `SITE.founded` ustawione na **'2026'**
- AggregateRating: **5.0 (2 opinie)** w schema
- OG image regenerowany z **EST. 2026** (zamiast EST. 2024)
- GSC verification: **skip** (DNS verify przez Cloudflare jest equivalent, nie potrzeba meta tagu)

### Sesja 14 (2026-05-23) — SEO Strategy 2026 + Blog Content Automation v1
**Cel:** stworzyć długoterminową strategię SEO + automatyzować generowanie blog content w Claude Code.

#### Strategia SEO 2026 (analiza branżowa)
- Web research: trendy SEO 2026, E-E-A-T marzec 2026, programmatic SEO, long-tail keywords
- Kluczowe insights: Experience > Authority (Google March 2026), long-tail = 91.8% queries, AI Search to nowy SERP, consistency > velocity
- Plan 4-warstwowy: blog content (fundament) + EEAT building + long-tail (tools/comparison) + off-site (backlinks/AI search)

#### Blog automation v1
- **`docs/blog-style-guide.md`** — pełny style guide spójny ze stylem 3 istniejących postów (400-600 słów, 2× h2 + 2-3× h3, 1× lista, CTA blockquote, TAB indent)
- **`docs/blog-ideas.md`** — backlog 30+ pomysłów posortowany wg priorytetu (TOP PRIORITY, COMPARISON, EVERGREEN, VERTICAL, DEVELOPER)
- **`.claude/commands/new-post.md`** — slash command `/new-post [temat]` który czyta style guide + posts.ts, robi research, pokazuje outline, pisze post w stylu 1:1, dodaje do `posts.ts`
- Update **CLAUDE.md** — nowa sekcja "Blog content workflow (automation)"

### Sesja 15 (2026-05-23) — Blog Research Mode (multi-source)
**Cel:** rozbudować automation o proaktywny research tematów (trafność na teraz i przyszłość).

- **Update `.claude/commands/new-post.md`** — gdy brak argumentu, robi multi-source research (4 WebSearch'e):
  - **HOT NOW** (newsy ostatnich 30 dni — spike 1-2 tyg)
  - **EMERGING** (trendy na fali — hot za 3-6 mies)
  - **SEASONAL** (sezonowość kwartalna: Q4 e-commerce, Q1 plany roczne itp.)
  - **EVERGREEN** (z backlog'a — długoterminowy traffic)
- **`.claude/commands/blog-research.md`** — **nowy** standalone command `/blog-research` który tylko odświeża backlog (bez pisania posta): 5-7 WebSearch'e → filtruje → dodaje 10-15 nowych tematów do sekcji "🔥 Trending" w `docs/blog-ideas.md`
- **Update `docs/blog-ideas.md`** — dodana sekcja "🔥 Trending (auto-found przez research)" z historią dat research'u (najnowsze na górze)
- **Update CLAUDE.md** — workflow miesięczny: `/blog-research` 1×/mies + `/new-post` 1-2×/tydz = 2-4 posty/mies

### Sesja 16 (2026-05-23) — Impact section: WebGL shaders (by user)
**Cel:** wzmocnić bento grid Impact'u customowymi WebGL fragment shaders dla każdego z 4 kafli.

- **Impact.tsx** rozbudowane przez usera o:
  - `SHADER_VS` — wspólny vertex shader (passthrough)
  - `SNOISE_GLSL` — Simplex noise function (Stefan Gustavson)
  - `TOPO_FS` — topographic contour lines (kafel 1, niebieski, "Inwestycja nie Koszt")
  - `ORBS_FS` — indigo contours (kafel 2, indigo, "Wirtualny Asystent") — rzadsze warstwice, większy spacing
  - `VOLTAGE_FS` — voltage field z sparkami (kafel 3, żółty, "Wydajność i SEO") — bias do dolnej połowy żeby chronić counter "99%"
  - `SCAN_FS` — rim glow (kafel 4, zielony, "Stabilność") — statyczna green obwódka, zero pulsowania
  - Wspólny `ShaderCanvas` (jeden host JS) renderuje każdy FS na canvas o niskiej amplitudzie alpha (0.15-0.40) — efekt "ambient" pod treścią, nie główne danie
- **Stylistyka:** wszystkie shaders w rodzinie wizualnej (lines/contours/sparks/rim) — dopasowanie do całego bento gridu

### Sesja 17 (2026-05-24) — Full shader pipeline + iOS Liquid Glass + perf tuning
**Cel:** rozszerzyć WebGL shaders na Hero + Portfolio CTA + finetune Impact bento, dodać iOS-style glassmorphism na bento, zoptymalizować pod mobile bez utraty desktop quality.

#### Hero — Aurora shader (`components/sections/Hero.tsx`)
- Dodany `AuroraBackground` (inline component) — WebGL fragment shader: 3-warstwowy domain-warped simplex noise w palecie brand (#112b82 royal / #2f5beb electric / #60a5fa sky), vertical falloff + elliptical vignette
- Iteracje: usunięte "jasne fringes" (warstwa `n4`), zmniejszony grain (0.035 → 0.018 → zakomentowany)
- **Mobile gate:** `useLayoutEffect` + `matchMedia('(min-width: 1024px)')` → na mobile shader NIE mountuje się, mobile dostaje statyczny radial gradient (zero JS, zero rAF, zero GPU loop). Krytyczne dla mobile TBT.

#### Portfolio CTA — Liquid Glass shader (`components/sections/Portfolio.tsx`)
- Dodany `LiquidGlassBackground` (inline) — symulacja wnętrza szkła: UV displacement (faked refraction), radial depth gradient z biasem do prawego górnego rogu, orbitujący specular highlight, rim glow, ciemny rdzeń pod tekstem
- Iteracje: ostre caustics (frędzle) rozmyte przez lower freq + szerszy smoothstep + lower amplitude (0.28 → 0.10)
- `IntersectionObserver` z `rootMargin: 200px` — pauza rAF gdy karta poza viewport (Portfolio sticky 300vh ma ją "za ekranem" mimo aktywnego DOM)

#### Impact bento — pełna spójność contour family (`components/sections/Impact.tsx`)
- Każdy z 4 kafli ma własny shader z tej samej rodziny wizualnej (contour lines z simplex noise), ale inną paletą, częstotliwością, kierunkiem driftu, period warstwic, falloff:
  - **TOPO_FS** (kafel 1, blue, col-span-2) — bias upper-right + text dim upper-left (chroni icon + h3 + p)
  - **ORBS_FS** (kafel 2, indigo, single) — edge bias `smoothstep(0.15, 0.85, length(p))` — dim center gdzie text, bright krawędzie pod glass
  - **VOLTAGE_FS** (kafel 3, yellow, single) — **linear opacity gradient od środka do krawędzi** `smoothstep(0.0, 1.5, length(p))` — yellow ma najwyższą luminancję, wymaga gradient'a żeby kontrast z białym "99%" i h3 nie pękł
  - **SCAN_FS** (kafel 4, green, col-span-2) — bias right + text dim left (lustrzane odbicie kafel 1, button po prawej ma własne bg)
- Wewnętrzna różnorodność: inne `t * (0.04-0.05)` tempo, inne freq noise (1.2/1.4/1.6/1.8), inny period warstwic (2.5/2.8/3.0/3.2)

#### `GlassEdge` (iOS 26 Liquid Glass na bordzie boxa)
- Komponent renderujący `backdrop-filter: blur(8px) saturate(150%)` na ringu zewnętrznym karty
- Ring shape: **4 linear gradient mask layers** (right→left, left→right, bottom→top, top→bottom) z domyślnym composite `add` — opaque na krawędziach, transparent w środku. Brak hard edges (XOR mask-composite tworzył widoczne ramki w ramkach)
- `z-5` — pod tekstem (`z-10`+), nad shaderem (z-auto). Blur działa na shader/dekoracje, nie na tekst (klucz dla kontrastu)
- Karty 2 i 3 dostały dodatkowy wrapper `relative z-10` żeby content był nad GlassEdge (pozostałe miały już ten wrapper)
- Border kart: `border-white/5` → `border-white/15` (3× bardziej solidna ramka, eliminuje świecenie shadera na rounded corners)

#### Performance tuning (desktop 98 / mobile 85)
- **Hero shader: desktop only** — usunięcie WebGL z mobile to TBT killer fix (6800ms → ~200ms)
- **Impact `ShaderCanvas`:**
  - DPR clamp `2.0` → `1.25` (4× shaderów × 2.5× fewer pixels/frame)
  - **30fps throttle** zamiast 60fps rAF (contour animują się przy `t*0.04`, oko nie zauważa różnicy)
  - `IntersectionObserver` pauza gdy poza viewport
- **`GlassEdge`:** `blur(12px)` → `blur(8px)`, usunięty `brightness(108%)` (mniejszy composite cost)
- `useReducedMotion` respektowany na wszystkich shaderach Impact

#### Wnioski perf tuning
- Próba dodania `LiquidGlassBackground` do mobile Portfolio CTA + `GlassEdge` mobile gate + DPR/throttle na `LiquidGlassBackground` razem → desktop drop 98 → 61 (mismatched changes). Cofnięte, stan przywrócony do desktop 98 / mobile 85
- Test PageSpeed w incognito zawsze najbardziej miarodajny (extensions/devtools/cache mogą zaburzać metryki w zwykłej karcie)

### Sesja 18 (2026-05-24) — Shadery na /o-nas + /uslugi/strony-www/one-page/ + Paper Design patterns
**Cel:** rozszerzyć WebGL pipeline na podstrony (/o-nas + service pages). Iteracje z user feedbackiem do "premium z wyczuciem" stanu na każdej powierzchni.

#### /o-nas — Aurora shader za "AVENLY" textem (`app/o-nas/page.tsx`)
- Dodany inline `AuroraBackground` (~150 linii) — wariant Hero aurora ale:
  - 4 warstwy noise (zamiast 3 z Hero) — bardziej dynamic
  - **Tempo `t * 0.18`** (2× szybciej niż Hero 0.09) — bardziej dynamic flow
  - Stronger domain warping (`n1*0.8` push) — organic chaos
  - **Paleta poszerzona o indigo + violet** (`#0a1452` → `#2e268f` → `#4a2e99` → `#3b82f6`) — większa hue variation niż Hero (który ma czyste blues)
- Mobile gate identyczny jak Hero (`matchMedia('(min-width: 1024px)')`) — mobile dostaje 2 statyczne radial gradient (zero WebGL/rAF)
- Zachowane: GSAP timeline `scale: 1.2` na `bgRef` (canvas się stretch'uje, slight blur acceptable dla atmospheric bg), `mix-blend-multiply` na textRef (AVENLY mixes z aurora pattern)

#### /uslugi/strony-www/one-page/ — Hero rays + Bento shaders (`app/uslugi/strony-www/one-page/OnePageClient.tsx`)

**Hero top — "God Rays" shader:**
- Dodany `RaysBackground` (inline) — wąskie wiązki światła z punktu nad viewportem
- Sun position `(0, 1.4)` (close to viewport top) — clear "spotlight from above"
- **Sun horizontal sway** `sin(t*0.18) * 0.35` — rays "kołyszą się" ~35s cycle
- **Per-ray flicker** modulowany kątem (`sin(t * 1.3 + angle * 2.0)`) — każda z 5 warstw migocze niezsynchronizowanie, organiczny żywy effect
- **Overall breath** modulation (`0.85 + 0.15 * sin(t * 0.5)`) — subtle pulse całości
- **5 warstw** rays z różnymi częstotliwościami kątowymi (3.5/5/6/8/11) + przeciwbieżne drifty
- Bardzo wolny falloff (`exp(-d * 0.10)`) — rays sięgają DUŻO dalej niż standardowo
- Canvas `h-screen` (full viewport) — rays "stretched" przez cały top strony
- Pure pitch black bg (`bg-[#000000]` we wszystkich 5 surfaces), bez radial gradient overlay
- Tło `absolute top-0 h-screen` zamiast `fixed inset-0` — scroll'uje razem ze stroną
- **Mobile gate:** matchMedia → mobile zero shaderów, czysty `#000000`

**Bento na dole strony — 4 inne shadery niż Impact (różne visual languages):**
- **Card 1 "Laserowe skupienie"** (col-span-2, Target): **Radial Pulse Rings** — koncentryczne pierścienie ekspandujące z punktu off-center (powers 8/10/8/6 — sharp "laser-like" rings po user feedback'u)
- **Card 2 "Błyskawiczna weryfikacja"** (single, FastForward): **Warp** (Paper Design pattern) — domain-warped color field, smooth fluid flow, no shapes
- **Card 3 "Idealne pod Mobile"** (single, Smartphone): **Warp** (ten sam shader co Card 2)
- **Card 4 "Kompaktowa wydajność"** (col-span-2, Zap): **Liquid Metal** (Paper Design pattern) — domain-warp + power-sharpened specular peaks (`pow 5`) + chromatic 2-color blend (base blue → bright peak)

**Wspólne dla bento one-page:**
- Pełna kopia `ShaderCanvas` host + `GlassEdge` z Impact section (DPR 1.25, 30fps throttle, IO pause)
- Wszystkie shadery przez `isDesktopViewport` gate + `useReducedMotion` respect
- GlassEdge z `blur(16px) saturate(170%) brightness(110%)` (mocniej niż Impact `blur(8px)`)
- Mask `transparent 15%` (was 28% — user wanted blur skoncentrowany ONLY na samych krawędziach)

#### Iteracje (key user feedback)
- Plasma orb (oryginalnie) → "czarna dziura" bugs przez `atan(d.y, d.x)` singularity + `pulse1 * pulse2` (product creates dark interference rings). **Fix:** zero atan + SUM zamiast PRODUCT
- Mesh gradient (3 drifting blobs) → "brzydkie" → wymieniono na Warp
- Speed streaks / vertical flow → rejected → wymieniono na Warp i Liquid Metal
- "3D volumetric rim" z multi-layer inset shadows → rejected → cofnięte do simple inset shadow

#### Paper Design Shaders reference
Library: [paper-design/shaders](https://github.com/paper-design/shaders) — zero-dep canvas shaders zaprojektowane dla premium card backgrounds. 30+ presets m.in.: Mesh Gradient, Warp, Liquid Metal, Smoke Ring, Waves, Swirl, Spiral, Voronoi, Neuro Noise, Perlin/Simplex Noise, Dot Orbit, Dot Grid, Dithering, Pulsing Border, Color Panels, Halftone, Heatmap, Fluted Glass. **Aplikujemy patterny GLSL-em inline** (bez deps), zachowując kompozycyjne idee z library.

### Sesja 19 (2026-05-25) — UI/UX podstrona + SyncedShaderCanvas + Hero perf + a11y dla chat-CTA
**Cel:** kompletny przerób `/uslugi/design/ui-ux` (najcięższa wizualnie podstrona w projekcie) + perf hotfixy na Hero + cleanup chat-CTA UX.

#### `/uslugi/design/ui-ux/page.tsx` — pełna rebudowa visualu

**Hero "Iridescent Flow" shader** (po wielu iteracjach z user feedbackiem):
- `MeshGradientBackground` (inline) — Paper Design "Mesh Gradient × Wave Distortion" hybryda
- **5-octave domain warp** (`p.y * 1.4 / 1.8 / 3.6 / 7.0 / 14.0`) — multi-scale detail
- **IQ cosine palette** (`a + b·cos(2π(c·t + d))`) z ciasnymi RGB phase shifts → **blue-dominant** (brak rainbow, brand-locked)
- **2 palette passes** (`palette(v) + palette(v*0.55 + ...)` mixed 40%) — dwie nakładające się fale jasne/ciemne
- **Lime-300 accent** w upper-right (matching hero gradient `from-blue-400 to-lime-300`) — pulsuje tylko w peakach warpu, region-restricted
- **Slate-blue + dark navy** mocne highlight/shadow peaks → wyraźne dark↔light variations
- **Sheen band** (specular streak) + soft vignette + brightness floor `(0.018, 0.020, 0.045)`
- Bottom fade mask (linear gradient `to bottom, transparent → #000`) wycisza shader poniżej hero
- Tempo `t * 0.18` (ostateczne — 80% szybciej niż początkowy 0.10 baseline)

**Bento "SyncedShaderCanvas" (4 karty = 1 wspólny shader):**
- Nowa klasa `SyncedShaderCanvas` (~110 linii) z uniformami `u_offset` + `u_global_size`
- **`SHARED_T0 = performance.now()`** module-level → wszystkie 4 instancje używają tej samej linii czasu (lock-step animacja)
- Każda karta mierzy pozycję względem `bentoWrapperRef` → renderuje swój wycinek wspólnej "wirtualnej powierzchni"
- **Layout cache** — `getBoundingClientRect()` wywoływany TYLKO na ResizeObserver + passive `scroll` listener, nie co frame → eliminuje 240 layout reads/s
- CSS `filter: blur(14px)` na wrapper `-inset-4` (canvas 16px szerszy niż karta — clean clip przez card overflow:hidden)
- Bento `BENTO_SYNCED_FS`: 3-octave warp + brand IQ palette + lime accent w dolnej-prawej części global composition (gdzie wide KARTA 4)
- **Karty bez hover** (świadomie usunięte) — `group`, `hover:bg-white/[0.04]`, `hover:border-blue-500/30`, `group-hover:scale-110`, `group-hover:text-blue-400` — wszystko wywalone

**GlassEdge "Dramatic" (najmocniejszy w projekcie):**
- `blur(32px) saturate(200%) brightness(120%) contrast(110%)` — wszystkie 4 filter funcs stacked
- Mask `transparent 28%` (szerszy soft ring) — vs `15%` w service subpages
- Wzmocnione highlight stack: `inset 0 1.5px 0 rgba(255,255,255,0.30)` (top) + `inset 0 -1.5px 0 rgba(0,0,0,0.35)` (bottom) + 1px white outline
- Aplikowany na 4 bento + hero mockup (right side) → spójność glass w całej UI/UX podstronie

**Iteracje (dużo prób-błędów z user feedbackiem):**
- Wave ripples → "brzydkie" → Blueprint patterns → "tragiczne" → Iridescent Flow → "fajne" (final)
- Border Beam (animated conic gradient ring) → "wygląda jak gówno" → revert
- Per-card distinct configs → "zbyt różne" → unified shader z position-aware uniforms (final)

#### Hero (homepage) — `components/sections/Hero.tsx` perf hotfix
**Diagnoza:** AuroraBackground działał 60fps non-stop bez IO pause, DPR 2.0, brak visibility pause → saturował GPU główny wątek, lagujące Reveal animacje innych sekcji.

**Naprawa (zero visual change):**
- ✅ Dodany **IntersectionObserver pause** (rootMargin 100px) — shader stoi gdy user scrolluje poza Hero
- ✅ **30fps throttle** (Aurora animuje przy `t*0.12`, 30fps wygląda identycznie)
- ✅ **DPR clamp 2.0 → 1.5** (diffuse shader, visually imperceptible)
- ✅ **`document.visibilitychange` listener** → pauza gdy karta nieaktywna (background tab)
- ✅ Pełny cleanup w `useEffect` return (`io.disconnect()` + `removeEventListener`)
- `runningRef` flag dodany, dopasowany do innych shaderów w projekcie

#### `/o-nas` — chat-CTA fix
- Kafelek "Inne pytanie? Zapytaj naszego Avenly AI" pod FAQ kierował przyciskiem do `<a href="/kontakt">` zamiast otwierać chat
- **Fix:** zamiana `<a>` → `<button onClick={() => window.dispatchEvent(new Event("avenly:open-chat"))}>` + `aria-label="Otwórz asystenta AI Avenly"`

#### `/realizacje` — wymiana brzydkiego CTA
- Stary CTA "Twój projekt może być następny" (gradient bg + grid pattern + biały button → `/kontakt`) zastąpiony eleganckim modal'em z `/o-nas` (Sparkles ikona + outer blur halo + glass card)
- Heading skopiowany 1:1 ze stylu, copy zaadaptowane: "Inne pytanie?" → "Masz pytania?" (kontekst portfolio)
- Przycisk dispatchuje `avenly:open-chat` zamiast nav do `/kontakt`
- Dodane importy `Sparkles, MessageSquare` w `app/realizacje/page.tsx`
- Canonical Tailwind v4: `bg-gradient-to-r` → `bg-linear-to-r` (warning fix)

#### `app/layout.tsx` — white flash fix
- Podczas Next.js route transition z homepage do `/uslugi/` (etc.) krótko widać biały bg między Hero unmount a nową stroną
- **Root cause:** `<html>` element bez explicit bg → browser default white. `<body>` ma `bg-[#050505]` ale w transition jest moment gdy html paint pokazuje się przed body
- **Fix:** `<html className="dark bg-[#050505]">` — teraz html bg zawsze dark, brak białego błysku przy klikaniu nav linków z hero

#### `components/sections/Impact.tsx` — GlassEdge upgrade
- Z weaker version (`blur(8px) saturate(150%)` + mask 28%) → strong version (`blur(16px) saturate(170%) brightness(110%)` + mask 15%)
- Match z 5 service subpages (jednolite szkło na całej homepage + service pages)

#### `app/uslugi/ServicesHub.tsx` — subnavigation entry animation
- Filter tabs (Wszystkie / Strony WWW / Design / etc.) dostały Framer Motion entry animation
- Pill bar container: `initial: opacity:0 y:-12 → animate: opacity:1 y:0` z `ease-out-expo`
- Każdy tab: stagger 70ms (delay 0.15 + i*0.07) — Apple-style sequential reveal
- `transition-all` → `transition-colors` na buttonach (żeby Framer mogło sterować transformami bez konfliktu)

#### `app/data/services.ts` — broken hrefs fix
- ✅ Design card: `/uslugi/design/design-stron-internetowych` (404) → `/uslugi/design/ui-ux`
- ✅ Marketing card: `/uslugi/marketing/audyt-seo-wydajnosci` (404) → `/uslugi/marketing/audyt-wydajnosci-seo`

#### Performance audit całych 6 podstron usług
Zidentyfikowane hotspoty (`progress.md` dla pełnego raportu):
- UI/UX = najcięższa (GlassEdge 32px + filter blur 14px + 5-octave hero shader + 4× SyncedShaderCanvas)
- 5 pozostałych = baseline OK (wszystkie z IO pause, 30fps throttle, DPR 1.25, desktop gate)
- Single optimization applied: SyncedShaderCanvas layout cache (240 → 0 layout reads/s idle)

### Sesja 20 (2026-05-26) — /o-nas Stat Cards Fluid + Production Navigation Fixes
**Cel:** rebuild sekcji statystyk na /o-nas (z prostego spotlight bordera na cohesive layered fluid + glassmorphism) + naprawić wszystkie production click navigation bugs które blokowały Linki na produkcji.

#### `/o-nas` Statistics Cards — pełna rebuild visualu

**Multi-iteration design process** (z user feedbackiem):
1. **Iteracja 1**: Liquid Mouse Glow blob podążający za myszką → user: "tragicznie wygląda, chodziło o efekt jak był tam ze bordery sie animuja wokol kursora"
2. **Iteracja 2**: Multi-layer spotlight border (Vercel-style, ale shader-powered) — wszystkie 4 karty świecą po stronie kursora przez 1px ring
3. **Iteracja 3**: Dodany GlassEdge (Dramatic tier, identyczny z UI/UX) — blur 32px saturate 200% brightness 120% contrast 110% + 4 linear gradient masks 28% — backdrop-blur na 1px ring nakłada lensing effect na shader
4. **Iteracja 4**: User: "ten shader na hover dopasuj do glass" — stłumiona paleta (brand `#2e6ad9` zamiast `#3b82f6`, soft light blue zamiast cyan), wider radius (`smoothstep 1.1`), reduced peak (0.70), shimmer 0.06 — glass saturate przywraca do oryginalnego brand intensity
5. **Iteracja 5**: User: "fluid który idzie za kursorem i przechodzi płynnie przez karty" → **SyncedShaderCanvas pattern** (jak UI/UX bento) — `u_offset` + `u_globalSize` uniformy, każda karta renderuje wycinek globalnej kompozycji, mouse position w grid coords, blob "przepływa" między kartami z lerp 0.10 (viscous)
6. **Iteracja 6**: User: "border się psuje, przenieś efekt na tła kart a na borderze też zostaw" — inner bg z opaque na `bg-[#0a0a0c]/55` (45% transparent), shader widoczny przez całą kartę z mocniejszym intensity na 1px borderze
7. **Iteracja 7**: User: "ciemniejsze tło" — `bg-gradient-to-b from-black/85 via-black/78 to-[#06070a]/65`
8. **Iteracja 8**: User: "bardziej dynamiczne, więcej tego efektu, wielowątkowość" — 5 blobów z różnymi pattern motion (horizontal sweep + orbital + Lissajous + counter + fast Lissajous), multi-octave domain warp, 45fps throttle
9. **Iteracja 9**: User: "jedna całość, bardziej zbita, przy dole, ciemniejsze tło" — refactor na **wavy fluid surface** (jedna cohesive masa cieczy u dołu kart) — 3 sinusy + noise displacement określają top edge fluid, foam glow na crest
10. **Iteracja 10**: User: "fala z warstwami" — final design: **3 stratified wave layers** (top = light blue, middle = brand, deep = indigo), każda warstwa ma własną wave displacement (różne częstotliwości + przeciwbieżne kierunki + niezależny snoise displacement), foam na każdej surface crest = 3 widoczne wave fronts
11. **Iteracja 11**: User: "ciemniejsze tło" — `bg-gradient-to-b from-black/92 via-black/87 to-black/75`
12. **Iteracja 12**: User: "daloby się zrobić tak żeby hover wpływał na shader" — **mouse disturbance**: bulge wszystkich 3 surface lines w stronę kursora (top -0.14, mid -0.10, deep -0.06) + bright cyan halo wewnątrz fluid mass, smooth fade in/out (lerp 0.08, ~270ms)

**Finalna architektura `/o-nas` stat cards:**
- `StatCard` sub-component z `globalMouseObj` + `hoverStateObj` props (stable refs z parenta)
- `HoverShader` z uniforms: `u_time`, `u_resolution`, `u_offset`, `u_globalSize`, `u_mouse`, `u_hover`
- `cardLayoutsRef` + `gridSizeRef` measured raz na mount + ResizeObserver (eliminuje 240 layout reads/s)
- Frame rate: 45fps throttle (idle wave motion) + lerp 0.08 hover smoothing
- DPR clamp 1.25, IntersectionObserver pause poza viewport
- GlassEdge Dramatic tier (czwarta lokacja po UI/UX bento + UI/UX hero mockup)
- Inner bg: `bg-gradient-to-b from-black/92 via-black/87 to-black/75` (ciemne tło dla glass contrast)

#### Production Navigation Bugs — kompletny fix

**Bug 1: Scroll lag przy reveal animations**
- **Diagnoza**: `Reveal` komponent używał `motion.div` z `whileInView` — każdy element robił MotionValue subscription + per-frame style recalc na main thread → Lenis rAF lag → scroll stuttering gdy wiele elementów wjeżdża w viewport
- **Fix**: `components/Reveal.tsx` przepisany na **CSS-only** — IntersectionObserver triggers `transform: translate3d` + `opacity` z CSS transition (kompletnie GPU compositor, zero main thread cost)
- `willChange` aktywne tylko PRZED animation (gdy hidden), po `auto` (zwalnia GPU layer)
- Respect `prefers-reduced-motion`, one-shot IO (disconnects after trigger)

**Bug 2: Lewy klik na Linki nie nawiguje, środkowy klik działa**
- **Diagnoza** (po wielu iteracjach):
  - Sprawdzone hipotezy odrzucone: Cloudflare cache, `.htaccess` routing, Service Worker, Rocket Loader, hydration mismatch
  - User dostarczył F12 Console errors: **`__next.uslugi.strony-www.dedykowane-strony-www.txt?_rsc=... 404 (Not Found)`**
  - **Root cause**: Next.js 16.1.1 + `output: 'export'` generuje pliki RSC payload (dla client-side routingu) z **slashami** w nazwie (`__next.uslugi/strony-www/one-page.txt`) które Apache interpretuje jako foldery. Browser fetchuje URL z **kropkami** (flat name) → 404 → router silent fail → click nie nawiguje. Middle click bypassa router więc działa default `<a>` browser navigation.

- **Fix 2a**: `scripts/flatten-rsc.mjs` — **post-build script** który chodzi po `out/`, znajduje nested `__next.xxx/yyy/zzz.txt` i tworzy kopie z flat nazwą `__next.xxx.yyy.zzz.txt` w docelowym folderze. Pierwszy build: **45 plików sflatted, 115 skipped (już były flat)**.
  - `package.json`: `"build": "next build && node scripts/flatten-rsc.mjs"`

- **Fix 2b** (preventive): usunięty CAŁY Framer Motion z `components/sections/Services.tsx` + `app/uslugi/ServicesHub.tsx` (homepage Services + katalog). Hipoteza była że Framer Motion 12 + Next.js 16 production build mają conflict — okazało się że root cause to RSC bug, ale Framer Motion removal pozostaje (entry animations zastąpione przez Reveal CSS-only, tab switching instant, filter tabs plain div/button, mobile accordion CSS grid-rows technique `0fr ↔ 1fr`).

**Bug 3: "Dziwne rzeczy się dzieją" przy navigacji z homepage**
- **Diagnoza**: `SmoothScrolling.tsx` useEffect na pathname change wołał `ScrollTrigger.refresh()` na elementach które właśnie się unmountowały (homepage ma 3 duże piny: Hero scale 50, Portfolio 300vh sticky, Process timeline). `refresh()` na half-disposed pinach → race conditions, glitche, czasami silent fail
- **Fix**: usunięty `ScrollTrigger.refresh()` z pathname reset useEffect + reset opakowany w `requestAnimationFrame` (React kończy unmount starych ScrollTriggers → następny frame → Lenis scroll reset → nowa strona ma fresh ScrollTriggers auto-detected przez GSAP context). ScrollTrigger.refresh() pozostał w `performScroll` (anchor logic) — to nie konfliktuje z navigation.

#### Pliki dodane / zmienione w Sesji 20

**Nowe:**
- `scripts/flatten-rsc.mjs` — workaround Next.js 16 RSC bug (post-build flatten)

**Zmodyfikowane:**
- `app/o-nas/page.tsx` — pełna rebuilda stat cards (StatCard component, HoverShader z global UV + bulge + halo, layout cache, GlassEdge Dramatic, ciemne bg gradient)
- `components/Reveal.tsx` — Framer Motion → CSS-only IntersectionObserver + transform/opacity
- `components/sections/Services.tsx` — usunięte ALL Framer Motion (motion.div/AnimatePresence wokół Linków), CSS grid-rows mobile accordion, Reveal entry
- `app/uslugi/ServicesHub.tsx` — usunięte ALL Framer Motion (filter tabs plain DOM, service grid plain div)
- `components/providers/SmoothScrolling.tsx` — pathname reset useEffect simplified (no ScrollTrigger.refresh + requestAnimationFrame defer)
- `package.json` — build script z flatten-rsc post-hook

### Sesja 21 (2026-05-26) — Safari Mobile Compatibility Audit
**Cel:** naprawić 3 widoczne issues na iPhone Safari (Chatbot ucina się od góry, Realizacje filter nie scrolluje, Impact "Stabilność" karta layout rozjeżdża się) + pełen systematyczny audit projektu pod kątem znanych Safari quirks.

#### Issue 1 — Chatbot okno ucina się za URL barem iPhone'a (`components/chatbot/Chatbot.tsx`)
- **Diagnoza**: `h-140` (560px stała) + `bottom-24` (96px) = wymaga viewport ≥ 656px. iPhone z URL barem ma 600-650px → header "AVENLY • AI Online" ląduje POZA viewport, user widzi tylko fragment okna z body+input.
- **Fix**: `h-140` → `style={{ height: "min(35rem, calc(100dvh - 7.5rem))", maxHeight: "calc(100dvh - 7.5rem)" }}` — dynamic viewport height respektuje URL bar Safari, okno zawsze mieści się na ekranie.

#### Issue 2 — Realizacje filter nie scrolluje na Safari mobile (`app/realizacje/page.tsx`)
- **Diagnoza**: pattern `<div overflow-x-auto><div w-max mx-auto>` na Safari mobile gubi horizontal scroll w lewo. `mx-auto` na content szerszym niż viewport powoduje że Safari nie pozwala przewijać do lewej krawędzi.
- **Fix**: zamiana wzorca na `<nav overflow-x-auto overscroll-x-contain><div flex justify-center min-w-max px-6><div flex gap-1 ...>`. `min-w-max` rezerwuje miejsce na content szerszy niż viewport, `justify-center` centruje gdy się mieści, scroll działa gdy nie.
- **Bonus**: zastosowane też w `app/uslugi/ServicesHub.tsx` (ten sam pattern z `w-max mx-auto`).

#### Issue 3 — Impact "Stabilność & Bezpieczeństwo" karta layout rozjeżdża się (`components/sections/Impact.tsx`)
- **Diagnoza**: zewnętrzny `flex flex-col md:flex-row items-center gap-8` + dziecko z `flex-1`. Na mobile (flex-col) `items-center` centruje cross-axis, ale `flex-1` ≠ `w-full` w flex-col → dziecko ma intrinsic width zamiast zająć 100%. Efekt: ikona+h3 (krótki content) i paragraf (dłuższy) są wycentrowane osobno → wygląda na "krzywe".
- **Fix**: `items-center` → `items-start md:items-center` + `flex-1` → `w-full md:flex-1`. Mobile: dziecko zajmuje pełną szerokość, content wyrównany od lewej.

#### Audit #1 — `overflow-x-auto + mx-auto + w-max` pattern (Safari mobile blocker)
- ✅ Realizacje filter — naprawione
- ✅ ServicesHub filter — naprawione (ten sam pattern)
- ✅ Portfolio mobile — OK (używa `overscroll-x-contain` + `snap-x`)
- ✅ Services mobile cards — OK (full-bleed pattern)
- ✅ BlogList categories — OK (`touch-pan-x` + pointer events)

#### Audit #2 — viewport units (`100vh` → `100dvh`) w sticky pinach
- **Problem**: Safari mobile `100vh` ≠ widoczny viewport (URL bar wlicza się). Sticky piny z `h-screen` (alias do `h-[100vh]`) na mobile mają wysokość WIĘKSZĄ niż widoczny ekran → content overflow'uje, scroll laguje.
- **Verified**: sticky piny na podstronach usług NIE używają GSAP (są CSS-only `position: sticky`), więc zmiana `h-screen` → `h-dvh` jest bezpieczna (nie psuje sync z `ScrollTrigger.create({ trigger, pin })`)
- **Files zmienione** (7):
  - `components/sections/Portfolio.tsx` — `h-[100vh] md:h-[300vh]` → `h-dvh md:h-[300vh]` (mobile dvh, desktop vh zachowane bo `300vh` to scroll distance dla Framer Motion useScroll — dvh dynamic by powodowało pin jumps); sticky child też `h-screen` → `h-dvh`
  - `app/uslugi/strony-www/one-page/OnePageClient.tsx` — wszystkie sticky `h-screen` → `h-dvh`
  - `app/uslugi/strony-www/sklepy-internetowe/ShopClient.tsx` — j.w.
  - `app/uslugi/strony-www/profesjonalna-strona-firmowa/CorporateWebsiteClient.tsx` — j.w.
  - `app/uslugi/strony-www/dedykowane-strony-www/DedicatedWebsiteClient.tsx` — j.w. (mimo Framer Motion useScroll — useScroll mierzy względem ref, nie zależy od sticky height)
  - `app/uslugi/strony-www/aplikacje-webowe/AppWebClient.tsx` — j.w.
  - `app/uslugi/automatyzacje-ai/chatboty-ai/ChatbotsAIClient.tsx` — j.w.

#### Audit #3 — `overflow-clip` / `overflow-x-clip` (Safari 16+ only)
- **Problem**: `overflow-clip` to nowy CSS spec wymagający Safari 16+. Browserslist projektu obejmuje Safari 15+ → Safari 15 ignoruje `clip`, daje fallback `visible` (overflow nie wycina).
- **Fix**: 5 plików — `overflow-x-clip` → `overflow-x-hidden`:
  - `app/uslugi/strony-www/sklepy-internetowe/ShopClient.tsx`
  - `app/uslugi/strony-www/profesjonalna-strona-firmowa/CorporateWebsiteClient.tsx`
  - `app/uslugi/strony-www/dedykowane-strony-www/DedicatedWebsiteClient.tsx`
  - `app/uslugi/strony-www/one-page/OnePageClient.tsx`
  - `app/uslugi/strony-www/aplikacje-webowe/AppWebClient.tsx`
  - `app/uslugi/automatyzacje-ai/chatboty-ai/ChatbotsAIClient.tsx`

#### Audit #4 — `backdropFilter` bez `WebkitBackdropFilter` prefix
- **Problem**: Tailwind utility `backdrop-blur-*` auto-prefix'uje, ale inline style `style={{ backdropFilter: ... }}` wymaga ręcznego dodania `WebkitBackdropFilter` parą. W większości plików (Impact, UI/UX, 5 service subpages, /o-nas, Chatbot otoczka i bubble) jest poprawnie. ALE w `Chatbot.tsx` 3 miejsca miały tylko `backdropFilter` bez Webkit pary.
- **Fix** (`components/chatbot/Chatbot.tsx`):
  - Header (line 309): dodane `WebkitBackdropFilter: "blur(20px)"`
  - Quick reply chips (line 487): dodane `WebkitBackdropFilter: "blur(8px)"`
  - Input footer (line 541): dodane `WebkitBackdropFilter: "blur(20px)"`

#### Audit #5 — viewport meta + `<main>` height (notch + safe area)
- **`app/layout.tsx`**:
  - Dodane `viewportFit: 'cover'` w `export const viewport` — content wypełnia safe area (notch) zamiast czarne marginesy
  - `<main className="min-h-screen">` → `<main className="min-h-dvh">` — footer nie chowa się pod URL barem iOS gdy content krótszy niż viewport

#### Co user musi zrobić sam (poza kodem)
- **Duplikat quick reply w chatbocie** widoczny na screen 1: drugi quick reply ma identyczny tekst co pierwszy ("Chcę zautomatyzować procesy"). To config w Supabase `chatbot_config.quick_replies`, NIE kod. Popraw w CRM (`avenly-crm` → `/chatbot` → Tab Konfiguracja).

#### Weryfikacja
- ✅ `npx tsc --noEmit` → exit 0, zero TypeScript errors
- ✅ JSX struktura w Realizacje + ServicesHub balanced po refaktorze

### Sesja 22 (2026-05-27) — Mobile UX Bug Fixes + Shadery na mobile
**Cel:** naprawić 4 zgłoszone mobile UX bugi + włączyć shadery na podstronach usług na mobile.

#### 4 fazy fixów

**Faza 1 — Service subpages scroll-lock broken (HIGHEST IMPACT)**
- **Root cause**: Sesja 21 zamieniła `overflow-x-clip` → `overflow-x-hidden` w 6 plikach dla Safari 15 compat. Ale per CSS Overflow spec, `overflow-x: hidden` z domyślnym `overflow-y: visible` computuje `overflow-y` do `auto` → element staje się scroll containerem → wszystkie `position: sticky` w dzieciach pinują się do tego kontenera zamiast viewportu → Framer Motion `useScroll` (window-based) nie widzi scrolla → **animacje scroll-lock na 6 service subpages NIE DZIAŁAŁY**.
- **Fix**: cofnięte `overflow-x-hidden` → `overflow-x-clip` we wszystkich 6 plikach (one-page, profesjonalna, dedykowane, sklepy, aplikacje-webowe, chatboty-ai). Safari 15 (~1-2% userów) widzi fallback `visible` = drobny horizontal scroll OK vs zero animacji.
- **CLAUDE.md update**: zaktualizowana sekcja Safari mobile quirks z nową regułą "NIE używaj `overflow-x-hidden` na rootcontainerze z sticky pinami".

**Faza 2 — Mobile menu horizontal scroll**
- **Root cause**: Navbar `useEffect` na mobile menu open ustawiał tylko `document.body.style.overflow = 'hidden'`. 3 luki: brak lock na `html` element, Lenis `syncTouch:true` nadal łapał touch events, menu container `overflow-y-auto` mógł leakować scroll do parenta.
- **Fix**: dodane `html` overflow lock + `lenis.stop()`/`lenis.start()` + cleanup. `lenis` dodane do deps useEffect.

**Faza 3A — LifecycleManager focus listener**
- **Root cause**: `window.addEventListener('focus', ...)` na mobile odpalał się nieprzewidywalnie (iOS app switcher, system overlay, podczas momentum scroll) → wewn. `lenis.resize()` resetował scroll do cache'owanej pozycji = "random skok na górę strony".
- **Fix**: usunięty `focus` listener, zostaje tylko `visibilitychange` (deterministyczny).

**Faza 3B+C — SmoothScrolling pathname guard + syncTouch off na mobile**
- **B**: dodany `prevPathnameRef` guard — pathname reset useEffect odpalał się także na pierwszym render (mount). Jeśli mount złapał się na środek touch scrolla, jechał reset do (0,0). Teraz reset tylko gdy pathname RZECZYWIŚCIE się zmienił.
- **C**: dodany `isMobile` matchMedia state, `syncTouch: !isMobile` w Lenis options. Na mobile native iOS/Android scroll bez Lenis sync (eliminuje rare momentum scroll desync glitche).

**Faza 4 — ServicesHub + Realizacje filter mobile lift**
- `<nav>` dodane `snap-x snap-mandatory`, każdy button `snap-start`
- Edge fade gradient (mobile-only `md:hidden`) — sygnalizuje że jest więcej content
- Ikony schowane na <sm: `<Icon className="hidden sm:inline-block" />` (mieści się 4 pills zamiast 2.5 na iPhone)
- Padding `px-4 sm:px-5` → `px-3 sm:px-5` (mobile pills cieńsze)
- Inactive `text-slate-500` → `text-slate-400` (lepszy kontrast)
- `bg-gradient-to-r` → `bg-linear-to-r` (Tailwind v4 canonical)

#### Shadery na podstronach usług NA MOBILE (user request)
- Wcześniej shadery były **desktop only** w 6 plikach service subpages (Hero shader na home pozostaje desktop-only — udokumentowany TBT killer).
- Usunięty `isDesktopViewport` gate w 6 plikach: 5× strony-www Client + UI/UX page.tsx.
- **Mobile DPR clamp 1.0** (vs desktop 1.5 dla Rays / 1.25 dla bento ShaderCanvas) — mobile GPU oszczędza ~2× mniej fragment invocations.
- Zachowane: IO pause + 30fps throttle + `useReducedMotion` respect na wszystkich device'ach.
- Trade-off: PageSpeed mobile może spaść 5-10pt vs poprzedni desktop-only gate.
- UI/UX SyncedShaderCanvas DPR przekształcone z `const` na `let` z funkcją `computeDpr()` przeliczaną w `resize()`.
- Cleanup unused importów (`useState`, `useLayoutEffect`, `useIsomorphicLayoutEffect`).
- CLAUDE.md WebGL shaders table zaktualizowana: 5 wpisów z "desktop only" → "all devices" + DPR per device.

### Sesja 23 (2026-05-27) — Scope Cards Refactor + Glassmorphism + CTA Polish
**Cel:** zsynchronizować layout sekcji "Zakres prac" na 5 service subpages strony-www + dodać glassmorphism i CTA polish.

#### Scope cards — vertical stack + glassmorphism (all 5 strony-www subpages)
- **Layout**: 2-kolumnowy (heading lewo / cards prawo) → **vertical stack** (heading kompaktowy nad cards, centered horizontally)
- **Sticky child**: `flex items-center justify-center` → `flex flex-col items-center justify-center px-6 py-12 md:py-16`
- **Heading**: text-4xl md:text-5xl lg:text-6xl → text-3xl md:text-4xl lg:text-5xl, krótszy opis, max-w-2xl center
- **Cards container**: `max-w-2xl mx-auto flex-1` (centered horizontally)
- **Mask range**: `transparent 0%, black 10%, black 70%, transparent 100%` → `8%, black 8%, black 92%, transparent 100%` — 84% visible (vs 60% poprzednio) = **2 karty widoczne naraz**
- **Mask syntax**: `[mask-image:...]` → `mask-[...]` (Tailwind v4 canonical)
- **Spring**: `stiffness: 70, damping: 25` → `stiffness: 55, damping: 32` (wolniejszy, leniwy pływ)
- **Transform**: `['40vh', '-75%']` → `['0vh', '-55%']` (pierwsza karta visible od razu — start na 0vh, ostatnia nadal widoczna na końcu — koniec na -55%)
- **Section height**: `h-[300vh]` → `h-[400vh]` (więcej scrolla = bardziej oddychający)
- **Card style**:
  - Padding: `p-6 md:p-8` (lub `p-8 md:p-10`) → `p-7 md:p-10`
  - Border: `border-white/5` → `border-white/15` (eliminuje świecenie glass na rogach)
  - Rounded: `rounded-2xl` (lub `rounded-[2rem]`) → `rounded-3xl`
  - Title size: `text-xl md:text-2xl` → `text-2xl md:text-3xl`
  - Title tag: `<h4>` → `<h3>` (semantic)
- **Static brand glow**: każda karta ma `radial-gradient(ellipse 80% 60% at 80% 100%, rgba(brand-rgb, 0.18) 0%, ..., transparent 70%)` w prawym dolnym rogu — daje glassmorphismowi co blurować, zero JS/GPU cost
- **Glass rim** (zamiast pełnego GlassEdge):
  - Pierwsza iteracja: GlassEdge z `backdrop-filter: blur(16px) saturate(170%) brightness(110%)` na każdej karcie powodował lag scroll-lock (6 cards × backdrop-filter w sticky pin z animowanym translateY = scroll lag).
  - **Final**: lightweight rim `box-shadow inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.25)` — zero GPU cost (cache'owany box-shadow), zachowuje glass feel
- **GPU layer hint**: `willChange: 'transform'` na motion.div containerze ze scope cards
- **Watermark big number**: `text-[160px] md:text-[200px]` → `text-[150px] md:text-[180px]` + `-bottom-6` → `bottom-0` (overflow-hidden by ucinał)

#### CTA card "Gotowy na cyfrową Dominację?" (OnePage + Corporate)
- **Heading mobile fix**: text-3xl → `text-[2rem]` (32px na mobile) + `text-balance` + `<br className="md:hidden">` (controlled break)
- **Shader w tle**: `<ShaderCanvas fragmentShader={MESH_GRADIENT_FS / WARP_FS} />` z `opacity-60` (mocno widoczny mesh gradient flow)
- **Lekka vignette**: radial gradient `rgba(8,8,8,0.25 → 0.55 → 0.75)` (lżejsze niż poprzedni `0.55 → 0.95`)
- **GlassEdge** dodany (iOS Liquid Glass na bordzie)
- **Rounded**: `rounded-[1.5rem] md:rounded-[2rem]` (outer + inner) → `rounded-3xl` (matching GlassEdge)
- **Border**: `border-white/10` → `border-white/15`
- **Wszystkie `bg-gradient-to-r`** → `bg-linear-to-r` (Tailwind v4 canonical)

#### Browser mockup URL bar — fix overlap z kropkami (OnePage + AppWeb)
- **Root**: URL bar miał `absolute left-1/2 -translate-x-1/2 w-[65%] md:w-1/2` (centered) — nachodził na 3 colored dots na mobile (Mac OS style traffic lights).
- **Fix**: usunięty absolute centering + `justify-between` z toolbar parent. Toolbar `flex items-center gap-2`, URL bar `flex-1 max-w-md`. Kropki po lewej, URL bar 8px obok (matching gap-2 między kropkami), rozciąga się do `max-w-md`.

### Sesja 24 (2026-05-27) — Hero Performance Overhaul + Portfolio Depth + Bento Corner Fix
**Cel:** wyeliminować ścinki/lag na Hero initial load + dodać głębię do Portfolio + naprawić shader prześwitywanie przez border na bento boxes.

#### Hero performance overhaul (multi-iteration)
**Diagnoza problemu**:
- Frame 1 (SSR pre-hydration): mobile fallback gradients widoczne → user widział "stare tło"
- Frame 2 (post-hydration, pre-shader): aurora canvas pusty → czerń
- Frame 3+ (~600ms): aurora wreszcie pop-in
- Text intro animations laggowały bo CSS animations (`tw-animate-css` `fade-in slide-in-from-bottom`) na `text-8xl` + `bg-clip-text` gradient triggrer paint na main thread podczas WebGL setup + React hydration

**Final state (po wielu iteracjach z user feedbackiem)**:
1. **Usunięty mobile fallback** w JSX (cleaning SSR z "starego tła")
2. **AuroraBackground render zawsze**, WebGL setup skipowany internally na mobile (`!matchMedia('(min-width: 1024px)')`)
3. **WebGL setup deferred z `requestIdleCallback`** (timeout 600ms, fallback setTimeout 200ms) — shader compile (~100-300ms) odbywa się PO React hydration + Framer Motion intro
4. **`motion.canvas` z fade-in** `opacity: 0 → 1` over 1.2s, delay 0.6s (aurora pojawia się PO text intro skończone, nad SSR baseline gradient)
5. **SSR baseline gradient** w section bg: subtle royal blue radial gradient simulujący aurora rest state (`radial-gradient(ellipse 60% 50% at 30% 35%, rgba(17,43,130,0.35), transparent 65%)` × 3 layers + dark vignette) — visible od first paint, no "pusty ekran"
6. **Tekst intro: Framer Motion** (NIE CSS animations które laggowały). Wszystkie 5 elementów (badge, h1 ×2 spany, p, buttons div) z identycznym setup co modal: `initial: { opacity: 0, scale: 0.95 } → animate: { opacity: 1, scale: 1 } z transition duration 0.6, delay X`. Stagger 0.05/0.15/0.25/0.35/0.45s.
7. **`isolate` na text container** — nowy stacking context + GPU compositor layer (mirror modal po prawej który nigdy nie laggował)
8. **Modal**: bg `bg-slate-950/45` (lighter, aurora prześwituje) + `backdrop-blur-xl` (24px middle ground)
9. **Modal min-h `460px` → `540px`** — card zachowuje stałą wysokość od początku, nie rośnie gdy 3 notifications wpadają
10. **Notification stack STATE-DRIVEN** (real phone behavior): `useState<number[]>` + setTimeouts dodają id-ki w kolejności delay (najmniejszy pierwszy = Asystent), każdy prepend'uje state → renderowanie `[latest, ..., oldest]`. `layout="position"` na motion.div = istniejące notifications **auto-shift w dół** gdy nowy element wjeżdża u góry. Slot z `overflow-hidden` ucina slide-from-top (`y: -80, scale: 0.92, opacity: 0`) → notyfikacja wyraźnie wjeżdża z góry "z poza modal". Spring `stiffness: 140, damping: 20, mass: 1`.
11. **Halo blob usunięty** za notification card (poprzednio `blur-[80px]` na 700×700px = dramatyczny paint cost)
12. **Button "Jak To Działa?"**: glassmorphism light tint `bg-white/8 border-white/20 text-white` + `backdrop-filter: blur(12px)` (zmniejszone z 20px po user feedback "tekst laguje")
13. **Chatbot bubble intro animation**: dodany `initial: opacity 0, scale 0, y: 20 → animate spring stiffness 260 damping 18 mass 0.9` (subtle bounce intro)
14. **Aurora shader optimizations**: precision `highp`, 30fps throttle, DPR 1.25 (sweet spot — sprawdzone że mediump i 24fps daje artifacts/jankness)
15. **Aurora vignette**: `vig*0.85 + 0.15` → `vig*0.45 + 0.55` (krawędzie 3.7× jaśniejsze, mniejsza ciemna winieta)

#### Portfolio depth (5 warstw głębi — Sesja 24)
1. **Dark base** `bg-[#050505]`
2. **🆕 PortfolioFlowBackground shader** (najgłębszy) — 2-warstwowy simplex noise, blue/indigo palette (`royal #112b82` + `indigo #2f2faa`), domain warping, `t * 0.06` (bardzo wolny drift). Budget: precision `mediump` + 30fps throttle + DPR 1.0 + IO pause z rAF defer + desktop only + `!shouldReduceMotion` gate. Opacity-40. Cel: ambient "życie" tła, nie konkuruje z LiquidGlass CTA card.
3. **Grid dot pattern** — `radial-gradient(circle, rgba(59,130,246,0.05) 1px, transparent 1px) 40px 40px`, opacity-60. CSS-only, zero JS cost. "Z-przestrzeń" za blobs (Stripe/Linear aesthetic).
4. **Floor reflection** — `radial-gradient(ellipse at bottom, rgba(37,99,235,0.18), 0.06 40%, transparent 70%)` w `150vw × 55vh` na dole sticky child. Sugeruje "podłogę ze światła" pod kartami.
5. **Animated blobs** (blue + indigo, blur 120px, 12s + 15s loops) — zachowane
6. **Cards z baseline shadow + lift on hover**:
   - Baseline: `shadow-2xl shadow-black/60` (karty mają "weight")
   - Hover: `hover:-translate-y-2` (8px lift) + `hover:shadow-[0_20px_60px_-12px_rgba(37,99,235,0.45)]` (niebieski glow)
   - Applied na Cards i CTA card "Twój Projekt?"

#### Bento corner fix (7 plików)
- **Root cause**: Shader wrapper `<div className="absolute inset-0">` zaczynał się dokładnie na krawędzi karty = tym samym pixel co border. Przy `rounded-3xl` (24px radius) anti-aliasing rogu tworzy subpixel gradient od pełnego color border do transparent na zewnątrz. Shader pokrywa również region pod anti-aliased pixelami → **animowane kolory shadera prześwitują przez subpixel gaps w rogach**.
- **Fix**: `absolute inset-0` → `absolute inset-px` na shader wrapper divs (offset 1px do wewnątrz = shader kończy się wewnątrz inner edge bordera, daje 1px ciemnego buffer w rogach).
- **7 plików** (~22 wystąpień): Impact.tsx (4 bento), Portfolio.tsx (Liquid Glass CTA), OnePageClient (4 bento), CorporateWebsiteClient (4), DedicatedWebsiteClient (4), ShopClient (4), AppWebClient (4).
- **Nie ruszone** (różne wzorce): UI/UX bento (`-inset-4` + filter blur 14px), o-nas Stat Cards (HoverShader SyncedShaderCanvas pattern).

#### Hero → Portfolio scroll micro-stutter fix
- **Root cause #1**: Portfolio miało **2 zagnieżdżone `content-visibility: auto`** (outer `<div className="render-optimize">` w page.tsx + inner inline `style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 900px' }}` w Portfolio.tsx). Double-skip-then-paint + size estimation 900px vs realne 2400px (300vh) → masywny reflow przy paint.
  - **Fix**: usunięty inline style w Portfolio.tsx (one source of truth). Outer wrapper w page.tsx dostał `containIntrinsicSize: '1px 2400px'` matching realną wysokość.
- **Root cause #2**: Aurora IO callback synchronous state change podczas scroll. `runningRef.current = X; draw()/cancelAnimationFrame()` w środku scroll callback → frame drop.
  - **Fix**: state change zapakowane w `requestAnimationFrame()` — wykonuje się w idle moment następnej klatki, nie w środku scroll callback.

#### Pliki krytycznie zmodyfikowane w Sesji 24
- `components/sections/Hero.tsx` (multi-iteration overhaul — Framer Motion intro, isolate, requestIdleCallback aurora, SSR gradient, state-driven notifications z layout animation, glassmorphism button, bubble intro)
- `components/sections/Portfolio.tsx` (depth layers + flow shader + cards lift + bento inset-px)
- `components/sections/Impact.tsx` + 5× service subpages (bento inset-px)
- `components/chatbot/Chatbot.tsx` (bubble intro animation)
- `app/page.tsx` (Portfolio wrapper contain-intrinsic-size fix)

### Sesja 25 (2026-05-28) — Restrukturyzacja oferty stron-www + makieta one-page upgrade
**Cel:** uporządkować nazewnictwo i hierarchię 5 usług stron-www (mylące „Profesjonalna" vs „Dedykowane"), plus pełen redesign makiety przeglądarki w one-page.

#### Restrukturyzacja oferty (nowe nazwy + slugi)

| Stara nazwa | Nowa nazwa | Stary slug | Nowy slug |
|---|---|---|---|
| Profesjonalna Strona Firmowa | **Strona WordPress** | `profesjonalna-strona-firmowa` | `strona-wordpress` |
| Strony Dedykowane | **Strona Szyta na Miarę** | `dedykowane-strony-www` | `strona-szyta-na-miare` |
| Sklepy E-commerce | **Sklep Internetowy** | `sklepy-internetowe` | `sklep` |
| Strona One-Page | **One-Page** | `one-page` | `one-page` (zostaje) |
| Aplikacje Webowe | **Aplikacja Webowa** | `aplikacje-webowe` | `aplikacje-webowe` (zostaje) |

**Powód:** Klient nie wiedział co lepsze — „Profesjonalna" vs „Dedykowane" oba brzmią marketingowo bez technicznego rozróżnienia. Nowa hierarchia jest **tech-explicit**: WordPress vs Custom (Next.js + Headless CMS) = czytelny wybór.

**Pliki zmienione:**
- `app/data/services.ts` — przepisane nazwy, opisy, tech stack, hrefy + dodana 5-ta karta „Aplikacja Webowa" (była tylko w ServicesHub)
- `app/uslugi/ServicesHub.tsx` — nazwy + keyBenefit (tech tags) + hrefy
- `app/uslugi/strony-www/{strona-wordpress,strona-szyta-na-miare,sklep}/` — foldery renamed via `git mv`
- `app/uslugi/strony-www/*/page.tsx` (5 plików) — metadata, ServicePageSchema, opisy SEO
- `app/uslugi/strony-www/*/...Client.tsx` (5 plików) — Hero copy (badge + h1 + tagline) zsynchronizowany z nowymi nazwami
- `app/sitemap.ts` — nowe SERVICE_PAGES slugi
- `components/layout/Navbar.tsx` — pathname-based theme colors zaktualizowane (sklep amber, strona-szyta-na-miare rose, strona-wordpress emerald)
- `public/.htaccess` — dodane 3× 301 redirects ze starych slugów na nowe (SEO preserve)
- `CLAUDE.md` + `project_context.md` — wszystkie referencje starych slugów zaktualizowane

#### Headless CMS jako differentiator dla „Strona Szyta na Miarę"
- Tag w services.ts: `Headless CMS (Sanity/Strapi/Payload)` — klient wybiera
- Description podkreśla że klient nadal sam edytuje (przez Sanity Studio / Strapi Admin), nie traci panelu CMS
- Pozycjonowanie: „WordPress 2026" — 5× szybsze, zero attack surface PHP, studyjne UX edycji

#### Sklep internetowy — pomysł dual-makieta (zapisany na później)
Nowy plik `docs/sklep-dual-makieta-idea.md` — koncepcja side-by-side: WooCommerce vs Headless Commerce, 2 makiety przeglądarki obok siebie + tabelka porównawcza. Nie zaczęte, na osobnej iteracji.

#### Makieta przeglądarki (one-page) — wieloiteracyjny upgrade

W trakcie tej sesji równolegle przerobione: makieta one-page dostała pełną restrukturyzację visual (Lane A + B + C):

**Lane A — URL bar narracja:**
- 3 stany URL synced z scroll: `/` → `/#oferta` → `/#kontakt` (one-page = anchor links, nie podstrony)
- Zielona ikona `Lock` przed `https://` (Chrome trust signal)

**Lane B — Blueprint reveal z wireframe:**
- Wireframe layer + Blueprint layer stacked, oba scrolują razem przez `contentY` (pixel-based, dynamic via ResizeObserver)
- Diagonal mask reveal: `linear-gradient(to top left, black ${v-3}%, transparent ${v+3}%)` — symetryczna transition wokół beam core (text fade-in dokładnie podczas przejścia linii, nie przed)
- Wireframe ma INVERSE mask — znika tam gdzie Blueprint pokrywa (zero overlap)
- Beam: 7-stop smooth gradient (transparent → 0.15 → 0.55 → 1 → 0.55 → 0.15 → transparent), 32% total width, hot white core w środku diagonalu, `mix-blend-screen` + `blur-[1.5px]` dla smooth pixele
- Wireframe content **pixel-perfect mirror Blueprint** — identyczne typografia/paddings/struktura, tylko `text-transparent` + `bg-white/X` (inline-block per linia + `rounded-lg`/`md` border-radius dla każdego placeholdera, zero overlap między liniami)
- 4 stage'e: Hero (headline + 2 mock CTA) → Oferta (3 cards numerowane) → Społeczny Dowód (Quote + blockquote) → Kontakt (3 form fields + submit)
- DEMO badge chip „MAKIETA · DEMO" w prawym górnym rogu viewportu

**Lane C — Cursor traveler + click choreography:**
- MousePointer2 SVG (24/34px mobile/desktop), wjeżdża z prawej (smoothMain 0.70)
- Linearne fazy: flight (0.74-0.83) → pauza (0.83-0.86) → cursor click scale 1→0.72→1 (0.86-0.90) → submit reaction flash + ring expand (0.90-0.96) → fade-out (0.95-0.98)

**Dynamic scroll end:** `useMotionValue(maxScrollPx)` + ResizeObserver mierzy `wireframeLayerRef.offsetHeight - viewportRef.offsetHeight`. `contentY` = pixel-based via array-form `useTransform([smoothMain, maxScrollPx])`. Submit kończy ride dokładnie na dolnej krawędzi viewport.

**Większy wrapper:** `max-w-6xl` → `max-w-[88rem]`, `h-[85vh]` → `h-[88vh]`, parent padding `md:px-10` → `md:px-6`.

#### „Makieta = fragment" sekcja (pod makietą)
Nowa sekcja między makietą a bento z dwurzędowym **marquee animowanym chipami** (10 chipów per rząd, duplikacja DOM 2× dla seamless loop, inline `style={{ animation: 'scroll 55s linear infinite' }}` reusing istniejący `@keyframes scroll`). Pierwszy rząd w prawo (reverse), drugi w lewo (normal). Soft fade mask na krawędziach (`mask-[linear-gradient(to_right,...)]`). Plus statyczny chip „+ co potrzebujesz" pod marquee. Cel: pokazać klientowi że 4 sekcje makiety to fragment — realizacja może mieć dużo więcej (galeria, FAQ, cennik, blog, mapa, newsletter, etc.).

#### Scope cards fix — pierwsza karta nie ucinana
- `scopeCardsY` start `'0vh'` → `'6vh'` (pierwsza karta startuje w black region maski, nie w top fade)
- End `'-55%'` → `'-50%'` (kompensuje initial offset)
- `max-w-2xl` → `max-w-3xl` (cards container szerszy o 96px na desktop)

#### Szyta-na-Miarę makieta — pełen reveal pattern + parity z wordpress (Sesja 25 cd.)

**Cel:** zastosować ten sam wireframe→blueprint reveal pattern co `strona-wordpress` do **wszystkich 4 faz makiety** (Home + Oferta + Login + Dashboard), nie tylko Home/Dashboard. Plus rename Panel Klienta → Panel Admina (admin nie publiczny).

**Iteracje (kilka prób żeby uzyskać 1:1):**
1. Pierwsza próba: blueprint miał `<p className="text-white text-sm">` przy wireframe `<div className="w-1/2 h-4 bg-white/10 rounded">` — różne wymiary, reveal nie pasował, user feedback: "dalej nie jest 1:1, w wordpresie oraz one page jest o wiele lepiej"
2. Druga próba: flex centering text inside placeholder — wciąż nie 1:1, user: "n onie dokoonca, patrz dalej nie jest skoordynowanie"
3. **Final**: studium wordpressowego patternu — IDENTYCZNA STRUKTURA JSX w obu warstwach, różnica tylko w klasach color span:
   - Wireframe: `<span className="inline-block text-transparent bg-white/10 rounded-2xl">Tekst</span>`
   - Blueprint: `<span className="inline-block text-white">Tekst</span>`
   - Span inline-block z treścią tekstową → wymiary deterministyczne, layout pixel-perfect identyczny

**4 fazy z reveal:**
- Phase 1 HOME — h1 hero + 2 sub-text + 2 CTA buttons (wszystko text-span pattern)
- Phase 2 OFERTA — section heading + 3 service cards (każda z h3 + p)
- Phase 3 LOGIN — form heading + email/password inputs (placeholder text jako span) + login button + small links
- Phase 5 DASHBOARD — kept as before (już miał reveal w Sesji 25 pierwszej iteracji)

**Reveal mechanics:**
- 4 osobne motion values: `homeRevealStart/End`, `offerRevealStart/End`, `loginRevealStart/End`, `dashRevealStart/End` via `useTransform(mainProgress, ...)`
- Mask: `useMotionTemplate` na linear-gradient z 7 stopami, sliding diagonal BR→TL
- 4 beam scanline overlays (cienka biała linia + `mix-blend-screen + blur-[1.5px]`)
- Wireframe layer: `opacity = 1 - reveal` znika gdy blueprint pokrywa
- Blueprint layer: `WebkitMaskImage` + `maskImage` z dynamic gradient

**Smoothness tightening:**
- Spring: `80/25/0.001` → `140/38/0.0005` (mniej overshoot, mniej rubber-band)
- **Scroll-precise transformy** (URL opacities, page Y/opacities, form widths, cursor X/Y, dashboard, charts, loader) przeniesione na **raw `mainProgress`** zamiast `smoothMain`. Powód: Lenis już smoothuje raw scroll wheel — dodatkowy spring na top tego = double smoothing = wizualny snap/lag przy końcu wheel-tick (element "ucieka" za kursorem).

**Panel Klienta → Panel Admina:**
- Admin nie ma być publiczny w makiecie — usunięty z navbara (tylko Home + Oferta zostają w nawigacji)
- Cursor flow: 3 klick'i → 2 klick'i (Oferta + Zaloguj)
- URL `/portal` → `/admin` (narracja: secret URL, wpisywany ręcznie nie linkowany)
- Import `Lock` icon usunięty (nieużywany)

**Dashboard `translateY` removed:**
- Wcześniej `dashboardY = useTransform(... ['0%', '-15%'])` — bug: dashboard znikał pod fixed navbarem ("maska u góry")
- Removed całkowicie — dashboard fade-in + internal animations only

**Cursor unification:**
- Z dwóch cursorów (desktop `calc()` + mobile `%`) → jeden `<motion.div>` z `%` positioning cross-device
- Wygląd 1:1 z one-page/wordpress: `MousePointer2` w/h 24px mobile / 34px desktop, white fill, drop-shadow black/0.8, strokeWidth 1.5

**Resize do parity:**
- `max-w-6xl` → `max-w-[88rem]`
- `h-[75vh] md:h-[85vh]` → `h-[78vh] md:h-[88vh]`
- `px-4 md:px-10` → `px-3 md:px-6`

#### WebGL dev-mode resilience (Sesja 25 cd.)

**Problem:** Po 3-5 nawigacji na podstronę z shaderem (`strona-szyta-na-miare`) — white flash + `console.error("Rays compile: null")` + brak shadera. Worse w dev przez React 19 Strict Mode double-mount.

**Root causes:**
1. **Chrome ~16 WebGL context limit** — każde mount/unmount tworzyło nowy context, Chrome wyrzucał najstarsze → orphan canvases z lost contexts
2. **Strict Mode + `loseContext()` w cleanup** — Mount A creates context. Cleanup calls `loseContext()` → context is now lost. Mount B reuses SAME canvas (no key change) → `getContext()` returns lost context → `compileShader` returns null → "Rays compile: null"

**Fix (3 mechanizmy):**

1. **Canvas key bumping (recovery):**
   ```tsx
   const [canvasKey, setCanvasKey] = useState(0);
   if (gl.isContextLost()) {
     setCanvasKey(k => k + 1); // new <canvas> DOM element
     return;
   }
   <canvas key={canvasKey} ref={canvasRef} ... />
   ```

2. **Explicit context release w cleanup:**
   ```tsx
   gl.getExtension('WEBGL_lose_context')?.loseContext();
   ```
   Zwolnienie GPU resources jawnie zamiast czekać na GC — minimalizuje szanse hitnąć ~16 context limit.

3. **Context loss/restore event handlers:**
   ```tsx
   canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); /* stop rAF */ });
   canvas.addEventListener('webglcontextrestored', () => { /* re-init */ });
   ```

4. **`console.error` → `console.warn`** w handled-state cases — Next.js 16 dev overlay zamienia każdy `console.error` na fullscreen error popup. Warningi (`Rays compile: null` przy znanym handled lost-context) nie powinny przerywać DX.

#### Wersja B (eksperyment + cofnięcie)

W trakcie sesji eksperymentalnie dodano toggle dla "Wersji B" makiety (drugi mockup obok wersji A). User feedback po wstępnym widoku: "jest bo bardziej prymitywna wersja niz tamta wersja A serio uzyj impeccable". Po analizie `PRODUCT.md` przez `$impeccable` skill stwierdzono że Wersja B trafiała w **anti-references** brandu (gradient text, glassmorphism cards, generic bento — typowe "AI-generated agency sites"). Decyzja usera: "zostajemy przy wersji A wywal wersje B i toggle". Wersja B + toggle całkowicie usunięte z pliku.

**Lekcja:** przed proponowaniem alternatywnych wariantów konkretnych komponentów warto explicit zwerifikować w `PRODUCT.md`/`DESIGN.md` żeby nie produkować content który koliduje z anti-references. `$impeccable shape` BEFORE `$impeccable craft`.

### Sesja 26 (2026-05-31) — Finalizacja realizacji, fix scroll-jump, makieta aplikacje-webowe, redesign chatboty-ai (orange), responsywność 2K/4K
**Cel:** domknąć /realizacje, naprawić przeskakiwanie sekcji po F5/scrollu, dodać pełną makietę do aplikacje-webowe, kompletnie przeprojektować chatboty-ai (z theme orange), dostroić kontakt i całą stronę pod monitory 2K/4K.

#### `/realizacje` → finalizacja do wersji Editorial
- Z 5-wersjowego toggla całej podstrony (Magazyn/Galeria/Minimal/Bento + Editorial) → zostawiona **tylko Editorial**. Usunięte: `VERSIONS`, 4 komponenty wersji, layouty Bento/Rzędy/Okładki/Lista, floating toggle, nieużywane warianty Filtra. Zachowane helpery (`projectMeta`, `CardLink`, `useFilteredProjects`, `GridLayout`/`ProjectCard`, `ChatCtaCard`).

#### `grid.svg` — usunięty całkowicie (404 fix)
- `bg-[url('/grid.svg')]` był w `CallToAction.tsx` (sekcja CTA homepage — źródło `GET /grid.svg 404`), `not-found.tsx`, `polityka-prywatnosci`. Plik nie istniał w `public/`. Usunięte referencje z 3 plików (niepotrzebne dekoracyjne siatki).

#### `next/image` quality (Next 16 `images.qualities` warning)
- Next 16 wymaga deklaracji wartości `quality` w `images.qualities` (domyślnie `[75]`). `Portfolio.tsx` (`quality={isMobile ? 60 : 75}`) i `BlogTeaser.tsx` (`quality={70}`) → ustawione na **`75`**. Przy `unoptimized: true` (static export) `quality` jest i tak ignorowane — no-op, gasi warning.

#### ⚠️ KLUCZOWE — `content-visibility` USUNIĘTY z `.render-optimize`
- **Problem (user):** po przescrollowaniu kilku sekcji homepage i F5 strona **nie wraca w to samo miejsce** (sekcje przeskakują); piny GSAP „skaczą".
- **Diagnoza (research, potwierdzona):**
  - [GSAP issue #465](https://github.com/greensock/GSAP/issues/465): `content-visibility: auto` na **rodzeństwie poprzedzającym pinowany element** ScrollTrigger łamie pozycjonowanie pinów (skaczą poza zakres). Homepage ma 3 piny (Hero scale, Portfolio 350vh, Process timeline), a WSZYSTKIE sekcje były owinięte w `.render-optimize`.
  - [bram.us](https://www.bram.us/2020/12/21/content-visiblity-vs-jumpy-scrollbars-a-solution/) / [infrequently.org](https://infrequently.org/2020/12/content-visibility-scroll-fix/): sekcje off-screen z `content-visibility` mają zgadywaną wysokość (intrinsic) zamiast realnej → po F5 suma offsetów się nie zgadza → ląduje w złej sekcji.
- **Próba pośrednia (cofnięta):** `contain-intrinsic-size: 1px 800px` → `auto 800px` pogorszyła (wysokości off-screen zmieniały się dynamicznie → piny dostawały coraz to inne pozycje).
- **Fix finalny:** `content-visibility` + `contain-intrinsic-size` **usunięte całkowicie** z `.render-optimize` w `globals.css` (klasa to no-op z komentarzem ostrzegawczym). Wrappery `<div className="render-optimize">` zostają (trzymają kotwice `#proces`/`#oferta`/`#opinie`/`#kontakt`). Inline `containIntrinsicSize` zdjęte z `app/page.tsx`. **Perf zapewnia lazy-load (`next/dynamic`) + IO-pauza shaderów** — `content-visibility` dawał tu marginalny zysk kosztem łamania pinów i scrolla.
- **CLAUDE.md / project_context.md zaktualizowane** — `.render-optimize` to teraz no-op, NIE przywracać `content-visibility` (pin conflict).

#### Homepage — zamiana kolejności sekcji
- **Impact („Twój biznes 2.0") przesunięty PRZED Process (timeline)** w `app/page.tsx` (było: Process → Impact). Kotwica `#proces` przesunięta razem z sekcją.

#### Homepage AI CTA → podstrona usługi
- `AiConsultant.tsx`: przycisk „Wdróż AI u siebie" (`→ /kontakt`) → **„Zobacz chatboty AI"** (`→ /uslugi/automatyzacje-ai/chatboty-ai/`). Drugi przycisk (otwiera czat) bez zmian.

#### `/uslugi/strony-www/aplikacje-webowe` — pełna makieta (reveal + scale + kursor)
- Wcześniej: prosty pionowy przesuw statycznego dashboardu (`contentY`). Teraz: **pełny pattern wireframe→blueprint reveal** (jak szyta-na-miare/wordpress, Sesja 25) zaadaptowany do **flow aplikacji** — 3 ekrany: **Pulpit (dashboard) → Klienci (tabela CRM) → Zadania (kanban)**, kursor klika nawigację (pozycje mierzone z DOM), per-ekran reveal+beam, scale-in, crossfade, URL bar. Bogaty wireframe (stat-cards + sparkline, wykres z Fx, feed, tabela CRM z filtrami/paginacją, kanban). Sekcja `800vh`. Dorzucony marquee „Makieta = fragment" (sky). ShaderCanvas upgrade do wersji odpornej (canvasKey + context-loss + `console.warn`). Pass mobile (responsywne col-spany tabeli CRM, stat-cards `md:grid-cols-4`).

#### `/uslugi/automatyzacje-ai/chatboty-ai` — KOMPLETNY redesign (wiele iteracji)
- **Tło hero — shader (5 propozycji → toggle → wybór Plasma):** dodany shader na górze podstrony. Najpierw toggle 5 wariantów (Neural Mesh / Aurora / Plasma / Signal Rings / Dot Matrix), potem +2 (Liquid / Data Streams), finalnie **wybrana Plasma** (orange-only). Shader **płynnie się pojawia** (`opacity 0→1` transition 1.4s zamiast snap `visibility`). 30fps + IO-pauza + DPR clamp + context-loss recovery.
- **Scroll-lock → wyrzucony.** User: scroll-lock z oknem czatu = kopia makiet ze strony-www, nudny. Przerobione na **„Living Ask"** — samogrająca demonstracja w hero: bot **sam wpisuje** pytania klientów (typewriter), „myśli", **wypisuje odpowiedź** wprost na stronę (bez ramki okna), pętla 4 scenariuszy. Plus marquee pytań, count-up liczby, editorial „Różnica".
- **Sekcja „Liczby, nie obietnice":** 3 warianty (toggle) → wybór **Editorial** (wielkie „2 s" + lista figur), reszta usunięta.
- **Sekcja „Możliwości":** 3 warianty (toggle: Showcase/Bento/Editorial) → wybór **Bento**. Dodane **shadery w tle kafli + GlassEdge** (5 wariantów toggle → wybór **Dots**). Dots **różne na każdym z 4 boxów** przez `u_seed` (róg pulsu/prędkość/faza/kolor), ale **jednolita wielkość i gęstość kropek** (px-based `fract(gl_FragCoord.xy/18.0)`).
- **Proces (timeline)** — usunięty z tej podstrony.
- **Dedup treści:** „Możliwości" i „Pracownik, który nie śpi" mówiły to samo (24/7, zna ofertę, leady). Why przerobione na inny kąt **„Różnica — Nie każdy chatbot jest taki sam"** (nie zmyśla/handoff, brzmi jak Twoja marka, mierzysz rozmowy). „2 s"/„24/7" rozdzielone między sekcje, marquee bez powtórki.
- **Animacje schodkowe:** hero czysta kaskada (badge→h1→opis→demo→przyciski), nagłówki sekcji przez Framer staggerChildren.
- **„Różnica" — scroll-driven hover:** każdy wiersz (`WhyRow`) zapala się (border/ikona/tytuł/numer + poświata w tle od **prawej**) gdy mija środek viewportu (IntersectionObserver `rootMargin: -45% 0 -45%`). Hover myszką usunięty (tylko scroll).
- **Theme: tylko pomarańczowy** — wyrzucony emerald/teal z gradientu nagłówka, shadera Plasma, dots, i UI (online dot, „źródło ✓", „→ CRM").

#### Theme chatboty-ai: teal → orange (globalne komponenty)
- `lib/service-theme.ts`: dodany motyw **`orange`** (`#f97316` + akcent amber), `chatboty-ai` przepięte `THEMES.teal` → `THEMES.orange`. To koloruje **Chatbot widget** + **dolny CTA `AvenlyAICta`** („Masz pytania? Zapytaj Avenly AI") na tej podstronie.
- `components/layout/Navbar.tsx`: scrolled-bg border na ścieżce chatboty-ai `border-teal-500/30` → `border-orange-500/30`.

#### Kontakt — responsywność (2K/wysokie ekrany)
- `ContactSection.tsx`: niebieski hero `lg:min-h-screen lg:flex lg:items-center` → **wypełnia viewport na wysokich/2K ekranach** (koniec ciemnej dziury pod hero), treść wyśrodkowana w pionie; padding `lg:py-24`. Szerokość progowo `2xl:1700 → 3xl:1850 → 4xl:2100px`.

#### Responsywność 2K/4K — cała strona (`globals.css` + punktowo)
- **Fundament:** DEDYKOWANE breakpointy `--breakpoint-3xl: 160rem` (**2560px / 2K**), `--breakpoint-4xl: 240rem` (**3840px / 4K**). **FullHD (1920px) zostaje normalnie** — domyślny `2xl`=1536px (margines jak dotychczas). Szerszy `container` tylko od 2K wzwyż: `@media ≥2560px → 1920px`, `≥3840px → 2400px`. Działa na wszystkie sekcje na `container mx-auto`.
  - ⚠️ **Poprawka w tej samej sesji:** pierwsza wersja błędnie ustawiła `3xl`=1920px (= FullHD) → poszerzanie odpalało się już na FullHD ("wszystko kilkukrotnie większe"). Przesunięte na 2560/3840, FullHD przywrócone do normy.
- **Strategia bezpieczeństwa:** **bez skalowania fontu** (chroni piny GSAP `vh`-based i pixel-perfect reveal makiet). Tylko `max-width`/`container`.
- **Punktowe gridy** capowane własnym `max-w` (fundament nie sięga): Hero homepage (`max-w-[1800px]` → `4xl:2300px`), Testimonials (`max-w-6xl` → `3xl:7xl 4xl:88rem`), CTA-cardy w /realizacje i ServicesHub (`max-w-7xl` → `3xl:88rem`), UI/UX bento (`max-w-7xl` → `3xl:88rem 4xl:1700px`).
- **Makiety przeglądarki** (`max-w-[88rem]`) **celowo wyśrodkowane** (element-fokus „urządzenie"); ich bento/scope/CTA jadą na szerszym `container`. Teksty (`max-w-3xl/5xl/42ch`) zostają capowane (czytelność).

#### Scrollbar — globalny + per-theme
- Globalny pasek strony: dark tor `#0a0a0a` + kciuk zaokrąglony (był domyślny systemowy, gryzł się z dark theme).
- **Kolor kciuka per-pathname** — `components/utils/ScrollbarTheme.tsx` (montowany w `app/layout.tsx`) ustawia CSS var `--sb-thumb`/`--sb-thumb-hover` na `getServiceTheme(pathname).hex`/`.hexSecondary`. Na podstronach usług scrollbar w main-color motywu (sklep amber, chatboty orange, szyta rose, appweb sky…); domyślnie niebieski. Chat (`.chat-scrollbar`) i ukryte scrollery filtrów nietknięte (bardziej specyficzne reguły).

### Sesja 27 (2026-06-01) — Copywriting overhaul + Cookie consent + Polityka prywatności + Navbar theming
**Cel:** przepisać copy całej strony w głosie korzyści (głos klienta), wdrożyć zgodny z RODO system cookie consent + pełną politykę prywatności (12 sekcji), dać navbarowi theming per podstrona, dodać drugi numer kontaktowy i naprawić "clanky" animację scope-cardów.

#### Copywriting overhaul (głos korzyści) — cała strona
- **Zasady przeglądu:** copy sekcja po sekcji w **głosie klienta** ("Ty / zyskujesz / dostajesz"), **wyjątek `/o-nas`** (zostaje głos "my"). Zero myślników em/en (tylko pojedynczy `-`), **jeden CTA** "Bezpłatna konsultacja", zero fabrykowanych metryk, polski **sentence case**, "i" zamiast "&", realna ocena **"★★★★★ 5,0 na Google"** zamiast fake avatarów.
- **Home:** Hero, Portfolio, Impact, Process, Testimonials, AiConsultant przepisane; `Services` (H2 "Nasze Usługi" → "Nasze usługi"); `BlogTeaser` (eyebrow "// Wiedza i Insight" → "Wiedza i analizy", H2 "Technologii i Biznesu" → "technologii i biznesu"); `CallToAction` (usunięte "24/7", "Darmowa Konsultacja" → "Bezpłatna konsultacja", fake avatary → ★★★★★ 5,0 na Google).
- **Footer:** "Legal" → "Informacje prawne", "Polityka Prywatności" → "Polityka prywatności", tagline bez kliszy "Twój partner w cyfrowym świecie".
- **5× strony-www subpages + UI/UX:** H1 "zamienia ruch w klientów", CTA "Bezpłatna konsultacja", karty w sentence case, "Układ i przepływ", "Finalny design (UI)".
- **`chatboty-ai`:** sekcja statystyk "Liczby, nie obietnice" → "Konkret, nie obietnice"; usunięte 3 fabrykowane metryki (+38%, 1240 leadów, 96%) i funkcja `CountUp`, zostaje "2s" + 3 jakościowe fakty z numerami 01/02/03; eyebrow "Wirtualny Asystent" → "Wirtualny asystent"; karta "Pracuje 24/7" body od-duplikowane.
- **`/o-nas` (głos "my" zostaje):** intro przepisane; stat cards ("Twój projekt, nasz priorytet", "Wydajność", "Twój zysk / Nasz cel nr 1"); Kompetencje ("Strategia i audyt", "AI i automatyzacja", literówka "detali" → "detal", UI/UX "robią wrażenie od pierwszego wejrzenia", AI desc przepisany); FAQ (firmowe ~2 tygodnie, sklepy 2-6, "firmowych" zamiast "korporacyjnych").

#### Navbar — theming per podstrona (`components/layout/Navbar.tsx`)
- `getNavbarTheme(pathname)` przerobione **ze stringa klas na obiekt `NavTheme`** (rekord `NAV_THEMES`).
- W kolorze motywu podstrony (blue / emerald / rose / amber / sky / orange): **kropka przy AVENLY**, hover underline+glow linków desktop, hover hamburgera, blob menu mobile, hover linków/kropka mobile, hover social, hover CTA.
- Kropka = `motion.span` z `animate={{ color: dotHex }}` + `initial={false}` → **płynny tween koloru** między podstronami (zamiast skoku). Klasy verbatim (Tailwind v4 JIT).

#### Scope-card "Zakres prac" — fix animacji (5 podstron strony-www)
- Usunięty **konkurencyjny `y` translate** (walczył ze spring-translatem rodzica).
- `viewport margin: '-10%'` → `amount: 0.4` (stagger per karta sterowany scrollem zamiast jednoczesnego popu).
- `scale: 0.96` + ease-out-expo `[0.16, 1, 0.3, 1]` 0.7s. Naprawia "clanky" odczucie.

#### `chatboty-ai` — marquee + numer
- Oba paski pytań: **8 kopii** (było 2) + czas **50s → 200s** (ta sama prędkość px/s) → pierwszy (reverse) pasek pełny od początku, pokrywa 2K/4K.
- "Różnica": duży numer 01/02/03 na scroll-hover → `text-white` (był `white/6`).

#### Drugi telefon kontaktowy
- Numer **+48 531 104 402**.
- `lib/seo-data.ts` CONTACT: dodane `phone2` + `phone2Display`.
- `app/kontakt/ContactSection.tsx`: kafel Telefon z **dwoma klikalnymi numerami**.

#### Polityka prywatności — pełna przebudowa (`app/polityka-prywatnosci/page.tsx`)
- Z 5-sekcyjnego szkicu do **pełnych 12 sekcji RODO** ("Polityka prywatności i cookies"): administrator, podstawy prawne, cele, prawa, cookies (4 kategorie z tabelami), odbiorcy/transfery poza EOG, okres przechowywania, bezpieczeństwo, linki, media społecznościowe, zmiany, kontakt.
- Dark glassmorphism cards. Dane z `lib/seo-data` (NIP / adres warunkowo). Wersja **1.0, od 1 czerwca 2026**.
- `layout.tsx` title → "Polityka prywatności i cookies".

#### Cookie consent system (RODO) — NOWE
- **`lib/cookie-consent.ts`** — 4 kategorie (`necessary` / `functional` / `analytics` / `marketing`), `readConsent` / `saveConsent` (localStorage `avenly-cookie-consent` + cookie `cookie_consent`, wygaśnięcie 365 dni, wersjonowanie `CONSENT_VERSION`), `hasConsent()`, eventy `avenly:cookie-consent-change` + `avenly:open-cookie-settings`.
- **`components/cookie/CookieConsent.tsx`** — baner (desktop bottom-left, mobile full-width bottom; **nie koliduje z chatbotem** bottom-right), compact + rozwijane ustawienia (przełączniki per kategoria, necessary "Zawsze aktywne", reszta domyślnie OFF), równorzędne "Odrzuć / Akceptuj wszystkie" + "Dostosuj" / "Zapisz wybór", X tylko gdy zgoda już istnieje. Framer Motion, dark glassmorphism, bez widocznego paska (`.no-scrollbar`), responsywne `max-h` dvh + `overscroll-contain`.
- **Montaż:** `components/utils/DeferredClientWidgets.tsx` (dynamic `ssr:false`).
- **`components/layout/Footer.tsx`** — link "Ustawienia cookies" w kolumnie "Informacje prawne" (dispatch `avenly:open-cookie-settings`).
- **`app/globals.css`** — nowy utility `.no-scrollbar`.
- Gotowe do **bramkowania przyszłych GA/Meta** przez `hasConsent('analytics')`; obecnie brak skryptów analytics, więc nic do blokowania.


### Sesja 28 (2026-07-07) — Wersja EN + perf startu strony
**Cel:** dwujęzyczna strona bez zmiany polskich URL-i.

- **Architektura:** route groups `app/(pl)/` + `app/(en)/en/` z dwoma root layoutami (poprawny `<html lang>`), wspólny `components/layout/AppShell.tsx`. Słowniki w `lib/i18n/` (PL 1:1 z dawnym copy, EN w głosie korzyści), podawane przez props z server pages; globalne widgety wybierają język z `usePathname()`.
- **Slugi EN przetłumaczone** (`/en/about-us`, `/en/contact`, `/en/work`, `/en/services/websites/online-store`...) - mapa `PL_TO_EN_SEGMENT` w `lib/i18n/locale.ts`, `localizeHref` / `switchLocalePath` / `i18nAlternates`; 301 ze starych `/en/<polski-slug>`.
- **SEO:** hreflang `pl-PL` / `en` / `x-default` + canonical per język, sitemap z alternates; blog i polityka prywatności tylko PL.
- **Custom 404 przy dwóch root layoutach:** trasa `app/(pl)/nie-znaleziono/` + post-build `scripts/copy-404.mjs`.
- **Chatbot:** `language` w body do n8n, EN welcome fallback, quick replies na EN tylko z `label_en`.
- **Perf:** async kompilacja shadera hero (`KHR_parallel_shader_compile`), leniwy start shaderów below-the-fold (warm IO 600 px), `DeferredClientWidgets` po `requestIdleCallback`.

### Sesja 29 — Hero 12a (planeta + logotyp z cząstek + konstelacja usług)
**Cel:** nowe hero z handoffu `claude-design/design_handoff_avenly_hero/` zamiast Aurora + powiadomień.

- Scena: planeta WebGL (desktop) / statyczny render WebP (mobile, element LCP na każdej szerokości), logotyp AVENLY z ~30k cząstek (GPU na desktopie, canvas 2D na telefonie) z 3 stanami (wejście, lity napis, „dziura” pod kursorem / palcem), niebo z „luksusowymi” gwiazdami i konstelacją 6 usług jako prawdziwymi linkami.
- Koncept CTA (decyzja właściciela): bez pola „adres Twojej strony” z makiety - h1 „Twój biznes ma potencjał. Zamień go w klientów.”, „Bezpłatna konsultacja” + „Zobacz realizacje”, linia dowodów z obronnymi faktami.
- Kolejność wejścia: planeta → logotyp → tekst. Start sceny rozbity na taski ≤ ~50 ms (Lighthouse desktop 95-97, CLS 0).
- Navbar: linki w osi strony, przełącznik PL/EN przy CTA. Szczegóły i zasady: CLAUDE.md „Hero strony głównej”.

### Sesja 30 — Realizacje na stronie głównej (handoff 8b „Kurtyna”)
- Nowa sekcja **Realizacje** zamiast dawnego Portfolio (poziomy scroll 300vh): kadr ze zrzutem strony klienta, kurtyna przy zmianie projektu, indeks 4 pozycji, panele informacji. `Portfolio.tsx` został na dysku jako martwy kod.
- **Bez scroll-locka z makiety** (decyzja właściciela): kadry zmieniają się same co 5 s, klik / swipe / strzałki ręcznie, pauza przy kursorze nad indeksem (WCAG 2.2.2).
- Dwa układy z jednego markupu: scena (desktop z myszą, 100vh) i flow (dotyk / < 1024). JSON-LD `ItemList`.

### Sesja 31 (ok. 2026-09-23) — Realizacje: mgławica, układ „symetria z grupami”, czat, zasady copy
- Tło sekcji: **mgławica WebGL** w barwach aktywnej realizacji (zastąpiła jedwab z handoffu), odbicie w podłodze i filtr falowania usunięte.
- Układ sceny: nagłówek nad kadrem, kadr 90% makiety z panelami po bokach, pasek 4 miniatur na szerokość kadru z wędrującym wskaźnikiem, równy margines góra / dół.
- Kadr = **ciemne fluid glass**; model przejścia „nadpisywany” (duchy kadrów przy szybkim klikaniu).
- Czat: neutralne szkło (później zmienione na granatowe - 2026-09-24). Navbar: tło bez granatu.
- PRODUCT.md: **zakaz rozstrzelonych wersalików / mono w etykietach** („AI slop”) - etykiety zwykłym Inter.

### 2026-09-19 — Migracja hostingu na Cloudflare Pages
- Hosting z Hostingera (Apache + `.htaccess`) na **Cloudflare Pages**: `npm run deploy` / `deploy:preview` (wrangler), `public/_headers` (bezpieczeństwo, cache, `noindex` na `*.pages.dev`), `public/_redirects` (301). `.htaccess` usunięty.
- Purge cache po deployu niepotrzebny; poczta `@avenly.pl` zostaje na Hostingerze (MX/SPF/DKIM w DNS Cloudflare).

### 2026-09-24 — TechStack, Realizacje (odsłona + mobile), czat, kadry AVIF
- **TechStack:** wybór właściciela „Ikony w szkle” z 7 propozycji; 8 faktów z oferty, pętla bez szwu (4 kopie, -50%).
- **Realizacje - wejście sekcji „wow”:** sekcja startuje jako czerń, shader maluje mgławicę od środka kadru i zapala gwiazdy; na desktopie jednorazowe dociągnięcie do sekcji + blokada scrolla ~2 s (jedyny wyjątek od zasady bez scroll-locka), na dotyku bez blokady i wcześniej (35% wys. okna).
- **Realizacje - mobile:** jedna kolumna na szerokość kadru, pasek 4 miniatur z wskaźnikiem jak w scenie, panel 1-2 kolumny, cele 44 px, automat na dotyku odkładany o 10 s po dotknięciu, ręczny wybór wyłącza automat (WCAG 2.2.2); mgławica także na telefonach (poza Save-Data / ≤ 2 GB RAM).
- **Realizacje - jakość:** kadry AVIF (główne) + WebP (zapas) z masterów 3840×2160 (`scripts/realizacje-images.mjs`), bez tiltu kursora (ostrość), fix szybkiego klikania (duchy w kolejności wyboru, jedno tło pod kurtyną).
- **Czat:** nowa odsłona - granatowe szkło, obwódki ze światłem z góry, akcent motywu podstrony.

### 2026-09-25 — Kardyś, przejście Realizacje → Impact, „Dlaczego Avenly”
- **Kardyś (teksty realizacji):** punkt wyjścia = przestarzała strona na WordPressie i sklep bez zamówień; dziś nowa strona, sklep z płatnościami online i panel do zarządzania stroną oraz sklepem. Poprawka właściciela: **bez personalizacji graweru** (usunięta też z `projects.ts` i case study). Wdrożone na avenly.pl.
- **Płynne przejście** z Realizacji do „Dlaczego Avenly”: nakładka `.rz-box::after` gasnąca do `#050505`.
- **Impact - dostosowanie do nowego języka (nie redesign):** nagłówek jak w Realizacjach, kafle z obwódką świecącą od góry w kolorze kafla, ikony w okrągłych plakietkach, 98/100 PageSpeed zamiast „99%”, link „Chatboty AI →”, „hostingowi na Cloudflare”.
- **„Bez matowego efektu”** (2 rundy): usunięte `GlassEdge`, mgiełki i rozmyte poświaty z kafli; czat bez `backdrop-filter` (pełne tło); shadery kafli na komputerze do DPR 2.
- **Wizualizacje kafli wtopione w shader:** 7 propozycji (Konstelacje, Orbity, Siatka punktów, Mini interfejsy, Nurt, Radar, Kręgi na wodzie) przez jeden uogólniony `VIZ_GLSL` + sceny w `components/sections/impact/viz.tsx`; przełącznik tylko w `npm run dev`. Fix krycia płótna (jasność ≈ a³ → sumowanie w przestrzeni liniowej).
- **Czytelność:** każdy kafel opowiada historię w 2-3 krokach - napis bieżącego kroku + pasek postępu jak w „stories”, podświetlenie podpisu węzła; kroki zgrane z rozbłyskami w shaderze przez wspólny `VIZ_EPOCH`; cykle wydłużone do 8-10,5 s (przelot impulsu 20% cyklu), halo pod napisami jak na mapach. Reduced motion = statyczna lista kroków.
- Weryfikacja: headless Chrome z zamrożonym czasem (napisy, podpisy, pasek i shader zgodne), desktop 1920 i telefon 390, zero błędów konsoli.

### 2026-09-26 — „Dlaczego Avenly”: czytelniej, bez zmatowienia, z głębią (trzecia runda)
- **Zmatowienie - źródła i poprawki:** linie warstwic miały zmienną grubość i miękkie krawędzie (szerokie rozmyte pasy na płaskim terenie), gęste pierścienie wokół węzłów zlewały się w ziarnistą mgiełkę, węzły i impulsy miały gaussowskie poświaty, napisy - ciemne rozmyte halo, a na telefonie bufor 1,25x był rozciągany na ekran 3x. Teraz: linie o stałej szerokości w px wygładzone na 1 px (`OES_standard_derivatives`), gęste warstwice gasną zamiast migotać, zero poświat, bez `text-shadow`, na dotyku DPR 2 (Save-Data / ≤ 2 GB RAM: 1,25).
- **Głębia:** warstwice cieniowane metodą Tanaki (światło z lewej góry), wyżej jaśniejsze, co 4. grubsza; paralaksa terenu za kursorem i przy przewijaniu (schemat stoi, teren płynie pod nim); "fosa" wokół schematu - leży nad mapą; tło kafli i plakietek oświetlone od góry.
- **Czytelność:** historia jak stepper - przebyte odcinki i osiągnięte węzły świecą do końca cyklu, przyszłe są puste, groty kierunku, dotarcie = ostry pierścień; podpisy węzłów w chipach z numerem kroku (ten sam numer przed napisem kroku), 3 stany podpisu (przed / teraz / zaliczony); atak zatrzymuje się na pierścieniu Cloudflare; łuk wydajności z podziałką 0 / 100 i podpisem „98”; tekst kafli na czystym tle (shader gasi warstwice pod elementami `data-im-shield`).
- Wszystkie 7 propozycji stylu działają na nowym potoku (wspólny `VIZ_GLSL`); wybór stylu nadal czeka na właściciela.
- Weryfikacja: zrzuty headless (desktop 1920, retina 1440, telefon 390 @3x), stany podpisów przy zamrożonym czasie zgodne z krokami, paralaksa sprawdzona dwoma położeniami kursora, 4 shadery kompilują się bez błędów, `tsc` czysto.

### 2026-09-26 — „Dlaczego Avenly”: propozycje układu sekcji zamiast bento (przełącznik „Układ sekcji”)
- Prośba właściciela: „ciekawiej niż bento grid, kilka propozycji restrukturyzacji + dodatkowy toggle”. Drugi przełącznik (tylko `npm run dev`), produkcja nadal = bento.
- **Rozdziały** (tekst po lewej, przyklejona scena z dużą wizualizacją po prawej), **Droga klienta** (korzyści jako etapy drogi klienta na jednej linii wypełnianej przewijaniem), **Stos warstw** (karty nasuwają się na siebie, przykryte cofają się w głąb), **Panel** (lista-akordeon + scena, automat = jeden cykl historii); do tego bento bez zmian.
- Refaktor: shadery i `ShaderCanvas` w `components/sections/impact/shader.tsx` (z `paused` i `epoch` - historia od kroku 1, gdy kafel się pokazuje), układy w `impact/layouts.tsx`, `Impact.tsx` = nagłówek + przełączniki; sekcja `overflow-x-clip` zamiast `overflow-hidden` (sticky).
- Weryfikacja: zrzuty każdego układu na 1440 i 390, bento identyczne jak przed refaktorem, kafle schowane nie uruchamiają shadera, `tsc` i ESLint czysto.

### 2026-09-27 — Sekcja „Asystent AI” usunięta ze strony głównej (praca równoległa, chat 2)
- Trzy rundy propozycji modernizacji sekcji (pokaz rozmowy z asystentem między Opiniami a Ofertą): runda 1 (Nocna zmiana, Rozmowa, Gotowe zapytanie, Wielu klientów naraz) - „lack of soul, miałkie”; runda 2 (Postać, Głos ze światła, Poprzednia dopracowana) - wybrana „Poprzednia, dopracowana” ułożona poziomo; potem wersje tego konceptu (Konsola, Oś kroków, Identyfikator, Trzy panele).
- Ostatecznie właściciel: „nie pasuje ta sekcja do reszty, jest trochę zbędna” → **„usuń sekcję z chatbotami”**. Asystenta pokazują już: karta 2 w „Dlaczego Avenly”, „Wirtualny Asystent AI” w Realizacjach, konstelacja hero, pasek pod hero, Oferta i prawdziwy czat w rogu.
- Usunięte: `components/sections/AiConsultant.tsx`, `components/sections/ai-consultant/`, `lib/i18n/home/ai-consultant.ts`; w `components/home/HomeClient.tsx` import i blok sekcji (komentarz w miejscu importu), w `lib/i18n/home/index.ts` pole `aiConsultant`. Po Opiniach od razu Oferta (bez odstępu - sprawdzone), `/` i `/en/` działają, `tsc` i ESLint czysto.
- Wnioski z rund (na wypadek powrotu tematu) w `docs/sekcje/asystent-ai.md`: „dusza” = asystent jako postać + rozmowa o biznesie odwiedzającego; pokaz musi mieścić się w wysokości ekranu.

### 2026-09-27 — Usunięta sekcja CTA „Gotowy na cyfrową dominację?”

- Decyzja właściciela („usuń, bo chyba jest niepotrzebna”). Powody: dublowała CTA z hero, Procesu i Oferty; niezgodna z PRODUCT.md (Title Case „Dominację”, hasło w stylu hype, niesprawdzalne „Dołącz do firm, które wyprzedziły konkurencję”, drugie CTA „Napisz do nas”, rozmyta poświata za kartą). Usunięte `components/sections/CallToAction.tsx`, `lib/i18n/home/cta.ts`, pole `cta` w `lib/i18n/home/index.ts`, blok `#kontakt` w `HomeClient`.
- Kotwica `#kontakt` była celem przycisku „Darmowa Wycena” w nawigacji (komputer + menu na telefonie) i linku „Kontakt” w stopce - teraz prowadzą prosto na `/kontakt` (`localizeHref`: EN `/en/contact`), jeden krok mniej do formularza. Sprawdzone w przeglądarce (PL i EN).

### 2026-09-27 — Sekcja „Opinie” zamknięta: Redakcja (praca równoległa, chat 1)
- Wybór z Redakcja / Scena / Gwiazdy / Certyfikat; właściciel: „wybieram redakcję, ale podrasuj sekcję, dodaj gdzieś te animowane cudzysłowy ze sceny i w ogóle dodaj duszy tej sekcji, żeby nie była taka miałka”.
- Rozkładówka magazynu: pierwsza opinia jako wielki cytat, druga w węższej szpalcie, stopka jak przypis („Cytaty bez skrótów i poprawek.”). Cytaty „w cudzysłowie”: znaki “ ” rysowane kreską na liniach nad i pod cytatami, co 8 s obiega je ostra plamka światła. Wspólne słowo „polecam” zakreślone w obu cytatach (pas koloru pod słowem, nie podkreślenie jak link). Każda strefa wchodzi, gdy sama pojawi się na ekranie.
- Responsywność na prośbę właściciela (telefon, tablet, 2K+), link do profilu z celem dotyku 44 px. 2026-09-28: bez ogromnego „5,0”, gwiazdek i AggregateRating (słaby social proof), nowe copy nagłówka i podtytułu.
- Pliki: `components/sections/Testimonials.tsx` + `testimonials/*`. Szczegóły: CLAUDE.md „Sekcja Opinie”, historia rund `docs/sekcje/opinie.md`.

### 2026-09-28 — Stopka: Kropka „Nad i” (praca równoległa, chat 5)
- Runda 1: Kropka / Wizytówka / Na żywo / Żaluzje / Obecna; wielki napis AVENLY z Kropki usunięty („ten napis avenly mi nie siedzi” - powtarzał logotyp z hero); runda 2 zakończeń: Nad i / Linia / Finał. Wybór: „wybieram kropka … zakończenie wybieram: nad i”.
- Tytuł „Postaw kropkę nad i” (EN „Dot the i”) - kropka marki spada na „i” (pierścień przy lądowaniu, co 12 s błysk), biały przycisk „Bezpłatna konsultacja”; kolumny Usługi / Na skróty / Kontakt z wyraźnie większymi, białymi nagłówkami (poprawka właściciela); pasek prawny bez oceny Google; akcent w kolorze motywu podstrony; bez WebGL i framer-motion.
- Pliki: `components/layout/Footer.tsx` + `footer/dot.tsx`, `footer/shared.tsx`, `footer.css`, `lib/i18n/footer.ts`. Szczegóły: CLAUDE.md „Stopka - Kropka nad i”, historia rund `docs/sekcje/stopka.md`.

### 2026-09-28 — Redesign bloga (/blog i /blog/[slug])
- Właściciel: „weźmy pod lupę jeszcze bloga, trzeba go zredesignować i dostosować do poziomu strony”. Dawny blog łamał zasady strony: rozmyte kule światła, gradientowy tekst, wersalikowe plakietki z pulsującą kropką, szkło (`backdrop-blur`), karty unoszące się i świecące po najechaniu, shader warstwic (motyw „Dlaczego Avenly”), fioletowe plamy na wpisie, filtr z 5 pustymi kategoriami, zagnieżdżony `<main>`.
- `/blog`: etykieta „Blog” + „Konkretna wiedza. Bez żargonu.” + podtytuł jak sekcja Blog na stronie głównej, siatka tych samych kart (1 / 2 / 3 kolumny, wejście kaskadą), bez filtrów i wyszukiwarki; nowe metadane (bez „poradników”, sentence case).
- `/blog/[slug]`: powrót „Wszystkie wpisy”, etykieta z kategorią, h1, zajawka jako wstęp, data i czas czytania; okładka w ramce jak karty; kolumna do czytania z typografią strony (kreski list w kolorze marki); cytat na końcu = karta z białym przyciskiem; „Czytaj dalej” (pozostałe wpisy); pasek postępu czytania w kolorze marki.
- Linki CTA w 3 wpisach ujednolicone do „Bezpłatna konsultacja” (także w `docs/blog-style-guide.md` i `/new-post`). Usunięte: `BlogHero`, `BlogHeroBackground`, `BlogList`, `.blog-content`.
- Weryfikacja: build + zrzuty z `out/` (1440 × 900 i 390 × 844, lista i wpis), bez błędów konsoli, hierarchia nagłówków h1 → h2 → h3; `tsc` i ESLint czysto. Uwaga: w dev serwerze `/blog/` wisi (zapamiętany błąd Turbopacka z pełnego dysku) - do restartu serwera.

### 2026-09-28 — Jeden kolor marki (kropka logo #3b82f6)
- Właściciel: pastelowy akcent nagłówków („baby blue” `#adcbfd`) i etykiety w tym kolorze się nie podobają, „trzeba brandingowo ujednolicić - kropka jest niebieska, nagłówki baby blue”. Audyt: 12 odcieni niebieskiego w interfejsie.
- Tokeny w `globals.css` (blok „KOLOR MARKI”): `--brand` `#3b82f6` (kropka logo) + `--brand-rgb`, `--brand-hi` `#60a5fa` (hover / fokus / drobny tekst). Podpięte: akcenty nagłówków, gwiazdki i linie etykiet (tekst etykiet neutralny `#e2e8f0`), pasek pod hero (gwiazdki, linia, poświata szkła; ikony neutralne), Opinie (cudzysłowy, numery, zakreślenie), strzałka Bloga, najechanie na profile w stopce, scrollbar (dawniej `#2f5beb`). Nagłówek hero: akcent biały (niebieski zniknąłby na planecie). Etykieta „Oferta” nie zmienia już koloru z usługą, za to etykieta „Realizacje” ma gwiazdki i linie w kolorze aktywnej realizacji (`--rz-accent`, płynne przejście przy zmianie projektu).
- Przełącznik propozycji akcentu (Obecny / Srebro / Błękit marki / Stal / Cienka biel) usunięty - decyzja „jak kropka” go rozstrzygnęła. Zasada w PRODUCT.md (Design Principles 11) i CLAUDE.md („Schemat kolorów”).
- Poza zakresem (kodowanie treści, do decyzji): jasne odcienie usług w Ofercie (one-page `#93c5fd`, CRM `#7dd3fc`) i etapów Procesu (krok 1 `#93c5fd`).

### 2026-09-28 — Copy sekcji strony głównej (chwyt, potem konkret)
- Przegląd tekstów wszystkich sekcji wg PRODUCT.md (głos korzyści, „chwyt, potem konkret”, bez obietnic bez pokrycia). Zmiany tylko w słownikach (PL i EN), układ bez zmian.
- **„Dlaczego Avenly”:** podtytuł zamiast banału „Świat pędzi do przodu. Nie zostawaj w tyle.” zapowiada 4 karty („Ładny wygląd to dopiero początek. Twoja strona sprzedaje, odpowiada klientom, jest widoczna w Google i działa bez przerw.”); tytuły kart = chwyt (kategorię mówi zakładka): „Z odwiedzającego w klienta”, „Żadne pytanie nie czeka do rana”, „Szybkość, którą widzi Google”, „Działa, kiedy klient jej szuka”; opisy bez „maszyny do pozyskiwania klientów” i „domykania tematów”.
- **Proces:** opisy kroków w głosie korzyści (co Ty masz na etapie) zamiast „słuchamy i analizujemy” / „bierzemy na siebie”; krok 4 mówi o wsparciu po starcie (tytuł „Start i wsparcie” to obiecywał, opis nie).
- **Opinie:** etykieta „Opinie”, nagłówek „Nie wierz nam na słowo. Uwierz klientom.” (EN „Don't take our word for it. Take theirs.”), link „Sprawdź opinie w Google” (dawniej zaproszenie do wystawienia opinii - nie do potencjalnego klienta).
- **Realizacje:** Kardyś opisany efektem („Dziś ma nową stronę…”) zamiast „Postawiliśmy”; asystent bez żargonu „kwalifikuje zapytania” („Działa na tej stronie, w prawym dolnym rogu…”).
- **Oferta:** wstęp „Nie szukasz osobno grafika, programisty i kogoś od AI…” (tytuł „Jeden zespół.” już mówi o zespole).
- **Zgodność z „Co obiecujemy w ofercie”:** pasek pod hero „Panel do zarządzania firmą” zamiast „Panel do samodzielnej edycji” (obietnica CMS), węzeł konstelacji hero „Lokalne SEO” zamiast „SEO i marketing” (marketingu nie ma w ofercie).
- Bez zmian: h1 hero, Blog, stopka (spełniają zasady).
- **Ocena „5,0 na Google” usunięta z całej strony** (decyzja właściciela: „tak, usuń 5,0 na Google” - słaby social proof): linia dowodów hero („Bezpłatnie · bez zobowiązań · odpowiedź w 24 h”), sekcja Opinie (bez ogromnego „5,0”, gwiazdek i paralaksy liczby; nagłówek w jednej kolumnie, podtytuł „Tak o współpracy z Avenly piszą klienci w Google.”, bez zdania „Wspólne słowo w każdej opinii” - „polecam” zakreślone tylko w cytatach), CTA 5 podstron stron WWW (blok „★★★★★ 5,0 na Google od naszych klientów.”), JSON-LD: bez AggregateRating (sekcja Opinie i globalny LocalBusiness w `lib/schemas.ts`) i bez `reviewRating` - Review z autorem i treścią zostaje. PRODUCT.md zasada 4 i INSTRUKCJA-SEO.md zaktualizowane.
- Weryfikacja: zrzuty 1440 × 900 i 390 × 844 (karty „Dlaczego Avenly”, Proces, Opinie, Oferta) - tekst mieści się w kartach; `tsc` i ESLint czysto; `/` i `/en/` 200. Kopie słowników sprzed zmiany: scratchpad sesji (`copy-backup/`).

### 2026-09-28 — Oferta: copy usług, uczciwe obietnice, kolor przycisku (praca równoległa, chat 3)
- **Bez WordPressa i CMS** (właściciel: „nie używamy już WordPressa ani CMS w postaci WordPressa do tworzenia stron firmowych”): strona firmowa bez „panelu CMS” i samodzielnej edycji („Podstrona dla każdej usługi”), w rysunku strony na miarę blok Headless CMS zamieniony na moodboard marki (zdjęcie, próbki kolorów, typografia; kolor płynie do strony i maluje nagłówek).
- **Strona szyta na miarę = „to już nie tylko strona, to uczucie”** (poprzednia wersja „frajerska”): nowy opis, legenda i scenka; krok 3: kursor klienta dotyka autorskiego kształtu, a ten odpowiada falą (strona reaguje na człowieka).
- **Copy wszystkich usług** („teksty w reszcie są mid”): każda usługa ma własny chwyt o tym, co klient czuje lub zyskuje, potem fakty; legenda do ~30 znaków, zgodna z odnośnikami na rysunkach; podpisy scenek z perspektywy klienta. PL i EN.
- **Kurierzy:** weryfikacja - w kodzie Avenly (`shop-engine`, Kardyś) nie ma integracji InPost / DPD; technicznie wykonalne (InPost ShipX REST + Geowidget, DPD SOAP z umową, albo broker Furgonetka). Właściciel: „załagodź” - „Kurier lub paczkomat” w Ofercie, a na podstronie sklepu, w kategoriach, katalogu `/uslugi` i metadanych „wysyłka kurierem lub do paczkomatu” zamiast „integracji z InPost / DPD / DHL”. Scenka sklepu: „Klient wybiera produkt…”.
- **Pozycjonowanie:** UI/UX i audyt jako skromne dodatki (projekt do akceptacji przed kodem, szybki przegląd z listą poprawek), AI w CRM jako opcja („na życzenie”).
- **Przycisk „Cała oferta” w kolorze otwartej usługi**, potem poprawka „clanky”: tekst, tło i obwódka z jednej animowanej `--of-c`, najechanie przez `@property --of-h`, wspólne przejście koloru sekcji 1,3 s z miękkim startem.
- Nowe zasady marki w PRODUCT.md: „Chwyt, potem konkret” i „Co obiecujemy w ofercie”. Weryfikacja: zrzuty paneli, próbkowanie stylów przycisku w trakcie zmiany usługi; `tsc` i ESLint czysto; `/`, `/en/`, `/uslugi/`, podstrona sklepu PL / EN odpowiadają 200. Uwaga: 28.09 dysk C był pełny (0 B) - usunięte stare tymczasowe profile Chrome po zrzutach (`%TEMP%\op-chrome-*`); coś innego zajmuje ~255 GB.

### 2026-09-29 — Strona Kontakt zamknięta: Obok siebie + tło Opływ + formularz Bez karty (praca równoległa etap 2, chat 4)
- Restyling `/kontakt` i `/en/contact` do designu strony głównej w 6 rundach. Runda 1: czerń zamiast niebieskiego „zalanego” tła z shaderem, nagłówek jak w sekcjach strony głównej (`SectionLabel` + `.im-title` / `.im-lead`, „Zacznijmy.” z kropką marki), etykiety bez rozstrzelonych wersalików, biały przycisk „Wyślij wiadomość”, stany (błędy, wysyłanie, wysłane, błąd serwera) w nowym stylu, dane firmy z `seo-data.ts`, animacje CSS zamiast framer-motion (naprawiony błąd hydratacji h1 przy ograniczonym ruchu), lista usług z etykietami jak w Ofercie (wartości do Web3Forms bez zmian).
- Tło (właściciel: „tło jakieś jak tamto dał”, potem „daj kilka wersji”): płynny błękit i 4 odmiany odrzucone („zupełnie niepasujące do brandingu marki”), potem Kropka / Siatka / Sygnał / **Opływ** - wybór: „opływ jest zajebisty”. Opływ = włosowe linie przepływu opływają formularz (WebGL, funkcja prądu, kreski w kolorze marki, kursor rozsuwa linie, pisanie przyspiesza przepływ, wysłanie = pas światła); bez „tarczy” pod tekstem („usuń ten cień za lewą częścią”).
- Układ „Obok siebie” (odrzucony „Formularz pierwszy”), formularz **„Bez karty”** (odrzucona lżejsza „Karta”): wprost na czerni, pola „na linii” z niebieską linią fokusu, kształt formularza wyznacza strumień.
- Mobile / tablet („dostosuj do mobile”): zwarte dane (numery obok siebie), tytuł formularza na pierwszym ekranie telefonu, 1024-1279 px dane w 2 kolumnach, twarde spacje po jednoliterowych słowach. Zrzuty 320-1440, telefon w poziomie, EN, ograniczony ruch; `tsc` / ESLint czysto; wysyłka testowana z podmienionym `fetch` (bez maili).
- Dokumentacja scalona od razu na prośbę właściciela („zaktualizuj pliki .md”): CLAUDE.md (rozdział „Strona Kontakt”, wiersz w tabeli shaderów, niespójności), PRODUCT.md (anti-references: tło zalane błękitem, „tarcza” pod tekstem; zasada 7; bez sierotek), project_context.md, notatki `docs/podstrony/kontakt.md`. Nie wdrożone (build i wdrożenie robi koordynator).

### 2026-09-29 — Sekcja „Blog” zamknięta: Panorama + konsolidacja dokumentacji (praca równoległa, chat 4)
- Przebudowa całej sekcji w 3 rundach (właściciel: „przebuduj całą sekcję tak, aby dorównywała poziomem reszcie strony”, potem „zrób 4 następne bardziej cinematic jak cała strona”): runda C = Okładka / Przelot / Kamera / Panorama / Okładka w ruchu. Wybór: „dosuń po prostu do lewej wszystko do skrajności wrappera i tyle, wybieram 4. panorama”.
- **Panorama:** przewijanie = jazda kamery w bok wzdłuż dużych okładek 3 najnowszych wpisów (scena sticky na pełną szerokość ekranu, paralaksa zdjęć, przygaszone okładki poza kadrem, licznik z linią postępu). Nagłówek sekcji w scenie (poprawka po uwadze „heading seems off do dolnej części sekcji”), wszystko przy krawędziach wrappera, szerokość okładki mierzona tak, żeby scena mieściła się w oknie (1366 × 768 i niskie telefony bez podtytułu). Telefon: „Wszystkie wpisy” w wierszu etykiety, scena nad bąblem czatu. Ograniczony ruch = karty, bez JS = pierwszy wpis.
- Usunięte: pozostałe propozycje, przełącznik „Blog - układ”, `proposals.css`, hooki i pola danych tylko dla propozycji. Weryfikacja: pomiar krawędzi na 6 rozmiarach (1440, 1366 × 768, 1920, 820, 390, 375), zrzuty, reduced motion, `tsc` / ESLint / build.
- **Serwer deweloperski:** po zapełnieniu dysku 2026-09-28 cache Turbopacka dawał 404 na wszystkich podstronach poza `/` (uszkodzony `.next/dev/types/routes.d.ts`) - za zgodą właściciela: stop, usunięcie `.next/dev`, restart. Wdrożenie na avenly.pl: `e49199f5`.
- **Konsolidacja pracy równoległej:** notatki `docs/sekcje/*.md` (Opinie, Blog, Stopka) przeniesione do CLAUDE.md (nowe rozdziały), project_context.md, README.md i progress.md; nowe zasady w PRODUCT.md (Design Principles 12-14: dusza sekcji, nagłówki nad linkami, treść przy krawędziach wrappera; anti-references: wielki logotyp na dole, kompozycja wyśrodkowana obok wyrównanych; opinie słowo w słowo bez dat względnych); PRACA-ROWNOLEGLA.md - wszystkie sekcje zakończone, poprawione nieaktualne zasady (ocena Google, akcent `#adcbfd`).

### 2026-09-29 → 2026-10-01 — Etap 2 pracy równoległej: podstrony Blog, Usługi, Realizacje zamknięte (chaty 3, 2, 5)
- **Blog (chat 3, zamknięty 2026-09-29):** właściciel odrzucił wrześniowy redesign i wrócił do wersji z czerwca 2026, zmodernizowanej do języka strony. Lista `/blog` = „Wierna” (nagłówek na liniach bloga, pigułki kategorii z wpisów, sortowanie, wyszukiwarka, karta najnowszego wpisu), wpis = „Okładka + Nagłówek na liniach”. Nowe pliki `components/blog/BlogIndex.tsx`, `cards.tsx`, `BlogBackdrop.tsx`, `data.ts` i `blog.css` (prefiks `bl-`); `docs/blog-style-guide.md` i `/new-post` zaktualizowane. Notatki: `docs/podstrony/blog.md`.
- **Katalog usług (chat 2, zamknięty 2026-10-01, 17 rund):** `/uslugi` i `/uslugi/strony-www` w układzie pierwotnej wersji - niska góra „Kropka” („Od strony po system.”), filtr kategorii, galeria kart z rysunkami Oferty (karta Kadr, wejście Obrys), box „Nie wiesz, co wybrać?” z własnym rysunkiem, tło Mgławica (kopia mgławicy Realizacji). Kod w `app/(pl)/uslugi/_katalog/`, `ServicesHub.tsx` usunięty. Usunięta widoczna ścieżka i linki „Wróć” na wszystkich podstronach poza blogiem. Notatki: `docs/podstrony/uslugi.md`.
- **Realizacje (chat 5, zamknięte 2026-10-01, 18 rund):** nagłówek na cały pierwszy ekran („Dowód, nie obietnice.” + kadry w głębi z żywymi stronami klientów), Plansze 01-04 (przypięte sceny z wielką nazwą i stroną klienta przewijaną w kadrze), „Wszystkie realizacje” z filtrem i kartą „Twoja firma może być następna”, case study z makietą „Strona na żywo”, mgławica za całą podstroną. Kod w `app/(pl)/realizacje/_rl/`, obrazy całych stron w `public/realizacje/`. Notatki: `docs/podstrony/realizacje.md`.
- **O nas (chat 1):** przebudowa oddana 2026-09-29 (wejście „przelot” ze znakiem AVENLY w trzech wersjach, cztery układy reszty strony) - **czeka na wybór właściciela**. Notatki: `docs/podstrony/o-nas.md`.
- Plan etapu 2 w archiwum: `docs/praca-rownolegla-etap-2.md`. Wdrożenie stanu pośredniego: `a540e815` (2026-09-30).

### 2026-10-01 — Etap 3: copywriting podstron, „Projekt UI/UX” usunięty jako usługa (chat 6)
- Teksty Usług, Realizacji i Kontaktu przepisane jednym piórem (PL i EN) po kilku rundach z właścicielem. Opisy: `/uslugi` „Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.”, `/uslugi/strony-www` „Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.”, `/realizacje` „Te strony pracują dziś dla prawdziwych firm. Zobacz, co widzą ich klienci.”, box katalogu ze zdaniem właściciela. Pełny blok Open Graph na 6 stronach (wcześniej bez obrazka).
- Nowe zasady copy (PRODUCT.md): bez „drabinki potrzeb”, zdanie o kliencie zamiast pochwały produktu, bez przechwałek i docinków, klientowi nie przypisujemy pracy agencji, bez form zakładających płeć czytelnika.
- **„Projekt UI/UX” usunięty jako osobna usługa** (decyzja właściciela: projekt do akceptacji jest częścią każdej budowy): podstrony `/uslugi/design*` zarchiwizowane w `docs/archiwum/usluga-ui-ux/`, 301 w `public/_redirects`, Oferta 7 pozycji w 3 kategoriach, konstelacja hero, stopka, formularz i sitemap bez UI/UX.
- Opisy kafli katalogu: własne zdania dla one-page, Chatbotów AI i Audytu (dwa ostatnie czekają na ocenę). Notatki: `docs/podstrony/copy.md`.

### 2026-10-02 — One-page zamknięta: film w trzech scenach + szkielet podstron usług (chat 7)
- Pilot przebudowy podstron usług. Kierunek „Okaz” (plan z samych kresek) odrzucony po trzech rundach; przyjęty **film w trzech scenach**: kadr z zaprojektowaną stroną klienta i kamerą (droga klienta: pierwszy ekran → oferta → formularz → „Nowe zapytanie”), stos czterech czarnych kart z rysunkami w języku Oferty i światami świecących linii w tle, zakres z terminem na linii wymiarowej i pokazem w kadrze, zakończenie „Zacznijmy od rozmowy.”. Właściciel: „super, podstrona dopięta”.
- Wspólny szkielet `app/(pl)/uslugi/_usluga/` (`ServiceShell`, `ServiceHead`, `Steps`, `ServiceEnding`, `usePin` / `useFrame`, `Sketch`, `Dock`, mgławica w kolorze podstrony). Termin „Start w 3-5 dni” potwierdzony, stary `OnePageClient.tsx` i `onePageDict` usunięte. Wzorzec dla fali 2: `docs/podstrony/usluga-one-page.md`.
- Hierarchia podstron usług (decyzja właściciela 2026-10-01 / 02): one-page poziom 1, strona firmowa 2, sklep 2-3, strona na miarę 3 - każda efektowna na swoim poziomie.

### 2026-10-02 → 2026-10-06 — Fala 2: strona firmowa, Strona interaktywna, sklep, system CRM, chatboty AI (chaty 8-13, w toku)
- **Strona firmowa (chat 8):** scena „Piętra” przyjęta („banger”), makieta bez klikania i w palecie podstrony, sekcja kart 27 podstron w czterech wersjach do wyboru, telefon z podglądem kart (runda 8).
- **Strona interaktywna (chat 9):** sceny „Horyzont” i „Nić” wybrane, makieta z czterema ekranami i ujęciami z kamerą, trzy nowe sceny „Technologii”; 2026-10-06 nowa nazwa usługi, wejście „Wschód”, przegląd wydajności.
- **Sklep (chat 10):** mini sklep do klikania w kadrze, płatność przez przekierowanie do operatora, „Na tle szablonów” i Stos wybrane, makiety ciemne z etykietą „Przykładowy sklep”, telefon (rundy 7-10), copywriting sekcja po sekcji (hero czeka na wybór).
- **System CRM (chat 11, od 2026-10-04):** własny pomysł zamiast wzorca stron WWW, po uwadze właściciela bez sekcji do klikania; sześć sekcji, wszystkie wersje wybrane; „rozejście” zamiast linii światła (`scripts/crm-bloom.mjs`); telefon i wydajność zrobione rachunkiem z kodu.
- **Chatboty AI (chat 13, od 2026-10-04):** hero z polem pytań i filmem, „22:00” z zegarem, Języki, Plan; Wiedza w dwóch nowych wersjach do wyboru; zweryfikowane raz 2026-10-04 (15 wersji), późniejsze rundy nieoglądane.
- Zasady wspólne z tych rund: makiety w palecie podstrony i podpisane jako przykład, jedno zdanie i jedno miejsce akcji naraz, kamera powoli z postojami, bez lecących linii światła, odsłony kończą się przy wejściu, bez odbicia, AI i portal klienta tylko jako opcje (PRODUCT.md, CLAUDE.md „Podstrony usług w pracy - fala 2”).
- 2026-10-04: zasada właściciela „bez weryfikacji w trakcie pracy” (przeglądarka w tle, zrzuty, `tsc`, ESLint dopiero na jego sygnał - „zbyt laguje”). Dlatego większość rund z 2026-10-04 → 2026-10-06 jest nieoglądana w przeglądarce.

### 2026-10-05 — Wydajność: tła bez interakcji z kursorem, optymalizacja podstron usług i strony głównej (4 wdrożenia)
- Właściciel: „usuń na każdej podstronie w usłudze hover na tle i dystorsję, bo laguje i zoptymalizuj te podstrony wszystkie”, potem to samo dla `/uslugi` i `/realizacje`. Żadne tło-mgławica na podstronach nie reaguje już na kursor (czarna dziura, smuga i fale wyłączone).
- Podstrony usług: sekcje daleko od ekranu nic nie liczą, zmienne CSS pisane co klatkę bliżej elementów, shadery kart kompilowane w tle, niewidoczne ekrany makiet nie są rysowane (lista: PRACA-ROWNOLEGLA.md „Wydajność podstron usług”).
- Strona główna („zoptymalizuj pierwszą sekcję strony głównej oraz drugą, bo lagują”): tempo rysowania hero i Realizacji liczone z czasu i zależne od aktywności, shader planety w dwóch przebiegach, scena hero stoi przy < 30% widoczności, przycisk „Zobacz realizacje” bez `backdrop-filter`, mgławica Realizacji nie liczy się przed odsłoną sekcji.
- Wdrożenia: `bc047217`, `74b14420`, `fad591c2`, `f2f29804`.

### 2026-10-06 — „Strona interaktywna”, płynność mgławicy podstron usług, 7 wdrożeń
- **Nowa nazwa usługi:** „Strona szyta na miarę” → **„Strona interaktywna”** (EN „Interactive website”). Właściciel: „każda firma tak pisze i jest to cringe”; odrzucił przymiotniki-hasła (z rozmachem, autorska, flagowa, premium). Zmienione nazwy w Ofercie, danych usług, konstelacji hero, stopce, etykiecie formularza i metadanych; adres podstrony, nazwy plików i wartość opcji formularza zostają.
- **Mgławica podstron usług (pliki wspólne, trzy poprawki po uwagach właściciela):** blask i winieta liczone w każdej klatce (`liveGlow`), płynna odsłona przy wejściu (front w kompozycji, zegar krokami), gaz jako dwie przenikające się klatki kluczowe.
- **Chatboty:** poprawka mignięcia hero na wejściu (klasa szkieletu `sv-wait`), akcent Wiedzy „Nie zmyśla.” zamiast „Wie, czego nie wie.”. **CRM:** „zbudowany” zamiast „szyty”, bez linii dowodów, lżejsza sekcja modułów. **Strona interaktywna:** wejście „Wschód”, gwiazda na czole nici, warstwy w filmie.
- Wdrożenia (w kolejności): `90723428`, `9afa4557`, `292f5691`, `1a4a7f4a`, `6bd06458`, `1f8381e3`, `a6a206db`. Wszystko sprawdzone tylko `curl`-em; płynność ocenia właściciel.

### 2026-10-07 — Przegląd koordynatora: dokumentacja zaktualizowana
- `CLAUDE.md`: baner etapu 3, drzewo tras, tabela shaderów (nowe wiersze: linie bloga, mgławice katalogu i Realizacji, tło szkieletu z `liveGlow`, głębia kart czterech podstron, pole światła O nas; stare shadery podstron oznaczone jako nieaktywne), rozdziały „Blog”, „Katalog usług”, „Podstrona Realizacje”, „Podstrony usług w pracy - fala 2”, oznaczenie rozdziałów historycznych, zdarzenia czatu, mapa slugów, Deploy flow.
- `PRODUCT.md`: nowe zasady copy i designu z etapów 2-3. `PRACA-ROWNOLEGLA.md`: stan na 2026-10-07, tabela wdrożeń, korekty zleceń po rundach. `project_context.md`, `README.md`, `INSTRUKCJA-SEO.md`: stan stron, usług i plików. Notatki chatów: dopiski koordynatora.
- Stan: produkcja = `a6a206db` = bieżące repozytorium; serwer deweloperski na :3001 nie działał; 23 GB wolnego miejsca na dysku. Nic nie było budowane, wdrażane ani oglądane w przeglądarce.

### 2026-09-27 — Sekcja „Oferta” zamknięta: Plan (praca równoległa, chat 3)
- **Układ Plan** (wybór z Plan / Stroik / Karta / Cel; właściciel: „nadaj tej sekcji trochę duszy, zajebiście mi się podoba ten motion reveal elementów na makietach”): oferta jako teczka rysunków technicznych - karty usług po lewej, czarna deska z rysunkiem wybranej usługi po prawej. Rysunek rysuje się linia po linii z piórem kreślarskim, potem ożywa scenką w 3 krokach (co usługa robi dla klienta) z podpisem kroku jak napisy; przy zmianie stary rysunek zwija się, nowy rysuje od zera.
- **Ruch kinowy w podstawowej sekcji** („fajne motion i zostaw je”): kamera najeżdża na akcję w każdym kroku scenki, deska otwiera się jak przysłona, światło przesuwa się po krawędzi deski, nagłówek wyjeżdża linijkami spod maski, karty wchodzą kaskadą.
- **Indeks Karty + zegar Obwódka** (z Tor / Spis / Miniatury / Karty i Obwódka / Tarcza / Pasek): obwódka wybranej karty w kolorze usługi ubywa do zmiany usługi (automat 8 s), bez liczników sekund.
- **Tło sekcji: Bez tła** - odrzucone po drodze: „kinowa cała sekcja” (pasy, kamera przy przewijaniu), „kino wprost” (Taśma filmowa, Montaż, Obiektyw, Echo), renderowane tła Promienie / Przepływ (WebGL) i Linie konstrukcyjne. Wszystkie propozycje, ich pliki, style i przełączniki usunięte.
- **Responsywność i „wow” na telefonie:** wejście liczone od deski (wcześniej przysłona i rysowanie grały poza ekranem - IntersectionObserver w Chrome uwzględnia `clip-path` deski, pomiar przez wrapper `.of-pl-frame`), mocniejsze zbliżenia kamery na małej desce, swipe z obrazem za palcem w nieruchomym kadrze, linia od wybranej pigułki do deski, deska bliżej krawędzi ekranu.
- Weryfikacja: zrzuty 320-2560 (10 szerokości), reduced motion, swipe zdarzeniami dotyku; `tsc` i ESLint czysto; `/`, `/uslugi/`, `/kontakt/`, `/en/` odpowiadają 200. Notatki i historia rund: `docs/sekcje/oferta.md`.

### 2026-09-27 — „Proces”: wybór Wstęgi, podrasowany materiał, tło sekcji w propozycjach

- **Kolory wstęgi** („żeby wstęga się wyróżniała od tła, bo się zlewa”): wstęga = barwione szkło w nasyconych akcentach kroków (błękit, fiolet, bursztyn, zieleń - `RIBBON_ACC`), płynne przejście wzdłuż wstęgi między krokami; tło Głębia = neutralne srebrne szkło z 18% nutą akcentu, przygaszone. Parametr `sat` w `glass()`.

- **Zamknięcie sekcji:** tło = **Głębia** (wybór właściciela; Kaustyki / Soczewki / Tafle / Nici / Bez tła i przełącznik usunięte, `backdrop.tsx` uproszczony do dwóch szklanych wstęg). **Responsywność** („dostosuj do mobile, efekt wow ma zostać taki sam”): na telefonie ten sam zygzak co na komputerze - wstęga 34 px biegnie wzdłuż tekstu na przemian po lewej i prawej (wcięcie tekstu 56 px po jej stronie), między krokami przecina ekran łukiem S (krzywe Béziera z pionowymi stycznymi); start od środka, koniec nad CTA. Zrzuty 1440, 820 (tablet), 390 i 320; ESLint i `tsc` (pliki Procesu) czysto.

- **Skrzyżowanie i szkło luksusowe** (właściciel: „problem z momentem, jak się krzyżuje”, „tło głębia również daj szklane”, „szkło jeszcze bardziej luksusowe”): skręt `twistAngle()` (długo lico, krótko i rzadko krawędź), `crossWidth()` (ustawiona bokiem = cienka krawędź szkła zamiast punktu), wspólny `glass()` - szlif kryształu (chłodna + ciepła linia), ostre refleksy dwóch świateł, przydymione wnętrze, wędrujący refleks co ~11 s; Głębia = szklane wstęgi, Soczewki i Tafle na tym samym materiale. Odrzucone po drodze: pochylenie w perspektywie (ząbki), rozmyty połysk (mgiełka), drugi blik obok głównego na kuli („oczy”).

- **Materiał = Szkło** (wybór właściciela: „wybieram wstęgę szkło, ale tło sekcji daj kilka propozycji jeszcze”): usunięte Satyna / Linie / Pył / Metal, przełącznik „Wstęga”, `shade()` / `shadeSatin()`; zapas 2D = uproszczone szkło. **Tło - druga runda:** Kaustyki (domyślne; sieć świetlna z szumu komórkowego - pierwsza wersja z formuły „water caustic” wyglądała jak dym, więc ostre krawędzie komórek + wędrujące plamy), Soczewki (szklane kule, łuk bliku), Tafle (szklane tafle) + Głębia / Nici / Bez tła. Zrzuty 1440 × 900 i 390 × 844; ESLint czysto.

- **Wygląd wstęgi - propozycje** (właściciel: „zbyt metaliczna, zrób kilka propozycji, mogą być zupełnie inne, pasujące do poprzednich sekcji”; tło na razie zostaje): **Satyna** (domyślna, kolorowa tkanina), **Szkło** (przezroczysta tafla - jak planeta w hero), **Linie** (wstęga z włosowych linii - jak warstwice w „Dlaczego Avenly”), **Pył** (wstęga z cząstek - jak logotyp w hero), **Metal** (poprzednia). Jeden shader z gałęzią wg `u_look`, przełącznik „Wstęga” w dev. Zrzuty 1440 × 900 i 390 × 844.

- **Wybór właściciela:** „wstęga jest genialna i piękna, wybieram wstęgę, resztę wywal i trzeba ją podrasować, i coś z tłem dodać ciekawego”. Usunięte: Pryzmat, Grawer, rundy 1-2 (Makieta, Warstwy, Typografia, Lista kontrolna, Horyzont), `process/shared.tsx`, przełącznik „Układ procesu”, pola słownika `stepLabel` / `of` / `mock`; `process.css` przepisany (tylko `.pr-*` / `.pw-*`).
- **Wstęga podrasowana:** wspólny materiał `process/silk.ts` (satyna zamiast folii: wygięcie w poprzek = połysk wzdłuż wstęgi, blik h^28 + połysk h^5, rąbek przy ustawieniu bokiem), nieregularny skręt, obrót w czasie i falowanie linii środkowej; renderer WebGL na płótnie o wysokości toru (gładkie cieniowanie na piksel, AA z `fwidth`) z zapasem canvas 2D (usunięte ząbki przy skręcie, strażnik jakości); szersza wstęga (do 96 px, telefon 24 px).
- **Tło sekcji - propozycje** (`process/backdrop.tsx`, przełącznik „Tło sekcji”): **Głębia** (domyślna - dwie przygaszone jedwabne wstęgi w oddali), **Nici** (trzy skręcone sznurki z włosowych nici), **Bez tła**; paralaksa, barwa etapu na ekranie, wygaszenie pod tekstem i przy krawędziach sekcji, WebGL na płótnie sticky z MSAA.
- Weryfikacja: zrzuty 1440 × 900 i 390 × 844 (oba tła), reduced motion; `tsc` i ESLint czysto.

### 2026-09-27 — „Dlaczego Avenly” zamknięta, „Proces”: trzecia runda, praca równoległa

- **„Dlaczego Avenly”:** wybór właściciela - tło sekcji **Mapa warstwic**, tekst w karcie **U góry**; Horyzont / Siatka / Bez tła / U dołu i oba przełączniki usunięte (`impact/backdrop.tsx`, `impact/stack.tsx`, `Impact.tsx`, `globals.css`).
- **Praca równoległa:** [PRACA-ROWNOLEGLA.md](./PRACA-ROWNOLEGLA.md) - 6 chatów, podział sekcji (0 Proces + koordynacja, 1 Opinie, 2 Asystent AI, 3 Oferta, 4 Blog, 5 Kontakt i stopka), zasady (style sekcji we własnym pliku CSS, bez `git checkout/restore/stash/reset/clean`, jeden dev server, bez buildów). Style „Procesu” przeniesione z `globals.css` do `components/sections/process/process.css`.
- **„Proces” - trzecia runda** (właściciel: „niby spoko, ale poprzednia sekcja jest totalnie high-endowa i luksusowa, a proces tego nie oddaje; nie 1:1 te same elementy, tylko feeling”): **Pryzmat** (domyślny; wiązka światła przez 4 szklane tafle, wachlarz promieni w akcentach Impactu, automat 7,5 s), **Wstęga** (jedwabna wstęga na canvasie 2D rozwija się przy przewijaniu i schodzi do CTA), **Grawer** (numery z polerowanego metalu z blikiem przy przewijaniu). Weryfikacja: zrzuty 1440 × 900 i 390 × 844, reduced motion; `tsc` i ESLint czysto.

### 2026-09-26 — Sekcja „Proces”: druga runda propozycji
- Właściciel o dopracowanym Horyzoncie: „odgrzewany kotlet, nie podoba mi się, daj kilka propozycji” (powtarzał motywy z innych sekcji). Nowe układy celowo bez planety, gwiazdki, warstwic i przyklejonej sceny w stylu stosu:
  - **Makieta** (domyślna): strona klienta w oknie przeglądarki dorasta z krokami - szkic, projekt w kolorach marki klienta, budowa (kłódka, 98 PageSpeed, wersja na telefon), start (Online, powiadomienie o nowym zapytaniu); lista kroków z automatem co 7 s, klik wybiera.
  - **Warstwy**: izometryczne warstwy strony (szkic, projekt, kod, strona online) składają się w jedną w rytmie czytanych kroków (scena przyklejona obok listy).
  - **Typografia**: ogromne słowa Plan / Projekt / Budowa / Start - bieżące wypełnia się bielą, kolejne w konturze.
  - **Lista kontrolna**: przyklejony wstęp z postępem i CTA, kroki odhaczane przy przewijaniu.
- Horyzont zostaje w przełączniku do porównania. Słownik: `short` (jedno słowo etapu) i `mock` (teksty w makiecie), PL i EN.
- Weryfikacja: zrzuty 1440 × 900 i 390 × 844 wszystkich układów (Makieta także etapy 3 i 4); `tsc` i ESLint czysto.

### 2026-09-26 — Sekcja „Proces”: Horyzont (wybór właściciela) zrobiony porządnie
- Właściciel wybrał Horyzont („spoko, tylko zrób to porządnie, bo teraz jest pod frajera, rozkmiń fajnie”). Pozostałe propozycje (Obecny, Orbita, Tarcza, Panele), przełącznik i ich style usunięte.
- Nowa sekcja: podróż po krawędzi planety sterowana przewijaniem - przyklejona scena, światło (gwiazdka jak w etykietach) idzie po łuku przez 4 etapy, przebyta droga świeci, zaliczone etapy się zapalają, pod łukiem treść aktywnego etapu (krok, tytuł, opis, „Dostajesz”, motyw liniowy). Powierzchnia planety z warstwicami (ten sam kafel co mapa w „Dlaczego Avenly”), które przesuwają się przy przewijaniu (planeta się obraca) i gasną pod tekstem. Przy wejściu krawędź rysuje się od lewej, a światło wschodzi nad horyzontem. Na końcu podróży CTA „Bezpłatna konsultacja” (bez pustej przerwy po scenie). Etapy klikalne (płynny przejazd).
- Dawne błędy wersji „pod frajera”: prostokątna „powierzchnia” z widoczną krawędzią, płaski łuk z małymi kropkami, cienkie numery na różnych wysokościach, wszystko wyśrodkowane bez hierarchii.
- Reduced motion / niski ekran: układ statyczny (łuk z etapami + 4 kroki + CTA); telefon: te same efekty, podpisy numerami, treść wyśrodkowana pod łukiem.
- Weryfikacja: zrzuty 1440 × 900 (także retina), 390 × 844, reduced motion; `tsc` i ESLint czysto.

### 2026-09-26 — „Dlaczego Avenly”: stos kart na telefonie i tablecie (runda 11)
- Ten sam efekt co na komputerze na każdej szerokości: karty przyklejają się jedna na drugiej, przykryte cofają się w głąb (mniejsze, ciemniejsze), zakładki z numerem i kategorią, horyzont w kolorze aktywnej karty przyklejony nad stosem, stos zamyka się równo na końcu.
- Wysokie karty (niskie telefony, niskie laptopy) przyklejają się dopiero, gdy widać ich dół - nic nie zostaje ucięte; zakładki widać, gdy ekran na to pozwala. Bez JS zwykła lista.
- Weryfikacja: zrzuty 390 × 844, 390 × 664, 1366 × 650 i 1440 × 900 (pełny stos bez zmian); `tsc` i ESLint czysto.

### 2026-09-26 — „Dlaczego Avenly”: dopasowanie do telefonu, tabletu i niskich ekranów (runda 10)
- Telefon: tekst na czystym tle (shader rozpoznaje układ karty z położenia tekstu i wizualizacji, nie z proporcji - wcześniej warstwice wchodziły pod tytuł i opis), warstwice wyrastają od dołu przy wizualizacji; zwarty rytm (tytuł tuż pod zakładką, opis 16 px, mniejsze odstępy); horyzont bez przyklejania i bez przypadkowych kresek przy krawędziach.
- Laptopy z niskim ekranem (np. 1366 × 768): karty obok siebie (tekst + wizualizacja) zwykłą listą - dawniej spadały do jednej kolumny, bo układ był związany z przyklejaniem stosu.
- Weryfikacja: zrzuty 360, 390, 768 × 1024, 1024 × 768, 1366 × 650 i 1440 × 900 (stos bez zmian); `tsc` i ESLint czysto.

### 2026-09-26 — „Dlaczego Avenly”: odcień tła wg karty, napisy historii na dole (runda 9)
- Kształty tła (krawędź planety, łuki, gwiazdka / warstwice mapy / siatka) przyjmują kolor karty, która jest na ekranie (niebieski / indygo / bursztyn / zieleń), z płynnym przejściem 1,4 s; samo tło zostaje neutralną czernią (poprawka właściciela - pierwsza wersja barwiła całe tło). Horyzont przyklejony nad stosem kart, więc kolorowy łuk widać przez cały stos. Mapa warstwic: SVG jako maska, kolor z CSS.
- Napisy historii („Klienci pytają o ceny i terminy…”) przeniesione na dół karty pod wizualizację, pasek kroków na szerokość wizualizacji - wspólna linia z wynikiem 98/100 / linkiem w kolumnie tekstu.
- Weryfikacja: zrzuty 1440 (karty 1, 3, 4 - odcień niebieski / bursztynowy / zielony) i 390; `tsc` i ESLint czysto.

### 2026-09-26 — „Dlaczego Avenly”: karty 2 i 4 w lustrze, tekst u góry (runda 8)
- Karty 2 i 4 w lustrze od 1024 px (wizualizacja po lewej, tekst i zakładka po prawej) - stos zygzakiem; zakładka w tej samej siatce co treść (numer nad tytułem); shader przesuwa światło na stronę wizualizacji.
- Tekst w karcie: przełącznik w dev „U góry” (domyślny - tytuł i opis pod zakładką, wynik / link na dole kolumny) / „U dołu” (jak podpis plakatu). Druga, słabsza kałuża warstwic w rogu naprzeciw tekstu - bez czarnej plamy pod tekstem, kompozycja po skosie. Wygaszenie pod dodatkiem (wynik / link) liczone osobno.
- Weryfikacja: zrzuty 1440 (karty 1-3 i stos, oba ułożenia), telefon 390; `tsc` i ESLint czysto.

### 2026-09-26 — „Dlaczego Avenly”: czerń kart, tło sekcji, etykiety „Gwiazda” (runda 7)
- Właściciel wybrał etykiety sekcji „Gwiazda” - pozostałe warianty, przełącznik i ich style usunięte; `SectionLabel` bez numeru sekcji (był potrzebny tylko wariantowi „Rozdział”).
- Karty „Dlaczego Avenly”: bez ikony w nagłówku (zostaje numer i kategoria), tło = głęboka neutralna czerń z ostrym refleksem u góry zamiast granatowo-szarego („matowego”) gradientu.
- Tło sekcji („za dużo czerni”) - 3 propozycje z przełącznikiem „Tło sekcji” w dev: Horyzont (domyślny; krawędź planety z gwiazdką nad pierwszą kartą, jaśniejsza powierzchnia, równoleżniki), Mapa warstwic (kafel SVG z generatora `scripts/impact-contours.mjs`), Siatka (72 / 288 px z krzyżykami) + Bez tła.
- Weryfikacja: zrzuty 1440 (także retina) i 390 dla wariantów tła, `tsc` i ESLint czysto.

### 2026-09-26 — „Dlaczego Avenly”: teren na całej karcie (runda 6)
- Właściciel: okno-instrument z rundy 5 się nie podoba („zrób to na full box, a nie takie małe”; „pierwotnie były zbalansowane - shader tam, gdzie powinien być, a tam, gdzie tekst, zostawione”). Wariant „Okno” i przełącznik „Styl kart” usunięte; teren shadera leży na całej karcie, także pod nagłówkiem-zakładką (bez paska z linią).
- Nowy rozkład jasności jak w pierwotnych kaflach: pełny kolor w rogu i przy krawędzi po stronie wizualizacji, spadek po skosie (do sześcianu, jak dawne a³), pod tekstem szerokie łagodne wygaszenie do zera, pod napisem kroku słabsze.
- Większe karty stosu (do 640 px wysokości) i wizualizacja (do 560 px). Naprawiony koniec stosu: odstępy nad kartami zamiast pod nimi, więc zakładki nie mieszają się przy wyjeździe (przednia karta zakrywa je po kolei).
- Weryfikacja: zrzuty 1440 (karta z przodu, stos zakładek, wyjazd stosu), telefon 390; 4 shadery działają, `tsc` i ESLint czysto.

### 2026-09-26 — „Dlaczego Avenly”: karty premium (runda 5)
- Właściciel: „bardziej premium feeling, czegoś brakuje”. Karta dostała nagłówek-zakładkę (numer „03 / 04”, kategoria, ikona) - przykryte karty w stosie pokazują zakładki, więc stos czyta się jak podpisane warstwy; redakcyjny tytuł na czystej powierzchni; teren z konstelacją w oprawionym oknie-instrumencie; oprawa karty jak bezel; łagodniejsze cofanie przykrytych kart (zakładka czytelna).
- Przełącznik „Styl kart” w dev: Okno (domyślny) / Pełny teren. Kategorie kart w słowniku (`kickers`, PL + EN).
- Weryfikacja: zrzuty retina 1440 (karta z przodu i stos zakładek), telefon 390, wariant Pełny teren; 4 shadery bez błędów, `tsc` czysto.

### 2026-09-26 — „Dlaczego Avenly”: wybór Stos warstw + Konstelacje, spokojniejszy shader, etykiety sekcji
- **Wybór właściciela:** układ „Stos warstw” + wizualizacje „Konstelacje”. Pozostałe 4 układy, 6 stylów wizualizacji, oba przełączniki, ich style i teksty usunięte; z `VIZ_GLSL` wycięte gałęzie odrzuconych stylów (orbity, siatka, panele, nurt, radar, kręgi). Pliki: `impact/stack.tsx` (zamiast `layouts.tsx`), `impact/viz.tsx` (same konstelacje), `impact/shader.tsx`.
- **Bez efektów najechania na karty** (obwódka, paralaksa za kursorem). Bez restartu historii przy zmianie karty i bez przeskoku terenu po odsłonięciu przykrytej karty (czas terenu `u_tt` stoi razem z płótnem) - koniec „przeładowywania”.
- **Shader z wyczuciem:** cienkie „rytowane” warstwice (0,55-1,7 px, organicznie jak dawniej, ostra krawędź), stonowana jasność, jaśniej po stronie wizualizacji; zamiast prostokątnych masek za tekstem („cienie”) miękkie, szerokie wygaszenie pod kolumną tekstu; delikatniejsze elementy konstelacji, bez grotów.
- **Etykiety sekcji - propozycje:** wspólny `components/ui/SectionLabel.tsx` we wszystkich sekcjach strony głównej (Realizacje, Dlaczego Avenly, Proces, Opinie, Asystent AI, Blog, CTA - zamiast pigułek wersalikami); przełącznik „Etykiety sekcji” w dev: Gwiazda / Pigułka / Rozdział / Horyzont.
- Weryfikacja: zrzuty stosu 1440 i 390, zestawienie 4 wariantów etykiet (Dlaczego Avenly, Realizacje, Blog), nagłówek Realizacji z wyższym wariantem bez nachodzenia na kadr, 4 shadery bez błędów, `tsc` czysto, ESLint bez nowych błędów.

### 2026-09-26 — Sekcja „Proces”: propozycje redesignu (przełącznik „Układ procesu”)
- Prośba właściciela: redesign sekcji Proces w luksusowym języku reszty strony, copy podobne, kilka propozycji + toggle. Produkcja nadal = obecny układ.
- **Horyzont** (krawędź planety z 4 etapami na łuku, wszystko widoczne), **Orbita** (kroki na przechylonej orbicie wokół planety, aktywny z przodu), **Tarcza** (tarcza zegarka ze wskazówką i łukiem czasu), **Panele** (rozsuwane kolumny z motywami liniowymi kroków); obecny do porównania.
- Copy: tytuły i opisy kroków bez zmian; doszły lead, „Dostajesz” przy każdym kroku (z opisów, bez nowych obietnic) i zakończenie z „Bezpłatną konsultacją”. Nowy nagłówek bez wersalików i gradientu; zero rozmytych poświat.
- Wspólny mechanizm przełączników propozycji: `components/utils/proposals.tsx` (też dla „Dlaczego Avenly”).
- Weryfikacja: zrzuty 1440 i 390 każdego wariantu, automat Orbity / Tarczy / Paneli przechodzi do kroku 2 po 7 s, `tsc` i ESLint czysto.

---

## Stan końcowy plików projektu

> Lista historyczna (sesje 7-19; ścieżki sprzed podziału na `app/(pl)` / `app/(en)` i sprzed przebudowy podstron). Aktualna mapa plików: `CLAUDE.md` („Routing”, „Konwencje”) i `project_context.md`.

### Nowe pliki (utworzone w ramach SEO + a11y + perf + blog automation)
- `lib/seo-data.ts` — central source danych firmy
- `lib/schemas.ts` — schema.org JSON-LD buildery
- `components/seo/JsonLd.tsx` — reusable script wrapper
- `components/seo/ServicePageSchema.tsx` — Service + Breadcrumb dla usług
- `components/utils/DeferredClientWidgets.tsx` — lazy load Chatbot + LifecycleManager
- `app/o-nas/faq-data.ts` — DRY source FAQ (UI + schema)
- `app/polityka-prywatnosci/layout.tsx` — wrapper dla metadata
- ~~`public/.htaccess` — Apache config~~ (usunięty 2026-09-19; zastąpiony przez `public/_headers` + `public/_redirects` dla Cloudflare Pages)
- `public/og-default.png` — fallback OG image 1200×630
- `public/favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`
- `public/manifest.webmanifest`
- `INSTRUKCJA-SEO.md` — krok po kroku konfiguracja po stronie biznesowej
- `docs/blog-style-guide.md` — konwencja postów (Sesja 14)
- `docs/blog-ideas.md` — backlog pomysłów z sekcją "🔥 Trending" auto-aktualizowaną (Sesja 14-15)
- `.claude/commands/new-post.md` — slash command z research mode (Sesja 14-15)
- `.claude/commands/blog-research.md` — standalone research command (Sesja 15)

### Pliki znacząco zmodyfikowane
- `app/layout.tsx` — JSON-LD, OG, preconnect, viewport, favicons, DeferredClientWidgets + Sesja 21: viewportFit cover + main min-h-dvh
- `app/robots.ts` — 2026-ready bot strategy
- `app/sitemap.ts` — hardcoded routes, zróżnicowane lastModified
- `package.json` — browserslist + usunięte 10 deps
- `next.config.ts` — poweredByHeader, compress, reactStrictMode
- `app/globals.css` — Hero blob keyframes wzbogacone
- Wszystkie podstrony usług `page.tsx` — metadata + ServicePageSchema
- Sekcje Home: `Hero.tsx`, `Portfolio.tsx`, `Impact.tsx`, `Process.tsx`, `BlogTeaser.tsx`, `TechStack.tsx`, `Testimonials.tsx`
- `Chatbot.tsx` — aria-label
- `Footer.tsx` — h4 → h3
- `app/o-nas/page.tsx` — GSAP GPU hints
- `app/kontakt/page.tsx` — h4 → p
- `app/polityka-prywatnosci/page.tsx` — h4 → h3
- `components/sections/Impact.tsx` — **WebGL shaders** (4× custom fragment shaders na bento grid, Sesja 16), **GlassEdge upgrade do strong** (blur 16px, mask 15%) Sesja 19
- `components/sections/Hero.tsx` — AuroraBackground perf fix Sesja 19 (IO pause, 30fps throttle, DPR 1.5, visibility pause)
- `app/uslugi/design/ui-ux/page.tsx` — **MeshGradientBackground hero (Iridescent Flow) + SyncedShaderCanvas bento (4× synced) + Dramatic GlassEdge** (blur 32px) — Sesja 19
- `app/uslugi/strony-www/{one-page,profesjonalna-strona-firmowa,sklepy-internetowe,dedykowane-strony-www,aplikacje-webowe}/*Client.tsx` — Rays + bento shaders, GlassEdge strong (Sesja 18-19)
- `app/o-nas/page.tsx` — chat-CTA fix (dispatchEvent zamiast `<a href>`) Sesja 19
- `app/realizacje/page.tsx` — CTA modal wymieniony na styl /o-nas (Sparkles + chat dispatch) Sesja 19
- `app/uslugi/ServicesHub.tsx` — entry animation filter tabs Sesja 19
- `app/data/services.ts` — design + marketing hrefs naprawione Sesja 19
- `app/layout.tsx` — `<html>` bg-[#050505] (white flash fix) Sesja 19
- `CLAUDE.md` — nowa sekcja "Blog content workflow (automation)" (Sesja 14-15) + WebGL shaders table + GlassEdge 3-tier + SyncedShaderCanvas pattern + Cross-component events rozszerzone (Sesja 19)

### Pliki usunięte
- `app/api/chat/route.ts` (martwy kod)

---

## Do zrobienia (open items)

### Konfiguracja biznesowa (po rejestracji działalności)
Otwórz `lib/seo-data.ts` i podmień:
- [ ] `ADDRESS.streetAddress`, `addressLocality`, `postalCode` — gdy będzie biuro
- [ ] `COMPANY_IDS.nip` — po nadaniu (10 cyfr)
- [ ] `GOOGLE_BUSINESS.reviewsCount` + `ratingValue` — gdy będzie więcej opinii niż 2

### Bugi w danych (low priority, do uporządkowania)
- [x] ~~`app/data/services.ts` design card href — naprawione (Sesja 19, 2026-05-25): `/uslugi/design/ui-ux`~~
- [x] ~~`app/data/services.ts` marketing card href — naprawione (Sesja 19): `/uslugi/marketing/audyt-wydajnosci-seo`~~ — **ale podstrona wciąż zwraca `null`**, do wypełnienia
- [ ] `app/(pl)/uslugi/marketing/page.tsx` — wypełnij stronę kategorii albo usuń (dziś `null` + metadata `noindex`)
- [ ] `app/(pl)/uslugi/marketing/audyt-wydajnosci-seo/page.tsx` — jak wyżej
- [x] ~~`app/data/posts.ts` post #2: blockquote linkuje `/audyt`~~ — naprawione (link do `/kontakt`)
- [ ] Usunąć martwy `components/sections/Portfolio.tsx` + `lib/i18n/home/portfolio.ts` (Sesja 30)
- [x] ~~Po wyborze stylu wizualizacji Impact: usunąć pozostałe style, przełącznik i nieużywane teksty~~ - zrobione 2026-09-26 / 27 (Stos warstw + Konstelacje, odrzucone warianty usunięte)
- [ ] Zmierzyć PageSpeed (PSI) po deployu nowego hero / Realizacji / Impact
- [x] ~~`OnePageClient.tsx`: licznik 0→3 obok „3-5 dni”~~ - nieaktualne: one-page przebudowana 2026-10-02, plik usunięty; termin „Start w 3-5 dni” potwierdzony przez właściciela
- [ ] Po pracy równoległej (2026-09-29): Lighthouse / PageSpeed po wdrożeniu `e49199f5`, ESLint całego projektu, jeden przegląd strony głównej z góry na dół (przejścia, kotwice), commit do git (do decyzji właściciela), decyzja o zakończeniu pracy równoległej (PRACA-ROWNOLEGLA.md → archiwum, ostrzeżenie w CLAUDE.md)
- [ ] Opinie: link do profilu Google to długi adres wyszukiwarki z `authuser=4` - zamienić na `GOOGLE_BUSINESS.profileUrl`? Prawdziwe daty opinii (miesiąc i rok), jeśli mają być pokazane
- [ ] Stopka: adres profilu Useme (dawny link prowadził na ogólną stronę) - dopisać do `SOCIAL` w `seo-data.ts` i `SOCIALS` w `footer/shared.tsx`
- [ ] Nawigacja: przycisk „Darmowa Wycena” (EN „Free quote”) łamie zasadę jednego CTA „Bezpłatna konsultacja” i jest w Title Case (zgłaszały chaty 1 i 5, w etapie 2 także chat Kontaktu) - do decyzji właściciela
- [ ] Stopka na `/kontakt/`: przycisk „Bezpłatna konsultacja” nie przewija do formularza - `Footer.tsx` porównuje `pathname === '/kontakt'`, a przy `trailingSlash` przychodzi `/kontakt/` (poprawka: ścieżka bez końcowego `/`; sprawdzić na buildzie)
- [ ] Kontakt: prawdziwa wysyłka testowa formularza (Web3Forms) po wdrożeniu - za zgodą właściciela
- [ ] `lib/i18n/services.ts`: nieużywane pola sekcji Oferta (`headingLead`, `headingAccent`, `lead`, `seeMorePrefix`, `moreLabel`) do usunięcia
- [ ] Blog: wpisy tylko ze stycznia 2026 (3 szt.) - dodać nowe (`/new-post`); tytuły z wielką literą po dwukropku i zawyżony czas czytania w `posts.ts` - do decyzji
- [ ] **Etap 3 - po wyborach właściciela:** zamknięcie pięciu podstron usług i O nas, jedna pełna weryfikacja (zrzuty, telefon, ograniczony ruch, EN, bez JS, `tsc`, ESLint, Lighthouse), wdrożenie końcowe
- [ ] Porządki (PRACA-ROWNOLEGLA.md „Chat 0”): jeden moduł mgławicy zamiast dwóch kopii, usunięcie starych `*Client.tsx` i słowników, nieimportowanych plików chatbotów, pliku `app/(pl)/o-nas/parts.tsx.tmp.*`, martwego kodu po UI/UX, `ServiceTemplate` / `AvenlyAICta` / `ProcessAccordion`, zrzutów z `docs/podstrony/zrzuty/`
- [ ] Do decyzji właściciela: terminy realizacji na podstronach usług (firmowa, Strona interaktywna), wartość opcji formularza `Strona Szyta na Miarę` (temat maila), zmiana adresu Strony interaktywnej (z 301, po pracy równoległej), fakty Mcentrum („Nr 1”, „<1s”, technologia „CMS”), baza wiedzy chatbota w Supabase / n8n (nadal może wymieniać „Projekt UI/UX” i „stronę szytą na miarę”)
- [ ] Oferta na stronie głównej: rysunek i legenda sklepu po decyzji o płatności przez przekierowanie do operatora (Przelewy24 albo Stripe)

### Potencjalne dalsze optymalizacje wydajności (gdyby score 85 nie wystarczył)
Risk/reward słaby — score 85 mobile to top 20% w PL. Ale gdyby kiedyś:
- [ ] Hero Framer Motion → CSS keyframes (5 elementów: badge, h1 spany, p, buttons) — +3-5 pts, średni risk
- [ ] Self-host Inter font zamiast Google Fonts CDN — +1-2 pts
- [ ] Wyłączyć Lenis na mobile (native scroll) — +2-3 pts, ALE feel scrolla na telefonie się zmienia
- [ ] Inline critical CSS przez `beasties` — +2-4 pts, ale ryzyko rozwalenia build

### SEO follow-up (po uruchomieniu strony)
- [ ] Założyć Google Analytics 4 + Microsoft Clarity (heatmapy free)
- [x] ~~Regularny content na blogu (1 post/mies = duży SEO boost)~~ → **system gotowy** (`/new-post`), wystarczy regularnie używać
- [ ] FAQ na każdej podstronie usług (FAQPage schema na każdą = rich snippets)
- [ ] Backlinki z polskich katalogów (firmy.net, panoramafirm.pl)

### Blog content workflow (aktualnie aktywny)
- **Cel:** 2-4 posty miesięcznie
- **Cadence:**
  - **Co tydzień**: `/new-post [temat]` (lub `/new-post` puste = research mode)
  - **Raz w miesiącu**: `/blog-research` — odświeżenie backlog'a o trending tematy
- **Backlog**: [docs/blog-ideas.md](./docs/blog-ideas.md) — 30+ pomysłów + auto-aktualizacja
- **Style**: [docs/blog-style-guide.md](./docs/blog-style-guide.md) — 1:1 z istniejącymi 3 postami

---

## Uwagi techniczne

### Architektura
- **Static export** — brak API routes w produkcji. Wszystkie callsy do n8n i Supabase są client-side przez `NEXT_PUBLIC_*` zmienne baked in at build time.
- Supabase wymaga tabeli `chat_messages` z RLS policy `anon INSERT` oraz `chatbot_config` z `anon SELECT`.
- n8n endpoint: `https://n8n.avenly.pl/webhook/chatbot` (Nginx + Let's Encrypt na VPS, DNS Cloudflare).
- Chatbot bubble ma z-30, mobile menu ma z-40 — bubble się chowa pod menu.

### Deploy
- Zmiana treści (`app/data/*.ts`, słowniki `lib/i18n/`) — wymaga rebuildu i `npm run deploy` (Cloudflare Pages)
- Zmiana konfiguracji chatbota (welcome, quick replies w Supabase `chatbot_config`) — **NIE wymaga rebuildu**
- Purge cache po deployu NIE jest potrzebny (HTML `max-age=0`, chunki z hashem); wyjątek: podmiana obrazu w `public/portfolio/` pod tą samą nazwą
- Wrangler: logowanie Avenly (kontakt@avenly.pl) leży w osobnym profilu `C:\Users\Start\.wrangler-avenly` - wdrażać z `XDG_CONFIG_HOME=C:/Users/Start/.wrangler-avenly` (samo `npm run deploy` użyje globalnego logowania RKS i dostanie błąd autoryzacji); polecenia: CLAUDE.md „Deploy flow”

### Co działa "out of the box" i nie wymaga uwagi
- Robots.txt + sitemap.xml — generowane przy build
- Schema.org JSON-LD — automatycznie wstrzykiwane na każdej podstronie
- OG image — fallback dla całej strony, custom dla blog posts i case studies
- Favicon set — wszystkie rozmiary + manifest
- Cache i nagłówki bezpieczeństwa — `public/_headers` (Cloudflare Pages)
- HTTPS, Brotli, trailing slash, `/404.html` — Cloudflare Pages sam
