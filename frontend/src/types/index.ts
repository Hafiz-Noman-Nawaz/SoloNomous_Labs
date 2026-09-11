export interface Service {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  badge?: string;
  icon: string;
  heroImage?: string;
  problemStatement: string;
  solutionStatement: string;
  features: Array<{ title: string; description: string }>;
  deliverables: string[];
  techStack: string[];
  processSteps: Array<{ step: number; title: string; description: string }>;
  pricingModel: 'inquiry' | 'quote' | 'fixed_starting' | 'retainer';
  startingPrice?: number;
  pricingInterval?: 'one_time' | '/month' | '/year' | '/week' | '';
  currency?: string;
  category?: string;
  faqs: Array<{ question: string; answer: string }>;
  displayOrder: number;
  active: boolean;
  featured: boolean;
}

export interface ServiceCategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  serviceCount?: number;
}

export interface PricingPackage {
  _id: string;
  name: string;
  slug: string;
  badge?: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  discountText?: string;
  period: string;
  description: string;
  deliverables: string[];
  popular: boolean;
  ctaText: string;
  ctaLink: string;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  heroImage: { url: string; altText?: string };
  overview: string;
  challenge: string;
  strategy: string;
  architectureDetails: string;
  results: Array<{ metric: string; label: string }>;
  deliverables: string[];
  techStack: string[];
  relatedServices?: Service[];
  displayOrder: number;
  featured: boolean;
  published: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: { url: string; altText?: string };
  author: { name: string; avatar?: string; bio?: string; role?: string };
  category: { _id: string; name: string; slug: string };
  tags: Array<{ _id: string; name: string; slug: string }>;
  readingTimeMinutes: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  featured: boolean;
  views: number;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  socialDerivatives?: {
    instagramCaption?: string;
    facebookPost?: string;
    linkedInPost?: string;
    xPost?: string;
    hooks?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: 'general' | 'services' | 'pricing' | 'process' | 'technology';
  displayOrder: number;
  active: boolean;
}

export interface Testimonial {
  _id: string;
  clientName: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
  featured: boolean;
}

export interface SiteSettings {
  companyName: string;
  brandTagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  officeAddress: string;
  responseTimeNotice: string;
  brandingAssets?: {
    logoDark?: string;
    logoLight?: string;
    favicon?: string;
    mark?: string;
  };
  heroSection?: {
    badgeText?: string;
    headline?: string;
    subheadline?: string;
    primaryCta?: string;
    secondaryCta?: string;
  };
  aboutSection?: {
    storyHeadline?: string;
    storyContent?: string;
    mission?: string;
    philosophy?: string;
    futureDirection?: string;
    founderImage?: string;
    founderName?: string;
    founderTitle?: string;
    founderBio?: string;
  };
  socialLinks: {
    github?: string;
    linkedin?: string;
    xTwitter?: string;
    instagram?: string;
    youtube?: string;
    portfolio?: string;
    fiverr?: string;
  };
  bannerNotification?: {
    enabled: boolean;
    text: string;
    linkUrl: string;
  };
}
