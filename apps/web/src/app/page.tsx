"use client";

import React, { useState } from "react";
import { TopAnnouncementBanner } from "@/components/top-announcement-banner";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { CategoryDock } from "@/components/category-dock";
import { FeaturedProducts } from "@/components/featured-products";
import { HowItWorks } from "@/components/how-it-works";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  const handleWishlistToggle = (_id: string, isSaved: boolean) => {
    setWishlistCount((prev) => (isSaved ? prev + 1 : Math.max(0, prev - 1)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Banner (Auto-dismisses smoothly after 5 seconds) */}
      <TopAnnouncementBanner autoHideDuration={5000} />

      {/* Modern Responsive Navbar with exact Estud Logo */}
      <Navbar
        onSearch={(q) => setSearchQuery(q)}
        wishlistCount={wishlistCount}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Full Image Background Hero Section matching Mockup */}
        <HeroSection />

        {/* Floating Category Dock with Active Filter State */}
        <CategoryDock
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        {/* Dynamic & Interactive Featured Student Listings */}
        <FeaturedProducts
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onWishlistToggle={handleWishlistToggle}
        />

        {/* 5% Escrow SafeTrade Breakdown */}
        <HowItWorks />
      </main>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
}
