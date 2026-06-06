---
description: Wygeneruj nowy blog post w stylu identycznym z 3 istniejącymi postami na avenly.pl/blog
argument-hint: [temat lub keyword]
---

# /new-post — Blog post generator (style 1:1 z istniejącymi postami)

Wygeneruj nowy blog post dla Avenly Web na temat: **$ARGUMENTS**

## Reguła #1: Spójność z istniejącymi postami

Otwórz **@app/data/posts.ts** i przeanalizuj 3 istniejące posty. Twój nowy post **musi wyglądać identycznie** — ta sama długość, struktura, ton, format HTML, wzorzec CTA. Bez wprowadzania nowości (FAQ, tabel, dodatkowych internal links — chyba że user wyraźnie poprosi).

## Workflow

### 1. Wybór tematu (research mode gdy brak argumentu)

**Jeśli `$ARGUMENTS` ma konkretny temat** → przejdź do kroku 2.

**Jeśli `$ARGUMENTS` jest puste lub generyczne** ("blog post", "post", "nowy wpis") → uruchom **TOPIC RESEARCH**:

#### 1A. Multi-source research (3-4 WebSearch'e)

Wykonaj research z różnych źródeł żeby znaleźć trafne tematy dla obecnego momentu I przyszłości:

1. **HOT NOW** — sprawdź co nowego w branży ostatnich 30 dni:
   ```
   WebSearch("najnowsze trendy SEO Polska 2026 ostatni miesiąc")
   WebSearch("Next.js React update 2026 najnowsza wersja")
   WebSearch("Google update AI Overviews 2026 zmiany")
   ```
   Zanotuj 2-3 tematy które mają potencjał na **szybki spike** (1-2 tygodnie) jeśli napiszemy szybko.

2. **EMERGING** — sprawdź co będzie hot za 3-6 miesięcy:
   ```
   WebSearch("AI agents business 2026 trend")
   WebSearch("nowe technologie web development 2026 emerging")
   ```
   Zanotuj 1-2 tematy które są wcześnie na fali ale jeszcze niska konkurencja w PL.

3. **SEASONAL** — sprawdź co pasuje do aktualnego momentu w roku:
   - Q1 (Sty-Mar): "rok 2026/2027 plany", "nowe budżety firm", "podsumowanie roku poprzedniego"
   - Q2 (Kwi-Cze): "letnia kampania marketingowa", "audyty wiosenne"
   - Q3 (Lip-Wrz): "powrót po wakacjach", "back-to-business"
   - Q4 (Paź-Gru): "Black Friday e-commerce", "świąteczne kampanie", "planowanie 2027"
   Zanotuj 1 sezonowy temat pasujący do TERAZ.

4. **EVERGREEN** — z backlog'a `@docs/blog-ideas.md`:
   - Wybierz **top 2** z sekcji "TOP PRIORITY" (najmniej ⭐ = najłatwiej rankować)
   - Bazują na długoterminowych keywordach, zawsze dają traffic

#### 1B. Auto-update backlog'a o znalezione "trending"

Otwórz `docs/blog-ideas.md` i dodaj sekcję (jeśli jeszcze nie istnieje) lub aktualizuj istniejącą:

```markdown
## 🔥 Trending (znalezione przez research)

### YYYY-MM-DD (data dzisiejszego research'u)
- [ ] **"[Title]"** (HOT NOW, źródło: [news], spike potential 1-2 tyg) → kategoria
- [ ] **"[Title]"** (EMERGING, hot za 3-6 mies) → kategoria
- [ ] **"[Title]"** (SEASONAL Q?, aktualne TERAZ) → kategoria
```

Dopisuj nowe wpisy — NIE nadpisuj starych (historia research'u jest wartościowa).

#### 1C. Prezentacja użytkownikowi

Pokaż user'owi **6 tematów** w 3 kategoriach:

```
📊 PROPOZYCJE Z RESEARCH'U (data: YYYY-MM-DD):

🔥 HOT NOW (świeże, szybki spike w 1-2 tyg):
  1. "[Temat z research'u]" — [krótkie uzasadnienie, np. "Google ogłosił to 2 tyg temu, nikt w PL jeszcze nie pisał"]
  2. "[Temat z research'u]" — [uzasadnienie]

📚 EVERGREEN (z backlog'a, długoterminowy traffic):
  3. "[Temat z backlog'a]" — [keyword, ⭐ difficulty]
  4. "[Temat z backlog'a]" — [keyword, ⭐ difficulty]

🌱 EMERGING (przyszłościowe, hot za 3-6 mies):
  5. "[Temat z research'u]" — [uzasadnienie, np. "tematyka rośnie 200% YoY"]

🍂 SEASONAL (pasuje do bieżącego momentu Q?):
  6. "[Temat sezonowy]" — [uzasadnienie sezonowości]

---
Wybierz 1 numer (lub podaj własny temat). Wszystkie 6 dodane już do backlog'a — możesz wrócić do nieużytych później.
```

**Czekaj na wybór user'a.** Po wyborze → przejdź do kroku 2 (research dla wybranego tematu).

### 2. Research (opcjonalnie, max 2 WebSearch)

Jeśli temat wymaga konkretnych liczb/statystyk:
- `WebSearch("[keyword] site:.pl")` — sprawdź czego brakuje konkurencji
- `WebSearch("[topic] statystyki 2026")` — znajdź 1-2 liczby do cytowania

Jeśli temat jest oczywisty (np. "WordPress vs Next.js") — pomijaj research, lecimy z wiedzy.

### 3. Outline (zatwierdzenie przed pisaniem)

Pokaż user'owi krótko:
- **Title** (60-90 znaków, z keywordem, najlepiej pytanie)
- **Excerpt** (140-160 znaków, zaczyna od czasownika: "Dowiedz się", "Sprawdź", "Poznaj", "Analiza")
- **Slug** (long-tail myślnikami, bez polskich znaków)
- **Kategorie** (2 z istniejącej listy: `AI & Automatyzacja`, `Biznes`, `Performance`, `Strategia`, `Development`, `Design & UX`, `Marketing`, `News`, `Tech`)
- **Struktura sekcji:** dokładnie 2× h2 + 2-3× h3 (mapuj jak w istniejących postach)
- **Gdzie pójdzie lista** (1× ul lub ol, 3-4 elementy z `<strong>:</strong>` pattern)

Czekaj na akceptację user'a.

### 4. Pisanie

Napisz content **dokładnie w formacie istniejących postów**:

```html
      <h2>Pierwsza sekcja [z keywordem]</h2>
      <p>Akapit z <strong>kluczowym pojęciem</strong>. Konkretny, do meritum.</p>
      
      <h3>Sub-pytanie A</h3>
      <p>Rozwinięcie z <strong>1-2 bold pojęciami</strong>:</p>
      <ul>
        <li><strong>Etykieta 1:</strong> Wyjaśnienie 1 zdanie.</li>
        <li><strong>Etykieta 2:</strong> Wyjaśnienie 1 zdanie.</li>
        <li><strong>Etykieta 3:</strong> Wyjaśnienie 1 zdanie.</li>
      </ul>

      <h3>Sub-pytanie B</h3>
      <p>Akapit z konkretnym przykładem.</p>

      <h2>Podsumowanie: [konkluzja]</h2>
      <p>1-2 akapity zamykające z mocnym statement.</p>
      
      <blockquote>
        <strong>[Pytanie hook]</strong><br>
        [1-2 zdania co user dostanie.] <br>
        <a href="/kontakt">[CTA text]</a>
      </blockquote>
```

**Twarde wymagania (skopiuj z istniejących postów):**
- **Długość: 400-600 słów** (5-6 min czytania). NIE pisz 1500+ słów.
- **Wcięcie content: 6 spacji** (`      <h2>...`) — match istniejących postów
- **"W Avenly..."** w 1-2 miejscach ("W Avenly projektujemy/budujemy/wierzymy że...")
- **`<strong>`** w każdym akapicie (1-2× na akapit, na kluczowych pojęciach)
- **CTA blockquote → `/kontakt`** (NIGDY `/audyt` — to known bug post #2)
- **Końcowy h2 zaczyna się od "Podsumowanie:"**

**Czego NIE robisz:**
- ❌ NIE dodawaj FAQ na końcu — istniejące posty nie mają
- ❌ NIE dodawaj tabel — chyba że post to czysty comparison "X vs Y"
- ❌ NIE pisz intro akapit przed pierwszym `<h2>` — pierwsze co user widzi to nagłówek
- ❌ NIE dodawaj internal links w treści — tylko w blockquote CTA
- ❌ NIE używaj polskich znaków w slug (`kosztuje-chatbot` nie `kosztuje-chatbót`)

### 5. Save do `app/data/posts.ts`

Użyj **Edit tool** (nie Write). Dodaj nowy obiekt na końcu tablicy `blogPosts` (przed zamykającym `]`).

**Wcięcie TAB** (nie spacje) — match istniejących postów. Skopiuj wzorzec wcięcia bezpośrednio z post #3.

Pola:
- `id`: następny dostępny (post #3 ma id `'3'`, więc twój `'4'`)
- `slug`: long-tail myślnikami
- `title`: z outline
- `excerpt`: z outline (wieloliniowy z indentem jak w istniejących)
- `publishedAt`: dzisiejsza data YYYY-MM-DD
- `readTime`: `Math.ceil(wordCount / 200)` min
- `author`: `{ name: 'Avenly', role: '' }` — bez zmian
- `mainImage`: URL Unsplash (zobacz krok 6)
- `categories`: 2 z listy
- `content`: template literal z content z kroku 4

### 6. Image (Unsplash)

Format: `https://images.unsplash.com/photo-XXXXXXX?q=80&w=1000&auto=format&fit=crop`

**WAŻNE: NIE wymyślaj URL'i.** Zaproponuj user'owi 2-3 search queries (np. "tech workspace dark", "AI abstract") + powiedz że ma wybrać na unsplash.com i wkleić finalny URL.

Tymczasowo użyj URL'a placeholderowego (np. tego samego co post #1: `photo-1677442136019-21780ecad995`) — z zaznaczeniem że user ma podmienić.

### 7. Update backlogu

Otwórz `docs/blog-ideas.md`:
- Jeśli temat był z TOP PRIORITY → `[ ]` → `[x] YYYY-MM-DD`
- Przenieś wpis do sekcji "OPUBLIKOWANE" na dole

### 8. Preview dla user'a

Pokaż krótko:
```
✅ Post #N gotowy: "[TITLE]"
   - Długość: XXX słów (~N min)
   - Kategorie: [...]
   - URL: /blog/[slug]
   - Image: [URL — placeholder, podmień gdy chcesz]

🚀 Deploy:
   npm run build  →  upload out/ na Hostinger  →  Cloudflare Purge
```

Jeśli user prosi → uruchom `npm run build` żeby zweryfikować że nowa ścieżka się generuje.

## Style cheat sheet (z istniejących postów)

**Tytuły (referencja):**
- "Konsultant AI i Voiceflow: Jak zautomatyzować obsługę klienta i zwiększyć sprzedaż?"
- "Szybkość strony internetowej a SEO: Dlaczego milisekundy decydują o Twoim zysku?"
- "Dlaczego profesjonalna strona WWW to konieczność dla firmy w 2026 roku?"

**Excerpts (referencja):**
- "Dowiedz się, jak wdrożenie inteligentnego konsultanta AI..."
- "Analiza wpływu wydajności strony na pozycjonowanie w Google..."
- "Własna strona internetowa to niezależność od algorytmów..."

**Otwarcia h2 (referencja):**
- "Czym jest nowoczesny konsultant AI?"
- "Wydajność techniczna jako kluczowy czynnik rankingowy"
- "Strona internetowa vs Social Media"

**Końcowe h2 (referencja):**
- "Podsumowanie: Inwestycja, która się zwraca"
- "Szybka strona to profesjonalny wizerunek"
- "Podsumowanie: Strategiczna inwestycja w przyszłość"

**CTA blockquote (referencja):**
- "Chcesz sprawdzić, jak konsultant AI sprawdzi się w Twojej branży?" → /kontakt
- "Twoja strona ładuje się zbyt wolno?" → /kontakt
- "Zbudujmy Twoją cyfrową przewagę." → /kontakt

## Jeśli coś nie jest jasne — pytaj user'a

Lepiej zadać 1 dobre pytanie niż napisać post który nie pasuje stylowo.
