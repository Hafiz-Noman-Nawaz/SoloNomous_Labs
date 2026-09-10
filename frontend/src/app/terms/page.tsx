import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | SoloNomous Labs',
  description: 'Terms of Service and commercial engagement standards for SoloNomous Labs.'
};

export default function TermsPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-2">Terms of Service</h1>
      <p className="text-xs text-purple-400 font-mono mb-8">Effective Date: September 2026</p>

      <div className="prose prose-invert prose-purple max-w-none text-slate-300 text-sm space-y-6 leading-relaxed">
        <section className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display text-white mb-2">1. Scope of Engagements</h2>
          <p>
            SoloNomous Labs provides bespoke software architecture, development sprints, and AI engineering services governed by individual Statements of Work (SOWs) agreed upon prior to project kickoff.
          </p>
        </section>

        <section className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display text-white mb-2">2. Intellectual Property Ownership</h2>
          <p>
            Upon settlement of milestone invoices, 100% of all intellectual property, source code, database structures, and configuration files created specifically for the client belong exclusively to the client.
          </p>
        </section>

        <section className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display text-white mb-2">3. Warranty & Operational SLA</h2>
          <p>
            Our deliverables include a standard post-launch stabilization warranty to address regression bugs and verify system health against agreed specifications.
          </p>
        </section>

        <section className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display text-white mb-2">4. Governing Law</h2>
          <p>
            These terms are governed by standard international commercial software contracting laws. For legal notices, contact <strong>legal@solonomouslabs.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
