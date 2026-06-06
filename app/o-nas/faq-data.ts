/**
 * Dane FAQ używane jednocześnie w UI (/o-nas/page.tsx) i w JSON-LD FAQPage schema (/o-nas/layout.tsx).
 * Single source of truth - zmiana tutaj propaguje się do UI i SEO.
 */
export const FAQS = [
  {
    question: 'Czy jest możliwość otrzymania faktury?',
    answer:
      'Tak. Jeśli potrzebujesz faktury, rozliczenie realizujemy za pośrednictwem platformy Useme. Dzięki temu otrzymujesz pełnoprawny dokument księgowy za wykonaną usługę w bezpieczny sposób.',
  },
  {
    question: 'Jak wygląda wsparcie po wdrożeniu?',
    answer:
      'Nie znikamy. Oferujemy opcjonalne pakiety utrzymaniowe (SLA), w ramach których dbamy o aktualizacje, bezpieczeństwo i rozwój projektu. Masz gwarancję reakcji w mniej niż 24 godziny.',
  },
  {
    question: 'Jaki jest typowy czas realizacji projektu?',
    answer:
      'Dla stron firmowych to zazwyczaj około dwóch tygodni. Dla rozbudowanych sklepów e-commerce: 2-6 tygodni.',
  },
] as const;
