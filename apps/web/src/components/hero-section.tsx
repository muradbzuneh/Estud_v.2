"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";
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

  // Professional masked text animation variants
  const lineVariants: Variants = {
    hidden: { y: "115%", opacity: 0 },
    visible: (custom: number) => ({
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.12 * custom,
      },
    }),
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.15 * custom,
      },
    }),
  };

  return (
    <section
      className="relative overflow-hidden py-14 sm:py-20 lg:py-24 text-white"
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
      {/* Cinematic dark depth overlays for high-contrast legibility */}
      <div className="absolute inset-0 bg-[#071E3D]/80 backdrop-blur-[2px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07152B]/95 via-[#071E3D]/85 to-[#07152B]/80 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14">
          
          {/* Left Column: Clean, uncluttered, animated typography */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Minimalist verification pill */}
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-xs text-white/90 font-medium backdrop-blur-md shadow-xs"
            >
              <GraduationCap className="h-3.5 w-3.5 text-amber-400" />
              <span>{t("hero.badge")}</span>
            </motion.div>

            {/* Professional Masked Staggered Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.12]">
              <div className="overflow-hidden">
                <motion.span
                  custom={1}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block text-white"
                >
                  {t("hero.title1")}
                </motion.span>
              </div>

              <div className="overflow-hidden">
                <motion.span
                  custom={2}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block text-white/95"
                >
                  {t("hero.title2")}
                </motion.span>
              </div>

              <div className="overflow-hidden">
                <motion.span
                  custom={3}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent font-black"
                >
                  {t("hero.title3")}
                </motion.span>
              </div>
            </h1>

            {/* Clean Subtitle */}
            <motion.p
              custom={4}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Clean, Focused Dual Action Buttons (Zero unwanted tags) */}
            <motion.div
              custom={5}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <a
                href="#products"
                onClick={scrollToProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-3.5 text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                {t("hero.btnExplore")}
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/sell"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-3.5 text-sm transition-all duration-200 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>{t("hero.btnSell")}</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Pure Quality Modern Hero Showcase */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <HeroShowcase />
          </motion.div>
        </div>
      </div>

      {/* Subtle bottom fade transition into the page content */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#F8FAFC] dark:from-twilight-900 to-transparent pointer-events-none" />
    </section>
  );
}
