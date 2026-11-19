import { v2 as cloudinary } from "cloudinary";

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const api_key = process.env.CLOUDINARY_API_KEY?.trim();
const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
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

  const currentSecret = (process.env.CLOUDINARY_API_SECRET || api_secret || "dummy_secret_for_dev").trim();
  const currentKey = (process.env.CLOUDINARY_API_KEY || api_key || "").trim();
  const currentCloud = (process.env.CLOUDINARY_CLOUD_NAME || cloud_name || "").trim();

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: targetFolder,
    },
    currentSecret
  );

  return {
    timestamp,
    signature,
    apiKey: currentKey,
    cloudName: currentCloud,
    folder: targetFolder,
  };
}

export { cloudinary };
