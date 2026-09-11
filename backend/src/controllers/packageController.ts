import { Request, Response } from 'express';
import { Package } from '../models/Package';

const DEFAULT_PACKAGES = [
  {
    name: 'Focused Product Sprint',
    slug: 'focused-product-sprint',
    badge: 'Rapid Validation',
    price: '$4,500',
    originalPrice: '$5,000',
    discountPercentage: 10,
    discountText: 'Save 10%',
    period: 'Starting fee / 2-3 Weeks',
    description: 'Ideal for validating an architectural hypothesis, integrating custom RAG, or building a standalone microservice.',
    deliverables: [
      'Complete system architecture blueprint',
      'Working production-ready service / feature',
      'Automated unit & integration test suite',
      'Full GitHub source transfer & documentation',
      '30-day post-launch warranty'
    ],
    popular: false,
    ctaText: 'Kickoff Sprint',
    ctaLink: '/contact',
    displayOrder: 1,
    active: true
  },
  {
    name: 'Full-Stack MVP Architecture',
    slug: 'full-stack-mvp-architecture',
    badge: 'Most Popular',
    price: '$8,500',
    originalPrice: '$10,000',
    discountPercentage: 15,
    discountText: 'Save $1,500',
    period: 'Starting fee / 4-6 Weeks',
    description: 'Turnkey SaaS or digital product MVP engineered from scratch with multi-tenancy, auth, and database architecture.',
    deliverables: [
      'Complete Next.js + Node.js full-stack system',
      'Multi-tenant database schema & indexing',
      'Turnkey Clerk authentication & RBAC roles',
      'Production CI/CD deployment pipeline',
      'Stripe billing / subscription integration',
      '60-day post-launch operational SLA'
    ],
    popular: true,
    ctaText: 'Deploy Platform MVP',
    ctaLink: '/contact',
    displayOrder: 2,
    active: true
  },
  {
    name: 'Dedicated Retainer & Scale',
    slug: 'dedicated-retainer-and-scale',
    badge: 'High Concurrency',
    price: 'Custom',
    originalPrice: '',
    discountPercentage: 0,
    discountText: '',
    period: 'Monthly Retainer Sprints',
    description: 'For venture-backed startups accelerating product roadmaps or requiring embedded principal systems architecture.',
    deliverables: [
      'Continuous sprint execution & feature rollout',
      'Priority architectural review & chaos testing',
      'Direct Slack/Discord engineer integration',
      'Sub-4-hour emergency SLA response window',
      'Weekly video demonstrations & retrospectives'
    ],
    popular: false,
    ctaText: 'Discuss Retainer Scope',
    ctaLink: '/contact',
    displayOrder: 3,
    active: true
  }
];

const parseDeliverablesHelper = (input: any): string[] => {
  if (Array.isArray(input)) {
    return input.map((d: any) => String(d).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(/\r?\n|,/)
      .map((d: string) => d.trim())
      .filter(Boolean);
  }
  return [];
};

export class PackageController {
  // Public: Get all active packages
  static async getPackages(req: Request, res: Response): Promise<void> {
    try {
      let packages = await Package.find({ active: true }).sort({ displayOrder: 1, createdAt: 1 });

      if (!packages || packages.length === 0) {
        // Auto-seed defaults if database is empty
        const count = await Package.countDocuments();
        if (count === 0) {
          await Package.insertMany(DEFAULT_PACKAGES);
          packages = await Package.find({ active: true }).sort({ displayOrder: 1, createdAt: 1 });
        }
      }

      res.json({ success: true, data: packages });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch packages' });
    }
  }

  // Admin: Get all packages (including inactive)
  static async getAllPackagesAdmin(req: Request, res: Response): Promise<void> {
    try {
      let packages = await Package.find().sort({ displayOrder: 1, createdAt: 1 });

      if (!packages || packages.length === 0) {
        await Package.insertMany(DEFAULT_PACKAGES);
        packages = await Package.find().sort({ displayOrder: 1, createdAt: 1 });
      }

      res.json({ success: true, data: packages });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch admin packages' });
    }
  }

  // Admin: Create package
  static async createPackage(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        slug,
        badge,
        price,
        originalPrice,
        discountPercentage,
        discountText,
        period,
        description,
        deliverables,
        popular,
        ctaText,
        ctaLink,
        displayOrder,
        active
      } = req.body;

      if (!name || !price || !period || !description) {
        res.status(400).json({ success: false, message: 'Name, price, period, and description are required' });
        return;
      }

      const generatedSlug = (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check for duplicate slug
      const existing = await Package.findOne({ slug: generatedSlug });
      const finalSlug = existing ? `${generatedSlug}-${Date.now().toString().slice(-4)}` : generatedSlug;

      const parsedDeliverables = parseDeliverablesHelper(deliverables);

      const newPackage = new Package({
        name,
        slug: finalSlug,
        badge: badge || '',
        price,
        originalPrice: originalPrice || '',
        discountPercentage: Number(discountPercentage) || 0,
        discountText: discountText || '',
        period,
        description,
        deliverables: parsedDeliverables,
        popular: Boolean(popular),
        ctaText: ctaText || 'Kickoff Sprint',
        ctaLink: ctaLink || '/contact',
        displayOrder: Number(displayOrder) || 0,
        active: active !== undefined ? Boolean(active) : true
      });

      await newPackage.save();
      res.status(201).json({ success: true, data: newPackage });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create package' });
    }
  }

  // Admin: Update package
  static async updatePackage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name,
        slug,
        badge,
        price,
        originalPrice,
        discountPercentage,
        discountText,
        period,
        description,
        deliverables,
        popular,
        ctaText,
        ctaLink,
        displayOrder,
        active
      } = req.body;

      const existingPackage = await Package.findById(id);
      if (!existingPackage) {
        res.status(404).json({ success: false, message: 'Package not found' });
        return;
      }

      if (name) existingPackage.name = name;
      if (slug) {
        existingPackage.slug = slug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      if (badge !== undefined) existingPackage.badge = badge;
      if (price) existingPackage.price = price;
      if (originalPrice !== undefined) existingPackage.originalPrice = originalPrice;
      if (discountPercentage !== undefined) existingPackage.discountPercentage = Number(discountPercentage) || 0;
      if (discountText !== undefined) existingPackage.discountText = discountText;
      if (period) existingPackage.period = period;
      if (description) existingPackage.description = description;
      if (deliverables !== undefined) existingPackage.deliverables = parseDeliverablesHelper(deliverables);
      if (popular !== undefined) existingPackage.popular = Boolean(popular);
      if (ctaText !== undefined) existingPackage.ctaText = ctaText;
      if (ctaLink !== undefined) existingPackage.ctaLink = ctaLink;
      if (displayOrder !== undefined) existingPackage.displayOrder = Number(displayOrder);
      if (active !== undefined) existingPackage.active = Boolean(active);

      await existingPackage.save();
      res.json({ success: true, data: existingPackage });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update package' });
    }
  }

  // Admin: Delete package
  static async deletePackage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Package.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Package not found' });
        return;
      }
      res.json({ success: true, message: 'Package removed successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete package' });
    }
  }
}
