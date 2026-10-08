'use client';

import type { ONasDict } from '@/lib/i18n/o-nas';
import { OnCraft, OnFaq, OnSecHead, nn, useDepth, useInView } from '../parts';

// Propozycja "KOREKTA": strona jak tekst po korekcie. Na planszy tytułowej pióro skreśla
// "wykonawcą", a po nim wchodzi "partnerem." (intro.tsx, w takt przewijania). Niżej to samo
// z przyzwyczajeniami agencji: kreska przechodzi przez stare słowa dokładnie wtedy, gdy wiersz
// przejeżdża przez ekran (useDepth), a po niej wchodzi to, co robimy.

/** Druga linia h1 dla planszy tytułowej. Skreślone słowo jest tylko grafiką (CSS content) -
    czytnik ekranu i Google czytają "Jesteśmy Twoim partnerem." */
export const KorektaAccent = ({ t }: { t: ONasDict }) => (
  <span className="on-h1-l on-l2">
    <span className="on-h1-i">
      {t.korekta.before}{' '}
      <span className="on-x" data-w={t.korekta.struck} aria-hidden="true" />
      <span className="on-ins im-accent">{t.korekta.accent}</span>
    </span>
  </span>
);

const Row = ({ row, i }: { row: ONasDict['korekta']['rows'][number]; i: number }) => {
  const ref = useInView<HTMLLIElement>('0px 0px -22% 0px');
  useDepth(ref);
  return (
    <li ref={ref} className="on-kx-row">
      <span className="on-num" aria-hidden="true">{nn(i)}</span>
      <p className="on-kx-from"><del className="on-kx-del">{row.from}</del></p>
      <div className="on-kx-to">
        <h3 className="on-kx-new">{row.to}</h3>
        <p className="on-p">{row.desc}</p>
      </div>
    </li>
  );
};

export const KorektaPage = ({ t }: { t: ONasDict }) => (
  <>
    <section className="on-sec on-kx" aria-labelledby="on-kx-h">
      <div className="container mx-auto px-6">
        <div className="on-body">
          <OnSecHead id="on-kx-h" heading={t.korekta.heading} lead={t.korekta.lead} className="on-kx-head" />
          <ol className="on-kx-list">
            {t.korekta.rows.map((row, i) => <Row key={row.to} row={row} i={i} />)}
          </ol>
        </div>
      </div>
    </section>
    <OnCraft t={t} />
    <OnFaq t={t} />
  </>
);
