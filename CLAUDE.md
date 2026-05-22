# CLAUDE.md — Avenly Web

> Pełna mapa projektu, danych i znanych pułapek: [project_context.md](./project_context.md).
> Marka / ton / anti-references: [PRODUCT.md](./PRODUCT.md).

## Stack

- **Next.js 16.1.1** (App Router, `output: 'export'`, `trailingSlash: true`, static generation)
- **React 19.2.3** + **TypeScript 5**
- **Tailwind CSS v4** (PostCSS, CSS-first config w `app/globals.css` — `tailwind.config.ts` to legacy v3, **w v4 ignorowany**)
- **Framer Motion 12** — animacje komponentów, scroll triggers
- **GSAP 3** + ScrollTrigger — zaawansowane animacje scroll-based
- **Lenis** — smooth scrolling (`SmoothScrolling.tsx` provider, zintegrowany z GSAP)
- **Web3Forms** — wysyłanie formularza kontaktowego (bez backendu)
- **React Hook Form** — walidacja formularzy
- **Lucide React** + **React Icons** — ikony
- **Supabase REST** (anon) + **n8n webhook** — chatbot (klient-side, bez SSR)

**Zainstalowane, ale nieużywane** (kandydaci do `npm uninstall`, jeśli nie planujesz migracji): `three`, `@react-three/*`, `postprocessing`, `next-sanity`, `@sanity/vision`, `@sanity/image-url`, `@portabletext/react`.

## Komendy

```bash
npm run dev       # localhost:3000
npm run build     # static export → /out (folder do uploadu na Hostinger)
npm run lint      # ESLint
```

## Routing

Plik-based routing via App Router. Wszystkie strony statyczne (`output: 'export'`).

```
app/
  page.tsx                          # Homepage (10 sekcji)
  uslugi/
    page.tsx + ServicesHub.tsx
    strony-www/
      page.tsx (kategoria)
      one-page/                     (page.tsx + OnePageClient.tsx)
      profesjonalna-strona-firmowa/ (page.tsx + CorporateWebsiteClient.tsx)
      dedykowane-strony-www/        (page.tsx + DedicatedWebsiteClient.tsx)
      sklepy-internetowe/           (page.tsx + ShopClient.tsx)
      aplikacje-webowe/             (page.tsx + AppWebClient.tsx)
    design/
      page.tsx (kategoria)
      ui-ux/                        (page.tsx + layout.tsx)
    automatyzacje-ai/
      chatboty-ai/                  (page.tsx + ChatbotsAIClient.tsx)
    marketing/                      ⚠️ page.tsx zwraca null
      audyt-wydajnosci-seo/         ⚠️ page.tsx zwraca null
  blog/
    page.tsx
    [slug]/page.tsx
  realizacje/
    page.tsx
    [slug]/page.tsx
  kontakt/, o-nas/, polityka-prywatnosci/
  sitemap.ts, robots.ts             # force-static
```

## Konwencje

### Komponenty
- Sekcje strony głównej: `components/sections/`
- Komponenty layoutu: `components/layout/` (Navbar, Footer)
- Providery globalne: `components/providers/` (SmoothScrolling)
- Utility globalne: `components/utils/` (LifecycleManager)
- Szablony stron: `components/templates/ServiceTemplate.tsx` (reusable, z `children` na customowe sekcje)
- Komponenty bloga / projektów: `components/blog/`, `components/projects/`
- Chatbot: `components/chatbot/Chatbot.tsx`
- Reusable UI: `components/ui/` (button.tsx)

### Dane / Treści
- Usługi: `app/data/services.ts` (kategorie + cards)
- Projekty portfolio: `app/data/projects.ts`
- Posty bloga: `app/data/posts.ts` (treść jako **raw HTML string**)
- Zdjęcia publiczne: `public/` (głównie `public/portfolio/*.webp`)

### Style
- Globalne zmienne CSS i animacje: `app/globals.css` (`@theme inline` + `.blog-content` + glassmorphism + keyframes)
- Schemat kolorów: ciemne tło `#050505` / `#080808` / `#0a0a0a`, akcent niebieski blue-400/500/600 (`#2f5beb`), white text, `slate-300/400/500` dla podrzędnych
- Responsive: mobile-first, breakpoint `lg` (1024px) — desktop, `md` (768px) — tablet
- Helper: `lib/utils.ts` → `cn()` do łączenia klas Tailwind (`clsx` + `tailwind-merge`)

### Animacje
- Proste reveal-on-scroll: wrapper `<Reveal>` (`components/Reveal.tsx`)
- Złożone animacje scroll: GSAP + ScrollTrigger bezpośrednio w komponentach (np. `/o-nas` zoom hero, `OnePageClient` makieta przeglądarki)
- Animacje wejścia/wyjścia: Framer Motion `variants` + `AnimatePresence`
- Animowane liczniki: `useMotionValue` + `useSpring` + `springValue.on("change")` → **mutacja DOM bez re-renderu** (patrz `Impact.tsx`, `OnePageClient.tsx`)
- Smooth scroll: NIE używaj `window.scrollTo` na desktop — używaj `lenis.scrollTo()` lub `?target=` query param

### Nawigacja cross-page
Żeby po przejściu na stronę główną przewinąć do sekcji, używaj query param:
```
href="/?target=sectionId"
```
`AnchorManager` w `SmoothScrolling.tsx` obsługuje ten parametr automatycznie (retry x15 jeśli element jeszcze nie istnieje + auto-korekcja x3 w `onComplete`).

### Cross-component events
Otwarcie chatbota z dowolnego miejsca:
```ts
window.dispatchEvent(new Event("avenly:open-chat"));
```
Używane w: `AiConsultant`, `AvenlyAICta`, `Portfolio` (karta AI projektu), `app/realizacje/page.tsx`.

## Ważne zasady

1. **Nie zmieniaj `output: 'export'`** — strona jest statyczna, bez API routes. Folder `app/api/` został usunięty (martwy kod przy static export).
2. **Dark mode tylko przez klasę `.dark`** na `<html>` — nie używaj `prefers-color-scheme`.
3. **Obrazy z `next/image`** — zawsze z `unoptimized: true` (wymagane przy static export, ustawione w `next.config.ts`). Zewnętrzne hosty muszą być w `remotePatterns` (obecnie tylko `images.unsplash.com`).
4. **Nie dodawaj nowych dużych bibliotek** bez potrzeby — projekt ma już sporo nieużywanych deps.
5. **SEO**: każda strona ma własne `metadata` eksportowane z `page.tsx` (server component). `*Client.tsx` jest 'use client' — `metadata` musi być w `page.tsx`.
6. **Treści po polsku** — cały content, etykiety, komunikaty.
7. **ServiceTemplate**: nowe podstrony usług MOGĄ używać template'a (`components/templates/ServiceTemplate.tsx`), ale większość istniejących ma własne, ambitne scroll-locki. Wybór zależy od skali animacji.
8. **Sitemap**: po dodaniu nowej kategorii/usługi/projektu zweryfikuj `app/sitemap.ts` — iteruje po `services.cards[].href`, więc niepoprawne `href` lądują w sitemap.

## Pułapki (sprawdzone, do uniknięcia)

- **`tailwind.config.ts`** to legacy v3 — Tailwind v4 ignoruje większość pól. Kolory `avenly.main/light` z config **nie działają** w klasach. Realny theming w `app/globals.css` (`@theme inline`).
- **`?target=` + reset scrolla**: `SmoothScrolling` resetuje scroll do (0,0) przy każdej zmianie `pathname`. `AnchorManager` celowo czeka `setTimeout(300)` zanim zacznie szukać kotwicy. Jeśli dodajesz własną logikę scroll przy nawigacji — uwzględnij ten reset.
- **Niespójności w danych** (do naprawy):
  - `services.ts` design card linkuje `/uslugi/design/design-stron-internetowych` → 404. Powinno być `/uslugi/design/ui-ux`.
  - `services.ts` marketing card linkuje `/uslugi/marketing/audyt-seo-wydajnosci` → 404. Folder to `audyt-wydajnosci-seo`.
  - `app/uslugi/marketing/page.tsx` + `audyt-wydajnosci-seo/page.tsx` zwracają `return null` (puste strony, ale Navbar/Footer się renderują).
  - `posts.ts` post #2 linkuje `/audyt` → 404. Powinno być `/kontakt`.
- **Chatbot `sendMessage`**: przyjmuje opcjonalny `overrideText?: string`. Przycisk Send musi być `onClick={() => sendMessage()}`, NIE `onClick={sendMessage}` — inaczej `MouseEvent` ląduje jako `overrideText`.
- **Zapis do Supabase chat_messages musi być sekwencyjny** (user → then assistant), nie `Promise.all`, inaczej `created_at` w historii ma niewłaściwą kolejność.
- **Footer `#uslugi` vs Home `#oferta`**: sekcja Services w Home ma jednocześnie `id="oferta"` (wrapper `app/page.tsx`) i `id="uslugi"` (sama `<section>` w `Services.tsx`). Footer używa `#uslugi`, Navbar nie ma kotwicy do tej sekcji (linkuje do `/uslugi/`).
- **Lenis + tab-switch**: jeśli dodajesz nowe ScrollTriggery, sprawdź czy działają po powrocie z ukrytego tabu. `LifecycleManager` robi `lenis.resize()` + `start()`, ale `ScrollTrigger.refresh()` warto wywołać po cięższych zmianach układu.

## Zmienne środowiskowe (`.env.local`)

Wszystkie muszą być `NEXT_PUBLIC_*` (baked-in at build time przy static export):
```
NEXT_PUBLIC_N8N_CHATBOT_URL=https://n8n.avenly.pl/webhook/chatbot
NEXT_PUBLIC_CHATBOT_SECRET=avenly-chatbot-2026
NEXT_PUBLIC_SUPABASE_URL=https://kyfsjvgixmcmafvaiyak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Zmiana wymaga rebuildu + ponownego uploadu `out/`.
