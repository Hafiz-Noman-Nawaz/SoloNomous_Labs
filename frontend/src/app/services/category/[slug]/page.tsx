import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { Service, ServiceCategory } from '@/types';
import {
  ArrowRight,
  Layers,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { CursorSpotlight } from '@/components/ui/CursorSpotlight';

interface CategoryPageProps {
  params: { slug: string };
}

// Fallback known category definitions in case DB is warming up
const CATEGORY_MAP: Record<string, { name: string; description: string }> = {
  'web-product': {
    name: 'Web & Product',
    description: 'Modern business websites, full-stack web applications, SaaS MVPs, e-commerce platforms, and custom CMS systems.'
  },
  'ai-machine-learning': {
    name: 'AI & Machine Learning',
    description: 'AI chatbots, RAG knowledge-based systems, AI workflow automation, predictive machine learning models, and smart recommendation engines.'
  },
  'backend-integration': {
    name: 'Backend & Integration',
    description: 'Robust REST APIs, backend microservices, database architectures, and seamless third-party API webhook integrations.'
  },
  'optimization-and-support': {
    name: 'Optimization and support',
    description: 'Technical SEO audits, Core Web Vitals speed acceleration, monthly code maintenance, and continuous engineering.'
  }
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  let categoryName = CATEGORY_MAP[slug]?.name;

  try {
    const catRes = await api.getCategories();
    const found = catRes.data?.find((c) => c.slug === slug || c.slug.toLowerCase() === slug);
    if (found) categoryName = found.name;
  } catch (e) {
    // fallback to static map
  }

  if (!categoryName) {
    categoryName = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }

  return {
    title: `${categoryName} Services | SoloNomous Labs`,
    description: CATEGORY_MAP[slug]?.description || `High-performance engineering services and architectural solutions for ${categoryName}.`
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  let categories: ServiceCategory[] = [];
  let currentCategory: ServiceCategory | null = null;
  let services: Service[] = [];

  try {
    const [catRes, svcRes] = await Promise.all([
      api.getCategories().catch(() => ({ data: [] })),
      api.getServices({ category: slug }).catch(() => ({ data: [] }))
    ]);

    categories = catRes.data || [];
    currentCategory = categories.find((c) => c.slug === slug || c.slug.toLowerCase() === slug) || null;
    services = svcRes.data || [];
  } catch (error) {
    console.error('Error loading category page:', error);
  }

  // If category wasn't found in DB array, check static map
  if (!currentCategory && CATEGORY_MAP[slug]) {
    currentCategory = {
      name: CATEGORY_MAP[slug].name,
      slug: slug,
      description: CATEGORY_MAP[slug].description
    };
  }

  // If still not found and no services returned, 404
  if (!currentCategory && services.length === 0) {
    notFound();
  }

  const categoryName = currentCategory?.name || slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const categoryDesc = currentCategory?.description || CATEGORY_MAP[slug]?.description || 'Engineered solutions built for scalability and performance.';

  // If services query by category was empty, fetch all and filter in memory as safeguard
  if (services.length === 0) {
    try {
      const allSvcRes = await api.getServices();
      const allServices = allSvcRes.data || [];
      const normalizedTarget = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      services = allServices.filter(s => {
        if (!s.category) return false;
        const normalized = s.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalized === normalizedTarget || s.category.toLowerCase().includes(slug.replace(/-/g, ' '));
      });
    } catch (err) {
      console.warn('Fallback services filter failed:', err);
    }
  }

  // Filter other categories for bottom switcher
  const otherCategories = categories.filter(c => c.slug !== slug);

  return (
    <div className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* $20k Luxury FX: Global Cursor Tracking Spotlight & Floating Transparent Glass Orbs */}
      <CursorSpotlight />
      <FloatingOrbs />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-white transition-colors">Services</Link>
        <span>/</span>
        <span className="text-purple-400 font-medium">{categoryName}</span>
      </nav>

      {/* Hero Category Header */}
      <div className="max-w-4xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-3">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Category Focus &middot; {services.length} Specialized Offerings</span>
        </div>

        {/* Category Name as main H1 Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight leading-tight">
          {categoryName}
        </h1>

        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed max-w-3xl">
          {categoryDesc}
        </p>

        {/* Quick Highlights / Stats */}
        <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Senior Full-Stack Architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Zero-Technical-Debt Codebase</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>100% Production Automated Testing</span>
          </div>
        </div>
      </div>

      {/* Services Listing Under This Category */}
      <div className="space-y-8 mb-20">
        {services.length > 0 ? (
          services.map((svc, idx) => (
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
                      {svc.badge || categoryName}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-white group-hover:text-purple-300 transition-colors">
                    <Link href={`/services/${svc.slug}`}>
                      {svc.title}
                    </Link>
                  </h2>

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
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Included Deliverables
                      </h3>
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
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <Link
                        href={`/services/${svc.slug}`}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs text-center transition-all shadow-md shadow-purple-600/20"
                      >
                        Architecture Scope & Details
                      </Link>
                      <a
                        href="https://www.fiverr.com/nomannawaz67"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold text-xs text-center transition-colors inline-flex items-center justify-center gap-1.5"
                        title="Order service directly on Fiverr"
                      >
                        <span>Fiverr Order</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))
        ) : (
          <div className="text-center py-20 p-8 glass-card rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold text-white">No services found for this category yet</h3>
            <p className="text-slate-400 text-sm mt-2">Check back soon or request a custom architectural scope.</p>
            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Browse All Services
            </Link>
          </div>
        )}
      </div>

      {/* Explore Other Categories Switcher */}
      {otherCategories.length > 0 && (
        <div className="mb-20 pt-10 border-t border-white/10">
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">
            Explore Other Engineering Categories
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/services/category/${cat.slug}`}
                className="p-5 rounded-2xl glass-card border border-white/10 hover:border-purple-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {cat.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <span className="text-[11px] text-purple-400 font-medium mt-3 inline-flex items-center gap-1">
                  View category <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Architectural Consultation Callout */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#12111A] to-purple-950/20 border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold font-display text-white">Need a customized {categoryName} solution?</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            We architect tailored solutions for venture-backed founders and scaling operations. Get in touch with our lead architect.
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
