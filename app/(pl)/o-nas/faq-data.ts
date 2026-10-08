/**
 * FAQ PL - re-export ze słownika i18n (single source of truth: lib/i18n/o-nas.ts).
 * Używane w JSON-LD FAQPage schema (layout.tsx). Akordeon UI czyta FAQ z propsa
 * słownika (oNasDict.pl.faq) w ONasClient - tu wystawiamy PL wariant dla schematu,
 * żeby nie mieć dwóch kopii treści.
 */
import { oNasDict } from '@/lib/i18n/o-nas';

export const FAQS = oNasDict.pl.faq;
