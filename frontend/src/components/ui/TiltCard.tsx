'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt in degrees (default: 8)
  glareOpacity?: number; // max opacity of cursor glare (default: 0.18)
  scale?: number; // scale on hover (default: 1.02)
  perspective?: number; // 3D perspective depth (default: 1000)
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 7,
  glareOpacity = 0.18,
  scale = 1.015,
  perspective = 1000,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0
  });
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles normalized between -maxTilt and +maxTilt
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        setTransformStyle(
          `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
        );
        setGlarePosition({
          x,
          y,
          opacity: glareOpacity
        });
      });
    },
    [maxTilt, glareOpacity, scale, perspective]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    setTransformStyle(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.08s ease-out'
          : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s ease',
        willChange: 'transform'
      }}
      className={`relative rounded-3xl overflow-hidden group ${className}`}
      {...props}
    >
      {/* Dynamic 3D Cursor Spotlight Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 rounded-3xl"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(380px circle at ${glarePosition.x}px ${glarePosition.y}px, ${
            isDark
              ? 'rgba(168, 85, 247, 0.22), rgba(124, 58, 237, 0.08) 40%, transparent 80%'
              : 'rgba(147, 51, 234, 0.12), rgba(124, 58, 237, 0.04) 40%, transparent 80%'
          })`
        }}
      />

      {/* Dynamic Specular Border Glow following Cursor */}
      <div
        className="pointer-events-none absolute -inset-px z-10 transition-opacity duration-300 rounded-3xl"
        style={{
          opacity: glarePosition.opacity > 0 ? 1 : 0,
          background: `radial-gradient(280px circle at ${glarePosition.x}px ${glarePosition.y}px, ${
            isDark ? 'rgba(192, 132, 252, 0.5)' : 'rgba(147, 51, 234, 0.4)'
          }, transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1.2px'
        }}
      />

      {/* Card Content with 3D Depth Layer */}
      <div style={{ transform: 'translateZ(20px)' }} className="relative z-0 h-full">
        {children}
      </div>
    </div>
  );
};
