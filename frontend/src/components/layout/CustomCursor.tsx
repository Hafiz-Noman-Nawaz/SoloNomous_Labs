'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'project' | 'button' | 'hidden'>('default');
  const [isTouch, setIsTouch] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device supports hover / is not primary touch
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectCard = target.closest('[data-cursor="project"]');
      if (projectCard) {
        setCursorVariant('project');
        setCursorText('Explore →');
        return;
      }

      const button = target.closest('button, a, input, select, textarea, [data-cursor="button"]');
      if (button) {
        setCursorVariant('button');
        setCursorText('');
        return;
      }

      setCursorVariant('default');
      setCursorText('');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer context ring / pill */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY
        }}
      >
        <motion.div
          animate={{
            width: cursorVariant === 'project' ? 100 : cursorVariant === 'button' ? 44 : 26,
            height: cursorVariant === 'project' ? 36 : cursorVariant === 'button' ? 44 : 26,
            backgroundColor:
              cursorVariant === 'project'
                ? 'rgba(124, 58, 237, 0.9)'
                : cursorVariant === 'button'
                ? 'rgba(139, 92, 246, 0.18)'
                : 'rgba(255, 255, 255, 0.04)',
            borderColor:
              cursorVariant === 'project'
                ? 'rgba(167, 139, 250, 0.8)'
                : cursorVariant === 'button'
                ? 'rgba(139, 92, 246, 0.5)'
                : 'rgba(255, 255, 255, 0.25)'
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="rounded-full border backdrop-blur-xs flex items-center justify-center text-white text-[11px] font-medium tracking-tight shadow-lg shadow-purple-900/20"
        >
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 whitespace-nowrap"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Tiny inner center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] w-1.5 h-1.5 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mouseX,
          y: mouseY
        }}
        animate={{
          opacity: cursorVariant === 'project' ? 0 : 1
        }}
      />
    </>
  );
};
