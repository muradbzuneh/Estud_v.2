"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Star,
  MapPin,
  ArrowRight,
  GraduationCap,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EscrowCheckoutModal } from "./escrow-checkout-modal";

export interface DisplayProduct {
  id: string;
  title: string;
  category: string;
  condition: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "New" | "Best Seller" | "Popular" | "20% OFF";
  location: string;
  imageUrl: string;
}

export const SAMPLE_FEATURED_PRODUCTS: DisplayProduct[] = [
  {
    id: "prod-1",
    title: "Laptop i5 11th Gen (16GB RAM, 512GB SSD)",
    category: "laptops",
    condition: "Used • Like New",
    price: 18000,
    originalPrice: 22000,
    rating: 4.8,
    reviewCount: 120,
    badge: "Best Seller",
    location: "Addis Ababa (4 Kilo)",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-2",
    title: "Wireless Earbuds with Noise Cancellation",
    category: "phones",
    condition: "New • Sealed",
    price: 2500,
    originalPrice: 3500,
    rating: 4.7,
    reviewCount: 95,
    badge: "Popular",
    location: "Addis Ababa (AAiT)",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-3",
    title: "Calculus Textbook (Hardcover Edition)",
    category: "books",
    condition: "Used • Good",
    price: 600,
    originalPrice: 900,
    rating: 4.9,
    reviewCount: 64,
    badge: "New",
    location: "Hawassa University",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-4",
    title: "School Backpack (Waterproof Student Edition)",
    category: "fashion",
    condition: "New • Waterproof",
    price: 1200,
    originalPrice: 1500,
    rating: 4.6,
    reviewCount: 78,
    badge: "20% OFF",
    location: "Mekelle University",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-5",
    title: "Scientific Calculator Casio fx-991EX",
    category: "laptops",
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
    title: "Dorm Study Desk & Ergonomic Mesh Chair",
    category: "furniture",
    condition: "Used • Excellent",
    price: 4500,
    originalPrice: 5800,
    rating: 4.8,
    reviewCount: 42,
    badge: "Best Seller",
    location: "Addis Ababa (6 Kilo)",
    imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
  },
];

interface FeaturedProductsProps {
  selectedCategory?: string;
  searchQuery?: string;
  onWishlistToggle?: (productId: string, isSaved: boolean) => void;
}

export function FeaturedProducts({
  selectedCategory = "all",
  searchQuery = "",
  onWishlistToggle,
}: FeaturedProductsProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<DisplayProduct | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = !prev[id];
      if (onWishlistToggle) onWishlistToggle(id, next);
      return { ...prev, [id]: next };
    });
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

  // Filter products by active category and search
  const filteredProducts = SAMPLE_FEATURED_PRODUCTS.filter((item) => {
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

  const displayedList = showAll ? filteredProducts : filteredProducts.slice(0, 4);

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Section Header matching Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Verified Student Listings
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Featured for Students
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition"
          >
            <span>{showAll ? "Show Less" : "View All Products"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {displayedList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-sm font-semibold text-slate-600">No student listings matched your criteria.</p>
          <button
            onClick={() => {
              setShowAll(true);
            }}
            className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
          >
            Clear filters & view all products
          </button>
        </div>
      ) : (
        /* Cards Grid + Promotional Card */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {displayedList.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-950/5"
            >
              {/* Image & Badges */}
              <Link href={`/products/${item.id}`} className="relative aspect-square w-full overflow-hidden bg-slate-100 block">
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
              </Link>

              {/* Favorite Heart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(item.id);
                }}
                aria-label="Save to favorites"
                className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur shadow-sm transition z-10 ${
                  favorites[item.id] ? "text-rose-500" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <Heart className={`h-4 w-4 ${favorites[item.id] ? "fill-rose-500" : ""}`} />
              </button>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                {/* Condition */}
                <div className="text-[11px] font-bold text-emerald-700">
                  {item.condition}
                </div>

                {/* Title */}
                <Link
                  href={`/products/${item.id}`}
                  className="mt-1 line-clamp-2 text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition"
                >
                  {item.title}
                </Link>

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
                    onClick={() => setCheckoutProduct(item)}
                    aria-label="Order with SafeTrade Escrow"
                    className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Promotional Sell Card matching Mockup */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 text-white shadow-xl">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20">
                <Sparkles className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-black leading-snug">
                  Sell Your Items
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Turn your unused books, tech, and dorm essentials into cash. 0% seller fee promo.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/sell"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white py-3 text-xs font-bold text-slate-900 hover:bg-slate-100 transition shadow-md"
              >
                Start Selling <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Escrow Checkout Modal */}
      {checkoutProduct && (
        <EscrowCheckoutModal
          isOpen={!!checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
          product={{
            id: checkoutProduct.id,
            title: checkoutProduct.title,
            price: checkoutProduct.price,
            campus: checkoutProduct.location,
            sellerName: "Verified AAU Student",
          }}
        />
      )}
    </section>
  );
}
