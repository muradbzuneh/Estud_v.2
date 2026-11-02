"use client";

import { useState } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: {
    id?: string;
    imageUrl: string;
    isPrimary?: boolean;
  }[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-slate-100 dark:bg-twilight-800 text-slate-400 dark:text-twilight-400">
        <span className="text-xs font-semibold">No images available</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex]?.imageUrl || images[0].imageUrl;

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Showcase Image */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-twilight-700 bg-slate-100 dark:bg-twilight-800 shadow-sm">
        <img
          src={currentImage}
          alt={`${title} - view ${selectedIndex + 1}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Lightbox Trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-twilight-800/90 text-slate-700 dark:text-white shadow-md backdrop-blur transition hover:bg-white dark:hover:bg-twilight-700 hover:text-brand-600 dark:hover:text-brand-400 active:scale-95"
          aria-label="Inspect condition full-screen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Image Counter Badge */}
        <div className="absolute bottom-3.5 right-3.5 rounded-full bg-slate-900/80 dark:bg-twilight-900/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                selectedIndex === idx
                  ? "border-brand-600 ring-2 ring-brand-500/25"
                  : "border-slate-200 dark:border-twilight-700 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.imageUrl}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Expanded Image */}
          <div className="max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl">
            <img
              src={currentImage}
              alt={title}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
