'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, Tag, PlusCircle, Cpu, Rocket } from 'lucide-react';
import { PricingPackage } from '@/types';
import { useModal } from '@/context/ModalContext';
import { ProjectCostEstimator } from '@/components/calculator/ProjectCostEstimator';
import { AgencyComparison } from '@/components/home/AgencyComparison';

interface Props {
  initialPackages?: PricingPackage[];
}

export default function PricingContent({ initialPackages = [] }: Props) {
  const { openProjectModal } = useModal();
  const packages = initialPackages.filter((pkg) => pkg.active !== false);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16 text-center mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          Transparent Engagements
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight mt-2">
          Predictable Pricing. <span className="text-gradient-purple">Zero Compromises</span>.
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          We operate through clear, deliverable-driven Product Sprints. You always know what is being built, when it will ship, and own 100% of the intellectual property.
        </p>
      </div>

      {/* Pricing Cards or Custom Scope CTA */}
      {packages.length === 0 ? (
        <div className="max-w-2xl mx-auto mb-20 p-10 sm:p-12 rounded-3xl glass-card border border-purple-500/30 text-center relative overflow-hidden shadow-2xl shadow-purple-950/30">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-300 mb-5">
            <Cpu className="w-8 h-8" />
          </div>
          <span className="px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            Tailored Architectural Scoping
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mt-3 mb-3">
            Custom Engineering Sprints & MVP Packages
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Every software system requires precise architectural planning. We tailor dedicated sprint deliverables, fixed-price MVP roadmaps, and ongoing retainers around your specific technical requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openProjectModal('Custom Engineering Scope')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" /> Request Custom Scope Brief
            </button>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs sm:text-sm text-center transition-colors"
            >
              Book Architect Consultation
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {packages.map((tier) => {
            const hasDiscount =
              (tier.discountPercentage && tier.discountPercentage > 0) ||
              tier.discountText ||
              (tier.originalPrice && tier.originalPrice !== tier.price);

            return (
              <div
                key={tier._id || tier.slug}
                className={`glass-card rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  tier.popular
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-900/20 ring-1 ring-purple-500/30'
                    : 'border-white/10 hover:border-purple-500/30'
                }`}
              >
                {/* Popular or Primary Badge */}
                {tier.popular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    {tier.badge || 'Most Popular'}
                  </div>
                ) : tier.badge ? (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-purple-300 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md">
                    {tier.badge}
                  </div>
                ) : null}

                <div>
                  <div className="flex items-center justify-between mb-4 mt-1">
                    <h3 className="text-xl font-bold font-display text-white">{tier.name}</h3>
                  </div>

                  {/* Pricing & Discount Line */}
                  <div className="mb-4">
                    {hasDiscount && (
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {tier.originalPrice && (
                          <span className="text-sm line-through text-slate-400 font-mono">
                            {tier.originalPrice}
                          </span>
                        )}
                        {(tier.discountText || tier.discountPercentage) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                            <Tag className="w-2.5 h-2.5" />
                            {tier.discountText || `${tier.discountPercentage}% OFF`}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-baseline flex-wrap gap-2">
                      <span className="text-4xl font-extrabold font-display text-white">{tier.price}</span>
                      <span className="text-xs text-slate-400">{tier.period}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="pt-4 border-t border-white/5 space-y-3 mb-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Deliverables Included:
                    </div>
                    {tier.deliverables && tier.deliverables.length > 0 ? (
                      tier.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400">Custom engagement deliverables</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => openProjectModal(tier.name)}
                    className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      tier.popular
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> {tier.ctaText || 'Kickoff Sprint'}
                  </button>

                  <Link
                    href={`/contact?service=${encodeURIComponent(tier.name)}`}
                    className="w-full py-2 rounded-lg text-slate-400 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Or ask a question first</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Estimator & Scope Calculator */}
      <ProjectCostEstimator />

      {/* Agency vs Freelancers vs SoloNomous Labs */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-16">
        <AgencyComparison />
      </div>

      {/* Engagement Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">100% IP Ownership</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All source code, Docker configs, documentation, and database schemas belong entirely to your company.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
          <Clock className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Guaranteed Sprints</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We work in defined 2-to-6 week cycles with live milestone demonstrations and continuous deployment.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Post-Launch Warranty</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every deliverable includes a comprehensive stabilization window to ensure zero regression bugs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
