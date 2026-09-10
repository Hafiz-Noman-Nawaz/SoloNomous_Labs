import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import {
  Category,
  Service,
  KnowledgeDocument,
  SiteSettings,
  CaseStudy
} from '../models';

export const seedKnowledgeIntelligence = async () => {
  console.log('🚀 Starting Knowledge Base Expansion & Business Intelligence Seeding...');
  const shouldManageConnection = mongoose.connection.readyState !== 1;
  if (shouldManageConnection) {
    await connectDB();
  }

  // 1. Create the 4 Official Categories
  console.log('📦 Updating Categories to the 4 Official Groups...');
  const categoryDefs = [
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

  for (const cat of categoryDefs) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { name: cat.name, slug: cat.slug, description: cat.description },
      { upsert: true, new: true }
    );
  }

  // 2. Seed/Synchronize the 14 Official Services
  console.log('⚙️ Synchronizing 14 Official Services...');
  const officialServices = [
    {
      title: 'Business Website Development',
      slug: 'business-website-development',
      category: 'Web & Product',
      startingPrice: 250,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Starter & Business',
      icon: 'Layout',
      summary: 'Professional responsive websites for businesses that need a strong online presence, clear presentation of their services, and an effective way to convert visitors into customers.',
      problemStatement: 'Many businesses operate with outdated, sluggish websites or lack an online presence entirely, costing them credibility and customer conversions.',
      solutionStatement: 'We engineer high-performance, responsive business websites optimized for search engines, mobile devices, and conversion funnels.',
      features: [
        { title: 'Responsive Modern UI', description: 'Fluid design adapting seamlessly across desktop, tablet, and mobile screens.' },
        { title: 'SEO & Speed Optimized', description: 'Core Web Vitals compliance, metadata optimization, and sub-second load times.' },
        { title: 'Conversion Funnels', description: 'Engineered lead capture forms and strategic call-to-action touchpoints.' }
      ],
      deliverables: [
        'Responsive website',
        'Modern UI implementation',
        'Contact forms',
        'SEO-ready structure',
        'Performance optimization',
        'Deployment'
      ],
      techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      processSteps: [
        { step: 1, title: 'Discovery & Wireframing', description: 'Understand your brand, audience, and content requirements.' },
        { step: 2, title: 'High-Fidelity Engineering', description: 'Implement interactive React components with modern CSS styling.' },
        { step: 3, title: 'SEO & Performance Audit', description: 'Run Lighthouse audits and configure Google Search Console tags.' },
        { step: 4, title: 'Production Cutover', description: 'Deploy to fast global CDN with custom domain setup.' }
      ],
      displayOrder: 1,
      active: true,
      featured: true
    },
    {
      title: 'Full-Stack Web Application Development',
      slug: 'full-stack-web-application-development',
      category: 'Web & Product',
      startingPrice: 500,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Core Flagship',
      icon: 'Layers',
      summary: 'Custom web applications with frontend, backend, database, authentication and business functionality built around the client\'s requirements.',
      problemStatement: 'Off-the-shelf software tools often fail to support specialized business workflows, requiring dedicated web software.',
      solutionStatement: 'We build custom, end-to-end full-stack web applications with robust backends, secure authentication, and relational/document databases.',
      features: [
        { title: 'Full-Stack Architecture', description: 'Cohesive React/Next.js frontend tightly coupled to Express/Node.js APIs.' },
        { title: 'User Roles & Auth', description: 'Secure JWT/Clerk authentication with granular role-based access control.' },
        { title: 'Scalable Database Modeling', description: 'High-performance schema design with MongoDB or PostgreSQL.' }
      ],
      deliverables: [
        'Frontend application',
        'REST API',
        'Database integration',
        'Authentication',
        'Admin functionality',
        'Deployment',
        'Source code'
      ],
      techStack: ['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'TypeScript'],
      processSteps: [
        { step: 1, title: 'System Architecture', description: 'Model database entities and define REST API endpoints.' },
        { step: 2, title: 'Backend & Database Build', description: 'Construct controllers, validation schemas, and database indexes.' },
        { step: 3, title: 'Frontend Integration', description: 'Build interactive user dashboards and test API integrations.' },
        { step: 4, title: 'Production Launch', description: 'Deploy server environments with SSL and monitoring.' }
      ],
      displayOrder: 2,
      active: true,
      featured: true
    },
    {
      title: 'SaaS MVP Development',
      slug: 'saas-mvp-development',
      category: 'Web & Product',
      startingPrice: 1000,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Startup Accelerator',
      icon: 'Rocket',
      summary: 'Turn a software idea into a functional SaaS MVP containing the essential features needed to validate the product and begin acquiring users.',
      problemStatement: 'Founders frequently spend months over-engineering non-essential features, burning capital before validating their product with real users.',
      solutionStatement: 'We architect and launch focused SaaS MVPs in rapid 3-6 week cycles with user onboarding, recurring payments, and core functionality.',
      features: [
        { title: 'Rapid Market Validation', description: 'Laser-focused on core value features that demonstrate market fit.' },
        { title: 'Turnkey Auth & Dashboards', description: 'Pre-configured user signup, onboarding flows, and analytical panels.' },
        { title: 'Clean Extensible Codebase', description: 'Type-safe architecture ready for continuous feature iterations.' }
      ],
      deliverables: [
        'Product architecture',
        'Responsive UI',
        'Authentication',
        'Database',
        'Core features',
        'User dashboard',
        'Admin panel',
        'Deployment'
      ],
      techStack: ['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Clerk', 'TypeScript'],
      processSteps: [
        { step: 1, title: 'MVP Scoping', description: 'Trim features down to the absolute core value proposition.' },
        { step: 2, title: 'Sprint Development', description: 'Execute rapid 2-week implementation sprints with live preview URLs.' },
        { step: 3, title: 'Beta Testing', description: 'Verify user flows, permissions, and database consistency.' },
        { step: 4, title: 'Launch & Handoff', description: 'Deploy live product with documentation and source code repository.' }
      ],
      displayOrder: 3,
      active: true,
      featured: true
    },
    {
      title: 'E-Commerce Development',
      slug: 'e-commerce-development',
      category: 'Web & Product',
      startingPrice: 500,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Online Retail',
      icon: 'ShoppingBag',
      summary: 'Custom online stores for businesses that need product catalogs, customer flows, order functionality and an administration system.',
      problemStatement: 'Generic store builders impose heavy transaction fees, sluggish page loads, and rigid templates that limit custom buying experiences.',
      solutionStatement: 'We create custom, high-speed e-commerce stores with personalized product catalogs, cart workflows, order tracking, and administrative controls.',
      features: [
        { title: 'High-Converting Catalog', description: 'Lightning-fast product search, category filtering, and rich gallery views.' },
        { title: 'Cart & Checkout Experience', description: 'Optimized checkout funnels designed to minimize cart abandonment.' },
        { title: 'Order & Inventory Portal', description: 'Admin console to update inventory, view order history, and handle statuses.' }
      ],
      deliverables: [
        'Product catalog',
        'Product pages',
        'Shopping cart',
        'Checkout flow',
        'Authentication',
        'Order management',
        'Admin dashboard',
        'Responsive design'
      ],
      techStack: ['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Clerk', 'Cloudinary', 'TypeScript'],
      processSteps: [
        { step: 1, title: 'Store UX & Data Architecture', description: 'Define product variations, taxonomy, and checkout logic.' },
        { step: 2, title: 'Frontend Storefront', description: 'Develop responsive product listings, cart slide-overs, and detail views.' },
        { step: 3, title: 'Admin & Order Processing', description: 'Build administrative inventory management and order dashboards.' },
        { step: 4, title: 'Security & Go-Live', description: 'Test SSL transactions, media CDN pipelines, and publish store.' }
      ],
      displayOrder: 4,
      active: true,
      featured: true
    },
    {
      title: 'Custom CMS & Admin Dashboard Development',
      slug: 'custom-cms-admin-dashboard-development',
      category: 'Web & Product',
      startingPrice: 350,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Business Operations',
      icon: 'Sliders',
      summary: 'Custom management systems that allow businesses to manage website content, products, users, data and other business operations without depending on a developer for every update.',
      problemStatement: 'Non-technical business teams lose time and money relying on developers for basic text updates, image swaps, or record lookups.',
      solutionStatement: 'We engineer intuitive, role-protected admin consoles that empower teams to manage all their operational content and data autonomously.',
      features: [
        { title: 'Autonomous Content Controls', description: 'Rich text editing, asset uploads, and draft/publish workflows.' },
        { title: 'Role-Based Permissions', description: 'Separate access tiers for administrators, editors, and support staff.' },
        { title: 'Data Filtering & Exports', description: 'Instant search, multi-parameter sorting, and CSV data extraction.' }
      ],
      deliverables: [
        'Admin dashboard',
        'CRUD systems',
        'Authentication',
        'Role-based access',
        'Content management',
        'Search and filtering',
        'Database integration'
      ],
      techStack: ['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Clerk', 'TypeScript'],
      processSteps: [
        { step: 1, title: 'Schema & Workflow Audit', description: 'Identify every entity your team needs to edit and query.' },
        { step: 2, title: 'Dashboard Interface Build', description: 'Build responsive admin tables, modals, and rich editing views.' },
        { step: 3, title: 'Permissions & Security', description: 'Enforce route protection and action logging.' },
        { step: 4, title: 'Deployment & Training', description: 'Launch portal with operational documentation.' }
      ],
      displayOrder: 5,
      active: true,
      featured: false
    },
    {
      title: 'AI Chatbot Development',
      slug: 'ai-chatbot-development',
      category: 'AI & Machine Learning',
      startingPrice: 400,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Conversational AI',
      icon: 'Bot',
      summary: 'AI-powered chatbots that can answer customer questions, explain services, assist website visitors and provide an intelligent conversational experience.',
      problemStatement: 'Static FAQ pages are rarely read, and 24/7 human support staffing is cost-prohibitive for growing companies.',
      solutionStatement: 'We build responsive AI chatbots that engage visitors, explain company offerings in natural language, and capture warm customer leads.',
      features: [
        { title: 'Natural Business Dialogues', description: 'Answers customer inquiries politely, accurately, and without robotic rigidity.' },
        { title: 'Lead & Contact Handoff', description: 'Collects visitor contact info and project requirements automatically.' },
        { title: 'Real-Time Streaming UI', description: 'Low-latency conversational interface with suggested starter prompts.' }
      ],
      deliverables: [
        'Chat interface',
        'AI integration',
        'Conversation handling',
        'Suggested questions',
        'Lead capture',
        'Human handoff',
        'Deployment'
      ],
      techStack: ['Next.js', 'React', 'Node.js', 'Express.js', 'TypeScript', 'LLM APIs'],
      processSteps: [
        { step: 1, title: 'Knowledge & Persona Mapping', description: 'Define the bot tone of voice, boundaries, and primary business answers.' },
        { step: 2, title: 'Interface & API Integration', description: 'Build responsive chat widgets with streaming SSE endpoints.' },
        { step: 3, title: 'Boundary & Intent Testing', description: 'Benchmark responses across pricing inquiries, leads, and company queries.' },
        { step: 4, title: 'Website Embedding', description: 'Integrate directly into your site with analytics and lead logging.' }
      ],
      displayOrder: 6,
      active: true,
      featured: true
    },
    {
      title: 'RAG & Knowledge-Based AI Systems',
      slug: 'rag-knowledge-based-ai-systems',
      category: 'AI & Machine Learning',
      startingPrice: 750,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Deep Intelligence',
      icon: 'Cpu',
      summary: 'AI systems that can retrieve information from company documents, websites and knowledge bases so that the AI can provide more relevant and grounded answers.',
      problemStatement: 'Standard AI models hallucinate or know nothing about your company\'s proprietary PDFs, contracts, manuals, and internal documentation.',
      solutionStatement: 'We architect enterprise RAG pipelines that index your documents into vector databases, retrieving exact verified facts before generating answers.',
      features: [
        { title: 'Zero-Hallucination Grounding', description: 'Responses cite verifiable excerpts directly from your documents.' },
        { title: 'Automated Document Ingestion', description: 'Parse PDFs, DOCX, web pages, and markdown files into semantic vectors.' },
        { title: 'Semantic Vector Search', description: 'Retrieve concepts based on underlying meaning rather than strict keyword match.' }
      ],
      deliverables: [
        'Knowledge base',
        'Document ingestion',
        'Text processing',
        'Embeddings',
        'Vector search',
        'Retrieval pipeline',
        'AI responses',
        'Source references'
      ],
      techStack: ['Python', 'Node.js', 'Express.js', 'MongoDB', 'Vector Database', 'LLM APIs', 'Embeddings'],
      processSteps: [
        { step: 1, title: 'Document Ingestion & Chunking', description: 'Clean, format, and partition enterprise documentation.' },
        { step: 2, title: 'Embedding Generation', description: 'Generate high-dimensional vector embeddings and store in vector indexes.' },
        { step: 3, title: 'RAG Retrieval Pipeline', description: 'Build similarity search queries with prompt grounding and citation tags.' },
        { step: 4, title: 'Production Integration', description: 'Expose RAG endpoint via secure API or interactive company portal.' }
      ],
      displayOrder: 7,
      active: true,
      featured: true
    },
    {
      title: 'AI Integration & Automation',
      slug: 'ai-integration-automation',
      category: 'AI & Machine Learning',
      startingPrice: 300,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Workflow Automation',
      icon: 'Zap',
      summary: 'Integrate AI into existing websites and business workflows to automate repetitive tasks, improve customer experiences and make existing software more intelligent.',
      problemStatement: 'Teams spend hundreds of hours manually categorizing emails, summarizing customer tickets, or generating repetitive business content.',
      solutionStatement: 'We embed intelligent AI workflows into your existing software stack, automating data classification, summarization, and notifications.',
      features: [
        { title: 'Frictionless API Hooks', description: 'Integrate into your current codebase without requiring full architecture rewrites.' },
        { title: 'Automated Content Processing', description: 'Auto-generate summaries, analyze sentiment, and categorize inbound data.' },
        { title: 'Defensive Error Handling', description: 'Fallback logic that gracefully handles API timeouts and token limits.' }
      ],
      deliverables: [
        'AI integration',
        'API integration',
        'Workflow automation',
        'Data processing',
        'Automated responses',
        'Error handling',
        'Deployment'
      ],
      techStack: ['Node.js', 'Express.js', 'Next.js', 'React', 'TypeScript', 'REST APIs', 'LLM APIs'],
      processSteps: [
        { step: 1, title: 'Process Bottleneck Audit', description: 'Identify repetitive manual tasks suitable for AI automation.' },
        { step: 2, title: 'API Connection Setup', description: 'Wire secure LLM keys, rate limiting, and prompt templates.' },
        { step: 3, title: 'Pipeline Testing', description: 'Simulate high-volume requests with fallback and error mitigation.' },
        { step: 4, title: 'Operational Handover', description: 'Deploy automated worker functions and verify telemetry.' }
      ],
      displayOrder: 8,
      active: true,
      featured: false
    },
    {
      title: 'Machine Learning Solutions',
      slug: 'machine-learning-solutions',
      category: 'AI & Machine Learning',
      startingPrice: 600,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Data Science',
      icon: 'Activity',
      summary: 'Practical machine-learning solutions for businesses that need predictions, classifications, recommendations or data-driven decision support.',
      problemStatement: 'Businesses sit on valuable historical data without the mathematical models needed to extract actionable predictions.',
      solutionStatement: 'We clean your data, engineer predictive features, and train validated machine-learning models to solve targeted business problems.',
      features: [
        { title: 'Exploratory Data Analysis', description: 'Identify correlations, anomalies, and structural patterns in your datasets.' },
        { title: 'Model Training & Validation', description: 'Train scikit-learn models with cross-validation to prevent overfitting.' },
        { title: 'Production Prediction Pipeline', description: 'Package trained models into fast callable inference scripts.' }
      ],
      deliverables: [
        'Data preprocessing',
        'Exploratory analysis',
        'Feature engineering',
        'Model development',
        'Model evaluation',
        'Prediction pipeline',
        'Documentation'
      ],
      techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Jupyter'],
      processSteps: [
        { step: 1, title: 'Data Cleaning & Preprocessing', description: 'Handle missing values, encode categoricals, and normalize distributions.' },
        { step: 2, title: 'Feature Engineering', description: 'Extract mathematical indicators correlated with business outcomes.' },
        { step: 3, title: 'Model Selection & Tuning', description: 'Train regression, classification, or clustering algorithms.' },
        { step: 4, title: 'Evaluation & Export', description: 'Generate performance metrics (AUC, F1, MSE) and export inference models.' }
      ],
      displayOrder: 9,
      active: true,
      featured: false
    },
    {
      title: 'Recommendation & Prediction Systems',
      slug: 'recommendation-prediction-systems',
      category: 'AI & Machine Learning',
      startingPrice: 750,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Predictive Intelligence',
      icon: 'TrendingUp',
      summary: 'Machine-learning systems that can help businesses recommend products, forecast demand, predict outcomes or identify useful patterns in their data.',
      problemStatement: 'Standard static recommendation engines miss user preferences, reducing average order values and inventory turnover.',
      solutionStatement: 'We engineer custom recommendation algorithms and demand forecasting pipelines that increase conversions and optimize stock levels.',
      features: [
        { title: 'Personalized Recommendations', description: 'Collaborative filtering and content-based scoring tailored to user history.' },
        { title: 'Demand & Trend Forecasting', description: 'Predict upcoming sales trends using historical chronological patterns.' },
        { title: 'Low-Latency API Endpoints', description: 'Fast REST API endpoints returning ranked recommendations under 50ms.' }
      ],
      deliverables: [
        'Data analysis',
        'Feature engineering',
        'ML model',
        'Recommendation or forecasting pipeline',
        'Model evaluation',
        'API integration',
        'Documentation'
      ],
      techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'PostgreSQL', 'MongoDB', 'FastAPI or Node.js'],
      processSteps: [
        { step: 1, title: 'Historical Interaction Ingestion', description: 'Structure purchases, clicks, or chronological logs.' },
        { step: 2, title: 'Algorithm Architecture', description: 'Implement matrix factorization or ensemble forecasting models.' },
        { step: 3, title: 'API Microservice', description: 'Wrap inference pipeline in lightweight FastAPI/Node.js endpoints.' },
        { step: 4, title: 'A/B Benchmarking', description: 'Deploy and evaluate conversion uplift against baseline metrics.' }
      ],
      displayOrder: 10,
      active: true,
      featured: false
    },
    {
      title: 'Backend & REST API Development',
      slug: 'backend-rest-api-development',
      category: 'Backend & Integration',
      startingPrice: 300,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Backend Architecture',
      icon: 'Server',
      summary: 'Reliable backend systems and APIs for websites, SaaS products, dashboards and integrations.',
      problemStatement: 'Fragile backends with unvalidated endpoints cause data corruption, security vulnerabilities, and frequent server crashes.',
      solutionStatement: 'We engineer structured, type-safe REST APIs with strict request validation, JWT security, connection pooling, and thorough error handling.',
      features: [
        { title: 'Type-Safe REST APIs', description: 'Express and Node.js endpoints validated against Zod and TypeScript schemas.' },
        { title: 'Secure Authentication', description: 'JWT tokens, bcrypt password hashing, and session refresh rotation.' },
        { title: 'Optimized Database Queries', description: 'Indexed MongoDB/PostgreSQL schemas with zero N+1 query bottlenecks.' }
      ],
      deliverables: [
        'REST API',
        'Database integration',
        'Authentication',
        'CRUD operations',
        'Validation',
        'Error handling',
        'API documentation',
        'Deployment'
      ],
      techStack: ['Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'JWT', 'Clerk'],
      processSteps: [
        { step: 1, title: 'Schema & Endpoint Spec', description: 'Define HTTP methods, payloads, and response structures.' },
        { step: 2, title: 'Controller & Service Logic', description: 'Implement modular business logic with database transactions.' },
        { step: 3, title: 'Validation & Security Hardening', description: 'Add rate-limiting, CORS policies, and schema validators.' },
        { step: 4, title: 'Deployment & Docs', description: 'Generate API reference documentation and deploy to cloud servers.' }
      ],
      displayOrder: 11,
      active: true,
      featured: false
    },
    {
      title: 'Third-Party API Integration',
      slug: 'third-party-api-integration',
      category: 'Backend & Integration',
      startingPrice: 200,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Systems Connectivity',
      icon: 'Share2',
      summary: 'Connect websites and applications with external platforms and services to create automated workflows and additional functionality.',
      problemStatement: 'Siloed business software requires manual double-entry of data across CRMs, payment processors, and shipping providers.',
      solutionStatement: 'We integrate third-party APIs via verified webhooks and secure synchronization workers, automating your cross-platform workflows.',
      features: [
        { title: 'Reliable Webhook Listeners', description: 'Asynchronous event listeners with idempotency keys and retry queues.' },
        { title: 'Bi-Directional Data Sync', description: 'Keep customer records, inventory, and transactions mirrored across tools.' },
        { title: 'Third-Party Auth Handling', description: 'Secure OAuth2 tokens and API keys protected from client exposure.' }
      ],
      deliverables: [
        'API integration',
        'Authentication setup',
        'Data synchronization',
        'Webhooks',
        'Error handling',
        'Testing',
        'Documentation'
      ],
      techStack: ['Node.js', 'Express.js', 'Next.js', 'TypeScript', 'REST APIs', 'Webhooks'],
      processSteps: [
        { step: 1, title: 'API Specification Review', description: 'Examine external API rate limits, webhooks, and auth models.' },
        { step: 2, title: 'Webhook & Client Setup', description: 'Write secure integration adapters with signature verification.' },
        { step: 3, title: 'Payload Testing', description: 'Verify handling of failed requests, rate-limiting, and network drops.' },
        { step: 4, title: 'Production Sync', description: 'Deploy live integration with event logs and alerts.' }
      ],
      displayOrder: 12,
      active: true,
      featured: false
    },
    {
      title: 'Website Performance & Technical SEO',
      slug: 'website-performance-technical-seo',
      category: 'Optimization and support',
      startingPrice: 150,
      pricingInterval: 'one_time',
      currency: 'USD',
      pricingModel: 'fixed_starting',
      badge: 'Speed & Rankings',
      icon: 'Gauge',
      summary: 'Improve website speed, technical SEO, search-engine accessibility and user experience without necessarily rebuilding the entire website.',
      problemStatement: 'Sluggish page loading tanks search engine rankings and drives visitors away before they ever see your service offerings.',
      solutionStatement: 'We perform deep technical audits and execute targeted code optimizations that improve Core Web Vitals and Google indexability.',
      features: [
        { title: 'Core Web Vitals Boost', description: 'Slash Largest Contentful Paint (LCP) and eliminate Cumulative Layout Shift (CLS).' },
        { title: 'Structured Data & Schema', description: 'Implement JSON-LD schemas so Google shows rich search snippets.' },
        { title: 'Asset & Bundle Optimization', description: 'Compress images, defer non-critical scripts, and enable modern browser caching.' }
      ],
      deliverables: [
        'Performance audit',
        'Core Web Vitals improvements',
        'Technical SEO',
        'Metadata optimization',
        'Image optimization',
        'Sitemap',
        'Structured data'
      ],
      techStack: ['Next.js', 'React', 'TypeScript', 'Google Search Console', 'Lighthouse'],
      processSteps: [
        { step: 1, title: 'Lighthouse & SEO Audit', description: 'Benchmark performance, crawl errors, and asset weight.' },
        { step: 2, title: 'Code & Asset Optimization', description: 'Minify bundles, convert images to WebP/AVIF, and defer scripts.' },
        { step: 3, title: 'Search Engine Signals', description: 'Configure dynamic sitemaps, robots.txt, and Open Graph tags.' },
        { step: 4, title: 'Verification', description: 'Re-test on mobile 4G networks and review Google Search Console crawl status.' }
      ],
      displayOrder: 13,
      active: true,
      featured: false
    },
    {
      title: 'Website Maintenance & Continuous Development',
      slug: 'website-maintenance-continuous-development',
      category: 'Optimization and support',
      startingPrice: 100,
      pricingInterval: '/month',
      currency: 'USD',
      pricingModel: 'retainer',
      badge: 'Ongoing Support',
      icon: 'Wrench',
      summary: 'Ongoing technical support for businesses that need their website or application maintained, improved, updated and monitored.',
      problemStatement: 'Unmaintained websites accumulate security vulnerabilities, broken dependencies, outdated content, and unnoticed downtime.',
      solutionStatement: 'We provide ongoing monthly engineering coverage, applying security patches, updating content, fixing bugs, and monitoring uptime.',
      features: [
        { title: 'Proactive Security Patches', description: 'Keep npm packages, dependencies, and environment keys up to date.' },
        { title: 'Fast Turnaround Bug Fixes', description: 'Direct developer access to fix UI glitches, form errors, or broken links.' },
        { title: 'Continuous Incremental Enhancements', description: 'Add new pages, update content, and refine styles as your business grows.' }
      ],
      deliverables: [
        'Bug fixes',
        'Security updates',
        'Content updates',
        'Performance improvements',
        'Feature updates',
        'Technical support',
        'Monitoring'
      ],
      techStack: ['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL'],
      processSteps: [
        { step: 1, title: 'Initial Health Check', description: 'Review site dependencies, security advisories, and hosting setup.' },
        { step: 2, title: 'Monitoring Setup', description: 'Configure automated uptime monitors and error telemetry alerts.' },
        { step: 3, title: 'Monthly Routine Upgrades', description: 'Execute security patches, content changes, and performance checks.' },
        { step: 4, title: 'Ongoing Support', description: 'Priority turnaround for any immediate fixes or feature additions.' }
      ],
      displayOrder: 14,
      active: true,
      featured: false
    }
  ];

  // Remove existing services to eliminate old duplicate names or wrong starting prices
  await Service.deleteMany({});
  await Service.insertMany(officialServices);
  console.log(`✅ Seeded ${officialServices.length} official services with accurate starting prices and intervals.`);

  // 3. Clear and Rebuild Structured Knowledge Documents (Across All 7 Groups)
  console.log('📚 Rebuilding Knowledge Base into 7 Structured Groups...');
  await KnowledgeDocument.deleteMany({});

  const knowledgeDocuments = [
    // ==========================================
    // GROUP 1: COMPANY
    // ==========================================
    {
      title: 'Company Overview & Mission',
      category: 'company',
      content: `SoloNomous Labs is a professional Software & AI Product Studio founded and operated by Noman Nawaz (Nouman Nawaz). The studio is dedicated to building practical, reliable websites, web applications, SaaS products, e-commerce systems, AI solutions, and machine-learning-powered software for businesses, startups, and entrepreneurs. Our core mission is to solve real business and product problems with modern, robust software that generates tangible commercial value.`,
      chunkSummary: 'SoloNomous Labs is a professional Software & AI Product Studio founded by Noman Nawaz, building practical websites, web apps, SaaS MVPs, e-commerce systems, and AI/ML solutions for businesses.',
      tags: ['company', 'overview', 'mission', 'solonomous labs', 'identity', 'noman nawaz'],
      sourceUrl: '/about',
      version: 2,
      active: true
    },
    {
      title: 'Studio Positioning & What SoloNomous Labs Is Not',
      category: 'company',
      content: `SoloNomous Labs is positioned strictly as a professional software and product engineering studio. It is NOT:
- A university project or assignment service
- A homework or exam-solving service
- A coding academy or tutoring school
- A cheap website template reseller
- A generic digital marketing or social media agency

We build real-world software designed to solve operational business challenges, launch scalable startups, and convert visitors into paying clients.`,
      chunkSummary: 'SoloNomous Labs is an elite software & product studio, not an assignment service, coding academy, cheap template reseller, or marketing agency.',
      tags: ['positioning', 'identity', 'professional', 'real-world', 'scope'],
      sourceUrl: '/about',
      version: 2,
      active: true
    },
    {
      title: 'Target Clients & Who We Serve',
      category: 'company',
      content: `SoloNomous Labs serves:
1. Small-to-Medium Businesses (SMBs): Needing high-converting business websites, custom booking systems, or automated management portals.
2. Startup Founders & Entrepreneurs: Needing to take software ideas from concept to a launched SaaS MVP or AI product.
3. Retail & E-Commerce Brands: Requiring custom, high-speed online storefronts and order management pipelines without platform lock-in.
4. Established Organizations: Seeking to automate repetitive internal operations or integrate custom AI/RAG search into their document libraries.`,
      chunkSummary: 'SoloNomous Labs serves SMBs, startup founders, e-commerce brands, and businesses seeking custom web applications, SaaS MVPs, and AI automation.',
      tags: ['target clients', 'who we serve', 'startups', 'businesses', 'founders'],
      sourceUrl: '/about',
      version: 2,
      active: true
    },
    {
      title: 'Development Philosophy & Approach',
      category: 'company',
      content: `Our development philosophy is grounded in three principles:
1. Business Clarity First: We translate complex technology into simple, clear business solutions. We explain what software does for your business, not just what framework it uses.
2. Production Reliability: We build type-safe, modular code with clean architectures (Next.js, React, Node.js, MongoDB, PostgreSQL) that can scale as your business grows.
3. 100% Intellectual Property Ownership: Clients receive complete source code, deployment setups, and ownership with zero artificial vendor lock-in.`,
      chunkSummary: 'SoloNomous Labs emphasizes business clarity, production reliability, type-safe clean code, and 100% client IP ownership.',
      tags: ['philosophy', 'approach', 'quality', 'clean code', 'ownership'],
      sourceUrl: '/about',
      version: 2,
      active: true
    },
    {
      title: 'Official Contact & Communication Channels',
      category: 'company',
      content: `Visitors and prospective clients can reach SoloNomous Labs and founder Noman Nawaz directly through:
- Email: nawaznoman7766@gmail.com (or contact@solonomouslabs.com)
- WhatsApp / Phone: +92 315 6251281
- Personal Portfolio: https://www.nouman-nawaz.dev/
- Verified Fiverr Profile: https://www.fiverr.com/nomannawaz67
- Start a Project Form: Available directly on the website at /contact

We respond promptly (typically within 2-4 business hours) to evaluate project scopes and schedule consultations.`,
      chunkSummary: 'Contact SoloNomous Labs via nawaznoman7766@gmail.com, WhatsApp +92 315 6251281, portfolio https://www.nouman-nawaz.dev/, or Fiverr profile https://www.fiverr.com/nomannawaz67.',
      tags: ['contact', 'email', 'phone', 'whatsapp', 'hire', 'portfolio', 'fiverr'],
      sourceUrl: '/contact',
      version: 2,
      active: true
    },

    // ==========================================
    // GROUP 2: SERVICES (14 OFFICIAL SERVICES)
    // ==========================================
    {
      title: 'Service: Business Website Development',
      category: 'services',
      content: `Business Website Development:
Category: Web & Product
Starting Price: $250 USD
Pricing Note: Starting from $250 USD. Final price depends on pages, functionality, integrations, content requirements, and design complexity.
Description: Professional responsive websites for businesses that need a strong online presence, clear presentation of their services, and an effective way to convert visitors into customers.
Typical Deliverables: Responsive website, Modern UI implementation, Contact forms, SEO-ready structure, Performance optimization, Deployment.
Technology: Next.js, React, TypeScript, Tailwind CSS, Framer Motion.`,
      chunkSummary: 'Business Website Development starts from $250 USD. Includes responsive Next.js/React UI, contact forms, SEO structure, speed optimization, and deployment.',
      tags: ['business website', 'services', 'pricing', 'web development', 'nextjs', 'react'],
      sourceUrl: '/services/business-website-development',
      version: 2,
      active: true
    },
    {
      title: 'Service: Full-Stack Web Application Development',
      category: 'services',
      content: `Full-Stack Web Application Development:
Category: Web & Product
Starting Price: $500 USD
Pricing Note: Starting from $500 USD. Final price depends on feature complexity, database schemas, custom workflows, and integrations.
Description: Custom web applications with frontend, backend, database, authentication, and business functionality built around the client\'s requirements.
Typical Deliverables: Frontend application, REST API, Database integration, Authentication, Admin functionality, Deployment, Source code.
Technology: Next.js, React, Node.js, Express.js, MongoDB, PostgreSQL, TypeScript.`,
      chunkSummary: 'Full-Stack Web Application Development starts from $500 USD. Includes frontend, REST API backend, MongoDB/PostgreSQL database, authentication, admin dashboard, and full source code.',
      tags: ['full-stack', 'web app', 'services', 'pricing', 'mern', 'nodejs', 'mongodb'],
      sourceUrl: '/services/full-stack-web-application-development',
      version: 2,
      active: true
    },
    {
      title: 'Service: SaaS MVP Development',
      category: 'services',
      content: `SaaS MVP Development:
Category: Web & Product
Starting Price: $1,000 USD
Pricing Note: Starting from $1,000 USD. Final price depends on the scope of core features, multi-tenancy needs, billing setup, and custom UI.
Description: Turn a software idea into a functional SaaS MVP containing the essential features needed to validate the product and begin acquiring users.
Typical Deliverables: Product architecture, Responsive UI, Authentication, Database, Core features, User dashboard, Admin panel, Deployment.
Technology: Next.js, React, Node.js, Express.js, MongoDB, PostgreSQL, Clerk, TypeScript.`,
      chunkSummary: 'SaaS MVP Development starts from $1,000 USD. Delivers complete product architecture, user dashboards, admin panel, authentication, database, and deployment.',
      tags: ['saas', 'mvp', 'startup', 'services', 'pricing', 'clerk', 'software'],
      sourceUrl: '/services/saas-mvp-development',
      version: 2,
      active: true
    },
    {
      title: 'Service: E-Commerce Development',
      category: 'services',
      content: `E-Commerce Development:
Category: Web & Product
Starting Price: $500 USD
Pricing Note: Starting from $500 USD. Final price depends on catalog size, payment gateways, customer authentication, and order workflows.
Description: Custom online stores for businesses that need product catalogs, customer flows, order functionality, and an administration system.
Typical Deliverables: Product catalog, Product pages, Shopping cart, Checkout flow, Authentication, Order management, Admin dashboard, Responsive design.
Technology: Next.js, React, Node.js, Express.js, MongoDB, Clerk, Cloudinary, TypeScript.`,
      chunkSummary: 'E-Commerce Development starts from $500 USD. Includes custom product catalog, shopping cart, checkout flow, customer accounts, order management, and admin console.',
      tags: ['ecommerce', 'online store', 'services', 'pricing', 'shopping cart', 'orders'],
      sourceUrl: '/services/e-commerce-development',
      version: 2,
      active: true
    },
    {
      title: 'Service: Custom CMS & Admin Dashboard Development',
      category: 'services',
      content: `Custom CMS & Admin Dashboard Development:
Category: Web & Product
Starting Price: $350 USD
Pricing Note: Starting from $350 USD. Final price depends on the number of data collections, role permissions, and custom search/export features.
Description: Custom management systems that allow businesses to manage website content, products, users, data and other business operations without depending on a developer for every update.
Typical Deliverables: Admin dashboard, CRUD systems, Authentication, Role-based access, Content management, Search and filtering, Database integration.
Technology: Next.js, React, Node.js, Express.js, MongoDB, Clerk, TypeScript.`,
      chunkSummary: 'Custom CMS & Admin Dashboards start from $350 USD. Delivers role-based administrative portals for managing content, products, and operational records without code.',
      tags: ['cms', 'admin dashboard', 'services', 'pricing', 'content management', 'crud'],
      sourceUrl: '/services/custom-cms-admin-dashboard-development',
      version: 2,
      active: true
    },
    {
      title: 'Service: AI Chatbot Development',
      category: 'services',
      startingPrice: 400,
      pricingInterval: 'one_time',
      currency: 'USD',
      content: `AI Chatbot Development:
Category: AI & Machine Learning
Starting Price: $400 USD
Pricing Note: Starting from $400 USD. Final price depends on conversation flows, lead qualification rules, streaming requirements, and CRM integrations.
Description: AI-powered chatbots that can answer customer questions, explain services, assist website visitors and provide an intelligent conversational experience.
Typical Deliverables: Chat interface, AI integration, Conversation handling, Suggested questions, Lead capture, Human handoff, Deployment.
Technology: Next.js, React, Node.js, Express.js, TypeScript, LLM APIs.`,
      chunkSummary: 'AI Chatbot Development starts from $400 USD. Provides interactive conversational chatbot with streaming responses, lead capture, suggested questions, and human handoff.',
      tags: ['ai chatbot', 'chatbot', 'services', 'pricing', 'conversational ai', 'leads'],
      sourceUrl: '/services/ai-chatbot-development',
      version: 2,
      active: true
    },
    {
      title: 'Service: RAG & Knowledge-Based AI Systems',
      category: 'services',
      startingPrice: 750,
      pricingInterval: 'one_time',
      currency: 'USD',
      content: `RAG & Knowledge-Based AI Systems:
Category: AI & Machine Learning
Starting Price: $750 USD
Pricing Note: Starting from $750 USD. Final price depends on document volume, chunking strategies, vector database selection, and retrieval latency targets.
Description: AI systems that can retrieve information from company documents, websites and knowledge bases so that the AI can provide more relevant and grounded answers.
Typical Deliverables: Knowledge base, Document ingestion, Text processing, Embeddings, Vector search, Retrieval pipeline, AI responses, Source references.
Technology: Python, Node.js, Express.js, MongoDB, Vector Database, LLM APIs, Embeddings.`,
      chunkSummary: 'RAG & Knowledge-Based AI Systems start from $750 USD. Enables AI to answer questions grounded in company documents and vector embeddings with zero hallucinations.',
      tags: ['rag', 'knowledge base', 'vector search', 'services', 'pricing', 'embeddings', 'ai'],
      sourceUrl: '/services/rag-knowledge-based-ai-systems',
      version: 2,
      active: true
    },
    {
      title: 'Service: AI Integration & Automation',
      category: 'services',
      startingPrice: 300,
      pricingInterval: 'one_time',
      currency: 'USD',
      content: `AI Integration & Automation:
Category: AI & Machine Learning
Starting Price: $300 USD
Pricing Note: Starting from $300 USD. Final price depends on the number of automated workflows, API connectors, and processing scale.
Description: Integrate AI into existing websites and business workflows to automate repetitive tasks, improve customer experiences and make existing software more intelligent.
Typical Deliverables: AI integration, API integration, Workflow automation, Data processing, Automated responses, Error handling, Deployment.
Technology: Node.js, Express.js, Next.js, React, TypeScript, REST APIs, LLM APIs.`,
      chunkSummary: 'AI Integration & Automation starts from $300 USD. Adds smart AI capabilities (summaries, automated replies, content analysis) into existing websites and workflows.',
      tags: ['ai integration', 'automation', 'services', 'pricing', 'workflows', 'apis'],
      sourceUrl: '/services/ai-integration-automation',
      version: 2,
      active: true
    },
    {
      title: 'Service: Machine Learning Solutions',
      category: 'services',
      startingPrice: 600,
      pricingInterval: 'one_time',
      currency: 'USD',
      content: `Machine Learning Solutions:
Category: AI & Machine Learning
Starting Price: $600 USD
Pricing Note: Starting from $600 USD. Final price depends on dataset cleanliness, model exploration, feature complexity, and inference requirements.
Description: Practical machine-learning solutions for businesses that need predictions, classifications, recommendations or data-driven decision support.
Typical Deliverables: Data preprocessing, Exploratory analysis, Feature engineering, Model development, Model evaluation, Prediction pipeline, Documentation.
Technology: Python, Pandas, NumPy, Scikit-learn, Matplotlib, Jupyter.`,
      chunkSummary: 'Machine Learning Solutions start from $600 USD. Delivers custom data preprocessing, scikit-learn models, classification pipelines, and evaluation metrics.',
      tags: ['machine learning', 'ml', 'services', 'pricing', 'python', 'scikit-learn', 'predictions'],
      sourceUrl: '/services/machine-learning-solutions',
      version: 2,
      active: true
    },
    {
      title: 'Service: Recommendation & Prediction Systems',
      category: 'services',
      startingPrice: 750,
      pricingInterval: 'one_time',
      currency: 'USD',
      content: `Recommendation & Prediction Systems:
Category: AI & Machine Learning
Starting Price: $750 USD
Pricing Note: Starting from $750 USD. Final price depends on historical transaction volume, algorithm selection, and API throughput.
Description: Machine-learning systems that can help businesses recommend products, forecast demand, predict outcomes or identify useful patterns in their data.
Typical Deliverables: Data analysis, Feature engineering, ML model, Recommendation or forecasting pipeline, Model evaluation, API integration, Documentation.
Technology: Python, Pandas, NumPy, Scikit-learn, PostgreSQL, MongoDB, FastAPI or Node.js.`,
      chunkSummary: 'Recommendation & Prediction Systems start from $750 USD. Powers personalized product recommendations and demand forecasting pipelines via fast APIs.',
      tags: ['recommendation systems', 'forecasting', 'services', 'pricing', 'predictive ml'],
      sourceUrl: '/services/recommendation-prediction-systems',
      version: 2,
      active: true
    },
    {
      title: 'Service: Backend & REST API Development',
      category: 'services',
      startingPrice: 300,
      pricingInterval: 'one_time',
      currency: 'USD',
      content: `Backend & REST API Development:
Category: Backend & Integration
Starting Price: $300 USD
Pricing Note: Starting from $300 USD. Final price depends on the number of endpoints, database complexity, authentication layers, and security specifications.
Description: Reliable backend systems and APIs for websites, SaaS products, dashboards and integrations.
Typical Deliverables: REST API, Database integration, Authentication, CRUD operations, Validation, Error handling, API documentation, Deployment.
Technology: Node.js, Express.js, TypeScript, MongoDB, PostgreSQL, JWT, Clerk.`,
      chunkSummary: 'Backend & REST API Development starts from $300 USD. Includes type-safe REST endpoints, database integration, JWT/auth, input validation, and API documentation.',
      tags: ['backend', 'rest api', 'services', 'pricing', 'nodejs', 'express', 'postgresql'],
      sourceUrl: '/services/backend-rest-api-development',
      version: 2,
      active: true
    },
    {
      title: 'Service: Third-Party API Integration',
      category: 'services',
      startingPrice: 200,
      pricingInterval: 'one_time',
      currency: 'USD',
      content: `Third-Party API Integration:
Category: Backend & Integration
Starting Price: $200 USD
Pricing Note: Starting from $200 USD. Final price depends on the complexity of external platforms, webhook idempotency, and synchronization requirements.
Description: Connect websites and applications with external platforms and services to create automated workflows and additional functionality.
Typical Deliverables: API integration, Authentication setup, Data synchronization, Webhooks, Error handling, Testing, Documentation.
Technology: Node.js, Express.js, Next.js, TypeScript, REST APIs, Webhooks.`,
      chunkSummary: 'Third-Party API Integration starts from $200 USD. Connects your website with external tools via secure REST APIs and automated webhook listeners.',
      tags: ['api integration', 'webhooks', 'services', 'pricing', 'third-party'],
      sourceUrl: '/services/third-party-api-integration',
      version: 2,
      active: true
    },
    {
      title: 'Service: Website Performance & Technical SEO',
      category: 'services',
      startingPrice: 150,
      pricingInterval: 'one_time',
      currency: 'USD',
      content: `Website Performance & Technical SEO:
Category: Optimization and support
Starting Price: $150 USD
Pricing Note: Starting from $150 USD. Final price depends on website size, existing performance bottlenecks, and indexing errors.
Description: Improve website speed, technical SEO, search-engine accessibility and user experience without necessarily rebuilding the entire website.
Typical Deliverables: Performance audit, Core Web Vitals improvements, Technical SEO, Metadata optimization, Image optimization, Sitemap, Structured data.
Technology: Next.js, React, TypeScript, Google Search Console, Lighthouse.`,
      chunkSummary: 'Website Performance & Technical SEO starts from $150 USD. Speeds up slow websites, fixes Core Web Vitals, and optimizes metadata and structured data.',
      tags: ['seo', 'performance', 'speed', 'lighthouse', 'services', 'pricing'],
      sourceUrl: '/services/website-performance-technical-seo',
      version: 2,
      active: true
    },
    {
      title: 'Service: Website Maintenance & Continuous Development',
      category: 'services',
      startingPrice: 100,
      pricingInterval: '/month',
      currency: 'USD',
      content: `Website Maintenance & Continuous Development:
Category: Optimization and support
Starting Price: $100 USD/month
Pricing Note: Starting from $100 USD per month. Final price depends on the level of dedicated development hours, update frequency, and monitoring SLAs.
Description: Ongoing technical support for businesses that need their website or application maintained, improved, updated and monitored.
Typical Deliverables: Bug fixes, Security updates, Content updates, Performance improvements, Feature updates, Technical support, Monitoring.
Technology: Next.js, React, Node.js, Express.js, MongoDB, PostgreSQL.`,
      chunkSummary: 'Website Maintenance & Continuous Development starts from $100 USD/month. Covers monthly security patches, bug fixes, content updates, and uptime monitoring.',
      tags: ['maintenance', 'retainer', 'monthly', 'support', 'services', 'pricing'],
      sourceUrl: '/services/website-maintenance-continuous-development',
      version: 2,
      active: true
    },

    // ==========================================
    // GROUP 3: PRICING (STARTING PRICE RULES)
    // ==========================================
    {
      title: 'General Pricing Rules & Starting Price Policy',
      category: 'pricing',
      content: `Crucial Pricing Policy of SoloNomous Labs:
1. Every listed price is a STARTING PRICE. Never state that a project will cost an exact flat sum without reviewing requirements.
2. Official service pricing is displayed and quoted in USD. Always say "starting from $X USD".
3. Scope Variables: The final price depends on page count, specific features, custom database entities, external integrations, content preparation, and design complexity.
4. If a user asks for currency conversion (such as PKR), explain that prices are set in USD, but you can estimate based on current prevailing exchange rates (~280 PKR/USD) upon direct confirmation.`,
      chunkSummary: 'All SoloNomous Labs prices are starting prices in USD. Final prices depend on requirements, features, and integrations.',
      tags: ['pricing rules', 'starting price', 'usd', 'scope', 'policy'],
      sourceUrl: '/pricing',
      version: 2,
      active: true
    },
    {
      title: 'Pricing: Website Development & Performance',
      category: 'pricing',
      content: `Common Website Pricing Inquiries:
- "How much does a website cost?": Our business websites start from $250 USD. If you need something more advanced, such as user accounts, dashboards, databases or custom business functionality, it falls under our Full-Stack Web Application service, which starts from $500 USD.
- "How much is a simple business website?": A professional business website starts from $250 USD.
- "How much is website optimization / speed fix?": Website Performance & Technical SEO starts from $150 USD.
- "How much is monthly website maintenance?": Ongoing website maintenance starts from $100 USD per month.`,
      chunkSummary: 'Business websites start from $250 USD, full-stack web apps from $500 USD, performance optimization from $150 USD, and monthly maintenance from $100 USD/month.',
      tags: ['website cost', 'simple website', 'pricing', 'maintenance cost'],
      sourceUrl: '/pricing',
      version: 2,
      active: true
    },
    {
      title: 'Pricing: Web Applications, SaaS & E-Commerce',
      category: 'pricing',
      content: `Application & Store Pricing Inquiries:
- "How much is a full-stack website?": Full-stack web applications start from $500 USD because they include backend functionality, databases, and custom business logic.
- "How much does an online store / e-commerce cost?": Custom e-commerce websites start from $500 USD. Final price depends on catalog size, payment gateway integrations, and order management features.
- "How much does a SaaS cost?": SaaS MVP development starts from $1,000 USD, covering product architecture, authentication, core user features, dashboard, and administrative console.
- "How much does a custom admin CMS cost?": Custom CMS & Admin Dashboard Development starts from $350 USD.`,
      chunkSummary: 'Full-stack web applications start from $500 USD, custom e-commerce stores from $500 USD, SaaS MVPs from $1,000 USD, and custom admin CMS from $350 USD.',
      tags: ['full-stack cost', 'ecommerce cost', 'saas cost', 'pricing', 'cms cost'],
      sourceUrl: '/pricing',
      version: 2,
      active: true
    },
    {
      title: 'Pricing: AI & Machine Learning Solutions',
      category: 'pricing',
      content: `AI & Machine Learning Pricing Inquiries:
- "How much does an AI website cost?": If you mean a website with AI functionality, the price depends on what the AI needs to do. AI integration starts from $300 USD, while a dedicated conversational AI chatbot starts from $400 USD. More advanced RAG / knowledge-based AI systems start from $750 USD.
- "How much does an AI chatbot cost?": AI chatbot development starts from $400 USD.
- "How much does RAG development cost?": RAG & Knowledge-Based AI systems start from $750 USD because they include document parsing, vector embeddings, vector databases, and grounded retrieval pipelines.
- "How much do machine learning solutions cost?": Machine Learning Solutions start from $600 USD, while specialized Recommendation & Prediction Systems start from $750 USD.`,
      chunkSummary: 'AI integration starts from $300 USD, AI chatbots from $400 USD, RAG knowledge systems from $750 USD, ML solutions from $600 USD, and recommendation systems from $750 USD.',
      tags: ['ai cost', 'chatbot cost', 'rag cost', 'ml cost', 'pricing'],
      sourceUrl: '/pricing',
      version: 2,
      active: true
    },
    {
      title: 'Pricing: Backend & API Integrations',
      category: 'pricing',
      content: `Backend & API Integration Pricing:
- "How much does a backend / REST API cost?": Backend & REST API Development starts from $300 USD, including database setup, authentication, and CRUD endpoints.
- "How much does an API integration cost?": Third-Party API Integration starts from $200 USD for connecting external services and automated webhooks.`,
      chunkSummary: 'Backend & REST API development starts from $300 USD, and third-party API integration starts from $200 USD.',
      tags: ['backend cost', 'api cost', 'integration cost', 'pricing'],
      sourceUrl: '/pricing',
      version: 2,
      active: true
    },

    // ==========================================
    // GROUP 4: RECOMMENDATIONS & DECISION LOGIC
    // ==========================================
    {
      title: 'Service Recommendation Engine: Decision Matrix',
      category: 'recommendations',
      content: `SoloNomous Labs Decision Logic for Common Business Needs:
- IF client needs a simple company website to establish an online presence -> RECOMMEND Business Website Development (From $250 USD).
- IF client needs user login, customer dashboards, database records, custom workflows, or orders -> RECOMMEND Full-Stack Web Application Development (From $500 USD).
- IF client has a software startup idea and wants to launch an initial product to validate the market -> RECOMMEND SaaS MVP Development (From $1,000 USD).
- IF client wants to sell physical or digital products online -> RECOMMEND E-Commerce Development (From $500 USD).
- IF client already has a website but needs an easy management panel for staff -> RECOMMEND Custom CMS & Admin Dashboard Development (From $350 USD).
- IF client wants a conversational assistant on their website -> RECOMMEND AI Chatbot Development (From $400 USD).
- IF client wants AI to answer specifically from internal company documents, PDFs, or knowledge bases -> RECOMMEND RAG & Knowledge-Based AI Systems (From $750 USD).
- IF client already has software and wants to automate tasks or add smart AI features -> RECOMMEND AI Integration & Automation (From $300 USD).
- IF client has tabular or business data and needs predictive models or classification -> RECOMMEND Machine Learning Solutions (From $600 USD).
- IF client wants personalized product recommendations or demand forecasting -> RECOMMEND Recommendation & Prediction Systems (From $750 USD).
- IF client needs backend microservices, database modeling, or REST endpoints -> RECOMMEND Backend & REST API Development (From $300 USD).
- IF client wants to connect their website with an external platform or webhook -> RECOMMEND Third-Party API Integration (From $200 USD).
- IF client has an existing website that is slow, sluggish, or missing SEO -> RECOMMEND Website Performance & Technical SEO (From $150 USD).
- IF client wants ongoing bug fixes, security updates, and enhancements -> RECOMMEND Website Maintenance & Continuous Development (From $100 USD/month).`,
      chunkSummary: 'Service recommendation decision matrix mapping business requirements (store, SaaS, AI, documents, slow speed) directly to official services.',
      tags: ['recommendation', 'which service', 'decision logic', 'guidance', 'advice'],
      sourceUrl: '/services',
      version: 2,
      active: true
    },
    {
      title: 'Advisory: Non-Technical Concept Explanations',
      category: 'recommendations',
      content: `How SoloNomous Labs explains technical concepts in plain business language:
- Frontend: "The visible part of your website or app that your customers interact with."
- Backend: "The secure engine behind the scenes that processes your business data, user accounts, and transactions."
- Database: "The organized storage vault where your user accounts, product catalogs, and order history are securely saved."
- API: "A digital bridge allowing your website to talk securely with other software or payment providers."
- RAG (Retrieval-Augmented Generation): "A system that allows an AI to read your private company manuals or PDFs first so its answers are factual and accurate."
- CMS: "A simple control panel that lets you edit your website text and images without needing a developer."
- Authentication: "Secure login and registration preventing unauthorized users from accessing sensitive data."`,
      chunkSummary: 'Simple business translations for technical concepts like frontend, backend, database, API, RAG, and CMS.',
      tags: ['simple language', 'non-technical', 'definitions', 'consulting'],
      sourceUrl: '/about',
      version: 2,
      active: true
    },
    {
      title: 'Advisory: "What Should I Do?" Case Scenarios',
      category: 'recommendations',
      content: `Practical Guidance for Common Scenarios:
1. "I have a small business (e.g., restaurant, law firm, clinic) and no website. What should I do?":
   Start with a professional Business Website (from $250 USD). You don\'t need a complex custom web application unless your business requires customer accounts, live ordering, or custom booking workflows.
2. "I want to start a SaaS but don\'t have anything built.":
   Start with a SaaS MVP (from $1,000 USD) rather than attempting to build the full vision immediately. Define the 2-3 essential features that solve the core problem, launch to early users, and iterate.
3. "My website is slow. What should I do?":
   Before spending money rebuilding from scratch, get a Performance & Technical SEO audit (from $150 USD). If the architecture is decent, optimizing images, script loading, and caching may solve the problem much more cost-effectively.
4. "I want AI but don\'t know what I need.":
   If you want to assist website visitors and capture leads, an AI Chatbot (from $400 USD) is the right starting point. If you need the AI to answer from your proprietary manuals or company PDFs, you need a RAG system (from $750 USD).
5. "I have $500. What can you build for me?":
   With a $500 budget, you can get a comprehensive Business Website (from $250 USD), an E-Commerce storefront (starts from $500 USD), a Full-Stack Web Application (starts from $500 USD), an AI Chatbot (starts from $400 USD), or an AI Integration (from $300 USD).`,
      chunkSummary: 'Guidance for common scenarios: small business websites, starting a SaaS MVP, fixing slow websites, choosing AI vs RAG, and what can be built with $500.',
      tags: ['advice', 'restaurant website', 'slow website', 'saas mvp', '500 budget'],
      sourceUrl: '/about',
      version: 2,
      active: true
    },
    {
      title: 'Discovery & Consultation Framework',
      category: 'recommendations',
      content: `When a client\'s project requirements are underspecified, Ask Solo engages conversationally with targeted discovery questions:
- What are you trying to build?
- Is this for an existing business or a brand-new idea?
- Do customers need to create accounts and log in?
- Do you need to accept online payments or sell products?
- Do you need an admin dashboard to manage data?
- Do you need AI to assist visitors or analyze documents?
- What is your approximate timeline and budget target?

Once the scope is clear, guide the client toward our "Start a Project" brief to schedule an engineering consultation.`,
      chunkSummary: 'Conversational project discovery framework used to understand business goals, account needs, payments, and timeline before recommending solutions.',
      tags: ['discovery', 'consultation', 'questions', 'project scope'],
      sourceUrl: '/contact',
      version: 2,
      active: true
    },

    // ==========================================
    // GROUP 5: COMPANY FAQ
    // ==========================================
    {
      title: 'FAQ: How to Hire SoloNomous Labs & Next Steps',
      category: 'faqs',
      content: `How to hire SoloNomous Labs:
1. Submit a Brief: Click "Start a Project" or visit /contact to outline your goals, budget, and timeline.
2. Direct Chat / Consultation: Connect with founder Noman Nawaz via WhatsApp (+92 315 6251281) or email (nawaznoman7766@gmail.com).
3. Technical Proposal: We provide a clear architectural scope with deliverables, milestones, and starting pricing.
4. Flexible Ordering: You can also order directly through Noman\'s verified Fiverr profile at https://www.fiverr.com/nomannawaz67 for standardized milestone security.`,
      chunkSummary: 'Hire SoloNomous Labs by submitting the Start a Project form, contacting on WhatsApp/email, or ordering via verified Fiverr gigs.',
      tags: ['hire', 'how to hire', 'process', 'fiverr', 'contact'],
      sourceUrl: '/contact',
      version: 2,
      active: true
    },
    {
      title: 'FAQ: Project Timelines & Delivery Sprints',
      category: 'faqs',
      content: `Typical Project Timelines:
- Business Websites: 1 to 2 weeks.
- Performance & Technical SEO Audits: 3 to 7 days.
- Full-Stack Web Applications & E-Commerce: 3 to 5 weeks.
- SaaS MVP Development: 4 to 6 weeks.
- AI Chatbots & RAG Systems: 2 to 4 weeks.
Timelines vary based on feature scope and client feedback responsiveness.`,
      chunkSummary: 'Typical delivery ranges from 1-2 weeks for business websites up to 4-6 weeks for complete SaaS MVPs.',
      tags: ['timeline', 'duration', 'delivery', 'sprint'],
      sourceUrl: '/about',
      version: 2,
      active: true
    },
    {
      title: 'FAQ: Supported Technologies',
      category: 'faqs',
      content: `Supported Core Technologies at SoloNomous Labs:
- Core Web: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- Backend & DB: Node.js, Express.js, MongoDB, Mongoose, PostgreSQL, REST APIs, JWT, Clerk, Cloudinary
- AI & Machine Learning: Python, Pandas, NumPy, Scikit-learn, Vector Databases, Embeddings, RAG, LLM APIs

We only offer technologies we actively maintain in production.`,
      chunkSummary: 'Core tech stack includes Next.js, React, TypeScript, Node.js, Express, MongoDB, PostgreSQL, Python, Scikit-learn, and RAG vector databases.',
      tags: ['tech stack', 'technologies', 'nextjs', 'react', 'python', 'mongodb'],
      sourceUrl: '/about',
      version: 2,
      active: true
    },

    // ==========================================
    // GROUP 6: REAL PROJECTS & VERIFIED CASE STUDIES
    // ==========================================
    {
      title: 'Project: ZeoAtlas — Autonomous AI Workspace',
      category: 'case_studies',
      content: `ZeoAtlas (Verified Flagship Project):
Engineered by Noman Nawaz.
Description: An autonomous AI workspace platform featuring real-time web search grounding, sub-5ms ML classification, and SSE streaming inference.
Key Stack: Next.js, React 19, TypeScript, Node.js, Express, MongoDB Atlas, LLM APIs.
Highlights: Real-time web citations, zero-latency streaming responses, and responsive desktop-grade user interface.
Verified on: Founder portfolio at https://www.nouman-nawaz.dev/`,
      chunkSummary: 'ZeoAtlas is an autonomous AI workspace platform with real-time web search grounding and streaming inference built by Noman Nawaz.',
      tags: ['zeoatlas', 'projects', 'case study', 'ai workspace', 'portfolio'],
      sourceUrl: 'https://www.nouman-nawaz.dev/',
      version: 2,
      active: true
    },
    {
      title: 'Project: Zashas — Modern E-Commerce Storefront',
      category: 'case_studies',
      content: `Zashas (Verified Flagship Project):
Engineered by Noman Nawaz.
Description: A high-performance modern e-commerce storefront engineered for seamless customer purchasing, dynamic catalog management, and fast mobile navigation.
Key Stack: Next.js, React 19, Node.js, Express, MongoDB, Tailwind CSS.
Highlights: Rapid product filtering, optimized cart flow, and responsive checkout interface.
Verified on: Founder portfolio at https://www.nouman-nawaz.dev/`,
      chunkSummary: 'Zashas is a high-performance modern e-commerce storefront built with Next.js, React 19, and MongoDB by Noman Nawaz.',
      tags: ['zashas', 'projects', 'case study', 'ecommerce', 'portfolio'],
      sourceUrl: 'https://www.nouman-nawaz.dev/',
      version: 2,
      active: true
    },
    {
      title: 'Verified Fiverr Gigs & Client Delivery History',
      category: 'case_studies',
      content: `Verified Fiverr Capabilities & Track Record:
Noman Nawaz operates a verified Fiverr profile (https://www.fiverr.com/nomannawaz67) offering:
1. Modern AI-Powered MERN or Next.js Web Applications
2. Custom SaaS or Business Websites as a Full-Stack MERN Developer
3. Pixel-Perfect Figma to Responsive React/Next.js & Tailwind CSS Conversions
Clients enjoy verified delivery milestones and secure buyer protections.`,
      chunkSummary: 'Noman Nawaz offers verified full-stack and AI services on Fiverr (fiverr.com/nomannawaz67) with milestone protections.',
      tags: ['fiverr', 'freelance', 'verified gigs', 'case studies', 'reputation'],
      sourceUrl: 'https://www.fiverr.com/nomannawaz67',
      version: 2,
      active: true
    },

    // ==========================================
    // GROUP 7: POLICIES & NEGATIVE KNOWLEDGE
    // ==========================================
    {
      title: 'Policy: Academic Work & Cheating Refusal',
      category: 'policies',
      content: `STRICT POLICY ON ACADEMIC WORK:
SoloNomous Labs does NOT build university assignments, homework, final year projects (FYPs) for academic submission, exam solutions, or cheating materials.

If a visitor asks:
"Do you make FYPs?" or "Can you build my university assignment?"

Ask Solo responds politely and firmly:
"No, SoloNomous Labs does not create university assignments, homework, or Final Year Projects (FYPs) for academic submission. We are a professional software studio focused exclusively on real-world business applications, startup MVPs, and commercial software solutions. If you are launching a genuine business or commercial product, we would be glad to assist."`,
      chunkSummary: 'Strict refusal policy: SoloNomous Labs does not build FYPs, assignments, or homework for academic submission, focusing solely on real-world business software.',
      tags: ['policy', 'academic', 'fyp', 'assignments', 'homework', 'refusal'],
      sourceUrl: '/about',
      version: 2,
      active: true
    },
    {
      title: 'Policy: No Fake Claims or Unsupported Promises',
      category: 'policies',
      content: `Commitment to Accuracy & Truth in Advertising:
SoloNomous Labs will never invent capabilities, past clients, certifications, performance statistics, or team sizes. If information is not verified in our published repository, portfolio, or site settings, Ask Solo admits lack of data and invites the user to speak directly with Noman Nawaz for clarification.`,
      chunkSummary: 'SoloNomous Labs operates with strict factual accuracy without inflated client counts, fake certifications, or unverified claims.',
      tags: ['policy', 'accuracy', 'truth', 'honesty'],
      sourceUrl: '/about',
      version: 2,
      active: true
    }
  ];

  await KnowledgeDocument.insertMany(knowledgeDocuments);
  console.log(`✅ Seeded ${knowledgeDocuments.length} structured Knowledge Documents across all 7 groups.`);

  // 4. Update SiteSettings to ensure accurate contact info
  await SiteSettings.findOneAndUpdate(
    {},
    {
      companyName: 'SoloNomous Labs',
      brandTagline: 'Software & AI Product Studio',
      contactEmail: 'nawaznoman7766@gmail.com',
      contactPhone: '+92 315 6251281',
      whatsappNumber: '+923156251281',
      officeAddress: 'Remote-First Software Studio',
      responseTimeNotice: 'Typical response within 2-4 business hours',
      socialLinks: {
        github: 'https://github.com/Hafiz-Noman-Nawaz',
        portfolio: 'https://www.nouman-nawaz.dev/',
        fiverr: 'https://www.fiverr.com/nomannawaz67'
      }
    },
    { upsert: true }
  );
  console.log('✅ SiteSettings verified and updated.');

  console.log('🎉 Seeding successfully completed!');
  if (shouldManageConnection) {
    await disconnectDB();
  }
};

if (require.main === module) {
  seedKnowledgeIntelligence()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
