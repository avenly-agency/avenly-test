# Blog Style Guide — Avenly Web

> **Cel pliku:** Single source of truth dla każdego blog posta. Używane przez `/new-post` slash command oraz przez ludzi piszących posty manualnie.
>
> **WAŻNE:** Ten style guide odzwierciedla **dokładnie** styl 3 istniejących postów w `app/data/posts.ts`. Każdy nowy post musi być spójny z tą konwencją — bez wprowadzania nowych formatów (FAQ, tabel itp.) chyba że temat naturalnie tego wymaga.

## Brand voice (z [PRODUCT.md](../PRODUCT.md))

- **Profesjonalny, konkretny, senior-partner.** NIE startup pitching desperation.
- **Konfidencja bez arogancji.** Mówimy z pozycji ekspertów, ale nie pouczamy.
- **Polski jako pierwszy język.** Anglicyzmy tylko gdy są standardem branżowym (CRM, Core Web Vitals, SaaS, AI, UX).
- **Konkret nad ogólnik.** Liczby > metafory. Konkretne narzędzia/marki (Voiceflow, Amazon, Google PageSpeed) > generyczne "platformy AI".
- **"W Avenly..."** — typowy podmiot dla autorytatywnych zdań ("W Avenly projektujemy...", "W Avenly budujemy...", "W Avenly wierzymy że...")

## Anti-references (czego unikać)

- ❌ Clickbait tytuły: "TY NIE UWIERZYSZ", "JEDNA RZECZ KTÓRA...", "10 SEKRETÓW"
- ❌ Wodolejstwo: "W dzisiejszych czasach żyjemy w erze cyfrowej..."
- ❌ AI-stylowane fluff: "W świecie który się ciągle zmienia, jednym z najważniejszych aspektów jest..."
- ❌ Generic listicles: "5 zalet posiadania strony internetowej" — zbyt oczywiste
- ❌ Złote myśli bez liczb: "Klienci uwielbiają szybkie strony" — daj statystykę albo skip

## Format pliku (TECHNICAL)

**`app/data/posts.ts` używa TAB indentation, nie spacji.** Każdy nowy post zachowuje to.

Struktura nowego obiektu w tablicy `blogPosts`:

```ts
	{
		id: 'N',  // następny dostępny numer (4, 5, 6...)
		slug: 'long-tail-keyword-z-myslnikami',  // bez polskich znaków, zgodny z URL
		title: 'Tytuł z keywordem (60-90 znaków, często pytanie)',
		excerpt:
			'Streszczenie 140-160 znaków. Hook + value prop. Bez "W tym artykule...".',
		publishedAt: 'YYYY-MM-DD',
		readTime: 'N min',
		author: {
			name: 'Avenly',
			role: '',
		},
		mainImage: 'https://images.unsplash.com/photo-XXX?q=80&w=1000&auto=format&fit=crop',
		categories: ['Kategoria główna', 'Kategoria pomocnicza'],
		content: `
      <h2>Pierwsza sekcja h2</h2>
      <p>Akapit otwierający z keywordem w pierwszym/drugim zdaniu.</p>
      
      <h3>Sub-pytanie / konkret</h3>
      <p>Rozwinięcie z <strong>bold dla kluczowych pojęć</strong>.</p>
      <ul>
        <li><strong>Etykieta:</strong> Wyjaśnienie 1 zdanie.</li>
        <li><strong>Etykieta:</strong> Wyjaśnienie 1 zdanie.</li>
        <li><strong>Etykieta:</strong> Wyjaśnienie 1 zdanie.</li>
      </ul>

      <h3>Kolejne sub-pytanie</h3>
      <p>Akapit.</p>

      <h2>Podsumowanie: [Konkluzja jednoznaniowa]</h2>
      <p>1-2 akapity zamykające.</p>
      
      <blockquote>
        <strong>[Pytanie/CTA hook]</strong><br>
        [Krótki opis co user dostanie po kliknięciu, 1-2 zdania.] <br>
        <a href="/kontakt">[CTA text]</a>
      </blockquote>
    `,
	},
```

**Uwagi:**
- `content` używa `<tab><tab>` wcięć (6 spacji w pre-formatowanym view) — kopiuj wzorzec z istniejących postów
- Backticki dla template literal, NIE quote marks
- Zaczyna i kończy się whitespace + newline (cosmetic)

## Struktura content (template — KRÓTKO i KONKRETNIE)

### Długość: 400-600 słów (5-6 min czytania)

To NIE jest pillar 2000+ — to **tactical, czytelny, do końca przewijalny** post.

### Liczba sekcji: 2× h2 + 2-3× h3 (łącznie 4-5)

```
<h2>1. Pierwsza sekcja głównego tematu</h2>
   <h3>Sub-pytanie A</h3>
   <h3>Sub-pytanie B</h3>

<h2>2. Podsumowanie: [konkluzja]</h2>
   (opcjonalnie 1× h3 lub sam akapit)
```

### Obowiązkowe elementy

1. **Otwierający `<h2>`** (NIE intro akapit przed h2 — pierwsze co user widzi to nagłówek sekcji)
2. **Akapit `<p>`** w każdej sekcji z `<strong>` na kluczowych pojęciach (typowo 1-2× na akapit)
3. **Min. 1 lista** (`<ul>` lub `<ol>`) z formatem `<li><strong>Etykieta:</strong> Wyjaśnienie</li>` — typowo 3-4 elementy
4. **Końcowy `<h2>Podsumowanie: ...</h2>`** — zamknięcie z mocnym statement
5. **`<blockquote>` CTA na końcu** — format:
   ```html
   <blockquote>
     <strong>[Pytanie hook]</strong><br>
     [Krótki opis tego co user dostanie.] <br>
     <a href="/kontakt">[CTA text]</a>
   </blockquote>
   ```

### CO NIE jest częścią konwencji (nie dodajemy domyślnie)

- ❌ **FAQ na końcu** — istniejące posty NIE mają. Pomijamy chyba że temat krzyczy o FAQ (np. "Najczęstsze pytania o..." jako główny topic).
- ❌ **Tabele** — istniejące posty NIE mają. Dodajemy TYLKO gdy post to comparison ("X vs Y").
- ❌ **Multiple internal links w treści** — istniejące posty linkują TYLKO w blockquote CTA. Zostajemy przy tym.
- ❌ **Wielki intro przed h2** — pierwsze co user widzi to h2.
- ❌ **Image w środku contentu** — istniejące posty mają tylko mainImage na górze.

## Tytuł (60-90 znaków)

Wzorce z istniejących postów:
- "Konsultant AI i Voiceflow: Jak zautomatyzować obsługę klienta i zwiększyć sprzedaż?" (98 zn)
- "Szybkość strony internetowej a SEO: Dlaczego milisekundy decydują o Twoim zysku?" (84 zn)
- "Dlaczego profesjonalna strona WWW to konieczność dla firmy w 2026 roku?" (74 zn)

**Wzorce:**
- `[Topic]: [Pytanie jak/dlaczego]?`
- `[Topic] a [korzyść]: Dlaczego [...]`
- `Dlaczego [topic] to konieczność w [rok]?`

Pytanie w tytule = +CTR.

## Excerpt (140-160 znaków)

Wzorce z istniejących:
- "Dowiedz się, jak wdrożenie inteligentnego konsultanta AI opartego na Voiceflow może odciążyć Twój zespół i zapewnić obsługę klienta na poziomie premium 24/7." (152 zn)
- "Analiza wpływu wydajności strony na pozycjonowanie w Google i współczynnik konwersji. Poznaj zasady Core Web Vitals i zwiększ wydajność swojej witryny." (151 zn)

**Wzorce:**
- "Dowiedz się, jak [topic]..."
- "Analiza [topic]..."
- Zaczyna od czasownika ("Dowiedz się", "Analiza", "Sprawdź", "Poznaj") + value prop + opcjonalnie konkretna technologia

## Kategorie (z istniejącej listy)

Wybierz 2 (pierwsza = główna, druga = pomocnicza):

- `AI & Automatyzacja` (post #1)
- `Biznes` (post #1, #2, #3)
- `Performance` (post #2)
- `Strategia` (post #3)
- `Development` (jeszcze nie użyte, ale w `BlogList.tsx` w filterze)
- `Design & UX` (jeszcze nie użyte)
- `Marketing` (jeszcze nie użyte)
- `News` (jeszcze nie użyte)
- `Tech` (jeszcze nie użyte)

NIE wymyślaj nowych kategorii — wybieraj z istniejących.

## Image (Unsplash)

Format URL: `https://images.unsplash.com/photo-XXXXXXX?q=80&w=1000&auto=format&fit=crop`

Wzorce z istniejących:
- post #1 (AI): photo-1677442136019-21780ecad995 (AI/tech abstract)
- post #2 (performance): photo-1451187580459-43490279c0fa (server tech)
- post #3 (strategia): photo-1460925895917-afdab827c52f (laptop / workspace)

**Preferencje:**
- Tech/workspace abstract (nie ludzie w garniturach)
- Ciemne/blue toned (pasuje do brand)
- Brak konkretnych logo / brand'ów

## SEO checklist (każdy post musi spełnić)

- [ ] Keyword w **title** (long-tail 4+ słów)
- [ ] Keyword w **excerpt**
- [ ] Keyword w **pierwszym h2** lub pierwszym akapicie p
- [ ] Keyword (lub synonim) w **min. 1 h3**
- [ ] **`<strong>`** w 2-3 miejscach (główne pojęcia)
- [ ] **`<ul>` lub `<ol>`** min. 1 (3-4 elementy z `<strong>:</strong>` pattern)
- [ ] **CTA blockquote** na końcu z `<a href="/kontakt">`
- [ ] **Kategorie z listy istniejącej**
- [ ] **Image z Unsplash** (sugerowany, user może podmienić)
- [ ] **readTime** poprawnie obliczone: `Math.ceil(wordCount / 200)` min

## HTML allowed w content

Wszystko co renderuje `dangerouslySetInnerHTML` + Tailwind `prose` z [globals.css](../app/globals.css):

- `<h2>`, `<h3>` (NIE h1 — to jest tytuł renderowany osobno)
- `<p>`, `<strong>`, `<em>`, `<a>`
- `<ul>`, `<ol>`, `<li>`
- `<blockquote>` (CTA pattern)
- `<br>`

**NIE używamy** (nieprzewidziane w istniejących postach):
- `<table>` — chyba że post to comparison
- `<h4>` lub niżej — nigdy
- `<img>` inline w content — tylko `mainImage` na górze
- `<pre>`, `<code>` — rzadko (bloki tylko jeśli post o programowaniu)

## Workflow generacji (dla `/new-post` slash command)

1. **Research** (WebSearch) — sprawdź top 3-5 wyników Google PL na keyword. NIE kopiuj — znajdź **luki** (czego brakuje konkurencji).
2. **Outline approval** — pokaż user'owi proponowane h2/h3 PRZED pisaniem. Po akceptacji → krok 3.
3. **Pisanie** — pełny content w jednym kawałku, w trzymanym formacie.
4. **Image suggestion** — 1-2 URL'e Unsplash + opis dlaczego pasują. User wybiera.
5. **Save** — `Edit` tool na `app/data/posts.ts`, dodaj na końcu tablicy z next available `id`.
6. **Backlog update** — w `docs/blog-ideas.md` przesuń pomysł z TOP PRIORITY do "OPUBLIKOWANE" z dzisiejszą datą.
7. **Preview** — pokaż user'owi summary: tytuł, długość, kategorie, image, gdzie linkuje. Poproś o review.
8. **(Opcjonalnie) Build** — jeśli user prosi, uruchom `npm run build` i potwierdz że nowa ścieżka `/blog/[slug]` została wygenerowana.

## Po czym poznać że post jest "Avenly-style"

✅ Krótko (400-600 słów), do końca przewijalne
✅ 2 h2 + 2-3 h3
✅ Każdy akapit ma 1-2× `<strong>`
✅ 1 lista z `<strong>:</strong>` pattern
✅ Końcowy `<h2>Podsumowanie:`
✅ Blockquote CTA do `/kontakt`
✅ Konkretne narzędzia/marki cytowane (jak Voiceflow, Amazon, Google)
✅ Brzmi jak senior partner, nie startup

❌ Nie jest długie (>1000 słów)
❌ Nie ma FAQ na końcu
❌ Nie ma tabel
❌ Nie ma intro akapit przed pierwszym h2
❌ Nie kopiuje słownictwa stock SEO ("W dzisiejszych czasach...")

## Referencyjne posty

Otwórz `app/data/posts.ts` i przeczytaj:
- **Post #1** (AI/Voiceflow) — referencja dla tactical AI post
- **Post #2** (szybkość/SEO) — referencja dla performance/tech post
- **Post #3** (strategia WWW) — referencja dla strategy/business post

Każdy nowy post powinien wizualnie pasować do tych 3 — ta sama długość, ten sam rytm sekcji, ten sam ton.
