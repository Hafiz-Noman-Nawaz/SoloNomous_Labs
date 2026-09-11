'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRANDING } from '@/config/branding.config';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';

interface BrandLogoProps {
  variant?: 'auto' | 'dark' | 'light' | 'mark';
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  linkToHome?: boolean;
  overrideSrc?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'auto',
  className = '',
  imgClassName = '',
  width = 210,
  height = 50,
  linkToHome = true,
  overrideSrc
}) => {
  const [cmsOverride, setCmsOverride] = useState<string>('');
  let activeTheme = 'dark';

  try {
    const themeContext = useTheme();
    activeTheme = themeContext.theme;
  } catch {
    activeTheme = 'dark';
  }

  // Determine effective variant: if auto, follow the active theme
  const effectiveVariant =
    variant === 'auto'
      ? activeTheme === 'light'
        ? 'light'
        : 'dark'
      : variant;

  // Immediate default based on effective variant
  const defaultSrc =
    effectiveVariant === 'mark'
      ? BRANDING.assets.mark
      : effectiveVariant === 'light'
      ? BRANDING.assets.logoLight
      : BRANDING.assets.logoDark;

  useEffect(() => {
    if (overrideSrc) {
      setCmsOverride(overrideSrc);
      return;
    }

    // Check if custom CMS override is saved in database
    api.getSettings()
      .then((res) => {
        const assets = res.data?.brandingAssets;
        if (assets) {
          if (effectiveVariant === 'dark' && assets.logoDark && assets.logoDark !== BRANDING.assets.logoDark) {
            setCmsOverride(assets.logoDark);
          } else if (effectiveVariant === 'light' && assets.logoLight && assets.logoLight !== BRANDING.assets.logoLight) {
            setCmsOverride(assets.logoLight);
          } else if (effectiveVariant === 'mark' && assets.mark && assets.mark !== BRANDING.assets.mark) {
            setCmsOverride(assets.mark);
          } else {
            setCmsOverride('');
          }
        }
      })
      .catch(() => {});
  }, [effectiveVariant, overrideSrc]);

  const finalSrc = cmsOverride || defaultSrc;

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`${effectiveVariant}-${finalSrc}`}
        src={finalSrc}
        alt={BRANDING.companyName}
        width={width}
        height={height}
        className={`h-9.5 sm:h-10 w-auto object-contain transition-transform duration-200 hover:scale-[1.02] ${imgClassName}`}
      />
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-block" aria-label={`${BRANDING.companyName} Home`}>
        {content}
      </Link>
    );
  }

  return content;
};
