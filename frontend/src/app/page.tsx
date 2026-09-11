'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroFlaskCanvas } from '@/components/3d/HeroFlaskCanvas';
import { api } from '@/lib/api';
import { Service, CaseStudy, BlogPost, Testimonial, SiteSettings } from '@/types';
import { useModal } from '@/context/ModalContext';
import {
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  ShieldAlert,
  Server,
  Star,
  Loader2,
  X,
  Lock,
  UserCheck,
  Calendar
} from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import confetti from 'canvas-confetti';
import { TiltCard } from '@/components/ui/TiltCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { CursorSpotlight } from '@/components/ui/CursorSpotlight';
import { KeyImpactsCarousel } from '@/components/ui/KeyImpactsCarousel';

export default function HomePage() {
  const { user, isSignedIn } = useUser();
  const { openProjectModal } = useModal();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
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
    api.getBlogPosts({ limit: 3, featured: true } as any).then((res) => res.data && setBlogPosts(res.data)).catch(console.warn);
    api.getTestimonials().then((res) => res.data && setTestimonials(res.data)).catch(console.warn);
  }, []);

  const triggerStart = (service?: string) => {
    openProjectModal(service);
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
    badgeText: 'Autonomous Systems & Advanced Software Studio',
    headline: 'We build serious digital products, not just websites.',
    subheadline: 'SoloNomous Labs combines experimental research rigor with production engineering reliability. We design and deploy high-throughput web applications, scalable multi-tenant SaaS platforms, and enterprise AI engines.',
    primaryCta: 'Start a Project',
    secondaryCta: 'Explore Capabilities'
  };

  return (
    <div className="relative overflow-hidden">
      {/* $20k Luxury FX: Global Cursor Tracking Spotlight & Transparent Levitating Glass Orbs */}
      <CursorSpotlight />
      <FloatingOrbs />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-medium text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>{hero.badgeText}</span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-extrabold font-display leading-[1.08] tracking-tight text-white">
              We build <span className="text-gradient-purple">serious digital products</span>, not just websites.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {hero.subheadline}
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <MagneticButton
                onClick={() => triggerStart()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>{hero.primaryCta || 'Start a Project'}</span>
              </MagneticButton>

              <Link
                href="/services"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
              >
                {hero.secondaryCta || 'Explore Capabilities'}
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </Link>
            </div>

            {/* Business Outcomes Proof Bar */}
            <div className="pt-6 border-t border-white/5 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-white">4 - 8 Wks</div>
                <div className="text-[11px] text-slate-400">Rapid MVP Delivery</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-purple-400">99.9%</div>
                <div className="text-[11px] text-slate-400">System Reliability SLA</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-white">100%</div>
                <div className="text-[11px] text-slate-400">Full IP Ownership</div>
              </div>
            </div>
          </div>

          {/* Right: 3D Interactive Laboratory Flask (5 Cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative">
              <HeroFlaskCanvas />

              {/* Floating enterprise value badges */}
              <div className="absolute -bottom-2 -left-4 sm:left-4 p-3 rounded-xl bg-[#12111A]/90 border border-white/10 backdrop-blur-md shadow-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Verifiable Accuracy</div>
                  <div className="text-[10px] text-slate-400">Deterministic workflows & data security</div>
                </div>
              </div>

              <div className="hidden sm:flex absolute -top-4 -right-4 p-3 rounded-xl bg-[#12111A]/90 border border-white/10 backdrop-blur-md shadow-xl items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Enterprise Scalability</div>
                  <div className="text-[10px] text-slate-400">Multi-tenant infrastructure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL RIGOR & STANDARDS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-white/5 bg-[#07060B]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Laboratory Standards
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white mt-2">
              Engineering with scientific discipline, not template guesswork.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Most digital agencies assemble fragile templates that fail under real customer volume. We treat software engineering like a technical laboratory: clean data modeling, robust boundaries, deterministic testing, and benchmarked reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Defensive by Default</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Every endpoint is safeguarded with strict schema validation, rate-limiting, and sanitized inputs. Security is engineered at the core boundary.
              </p>
            </TiltCard>

            <TiltCard className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Autonomous Systems</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We integrate intelligent retrieval engines, automated worker queues, and deterministic citation guards into your core operational workflows.
              </p>
            </TiltCard>

            <TiltCard className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Production Scalability</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Architected from day one for multi-tenancy, clean modularity, and distributed reliability so your platform effortlessly scales with your business.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
                Engineered for Market Impact
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                High-leverage engineering services structured for venture-backed startups and growth enterprises.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              View all capabilities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.slice(0, 4).map((svc) => (
              <TiltCard
                key={svc.slug}
                data-cursor="project"
                className="glass-card p-7 rounded-2xl relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                      {svc.badge || 'Engineering'}
                    </span>
                    {svc.startingPrice && (
                      <span className="text-xs text-slate-400">
                        From <span className="text-white font-semibold">${svc.startingPrice.toLocaleString()}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold font-display text-white group-hover:text-purple-300 transition-colors mb-2">
                    {svc.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {svc.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={`/services/${svc.slug}`}
                    className="text-xs font-semibold text-white group-hover:text-purple-400 inline-flex items-center gap-1 transition-colors"
                  >
                    View Scope & Methodology <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => triggerStart(svc.title)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                  >
                    Kickoff Sprint
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED WORK */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#07060B] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Selected Work
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
                Engineered Case Studies
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Production platforms delivered with verified operational outcomes.
              </p>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Explore all case studies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {caseStudies.length === 0 ? (
            <div className="glass-card p-10 rounded-2xl text-center border border-white/5">
              <p className="text-slate-300 text-sm mb-2 font-medium">Enterprise Case Studies in Production</p>
              <p className="text-slate-400 text-xs mb-4 max-w-md mx-auto">
                Explore real-world software architectures and live systems directly on Noman Nawaz&apos;s verified portfolio.
              </p>
              <a
                href="https://www.nouman-nawaz.dev/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:text-white transition-all"
              >
                View Architectures at nouman-nawaz.dev <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <TiltCard
                  key={study.slug}
                  data-cursor="project"
                  className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/8"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-purple-950/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={study.heroImage?.url}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-semibold text-purple-300 border border-white/10">
                      {study.industry}
                    </div>
                    {(study.startDate || study.duration) && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10 flex items-center gap-1 shadow-lg">
                        <Calendar className="w-2.5 h-2.5 text-purple-400" />
                        <span>{study.startDate ? `${study.startDate} – ${study.endDate || 'Present'}` : study.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold font-display text-white group-hover:text-purple-300 transition-colors mb-2 leading-snug">
                        {study.title}
                      </h3>

                      {study.techStack && study.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {study.techStack.slice(0, 3).map((tech, ti) => (
                            <span
                              key={ti}
                              className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-mono font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                          {study.techStack.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 text-[10px] font-mono">
                              +{study.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                        {study.overview}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <KeyImpactsCarousel results={study.results} />

                      <Link
                        href={`/work/${study.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-purple-400 transition-colors"
                      >
                        Read Full Case Study <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. THE 4-STEP SPRINT METHODOLOGY */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
              The 4-Step Engineering Cycle
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              From architectural blueprint to production deployment in predictable cadence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Architecture Blueprint',
                desc: 'Schema design, API contracts, entity-relationship mapping, and system topology before writing a line of code.'
              },
              {
                step: '02',
                title: 'Core Foundations',
                desc: 'Component architecture, typography tokens, reactive state managers, and authentication guardrails.'
              },
              {
                step: '03',
                title: 'Synthesis & Benchmarks',
                desc: 'End-to-end integration, automated worker queues, vector indexing, and rigorous load verification.'
              },
              {
                step: '04',
                title: 'Cutover & Handover',
                desc: 'Zero-downtime deployment, observability dashboards, and 100% intellectual property transfer.'
              }
            ].map((p) => (
              <div key={p.step} className="glass-card p-6 rounded-2xl relative">
                <div className="text-3xl font-black font-display text-purple-500/30 mb-3">
                  {p.step}
                </div>
                <h3 className="text-base font-bold font-display text-white mb-2">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PILLAR ARTICLES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#07060B] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Pillar Research & Insights
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
                Engineering Dispatches
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Technical guides and architectural analyses from our engineering studio.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Read all articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {blogPosts.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center border border-white/5">
              <p className="text-slate-400 text-xs">Architectural research and engineering dispatches are currently in editorial publication.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map((post) => (
                <article
                  key={post.slug}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-purple-950/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.featuredImage?.url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-semibold text-purple-300">
                        {post.category?.name || 'Architecture'}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="text-[11px] text-slate-400 mb-2">
                        {post.readingTimeMinutes} min read
                      </div>
                      <h3 className="text-base font-bold font-display text-white group-hover:text-purple-300 transition-colors mb-2 leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
                    >
                      Read article <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Verified Feedback & Ratings
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
                Endorsed by Technical Leaders
              </h2>
            </div>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
              <span>Leave a Rating & Review</span>
            </button>
          </div>

          {testimonials.length === 0 ? (
            <div className="glass-card p-10 rounded-2xl text-center border border-white/5">
              <p className="text-slate-300 text-sm font-medium mb-2">Verified Client Endorsements</p>
              <p className="text-slate-400 text-xs mb-4 max-w-md mx-auto">
                We take immense pride in delivering high-throughput, maintainable software with 100% client satisfaction.
              </p>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:text-white transition-all cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                Leave a Verified Client Review
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                      &ldquo;{t.content}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-9 h-9 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-white">
                      {t.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{t.clientName}</div>
                      <div className="text-[10px] text-slate-400">
                        {t.role}, <span className="text-purple-300">{t.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. FINAL HIGH-CONVERSION CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="cta-banner-card max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#161424] to-[#0D0C15] border border-purple-500/30 shadow-2xl text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 blur-[90px] rounded-full -z-10" />

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Direct Engineer Access
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white max-w-2xl mx-auto leading-tight">
            Ready to engineer your next serious digital product?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4 mb-8">
            Tell us about your architecture requirements, target timeline, and goals. We will review your brief and schedule an architectural roadmap session.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => triggerStart()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-xl shadow-purple-600/30 hover:scale-[1.02] cursor-pointer"
            >
              Start a Project Brief
            </button>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all"
            >
              Contact Engineering Team
            </Link>
          </div>
        </div>
      </section>

      {/* CLIENT RATING & REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12111A] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-purple-400">
              <Star className="w-5 h-5 fill-purple-400" />
              <h3 className="text-lg font-bold font-display text-white">Client Rating & Review</h3>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs text-slate-300">Your verified rating and testimonial have been published.</p>
              </div>
            ) : !isSignedIn ? (
              <div className="space-y-4 text-xs pt-2">
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 font-semibold">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span>Client Authentication Required</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    To maintain the highest authenticity and protect against fake reviews, please sign in with your client account before posting a rating.
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
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Submitting as: <strong className="text-white">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</strong></span>
                </div>

                {reviewError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Rating (Stars)</label>
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
                            star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-amber-400 font-semibold ml-2">{reviewRating} / 5 Stars</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Role / Title</label>
                    <input
                      type="text"
                      placeholder="CTO / Founder"
                      value={reviewRole}
                      onChange={(e) => setReviewRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={reviewCompany}
                      onChange={(e) => setReviewCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Review & Feedback *</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Describe your engineering experience working with SoloNomous Labs..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
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
