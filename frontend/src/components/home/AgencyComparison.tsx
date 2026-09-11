'use client';

import React from 'react';
import { Check, X, ShieldCheck, Zap, Award, Users, AlertTriangle } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

export const AgencyComparison: React.FC = () => {
  const { openProjectModal } = useModal();

  const comparisonPoints = [
    {
      feature: 'Lead Architect & Talent Quality',
      solonomous: 'Direct communication with Senior Lead Architect (Noman Nawaz)',
      inhouse: '3+ months to recruit, vet, and onboard; $150k+/yr salary risk',
      agencies: 'Account managers & junior developer handoffs behind the scenes',
      freelancers: 'Unvetted skill claims & high risk of sudden ghosting'
    },
    {
      feature: 'Cost & Financial Risk',
      solonomous: 'Milestone sprints starting from $250 – $1,000+ USD (Zero surprises)',
      inhouse: '$150k+/yr overhead, benefits, payroll taxes, equity dilution',
      agencies: '$20,000 – $50,000+ bloated retainer minimums',
      freelancers: 'Unpredictable hourly runaway or bait-and-switch quotes'
    },
    {
      feature: 'Delivery Velocity & Momentum',
      solonomous: 'Rapid 2 – 4 week production sprints with live staging deployments',
      inhouse: 'Slow ramp-up; company distractions & endless internal meetings',
      agencies: '3 – 6 month bureaucratic cycles and scope creep arguments',
      freelancers: 'Frequent uncommunicated delays and missed milestone deadlines'
    },
    {
      feature: 'Codebase Quality & Modern Stack',
      solonomous: 'Next.js 14, React 19, TypeScript, sub-second Core Web Vitals',
      inhouse: 'Dependent on single-developer biases; inconsistent standards',
      agencies: 'Heavy legacy WordPress or monolithic enterprise bloat',
      freelancers: 'Fragile copy-paste templates with massive technical debt'
    },
    {
      feature: 'Intellectual Property Ownership',
      solonomous: '100% full IP & source code ownership transferred Day 1',
      inhouse: 'Standard company IP (after heavy employment overhead)',
      agencies: 'Proprietary lock-in or complex ongoing licensing contracts',
      freelancers: 'Unclear asset ownership, missing schemas, zero documentation'
    },
    {
      feature: 'Post-Launch Stabilization Warranty',
      solonomous: '30-Day zero-regression warranty included in every sprint',
      inhouse: 'You pay salary continuously whether building or idle',
      agencies: 'Expensive recurring maintenance retainers required',
      freelancers: 'Zero post-delivery support once the final invoice is paid'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#07060B] border-y border-white/5 relative" id="comparison">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" /> High-Leverage Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            SoloNomous Labs vs. <span className="text-gradient-purple">The Alternatives</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            Hiring full-time engineers is slow and expensive. Big agencies have massive overhead. Freelancers lack accountability. SoloNomous Labs delivers senior-level architectural execution with milestone transparency.
          </p>
        </div>

        {/* Desktop Comparison Table (4 Columns) */}
        <div className="hidden xl:block overflow-hidden rounded-3xl border border-white/10 glass-card shadow-2xl shadow-purple-950/20">
          <div className="grid grid-cols-12 bg-white/[0.03] border-b border-white/10 p-5 text-xs font-bold uppercase tracking-wider">
            <div className="col-span-3 text-slate-400">Strategic Metric</div>
            <div className="col-span-3 text-purple-300 font-extrabold flex items-center gap-1.5 bg-purple-600/15 -my-5 py-5 px-4 border-x border-purple-500/30">
              <Zap className="w-4 h-4 text-purple-400" /> SoloNomous Labs (Noman Nawaz)
            </div>
            <div className="col-span-2 text-slate-400 px-3">In-House Hiring</div>
            <div className="col-span-2 text-slate-400 px-3">Traditional Big Agencies</div>
            <div className="col-span-2 text-slate-400 px-3">Unvetted Freelancers</div>
          </div>

          <div className="divide-y divide-white/5 text-xs sm:text-sm">
            {comparisonPoints.map((pt, i) => (
              <div
                key={i}
                className="grid grid-cols-12 p-5 items-center hover:bg-white/[0.01] transition-colors"
              >
                <div className="col-span-3 font-semibold text-white pr-4">
                  {pt.feature}
                </div>
                <div className="col-span-3 text-purple-100 font-medium pr-4 flex items-start gap-2 bg-purple-600/10 -my-5 py-5 px-4 border-x border-purple-500/20">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt.solonomous}</span>
                </div>
                <div className="col-span-2 text-slate-400 px-3 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                  <span className="text-xs">{pt.inhouse}</span>
                </div>
                <div className="col-span-2 text-slate-400 px-3 flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-red-400/80 shrink-0 mt-0.5" />
                  <span className="text-xs">{pt.agencies}</span>
                </div>
                <div className="col-span-2 text-slate-400 px-3 flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-red-400/80 shrink-0 mt-0.5" />
                  <span className="text-xs">{pt.freelancers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Card Layout */}
        <div className="xl:hidden space-y-6">
          {comparisonPoints.map((pt, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-base font-bold text-white pb-2 border-b border-white/10">
                {pt.feature}
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-purple-600/20 border border-purple-500/40">
                  <span className="font-bold text-purple-300 block mb-1 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> SoloNomous Labs:
                  </span>
                  <p className="text-slate-100 font-medium">{pt.solonomous}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80" /> In-House Hiring:
                  </span>
                  <p className="text-slate-400">{pt.inhouse}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-red-400/80" /> Traditional Big Agencies:
                  </span>
                  <p className="text-slate-400">{pt.agencies}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-red-400/80" /> Unvetted Freelancers:
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
