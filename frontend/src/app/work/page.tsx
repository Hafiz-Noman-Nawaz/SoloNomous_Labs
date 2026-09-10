'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CaseStudy } from '@/types';
import { ArrowRight, Sparkles, Layers, CheckCircle2 } from 'lucide-react';

export default function WorkPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCaseStudies()
      .then((res) => setCaseStudies(res.data || []))
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          Proven Engineering Results
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight mt-2">
          Case Studies & <span className="text-gradient-purple">Technical Breakthroughs</span>.
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          Explore how we solved critical distributed systems bottlenecks, built enterprise RAG pipelines, and scaled multi-tenant platforms for high-growth tech companies.
        </p>
      </div>

      {/* Case Studies Showcase */}
      <div className="space-y-12 mb-20">
        {caseStudies.map((study, idx) => (
          <div
            key={study.slug}
            data-cursor="project"
            className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/40 transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image Preview (5 cols) */}
              <div className="lg:col-span-5 relative h-72 lg:h-full min-h-[300px] w-full bg-purple-950/20 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={study.heroImage?.url}
                  alt={study.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-semibold text-purple-300 border border-white/10">
                  {study.industry}
                </div>
              </div>

              {/* Details (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-purple-400">0{idx + 1}</span>
                  <span className="text-xs text-slate-400">Client: {study.clientName}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">Timeline: {study.duration}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  <Link href={`/work/${study.slug}`} className="hover:text-purple-300 transition-colors">
                    {study.title}
                  </Link>
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {study.overview}
                </p>

                {/* Outcome Metrics */}
                <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  {study.results?.slice(0, 3).map((r, ri) => (
                    <div key={ri}>
                      <div className="text-base sm:text-lg font-bold font-display text-purple-300">
                        {r.metric}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{r.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5">
                  {study.techStack?.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] font-mono text-slate-300 border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/work/${study.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20"
                  >
                    Explore Technical Architecture <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Noman Nawaz Portfolio Live Demos Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-purple-950/40 border border-purple-500/30 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300">
            <Sparkles className="w-3.5 h-3.5" /> Founder Software Architecture Showcase
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Explore Noman Nawaz&apos;s Live Portfolio & Interactive Demos
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            View live demos, verified GitHub repositories, and benchmarks for ZeoAtlas, Zashas, and full-stack MERN platforms directly on Noman&apos;s personal site.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://www.nouman-nawaz.dev/"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-900/30 flex items-center gap-2"
          >
            <span>Visit nouman-nawaz.dev</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.fiverr.com/nomannawaz67"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-all"
          >
            Fiverr Profile
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#12111A] border border-white/10 text-center">
        <h3 className="text-2xl font-bold font-display text-white mb-2">Want to build something similar?</h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
          Schedule an architectural blueprint review with our principal systems engineers today.
        </p>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all"
        >
          Book Engineering Session
        </Link>
      </div>
    </div>
  );
}
