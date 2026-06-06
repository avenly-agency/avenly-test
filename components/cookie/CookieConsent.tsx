'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Cookie, Settings2, X } from 'lucide-react';
import {
  COOKIE_CATEGORIES,
  CONSENT_PRESETS,
  OPEN_SETTINGS_EVENT,
  readConsent,
  saveConsent,
  type ConsentState,
  type CookieCategory,
} from '@/lib/cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [prefs, setPrefs] = useState<ConsentState>(() => CONSENT_PRESETS.denied());

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setPrefs(existing);
      setHasExisting(true);
    } else {
      // Pierwsza wizyta / wygasła zgoda - pokaż baner po hydration
      setVisible(true);
    }

    // Ponowne otwarcie panelu (link „Ustawienia cookies" w stopce)
    const onOpen = () => {
      const cur = readConsent();
      setPrefs(cur ?? CONSENT_PRESETS.denied());
      setHasExisting(!!cur);
      setSettings(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  const commit = (c: ConsentState) => {
    saveConsent(c);
    setHasExisting(true);
    setVisible(false);
    setSettings(false);
  };

  const acceptAll = () => commit(CONSENT_PRESETS.granted());
  const rejectAll = () => commit(CONSENT_PRESETS.denied());
  const saveChoice = () => commit(prefs);

  // Zamknięcie bez wyboru dozwolone TYLKO gdy istnieje już zapisana zgoda
  const dismiss = () => {
    if (!hasExisting) return;
    setVisible(false);
    setSettings(false);
  };

  const toggle = (k: CookieCategory) =>
    setPrefs((p) => (k === 'necessary' ? p : { ...p, [k]: !p[k] }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-consent"
          role="dialog"
          aria-label="Zgoda na pliki cookies"
          aria-modal={settings}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-[120] inset-x-3 bottom-3 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[24rem] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] overflow-y-auto no-scrollbar overscroll-contain rounded-2xl border border-white/12 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_24px_70px_-20px_rgba(0,0,0,0.85)]"
        >
          {/* Akcent brandowy */}
          <div
            aria-hidden="true"
            className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-40 pointer-events-none"
          />

          <div className="relative p-5 sm:p-6">
            {hasExisting && (
              <button
                type="button"
                onClick={dismiss}
                aria-label="Zamknij"
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            )}

            <div className="flex items-center gap-3 mb-3 pr-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Cookie size={20} />
              </div>
              <h2 className="text-white font-bold text-base sm:text-lg leading-tight">
                Szanujemy Twoją prywatność
              </h2>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Używamy plików cookies, aby strona działała poprawnie, a za Twoją zgodą - również
              do analityki i marketingu. Szczegóły znajdziesz w{' '}
              <Link href="/polityka-prywatnosci" className="text-blue-400 hover:underline">
                Polityce prywatności
              </Link>
              .
            </p>

            {/* Granularne ustawienia */}
            <AnimatePresence initial={false}>
              {settings && (
                <motion.div
                  key="opts"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mb-4 pt-1">
                    {COOKIE_CATEGORIES.map((cat) => (
                      <div
                        key={cat.key}
                        className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-3"
                      >
                        <div>
                          <div className="text-white text-sm font-semibold">{cat.title}</div>
                          <div className="text-slate-500 text-xs leading-relaxed mt-0.5">{cat.desc}</div>
                        </div>
                        {cat.required ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 shrink-0 mt-1 whitespace-nowrap">
                            Zawsze aktywne
                          </span>
                        ) : (
                          <Toggle on={prefs[cat.key]} onClick={() => toggle(cat.key)} label={cat.title} />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Akcje - „Odrzuć" i „Akceptuj" równorzędne (wymóg RODO) */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={rejectAll}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 text-white text-sm font-bold hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Odrzuć wszystkie
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Akceptuj wszystkie
                </button>
              </div>

              {settings ? (
                <button
                  type="button"
                  onClick={saveChoice}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  Zapisz wybór
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSettings(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <Settings2 size={15} /> Dostosuj ustawienia
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5 cursor-pointer ${on ? 'bg-blue-500' : 'bg-white/15'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${on ? 'translate-x-5' : ''}`}
      />
    </button>
  );
}
