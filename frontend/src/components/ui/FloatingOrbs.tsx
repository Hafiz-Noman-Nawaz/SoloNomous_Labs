'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export const FloatingOrbs: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none">
      {/* Left Ambient Edge Glow Column */}
      <div
        className="absolute -left-48 top-1/4 w-96 h-[650px] rounded-full blur-[140px] transition-opacity duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.18), rgba(99, 102, 241, 0.08) 60%, transparent 80%)'
            : 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.10), rgba(168, 85, 247, 0.04) 60%, transparent 80%)',
          transform: 'translate3d(0, 0, 0)'
        }}
      />

      {/* Right Ambient Edge Glow Column */}
      <div
        className="absolute -right-48 top-2/3 w-96 h-[750px] rounded-full blur-[150px] transition-opacity duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.12), rgba(139, 92, 246, 0.08) 60%, transparent 80%)'
            : 'radial-gradient(ellipse at center, rgba(219, 39, 119, 0.06), rgba(147, 51, 234, 0.03) 60%, transparent 80%)',
          transform: 'translate3d(0, 0, 0)'
        }}
      />

      {/* Floating Transparent Glass Object 1: Levitating Glass Disc */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute left-[5%] top-[22%] w-24 h-24 rounded-full border transition-all duration-500 animate-float-slow"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: isDark
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.01) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(243, 232, 255, 0.4) 100%)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(168, 85, 247, 0.25)',
          boxShadow: isDark
            ? '0 20px 40px -15px rgba(124, 58, 237, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)'
            : '0 15px 35px -10px rgba(147, 51, 234, 0.12), inset 0 1px 2px 0 rgba(255, 255, 255, 0.9)'
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-500/10 via-transparent to-transparent" />
      </div>

      {/* Floating Transparent Glass Object 2: Levitating Glass Rounded Square */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute right-[6%] top-[38%] w-28 h-28 rounded-3xl border transition-all duration-500 animate-float-reverse rotate-12"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: isDark
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(124, 58, 237, 0.03) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(238, 242, 255, 0.5) 100%)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(129, 140, 248, 0.3)',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(139, 92, 246, 0.25), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.25)'
            : '0 20px 40px -10px rgba(99, 102, 241, 0.12), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95)'
        }}
      >
        <div className="w-full h-full rounded-3xl bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
      </div>

      {/* Floating Transparent Glass Object 3: Mini Glass Capsule */}
      <div
        aria-hidden="true"
        className="hidden xl:block absolute left-[8%] bottom-[20%] w-16 h-28 rounded-full border transition-all duration-500 animate-float-slow -rotate-45"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: isDark
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(250, 245, 255, 0.4) 100%)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(192, 132, 252, 0.25)',
          boxShadow: isDark
            ? '0 15px 30px -10px rgba(168, 85, 247, 0.15)'
            : '0 10px 25px -8px rgba(147, 51, 234, 0.1)'
        }}
      />
    </div>
  );
};
