import { Service, CaseStudy, BlogPost, FAQ, Testimonial, SiteSettings } from '../types';

const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  const rawUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000/api/v1';

  let cleanUrl = rawUrl.replace(/\/+$/, '');
  if (!cleanUrl.endsWith('/api/v1')) {
    cleanUrl = `${cleanUrl}/api/v1`;
  }
  return cleanUrl;
};

const API_BASE = getApiBase();

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `API request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`API fetch error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Services
  getServices: async (params?: { category?: string }) => {
    const query = params?.category ? `?category=${encodeURIComponent(params.category)}` : '';
    return fetchAPI<{ success: boolean; data: Service[] }>(`/services${query}`);
  },
  getCategories: async () => {
    return fetchAPI<{ success: boolean; data: Array<{ _id?: string; name: string; slug: string; description?: string; serviceCount?: number }> }>('/services/categories');
  },
  getServiceBySlug: async (slug: string) => {
    return fetchAPI<{ success: boolean; data: Service; relatedCaseStudies?: CaseStudy[] }>(`/services/${slug}`);
  },

  // Case Studies
  getCaseStudies: async (featured?: boolean) => {
    const query = featured ? '?featured=true' : '';
    return fetchAPI<{ success: boolean; data: CaseStudy[] }>(`/case-studies${query}`);
  },
  getCaseStudyBySlug: async (slug: string) => {
    return fetchAPI<{ success: boolean; data: CaseStudy }>(`/case-studies/${slug}`);
  },

  // Blog
  getBlogPosts: async (params?: { category?: string; tag?: string; search?: string; page?: number; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set('category', params.category);
    if (params?.tag) queryParams.set('tag', params.tag);
    if (params?.search) queryParams.set('search', params.search);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.featured) queryParams.set('featured', 'true');
    const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI<{ success: boolean; data: BlogPost[]; pagination: { total: number; pages: number } }>(`/blog${qs}`);
  },
  getBlogPostBySlug: async (slug: string) => {
    return fetchAPI<{ success: boolean; data: BlogPost; relatedPosts?: BlogPost[] }>(`/blog/${slug}`);
  },
  getTaxonomies: async () => {
    return fetchAPI<{ success: boolean; data: { categories: any[]; tags: any[] } }>('/blog/taxonomies');
  },

  // FAQs & Testimonials
  getFaqs: async (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return fetchAPI<{ success: boolean; data: FAQ[] }>(`/faqs${query}`);
  },
  getTestimonials: async (all?: boolean) => {
    return fetchAPI<{ success: boolean; data: Testimonial[] }>(all ? '/testimonials?all=true' : '/testimonials');
  },

  // Site Settings
  getSettings: async () => {
    return fetchAPI<{ success: boolean; data: SiteSettings }>('/settings');
  },

  // Lead Generation & Project Kickoff
  submitLead: async (data: any) => {
    return fetchAPI<{ success: boolean; message: string; data: any }>('/leads/start-a-project', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  submitContact: async (data: any) => {
    return fetchAPI<{ success: boolean; message: string; data?: { id?: string; whatsappDirectUrl?: string } }>('/leads/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  subscribeNewsletter: async (email: string, source = 'website') => {
    return fetchAPI<{ success: boolean; message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, source })
    });
  },

  // Ask Solo AI Chatbot
  initChatSession: async (sessionId?: string) => {
    return fetchAPI<{ success: boolean; data: { sessionId: string; messages: any[] } }>('/chat/session', {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    });
  },
  sendChatMessage: async (sessionId: string, message: string) => {
    return fetchAPI<{
      success: boolean;
      data: {
        reply: string;
        citations: any[];
        intentDetected: string;
        leadPromptSuggested: boolean;
        suggestedAction: string;
      };
    }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ sessionId, message })
    });
  },
  escalateChatToLead: async (data: { sessionId: string; fullName: string; email: string; phone?: string; company?: string; summary?: string }) => {
    return fetchAPI<{ success: boolean; message: string }>('/chat/escalate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  streamChatMessage: async (
    sessionId: string,
    message: string,
    callbacks: {
      onStart?: (data: { citations: any[]; intentDetected: string; suggestedAction?: string }) => void;
      onToken: (token: string, accumulated: string) => void;
      onDone: (data: { reply: string; citations?: any[]; suggestedAction?: string }) => void;
      onError?: (err: any) => void;
    }
  ) => {
    try {
      const response = await fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message })
      });

      if (!response.ok || !response.body) {
        throw new Error(`SSE streaming failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.replace('data: ', '').trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'start') {
                callbacks.onStart?.(event);
              } else if (event.type === 'token' && event.token) {
                accumulated += event.token;
                callbacks.onToken(event.token, accumulated);
              } else if (event.type === 'done') {
                callbacks.onDone({
                  reply: event.fullReply || accumulated,
                  citations: event.citations,
                  suggestedAction: event.suggestedAction
                });
                return;
              } else if (event.type === 'error') {
                throw new Error(event.error || 'Server stream error');
              }
            } catch (err) {
              console.warn('Error parsing SSE event chunk:', err);
            }
          }
        }
      }

      // If stream ended without explicit done event
      callbacks.onDone({ reply: accumulated });
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError(error);
      } else {
        throw error;
      }
    }
  }
};
