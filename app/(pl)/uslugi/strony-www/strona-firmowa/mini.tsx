import type { CSSProperties } from 'react';
import type { CompanyCopy } from '@/lib/i18n/uslugi/strona-firmowa';

// MAKIETY PODSTRON dla sekcji „3 podstrony to dopiero początek” (karty w pages.tsx): każda z 27 podstron przykładowej
// strony (strona główna, trzy usługi, O nas, Kontakt, 20 nazw z dawnej listy, „+ co potrzebujesz”) ma własny adres
// i własny układ treści z prostych bloków CSS (.sf-mi w strona-firmowa.css), w palecie makiety (czerń, biel, szmaragd).
// Makieta to dekoracja (aria-hidden u rodzica) - nazwę podstrony czyta podpis karty.

export type MapCopy = CompanyCopy['map'];
export type Site = CompanyCopy['site'];
type Kind = 'home' | 'svc' | 'people' | 'form' | 'list' | 'faq' | 'grid' | 'logos' | 'table' | 'calc' | 'quote' | 'map' | 'text' | 'lang' | 'book' | 'files' | 'more';
export interface Entry { name: string; kind: Kind; url: string; mat: number }

/** Układ makiety dla 20 nazw z `map.items` - W KOLEJNOŚCI SŁOWNIKA (PL i EN mają tę samą): blog, FAQ, cennik,
    portfolio, referencje, galeria, newsletter, kariera, aktualności, wydarzenia, kalkulator, zespół, mapy, polityka,
    języki, rezerwacje, formularze, pasek opinii, logo klientów, strefa pobrań. */
const EXTRA: Kind[] = ['list', 'faq', 'table', 'grid', 'quote', 'grid', 'form', 'list', 'list', 'book', 'calc', 'people', 'map', 'text', 'lang', 'book', 'form', 'quote', 'logos', 'files'];

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export const entriesOf = (t: MapCopy, site: Site): Entry[] => [
  { name: t.home, kind: 'home', url: site.domain, mat: 0 },
  ...site.services.map((s, i): Entry => ({ name: s.name, kind: 'svc', url: `${site.domain}/${site.paths.services}/${s.slug}`, mat: i })),
  { name: site.nav.about, kind: 'people', url: `${site.domain}/${site.paths.about}`, mat: 0 },
  { name: site.nav.contact, kind: 'form', url: `${site.domain}/${site.paths.contact}`, mat: 0 },
  ...t.items.map((name, k): Entry => ({ name, kind: EXTRA[k] ?? 'text', url: `${site.domain}/${slug(name)}`, mat: k })),
  { name: t.more, kind: 'more', url: `${site.domain}/…`, mat: 0 },
];
/** Materiał usługi (wartości --st-* w strona-firmowa.css) - jak color() w site.tsx. */
export const mat = (i: number) => {
  const n = (i % 3) + 1;
  return { '--c': `var(--st-c${n})`, '--ct': `var(--st-t${n})`, '--cb': `var(--st-b${n})` } as CSSProperties;
};
export const nn = (i: number) => String(i + 1).padStart(2, '0');

const L = ({ w, b }: { w: number; b?: boolean }) => <i className="sf-mi-l" data-b={b ? '' : undefined} style={{ '--w': `${w}%` } as CSSProperties} />;

const Body = ({ kind }: { kind: Kind }) => {
  switch (kind) {
    case 'home': return (
      <div className="sf-mi-split">
        <div className="sf-mi-stack"><L w={88} b /><L w={64} /><i className="sf-mi-btn" /></div>
        <div className="sf-mi-mats"><i /><i /><i /></div>
      </div>
    );
    case 'svc': return (
      <>
        <div className="sf-mi-band"><L w={44} b /><L w={30} /></div>
        <div className="sf-mi-three">{[0, 1, 2].map((k) => <span key={k} className="sf-mi-box"><L w={56} b /><L w={80} /></span>)}</div>
      </>
    );
    case 'people': return (
      <div className="sf-mi-three">{[0, 1, 2].map((k) => <span key={k} className="sf-mi-box sf-mi-person"><i /><L w={72} b /><L w={48} /></span>)}</div>
    );
    case 'form': return (
      <div className="sf-mi-split">
        <div className="sf-mi-stack"><L w={84} b /><L w={62} /><L w={72} /></div>
        <div className="sf-mi-form"><i /><i /><i className="sf-mi-btn" data-ac="" /></div>
      </div>
    );
    case 'list': return (
      <div className="sf-mi-rows">
        {[[72, 44], [58, 50], [66, 38]].map(([a, b], k) => (
          <span key={k} className="sf-mi-row"><i className="sf-mi-th" /><span className="sf-mi-stack"><L w={a} b /><L w={b} /></span></span>
        ))}
      </div>
    );
    case 'faq': return (
      <div className="sf-mi-rows">
        <span className="sf-mi-q" data-open=""><L w={58} b /><L w={92} /><L w={70} /></span>
        <span className="sf-mi-q"><L w={46} b /></span>
        <span className="sf-mi-q"><L w={64} b /></span>
      </div>
    );
    case 'grid': return <div className="sf-mi-grid">{[0, 1, 2, 3, 4, 5].map((k) => <i key={k} />)}</div>;
    case 'logos': return <div className="sf-mi-grid" data-logos="">{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <i key={k} />)}</div>;
    case 'table': return (
      <div className="sf-mi-three">
        {[0, 1, 2].map((k) => (
          <span key={k} className="sf-mi-box sf-mi-price" data-hot={k === 1 ? '' : undefined}><L w={50} /><b /><L w={76} /><L w={60} /><i className="sf-mi-btn" /></span>
        ))}
      </div>
    );
    case 'calc': return (
      <div className="sf-mi-split">
        <div className="sf-mi-stack">
          {[62, 34, 78].map((w) => <i key={w} className="sf-mi-sl" style={{ '--w': `${w}%` } as CSSProperties} />)}
        </div>
        <span className="sf-mi-box"><L w={42} /><b className="sf-mi-big" /><i className="sf-mi-btn" data-ac="" /></span>
      </div>
    );
    case 'quote': return (
      <div className="sf-mi-quote"><b>”</b><L w={90} b /><L w={76} b /><L w={54} b /><span className="sf-mi-by"><i /><L w={30} /></span></div>
    );
    case 'map': return (
      <div className="sf-mi-split">
        <span className="sf-st-map sf-mi-map"><i /><i /><b /></span>
        <div className="sf-mi-stack"><L w={82} b /><L w={60} /><L w={50} /></div>
      </div>
    );
    case 'text': return (
      <div className="sf-mi-stack sf-mi-text"><L w={30} b /><L w={96} /><L w={90} /><L w={94} /><L w={62} /><L w={26} b /><L w={92} /><L w={80} /></div>
    );
    case 'lang': return (
      <>
        <div className="sf-mi-langs"><b data-on="">PL</b><b>EN</b><b>DE</b></div>
        <div className="sf-mi-stack"><L w={70} b /><L w={88} /><L w={58} /></div>
      </>
    );
    case 'book': return (
      <div className="sf-mi-split">
        <div className="sf-mi-cal">{Array.from({ length: 21 }, (_, k) => <i key={k} data-on={k === 9 ? '' : undefined} />)}</div>
        <div className="sf-mi-stack sf-mi-slots"><i /><i data-on="" /><i /></div>
      </div>
    );
    case 'files': return (
      <div className="sf-mi-rows" data-files="">
        {[64, 52, 70].map((w) => (
          <span key={w} className="sf-mi-row"><i className="sf-mi-file" /><span className="sf-mi-stack"><L w={w} b /><L w={34} /></span><i className="sf-mi-dl" /></span>
        ))}
      </div>
    );
    default: return <div className="sf-mi-more"><b>+</b></div>;
  }
};

/** Makieta jednej podstrony: menu (zapalona pozycja tej podstrony), nazwa i układ treści. */
export const Mini = ({ en, brand }: { en: Entry; brand: string }) => (
  <div className="sf-mi" data-k={en.kind} style={mat(en.mat)}>
    <div className="sf-mi-in">
      <div className="sf-mi-nav">
        <span className="sf-st-logo"><i />{brand}</span>
        <span className="sf-mi-menu"><i /><i /><i data-on={en.kind === 'home' ? undefined : ''} /><i /></span>
      </div>
      <p className="sf-mi-h">{en.name}</p>
      <div className="sf-mi-b"><Body kind={en.kind} /></div>
    </div>
  </div>
);
