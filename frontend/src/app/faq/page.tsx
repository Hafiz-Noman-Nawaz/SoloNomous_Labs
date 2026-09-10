'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FAQ } from '@/types';
import { ChevronDown, Search, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    api.getFaqs(category === 'all' ? undefined : category)
      .then((res) => setFaqs(res.data || []))
      .catch(console.warn);
  }, [category]);

  const filteredFaqs = faqs.filter((f) =>
    search ? f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase()) : true
  );

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'general', name: 'General' },
    { id: 'services', name: 'Services' },
    { id: 'pricing', name: 'Pricing & Sprints' },
    { id: 'process', name: 'Methodology' },
    { id: 'technology', name: 'Technology' }
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: filteredFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            Frequently Answered
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight mt-2">
            Questions & <span className="text-gradient-purple">Architecture Clarity</span>.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Everything you need to know about engaging with SoloNomous Labs, code ownership, pricing models, and development sprints.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4 mb-10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  category === c.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 mb-16">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq._id || idx}
                className="glass-card rounded-2xl border border-white/8 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              No matching questions found. Use &ldquo;Ask Solo&rdquo; in the bottom-right for instant answers.
            </div>
          )}
        </div>

        {/* Callout */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl text-center border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-white">Still have questions?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Chat with our AI assistant &ldquo;Ask Solo&rdquo; or email contact@solonomouslabs.com.
            </p>
          </div>
          <a
            href="mailto:contact@solonomouslabs.com"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Email Principal Architect
          </a>
        </div>
      </div>
    </>
  );
}
