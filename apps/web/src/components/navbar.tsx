"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Bell,
  Heart,
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
  ArrowRightLeft,
  HelpCircle,
} from "lucide-react";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-md">
      {/* Top micro-bar for Ethiopia announcements */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-4 py-1.5 text-center text-xs font-medium text-emerald-50">
        <span>🎓 Ethiopia's Trusted Student Marketplace • 100% Escrow Protection • 5% Transparent Fee</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 shadow-md shadow-emerald-500/20">
            {/* Geometric academic cap logo */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900">
              Estud<span className="text-emerald-600">.</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Campus Market
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <div className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800 transition"
          >
            Home
          </Link>
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 transition">
              <span>Categories</span>
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
            </button>
          </div>
          <Link
            href="#sell"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 transition"
          >
            Sell
          </Link>
          <Link
            href="#exchanges"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 transition"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-600" />
            <span>Exchange</span>
          </Link>
          <Link
            href="#lost-found"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 transition"
          >
            Lost & Found
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 transition"
          >
            How it Works
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="relative hidden max-w-xs flex-1 md:flex lg:max-w-sm"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search textbooks, Casio fx, laptops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </form>

        {/* Right Actions: Notifications, Wishlist, User Avatar */}
        <div className="flex items-center gap-2.5">
          <button
            aria-label="Wishlist"
            className="hidden rounded-full p-2 text-slate-600 hover:bg-slate-100 sm:flex transition"
          >
            <Heart className="h-5 w-5" />
          </button>

          <button
            aria-label="Notifications"
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-white">
              2
            </span>
          </button>

          {/* User Profile Avatar */}
          <Link href="/auth" className="flex items-center gap-2 pl-1 cursor-pointer">
            <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-emerald-500 ring-2 ring-emerald-500/20 hover:scale-105 transition">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Student Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs font-medium text-slate-800"
            />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <Link href="/" className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">
              Home
            </Link>
            <Link href="#categories" className="rounded-lg px-3 py-2 hover:bg-slate-50">
              Explore Categories
            </Link>
            <Link href="#sell" className="rounded-lg px-3 py-2 hover:bg-slate-50">
              Sell Product
            </Link>
            <Link href="#exchanges" className="rounded-lg px-3 py-2 hover:bg-slate-50">
              Product Exchange
            </Link>
            <Link href="#lost-found" className="rounded-lg px-3 py-2 hover:bg-slate-50">
              Lost & Found
            </Link>
            <Link href="#how-it-works" className="rounded-lg px-3 py-2 hover:bg-slate-50">
              How Escrow Works
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
