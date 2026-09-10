'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { SiteSettings } from '@/types';
import {
  Shield,
  Sparkles,
  Terminal,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Beaker,
  UserCheck,
  Award
} from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.getSettings().then((res) => {
      if (res.data) setSettings(res.data);
    }).catch(console.warn);
  }, []);

  const about = settings?.aboutSection || {
    storyHeadline: 'Where experimental rigor meets production reliability.',
    storyContent: 'SoloNomous Labs was created to counter the tide of superficial digital templates. We are an autonomous software laboratory and advanced technology studio, engineering resilient digital products designed to scale from early-stage inception to enterprise volume.',
    mission: 'To provide visionary founders and technical teams with institutional-grade software architecture, accelerating time-to-market without compromising on code quality, security, or future maintainability.',
    philosophy: 'We believe code is an asset only when it is rigorously tested and easily understood. We favor explicit type safety, decoupled modular domains, and deterministic validation over transient hype.',
    futureDirection: 'As software shifts toward autonomous systems and intelligent architectures, we are pioneering verifiable systems that operate deterministically inside mission-critical enterprise workflows.',
    founderImage: '',
    founderName: 'Noman Nawaz',
    founderTitle: 'Founder & Principal Full-Stack / AI Systems Architect',
    founderBio: 'Full-Stack Software Engineer & ML Developer with a track record of architecting scalable web applications, sub-millisecond AI classification pipelines, and responsive 60fps user interfaces. Creator of ZeoAtlas (Conversational AI Platform) and Zashas (Next.js E-Commerce).'
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
          <Beaker className="w-3.5 h-3.5" /> Engineering Origin
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
          {about.storyHeadline}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          {about.storyContent}
        </p>
      </div>

      {/* Leadership Profile Section */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl mb-20 border border-white/10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Avatar / Emblem Display (4 cols) */}
          <div className="lg:col-span-4 flex justify-center">
            {about.founderImage ? (
              // If user provided image in CMS, render their real photo
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-2xl shadow-purple-900/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={about.founderImage}
                  alt={about.founderName || 'Founder & Principal Engineer'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              // Non-stock-photo laboratory emblem with glowing aesthetic
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-br from-[#1B182B] via-[#12111A] to-[#0D0C15] border border-purple-500/30 flex flex-col items-center justify-center p-6 text-center shadow-2xl shadow-purple-900/20 group">
                <div className="absolute inset-0 bg-radial-glow opacity-60 rounded-3xl pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Beaker className="w-8 h-8" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-purple-300 font-display">
                  SoloNomous Labs
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Founder & Principal Engineering Desk
                </div>
                <div className="mt-3 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Direct Founder Oversight
                </div>
              </div>
            )}
          </div>

          {/* Bio & Details (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Award className="w-4 h-4" /> Technical Leadership
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              {about.founderName || 'Noman Nawaz'}
            </h2>
            <div className="text-sm font-semibold text-purple-300 font-mono">
              {about.founderTitle || 'Founder & Principal Full-Stack / AI Systems Architect'}
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1">
              {about.founderBio}
            </p>

            {/* Direct Verification Links & CMS Shortcut */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href="https://www.nouman-nawaz.dev/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 text-xs font-semibold transition-colors"
              >
                <span>Live Portfolio (nouman-nawaz.dev)</span>
                <ArrowRight className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/Hafiz-Noman-Nawaz/Noman_Nawaz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
              >
                <span>GitHub Repositories</span>
              </a>
              <a
                href="https://www.fiverr.com/nomannawaz67"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                <span>Fiverr Profile</span>
              </a>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-purple-300 border border-white/10 text-xs font-medium transition-colors"
                title="Edit founder portrait, bio, or name in CMS"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Edit in CMS</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-3">Our Mission</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {about.mission}
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-3">Our Philosophy</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {about.philosophy}
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-3">Future Direction</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {about.futureDirection}
          </p>
        </div>
      </div>

      {/* Operational Tenets */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl mb-20 border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Laboratory Operating Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-2 mb-4">
              Built to scale alongside your product journey
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              SoloNomous Labs operates with the agility of an elite research unit and the organizational discipline of an enterprise engineering department.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              When we engage on a project, every line of architecture, every database index, and every security boundary is personally planned and verified by senior systems architects.
            </p>

            <div className="space-y-3">
              {[
                'Full intellectual property and GitHub source handover upon milestone completion',
                'Comprehensive automated test coverage before production cutover',
                'Zero proprietary vendor lock-in: clean, open, maintainable codebases',
                'Seamless knowledge transfer and onboarding documentation for your future internal hires'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-purple-400 font-bold">// SoloNomous Labs Operational Tenets</div>
            <div>
              <span className="text-purple-300">const</span> <span className="text-emerald-300">tenets</span> = {'{'}
            </div>
            <div className="pl-4">
              <span className="text-slate-400">rigor:</span> &apos;Treat every schema as an immutable contract&apos;,
            </div>
            <div className="pl-4">
              <span className="text-slate-400">velocity:</span> &apos;Ship working production code in sprint cadence&apos;,
            </div>
            <div className="pl-4">
              <span className="text-slate-400">security:</span> &apos;Zero-trust validation at all boundaries&apos;,
            </div>
            <div className="pl-4">
              <span className="text-slate-400">clarity:</span> &apos;Maintainable architectures over obfuscation&apos;
            </div>
            <div>{'}'};</div>
            <div className="pt-2 text-slate-500">
              /* Verified across production systems and enterprise platforms */
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Join Us on the Engineering Frontier
        </h2>
        <p className="text-sm text-slate-400 mt-2 mb-6">
          Whether you need a dedicated product sprint or an architectural review, our laboratory doors are open.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all"
          >
            Connect With Our Team
          </Link>
          <Link
            href="/careers"
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-sm font-semibold transition-all"
          >
            Explore Careers →
          </Link>
        </div>
      </div>
    </div>
  );
}
