"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Percent,
  Users,
  ShoppingCart,
  ArrowLeftRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "./language-context";

interface HeroSectionProps {
  onSelectCategory?: (category: string) => void;
}

export function HeroSection({ onSelectCategory }: HeroSectionProps = {}) {
  const { t } = useLanguage();
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/60 to-white dark:from-[#0B0F19] dark:via-[#111827]/70 dark:to-[#0B0F19] py-10 lg:py-16 transition-colors duration-200">
      {/* Background Soft Ambient Blobs */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-amber-100/40 dark:bg-amber-900/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-10 h-96 w-96 rounded-full bg-indigo-100/40 dark:bg-indigo-900/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-teal-100/30 dark:bg-teal-900/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Student Marketplace Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 px-3.5 py-1.5 shadow-sm">
              <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 tracking-wide">
                {t("hero.badge")}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {t("hero.title1")}{" "}
              <span className="block text-slate-900 dark:text-slate-100">{t("hero.title2")}</span>
              <span className="block text-indigo-600 dark:text-indigo-400">{t("hero.title3")}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t("hero.subtitle")}
            </p>

            {/* Dual Pill CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#products"
                onClick={scrollToProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#4F46E5] dark:bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-indigo-600/35 transition-all transform hover:-translate-y-0.5"
              >
                {t("hero.btnExplore")}
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/sell"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-7 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                {t("hero.btnSell")}
              </Link>
            </div>

            {/* 3 Trust Indicator Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 px-3 py-1.5 text-indigo-900 dark:text-indigo-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>{t("hero.trustVerified")}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-900 px-3 py-1.5 text-amber-900 dark:text-amber-300">
                <Percent className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{t("hero.trustFee")}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-900 px-3 py-1.5 text-emerald-900 dark:text-emerald-300">
                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t("hero.trustCommunity")}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Full Appropriate 100% Student Image with Floating Feature Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Background Organic Color Accents */}
            <div className="absolute -top-6 -left-6 w-72 h-72 rounded-full bg-amber-200/40 dark:bg-amber-800/10 mix-blend-multiply filter blur-2xl opacity-70" />
            <div className="absolute -bottom-8 -right-6 w-72 h-72 rounded-full bg-indigo-200/50 dark:bg-indigo-800/15 mix-blend-multiply filter blur-2xl opacity-70" />

            {/* Central Student Image Container */}
            <div className="relative w-full max-w-lg aspect-[4/4.5] sm:aspect-[4/4.2] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=85"
                alt="Ethiopian University Students in Campus"
                className="h-full w-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Bottom Vignette for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Badge 1: Top Left - "Great Deals for Students" */}
            <button
              type="button"
              onClick={() => scrollToProducts(undefined, "deals")}
              className="absolute top-6 -left-2 sm:left-4 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-105 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer text-left animate-in fade-in duration-500"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{t("hero.floatDeals")}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{t("hero.floatDealsSub")}</div>
              </div>
            </button>

            {/* Floating Badge 2: Top Right - "Buy • Sell Exchange" */}
            <button
              type="button"
              onClick={() => scrollToProducts(undefined, "all")}
              className="absolute top-8 -right-2 sm:right-2 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-105 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all cursor-pointer text-left animate-in fade-in duration-700"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                <ArrowLeftRight className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{t("hero.floatSafe")}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{t("hero.floatSafeSub")}</div>
              </div>
            </button>

            {/* Floating Badge 3: Bottom Right - "Books, Electronics and More" */}
            <button
              type="button"
              onClick={() => scrollToProducts(undefined, "books")}
              className="absolute bottom-8 -right-2 sm:right-4 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-105 hover:border-amber-300 dark:hover:border-amber-600 transition-all cursor-pointer text-left animate-in fade-in duration-900"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{t("hero.floatBooks")}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{t("hero.floatBooksSub")}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
