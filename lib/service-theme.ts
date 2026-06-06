/**
 * Service Theme - per-podstrona main color tokens dla AvenlyAICta + Chatbot.
 *
 * Każda podstrona stron-www / chatboty-ai ma własny brand color (per CLAUDE.md
 * Navbar pathname theme system). Helper pozwala globalnym komponentom
 * (Chatbot bubble, CTA modal) reagować na pathname i wpisywać się w
 * spójność kolorystyczną danej podstrony.
 *
 * Tailwind v4 JIT wymaga że class names są verbatim w source - stąd object
 * lookup z explicit literals (NIE concat stringów z dynamic color).
 */

export type ServiceColor = 'blue' | 'emerald' | 'rose' | 'amber' | 'sky' | 'teal' | 'orange';

export interface ServiceTheme {
  /** Krótka nazwa koloru - dla conditional logic */
  color: ServiceColor;
  /** Solid color-500 bg (button primary, icon bg) */
  bg500: string;
  /** Hover light - used dla white button hover state */
  hoverBg50: string;
  /** Text accent jasny (inline accent w copy) */
  text300: string;
  /** Text accent średni (icon color) */
  text400: string;
  /** Border z 20% opacity (subtle dividers) */
  border20: string;
  /** Border z 30% opacity (cards) */
  border30: string;
  /** Border z 40% opacity (emphasized) */
  border40: string;
  /** bg z 10% opacity (subtle backgrounds) */
  bg10: string;
  /** bg z 15% opacity (chips, badges) */
  bg15: string;
  /** Gradient class start (from-{color}-600) */
  gradFrom600: string;
  /** Gradient class end (to-{secondaryColor}-600) */
  gradTo600: string;
  /** Shadow color z opacity dla glow effects (rgba string) */
  glowRgba: string;
  /** RGB string dla inline shadow (e.g. "59, 130, 246") */
  rgb: string;
  /** RGB string dla secondary gradient color */
  rgbSecondary: string;
  /** Hex code (dla potencjalnych embed graphic / SVG) */
  hex: string;
  /** Hex code dla gradient secondary color (np. indigo dla blue, teal dla emerald) */
  hexSecondary: string;
}

const THEMES: Record<ServiceColor, ServiceTheme> = {
  blue: {
    color: 'blue',
    bg500: 'bg-blue-500',
    hoverBg50: 'hover:bg-blue-50',
    text300: 'text-blue-300',
    text400: 'text-blue-400',
    border20: 'border-blue-500/20',
    border30: 'border-blue-500/30',
    border40: 'border-blue-500/40',
    bg10: 'bg-blue-500/10',
    bg15: 'bg-blue-500/15',
    gradFrom600: 'from-blue-600',
    gradTo600: 'to-indigo-600',
    glowRgba: 'rgba(37,99,235,0.4)',
    rgb: '59, 130, 246', rgbSecondary: '99, 102, 241',
    hex: '#3b82f6',
    hexSecondary: '#6366f1', // indigo-500
  },
  emerald: {
    color: 'emerald',
    bg500: 'bg-emerald-500',
    hoverBg50: 'hover:bg-emerald-50',
    text300: 'text-emerald-300',
    text400: 'text-emerald-400',
    border20: 'border-emerald-500/20',
    border30: 'border-emerald-500/30',
    border40: 'border-emerald-500/40',
    bg10: 'bg-emerald-500/10',
    bg15: 'bg-emerald-500/15',
    gradFrom600: 'from-emerald-600',
    gradTo600: 'to-teal-600',
    glowRgba: 'rgba(16,185,129,0.4)',
    rgb: '16, 185, 129', rgbSecondary: '20, 184, 166',
    hex: '#10b981',
    hexSecondary: '#14b8a6', // teal-500
  },
  rose: {
    color: 'rose',
    bg500: 'bg-rose-500',
    hoverBg50: 'hover:bg-rose-50',
    text300: 'text-rose-300',
    text400: 'text-rose-400',
    border20: 'border-rose-500/20',
    border30: 'border-rose-500/30',
    border40: 'border-rose-500/40',
    bg10: 'bg-rose-500/10',
    bg15: 'bg-rose-500/15',
    gradFrom600: 'from-rose-600',
    gradTo600: 'to-pink-600',
    glowRgba: 'rgba(244,63,94,0.4)',
    rgb: '244, 63, 94', rgbSecondary: '236, 72, 153',
    hex: '#f43f5e',
    hexSecondary: '#ec4899', // pink-500
  },
  amber: {
    color: 'amber',
    bg500: 'bg-amber-500',
    hoverBg50: 'hover:bg-amber-50',
    text300: 'text-amber-300',
    text400: 'text-amber-400',
    border20: 'border-amber-500/20',
    border30: 'border-amber-500/30',
    border40: 'border-amber-500/40',
    bg10: 'bg-amber-500/10',
    bg15: 'bg-amber-500/15',
    gradFrom600: 'from-amber-600',
    gradTo600: 'to-orange-600',
    glowRgba: 'rgba(245,158,11,0.4)',
    rgb: '245, 158, 11', rgbSecondary: '249, 115, 22',
    hex: '#f59e0b',
    hexSecondary: '#f97316', // orange-500
  },
  sky: {
    color: 'sky',
    bg500: 'bg-sky-500',
    hoverBg50: 'hover:bg-sky-50',
    text300: 'text-sky-300',
    text400: 'text-sky-400',
    border20: 'border-sky-500/20',
    border30: 'border-sky-500/30',
    border40: 'border-sky-500/40',
    bg10: 'bg-sky-500/10',
    bg15: 'bg-sky-500/15',
    gradFrom600: 'from-sky-600',
    gradTo600: 'to-blue-600',
    glowRgba: 'rgba(14,165,233,0.4)',
    rgb: '14, 165, 233', rgbSecondary: '59, 130, 246',
    hex: '#0ea5e9',
    hexSecondary: '#3b82f6', // blue-500
  },
  teal: {
    color: 'teal',
    bg500: 'bg-teal-500',
    hoverBg50: 'hover:bg-teal-50',
    text300: 'text-teal-300',
    text400: 'text-teal-400',
    border20: 'border-teal-500/20',
    border30: 'border-teal-500/30',
    border40: 'border-teal-500/40',
    bg10: 'bg-teal-500/10',
    bg15: 'bg-teal-500/15',
    gradFrom600: 'from-teal-600',
    gradTo600: 'to-cyan-600',
    glowRgba: 'rgba(20,184,166,0.4)',
    rgb: '20, 184, 166', rgbSecondary: '6, 182, 212',
    hex: '#14b8a6',
    hexSecondary: '#06b6d4', // cyan-500
  },
  orange: {
    color: 'orange',
    bg500: 'bg-orange-500',
    hoverBg50: 'hover:bg-orange-50',
    text300: 'text-orange-300',
    text400: 'text-orange-400',
    border20: 'border-orange-500/20',
    border30: 'border-orange-500/30',
    border40: 'border-orange-500/40',
    bg10: 'bg-orange-500/10',
    bg15: 'bg-orange-500/15',
    gradFrom600: 'from-orange-600',
    gradTo600: 'to-amber-600',
    glowRgba: 'rgba(249,115,22,0.4)',
    rgb: '249, 115, 22', rgbSecondary: '245, 158, 11',
    hex: '#f97316',
    hexSecondary: '#f59e0b', // amber-500
  },
};

/**
 * Returns ServiceTheme based on pathname. Defaults to blue dla non-service pages.
 *
 * Matchowanie zgodne z Navbar.tsx getNavbarTheme() - KOLEJNOŚĆ CHECKÓW WAŻNA
 * (sklep matchuje też podstronę długą "sklep-internetowy", więc szczegółowe sprawdzenia idą pierwsze).
 */
export function getServiceTheme(pathname: string | null): ServiceTheme {
  if (!pathname) return THEMES.blue;

  // Sklep amber
  if (pathname.includes('/strony-www/sklep')) return THEMES.amber;
  // Aplikacje webowe sky
  if (pathname.includes('/strony-www/system-crm')) return THEMES.sky;
  // Strona szyta na miarę rose
  if (pathname.includes('/strony-www/strona-szyta-na-miare')) return THEMES.rose;
  // Strona firmowa emerald
  if (pathname.includes('/strony-www/strona-firmowa')) return THEMES.emerald;
  // One-page blue (default match dla strony-www, pasuje też do dziedziczonych default)
  if (pathname.includes('/strony-www/one-page')) return THEMES.blue;
  // Chatboty AI orange
  if (pathname.includes('/automatyzacje-ai/chatboty-ai')) return THEMES.orange;

  // Default - blue (homepage, /uslugi/, /o-nas, /realizacje, /blog, etc.)
  return THEMES.blue;
}
