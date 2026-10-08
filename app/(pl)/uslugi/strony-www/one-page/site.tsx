import type { CSSProperties } from 'react';
import { ArrowUpRight, Check, MapPin, Clock, MousePointer2 } from 'lucide-react';
import type { OnePageCopy } from '@/lib/i18n/uslugi/one-page';

// ZAPROJEKTOWANA STRONA ONE-PAGE KLIENTA w kadrze („twojafirma.pl”) - wybór właściciela 2026-10-01: w dużym kadrze
// ma być „ładna, kolorowa przykładowa strona klienta (jak prawdziwy zrzut)”, która przewija się w kadrze, a nie
// kreski. Od 2026-10-02 bez etapu szkicu („nie zaczyna się strona od szkicu”) - kadr od początku pokazuje gotową stronę. Własna paleta marki klienta (krem, butelkowa zieleń, terakota, musztarda) i ilustracje
// z prostych brył - celowo inny świat niż czerń i błękit Avenly, żeby strona klienta „wyskakiwała” z kadru.
// Teksty mówią, co stoi w danym miejscu („Twoja oferta w jednym zdaniu.”) - przykład, nie udawana realizacja.
// Wymiary w em od jednej wielkości liczonej z szerokości okna kadru (cqw) - strona skaluje się razem z ramą;
// wąskie okno (telefon) = układ w jednej kolumnie (@container w one-page.css).
// data-sk = wskazówki dla szkicu (app/(pl)/uslugi/_usluga/sketch.tsx), data-anchor = miejsca, do których zjeżdża pokaz.
// Stan sterują zmienne CSS ze scen: --f1..3 (pola formularza 0-1), --co / --c / --k (kursor przy „Wyślij”:
// widoczność, dojazd, wciśnięcie), --sent (wysłane), --chip (indeks podświetlonej sekcji w pokazie zakresu).

export const Site = ({ t, chips }: { t: OnePageCopy['site']; chips?: string[] }) => (
  <div className="one-st">
    <div className="one-st-in">
      <div className="one-st-nav">
        <span className="one-st-logo"><i data-sk="skip" />{t.brand}</span>
        <span className="one-st-links">
          {t.nav.map((x) => <span key={x} className="one-st-navlink">{x}</span>)}
          <span className="one-st-navbtn" data-sk="box">{t.navCta}</span>
        </span>
      </div>

      <div className="one-st-hero" data-anchor="hero">
        <div>
          <p className="one-st-eyebrow"><i data-sk="skip" />{t.eyebrow}</p>
          <p className="one-st-h1">{t.heroTitle}</p>
          <p className="one-st-p">{t.heroText}</p>
          <div className="one-st-actions">
            <span className="one-st-btn" data-sk="btn">{t.heroCta}<ArrowUpRight /></span>
            <span className="one-st-ghost" data-sk="box">{t.heroLink}</span>
          </div>
          <p className="one-st-perks">
            {t.perks.map((x) => <span key={x}><i data-sk="skip"><Check /></i>{x}</span>)}
          </p>
        </div>
        <div className="one-st-art" data-sk="img">
          <i className="one-st-art-arch" /><i className="one-st-art-sun" /><i className="one-st-art-hill" /><i className="one-st-art-bar" />
          <span className="one-st-art-card"><i><Check /></i><b /><b /></span>
        </div>
      </div>

      {chips && (
        <div className="one-st-chips" data-sk="skip">
          {chips.map((c, i) => <span key={c} style={{ '--ci': i } as CSSProperties}>{c}</span>)}
        </div>
      )}

      <div className="one-st-offer" data-anchor="offer">
        <div className="one-st-head">
          <p className="one-st-h2">{t.offerTitle}</p>
          <p className="one-st-s">{t.offerLead}</p>
        </div>
        <div className="one-st-cards">
          {t.cards.map((c, i) => (
            <div key={c.title} className="one-st-card" data-sk="box">
              <span className="one-st-card-art" data-sk="img" data-v={i}><i /><i /></span>
              <p className="one-st-h3">{c.title}</p>
              <p className="one-st-s">{c.text}</p>
              <p className="one-st-price"><span>{c.price}</span><i data-sk="box"><ArrowUpRight /></i></p>
            </div>
          ))}
        </div>
      </div>

      <div className="one-st-quote" data-anchor="quote">
        <span className="one-st-qm" data-sk="skip">“</span>
        <p className="one-st-q">{t.quote}</p>
        <p className="one-st-s">{t.quoteBy}</p>
      </div>

      <div className="one-st-contact" data-anchor="contact" data-sk="box">
        <div>
          <p className="one-st-h2">{t.contactTitle}</p>
          <p className="one-st-p">{t.contactText}</p>
          <p className="one-st-lines">
            <span><MapPin data-sk="skip" />{t.contactLines[0]}</span>
            <span><Clock data-sk="skip" />{t.contactLines[1]}</span>
          </p>
        </div>
        <div className="one-st-form" data-sk="box">
          {t.fields.map((fl, i) => (
            <div key={fl.label} className="one-st-field" data-sk="field" data-big={i === 2 ? '' : undefined}>
              <span className="one-st-lab">{fl.label}</span>
              <span className="one-st-val" data-sk="skip" style={{ '--f': `var(--f${i + 1}, 1)` } as CSSProperties}>{fl.value}</span>
            </div>
          ))}
          <span className="one-st-btn one-st-send" data-sk="btn">
            <span className="one-st-send-a">{t.submit}</span>
            <span className="one-st-send-b" data-sk="skip"><Check />{t.sent}</span>
            <span className="one-st-cur" data-sk="skip"><MousePointer2 /></span>
          </span>
        </div>
      </div>

      <div className="one-st-foot">
        <span className="one-st-logo"><i data-sk="skip" />{t.brand}</span>
        <span>{t.foot}</span>
      </div>
    </div>
  </div>
);
