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
    <section
      className="relative overflow-hidden -mt-18 pt-28 pb-16 lg:pt-36 lg:pb-24 bg-cover bg-center bg-no-repeat text-white transition-colors duration-200"
      style={{ backgroundImage: "url('/images/school-supplies-bg.jpg')" }}
    >
      {/* Translucent depth overlay so that stationery on borders is vibrant and center text is crisp */}
      <div className="absolute inset-0 bg-blue-950/25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-transparent to-blue-950/60 pointer-events-none" />

      {/* Background Soft Ambient Accents */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-10 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Student Marketplace Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 shadow-lg shadow-black/10">
              <GraduationCap className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-bold text-white tracking-wide">
                {t("hero.badge")}
              </span>
            </div>

            {/* Main Headline with transparent gradient text */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-md">
              {t("hero.title1")}{" "}
              <span className="block text-white/95">{t("hero.title2")}</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-black drop-shadow-sm">
                {t("hero.title3")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-blue-100/95 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-xs">
              {t("hero.subtitle")}
            </p>

            {/* Dual Pill CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#products"
                onClick={scrollToProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold px-8 py-3.5 text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                {t("hero.btnExplore")}
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/sell"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-sm font-bold text-white hover:bg-white/20 hover:border-white/50 transition-all shadow-lg shadow-black/10"
              >
                {t("hero.btnSell")}
              </Link>
            </div>

            {/* 3 Trust Indicator Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs font-semibold text-white">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-white shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                <span>{t("hero.trustVerified")}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-white shadow-sm">
                <Percent className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span>{t("hero.trustFee")}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-white shadow-sm">
                <Users className="h-4 w-4 text-sky-300 shrink-0" />
                <span>{t("hero.trustCommunity")}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Student Backpack Showcase with Floating Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Background Soft Glow Accents */}
            <div className="absolute -top-6 -left-6 w-72 h-72 rounded-full bg-amber-400/20 mix-blend-screen filter blur-2xl opacity-70" />
            <div className="absolute -bottom-8 -right-6 w-72 h-72 rounded-full bg-sky-400/20 mix-blend-screen filter blur-2xl opacity-70" />

            {/* Central 3D Student Backpack Image Container */}
            <div className="relative w-full max-w-md aspect-square rounded-[36px] overflow-hidden shadow-2xl border border-white/30 bg-white/15 backdrop-blur-xl p-3 sm:p-4 group">
              <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-white/95 shadow-inner flex items-center justify-center p-3">
                <img
                  src="/images/student-backpack-3d.jpg"
                  alt="Student 3D Backpack with Books, Clock and Stationery"
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Floating Badge 1: Top Left - "Great Deals for Students" */}
            <button
              type="button"
              onClick={() => scrollToProducts(undefined, "deals")}
              className="absolute top-4 -left-2 sm:left-2 z-20 flex items-center gap-2.5 rounded-2xl bg-slate-950/50 backdrop-blur-xl px-3.5 py-2.5 shadow-2xl border border-white/20 hover:scale-105 hover:bg-slate-950/70 transition-all cursor-pointer text-left text-white animate-in fade-in duration-500"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t("hero.floatDeals")}</div>
                <div className="text-[10px] text-white/80 font-medium">{t("hero.floatDealsSub")}</div>
              </div>
            </button>

            {/* Floating Badge 2: Top Right - "Buy • Sell Exchange" */}
            <button
              type="button"
              onClick={() => scrollToProducts(undefined, "all")}
              className="absolute top-6 -right-2 sm:right-0 z-20 flex items-center gap-2.5 rounded-2xl bg-slate-950/50 backdrop-blur-xl px-3.5 py-2.5 shadow-2xl border border-white/20 hover:scale-105 hover:bg-slate-950/70 transition-all cursor-pointer text-left text-white animate-in fade-in duration-700"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                <ArrowLeftRight className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t("hero.floatSafe")}</div>
                <div className="text-[10px] text-white/80 font-medium">{t("hero.floatSafeSub")}</div>
              </div>
            </button>

            {/* Floating Badge 3: Bottom Right - "Books, Electronics and More" */}
            <button
              type="button"
              onClick={() => scrollToProducts(undefined, "books")}
              className="absolute bottom-6 -right-2 sm:right-2 z-20 flex items-center gap-2.5 rounded-2xl bg-slate-950/50 backdrop-blur-xl px-4 py-3 shadow-2xl border border-white/20 hover:scale-105 hover:bg-slate-950/70 transition-all cursor-pointer text-left text-white animate-in fade-in duration-900"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/20 text-sky-300">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t("hero.floatBooks")}</div>
                <div className="text-[10px] text-white/80 font-medium">{t("hero.floatBooksSub")}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom subtle transition into the category dock */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] dark:from-[#0B0F19] to-transparent pointer-events-none" />
    </section>
  );
}
