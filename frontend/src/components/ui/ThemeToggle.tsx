'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className="group relative w-[58px] h-[28px] rounded-full overflow-hidden cursor-pointer select-none border border-black/10 dark:border-white/15 shadow-sm shadow-black/10 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 hover:scale-[1.04] active:scale-[0.97] shrink-0"
      >
        {/* Sky Background Gradient */}
        <div
          className={`absolute inset-0 transition-colors duration-700 ease-in-out ${
            isDark
              ? 'bg-gradient-to-b from-[#0B091A] via-[#14122C] to-[#241A4C]'
              : 'bg-gradient-to-b from-[#38bdf8] via-[#60a5fa] to-[#93c5fd]'
          }`}
        />

        {/* Night Stars (visible when isDark) */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out pointer-events-none ${
            isDark ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          {/* Star 1 */}
          <span className="absolute top-[5px] left-[7px] w-[3px] h-[3px] rounded-full bg-white animate-pulse" />
          {/* Star 2 */}
          <span className="absolute top-[14px] left-[12px] w-[2px] h-[2px] rounded-full bg-indigo-200" />
          {/* Star 3 (twinkling 4-point star) */}
          <svg
            className="absolute top-[5px] left-[19px] w-2 h-2 text-amber-200 opacity-90 animate-pulse"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
          </svg>
          {/* Star 4 */}
          <span className="absolute top-[17px] left-[25px] w-[2px] h-[2px] rounded-full bg-purple-200" />
          {/* Star 5 */}
          <span className="absolute top-[6px] left-[30px] w-[2px] h-[2px] rounded-full bg-white" />
        </div>

        {/* Day Clouds (visible when !isDark) */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out pointer-events-none ${
            isDark ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Soft floating cloud puff right */}
          <div className="absolute top-[4px] right-[7px] flex items-center opacity-90">
            <span className="w-3 h-2 bg-white/90 rounded-full shadow-xs" />
            <span className="w-4 h-2.5 bg-white rounded-full -ml-1.5 -mt-0.5 shadow-xs" />
            <span className="w-2.5 h-2 bg-white/80 rounded-full -ml-1 shadow-xs" />
          </div>
          {/* Subtle lower cloud */}
          <div className="absolute top-[10px] right-[18px] flex items-center opacity-70">
            <span className="w-2.5 h-1.5 bg-white/70 rounded-full" />
            <span className="w-3 h-2 bg-white/80 rounded-full -ml-1 -mt-0.5" />
          </div>
        </div>

        {/* Distant Mountains / Rolling Hills Landscape */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none">
          {/* Back mountain ridge */}
          <svg
            viewBox="0 0 58 12"
            className={`w-full h-[12px] transition-colors duration-700 ease-in-out ${
              isDark ? 'text-[#1E193B]' : 'text-[#86efac]/70'
            }`}
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0 12 L0 6 Q 15 1, 29 5 T 58 3 L 58 12 Z" />
          </svg>
          {/* Front rolling hill layer */}
          <svg
            viewBox="0 0 58 9"
            className={`w-full h-[9px] -mt-[5px] transition-colors duration-700 ease-in-out ${
              isDark ? 'text-[#120F24]' : 'text-[#34d399]'
            }`}
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0 9 L0 4 Q 19 0, 38 3 T 58 1 L 58 9 Z" />
          </svg>
        </div>

        {/* The Animated Sun / Moon Orb */}
        <motion.div
          animate={{
            x: isDark ? 33 : 3
          }}
          transition={{
            type: 'spring',
            stiffness: 440,
            damping: 28
          }}
          className="absolute top-[3px] w-[22px] h-[22px] rounded-full flex items-center justify-center pointer-events-none shadow-md"
        >
          {/* Day Sun Mode */}
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-500 ease-in-out ${
              isDark ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}
            style={{
              background: 'radial-gradient(circle at 35% 35%, #FFFBEB 0%, #FDE047 50%, #F59E0B 100%)',
              boxShadow: '0 0 6px rgba(253, 224, 71, 0.8), 0 0 12px rgba(245, 158, 11, 0.4)'
            }}
          >
            {/* Sun subtle glint */}
            <span className="absolute top-[3px] left-[4px] w-1 h-1 rounded-full bg-white/70 blur-[0.3px]" />
          </div>

          {/* Night Moon Mode */}
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-500 ease-in-out overflow-hidden ${
              isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{
              background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E2E8F0 55%, #94A3B8 100%)',
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.6), 0 0 12px rgba(167, 139, 250, 0.35)'
            }}
          >
            {/* Moon craters */}
            <span className="absolute top-[4px] right-[5px] w-1 h-1 rounded-full bg-[#64748B]/35 shadow-inner" />
            <span className="absolute bottom-[5px] right-[7px] w-1.5 h-1.5 rounded-full bg-[#64748B]/35 shadow-inner" />
            <span className="absolute top-[10px] left-[4px] w-1 h-1 rounded-full bg-[#64748B]/30 shadow-inner" />
          </div>
        </motion.div>
      </button>

      {showLabel && (
        <span className="text-xs font-semibold capitalize select-none text-slate-400 dark:text-slate-300">
          {isDark ? 'Dark Theme' : 'Light Theme'}
        </span>
      )}
    </div>
  );
};
