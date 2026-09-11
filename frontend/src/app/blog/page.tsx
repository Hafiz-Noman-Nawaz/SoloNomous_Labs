'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BlogPost } from '@/types';
import { Search, ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTaxonomies().then((res) => {
      if (res.data?.categories) setCategories(res.data.categories);
    }).catch(console.warn);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getBlogPosts({
      category: selectedCategory || undefined,
      search: searchQuery || undefined
    })
      .then((res) => setPosts(res.data || []))
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const standardPosts = posts.filter((p) => p._id !== featuredPost?._id);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          Pillar Content Engine
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight mt-2">
          Engineering Dispatches & <span className="text-gradient-purple">Architectural Blueprints</span>.
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          Deep-dive technical guides on SaaS multi-tenancy, zero-hallucination RAG vector architectures, and high-concurrency systems.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === ''
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Disciplines
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === c.slug
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search engineering articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
          />
        </div>
      </div>

      {/* Featured Pillar Article */}
      {featuredPost && !selectedCategory && !searchQuery && (
        <div className="mb-16">
          <div className="glass-card rounded-3xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 relative h-64 lg:h-[400px] w-full bg-purple-950/30 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredPost.featuredImage?.url}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold uppercase tracking-wider">
                  Featured Pillar
                </div>
              </div>

              <div className="lg:col-span-6 p-6 sm:p-10 space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="text-purple-400 font-semibold">{featuredPost.category?.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {featuredPost.readingTimeMinutes} min read
                  </span>
                  <span>•</span>
                  <span>{formatDate(featuredPost.publishedAt)}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white leading-tight">
                  <Link href={`/blog/${featuredPost.slug}`} className="hover:text-purple-300 transition-colors">
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-3">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20"
                  >
                    Read Full Blueprint <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {standardPosts.map((post) => (
          <article
            key={post.slug}
            className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-white/8 hover:border-purple-500/30 transition-all"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-purple-950/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featuredImage?.url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-semibold text-purple-300">
                  {post.category?.name}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readingTimeMinutes} min
                  </span>
                  <span>•</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                <h3 className="text-lg font-bold font-display text-white group-hover:text-purple-300 transition-colors mb-2 leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
              >
                Read article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto text-purple-400/40 mb-3" />
          <p className="text-sm">No engineering articles found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
