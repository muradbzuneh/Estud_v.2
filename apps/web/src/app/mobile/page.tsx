"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  BookOpen,
  Laptop,
  Smartphone,
  Shirt,
  Dumbbell,
  MoreHorizontal,
  Star,
  MapPin,
  Heart,
  ShoppingBag,
  Home,
  Compass,
  Plus,
  Clock,
  User,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { EstudLogo } from "@/components/estud-logo";
import { EscrowCheckoutModal } from "@/components/escrow-checkout-modal";

const MOBILE_CATEGORIES = [
  { id: "all", name: "All", icon: LayoutGrid },
  { id: "books", name: "Books", icon: BookOpen },
  { id: "laptops", name: "Laptops", icon: Laptop },
  { id: "phones", name: "Phones", icon: Smartphone },
  { id: "fashion", name: "Fashion", icon: Shirt },
  { id: "sports", name: "Sports", icon: Dumbbell },
  { id: "more", name: "More", icon: MoreHorizontal },
];

const MOBILE_PRODUCTS = [
  {
    id: "mob-1",
    title: "Laptop i5 11th Gen",
    condition: "Used • Like New",
    price: 18000,
    originalPrice: 22000,
    rating: 4.8,
    reviewCount: 120,
    badge: "Best Seller",
    location: "Addis Ababa",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "mob-2",
    title: "Wireless Earbuds",
    condition: "New",
    price: 2500,
    originalPrice: 3500,
    rating: 4.7,
    reviewCount: 95,
    badge: "Popular",
    location: "Addis Ababa",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "mob-3",
    title: "Calculus Textbook",
    condition: "Used • Good",
    price: 600,
    originalPrice: 900,
    rating: 4.9,
    reviewCount: 64,
    badge: "New",
    location: "Hawassa",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "mob-4",
    title: "School Backpack",
    condition: "New",
    price: 1200,
    originalPrice: 1500,
    rating: 4.6,
    reviewCount: 78,
    badge: "20% OFF",
    location: "Mekelle",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
  },
];

export default function MobileAppSimulatorPage() {
  const [activeTab, setActiveTab] = useState<"home" | "explore" | "sell" | "activity" | "profile">("home");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<typeof MOBILE_PRODUCTS[0] | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = MOBILE_PRODUCTS.filter((item) => {
    return !searchQuery.trim() || item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Top Banner Navigation back to Web */}
      <div className="w-full max-w-4xl flex items-center justify-between text-white mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
        >
          &larr; Return to Web Marketplace
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive Estud Mobile Simulator (iOS / Android)</span>
        </div>
      </div>

      {/* Smartphone Device Frame matching Image 3 Mobile Mockup */}
      <div className="relative w-full max-w-[390px] h-[820px] rounded-[52px] bg-white border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* iOS Dynamic Island / Status Bar */}
        <div className="h-10 w-full bg-white flex items-center justify-between px-6 pt-2 select-none shrink-0 z-30">
          <span className="text-xs font-bold text-slate-900">9:41</span>
          <div className="h-4 w-28 bg-slate-950 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-900">
            <span className="text-[10px] font-bold">5G</span>
            <div className="h-2.5 w-4 border border-slate-900 rounded-sm p-0.5">
              <div className="h-full w-full bg-slate-900 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Top Header matching Mockup */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <button className="p-1 text-slate-800">
              <Menu className="h-5 w-5" />
            </button>
            <EstudLogo size={28} showText={true} />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-1 text-slate-700">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                2
              </span>
            </button>

            <Link href="/auth" className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-indigo-600/30">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        </div>

        {/* Scrollable Mobile Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          {activeTab === "home" && (
            <div className="p-4 space-y-4">
              {/* Hero Card matching Image 3 */}
              <div className="relative rounded-3xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-amber-50/50 p-4 border border-indigo-100/60 overflow-hidden">
                <div className="relative z-10 max-w-[62%]">
                  <div className="inline-flex items-center gap-1 rounded-full bg-indigo-100/80 px-2.5 py-0.5 text-[10px] font-bold text-indigo-900 mb-2">
                    <GraduationCap className="h-3 w-3 text-indigo-600" />
                    Student Marketplace
                  </div>
                  <h2 className="text-base font-black text-slate-900 leading-tight">
                    Buy, Sell and <br />
                    Exchange with <br />
                    <span className="text-indigo-600">Confidence.</span>
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    A trusted marketplace for students to find great deals on educational items.
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    <a
                      href="#mobile-grid"
                      className="inline-flex items-center justify-center gap-1 rounded-full bg-[#1E293B] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm"
                    >
                      Explore Marketplace <ArrowRight className="h-3 w-3" />
                    </a>
                    <Link
                      href="/sell"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3.5 py-1 text-[11px] font-bold text-slate-700"
                    >
                      Start Selling
                    </Link>
                  </div>
                </div>

                {/* Right Hero Student Photo */}
                <div className="absolute right-2 top-3 bottom-3 w-32 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80"
                    alt="Student"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Search Bar matching Image 3 */}
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for books, laptops, phones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                />
                <button className="absolute right-2.5 p-1 rounded-lg bg-white border border-slate-200 text-slate-600">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Category Squircle Carousel */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {MOBILE_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="flex flex-col items-center gap-1 shrink-0"
                    >
                      <div
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-[10px] font-bold ${isSelected ? "text-indigo-600" : "text-slate-600"}`}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Section Header: Featured for Students */}
              <div id="mobile-grid" className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-1 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-black text-slate-900">Featured for Students</h3>
                </div>
                <button className="text-[11px] font-bold text-indigo-600 flex items-center gap-0.5">
                  View All <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* 2-Column Product Grid */}
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                  >
                    {/* Image */}
                    <div className="relative aspect-square w-full bg-slate-100">
                      <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      {item.badge && (
                        <span className="absolute top-2 left-2 rounded-full bg-blue-600 text-white text-[8px] font-extrabold px-2 py-0.5">
                          {item.badge}
                        </span>
                      )}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90 backdrop-blur flex items-center justify-center ${
                          favorites[item.id] ? "text-rose-500" : "text-slate-400"
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${favorites[item.id] ? "fill-rose-500" : ""}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-2.5 space-y-1">
                      <div className="text-[9px] font-bold text-indigo-700">{item.condition}</div>
                      <h4 className="text-[11px] font-black text-slate-900 truncate">{item.title}</h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-black text-slate-900">ETB {item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                          <span className="text-[9px] text-slate-400 line-through">ETB {item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-[10px] text-slate-600">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                          <span className="font-bold">{item.rating}</span>
                        </div>

                        <button
                          onClick={() => setSelectedProduct(item)}
                          className="h-6 w-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition"
                        >
                          <ShoppingBag className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-[9px] text-slate-400 pt-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "explore" && (
            <div className="p-6 text-center space-y-3">
              <Compass className="h-10 w-10 text-indigo-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Explore Ethiopian Campuses</h3>
              <p className="text-xs text-slate-500">Discover verified listings from AAU, ASTU, Hawassa, and Jimma hubs.</p>
            </div>
          )}

          {activeTab === "sell" && (
            <div className="p-6 text-center space-y-3">
              <Plus className="h-10 w-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Sell on Mobile (0% Fee)</h3>
              <p className="text-xs text-slate-500">Snap photos of your items and list in seconds.</p>
              <Link
                href="/sell"
                className="inline-block rounded-full bg-emerald-600 text-white px-5 py-2 text-xs font-bold"
              >
                Open Full Seller Studio
              </Link>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="p-6 text-center space-y-3">
              <Clock className="h-10 w-10 text-indigo-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Your Escrow Activity</h3>
              <p className="text-xs text-slate-500">Track 4-digit pickup PINs and Telebirr verification status.</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="p-6 text-center space-y-3">
              <User className="h-10 w-10 text-slate-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Verified Student Profile</h3>
              <p className="text-xs text-slate-500">AAU Software Engineering &bull; 98% Escrow Trust Score</p>
              <Link
                href="/auth"
                className="inline-block rounded-full bg-slate-900 text-white px-5 py-2 text-xs font-bold"
              >
                Manage Better Auth Account
              </Link>
            </div>
          )}
        </div>

        {/* 5-Tab Bottom Navigation Bar matching Image 3 */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-30">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "home" ? "text-indigo-600" : "text-slate-400"}`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("explore")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "explore" ? "text-indigo-600" : "text-slate-400"}`}
          >
            <Compass className="h-5 w-5" />
            <span className="text-[10px] font-bold">Explore</span>
          </button>

          {/* Elevated Center (+) Sell Button */}
          <button
            onClick={() => setActiveTab("sell")}
            className="flex flex-col items-center -top-3 relative group"
          >
            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 border-4 border-white group-hover:scale-105 transition">
              <Plus className="h-6 w-6 stroke-[3]" />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 mt-0.5">Sell</span>
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "activity" ? "text-indigo-600" : "text-slate-400"}`}
          >
            <Clock className="h-5 w-5" />
            <span className="text-[10px] font-bold">Activity</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "profile" ? "text-indigo-600" : "text-slate-400"}`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </div>

      {/* Escrow Modal Trigger inside Simulator */}
      {selectedProduct && (
        <EscrowCheckoutModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={{
            id: selectedProduct.id,
            title: selectedProduct.title,
            price: selectedProduct.price,
            campus: selectedProduct.location,
            sellerName: "Verified AAU Student",
          }}
        />
      )}
    </div>
  );
}
