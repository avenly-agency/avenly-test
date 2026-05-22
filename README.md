# Avenly Web

Strona internetowa agencji **Avenly** — pełni rolę wizytówki, portfolio i głównego narzędzia sprzedaży (cel: rezerwacja konsultacji). Zbudowana jako statyczny export Next.js, hostowana na Hostingerze.

> **Dokumenty kontekstowe:**
> - [CLAUDE.md](./CLAUDE.md) — zasady projektu i konwencje (dla agentów AI i developerów)
> - [PRODUCT.md](./PRODUCT.md) — odbiorca, ton marki, anti-references, zasady designu
> - [project_context.md](./project_context.md) — pełna mapa funkcji, danych i znanych pułapek
> - [progress.md](./progress.md) — log prac nad chatbotem

## Stack

- Next.js 16.1.1 (App Router, `output: 'export'`, `trailingSlash: true`)
- React 19.2.3 + TypeScript 5
- Tailwind CSS v4 (PostCSS, CSS-first config w `app/globals.css`)
- Framer Motion 12, GSAP 3 + ScrollTrigger, Lenis 1.3 (smooth scrolling)
- React Hook Form + Web3Forms (formularz bez backendu)
- Chatbot: n8n webhook + Supabase REST (`chat_messages`, `chatbot_config`)

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → /out (folder do uploadu na Hostinger)
npm run lint
```

## Zmienne środowiskowe (`.env.local`)

```
NEXT_PUBLIC_N8N_CHATBOT_URL=https://n8n.avenly.pl/webhook/chatbot
NEXT_PUBLIC_CHATBOT_SECRET=avenly-chatbot-2026
NEXT_PUBLIC_SUPABASE_URL=https://kyfsjvgixmcmafvaiyak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Wszystkie wartości muszą zaczynać się od `NEXT_PUBLIC_*`, bo strona to static export — brak SSR, brak API routes w produkcji.

## Struktura kodu (skrót)

```
app/
  page.tsx                  # Home (10 sekcji, lazy-loaded poza Hero)
  layout.tsx                # SmoothScrolling + LifecycleManager + Navbar/Footer/Chatbot
  data/                     # services, projects, posts (źródła treści)
  uslugi/                   # ServicesHub + 4 kategorie + podstrony usług
  realizacje/[slug]/        # case studies (generateStaticParams)
  blog/[slug]/              # posty (HTML string, NIE Portable Text)
  kontakt/, o-nas/, polityka-prywatnosci/
  sitemap.ts, robots.ts     # force-static
components/
  sections/                 # sekcje Home
  layout/                   # Navbar, Footer
  templates/ServiceTemplate # reusable szkielet podstrony usługi
  chatbot/Chatbot.tsx       # globalny widget
  providers/SmoothScrolling # Lenis + GSAP integration
  utils/LifecycleManager    # pause Lenis w ukrytym tabie
```

## Deploy

1. `npm run build` → wgraj zawartość `out/` na Hostinger (FTP / panel).
2. Zmiana konfiguracji chatbota (welcome, quick replies) odbywa się w CRM (tabela `chatbot_config` w Supabase) — **nie wymaga rebuildu**.
3. Zmiana treści (`app/data/*.ts`) wymaga rebuildu i ponownego uploadu.
