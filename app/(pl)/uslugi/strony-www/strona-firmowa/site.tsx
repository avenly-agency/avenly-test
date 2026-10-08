import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock, MapPin, Menu, MousePointer2 } from 'lucide-react';
import type { CompanyCopy } from '@/lib/i18n/uslugi/strona-firmowa';

// MAKIETA STRONY FIRMOWEJ KLIENTA w kadrach („twojafirma.pl”) - sześć podstron jednej strony: strona główna, trzy
// podstrony usług, O nas, Kontakt. Zaprojektowana strona (nie kreski), ale W JĘZYKU TEJ PODSTRONY: czerń, biel, włosowe
// linie i szmaragd. Decyzja właściciela 2026-10-02: „mniej pastelowe i pasujące do całej strony, żeby nikt nie pomyślał,
// że to jest ta strona, tylko makieta” - pierwsza wersja (jasny kamień + limonka, błękit, brzoskwinia) wyglądała jak
// osobna, prawdziwa strona w obcych kolorach. NIE wracać do jasnej, pastelowej makiety.
// Nośnikiem STRUKTURY jest materiał usługi (1 szmaragd, 2 biel, 3 głęboka zieleń z obwódką) - każda usługa ma go w menu,
// na karcie na stronie głównej, na własnej podstronie i w formularzu kontaktu („każda usługa ma swoje miejsce”).
// Teksty mówią, co stoi w danym miejscu („Nagłówek Twojej firmy.”) - przykład, nie udawana realizacja.
// Wymiary w em od jednej wielkości liczonej z szerokości okna kadru (cqw); wąskie okno = układ na telefon (@container
// w strona-firmowa.css). Makieta jest tylko do oglądania - bez miejsc do klikania (decyzja właściciela 2026-10-02).
// Stan sterują zmienne CSS ze scen: --menu (rozwinięte menu usług), --m1 / --m2 (kursor: do „Usługi”, do pozycji menu),
// --k1 / --k2 / --k3 (kliknięcia), --q (kursor przy „Zapytaj o tę usługę”), --f1..3 (pola formularza), --cx / --k / --sent.
// W filmie klient wybiera TRZECIĄ usługę (jej znacznik ma też pole w formularzu kontaktu i powiadomienie o zapytaniu).

type Site = CompanyCopy['site'];
export type PageId = 'home' | 's0' | 's1' | 's2' | 'about' | 'contact';
/** Kolejność pięter w scenie (film.tsx): strona główna, trzy podstrony usług, kontakt (klient zjeżdża do niego prosto
    z podstrony usługi), na samym dole O nas. */
export const PAGES: PageId[] = ['home', 's0', 's1', 's2', 'contact', 'about'];

/** Adres podstrony w pasku kadru. */
export const pageUrl = (t: Site, id: PageId) => {
  if (id === 'home') return t.domain;
  if (id === 'about') return `${t.domain}/${t.paths.about}`;
  if (id === 'contact') return `${t.domain}/${t.paths.contact}`;
  return `${t.domain}/${t.paths.services}/${t.services[Number(id[1])].slug}`;
};
/** Nazwa podstrony (zakładki, mapa strony). */
export const pageName = (t: Site, id: PageId, home: string) => {
  if (id === 'home') return home;
  if (id === 'about') return t.nav.about;
  if (id === 'contact') return t.nav.contact;
  return t.services[Number(id[1])].name;
};

/** Materiał usługi: wypełnienie, tekst na nim, obwódka / linia i ton pośredni (wartości --st-* w strona-firmowa.css). */
const color = (i: number) => {
  const n = i + 1;
  return { '--c': `var(--st-c${n})`, '--ct': `var(--st-t${n})`, '--cb': `var(--st-b${n})`, '--cm': `var(--st-m${n})` } as CSSProperties;
};

const Nav = ({ t, active }: { t: Site; active: PageId }) => (
  <div className="sf-st-nav">
    <span className="sf-st-logo"><i />{t.brand}</span>
    <span className="sf-st-links">
      <span className="sf-st-drop">
        <span className="sf-st-link" data-on={active.startsWith('s') ? '' : undefined}>
          {t.nav.services}<ChevronDown />
          <i className="sf-st-tap sf-st-tap--1" />
        </span>
        <span className="sf-st-menu">
          {t.services.map((s, i) => (
            <span key={s.slug} className="sf-st-menu-i" data-on={active === `s${i}` ? '' : undefined} style={color(i)}>
              <i />{s.name}<ArrowRight />
              {i === 2 && <span className="sf-st-tap sf-st-tap--2" />}
            </span>
          ))}
        </span>
        <span className="sf-st-cur sf-st-cur--menu"><MousePointer2 /></span>
      </span>
      <span className="sf-st-link" data-on={active === 'about' ? '' : undefined}>{t.nav.about}</span>
      <span className="sf-st-link">{t.nav.work}</span>
      <span className="sf-st-link" data-on={active === 'contact' ? '' : undefined}>{t.nav.contact}</span>
      <span className="sf-st-navbtn">{t.navCta}</span>
    </span>
    <span className="sf-st-burger"><Menu /><i className="sf-st-tap sf-st-tap--1" /></span>
  </div>
);

const Foot = ({ t }: { t: Site }) => (
  <div className="sf-st-foot">
    <span className="sf-st-logo"><i />{t.brand}</span>
    <span>{t.foot}</span>
  </div>
);

const HomePage = ({ t }: { t: Site }) => (
  <div className="sf-st-in">
    <Nav t={t} active="home" />
    <div className="sf-st-hero">
      <div>
        <p className="sf-st-eyebrow"><i />{t.home.eyebrow}</p>
        <p className="sf-st-h1">{t.home.title}</p>
        <p className="sf-st-p">{t.home.lead}</p>
        <div className="sf-st-actions">
          <span className="sf-st-btn">{t.home.cta}<ArrowUpRight /></span>
          <span className="sf-st-ghost">{t.home.link}</span>
        </div>
      </div>
      <div className="sf-st-art">
        <i className="sf-st-art-a" /><i className="sf-st-art-b" /><i className="sf-st-art-c" /><i className="sf-st-art-d" />
      </div>
    </div>
    <div className="sf-st-svc">
      <div className="sf-st-head">
        <p className="sf-st-h2">{t.home.servicesTitle}</p>
        <p className="sf-st-s">{t.home.servicesLead}</p>
      </div>
      <div className="sf-st-cards">
        {t.services.map((s, i) => (
          <div key={s.slug} className="sf-st-card" style={color(i)}>
            <span className="sf-st-card-art" data-v={i}><i /><i /></span>
            <p className="sf-st-h3">{s.name}</p>
            <p className="sf-st-s">{s.text}</p>
            <span className="sf-st-card-go"><ArrowUpRight /></span>
          </div>
        ))}
      </div>
    </div>
    <div className="sf-st-cta">
      <p className="sf-st-h2">{t.contact.title}</p>
      <span className="sf-st-btn">{t.navCta}<ArrowUpRight /></span>
    </div>
    <Foot t={t} />
  </div>
);

const ServicePage = ({ t, i }: { t: Site; i: number }) => {
  const s = t.services[i];
  return (
    <div className="sf-st-in">
      <Nav t={t} active={`s${i}` as PageId} />
      <div className="sf-st-band">
        <div>
          <p className="sf-st-crumb">{t.nav.services}<span>/</span>{s.name}</p>
          <p className="sf-st-h1">{s.name}</p>
          <p className="sf-st-p">{t.service.lead}</p>
        </div>
        <div className="sf-st-band-art" data-v={i}><i /><i /><i /></div>
      </div>
      <div className="sf-st-body" data-anchor="body">
        <div className="sf-st-points">
          {t.service.points.map((p, k) => (
            <div key={p.title} className="sf-st-point">
              <span className="sf-st-point-n">{`0${k + 1}`}</span>
              <p className="sf-st-h3">{p.title}</p>
              <p className="sf-st-s">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="sf-st-aside">
          <p className="sf-st-h3">{s.name}</p>
          <p className="sf-st-s">{t.service.aside}</p>
          <span className="sf-st-btn sf-st-ask">
            {t.service.cta}<ArrowUpRight />
            <span className="sf-st-tap sf-st-tap--3" />
            <span className="sf-st-cur sf-st-cur--ask"><MousePointer2 /></span>
          </span>
        </div>
      </div>
      <Foot t={t} />
    </div>
  );
};

const AboutPage = ({ t }: { t: Site }) => (
  <div className="sf-st-in">
    <Nav t={t} active="about" />
    <div className="sf-st-about">
      <div>
        <p className="sf-st-crumb">{t.nav.about}</p>
        <p className="sf-st-h1">{t.about.title}</p>
        <p className="sf-st-p">{t.about.lead}</p>
      </div>
      <div className="sf-st-stats">
        {t.about.stats.map((s) => (
          <div key={s.label}><b>{s.num}</b><span>{s.label}</span></div>
        ))}
      </div>
    </div>
    <div className="sf-st-team">
      {[0, 1, 2].map((k) => (
        <div key={k} className="sf-st-person" style={color(k)}>
          <span className="sf-st-photo"><i /><i /></span>
          <p className="sf-st-h3">{t.about.teamName}</p>
          <p className="sf-st-s">{t.about.teamRole}</p>
        </div>
      ))}
    </div>
    <Foot t={t} />
  </div>
);

const ContactPage = ({ t }: { t: Site }) => (
  <div className="sf-st-in">
    <Nav t={t} active="contact" />
    <div className="sf-st-contact">
      <div className="sf-st-contact-l">
        <p className="sf-st-crumb">{t.nav.contact}</p>
        <p className="sf-st-h1">{t.contact.title}</p>
        <p className="sf-st-p">{t.contact.lead}</p>
        <div className="sf-st-place">
          <span className="sf-st-map"><i /><i /><b /></span>
          <p className="sf-st-lines">
            <span><MapPin />{t.contact.lines[0]}</span>
            <span><Clock />{t.contact.lines[1]}</span>
          </p>
        </div>
        <div className="sf-st-review">
          <p className="sf-st-review-h">{t.contact.reviewsTitle}</p>
          <p className="sf-st-review-q">{t.contact.review}</p>
          <p className="sf-st-s">{t.contact.reviewBy}</p>
        </div>
      </div>
      <div className="sf-st-form" data-anchor="form">
        {t.contact.fields.map((fl, i) => (
          <div key={fl.label} className="sf-st-field" data-pick={i === 2 ? '' : undefined}>
            <span className="sf-st-lab">{fl.label}</span>
            <span className="sf-st-val" style={{ '--f': `var(--f${i + 1}, 1)` } as CSSProperties}>{i === 2 && <i />}{fl.value}</span>
            {i === 2 && <ChevronDown />}
          </div>
        ))}
        <span className="sf-st-btn sf-st-send">
          <span className="sf-st-send-a">{t.contact.submit}</span>
          <span className="sf-st-send-b"><Check />{t.contact.sent}</span>
          <span className="sf-st-cur sf-st-cur--send"><MousePointer2 /></span>
        </span>
      </div>
    </div>
    <Foot t={t} />
  </div>
);

/** Jedna podstrona przykładowej strony firmowej. */
export const Page = ({ t, id }: { t: Site; id: PageId }) => {
  const svc = id.startsWith('s') ? Number(id[1]) : -1;
  return (
    <div className="sf-st" data-page={id} style={svc >= 0 ? color(svc) : color(id === 'contact' ? 2 : 0)}>
      {id === 'home' && <HomePage t={t} />}
      {svc >= 0 && <ServicePage t={t} i={svc} />}
      {id === 'about' && <AboutPage t={t} />}
      {id === 'contact' && <ContactPage t={t} />}
    </div>
  );
};
