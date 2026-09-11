'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Briefcase,
  Users,
  BookOpen,
  Settings,
  Plus,
  Sparkles,
  Share2,
  ExternalLink,
  Save,
  Loader2,
  Copy,
  Check,
  Image as ImageIcon,
  User,
  ShieldCheck,
  Lock,
  LogOut,
  UserPlus,
  Trash2,
  Edit3,
  AlertTriangle,
  KeyRound,
  ShieldAlert,
  X,
  Eye,
  MessageSquare,
  Star
} from 'lucide-react';
import { SiteSettings } from '@/types';
import { CloudinaryUploadWidget } from '@/components/ui/CloudinaryUploadWidget';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

interface AdminPermissions {
  canManageLeads: boolean;
  canManageBlog: boolean;
  canManageServices: boolean;
  canManageCaseStudies: boolean;
  canManageKnowledge: boolean;
  canManageSettings: boolean;
  canManageTeam: boolean;
}

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'manager' | 'employee';
  permissions: AdminPermissions;
  lastLogin?: string;
}

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'manager' | 'employee';
  permissions: AdminPermissions;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
}

export default function AdminPortalPage() {
  // Auth state
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(null);
  const [isSetupRequired, setIsSetupRequired] = useState<boolean | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Auth Forms
  const [loginEmail, setLoginEmail] = useState('nawaznoman7766@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');

  const [setupName, setSetupName] = useState('Noman Nawaz');
  const [setupEmail, setSetupEmail] = useState('nawaznoman7766@gmail.com');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'blog' | 'services' | 'caseStudies' | 'testimonials' | 'knowledge' | 'settings' | 'team'>('overview');
  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Content Data
  const [leads, setLeads] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Team Management State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberLoading, setNewMemberLoading] = useState(false);
  const [newMemberError, setNewMemberError] = useState<string | null>(null);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee' as 'manager' | 'employee',
    permissions: {
      canManageLeads: true,
      canManageBlog: true,
      canManageServices: false,
      canManageCaseStudies: false,
      canManageKnowledge: false,
      canManageSettings: false,
      canManageTeam: false
    }
  });

  // Selected item for modal / edit / social repurposing
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [copiedSocial, setCopiedSocial] = useState<string | null>(null);

  // ==================== BLOG CRUD MODALS ====================
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [blogForm, setBlogForm] = useState({
    _id: '',
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    readingTimeMinutes: 5,
    status: 'published',
    featuredImage: { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' }
  });

  // ==================== SERVICE CRUD MODALS ====================
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceFormMode, setServiceFormMode] = useState<'create' | 'edit'>('create');
  const [serviceForm, setServiceForm] = useState({
    _id: '',
    title: '',
    slug: '',
    badge: 'Flagship Offering',
    startingPrice: 500,
    pricingInterval: 'one_time' as 'one_time' | '/month' | '/year' | '/week' | '',
    category: 'Web & Product',
    summary: '',
    description: '',
    deliverables: '',
    techStack: ''
  });

  // ==================== CASE STUDY CRUD MODALS ====================
  const [showCaseStudyModal, setShowCaseStudyModal] = useState(false);
  const [caseStudyFormMode, setCaseStudyFormMode] = useState<'create' | 'edit'>('create');
  const [caseStudyForm, setCaseStudyForm] = useState({
    _id: '',
    title: '',
    slug: '',
    client: '',
    industry: 'Enterprise Technology',
    overview: '',
    challenge: '',
    solution: '',
    resultsMetric: '99.99% Reliability',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  });

  // ==================== KNOWLEDGE BASE CRUD MODALS ====================
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [knowledgeFormMode, setKnowledgeFormMode] = useState<'create' | 'edit'>('create');
  const [knowledgeForm, setKnowledgeForm] = useState({
    _id: '',
    title: '',
    category: 'services',
    chunkSummary: '',
    content: '',
    tags: 'engineering, saas, ai'
  });

  // ==================== TESTIMONIAL CRUD MODALS ====================
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialFormMode, setTestimonialFormMode] = useState<'create' | 'edit'>('create');
  const [testimonialForm, setTestimonialForm] = useState({
    _id: '',
    clientName: '',
    role: '',
    company: '',
    avatar: '',
    content: '',
    rating: 5,
    featured: true,
    active: true
  });

  // ==================== LEAD DETAILS MODAL ====================
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Settings State
  const [settings, setSettings] = useState<SiteSettings>({
    companyName: 'SoloNomous Labs',
    brandTagline: 'Engineering Autonomous Systems & High-Precision Digital Products',
    contactEmail: 'contact@solonomouslabs.com',
    contactPhone: '+1 (555) 019-8234',
    whatsappNumber: '+15550198234',
    officeAddress: 'Remote-First Engineering Studio | Silicon Valley / Global',
    responseTimeNotice: 'Typical engineer response within 4 business hours',
    brandingAssets: {
      logoDark: '/assets/branding/SoloNomous_Dark_theme.jfif',
      logoLight: '/assets/branding/SoloNomous_Light_theme.jfif',
      favicon: '/assets/branding/dark_favicon.png',
      mark: '/assets/branding/flask-icon.svg'
    },
    heroSection: {
      badgeText: 'Autonomous Systems & Advanced Software Studio',
      headline: 'We build serious digital products, not just websites.',
      subheadline: 'SoloNomous Labs combines experimental research rigor with production engineering reliability. We design and deploy high-throughput web applications, scalable multi-tenant SaaS platforms, and enterprise AI engines.',
      primaryCta: 'Start a Project',
      secondaryCta: 'Explore Capabilities'
    },
    aboutSection: {
      storyHeadline: 'Where experimental rigor meets production reliability.',
      storyContent: 'SoloNomous Labs was created to counter the tide of superficial digital templates. We are an autonomous software laboratory and advanced technology studio, engineering resilient digital products designed to scale from early-stage inception to enterprise volume.',
      mission: 'To provide visionary founders and technical teams with institutional-grade software architecture, accelerating time-to-market without compromising on code quality, security, or future maintainability.',
      philosophy: 'We believe code is an asset only when it is rigorously tested and easily understood. We favor explicit type safety, decoupled modular domains, and deterministic validation over transient hype.',
      futureDirection: 'As software shifts toward autonomous systems and intelligent architectures, we are pioneering verifiable systems that operate deterministically inside mission-critical enterprise workflows.',
      founderImage: '',
      founderName: 'Noman Nawaz',
      founderTitle: 'Founder & Principal Systems Engineer',
      founderBio: 'Dedicated to high-performance systems engineering, resilient distributed architectures, and precision software delivery.'
    },
    socialLinks: {
      github: 'https://github.com/solonomouslabs',
      linkedin: 'https://linkedin.com/company/solonomouslabs',
      xTwitter: 'https://x.com/solonomouslabs',
      instagram: 'https://instagram.com/solonomouslabs'
    }
  });

  // Check setup status and existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      setAuthChecking(true);
      try {
        const statusRes = await fetch('/api/v1/admin-auth/setup-status').then(r => r.json());
        const needsSetup = statusRes?.data?.hasSuperadmin === false;
        setIsSetupRequired(needsSetup);

        const savedToken = localStorage.getItem('solonomous_admin_token');
        if (savedToken) {
          const meRes = await fetch('/api/v1/admin-auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` }
          }).then(r => r.json());

          if (meRes.success && meRes.data?.adminUser) {
            setAdminToken(savedToken);
            setAdminUser(meRes.data.adminUser);
          } else {
            localStorage.removeItem('solonomous_admin_token');
          }
        }
      } catch (err) {
        console.error('Failed checking admin setup/auth:', err);
      } finally {
        setAuthChecking(false);
      }
    };

    initAuth();
  }, []);

  // Fetch CMS Data with Auth Header
  const fetchData = useCallback(async () => {
    const token = adminToken || localStorage.getItem('solonomous_admin_token');
    if (!token) return;

    setLoading(true);
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const [leadsRes, blogRes, svcRes, csRes, knowRes, setRes, teamRes, testRes] = await Promise.all([
        fetch('/api/v1/leads/admin/leads', { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/blog/admin/all', { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/services/admin/all', { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/case-studies/admin/all', { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/knowledge', { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/settings').then(r => r.json()).catch(() => ({ data: null })),
        fetch('/api/v1/admin-auth/team', { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/testimonials?all=true').then(r => r.json()).catch(() => ({ data: [] }))
      ]);

      setLeads(leadsRes.data || []);
      setBlogPosts(blogRes.data || []);
      setServices(svcRes.data || []);
      setCaseStudies(csRes.data || []);
      setKnowledgeDocs(knowRes.data || []);
      setTeamMembers(teamRes.data || []);
      setTestimonials(testRes.data || []);

      if (setRes.data) {
        setSettings(prev => ({
          ...prev,
          ...setRes.data,
          brandingAssets: { ...prev.brandingAssets, ...(setRes.data.brandingAssets || {}) },
          heroSection: { ...prev.heroSection, ...(setRes.data.heroSection || {}) },
          aboutSection: { ...prev.aboutSection, ...(setRes.data.aboutSection || {}) }
        }));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminUser && adminToken) {
      fetchData();
    }
  }, [adminUser, adminToken, fetchData]);

  // Handle Initial Superadmin Setup
  const handleSetupSuperadmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (setupPassword !== setupConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter.');
      return;
    }

    if (setupPassword.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/v1/admin-auth/setup-superadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: setupName,
          email: setupEmail,
          password: setupPassword
        })
      }).then(r => r.json());

      if (!res.success) {
        throw new Error(res.message || 'Setup failed');
      }

      localStorage.setItem('solonomous_admin_token', res.data.token);
      setAdminToken(res.data.token);
      setAdminUser(res.data.adminUser);
      setIsSetupRequired(false);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to initialize Superadmin account.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/v1/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      }).then(r => r.json());

      if (!res.success) {
        throw new Error(res.message || 'Invalid credentials');
      }

      localStorage.setItem('solonomous_admin_token', res.data.token);
      setAdminToken(res.data.token);
      setAdminUser(res.data.adminUser);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('solonomous_admin_token');
    setAdminToken(null);
    setAdminUser(null);
    setActiveTab('overview');
  };

  // ==================== BLOG ACTIONS ====================
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const catId = blogPosts[0]?.category?._id || '650000000000000000000001';
      const res = await fetch('/api/v1/blog/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...blogForm,
          category: catId
        })
      }).then(r => r.json());

      if (res.success) {
        setShowNewPostModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Create post failed:', err);
    }
  };

  const handleOpenEditPost = (post: any) => {
    setBlogForm({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      category: post.category?._id || '',
      excerpt: post.excerpt,
      content: post.content,
      readingTimeMinutes: post.readingTimeMinutes || 5,
      status: post.status,
      featuredImage: post.featuredImage || { url: '' }
    });
    setShowEditPostModal(true);
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/blog/admin/${blogForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(blogForm)
      }).then(r => r.json());

      if (res.success) {
        setShowEditPostModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Update post failed:', err);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete article "${title}"?`)) return;
    try {
      await fetch(`/api/v1/blog/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      fetchData();
    } catch (err) {
      console.error('Delete post failed:', err);
    }
  };

  // ==================== SERVICE ACTIONS ====================
  const handleOpenNewService = () => {
    setServiceFormMode('create');
    setServiceForm({
      _id: '',
      title: '',
      slug: '',
      badge: 'Core Capability',
      startingPrice: 250,
      pricingInterval: 'one_time',
      category: 'Web & Product',
      summary: '',
      description: '',
      deliverables: '',
      techStack: ''
    });
    setShowServiceModal(true);
  };

  const handleOpenEditService = (svc: any) => {
    setServiceFormMode('edit');
    setServiceForm({
      _id: svc._id,
      title: svc.title,
      slug: svc.slug,
      badge: svc.badge || 'Flagship Offering',
      startingPrice: svc.startingPrice ?? 250,
      pricingInterval: svc.pricingInterval || 'one_time',
      category: svc.category || 'Web & Product',
      summary: svc.summary || '',
      description: svc.description || '',
      deliverables: Array.isArray(svc.deliverables) ? svc.deliverables.join(', ') : (svc.deliverables || ''),
      techStack: Array.isArray(svc.techStack) ? svc.techStack.join(', ') : (svc.techStack || '')
    });
    setShowServiceModal(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: serviceForm.title,
        slug: serviceForm.slug || serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        badge: serviceForm.badge,
        startingPrice: Number(serviceForm.startingPrice),
        pricingInterval: serviceForm.pricingInterval,
        category: serviceForm.category,
        summary: serviceForm.summary,
        description: serviceForm.description || serviceForm.summary,
        deliverables: serviceForm.deliverables.split(',').map(s => s.trim()).filter(Boolean),
        techStack: serviceForm.techStack.split(',').map(s => s.trim()).filter(Boolean),
        displayOrder: 1,
        active: true
      };

      const url = serviceFormMode === 'create' ? '/api/v1/services/admin' : `/api/v1/services/admin/${serviceForm._id}`;
      const method = serviceFormMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.success) {
        setShowServiceModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Save service failed:', err);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete service "${title}"?`)) return;
    try {
      await fetch(`/api/v1/services/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      fetchData();
    } catch (err) {
      console.error('Delete service failed:', err);
    }
  };

  // ==================== CASE STUDY ACTIONS ====================
  const handleOpenNewCaseStudy = () => {
    setCaseStudyFormMode('create');
    setCaseStudyForm({
      _id: '',
      title: '',
      slug: '',
      client: '',
      industry: 'FinTech / High-Throughput',
      overview: '',
      challenge: '',
      solution: '',
      resultsMetric: '10x Throughput Increase',
      featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
    });
    setShowCaseStudyModal(true);
  };

  const handleOpenEditCaseStudy = (cs: any) => {
    setCaseStudyFormMode('edit');
    setCaseStudyForm({
      _id: cs._id,
      title: cs.title,
      slug: cs.slug,
      client: cs.client || '',
      industry: cs.industry || 'Technology',
      overview: cs.overview || '',
      challenge: cs.challenge || '',
      solution: cs.solution || '',
      resultsMetric: cs.metrics?.[0]?.value || '99.99% Reliability',
      featuredImage: cs.featuredImage?.url || cs.featuredImage || ''
    });
    setShowCaseStudyModal(true);
  };

  const handleSaveCaseStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: caseStudyForm.title,
        slug: caseStudyForm.slug || caseStudyForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        client: caseStudyForm.client || 'Enterprise Partner',
        industry: caseStudyForm.industry,
        overview: caseStudyForm.overview,
        challenge: caseStudyForm.challenge || caseStudyForm.overview,
        solution: caseStudyForm.solution || caseStudyForm.overview,
        metrics: [{ label: 'Performance Gain', value: caseStudyForm.resultsMetric }],
        featuredImage: { url: caseStudyForm.featuredImage },
        featured: true,
        active: true
      };

      const url = caseStudyFormMode === 'create' ? '/api/v1/case-studies/admin' : `/api/v1/case-studies/admin/${caseStudyForm._id}`;
      const method = caseStudyFormMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.success) {
        setShowCaseStudyModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Save case study failed:', err);
    }
  };

  const handleDeleteCaseStudy = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete case study "${title}"?`)) return;
    try {
      await fetch(`/api/v1/case-studies/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      fetchData();
    } catch (err) {
      console.error('Delete case study failed:', err);
    }
  };

  // ==================== KNOWLEDGE BASE ACTIONS ====================
  const handleOpenNewKnowledge = () => {
    setKnowledgeFormMode('create');
    setKnowledgeForm({
      _id: '',
      title: '',
      category: 'services',
      chunkSummary: '',
      content: '',
      tags: 'solonomous, engineering, noman'
    });
    setShowKnowledgeModal(true);
  };

  const handleOpenEditKnowledge = (doc: any) => {
    setKnowledgeFormMode('edit');
    setKnowledgeForm({
      _id: doc._id,
      title: doc.title,
      category: doc.category || 'services',
      chunkSummary: doc.chunkSummary || '',
      content: doc.content || '',
      tags: Array.isArray(doc.tags) ? doc.tags.join(', ') : (doc.tags || '')
    });
    setShowKnowledgeModal(true);
  };

  const handleSaveKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: knowledgeForm.title,
        category: knowledgeForm.category,
        chunkSummary: knowledgeForm.chunkSummary,
        content: knowledgeForm.content,
        tags: knowledgeForm.tags.split(',').map(s => s.trim()).filter(Boolean),
        active: true
      };

      const url = knowledgeFormMode === 'create' ? '/api/v1/admin/knowledge' : `/api/v1/admin/knowledge/${knowledgeForm._id}`;
      const method = knowledgeFormMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.success) {
        setShowKnowledgeModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Save knowledge doc failed:', err);
    }
  };

  const handleDeleteKnowledge = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete knowledge doc "${title}"?`)) return;
    try {
      await fetch(`/api/v1/admin/knowledge/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      fetchData();
    } catch (err) {
      console.error('Delete knowledge doc failed:', err);
    }
  };

  // ==================== TESTIMONIAL ACTIONS ====================
  const handleOpenNewTestimonial = () => {
    setTestimonialFormMode('create');
    setTestimonialForm({
      _id: '',
      clientName: '',
      role: '',
      company: '',
      avatar: '',
      content: '',
      rating: 5,
      featured: true,
      active: true
    });
    setShowTestimonialModal(true);
  };

  const handleOpenEditTestimonial = (t: any) => {
    setTestimonialFormMode('edit');
    setTestimonialForm({
      _id: t._id,
      clientName: t.clientName || '',
      role: t.role || '',
      company: t.company || '',
      avatar: t.avatar || '',
      content: t.content || '',
      rating: t.rating ?? 5,
      featured: t.featured ?? true,
      active: t.active ?? true
    });
    setShowTestimonialModal(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = testimonialFormMode === 'create'
        ? '/api/v1/admin/testimonials'
        : `/api/v1/admin/testimonials/${testimonialForm._id}`;
      const method = testimonialFormMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(testimonialForm)
      }).then(r => r.json());

      if (res.success) {
        setShowTestimonialModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Save testimonial failed:', err);
    }
  };

  const handleToggleTestimonialActive = async (t: any) => {
    try {
      await fetch(`/api/v1/admin/testimonials/${t._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ active: !t.active })
      });
      setTestimonials(prev => prev.map(item => item._id === t._id ? { ...item, active: !item.active } : item));
    } catch (err) {
      console.error('Toggle testimonial active failed:', err);
    }
  };

  const handleDeleteTestimonial = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the testimonial from "${name}"?`)) return;
    try {
      await fetch(`/api/v1/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      fetchData();
    } catch (err) {
      console.error('Delete testimonial failed:', err);
    }
  };

  // ==================== LEADS ACTIONS ====================
  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/v1/leads/admin/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete lead inquiry from "${name}"?`)) return;
    try {
      await fetch(`/api/v1/leads/admin/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setLeads(prev => prev.filter(l => l._id !== id));
      if (selectedLead?._id === id) setSelectedLead(null);
    } catch (err) {
      console.error('Delete lead failed:', err);
    }
  };

  // ==================== SETTINGS ACTIONS ====================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedSuccess(false);
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(settings)
      }).then(r => r.json());

      if (res.success) {
        setSettingsSavedSuccess(true);
        setTimeout(() => setSettingsSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  // ==================== TEAM MEMBER ACTIONS ====================
  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewMemberError(null);
    setNewMemberLoading(true);

    try {
      const res = await fetch('/api/v1/admin-auth/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(newMemberForm)
      }).then(r => r.json());

      if (!res.success) {
        throw new Error(res.message || 'Failed to create team member');
      }

      setShowAddMemberModal(false);
      setNewMemberForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        permissions: {
          canManageLeads: true,
          canManageBlog: true,
          canManageServices: false,
          canManageCaseStudies: false,
          canManageKnowledge: false,
          canManageSettings: false,
          canManageTeam: false
        }
      });
      fetchData();
    } catch (err: any) {
      setNewMemberError(err.message || 'Failed to add team member');
    } finally {
      setNewMemberLoading(false);
    }
  };

  const handleToggleMemberActive = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/v1/admin-auth/team/${member._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ active: !member.active })
      }).then(r => r.json());

      if (res.success) {
        setTeamMembers(prev => prev.map(m => m._id === member._id ? { ...m, active: !m.active } : m));
      }
    } catch (err) {
      console.error('Failed toggling status:', err);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove team member "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/admin-auth/team/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      }).then(r => r.json());

      if (res.success) {
        setTeamMembers(prev => prev.filter(m => m._id !== id));
      }
    } catch (err) {
      console.error('Failed deleting member:', err);
    }
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSocial(platform);
    setTimeout(() => setCopiedSocial(null), 2000);
  };

  // Check user permissions
  const isSuperadmin = adminUser?.role === 'superadmin';
  const perms = adminUser?.permissions;

  // Filter tabs
  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, visible: true },
    { id: 'leads', label: 'Leads & CRM', icon: Users, badge: leads.filter(l => l.status === 'new').length, visible: isSuperadmin || perms?.canManageLeads },
    { id: 'blog', label: 'Blog & Social Repurpose', icon: FileText, badge: blogPosts.length, visible: isSuperadmin || perms?.canManageBlog },
    { id: 'services', label: 'Services', icon: Layers, badge: services.length, visible: isSuperadmin || perms?.canManageServices },
    { id: 'caseStudies', label: 'Case Studies', icon: Briefcase, badge: caseStudies.length, visible: isSuperadmin || perms?.canManageCaseStudies },
    { id: 'testimonials', label: 'Testimonials', icon: Star, badge: testimonials.length, visible: isSuperadmin || perms?.canManageSettings },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, badge: knowledgeDocs.length, visible: isSuperadmin || perms?.canManageKnowledge },
    { id: 'settings', label: 'Site & Brand Settings', icon: Settings, visible: isSuperadmin || perms?.canManageSettings },
    { id: 'team', label: 'Team & Permissions', icon: ShieldCheck, badge: teamMembers.length, visible: isSuperadmin }
  ].filter(tab => tab.visible);

  // 1. Loading screen
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#07060A] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono">Authenticating SoloNomous Command Session...</p>
      </div>
    );
  }

  // 2. Setup Superadmin screen (One-time master initialization)
  if (isSetupRequired && !adminUser) {
    return (
      <div className="min-h-screen bg-[#07060A] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-md w-full glass-card p-8 sm:p-10 rounded-3xl border border-purple-500/40 text-center relative overflow-hidden shadow-2xl shadow-purple-950/50">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-400/50 mx-auto flex items-center justify-center text-white mb-5 shadow-lg shadow-purple-600/30">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Initial Master Setup Required
          </div>

          <h1 className="text-2xl font-bold font-display text-white mb-2">
            SoloNomous Studio Initialization
          </h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Initialize your primary executive administrator account to secure the CMS, configure permissions, and manage internal team access.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSetupSuperadmin} className="space-y-4 text-left text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Founder / Owner Name</label>
              <input
                type="text"
                required
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                placeholder="Enter executive name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Master Admin Email</label>
              <input
                type="email"
                required
                value={setupEmail}
                onChange={(e) => setSetupEmail(e.target.value)}
                placeholder="Enter studio administrative email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Create Master Password (min 8 chars)</label>
              <input
                type="password"
                required
                placeholder="Enter master password (min 8 characters)"
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Confirm Master Password</label>
              <input
                type="password"
                required
                placeholder="Confirm master password"
                value={setupConfirmPassword}
                onChange={(e) => setSetupConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Initialize Master Superadmin Account
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <span>SoloNomous Labs Internal RBAC</span>
            <span>•</span>
            <Link href="/" className="text-purple-400 hover:underline">
              Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Regular Login Screen (When Superadmin is initialized but user is signed out)
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#07060A] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-purple-900/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-md w-full glass-card p-8 sm:p-10 rounded-3xl border border-white/10 text-center relative overflow-hidden shadow-2xl shadow-purple-950/30">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-300 mb-5">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Studio Internal Staff Only
          </div>

          <h1 className="text-2xl font-bold font-display text-white mb-2">
            SoloNomous Studio CMS
          </h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Enter your internal credentials. Public visitors and clients must use the public portal to submit project briefs or leave reviews.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter registered administrator email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter studio master password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Sign In to Command Center
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <span>Secure Custom JWT & RBAC</span>
            <span>•</span>
            <Link href="/" className="text-purple-400 hover:underline">
              Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated CMS Dashboard
  return (
    <div className="min-h-screen bg-[#07060A] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0D0C13] border-r border-white/10 p-5 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-purple-600/30">
              SL
            </div>
            <div>
              <div className="font-bold font-display text-white text-sm">SoloNomous Labs</div>
              <div className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase">CMS Command</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navigationTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300'}`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/5 text-xs text-slate-500 space-y-2">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Back to Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-full cursor-pointer pt-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out of CMS
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white capitalize">
              {activeTab === 'overview' ? 'Command Center' : activeTab === 'settings' ? 'Brand, Copy & Site Settings' : activeTab === 'team' ? 'Team & Role Access Control' : activeTab}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Production Admin & Real-Time Content Management (Full CRUD Enabled)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Refresh Data'}
            </button>
            <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white">
                {adminUser.name}
              </div>
              <div className={`text-[10px] font-mono flex items-center justify-end gap-1 ${
                adminUser.role === 'superadmin' ? 'text-emerald-400' : adminUser.role === 'manager' ? 'text-blue-400' : 'text-purple-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {adminUser.role.toUpperCase()}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">New Inbound Leads</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold font-display text-white">
                  {leads.filter(l => l.status === 'new').length}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">High conversion priority</div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Leads</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold font-display text-white">
                  {leads.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Across all campaigns</div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Published Articles</span>
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold font-display text-white">
                  {blogPosts.filter(b => b.status === 'published').length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Driving organic SEO</div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Internal Team</span>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold font-display text-white">
                  {teamMembers.length}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">Active staff members</div>
              </div>
            </div>

            {/* Quick Actions & Recent Leads Table */}
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold font-display text-white">Recent Project Inquiries</h3>
                {(isSuperadmin || perms?.canManageLeads) && (
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    View All Leads →
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="pb-3 font-semibold">Prospect</th>
                      <th className="pb-3 font-semibold">Service Focus</th>
                      <th className="pb-3 font-semibold">Budget</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.slice(0, 5).map((l) => (
                      <tr key={l._id} className="hover:bg-white/[0.02]">
                        <td className="py-3">
                          <div className="font-semibold text-white">{l.fullName}</div>
                          <div className="text-slate-400">{l.email}</div>
                        </td>
                        <td className="py-3 text-slate-300">{l.serviceInterested || 'General'}</td>
                        <td className="py-3 text-purple-300 font-medium">{l.budgetRange || 'Unspecified'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            l.status === 'new' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-300'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400">
                          {new Date(l.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEADS & CRM (WITH DELETE AND DETAILS) */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">Lead Generation & Pipeline CRM</h3>
                  <p className="text-xs text-slate-400 mt-1">Review incoming project briefs, adjust pipeline status, or purge test inquiries.</p>
                </div>
                <div className="text-xs text-slate-400">
                  Total registered inquiries: <span className="text-white font-bold">{leads.length}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="pb-3 font-semibold">Client Name</th>
                      <th className="pb-3 font-semibold">Contact Details</th>
                      <th className="pb-3 font-semibold">Project Scope & Brief</th>
                      <th className="pb-3 font-semibold">Budget & Timeline</th>
                      <th className="pb-3 font-semibold">Pipeline Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.map((l) => (
                      <tr key={l._id} className="hover:bg-white/[0.02]">
                        <td className="py-4">
                          <div className="font-bold text-white text-sm">{l.fullName}</div>
                          {l.company && <div className="text-purple-300 font-medium">{l.company}</div>}
                        </td>
                        <td className="py-4">
                          <div className="text-slate-200">{l.email}</div>
                          {l.phone && <div className="text-slate-400">{l.phone}</div>}
                        </td>
                        <td className="py-4 max-w-xs">
                          <div className="text-purple-300 font-semibold">{l.serviceInterested}</div>
                          <div className="text-slate-300 line-clamp-2 mt-0.5">{l.projectDescription}</div>
                          <button
                            onClick={() => setSelectedLead(l)}
                            className="text-[11px] text-purple-400 hover:underline mt-1 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" /> View Full Brief
                          </button>
                        </td>
                        <td className="py-4">
                          <div className="font-semibold text-white">{l.budgetRange}</div>
                          <div className="text-slate-400">{l.timeline}</div>
                        </td>
                        <td className="py-4">
                          <select
                            value={l.status}
                            onChange={(e) => handleUpdateLeadStatus(l._id, e.target.value)}
                            className="bg-[#12111A] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-hidden focus:border-purple-500 cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="proposal">Proposal</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteLead(l._id, l.fullName)}
                            title="Delete Lead"
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-white/5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BLOG & SOCIAL REPURPOSING (WITH FULL CRUD & RICH TEXT) */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Pillar Content & Derivative Social Engine</h3>
                <p className="text-xs text-slate-400 mt-0.5">Author articles with the Word-style rich text editor and manage live posts.</p>
              </div>
              <button
                onClick={() => {
                  setBlogForm({
                    _id: '',
                    title: '',
                    slug: '',
                    category: blogPosts[0]?.category?._id || '',
                    excerpt: '',
                    content: '',
                    readingTimeMinutes: 5,
                    status: 'published',
                    featuredImage: { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' }
                  });
                  setShowNewPostModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/30"
              >
                <Plus className="w-4 h-4" /> Create New Article
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Articles List (7 cols) */}
              <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Published & Draft Posts ({blogPosts.length})</h4>
                {blogPosts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => setSelectedPost(post)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedPost?._id === post._id
                        ? 'bg-purple-600/20 border-purple-500'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          post.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-[11px] text-slate-400">{post.category?.name || 'Architecture'}</span>
                      </div>
                      <div className="text-sm font-bold text-white line-clamp-1">{post.title}</div>
                      <div className="text-xs text-slate-400">{post.views || 0} views • {post.readingTimeMinutes || 5} min read</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditPost(post);
                        }}
                        title="Edit Article"
                        className="p-2 rounded-lg bg-white/5 hover:bg-purple-600 hover:text-white text-slate-300 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post._id, post.title);
                        }}
                        title="Delete Article"
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(post);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Social
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Repurposing Panel (5 cols) */}
              <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Social Derivative Drafts</h4>
                </div>

                {selectedPost ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-400 font-medium mb-1">Selected Article:</div>
                      <div className="text-sm font-bold text-white">{selectedPost.title}</div>
                    </div>

                    {/* LinkedIn Draft */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-purple-300">LinkedIn Post</span>
                        <button
                          onClick={() => copyToClipboard(selectedPost.socialDerivatives?.linkedInPost || '', 'linkedin')}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSocial === 'linkedin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedSocial === 'linkedin' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                        {selectedPost.socialDerivatives?.linkedInPost || 'No draft generated yet.'}
                      </p>
                    </div>

                    {/* X / Twitter Draft */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-purple-300">X (Twitter) Thread Starter</span>
                        <button
                          onClick={() => copyToClipboard(selectedPost.socialDerivatives?.xPost || '', 'x')}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSocial === 'x' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedSocial === 'x' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                        {selectedPost.socialDerivatives?.xPost || 'No draft generated yet.'}
                      </p>
                    </div>

                    {/* Instagram Caption */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-purple-300">Instagram Carousel Caption</span>
                        <button
                          onClick={() => copyToClipboard(selectedPost.socialDerivatives?.instagramCaption || '', 'instagram')}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSocial === 'instagram' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedSocial === 'instagram' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                        {selectedPost.socialDerivatives?.instagramCaption || 'No draft generated yet.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Select any blog article on the left to inspect its auto-generated LinkedIn, X, and Instagram drafts.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES (FULL CRUD) */}
        {activeTab === 'services' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Active Service Offerings ({services.length})</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage pricing tiers, deliverables, and service offerings.</p>
              </div>
              <button
                onClick={handleOpenNewService}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Add New Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((svc) => (
                <div key={svc._id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-purple-400">{svc.badge}</span>
                      <span className="text-xs text-emerald-400 font-mono font-semibold">Starting: ${svc.startingPrice?.toLocaleString()}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{svc.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">{svc.summary}</p>
                    {svc.deliverables && (
                      <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                        <strong className="text-slate-300">Deliverables:</strong> {Array.isArray(svc.deliverables) ? svc.deliverables.join(' • ') : svc.deliverables}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleOpenEditService(svc)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Service
                    </button>
                    <button
                      onClick={() => handleDeleteService(svc._id, svc.title)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CASE STUDIES (FULL CRUD) */}
        {activeTab === 'caseStudies' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Portfolio Case Studies ({caseStudies.length})</h3>
                <p className="text-xs text-slate-400 mt-0.5">Publish client proof, engineering architectures, and benchmark metrics.</p>
              </div>
              <button
                onClick={handleOpenNewCaseStudy}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Case Study
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {caseStudies.map((cs) => (
                <div key={cs._id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">{cs.industry}</div>
                    <h4 className="text-sm font-bold text-white mt-1">{cs.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 mt-1.5 leading-relaxed">{cs.overview}</p>
                    {cs.metrics?.[0] && (
                      <div className="mt-3 p-2 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-300 text-xs font-mono">
                        {cs.metrics[0].label}: <strong>{cs.metrics[0].value}</strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleOpenEditCaseStudy(cs)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCaseStudy(cs._id, cs.title)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                      title="Delete Case Study"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: KNOWLEDGE BASE (FULL CRUD) */}
        {activeTab === 'knowledge' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-display text-white">RAG Knowledge Documents ({knowledgeDocs.length})</h3>
                <p className="text-xs text-slate-400 mt-0.5">Vector chunks and information used by the Ask Solo autonomous AI assistant.</p>
              </div>
              <button
                onClick={handleOpenNewKnowledge}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Knowledge Document
              </button>
            </div>

            <div className="space-y-3">
              {knowledgeDocs.map((doc) => (
                <div key={doc._id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">{doc.title}</span>
                      <span className="text-purple-400 font-mono text-[10px] uppercase bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                        {doc.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{doc.chunkSummary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEditKnowledge(doc)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteKnowledge(doc._id, doc.title)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6.5: CLIENT TESTIMONIALS & REVIEWS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    Verified Client Testimonials ({testimonials.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage client reviews, toggle visibility, and feature endorsements. The Ask Solo AI bot and public homepage dynamically read these testimonials.
                  </p>
                </div>
                <button
                  onClick={handleOpenNewTestimonial}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>

              {testimonials.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No testimonials found. Click &quot;Add Testimonial&quot; to publish your first client review!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((t) => (
                    <div
                      key={t._id}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(t.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleTestimonialActive(t)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                                t.active
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
                              }`}
                            >
                              {t.active ? 'Active (Live)' : 'Hidden'}
                            </button>
                            {t.featured && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 italic mb-4 leading-relaxed line-clamp-4">
                          &ldquo;{t.content}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-[11px] font-bold text-white">
                            {t.clientName?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{t.clientName}</div>
                            <div className="text-[10px] text-slate-400">
                              {t.role}, <span className="text-purple-300">{t.company}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditTestimonial(t)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Review"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(t._id, t.clientName)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: BRANDING, ABOUT, HERO & SITE SETTINGS (WITH DIRECT CLOUDINARY UPLOADERS) */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
            {settingsSavedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" /> Changes saved to MongoDB! The website will immediately reflect your updates.
              </div>
            )}

            {/* SECTION A: CLOUDINARY LOGO & BRANDING ASSETS */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center gap-2 text-purple-400">
                <ImageIcon className="w-5 h-5" />
                <h3 className="text-base font-bold font-display text-white">Logos & Favicon Assets (Cloudinary Upload)</h3>
              </div>
              <p className="text-xs text-slate-400">
                Upload your company logos and favicon directly to Cloudinary. They will immediately appear on the public navbar and header!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Dark Theme Logo */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <label className="block text-slate-200 font-semibold">Dark Theme Logo</label>
                  <CloudinaryUploadWidget
                    folder="solonomous-labs/branding"
                    currentUrl={settings.brandingAssets?.logoDark || ''}
                    onUploadSuccess={(url) => setSettings({
                      ...settings,
                      brandingAssets: { ...(settings.brandingAssets || {}), logoDark: url }
                    })}
                  />
                </div>

                {/* Light Theme Logo */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <label className="block text-slate-200 font-semibold">Light Theme Logo</label>
                  <CloudinaryUploadWidget
                    folder="solonomous-labs/branding"
                    currentUrl={settings.brandingAssets?.logoLight || ''}
                    onUploadSuccess={(url) => setSettings({
                      ...settings,
                      brandingAssets: { ...(settings.brandingAssets || {}), logoLight: url }
                    })}
                  />
                </div>

                {/* Favicon */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <label className="block text-slate-200 font-semibold">Website Favicon</label>
                  <CloudinaryUploadWidget
                    folder="solonomous-labs/branding"
                    currentUrl={settings.brandingAssets?.favicon || ''}
                    onUploadSuccess={(url) => setSettings({
                      ...settings,
                      brandingAssets: { ...(settings.brandingAssets || {}), favicon: url }
                    })}
                    aspectRatio="square"
                  />
                </div>

                {/* Standalone Flask Mark */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <label className="block text-slate-200 font-semibold">Laboratory Insignia / Flask Mark</label>
                  <CloudinaryUploadWidget
                    folder="solonomous-labs/branding"
                    currentUrl={settings.brandingAssets?.mark || ''}
                    onUploadSuccess={(url) => setSettings({
                      ...settings,
                      brandingAssets: { ...(settings.brandingAssets || {}), mark: url }
                    })}
                    aspectRatio="square"
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: ABOUT SECTION & FOUNDER PORTRAIT (WITH CLOUDINARY UPLOAD) */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center gap-2 text-purple-400">
                <User className="w-5 h-5" />
                <h3 className="text-base font-bold font-display text-white">About Section & Leadership Profile</h3>
              </div>
              <p className="text-xs text-slate-400">
                Upload your portrait photo below. It is instantly hosted on Cloudinary and displayed on the About page!
              </p>

              <div className="space-y-5 text-xs">
                {/* Founder Photo Cloudinary Upload */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <label className="block text-slate-200 font-semibold">Your Founder Portrait (Cloudinary Direct Upload)</label>
                  <CloudinaryUploadWidget
                    folder="solonomous-labs/team"
                    currentUrl={settings.aboutSection?.founderImage || ''}
                    onUploadSuccess={(url) => setSettings({
                      ...settings,
                      aboutSection: { ...(settings.aboutSection || {}), founderImage: url }
                    })}
                    aspectRatio="square"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                    <input
                      type="text"
                      value={settings.aboutSection?.founderName || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        aboutSection: { ...(settings.aboutSection || {}), founderName: e.target.value }
                      })}
                      placeholder="Noman Nawaz"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Role / Title</label>
                    <input
                      type="text"
                      value={settings.aboutSection?.founderTitle || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        aboutSection: { ...(settings.aboutSection || {}), founderTitle: e.target.value }
                      })}
                      placeholder="Founder & Principal Systems Engineer"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Founder / Engineering Bio</label>
                  <textarea
                    rows={2}
                    value={settings.aboutSection?.founderBio || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      aboutSection: { ...(settings.aboutSection || {}), founderBio: e.target.value }
                    })}
                    placeholder="Short bio regarding engineering leadership..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">About Story Headline</label>
                  <input
                    type="text"
                    value={settings.aboutSection?.storyHeadline || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      aboutSection: { ...(settings.aboutSection || {}), storyHeadline: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">About Story Content</label>
                  <textarea
                    rows={3}
                    value={settings.aboutSection?.storyContent || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      aboutSection: { ...(settings.aboutSection || {}), storyContent: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION C: HOMEPAGE HERO TEXT */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 text-xs">
              <h3 className="text-base font-bold font-display text-white">Homepage Hero Copy</h3>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Top Badge Pill</label>
                <input
                  type="text"
                  value={settings.heroSection?.badgeText || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    heroSection: { ...(settings.heroSection || {}), badgeText: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hero Sub-headline</label>
                <textarea
                  rows={2}
                  value={settings.heroSection?.subheadline || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    heroSection: { ...(settings.heroSection || {}), subheadline: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
                />
              </div>
            </div>

            {/* SECTION D: CONTACT INFO */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 text-xs">
              <h3 className="text-base font-bold font-display text-white">Company Contact Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs shadow-xl shadow-purple-600/30 transition-all cursor-pointer"
              >
                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Site & Branding Settings
              </button>
            </div>
          </form>
        )}

        {/* TAB 8: TEAM & PERMISSIONS (SUPERADMIN ONLY) */}
        {activeTab === 'team' && isSuperadmin && (
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Internal Team Members & Access Control
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Only you (the Superadmin) can invite employees or managers, toggle active status, and grant specific operational permissions.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4" /> Add Team Member
                </button>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="pb-3 font-semibold">Team Member</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Active Permissions</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teamMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-white/[0.02]">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 text-xs">
                              {member.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs flex items-center gap-2">
                                {member.name}
                                {member.role === 'superadmin' && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] uppercase font-bold tracking-wider">
                                    Owner
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-400 text-[11px]">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            member.role === 'superadmin'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : member.role === 'manager'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="py-4">
                          {member.role === 'superadmin' ? (
                            <span className="text-[11px] text-emerald-400 font-semibold">Full Unrestricted Access</span>
                          ) : (
                            <div className="flex flex-wrap gap-1 max-w-sm">
                              {member.permissions?.canManageLeads && (
                                <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px]">Leads CRM</span>
                              )}
                              {member.permissions?.canManageBlog && (
                                <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px]">Blog & Social</span>
                              )}
                              {member.permissions?.canManageServices && (
                                <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px]">Services</span>
                              )}
                              {member.permissions?.canManageCaseStudies && (
                                <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px]">Case Studies</span>
                              )}
                              {member.permissions?.canManageKnowledge && (
                                <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px]">Knowledge</span>
                              )}
                              {member.permissions?.canManageSettings && (
                                <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px]">Settings</span>
                              )}
                              {!Object.values(member.permissions || {}).some(Boolean) && (
                                <span className="text-[10px] text-slate-500 italic">No permissions assigned</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => member.role !== 'superadmin' && handleToggleMemberActive(member)}
                            disabled={member.role === 'superadmin'}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                              member.active
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            } ${member.role !== 'superadmin' ? 'cursor-pointer hover:opacity-80' : 'opacity-70 cursor-not-allowed'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${member.active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {member.active ? 'Active' : 'Suspended'}
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          {member.role !== 'superadmin' ? (
                            <button
                              onClick={() => handleDeleteMember(member._id, member.name)}
                              title="Delete Member"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-white/5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 1: CREATE / EDIT BLOG ARTICLE WITH WORD-STYLE RICH TEXT */}
        {/* ======================================================== */}
        {(showNewPostModal || showEditPostModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#12111A] border border-white/10 rounded-2xl p-6 max-w-3xl w-full space-y-4 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  {showNewPostModal ? 'Create New Article' : 'Edit Article & Rich Content'}
                </h3>
                <button
                  onClick={() => {
                    setShowNewPostModal(false);
                    setShowEditPostModal(false);
                  }}
                  className="text-slate-400 hover:text-white p-1 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={showNewPostModal ? handleCreatePost : handleUpdatePost} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      placeholder="E.g., Scaling Distributed Event-Driven Architectures"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Publication Status</label>
                    <select
                      value={blogForm.status}
                      onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#171622] border border-white/10 text-white cursor-pointer"
                    >
                      <option value="published">Published (Live to Public)</option>
                      <option value="draft">Draft (Private in CMS)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Article Excerpt (SEO Summary) *</label>
                  <textarea
                    required
                    rows={2}
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    placeholder="Short punchy summary for social cards and search engines..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white resize-none"
                  />
                </div>

                {/* Cloudinary Featured Image Uploader */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Featured Cover Image (Cloudinary)</label>
                  <CloudinaryUploadWidget
                    folder="solonomous-labs/blog"
                    currentUrl={blogForm.featuredImage?.url || ''}
                    onUploadSuccess={(url) => setBlogForm({ ...blogForm, featuredImage: { url } })}
                  />
                </div>

                {/* Word-Style Rich Text Editor */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Article Body (Word Toolbar & Live Preview) *</label>
                  <RichTextEditor
                    value={blogForm.content}
                    onChange={(val) => setBlogForm({ ...blogForm, content: val })}
                    placeholder="## The Architecture Paradigm... Start typing your article here."
                    minHeight="340px"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewPostModal(false);
                      setShowEditPostModal(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {showNewPostModal ? 'Publish Article' : 'Save Article Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 2: CREATE / EDIT SERVICE */}
        {/* ======================================================== */}
        {showServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#12111A] border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  {serviceFormMode === 'create' ? 'Create New Service' : 'Edit Service Offering'}
                </h3>
                <button onClick={() => setShowServiceModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    placeholder="E.g., High-Throughput API & Cloud Engineering"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={serviceForm.badge}
                      onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                      placeholder="Flagship Offering"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Starting Price ($ USD)</label>
                    <input
                      type="number"
                      value={serviceForm.startingPrice}
                      onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Billing Interval</label>
                    <select
                      value={serviceForm.pricingInterval}
                      onChange={(e) => setServiceForm({ ...serviceForm, pricingInterval: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-white/10 text-white"
                    >
                      <option value="one_time">One-time / Fixed</option>
                      <option value="/month">/month</option>
                      <option value="/year">/year</option>
                      <option value="/week">/week</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Service Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-white/10 text-white"
                  >
                    <option value="Web & Product">Web & Product</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Backend & Integration">Backend & Integration</option>
                    <option value="Optimization and support">Optimization and support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Service Summary *</label>
                  <textarea
                    required
                    rows={2}
                    value={serviceForm.summary}
                    onChange={(e) => setServiceForm({ ...serviceForm, summary: e.target.value })}
                    placeholder="Short overview of what this service accomplishes..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Key Deliverables (comma-separated)</label>
                  <input
                    type="text"
                    value={serviceForm.deliverables}
                    onChange={(e) => setServiceForm({ ...serviceForm, deliverables: e.target.value })}
                    placeholder="Architecture blueprint, Code repository, Production CI/CD"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={serviceForm.techStack}
                    onChange={(e) => setServiceForm({ ...serviceForm, techStack: e.target.value })}
                    placeholder="Next.js 14, Node.js, MongoDB Atlas, Redis"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowServiceModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                  >
                    {serviceFormMode === 'create' ? 'Create Service' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 3: CREATE / EDIT CASE STUDY */}
        {/* ======================================================== */}
        {showCaseStudyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#12111A] border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  {caseStudyFormMode === 'create' ? 'Add Case Study' : 'Edit Case Study'}
                </h3>
                <button onClick={() => setShowCaseStudyModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>

              <form onSubmit={handleSaveCaseStudy} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project / Case Study Title *</label>
                  <input
                    type="text"
                    required
                    value={caseStudyForm.title}
                    onChange={(e) => setCaseStudyForm({ ...caseStudyForm, title: e.target.value })}
                    placeholder="Autonomous Multi-Agent Intelligence Engine"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Client / Partner Name</label>
                    <input
                      type="text"
                      value={caseStudyForm.client}
                      onChange={(e) => setCaseStudyForm({ ...caseStudyForm, client: e.target.value })}
                      placeholder="Synthetix Labs"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Industry</label>
                    <input
                      type="text"
                      value={caseStudyForm.industry}
                      onChange={(e) => setCaseStudyForm({ ...caseStudyForm, industry: e.target.value })}
                      placeholder="Enterprise AI / SaaS"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Overview Summary *</label>
                  <textarea
                    required
                    rows={2}
                    value={caseStudyForm.overview}
                    onChange={(e) => setCaseStudyForm({ ...caseStudyForm, overview: e.target.value })}
                    placeholder="High-level engineering overview of the system..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Benchmark Metric (Key Result)</label>
                  <input
                    type="text"
                    value={caseStudyForm.resultsMetric}
                    onChange={(e) => setCaseStudyForm({ ...caseStudyForm, resultsMetric: e.target.value })}
                    placeholder="99.99% Uptime, 10x Latency Reduction"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cover Image (Cloudinary)</label>
                  <CloudinaryUploadWidget
                    folder="solonomous-labs/case-studies"
                    currentUrl={caseStudyForm.featuredImage}
                    onUploadSuccess={(url) => setCaseStudyForm({ ...caseStudyForm, featuredImage: url })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCaseStudyModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                  >
                    {caseStudyFormMode === 'create' ? 'Publish Case Study' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 4: CREATE / EDIT KNOWLEDGE DOC */}
        {/* ======================================================== */}
        {showKnowledgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#12111A] border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  {knowledgeFormMode === 'create' ? 'Add Knowledge Document' : 'Edit Knowledge Document'}
                </h3>
                <button onClick={() => setShowKnowledgeModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>

              <form onSubmit={handleSaveKnowledge} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={knowledgeForm.title}
                    onChange={(e) => setKnowledgeForm({ ...knowledgeForm, title: e.target.value })}
                    placeholder="E.g., Studio Founder Profile & Noman Nawaz Portfolio"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={knowledgeForm.category}
                      onChange={(e) => setKnowledgeForm({ ...knowledgeForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#171622] border border-white/10 text-white"
                    >
                      <option value="services">Services</option>
                      <option value="founder">Founder & Leadership</option>
                      <option value="technology">Technology & Tech Stack</option>
                      <option value="pricing">Pricing & Commercials</option>
                      <option value="process">Process & Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={knowledgeForm.tags}
                      onChange={(e) => setKnowledgeForm({ ...knowledgeForm, tags: e.target.value })}
                      placeholder="noman, portfolio, engineering"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Chunk Summary (Used by AI retrieval) *</label>
                  <textarea
                    required
                    rows={2}
                    value={knowledgeForm.chunkSummary}
                    onChange={(e) => setKnowledgeForm({ ...knowledgeForm, chunkSummary: e.target.value })}
                    placeholder="Concise summary for vector similarity scoring..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Knowledge Content (AI Grounding) *</label>
                  <textarea
                    required
                    rows={5}
                    value={knowledgeForm.content}
                    onChange={(e) => setKnowledgeForm({ ...knowledgeForm, content: e.target.value })}
                    placeholder="Enter detailed facts, answers, or context that the Ask Solo assistant should know..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowKnowledgeModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                  >
                    {knowledgeFormMode === 'create' ? 'Add to Knowledge Base' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 5: FULL LEAD DETAILS DRAWER */}
        {/* ======================================================== */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#12111A] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  Lead Project Brief Details
                </h3>
                <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <span className="text-slate-400 block">Prospect Name</span>
                    <strong className="text-white text-sm">{selectedLead.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Company</span>
                    <strong className="text-purple-300">{selectedLead.company || 'Not Specified'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email Address</span>
                    <span className="text-white">{selectedLead.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone / WhatsApp</span>
                    <span className="text-white">{selectedLead.phone || 'None Provided'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Budget Range</span>
                    <span className="text-emerald-400 font-semibold">{selectedLead.budgetRange}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Timeline</span>
                    <span className="text-slate-300">{selectedLead.timeline}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Project Brief</label>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-slate-200 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                    {selectedLead.projectDescription}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleDeleteLead(selectedLead._id, selectedLead.fullName)}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Inquiry
                  </button>

                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 6: ADD TEAM MEMBER (SUPERADMIN ONLY) */}
        {/* ======================================================== */}
        {showAddMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#12111A] border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  Add New Team Member
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              {newMemberError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{newMemberError}</span>
                </div>
              )}

              <form onSubmit={handleCreateTeamMember} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Mercer"
                      value={newMemberForm.name}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@solonomouslabs.com"
                      value={newMemberForm.email}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Initial Password (min 8) *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={newMemberForm.password}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Assign Internal Role</label>
                    <select
                      value={newMemberForm.role}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#171622] border border-white/10 text-white cursor-pointer"
                    >
                      <option value="employee">Employee / Specialist</option>
                      <option value="manager">Operations Manager</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">
                    Granular Access Permissions (Select what they can view and edit):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newMemberForm.permissions.canManageLeads}
                        onChange={(e) => setNewMemberForm({
                          ...newMemberForm,
                          permissions: { ...newMemberForm.permissions, canManageLeads: e.target.checked }
                        })}
                        className="rounded border-white/20 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Inbound Leads & CRM</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newMemberForm.permissions.canManageBlog}
                        onChange={(e) => setNewMemberForm({
                          ...newMemberForm,
                          permissions: { ...newMemberForm.permissions, canManageBlog: e.target.checked }
                        })}
                        className="rounded border-white/20 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Blog & Social Engine</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newMemberForm.permissions.canManageServices}
                        onChange={(e) => setNewMemberForm({
                          ...newMemberForm,
                          permissions: { ...newMemberForm.permissions, canManageServices: e.target.checked }
                        })}
                        className="rounded border-white/20 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Services & Pricing</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newMemberForm.permissions.canManageCaseStudies}
                        onChange={(e) => setNewMemberForm({
                          ...newMemberForm,
                          permissions: { ...newMemberForm.permissions, canManageCaseStudies: e.target.checked }
                        })}
                        className="rounded border-white/20 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Portfolio Case Studies</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newMemberForm.permissions.canManageKnowledge}
                        onChange={(e) => setNewMemberForm({
                          ...newMemberForm,
                          permissions: { ...newMemberForm.permissions, canManageKnowledge: e.target.checked }
                        })}
                        className="rounded border-white/20 text-purple-600 focus:ring-purple-500"
                      />
                      <span>RAG Knowledge Base</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newMemberForm.permissions.canManageSettings}
                        onChange={(e) => setNewMemberForm({
                          ...newMemberForm,
                          permissions: { ...newMemberForm.permissions, canManageSettings: e.target.checked }
                        })}
                        className="rounded border-white/20 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Site & Brand Settings</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={newMemberLoading}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5"
                  >
                    {newMemberLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: CREATE / EDIT TESTIMONIAL */}
        {/* ======================================================== */}
        {showTestimonialModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#12111A] border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  {testimonialFormMode === 'create' ? 'Add Client Testimonial' : 'Edit Testimonial'}
                </h3>
                <button
                  onClick={() => setShowTestimonialModal(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Client Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={testimonialForm.clientName}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Role / Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Technology Officer"
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PulseCloud Global"
                      value={testimonialForm.company}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Star Rating (1 - 5)</label>
                    <select
                      value={testimonialForm.rating}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    >
                      <option value={5} className="bg-[#12111A]">★★★★★ 5 Stars</option>
                      <option value={4} className="bg-[#12111A]">★★★★☆ 4 Stars</option>
                      <option value={3} className="bg-[#12111A]">★★★☆☆ 3 Stars</option>
                      <option value={2} className="bg-[#12111A]">★★☆☆☆ 2 Stars</option>
                      <option value={1} className="bg-[#12111A]">★☆☆☆☆ 1 Star</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Review & Feedback Content *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter verified client endorsement and technical feedback..."
                    value={testimonialForm.content}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testimonialForm.active}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, active: e.target.checked })}
                      className="w-4 h-4 rounded-sm bg-white/5 border-white/10 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-300 font-semibold">Active / Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testimonialForm.featured}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded-sm bg-white/5 border-white/10 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-300 font-semibold">Featured on Homepage</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowTestimonialModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    {testimonialFormMode === 'create' ? 'Publish Testimonial' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
