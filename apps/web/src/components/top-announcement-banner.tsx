"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X, Sparkles, CheckCircle2 } from "lucide-react";

interface TopAnnouncementBannerProps {
  autoHideDuration?: number; // duration in ms, default 5000 (5 seconds)
}

export function TopAnnouncementBanner({
  autoHideDuration = 5000,
}: TopAnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit transition to remove from DOM
      setTimeout(() => setIsDismissed(true), 400);
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [autoHideDuration]);

  if (isDismissed) return null;

  return (
    <div
      className={`relative z-50 w-full bg-slate-900 text-white transition-all duration-400 ease-in-out ${
        isVisible ? "max-h-12 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-full overflow-hidden"
      }`}
    >
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 text-xs">
        <div className="flex items-center gap-2 mx-auto">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> SafeTrade Escrow
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="text-slate-200">
            Ethiopia's Verified Student Marketplace
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-amber-300 font-medium">
            0% Seller Commission &bull; Only 5% Buyer Escrow Fee
          </span>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => setIsDismissed(true), 400);
          }}
          aria-label="Dismiss banner"
          className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
