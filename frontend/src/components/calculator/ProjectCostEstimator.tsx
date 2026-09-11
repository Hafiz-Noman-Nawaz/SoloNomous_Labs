'use client';

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Layers,
  Rocket,
  Globe,
  Bot,
  Sliders,
  Database,
  Cpu,
  Zap,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { useModal } from '@/context/ModalContext';

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
  weeks: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  deliverables: string[];
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'fullstack',
    name: 'Full-Stack Web Application',
    basePrice: 500,
    weeks: '2 - 4 Weeks',
    category: 'Core Engineering',
    icon: Layers,
    description: 'Custom React/Next.js frontend tightly integrated with Express/Node.js API and MongoDB/PostgreSQL database.',
    deliverables: ['Custom Next.js Frontend', 'REST/GraphQL API', 'Database Architecture', 'Role-Based Authentication', 'Production Deployment']
  },
  {
    id: 'saas-mvp',
    name: 'SaaS MVP Development',
    basePrice: 1000,
    weeks: '3 - 6 Weeks',
    category: 'Startup Acceleration',
    icon: Rocket,
    description: 'Turnkey SaaS product with user onboarding, recurring subscription workflows, dashboard analytics, and extensible architecture.',
    deliverables: ['Product Architecture', 'Auth & Multi-Tenancy', 'Stripe Billing / Plans', 'Customer Portal', 'Admin Analytics Panel']
  },
  {
    id: 'business-web',
    name: 'High-Converting Business Website',
    basePrice: 250,
    weeks: '1 - 2 Weeks',
    category: 'Web & Growth',
    icon: Globe,
    description: 'Responsive, lightning-fast digital storefront engineered with sub-second page loads, SEO optimization, and lead capture funnels.',
    deliverables: ['Fluid Mobile-First UI', 'Core Web Vitals 95+', 'Lead Capture Funnels', 'SEO Metadata Schema', 'Domain & SSL Setup']
  },
  {
    id: 'ecommerce',
    name: 'Custom E-Commerce Storefront',
    basePrice: 500,
    weeks: '2 - 4 Weeks',
    category: 'Online Retail',
    icon: Database,
    description: 'High-speed headless e-commerce store with product variations, cart slide-over, order processing, and administrative controls.',
    deliverables: ['Product Catalog & Search', 'Cart & Checkout Funnel', 'Order Management Portal', 'Inventory Database', 'Stripe / Card Integration']
  },
  {
    id: 'rag-ai',
    name: 'Enterprise RAG & Knowledge AI',
    basePrice: 750,
    weeks: '2 - 4 Weeks',
    category: 'AI & Intelligence',
    icon: Cpu,
    description: 'Ground AI models with your proprietary documents, PDFs, and data. Includes vector indexing, semantic search, and verifiable citations.',
    deliverables: ['Vector Embeddings Pipeline', 'PDF & Doc Ingestion', 'Zero-Hallucination Retrieval', 'Streaming SSE UI', 'API Integration']
  },
  {
    id: 'ai-chatbot',
    name: 'Conversational AI & Lead Bot',
    basePrice: 400,
    weeks: '1 - 2 Weeks',
    category: 'Conversational AI',
    icon: Bot,
    description: 'Intelligent customer-facing AI assistant capable of answering complex inquiries, capturing leads, and booking meetings automatically.',
    deliverables: ['Streaming Conversational UI', 'Domain Knowledge Training', 'Lead Capture Escalation', 'WhatsApp / Email Alerts', 'Chat Telemetry']
  },
  {
    id: 'custom-cms',
    name: 'Custom CMS & Admin Portal',
    basePrice: 350,
    weeks: '1 - 3 Weeks',
    category: 'Business Operations',
    icon: Sliders,
    description: 'Empower your non-technical team to edit content, manage product listings, track leads, and query data without developer intervention.',
    deliverables: ['Custom CRUD Dashboards', 'Granular Role Permissions', 'Rich Text / Media Uploads', 'Export to CSV / Excel', 'Audit Logs']
  },
  {
    id: 'speed-seo',
    name: 'Speed Optimization & Technical SEO',
    basePrice: 200,
    weeks: '3 - 7 Days',
    category: 'Performance',
    icon: Zap,
    description: 'Transform slow, laggy websites into sub-second powerhouses. Fix Lighthouse bottlenecks, compress assets, and configure rich schema tags.',
    deliverables: ['Core Web Vitals Audit', 'Asset & Bundle Trimming', 'Server Caching Optimization', 'JSON-LD Rich Snippets', 'Search Console Validation']
  }
];

interface AddonOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'admin-portal',
    name: 'Role-Based Admin Console',
    price: 250,
    description: 'Manage users, records, leads, and operational content with secure role permissions.'
  },
  {
    id: 'ai-assistant',
    name: 'Embedded AI Chat Assistant',
    price: 350,
    description: '24/7 intelligent customer assistant with streaming responses and automatic lead capture.'
  },
  {
    id: 'stripe-billing',
    name: 'Payment & Billing Gateway',
    price: 200,
    description: 'Stripe, PayPal, or card checkout with automated webhooks and customer receipts.'
  },
  {
    id: 'auth-clerk',
    name: 'Turnkey Auth (Clerk / JWT)',
    price: 150,
    description: 'Social login (Google, GitHub), passwordless email codes, and session security.'
  },
  {
    id: 'performance-seo',
    name: 'Sub-Second Speed & SEO Polish',
    price: 150,
    description: 'Guaranteed 95+ Core Web Vitals, OpenGraph cards, and schema microdata.'
  },
  {
    id: 'extended-warranty',
    name: '60-Day Extended Warranty & Retainer',
    price: 200,
    description: 'Two full months of priority bug fixes, dependency patches, and architectural support.'
  }
];

const TIERS = [
  {
    id: 'mvp',
    name: 'Starter / MVP',
    multiplier: 1.0,
    badge: 'Fast Validation',
    description: 'Core functionality engineered for rapid market entry and client feedback.'
  },
  {
    id: 'growth',
    name: 'Growth & Scaled',
    multiplier: 1.35,
    badge: 'Most Popular',
    description: 'Expanded feature set, elevated data modeling, and traffic resilience.'
  },
  {
    id: 'enterprise',
    name: 'Production Enterprise',
    multiplier: 1.75,
    badge: 'Zero Compromise',
    description: 'High-concurrency architecture, advanced security auditing, and deep telemetry.'
  }
];

export const ProjectCostEstimator: React.FC = () => {
  const { openProjectModal } = useModal();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('fullstack');
  const [selectedTierId, setSelectedTierId] = useState<string>('growth');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['admin-portal', 'auth-clerk']);

  const selectedService = SERVICE_OPTIONS.find((s) => s.id === selectedServiceId) || SERVICE_OPTIONS[0];
  const selectedTier = TIERS.find((t) => t.id === selectedTierId) || TIERS[1];

  // Calculate pricing based on Noman's real rates
  const baseServicePrice = selectedService.basePrice;
  const tierAdjustedBase = Math.round(baseServicePrice * selectedTier.multiplier);
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDON_OPTIONS.find((a) => a.id === addonId);
    return sum + (addon?.price || 0);
  }, 0);

  const totalEstimate = tierAdjustedBase + addonsTotal;
  const minRange = Math.round(totalEstimate * 0.95);
  const maxRange = Math.round(totalEstimate * 1.15);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const generateWhatsAppMessage = () => {
    const addonNames = selectedAddons
      .map((id) => ADDON_OPTIONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const msg = `Hi Noman! I configured a project on the SoloNomous Labs Scope Estimator:
- Service: ${selectedService.name}
- Tier: ${selectedTier.name}
- Add-ons: ${addonNames || 'None'}
- Estimated Range: $${minRange.toLocaleString()} - $${maxRange.toLocaleString()} USD
- Target Timeline: ${selectedService.weeks}

I would like to discuss this scope and confirm availability.`;

    return `https://wa.me/923156251281?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="estimator">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" /> Interactive Scope & Investment Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Calculate Your Sprint Investment in <span className="text-gradient-purple">Real Time</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            No vague quotes or hidden fees. We build with transparent starting rates, milestone deliverables, and 100% intellectual property ownership signed from day one.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Selectors (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Service Selection */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Step 1: Choose Core Capability
                </span>
                <span className="text-xs text-slate-400">Fixed starting prices</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_OPTIONS.map((svc) => {
                  const Icon = svc.icon;
                  const isSelected = selectedServiceId === svc.id;

                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedServiceId(svc.id)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/40'
                          : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/5 text-purple-400 border border-white/10'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          From ${svc.basePrice}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{svc.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {svc.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Architecture Scope Tier */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/10">
              <span className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-4">
                Step 2: Architecture Scale & Complexity
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIERS.map((tier) => {
                  const isSelected = selectedTierId === tier.id;

                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-950/40 ring-1 ring-purple-500/30'
                          : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-2 ${
                            isSelected
                              ? 'bg-purple-500/30 text-purple-200'
                              : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          {tier.badge}
                        </span>
                        <h4 className="text-sm font-bold text-white mb-1">{tier.name}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {tier.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add-on Capabilities */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Step 3: Optional Specialized Modules
                </span>
                <span className="text-xs text-slate-400">Select what you need</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDON_OPTIONS.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);

                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-purple-600/15 border-purple-500/80 text-white'
                          : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/15'
                      }`}
                    >
                      <div className="space-y-1 pr-1">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{addon.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {addon.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-semibold text-purple-300">
                          +${addon.price}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-md border mt-1.5 ml-auto flex items-center justify-center ${
                            isSelected
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'border-white/20 bg-white/5'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Dynamic Quote Breakdown (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="glass-card p-7 sm:p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden shadow-2xl shadow-purple-950/40">
              {/* Top ambient highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Investment Estimate
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                  Milestone-Based
                </span>
              </div>

              {/* Price Range Display */}
              <div className="mb-6">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  ${minRange.toLocaleString()}{' '}
                  <span className="text-xl sm:text-2xl text-slate-400 font-normal">–</span>{' '}
                  ${maxRange.toLocaleString()}{' '}
                  <span className="text-sm sm:text-base font-normal text-slate-400">USD</span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Estimated Turnaround: <strong className="text-white">{selectedService.weeks}</strong>
                </p>
              </div>

              {/* Scope Breakdown */}
              <div className="space-y-3 pt-5 border-t border-white/10 text-xs mb-6">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Core Capability ({selectedService.name}):</span>
                  <span className="font-mono font-semibold text-white">${tierAdjustedBase.toLocaleString()}</span>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Active Specialized Modules ({selectedAddons.length}):
                    </span>
                    {selectedAddons.map((addonId) => {
                      const addon = ADDON_OPTIONS.find((a) => a.id === addonId);
                      if (!addon) return null;
                      return (
                        <div key={addon.id} className="flex items-center justify-between text-slate-400 pl-2">
                          <span className="text-[11px] truncate max-w-[200px]">• {addon.name}</span>
                          <span className="font-mono text-slate-300">+${addon.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Verified Guarantees */}
              <div className="space-y-2.5 pt-5 border-t border-white/10 mb-7">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Guaranteed Deliverables Included:
                </div>
                {selectedService.deliverables.slice(0, 4).map((del, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2 text-xs text-purple-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>100% IP Ownership & Full Source Code Day 1</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => openProjectModal(selectedService.name)}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Rocket className="w-4 h-4" /> Lock In Scope & Start Project
                </button>

                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-2 text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Share Quote Directly via WhatsApp
                </a>
              </div>

              {/* Direct consultation note */}
              <p className="text-[11px] text-slate-400 text-center mt-4">
                Need a multi-phase corporate retainer or custom NDA?{' '}
                <a href="/contact" className="text-purple-400 hover:underline">
                  Book a direct strategy call
                </a>
              </p>
            </div>

            {/* Risk-Reversal Reassurance Pill */}
            <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-around text-center">
              <div>
                <div className="text-xs font-bold text-white">Mutual NDA</div>
                <div className="text-[10px] text-slate-400">Pre-engagement sign</div>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <div className="text-xs font-bold text-white">Milestone Sprints</div>
                <div className="text-[10px] text-slate-400">Pay as we deliver</div>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <div className="text-xs font-bold text-white">30-Day Warranty</div>
                <div className="text-[10px] text-slate-400">Post-launch support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
