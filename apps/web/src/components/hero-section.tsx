"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  ShoppingBag,
} from "lucide-react";

import { useLanguage } from "./language-context";
import { HeroShowcase } from "./hero-showcase";

interface HeroSectionProps {
  onSelectCategory?: (category: string) => void;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function HeroSection({
  onSelectCategory,
}: HeroSectionProps) {
  const { t } = useLanguage();

  const scrollToProducts = (
    e: React.MouseEvent<HTMLAnchorElement>,
    category?: string
  ) => {
    e.preventDefault();

    if (category && onSelectCategory) {
      onSelectCategory(category);
    }

    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative isolate min-h-[590px] overflow-hidden bg-[#072448] text-white sm:min-h-[640px] lg:min-h-[660px]">
      {/* 60% Visible School Supplies Imagery across all devices with transparent text depth */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {/* Desktop stationery background */}
        <Image
          src="/images/school-supplies-bg-desktop.jpg"
          alt="Estud Student Marketplace Campus Background"
          fill
          priority
          sizes="100vw"
          className="hidden md:block object-cover object-top"
        />

        {/* Mobile stationery background */}
        <Image
          src="/images/school-supplies-bg.jpg"
          alt="Estud Student Marketplace Campus Background"
          fill
          priority
          sizes="100vw"
          className="block md:hidden object-cover object-top"
        />
      </div>

      {/* 30% Structural Depth overlay: stationery at top is clearly visible, while text overlay is transparent and high-contrast */}
      <div className="absolute inset-0 -z-10 bg-[#072448]/45 pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#071E3D]/30 via-[#072448]/60 to-[#07152B]/90 pointer-events-none" />

      {/* 10% Subtle Brand Accent matching logo ribbon fold */}
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#FE9901] via-[#FF8738] to-transparent opacity-90" />

      {/* Main content */}
      <div className="mx-auto flex min-h-[590px] max-w-7xl items-center px-5 py-16 sm:min-h-[640px] sm:px-8 lg:min-h-[660px] lg:px-10">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">

          {/* Left Column: Clean Typography & Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 mx-auto w-full max-w-2xl text-center lg:col-span-6 lg:mx-0 lg:text-left"
          >
            {/* Minimalist verification pill */}
            <motion.div
              variants={itemVariants}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm shadow-xs"
            >
              <GraduationCap className="h-4 w-4 text-[#FF8738]" />
              <span>{t("hero.badge")}</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-[2.65rem] font-bold leading-[1.12] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem] xl:text-[4rem]"
            >
              <span className="block">
                {t("hero.title1")}
              </span>

              <span className="block">
                {t("hero.title2")}
              </span>

              {/* 10% Golden Amber Focal Accent */}
              <span className="block text-[#FF8738]">
                {t("hero.title3")}
              </span>
            </motion.h1>

            {/* Description (60% Crisp Neutral Typography) */}
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8 lg:mx-0 font-normal"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Actions: 10% Primary Action + 30% Secondary Action */}
            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <a
                href="#products"
                onClick={scrollToProducts}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#FF8738] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#FF8738] px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto cursor-pointer"
              >
                {t("hero.btnExplore")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <Link
                href="/sell"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                <ShoppingBag className="h-4 w-4 text-[#FF8738]" />
                {t("hero.btnSell")}
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-white/85 sm:text-sm lg:justify-start"
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FF8738]" />
                Student marketplace
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#1D6BF3]" />
                Buy &amp; sell
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Exchange items
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column / Mobile Bottom: Hero Showcase Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 mx-auto flex w-full max-w-xl items-center justify-center lg:col-span-6 lg:max-w-none mt-4 lg:mt-0"
          >
            <HeroShowcase />
          </motion.div>

        </div>
      </div>

      {/* Bottom seamless transition into Category Dock */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F8FAFC] dark:from-twilight-900 to-transparent"
      />
    </section>
  );
}
