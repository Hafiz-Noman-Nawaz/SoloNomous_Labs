'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Check, Copy, Facebook, Twitter, Linkedin } from 'lucide-react';

interface SocialShareBarProps {
  title: string;
  excerpt?: string;
  slug: string;
}

export default function SocialShareBar({ title, excerpt, slug }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(`${window.location.origin}/blog/${slug}`);
    }
  }, [slug]);

  const handleShareFacebook = () => {
    const url = currentUrl || `https://solonomouslabs.com/blog/${slug}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=620,height=560'
    );
  };

  const handleShareTwitter = () => {
    const url = currentUrl || `https://solonomouslabs.com/blog/${slug}`;
    const text = `${title} — SoloNomous Labs`;
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer,width=620,height=560'
    );
  };

  const handleShareLinkedIn = () => {
    const url = currentUrl || `https://solonomouslabs.com/blog/${slug}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=620,height=560'
    );
  };

  const handleCopyLink = async () => {
    try {
      const url = currentUrl || `https://solonomouslabs.com/blog/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 my-8">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Share2 className="w-4 h-4 text-purple-400" />
        <span>Share this article</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Facebook */}
        <button
          type="button"
          onClick={handleShareFacebook}
          aria-label="Share on Facebook"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] text-xs font-semibold transition-all hover:scale-[1.03]"
        >
          <Facebook className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Facebook</span>
        </button>

        {/* Twitter / X */}
        <button
          type="button"
          onClick={handleShareTwitter}
          aria-label="Share on X"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all hover:scale-[1.03]"
        >
          <Twitter className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">X / Twitter</span>
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={handleShareLinkedIn}
          aria-label="Share on LinkedIn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] text-xs font-semibold transition-all hover:scale-[1.03]"
        >
          <Linkedin className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">LinkedIn</span>
        </button>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy Article Link"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all hover:scale-[1.03]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
