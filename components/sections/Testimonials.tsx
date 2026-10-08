'use client';

import type { TestimonialsDict } from '@/lib/i18n/home/testimonials';
import { EditorialTestimonials } from './testimonials/editorial';
import './testimonials/testimonials.css'; // style sekcji we własnym pliku (praca równoległa - PRACA-ROWNOLEGLA.md)

// Sekcja "Opinie" (#opinie - kotwica na wrapperze w HomeClient). Układ REDAKCJA (wybór właściciela
// 2026-09-27 z 4 propozycji: Redakcja, Scena, Gwiazdy, Certyfikat - pozostałe i przełącznik usunięte).
// Szczegóły: testimonials/editorial.tsx, style: testimonials/testimonials.css.

// BEZ JSON-LD Review (2026-09-30). Search Console: „Wiele weryfikacji bez obiektu aggregateRating”
// (kilka Review przy Organization bez AggregateRating = błąd krytyczny). AggregateRating nie wraca
// (ocena „5,0” zniknęła ze strony 2026-09-28, a dane strukturalne mają opisywać widoczną treść),
// a opinie o firmie publikowane na jej własnej stronie („self-serving”) i tak nie dają gwiazdek
// w Google. Opinie zostają na stronie jako zwykła treść. Nie przywracać znacznika Review.

export const Testimonials = ({ t }: { t: TestimonialsDict }) => (
  // overflow-x-clip (nie hidden): nic nie wystaje w poziomie.
  <section className="op" aria-labelledby="op-title">
    <EditorialTestimonials t={t} />
  </section>
);
