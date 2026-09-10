import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | SoloNomous Labs',
  description: 'Privacy Policy and Data Protection standards for SoloNomous Labs.'
};

export default function PrivacyPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-2">Privacy Policy</h1>
      <p className="text-xs text-purple-400 font-mono mb-8">Effective Date: September 2026</p>

      <div className="prose prose-invert prose-purple max-w-none text-slate-300 text-sm space-y-6 leading-relaxed">
        <section className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display text-white mb-2">1. Overview</h2>
          <p>
            SoloNomous Labs (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to protecting the privacy and confidential intellectual property of our visitors, partners, and enterprise clients. This policy explains our data handling and security protocols.
          </p>
        </section>

        <section className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display text-white mb-2">2. Information We Collect</h2>
          <p>
            We collect only information voluntarily submitted through our project scoping forms, contact requests, and chat interactions:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Contact details: Name, work email address, telephone/WhatsApp number.</li>
            <li>Project specifics: Technical descriptions, target timelines, and budget requirements.</li>
            <li>Telemetry: Standard non-identifying server access logs and analytics metrics.</li>
          </ul>
        </section>

        <section className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display text-white mb-2">3. Zero Client Data Sharing</h2>
          <p>
            We do not sell, license, or monetize your personal information or project details to third parties. All project briefs submitted for architectural reviews are treated as strictly confidential under default NDA expectations.
          </p>
        </section>

        <section className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display text-white mb-2">4. Inquiries & Data Rights</h2>
          <p>
            To request data deletion or inquire regarding stored records, email our security desk at: <strong>privacy@solonomouslabs.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
