"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  folder?: "products" | "evidence" | "avatars" | "lost-found";
  maxImages?: number;
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({
  folder = "products",
  maxImages = 5,
  value = [],
  onChange,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // tRPC mutation to get secure presigned signature on demand
  const getSignatureMutation = trpc.upload.getSignature.useMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxImages) {
      setUploadError(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const sig = await getSignatureMutation.mutateAsync({ folder });
      if (!sig || !sig.apiKey || !sig.cloudName) {
        throw new Error("Could not retrieve upload signature from server.");
      }

      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sig.apiKey);
        formData.append("timestamp", sig.timestamp.toString());
        formData.append("signature", sig.signature);
        formData.append("folder", sig.folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Failed to upload image to Cloudinary.");
        }

        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }

      onChange([...value, ...uploadedUrls]);
    } catch (err: unknown) {
      console.error(err);
      setUploadError(
        err instanceof Error ? err.message : "Error uploading image."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(value.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      {/* Upload Dropzone */}
      {value.length < maxImages && (
        <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-6 transition duration-150 hover:border-emerald-500 hover:bg-emerald-50/70">
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={isUploading}
            onChange={handleFileChange}
            className="sr-only"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-emerald-700">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-xs font-bold">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-sm">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-emerald-900">
                  Click or drag photos to upload
                </span>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  JPEG, PNG, WebP up to 10MB ({value.length}/{maxImages})
                </p>
              </div>
            </div>
          )}
        </label>
      )}

      {/* Error message */}
      {uploadError && (
        <p className="text-xs font-semibold text-rose-600">{uploadError}</p>
      )}

      {/* Uploaded Image Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
            >
              <img
                src={url}
                alt={`Uploaded photo ${idx + 1}`}
                className="h-full w-full object-cover"
              />

              {idx === 0 && (
                <div className="absolute bottom-1.5 left-1.5 rounded-md bg-emerald-700/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  Cover
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-white opacity-0 transition duration-150 group-hover:opacity-100 hover:bg-rose-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
