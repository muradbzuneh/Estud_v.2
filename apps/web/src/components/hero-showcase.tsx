"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideData {
  id: string;
  image: string;
  headTitle: string;
  description: string;
  borderGlow: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    id: "community",
    image: "/images/hero/students-group-campus.jpg",
    headTitle: "Ethiopian Campus Community",
    description: "Connect and trade textbooks, study gear, and essentials with verified university students.",
    borderGlow: "rgba(245, 158, 11, 0.25)",
  },
  {
    id: "textbooks",
    image: "/images/hero/student-books-male.jpg",
    headTitle: "Course Books & Study Materials",
    description: "Engineering, medicine, calculus, and course notes passed down directly from senior students.",
    borderGlow: "rgba(59, 130, 246, 0.25)",
  },
  {
    id: "escrow",
    image: "/images/hero/student-hijab-female.jpg",
    headTitle: "SafeTrade In-Person Escrow",
    description: "Buyer funds stay secure until you physically inspect and accept your item at campus handover.",
    borderGlow: "rgba(16, 185, 129, 0.25)",
  },
  {
    id: "gear",
    image: "/images/student-backpack-3d.jpg",
    headTitle: "Campus Tech & Dorm Essentials",
    description: "Calculators, laptops, backpacks, and dormitory supplies ready for convenient campus pickup.",
    borderGlow: "rgba(251, 191, 36, 0.25)",
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

  // Professional slide transitions
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.45 },
        scale: { duration: 0.45 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring" as const, stiffness: 280, damping: 28 },
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
      {/* Outer ambient glow reacting smoothly to active slide */}
      <div
        className="absolute -inset-2 rounded-3xl opacity-35 blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${activeSlide.borderGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Main Showcase Container - Clean, Frameless Luxury Aesthetic */}
      <div className="relative rounded-3xl border border-white/15 bg-slate-900/60 backdrop-blur-xl p-3 sm:p-4 shadow-2xl overflow-hidden">
        
        {/* Animated Slide Viewport */}
        <div className="group relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
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
              {/* Slide Image with slow Ken Burns effect */}
              <img
                src={activeSlide.image}
                alt={activeSlide.headTitle}
                className="w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out scale-105"
              />

              {/* Gradient Vignette for Crisp Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

              {/* Bottom Clean Head Title & Context Description */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                <motion.div
                  key={`text-${activeSlide.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                    {activeSlide.headTitle}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-md line-clamp-2">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Clean Subtle Chevron Arrows (Visible on hover) */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/50 border border-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-900 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/50 border border-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-900 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Minimalist Modern Progress Bar (Apple / Tesla style slim line segments) */}
        <div className="mt-3.5 flex items-center gap-2 px-1">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                aria-label={`Go to slide ${index + 1}: ${slide.headTitle}`}
                className="group relative flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer transition-all hover:bg-white/30"
              >
                {isActive && !isHovered ? (
                  <motion.div
                    key={`progress-${currentIndex}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"
                  />
                ) : isActive && isHovered ? (
                  <div className="h-full w-full bg-amber-400 rounded-full" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
