import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Terminal,
  Layers,
  BarChart3,
  Calendar,
  Building
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await api.getCaseStudyBySlug(params.slug);
    if (!res.data) return { title: 'Case Study' };
    return {
      title: `${res.data.title} | Case Study`,
      description: res.data.overview
    };
  } catch {
    return { title: 'Case Study | SoloNomous Labs' };
  }
}

export default async function CaseStudyDetailPage({ params }: Props) {
  let studyData;
  try {
    const res = await api.getCaseStudyBySlug(params.slug);
    studyData = res.data;
  } catch {
    notFound();
  }

  const study = studyData;

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/work" className="hover:text-white">Work</Link>
        <span>/</span>
        <span className="text-purple-400 font-medium">{study.title}</span>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            {study.industry}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Building className="w-3.5 h-3.5 text-purple-400" /> {study.clientName}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-purple-400" /> {study.duration}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
          {study.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
          {study.overview}
        </p>
      </div>

      {/* Highlight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {study.results?.map((res: any, idx: number) => (
          <div key={idx} className="glass-card p-6 rounded-2xl text-center border border-white/10">
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-purple-300 mb-1">
              {res.metric}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">{res.label}</div>
          </div>
        ))}
      </div>

      {/* Main Image */}
      {study.heroImage?.url && (
        <div className="mb-16 rounded-3xl overflow-hidden border border-white/10 max-h-[500px] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={study.heroImage.url}
            alt={study.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Challenge & Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-lg font-bold font-display text-white mb-3">
            The Technical Challenge
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {study.challenge}
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-lg font-bold font-display text-white mb-3">
            Strategic Architecture
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {study.strategy}
          </p>
        </div>
      </div>

      {/* Architecture Deep Dive */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#12111A] border border-white/10 mb-16">
        <h3 className="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" /> System Architecture & Implementation Details
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
          {study.architectureDetails}
        </p>

        <div className="pt-4 border-t border-white/5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Technology Stack Utilized
          </h4>
          <div className="flex flex-wrap gap-2">
            {study.techStack?.map((t: string) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-purple-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Related Services */}
      {study.relatedServices && study.relatedServices.length > 0 && (
        <div className="mb-16">
          <h3 className="text-xl font-bold font-display text-white mb-4">
            Relevant Capabilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {study.relatedServices.map((svc: any) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="glass-card p-5 rounded-2xl flex items-center justify-between group hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {svc.title}
                  </div>
                  <div className="text-xs text-slate-400">{svc.summary?.slice(0, 80)}...</div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-purple-900/30 via-[#12111A] to-purple-900/20 border border-purple-500/30 text-center">
        <h3 className="text-2xl font-bold font-display text-white mb-2">
          Achieve Similar Results For Your Platform
        </h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
          Connect with our systems team to explore how we can architect a high-throughput solution tailored to your engineering goals.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/30"
        >
          <Sparkles className="w-4 h-4" /> Start an Engineering Consultation
        </Link>
      </div>
    </div>
  );
}
