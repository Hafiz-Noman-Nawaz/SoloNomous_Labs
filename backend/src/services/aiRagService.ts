import { KnowledgeDocument, IKnowledgeDocument } from '../models/KnowledgeAndChat';
import { Lead } from '../models/Lead';

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

    // 12. Owner & Founder
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

    // 13. Past projects / Portfolio
    if (
      q.includes('portfolio') ||
      q.includes('project') ||
      q.includes('projects') ||
      q.includes('case study') ||
      q.includes('work') ||
      q.includes('demo')
    ) {
      return { intent: 'portfolio_inquiry', categoryHint: 'case_studies', shouldCaptureLead: false };
    }

    // 14. What do you do
    if (
      q.includes('what do you do') ||
      q.includes('what does solonomous labs do') ||
      q.includes('what you guys do') ||
      q.includes('about company') ||
      q.includes('who are you')
    ) {
      return { intent: 'company_overview', categoryHint: 'company', shouldCaptureLead: false };
    }

    // 15. Contact
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
    limit = 3
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

      // If still empty, return general company knowledge
      if (docs.length === 0) {
        docs = await KnowledgeDocument.find({ active: true }).limit(2);
      }

      return docs;
    } catch (error) {
      console.warn('Knowledge retrieval error (continuing with default fallback):', error);
      return [];
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
    const retrievedDocs = await this.retrieveRelevantKnowledge(userMessage);
    const q = userMessage.toLowerCase();

    const citations = retrievedDocs.map((doc) => ({
      title: doc.title,
      category: doc.category,
      sourceUrl: doc.sourceUrl || `/knowledge/${doc._id}`
    }));

    // Ensure official portfolio is cited for owner/portfolio queries
    if ((intent === 'owner_inquiry' || intent === 'portfolio_inquiry') && !citations.some(c => c.sourceUrl?.includes('nouman-nawaz.dev'))) {
      citations.unshift({
        title: 'Noman Nawaz — Personal Portfolio & Live Projects',
        category: 'case_studies',
        sourceUrl: 'https://www.nouman-nawaz.dev/'
      });
    }

    // Ensure verified Fiverr profile is cited for hiring queries
    if ((intent === 'hire_inquiry' || intent === 'pricing_inquiry') && !citations.some(c => c.sourceUrl?.includes('fiverr.com'))) {
      citations.push({
        title: 'Noman Nawaz — Verified Fiverr Profile',
        category: 'services',
        sourceUrl: 'https://www.fiverr.com/nomannawaz67'
      });
    }

    let reply = '';
    let suggestedAction: 'schedule_call' | 'start_a_project' | 'view_service' | 'none' = 'none';

    // ==================== INTENT SYNTHESIS ENGINE ====================

    // 1. Strict Academic Policy Refusal
    if (intent === 'academic_refusal') {
      reply =
        "No, SoloNomous Labs does not create university assignments, homework, or Final Year Projects (FYPs) for academic submission.\n\nWe are a professional software and AI product studio focused exclusively on building real-world software, commercial web applications, and startup products for businesses and entrepreneurs. If you are developing a genuine commercial application or startup idea, we would be glad to help you architect and build it.";
      suggestedAction = 'none';
    }

    // 2. Company Overview ("What does SoloNomous Labs do?")
    else if (intent === 'company_overview') {
      reply =
        "SoloNomous Labs is a professional **Software & AI Product Studio** led by founder and principal engineer Noman Nawaz. We build practical websites, custom web applications, SaaS MVPs, e-commerce platforms, AI chatbots, and machine-learning solutions for businesses, startups, and entrepreneurs.\n\nRather than selling cheap templates or generic marketing services, we engineer production-ready, custom software designed to solve actual operational problems and grow your business.";
      suggestedAction = 'view_service';
    }

    // 3. Pricing Specifics
    else if (intent === 'pricing_inquiry') {
      if (q.includes('simple business website') || q.includes('simple website')) {
        reply =
          "A professional business website starts from **$250 USD**. The final price depends on the number of pages, custom design complexity, integrations, and content requirements.";
        suggestedAction = 'start_a_project';
      } else if (q.includes('full-stack') || q.includes('full stack')) {
        reply =
          "Full-stack web applications start from **$500 USD** because they include dedicated backend functionality, custom databases (MongoDB or PostgreSQL), authentication, and custom business workflows.";
        suggestedAction = 'start_a_project';
      } else if (q.includes('online store') || q.includes('e-commerce') || q.includes('ecommerce')) {
        reply =
          "Our custom e-commerce websites start from **$500 USD**. The final price depends on your product catalog size, checkout flow, customer accounts, order management features, and payment integrations.";
        suggestedAction = 'start_a_project';
      } else if (q.includes('chatbot') || q.includes('ai bot')) {
        reply =
          "A dedicated AI chatbot starts from **$400 USD**. It includes a conversational chat interface, streaming responses, suggested questions, lead capture, and deployment on your site.";
        suggestedAction = 'start_a_project';
      } else if (q.includes('rag') || q.includes('knowledge-based') || q.includes('knowledge base')) {
        reply =
          "Our RAG (Retrieval-Augmented Generation) and knowledge-based AI systems start from **$750 USD**. This includes document ingestion pipelines, vector embeddings, semantic vector search, and grounded AI responses with verifiable source citations.";
        suggestedAction = 'start_a_project';
      } else if (q.includes('maintenance')) {
        reply =
          "Website maintenance and continuous development starts from **$100 USD per month**. The final arrangement depends on how much dedicated development time, update frequency, and monitoring support your application needs.";
        suggestedAction = 'start_a_project';
      } else if (q.includes('ai website')) {
        reply =
          "If you mean a website with AI functionality, the price depends on what the AI needs to do. Basic AI integration starts from **$300 USD**, while a dedicated conversational AI chatbot starts from **$400 USD**. More advanced RAG or knowledge-based AI systems start from **$750 USD**.";
        suggestedAction = 'start_a_project';
      } else if (q.includes('$500') || q.includes('500 dollars') || q.includes('500 usd')) {
        reply =
          "With a budget of $500 USD, we can build:\n• A complete **Business Website** (starts from $250 USD) with custom pages, SEO setup, and mobile responsiveness.\n• A **Full-Stack Web Application** (starts from $500 USD) with custom backend, database, and user login.\n• An **E-Commerce Storefront** (starts from $500 USD) with product catalog, cart, and checkout flow.\n• An **AI Chatbot** (starts from $400 USD) or **AI Workflow Integration** (starts from $300 USD).\n\nWhat type of project are you looking to launch?";
        suggestedAction = 'start_a_project';
      } else {
        reply =
          "Our services are priced transparently as starting prices in USD:\n• **Business Website Development**: Starting from $250 USD\n• **Full-Stack Web Application**: Starting from $500 USD\n• **SaaS MVP Development**: Starting from $1,000 USD\n• **E-Commerce Development**: Starting from $500 USD\n• **AI Chatbot Development**: Starting from $400 USD\n• **RAG Knowledge AI Systems**: Starting from $750 USD\n• **Website Maintenance**: Starting from $100 USD/month\n\nEvery price is a starting price; the final scope depends on your specific features and requirements.";
        suggestedAction = 'start_a_project';
      }
    }

    // 4. Restaurant / Small Business Scenario
    else if (intent === 'small_biz_website') {
      reply =
        "For a restaurant or local business, I recommend starting with our **Business Website Development** service (starting from **$250 USD**).\n\nThis gives you a fast, mobile-friendly website showcasing your menu, location, operating hours, photos, and contact/reservation inquiries. You do not need a complex full-stack web application unless you need custom table reservations, live online food delivery ordering, or customer account management.";
      suggestedAction = 'start_a_project';
    }

    // 5. SaaS Idea Scoping
    else if (intent === 'saas_inquiry') {
      reply =
        "If you have a software startup idea, I recommend our **SaaS MVP Development** service (starting from **$1,000 USD**).\n\nRather than spending months building every speculative feature, an MVP (Minimum Viable Product) focuses on the core features your early users need to get value. It includes user authentication, the primary functional tool, user dashboard, admin controls, and production deployment so you can begin acquiring real users quickly.";
      suggestedAction = 'start_a_project';
    }

    // 6. Adding AI to Existing Website
    else if (intent === 'add_ai_existing') {
      reply =
        "Yes, absolutely! We can integrate AI directly into your existing website through our **AI Integration & Automation** service (starting from **$300 USD**) or build an interactive **AI Chatbot** (starting from **$400 USD**).\n\nWe connect to your current codebase via clean APIs without requiring you to rebuild your website from scratch.";
      suggestedAction = 'start_a_project';
    }

    // 7. Answering from Documents (RAG)
    else if (intent === 'document_ai') {
      reply =
        "For an AI that answers questions accurately from your company's documents, PDFs, manuals, or internal databases, you need our **RAG & Knowledge-Based AI Systems** service (starting from **$750 USD**).\n\nRAG (Retrieval-Augmented Generation) converts your company documents into searchable vector embeddings. When a user asks a question, the AI retrieves the exact verified facts from your files first, preventing hallucinations and ensuring grounded, trustworthy answers with source citations.";
      suggestedAction = 'start_a_project';
    }

    // 8. Website Slow / Speed Optimization
    else if (intent === 'speed_slow_website') {
      reply =
        "Before rebuilding your website from scratch, I recommend our **Website Performance & Technical SEO** service (starting from **$150 USD**).\n\nWe conduct a thorough audit of your Core Web Vitals, compress heavy images, optimize script loading, and streamline database queries. In most cases, targeted technical optimizations can drastically improve loading speed and search engine rankings much more cost-effectively than a full rebuild.";
      suggestedAction = 'start_a_project';
    }

    // 9. User accounts, orders, and registration
    else if (intent === 'orders_and_accounts') {
      reply =
        "Because you need customer registration, logins, and order management, a static website won't be enough. I recommend our **E-Commerce Development** service (starting from **$500 USD**) or a **Full-Stack Web Application** (starting from **$500 USD**).\n\nThis includes secure customer accounts, database storage for order records, a shopping cart/checkout flow, and an administrative dashboard where your team can track and fulfill orders.";
      suggestedAction = 'start_a_project';
    }

    // 10. Technology Stack
    else if (intent === 'tech_stack_inquiry') {
      reply =
        "SoloNomous Labs works with proven, production-grade technologies:\n• **Web & Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion\n• **Backend & Databases**: Node.js, Express.js, MongoDB, PostgreSQL, REST APIs, JWT, Clerk\n• **AI & Machine Learning**: Python, Pandas, NumPy, Scikit-learn, Vector Databases, Embeddings, RAG pipelines, LLM APIs\n\nWe choose the technology stack based on what delivers the highest speed, security, and long-term maintainability for your project.";
      suggestedAction = 'view_service';
    }

    // 11. Hiring & How to Start
    else if (intent === 'hire_inquiry') {
      reply =
        "You can hire SoloNomous Labs easily through three straightforward paths:\n1. **Start a Project Form**: Submit your project requirements directly on our website at [/contact](/contact).\n2. **Direct WhatsApp / Email**: Message founder Noman Nawaz on WhatsApp at **+92 315 6251281** or email **nawaznoman7766@gmail.com** for a direct consultation.\n3. **Verified Fiverr Profile**: If you prefer standardized milestone protections, you can order directly through Noman's verified [Fiverr Profile](https://www.fiverr.com/nomannawaz67).\n\nWe typically review briefs and respond with a scoping proposal within 2 to 4 business hours.";
      suggestedAction = 'start_a_project';
    }

    // 12. Recommendation Inquiry ("I don't know what service I need")
    else if (intent === 'recommendation_inquiry') {
      reply =
        "That's completely fine! You don't need to know the technical jargon—we're here to help guide you. To recommend the best solution, could you share:\n1. What is the main goal or problem you want to solve?\n2. Is this for an existing business or a brand-new idea?\n3. Do your users need to create accounts, buy products, or manage data?\n\nOnce you share a few details, I will recommend the most cost-effective service for your needs.";
      suggestedAction = 'schedule_call';
    }

    // 13. Owner & Founder
    else if (intent === 'owner_inquiry') {
      reply =
        "The founder and principal systems architect of SoloNomous Labs is **Noman Nawaz** (Nouman Nawaz). Noman is an experienced Full-Stack Software Engineer & ML Developer specializing in Next.js, the MERN stack, and AI engineering. You can view his verified portfolio and background at **[https://www.nouman-nawaz.dev/](https://www.nouman-nawaz.dev/)** or contact him directly on WhatsApp at **+92 315 6251281**.";
      suggestedAction = 'view_service';
    }

    // 14. Projects / Case Studies
    else if (intent === 'portfolio_inquiry') {
      reply =
        "You can explore real-world software architectures engineered by Noman Nawaz directly on his portfolio: **[https://www.nouman-nawaz.dev/](https://www.nouman-nawaz.dev/)**.\n\nFeatured flagship projects include:\n• **ZeoAtlas**: An autonomous AI workspace featuring real-time web search grounding, sub-5ms ML classification, and SSE streaming inference.\n• **Zashas**: A high-performance modern e-commerce storefront engineered with Next.js, React 19, Node.js, and MongoDB.\n\nWe've also engineered custom full-stack SaaS portals, RAG pipelines, and API architectures across various client engagements.";
      suggestedAction = 'view_service';
    }

    // 15. Direct Contact Escalation
    else if (intent === 'human_escalation') {
      reply =
        "You can connect directly with Noman Nawaz via:\n• **WhatsApp / Phone**: +92 315 6251281\n• **Email**: nawaznoman7766@gmail.com\n• **Portfolio**: [https://www.nouman-nawaz.dev/](https://www.nouman-nawaz.dev/)\n• **Fiverr Profile**: [https://www.fiverr.com/nomannawaz67](https://www.fiverr.com/nomannawaz67)\n\nTypical response time is within 2 to 4 business hours!";
      suggestedAction = 'schedule_call';
    }

    // 16. Fallback with Retrieved Knowledge Grounding
    else {
      if (retrievedDocs.length > 0) {
        const topDoc = retrievedDocs[0];
        reply = `${topDoc.chunkSummary}\n\nAt SoloNomous Labs, led by Noman Nawaz, we specialize in high-performance digital products, full-stack Next.js/React applications, and practical AI systems. Feel free to ask about any specific service or project requirement!`;
      } else {
        reply =
          "SoloNomous Labs is a professional software & AI product studio led by Noman Nawaz. We build high-performance business websites, full-stack web applications, SaaS MVPs, e-commerce stores, and AI systems. How can we help your business today?";
      }
    }

    // ==================== LIVE GEMINI LLM GROUNDED SYNTHESIS ====================
    const { apiKey, model } = this.getGeminiConfig();
    if (apiKey && apiKey.length > 10 && intent !== 'academic_refusal') {
      try {
        const systemPrompt = this.buildSystemPrompt(retrievedDocs);
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
   * Helper: Build grounded system prompt with retrieved RAG knowledge
   */
  public static buildSystemPrompt(retrievedDocs: IKnowledgeDocument[]): string {
    const knowledgeSnippets =
      retrievedDocs.length > 0
        ? retrievedDocs
            .map((d) => `[Source: ${d.title} (${d.category})]:\n${d.content || d.chunkSummary}`)
            .join('\n\n')
        : 'SoloNomous Labs is an AI, Software & Digital Product Engineering Studio founded by Noman Nawaz.';

    return `You are Solo, the AI solutions assistant for SoloNomous Labs, founded by Noman Nawaz.
Founder Profile: Noman Nawaz is a Full-Stack Software Engineer & ML Developer specializing in Next.js, MERN, and AI systems.
Personal Portfolio: https://www.nouman-nawaz.dev/
Fiverr Profile: https://www.fiverr.com/nomannawaz67
Phone/WhatsApp: +92 315 6251281
Email: nawaznoman7766@gmail.com

RETRIEVED KNOWLEDGE BASE (Grounded Facts):
${knowledgeSnippets}

GUIDELINES & BEHAVIOR:
1. Always ground your responses in SoloNomous Labs services: SaaS MVP Development, Full-Stack Web Applications, AI Integration/RAG, E-Commerce, and Website Performance/SEO.
2. Academic Policy: Politely refuse homework, college assignments, exams, plagiarism, or FYPs. SoloNomous Labs builds commercial software and business solutions.
3. Be helpful, professional, and concise. Format responses in clean Markdown.
4. When relevant, invite the user to start a project at /contact or reach out to Noman on WhatsApp (+92 315 6251281).`;
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
    const retrievedDocs = await this.retrieveRelevantKnowledge(userMessage);
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
        const systemPrompt = this.buildSystemPrompt(retrievedDocs);

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
