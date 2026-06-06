# Pomysł — Sklep dual-makieta (WooCommerce vs Headless)

**Data:** 2026-05-28
**Status:** Pomysł do realizacji (nie zaczęte)

## Koncepcja

Na podstronie `/uslugi/strony-www/sklep/` (po renaming z `sklepy-internetowe`) zamiast jednej makiety przeglądarki — **dwie makiety obok siebie**, każda reprezentuje inną opcję techniczną:

```
┌─────────────────────────────┬─────────────────────────────┐
│      MAKIETA 1              │      MAKIETA 2              │
│   WooCommerce               │   Headless Commerce         │
│                             │                             │
│   [browser mockup           │   [browser mockup           │
│    twoj-sklep.pl/koszyk]    │    twoj-sklep.pl/produkty]  │
│                             │                             │
│   WordPress · WooCommerce   │   Next.js · Stripe ·        │
│   · znany panel admin       │   Sanity headless · 5×      │
│                             │   szybsza                   │
└─────────────────────────────┴─────────────────────────────┘
       Klient sam edytuje              Premium performance
       w WP Admin                      + custom UX
```

## Co rozróżnić visualnie

**Makieta 1 — WooCommerce:**
- Browser chrome standardowy
- URL: `twoj-sklep.pl` → `/koszyk` → `/checkout` (klasyczny flow)
- Viewport content: typowy sklep WooCommerce z koszykiem, kategoriami
- Vibe: solidny, znany, "edytujesz w WP Admin"
- Akcent kolorystyczny: amber (jak teraz Shop)

**Makieta 2 — Headless Commerce:**
- Browser chrome z subtle premium touch (np. ciemne tło)
- URL: `twoj-sklep.pl/produkty` → `/produkt/[slug]` → `/checkout` (custom routing)
- Viewport content: szybsze ładowanie, custom design, hover effects
- Vibe: nowoczesny, performance-first, "edytujesz w Sanity Studio"
- Akcent kolorystyczny: blue/violet (kontrast do amber)

## Layout idea

Desktop:
- 2 makiety side-by-side, każda zajmuje ~45% szerokości
- Pomiędzy nimi pionowy separator "VS" lub po prostu gap
- Pod makietami: tabelka porównawcza (cena, czas realizacji, kogo to dla)

Mobile:
- Stacked vertically (makieta 1 góra, makieta 2 dół)
- Każda zajmuje 100% szerokości
- Tabelka porównawcza pod każdą lub na końcu

## Animacja

Każda makieta ma swój scroll-bound animation (jak aktualny ShopClient), ale **synchronizowane** — obie animują się równocześnie wraz z scrollem. Klient widzi "two paths through commerce".

Plus: w połowie scrolla można dodać **chip / badge** po lewej/prawej stronie wskazujący "Ta opcja jest dla Ciebie jeśli..." — diagnostic copy zamiast forced choice.

## Tabelka porównawcza (content pod makietami)

| Kryterium | WooCommerce | Headless (Custom) |
|---|---|---|
| Czas realizacji | 3-4 tyg | 6-10 tyg |
| Cena (od) | ~6-10k zł | ~15-25k zł |
| Edycja produktów | WP Admin (znany) | Sanity Studio (lekki, custom) |
| Wydajność (PageSpeed) | 70-85 | 95-99 |
| Custom design | Limited (motyw + plugins) | Bez limitów |
| Skalowalność | Średnia | Wysoka |
| Wymagania techniczne | Hosting WordPress | Serverless (Vercel) + Sanity + Stripe |
| Idealne dla | Mała/średnia firma, klient sam edytuje | Marka premium, performance priority |

## Plan implementacji (gdy ruszamy)

1. Refaktor `app/uslugi/strony-www/sklep/ShopClient.tsx` (po rename z sklepy-internetowe):
   - Aktualna makieta `max-w-6xl` → 2 makiety w grid lg:grid-cols-2
   - Wewnątrz każdej: scaled-down version of browser mockup pattern z one-page
   - Synchronized scroll-bound transforms (oba reagują na ten sam scrollYProgress)
2. Comparison table sekcja niżej (zamiast scope cards lub obok)
3. Dwie różne color palettes per makieta (amber dla Woo, blue/violet dla Headless)
4. URL bar animation w obu (różne URL states)
5. CTA: "Nie wiesz która? Pogadaj z nami" → dispatch chat event

## Notatki techniczne

- Browser mockup pattern jest reusable z `OnePageClient.tsx` — można wynieść do helper component `<BrowserMockup>` w `components/templates/`
- Synchronized scroll = jeden `useScroll` + dwa motion.div z tymi samymi `useTransform` dependencies
- Mobile single-column = lg:grid-cols-2 + grid-cols-1 default
- Performance: 2 makiety = 2× rendering. Każda powinna mieć IntersectionObserver pause + 30fps throttle dla animacji shaderów (jeśli będą)

## Decision points (do potwierdzenia z user'em gdy ruszamy)

- [ ] Tabelka porównawcza — full feature comparison czy minimalist (3-4 row)?
- [ ] Cennik widoczny w tabelce (cena od X zł) czy tylko czas + tech?
- [ ] CTA per makieta (każda ma własny "Zamów") czy jeden wspólny niżej?
- [ ] Jeśli klient klika "WooCommerce" makietę — czy dispatchuje chat z context "Chcę WooCommerce" czy tylko visual interaction?
