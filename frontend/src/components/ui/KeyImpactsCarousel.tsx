'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Zap } from 'lucide-react';

export interface KeyImpactItem {
  metric: string;
  label: string;
}

interface KeyImpactsCarouselProps {
  results?: Array<{ metric?: string; label?: string; value?: string }>;
  rawMetricString?: string;
  className?: string;
  autoPlay?: boolean;
}

/**
 * Robust parser that converts results arrays and/or comma-separated metric strings
 * into structured { metric, label } items.
 * Example: "98+ Lighthouse Performance Score, 3x Faster Media Delivery"
 * -> [{ metric: "98+", label: "Lighthouse Performance Score" }, { metric: "3x", label: "Faster Media Delivery" }]
 */
export function extractKeyImpacts(
  results?: Array<{ metric?: string; label?: string; value?: string }>,
  rawMetricString?: string
): KeyImpactItem[] {
  const items: KeyImpactItem[] = [];

  const parseString = (str: string) => {
    const trimmed = str.trim();
    if (!trimmed) return;

    // Pattern 1: Leading metric (e.g. "98+", "99.99%", "3x", "10x", "<50ms", "$2.4M", "500k+")
    const leadingMetricMatch = trimmed.match(
      /^([~<>±]?\$?\d+(?:\.\d+)?(?:[xX%+]|ms|s|k|M|B|k\+|M\+)?)\s*(.*)$/i
    );
    if (leadingMetricMatch && leadingMetricMatch[1]) {
      const metric = leadingMetricMatch[1].trim();
      const label = leadingMetricMatch[2]?.trim() || 'Key Impact';
      items.push({ metric, label });
      return;
    }

    // Pattern 2: Label: Metric (e.g. "Uptime: 99.99%", "Latency: <10ms")
    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      items.push({
        label: parts[0].trim(),
        metric: parts.slice(1).join(':').trim()
      });
      return;
    }

    // Pattern 3: Fallback split
    const words = trimmed.split(/\s+/);
    if (words.length <= 2) {
      items.push({ metric: trimmed, label: 'Key Outcome' });
    } else {
      items.push({ metric: words[0], label: words.slice(1).join(' ') });
    }
  };

  // 1. If explicit results array is passed
  if (Array.isArray(results) && results.length > 0) {
    results.forEach((r) => {
      const metricStr = (r.metric || r.value || '').trim();
      const labelStr = (r.label || '').trim();

      // If metricStr itself has commas (user typed multiple in one field)
      if (metricStr.includes(',')) {
        metricStr.split(',').forEach(parseString);
      } else if (metricStr) {
        if (!labelStr || labelStr.toLowerCase() === 'outcome' || labelStr.toLowerCase() === 'gain') {
          parseString(metricStr);
        } else {
          items.push({ metric: metricStr, label: labelStr });
        }
      }
    });
  }

  // 2. If rawMetricString is passed and nothing added yet
  if (items.length === 0 && rawMetricString) {
    rawMetricString.split(',').forEach(parseString);
  }

  // 3. Fallback if empty
  if (items.length === 0) {
    items.push({ metric: '10x', label: 'Performance Gain' });
  }

  return items;
}

export function KeyImpactsCarousel({
  results,
  rawMetricString,
  className = '',
  autoPlay = false
}: KeyImpactsCarouselProps) {
  const impacts = useMemo(
    () => extractKeyImpacts(results, rawMetricString),
    [results, rawMetricString]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Safe boundary check if impacts change
  useEffect(() => {
    if (currentIndex >= impacts.length) {
      setCurrentIndex(Math.max(0, impacts.length - 1));
    }
  }, [impacts.length, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % impacts.length);
  }, [impacts.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + impacts.length) % impacts.length);
  }, [impacts.length]);

  // Optional subtle autoplay
  useEffect(() => {
    if (!autoPlay || impacts.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [autoPlay, impacts.length, isHovered, handleNext]);

  // If only 1 impact, render clean static card
  if (impacts.length <= 1) {
    const single = impacts[0] || { metric: '10x', label: 'Performance Gain' };
    return (
      <div
        className={`p-3.5 rounded-xl bg-purple-950/25 border border-purple-500/20 text-center relative overflow-hidden group ${className}`}
      >
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />
        <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-purple-400 mb-1">
          <TrendingUp className="w-3 h-3 text-purple-400" />
          <span>Key Impact</span>
        </div>
        <div className="text-xl sm:text-2xl font-black font-display bg-gradient-to-r from-purple-200 via-white to-purple-300 bg-clip-text text-transparent leading-none my-1">
          {single.metric}
        </div>
        <div className="text-xs text-slate-300 font-medium line-clamp-2 leading-tight">
          {single.label}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 overflow-hidden select-none transition-colors duration-300 hover:border-purple-500/40 ${className}`}
    >
      {/* Background ambient glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar: Badge & Arrows */}
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-purple-400">
          <TrendingUp className="w-3 h-3 text-purple-400" />
          <span>Key Impacts ({impacts.length})</span>
        </div>

        {/* Arrow Navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous Key Impact"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePrev();
            }}
            className="w-5 h-5 rounded-md bg-white/5 hover:bg-purple-600/30 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            type="button"
            aria-label="Next Key Impact"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNext();
            }}
            className="w-5 h-5 rounded-md bg-white/5 hover:bg-purple-600/30 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3-Stage Animated Depth Carousel Track */}
      <div className="relative h-20 w-full overflow-hidden flex items-center">
        {impacts.map((item, idx) => {
          const offset = idx - currentIndex;
          const isCurrent = offset === 0;
          const isNext = offset === 1;
          const isPrev = offset === -1;
          const isNextNext = offset === 2;
          const isPrevPrev = offset === -2;

          let transform = 'translateX(120%) scale(0.85)';
          let opacity = '0';
          let zIndex = 0;
          let pointerEvents = 'none';

          if (isCurrent) {
            transform = 'translateX(0%) scale(1)';
            opacity = '1';
            zIndex = 30;
            pointerEvents = 'auto';
          } else if (isNext) {
            // Next item: little fade, peeking from the right
            transform = 'translateX(68%) scale(0.93)';
            opacity = '0.45';
            zIndex = 20;
            pointerEvents = 'auto';
          } else if (isPrev) {
            // Previous item: behind and faded
            transform = 'translateX(-68%) scale(0.93)';
            opacity = '0.35';
            zIndex = 15;
            pointerEvents = 'auto';
          } else if (isNextNext) {
            // Next to next item: faint visible ahead
            transform = 'translateX(100%) scale(0.88)';
            opacity = '0.15';
            zIndex = 10;
          } else if (isPrevPrev) {
            // Far behind
            transform = 'translateX(-100%) scale(0.88)';
            opacity = '0.12';
            zIndex = 5;
          }

          return (
            <div
              key={idx}
              onClick={(e) => {
                if (!isCurrent) {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }
              }}
              style={{
                transform,
                opacity,
                zIndex
              }}
              className={`absolute inset-y-0 w-[78%] transition-all duration-500 ease-out flex flex-col justify-center rounded-xl p-2.5 cursor-pointer backdrop-blur-sm ${
                isCurrent
                  ? 'bg-gradient-to-r from-purple-900/40 via-purple-900/20 to-indigo-950/40 border border-purple-500/40 shadow-lg shadow-purple-950/50'
                  : 'bg-white/[0.03] border border-white/10 hover:opacity-75'
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black font-display bg-gradient-to-r from-purple-200 via-white to-purple-300 bg-clip-text text-transparent shrink-0">
                  {item.metric}
                </span>
                <span className="text-[11px] text-slate-300 font-medium line-clamp-2 leading-snug">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated Glowing Scroll Bar */}
      <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
        <div
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={impacts.length}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(1, clickX / rect.width));
            const targetIdx = Math.min(impacts.length - 1, Math.floor(pct * impacts.length));
            setCurrentIndex(targetIdx);
          }}
          className="relative flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group/bar hover:h-2 transition-all"
          title={`Scroll impact ${currentIndex + 1} of ${impacts.length}`}
        >
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-400 rounded-full transition-all duration-400 ease-out shadow-[0_0_12px_rgba(168,85,247,0.8)]"
            style={{
              width: `${((currentIndex + 1) / impacts.length) * 100}%`
            }}
          />
        </div>

        <div className="text-[10px] font-mono text-purple-300/80 shrink-0 select-none">
          {currentIndex + 1} / {impacts.length}
        </div>
      </div>
    </div>
  );
}
