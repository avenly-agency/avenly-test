/**
 * System zgody na cookies (RODO/GDPR) dla static export.
 *
 * Źródło prawdy: localStorage (`avenly-cookie-consent`) + mirror w cookie `cookie_consent`
 * (zgodny z Polityką Prywatności, ważność 12 miesięcy). Brak backendu - decyzja
 * trzymana po stronie klienta.
 *
 * Kategorie zgodne z rozdziałem 5 Polityki Prywatności:
 *  - necessary  (zawsze aktywne, bez zgody)
 *  - functional (preferencje: język, motyw)
 *  - analytics  (np. Google Analytics)
 *  - marketing  (np. Meta, Google Ads, LinkedIn)
 *
 * Użycie w przyszłych skryptach (przed załadowaniem GA/Meta):
 *   import { hasConsent } from '@/lib/cookie-consent';
 *   if (hasConsent('analytics')) { ...załaduj GA... }
 *   window.addEventListener('avenly:cookie-consent-change', (e) => { ... });
 */

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';
export type ConsentState = Record<CookieCategory, boolean>;

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = 'avenly-cookie-consent';
export const CONSENT_MAX_AGE_DAYS = 365;

/** Event emitowany po każdej zmianie zgody (detail: ConsentState). */
export const CONSENT_CHANGE_EVENT = 'avenly:cookie-consent-change';
/** Event do ponownego otwarcia panelu ustawień (np. z linku w stopce). */
export const OPEN_SETTINGS_EVENT = 'avenly:open-cookie-settings';

export const COOKIE_CATEGORIES: {
  key: CookieCategory;
  title: string;
  desc: string;
  required?: boolean;
}[] = [
  {
    key: 'necessary',
    title: 'Niezbędne',
    desc: 'Wymagane do działania strony: sesja, bezpieczeństwo i zapamiętanie Twojej zgody.',
    required: true,
  },
  {
    key: 'functional',
    title: 'Funkcjonalne',
    desc: 'Zapamiętują Twoje preferencje, np. język czy motyw strony.',
  },
  {
    key: 'analytics',
    title: 'Analityczne',
    desc: 'Pomagają nam zrozumieć, jak korzystasz ze strony (np. Google Analytics).',
  },
  {
    key: 'marketing',
    title: 'Marketingowe',
    desc: 'Pozwalają wyświetlać dopasowane reklamy i mierzyć skuteczność kampanii.',
  },
];

const DENIED: ConsentState = { necessary: true, functional: false, analytics: false, marketing: false };
const GRANTED: ConsentState = { necessary: true, functional: true, analytics: true, marketing: true };

export const CONSENT_PRESETS = {
  /** Domyślny stan przed wyborem oraz po „Odrzuć wszystkie" - tylko niezbędne. */
  denied: (): ConsentState => ({ ...DENIED }),
  /** Po „Akceptuj wszystkie". */
  granted: (): ConsentState => ({ ...GRANTED }),
};

interface StoredConsent {
  v: number;
  ts: number;
  categories: ConsentState;
}

/** Zwraca zapisaną zgodę albo null gdy brak / wygasła / inna wersja. */
export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.v !== CONSENT_VERSION || typeof parsed.ts !== 'number') return null;
    const ageDays = (Date.now() - parsed.ts) / 86_400_000;
    if (ageDays > CONSENT_MAX_AGE_DAYS) return null;
    return { ...DENIED, ...parsed.categories, necessary: true };
  } catch {
    return null;
  }
}

/** Zapisuje zgodę (localStorage + cookie 12 mies.) i emituje event zmiany. */
export function saveConsent(categories: ConsentState): void {
  if (typeof window === 'undefined') return;
  const normalized: ConsentState = { ...categories, necessary: true };
  const payload: StoredConsent = { v: CONSENT_VERSION, ts: Date.now(), categories: normalized };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    const flags = `${normalized.analytics ? 1 : 0}${normalized.marketing ? 1 : 0}${normalized.functional ? 1 : 0}`;
    document.cookie = `cookie_consent=${flags}; max-age=${CONSENT_MAX_AGE_DAYS * 86_400}; path=/; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: normalized }));
  } catch {
    /* localStorage może być niedostępny (tryb prywatny) - po cichu ignorujemy */
  }
}

/** Czy użytkownik wyraził zgodę na daną kategorię (necessary zawsze true). */
export function hasConsent(category: CookieCategory): boolean {
  if (category === 'necessary') return true;
  const c = readConsent();
  return c ? !!c[category] : false;
}
