"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export type LogoVariant = "light" | "dark" | "app-icon-light" | "app-icon-dark" | "auto";

interface EstudLogoProps {
  className?: string;
  size?: number; // Height in pixels
  variant?: LogoVariant;
  showText?: boolean;
}

export function EstudLogo({
  className = "",
  size = 36,
  variant = "auto",
}: EstudLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine logo asset based on state
  let logoSrc = "/images/logos/estud-logo-light.png";

  if (variant === "dark") {
    logoSrc = "/images/logos/estud-logo-dark.png";
  } else if (variant === "light") {
    logoSrc = "/images/logos/estud-logo-light.png";
  } else if (variant === "app-icon-light") {
    logoSrc = "/images/logos/estud-app-icon-light.jpg";
  } else if (variant === "app-icon-dark") {
    logoSrc = "/images/logos/estud-app-icon-dark.jpg";
  } else {
    // "auto" switches with light / dark theme
    if (mounted && resolvedTheme === "dark") {
      logoSrc = "/images/logos/estud-logo-dark.png";
    } else {
      logoSrc = "/images/logos/estud-logo-light.png";
    }
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Estud Logo"
        className="object-contain transition-transform duration-200 hover:scale-105"
        style={{ height: size, width: "auto" }}
      />
    </div>
  );
}
