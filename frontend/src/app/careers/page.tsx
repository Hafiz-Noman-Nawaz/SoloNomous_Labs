import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Terminal, Shield, Zap, ArrowRight, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers & Engineering Culture',
  description:
    'Join the team at SoloNomous Labs. Explore our developer-first culture, high standards, and talent pipeline.'
};

export default function CareersPage() {
  const values = [
    {
      title: 'Obsession With Quality',
      desc: 'We do not ship sloppy code or unhandled edge cases. Every component is built to endure.'
    },
    {
      title: 'Async & Autonomous',
      desc: 'Minimal meetings, deep work blocks, and total ownership over your architectural decisions.'
    },
    {
      title: 'Modern Tooling Only',
      desc: 'TypeScript, Next.js, Node.js, vector databases, and modern CI/CD. Zero legacy technical debt.'
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          Work With SoloNomous Labs
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight mt-2">
          Build Serious Software for <span className="text-gradient-purple">Visionary Teams</span>.
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          We are building an autonomous engineering studio where principal developers, system architects, and AI researchers solve hard distributed problems without bureaucratic red tape.
        </p>
      </div>

      {/* Culture Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {values.map((v, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold font-display text-white mb-2">{v.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Open Positions / Talent Pipeline State */}
      <div className="glass-card p-10 sm:p-12 rounded-3xl border border-white/10 mb-20 text-center">
        <div className="w-14 h-14 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-400">
          <Terminal className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold font-display text-white mb-2">Talent Network & Open Inquiries</h3>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
          We are currently scaling our contractor and core engineer pool across Full-Stack TypeScript (Next.js/Node.js), AI/RAG engineers, and distributed backend architects.
        </p>
        <a
          href="mailto:careers@solonomouslabs.com?subject=SoloNomous%20Labs%20Engineering%20Application"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30"
        >
          Send Your GitHub / Portfolio <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
