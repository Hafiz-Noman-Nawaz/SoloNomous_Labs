'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '../branding/BrandLogo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { api } from '@/lib/api';
import {
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Loader2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    try {
      await api.subscribeNewsletter(email, 'footer');
      setSubscribed(true);
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-[#07060A] border-t border-white/10 pt-16 pb-12 overflow-hidden text-slate-400">
      {/* Background glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="auto" width={190} height={42} />
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              An advanced software studio & technology laboratory. We engineer serious digital products, resilient SaaS architectures, and autonomous AI systems with experimental rigor.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/Hafiz-Noman-Nawaz/Noman_Nawaz"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 border border-white/5 flex items-center justify-center transition-colors"
                aria-label="GitHub"
                title="Noman Nawaz GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.nouman-nawaz.dev/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Visit Noman Nawaz Personal Portfolio"
              >
                <span>nouman-nawaz.dev</span>
                <ArrowRight className="w-3 h-3" />
              </a>
              <a
                href="https://www.fiverr.com/nomannawaz67"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Noman Nawaz Fiverr Services"
              >
                <span>Fiverr</span>
              </a>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Flagship Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/ai-powered-mern-nextjs-web-applications" className="hover:text-purple-400 transition-colors">
                  AI-Powered MERN & Next.js
                </Link>
              </li>
              <li>
                <Link href="/services/custom-saas-business-website-mern" className="hover:text-purple-400 transition-colors">
                  Custom SaaS & Full-Stack Apps
                </Link>
              </li>
              <li>
                <Link href="/services/figma-to-responsive-react-nextjs-tailwind" className="hover:text-purple-400 transition-colors">
                  Figma to React & Next.js
                </Link>
              </li>
              <li>
                <Link href="/services/high-throughput-api-engineering" className="hover:text-purple-400 transition-colors">
                  High-Throughput APIs
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-purple-400 hover:underline">
                  All Capabilities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Exploration & Content */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Knowledge & Studio
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/work" className="hover:text-purple-400 transition-colors">
                  Client Case Studies
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-purple-400 transition-colors">
                  Pillar Architecture Blog
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-purple-400 transition-colors">
                  Developer Resources
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-purple-400 transition-colors">
                  Pricing & Sprints
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors">
                  About the Lab
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-purple-400 transition-colors">
                  Careers <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full ml-1">Hiring</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Engineering Dispatches
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Bi-weekly technical breakdowns of scalable architectures and RAG systems.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle className="w-4 h-4" /> Subscribed to lab research!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@domain.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-purple-500 pr-10"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Subscribe"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {error && <p className="text-[11px] text-red-400">{error}</p>}
              </form>
            )}

            <div className="pt-4 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <a href="mailto:nawaznoman7766@gmail.com" className="hover:text-white">
                  nawaznoman7766@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <a href="https://wa.me/923156251281" target="_blank" rel="noreferrer" className="hover:text-white">
                  +92 315 6251281 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Pakistan — Available Worldwide / Remote</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} SoloNomous Labs by Noman Nawaz. All rights reserved. Built with experimental rigor & production reliability.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/faq" className="hover:text-slate-300 transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              <span>Admin Studio CMS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </Link>
            <ThemeToggle showLabel={true} />
          </div>
        </div>
      </div>
    </footer>
  );
};
