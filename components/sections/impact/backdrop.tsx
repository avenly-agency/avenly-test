// Tło sekcji "Dlaczego Avenly" - MAPA WARSTWIC (wybór właściciela 2026-09-27 spośród propozycji
// Horyzont / Mapa warstwic / Siatka / Bez tła; pozostałe usunięte). Powtarzalny kafel warstwic
// (public/impact/contours.svg z generatora scripts/impact-contours.mjs) użyty jako MASKA - białe
// linie z kryciem, co 5. warstwica grubsza; kolor linii daje CSS: odcień karty, która jest na ekranie
// (--im-tint ustawia stack.tsx), przejście 1,4 s. Samo tło zostaje neutralną czernią. Bez gwiazd
// i bez mgiełek; góra sekcji czarna (przejście z Realizacji), dół gaśnie do #050505. Style .im-bg-*
// w globals.css.

/** Warstwa tła sekcji (pierwsze dziecko sekcji, absolute inset 0, pod kontenerem z z-10). */
export const ImpactBackdrop = () => (
  <div className="im-bg im-bg--mapa" aria-hidden="true">
    <div className="im-bg-fill" />
  </div>
);
