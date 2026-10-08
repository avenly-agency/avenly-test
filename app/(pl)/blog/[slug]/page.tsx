import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/app/data/posts';
import { JsonLd } from '@/components/seo/JsonLd';
import { blogPostingSchema, breadcrumbSchema } from '@/lib/schemas';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { toCard } from '@/components/blog/data';
import { PostCard } from '@/components/blog/cards';
import { BlogBackdrop } from '@/components/blog/BlogBackdrop';
import '@/components/blog/blog.css';

// Wpis bloga (tylko PL). Struktura z czerwca 2026 (powrót, kategorie, tytuł, autor / data / czas, okładka, treść,
// cytat-CTA) w języku strony głównej. Układ: „Okładka” + „Nagłówek na liniach” (wybór właściciela 2026-09-29) - na
// liniach bloga duże zdjęcie, na nie nachodzi karta z wyśrodkowanym nagłówkiem (etykieta, tytuł, zajawka, autor / data
// / czas), treść na środku, na końcu „Czytaj dalej” z kartami pozostałych wpisów. Style: components/blog/blog.css.

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Artykuł nie znaleziony' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.categories,
    authors: [{ name: post.author.name }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: [{ url: post.mainImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      section: post.categories[0],
      tags: post.categories,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.mainImage],
    },
  };
}

const d = (n: number) => ({ '--d': n }) as CSSProperties;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const card = toCard(post);
  const more = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3)
    .map(toCard);

  return (
    <>
      {/* JSON-LD: BlogPosting + Breadcrumb - niewidoczne, czytane przez Google/AI */}
      <JsonLd id="ld-blogposting" data={blogPostingSchema(post)} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Avenly', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />

      <article className="bl bl-post">
        <BlogBackdrop />
        <div className="container mx-auto px-6 bl-in">
          <div className="bl-post-wrap">
            <Link href="/blog" className="bl-back bl-rise">
              <ArrowLeft aria-hidden="true" />
              Wróć do listy wpisów
            </Link>

            {post.mainImage && (
              <figure className="bl-post-cover bl-rise" style={d(1)}>
                <div className="bl-post-cover-in">
                  <Image src={post.mainImage} alt="" fill priority sizes="(min-width: 1280px) 1232px, 100vw" className="bl-img" />
                </div>
              </figure>
            )}

            <header className="bl-post-head bl-rise" style={d(2)}>
              <p className="im-label">
                <SectionLabel align="start">{card.categories.join(' · ')}</SectionLabel>
              </p>
              <h1 className="bl-post-title">{post.title}</h1>
              <p className="bl-post-lead">{post.excerpt}</p>
              <p className="bl-post-meta">
                <span className="bl-mi">
                  <span className="bl-author">{card.author}</span>
                  <time dateTime={card.iso}>{card.date}</time>
                  <span>{card.minutes} min czytania</span>
                </span>
              </p>
            </header>

            <div className="bl-post-main">
              <div className="bl-body" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>

        {more.length > 0 && (
          <section className="bl-more" aria-labelledby="bl-more-title">
            <div className="container mx-auto px-6">
              <div className="bl-more-head">
                <div>
                  <p className="im-label"><SectionLabel align="start">Blog</SectionLabel></p>
                  <h2 id="bl-more-title" className="bl-more-title">Czytaj dalej</h2>
                </div>
                <Link href="/blog" className="bl-all">
                  <span className="bl-all-text">Wszystkie wpisy</span>
                  <ArrowRight aria-hidden="true" className="bl-arrow" />
                </Link>
              </div>
              <ul className="bl-grid" aria-label="Inne wpisy na blogu">
                {more.map((p, i) => <PostCard key={p.id} post={p} i={i} level="h3" />)}
              </ul>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
