import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText, CheckSquare, Send, Terminal, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Resources & Technical Guides',
  description:
    'Free architectural checklists, production deployment guides, and RAG evaluation templates from SoloNomous Labs.'
};

export default function ResourcesPage() {
  const resources = [
    {
      type: 'Architecture Whitepaper',
      title: 'The Production RAG Evaluation Matrix',
      description: 'A 24-page guide detailing hybrid search, cross-encoder reranking, and synthetic evaluation metrics (RAGAS) for enterprise AI.',
      tag: 'AI Systems',
      action: 'Read Whitepaper'
    },
    {
      type: 'Developer Checklist',
      title: 'Multi-Tenant SaaS Security & RLS Audit',
      description: 'A 50-point comprehensive checklist covering tenant schema isolation, JWT token lifetimes, and cryptographic audit logs.',
      tag: 'SaaS Engineering',
      action: 'View Checklist'
    },
    {
      type: 'Engineering Blueprint',
      title: 'High-Throughput Node.js Microservices Guide',
      description: 'Techniques for asynchronous worker queues, Redis BullMQ streams, and k6 chaos load benchmarking.',
      tag: 'Backend Infrastructure',
      action: 'Read Blueprint'
    },
    {
      type: 'Starter Architecture',
      title: 'SoloNomous Next.js 14 Production Baseline',
      description: 'Our internal skeleton featuring strict TypeScript configs, Tailwind design tokens, and defensive Express API templates.',
      tag: 'Full-Stack',
      action: 'Explore Template'
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          Knowledge Repository
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight mt-2">
          Technical Resources & <span className="text-gradient-purple">Developer Blueprints</span>.
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          Open architectural frameworks, security audit checklists, and deep-dive technical assets crafted by the engineers at SoloNomous Labs.
        </p>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {resources.map((item, idx) => (
          <div
            key={idx}
            className="glass-card p-8 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                  {item.tag}
                </span>
                <span className="text-xs text-slate-400">{item.type}</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white group-hover:text-purple-300 transition-colors mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <Link
                href="/contact"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1.5 transition-colors"
              >
                {item.action} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatches Subscription Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#12111A] border border-white/10 text-center">
        <h3 className="text-2xl font-bold font-display text-white mb-2">
          Receive Our New Blueprints As They Are Authored
        </h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
          Subscribe to our engineering dispatches for bi-weekly deep dives into production software architecture.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20"
        >
          <Send className="w-4 h-4" /> Subscribe to Lab Research
        </Link>
      </div>
    </div>
  );
}
