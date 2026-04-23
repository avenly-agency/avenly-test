# avenly-web — Progress Chatbot

## Status
**Ostatnia aktualizacja:** 2026-04-23  
**Tracker główny:** `C:\Users\Start\Desktop\progress.md`

---

## Zrealizowane

### Chatbot UI
- `components/chatbot/Chatbot.tsx` — floating bubble + okno chatu
  - Framer Motion (AnimatePresence, spring transitions)
  - `data-lenis-prevent` na kontenerach scroll (kompatybilność z Lenis)
  - Dwa widoki: `"chat"` i `"history"` z animowanym slide
- `app/layout.tsx` — `<Chatbot />` zintegrowany globalnie
- `app/api/chat/route.ts` — proxy do n8n (nieużywane przy static export)

### Lokalna historia czatów
- `avenly_chat_current` (localStorage) — in-progress session `{ id, msgs }`
- `avenly_chat_sessions` (localStorage) — max 15 sesji, newest-first
- Zamknięcie → automatyczny zapis do historii + nowa sesja
- Historia: przeglądanie poprzednich czatów, wznowienie kliknięciem

### Konfiguracja
- `next.config.ts`: `output: 'export'`, `trailingSlash: true`
- `.env.local` (wszystkie zmienne ustawione):
  - `NEXT_PUBLIC_N8N_CHATBOT_URL` = `https://n8n.avenly.pl/webhook/chatbot`
  - `NEXT_PUBLIC_CHATBOT_SECRET` = `avenly-chatbot-2026`
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://kyfsjvgixmcmafvaiyak.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ustawiony

---

## Do zrobienia

- [ ] `npm run build` → wgraj `out/` na Hostinger
- [ ] Po deploymencie: test pełnego flow (chat → historia → wznowienie)
- [ ] Test zapisu wiadomości do Supabase `chat_messages`
- [ ] Test zapisywania leadów (podanie danych kontaktowych → CRM)

---

## Uwagi techniczne

- Strona to **static export** — brak API routes w produkcji. Wszystkie callsy do n8n i Supabase są client-side przez `NEXT_PUBLIC_` zmienne baked in at build time.
- Supabase wymaga tabeli `chat_messages` z RLS policy `anon INSERT` — SQL w `Desktop/progress.md` Sesja 3.
- n8n endpoint: `https://n8n.avenly.pl/webhook/chatbot` (Nginx + Let's Encrypt na VPS, DNS Cloudflare)
