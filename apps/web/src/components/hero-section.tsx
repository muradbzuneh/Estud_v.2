"use client";

import Link from "next/link";
import { ArrowRight, Camera, ShieldCheck, CheckCircle2, Star, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50/40 to-white pt-8 pb-14 sm:pt-12 sm:pb-20">
      {/* Decorative gradient blur orbs */}
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines & CTA */}
          <div className="flex flex-col items-start lg:col-span-7">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>🎓 Student Marketplace • Ethiopia</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Buy, Sell and <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Exchange with Confidence.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-xl text-base font-normal leading-relaxed text-slate-600 sm:text-lg">
              Your trusted student-to-student platform for affordable textbooks, electronics, engineering gear, and everyday campus essentials.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="#products"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition duration-200 hover:bg-emerald-800 hover:shadow-xl hover:shadow-emerald-700/30 active:scale-95"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="#sell"
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition duration-200 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 active:scale-95"
              >
                <Camera className="h-4 w-4 text-emerald-600" />
                <span>Start Selling</span>
              </Link>
            </div>

            {/* Social Proof Stack */}
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student 1"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Student 2"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Student 3"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Student 4"
                />
              </div>
              <div className="text-xs font-semibold text-slate-700">
                <span className="font-extrabold text-emerald-700">10,000+ Students</span> across AAU, ASTU, Hawassa & Jimma
              </div>
            </div>

            {/* Trust feature pills */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Listings</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Telebirr & CBE Birr</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Campus Gate Handover</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visuals & 5% Commission Badge */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            {/* Visual Container */}
            <div className="relative w-full max-w-md">
              {/* Main Student Image Card */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-2xl shadow-emerald-900/15">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                  alt="Students learning and trading on campus"
                  className="h-96 w-full object-cover object-top opacity-95 transition duration-500 hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                    Smart Students • Smart Choices
                  </span>
                  <p className="mt-1 text-sm font-semibold text-slate-100">
                    Save up to 60% on original semester textbooks & equipment.
                  </p>
                </div>
              </div>

              {/* Floating Circular 5% Commission Badge (Exact match to Image 1) */}
              <div className="absolute -top-6 -right-6 flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-white bg-white shadow-xl shadow-slate-900/10 animate-bounce duration-1000">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Only
                </span>
                <span className="text-xl font-black text-emerald-700">
                  5%
                </span>
                <span className="text-[9px] font-bold text-slate-400">
                  Commission
                </span>
              </div>

              {/* Floating Deals card (Bottom Left) */}
              <div className="absolute -bottom-4 -left-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/95 p-3 shadow-lg backdrop-blur">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Exchange Ready</div>
                  <div className="text-[11px] font-medium text-slate-500">Trade book for book</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
