"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  Bell,
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
  Smartphone,
  ShieldCheck,
  Tag,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { EstudLogo } from "./estud-logo";

interface NavbarProps {
  onSearch?: (query: string) => void;
  wishlistCount?: number;
}

export function Navbar({ onSearch, wishlistCount = 0 }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    // Also scroll down to products section smoothly
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo with exact Estud 3-tone ribbon */}
        <Link href="/" className="flex items-center gap-2 group">
          <EstudLogo size={36} showText={true} />
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-700">
          <Link
            href="/"
            className="text-indigo-600 font-bold relative after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full"
          >
            Home
          </Link>
          <a
            href="#products"
            className="hover:text-indigo-600 transition"
          >
            Explore
          </a>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-1 hover:text-indigo-600 transition"
            >
              Categories
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div
                onMouseLeave={() => setCategoriesOpen(false)}
                className="absolute left-0 top-full mt-3 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-2"
              >
                <a
                  href="#products"
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  Electronics & Computing
                </a>
                <a
                  href="#products"
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  Books & Study Materials
                </a>
                <a
                  href="#products"
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  Phones & Accessories
                </a>
                <a
                  href="#products"
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  Campus Fashion & Dorm
                </a>
              </div>
            )}
          </div>

          <a
            href="#products"
            className="hover:text-indigo-600 transition"
          >
            Deals
          </a>
          <a
            href="#how-it-works"
            className="hover:text-indigo-600 transition"
          >
            How it Works
          </a>
          <Link
            href={"/activity" as any}
            className="hover:text-indigo-600 transition"
          >
            Activity
          </Link>
          <Link
            href="/sell"
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 px-3 py-1 font-bold hover:bg-emerald-100 transition"
          >
            <Sparkles className="h-3 w-3 text-emerald-600" /> Sell (0% Fee)
          </Link>
          <Link
            href="/mobile"
            className="flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 font-bold hover:bg-indigo-100 transition"
          >
            <Smartphone className="h-3.5 w-3.5 text-indigo-600" /> Mobile App
          </Link>
        </nav>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:flex flex-1 max-w-xs xl:max-w-sm items-center"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for books, laptops, phones..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </form>

        {/* Right Actions: Wishlist, Notifications, Avatar */}
        <div className="flex items-center gap-3">
          {/* Wishlist Heart */}
          <Link
            href="#products"
            aria-label="Wishlist"
            className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
                2
              </span>
            </button>

            {notificationsOpen && (
              <div
                onMouseLeave={() => setNotificationsOpen(false)}
                className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-white p-4 shadow-xl border border-slate-100 animate-in fade-in z-50 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">
                  <span>Student Notifications</span>
                  <span className="text-[10px] text-emerald-600">2 New</span>
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <p className="font-semibold text-slate-800">Inspection PIN Ready</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Your AAU 4-Kilo pickup order #1042 has been verified.</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <p className="font-semibold text-slate-800">New Exchange Offer</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Student Yohannes proposed a MacBook exchange.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Sign In */}
          <Link
            href="/auth"
            className="flex items-center gap-2 pl-1 group cursor-pointer"
          >
            <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-indigo-600/30 group-hover:ring-indigo-600 transition shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Student Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white p-4 lg:hidden space-y-3 animate-in fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search books, laptops, dorm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium"
            />
          </form>

          <nav className="flex flex-col gap-2 pt-2 text-sm font-semibold text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 text-indigo-600"
            >
              Home
            </Link>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50"
            >
              Explore Products
            </a>
            <Link
              href={"/activity" as any}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 text-indigo-600"
            >
              My Escrow Activity
            </Link>
            <Link
              href="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-emerald-50 text-emerald-700 font-bold"
            >
              Start Selling (0% Fee)
            </Link>
            <Link
              href="/mobile"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-indigo-50 text-indigo-700 font-bold flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" /> Open Mobile App View
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50"
            >
              How SafeTrade Works
            </a>
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 text-slate-600"
            >
              Sign In / Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
