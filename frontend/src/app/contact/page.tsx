'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Mail, Phone, MessageSquare, Clock, MapPin, CheckCircle, Loader2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Project Consultation',
    message: '',
    expectedTimeline: 'Within 4 Weeks'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.submitContact({
        ...form,
        source: 'contact_page'
      });
      setSubmitted(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      setError(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          Direct Communication
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight mt-2">
          Connect With Our <span className="text-gradient-purple">Systems Architects</span>.
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          Whether you have a concrete project brief, need an emergency architecture review, or want to explore an ongoing sprint engagement, our senior engineering team is at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left: Contact Info & Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold font-display text-white">Direct Channels</h3>

            <div className="space-y-4">
              <a
                href="mailto:contact@solonomouslabs.com"
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
              >
                <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Email Engineering Team</div>
                  <div className="text-sm font-semibold text-white group-hover:text-purple-300">
                    contact@solonomouslabs.com
                  </div>
                </div>
              </a>

              <a
                href="tel:+15550198234"
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
              >
                <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Direct Phone Line</div>
                  <div className="text-sm font-semibold text-white group-hover:text-purple-300">
                    +1 (555) 019-8234
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/15550198234"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
              >
                <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">WhatsApp Dispatch</div>
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-300">
                    +1 (555) 019-8234 (Instant)
                  </div>
                </div>
              </a>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Typical response time: <strong>under 4 business hours</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Remote-First Studio • Silicon Valley / Global</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Validated Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/10">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display text-white mb-2">Message Dispatched</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                  Thank you for reaching out. A systems architect has been notified and will review your inquiry shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: '',
                      email: '',
                      phone: '',
                      subject: 'Project Consultation',
                      message: '',
                      expectedTimeline: 'Within 4 Weeks'
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold font-display text-white mb-2">Send an Architectural Inquiry</h3>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone / WhatsApp (Optional)</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 019-8234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Timeline</label>
                    <select
                      value={form.expectedTimeline}
                      onChange={(e) => setForm({ ...form, expectedTimeline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#12111A] border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
                    >
                      <option value="Immediate (< 2 Weeks)">Immediate (&lt; 2 Weeks)</option>
                      <option value="Within 4 Weeks">Within 4 Weeks</option>
                      <option value="Within 2 Months">Within 2 Months</option>
                      <option value="Planning Phase">Planning Phase</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Subject / Area of Interest</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="SaaS MVP Architecture, RAG Pipeline, Performance Optimization..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Project Message & Architecture Details *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your current tech stack, requirements, or specific architectural bottlenecks..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-hidden focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Transmitting to Lab...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Dispatch Inquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
