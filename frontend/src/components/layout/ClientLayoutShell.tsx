'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomCursor } from './CustomCursor';
import { AskSoloChatbot } from '../chat/AskSoloChatbot';
import { StartProjectModal } from '../forms/StartProjectModal';
import { ModalProvider, useModal } from '@/context/ModalContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

const ShellInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isProjectModalOpen, selectedService, openProjectModal, closeProjectModal } = useModal();
  const { theme } = useTheme();

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col transition-colors duration-300 selection:bg-purple-500/20 selection:text-purple-900 ${
        theme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#09080E] text-slate-100'
      }`}
    >
      <CustomCursor />
      
      <Navbar onStartProject={() => openProjectModal()} />

      <main className="flex-1 pt-20">
        {children}
      </main>

      <Footer />

      <AskSoloChatbot onStartProject={() => openProjectModal()} />

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
      <ModalProvider>
        <ShellInner>{children}</ShellInner>
      </ModalProvider>
    </ThemeProvider>
  );
};
