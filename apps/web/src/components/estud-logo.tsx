"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export interface EstudLogoProps {
  className?: string;
  size?: number; // Height in pixels (default 32)
  showText?: boolean;
  variant?: "auto" | "light" | "dark";
}

export function EstudLogo({
  className = "",
  size = 32,
  showText = true,
  variant = "auto",
}: EstudLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark =
    variant === "dark" ||
    (variant === "auto" && mounted && resolvedTheme === "dark");

  const iconSrc = isDark
    ? "/images/logos/estud-app-icon-dark.jpg"
    : "/images/logos/estud-app-icon-light.jpg";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Folded Ribbon Squircle Icon */}
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 overflow-hidden rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105"
      >
        <img
          src={iconSrc}
          alt="Estud Brand Mark"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Crisp Typography Wordmark */}
      {showText && (
        <span
          style={{ fontSize: Math.round(size * 0.65) }}
          className="font-bold tracking-tight text-slate-900 dark:text-white leading-none transition-colors"
        >
          Estud
        </span>
      )}
    </div>
  );
}
