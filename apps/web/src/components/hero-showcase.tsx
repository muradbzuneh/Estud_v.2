"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  MapPin,
  BookOpen,
  Users,
} from "lucide-react";

interface SlideData {
  id: string;
  image: string;
  headTitle: string;
  tagline: string;
  description: string;
  badge: string;
  badgeIcon: typeof ShieldCheck;
  campusTag: string;
  accentColor: string;
  borderGlow: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    id: "community",
    image: "/images/hero/students-group-campus.jpg",
    headTitle: "Ethiopian Campus Community",
    tagline: "Peer-to-Peer Student Marketplace",
    description: "Trade educational gear, books, and essentials directly with verified students across AAU, ASTU, Hawassa & Jimma.",
    badge: "12,000+ Students",
    badgeIcon: Users,
    campusTag: "All Ethiopian Universities",
    accentColor: "from-amber-400 to-yellow-500",
    borderGlow: "rgba(245, 158, 11, 0.35)",
  },
  {
    id: "textbooks",
    image: "/images/hero/student-books-male.jpg",
    headTitle: "Course Books & Study Materials",
    tagline: "Save up to 40% on Peer Listings",
    description: "Engineering, medicine, calculus, and commerce textbooks handed down from senior university students.",
    badge: "0% Seller Fee",
    badgeIcon: BookOpen,
    campusTag: "AAU 4-Kilo • Science Faculty",
    accentColor: "from-blue-400 to-indigo-500",
    borderGlow: "rgba(59, 130, 246, 0.35)",
  },
  {
    id: "escrow",
    image: "/images/hero/student-hijab-female.jpg",
    headTitle: "SafeTrade In-Person Escrow",
    tagline: "Zero Fraud Risk • Safe Handover",
    description: "Buyer funds stay locked in escrow. Physically inspect and test your item at the campus desk before releasing payment.",
    badge: "100% Escrow Protected",
    badgeIcon: ShieldCheck,
    campusTag: "Campus Library Intermediary",
    accentColor: "from-emerald-400 to-teal-500",
    borderGlow: "rgba(16, 185, 129, 0.35)",
  },
  {
    id: "gear",
    image: "/images/student-backpack-3d.jpg",
    headTitle: "Campus Tech & Dorm Essentials",
    tagline: "Calculators, Laptops & Gear",
    description: "Verified laptops, Casio calculators, backpacks, and dormitory living equipment ready for campus pickup.",
    badge: "Campus Verified",
    badgeIcon: Sparkles,
    campusTag: "AAiT 5-Kilo & ASTU Adama",
    accentColor: "from-yellow-400 to-amber-500",
    borderGlow: "rgba(251, 191, 36, 0.35)",
  },
];

const AUTOPLAY_INTERVAL = 5000;

export function HeroShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play slide rotation every few seconds
  useEffect(() => {
    if (isHovered) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentIndex];
  const BadgeIcon = activeSlide.badgeIcon;

  // Slide animation variants
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <div
      className="relative w-full max-w-xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer ambient glow reacting to active slide */}
      <div
        className="absolute -inset-2 rounded-3xl opacity-40 blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${activeSlide.borderGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Main Showcase Container */}
      <div className="relative rounded-3xl border border-white/20 bg-slate-900/60 backdrop-blur-xl p-3 sm:p-4 shadow-2xl overflow-hidden">
        {/* Animated Slide Viewport */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Slide Image with subtle zoom */}
              <img
                src={activeSlide.image}
                alt={activeSlide.headTitle}
                className="w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out scale-105"
              />

              {/* Gradient Vignette Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/20" />

              {/* Top Floating Badge Bar */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-white/20 px-3 py-1 backdrop-blur-md text-[11px] font-bold text-white shadow-lg"
                >
                  <BadgeIcon className="h-3.5 w-3.5 text-amber-400" />
                  <span>{activeSlide.badge}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-white/15 px-2.5 py-1 backdrop-blur-md text-[10px] font-semibold text-slate-300"
                >
                  <MapPin className="h-3 w-3 text-brand-400" />
                  <span>{activeSlide.campusTag}</span>
                </motion.div>
              </div>

              {/* Bottom Glassmorphism Head Title & Story Card */}
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="rounded-xl border border-white/15 bg-slate-900/80 backdrop-blur-md p-3.5 text-left shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      {activeSlide.tagline}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                    {activeSlide.headTitle}
                  </h3>

                  <p className="mt-1 text-xs text-slate-200/90 leading-relaxed line-clamp-2">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left / Right Chevron Controls */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-950/60 border border-white/20 text-white backdrop-blur-md transition-all hover:bg-slate-900 hover:scale-110 active:scale-95 cursor-pointer shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-950/60 border border-white/20 text-white backdrop-blur-md transition-all hover:bg-slate-900 hover:scale-110 active:scale-95 cursor-pointer shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Thumbnail Selector & Live Progress Bar */}
        <div className="mt-3.5 grid grid-cols-4 gap-2">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`group relative flex flex-col rounded-xl p-1.5 transition-all cursor-pointer text-left ${
                  isActive
                    ? "bg-white/15 border border-amber-400/50 shadow-sm"
                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {/* Active Live Filling Progress Indicator */}
                <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden mb-1.5">
                  {isActive && !isHovered ? (
                    <motion.div
                      key={currentIndex}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-400"
                    />
                  ) : isActive && isHovered ? (
                    <div className="h-full w-full bg-amber-400" />
                  ) : null}
                </div>

                <span
                  className={`text-[10px] sm:text-[11px] font-bold truncate transition-colors ${
                    isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                  }`}
                >
                  {slide.headTitle.split(" ")[0]}
                </span>
                <span className="text-[9px] text-slate-400 truncate hidden sm:block">
                  {slide.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
