'use client';

import { useRef, type CSSProperties } from 'react';
import {
  ClosingTitle, ConsultButton, ContactCol, LegalBar, NavCol, ServicesCol, useFooterReveal, type FooterCtx,
} from './shared';

// Stopka - KROPKA, zakończenie „Nad i” (wybór właściciela 2026-09-28 z propozycji Kropka / Wizytówka /
// Na żywo / Żaluzje / Obecna oraz zakończeń Nad i / Linia / Finał). Tytuł „Postaw kropkę nad i”: kropka nad
// ostatnim „i” to niebieska kropka marki, która przy wejściu spada na literę (przy lądowaniu jeden cienki
// pierścień, potem co 12 s przebiega po niej błysk). Wielki napis AVENLY na dole odrzucony („nie siedzi”,
// powtarzał logotyp z hero) - nie przywracać bez prośby.

/** Tytuł, w którym kropka nad ostatnim „i” jest kropką marki. Czytnik ekranu czyta zwykły tekst; wersja
    wizualna ma „ı” (bez kropki) i osobny element kropki. Tytuł bez „i” na końcu = zwykły tytuł z kropką. */
const DotTitle = ({ text }: { text: string }) => {
  if (!text.endsWith('i')) return <ClosingTitle text={text} />;
  return (
    <h2 className="ft-title">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, -1)}
        <span className="ft-i">ı<i className="ft-i-dot" /></span>
      </span>
    </h2>
  );
};

export const DotFooter = ({ ctx }: { ctx: FooterCtx }) => {
  const ref = useRef<HTMLDivElement>(null);
  useFooterReveal(ref);
  const { t } = ctx;

  return (
    <div ref={ref} className="ft-v">
      <div className="container mx-auto px-6">
        <div className="ft-grid">
          <div className="ft-intro ft-rv">
            <DotTitle text={t.dot.title} />
            <p className="ft-lead">{t.dot.lead}</p>
            <ConsultButton ctx={ctx} />
          </div>
          <div className="ft-cols ft-rv" style={{ '--d': 1 } as CSSProperties}>
            <ServicesCol ctx={ctx} />
            <NavCol ctx={ctx} />
            <ContactCol ctx={ctx} />
          </div>
        </div>
        <LegalBar ctx={ctx} className="ft-rv" />
      </div>
    </div>
  );
};
