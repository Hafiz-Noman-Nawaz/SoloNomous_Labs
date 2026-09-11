'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Service, ServiceCategory } from '@/types';
import {
  ArrowRight,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Layers,
  Globe,
  Bot,
  Server,
  Wrench
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import { useModal } from '@/context/ModalContext';

const DEFAULT_CATEGORIES: ServiceCategory[] = [
  {
    name: 'Web & Product',
    slug: 'web-product',
    description: 'Modern business websites, full-stack web applications, SaaS MVPs, e-commerce platforms, and custom CMS systems.'
  },
  {
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    description: 'AI chatbots, RAG knowledge-based systems, AI workflow automation, and predictive machine learning models.'
  },
  {
    name: 'Backend & Integration',
    slug: 'backend-integration',
    description: 'Robust REST APIs, backend microservices, database architectures, and third-party API webhook integrations.'
  },
  {
    name: 'Optimization and support',
    slug: 'optimization-and-support',
    description: 'Technical SEO audits, Core Web Vitals speed acceleration, monthly code maintenance, and continuous engineering.'
  }
];

export default function ServicesPage() {
  const { openProjectModal } = useModal();
  const [categories, setCategories] = useState<ServiceCategory[]>(DEFAULT_CATEGORIES);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getCategories().catch(() => ({ data: [] })),
      api.getServices().catch(() => ({ data: [] }))
    ])
      .then(([catRes, svcRes]) => {
        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
        if (svcRes.data && svcRes.data.length > 0) {
          setServices(svcRes.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getCategoryIcon = (slugOrName: string) => {
    const s = slugOrName.toLowerCase();
    if (s.includes('web') || s.includes('product')) return Globe;
    if (s.includes('ai') || s.includes('machine') || s.includes('learning')) return Bot;
    if (s.includes('backend') || s.includes('integration') || s.includes('api')) return Server;
    if (s.includes('optimiz') || s.includes('support') || s.includes('seo') || s.includes('maintenance')) return Wrench;
    return Layers;
  };

  const getServicesForCategory = (catNameOrSlug: string) => {
    const normalizedTarget = catNameOrSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    return services.filter((s) => {
      if (!s.category) return false;
      const normalizedCat = s.category.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedCat === normalizedTarget || s.category.toLowerCase().includes(catNameOrSlug.toLowerCase().replace(/-/g, ' '));
    });
  };

  // Only display categories that actually have at least 1 service
  const populatedCategories = categories.filter((c) => {
    const count = getServicesForCategory(c.name).length;
    return count > 0 || (c.serviceCount !== undefined && c.serviceCount > 0);
  });

  const activeCategories = selectedCategory === 'all'
    ? populatedCategories
    : populatedCategories.filter(c => c.slug === selectedCategory);

  return (
    <div className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>Full Architectural Catalog &middot; {services.length} Active Services</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
          Engineered for <span className="text-gradient-purple">mission-critical scale</span>.
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          From multi-tenant enterprise SaaS applications to autonomous RAG knowledge systems, every service we offer is executed with senior architectural oversight, verified test coverage, and clear production deliverables.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-14 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 w-fit">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          All Categories ({services.length})
        </button>
        {populatedCategories.map((cat) => {
          const count = getServicesForCategory(cat.name).length || cat.serviceCount || 0;
          const isSelected = selectedCategory === cat.slug;
          const Icon = getCategoryIcon(cat.slug);

          return (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Services Sections Grouped by Category */}
      <div className="space-y-20 mb-20">
        {activeCategories.map((cat) => {
          const catServices = getServicesForCategory(cat.name);
          const Icon = getCategoryIcon(cat.slug);

          return (
            <div key={cat.slug} id={cat.slug} className="scroll-mt-24 space-y-8">
              {/* Category Header Bar */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/30 via-white/[0.02] to-transparent border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                        {cat.name}
                      </h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-mono border border-purple-500/20">
                        {catServices.length} Services
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/services/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-600/20 text-purple-300 hover:text-white border border-white/10 hover:border-purple-500/30 text-xs font-semibold transition-all shrink-0 self-start sm:self-center"
                >
                  <span>Dedicated Category Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Category Services Cards */}
              <div className="space-y-6">
                {catServices.map((svc, idx) => (
                  <TiltCard
                    key={svc.slug}
                    className="glass-card p-8 sm:p-10 rounded-3xl border border-white/10 hover:border-purple-500/40 relative overflow-hidden group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left Info (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-purple-400 px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
                            0{idx + 1}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                            {svc.badge || cat.name}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-bold font-display text-white group-hover:text-purple-300 transition-colors">
                          <Link href={`/services/${svc.slug}`}>
                            {svc.title}
                          </Link>
                        </h3>

                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                          {svc.summary}
                        </p>

                        {/* Key Features List */}
                        {svc.features && svc.features.length > 0 && (
                          <div className="pt-2 space-y-2">
                            {svc.features.slice(0, 3).map((feat, fidx) => (
                              <div key={fidx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                <span>
                                  <strong className="text-white font-semibold">{feat.title}:</strong> {feat.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tech Badges */}
                        {svc.techStack && svc.techStack.length > 0 && (
                          <div className="pt-3 flex flex-wrap gap-2">
                            {svc.techStack.map((t) => (
                              <span
                                key={t}
                                className="px-2.5 py-1 rounded-md bg-white/5 text-xs font-mono text-slate-300 border border-white/5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Deliverables & CTA (5 cols) */}
                      <div className="lg:col-span-5 p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between h-full space-y-6">
                        {svc.deliverables && svc.deliverables.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                              Typical Deliverables
                            </h4>
                            <ul className="space-y-2 text-xs text-slate-300">
                              {svc.deliverables.map((d, di) => (
                                <li key={di} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-4 border-t border-white/5">
                          {svc.startingPrice && (
                            <div className="text-xs text-slate-400 mb-3">
                              Starting at <span className="text-lg font-bold text-white">${svc.startingPrice.toLocaleString()}</span> USD{svc.pricingInterval && svc.pricingInterval !== 'one_time' ? ` ${svc.pricingInterval}` : ''}
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              onClick={() => openProjectModal(svc.title)}
                              className="flex-1 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs text-center transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5"
                            >
                              <span>Order Service</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              href={`/services/${svc.slug}`}
                              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs text-center transition-all"
                            >
                              Details
                            </Link>
                            <a
                              href="https://www.fiverr.com/nomannawaz67"
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold text-xs text-center transition-colors inline-flex items-center justify-center gap-1"
                              title="Order service directly on Fiverr"
                            >
                              <span>Fiverr</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Kickoff Callout */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#12111A] to-purple-950/20 border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold font-display text-white">Have a unique architectural challenge?</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            We regularly consult with engineering leaders on high-load bottlenecks, vector search migrations, and dedicated sprint scopes.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl bg-white text-black hover:bg-slate-200 font-semibold text-sm transition-all shrink-0"
        >
          Book Architectural Review
        </Link>
      </div>
    </div>
  );
}
