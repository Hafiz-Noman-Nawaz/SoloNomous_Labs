import { Request, Response } from 'express';
import { Package } from '../models/Package';

const PLACEHOLDER_SLUGS = [
  'focused-product-sprint',
  'full-stack-mvp-architecture',
  'dedicated-retainer-and-scale'
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
  // Public: Get all active packages added by the owner
  static async getPackages(req: Request, res: Response): Promise<void> {
    try {
      // Purge any legacy placeholder seed packages so only user-added packages show
      await Package.deleteMany({ slug: { $in: PLACEHOLDER_SLUGS } });

      const packages = await Package.find({ active: true }).sort({ displayOrder: 1, createdAt: 1 });
      res.json({ success: true, data: packages });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch packages' });
    }
  }

  // Admin: Get all packages (including inactive)
  static async getAllPackagesAdmin(req: Request, res: Response): Promise<void> {
    try {
      // Purge any legacy placeholder seed packages
      await Package.deleteMany({ slug: { $in: PLACEHOLDER_SLUGS } });

      const packages = await Package.find().sort({ displayOrder: 1, createdAt: 1 });
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
