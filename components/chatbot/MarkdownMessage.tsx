import React from "react";

/**
 * Lekki renderer markdown dla wiadomości chatbota.
 *
 * Po co własny zamiast react-markdown: odpowiedzi asystenta to prosty markdown
 * (pogrubienia, kursywa, listy, linki, nagłówki, `code`). Pełna biblioteka +
 * remark/rehype to ~40 KB gzip dla feature'a tej skali (CLAUDE.md zasada #4 -
 * brak dużych deps). Parsujemy do React elementów (NIE dangerouslySetInnerHTML)
 * = brak ryzyka XSS przy treści z modelu/n8n.
 *
 * Obsługa:
 *  - **bold** / __bold__
 *  - *italic* / _italic_
 *  - `code`
 *  - [tekst](url)
 *  - # .. ###### nagłówki
 *  - listy punktowane (-, *, •) i numerowane (1.)
 *  - akapity rozdzielone pustą linią, pojedynczy \n => <br/>
 */

// Inline tokeny w jednej alternacji. Kolejność: bold przed italic (przy `**`
// wariant bold łapie pierwszy), code/link osobno. `[^*]+` itd. = brak
// zagnieżdżania, co dla treści czatu jest wystarczające i bezpieczne.
const INLINE_RE =
  /(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(?<![A-Za-z0-9])_([^_]+)_(?![A-Za-z0-9])|(`([^`]+)`)|(\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\))/g;

function parseInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;

  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > lastIndex) nodes.push(text.slice(lastIndex, m.index));
    const key = `${keyPrefix}-i${i++}`;

    if (m[1] !== undefined) {
      nodes.push(<strong key={key} className="font-semibold text-white">{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      nodes.push(<strong key={key} className="font-semibold text-white">{m[4]}</strong>);
    } else if (m[5] !== undefined) {
      nodes.push(<em key={key} className="italic">{m[6]}</em>);
    } else if (m[7] !== undefined) {
      nodes.push(<em key={key} className="italic">{m[7]}</em>);
    } else if (m[8] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="px-1.5 py-0.5 rounded-md bg-white/10 text-[0.85em] font-mono text-white/90"
        >
          {m[9]}
        </code>,
      );
    } else if (m[10] !== undefined) {
      nodes.push(
        <a
          key={key}
          href={m[12]}
          target={m[12].startsWith("http") ? "_blank" : undefined}
          rel={m[12].startsWith("http") ? "noopener noreferrer" : undefined}
          className="font-medium underline underline-offset-2 decoration-white/40 hover:decoration-white transition-colors"
        >
          {m[11]}
        </a>,
      );
    }
    lastIndex = INLINE_RE.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

const UL_RE = /^\s*[-*•]\s+(.*)$/;
const OL_RE = /^\s*(\d+)\.\s+(.*)$/;
const HEADING_RE = /^(#{1,6})\s+(.*)$/;

export function MarkdownMessage({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];

  let para: string[] = [];
  let ul: string[] = [];
  let ol: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (!para.length) return;
    const k = `p${key++}`;
    blocks.push(
      <p key={k} className="leading-relaxed [&:not(:first-child)]:mt-2">
        {para.map((ln, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {parseInline(ln, `${k}-${idx}`)}
          </React.Fragment>
        ))}
      </p>,
    );
    para = [];
  };

  const flushUl = () => {
    if (!ul.length) return;
    const k = `ul${key++}`;
    blocks.push(
      <ul key={k} className="list-disc pl-5 space-y-1 [&:not(:first-child)]:mt-2">
        {ul.map((item, idx) => (
          <li key={idx} className="leading-relaxed marker:text-white/40">
            {parseInline(item, `${k}-${idx}`)}
          </li>
        ))}
      </ul>,
    );
    ul = [];
  };

  const flushOl = () => {
    if (!ol.length) return;
    const k = `ol${key++}`;
    blocks.push(
      <ol key={k} className="list-decimal pl-5 space-y-1 [&:not(:first-child)]:mt-2">
        {ol.map((item, idx) => (
          <li key={idx} className="leading-relaxed marker:text-white/40">
            {parseInline(item, `${k}-${idx}`)}
          </li>
        ))}
      </ol>,
    );
    ol = [];
  };

  const flushAll = () => {
    flushPara();
    flushUl();
    flushOl();
  };

  for (const line of lines) {
    if (line.trim() === "") {
      flushAll();
      continue;
    }

    const heading = HEADING_RE.exec(line);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const k = `h${key++}`;
      const cls =
        level <= 2
          ? "font-semibold text-white text-[1.05em] [&:not(:first-child)]:mt-2.5"
          : "font-semibold text-white [&:not(:first-child)]:mt-2";
      blocks.push(
        <p key={k} className={cls}>
          {parseInline(heading[2], k)}
        </p>,
      );
      continue;
    }

    const ulm = UL_RE.exec(line);
    if (ulm) {
      flushPara();
      flushOl();
      ul.push(ulm[1]);
      continue;
    }

    const olm = OL_RE.exec(line);
    if (olm) {
      flushPara();
      flushUl();
      ol.push(olm[2]);
      continue;
    }

    flushUl();
    flushOl();
    para.push(line);
  }

  flushAll();

  return <>{blocks}</>;
}
