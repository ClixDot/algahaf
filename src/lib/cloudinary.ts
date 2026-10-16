import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'pphvtdhb',
  api_key: process.env.CLOUDINARY_API_KEY || '778498662319314',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'gDp-cqzIAG0cVRaIjKJ3Xfpoqrg',
  secure: true,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'alghaf_website',
  resourceType: 'auto' | 'image' | 'video' = 'auto'
): Promise<{ url: string; secure_url: string; public_id: string; format: string; bytes: number }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary upload returned empty result'));
        resolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'video' = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export default cloudinary;
