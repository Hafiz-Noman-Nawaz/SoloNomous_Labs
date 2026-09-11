'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Clock, Tag } from 'lucide-react';
import { PricingPackage } from '@/types';
import { useModal } from '@/context/ModalContext';

const DEFAULT_TIERS: PricingPackage[] = [
  {
    _id: 'default-1',
    name: 'Focused Product Sprint',
    slug: 'focused-product-sprint',
    badge: 'Rapid Validation',
    price: '$4,500',
    originalPrice: '$5,000',
    discountPercentage: 10,
    discountText: 'Save 10%',
    period: 'Starting fee / 2-3 Weeks',
    description: 'Ideal for validating an architectural hypothesis, integrating custom RAG, or building a standalone microservice.',
    deliverables: [
      'Complete system architecture blueprint',
      'Working production-ready service / feature',
      'Automated unit & integration test suite',
      'Full GitHub source transfer & documentation',
      '30-day post-launch warranty'
    ],
    popular: false,
    ctaText: 'Kickoff Sprint',
    ctaLink: '/contact',
    displayOrder: 1,
    active: true
  },
  {
    _id: 'default-2',
    name: 'Full-Stack MVP Architecture',
    slug: 'full-stack-mvp-architecture',
    badge: 'Most Popular',
    price: '$8,500',
    originalPrice: '$10,000',
    discountPercentage: 15,
    discountText: 'Save $1,500',
    period: 'Starting fee / 4-6 Weeks',
    description: 'Turnkey SaaS or digital product MVP engineered from scratch with multi-tenancy, auth, and database architecture.',
    deliverables: [
      'Complete Next.js + Node.js full-stack system',
      'Multi-tenant database schema & indexing',
      'Turnkey Clerk authentication & RBAC roles',
      'Production CI/CD deployment pipeline',
      'Stripe billing / subscription integration',
      '60-day post-launch operational SLA'
    ],
    popular: true,
    ctaText: 'Deploy Platform MVP',
    ctaLink: '/contact',
    displayOrder: 2,
    active: true
  },
  {
    _id: 'default-3',
    name: 'Dedicated Retainer & Scale',
    slug: 'dedicated-retainer-and-scale',
    badge: 'High Concurrency',
    price: 'Custom',
    originalPrice: '',
    discountPercentage: 0,
    discountText: '',
    period: 'Monthly Retainer Sprints',
    description: 'For venture-backed startups accelerating product roadmaps or requiring embedded principal systems architecture.',
    deliverables: [
      'Continuous sprint execution & feature rollout',
      'Priority architectural review & chaos testing',
      'Direct Slack/Discord engineer integration',
      'Sub-4-hour emergency SLA response window',
      'Weekly video demonstrations & retrospectives'
    ],
    popular: false,
    ctaText: 'Discuss Retainer Scope',
    ctaLink: '/contact',
    displayOrder: 3,
    active: true
  }
];

interface Props {
  initialPackages?: PricingPackage[];
}

export default function PricingContent({ initialPackages }: Props) {
  const { openProjectModal } = useModal();
  const packages = initialPackages && initialPackages.length > 0 ? initialPackages : DEFAULT_TIERS;

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

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {packages.map((tier) => {
          const hasDiscount = (tier.discountPercentage && tier.discountPercentage > 0) || tier.discountText || (tier.originalPrice && tier.originalPrice !== tier.price);

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
                  <Sparkles className="w-3.5 h-3.5" /> {tier.ctaText || 'Kickoff Sprint'}
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
          <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
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
