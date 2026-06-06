import { MetadataRoute } from 'next';

// Wymagane przy `output: 'export'` aby Next wygenerował statyczny plik /robots.txt przy build
export const dynamic = 'force-static';

/**
 * Strategia robots.txt - 2026 standard:
 * - Standardowe boty (Googlebot, Bingbot itp.) → pełny dostęp
 * - AI TRAINING bots (GPTBot, CCBot, anthropic-ai, ClaudeBot) → BLOKADA
 *   (zapobiega trenowaniu LLM-ów na naszej treści bez zgody/cytowania)
 * - AI RETRIEVAL bots (Google-Extended, OAI-SearchBot, PerplexityBot, ChatGPT-User) → POZWOLENIE
 *   (KLUCZOWE - pozwala stronie pojawiać się w Google AI Overviews, ChatGPT Search,
 *   Perplexity, Claude search-augmented odpowiedziach. Dla agencji AI to must-have.)
 *
 * Źródło: https://cubitrek.com/blog/robots-txt-2026-managing-ai-crawler-budgets
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standardowe wyszukiwarki - pełen dostęp
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/api/'],
      },

      // AI TRAINING crawlers - BLOKADA (chronimy treść przed nieuprawnionym treningiem)
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'FacebookBot',
        disallow: '/',
      },

      // AI RETRIEVAL/SEARCH crawlers - POZWOLENIE (chcemy być cytowani w AI search)
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Claude-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
    ],
    sitemap: 'https://avenly.pl/sitemap.xml',
    host: 'https://avenly.pl',
  };
}
