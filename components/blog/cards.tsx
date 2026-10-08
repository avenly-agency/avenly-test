import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { BlogCard } from './data';

// Wspólne kawałki kart bloga: lista /blog (BlogIndex) i „Czytaj dalej” pod wpisem. Style w blog.css.

// Kropki między pozycjami rysuje CSS (.bl-mi) i chowa tę na początku każdej linii - przy zawijaniu na telefonie
// nie zostaje kropka na końcu ani na początku wiersza.
export function Meta({ post, minutes }: { post: BlogCard; minutes?: boolean }) {
  return (
    <p className="bl-meta">
      <span className="bl-mi">
        <span>{post.categories[0]}</span>
        <time dateTime={post.iso}>{post.date}</time>
        {minutes && <span>{post.minutes} min czytania</span>}
      </span>
    </p>
  );
}

/** Karta wpisu w siatce (element listy). `level` = poziom nagłówka tytułu (h2 na liście, h3 w „Czytaj dalej”). */
export function PostCard({ post, i, level = 'h2' }: { post: BlogCard; i: number; level?: 'h2' | 'h3' }) {
  const Title = level;
  return (
    <li className="bl-enter" style={{ '--d': i + 1 } as CSSProperties}>
      <article className="bl-card">
        <div className="bl-card-media">
          <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" className="bl-img" />
        </div>
        <div className="bl-card-body">
          <Meta post={post} />
          <Title className="bl-card-title">
            <Link href={post.href} className="bl-link">{post.title}</Link>
          </Title>
          <p className="bl-card-ex">{post.excerpt}</p>
          <div className="bl-card-foot">
            <span className="bl-read">Czytaj wpis<ArrowRight aria-hidden="true" className="bl-arrow" /></span>
            <span className="bl-mins">{post.minutes} min czytania</span>
          </div>
        </div>
      </article>
    </li>
  );
}
