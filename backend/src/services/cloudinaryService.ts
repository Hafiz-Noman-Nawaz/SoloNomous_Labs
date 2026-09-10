import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary';
import { Media } from '../models/SiteSettingsAndMedia';
import fs from 'fs';
import path from 'path';

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

export class CloudinaryService {
  public static async uploadBuffer(
    buffer: Buffer,
    filename: string,
    folder = 'solonomous-labs',
    altText = ''
  ): Promise<UploadResult> {
    if (isCloudinaryConfigured()) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
          },
          async (error, result) => {
            if (error || !result) {
              return reject(error || new Error('Upload to Cloudinary failed'));
            }

            // Save to Media collection
            await Media.create({
              filename,
              publicId: result.public_id,
              url: result.url,
              secureUrl: result.secure_url,
              format: result.format || 'webp',
              bytes: result.bytes || buffer.length,
              width: result.width,
              height: result.height,
              altText,
              folder
            });

            resolve({
              url: result.url,
              secureUrl: result.secure_url,
              publicId: result.public_id,
              format: result.format || 'webp',
              bytes: result.bytes || buffer.length,
              width: result.width,
              height: result.height
            });
          }
        );
        stream.end(buffer);
      });
    }

    // Local / simulated fallback if Cloudinary is not configured
    const mockPublicId = `mock_${Date.now()}_${filename.replace(/\s+/g, '_')}`;
    const mockUrl = `/uploads/${mockPublicId}`;

    await Media.create({
      filename,
      publicId: mockPublicId,
      url: mockUrl,
      secureUrl: mockUrl,
      format: 'png',
      bytes: buffer.length,
      altText,
      folder
    });

    return {
      url: mockUrl,
      secureUrl: mockUrl,
      publicId: mockPublicId,
      format: 'png',
      bytes: buffer.length
    };
  }

  public static async deleteMedia(publicId: string): Promise<boolean> {
    if (isCloudinaryConfigured()) {
      await cloudinary.uploader.destroy(publicId);
    }
    await Media.findOneAndDelete({ publicId });
    return true;
  }
}
