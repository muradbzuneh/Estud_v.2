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
  ShieldCheck,
  ShieldAlert,
  Activity as ActivityIcon,
  MapPin,
} from "lucide-react";
import { EstudLogo } from "./estud-logo";
import { useLanguage } from "./language-context";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { AuthModal } from "./auth-modal";
import { CampusMapModal } from "./campus-map-modal";
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [campusMapOpen, setCampusMapOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const isAdmin =
    session?.user &&
    ((session.user as any).role === "admin" ||
      session.user.email === "murad@gmail.com" ||
      session.user.email === "admin@estud.et");

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

  const handleActivityClick = () => {
    setMobileMenuOpen(false);
    if (session?.user) {
      router.push("/activity");
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleSellClick = (e: React.MouseEvent) => {
    if (!session?.user) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  return (
    <>
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

            {/* My Activity in Header with Live Interactivity */}
            <button
              type="button"
              onClick={handleActivityClick}
              className={`flex items-center gap-1.5 transition cursor-pointer py-1 ${
                pathname === "/activity"
                  ? "text-brand-600 dark:text-brand-400 font-bold"
                  : "hover:text-brand-600 dark:hover:text-white"
              }`}
            >
              <span>{t("nav.activity") || "My Activity"}</span>
              {session?.user ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              ) : (
                <span className="rounded-full bg-slate-200/60 dark:bg-twilight-750 text-slate-600 dark:text-twilight-400 text-[10px] px-1.5 py-0.2">
                  Orders
                </span>
              )}
            </button>

            {/* Campus Lost & Found */}
            <Link
              href={"/lost-found" as any}
              className={`flex items-center gap-1 transition cursor-pointer py-1 ${
                pathname === "/lost-found"
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              <span>Lost &amp; Found</span>
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 border border-emerald-500/20">
                Desk
              </span>
            </Link>

            {/* Campus Hubs & Live Google Map */}
            <button
              type="button"
              onClick={() => setCampusMapOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-brand-50/90 dark:bg-twilight-750/90 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-twilight-600 hover:bg-brand-100 dark:hover:bg-twilight-700 hover:border-brand-300 dark:hover:border-twilight-500 shadow-2xs transition cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Campus Map</span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
            </button>
          </nav>

          {/* Global Search Bar */}
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

          {/* Right Actions */}
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

            {/* Primary Action Button: Luminous Golden Yellow Accent */}
            <Link
              href="/sell"
              onClick={handleSellClick}
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
                      <ActivityIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span>My Activity & Escrow</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                      >
                        <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                        <span>Operations Portal</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await signOut();
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-twilight-700 bg-white/60 dark:bg-twilight-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-twilight-200 hover:text-brand-600 dark:hover:text-white hover:border-slate-300 dark:hover:border-twilight-600 transition cursor-pointer"
              >
                <User className="h-3.5 w-3.5 text-slate-500 dark:text-twilight-400" />
                <span className="hidden sm:inline">{t("nav.signIn")}</span>
              </button>
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

        {/* Mobile Menu Dropdown */}
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

              {/* My Activity Link in Mobile Menu */}
              <button
                type="button"
                onClick={handleActivityClick}
                className="flex items-center justify-between text-left rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-twilight-800 transition"
              >
                <span>{t("nav.activity") || "My Activity"}</span>
                {session?.user ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                ) : null}
              </button>

              {/* Campus Lost & Found */}
            <Link
              href={"/lost-found" as any}
              className={`flex items-center gap-1 transition cursor-pointer py-1 ${
                pathname === "/lost-found"
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              <span>Lost &amp; Found</span>
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 border border-emerald-500/20">
                Desk
              </span>
            </Link>

            {/* Campus Hubs & Live Google Map */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCampusMapOpen(true);
                }}
                className="text-left rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-twilight-800 text-brand-600 dark:text-brand-400 font-semibold transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Campus SafeTrade Map</span>
                </div>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2 font-bold text-red-500 hover:bg-red-50 dark:hover:bg-twilight-800 transition flex items-center gap-2"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Admin Operations Portal</span>
                </Link>
              )}

              <Link
                href="/sell"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleSellClick(e);
                }}
                className="rounded-xl px-3 py-2 font-bold text-amber-500 hover:bg-amber-50 dark:hover:bg-twilight-800 transition"
              >
                {t("nav.sell")}
              </Link>

              {!session?.user && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="text-left rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-twilight-800 text-slate-600 dark:text-twilight-400 transition"
                >
                  {t("nav.signIn")}
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Embedded Auth Modal for Instant Guest Prompts */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signin"
      />

      {/* Interactive Google Map Campus Hub Modal */}
      <CampusMapModal
        isOpen={campusMapOpen}
        onClose={() => setCampusMapOpen(false)}
      />
    </>
  );
}
