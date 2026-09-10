'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export const CursorSpotlight: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: -500,
    y: -500,
    visible: false
  });
  const rafId = useRef<number | null>(null);
  const targetPos = useRef<{ x: number; y: number }>({ x: -500, y: -500 });
  const currentPos = useRef<{ x: number; y: number }>({ x: -500, y: -500 });

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Only run on desktop devices with hover pointers
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!pos.visible) {
        setPos(p => ({ ...p, visible: true }));
      }
    };

    const handleMouseLeave = () => {
      setPos(p => ({ ...p, visible: false }));
    };

    // Smooth lerp animation loop
    const animate = () => {
      const ease = 0.15;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      setPos(p => ({
        x: Math.round(currentPos.current.x),
        y: Math.round(currentPos.current.y),
        visible: p.visible
      }));

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [pos.visible]);

  if (!pos.visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden transition-opacity duration-500"
      style={{
        background: `radial-gradient(650px circle at ${pos.x}px ${pos.y}px, ${
          isDark
            ? 'rgba(147, 51, 234, 0.07), rgba(99, 102, 241, 0.02) 40%, transparent 80%'
            : 'rgba(168, 85, 247, 0.05), rgba(124, 58, 237, 0.01) 40%, transparent 80%'
        })`
      }}
    />
  );
};
