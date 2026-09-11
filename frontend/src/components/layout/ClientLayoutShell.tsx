'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomCursor } from './CustomCursor';
import { AskSoloChatbot } from '../chat/AskSoloChatbot';
import { FloatingWhatsAppWidget } from '../chat/FloatingWhatsAppWidget';
import { StartProjectModal } from '../forms/StartProjectModal';
import { ModalProvider, useModal } from '@/context/ModalContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';

import { CursorSpotlight } from '../ui/CursorSpotlight';
import { FloatingOrbs } from '../ui/FloatingOrbs';

const ShellInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isProjectModalOpen, selectedService, openProjectModal, closeProjectModal } = useModal();
  const { theme } = useTheme();

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col transition-colors duration-300 selection:bg-purple-500/20 selection:text-purple-900 relative ${
        theme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#09080E] text-slate-100'
      }`}
    >
      {/* Global Ambient Background Haze (Applies across all pages in both Dark & Light themes) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        {theme === 'dark' ? (
          <>
            {/* Dark Mode Ambient Cosmic Studio Haze */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-purple-600/10 blur-[150px] rounded-full" />
            <div className="absolute top-1/3 -left-32 w-[650px] h-[650px] bg-indigo-600/[0.08] blur-[140px] rounded-full" />
            <div className="absolute bottom-1/4 -right-32 w-[700px] h-[700px] bg-purple-800/[0.09] blur-[160px] rounded-full" />
            <div className="absolute bottom-0 left-1/3 w-[600px] h-[450px] bg-violet-950/20 blur-[140px] rounded-full" />
          </>
        ) : (
          <>
            {/* Light Mode Soft Luminous Studio Haze */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-purple-400/[0.07] blur-[150px] rounded-full" />
            <div className="absolute top-1/3 -left-32 w-[650px] h-[650px] bg-indigo-300/[0.08] blur-[140px] rounded-full" />
            <div className="absolute bottom-1/4 -right-32 w-[700px] h-[700px] bg-purple-300/[0.06] blur-[160px] rounded-full" />
            <div className="absolute bottom-0 left-1/3 w-[600px] h-[450px] bg-violet-200/[0.10] blur-[140px] rounded-full" />
          </>
        )}
      </div>

      <CursorSpotlight />
      <FloatingOrbs />
      <CustomCursor />
      
      <Navbar onStartProject={() => openProjectModal()} />

      <main className="flex-1 pt-20">
        {children}
      </main>

      <Footer />

      <AskSoloChatbot onStartProject={() => openProjectModal()} />
      <FloatingWhatsAppWidget />

      <StartProjectModal
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        defaultService={selectedService}
      />
    </div>
  );
};

export const ClientLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ModalProvider>
          <ShellInner>{children}</ShellInner>
        </ModalProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};
