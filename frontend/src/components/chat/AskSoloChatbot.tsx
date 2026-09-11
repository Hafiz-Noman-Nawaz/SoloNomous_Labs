'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useSettings } from '@/context/SettingsContext';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Array<{ title: string; category: string; sourceUrl?: string }>;
  suggestedAction?: string;
}

export const AskSoloChatbot: React.FC<{ onStartProject?: () => void }> = ({ onStartProject }) => {
  const { settings } = useSettings();
  const contactEmail = settings?.contactEmail || 'solonomouslabs@gmail.com';
  const whatsappNumber = settings?.whatsappNumber || settings?.contactPhone || '+92 315 6251281';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Greetings. I am Solo, the AI engineering assistant for SoloNomous Labs, founded by Noman Nawaz. Ask me about Noman\'s services, his live portfolio & software projects, verified Fiverr gigs, or how we can build your next web application.',
      citations: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showEscalationForm, setShowEscalationForm] = useState(false);
  const [escalationData, setEscalationData] = useState({ fullName: '', email: '', summary: '' });
  const [escalationSubmitted, setEscalationSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    'Who is the owner of this company?',
    'Can I see what projects he has done?',
    'What services does Noman provide?',
    'How can I contact Noman or order on Fiverr?'
  ];

  // Initialize chat session
  useEffect(() => {
    const init = async () => {
      try {
        const storedSession = localStorage.getItem('solonomous_chat_session');
        const res = await api.initChatSession(storedSession || undefined);
        if (res.data?.sessionId) {
          setSessionId(res.data.sessionId);
          localStorage.setItem('solonomous_chat_session', res.data.sessionId);
        }
      } catch (err) {
        console.warn('Chat session init fallback:', err);
      }
    };
    init();
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const newMsg: Message = { role: 'user', content: userText };
    setMessages((prev) => [
      ...prev,
      newMsg,
      { role: 'assistant', content: '', citations: [] }
    ]);
    setInput('');
    setLoading(true);

    const activeSession = sessionId || `session_${Date.now()}`;

    try {
      await api.streamChatMessage(activeSession, userText, {
        onStart: (data) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              last.citations = data.citations || [];
              last.suggestedAction = data.suggestedAction;
            }
            return updated;
          });
        },
        onToken: (_token, accumulated) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              last.content = accumulated;
            }
            return updated;
          });
        },
        onDone: (data) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              last.content = data.reply;
              if (data.citations) last.citations = data.citations;
              if (data.suggestedAction) last.suggestedAction = data.suggestedAction;
            }
            return updated;
          });
          setLoading(false);
        },
        onError: async (err) => {
          console.warn('SSE stream failed, attempting standard REST fallback:', err);
          try {
            const res = await api.sendChatMessage(activeSession, userText);
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last && last.role === 'assistant') {
                last.content = res.data.reply;
                last.citations = res.data.citations;
                last.suggestedAction = res.data.suggestedAction;
              }
              return updated;
            });
          } catch {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last && last.role === 'assistant') {
                last.content =
                  `I am momentarily unable to process this request. You can reach our engineering team directly on WhatsApp at ${whatsappNumber} or via email at ${contactEmail}.`;
              }
              return updated;
            });
          } finally {
            setLoading(false);
          }
        }
      });
    } catch {
      setLoading(false);
    }
  };

  const handleEscalateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalationData.fullName || !escalationData.email) return;

    setLoading(true);
    try {
      await api.escalateChatToLead({
        sessionId,
        fullName: escalationData.fullName,
        email: escalationData.email,
        summary: escalationData.summary || 'Escalated via Ask Solo AI Assistant'
      });
      setEscalationSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Thank you, ${escalationData.fullName}. Our lead systems architect has received your brief and will reach out to ${escalationData.email}.`
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-900/30 border border-purple-400/30 hover:border-purple-300 transition-all cursor-pointer"
          aria-label="Ask Solo AI Assistant"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/branding/flask-icon.svg"
              alt="Solo Flask"
              width={20}
              height={20}
              className="w-5 h-5 object-contain group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]"
            />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#09080E] animate-pulse" />
          </div>
          <span className="font-semibold text-sm tracking-tight font-display pr-1">Ask Solo</span>
        </motion.button>
      </div>

      {/* Chat Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#12111A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-black flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center p-1.5 shadow-sm shadow-purple-900/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/branding/flask-icon.svg"
                    alt="Solo Laboratory Flask"
                    width={22}
                    height={22}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-display text-white flex items-center gap-2">
                    Solo <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold px-1.5 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">Online</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Engineering & Solutions Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start gap-2.5'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 p-0.5 mt-0.5 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/branding/flask-icon.svg"
                        alt="Solo"
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white/[0.04] border border-white/8 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content ? (
                      <>
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                        {loading && index === messages.length - 1 && msg.role === 'assistant' && (
                          <span className="inline-block w-1.5 h-3.5 ml-1 bg-purple-400 animate-pulse align-middle" />
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 py-1 text-slate-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                        <span className="text-xs">Analyzing knowledge & streaming...</span>
                      </div>
                    )}

                    {/* Citations cards if RAG retrieved sources */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-300">
                          Verified Knowledge Citations:
                        </div>
                        {msg.citations.map((c, ci) => (
                          <a
                            key={ci}
                            href={c.sourceUrl || '#'}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-white/5 px-2 py-0.5 rounded-md mr-1 mt-1 border border-white/5 transition-colors"
                          >
                            <ExternalLink className="w-2.5 h-2.5 text-purple-400" />
                            {c.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggested actions (e.g. Start a Project) */}
                  {msg.suggestedAction === 'start_a_project' && onStartProject && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onStartProject();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white bg-purple-600/20 border border-purple-500/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Launch Project Kickoff <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Analyzing inquiry...</span>
                </div>
              )}

              {/* Suggested Questions */}
              {messages.length <= 2 && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                    Suggested Questions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-left text-xs bg-white/[0.03] hover:bg-purple-600/20 hover:border-purple-500/30 border border-white/5 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Talk to Human / Escalation Drawer */}
            {showEscalationForm ? (
              <div className="p-3 border-t border-white/10 bg-purple-950/30">
                {escalationSubmitted ? (
                  <p className="text-xs text-emerald-400 text-center py-2">
                    Inquiry submitted! We will email you shortly.
                  </p>
                ) : (
                  <form onSubmit={handleEscalateSubmit} className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-300 font-medium">
                      <span>Connect with Principal Architect</span>
                      <button
                        type="button"
                        onClick={() => setShowEscalationForm(false)}
                        className="text-slate-400 hover:text-white text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={escalationData.fullName}
                        onChange={(e) => setEscalationData({ ...escalationData, fullName: e.target.value })}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Work Email"
                        value={escalationData.email}
                        onChange={(e) => setEscalationData({ ...escalationData, email: e.target.value })}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                    >
                      Request Engineer Callback
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Need a human architect?</span>
                <button
                  type="button"
                  onClick={() => setShowEscalationForm(true)}
                  className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                >
                  Leave Contact Brief →
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-[#0E0D15] border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about systems, pricing, RAG..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-hidden focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
