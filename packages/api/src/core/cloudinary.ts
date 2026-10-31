import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadSignatureResult {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Generates a signed upload signature for direct client-to-Cloudinary uploads.
 * Works seamlessly from both Next.js Web and Expo Mobile.
 */
export function generateUploadSignature(
  folder: "products" | "evidence" | "avatars" | "lost-found" = "products"
): UploadSignatureResult {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const targetFolder = `estud/${folder}`;

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: targetFolder,
    },
    process.env.CLOUDINARY_API_SECRET || "dummy_secret_for_dev"
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    folder: targetFolder,
  };
}

export { cloudinary };
