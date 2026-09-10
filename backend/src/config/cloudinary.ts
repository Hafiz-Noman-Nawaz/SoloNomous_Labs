import { v2 as cloudinary } from 'cloudinary';

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('✅ Cloudinary initialized successfully');
} else {
  console.log('ℹ️ Cloudinary credentials not detected; local mock media pipeline will be active.');
}

export { cloudinary };
