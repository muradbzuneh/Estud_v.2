"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { CategoryDock } from "@/components/category-dock";
import { FeaturedProducts } from "@/components/featured-products";
import { HowItWorks } from "@/components/how-it-works";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* 1. Header & Navigation */}
      <Navbar onSearch={(q) => console.log("Searching:", q)} />

      {/* 2. Hero Banner with 5% Commission Badge & Student Visuals */}
      <HeroSection />

      {/* 3. Floating Categories Dock (Collapsing Images 1, 2, 3) */}
      <CategoryDock
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 4. Featured Products Grid & Sell Promotional Card */}
      <FeaturedProducts />

      {/* 5. How Managed Intermediary Escrow Works */}
      <HowItWorks />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
