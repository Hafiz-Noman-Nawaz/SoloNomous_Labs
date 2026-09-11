'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, ArrowLeft, Loader2, Rocket, UserCheck, Lock, MessageSquare, Calendar, Video, Clock, ShieldCheck } from 'lucide-react';
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
  const [modalMode, setModalMode] = useState<'brief' | 'call'>('brief');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const [callData, setCallData] = useState({
    topic: 'MVP Scoping & Architecture Review',
    preferredTime: 'Earliest Available (Next 24 Hours)',
    platform: 'Google Meet',
    notes: ''
  });

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

  const handleScheduleCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      setError('Please provide your name and email to confirm the consultation.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.submitLead({
        type: 'schedule_call',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceInterested: callData.topic,
        projectDescription: `[15-Min Strategy Call Request] Topic: ${callData.topic} | Timeframe: ${callData.preferredTime} | Platform: ${callData.platform} | Notes: ${callData.notes || 'None'}`,
        source: 'schedule_call_modal'
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
      setError(err.message || 'Failed to schedule call. Please try again.');
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
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                {modalMode === 'call' ? '15-Minute Strategy Call Requested!' : 'Service Order & Brief Dispatched!'}
              </h3>
              <p className="text-slate-300 max-w-md mx-auto mb-6 text-sm leading-relaxed">
                {modalMode === 'call' ? (
                  <>
                    Lead architect <strong className="text-purple-300">Noman Nawaz</strong> has received your consultation booking for <strong className="text-white">{callData.topic}</strong>. We will confirm your calendar slot and meeting link shortly.
                  </>
                ) : (
                  <>
                    Your order for <strong className="text-purple-300">{formData.serviceInterested}</strong> has reached our engineering team via <strong>Email</strong> and <strong>WhatsApp</strong> alert. We will review your technical requirements promptly.
                  </>
                )}
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
              {/* Engagement Mode Switcher: Brief vs 1-Click Call */}
              <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('brief');
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalMode === 'brief'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5" /> Submit Project Brief
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('call');
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalMode === 'call'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" /> Book 15-Min Scoping Call
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {modalMode === 'call' ? (
                /* 1-Click Meeting Scheduler */
                <form onSubmit={handleScheduleCall} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-600/20 text-purple-300 shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">
                        Direct 1-on-1 Consultation with Lead Architect Noman Nawaz
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        30 minutes dedicated to your technical vision, architecture feasibility, and milestone pricing. Zero sales pressure.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Dr. Alexander Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-hidden focus:border-purple-500"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">WhatsApp / Phone (For Meeting Reminder)</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Preferred Meeting Platform</label>
                      <select
                        value={callData.platform}
                        onChange={(e) => setCallData({ ...callData, platform: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1926] border border-white/10 text-white text-xs sm:text-sm focus:outline-hidden focus:border-purple-500"
                      >
                        <option value="Google Meet">Google Meet (Link emailed)</option>
                        <option value="WhatsApp Video/Call">WhatsApp Audio / Video Call</option>
                        <option value="Zoom">Zoom Meeting</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Preferred Timeframe</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        'Next 24 Hours',
                        'Within 3 Days',
                        'Next Week / Flexible'
                      ].map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => setCallData({ ...callData, preferredTime: tf })}
                          className={`p-2.5 text-center rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                            callData.preferredTime === tf
                              ? 'bg-purple-600/20 border-purple-500 text-white ring-1 ring-purple-500'
                              : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">What would you like to discuss?</label>
                    <input
                      type="text"
                      value={callData.notes}
                      onChange={(e) => setCallData({ ...callData, notes: e.target.value })}
                      placeholder="e.g. Building an AI MVP for real estate, need timeline & pricing..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  {/* Reassurance */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-purple-300">
                      <ShieldCheck className="w-3.5 h-3.5" /> Mutual NDA Covered
                    </span>
                    <span>15–30 Min Strategy Discovery</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Scheduling Session...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" /> Confirm 15-Minute Strategy Call
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* 3-Step Brief Form */
                <>
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

                  {/* Client Verification & Trust Indicators */}
                  {isSignedIn ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      <UserCheck className="w-4 h-4 shrink-0" />
                      <span>Verified Client Account: <strong className="text-white">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</strong></span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="text-[11px]">Submitting as guest. Have a client account?</span>
                      </div>
                      <SignInButton mode="modal">
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors underline cursor-pointer"
                        >
                          Sign In
                        </button>
                      </SignInButton>
                    </div>
                  )}

                  {/* Reassurance Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-[10px] font-bold text-white">100% IP Ownership</div>
                      <div className="text-[9px] text-slate-400">Day 1 source code transfer</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-[10px] font-bold text-white">Mutual NDA</div>
                      <div className="text-[9px] text-slate-400">Strict confidentiality</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-[10px] font-bold text-white">30-Day Warranty</div>
                      <div className="text-[9px] text-slate-400">Zero regression guarantee</div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
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
            </>
          )}
        </div>
      )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
