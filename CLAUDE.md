# CLAUDE.md — Avenly Web

## Stack

- **Next.js 16** (App Router, `output: 'export'`, static generation)
- **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (PostCSS, dark mode forced via `.dark` class)
- **Framer Motion 12** — animacje komponentów, scroll triggers
- **GSAP 3** + ScrollTrigger — zaawansowane animacje scroll-based
- **Lenis** — smooth scrolling (`SmoothScrolling.tsx` provider)
- **Sanity** — headless CMS (next-sanity, @sanity/image-url)
- **Web3Forms** — wysyłanie formularza kontaktowego (bez backendu)
- **React Hook Form** — walidacja formularzy
- **Shadcn/ui** + **Lucide React** — komponenty UI i ikony

## Komendy

```bash
npm run dev       # localhost:3000
npm run build     # static export → /out
npm run lint      # ESLint
```

## Routing

Plik-based routing via App Router. Wszystkie strony statyczne (`output: 'export'`).

```
app/
  page.tsx                          # Homepage
  uslugi/
    strony-www/
      one-page/
      profesjonalna-strona-firmowa/
      dedykowane-strony-www/
      sklepy-internetowe/
    design/ui-ux/
    marketing/audyt-wydajnosci-seo/
    automatyzacja-ai/chatboty-ai/
  blog/
    page.tsx
    [slug]/page.tsx
  realizacje/
    page.tsx
    [slug]/page.tsx
  kontakt/
  o-nas/
  polityka-prywatnosci/
```

## Konwencje

### Komponenty
- Sekcje strony głównej: `components/sections/`
- Komponenty layoutu: `components/layout/` (Navbar, Footer, SmoothScrolling)
- Szablony stron: `components/templates/ServiceTemplate.tsx`
- Utility: `components/ui/`

### Dane / Treści
- Usługi: `app/data/services.ts`
- Projekty portfolio: `app/data/projects.ts`
- Posty bloga: `app/data/posts.ts`
- Zdjęcia publiczne: `public/`

### Style
- Globalne zmienne CSS i animacje: `app/globals.css`
- Schemat kolorów: ciemne tło `#050505`, akcent niebieski `#2f5beb` / `#112b82`
- Responsive: mobile-first, breakpoint `lg` (1024px)
- Helper: `lib/utils.ts` → `cn()` do łączenia klas Tailwind

### Animacje
- Proste reveal-on-scroll: wrapper `<Reveal>` (`components/Reveal.tsx`)
- Złożone animacje scroll: GSAP + ScrollTrigger bezpośrednio w komponentach
- Animacje wejścia/wyjścia: Framer Motion `variants` + `AnimatePresence`
- Smooth scroll: nie używaj `window.scrollTo` — używaj Lenis API lub linków z offset

### Nawigacja cross-page
Żeby po przejściu na stronę główną przewinąć do sekcji, używaj query param:
```
href="/?target=sectionId"
```
Navbar obsługuje ten parametr automatycznie.

## Ważne zasady

1. **Nie zmieniaj `output: 'export'`** — strona jest statyczna, bez API routes.
2. **Dark mode tylko przez klasę `.dark`** — nie używaj `prefers-color-scheme`.
3. **Obrazy z `next/image`** — zawsze z `unoptimized` (wymagane przy static export).
4. **Nie dodawaj nowych dużych bibliotek** bez potrzeby — projekt jest już ciężki.
5. **SEO**: Każda strona ma własne `metadata` eksportowane z `page.tsx`.
6. **Treści po polsku** — cały content, etykiety, komunikaty po polsku.
7. **ServiceTemplate**: Nowe podstrony usług zawsze przez `ServiceTemplate.tsx`, nie ręcznie.
