"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import {
  Search,
  BookOpen,
  Laptop,
  Ruler,
  Calculator,
  Home,
  ShieldCheck,
  ArrowRightLeft,
  CheckCircle2,
  MapPin,
} from "lucide-react";

const CATEGORIES = [
  { name: "Textbooks", icon: BookOpen },
  { name: "Laptops & Tech", icon: Laptop },
  { name: "Engineering Gear", icon: Ruler },
  { name: "Calculators", icon: Calculator },
  { name: "Dorm Essentials", icon: Home },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = trpc.products.list.useQuery({
    limit: 12,
  });

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Banner */}
      <div className="bg-emerald-700 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        🇪🇹 Ethiopia's Verified Student Marketplace • Safe Escrow & Campus Delivery
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-lg font-black tracking-wider text-white">
              ESTUD
            </span>
            <span className="hidden text-xs font-semibold uppercase tracking-widest text-slate-500 sm:inline">
              Campus Market
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-600">
              <ArrowRightLeft className="h-4 w-4" />
              <span>Exchanges</span>
            </button>
            <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
              Post an Item
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/50 to-white py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Buy, Sell & Exchange with <span className="text-emerald-600">Verified Students</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Guaranteed physical condition inspection, 5% transparent escrow fee, and delivery to your campus gate.
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
            <Search className="ml-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search textbooks, Casio fx-991, drafting boards, laptops..."
              className="w-full bg-transparent px-3 text-sm focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              Search
            </button>
          </div>

          {/* Value Props */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> 100% Intermediary Escrow
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Admin Valuation & Approval
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600" /> AAU, ASTU, HU & JU Campuses
            </span>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="border-y border-slate-100 bg-slate-50 py-4 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-600 shadow-sm"
              >
                <Icon className="h-4 w-4 text-slate-500" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Listings Grid */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Featured Student Listings</h2>
          <span className="text-xs font-medium text-slate-500">Verified by Estud</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : data?.items?.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">No listings yet</h3>
            <p className="mt-1 text-xs text-slate-500">
              Be the first to post a textbook, laptop, or campus item!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data?.items?.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
              >
                <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                  {item.images[0]?.imageUrl ? (
                    <img
                      src={item.images[0].imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <BookOpen className="h-10 w-10 text-slate-300" />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {item.condition.replace("_", " ")}
                  </span>
                  <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <div className="mt-auto pt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">
                        {item.publishedPrice ? `${item.publishedPrice} ETB` : "Valuation Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        © 2026 Estud Marketplace. Dedicated to students in Ethiopia.
      </footer>
    </div>
  );
}
