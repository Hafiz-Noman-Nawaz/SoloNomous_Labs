'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, ArrowLeft, Loader2, Rocket, UserCheck, Lock, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser, SignInButton } from '@clerk/nextjs';
import { api } from '@/lib/api';

interface StartProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const StartProjectModal: React.FC<StartProjectModalProps> = ({
  isOpen,
  onClose,
  defaultService = ''
}) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const [formData, setFormData] = useState({
    serviceInterested: defaultService || 'Full-Stack Web Engineering',
    projectType: 'New MVP from Scratch',
    techPreferences: [] as string[],
    budgetRange: '$5k - $10k',
    timeline: '4 - 8 Weeks',
    fullName: '',
    email: '',
    phone: '',
    company: '',
    projectDescription: ''
  });

  // Auto-fill client details from verified Clerk session
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.fullName || user.username || '',
        email: prev.email || user.primaryEmailAddress?.emailAddress || ''
      }));
    }
  }, [user]);

  // Sync selected service if passed or changed externally
  useEffect(() => {
    if (defaultService) {
      setFormData(prev => ({
        ...prev,
        serviceInterested: defaultService
      }));
    }
  }, [defaultService, isOpen]);

  const defaultServicesList = [
    'Full-Stack Web Engineering',
    'Autonomous RAG & AI Integration',
    'Scalable SaaS Architecture & MVP',
    'High-Throughput API & Cloud Engineering',
    'UI/UX Design Systems & Frontend'
  ];

  const servicesList = Array.from(new Set([
    ...(formData.serviceInterested ? [formData.serviceInterested] : []),
    ...defaultServicesList
  ]));

  const projectTypes = [
    'New MVP from Scratch',
    'Enterprise Feature Acceleration',
    'Legacy System Re-Architecture',
    'Custom AI / RAG Integration',
    'Dedicated Engineering Sprint'
  ];

  const budgetRanges = [
    'Under $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+'
  ];

  const timelines = [
    'Immediate (< 4 Weeks)',
    '4 - 8 Weeks (Recommended)',
    '2 - 3 Months',
    'Flexible / Planning Phase'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      setError('Please sign in or create an account below before submitting your project brief.');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.projectDescription) {
      setError('Please provide your name, email, and project description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.submitLead({
        type: 'start_a_project',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceInterested: formData.serviceInterested,
        projectType: formData.projectType,
        budgetRange: formData.budgetRange,
        timeline: formData.timeline,
        projectDescription: `[Type: ${formData.projectType}] [Clerk ID: ${user?.id || 'verified'}] ${formData.projectDescription}`,
        source: 'start_a_project_modal'
      });

      if (res.data?.whatsappDirectUrl) {
        setWhatsappUrl(res.data.whatsappDirectUrl);
      }

      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit project inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setWhatsappUrl('');
    setStep(1);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-2xl bg-[#12111A] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10"
        >
          {/* Top laboratory glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* Close button */}
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-10 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-2">Service Order & Brief Dispatched!</h3>
              <p className="text-slate-300 max-w-md mx-auto mb-6 text-sm leading-relaxed">
                Your order for <strong className="text-purple-300">{formData.serviceInterested}</strong> has reached our engineering team via <strong>Email</strong> and <strong>WhatsApp</strong> alert. We will review your technical requirements promptly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Open in WhatsApp Now
                  </a>
                )}
                <button
                  onClick={resetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors text-xs"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-2">
                  <Rocket className="w-3.5 h-3.5" /> Start an Engineering Engagement
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Step {step} of 3: {step === 1 ? 'Select Capability & Scope' : step === 2 ? 'Budget & Timeline' : 'Your Information & Brief'}
                </h2>
                {/* Progress bar */}
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* Step 1: Capability & Project Nature */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Primary Service Focus
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {servicesList.map((svc) => (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => setFormData({ ...formData, serviceInterested: svc })}
                          className={`p-3 text-left rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                            formData.serviceInterested === svc
                              ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                              : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {svc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Project Nature
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {projectTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: type })}
                          className={`p-2.5 text-left rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                            formData.projectType === type
                              ? 'bg-purple-600/20 border-purple-500 text-white'
                              : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-md shadow-purple-600/20"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Budget & Timeline */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Anticipated Budget Range
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {budgetRanges.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, budgetRange: b })}
                          className={`p-3.5 text-center rounded-xl border text-sm font-medium transition-all ${
                            formData.budgetRange === b
                              ? 'bg-purple-600/20 border-purple-500 text-white ring-1 ring-purple-500'
                              : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Target Deployment Timeline
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {timelines.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, timeline: t })}
                          className={`p-3 text-left rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                            formData.timeline === t
                              ? 'bg-purple-600/20 border-purple-500 text-white'
                              : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-md shadow-purple-600/20"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact & Brief */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Dr. Alexander Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alexander@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Synthetix Systems"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Phone / WhatsApp (Optional)</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Project Brief & Architecture Goals *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      placeholder="Describe what you want to build, current technical blockers, or specific architectures needed..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500 resize-none"
                    />
                  </div>

                  {/* Client Verification Status */}
                  {isSignedIn ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      <UserCheck className="w-4 h-4 shrink-0" />
                      <span>Verified Client: <strong className="text-white">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</strong></span>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs space-y-2.5">
                      <div className="flex items-center gap-2 text-purple-300 font-semibold">
                        <Lock className="w-4 h-4 text-purple-400" />
                        <span>Client Verification Required for Submission</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        To guarantee genuine collaboration and direct project tracking, please create or log into your client account.
                      </p>
                      <SignInButton mode="modal">
                        <button
                          type="button"
                          className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Sign In / Create Client Account
                        </button>
                      </SignInButton>
                    </div>
                  )}

                  {error && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="pt-3 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !isSignedIn}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-all shadow-md shadow-purple-600/25 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting Brief...
                        </>
                      ) : (
                        <>
                          Submit Project Brief <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
