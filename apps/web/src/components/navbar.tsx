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
import { useLanguage } from "./language-context";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  onSearch?: (query: string) => void;
  onSelectCategory?: (category: string) => void;
  wishlistCount?: number;
}

export function Navbar({ onSearch, onSelectCategory, wishlistCount = 0 }: NavbarProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategoryClick = (categoryKey: string) => {
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(categoryKey);
    }
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand Logo with exact Estud 3-tone ribbon */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <EstudLogo size={36} showText={true} />
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Link
            href="/"
            className="text-indigo-600 dark:text-indigo-400 font-bold relative after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full"
          >
            {t("nav.home")}
          </Link>
          <a
            href="#products"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            {t("nav.explore")}
          </a>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              {t("nav.categories")}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div
                onMouseLeave={() => setCategoriesOpen(false)}
                className="absolute left-0 top-full mt-3 w-60 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 z-50"
              >
                <button
                  type="button"
                  onClick={() => handleCategoryClick("laptops")}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  {t("nav.catElectronics")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("books")}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  {t("nav.catBooks")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("phones")}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  {t("nav.catPhones")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("fashion")}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  {t("nav.catFashion")}
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleCategoryClick("deals")}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-semibold"
          >
            {t("nav.deals")}
          </button>
          <a
            href="#how-it-works"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            {t("nav.howItWorks")}
          </a>
          <Link
            href={"/activity" as any}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            {t("nav.activity")}
          </Link>
          <Link
            href="/sell"
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
          >
            <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> {t("nav.sell")}
          </Link>
          <Link
            href="/mobile"
            className="flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
          >
            <Smartphone className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> {t("nav.mobileApp")}
          </Link>
        </nav>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:flex flex-1 max-w-xs xl:max-w-sm items-center"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t("nav.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </form>

        {/* Right Actions: Language Toggle, Theme Toggle, Wishlist, Notifications, Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher (EN / አማ) */}
          <LanguageToggle />

          {/* Dark Mode Switcher (Library: next-themes) */}
          <ThemeToggle />

          {/* Wishlist Heart */}
          <Link
            href="#products"
            aria-label="Wishlist"
            className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
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
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
                2
              </span>
            </button>

            {notificationsOpen && (
              <div
                onMouseLeave={() => setNotificationsOpen(false)}
                className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in z-50 text-xs text-slate-900 dark:text-slate-100"
              >
                <div className="flex items-center justify-between font-bold border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <span>Student Notifications</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">2 New</span>
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-2.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Inspection PIN Ready</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Your AAU 4-Kilo pickup order #1042 has been verified.</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-2.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">New Exchange Offer</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Student Yohannes proposed a MacBook exchange.</p>
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
            className="flex lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lg:hidden space-y-3 animate-in fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t("nav.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-slate-100"
            />
          </form>

          <nav className="flex flex-col gap-2 pt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400"
            >
              {t("nav.home")}
            </Link>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t("nav.explore")}
            </a>
            <Link
              href={"/activity" as any}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400"
            >
              {t("nav.activity")}
            </Link>
            <Link
              href="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
            >
              {t("nav.sell")}
            </Link>
            <Link
              href="/mobile"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" /> {t("nav.mobileApp")}
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t("nav.howItWorks")}
            </a>
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {t("nav.signIn")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
