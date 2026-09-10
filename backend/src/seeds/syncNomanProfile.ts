import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import {
  User,
  Service,
  CaseStudy,
  KnowledgeDocument,
  SiteSettings
} from '../models';

export const syncNomanProfile = async () => {
  console.log('🔄 Syncing Noman Nawaz profile and knowledge base into MongoDB Atlas...');

  // 1. Update / Upsert User
  await User.findOneAndUpdate(
    { email: 'nawaznoman7766@gmail.com' },
    {
      name: 'Noman Nawaz',
      email: 'nawaznoman7766@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'superadmin',
      bio: 'Full-Stack Software Engineer & ML Developer with extensive expertise in Next.js, MERN stack, Python, and scalable AI systems architecture. Founder at SoloNomous Labs.',
      active: true
    },
    { upsert: true, new: true }
  );

  // 2. Update / Upsert SiteSettings
  const existingSettings = await SiteSettings.findOne();
  const settingsData = {
    companyName: 'SoloNomous Labs',
    brandTagline: 'High-Performance Next.js, Full-Stack MERN & Autonomous AI Systems',
    contactEmail: 'nawaznoman7766@gmail.com',
    contactPhone: '+92 315 6251281',
    whatsappNumber: '+923156251281',
    officeAddress: 'Remote / Global (Available Worldwide)',
    responseTimeNotice: 'Typical response within 2 business hours',
    socialLinks: {
      github: 'https://github.com/Hafiz-Noman-Nawaz/Noman_Nawaz',
      linkedin: 'https://www.linkedin.com',
      portfolio: 'https://www.nouman-nawaz.dev/',
      fiverr: 'https://www.fiverr.com/nomannawaz67'
    },
    aboutSection: {
      storyHeadline: 'Engineering serious digital products, resilient SaaS, and intelligent AI architectures.',
      storyContent: 'SoloNomous Labs is an autonomous software laboratory and advanced technology studio founded by Noman Nawaz. We engineer resilient digital products designed to scale from early-stage inception to enterprise volume, fusing experimental innovation with production reliability.',
      mission: 'To deliver institutional-grade full-stack web architectures, production-ready AI applications, and pixel-perfect digital experiences without compromising on code quality, security, or maintainability.',
      philosophy: 'We believe clean code and deterministic architecture are true business assets. We favor explicit type safety, decoupled modular domains, and verified citations over transient hype.',
      futureDirection: 'Pioneering autonomous AI agent workflows, real-time streaming architectures, and high-throughput SaaS platforms.',
      founderImage: '', // Remains empty to show the sleek laboratory emblem until Noman provides his portrait URL in CMS
      founderName: 'Noman Nawaz',
      founderTitle: 'Founder & Principal Full-Stack / AI Systems Architect',
      founderBio: 'Full-Stack Software Engineer & ML Developer with a proven track record architecting scalable web applications, sub-millisecond AI classification pipelines, and interactive 60fps user interfaces. Creator of ZeoAtlas (Conversational AI Platform) and Zashas (Next.js E-Commerce).'
    },
    brandingAssets: existingSettings?.brandingAssets || {
      logoDark: '/assets/branding/logo-dark.svg',
      logoLight: '/assets/branding/logo-light.svg',
      favicon: '/assets/branding/favicon.svg',
      mark: '/assets/branding/flask-icon.svg'
    },
    heroSection: {
      headline: 'We engineer serious digital products, full-stack systems, and autonomous AI.',
      subheading: 'SoloNomous Labs builds modern AI-powered MERN/Next.js web applications, custom SaaS platforms, and pixel-perfect interfaces designed for speed, scale, and enterprise reliability.',
      ctaPrimaryText: 'Start a Project'
    },
    seoDefaults: {
      defaultMetaTitle: 'SoloNomous Labs | Noman Nawaz — Full-Stack MERN & AI Systems Studio',
      defaultMetaDescription: 'Portfolio & Software Studio of Noman Nawaz. Specializing in Next.js, MERN stack, Python ML pipelines, and autonomous AI web applications.',
      defaultOgImage: '/assets/branding/og-preview.png'
    },
    bannerNotification: {
      enabled: true,
      text: 'Now accepting reservations for Q2 engineering sprints and custom AI SaaS builds.',
      linkUrl: '/contact'
    }
  };

  if (existingSettings) {
    await SiteSettings.findByIdAndUpdate(existingSettings._id, settingsData);
  } else {
    await SiteSettings.create(settingsData);
  }

  // 3. Clear and Refresh Knowledge Base Documents
  await KnowledgeDocument.deleteMany({});
  await KnowledgeDocument.insertMany([
    {
      title: 'Founder & Leadership — Noman Nawaz',
      category: 'company',
      content: 'SoloNomous Labs was founded by Noman Nawaz (Nouman Nawaz), an elite Full-Stack Software Engineer and Machine Learning Developer. Noman specializes in Next.js, the MERN stack (MongoDB, Express.js, React, Node.js), Python, and real-time streaming AI pipelines. He has architected scalable software systems including ZeoAtlas (Autonomous Conversational AI platform) and Zashas (Next.js E-Commerce storefront). Noman operates globally from Pakistan and delivers end-to-end client solutions. His official personal portfolio website is https://www.nouman-nawaz.dev/ and his GitHub is https://github.com/Hafiz-Noman-Nawaz/Noman_Nawaz. Clients can contact him directly via WhatsApp at +92 315 6251281 or email at nawaznoman7766@gmail.com.',
      chunkSummary: 'SoloNomous Labs was founded by Noman Nawaz, a Senior Full-Stack MERN & AI Systems Developer whose live portfolio is available at https://www.nouman-nawaz.dev/.',
      tags: ['owner', 'founder', 'noman', 'nawaz', 'nouman', 'leadership', 'who', 'about', 'creator', 'name'],
      sourceUrl: 'https://www.nouman-nawaz.dev/',
      version: 1,
      active: true
    },
    {
      title: 'Featured Projects & Software Architectures — Portfolio Showcase',
      category: 'case_studies',
      content: 'Clients can explore Noman Nawaz\'s verified projects, software architectures, live demos, and source code repositories directly on his personal portfolio website: https://www.nouman-nawaz.dev/. Key featured projects include: 1) ZeoAtlas: An autonomous conversational AI workspace featuring real-time web search grounding, sub-5ms local ML intent classification, and real-time Server-Sent Events (SSE) streaming inference. 2) Zashas: A modern, high-performance e-commerce storefront engineered with Next.js, React 19, Node.js, Express, and MongoDB for seamless media delivery and 60fps shopping interactions. 3) SoloNomous Labs platform with its embedded RAG intelligence engine. Detailed case studies and architecture diagrams are also featured on the SoloNomous Labs "Work" page (/work).',
      chunkSummary: 'Noman Nawaz\'s featured projects, including ZeoAtlas (AI Platform) and Zashas (E-Commerce Storefront), can be explored on his portfolio at https://www.nouman-nawaz.dev/.',
      tags: ['projects', 'portfolio', 'work', 'zashas', 'zeoatlas', 'demo', 'case study', 'past work', 'done', 'experience', 'showcase'],
      sourceUrl: 'https://www.nouman-nawaz.dev/',
      version: 1,
      active: true
    },
    {
      title: 'Flagship Services & Verified Fiverr Gigs',
      category: 'services',
      content: 'Noman Nawaz and SoloNomous Labs offer three core specialized engineering services, also available for direct verified order on his Fiverr profile (https://www.fiverr.com/nomannawaz67):\n1) Build a Modern AI-Powered MERN or Next.js Web Application: Intelligent LLM integration (Gemini, OpenAI), RAG vector search, streaming responses, and autonomous agent workflows. (Fiverr Gig: https://www.fiverr.com/nomannawaz67/build-a-modern-ai-powered-mern-or-nextjs-web-application)\n2) Build a Custom SaaS or Business Website as a Full-Stack MERN Developer: Production-grade SaaS platforms, multi-tenant databases, Clerk/JWT authentication, and Stripe payments. (Fiverr Gig: https://www.fiverr.com/nomannawaz67/build-a-custom-saas-or-business-website-as-a-full-stack-mern-developer)\n3) Convert Figma to a Responsive React, Next.js, and Tailwind CSS Website: Pixel-perfect 1:1 translation from Figma to responsive, accessible, 60fps animated web applications. (Fiverr Gig: https://www.fiverr.com/nomannawaz67/convert-figma-to-a-responsive-react-next-js-and-tailwind-css-website)\nClients can order via Fiverr or click "Start a Project" on this website.',
      chunkSummary: 'Noman provides Modern AI-Powered Web Applications, Custom SaaS Development, and Pixel-Perfect Figma to React/Next.js conversion. Verified gigs on https://www.fiverr.com/nomannawaz67.',
      tags: ['services', 'fiverr', 'offer', 'gigs', 'ai', 'saas', 'figma', 'mern', 'nextjs', 'hire', 'pricing', 'capabilities'],
      sourceUrl: 'https://www.fiverr.com/nomannawaz67',
      version: 1,
      active: true
    },
    {
      title: 'Direct Contact Channels & Hiring',
      category: 'company',
      content: 'To discuss an engineering project, request an architecture review, or hire Noman Nawaz, clients can reach out directly through any of the following channels:\n• WhatsApp / Phone: +92 315 6251281\n• Email: nawaznoman7766@gmail.com\n• Portfolio: https://www.nouman-nawaz.dev/\n• Fiverr Profile: https://www.fiverr.com/nomannawaz67\n• "Start a Project" Modal: Submit project requirements directly on the SoloNomous Labs website.\nTypical response time is under 2 business hours.',
      chunkSummary: 'Contact Noman Nawaz via WhatsApp (+92 315 6251281), email (nawaznoman7766@gmail.com), Fiverr, or his personal portfolio at https://www.nouman-nawaz.dev/.',
      tags: ['contact', 'email', 'phone', 'whatsapp', 'hire', 'reach', 'talk', 'call'],
      sourceUrl: '/contact',
      version: 1,
      active: true
    },
    {
      title: 'Engineering Methodology & Delivery Guarantee',
      category: 'policies',
      content: 'All client solutions adhere to a 4-step engineering process: 1) Architecture Blueprint & Schema Modeling, 2) Component System & Type-Safe API Contracts, 3) Full-Stack Integration & Automated Testing, 4) Production Deployment & Telemetry Setup. Every engagement includes 100% intellectual property ownership transfer to the client and post-launch stabilization support.',
      chunkSummary: 'SoloNomous Labs guarantees 100% IP ownership, rapid sprint delivery, and institutional code quality across all engagements.',
      tags: ['process', 'timeline', 'methodology', 'quality', 'sla', 'guarantee'],
      sourceUrl: '/about',
      version: 1,
      active: true
    }
  ]);

  // 4. Update Services to Match the 3 Fiverr Gigs
  await Service.deleteMany({});
  await Service.insertMany([
    {
      title: 'Modern AI-Powered MERN & Next.js Web Applications',
      slug: 'ai-powered-mern-nextjs-web-applications',
      summary: 'Architecting intelligent, full-stack web applications integrating Google Gemini, OpenAI, RAG vector retrieval, real-time streaming, and autonomous agents with Next.js and Node.js.',
      badge: 'Flagship Offering',
      icon: 'Bot',
      problemStatement: 'Businesses struggle to bridge off-the-shelf AI models with real-world databases, resulting in hallucinated outputs, slow responses, and brittle integrations.',
      solutionStatement: 'We engineer deterministic, low-latency AI architectures featuring custom vector embeddings, streaming Server-Sent Events (SSE), and secure API pipelines.',
      features: [
        { title: 'Autonomous RAG Pipelines', description: 'Semantic vector retrieval with Pinecone/Qdrant and verifiable source citations.' },
        { title: 'Real-Time Streaming Inference', description: 'Fluid, low-latency token streaming with zero layout thrashing or frame drops.' },
        { title: 'Custom Agent Workflows', description: 'Multi-step autonomous agent tools and background job scheduling.' }
      ],
      deliverables: ['Complete Full-Stack Source Code', 'Integrated AI API Pipeline', 'Vector Database Indexing Automation', 'Production Cloud Deployment'],
      techStack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'Gemini / OpenAI API', 'Tailwind CSS'],
      processSteps: [
        { step: 1, title: 'AI Architecture Blueprint', description: 'Defining model selection, prompt pipelines, and vector schemas.' },
        { step: 2, title: 'Data Ingestion & Indexing', description: 'Chunking, embedding, and setting up retrieval pipelines.' },
        { step: 3, title: 'Full-Stack Integration', description: 'Connecting reactive frontend streaming to resilient backend APIs.' },
        { step: 4, title: 'Benchmarking & Launch', description: 'Evaluating latency, token efficiency, and deploying to production.' }
      ],
      pricingModel: 'fixed_starting',
      startingPrice: 3500,
      currency: 'USD',
      faqs: [
        { question: 'Can this be ordered via Fiverr?', answer: 'Yes! You can order directly through Noman\'s verified Fiverr gig or engage via SoloNomous Labs.' },
        { question: 'Which AI models do you integrate?', answer: 'Google Gemini, OpenAI GPT-4o, Claude, and local open-source models via Ollama/HuggingFace.' }
      ],
      displayOrder: 1,
      active: true,
      featured: true
    },
    {
      title: 'Custom Full-Stack SaaS & Business Website Engineering',
      slug: 'custom-saas-business-website-mern',
      summary: 'Building scalable, multi-tenant SaaS platforms and enterprise business websites with the MERN stack, Clerk/JWT authentication, Stripe billing, and MongoDB.',
      badge: 'Enterprise SaaS',
      icon: 'Rocket',
      problemStatement: 'Off-the-shelf website builders lack the database flexibility, authentication security, and custom business logic required for serious operations.',
      solutionStatement: 'We build production-ready full-stack foundations with modular architecture, secure user management, transactional consistency, and intuitive admin dashboards.',
      features: [
        { title: 'Multi-Tenant Architecture', description: 'Secure data segregation, role-based access control, and scalable schemas.' },
        { title: 'Turnkey Auth & Payments', description: 'Seamless Clerk/JWT auth with Stripe recurring subscription billing and webhooks.' },
        { title: 'Dynamic Headless CMS', description: 'Custom administrative panels for effortless content and digital asset management.' }
      ],
      deliverables: ['Production SaaS Codebase', 'Database Schemas & Migrations', 'Stripe Billing Matrix', 'Administrative Control Panel'],
      techStack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'Clerk Auth', 'Stripe', 'Tailwind CSS'],
      processSteps: [
        { step: 1, title: 'Data & Security Modeling', description: 'Defining tenant schemas, access roles, and payment flows.' },
        { step: 2, title: 'Core Business Engine', description: 'Implementing backend business logic with high-concurrency protection.' },
        { step: 3, title: 'Dashboard & Client Portal', description: 'Building the responsive, accessible user and admin interfaces.' },
        { step: 4, title: 'Production Cutover', description: 'Securing API endpoints, setting up SSL, and live launch.' }
      ],
      pricingModel: 'fixed_starting',
      startingPrice: 4500,
      currency: 'USD',
      faqs: [
        { question: 'Is the code 100% owned by us?', answer: 'Yes, full intellectual property and source code repositories are transferred upon milestone delivery.' }
      ],
      displayOrder: 2,
      active: true,
      featured: true
    },
    {
      title: 'Figma to Pixel-Perfect Responsive React/Next.js & Tailwind CSS',
      slug: 'figma-to-responsive-react-nextjs-tailwind',
      summary: 'Translating Figma UI/UX designs into responsive, accessible, high-performance React and Next.js applications with Tailwind CSS and Framer Motion micro-interactions.',
      badge: 'Design to Code',
      icon: 'Layers',
      problemStatement: 'Design teams frequently experience broken translations where developers deliver sluggish, non-responsive layouts that fail to match the Figma mockups.',
      solutionStatement: 'We guarantee pixel-perfect 1:1 fidelity, clean modular components, smooth 60fps animations, and strict mobile-first responsive optimization.',
      features: [
        { title: 'Pixel-Perfect Fidelity', description: 'Exact typography, spacing, color matching, and design token compliance.' },
        { title: 'Mobile-First Responsiveness', description: 'Seamless fluid layouts tested across all modern mobile, tablet, and desktop viewports.' },
        { title: 'Interactive Micro-Animations', description: 'Smooth Framer Motion interactions, hover states, and dynamic transitions.' }
      ],
      deliverables: ['Clean Modular React/Next.js Components', 'Tailwind Design System Tokens', 'Responsive Layout Validation', 'Cross-Browser Verification'],
      techStack: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Figma'],
      processSteps: [
        { step: 1, title: 'Figma Design Audit', description: 'Extracting typography styles, color palettes, and component hierarchy.' },
        { step: 2, title: 'Design System Construction', description: 'Building reusable Tailwind primitives and shared atoms.' },
        { step: 3, title: 'Page Assembly & Animations', description: 'Composing pages with reactive state and motion micro-interactions.' },
        { step: 4, title: 'Responsiveness Testing', description: 'Strict testing across Safari, Chrome, Firefox, iOS, and Android.' }
      ],
      pricingModel: 'fixed_starting',
      startingPrice: 1500,
      currency: 'USD',
      faqs: [
        { question: 'Can you work with existing codebases?', answer: 'Yes, we can either build standalone pages or integrate new components into your existing frontend repo.' }
      ],
      displayOrder: 3,
      active: true,
      featured: true
    },
    {
      title: 'High-Throughput API & Cloud Engineering',
      slug: 'high-throughput-api-engineering',
      summary: 'Resilient REST APIs, database optimization, and cloud infrastructure engineered for high concurrency, low latency, and rock-solid reliability.',
      badge: 'Infrastructure',
      icon: 'Server',
      problemStatement: 'Unoptimized database queries and monolithic bottlenecks degrade application performance during customer traffic spikes.',
      solutionStatement: 'We engineer cached, idempotent, and rate-limited REST services utilizing Node.js, Express, MongoDB, and Redis caching.',
      features: [
        { title: 'Database Optimization', description: 'Compound indexing, query profiling, and aggregation pipeline tuning.' },
        { title: 'Rate Limiting & Security', description: 'DDoS protection, JWT verification, and strict input sanitization.' },
        { title: 'Cloud Media Delivery', description: 'High-speed Cloudinary transformations and CDN edge delivery.' }
      ],
      deliverables: ['REST API Microservice', 'OpenAPI Specifications', 'Database Optimization Reports', 'Cloud Deployment Config'],
      techStack: ['Node.js', 'Express', 'TypeScript', 'MongoDB', 'Cloudinary', 'Redis'],
      processSteps: [
        { step: 1, title: 'Schema & API Specification', description: 'Designing OpenAPI routes and database access models.' },
        { step: 2, title: 'Implementation & Caching', description: 'Writing business logic with multi-tier Redis caching.' },
        { step: 3, title: 'Stress & Concurrency Testing', description: 'Benchmarking latency under heavy synthetic loads.' },
        { step: 4, title: 'Cloud Integration', description: 'Deploying with automated CI/CD and telemetry monitoring.' }
      ],
      pricingModel: 'fixed_starting',
      startingPrice: 2500,
      currency: 'USD',
      faqs: [
        { question: 'Do you provide API documentation?', answer: 'Yes, full Swagger/OpenAPI documentation is provided with interactive query testing.' }
      ],
      displayOrder: 4,
      active: true,
      featured: false
    }
  ]);

  // 5. Update Case Studies to Feature Noman's Real Architectures
  await CaseStudy.deleteMany({});
  await CaseStudy.insertMany([
    {
      title: 'ZeoAtlas — Hybrid-Intelligence AI Workspace',
      slug: 'zeoatlas-hybrid-intelligence-ai-workspace',
      clientName: 'Zemotify AI Systems',
      industry: 'Artificial Intelligence & Conversational Workspaces',
      duration: 'Ongoing Architecture',
      heroImage: {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        altText: 'ZeoAtlas AI Workspace architecture visualization'
      },
      overview: 'ZeoAtlas is an autonomous conversational AI platform featuring real-time web search grounding, sub-5ms local ML intent classification, in-browser code sandboxing, and real-time streaming inference.',
      challenge: 'Executing Python machine learning scripts per chat message introduced cold-start overhead, and high-frequency SSE streaming caused layout thrashing across React interfaces.',
      strategy: 'Noman engineered an optimized streaming pipeline with Zustand reactive state management, offloaded classification to a sub-millisecond local engine, and stabilized PWA caching.',
      architectureDetails: 'React frontend connected via Server-Sent Events (SSE) to an Express.js backend with MongoDB, Cloudinary media optimization, and Python ML classification pipelines.',
      results: [
        { metric: 'Sub-5ms', label: 'Local ML Classification Speed' },
        { metric: '20+ Chunks/s', label: 'Zero-Jank SSE Streaming Rate' },
        { metric: '100%', label: 'PWA Cache Reliability' }
      ],
      deliverables: ['Streaming Conversational Interface', 'Local ML Classification Engine', 'Cloudinary Asset Integration'],
      techStack: ['React', 'Express.js', 'MongoDB', 'Cloudinary', 'Tailwind CSS', 'Zustand', 'Python ML'],
      displayOrder: 1,
      featured: true,
      published: true
    },
    {
      title: 'Zashas — Modern E-Commerce Storefront',
      slug: 'zashas-modern-ecommerce-storefront',
      clientName: 'Zashas Collections',
      industry: 'Fashion & Direct-to-Consumer E-Commerce',
      duration: '6 Months',
      heroImage: {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        altText: 'Zashas e-commerce storefront'
      },
      overview: 'Zashas is a dynamic Next.js e-commerce storefront engineered for optimal high-resolution product imagery delivery, secure session management, and responsive 60fps shopping interactions.',
      challenge: 'Rendering high-resolution product imagery at scale without compromising page load speeds or core web vitals, while maintaining smooth transitions across complex product catalogues.',
      strategy: 'Noman implemented automated image optimization pipelines, server-side caching, and frictionless user authentication to deliver an ultra-fast checkout flow.',
      architectureDetails: 'Next.js 14 App Router, React 19, Node.js, Express, MongoDB, and Tailwind CSS with custom responsive layout primitives.',
      results: [
        { metric: '98+', label: 'Lighthouse Performance Score' },
        { metric: '60 FPS', label: 'Fluid Animation Transitions' },
        { metric: '2.8x', label: 'Faster Product Load Speeds' }
      ],
      deliverables: ['Next.js E-Commerce Storefront', 'Product Catalog API', 'Session & Authentication System'],
      techStack: ['Next.js', 'React 19', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      displayOrder: 2,
      featured: true,
      published: true
    },
    {
      title: 'Synthetix AI: Real-Time Multimodal Document Ingestion Pipeline',
      slug: 'synthetix-ai-document-pipeline',
      clientName: 'Synthetix Systems Inc.',
      industry: 'Enterprise LegalTech',
      duration: '7 Weeks',
      heroImage: {
        url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        altText: 'Synthetix Systems architecture visualization'
      },
      overview: 'Synthetix needed an automated engine to ingest 50,000+ complex corporate contracts monthly, extract legal clauses, and enable instant semantic search across millions of vector chunks.',
      challenge: 'Existing OCR pipelines took upwards of 45 seconds per document with high error rates on tabular data, leading to severe pipeline backpressure.',
      strategy: 'Engineered a distributed worker queue utilizing asynchronous Redis streams, hybrid vector indexing, and parallel embedding batching.',
      architectureDetails: 'Next.js 14 frontend dashboard connected via WebSocket to an Express/TypeScript worker cluster with Qdrant vector storage and Redis BullMQ queues.',
      results: [
        { metric: '91%', label: 'Reduction in Processing Latency' },
        { metric: '1.4M', label: 'Indexed Legal Embeddings' },
        { metric: '99.8%', label: 'Retrieval Accuracy' }
      ],
      deliverables: ['Custom RAG Microservice', 'Worker Queue Cluster', 'Real-Time Monitoring Dashboard'],
      techStack: ['Next.js', 'TypeScript', 'Node.js', 'Redis', 'Qdrant', 'Tailwind CSS'],
      displayOrder: 3,
      featured: true,
      published: true
    }
  ]);

  console.log('✅ Noman Nawaz profile, services, Fiverr gigs, case studies, and knowledge documents successfully synced into MongoDB Atlas!');
};

// Execute if run directly
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await syncNomanProfile();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('Sync error:', err);
      process.exit(1);
    }
  })();
}
