---
description: Odśwież backlog pomysłów bloga o 10-15 nowych trending tematów. Bez pisania posta — tylko research + zapis do docs/blog-ideas.md.
argument-hint: [opcjonalnie: kategoria np. "AI", "SEO", "e-commerce"]
---

# /blog-research — Odśwież backlog pomysłów bloga

Standalone research mode. **NIE pisze posta** — tylko aktualizuje `docs/blog-ideas.md` o świeże tematy znalezione w internecie.

Argument: `$ARGUMENTS` (opcjonalnie — np. "AI" zawęża research do tematyki AI; bez argumentu = pełen zakres branż Avenly: AI, web dev, e-commerce, SEO, design).

## Kiedy używać

- **Raz w miesiącu** — odśwież backlog o trending tematy z ostatnich 30 dni
- **Gdy backlog się wyczerpał** — TOP PRIORITY zostało < 5 pozycji
- **Po dużych branżowych wydarzeniach** — Google Core Update, nowa wersja Next.js/React, AI announcement (GPT-5, Claude 5 itp.)
- **Sezonowo** — początek Q4 (Black Friday content), styczeń (rok nowy content), itp.

## Workflow

### KROK 1: Wczytaj backlog

Przeczytaj **@docs/blog-ideas.md** — zobacz co już jest. NIE duplikuj istniejących tematów.

### KROK 2: Multi-source research (5-7 WebSearch'e)

Wykonaj research w 4 kierunkach:

**A. HOT NOW (świeże newsy ostatnich 30 dni):**
```
WebSearch("najnowsze SEO update Google 2026 ostatnie tygodnie")
WebSearch("Next.js React release 2026 najnowsze wersje")
WebSearch("AI news business Polska 2026")
```
Cel: 3-5 tematów które mają potencjał na **szybki spike** w 1-2 tygodnie jeśli napiszemy szybko.

**B. EMERGING (trendy które będą hot za 3-6 mies):**
```
WebSearch("emerging tech trends 2026 web development")
WebSearch("AI agents business automation 2026 future")
WebSearch("nowe technologie marketing 2026 przyszłość")
```
Cel: 2-3 tematy które są wcześnie na fali, niska konkurencja w PL.

**C. SEASONAL (sezonowe — pasujące do bieżącego momentu):**
- Sprawdź jaki jest aktualny miesiąc/kwartał (z `currentDate` lub `Bash("date +%Y-%m-%d")`)
- Q1 (Sty-Mar): "rok 2026/2027 plany", "nowe budżety firm", "podsumowanie roku poprzedniego", "trendy roczne"
- Q2 (Kwi-Cze): "letnia kampania marketingowa", "audyty wiosenne", "wakacyjne ofert"
- Q3 (Lip-Wrz): "powrót po wakacjach", "back-to-business", "audyty przed Q4"
- Q4 (Paź-Gru): "Black Friday e-commerce", "świąteczne kampanie", "planowanie roku następnego"

Wybierz 1-2 tematy pasujące do TERAZ.

**D. CONKURENCJA — co publikują top polskie blogi:**
```
WebSearch("blog agencja marketingowa Polska 2026 nowe posty")
WebSearch("blog SEO Polska 2026 strategia")
```
Cel: 2-3 tematy o których piszą konkurenci — możemy pisać **lepszą wersję** (przegląd, więcej konkretu, polski case study).

**(Opcjonalnie) E. People also ask / long-tail:**
Jeśli `$ARGUMENTS` ma konkretną kategorię (np. "AI"):
```
WebSearch("people also ask chatbot AI Polska firma")
WebSearch("ludzie pytają też strona internetowa cena 2026")
```
Cel: 2-3 long-tail keywords z wysokim intent.

### KROK 3: Klasyfikacja i ocena trudności

Dla każdego znalezionego tematu oceń:

- **Kategoria** (z listy: AI & Automatyzacja, Biznes, Performance, Strategia, Development, Design & UX, Marketing, News, Tech)
- **Type:** HOT NOW / EMERGING / SEASONAL / EVERGREEN / COMPARISON
- **Difficulty (⭐ 1-5):** ile autorytatywnych stron już rankuje na tę frazę
  - ⭐ = niemal nikt nie pisał, easy win
  - ⭐⭐⭐ = średnia konkurencja, trzeba dobrego content'u
  - ⭐⭐⭐⭐⭐ = giganci dominują (Brainly, GoldenSubmarine), unikać
- **Intent:** commercial (ktoś szuka usługi) / informational (uczy się) / navigational (szuka konkretnej marki)
- **Spike potential:** 1-2 tyg (HOT NOW), evergreen (długoterminowy), sezonowy

### KROK 4: Filtr (zostaw tylko najlepsze)

Z znalezionych ~15-20 tematów wyfiltruj **10-15 najlepszych**:
- ❌ Wyrzuć duplikaty z istniejącego backlog'a (sprawdź zarówno TOP PRIORITY jak i OPUBLIKOWANE)
- ❌ Wyrzuć tematy ⭐⭐⭐⭐⭐ (zbyt trudne)
- ❌ Wyrzuć tematy poza branżą Avenly (nie piszemy o niezwiązanych z web/AI/marketing)
- ✅ Preferuj commercial intent + low/medium difficulty
- ✅ Preferuj long-tail (4+ słowa)

### KROK 5: Zapis do `docs/blog-ideas.md`

**Edit tool**, dodaj do sekcji "🔥 Trending (auto-found przez research)" nowy podpunkt:

```markdown
### YYYY-MM-DD (data dzisiejszego research'u)

- [ ] **"[Title 1]"** — HOT NOW, źródło: [news], spike 1-2 tyg → [kategoria] ⭐
- [ ] **"[Title 2]"** — EMERGING, hot za 3-6 mies → [kategoria] ⭐⭐
- [ ] **"[Title 3]"** — SEASONAL Q[?], aktualne TERAZ → [kategoria] ⭐
- [ ] **"[Title 4]"** — COMPARISON, low competition → [kategoria] ⭐⭐
... (10-15 wpisów)
```

**WAŻNE:** dopisuj NA GÓRZE sekcji "🔥 Trending" (najnowszy research na górze, starsze niżej). NIE nadpisuj poprzednich research'y — historia jest cenna.

### KROK 6: Podsumowanie dla user'a

Pokaż user'owi:

```
✅ Backlog odświeżony — dodałem N nowych tematów (data: YYYY-MM-DD)

📊 Breakdown:
  - 🔥 HOT NOW: X tematów
  - 🌱 EMERGING: X tematów
  - 🍂 SEASONAL: X tematów
  - ⚖️ COMPARISON: X tematów

🥇 TOP 3 rekomendacje do napisania w pierwszej kolejności:
  1. "[Title]" — [krótkie why, np. "spike potential, niska konkurencja"]
  2. "[Title]" — [why]
  3. "[Title]" — [why]

💡 Następny krok: `/new-post [wybrany temat]` żeby napisać post na konkretny.

📝 Backlog: docs/blog-ideas.md — pełna lista
```

## Anti-patterns

- ❌ NIE duplikuj tematów z istniejącego backlog'a (czytaj go ZAWSZE przed dodawaniem)
- ❌ NIE wymyślaj "trending" bez WebSearch'u — wszystkie HOT NOW muszą mieć źródło
- ❌ NIE dodawaj > 15 tematów na raz (user się zgubi, lepiej regular updates)
- ❌ NIE oceniaj difficulty bez sprawdzenia konkurencji (`WebSearch("[keyword] site:.pl")` daje obraz top 10)
- ❌ NIE wpadaj na tematy poza Avenly niche (nie piszemy o gotowaniu, fitness, podróżach...)

## Jak często wywoływać

| Częstotliwość | Use case |
|---|---|
| **Raz w miesiącu** | Standard refresh — utrzymaj backlog "świeży" |
| **Po wydarzeniu branżowym** | Google Core Update, nowa wersja frameworka, premiera AI modelu |
| **Sezonowo** | Początek nowego kwartału — sezonowe tematy |
| **Gdy backlog się kończy** | TOP PRIORITY ma < 5 nieukończonych pozycji |
