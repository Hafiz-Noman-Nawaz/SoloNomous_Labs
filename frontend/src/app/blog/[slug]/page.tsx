import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Clock,
  Calendar,
  User,
  ArrowRight,
  Terminal,
  Layers,
  ChevronLeft
} from 'lucide-react';
import SocialShareBar from '@/components/blog/SocialShareBar';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solonomouslabs.com';
  try {
    const res = await api.getBlogPostBySlug(params.slug);
    if (!res.data) return { title: 'Article | SoloNomous Labs' };
    const post = res.data;

    const title = post.seoMetadata?.metaTitle || `${post.title} | SoloNomous Labs`;
    const description = post.seoMetadata?.metaDescription || post.excerpt;
    const imageUrl = post.featuredImage?.url || `${siteUrl}/assets/branding/og-preview.png`;
    const articleUrl = `${siteUrl}/blog/${params.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: articleUrl
      },
      openGraph: {
        title: post.title,
        description,
        url: articleUrl,
        siteName: 'SoloNomous Labs',
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author?.name || 'SoloNomous Labs Principal Architect'],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.featuredImage?.altText || post.title
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: [imageUrl],
        creator: '@solonomouslabs'
      }
    };
  } catch {
    return { title: 'Engineering Article | SoloNomous Labs' };
  }
}

// Robust HTML & Markdown formatting pipeline
function renderArticleContent(rawContent: string) {
  if (!rawContent) return '';

  let html = rawContent;

  // Headings
  html = html.replace(/^###\s+(.*$)/gim, '<h3 class="text-xl sm:text-2xl font-bold font-display text-white mt-8 mb-3 tracking-tight">$1</h3>');
  html = html.replace(/^##\s+(.*$)/gim, '<h2 class="text-2xl sm:text-3xl font-bold font-display text-white mt-10 mb-4 tracking-tight border-b border-white/5 pb-2">$1</h2>');
  html = html.replace(/^#\s+(.*$)/gim, '<h1 class="text-3xl sm:text-4xl font-extrabold font-display text-white mt-12 mb-6 tracking-tight">$1</h1>');

  // Code blocks with syntax container
  html = html.replace(/```([a-zA-Z0-9_-]*)([\s\S]*?)```/gim, (match, lang, code) => {
    return `<div class="my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#0c0a13]">
      <div class="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-purple-300">
        <span>${lang ? lang.toUpperCase() : 'CODE'}</span>
      </div>
      <pre class="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-purple-200/90 leading-relaxed"><code>${code.trim()}</code></pre>
    </div>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs sm:text-sm">$1</code>');

  // Images in markdown: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-8 rounded-2xl overflow-hidden border border-white/10 bg-black/40"><img src="$2" alt="$1" class="w-full object-cover max-h-[500px]" /><figcaption class="text-center text-xs text-slate-400 py-2 bg-white/[0.02] border-t border-white/5 font-mono">$1</figcaption></figure>');

  // Markdown links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline underline-offset-4 font-medium transition-colors">$1</a>');

  // Bold & Italic & Strikethrough & Underline
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  html = html.replace(/~~([^~]+)~~/g, '<del class="line-through text-slate-500">$1</del>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-200">$1</em>');

  // Blockquotes
  html = html.replace(/^>\s+(.*$)/gim, '<blockquote class="my-6 pl-4 py-1 border-l-4 border-purple-500 bg-purple-500/5 text-slate-300 italic text-sm sm:text-base leading-relaxed">$1</blockquote>');

  // Unordered list items
  html = html.replace(/^[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-300 my-1 leading-relaxed">$1</li>');

  // Numbered list items
  html = html.replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal text-slate-300 my-1 leading-relaxed">$1</li>');

  // Paragraphs
  html = html.replace(/\n\n+/g, '</p><p class="my-4 text-slate-300 leading-relaxed text-base sm:text-lg">');

  return `<p class="my-4 text-slate-300 leading-relaxed text-base sm:text-lg">${html}</p>`;
}

export default async function BlogPostDetailPage({ params }: Props) {
  let postData;
  try {
    postData = await api.getBlogPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const { data: post, relatedPosts } = postData;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solonomouslabs.com';

  // JSON-LD Article structured schema for search engines and social bots
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`
    },
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'SoloNomous Labs Architect'
    },
    publisher: {
      '@type': 'Organization',
      name: 'SoloNomous Labs',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/branding/logo-dark.svg`
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-purple-400 font-medium">{post.category?.name || 'Article'}</span>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Articles
          </Link>
        </div>

        {/* Post Title & Excerpt */}
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
              {post.category?.name || 'Architecture'}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" /> {post.readingTimeMinutes || 5} min read
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(post.publishedAt)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            {post.excerpt}
          </p>

          {/* Author Card */}
          <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={post.author?.name || 'Author'}
                className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
              />
              <div>
                <div className="text-sm font-bold text-white">{post.author?.name || 'SoloNomous Labs'}</div>
                <div className="text-xs text-slate-400">{post.author?.role || 'Lead Systems Architect'}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {post.tags?.map((t: any) => (
                <span
                  key={t._id || t.name || t}
                  className="px-2.5 py-1 rounded-md bg-white/5 text-[11px] font-mono text-purple-300 border border-white/5"
                >
                  #{typeof t === 'string' ? t : t.name}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage?.url && (
          <div className="mb-10 rounded-3xl overflow-hidden border border-white/10 max-h-[500px] w-full bg-black/40 shadow-2xl shadow-purple-950/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage.url}
              alt={post.featuredImage.altText || post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Social Share Bar Top */}
        <SocialShareBar title={post.title} excerpt={post.excerpt} slug={post.slug} />

        {/* Article Body */}
        <div className="prose prose-invert prose-purple max-w-none text-slate-300">
          <div
            dangerouslySetInnerHTML={{
              __html: renderArticleContent(post.content || '')
            }}
          />
        </div>

        {/* Social Share Bar Bottom */}
        <SocialShareBar title={post.title} excerpt={post.excerpt} slug={post.slug} />

        {/* Inline Conversion CTA */}
        <div className="my-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/30 via-[#12111A] to-purple-950/20 border border-purple-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
            <Terminal className="w-4 h-4" /> Need This Architecture Built?
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-2">
            SoloNomous Labs deploys production SaaS & Autonomous AI systems in 4-8 weeks.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-2xl">
            Skip the trial-and-error. Partner with principal full-stack engineers who have scaled enterprise multi-tenant architectures and autonomous AI pipelines.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30"
            >
              Schedule Architecture Review <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="pt-12 border-t border-white/5">
            <h3 className="text-xl font-bold font-display text-white mb-6">
              Related Engineering Blueprints
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel: any) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="glass-card p-5 rounded-2xl group hover:border-purple-500/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[11px] text-slate-400 mb-1">
                      {rel.readingTimeMinutes} min read • {formatDate(rel.publishedAt)}
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="pt-3 text-xs font-semibold text-purple-400 inline-flex items-center gap-1">
                    Read article <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
