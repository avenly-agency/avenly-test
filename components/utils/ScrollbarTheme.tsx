'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getServiceTheme } from '@/lib/service-theme';

/**
 * Ustawia kolor paska przewijania na main-color motywu danej podstrony
 * (per pathname) - np. usługi: sklep=amber, chatboty=orange, szyta=rose itd.
 * Domyślnie niebieski (home/blog/o-nas/...). CSS vars na <html> czytane przez
 * `::-webkit-scrollbar-thumb` + `scrollbar-color` w globals.css.
 */
export function ScrollbarTheme() {
  const pathname = usePathname();
  useEffect(() => {
    const t = getServiceTheme(pathname);
    const el = document.documentElement;
    el.style.setProperty('--sb-thumb', t.hex);
    el.style.setProperty('--sb-thumb-hover', t.hexSecondary);
  }, [pathname]);
  return null;
}
