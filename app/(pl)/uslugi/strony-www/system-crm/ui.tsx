import type { ReactNode } from 'react';
import type { SystemCrmCopy } from '@/lib/i18n/uslugi/system-crm';

// Wspólne części przykładowego systemu na podstronie „System CRM” (chat 11, style cr- w system-crm.css):
//   Win - okno systemu: czerń z kryciem, ostry refleks u góry, pasek z nazwą przykładowej firmy i etykietą
//         „Przykładowy system” (decyzja właściciela z fali 2: przykład ma być wyraźnie przykładem). To NIE jest kadr
//         przeglądarki z podstron stron WWW - bez paska adresu. `data-sky` = blask mgławicy siada wokół okna.
//   Av  - inicjał osoby z zespołu przykładowej firmy.

export const Win = ({ app, children, className }: { app: SystemCrmCopy['app']; children: ReactNode; className?: string }) => (
  <div className={className ? `cr-win ${className}` : 'cr-win'} data-sky="">
    <div className="cr-win-bar">
      <span className="cr-win-mark" aria-hidden="true" />
      <span className="cr-win-name">{app.name}</span>
      <span className="cr-win-sub">{app.sub}</span>
      <span className="cr-win-badge">{app.badge}</span>
    </div>
    {children}
  </div>
);

export const Av = ({ name }: { name: string }) => (
  <span className="cr-av" aria-hidden="true">{name.charAt(0)}</span>
);
