'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Zap, FileCode2, Sparkles } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

export const LowRiskEntryOffers: React.FC = () => {
  const { openProjectModal } = useModal();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="entry-offers">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12 text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Zero-Risk Entry Engagements
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Test Our Engineering Expertise <span className="text-gradient-purple">Before You Commit</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Not ready for a full product sprint? Start with a low-risk diagnostic engagement to validate technical feasibility, architectural choices, and team chemistry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Offer 1: Free 30-Min Architecture & Code Audit */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 relative flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
                100% Free Consultation
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                30-Minute Architecture & Code Audit
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                A live 1-on-1 strategy call with lead architect Noman Nawaz. We inspect your existing repository or review your startup concept to identify architectural bottlenecks and high-leverage opportunities.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-white/10 mb-8 text-xs text-slate-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Review current tech stack, database schemas & API bottlenecks</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sub-second Core Web Vitals & security vulnerability assessment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Actionable 1-page architectural recommendation blueprint</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero sales pressure or obligation</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openProjectModal('Free 30-Minute Architecture Audit')}
              className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Zap className="w-4 h-4 text-purple-400" /> Book Free Diagnostic Session
            </button>
          </div>

          {/* Offer 2: Fixed $499 Technical Roadmap & Architecture Blueprint */}
          <div className="glass-card p-8 rounded-3xl border border-purple-500/40 relative flex flex-col justify-between shadow-2xl shadow-purple-950/40 ring-1 ring-purple-500/30">
            {/* 100% Credited Back Ribbon */}
            <div className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
              100% Credited Back
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Fixed-Price Diagnostic ($499 USD)
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                MVP Architecture & Technical Roadmap
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Receive a complete, production-ready system architecture document, database schema design, and step-by-step sprint breakdown. If you build with us, the full $499 is credited toward your development sprint.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-white/10 mb-8 text-xs text-slate-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Complete system topology, entity relationships & API spec</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Technical feasibility analysis & vector/AI model recommendation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Step-by-step milestone sprint backlog & fixed price estimate</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>100% Credited Back:</strong> Deducted from your build invoice if you engage SoloNomous</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openProjectModal('$499 Technical Roadmap & Architecture Blueprint')}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCode2 className="w-4 h-4" /> Request Technical Roadmap ($499)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
