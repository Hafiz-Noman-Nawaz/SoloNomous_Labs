'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const PRESET_INTENTS = [
  {
    title: 'SaaS / MVP Quote',
    desc: 'Validate pricing & timeline for a new product',
    text: 'Hi Noman! I want a quick quote and timeline estimate for an MVP build.'
  },
  {
    title: 'AI & RAG Integration',
    desc: 'Integrate LLMs, vectors, or knowledge bases',
    text: 'Hi Noman! I need an AI / RAG system integrated into my web application.'
  },
  {
    title: 'Book 30-Min Architecture Call',
    desc: 'Direct consultation on system design',
    text: 'Hi Noman! I would like to schedule a 30-minute architecture consultation.'
  },
  {
    title: 'Speed & Codebase Audit',
    desc: 'Sub-second optimization & bug resolution',
    text: 'Hi Noman! I have a website that needs performance optimization and a technical audit.'
  }
];

export const FloatingWhatsAppWidget: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const rawPhone = settings?.whatsappNumber || settings?.contactPhone || '+92 315 6251281';
  // Clean phone for wa.me link (e.g. 923156251281)
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');

  const openWhatsAppWithText = (text: string) => {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    openWhatsAppWithText(customMsg);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[360px] bg-[#12111A] border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-950/40 overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-black border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/branding/flask-icon.svg"
                    alt="Noman Nawaz"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[#12111A]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                    Noman Nawaz
                  </h4>
                  <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Typically replies in 15 mins
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close WhatsApp chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with our lead architect. Select a pre-filled inquiry or write your custom brief:
              </p>

              {/* Preset intent buttons */}
              <div className="space-y-2">
                {PRESET_INTENTS.map((intent, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => openWhatsAppWithText(intent.text)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {intent.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{intent.desc}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              {/* Custom message input */}
              <form onSubmit={handleCustomSubmit} className="pt-2">
                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/5 border border-white/10 focus-within:border-emerald-500/50">
                  <input
                    type="text"
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    placeholder="Type custom inquiry..."
                    className="flex-1 bg-transparent px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={!customMsg.trim()}
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
                    aria-label="Send WhatsApp message"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>

              {/* Reassurance footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-purple-400" /> 100% Confidential
                </span>
                <span>Direct to Senior Architect</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-950/50 border border-emerald-400/30 hover:border-emerald-300 transition-all cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full ring-2 ring-emerald-600 animate-pulse" />
        </div>
        <span className="font-semibold text-xs tracking-tight font-display pr-1 hidden sm:inline">
          Chat on WhatsApp
        </span>
      </motion.button>
    </div>
  );
};
