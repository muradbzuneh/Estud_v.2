"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { useLanguage } from "./language-context";

interface HeroSectionProps {
  onSelectCategory?: (category: string) => void;
}

export function HeroSection({ onSelectCategory }: HeroSectionProps = {}) {
  const { t } = useLanguage();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollToProducts = (e?: React.MouseEvent, category?: string) => {
    if (e) e.preventDefault();
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative overflow-hidden py-14 lg:py-20 text-white transition-all duration-300"
      style={{
        backgroundImage: `url('${
          isDesktop
            ? "/images/school-supplies-bg-desktop.jpg"
            : "/images/school-supplies-bg.jpg"
        }')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#073c72",
      }}
    >
      {/* Translucent depth overlay preserving edge stationery while making center text crisp */}
      <div className="absolute inset-0 bg-[#072448]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#072448]/70 via-transparent to-[#072448]/80 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          {/* Left Column: Refined Typography & Clean Brand CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Student Marketplace Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1 text-xs text-white/90 font-medium">
              <GraduationCap className="h-3.5 w-3.5 text-white/80" />
              <span>{t("hero.badge")}</span>
            </div>

            {/* Main Headline - Clean, Crisp Typography without Clashing Gradient */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {t("hero.title1")}{" "}
              <span className="block text-white/95">{t("hero.title2")}</span>
              <span className="block text-white">
                {t("hero.title3")}
              </span>
            </h1>

            {/* Subtitle - Clean & Readable */}
            <p className="text-sm sm:text-base text-slate-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t("hero.subtitle")}
            </p>

            {/* Dual Clean CTA Buttons - Single Brand Accent */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#products"
                onClick={scrollToProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-7 py-3 text-sm transition-all cursor-pointer shadow-sm"
              >
                {t("hero.btnExplore")}
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/sell"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/25 hover:bg-white/10 text-white font-medium px-7 py-3 text-sm transition-all"
              >
                {t("hero.btnSell")}
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Student Backpack Showcase - Clean & Uncluttered */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Central 3D Student Backpack Image Container */}
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-white/15 bg-white/10 backdrop-blur-xl p-3 sm:p-4 shadow-2xl">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/95 shadow-inner flex items-center justify-center p-4">
                <img
                  src="/images/student-backpack-3d.jpg"
                  alt="Student 3D Backpack with Books, Clock and Stationery"
                  className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom seamless transition into the page content */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] dark:from-[#0B0F19] to-transparent pointer-events-none" />
    </section>
  );
}
