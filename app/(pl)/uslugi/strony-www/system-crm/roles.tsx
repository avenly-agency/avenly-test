'use client';

import { CalendarDays, Lock } from 'lucide-react';
import type { CrmRole, SystemCrmCopy } from '@/lib/i18n/uslugi/system-crm';
import { Av } from './ui';

// „ROLE” (punkt Oferty: „Każdy widzi to, co powinien”). Jeden system, trzy role WEWNĄTRZ firmy: właściciel widzi
// całą firmę, biuro zlecenia, klientów i terminy, pracownik tylko swoje zadania. Bez roli klienta (właściciel
// 2026-10-05: widoku klienta na własne zlecenie nie można obiecać w każdym systemie). Boczne menu jest to samo
// w każdej roli, zmienia się tylko to, co zamknięte. Odhaczenie montażu przez pracownika zmienia status zlecenia
// w biurze i liczby u właściciela.
//   RoleBody - widok jednej roli (menu + treść), tylko do oglądania albo z odhaczaniem (prop onDone). Używają go sceny
//   sekcji „Każdy widzi to, co powinien” (eyes-*.tsx). Wersja do klikania z przełącznikiem ról usunięta w rundzie 3.

/** Moduły (indeksy w `roles.modules`) otwarte w danej roli i moduł, na który rola właśnie patrzy. */
const OPEN: Record<CrmRole, number[]> = { owner: [0, 1, 2, 3, 4, 5], office: [0, 1, 2, 3], staff: [1, 3] };
const CURRENT: Record<CrmRole, number> = { owner: 0, office: 1, staff: 1 };

/** Lista zleceń ze statusami (u właściciela i w biurze): status pierwszego zlecenia zmienia się po odhaczeniu montażu. */
const Rows = ({ t, done }: { t: SystemCrmCopy; done: boolean }) => (
  <ul className="cr-c-rows">
    {t.roles.owner.rows.map((row) => (
      <li key={row.t}>
        <span className="cr-c-row-t">{row.t}</span>
        <span className="cr-chip" data-fresh={done && row.stDone ? '' : undefined}>
          {done && row.stDone ? row.stDone : row.st}
        </span>
        <span className="cr-c-row-s"><Av name={t.team[row.who].name} />{row.c} · {t.team[row.who].name}</span>
      </li>
    ))}
  </ul>
);

export const RoleBody = ({ t, role, done, onDone }: {
  t: SystemCrmCopy; role: CrmRole;
  /** Pracownik odhaczył montaż. */
  done: boolean;
  /** Brak = widok tylko do oglądania (scena), pola wyboru bez fokusu. */
  onDone?: (v: boolean) => void;
}) => {
  const r = t.roles;
  return (
    <div className="cr-c-body">
      <ul className="cr-side">
        {r.modules.map((mod, i) => {
          const open = OPEN[role].includes(i);
          return (
            <li key={mod} data-off={open ? undefined : ''} data-cur={CURRENT[role] === i ? '' : undefined}>
              {mod}
              {!open && (
                <>
                  <Lock aria-hidden="true" />
                  <span className="sr-only">({r.locked})</span>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {role === 'owner' && (
        <div className="cr-c-view">
          <h3 className="cr-h3">{r.owner.title}</h3>
          <div className="cr-c-stats">
            {r.owner.stats.map((s) => (
              <div key={s.l} className="cr-c-stat">
                <b data-fresh={done && s.v !== s.vDone ? '' : undefined}>{done ? s.vDone : s.v}</b>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
          <p className="cr-c-sub">{r.owner.listTitle}</p>
          <Rows t={t} done={done} />
        </div>
      )}

      {role === 'office' && (
        <div className="cr-c-view">
          <h3 className="cr-h3">{r.office.title}</h3>
          <Rows t={t} done={done} />
          <div className="cr-c-cal">
            <p className="cr-c-sub">{r.office.calTitle}</p>
            <ul className="cr-c-docs">
              {r.office.cal.map((d) => <li key={d}><CalendarDays aria-hidden="true" />{d}</li>)}
            </ul>
          </div>
        </div>
      )}

      {role === 'staff' && (
        <div className="cr-c-view">
          <h3 className="cr-h3">{r.staff.title}</h3>
          <ul className="cr-c-tasks">
            {r.staff.tasks.map((task, i) => (
              <li key={task.t}>
                <label className="cr-check">
                  {i === 0 && onDone && <input type="checkbox" checked={done} onChange={(e) => onDone(e.target.checked)} />}
                  {i === 0 && !onDone && <input type="checkbox" checked={done} readOnly tabIndex={-1} />}
                  {i > 0 && <input type="checkbox" tabIndex={onDone ? undefined : -1} />}
                  <span className="cr-check-t"><b>{task.t}</b><span>{task.s}</span></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
