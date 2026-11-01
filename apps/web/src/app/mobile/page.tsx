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
import { useLanguage } from "@/components/language-context";
import { LanguageToggle } from "@/components/language-toggle";

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
    category: "laptops",
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
    category: "phones",
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
    category: "books",
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
    category: "fashion",
    condition: "New",
    price: 1200,
    originalPrice: 1500,
    rating: 4.6,
    reviewCount: 78,
    badge: "20% OFF",
    location: "Mekelle",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "mob-5",
    title: "Gym Dumbbells Set (20KG)",
    category: "sports",
    condition: "Used • Like New",
    price: 2100,
    originalPrice: 2800,
    rating: 4.8,
    reviewCount: 35,
    badge: "Popular",
    location: "ASTU (Adama)",
    imageUrl: "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "mob-6",
    title: "Casio fx-991EX Calculator",
    category: "laptops",
    condition: "Used • Like New",
    price: 2800,
    originalPrice: 3200,
    rating: 4.9,
    reviewCount: 142,
    badge: "Best Seller",
    location: "AAU (4 Kilo)",
    imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop&q=80",
  },
];

export default function MobileAppSimulatorPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"home" | "explore" | "sell" | "activity" | "profile">("home");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<typeof MOBILE_PRODUCTS[0] | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = MOBILE_PRODUCTS.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      selectedCategory === "more" ||
      item.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
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
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shrink-0 relative">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowDrawer(!showDrawer)}
              className="p-1 text-slate-800 hover:text-indigo-600 transition"
              aria-label="Open menu drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <EstudLogo size={28} showText={true} />
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1 text-slate-700 hover:text-indigo-600 transition"
              aria-label="Open notifications"
            >
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

          {/* In-Frame Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-3 mt-1 w-64 rounded-2xl bg-white p-3 shadow-2xl border border-slate-100 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-1.5 mb-2">
                <span>Alerts</span>
                <span className="text-[10px] text-emerald-600">2 New</span>
              </div>
              <div className="space-y-2">
                <div className="rounded-xl bg-indigo-50/70 p-2 text-[11px]">
                  <p className="font-bold text-indigo-900">Pickup PIN Ready</p>
                  <p className="text-slate-600 mt-0.5">Order #EST-84920 ready at AAU 4-Kilo hub.</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2 text-[11px]">
                  <p className="font-bold text-slate-800">New Exchange Offer</p>
                  <p className="text-slate-600 mt-0.5">Yohannes offered a laptop trade.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* In-Frame Drawer Overlay */}
        {showDrawer && (
          <div className="absolute inset-0 z-40 bg-slate-950/40 backdrop-blur-xs flex">
            <div className="w-3/4 max-w-[280px] bg-white h-full p-4 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <EstudLogo size={24} showText={true} />
                  <button
                    type="button"
                    onClick={() => setShowDrawer(false)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("home");
                      setSelectedCategory("all");
                      setShowDrawer(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-indigo-600 bg-indigo-50 font-bold"
                  >
                    Home Marketplace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("explore");
                      setShowDrawer(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
                  >
                    Campuses & Hubs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("activity");
                      setShowDrawer(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
                  >
                    Escrow & PIN Tracker
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("sell");
                      setShowDrawer(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 font-bold"
                  >
                    Sell Items (0% Fee)
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                <p className="font-bold text-slate-700">Estud Campus Network</p>
                <p>AAU • ASTU • Hawassa • Jimma</p>
              </div>
            </div>
            <div className="flex-1" onClick={() => setShowDrawer(false)} />
          </div>
        )}

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
                <button
                  type="button"
                  onClick={() => setShowFilterModal(!showFilterModal)}
                  className={`absolute right-2.5 p-1 rounded-lg border transition ${
                    showFilterModal ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-600"
                  }`}
                  aria-label="Filter campus hubs"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Campus Filter Modal Chips */}
              {showFilterModal && (
                <div className="rounded-2xl bg-indigo-50/70 p-3 border border-indigo-100 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                    <span>Filter by Campus Hub</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-[10px] text-indigo-600 underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["All Campuses", "Addis Ababa", "Hawassa", "Mekelle", "ASTU"].map((campus) => (
                      <button
                        key={campus}
                        type="button"
                        onClick={() => {
                          setSearchQuery(campus === "All Campuses" ? "" : campus);
                          setShowFilterModal(false);
                        }}
                        className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 border border-slate-200 hover:bg-indigo-600 hover:text-white transition"
                      >
                        {campus}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="text-[11px] font-bold text-indigo-600 flex items-center gap-0.5 hover:underline"
                >
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
            <div className="p-4 space-y-4">
              <div className="text-center space-y-1 py-2">
                <Compass className="h-8 w-8 text-indigo-600 mx-auto" />
                <h3 className="text-sm font-black text-slate-900">Explore Ethiopian Campuses</h3>
                <p className="text-[11px] text-slate-500">Select your campus hub to view student listings nearby.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { name: "Addis Ababa University (4 Kilo)", tag: "Addis Ababa", count: "148 items" },
                  { name: "AAU AAiT (5 Kilo Campus)", tag: "Addis Ababa", count: "92 items" },
                  { name: "Hawassa University (Main Campus)", tag: "Hawassa", count: "64 items" },
                  { name: "ASTU (Adama Science & Tech)", tag: "ASTU", count: "51 items" },
                  { name: "Mekelle University (Arid Campus)", tag: "Mekelle", count: "38 items" },
                ].map((camp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchQuery(camp.tag);
                      setActiveTab("home");
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:bg-indigo-50/40 transition text-left"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{camp.name}</p>
                      <p className="text-[10px] text-slate-500">{camp.count}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sell" && (
            <div className="p-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Plus className="h-8 w-8 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">List an Item (0% Seller Fee)</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Take photos of your textbooks, laptop, or dorm items. All seller proceeds are 100% yours.
                </p>
              </div>
              <Link
                href="/sell"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold shadow-md hover:bg-emerald-700 transition"
              >
                Open Full Seller Studio <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">SafeTrade Escrow Activity</h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">1 Active</span>
              </div>

              {/* Active Escrow Order Card with 4-Digit PIN */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-500">#EST-84920</span>
                  <span className="rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5 text-[10px] font-extrabold">
                    At Campus Hub
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-900">Laptop Dell Inspiron 15 (16GB RAM)</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-indigo-600" />
                    AAU 4 Kilo - Science Hub Desk
                  </p>
                </div>

                {/* Secret 4-digit PIN */}
                <div className="rounded-xl bg-indigo-50/80 p-3 text-center border border-indigo-100 space-y-1">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-900 uppercase">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                    Secret Inspection PIN
                  </div>
                  <div className="text-2xl font-black font-mono tracking-widest text-indigo-950">
                    7 2 9 4
                  </div>
                  <p className="text-[9px] text-slate-500">
                    Give this PIN to the campus hub manager only after inspecting your item.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Verification successful! Item marked accepted. 100% payout released to seller.")}
                  className="w-full rounded-full bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  I Inspected & Accept Item
                </button>
              </div>
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
