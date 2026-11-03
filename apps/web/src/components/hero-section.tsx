"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, ShieldCheck, Building2, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "./language-context";
import { HeroShowcase } from "./hero-showcase";

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
      className="relative overflow-hidden py-12 lg:py-20 text-white transition-all duration-300"
      style={{
        backgroundImage: `url('${
          isDesktop
            ? "/images/school-supplies-bg-desktop.jpg"
            : "/images/school-supplies-bg.jpg"
        }')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#072448",
      }}
    >
      {/* Translucent depth overlay preserving edge stationery while making center text crisp */}
      <div className="absolute inset-0 bg-[#072448]/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#072448]/80 via-[#072448]/60 to-[#07152B]/90 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          {/* Left Column: Refined Typography, Brand CTAs, and Staggered Motion */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Student Marketplace Pill Badge with Motion */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-xs text-white/95 font-semibold shadow-inner"
            >
              <GraduationCap className="h-4 w-4 text-amber-400" />
              <span>{t("hero.badge")}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              <span className="text-[10px] text-emerald-300 font-bold">Live Hubs</span>
            </motion.div>

            {/* Main Headline - Bold, Crisp Typography with Luminous Gold Accent */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
            >
              {t("hero.title1")}{" "}
              <span className="block text-white/95">{t("hero.title2")}</span>
              <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent font-black">
                {t("hero.title3")}
              </span>
            </motion.h1>

            {/* Subtitle - Clean & Readable */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Dual CTA Buttons with Motion Scale */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <a
                href="#products"
                onClick={scrollToProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3 text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-brand-600/35 hover:scale-102 active:scale-98"
              >
                {t("hero.btnExplore")}
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/sell"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3 text-sm transition-all duration-200 backdrop-blur-md hover:scale-102 active:scale-98"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>{t("hero.btnSell")}</span>
                <span className="ml-1 rounded-md bg-amber-400/20 border border-amber-400/40 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                  0% Fee
                </span>
              </Link>
            </motion.div>

            {/* Trust Badges Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 border-t border-white/15 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-200">5% Safe Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-400 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-200">Campus Desks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-200">100% Cash to You</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Multi-Slide Hero Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <HeroShowcase />
          </motion.div>
        </div>
      </div>

      {/* Bottom seamless transition into the page content */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] dark:from-twilight-900 to-transparent pointer-events-none" />
    </section>
  );
}
