'use client';

import React from 'react';
import { Check, X, ShieldCheck, Zap, Award, Users } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

export const AgencyComparison: React.FC = () => {
  const { openProjectModal } = useModal();

  const comparisonPoints = [
    {
      feature: 'Lead Architect & Direct Contact',
      solonomous: 'Direct communication with Senior Lead Architect (Noman Nawaz)',
      agencies: 'Account managers & junior developer handoffs',
      freelancers: 'Inconsistent availability & high ghosting risk'
    },
    {
      feature: 'Pricing Model & Transparency',
      solonomous: 'Transparent milestone sprints from $250 – $1,000+ (Zero surprises)',
      agencies: '$15,000 – $50,000+ bloated retainer minimums',
      freelancers: 'Unpredictable hourly billing or bait-and-switch quotes'
    },
    {
      feature: 'Delivery Speed & Turnaround',
      solonomous: 'Rapid 2 – 4 week production sprints with continuous deployment',
      agencies: 'Slow 3 – 6 month bureaucratic review cycles',
      freelancers: 'Frequent uncommunicated deadline delays'
    },
    {
      feature: 'Codebase Quality & Modern Stack',
      solonomous: 'Next.js 14, React 19, TypeScript, sub-second Core Web Vitals',
      agencies: 'Heavy legacy WordPress or monolithic enterprise bloat',
      freelancers: 'Fragile copy-paste templates with technical debt'
    },
    {
      feature: 'Intellectual Property & Code Ownership',
      solonomous: '100% client code & IP ownership transferred from Day 1',
      agencies: 'Complex licensing agreements or proprietary lock-in',
      freelancers: 'Unclear asset ownership & missing documentation'
    },
    {
      feature: 'Post-Launch Stabilization Warranty',
      solonomous: '30-Day zero-regression warranty included in every sprint',
      agencies: 'Expensive recurring maintenance retainers required',
      freelancers: 'Zero post-delivery support once invoice is cleared'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#07060B] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" /> High-Leverage Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Why Technical Founders Choose <span className="text-gradient-purple">SoloNomous Labs</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            Compare our engineering model against bloated legacy agencies and unvetted freelancers. We eliminate the overhead and focus purely on high-velocity production results.
          </p>
        </div>

        {/* Desktop Comparison Table */}
        <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/10 glass-card">
          <div className="grid grid-cols-12 bg-white/[0.03] border-b border-white/10 p-5 text-xs font-bold uppercase tracking-wider">
            <div className="col-span-4 text-slate-400">Strategic Criteria</div>
            <div className="col-span-3 text-purple-400 font-extrabold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-400" /> SoloNomous Labs
            </div>
            <div className="col-span-3 text-slate-400">Traditional Agencies</div>
            <div className="col-span-2 text-slate-400">Cheap Freelancers</div>
          </div>

          <div className="divide-y divide-white/5 text-xs sm:text-sm">
            {comparisonPoints.map((pt, i) => (
              <div
                key={i}
                className="grid grid-cols-12 p-5 items-center hover:bg-white/[0.01] transition-colors"
              >
                <div className="col-span-4 font-semibold text-white pr-4">
                  {pt.feature}
                </div>
                <div className="col-span-3 text-purple-200 font-medium pr-4 flex items-start gap-2 bg-purple-600/10 -my-5 py-5 px-3 border-x border-purple-500/20">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt.solonomous}</span>
                </div>
                <div className="col-span-3 text-slate-400 pr-4 flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400/80 shrink-0 mt-0.5" />
                  <span>{pt.agencies}</span>
                </div>
                <div className="col-span-2 text-slate-400 flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400/80 shrink-0 mt-0.5" />
                  <span>{pt.freelancers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Card Layout */}
        <div className="lg:hidden space-y-6">
          {comparisonPoints.map((pt, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-base font-bold text-white pb-2 border-b border-white/10">
                {pt.feature}
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-purple-600/15 border border-purple-500/30">
                  <span className="font-bold text-purple-300 block mb-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> SoloNomous Labs:
                  </span>
                  <p className="text-slate-200">{pt.solonomous}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-red-400/80" /> Traditional Agencies:
                  </span>
                  <p className="text-slate-400">{pt.agencies}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-red-400/80" /> Cheap Freelancers:
                  </span>
                  <p className="text-slate-400">{pt.freelancers}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar below comparison */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={() => openProjectModal('Custom Sprint Scope')}
            className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-xl shadow-purple-600/30 inline-flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> Start Risk-Free Milestone Engagement
          </button>
        </div>
      </div>
    </section>
  );
};
