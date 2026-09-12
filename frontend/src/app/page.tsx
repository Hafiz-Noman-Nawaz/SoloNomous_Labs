'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroFlaskCanvas } from '@/components/3d/HeroFlaskCanvas';
import { api } from '@/lib/api';
import { Service, CaseStudy, Testimonial, SiteSettings } from '@/types';
import { useModal } from '@/context/ModalContext';
import {
  ArrowRight,
  Rocket,
  ShieldCheck,
  Cpu,
  Layers,
  Star,
  CheckCircle2,
  Calendar,
  Lock,
  UserCheck,
  Loader2,
  X,
  Calculator,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import confetti from 'canvas-confetti';
import { TiltCard } from '@/components/ui/TiltCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { KeyImpactsCarousel } from '@/components/ui/KeyImpactsCarousel';
import GradientWaves from '@/components/backgrounds/GradientWaves';
import Aurora from '@/components/backgrounds/Aurora';
import { useTheme } from '@/context/ThemeContext';
import { ProjectCostEstimator } from '@/components/calculator/ProjectCostEstimator';
import { AgencyComparison } from '@/components/home/AgencyComparison';
import { LowRiskEntryOffers } from '@/components/home/LowRiskEntryOffers';

export default function HomePage() {
  const { user, isSignedIn } = useUser();
  const { openProjectModal } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Client review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewRole, setReviewRole] = useState('');
  const [reviewCompany, setReviewCompany] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    api.getSettings().then((res) => res.data && setSettings(res.data)).catch(console.warn);
    api.getServices().then((res) => res.data && setServices(res.data)).catch(console.warn);
    api.getCaseStudies(true).then((res) => res.data && setCaseStudies(res.data)).catch(console.warn);
    api.getTestimonials().then((res) => res.data && setTestimonials(res.data)).catch(console.warn);
  }, []);

  const triggerStart = (service?: string) => {
    openProjectModal(service);
  };

  const scrollToEstimator = () => {
    const el = document.getElementById('cost-estimator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) return;
    if (!reviewContent.trim()) {
      setReviewError('Please provide review feedback.');
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);

    try {
      const clientName = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Verified Client';
      const res = await fetch('/api/v1/testimonials/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          role: reviewRole || 'Verified Client',
          company: reviewCompany || 'Engineering Partner',
          content: reviewContent,
          rating: reviewRating
        })
      }).then(r => r.json());

      if (!res.success) {
        throw new Error(res.message || 'Submission failed');
      }

      setTestimonials(prev => [res.data, ...prev]);
      setReviewSuccess(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        setReviewSuccess(false);
        setReviewModalOpen(false);
        setReviewContent('');
        setReviewRole('');
        setReviewCompany('');
      }, 2500);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const hero = settings?.heroSection || {
    badgeText: 'Founder-Led Engineering Studio',
    headline: 'High-Performance Web Apps, SaaS MVPs & AI Automation.',
    subheadline: 'Engineered directly by lead architect Noman Nawaz. Fast 2–4 week sprints, transparent milestone pricing, and 100% intellectual property ownership from Day 1.',
    primaryCta: 'Start a Project',
    secondaryCta: 'Calculate Scope & Cost'
  };

  return (
    <div className="relative overflow-hidden text-slate-900 dark:text-slate-100">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-6 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Dark Theme WebGL Background */}
        {isDark && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <GradientWaves
              horizonColor="#5227FF"
              waveColor="#FF9FFC"
              crestColor="#FFFFFF"
              speed={0.4}
              amplitude={2.5}
              waveScale={0.6}
              waveRatio={0.9}
              swell={35}
              turbulence={20}
              tilt={1.11}
              zoom={1}
              height={5.5}
              fogDepth={15}
              detail="medium"
              brightness={1}
              opacity={0.8}
              mouseInteraction
              parallaxStrength={0.5}
              grain
              grainIntensity={0.05}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-[#09080E]/40 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#09080E]/90 via-[#09080E]/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09080E] to-transparent pointer-events-none" />
          </div>
        )}

        {/* Light Theme Background */}
        {!isDark && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <Aurora
              colorStops={['#7C3AED', '#0284C7', '#D946EF']}
              amplitude={1.1}
              blend={0.5}
              speed={0.7}
              className="w-full h-full opacity-60"
            />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 dark:bg-white/[0.08] border border-purple-500/20 dark:border-white/10 backdrop-blur-md text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{hero.badgeText}</span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold font-display leading-[1.12] tracking-tight text-slate-900 dark:text-white">
              We build <span className="text-gradient-purple">serious digital products</span>, not just websites.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-200 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {hero.subheadline}
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <MagneticButton
                onClick={() => triggerStart()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-purple-200" />
                <span>{hero.primaryCta || 'Start a Project'}</span>
              </MagneticButton>

              <button
                type="button"
                onClick={scrollToEstimator}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{hero.secondaryCta || 'Calculate Scope & Cost'}</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 border-t border-slate-200 dark:border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">2 – 4 Wks</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Rapid MVP Delivery</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-purple-600 dark:text-purple-400">From $250</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Transparent Milestones</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">100%</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Full Code & IP Ownership</div>
              </div>
            </div>
          </div>

          {/* Right: Laboratory Flask Canvas */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative">
              <HeroFlaskCanvas />
              <div className="absolute -bottom-2 -left-4 sm:left-4 p-3 rounded-xl bg-white/90 dark:bg-[#12111A]/90 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Founder-Led Guarantee</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Direct architecture & coding by Noman</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROVEN CASE STUDIES (SHOW REAL WORK IMMEDIATELY) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/50 dark:bg-[#07060B]/60 border-y border-slate-200/80 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Proven Track Record
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                Flagship Systems in Production
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
                Real software built from scratch, deployed live, and actively generating value for users.
              </p>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Explore all case studies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {caseStudies.length > 0 ? (
              caseStudies.map((study) => (
                <TiltCard
                  key={study.slug}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-200 dark:border-white/10"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-purple-950/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={study.heroImage?.url}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 dark:bg-black/70 backdrop-blur-md text-[11px] font-semibold text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-white/10">
                      {study.industry}
                    </div>
                    {(study.startDate || study.duration) && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                        <span>{study.startDate ? `${study.startDate} – ${study.endDate || 'Present'}` : study.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors mb-2 leading-snug">
                        {study.title}
                      </h3>

                      {study.techStack && study.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {study.techStack.slice(0, 3).map((tech, ti) => (
                            <span
                              key={ti}
                              className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-mono font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                        {study.overview}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <KeyImpactsCarousel results={study.results} />

                      <Link
                        href={`/work/${study.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:underline"
                      >
                        Read Full Case Study <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              ))
            ) : (
              <div className="col-span-3 glass-card p-10 rounded-2xl text-center">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold mb-1">
                  Verified Flagships: ZeoAtlas & Zashas
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 max-w-md mx-auto">
                  Explore full interactive architectures and live demos in our portfolio directory.
                </p>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-all"
                >
                  View Case Studies <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. WHAT WE BUILD & STARTING RATES (CLEAR & SELF-TAUGHT) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12 text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              Capabilities & Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              What We Build <span className="text-gradient-purple">& What It Costs</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Transparent, milestone-based packages designed for founders, businesses, and product teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Web Applications & Portals */}
            <div className="glass-card p-7 rounded-2xl flex flex-col justify-between border border-slate-200 dark:border-white/10 shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wider mb-1">
                  From $250 – $500
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
                  Modern Web Apps & Portals
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  High-speed Next.js platforms, client portals, and interactive dashboards with sub-second page loads, SEO optimization, and responsive design.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Next.js 14 / React 19 + TypeScript</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>User Authentication & Secure DB</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>1–2 Week Rapid Turnaround</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => triggerStart('Web Applications & Portals')}
                className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-semibold text-xs transition-all border border-purple-200 dark:border-purple-500/30"
              >
                Inquire About Web Apps
              </button>
            </div>

            {/* Card 2: Full-Stack SaaS MVP */}
            <div className="glass-card p-7 rounded-2xl flex flex-col justify-between border-2 border-purple-500/50 shadow-xl relative">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-purple-600 text-white text-[11px] font-bold uppercase tracking-wider shadow">
                Most Popular
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                  <Rocket className="w-5 h-5" />
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wider mb-1">
                  From $500 – $1,000+
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
                  Full-Stack SaaS MVP
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  Complete commercial launchpad: User management, Stripe subscriptions, database schemas, transactional emails, and admin control panels.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Stripe Billing & Tiered Subscriptions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Role-Based Access & Admin Panel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>30-Day Post-Launch Stabilization</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => triggerStart('Full-Stack SaaS MVP')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30"
              >
                Launch Your SaaS MVP
              </button>
            </div>

            {/* Card 3: AI Agents & Automation */}
            <div className="glass-card p-7 rounded-2xl flex flex-col justify-between border border-slate-200 dark:border-white/10 shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wider mb-1">
                  From $450 – $1,200+
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
                  AI Agents & Workflows
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  Autonomous LLM pipelines, vector database search (RAG), automated CRM data extraction, and intelligent customer-facing assistants.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>OpenAI / Anthropic / Gemini Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Vector Search & Document Knowledge Bases</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Deterministic Guards & Fallbacks</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => triggerStart('Autonomous AI Agents & Workflows')}
                className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-semibold text-xs transition-all border border-purple-200 dark:border-purple-500/30"
              >
                Inquire About AI Automation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE ESTIMATOR (SELF-GUIDED CALCULATOR) */}
      <div id="cost-estimator">
        <ProjectCostEstimator />
      </div>

      {/* 5. LOW RISK ENTRY OFFERS (ZERO RISK FIRST STEP) */}
      <LowRiskEntryOffers />

      {/* 6. COMPARISON MATRIX (SOLONOMOUS VS AGENCIES & FREELANCERS) */}
      <AgencyComparison />

      {/* 7. VERIFIED REVIEWS & FOUNDER ENDORSEMENTS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Client Trust & Verification
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                Rated 5.0 ★ by Engineering Partners
              </h2>
            </div>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
            >
              <Star className="w-3.5 h-3.5 fill-purple-500 text-purple-500" />
              <span>Leave a Verified Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.length > 0 ? (
              testimonials.map((t, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-200 dark:border-white/10">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                      &ldquo;{t.content}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80 dark:border-white/10">
                    <div className="w-9 h-9 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-800 dark:text-purple-200">
                      {t.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{t.clientName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {t.role}, <span className="text-purple-700 dark:text-purple-300">{t.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 glass-card p-8 rounded-2xl text-center border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  100% Satisfaction SLA &amp; Direct Founder Access
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Every project is backed by mutual non-disclosure, 100% intellectual property transfer, and a 30-day post-launch warranty.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. CALM, HIGH-CONVERSION FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 text-center bg-purple-900/10 dark:bg-[#161424] border border-purple-500/30 shadow-2xl relative overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4">
            <UserCheck className="w-3.5 h-3.5" /> Founder-Led Engineering
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white max-w-2xl mx-auto leading-tight">
            Ready to build your product without agency overhead?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-3 mb-8 leading-relaxed">
            Share a brief sentence about what you need built. Founder Noman Nawaz will personally review your project and send a preliminary roadmap within 4 hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => triggerStart()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-xl shadow-purple-600/30 cursor-pointer"
            >
              Start a Project Brief
            </button>
            <a
              href="https://wa.me/923069352726?text=Hi%20Noman%2C%20I%27d%20like%20to%20discuss%20a%20new%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* CLIENT RATING & REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#12111A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Star className="w-5 h-5 fill-current" />
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Client Rating & Review</h3>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your verified rating and testimonial have been published.</p>
              </div>
            ) : !isSignedIn ? (
              <div className="space-y-4 text-xs pt-2">
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-semibold">
                    <Lock className="w-4 h-4" />
                    <span>Client Verification Required</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    To maintain the highest authenticity and protect against spam, please sign in with your client account before posting a rating.
                  </p>
                </div>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" /> Sign In to Submit Review
                  </button>
                </SignInButton>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Submitting as: <strong className="text-slate-900 dark:text-white">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</strong></span>
                </div>

                {reviewError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/20 text-rose-600 dark:text-red-400">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Rating (Stars)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold ml-2">{reviewRating} / 5 Stars</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Your Role / Title</label>
                    <input
                      type="text"
                      placeholder="CTO / Founder"
                      value={reviewRole}
                      onChange={(e) => setReviewRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={reviewCompany}
                      onChange={(e) => setReviewCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Your Review &amp; Feedback *</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Describe your engineering experience working with SoloNomous Labs..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className="w-3.5 h-3.5 fill-current" />}
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
