'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BRANDING } from '@/config/branding.config';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read stored preference or system preference
    try {
      const savedTheme = localStorage.getItem('solonomous_theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setThemeState('light');
      } else {
        setThemeState('dark');
      }
    } catch {
      setThemeState('dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }

    if (mounted) {
      try {
        localStorage.setItem('solonomous_theme', theme);
      } catch {}
    }

    // Direct favicon injection ensuring all browsers immediately load the SVG favicon
    const faviconUrl = BRANDING.assets.favicon || '/assets/branding/favicon.svg';
    let iconLinks: NodeListOf<HTMLLinkElement> = document.querySelectorAll("link[rel*='icon']");
    if (iconLinks.length > 0) {
      iconLinks.forEach(link => {
        link.href = `${faviconUrl}?v=${theme}`;
      });
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.type = 'image/svg+xml';
      newLink.href = `${faviconUrl}?v=${theme}`;
      document.head.appendChild(newLink);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
