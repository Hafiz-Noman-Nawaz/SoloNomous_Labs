import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  companyName: string;
  brandTagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  officeAddress: string;
  responseTimeNotice: string;
  brandingAssets: {
    logoDark?: string;
    logoLight?: string;
    favicon?: string;
    mark?: string;
  };
  heroSection: {
    badgeText?: string;
    headline?: string;
    subheadline?: string;
    primaryCta?: string;
    secondaryCta?: string;
  };
  aboutSection: {
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
  seoDefaults: {
    defaultMetaTitle: string;
    defaultMetaDescription: string;
    defaultOgImage: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    metaPixelId?: string;
  };
  bannerNotification: {
    enabled: boolean;
    text: string;
    linkUrl: string;
  };
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    companyName: { type: String, default: 'SoloNomous Labs' },
    brandTagline: { type: String, default: 'Engineering Autonomous Systems & High-Precision Digital Products' },
    contactEmail: { type: String, default: 'contact@solonomouslabs.com' },
    contactPhone: { type: String, default: '+1 (555) 019-8234' },
    whatsappNumber: { type: String, default: '+15550198234' },
    officeAddress: { type: String, default: 'Remote-First Engineering Studio | Silicon Valley / Global' },
    responseTimeNotice: { type: String, default: 'Typical engineer response within 4 business hours' },
    brandingAssets: {
      logoDark: { type: String, default: '/assets/branding/logo-dark.svg' },
      logoLight: { type: String, default: '/assets/branding/logo-light.svg' },
      favicon: { type: String, default: '/assets/branding/favicon.svg' },
      mark: { type: String, default: '/assets/branding/flask-icon.svg' }
    },
    heroSection: {
      badgeText: { type: String, default: 'Autonomous Systems & Advanced Software Studio' },
      headline: { type: String, default: 'We build serious digital products, not just websites.' },
      subheadline: { type: String, default: 'SoloNomous Labs combines experimental research rigor with production engineering reliability. We design and deploy high-throughput web applications, scalable multi-tenant SaaS platforms, and enterprise AI engines.' },
      primaryCta: { type: String, default: 'Start a Project' },
      secondaryCta: { type: String, default: 'Explore Capabilities' }
    },
    aboutSection: {
      storyHeadline: { type: String, default: 'Where experimental rigor meets production reliability.' },
      storyContent: { type: String, default: 'SoloNomous Labs was created to counter the tide of superficial digital templates. We are an autonomous software laboratory and advanced technology studio, engineering resilient digital products designed to scale from early-stage inception to enterprise volume.' },
      mission: { type: String, default: 'To provide visionary founders and technical teams with institutional-grade software architecture, accelerating time-to-market without compromising on code quality, security, or future maintainability.' },
      philosophy: { type: String, default: 'We believe code is an asset only when it is rigorously tested and easily understood. We favor explicit type safety, decoupled modular domains, and deterministic validation over transient hype.' },
      futureDirection: { type: String, default: 'As software shifts toward autonomous agents and knowledge graphs, we are pioneering verifiable architectures that operate deterministically inside mission-critical enterprise workflows.' },
      founderImage: { type: String, default: '' },
      founderName: { type: String, default: 'Lead Systems Architect' },
      founderTitle: { type: String, default: 'Founder & Principal Engineer' },
      founderBio: { type: String, default: 'Dedicated to high-performance systems engineering, resilient distributed software, and precision architecture.' }
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/Hafiz-Noman-Nawaz/Noman_Nawaz' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      xTwitter: { type: String, default: 'https://x.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      portfolio: { type: String, default: 'https://www.nouman-nawaz.dev/' },
      fiverr: { type: String, default: 'https://www.fiverr.com/nomannawaz67' }
    },
    seoDefaults: {
      defaultMetaTitle: { type: String, default: 'SoloNomous Labs | Advanced Software Engineering & AI Systems Studio' },
      defaultMetaDescription: { type: String, default: 'We engineer serious digital products, full-stack architectures, SaaS applications, and enterprise AI systems.' },
      defaultOgImage: { type: String, default: '/assets/branding/og-preview.png' }
    },
    analytics: {
      googleAnalyticsId: { type: String, default: '' },
      metaPixelId: { type: String, default: '' }
    },
    bannerNotification: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: 'Now accepting client reservations for Q2 engineering sprints.' },
      linkUrl: { type: String, default: '/contact' }
    }
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export interface IMedia extends Document {
  filename: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  altText?: string;
  folder: string;
  tags: string[];
  uploadedBy?: string;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    format: { type: String, default: 'jpg' },
    bytes: { type: Number, default: 0 },
    width: { type: Number },
    height: { type: Number },
    altText: { type: String, default: '' },
    folder: { type: String, default: 'solonomous-labs' },
    tags: [{ type: String }],
    uploadedBy: { type: String, default: 'admin' }
  },
  { timestamps: true }
);

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
