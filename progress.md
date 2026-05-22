# avenly-web — Progress

## Status
**Ostatnia aktualizacja:** 2026-05-22
**Tracker główny:** `C:\Users\Start\Desktop\progress.md`
**Pełny kontekst projektu:** [project_context.md](./project_context.md)

---

## Zrealizowane

### Chatbot UI
- `components/chatbot/Chatbot.tsx` — floating bubble (z-30) + okno chatu
  - Framer Motion (AnimatePresence, spring transitions)
  - `data-lenis-prevent` na kontenerach scroll (kompatybilność z Lenis)
  - Dwa widoki: `"chat"` i `"history"` z animowanym slide
- `app/layout.tsx` — `<Chatbot />` zintegrowany globalnie
- ~~`app/api/chat/route.ts`~~ — **usunięte** (2026-05-22). Martwy kod przy `output: 'export'`. Chatbot strzela bezpośrednio do n8n.

### Lokalna historia czatów
- `avenly_chat_current` (sessionStorage) — in-progress session `{ id, msgs }`
- `avenly_chat_sessions` (localStorage) — max 15 sesji, newest-first
- Zamknięcie → automatyczny zapis do historii + nowa sesja
- Historia: przeglądanie poprzednich czatów, wznowienie kliknięciem
- Custom event `avenly:open-chat` otwiera chatbota z dowolnego miejsca

### Konfiguracja
- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`
- `.env.local` (wszystkie zmienne ustawione):
  - `NEXT_PUBLIC_N8N_CHATBOT_URL` = `https://n8n.avenly.pl/webhook/chatbot`
  - `NEXT_PUBLIC_CHATBOT_SECRET` = `avenly-chatbot-2026`
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://kyfsjvgixmcmafvaiyak.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ustawiony

### Quick Replies — sesja 6 (2026-04-30)
- `QuickReply` interface z `triggers: ('start' | 'always' | 'keyword')[]` + `keywords?: string[]`
- Helper `hasTrigger()` — backward compat ze starym formatem `trigger: string`
- Fetch z Supabase: `chatbot_config?key=in.(quick_replies,welcome_message)`
- Trigger `start` → przyciski pod wiadomością powitalną (po otwarciu chatu)
- Trigger `always` → przyciski nad polem input (zawsze)
- Trigger `keyword` → przyciski po odpowiedzi bota gdy keywords match
- `startNewChat()` przywraca quick replies z triggerem `start`

### Welcome message z bazy danych
- Pobiera `welcome_message` z `chatbot_config` przy starcie widgetu
- Aktualizuje pierwszą wiadomość jeśli brak wiadomości użytkownika (sesja świeża)
- Fallback na `DEFAULT_WELCOME` stała jeśli DB nie ma wpisu

### Poprawki UX (sesja 6)
- **Fix kolejności wiadomości**: sekwencyjny zapis (user → then assistant) zamiast `Promise.all` — gwarantuje poprawny `created_at` w historii
- **Fix onClick send button**: `onClick={() => sendMessage()}` zamiast `onClick={sendMessage}` — zapobiega przekazaniu `MouseEvent` jako `overrideText`
- `sendMessage` przyjmuje opcjonalny `overrideText?: string` — używany przez quick reply buttons

---

## Do zrobienia

### Chatbot
- [ ] `npm run build` → wgraj `out/` na Hostinger po każdej zmianie konfiguracji baked-in
- [ ] Test: quick replies z triggerem `keyword` po odpowiedzi bota
- [x] ~~Decyzja: usunąć `app/api/chat/route.ts`~~ → **usunięte 2026-05-22**

### Bugi w danych (znalezione 2026-05-22, do naprawy)
- [ ] `app/data/services.ts` design card: zmień `href` z `/uslugi/design/design-stron-internetowych` (404) na `/uslugi/design/ui-ux`
- [ ] `app/data/services.ts` marketing card: zmień `href` z `/uslugi/marketing/audyt-seo-wydajnosci` na `/uslugi/marketing/audyt-wydajnosci-seo` (zgodnie ze slugiem folderu) — **wymaga też wypełnienia podstrony, obecnie zwraca `null`**
- [ ] `app/uslugi/marketing/page.tsx` — wypełnij stronę kategorii lub zwróć `notFound()` zamiast `null`
- [ ] `app/uslugi/marketing/audyt-wydajnosci-seo/page.tsx` — jak wyżej
- [ ] `app/data/posts.ts` post #2: blockquote linkuje `/audyt` — zmień na `/kontakt` (lub stwórz `/audyt`)
- [ ] `OnePageClient.tsx` Counter animuje 0→3 obok napisu "3–5 dni" — wprowadza w błąd; zmień target counter'a lub usuń

### Sprzątanie deps (opcjonalne)
- [ ] `npm uninstall three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing next-sanity @sanity/vision @sanity/image-url @portabletext/react` — jeśli nie planujesz migracji do Sanity / 3D
- [ ] Rozważyć usunięcie `tailwind.config.ts` (legacy v3, w v4 ignorowany)

---

## Uwagi techniczne

- **Static export** — brak API routes w produkcji. Wszystkie callsy do n8n i Supabase są client-side przez `NEXT_PUBLIC_` zmienne baked in at build time.
- Supabase wymaga tabeli `chat_messages` z RLS policy `anon INSERT` oraz `chatbot_config` z `anon SELECT` — SQL w `Desktop/progress.md` Sesja 3.
- n8n endpoint: `https://n8n.avenly.pl/webhook/chatbot` (Nginx + Let's Encrypt na VPS, DNS Cloudflare).
- Chatbot bubble ma z-30, mobile menu ma z-40 — bubble się chowa pod menu.
