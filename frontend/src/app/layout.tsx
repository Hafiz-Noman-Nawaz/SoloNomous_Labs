import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '@/styles/globals.css';
import { ClientLayoutShell } from '@/components/layout/ClientLayoutShell';
import { BRANDING } from '@/config/branding.config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://solonomouslabs.com'),
  title: {
    default: 'SoloNomous Labs | Advanced Software Engineering & AI Systems Studio',
    template: '%s | SoloNomous Labs'
  },
  description:
    'We engineer serious digital products, full-stack web architectures, high-performance SaaS platforms, and enterprise AI RAG systems. Experimental rigor meets production reliability.',
  keywords: [
    'SoloNomous Labs',
    'Software Architecture',
    'Full-Stack Engineering',
    'SaaS Development',
    'AI Integration',
    'RAG Systems',
    'Next.js',
    'TypeScript'
  ],
  authors: [{ name: 'SoloNomous Labs Engineering Team' }],
  creator: 'SoloNomous Labs',
  icons: {
    icon: [
      { url: '/assets/branding/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    shortcut: '/assets/branding/favicon.svg',
    apple: '/assets/branding/favicon.svg'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://solonomouslabs.com',
    title: 'SoloNomous Labs | Advanced Software Engineering & AI Systems Studio',
    description:
      'We engineer serious digital products, full-stack architectures, SaaS applications, and enterprise AI systems.',
    siteName: 'SoloNomous Labs',
    images: [
      {
        url: BRANDING.assets.ogImage,
        width: 1200,
        height: 630,
        alt: 'SoloNomous Labs'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoloNomous Labs | Advanced Software Engineering & AI Systems Studio',
    description:
      'We engineer serious digital products, full-stack architectures, SaaS applications, and enterprise AI systems.',
    creator: '@solonomouslabs',
    images: [BRANDING.assets.ogImage]
  }
};

import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <body className="antialiased selection:bg-purple-600/30 selection:text-white">
          <ClientLayoutShell>{children}</ClientLayoutShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
