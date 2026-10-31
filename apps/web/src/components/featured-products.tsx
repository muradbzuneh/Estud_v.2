"use client";

import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
  MapPin,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export interface DisplayProduct {
  id: string;
  title: string;
  condition: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "New" | "Best Seller" | "Popular" | "20% OFF";
  badgeColor?: string;
  location: string;
  imageUrl: string;
}

const SAMPLE_FEATURED_PRODUCTS: DisplayProduct[] = [
  {
    id: "prod-1",
    title: "Dell Inspiron 15 Core i5 (11th Gen)",
    condition: "Used • Like New",
    price: 18000,
    originalPrice: 22000,
    rating: 4.8,
    reviewCount: 120,
    badge: "Best Seller",
    location: "Addis Ababa (AAU 5 Kilo)",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-2",
    title: "Sony Noise-Canceling Wireless Earbuds",
    condition: "Brand New",
    price: 2500,
    originalPrice: 3500,
    rating: 4.7,
    reviewCount: 95,
    badge: "Popular",
    location: "Addis Ababa (Bole Hub)",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-3",
    title: "Thomas' Calculus (14th Edition Hardcover)",
    condition: "Used • Good",
    price: 600,
    originalPrice: 900,
    rating: 4.9,
    reviewCount: 64,
    badge: "New",
    location: "Hawassa (Main Campus)",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-4",
    title: "Waterproof Student Campus Backpack",
    condition: "Brand New",
    price: 1200,
    originalPrice: 1500,
    rating: 4.6,
    reviewCount: 78,
    badge: "20% OFF",
    location: "Adama (ASTU Gate 1)",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-5",
    title: "Casio fx-991EX ClassWiz Scientific Calculator",
    condition: "Used • Like New",
    price: 2800,
    originalPrice: 3200,
    rating: 4.9,
    reviewCount: 142,
    badge: "Popular",
    location: "Addis Ababa (AAU 4 Kilo)",
    imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-6",
    title: "Professional Architecture Drafting Board & T-Square",
    condition: "Used • Good",
    price: 3400,
    originalPrice: 4200,
    rating: 4.7,
    reviewCount: 31,
    badge: "New",
    location: "Addis Ababa (AAiT)",
    imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80",
  },
];

export function FeaturedProducts() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case "Best Seller":
        return "bg-blue-600 text-white";
      case "Popular":
        return "bg-amber-500 text-white";
      case "New":
        return "bg-emerald-600 text-white";
      case "20% OFF":
        return "bg-indigo-600 text-white";
      default:
        return "bg-slate-800 text-white";
    }
  };

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Verified Student Listings
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Featured for Students
          </h2>
        </div>

        <button className="group inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition">
          <span>View All Products</span>
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </button>
      </div>

      {/* Cards Grid + Promotional Card */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {SAMPLE_FEATURED_PRODUCTS.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5"
          >
            {/* Image & Badges */}
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />

              {/* Status Badge */}
              {item.badge && (
                <div
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${getBadgeStyle(
                    item.badge
                  )}`}
                >
                  {item.badge}
                </div>
              )}

              {/* Favorite Heart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(item.id);
                }}
                aria-label="Save to favorites"
                className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm transition ${
                  favorites[item.id] ? "text-rose-500" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <Heart className={`h-4 w-4 ${favorites[item.id] ? "fill-rose-500" : ""}`} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              {/* Condition */}
              <div className="text-[11px] font-bold text-emerald-700">
                {item.condition}
              </div>

              {/* Title */}
              <h3 className="mt-1 line-clamp-2 text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                {item.title}
              </h3>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                <span className="font-extrabold text-slate-800">{item.rating}</span>
                <span className="text-[11px]">({item.reviewCount})</span>
              </div>

              {/* Location Badge */}
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span className="truncate">{item.location}</span>
              </div>

              {/* Price & Action */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-black text-slate-900">
                    ETB {item.price.toLocaleString()}
                  </span>
                  {item.originalPrice && (
                    <span className="text-[10px] text-slate-400 line-through">
                      ETB {item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  aria-label="Order or exchange"
                  className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Promotional CTA Card (Exact match to Green Banner in Images 1, 2, and 3) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-6 text-white shadow-xl shadow-emerald-950/20 col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-2">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-2xl" />

          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-800/80 text-emerald-300">
              <GraduationCap className="h-6 w-6" />
            </div>

            <span className="mt-5 inline-block text-[11px] font-bold uppercase tracking-widest text-emerald-300">
              Learn • Trade • Grow
            </span>

            <h3 className="mt-2 text-xl sm:text-2xl font-black text-white">
              Turn your unused textbooks & gear into cash.
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-emerald-100/80">
              Estud values your item, verifies buyer payment, and coordinates campus pickup. Transparent 5% commission.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-800/60">
            <Link
              href="#sell"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs sm:text-sm font-bold text-emerald-900 shadow-md transition duration-150 hover:bg-emerald-50 active:scale-95"
            >
              <span>Start Selling on Estud</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
