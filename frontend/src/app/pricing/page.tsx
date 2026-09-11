import React from 'react';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import PricingContent from '@/components/pricing/PricingContent';

export const metadata: Metadata = {
  title: 'Pricing & Engineering Engagements',
  description:
    'Transparent product sprint structures, dedicated architecture packages, and engagement tiers at SoloNomous Labs.'
};

export const revalidate = 60; // ISR revalidation every 60s

export default async function PricingPage() {
  let packages: any[] = [];
  try {
    const res = await api.getPackages();
    if (res?.data && res.data.length > 0) {
      packages = res.data;
    }
  } catch (err) {
    console.warn('Pricing packages fetch error, using built-in defaults:', err);
  }

  return <PricingContent initialPackages={packages} />;
}
