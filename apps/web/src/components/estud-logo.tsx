import React from "react";

interface EstudLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export function EstudLogo({
  className = "",
  size = 36,
  showText = true,
  textColor = "text-slate-900",
}: EstudLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Exact 3-Layer Ribbon Icon matching Estud Brand Mockup */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          <linearGradient id="topRibbon" x1="6" y1="10" x2="38" y2="10" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="midRibbon" x1="12" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284C7" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="bottomRibbon" x1="6" y1="38" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EA580C" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {/* Top Folded Bar (Indigo / Blue) */}
        <path
          d="M10 14C10 10.6863 12.6863 8 16 8H34C37.3137 8 40 10.6863 40 14C40 17.3137 37.3137 20 34 20H16C12.6863 20 10 17.3137 10 14Z"
          fill="url(#topRibbon)"
        />

        {/* Left Vertical Spine connector */}
        <path
          d="M10 14V34C10 37.3137 12.6863 40 16 40C19.3137 40 22 37.3137 22 34V20L10 14Z"
          fill="#4338CA"
          opacity="0.9"
        />

        {/* Middle Folded Bar (Cyan / Sky) */}
        <path
          d="M16 26C16 22.6863 18.6863 20 22 20H38C41.3137 20 44 22.6863 44 26C44 29.3137 41.3137 32 38 32H22C18.6863 32 16 29.3137 16 26Z"
          fill="url(#midRibbon)"
        />

        {/* Bottom Folded Bar (Orange / Amber) */}
        <path
          d="M10 34C10 30.6863 12.6863 28 16 28H32C35.3137 28 38 30.6863 38 34C38 37.3137 35.3137 40 32 40H16C12.6863 40 10 37.3137 10 34Z"
          fill="url(#bottomRibbon)"
        />
      </svg>

      {showText && (
        <span className={`text-2xl font-black tracking-tight ${textColor} font-sans select-none`}>
          Estud
        </span>
      )}
    </div>
  );
}
