"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Heart,
  Menu,
  X,
  ChevronDown,
  Tag,
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

export function Navbar({
  onSearch,
  onSelectCategory,
  wishlistCount = 0,
}: NavbarProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

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
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo with exact state images (light / dark) */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <EstudLogo
            variant={isDark ? "dark" : "light"}
            size={36}
          />
        </Link>

        {/* Clean, Non-repetitive Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#products"
            className="hover:text-indigo-600 dark:hover:text-white transition"
          >
            {t("nav.explore")}
          </a>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-white transition"
            >
              {t("nav.categories")}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoriesOpen && (
              <div
                onMouseLeave={() => setCategoriesOpen(false)}
                className="absolute left-0 top-full mt-3 w-56 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 z-50 text-slate-800 dark:text-slate-200"
              >
                <button
                  type="button"
                  onClick={() => handleCategoryClick("laptops")}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  {t("nav.catElectronics")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("books")}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  {t("nav.catBooks")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("phones")}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  {t("nav.catPhones")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("fashion")}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  {t("nav.catFashion")}
                </button>
              </div>
            )}
          </div>

          <a
            href="#how-it-works"
            className="hover:text-indigo-600 dark:hover:text-white transition"
          >
            {t("nav.howItWorks")}
          </a>
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

        {/* Right Actions: Clean & Consistent */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher (EN / አማ) */}
          <LanguageToggle />

          {/* Dark Mode Switcher */}
          <ThemeToggle />

          {/* Wishlist Heart */}
          <Link
            href="#products"
            aria-label="Wishlist"
            className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Primary Action Button: Consistent Indigo Brand Button */}
          <Link
            href="/sell"
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-xs font-semibold shadow-sm transition"
          >
            <Sparkles className="h-3 w-3" />
            <span>{t("nav.sell")}</span>
          </Link>

          {/* User Profile Avatar / Sign In */}
          <Link
            href="/auth"
            className="flex items-center pl-1 group cursor-pointer"
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

      {/* Clean Mobile Menu Dropdown */}
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

          <nav className="flex flex-col gap-1.5 pt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {t("nav.explore")}
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {t("nav.howItWorks")}
            </a>
            <Link
              href="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" /> {t("nav.sell")}
            </Link>
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
            >
              {t("nav.signIn")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
