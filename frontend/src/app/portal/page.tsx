'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser, SignInButton } from '@clerk/nextjs';
import {
  Rocket,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  GitBranch,
  Terminal,
  FileText,
  MessageSquare,
  Lock,
  UserCheck,
  Sparkles,
  Server
} from 'lucide-react';
import { useModal } from '@/context/ModalContext';

interface MilestoneTask {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  category: string;
  eta?: string;
}

export default function ClientPortalPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { openProjectModal } = useModal();

  const [activeTab, setActiveTab] = useState<'tracker' | 'deliverables' | 'assets'>('tracker');

  // Interactive checklist tasks for live demonstration
  const [tasks, setTasks] = useState<MilestoneTask[]>([
    {
      id: 'task-1',
      title: 'Database Schema Modeling & Relational Indexes (PostgreSQL / MongoDB)',
      status: 'completed',
      category: 'Foundation'
    },
    {
      id: 'task-2',
      title: 'Type-Safe API Contracts & Defensive Input Validation (Zod / Express)',
      status: 'completed',
      category: 'Backend'
    },
    {
      id: 'task-3',
      title: 'User Authentication & Role-Based Access Control (Clerk / RBAC)',
      status: 'completed',
      category: 'Security'
    },
    {
      id: 'task-4',
      title: 'Stripe Billing Integration & Automated Webhook Event Handlers',
      status: 'in_progress',
      category: 'Payments',
      eta: 'In Review'
    },
    {
      id: 'task-5',
      title: 'Custom CMS & Operational Admin Dashboard Interface',
      status: 'in_progress',
      category: 'Frontend',
      eta: 'Active Sprint'
    },
    {
      id: 'task-6',
      title: 'Server-Sent Events (SSE) Streaming & AI Response Retrieval',
      status: 'upcoming',
      category: 'AI Pipeline',
      eta: 'Sprint 3'
    },
    {
      id: 'task-7',
      title: 'Sub-Second Lighthouse Audit, Core Web Vitals & Production DNS Cutover',
      status: 'upcoming',
      category: 'Deployment',
      eta: 'Sprint 4'
    }
  ]);

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const clientDisplayName =
    user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Executive Partner';

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Enterprise Client Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Welcome back, <span className="text-gradient-purple">{clientDisplayName}</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl">
            Real-time milestone transparency for your engineering sprints. Track live staging previews, sprint deliverables, and code ownership verification.
          </p>
        </div>

        {/* Lead Architect Status Pill */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center gap-3.5 shrink-0 self-start md:self-auto">
          <div className="relative w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/branding/flask-icon.svg"
              alt="SoloNomous Labs"
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[#09080E]" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              Noman Nawaz <span className="text-[10px] text-purple-400 font-mono font-normal">Lead Architect</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">Sprint Active • Zero Blockers</div>
            <a
              href="https://wa.me/923156251281"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-purple-300 hover:text-white underline mt-0.5 inline-block"
            >
              Direct WhatsApp Channel →
            </a>
          </div>
        </div>
      </div>

      {!isSignedIn && (
        <div className="mb-10 p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Viewing Interactive Demonstration Portal</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Sign in with your verified client account to load your private repository and staging credentials.
              </p>
            </div>
          </div>
          <SignInButton mode="modal">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <UserCheck className="w-4 h-4" /> Client Sign In
            </button>
          </SignInButton>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 mb-8 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('tracker')}
          className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'tracker'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Rocket className="w-4 h-4" /> Live Sprint Tracker
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('deliverables')}
          className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'deliverables'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Deliverables & Milestones ({completedCount}/{tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> IP Ownership & Handover
        </button>
      </div>

      {/* TAB 1: LIVE SPRINT TRACKER */}
      {activeTab === 'tracker' && (
        <div className="space-y-8">
          {/* Active Sprint Banner */}
          <div className="glass-card p-7 sm:p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden shadow-2xl shadow-purple-950/20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
                  Active Sprint 2 of 4
                </span>
                <h3 className="text-2xl font-bold font-display text-white">
                  Payment Gateway, Customer Auth & Admin Control Plane
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Deploying end-to-end checkout funnels, webhook consumers, and reactive administrative tables.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://solo-nomous-labs.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Launch Staging Preview
                </a>
                <button
                  type="button"
                  onClick={() => openProjectModal('Sprint Review & Scope Adjustment')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Request Adjustment
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" /> Milestone Completion:
                </span>
                <span className="font-mono font-bold text-white">{progressPercent}%</span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Target Sprint Cutover</span>
                <span className="text-white font-bold font-mono">Sep 24, 2026</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Active Git Branch</span>
                <span className="text-purple-300 font-mono flex items-center gap-1">
                  <GitBranch className="w-3 h-3" /> main-staging
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Core Web Vitals</span>
                <span className="text-emerald-400 font-bold font-mono">98 / 100 Performance</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">IP Ownership Status</span>
                <span className="text-purple-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Transferred
                </span>
              </div>
            </div>
          </div>

          {/* Staging & Telemetry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" /> Staging Environment Details
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase">
                  Healthy
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Continuous integration builds directly from our release branch. All features undergo automatic end-to-end testing before preview promotion.
              </p>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-slate-300 space-y-1">
                <div>Environment: <span className="text-purple-300">Vercel Edge Network</span></div>
                <div>Database Cluster: <span className="text-purple-300">MongoDB Atlas Production VPC</span></div>
                <div>Authentication: <span className="text-purple-300">Clerk Production OAuth 2.0</span></div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> Dedicated Communication
                </h4>
                <span className="text-xs text-slate-400">Direct Access</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You work directly with lead engineer Noman Nawaz. We prioritize asynchronous sprint reports and live video milestones over bloated meetings.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <a
                  href="https://wa.me/923156251281"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Sync
                </a>
                <button
                  type="button"
                  onClick={() => openProjectModal('Book 30-Min Architecture Sync')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Video Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERABLES & CHECKLIST */}
      {activeTab === 'deliverables' && (
        <div className="glass-card p-7 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-white">Milestone Deliverables Checklist</h3>
              <p className="text-xs text-slate-400">Live breakdown of sprint deliverables and architectural artifacts.</p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              {completedCount} of {tasks.length} Completed
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {tasks.map((task) => (
              <div key={task.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : task.status === 'in_progress' ? (
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600" />
                    )}
                  </div>
                  <div>
                    <h5
                      className={`text-xs sm:text-sm font-medium ${
                        task.status === 'completed'
                          ? 'text-slate-300 line-through opacity-80'
                          : task.status === 'in_progress'
                          ? 'text-white font-semibold'
                          : 'text-slate-400'
                      }`}
                    >
                      {task.title}
                    </h5>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Category: {task.category}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      task.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : task.status === 'in_progress'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    {task.status === 'completed'
                      ? 'Delivered'
                      : task.status === 'in_progress'
                      ? 'In Review'
                      : task.eta || 'Queued'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: IP OWNERSHIP & HANDOVER ASSETS */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="glass-card p-7 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Day 1 IP Protection Guarantee
              </span>
              <h3 className="text-xl font-bold font-display text-white">
                Complete Intellectual Property & Source Code Ownership
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Unlike traditional digital agencies that retain code rights or impose proprietary framework locks, SoloNomous Labs signs over 100% of all intellectual property, source repositories, documentation, and database schemas directly to your organization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <ShieldCheck className="w-5 h-5 text-purple-400 mb-2" />
                <h5 className="text-xs font-bold text-white mb-1">Mutual NDA Active</h5>
                <p className="text-[11px] text-slate-400">Strict confidentiality protection covering your idea, data, and user metrics.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <GitBranch className="w-5 h-5 text-purple-400 mb-2" />
                <h5 className="text-xs font-bold text-white mb-1">Direct GitHub Transfer</h5>
                <p className="text-[11px] text-slate-400">Clean, typed TypeScript codebase pushed directly to your private company repo.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <Clock className="w-5 h-5 text-emerald-400 mb-2" />
                <h5 className="text-xs font-bold text-white mb-1">30-Day Post-Launch Warranty</h5>
                <p className="text-[11px] text-slate-400">Immediate priority bug fixes and regression patches included after cutover.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
