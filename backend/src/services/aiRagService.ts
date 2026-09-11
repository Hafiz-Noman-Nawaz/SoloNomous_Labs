import { KnowledgeDocument, IKnowledgeDocument } from '../models/KnowledgeAndChat';
import { Lead } from '../models/Lead';
import { CaseStudy, ICaseStudy } from '../models/CaseStudy';
import { Service, IService } from '../models/Service';
import { Testimonial, ITestimonial } from '../models/FeedbackAndFaq';

export interface ChatCompletionResult {
  reply: string;
  citations: Array<{
    title: string;
    category: string;
    sourceUrl?: string;
  }>;
  intentDetected: string;
  leadPromptSuggested: boolean;
  suggestedAction?: 'schedule_call' | 'start_a_project' | 'view_service' | 'none';
}

export interface WebsiteRagContext {
  knowledgeDocs: IKnowledgeDocument[];
  caseStudies: ICaseStudy[];
  services: IService[];
  testimonials: ITestimonial[];
}

export class AiRagService {
  /**
   * Classify user query intent
   */
  public static detectIntent(query: string): {
    intent: string;
    categoryHint?: string;
    shouldCaptureLead: boolean;
  } {
    const q = query.toLowerCase();

    // 1. Negative Knowledge & Academic Cheating Policy
    if (
      q.includes('fyp') ||
      q.includes('final year project') ||
      q.includes('assignment') ||
      q.includes('homework') ||
      q.includes('exam') ||
      q.includes('plagiarism') ||
      q.includes('thesis') ||
      q.includes('cheat')
    ) {
      return { intent: 'academic_refusal', categoryHint: 'policies', shouldCaptureLead: false };
    }

    // 2. Pricing & Budget Inquiries
    if (
      q.includes('how much') ||
      q.includes('cost') ||
      q.includes('price') ||
      q.includes('pricing') ||
      q.includes('quote') ||
      q.includes('rates') ||
      q.includes('$500') ||
      q.includes('budget')
    ) {
      return { intent: 'pricing_inquiry', categoryHint: 'pricing', shouldCaptureLead: true };
    }

    // 3. Technical SEO / Slow Website Inquiries
    if (
      q.includes('slow') ||
      q.includes('speed') ||
      q.includes('performance') ||
      q.includes('lighthouse') ||
      q.includes('core web vitals')
    ) {
      return { intent: 'speed_slow_website', categoryHint: 'recommendations', shouldCaptureLead: true };
    }

    // 4. Document / RAG Inquiries
    if (
      (q.includes('document') || q.includes('pdf') || q.includes('internal knowledge') || q.includes('files')) &&
      (q.includes('ai') || q.includes('answer') || q.includes('chat'))
    ) {
      return { intent: 'document_ai', categoryHint: 'services', shouldCaptureLead: true };
    }

    // 5. User accounts & E-commerce / Orders
    if (
      (q.includes('order') || q.includes('orders') || q.includes('buy') || q.includes('cart')) &&
      (q.includes('register') || q.includes('login') || q.includes('account') || q.includes('customer'))
    ) {
      return { intent: 'orders_and_accounts', categoryHint: 'recommendations', shouldCaptureLead: true };
    }

    // 6. Restaurant / Small business specific website
    if (
      q.includes('restaurant') ||
      q.includes('small business') ||
      q.includes('cafe') ||
      q.includes('clinic') ||
      q.includes('law firm')
    ) {
      return { intent: 'small_biz_website', categoryHint: 'recommendations', shouldCaptureLead: true };
    }

    // 7. SaaS MVP Inquiries
    if (
      q.includes('saas') ||
      q.includes('software startup') ||
      q.includes('mvp')
    ) {
      return { intent: 'saas_inquiry', categoryHint: 'services', shouldCaptureLead: true };
    }

    // 8. Add AI to existing website
    if (
      (q.includes('already have a website') || q.includes('existing website')) &&
      (q.includes('ai') || q.includes('automate') || q.includes('add'))
    ) {
      return { intent: 'add_ai_existing', categoryHint: 'services', shouldCaptureLead: true };
    }

    // 9. Unsure what service is needed
    if (
      q.includes("don't know what service") ||
      q.includes('dont know what service') ||
      q.includes('which service') ||
      q.includes('what should i do') ||
      q.includes('what do i need') ||
      q.includes('help me choose')
    ) {
      return { intent: 'recommendation_inquiry', categoryHint: 'recommendations', shouldCaptureLead: true };
    }

    // 10. Technology stack
    if (
      q.includes('technology') ||
      q.includes('technologies') ||
      q.includes('tech stack') ||
      q.includes('what do you use') ||
      q.includes('framework') ||
      q.includes('tools')
    ) {
      return { intent: 'tech_stack_inquiry', categoryHint: 'faqs', shouldCaptureLead: false };
    }

    // 11. Hiring / Starting project
    if (
      q.includes('hire') ||
      q.includes('how can i hire') ||
      q.includes('get started') ||
      q.includes('start a project')
    ) {
      return { intent: 'hire_inquiry', categoryHint: 'faqs', shouldCaptureLead: true };
    }

    // 12. Testimonials / Client feedback / Reviews
    if (
      q.includes('review') ||
      q.includes('testimonial') ||
      q.includes('feedback') ||
      q.includes('rating') ||
      q.includes('client say') ||
      q.includes('past clients') ||
      q.includes('satisfied')
    ) {
      return { intent: 'testimonial_inquiry', categoryHint: 'testimonials', shouldCaptureLead: false };
    }

    // 13. Owner & Founder
    if (
      q.includes('owner') ||
      q.includes('founder') ||
      q.includes('noman') ||
      q.includes('nawaz') ||
      q.includes('who made') ||
      q.includes('who created') ||
      q.includes('who runs') ||
      q.includes('lead architect')
    ) {
      return { intent: 'owner_inquiry', categoryHint: 'company', shouldCaptureLead: false };
    }

    // 14. Past projects / Portfolio / Case studies
    if (
      q.includes('portfolio') ||
      q.includes('project') ||
      q.includes('projects') ||
      q.includes('case study') ||
      q.includes('case studies') ||
      q.includes('work') ||
      q.includes('demo') ||
      q.includes('zeoatlas') ||
      q.includes('zashas')
    ) {
      return { intent: 'portfolio_inquiry', categoryHint: 'case_studies', shouldCaptureLead: false };
    }

    // 15. What do you do
    if (
      q.includes('what do you do') ||
      q.includes('what does solonomous labs do') ||
      q.includes('what you guys do') ||
      q.includes('about company') ||
      q.includes('who are you')
    ) {
      return { intent: 'company_overview', categoryHint: 'company', shouldCaptureLead: false };
    }

    // 16. Contact
    if (
      q.includes('contact') ||
      q.includes('call') ||
      q.includes('whatsapp') ||
      q.includes('email') ||
      q.includes('talk') ||
      q.includes('reach')
    ) {
      return { intent: 'human_escalation', categoryHint: 'company', shouldCaptureLead: true };
    }

    return { intent: 'general_inquiry', shouldCaptureLead: false };
  }

  /**
   * Retrieve relevant knowledge base context via keyword/regex/text search
   */
  public static async retrieveRelevantKnowledge(
    query: string,
    limit = 4
  ): Promise<IKnowledgeDocument[]> {
    try {
      const words = query
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter((w) => w.length > 2);

      let docs: IKnowledgeDocument[] = [];

      // Try text index if available
      if (words.length > 0) {
        docs = await KnowledgeDocument.find(
          {
            $text: { $search: query },
            active: true
          },
          { score: { $meta: 'textScore' } }
        )
          .sort({ score: { $meta: 'textScore' } })
          .limit(limit);
      }

      // Fallback regex if text index returned nothing
      if (docs.length === 0 && words.length > 0) {
        const regexPatterns = words.map((w) => new RegExp(w, 'i'));
        docs = await KnowledgeDocument.find({
          active: true,
          $or: [
            { title: { $in: regexPatterns } },
            { tags: { $in: regexPatterns } },
            { content: { $in: regexPatterns } }
          ]
        }).limit(limit);
      }

      // If still empty, return foundational company knowledge
      if (docs.length === 0) {
        docs = await KnowledgeDocument.find({ active: true }).limit(3);
      }

      return docs;
    } catch (error) {
      console.warn('Knowledge retrieval error (continuing with default fallback):', error);
      return [];
    }
  }

  /**
   * Dynamically query the live website database (Services, Case Studies/Projects, Testimonials, Knowledge)
   * so the AI assistant always knows the latest additions made by the user in the CMS!
   */
  public static async retrieveWebsiteContext(query: string): Promise<WebsiteRagContext> {
    try {
      const q = query.toLowerCase();
      const words = query
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter((w) => w.length > 2);
      const regexPatterns = words.map((w) => new RegExp(w, 'i'));

      // 1. Knowledge Base
      const knowledgeDocs = await this.retrieveRelevantKnowledge(query, 4);

      // 2. Services (fetch active services, prioritizing any matching user query)
      let servicesQuery: any = { active: true };
      if (words.length > 0 && (q.includes('service') || q.includes('price') || q.includes('cost') || q.includes('build') || q.includes('app') || q.includes('web'))) {
        servicesQuery = {
          active: true,
          $or: [
            { title: { $in: regexPatterns } },
            { summary: { $in: regexPatterns } },
            { category: { $in: regexPatterns } },
            { techStack: { $in: regexPatterns } }
          ]
        };
      }
      let services = await Service.find(servicesQuery).sort({ displayOrder: 1 }).limit(8).lean();
      if (services.length === 0) {
        services = await Service.find({ active: true }).sort({ displayOrder: 1 }).limit(6).lean();
      }

      // 3. Projects & Case Studies (fetch published projects matching query or latest additions)
      let caseStudiesQuery: any = { published: true };
      if (words.length > 0 && (q.includes('project') || q.includes('portfolio') || q.includes('case') || q.includes('work') || q.includes('tech') || q.includes('stack') || q.includes('deliver'))) {
        caseStudiesQuery = {
          published: true,
          $or: [
            { title: { $in: regexPatterns } },
            { overview: { $in: regexPatterns } },
            { techStack: { $in: regexPatterns } },
            { deliverables: { $in: regexPatterns } }
          ]
        };
      }
      let caseStudies = await CaseStudy.find(caseStudiesQuery).sort({ featured: -1, createdAt: -1 }).limit(6).lean();
      if (caseStudies.length === 0) {
        caseStudies = await CaseStudy.find({ published: true }).sort({ createdAt: -1 }).limit(5).lean();
      }

      // 4. Testimonials (active client reviews)
      const testimonials = await Testimonial.find({ active: true }).sort({ rating: -1, createdAt: -1 }).limit(5).lean();

      return {
        knowledgeDocs,
        caseStudies: caseStudies as any,
        services: services as any,
        testimonials: testimonials as any
      };
    } catch (err) {
      console.warn('Error retrieving website context for RAG:', err);
      return {
        knowledgeDocs: [],
        caseStudies: [],
        services: [],
        testimonials: []
      };
    }
  }

  /**
   * Process query through the RAG synthesis pipeline
   */
  public static async generateResponse(
    userMessage: string,
    history: Array<{ role: string; content: string }> = []
  ): Promise<ChatCompletionResult> {
    const { intent, shouldCaptureLead } = this.detectIntent(userMessage);
    const context = await this.retrieveWebsiteContext(userMessage);
    const q = userMessage.toLowerCase();

    const citations: Array<{ title: string; category: string; sourceUrl?: string }> = [];

    // Citations from Knowledge base
    for (const doc of context.knowledgeDocs) {
      citations.push({
        title: doc.title,
        category: doc.category,
        sourceUrl: doc.sourceUrl || `/knowledge/${doc._id}`
      });
    }

    // Dynamic Citations from matching Services
    if (intent === 'pricing_inquiry' || intent === 'saas_inquiry' || intent === 'small_biz_website' || intent === 'document_ai' || intent === 'speed_slow_website' || intent === 'recommendation_inquiry') {
      for (const s of context.services.slice(0, 2)) {
        if (!citations.some(c => c.sourceUrl === `/services/${s.slug}`)) {
          citations.push({
            title: `Service: ${s.title}`,
            category: 'services',
            sourceUrl: `/services/${s.slug}`
          });
        }
      }
    }

    // Dynamic Citations from matching Case Studies / Projects
    if (intent === 'portfolio_inquiry' || intent === 'tech_stack_inquiry') {
      for (const cs of context.caseStudies.slice(0, 3)) {
        if (!citations.some(c => c.sourceUrl === `/work/${cs.slug}`)) {
          citations.push({
            title: `Case Study: ${cs.title}`,
            category: 'case_studies',
            sourceUrl: `/work/${cs.slug}`
          });
        }
      }
    }

    // Official Founder Portfolio citation
    if ((intent === 'owner_inquiry' || intent === 'portfolio_inquiry') && !citations.some(c => c.sourceUrl?.includes('nouman-nawaz.dev'))) {
      citations.unshift({
        title: 'Noman Nawaz — Personal Portfolio & Live Projects',
        category: 'case_studies',
        sourceUrl: 'https://www.nouman-nawaz.dev/'
      });
    }

    // Verified Fiverr citation
    if ((intent === 'hire_inquiry' || intent === 'pricing_inquiry') && !citations.some(c => c.sourceUrl?.includes('fiverr.com'))) {
      citations.push({
        title: 'Noman Nawaz — Verified Fiverr Profile',
        category: 'services',
        sourceUrl: 'https://www.fiverr.com/nomannawaz67'
      });
    }

    let reply = '';
    let suggestedAction: 'schedule_call' | 'start_a_project' | 'view_service' | 'none' = 'none';

    // ==================== LOCAL STRUCTURED SYNTHESIS ENGINE ====================

    // 1. Strict Academic Policy Refusal
    if (intent === 'academic_refusal') {
      reply =
        "### Academic Integrity Policy Notice\n\nNo, SoloNomous Labs does not create university assignments, homework, thesis, or Final Year Projects (FYPs) for academic submission.\n\nWe are a professional software and AI product studio focused exclusively on building commercial applications, SaaS products, and business web solutions. If you are launching a genuine commercial startup or business application, we would be pleased to assist you.";
      suggestedAction = 'none';
    }

    // 2. Company Overview ("What does SoloNomous Labs do?")
    else if (intent === 'company_overview') {
      reply =
        "### About SoloNomous Labs\n\nSoloNomous Labs is a professional **Software & AI Product Studio** founded by lead engineer Noman Nawaz. We design, architect, and deploy reliable digital products for businesses, startups, and enterprises.\n\n#### Core Capabilities\n- **Full-Stack Web Applications**: Modern Next.js, React, Node.js, and TypeScript architectures.\n- **SaaS MVP Engineering**: Rapid, production-ready MVP development with authentication, billing, and database workflows.\n- **AI & RAG Systems**: Grounded AI assistants, custom knowledge retrieval pipelines, and workflow automation.\n- **Performance & SEO**: High Core Web Vitals, sub-second page loads, and technical SEO.\n\nWe build custom, scalable software designed to drive operational growth rather than generic off-the-shelf templates.";
      suggestedAction = 'view_service';
    }

    // 3. Pricing Specifics
    else if (intent === 'pricing_inquiry') {
      if (context.services.length > 0) {
        const pricingBullets = context.services
          .filter(s => s.startingPrice)
          .map(s => `- **${s.title}**: Starting from **$${s.startingPrice} USD** ${s.pricingInterval || ''}`)
          .join('\n');

        reply = `### Transparent Investment & Pricing\n\nSoloNomous Labs provides transparent, milestone-based pricing. Here are our starting rates:\n\n${pricingBullets || '- **Full-Stack Web Application**: Starting from $500 USD\n- **Business Website**: Starting from $250 USD\n- **SaaS MVP**: Starting from $1,000 USD\n- **AI Chatbot / RAG System**: Starting from $400 - $750 USD'}\n\nEvery project is customized to your exact requirements and scope. What type of product are you looking to build?`;
      } else {
        reply =
          "### Investment & Starting Rates\n\nOur engagements are priced transparently as starting rates in USD:\n- **Business Website**: Starting from **$250 USD**\n- **Full-Stack Web Application**: Starting from **$500 USD**\n- **SaaS MVP Development**: Starting from **$1,000 USD**\n- **E-Commerce Platform**: Starting from **$500 USD**\n- **AI Chatbot & Automation**: Starting from **$400 USD**\n- **RAG & Knowledge AI**: Starting from **$750 USD**\n\nFinal cost depends on custom features, data models, and integrations. Tell us about your goals to get a tailored estimate.";
      }
      suggestedAction = 'start_a_project';
    }

    // 4. Testimonials & Client Reviews
    else if (intent === 'testimonial_inquiry') {
      if (context.testimonials.length > 0) {
        const reviewsText = context.testimonials
          .map(t => `- **"${t.content}"**\n  — *${t.clientName}*, ${t.role} at **${t.company}** (${'★'.repeat(t.rating || 5)})`)
          .join('\n\n');
        reply = `### Verified Client Endorsements\n\nHere is what technical leaders and founders have shared about working with SoloNomous Labs:\n\n${reviewsText}\n\nWe maintain a 5-star standard across engineering rigor, timely delivery, and clear communication.`;
      } else {
        reply =
          "### Verified Client Feedback\n\nOur clients value our architectural rigor, clean codebases, and dependable communication. We build production systems with complete client IP ownership and 5-star client satisfaction.";
      }
      suggestedAction = 'start_a_project';
    }

    // 5. Projects & Case Studies (Dynamic Website Reading)
    else if (intent === 'portfolio_inquiry') {
      if (context.caseStudies.length > 0) {
        const studiesText = context.caseStudies
          .map(cs => {
            const tech = cs.techStack?.length ? `\n  - **Tech Stack**: ${cs.techStack.join(', ')}` : '';
            const results = cs.results?.length ? `\n  - **Results**: ${cs.results.map(r => `${r.metric} ${r.label}`).join(' | ')}` : '';
            return `#### **${cs.title}** (${cs.industry || 'Technology'})\n- **Overview**: ${cs.overview}${tech}${results}`;
          })
          .join('\n\n');
        reply = `### Real-World Projects & Case Studies\n\nHere are recent production architectures engineered by SoloNomous Labs:\n\n${studiesText}\n\nYou can also explore live systems and personal architectural demos on Noman Nawaz's verified portfolio: [https://www.nouman-nawaz.dev/](https://www.nouman-nawaz.dev/).`;
      } else {
        reply =
          "### Portfolio & Architecture Highlights\n\nYou can explore real-world production architectures on Noman Nawaz's verified portfolio: [https://www.nouman-nawaz.dev/](https://www.nouman-nawaz.dev/).\n\n#### Flagship Systems\n- **ZeoAtlas**: Autonomous AI workspace featuring real-time web search grounding, sub-5ms ML classification, and SSE streaming inference.\n- **Zashas**: High-performance modern e-commerce storefront engineered with Next.js, React 19, Node.js, and MongoDB.";
      }
      suggestedAction = 'view_service';
    }

    // 6. Technology Stack
    else if (intent === 'tech_stack_inquiry') {
      reply =
        "### SoloNomous Labs Technology Stack\n\nWe build resilient, scalable digital products using proven, production-grade technologies:\n\n- **Frontend & Web**: Next.js (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion\n- **Backend & APIs**: Node.js, Express.js, REST APIs, GraphQL, Server-Sent Events (SSE), Webhooks\n- **Databases**: MongoDB, PostgreSQL, Redis, Cloudinary\n- **AI & Machine Learning**: Python, PyTorch, Scikit-learn, Google Gemini Flash, RAG pipelines, Vector Search\n- **Authentication & Security**: Clerk, JWT, Role-Based Access Control (RBAC), Rate Limiting\n\nWe choose tools specifically for high execution speed, maintainability, and clean architecture.";
      suggestedAction = 'view_service';
    }

    // 7. Hiring & How to Start
    else if (intent === 'hire_inquiry') {
      reply =
        "### How to Engage SoloNomous Labs\n\nYou can start working with us through three straightforward options:\n\n1. **Submit a Project Brief**: Visit [/contact](/contact) or [/pricing](/pricing) to outline your requirements and target launch date.\n2. **Direct Consultation**: Message founder Noman Nawaz on WhatsApp at **+92 315 6251281** or email **nawaznoman7766@gmail.com**.\n3. **Verified Fiverr Profile**: Order with escrow protections via Noman's verified [Fiverr Profile](https://www.fiverr.com/nomannawaz67).\n\nWe typically review briefs and respond with a scoping proposal within 2 to 4 business hours.";
      suggestedAction = 'start_a_project';
    }

    // 8. Recommendation Inquiry
    else if (intent === 'recommendation_inquiry') {
      reply =
        "### Finding the Right Solution for You\n\nYou don't need to know the technical jargon—we're here to help guide you. To determine the most effective architecture, please tell us:\n\n1. **What is the primary goal or problem you are solving?**\n2. **Is this for a new business, an existing company, or a startup MVP?**\n3. **Do users need to create accounts, make payments, or access AI features?**\n\nOnce you share a few details, we will recommend the most cost-effective approach for your goals.";
      suggestedAction = 'schedule_call';
    }

    // 9. Owner & Founder
    else if (intent === 'owner_inquiry') {
      reply =
        "### Founder & Lead Systems Architect\n\nSoloNomous Labs was founded by **Noman Nawaz** (Nouman Nawaz). Noman is an experienced Full-Stack Software Engineer & ML Developer specializing in Next.js, TypeScript, the MERN stack, and production AI engineering.\n\n- **Personal Portfolio**: [https://www.nouman-nawaz.dev/](https://www.nouman-nawaz.dev/)\n- **Verified Fiverr**: [https://www.fiverr.com/nomannawaz67](https://www.fiverr.com/nomannawaz67)\n- **Direct WhatsApp**: +92 315 6251281\n- **Email**: nawaznoman7766@gmail.com";
      suggestedAction = 'view_service';
    }

    // 10. Direct Contact Escalation
    else if (intent === 'human_escalation') {
      reply =
        "### Direct Contact Channels\n\nYou can reach out directly to founder Noman Nawaz via:\n\n- **WhatsApp / Phone**: +92 315 6251281\n- **Email**: nawaznoman7766@gmail.com\n- **Website Inquiry**: [/contact](/contact)\n- **Founder Portfolio**: [https://www.nouman-nawaz.dev/](https://www.nouman-nawaz.dev/)\n\nTypical response time is within 2 to 4 business hours.";
      suggestedAction = 'schedule_call';
    }

    // 11. Fallback with Retrieved Knowledge Grounding
    else {
      if (context.knowledgeDocs.length > 0) {
        const topDoc = context.knowledgeDocs[0];
        reply = `### ${topDoc.title}\n\n${topDoc.content || topDoc.chunkSummary}\n\nSoloNomous Labs, founded by Noman Nawaz, specializes in high-performance digital products, full-stack applications, and practical AI systems. Feel free to ask about our projects, tech stack, or specific service options!`;
      } else {
        reply =
          "### Welcome to SoloNomous Labs\n\nSoloNomous Labs is an AI, Software & Digital Product Studio founded by Noman Nawaz. We build high-performance web applications, scalable SaaS MVPs, e-commerce stores, and custom AI systems. How can we assist your business today?";
      }
    }

    // ==================== LIVE GEMINI LLM GROUNDED SYNTHESIS ====================
    const { apiKey, model } = this.getGeminiConfig();
    if (apiKey && apiKey.length > 10 && intent !== 'academic_refusal') {
      try {
        const systemPrompt = this.buildSystemPrompt(context);
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...history.slice(-4).map((h) => ({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }]
              })),
              { role: 'user', parts: [{ text: userMessage }] }
            ],
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            }
          })
        });

        if (response.ok) {
          const data: any = await response.json();
          const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (geminiText && geminiText.trim().length > 0) {
            reply = geminiText.trim();
          }
        }
      } catch (geminiError) {
        console.warn('Gemini generateContent fallback to local synthesis:', geminiError);
      }
    }

    return {
      reply,
      citations,
      intentDetected: intent,
      leadPromptSuggested: shouldCaptureLead,
      suggestedAction
    };
  }

  /**
   * Helper: Retrieve configured Gemini model and API key
   */
  public static getGeminiConfig(): { apiKey: string; model: string } {
    const apiKey = (process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '').trim();
    const model = (process.env.GEMINI_MODEL || 'gemini-3.6-flash').trim();
    return { apiKey, model };
  }

  /**
   * Helper: Build grounded system prompt with live website data (Services, Case Studies, Testimonials, Knowledge Docs)
   */
  public static buildSystemPrompt(context: WebsiteRagContext): string {
    const { knowledgeDocs, caseStudies, services, testimonials } = context;

    // 1. Format Knowledge Docs
    const knowledgeSnippets = knowledgeDocs.length > 0
      ? knowledgeDocs.map((d) => `• [${d.title}]: ${d.content || d.chunkSummary}`).join('\n')
      : '• SoloNomous Labs is an AI, Software & Digital Product Engineering Studio founded by Noman Nawaz.';

    // 2. Format Live Services
    const servicesList = services.length > 0
      ? services.map((s) => {
          const price = s.startingPrice ? ` (Starting from $${s.startingPrice} USD ${s.pricingInterval || ''})` : '';
          const tech = s.techStack?.length ? ` | Tech Stack: ${s.techStack.join(', ')}` : '';
          return `• **${s.title}**${price}: ${s.summary}${tech}`;
        }).join('\n')
      : '• Full-Stack Web Development, SaaS MVP Engineering, AI & RAG Chatbots, E-Commerce Platforms, Performance & SEO.';

    // 3. Format Live Projects & Case Studies
    const projectsList = caseStudies.length > 0
      ? caseStudies.map((c) => {
          const tech = c.techStack?.length ? ` | Tech Stack: ${c.techStack.join(', ')}` : '';
          const deliverables = c.deliverables?.length ? ` | Deliverables: ${c.deliverables.join(', ')}` : '';
          const metrics = c.results?.length ? ` | Results: ${c.results.map(r => `${r.metric} ${r.label}`).join(', ')}` : '';
          return `• **${c.title}** (${c.industry || 'Technology'}): ${c.overview}${tech}${deliverables}${metrics}`;
        }).join('\n')
      : '• Flagship projects: ZeoAtlas (Autonomous AI workspace with sub-5ms ML classification), Zashas (Modern E-commerce storefront).';

    // 4. Format Live Client Testimonials
    const reviewsList = testimonials.length > 0
      ? testimonials.map((t) => `• "${t.content}" — ${t.clientName}, ${t.role} at ${t.company} (${t.rating || 5}/5 stars)`).join('\n')
      : '• Highly rated by technical founders and enterprise leaders for architectural rigor and clean code.';

    return `You are Solo, the dedicated AI Solutions Architect for SoloNomous Labs, founded by Noman Nawaz.

### FOUNDER PROFILE & CONTACT CHANNELS
- Founder & Principal Architect: Noman Nawaz (Full-Stack Software Engineer & ML Developer specializing in Next.js, React, Node.js, and AI Systems)
- Personal Portfolio: https://www.nouman-nawaz.dev/
- Verified Fiverr: https://www.fiverr.com/nomannawaz67
- WhatsApp / Direct: +92 315 6251281
- Official Email: nawaznoman7766@gmail.com
- Project Inquiry: /contact or /pricing

### LIVE DATABASE CONTEXT (Queried directly from MongoDB)
#### CURRENT SERVICES & PRICING:
${servicesList}

#### PUBLISHED PROJECTS & CASE STUDIES (Dynamic Tech Stack & Client Work):
${projectsList}

#### VERIFIED CLIENT TESTIMONIALS:
${reviewsList}

#### VERIFIED KNOWLEDGE BASE:
${knowledgeSnippets}

### STRICT OPERATIONAL GUIDELINES:
1. **Dynamic Website Awareness**:
   - You are connected live to the website database. When users ask about projects, tech stack, client testimonials, or services, reference the real projects, tech stack, and testimonials from the LIVE DATABASE CONTEXT above.
   - If a user uploads a new project or testimonial in the CMS, it appears in your context—read it and communicate it accurately.
2. **Structured & Beautiful Responses**:
   - Always structure your responses cleanly in Markdown.
   - Use bold titles, headers (###, ####), bullet points (-), and clean spacing.
   - NEVER output scattered, disjointed, or chaotic text. Keep responses polished, clear, and easy to scan.
3. **Professional & Grounded Tone**:
   - Be helpful, polite, confident, and professional.
   - Do NOT exaggerate or boast. State facts, real technologies used, and verifiable metrics without hyperbole.
4. **Strict Security & Privacy Safeguards**:
   - NEVER reveal internal environment variables, database connection strings (MongoDB URIs), API keys, secret credentials, backend server ports, or private developer files.
   - Do NOT provide internal admin URLs or reveal backend server architecture details that could compromise security.
   - Only share the official public contact channels listed above.
5. **Academic Integrity Policy**:
   - Politely refuse requests for university homework, exams, plagiarism, or Final Year Projects (FYP) for academic submission. We build commercial software, startup products, and business applications.`;
  }

  /**
   * Stream response over Server-Sent Events (SSE)
   */
  public static async streamResponse(
    userMessage: string,
    history: Array<{ role: string; content: string }> = [],
    onEvent: (event: { type: string; [key: string]: any }) => void,
    onComplete: (finalResult: ChatCompletionResult) => Promise<void>
  ): Promise<void> {
    const context = await this.retrieveWebsiteContext(userMessage);
    const fullResult = await this.generateResponse(userMessage, history);

    // 1. Emit initial event with metadata & citations
    onEvent({
      type: 'start',
      citations: fullResult.citations,
      intentDetected: fullResult.intentDetected,
      suggestedAction: fullResult.suggestedAction
    });

    const { apiKey, model } = this.getGeminiConfig();

    // 2. If Gemini API Key is provided and not academic refusal, stream live from Gemini LLM
    if (apiKey && apiKey.length > 10 && fullResult.intentDetected !== 'academic_refusal') {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
        const systemPrompt = this.buildSystemPrompt(context);

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...history.slice(-4).map((h) => ({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }]
              })),
              { role: 'user', parts: [{ text: userMessage }] }
            ],
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            }
          })
        });

        if (geminiRes.ok && geminiRes.body) {
          const reader = geminiRes.body.getReader();
          const decoder = new TextDecoder();
          let accumulatedReply = '';
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.replace('data: ', '').trim();
                if (jsonStr) {
                  try {
                    const parsed = JSON.parse(jsonStr);
                    const candidate = parsed.candidates?.[0];
                    const token = candidate?.content?.parts?.[0]?.text;
                    if (token) {
                      accumulatedReply += token;
                      onEvent({ type: 'token', token });
                    }
                  } catch {}
                }
              }
            }
          }

          if (accumulatedReply.trim()) {
            const geminiResult: ChatCompletionResult = {
              reply: accumulatedReply,
              citations: fullResult.citations,
              intentDetected: fullResult.intentDetected,
              leadPromptSuggested: fullResult.leadPromptSuggested,
              suggestedAction: fullResult.suggestedAction
            };
            onEvent({
              type: 'done',
              fullReply: accumulatedReply,
              citations: fullResult.citations,
              suggestedAction: fullResult.suggestedAction
            });
            await onComplete(geminiResult);
            return;
          }
        }
      } catch (geminiError) {
        console.warn('Gemini streaming fallback to local RAG generator:', geminiError);
      }
    }

    // 3. High-Fidelity Local RAG Token Streamer (smooth 20-35ms chunks)
    const tokens = fullResult.reply.match(/\S+\s*/g) || [fullResult.reply];
    for (const token of tokens) {
      onEvent({ type: 'token', token });
      await new Promise((resolve) => setTimeout(resolve, 25));
    }

    // 4. Emit completion event
    onEvent({
      type: 'done',
      fullReply: fullResult.reply,
      citations: fullResult.citations,
      suggestedAction: fullResult.suggestedAction
    });

    await onComplete(fullResult);
  }

  /**
   * Convert an escalated chat inquiry into a qualified Lead in MongoDB
   */
  public static async captureChatLead(data: {
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    summary: string;
    source?: string;
  }) {
    const lead = await Lead.create({
      type: 'chat_escalation',
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || '',
      company: data.company || '',
      projectDescription: data.summary,
      status: 'new',
      priority: 'high',
      source: data.source || 'ai_chatbot_ask_solo'
    });

    return lead;
  }
}

