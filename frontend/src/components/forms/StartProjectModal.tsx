'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, Loader2, ShieldCheck, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '@clerk/nextjs';
import { api } from '@/lib/api';

interface StartProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

const PROJECT_TYPES = [
  { id: 'saas_mvp', label: 'SaaS MVP / Web App', hint: 'Fast launch, scalable stack' },
  { id: 'ai_agents', label: 'AI Agent & Automation', hint: 'LLM, RAG & workflow bots' },
  { id: 'custom_site', label: 'High-Impact Website', hint: 'Modern design & conversion' },
  { id: 'enterprise', label: 'Existing Code & Custom', hint: 'Optimization & new features' },
];

export const StartProjectModal: React.FC<StartProjectModalProps> = ({
  isOpen,
  onClose,
  defaultService = ''
}) => {
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState('SaaS MVP / Web App');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Auto-fill from user session if logged in
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullName || user.username || '');
      if (!email) setEmail(user.primaryEmailAddress?.emailAddress || '');
    }
  }, [user]);

  // Set default service if passed
  useEffect(() => {
    if (defaultService) {
      setSelectedType(defaultService);
    }
  }, [defaultService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError('Please share your name so we know who to address.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setError('Please write a brief sentence or two about what you need built.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.submitLead({
        type: 'start_a_project',
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        serviceInterested: selectedType,
        projectDescription: `[Selected Scope: ${selectedType}] ${description.trim()}`,
        source: 'start_a_project_modal'
      });

      if (res.data?.whatsappDirectUrl) {
        setWhatsappUrl(res.data.whatsappDirectUrl);
      } else {
        const text = encodeURIComponent(`Hi Noman, I just submitted an inquiry on SoloNomous Labs for "${selectedType}". My name is ${fullName.trim()}.`);
        setWhatsappUrl(`https://wa.me/923069352726?text=${text}`);
      }

      setSubmitted(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      setError(err.message || 'Unable to submit. Please message directly on WhatsApp below.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white dark:bg-[#110e1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Close button */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Engineering Studio • Quick Kickoff
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Tell us about your project
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Founder & Lead Engineer Noman Nawaz reviews every brief personally. You will receive a technical breakdown and roadmap within 4 hours.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Step 1: Project Type Pills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    What are you looking to build?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PROJECT_TYPES.map((pt) => {
                      const isSelected = selectedType === pt.label;
                      return (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => setSelectedType(pt.label)}
                          className={`text-left p-3 rounded-xl border transition-all text-xs sm:text-sm ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-medium shadow-sm'
                              : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-white/[0.02]'
                          }`}
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">{pt.label}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{pt.hint}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Your Name <span className="text-purple-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#181424] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Address <span className="text-purple-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#181424] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp or Phone <span className="text-slate-400 text-[11px] font-normal">(optional, for instant updates)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000 or WhatsApp number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#181424] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Step 3: Brief Description */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    What are you looking to build or solve? <span className="text-purple-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="E.g., We need an MVP with user auth, Stripe payments, and an AI chat assistant within 4 weeks..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#181424] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-500 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                    {error}
                  </p>
                )}

                {/* Primary CTA */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-md shadow-purple-600/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Brief...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Reassurance Badges */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 grid grid-cols-3 gap-2 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>100% Code Ownership</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                    <span>Reply in &lt; 4 Hours</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span>Mutual NDA</span>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* Success State */
            <div className="p-8 text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Project Brief Received!
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-800 dark:text-slate-200">{fullName}</strong>. Founder & Lead Engineer Noman Nawaz has received your project details and will email your preliminary roadmap within 4 hours.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-600/20"
                  >
                    <span>Message Directly on WhatsApp</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
