import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await api.getServiceBySlug(params.slug);
    if (!res.data) return { title: 'Service Details' };
    return {
      title: `${res.data.title} | Engineering Services`,
      description: res.data.summary
    };
  } catch {
    return { title: 'Service Details | SoloNomous Labs' };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  let serviceData;
  try {
    const res = await api.getServiceBySlug(params.slug);
    serviceData = res;
  } catch (err) {
    notFound();
  }

  const { data: service, relatedCaseStudies } = serviceData;

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-white">Services</Link>
        <span>/</span>
        <span className="text-purple-400 font-medium">{service.title}</span>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mb-16">
        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
          {service.badge || 'Engineering Capability'}
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight mt-3 leading-tight">
          {service.title}
        </h1>
        <p className="text-lg text-slate-300 mt-4 leading-relaxed">
          {service.summary}
        </p>

        <div className="pt-6 flex flex-wrap gap-4 items-center">
          <Link
            href="/contact"
            className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            Kickoff This Engagement
          </Link>
          {service.startingPrice && (
            <span className="text-sm text-slate-400">
              Pricing model: <span className="text-white font-semibold">{service.pricingModel.replace('_', ' ').toUpperCase()}</span> (From ${service.startingPrice.toLocaleString()} USD{service.pricingInterval && service.pricingInterval !== 'one_time' ? service.pricingInterval : ''})
            </span>
          )}
        </div>
      </div>

      {/* Problem vs Solution Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {/* The Problem */}
        <div className="p-8 rounded-3xl bg-red-950/10 border border-red-500/20">
          <div className="flex items-center gap-2.5 text-red-400 text-sm font-bold uppercase tracking-wider mb-4">
            <AlertCircle className="w-5 h-5" /> The Industry Bottleneck
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {service.problemStatement}
          </p>
        </div>

        {/* The Solution */}
        <div className="p-8 rounded-3xl bg-purple-950/20 border border-purple-500/30">
          <div className="flex items-center gap-2.5 text-purple-400 text-sm font-bold uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-5 h-5" /> The SoloNomous Solution
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {service.solutionStatement}
          </p>
        </div>
      </div>

      {/* Deep Dive Features */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-8">
          Architectural Features & Technical Scope
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {service.features?.map((feat, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white mb-2">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack & Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* Technologies */}
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" /> Technology Foundation
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            We use production-proven, highly typed open technologies that eliminate vendor lock-in.
          </p>
          <div className="flex flex-wrap gap-2">
            {service.techStack?.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-purple-400" /> What You Receive
          </h3>
          <ul className="space-y-3">
            {service.deliverables?.map((deliv, i) => (
              <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{deliv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Step by Step Development Process */}
      {service.processSteps && service.processSteps.length > 0 && (
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-8">
            Delivery Roadmap
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {service.processSteps.map((step) => (
              <div key={step.step} className="glass-card p-6 rounded-2xl relative">
                <div className="text-2xl font-black font-display text-purple-400 mb-2">
                  0{step.step}
                </div>
                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service-Specific FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <div className="mb-20 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-6 flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-purple-400" /> Service FAQs
          </h2>
          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl">
                <h4 className="text-base font-bold text-white mb-2">{faq.question}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Case Studies */}
      {relatedCaseStudies && relatedCaseStudies.length > 0 && (
        <div className="mb-20">
          <h2 className="text-2xl font-bold font-display text-white mb-6">
            Case Studies Leveraging This Capability
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedCaseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/work/${study.slug}`}
                className="glass-card p-6 rounded-2xl group flex flex-col justify-between hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <div className="text-xs text-purple-400 font-semibold mb-1">{study.industry}</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                    {study.title}
                  </h3>
                  <div className="flex gap-4 text-xs text-slate-400 mt-2">
                    {study.results?.slice(0, 2).map((r, ri) => (
                      <div key={ri}>
                        <span className="text-purple-300 font-bold">{r.metric}</span> {r.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 text-xs font-semibold text-white group-hover:text-purple-400 inline-flex items-center gap-1">
                  View Case Study <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Final Kickoff CTA */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-purple-900/30 via-[#12111A] to-purple-900/20 border border-purple-500/30 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
          Ready to deploy {service.title}?
        </h3>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6">
          Schedule an architectural scoping consultation with our engineering team to define milestones, deliverables, and timeline.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-xl shadow-purple-600/30"
        >
          <Sparkles className="w-4 h-4" /> Start Project Brief
        </Link>
      </div>
    </div>
  );
}
