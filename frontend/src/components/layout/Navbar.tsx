'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '../branding/BrandLogo';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Layers,
  Bot,
  Globe,
  Server,
  Wrench,
  ArrowRight,
  Rocket,
  Shield,
  User
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { api } from '@/lib/api';
import { Service, ServiceCategory } from '@/types';

interface NavbarProps {
  onStartProject: () => void;
}

const DEFAULT_CATEGORIES: ServiceCategory[] = [
  {
    name: 'Web & Product',
    slug: 'web-product',
    description: 'Modern business websites, full-stack web applications, SaaS MVPs, e-commerce platforms, and custom CMS systems.'
  },
  {
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    description: 'AI chatbots, RAG knowledge-based systems, AI workflow automation, and predictive machine learning models.'
  },
  {
    name: 'Backend & Integration',
    slug: 'backend-integration',
    description: 'Robust REST APIs, backend microservices, database architectures, and third-party API webhook integrations.'
  },
  {
    name: 'Optimization and support',
    slug: 'optimization-and-support',
    description: 'Technical SEO audits, Core Web Vitals speed acceleration, monthly code maintenance, and continuous engineering.'
  }
];

export const Navbar: React.FC<NavbarProps> = ({ onStartProject }) => {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileCatExpanded, setMobileCatExpanded] = useState<string | null>(null);

  const [categories, setCategories] = useState<ServiceCategory[]>(DEFAULT_CATEGORIES);
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('web-product');

  const { theme } = useTheme();
  const { settings } = useSettings();
  const isDark = theme === 'dark';
  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const whatsappNumber = settings?.whatsappNumber || settings?.contactPhone || '+92 315 6251281';
  const whatsappDigits = whatsappNumber.replace(/[^0-9]/g, '') || '923156251281';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch dynamic categories and services from API
  useEffect(() => {
    Promise.all([
      api.getCategories().catch(() => ({ data: [] })),
      api.getServices().catch(() => ({ data: [] }))
    ]).then(([catRes, svcRes]) => {
      if (catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data);
        setActiveCategorySlug(catRes.data[0].slug);
      }
      if (svcRes.data && svcRes.data.length > 0) {
        setServices(svcRes.data);
      }
    });
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
    setMobileCatExpanded(null);
  }, [pathname]);

  // Lock body scroll when mobile navigation menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleMouseEnterServices = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleMouseLeaveServices = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 180);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services', hasDropdown: true },
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Resources', href: '/resources' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' }
  ];

  const getCategoryIcon = (slugOrName: string) => {
    const s = slugOrName.toLowerCase();
    if (s.includes('web') || s.includes('product')) return Globe;
    if (s.includes('ai') || s.includes('machine') || s.includes('learning')) return Bot;
    if (s.includes('backend') || s.includes('integration') || s.includes('api')) return Server;
    if (s.includes('optimiz') || s.includes('support') || s.includes('seo') || s.includes('maintenance')) return Wrench;
    return Layers;
  };

  const getServicesForCategory = (catNameOrSlug: string) => {
    const normalizedTarget = catNameOrSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    return services.filter((s) => {
      if (!s.category) return false;
      const normalizedCat = s.category.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedCat === normalizedTarget || s.category.toLowerCase().includes(catNameOrSlug.toLowerCase().replace(/-/g, ' '));
    });
  };

  // Only display categories that actually have at least 1 service
  const activeCategories = categories.filter((cat) => {
    const count = getServicesForCategory(cat.name).length;
    return count > 0 || (cat.serviceCount !== undefined && cat.serviceCount > 0);
  });

  const activeCategory = activeCategories.find(c => c.slug === activeCategorySlug) || activeCategories[0] || categories[0];
  const activeCategoryServices = activeCategory ? getServicesForCategory(activeCategory.name) : [];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? 'bg-[#0B0A12] py-3 shadow-2xl shadow-black/80 border-b border-white/15'
              : 'bg-white py-3 shadow-md border-b border-slate-200'
            : isDark
              ? 'bg-[#07060B]/95 backdrop-blur-md py-4'
              : 'bg-white/95 backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo - Enlarged and punchy */}
          <div className="flex items-center shrink-0">
            <BrandLogo variant="auto" width={220} height={50} className="py-0.5" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={handleMouseEnterServices}
                    onMouseLeave={handleMouseLeaveServices}
                  >
                    {/* Main Services Link: Clicking opens /services, hovering opens dropdown */}
                    <Link
                      href={link.href}
                      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive || pathname.startsWith('/services')
                          ? isDark
                            ? 'text-white bg-white/10'
                            : 'text-purple-700 bg-purple-50 font-semibold'
                          : isDark
                            ? 'text-slate-300 hover:text-white hover:bg-white/5'
                            : 'text-slate-700 hover:text-purple-700 hover:bg-slate-100'
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          servicesOpen ? 'rotate-180 text-purple-400' : 'text-slate-400'
                        }`}
                      />
                    </Link>

                    {/* Services Mega Dropdown (Solid, 100% Opaque to prevent background bleed) */}
                    {servicesOpen && (
                      <div
                        className={`absolute top-full -left-16 xl:left-0 mt-2 w-[680px] rounded-2xl border shadow-2xl z-50 p-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${
                          isDark
                            ? 'bg-[#0E0C17] border-white/20 text-white shadow-black'
                            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
                        }`}
                        style={{ isolation: 'isolate' }}
                        onMouseEnter={handleMouseEnterServices}
                        onMouseLeave={handleMouseLeaveServices}
                      >
                        <div className="grid grid-cols-12 gap-3">
                          {/* Left Column: Active Categories List */}
                          <div
                            className={`col-span-5 p-2.5 rounded-xl border flex flex-col justify-between ${
                              isDark
                                ? 'bg-[#151322] border-white/10'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-500 px-3 py-1.5 mb-1">
                                Service Categories
                              </div>
                              <div className="space-y-1">
                                {activeCategories.map((cat) => {
                                  const Icon = getCategoryIcon(cat.slug || cat.name);
                                  const isCatActive = activeCategorySlug === cat.slug;
                                  const catServices = getServicesForCategory(cat.name);

                                  return (
                                    <div
                                      key={cat.slug}
                                      onMouseEnter={() => setActiveCategorySlug(cat.slug)}
                                      className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                                        isCatActive
                                          ? isDark
                                            ? 'bg-purple-600/30 border border-purple-500/50 text-white shadow-sm'
                                            : 'bg-purple-100/90 border border-purple-300 text-purple-950 font-semibold'
                                          : isDark
                                            ? 'hover:bg-white/5 text-slate-300 border border-transparent'
                                            : 'hover:bg-slate-200/60 text-slate-700 border border-transparent'
                                      }`}
                                    >
                                      {/* Click category to open dedicated category page */}
                                      <Link
                                        href={`/services/category/${cat.slug}`}
                                        className="flex items-center gap-2.5 flex-1 min-w-0"
                                        onClick={() => setServicesOpen(false)}
                                        title={`View ${cat.name} Page`}
                                      >
                                        <div
                                          className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                                            isCatActive
                                              ? 'bg-purple-600 text-white'
                                              : isDark
                                                ? 'bg-white/5 text-purple-400 group-hover:bg-purple-600/20'
                                                : 'bg-white text-purple-700 group-hover:bg-purple-100'
                                          }`}
                                        >
                                          <Icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="truncate">
                                          <div
                                            className={`text-xs font-semibold truncate leading-tight ${
                                              isDark
                                                ? 'group-hover:text-purple-300'
                                                : 'group-hover:text-purple-700'
                                            }`}
                                          >
                                            {cat.name}
                                          </div>
                                          <div
                                            className={`text-[10px] ${
                                              isDark ? 'text-slate-400' : 'text-slate-500'
                                            }`}
                                          >
                                            {catServices.length || cat.serviceCount || 0} services
                                          </div>
                                        </div>
                                      </Link>
                                      <ChevronRight
                                        className={`w-3.5 h-3.5 transition-transform shrink-0 ${
                                          isCatActive
                                            ? 'text-purple-500 translate-x-0.5'
                                            : isDark
                                              ? 'text-slate-500'
                                              : 'text-slate-400'
                                        }`}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Explore All link in categories bottom */}
                            <div
                              className={`mt-3 pt-2.5 border-t px-2 ${
                                isDark ? 'border-white/5' : 'border-slate-200'
                              }`}
                            >
                              <Link
                                href="/services"
                                onClick={() => setServicesOpen(false)}
                                className="text-xs font-semibold text-purple-500 hover:text-purple-400 inline-flex items-center gap-1.5 transition-colors"
                              >
                                <span>Explore All Services</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>

                          {/* Right Column: Dynamic Services Under Hovered Category */}
                          <div className={`col-span-7 p-3 rounded-xl border flex flex-col justify-between ${
                            isDark ? 'bg-[#151322] border-white/10' : 'bg-slate-50/70 border-slate-200'
                          }`}>
                            {activeCategory ? (
                              <div>
                                <div
                                  className={`flex items-center justify-between pb-2 mb-2 border-b ${
                                    isDark ? 'border-white/10' : 'border-slate-200'
                                  }`}
                                >
                                  <span
                                    className={`text-xs font-bold tracking-tight ${
                                      isDark ? 'text-white' : 'text-slate-900'
                                    }`}
                                  >
                                    {activeCategory.name}
                                  </span>
                                  <Link
                                    href={`/services/category/${activeCategory.slug}`}
                                    onClick={() => setServicesOpen(false)}
                                    className="text-[11px] font-medium text-purple-500 hover:underline flex items-center gap-1"
                                  >
                                    View category page <ArrowRight className="w-2.5 h-2.5" />
                                  </Link>
                                </div>

                                <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                                  {activeCategoryServices.length > 0 ? (
                                    activeCategoryServices.map((svc) => (
                                      <Link
                                        key={svc.slug}
                                        href={`/services/${svc.slug}`}
                                        onClick={() => setServicesOpen(false)}
                                        className={`block p-2 rounded-xl transition-all group ${
                                          isDark
                                            ? 'hover:bg-white/5'
                                            : 'hover:bg-purple-50/70 border border-transparent hover:border-purple-100'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <div
                                            className={`text-xs font-semibold group-hover:text-purple-400 transition-colors truncate ${
                                              isDark ? 'text-slate-200' : 'text-slate-800'
                                            }`}
                                          >
                                            {svc.title}
                                          </div>
                                          {svc.startingPrice && (
                                            <span
                                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                                                isDark
                                                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                                                  : 'bg-purple-100 text-purple-800 border border-purple-200'
                                              }`}
                                            >
                                              From ${svc.startingPrice}
                                            </span>
                                          )}
                                        </div>
                                        {svc.summary && (
                                          <p
                                            className={`text-[11px] line-clamp-1 mt-0.5 leading-snug ${
                                              isDark ? 'text-slate-400' : 'text-slate-500'
                                            }`}
                                          >
                                            {svc.summary}
                                          </p>
                                        )}
                                      </Link>
                                    ))
                                  ) : (
                                    <div
                                      className={`py-8 text-center text-xs ${
                                        isDark ? 'text-slate-400' : 'text-slate-500'
                                      }`}
                                    >
                                      No services registered under this category yet.
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex items-center justify-center h-full text-xs ${
                                  isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}
                              >
                                Hover on a category to view its services
                              </div>
                            )}

                            <div
                              className={`pt-2 mt-2 border-t flex justify-end ${
                                isDark ? 'border-white/5' : 'border-slate-100'
                              }`}
                            >
                              <Link
                                href="/services"
                                onClick={() => setServicesOpen(false)}
                                className={`text-[11px] font-medium inline-flex items-center gap-1 ${
                                  isDark
                                    ? 'text-slate-400 hover:text-white'
                                    : 'text-slate-600 hover:text-purple-700'
                                }`}
                              >
                                View full architecture catalog <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? isDark
                        ? 'text-white bg-white/10'
                        : 'text-purple-700 bg-purple-50 font-semibold'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                        : 'text-slate-700 hover:text-purple-700 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Action - Unified Height (h-9.5) and Visual Design System */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className={`h-9.5 px-3.5 rounded-xl inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer shrink-0 shadow-xs ${
                    isDark
                      ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border-white/10'
                      : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border-slate-200'
                  }`}
                  title="Client Portal Sign In"
                >
                  <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="whitespace-nowrap">Client Login</span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div
                className={`h-9.5 px-2 rounded-xl border flex items-center justify-center shrink-0 shadow-xs ${
                  isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-100/90 border-slate-200'
                }`}
              >
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            {/* Single Theme Toggle */}
            <ThemeToggle />

            <Link
              href="/admin"
              className={`h-9.5 px-3.5 rounded-xl inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer shrink-0 shadow-xs group ${
                isDark
                  ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white border-purple-500/25 hover:border-purple-500/40'
                  : 'bg-purple-50 hover:bg-purple-100/80 text-purple-800 hover:text-purple-950 border-purple-200 hover:border-purple-300'
              }`}
              title="Open SoloNomous Studio CMS & Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="whitespace-nowrap">Studio CMS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </Link>

            <button
              type="button"
              onClick={onStartProject}
              className="h-9.5 px-4.5 rounded-xl inline-flex items-center gap-2 text-xs font-semibold whitespace-nowrap bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 hover:shadow-purple-600/35 border border-purple-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Rocket className="w-3.5 h-3.5 text-purple-200 shrink-0" />
              <span className="whitespace-nowrap">Start a Project</span>
            </button>
          </div>

          {/* Mobile Right Action: ONLY below lg, single theme toggle, CMS, and burger button */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link
              href="/admin"
              className={`h-9.5 px-3 rounded-xl border transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 shadow-xs ${
                isDark
                  ? 'text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30'
                  : 'text-purple-800 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 border-purple-200'
              }`}
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-purple-500" />
              <span>CMS</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`h-9.5 w-9.5 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs focus:outline-hidden ${
                isDark
                  ? 'bg-white/5 text-slate-300 hover:text-white border-white/10'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-purple-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Full-Screen Overlay & Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden fixed inset-0 z-[99999] flex flex-col transition-all duration-200 ${
            isDark ? 'bg-[#09080F] text-slate-100' : 'bg-white text-slate-900'
          }`}
          style={{ backgroundColor: isDark ? '#09080F' : '#FFFFFF' }}
        >
          {/* Top Header inside mobile menu */}
          <div
            className={`px-4 py-3.5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-white/10 bg-[#0B0A12]' : 'border-slate-200 bg-white'
            }`}
            style={{ backgroundColor: isDark ? '#0B0A12' : '#FFFFFF' }}
          >
            <div className="flex items-center">
              <BrandLogo variant="auto" width={160} height={36} />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? 'text-purple-400 hover:text-white hover:bg-white/5 border-purple-500/30'
                    : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50 border-purple-300'
                }`}
                title="Admin Portal"
              >
                <Shield className="w-5 h-5" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer focus:outline-hidden ${
                  isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/5 border-white/10'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-300'
                }`}
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
          </div>

          {/* Scrollable Navigation Items */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-500 px-3 mb-2">
                Navigation
              </div>

              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.hasDropdown) {
                  return (
                    <div key={link.name} className="space-y-1">
                      <div
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                          isActive
                            ? isDark
                              ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30'
                              : 'bg-purple-50 text-purple-800 font-bold border border-purple-200'
                            : isDark
                              ? 'bg-white/[0.03] text-slate-200 hover:bg-white/[0.07]'
                              : 'bg-slate-100/70 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-base font-semibold flex-1"
                        >
                          {link.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="p-1.5 rounded-lg text-purple-500 hover:bg-white/10 cursor-pointer"
                          aria-label="Expand service categories"
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-200 ${
                              mobileServicesOpen ? 'rotate-180 text-purple-600' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Expanded Categories in Mobile Drawer */}
                      {mobileServicesOpen && (
                        <div
                          className={`pl-3 pr-2 py-3 space-y-2 rounded-xl border my-1 ${
                            isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <Link
                            href="/services"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            Explore All Services Page →
                          </Link>

                          {activeCategories.map((cat) => {
                            const isCatOpen = mobileCatExpanded === cat.slug;
                            const catSvcs = getServicesForCategory(cat.name);

                            return (
                              <div key={cat.slug} className="space-y-1">
                                <div
                                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-200/60'
                                  }`}
                                >
                                  <Link
                                    href={`/services/category/${cat.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-xs font-semibold ${
                                      isDark ? 'text-slate-200 hover:text-purple-300' : 'text-slate-800 hover:text-purple-700'
                                    }`}
                                  >
                                    {cat.name}
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => setMobileCatExpanded(isCatOpen ? null : cat.slug)}
                                    className="p-1 text-slate-400 hover:text-purple-500 cursor-pointer"
                                  >
                                    <ChevronDown
                                      className={`w-4 h-4 transition-transform duration-200 ${
                                        isCatOpen ? 'rotate-180 text-purple-500' : ''
                                      }`}
                                    />
                                  </button>
                                </div>

                                {isCatOpen && (
                                  <div className="pl-4 space-y-1 border-l-2 border-purple-500/40 ml-3 py-1">
                                    {catSvcs.map((s) => (
                                      <Link
                                        key={s.slug}
                                        href={`/services/${s.slug}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block py-1.5 text-xs truncate ${
                                          isDark ? 'text-slate-400 hover:text-purple-300' : 'text-slate-600 hover:text-purple-700'
                                        }`}
                                      >
                                        {s.title}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      isActive
                        ? isDark
                          ? 'text-purple-400 bg-purple-500/10 font-bold border-l-4 border-purple-500'
                          : 'text-purple-700 bg-purple-50 font-bold border-l-4 border-purple-600'
                        : isDark
                          ? 'text-slate-200 hover:text-white hover:bg-white/5'
                          : 'text-slate-700 hover:text-purple-800 hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Bottom Actions inside mobile menu */}
            <div
              className={`pt-6 border-t space-y-3 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartProject();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-center text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-purple-200" /> Start a Project
              </button>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full py-3 rounded-xl border font-semibold text-center text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300'
                    : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-500" />
                <span>Studio CMS & Admin Panel</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              </Link>

              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full py-3 rounded-xl border font-semibold text-center text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    }`}
                  >
                    <User className="w-4 h-4 text-purple-500" />
                    <span>Client Portal Sign In</span>
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div
                  className={`flex items-center justify-between p-3.5 rounded-xl border ${
                    isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-100 border-slate-300'
                  }`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Client Account Active
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

              <div
                className={`text-center text-xs pt-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-purple-400 transition-colors inline-block"
                >
                  Direct WhatsApp: {whatsappNumber}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
