import { z } from 'zod';

export const leadValidationSchema = z.object({
  type: z.enum(['project_inquiry', 'start_a_project', 'quote', 'chat_escalation', 'consultation']).optional(),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional(),
  company: z.string().max(100).optional(),
  serviceInterested: z.string().optional(),
  projectType: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  projectDescription: z.string().min(10, 'Project description must be at least 10 characters').max(5000),
  source: z.string().optional(),
  landingPage: z.string().optional(),
  utmParameters: z
    .object({
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmTerm: z.string().optional(),
      utmContent: z.string().optional()
    })
    .optional()
});

export const contactValidationSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional(),
  subject: z.string().max(150).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  expectedTimeline: z.string().optional(),
  source: z.string().optional()
});

export const chatMessageSchema = z.object({
  sessionId: z.string().min(3),
  message: z.string().min(1, 'Message cannot be empty').max(2000),
  visitorInfo: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional()
    })
    .optional()
});

export const blogPostSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).optional(),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(50),
  featuredImage: z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
    altText: z.string().optional()
  }),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  readingTimeMinutes: z.number().min(1).optional(),
  seoMetadata: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      canonicalUrl: z.string().optional(),
      ogImage: z.string().optional(),
      keywords: z.array(z.string()).optional()
    })
    .optional(),
  socialDerivatives: z
    .object({
      instagramCaption: z.string().optional(),
      facebookPost: z.string().optional(),
      linkedInPost: z.string().optional(),
      xPost: z.string().optional(),
      hooks: z.array(z.string()).optional(),
      carouselSlides: z.array(z.string()).optional()
    })
    .optional()
});

export const serviceSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().optional(),
  summary: z.string().default('High-performance technology service.'),
  badge: z.string().optional(),
  icon: z.string().default('Cpu'),
  heroImage: z.string().optional(),
  problemStatement: z.string().default('Complex business processes requiring automated architecture.'),
  solutionStatement: z.string().default('Engineered scalable systems delivering automated workflows.'),
  features: z.array(
    z.union([
      z.object({
        title: z.string(),
        description: z.string()
      }),
      z.string().transform(s => ({ title: s, description: s }))
    ])
  ).default([]),
  deliverables: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  processSteps: z.array(
    z.object({
      step: z.number(),
      title: z.string(),
      description: z.string()
    })
  ).default([
    { step: 1, title: 'Discovery & Architecture', description: 'Align on requirements and technical specifications.' },
    { step: 2, title: 'Sprint Implementation', description: 'Execute rapid test-driven development.' },
    { step: 3, title: 'Deployment & Scaling', description: 'Production rollout with continuous monitoring.' }
  ]),
  pricingModel: z.enum(['inquiry', 'quote', 'fixed_starting', 'retainer']).default('quote'),
  startingPrice: z.number().optional(),
  pricingInterval: z.enum(['one_time', '/month', '/year', '/week', '']).default('one_time').optional(),
  category: z.string().default('Web & Product').optional(),
  currency: z.string().default('USD').optional(),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string()
    })
  ).default([]),
  displayOrder: z.number().default(0),
  active: z.boolean().default(true),
  featured: z.boolean().default(false)
});

export const knowledgeDocumentSchema = z.object({
  title: z.string().min(3),
  category: z.enum(['company', 'services', 'pricing', 'tech_stack', 'case_studies', 'policies', 'faqs', 'recommendations']),
  content: z.string().min(20),
  chunkSummary: z.string().min(10),
  tags: z.array(z.string()),
  sourceUrl: z.string().optional(),
  active: z.boolean().default(true)
});
