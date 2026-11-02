"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Heart,
  Menu,
  X,
  ChevronDown,
  Tag,
  User,
  LogOut,
} from "lucide-react";
import { EstudLogo } from "./estud-logo";
import { useLanguage } from "./language-context";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";

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
  const pathname = usePathname();
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const navigateToSection = (sectionId: string) => {
    if (pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push(`/#${sectionId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      if (onSearch) onSearch(searchQuery);
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/?search=${encodeURIComponent(searchQuery)}#products`);
    }
  };

  const handleCategoryClick = (categoryKey: string) => {
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
    if (pathname === "/") {
      if (onSelectCategory) onSelectCategory(categoryKey);
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/?category=${categoryKey}#products`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-twilight-700 bg-white/90 dark:bg-twilight-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo with 3D Mark & Crisp Typography */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <EstudLogo
            variant={isDark ? "dark" : "light"}
            size={32}
            showText={true}
          />
        </Link>

        {/* Clean Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide text-slate-600 dark:text-twilight-300">
          <button
            type="button"
            onClick={() => navigateToSection("products")}
            className="hover:text-brand-600 dark:hover:text-white transition cursor-pointer"
          >
            {t("nav.explore")}
          </button>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-white transition cursor-pointer"
            >
              {t("nav.categories")}
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoriesOpen && (
              <div
                onMouseLeave={() => setCategoriesOpen(false)}
                className="absolute left-0 top-full mt-3 w-56 rounded-2xl bg-white dark:bg-twilight-800 p-2 shadow-xl border border-slate-100 dark:border-twilight-700 animate-in fade-in slide-in-from-top-2 z-50 text-slate-800 dark:text-twilight-100"
              >
                <button
                  type="button"
                  onClick={() => handleCategoryClick("laptops")}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-twilight-750 hover:text-brand-600 dark:hover:text-brand-400 text-left transition"
                >
                  <Tag className="h-3.5 w-3.5 text-slate-400 dark:text-twilight-400" />
                  {t("nav.catElectronics")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("books")}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-twilight-750 hover:text-brand-600 dark:hover:text-brand-400 text-left transition"
                >
                  <Tag className="h-3.5 w-3.5 text-slate-400 dark:text-twilight-400" />
                  {t("nav.catBooks")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("phones")}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-twilight-750 hover:text-brand-600 dark:hover:text-brand-400 text-left transition"
                >
                  <Tag className="h-3.5 w-3.5 text-slate-400 dark:text-twilight-400" />
                  {t("nav.catPhones")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("fashion")}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-twilight-750 hover:text-brand-600 dark:hover:text-brand-400 text-left transition"
                >
                  <Tag className="h-3.5 w-3.5 text-slate-400 dark:text-twilight-400" />
                  {t("nav.catFashion")}
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigateToSection("how-it-works")}
            className="hover:text-brand-600 dark:hover:text-white transition cursor-pointer"
          >
            {t("nav.howItWorks")}
          </button>
        </nav>

        {/* Global Search Bar - Clean & Subdued */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:flex flex-1 max-w-xs xl:max-w-sm items-center"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-twilight-400" />
          <input
            type="text"
            placeholder={t("nav.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch && pathname === "/") onSearch(e.target.value);
            }}
            className="w-full rounded-full border border-slate-200/80 dark:border-twilight-700 bg-slate-100/70 dark:bg-twilight-800 py-2 pl-9 pr-4 text-xs font-normal text-slate-900 dark:text-twilight-100 placeholder:text-slate-400 dark:placeholder:text-twilight-400 transition focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-750 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </form>

        {/* Right Actions: Clean, Refined & Consistent */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher (EN / አማ) */}
          <LanguageToggle />

          {/* Dark Mode Switcher */}
          <ThemeToggle />

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={() => navigateToSection("products")}
            aria-label="Wishlist"
            className="relative hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 dark:border-twilight-700 bg-white/60 dark:bg-twilight-800 text-slate-600 dark:text-twilight-300 hover:bg-slate-100 dark:hover:bg-twilight-750 transition cursor-pointer"
          >
            <Heart className="h-3.5 w-3.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-medium text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Primary Action Button: Luminous Golden Yellow Accent matching logo */}
          <Link
            href="/sell"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 px-4 py-2 text-xs font-bold transition shadow-sm shadow-amber-500/20 active:scale-95"
          >
            <span>{t("nav.sell")}</span>
          </Link>

          {/* User Authentication Status */}
          {session?.user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center pl-1 cursor-pointer"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-twilight-600 bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{(session.user.name || "U")[0].toUpperCase()}</span>
                  )}
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-twilight-800 p-2 shadow-xl border border-slate-100 dark:border-twilight-700 z-50 text-xs"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-twilight-700">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {session.user.name || "Student"}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-twilight-400 truncate">
                      {session.user.email}
                    </div>
                  </div>
                  <Link
                    href="/activity"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 dark:text-twilight-200 hover:bg-slate-50 dark:hover:bg-twilight-750 transition"
                  >
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    <span>My Activity</span>
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setUserDropdownOpen(false);
                      await signOut();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-twilight-700 bg-white/60 dark:bg-twilight-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-twilight-200 hover:text-brand-600 dark:hover:text-white hover:border-slate-300 dark:hover:border-twilight-600 transition"
            >
              <User className="h-3.5 w-3.5 text-slate-500 dark:text-twilight-400" />
              <span className="hidden sm:inline">{t("nav.signIn")}</span>
            </Link>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden p-2 rounded-xl text-slate-700 dark:text-twilight-200 hover:bg-slate-100 dark:hover:bg-twilight-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Clean Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 dark:border-twilight-700 bg-white dark:bg-twilight-900 p-4 lg:hidden space-y-3 animate-in fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-twilight-400" />
            <input
              type="text"
              placeholder={t("nav.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-800 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-twilight-100"
            />
          </form>

          <nav className="flex flex-col gap-1.5 pt-2 text-sm font-medium text-slate-700 dark:text-twilight-200">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateToSection("products");
              }}
              className="text-left rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-twilight-800 transition"
            >
              {t("nav.explore")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateToSection("how-it-works");
              }}
              className="text-left rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-twilight-800 transition"
            >
              {t("nav.howItWorks")}
            </button>
            <Link
              href="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 font-bold text-amber-500 hover:bg-amber-50 dark:hover:bg-twilight-800 transition"
            >
              {t("nav.sell")}
            </Link>
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-twilight-800 text-slate-600 dark:text-twilight-400 transition"
            >
              {t("nav.signIn")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
