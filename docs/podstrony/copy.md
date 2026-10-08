# Copywriting podstron - notatki chatu 6 (praca równoległa, etap 3)

> **Od koordynatora, 2026-10-07:** zasady z sekcji „Do dokumentacji głównej” są w `PRODUCT.md` (Copy Voice 1 i 7-12, „Co obiecujemy w ofercie” pkt 3) i w `CLAUDE.md` (Open Graph w całości, opisy podstron w rozdziałach „Katalog usług” i „Podstrona Realizacje”). Lista „Dla koordynatora” po usunięciu UI/UX: dokumentacja poprawiona (drzewo tras, mapa slugów, tabela shaderów, `GlassEdge`, liczba podstron w `ServicePageSchema`, wiersz chatu 12 w planie); **martwy kod i baza wiedzy chatbota nadal czekają** (zadanie „porządki” i decyzja właściciela). 2026-10-06: usługa „Strona szyta na miarę” nazywa się „Strona interaktywna” - w tabelach niżej zostaje stara nazwa (historia). Otwarte: ocena opisów kafli Chatboty AI i Audyt, fakty Mcentrum, zdanie „Tu decydujesz, co wtedy zobaczy.”.

Zakres: teksty podstron Usługi (katalog i kategorie) → Realizacje → Kontakt, PL i EN. Tylko teksty - układ, style i animacje bez zmian.

## Stan
- **2026-10-01: „Projekt UI/UX” usunięty jako osobna usługa** (decyzja właściciela, wykonane - sekcja niżej; lista rzeczy dla koordynatora tamże).
- **Wznowione 2026-10-01** (właściciel: „zajmijmy się opisami pod bloczkami strona one-page, strona firmowa i po kolei na wszystkie, bo są słabe”) - opisy kafli usług w katalogu: one-page zaakceptowany („one page spoko”), UI/UX odpadł razem z usługą, **Chatboty AI i Audyt wdrożone, czekają na ocenę właściciela**; firmowa, na miarę, sklep i CRM zostają po staremu. Sekcja „Kafle usług w katalogu” niżej.
- **✅ ZAMKNIĘTE 2026-10-01** (poprzedni zakres) - wszystkie trzy podstrony wdrożone (PL i EN), ostatni wybór właściciela: opis Realizacji („git, teraz mi się podoba”). Przełączników i propozycji w kodzie nie ma (teksty wybierane w rozmowie). Do koordynatora: sekcje „Do dokumentacji głównej” i „Propozycje dla zamrożonych części”. Otwarte drobiazgi bez odpowiedzi właściciela (zostawione bez zmian): fakty Mcentrum („1. miejsce już po miesiącu”, „Nr 1”, „<1s”, technologia „CMS”) oraz zdanie „Tu decydujesz, co wtedy zobaczy.” na `/uslugi`.
- 2026-10-01: **Usługi - wszystkie wybory zapadły i są wdrożone (PL i EN):** opisy trzech stron, box „Nie wiesz, co wybrać?”, „reszta” z rundy 1, metadane (sekcja „Usługi - wdrożone” niżej). Do potwierdzenia przez właściciela jedno pytanie: czy „Tu decydujesz, co wtedy zobaczy.” na `/uslugi` zostaje (po jego uwadze „to my to tworzymy”).
- 2026-10-01: **Realizacje - wdrożone:** skróty RKS i Mcentrum, drobne poprawki, metadane, opis pod „Dowód, nie obietnice.” = „Te strony pracują dziś dla prawdziwych firm. Zobacz, co widzą ich klienci.” (**zaakceptowane 2026-10-01: „git, teraz mi się podoba”** - trzecie podejście po odrzuceniu 20 wersji i wersji „z pazurem”). Fakty Mcentrum („1. miejsce już po miesiącu”, „Nr 1”, „<1s”, „CMS”) zostają bez zmian - właściciel: „tylko to trzeba zmienić”.
- 2026-10-01: **Kontakt - przegląd zrobiony, tekstów nie zmieniam** (chat 4 przepisał je w głosie korzyści, są spójne z resztą: „Zacznijmy.”, „Napisz, czego potrzebujesz. W ciągu 24 godzin dostaniesz konkretną odpowiedź, wycenę i termin.”, „Opowiedz o projekcie”). Jedyna zmiana: obrazek i pełny blok Open Graph / Twitter w `app/(pl)/kontakt/layout.tsx` i `app/(en)/en/contact/layout.tsx` (ten sam błąd co w Usługach i Realizacjach). Wartości opcji listy usług bez zmian.

## Decyzje właściciela (cytaty + data)
- 2026-10-01 (plan etapu 3): „blog wywal z tej pracy, bo tam copywriting git” - blog poza zakresem.
- 2026-10-01, po rundzie 1 Usług: „daj bardziej ogólne teksty, a nie że potrzebuje ktoś tego, a potem tego, a potem tego, wiesz o co chodzi, nienaturalne są te teksty” - **bez „drabinki potrzeb”** („wybierasz to, czego potrzebujesz dziś, resztę dokładasz później”, „dziś jedna strona, jutro sklep i system”) i bez wyliczania usług po kolei. Zdania ogólne, krótkie, takie, jakie człowiek naprawdę by powiedział. Obowiązuje też przy Realizacjach i Kontakcie. **Do PRODUCT.md.**
- 2026-10-01, po rundzie 2 Usług: „chujowe te teksty jakieś, mają być najlepszy copywriting możliwy i mówimy o kliencie, wartości dla klienta, mniej o nas i cheap marketingu” - odrzucone m.in. „Strony, które się pamięta. Sklepy, które sprzedają.” (hasło reklamowe), „Zaprojektowane i zbudowane przez jeden zespół” (o nas), „Szybka, dopracowana…” (przymiotniki o produkcie), „Dobra strona nie tylko wygląda…” (frazes). **Zasada: zdanie mówi o kliencie i o tym, co zyskuje - konkretna sytuacja z jego firmy, a nie pochwała produktu ani agencji.** Obowiązuje też przy Realizacjach i Kontakcie. **Do PRODUCT.md.**

- 2026-10-01, po rundzie 3 Usług: „1C 2A 3 - nic mi nie pasuje 4.A - co ma sens, ile kosztuje i na kiedy. tą część zmień” → `/uslugi` = „Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.”; `/uslugi/strony-www` = „Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.”; box = „Znasz swoją firmę i to wystarczy. Powiedz, co chcesz osiągnąć, a …” z inną końcówką; trzy warianty opisu `/uslugi/design` odrzucone („Trudno opisać stronę słowami…”, „Nic nie powstaje, dopóki nie powiesz…”, „Nie kupujesz kota w worku…”). **Wniosek o guście: trafiają zdania-spostrzeżenia o zachowaniu klienta („Klient …, zanim …”) i stawka dla właściciela w drugim zdaniu; nie trafiają zdania o procesie i o tym, jak przebiega współpraca.**

- 2026-10-01, opis `/uslugi/design`: „A: Klient najpierw patrzy, dopiero potem czyta. Na projekcie ustalasz, co zobaczy jako pierwsze. - te wszystkie zdania wprowadzają w błąd, bo: to my to tworzymy, a nie klient ustala, wiesz o co chodzi” → pierwsze zdanie zostaje, drugie mówi prawdę o podziale ról: „Dlatego zaczynamy od tego, co zobaczy.” **Zasada: klient nie „ustala / decyduje / projektuje” rzeczy, które tworzy Avenly. Gdy mowa o tym, co robi agencja, piszemy wprost „my” („zaczynamy”, „dopasujemy”); klient opowiada, widzi, akceptuje, dostaje.** Obowiązuje też przy Realizacjach i Kontakcie. **Do PRODUCT.md** (doprecyzowanie Copy Voice 1: głos korzyści nie może przypisywać klientowi pracy agencji).

## Kafle usług w katalogu - WDROŻONE 2026-10-01
Wybór właściciela: „strona firmowa, szyta na miarę i sklep internetowy i system CRM zostaje, resztę pozmieniaj” → zmienione 4 kafle (PL i EN), 4 zostają przy chwycie z Oferty:
- Strona one-page: „Wszystko, co klient chce wiedzieć przed kontaktem, mieści się na jednej stronie.” / „Everything a client wants to know before getting in touch fits on one page.”
- Projekt UI/UX: „Wygląd strony akceptujesz, zanim zaczniemy ją budować.” / „You approve how the site looks before we start building it.”
- Chatboty AI: „Asystent zna Twoją ofertę i odpisuje od razu, więc klient nie czeka do rana.” / „The assistant knows your offer and replies right away, so clients don't wait until morning.”
- Audyt wydajności i SEO: „Dowiadujesz się, co spowalnia Twoją stronę i co przeszkadza jej w Google.” / „You find out what slows your site down and what holds it back in Google.”

**Tylko kafle katalogu** (`/uslugi`, `/uslugi/strony-www` + EN). Oferta na stronie głównej i szeroka karta na `/uslugi/design` bez zmian (właściciel nie odpowiedział na pytanie o stronę główną - przyjęte domyślnie). Jak: nowe pole `tiles` w `catalogDict` (`lib/i18n/uslugi/kategorie.ts`, klucz = `href` usługi), w `_katalog/model.ts` pole `tile` (`t.tiles[href] ?? hook`), w `_katalog/art-card.tsx` kafel wyświetla `it.tile` zamiast `it.hook` - **dwie drobne zmiany w kodzie zamkniętego katalogu, konieczne, żeby zmienić tekst kafla bez ruszania strony głównej**. Sprawdzone: cała siatka 1440 (PL i EN) i 390 przy ograniczonym ruchu - każdy opis ma najwyżej 2 linie, wysokości rzędów bez zmian; `/uslugi/design` pokazuje dalej tekst Oferty; ESLint i `tsc` czysto.

### „Projekt UI/UX” USUNIĘTY jako osobna usługa - wykonane 2026-10-01
Decyzja właściciela: „więc usuwamy projekt UI/UX jako osobna usługa oficjalnie, zrób to i wracamy do tekstów”. Zrobił chat 6 na wyraźne polecenie właściciela (zmiany także w częściach zamrożonych).

Co zmienione:
- **Podstrony usunięte z `app/`, zarchiwizowane** (pliki nie były w gicie, więc zamiast kasować - przeniesione jako `.txt`): `docs/archiwum/usluga-ui-ux/` = `/uslugi/design` (page), `/uslugi/design/ui-ux` (page, layout, `UiUxClient.tsx` z shaderami), odpowiedniki EN i słownik `lib/i18n/uslugi/ui-ux.ts`. Przywrócenie = przeniesienie z powrotem i zmiana rozszerzeń.
- `app/data/services.ts`: kategoria `design` usunięta (+ import `Palette`); `lib/i18n/services.ts`: `EN_CATEGORY.design`, `EN_CARD` UI/UX, `categories.design` i `items['/uslugi/design/ui-ux']` (PL i EN) - Oferta na stronie głównej ma teraz 7 pozycji w 3 kategoriach.
- `lib/i18n/home/hero.ts`: węzeł 03 konstelacji „Design UI/UX” → **„Strony na miarę”** (`/uslugi/strony-www/strona-szyta-na-miare`; EN „Custom websites”) - konstelacja musi mieć 6 węzłów; wybór chatu, do potwierdzenia przez właściciela.
- `lib/i18n/footer.ts`: link „Projekt UI/UX” usunięty (6 usług + „Wszystkie usługi”).
- `lib/i18n/kontakt.ts`: kategoria „Design i UI/UX” z opcją „Projekt UI/UX” usunięta z listy usług (PL i EN); pozostałe wartości opcji bez zmian.
- `app/sitemap.ts`: bez `/uslugi/design` i `/uslugi/design/ui-ux`.
- `public/_redirects`: 301 z `/uslugi/design`, `/uslugi/design/ui-ux`, `/en/services/design`, `/en/services/design/ui-ux` (z i bez końcowego `/`) na `/uslugi/strony-www/` i `/en/services/websites/`; stare `/en/uslugi/design*` kierują teraz prosto na `/en/services/websites/` (bez łańcucha).
- Katalog: `lib/i18n/uslugi/kategorie.ts` (bez `pages.design`, `singlePairs` i opisu kafla UI/UX; `CatalogScope` = `hub` | `www`), `_katalog/model.ts` (bez zakresu `design`, `pairs`, wpisu `LOOK`), `_katalog/Catalog.tsx` (bez gałęzi strony z jedną usługą), `_katalog/sky.tsx` (bez barwy UI/UX). Siatka `/uslugi` = 7 usług + box = 8 kart, w ostatnim rzędzie 2 karty (jedno puste miejsce).

Sprawdzone: `/`, `/uslugi/`, `/uslugi/strony-www/`, `/en/services/`, `/kontakt/`, `/sitemap.xml` = 200; `/uslugi/design/`, `/uslugi/design/ui-ux/`, `/en/services/design/` = 404 w dev (przekierowania działają dopiero na Cloudflare Pages); zrzuty: hero 1440 i 390 (6 węzłów, „Strony na miarę”), Oferta 1440 i 390 (01-07), katalog 1440 (filtr: Wszystkie / Strony WWW / Automatyzacja AI / Marketing i sprzedaż), stopka, lista usług w formularzu. ESLint czysto (zostały 3 stare ostrzeżenia o nieużywanych ikonach w `services.ts`). `tsc`: jedyne błędy w wygenerowanym `.next/types/validator.ts` z poprzedniego builda (odwołania do usuniętych tras) - znikną przy następnym `npm run build`.

**Dla koordynatora (nie zrobione - zamrożone / poza zakresem):**
- `PRACA-ROWNOLEGLA.md`: wiersz chatu 12 („UI/UX”) i wiersz „Projekt UI/UX” w tabeli „Hierarchia podstron usług” są nieaktualne - zadanie odpada; liczba podstron usług do przebudowy 7 → 6.
- `CLAUDE.md` / `project_context.md` / `PRODUCT.md`: drzewo tras, mapa slugów i18n, tabela shaderów (wiersz `MeshGradientBackground` UI/UX), `GlassEdge` Dramatic (UI/UX), „Co obiecujemy w ofercie” pkt 3, liczba podstron w `ServicePageSchema`.
- Martwy kod po usunięciu (nieszkodliwy): `LOOK['/uslugi/design/ui-ux']` i `ArtId 'uiux'` w `components/sections/services/shared.tsx`, rysunek `uiux` w `drawings.tsx`, `CATEGORY_HREF.design` w `Services.tsx`, wygląd `big` / `wide` i legenda w `_katalog/art-card.tsx` + style `.us-art--wide`, `.us-pairs*` w `uslugi.css`, motyw limonkowy UI/UX w `Navbar.tsx` / `lib/service-theme.ts`, słowa kluczowe „UI/UX design” w root layoutach.
- Poza repo: baza wiedzy i szybkie odpowiedzi chatbota (Supabase `chatbot_config`, prompt w n8n) mogą dalej wymieniać „Projekt UI/UX” jako usługę - do sprawdzenia przez właściciela.
- Chaty fali 2 (strony WWW): projekt do akceptacji przed budową pokazywać jako element każdej usługi stron („Wygląd strony akceptujesz, zanim zaczniemy ją budować.”).

### (archiwalne) Pytanie właściciela, czy „Projekt UI/UX” zostaje jako osobna usługa (2026-10-01)
Właściciel: „one page spoko, projekt UI/UX - mam taki problem, że to jest jakby usługa, ale jest uwzględniona w każdą i nie wiem, czy nie lepiej ją usunąć w ogóle”. Rekomendacja chatu 6: usunąć jako osobną usługę, a projekt do akceptacji przed budową pokazywać jako element każdej usługi stron WWW (i etap Procesu). Nic nie zmienione - czeka na decyzję. Gdy zapadnie „usuwamy”, to zadanie dla koordynatora, bo dotyka zamrożonych części: konstelacja hero (`lib/i18n/home/hero.ts`), Oferta na stronie głównej (`lib/i18n/services.ts`, `components/sections/Services.tsx`, `services/shared.tsx`, rysunek `uiux`), stopka (`lib/i18n/footer.ts`), `app/data/services.ts` (kategoria `design`), lista usług w formularzu kontaktu (`lib/i18n/kontakt.ts`, opcja „Projekt UI/UX”), `app/sitemap.ts`, katalog (`_katalog/model.ts`, filtr „Design i UI/UX”, strona `/uslugi/design`), podstrony `/uslugi/design` i `/uslugi/design/ui-ux` + EN (przekierowania 301 w `public/_redirects`), mapa slugów w `lib/i18n/locale.ts`, zadanie chatu 12 w `PRACA-ROWNOLEGLA.md` (przebudowa podstrony UI/UX odpada).

### Tabela z propozycjami (runda 1)

Dziś kafel pokazuje pierwsze zdanie `line` z Oferty na stronie głównej (`servicesSectionDict.items`), wyrwane z kontekstu („Jedna strona, jeden cel.” bez drugiego zdania). **Założenie do potwierdzenia przez właściciela:** nowe opisy dotyczą TYLKO kafli katalogu (`/uslugi`, `/uslugi/strony-www`), Oferta na stronie głównej zostaje bez zmian. Technicznie: nowe pole w `catalogDict` (mój słownik) + jedna linia w `_katalog/model.ts`, żeby kafel brał opis z katalogu; szeroka karta na `/uslugi/design` zostaje przy tekście Oferty. Limit: 2 linie na komputerze (do ok. 95 znaków). Opis nie może powtarzać podpisów kroków pod rysunkiem na tym samym kaflu.

| Usługa | Było | Propozycja |
|---|---|---|
| Strona one-page | „Jedna strona, jeden cel.” | „Wszystko, co klient chce wiedzieć przed kontaktem, mieści się na jednej stronie.” |
| Strona firmowa | „Twoja firma wygląda w sieci tak solidnie, jak pracuje na co dzień.” | „Klient szuka konkretnej usługi, a nie ogólnej strony o firmie. Tu każda ma swoje miejsce.” |
| Strona szyta na miarę | „To już nie tylko strona, to uczucie.” | zostaje (zdanie właściciela) |
| Sklep internetowy | „Sklep, który sprzedaje także wtedy, gdy Ty odpoczywasz.” | „Klient kupuje o każdej porze, bez pisania i dzwonienia. Ty widzisz zamówienia w jednym panelu.” |
| System CRM i automatyzacje AI | „Koniec z arkuszami i karteczkami.” | „Całą firmę masz w jednym miejscu, zamiast w arkuszach, mailach i w głowie.” |
| Projekt UI/UX | „Zanim ruszy kod, widzisz projekt swojej strony lub sklepu.” | „Wygląd strony akceptujesz, zanim zaczniemy ją budować.” |
| Chatboty AI | „Twój najlepszy sprzedawca pracuje także w nocy.” | „Asystent zna Twoją ofertę i odpisuje od razu, więc klient nie czeka do rana.” |
| Audyt wydajności i SEO | „Szybki przegląd Twojej obecnej strony.” | „Dowiadujesz się, co spowalnia Twoją stronę i co przeszkadza jej w Google.” |

## Usługi - wdrożone 2026-10-01

| Miejsce | Było | Jest (PL) | Jest (EN) |
|---|---|---|---|
| `/uslugi/design` - opis | „Układ, kolory i wersję na telefon akceptujesz na starcie. Klikasz projekt jak gotową stronę, więc później nic Cię nie zaskoczy.” (to samo zdanie stało w karcie pod spodem) | „Klient najpierw patrzy, dopiero potem czyta. Dlatego zaczynamy od tego, co zobaczy.” | „Clients look first and read second. So we start with what they'll see.” |
| `/uslugi` - opis | „Strona, sklep, system dla firmy albo asystent AI. Wszystko powstaje w jednym zespole, więc do siebie pasuje.” | „Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.” | „Clients judge your business before they get in touch. Here you decide what they see.” |
| `/uslugi/strony-www` - opis | „Od jednej strony, która zbiera zapytania, przez stronę firmową i sklep, po system, w którym widzisz całą firmę. Zaczynasz od tego, czego potrzebujesz dziś.” | „Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.” | „Clients look you up online before they call. Your website decides whether they do.” |
| box - zdanie | „Opowiadasz o swojej firmie i celu, a na bezpłatnej konsultacji dostajesz propozycję, która ma sens.” | „Znasz swoją firmę i to wystarczy. Opowiedz nam o niej, a dopasujemy najlepsze rozwiązanie dla Twojego biznesu.” (druga część = zdanie właściciela) | „You know your business, and that's enough. Tell us about it and we'll find the best fit for your business.” |
| box - podpis kroku 2 | „Dobieramy usługi do celu, nie odwrotnie.” | „Usługi dobrane do Twojego celu.” | „Services matched to your goal.” (krok 1: „You describe your business and your goal.”) |
| box - dopisek | „Bez zobowiązań, odpowiedź w 24 h.” | ten sam tekst z twardymi spacjami | „No strings attached. A reply within 24 hours.” |
| `/uslugi/design` - nagłówek listy | „Projekt przygotujesz dla” | „Do czego przyda Ci się projekt” | „Start with a design for” |
| nagłówek siatki (czytniki) | „Każda usługa w działaniu.” | bez kropki | „Every service in action” |
| `/en/services/design` - h1 | „See your site before it is built” | - | „See your site before it's built” |
| opis w Google `/uslugi` | 196 zn., wyliczanka | „Strony WWW, sklepy internetowe, systemy CRM i chatboty AI. Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.” | „Websites, online stores, CRM systems and AI chatbots. Clients judge your business before they get in touch. Here you decide what they see.” |
| opis w Google `/uslugi/strony-www` | 172 zn. | „Strona one-page, firmowa, szyta na miarę, sklep internetowy i system CRM. Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.” | „One page, company and custom built websites, online stores and CRM systems. Clients look you up online before they call. Your website decides whether they do.” |
| Open Graph / Twitter, 6 stron | tylko tytuł i opis (bez obrazka, adresu, typu), ogólna karta Twittera | pełny blok: `type`, `locale`, `siteName`, `url`, obrazek `/og-default.png`, własna karta Twittera; tytuł = h1 + nazwa („Od strony po system - usługi Avenly”) | jw. („From a website to a system - Avenly services”) |

Uwaga: opisy `/uslugi` i `/uslugi/strony-www` mówią prawie to samo („Klient ocenia…, zanim się odezwie” / „Klient sprawdza…, zanim zadzwoni”) - wybór właściciela; zgłoszone mu jako rzecz do ewentualnego rozróżnienia.

## Realizacje - wdrożone 2026-10-01

Wybór właściciela po rundzie 1: „1. tutaj daj 20 innych wersji tego tekstu 2. rks git, grawerstwo stare zostaw, mcentrum git”.

| Miejsce | Było | Jest (PL) | Jest (EN) |
|---|---|---|---|
| skrót RKS | „Strona z terminarzem i zapisami do akademii oraz aplikacja, w której klub prowadzi składki, treningi i obecności.” | „Kibic sprawdza terminarz, rodzic zapisuje dziecko do akademii, a klub prowadzi składki, treningi i obecności w jednej aplikacji.” | „Fans check the fixtures, parents sign their kids up for the academy, and the club runs fees, training and attendance in one app.” |
| skrót Mcentrum | „Start nowej marki gabinetu fizjoterapii. Szybka strona zbudowana pod lokalne wyszukiwanie, z rezerwacją wizyt przez Booksy.” | „Nowy gabinet, którego w okolicy nikt jeszcze nie znał. Strona zbudowana pod lokalne wyszukiwanie, z wizytą umawianą przez Booksy.” | „A new clinic nobody in the area knew yet. A website built for local search, with appointments booked through Booksy.” |
| skrót Kardyś | bez zmian (decyzja właściciela) | - | - |
| Kardyś, punkt wyjścia (`app/data/projects.ts`, `EN_PROJECT`) | „…pozwoli zamawiać online produkty z grawerem…” | „…pozwoli zamawiać produkty online…” | „…lets customers order products online…” |
| linia dowodów, karta „następna” | „odpowiedź w 24 h”, „W ciągu 24 godzin” | twarde spacje | - |
| Mcentrum, technologia | „CloudFlare” | „Cloudflare” | jw. |
| opis w Google `/realizacje` | 180 zn. | „Strony WWW, sklep internetowy z panelem, aplikacja klubowa i asystent AI. Prawdziwe strony prawdziwych firm, które możesz otworzyć i sprawdzić.” | „Websites, an online store with a management panel, a club app and an AI assistant. Real websites of real businesses that you can open and check.” |
| Open Graph / Twitter listy | bez obrazka | obrazek `/og-default.png`, `locale`, `siteName` | jw. |
| tytuł case study w Google | „Klub Sportowy - Case study” (pole `title`) | „Klub Sportowy RKS - case study”, „Mcentrumfizjoterapia - case study”, „Grawerstwo Józef Kardyś - case study” (nazwa wyświetlana z `workByLocale`) | jw. |

**Czeka na właściciela:** opis pod „Dowód, nie obietnice.” (20 wersji niżej; na stronie stoi stary tekst z „sam”), fakty Mcentrum („1. miejsce już po miesiącu”, „Nr 1”, „<1s”, technologia „CMS”) - bez odpowiedzi, zostawione bez zmian.

### Karta „Twoja firma może być następna.” - zdanie pod tytułem (2026-10-01, po zamknięciu; ZAAKCEPTOWANE: „to fajne, wprowadź”)
Właściciel: „Opowiedz, czego potrzebujesz. W ciągu 24 godzin dostaniesz konkretną odpowiedź. - ten element w realizacjach bym jeszcze zmienił”. Wdrożone:
- PL: „Opowiedz nam o niej, a zadbamy o to, co zobaczą Twoi klienci.” („o niej” = o firmie z tytułu; domyka opis nagłówka „Zobacz, co widzą ich klienci.”)
- EN: „Tell us about it and we'll take care of what your customers see.”
- Zapasowe: „W tym kadrze może być Twoja strona. Opowiedz nam o swojej firmie.” / „Opowiedz nam o niej. Odpowiemy w ciągu 24 godzin.”
- Sprawdzone: 1440 × 900 i 390 × 844 - 2 linie, karta bez zmian układu; ESLint czysto.

### Opis pod „Dowód, nie obietnice.” - WYBRANE 2026-10-01 („git, teraz mi się podoba”)
Wersja „z pazurem” („Każdy mówi, że robi świetne strony. My dajemy linki.” i zapasowe „Gadać umie każdy…”, „Obietnice zostawiamy innym…”) ODRZUCONA 2026-10-01: „jakieś też chujowe cheap gadanie”. **Wniosek: „fajny” NIE znaczy zaczepny ani chwalący się na tle konkurencji - przechwałki i docinki to dla właściciela „cheap gadanie”. Trafiają spokojne zdania o faktach i o kliencie, jak zaakceptowane opisy Usług.**
- PL (na stronie): „Te strony pracują dziś dla prawdziwych firm. Zobacz, co widzą ich klienci.” (drugie zdanie spięte twardymi spacjami - zawsze w jednej linii)
- EN: „These websites work for real businesses today. See what their customers see.”
- Sprawdzone: 1440 × 900 (zdanie pod zdaniem), 390 × 844 i 360 × 740 (2 linie, strzałka przewijania nadal na pierwszym ekranie).

### Opis pod „Dowód, nie obietnice.” - wersja 1 (odrzucona)
Właściciel po 20 wersjach: „Prawdziwe strony prawdziwych firm. Każdą możesz otworzyć i sprawdzić sam. - tylko to trzeba zmienić, weź daj jakiś fajny tekst” (20 wersji uznał za miękkie). **Wniosek: „fajny” = krótki, z pazurem i pewnością siebie, jak „Dowód, nie obietnice.” i „Nie wierz nam na słowo. Uwierz klientom.”; nie grzeczne objaśnienie.**
- PL: „Każdy mówi, że robi świetne strony. My dajemy linki.” (twarde spacje w „My dajemy linki” - drugie zdanie zawsze w całości w jednej linii)
- EN: „Everyone says they build great websites. We give you the links.”
- Zapasowe w tym samym tonie: „Nie opowiadamy, jak będzie. Pokazujemy, jak jest.” / „Gadać umie każdy. Tu wszystko możesz otworzyć i sprawdzić.” / „Obietnice zostawiamy innym. Tu są strony, które działają.” / „Tu nic nie jest na niby. Kliknij i sprawdź.”

### Opis pod „Dowód, nie obietnice.” - 20 wersji (odrzucone 2026-10-01)
1. Nie zdjęcia stron, tylko strony. Przewiń je, kliknij, sprawdź.
2. Sprawdzasz firmę, zanim jej zaufasz. Słusznie. Tu masz strony, które możesz otworzyć.
3. Słowa nic nie kosztują. Dlatego zamiast nich są tu strony, które możesz otworzyć.
4. Obiecać może każdy. Te strony możesz otworzyć i sprawdzić, jak działają.
5. Nie musisz wierzyć na słowo. Każdą z tych stron możesz otworzyć i sprawdzić.
6. Żadnych makiet na pokaz. Te strony działają dziś u prawdziwych firm.
7. Każda z tych stron jest dziś w sieci i pracuje dla prawdziwej firmy. Otwórz i sprawdź.
8. Zamiast opowiadać, pokazujemy. Te strony są w sieci i każdą możesz otworzyć.
9. Twój klient też sprawdzi, zanim zaufa. Zrób to samo: otwórz te strony i zobacz, jak działają.
10. Klient wierzy temu, co widzi. Ty też możesz zobaczyć: te strony działają dziś w sieci.
11. Dobrą stronę poznaje się po tym, jak działa u klienta. Te działają i każdą możesz otworzyć.
12. Klub, pracownia grawerska, gabinet fizjoterapii. Różne firmy, ten sam cel: żeby klient się odezwał.
13. Firmy takie jak Twoja, z prawdziwymi klientami. Zobacz, co dziś u nich działa.
14. Trzy firmy, trzy różne potrzeby. Przy każdej zobaczysz, od czego zaczynała i co dziś dla niej działa.
15. Zobacz, od czego zaczynały te firmy i co dziś działa u nich w sieci.
16. Strony, które już pracują. Otwórz dowolną i sprawdź.
17. Wszystko, co tu widzisz, działa dziś w sieci. Otwórz i sprawdź.
18. To nie portfolio do oglądania. To strony, które możesz otworzyć i przeklikać.
19. Najlepszą rekomendacją strony jest sama strona. Otwórz każdą i oceń.
20. Oceń po efektach. Każda z tych stron jest w sieci i możesz ją otworzyć.

## Realizacje - spis tekstów i runda 1 (2026-10-01)

Skąd teksty: `lib/i18n/projects.ts` (`realizacjeDict` = napisy listy i case study, `workByLocale` = rodzaj, skrót na kartę i zakres, `EN_PROJECT`), `app/data/projects.ts` (opis, punkt wyjścia, rozwiązanie, liczby, technologie - wspólne ze stroną główną i sitemapą; tylko teksty, narzędziem Edit), metadane w `app/(pl)/realizacje/layout.tsx`, `[slug]/page.tsx` i `app/(en)/en/work/*`.

Ocena:
1. **Opis pod „Dowód, nie obietnice.”**: „Prawdziwe strony prawdziwych firm. Każdą możesz otworzyć i sprawdzić sam.” - „sam” zakłada mężczyznę (właścicielka firmy przeczyta „sam”); pierwsze zdanie jest blisko hasła.
2. **Skróty na kartach** (RKS, Kardyś, Mcentrum) to wyliczanki funkcji bez człowieka: „Strona z terminarzem i zapisami… oraz aplikacja, w której…”. Asystent AI ma dobry chwyt („Działa na tej stronie, w prawym dolnym rogu.”) - zostaje.
3. **Case study Kardyś, punkt wyjścia**: „zamawiać online produkty z grawerem” może sugerować grawer na zamówienie (właściciel: sklep NIE ma personalizacji graweru).
4. **Case study Mcentrum**: „już po miesiącu zajęła 1. miejsce w lokalnych wynikach wyszukiwania”, liczby „Nr 1” i „<1s”, technologia „CMS”, pisownia „CloudFlare” - do potwierdzenia przez właściciela (plan etapu 3).
5. **Typografia**: „odpowiedź w 24 h”, „W ciągu 24 godzin” bez twardych spacji; liczba „<1s” bez spacji.
6. **Metadane listy**: opis 180 znaków; Open Graph bez obrazka (ten sam błąd co w Usługach); tytuł case study RKS = „Klub Sportowy - Case study” (bez „RKS”, bo bierze pole `title`).
7. Martwe pole: `lead` (długi opis nagłówka) - nagłówek pokazuje tylko `leadShort`.
8. Bez zastrzeżeń: h1, przyciski, filtr, „Punkt wyjścia” / „Rozwiązanie”, „Twoja firma może być następna.”, „Chcesz podobny efekt w swojej firmie?”, opisy i rozwiązania case studies (fakty, głos klienta: „Klub dostał…”, „Pracownia dostała…”).

### Zdania kluczowe
**1. Opis pod „Dowód, nie obietnice.”**
- było: „Prawdziwe strony prawdziwych firm. Każdą możesz otworzyć i sprawdzić sam.”
- **A (polecam):** „Obiecać może każdy. Te strony możesz otworzyć i sprawdzić, jak działają.”
  - EN: „Anyone can promise. These sites you can open and see how they work.”
- **B (najmniejsza zmiana):** „Prawdziwe strony prawdziwych firm. Każdą możesz otworzyć i sprawdzić.”
  - EN: „Real websites of real businesses. Open any of them and check.”

**2. Skróty na kartach** (jedna propozycja na realizację; fakty bez zmian)
| Realizacja | Było | Jest (PL) | Jest (EN) |
|---|---|---|---|
| Klub Sportowy RKS | „Strona z terminarzem i zapisami do akademii oraz aplikacja, w której klub prowadzi składki, treningi i obecności.” | „Kibic sprawdza terminarz, rodzic zapisuje dziecko do akademii, a klub prowadzi składki, treningi i obecności w jednej aplikacji.” | „Fans check the fixtures, parents sign their kids up for the academy, and the club runs fees, training and attendance in one app.” |
| Grawerstwo Józef Kardyś | „Zamiast przestarzałej strony i sklepu bez zamówień: nowa strona, sklep z płatnościami online i jeden panel do zarządzania.” | „Sklep pracowni od dawna nie przynosił zamówień. Dziś ma nową stronę, sklep z płatnościami online i jeden panel do wszystkiego.” | „The workshop's store had not brought in orders for a long time. Today it has a new website, a store with online payments and one panel for everything.” |
| Mcentrumfizjoterapia | „Start nowej marki gabinetu fizjoterapii. Szybka strona zbudowana pod lokalne wyszukiwanie, z rezerwacją wizyt przez Booksy.” | „Nowy gabinet, którego w okolicy nikt jeszcze nie znał. Strona zbudowana pod lokalne wyszukiwanie, z wizytą umawianą przez Booksy.” | „A new clinic nobody in the area knew yet. A website built for local search, with appointments booked through Booksy.” |
| Wirtualny Asystent AI | bez zmian | - | - |

### Reszta (jedna propozycja)
| Miejsce | Było | Jest |
|---|---|---|
| Kardyś, punkt wyjścia | „…pozwoli zamawiać online produkty z grawerem…” | „…pozwoli zamawiać produkty online…” (EN „…lets customers order products online…”) |
| linia dowodów, karta „następna” | „odpowiedź w 24 h”, „W ciągu 24 godzin” | te same teksty z twardymi spacjami |
| Mcentrum, liczba | „<1s” | „< 1 s” (jeśli właściciel potwierdzi liczbę) |
| Mcentrum, technologia | „CloudFlare” | „Cloudflare” |
| opis w Google `/realizacje` | 180 zn. | „Strony WWW, sklep internetowy z panelem, aplikacja klubowa i asystent AI. Obiecać może każdy, a te strony możesz otworzyć i sprawdzić, jak działają.” (wg wybranego opisu) |
| Open Graph / Twitter listy (PL i EN) | bez obrazka | pełny blok z obrazkiem, jak w Usługach |
| tytuł case study w Google | „Klub Sportowy - Case study” | „Klub Sportowy RKS - case study” (nazwa wyświetlana zamiast pola `title`; „case study” małą literą) |

### Do właściciela (fakty)
- Mcentrum: czy zostają „1. miejsce w lokalnych wynikach wyszukiwania już po miesiącu”, „Nr 1” i „< 1 s”?
- Mcentrum: technologia „CMS” (strona stoi na WordPressie?) - zostawić, nazwać wprost czy usunąć?

## Usługi - runda 4: opis `/uslugi/design` (zamknięta: wybrane pierwsze zdanie A, drugie przepisane - patrz „Decyzje właściciela”)

Pod „Zobacz stronę, zanim powstanie.” Karta pod spodem mówi już, że projekt akceptujesz przed kodem, więc opis ma dać spostrzeżenie o kliencie (jak 1C i 2A), nie opis procesu.
- **A (polecam):** „Klient najpierw patrzy, dopiero potem czyta. Na projekcie ustalasz, co zobaczy jako pierwsze.”
  - EN: „Clients look first and read second. The design is where you decide what they see first.”
- **B:** „Klient nie powie Ci, że się zgubił. Po prostu wyjdzie. Na projekcie przechodzisz jego drogę przed nim.”
  - EN: „A client won't tell you they got lost. They just leave. In the design you walk their path before they do.”
- **C:** „Klient w kilka sekund decyduje, czy Ci zaufa. Na projekcie patrzysz na swoją stronę jego oczami.”
  - EN: „Clients decide in seconds whether to trust you. In the design you see your site through their eyes.”

Końcówka zdania boxu - inne możliwości: „…a dostaniesz konkretną propozycję z wyceną i terminem.” / „…a resztę ustalisz w rozmowie.”

### Box „Nie wiesz, co wybrać?” - WYBRANE 2026-10-01
Właściciel po 20 końcówkach podał własny kierunek: „opowiedz nam o swojej firmie, a dopasujemy najlepsze rozwiązanie dla twojego biznesu, czy coś takiego”. Wdrożone:
- PL: „Znasz swoją firmę i to wystarczy. Opowiedz nam o niej, a dopasujemy najlepsze rozwiązanie dla Twojego biznesu.”
- EN: „You know your business, and that's enough. Tell us about it and we'll find the best fit for your business.”
- **Głos „my” w tym zdaniu to świadomy wybór właściciela** (wyjątek od głosu korzyści): w wezwaniu do rozmowy naturalne „opowiedz nam…, a dopasujemy…” wygrywa z konstrukcjami bezosobowymi. **Do PRODUCT.md.**

### Box - 20 końcówek po „Znasz swoją firmę i to wystarczy.” (2026-10-01, właściciel: „i tutaj daj na końcówkę 20 propozycji”; żadna nie wybrana - patrz wyżej)
Pierwsze zdanie zaakceptowane. Limit: całość do ok. 110 znaków (3 linie na komputerze, 4 na telefonie).
1. Opowiedz o niej, a wybór zrobi się sam.
2. Powiedz, co chcesz osiągnąć, a dostaniesz prostą odpowiedź, jak to zrobić. (wdrożone tymczasowo)
3. Powiedz, co chcesz osiągnąć. Resztę usłyszysz w odpowiedzi.
4. Powiedz, dokąd zmierzasz, a dowiesz się, jak tam dojść.
5. Powiedz, po czym poznasz, że się udało, a dostaniesz plan, jak do tego dojść.
6. Opowiedz o niej tak, jak opowiadasz klientom, a odpowiedź będzie konkretna.
7. Na stronach i systemach znać się nie musisz.
8. Nie musisz wiedzieć, czym różni się strona firmowa od szytej na miarę.
9. Nazwy usług możesz pominąć. Powiedz tylko, co ma się zmienić.
10. Technologia nie jest Twoim zmartwieniem.
11. Powiedz, czego Ci brakuje, a nie, jak to się nazywa.
12. Powiedz, co dziś Cię hamuje, a zobaczysz, co da się z tym zrobić.
13. Opisz problem swoimi słowami. Rozwiązanie to już nie Twoja głowa.
14. Jedna rozmowa i wiesz, na czym stoisz.
15. Po jednej rozmowie wiesz, co warto zrobić, a czego nie.
16. Wystarczy rozmowa, żeby wybór stał się prosty.
17. Dostaniesz propozycję dopasowaną do niej, a nie do cennika.
18. Usłyszysz, co warto zrobić, a także, czego nie warto.
19. Reszta wyjdzie w rozmowie.
20. Od wyboru jest rozmowa.

## Usługi - runda 3 (częściowo wybrana: 1C, 2A, 4A)

Zasada rundy: każde zdanie mówi o kliencie właściciela firmy albo o samym właścicielu i o tym, co zyskuje. Zero zdań o Avenly („jeden zespół”), zero przymiotników o produkcie („szybka, dopracowana”), zero haseł reklamowych. Wzór = zaakceptowane teksty Oferty („Sklep, który sprzedaje także wtedy, gdy Ty odpoczywasz.”, „Koniec z arkuszami i karteczkami.”).

**1. `/uslugi` - opis pod „Od strony po system.”**
- **A (polecam):** „Klientom łatwiej Cię wybrać. Tobie łatwiej prowadzić firmę.”
  - EN: „Easier for clients to choose you. Easier for you to run your business.”
- **B:** „Mniej tłumaczenia, czym się zajmujesz. Mniej odpisywania na te same pytania. Więcej czasu na samą pracę.”
  - EN: „Less explaining what you do. Less answering the same questions. More time for the work itself.”
- **C:** „Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.”
  - EN: „Clients judge your business before they get in touch. Here you decide what they see.”

**2. `/uslugi/strony-www` - opis pod „Strona, która rośnie z firmą.”**
- **A (polecam):** „Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.”
  - EN: „Clients look you up online before they call. Your website decides whether they do.”
- **B:** „Mówi za Ciebie, kiedy Ty pracujesz. Klient wchodzi, rozumie, czym się zajmujesz, i się odzywa.”
  - EN: „It speaks for you while you work. Clients come in, get what you do and get in touch.”
- **C:** „Klient daje stronie chwilę. Tyle ma wystarczyć, żeby wiedział, co robisz i jak do Ciebie napisać.”
  - EN: „Clients give a website a moment. That has to be enough to see what you do and how to reach you.”

**3. `/uslugi/design` - opis pod „Zobacz stronę, zanim powstanie.”**
- **A (polecam):** „Trudno opisać stronę słowami. Łatwo pokazać na projekcie, co zmienić.”
  - EN: „A website is hard to describe in words. It's easy to point at a design and say what to change.”
- **B:** „Nic nie powstaje, dopóki nie powiesz, że tak ma być. Twoja firma, Twoja decyzja.”
  - EN: „Nothing gets built until you say it's right. Your business, your call.”
- **C:** „Nie kupujesz kota w worku. Najpierw widzisz, potem decydujesz.”
  - EN: „No buying blind. You see it first, then you decide.”

**4. Box „Nie wiesz, co wybrać?” - zdanie pod pytaniem**
- **A (polecam):** „Znasz swoją firmę i to wystarczy. Powiedz, co chcesz osiągnąć, a dowiesz się, co ma sens, ile kosztuje i na kiedy.”
  - EN: „You know your business, and that's enough. Say what you want to achieve and you'll learn what makes sense, what it costs and by when.”
- **B:** „Nie musisz znać się na stronach. Opowiedz o swojej firmie, a dostaniesz konkretną odpowiedź, wycenę i termin.”
  - EN: „You don't need to know websites. Tell us about your business and you get a clear answer, a quote and a timeline.”

Opisy w Google `/uslugi` i `/uslugi/strony-www` dostaną wybrane zdania (nazwy usług + zdanie o kliencie), bez „od jednego zespołu” i bez przymiotników. Podpis kroku 2 boxu: „Usługi dobrane do Twojego celu.” Reszta tabeli z rundy 1 bez zmian.

## Usługi - runda 2 - ODRZUCONA 2026-10-01 („chujowe te teksty”, patrz „Decyzje właściciela”)

Zdania kluczowe w wersji ogólnej. Pozycje z tabeli „Reszta” w rundzie 1 zostają, z dwiema zmianami w tym samym duchu (niżej).

**1. `/uslugi` - opis pod „Od strony po system.”**
- **A (polecam):** „Strony, które się pamięta. Sklepy, które sprzedają. Systemy, które porządkują firmę.”
  - EN: „Websites people remember. Stores that sell. Systems that keep your business in order.”
- **B:** „Wszystko, co Twoja firma ma w sieci, w jednym miejscu. Zaprojektowane i zbudowane przez jeden zespół.”
  - EN: „Everything your business has online, in one place. Designed and built by one team.”
- **C:** zostaje jak jest.

**2. `/uslugi/strony-www` - opis pod „Strona, która rośnie z firmą.”**
- **A (polecam):** „Szybka, dopracowana i zrobiona po to, żeby klient się odezwał. A nie po to, żeby po prostu była.”
  - EN: „Fast, polished and built to make clients get in touch. Not just to exist.”
- **B:** „Dobra strona nie tylko wygląda. Budzi zaufanie i pracuje na Twoją firmę każdego dnia.”
  - EN: „A good website does more than look good. It builds trust and works for your business every day.”
- **C:** „Szybka, czytelna i wygodna na każdym telefonie. Taka, do której klient chce wrócić.”
  - EN: „Fast, clear and easy on every phone. The kind clients want to come back to.”

**3. `/uslugi/design` - opis pod „Zobacz stronę, zanim powstanie.”**
- **A (polecam):** „Dobry projekt widać od pierwszego spojrzenia. Ty widzisz go jeszcze przed pierwszą linijką kodu.”
  - EN: „Good design shows at first glance. You see it before the first line of code.”
- **B:** „Projekt, w którym wszystko jest na swoim miejscu. Czytelny dla klienta i spójny z Twoją marką.”
  - EN: „A design where everything is in its place. Clear for your clients and true to your brand.”

**4. Box „Nie wiesz, co wybrać?” - zdanie pod pytaniem**
- **A (polecam):** „I nie musisz. Od tego jest rozmowa.”
  - EN: „You don't have to. That's what the conversation is for.”
- **B:** „Nie szkodzi. Opowiedz o swojej firmie, a dostaniesz konkretną propozycję.”
  - EN: „No problem. Tell us about your business and you get a concrete proposal.”
- **C:** „To normalne. Wystarczy jedna rozmowa, żeby wiedzieć, co ma sens dla Twojej firmy.”
  - EN: „That's normal. One conversation is enough to know what makes sense for your business.”

**Zmiany w „Reszcie” względem rundy 1:**
- box, podpis kroku 2: „Usługi dobrane do Twojego celu.” (EN „Services matched to your goal.”) zamiast „Zostają tylko usługi, których potrzebujesz.”
- opis w Google `/uslugi`: „Strony WWW, sklepy internetowe, systemy CRM i chatboty AI od jednego zespołu. Szybkie, dopracowane i zrobione po to, żeby klient się odezwał.” (EN „Websites, online stores, CRM systems and AI chatbots from one team. Fast, polished and built to make clients get in touch.”)
- opis w Google `/uslugi/strony-www`: „Strona one-page, strona firmowa, strona szyta na miarę, sklep internetowy i system CRM. Szybkie, dopracowane i wygodne na każdym telefonie.” (EN „One page website, company website, custom built website, online store and CRM system. Fast, polished and easy on every phone.”)

## Usługi - spis tekstów (stan przed zmianami, 2026-10-01)

Skąd biorą się teksty na `/uslugi`, `/uslugi/strony-www`, `/uslugi/design` (+ `/en/services…`):

| Element | Źródło | Czyje |
|---|---|---|
| h1, opis pod h1, box „Nie wiesz, co wybrać?”, podpisy kroków boxu, „Zobacz szczegóły”, „Wkrótce”, „Wszystkie” (filtr), nagłówek listy „Projekt przygotujesz dla”, opisy dla czytników | `lib/i18n/uslugi/kategorie.ts` (`catalogDict`) | moje |
| tytuł, opis, Open Graph | `app/(pl)/uslugi/page.tsx`, `strony-www/page.tsx`, `design/page.tsx` + 3 odpowiedniki w `app/(en)/en/services/` | moje |
| nazwy usług, chwyt na karcie, zdanie pod chwytem i legenda 1-3 (szeroka karta Design), podpisy kroków scenek, nazwy kategorii w filtrze | `servicesSectionDict` w `lib/i18n/services.ts` = teksty Oferty na stronie głównej | wspólne, zmiana tylko za zgodą właściciela |
| `desc`, `fullDescription`, `features`, `techStack` kart oraz `description` / `longDescription` kategorii | `app/data/services.ts`, `EN_CARD` / `EN_CATEGORY` w `lib/i18n/services.ts` | **nic ich nie wyświetla** (sprawdzone grepem: katalog i Oferta mają je tylko jako zapas, gdyby brakowało wpisu w `servicesSectionDict.items`; `ServiceTemplate` ma własne propsy i nie jest używany). `title` zasila wartości listy usług w formularzu kontaktu - bez zmian |

Ocena wg `PRODUCT.md` (co nie gra):
1. **Opis pod h1 `/uslugi`** - pierwsze zdanie to sama wyliczanka (strona, sklep, system, asystent), a filtr tuż pod spodem wylicza to samo; drugie zdanie powtarza prawie dosłownie wstęp Oferty na stronie głównej („powstają w jednym miejscu, więc wszystko do siebie pasuje”); brak „Ty”.
2. **Opis pod h1 `/uslugi/strony-www`** - konkret przed chwytem: jedno długie zdanie z dwoma wtrąceniami, chwyt dopiero na końcu. Na telefonie 5 linii z wiszącym „po” na końcu linii („…i sklep, po / system…”).
3. **Opis pod h1 `/uslugi/design`** - to samo zdanie stoi w karcie tuż pod spodem (z Oferty: „Układ, kolory i wersję na telefon akceptujesz na starcie, więc później nic Cię nie zaskoczy”). Na jednym ekranie czyta się je dwa razy (PL i EN, komputer i telefon).
4. **Box „Nie wiesz, co wybrać?”** - „propozycja, która ma sens” to pusty zwrot; „bezpłatna konsultacja” pada trzy razy w jednym boxie (zdanie, przycisk, dopisek); na telefonie wiszące „a na”; podpis kroku 2 „Dobieramy usługi…” jest w głosie „my”.
5. **„Projekt przygotujesz dla”** (`/uslugi/design`) - brzmi, jakby to klient przygotowywał projekt.
6. **Dopisek „Bez zobowiązań, odpowiedź w 24 h.”** - bez twardych spacji („w 24 h” może się rozdzielić).
7. **Metadane** - opis `/uslugi` ma 196 znaków, `/uslugi/strony-www` 172 (Google ucina ok. 155-160) i oba zaczynają się od wyliczanki. Open Graph: strona podaje tylko tytuł i opis, więc **gubi obrazek, adres i typ** z layoutu głównego (Next zastępuje cały blok `openGraph`) - link wklejony na Facebooku / LinkedInie / w Messengerze nie ma obrazka; karta Twittera pokazuje ogólne „Avenly - Agencja Interaktywna” / „Strony WWW · AI · Marketing” zamiast tekstu podstrony.
8. Bez zastrzeżeń: h1 trzech stron (wybory właściciela z etapu 2), tytuły w metadanych (sentence case, do 63 znaków z „| Avenly”), „Zobacz szczegóły”, „Wkrótce”, etykiety filtra, opisy dla czytników.

## Usługi - tabela „było → jest” (runda 1)

### Zdania kluczowe - warianty ODRZUCONE 2026-10-01 („nienaturalne”, patrz „Decyzje właściciela”); obowiązuje runda 2 wyżej

**1. `/uslugi` - opis pod „Od strony po system.”**
- było: „Strona, sklep, system dla firmy albo asystent AI. Wszystko powstaje w jednym zespole, więc do siebie pasuje.”
- **A (polecam):** „Wybierasz tylko to, czego Twoja firma potrzebuje. Wszystko powstaje w jednym zespole, więc od początku do siebie pasuje.”
  - EN: „Pick only what your business needs. One team builds it all, so it fits together from day one.”
- **B:** „Jeden zespół zamiast kilku wykonawców. Strona, sklep, system i asystent AI powstają razem, więc do siebie pasują.”
  - EN: „One team instead of several vendors. Your website, store, system and AI assistant are built together, so they fit together.”
- **C:** zostaje jak jest.

**2. `/uslugi/strony-www` - opis pod „Strona, która rośnie z firmą.”**
- było: „Od jednej strony, która zbiera zapytania, przez stronę firmową i sklep, po system, w którym widzisz całą firmę. Zaczynasz od tego, czego potrzebujesz dziś.”
- **A (polecam):** „Dziś jedna strona, jutro sklep i system dla całej firmy. Każdy kolejny krok dokładasz do tego, co już działa.”
  - EN: „One page today, a store and a system for your whole business tomorrow. Every next step builds on what already works.”
- **B:** „Nie musisz budować wszystkiego naraz. Zaczynasz od jednej strony, a sklep i system dokładasz, gdy przyjdzie na nie czas.”
  - EN: „You don't have to build everything at once. Start with a single page and add a store or a system when the time comes.”
- **C (najmniejsza zmiana - sama kolejność):** „Zaczynasz od tego, czego potrzebujesz dziś. Od jednej strony, która zbiera zapytania, po system, w którym widzisz całą firmę.”
  - EN: „You start with what you need today. From a single page that collects inquiries to a system where you see your whole business.”

**3. `/uslugi/design` - opis pod „Zobacz stronę, zanim powstanie.”**
- było: „Układ, kolory i wersję na telefon akceptujesz na starcie. Klikasz projekt jak gotową stronę, więc później nic Cię nie zaskoczy.”
- **A (polecam):** „Zmieniasz zdanie na projekcie, a nie na gotowej stronie. Poprawka na tym etapie to chwila, nie przebudowa.”
  - EN: „Change your mind on the design, not on the finished site. A fix at this stage takes a moment, not a rebuild.”
- **B:** „Wszystkie uwagi zgłaszasz, zanim powstanie pierwsza linijka kodu. Potem budowa idzie już prosto do celu.”
  - EN: „You give all your feedback before the first line of code. After that, the build goes straight to the goal.”

**4. Box „Nie wiesz, co wybrać?” - zdanie pod pytaniem**
- było: „Opowiadasz o swojej firmie i celu, a na bezpłatnej konsultacji dostajesz propozycję, która ma sens.”
- **A (polecam):** „I nie musisz. Wystarczy, że wiesz, co chcesz osiągnąć, a resztę ustalisz w rozmowie.”
  - EN: „You don't have to. Knowing what you want to achieve is enough, and the rest gets settled in one conversation.”
- **B:** „Wystarczy, że wiesz, co chcesz osiągnąć. Dostajesz plan dla swojej firmy, a nie listę wszystkiego, co da się kupić.”
  - EN: „Knowing what you want to achieve is enough. You get a plan for your business, not a list of everything you could buy.”
- **C:** zostaje jak jest (tylko twarda spacja przy „a na”).

**5. Metadane** (jedna propozycja na stronę, tytuły bez zmian)

| Strona | Pole | Było | Jest |
|---|---|---|---|
| `/uslugi` | opis | „Strona one-page, strona firmowa, strona szyta na miarę, sklep internetowy, system CRM, projekt UI/UX i chatboty AI. Bierzesz to, czego Twoja firma potrzebuje dziś, i dokładasz resztę, gdy urośnie.” (196 zn.) | „Od strony po system: strona one-page, firmowa lub szyta na miarę, sklep internetowy, system CRM i chatbot AI. Wybierasz to, czego Twoja firma potrzebuje.” (153 zn.) |
| `/uslugi` | OG tytuł | „Usługi - Avenly” | „Od strony po system - usługi Avenly” |
| `/uslugi/strony-www` | opis | „Od jednej strony, która zbiera zapytania, przez stronę firmową i sklep internetowy, po system CRM, w którym widzisz całą firmę. Strony WWW, które rosną razem z Twoją firmą.” (172 zn.) | „Strona, która rośnie z firmą: one-page, strona firmowa, strona szyta na miarę, sklep internetowy i system CRM. Zaczynasz od tego, czego potrzebujesz dziś.” (154 zn.) |
| `/uslugi/strony-www` | OG tytuł | „Strony WWW - Avenly” | „Strona, która rośnie z firmą - strony WWW Avenly” |
| `/uslugi/design` | opis | bez zmian (132 zn.) | - |
| `/uslugi/design` | OG tytuł | „Design - Avenly” | „Zobacz stronę, zanim powstanie - projekt UI/UX Avenly” |
| wszystkie 6 (PL i EN) | Open Graph / Twitter | tylko tytuł i opis (bez obrazka, adresu i typu), karta Twittera z ogólnym tekstem | dopisane `url`, `type`, obrazek `/og-default.png` i własna karta Twittera z tytułem i opisem podstrony |

EN: `/en/services` opis → „From a website to a system: one page, company or custom built website, online store, CRM system and AI chatbot. Pick only what your business needs.” (147); `/en/services/websites` opis → „A website that grows with you: one page, company website, custom built website, online store and CRM system. Start with what you need today.” (140); OG tytuły → „From a website to a system - Avenly services”, „A website that grows with you - Avenly websites”, „See your site before it is built - Avenly UI/UX design”.

### Reszta (jedna propozycja)

| Miejsce | Było | Jest | Dlaczego |
|---|---|---|---|
| box - podpis kroku 2 | „Dobieramy usługi do celu, nie odwrotnie.” | „Zostają tylko usługi, których potrzebujesz.” | głos „my” → głos korzyści; pasuje do rysunku (z siatki usług zapalają się trzy) |
| box - podpis kroku 2 (EN) | „We match the services to your goal.” | „Only the services you need make the cut.” | jw. |
| box - podpis kroku 1 (EN) | „You tell us about your business and goal.” | „You describe your business and your goal.” | bez „us” |
| box - dopisek | „Bez zobowiązań, odpowiedź w 24 h.” | ten sam tekst z twardymi spacjami („w 24 h”) | typografia |
| box - dopisek (EN) | „No commitment, a reply within 24 h.” | „No strings attached. A reply within 24 hours.” | naturalny angielski |
| `/uslugi/design` - nagłówek listy | „Projekt przygotujesz dla” | „Do czego przyda Ci się projekt” | to nie klient przygotowuje projekt |
| `/uslugi/design` - nagłówek listy (EN) | „Available for” | „Start with a design for” | czyta się z listą („…for One page website”) |
| nagłówek siatki dla czytników | „Każda usługa w działaniu.” | „Każda usługa w działaniu” | nagłówek bez kropki |
| `/en/services/design` - h1 | „See your site before it is built” | „See your site before it's built” | naturalniej (apostrof to nie myślnik) |

Bez zmian: h1 trzech stron, tytuły w metadanych, „Zobacz szczegóły”, „Wkrótce”, „Wszystkie”, „Nie wiesz, co wybrać?”, „Bezpłatna konsultacja”, podpisy kroków 1 i 3 boxu (PL), opisy dla czytników.

### Teksty z Oferty widoczne w katalogu (`servicesSectionDict.items`) - polecam NIE ruszać
Nazwy, chwyty, legendy i podpisy scenek zostały zaakceptowane 2026-09-28 i trzymają się zasad. Nie widzę powodu, żeby je zmieniać tylko dla katalogu. Dwie drobne uwagi do decyzji właściciela (nie wprowadzam):
- „Startujesz w 3-5 dni” (legenda one-page; w katalogu niewidoczna, widać ją w Ofercie) - plan etapu 3 mówi, że termin „3-5 dni” ma potwierdzić właściciel przy przebudowie one-page.
- EN nazwy bez łącznika: „One page website”, „Custom built website” - po angielsku poprawnie „One-page website”, „Custom-built website” (łącznik to nie myślnik). Zmiana dotknęłaby Oferty EN, stopki i formularza.

## Pliki
- Realizacje: `lib/i18n/projects.ts` i `app/data/projects.ts` (wspólne - tylko narzędziem Edit, tylko teksty), `app/(pl)/realizacje/layout.tsx`, `app/(pl)/realizacje/[slug]/page.tsx`, `app/(en)/en/work/layout.tsx`, `app/(en)/en/work/[slug]/page.tsx`.
- `lib/i18n/uslugi/kategorie.ts`, `app/(pl)/uslugi/page.tsx`, `app/(pl)/uslugi/strony-www/page.tsx`, `app/(pl)/uslugi/design/page.tsx`, `app/(en)/en/services/page.tsx`, `app/(en)/en/services/websites/page.tsx`, `app/(en)/en/services/design/page.tsx`.

## Pułapki i ważne szczegóły
- **Opis pod h1 dzielony na zdania po `'. '`** (`Catalog.tsx`: na telefonie każde zdanie od nowej linii, wyważone osobno). W opisie nie może być skrótu z kropką i spacją („np. ”) ani zdania kończonego pytajnikiem w środku - pytajnik nie dzieli.
- Szerokości: opis pod h1 `max-width: 36rem` przy 17 px (ok. 60-65 znaków w linii, komputer 2-3 linie), telefon 21rem przy 16 px (ok. 32-36 znaków, dziś 4-5 linii). Zdanie boxu: ok. 40 znaków w linii, 3 linie (do ok. 110 znaków). Podpis kroku pod rysunkiem: jedna linia do ok. 45 znaków (dłuższe łamią się na dwie, jak w EN „The inquiry lands with you the very same moment.”).
- Kafel katalogu pokazuje tylko **pierwsze zdanie** `line` z Oferty (chwyt); pełne zdanie i legenda 1-3 są tylko na szerokiej karcie `/uslugi/design`.
- Pole `allServices` w `catalogDict` nie jest nigdzie użyte (do usunięcia przy wdrożeniu).
- Zrzuty: `shot.mjs` w scratchpadzie (CDP, jeden profil Chrome, sprzątany po przebiegu). Wspólny serwer :3001 bywa wolny - 12 zrzutów trwało ok. 18 minut.

## Propozycje dla zamrożonych części (nie wprowadzone)
- `app/(pl)/layout.tsx` (root): w `keywords` jest „WooCommerce” (wbrew „bez WordPressa / WooCommerce”); opis karty Twittera „Strony WWW · AI · Marketing”.
- Navbar: „Darmowa Wycena” / „Free quote” (zgłaszały już chaty 2, 4, 5).
- Oferta (`servicesSectionDict.items`, one-page, podpis kroku 3): „Zapytanie w tej samej chwili ląduje u Ciebie.” - na 360 px „u” zostaje samo na końcu linii (katalog i Oferta); wystarczy twarda spacja „u Ciebie”. Wspólny plik - zmiana za zgodą właściciela.
- `app/data/services.ts` + `EN_CATEGORY`: martwe pola `description` / `longDescription` kategorii w głosie „my” („Tworzymy oprogramowanie klasy enterprise...”, „Marketing oparty na danych to nasza specjalność...”) oraz `desc` / `fullDescription` / `features` kart - nic ich nie wyświetla; do usunięcia przy porządkach (zostają `title`, `href`, `icon`, kolejność - formularz kontaktu).

## Do dokumentacji głównej
- do CLAUDE.md: (po wdrożeniu) Open Graph na podstronie trzeba podawać w całości (`url`, `type`, `images`) - blok `openGraph` strony zastępuje blok z root layoutu, nie łączy się z nim.
- do CLAUDE.md: opisy podstron (stan końcowy) - `/uslugi` „Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.”, `/uslugi/strony-www` „Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.”, `/uslugi/design` „Klient najpierw patrzy, dopiero potem czyta. Dlatego zaczynamy od tego, co zobaczy.”, box „Znasz swoją firmę i to wystarczy. Opowiedz nam o niej, a dopasujemy najlepsze rozwiązanie dla Twojego biznesu.”, `/realizacje` „Te strony pracują dziś dla prawdziwych firm. Zobacz, co widzą ich klienci.”; tytuły case studies w metadanych biorą nazwę wyświetlaną z `workByLocale`.
- do PRODUCT.md (nowe zasady marki, wszystkie z 2026-10-01, cytaty w „Decyzjach właściciela”):
  1. **Bez „drabinki potrzeb”** - nie opowiadamy, czego klient potrzebuje najpierw, potem i później, i nie prowadzimy go po kolei przez usługi.
  2. **Zdanie mówi o kliencie i o tym, co zyskuje** - konkretna sytuacja z jego firmy albo zachowanie jego klientów („Klient sprawdza Cię w sieci, zanim zadzwoni.”), nie pochwała produktu ani agencji; bez haseł reklamowych, frazesów i przymiotników o produkcie („cheap marketing”).
  3. **Bez przechwałek i docinków pod adresem konkurencji** („Każdy mówi, że robi świetne strony. My dajemy linki.” = „cheap gadanie”). Pewność siebie = spokojne fakty.
  4. **Nie przypisujemy klientowi pracy agencji** - klient opowiada, widzi, akceptuje, dostaje; to, co robi Avenly, mówimy wprost w głosie „my” („Dlatego zaczynamy od tego, co zobaczy.”, „dopasujemy najlepsze rozwiązanie”). To doprecyzowanie Copy Voice 1: głos „my” jest dozwolony tam, gdzie opisuje pracę agencji albo zaprasza do rozmowy.
  5. **Bez form zakładających płeć czytelnika** („sprawdzić sam”).

## Weryfikacja
- 2026-10-01, opis Realizacji i Kontakt: zrzuty nagłówka `/realizacje` 1440 × 900 (opis w jednej linii), 390 × 844 i 360 × 740 (2 linie: zdanie / zdanie, bez wiszącego „My”), `/en/work` 390 (2 linie); `og:image` na `/kontakt` obecny. ESLint czysto. **Uwaga:** ok. 16:30 nakładka deweloperska pokazywała na każdej stronie błąd budowania z cudzej pracy w toku (`app/(pl)/uslugi/strony-www/one-page/OnePage.tsx`: brak modułu `./scene-specimen` - chat 7); strony pod nakładką renderują się poprawnie, zrzuty robione z ukrytą nakładką.
- 2026-10-01, Realizacje po wdrożeniu skrótów RKS i Mcentrum: zrzuty całej listy `/realizacje` przy ograniczonym ruchu (rzędy bez animacji) na 1440 i 390 oraz `/en/work` na 390 - skróty mają 3 linie jak pozostałe, układ kart i siatki bez zmian; `og:image` listy obecny; tytuł karty case study RKS = „Klub Sportowy RKS - case study”. Plansz przypiętych (zwykły ruch) nie sprawdzałem na zrzutach - do obejrzenia w przeglądarce. ESLint na 6 plikach czysto, `tsc --noEmit` bez błędów w moich plikach.
- 2026-10-01, po wdrożeniu Usług (1C, 2A, 4A, reszta, metadane): zrzuty `/uslugi` i `/uslugi/strony-www` na 1440 × 900 oraz 360 × 740, 390 × 844 i 430 × 932 @2x (opis: każde zdanie osobno, wyważone, bez wiszących słów; na telefonie 3 linie zamiast 4-5, pierwsza karta wyżej), box „Nie wiesz, co wybrać?” na 1440 (3 linie jak dotąd) i 390 (4 linie), EN `/en/services` i `/en/services/websites` na 390, lista „Do czego przyda Ci się projekt” na 1440. Twarde spacje: „się odezwie”, „co wtedy”, „w sieci”, „i to”, „co chcesz”, „a dostaniesz”, „jak to zrobić”, „w 24 h”. ESLint na 7 plikach czysto, `tsc --noEmit` bez błędów w moich plikach.
- 2026-10-01, stan wyjściowy: zrzuty 1440 × 900 (`/uslugi`, box „Nie wiesz, co wybrać?”, `/uslugi/strony-www`, `/uslugi/design` góra i lista, `/en/services`) i 390 × 844 @2x (`/uslugi`, `/uslugi/strony-www`, `/uslugi/design`, box, `/en/services/websites`, `/en/services/design`); nagłówki HTML `/uslugi` (brak `og:image`, `og:url`, `og:type`).
