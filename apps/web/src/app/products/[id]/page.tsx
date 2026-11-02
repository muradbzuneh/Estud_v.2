"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  ArrowLeftRight,
  Heart,
  Share2,
  Lock,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Info,
  BadgeCheck,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductGallery } from "@/components/product-gallery";
import { EscrowCheckoutModal } from "@/components/escrow-checkout-modal";
import { ExchangeProposalModal } from "@/components/exchange-proposal-modal";

const PRODUCT_CATALOG: Record<
  string,
  {
    id: string;
    title: string;
    category: string;
    price: number;
    originalPrice?: number;
    condition: string;
    campus: string;
    createdAt: string;
    seller: {
      name: string;
      avatar: string;
      university: string;
      department: string;
      rating: number;
      completedOrders: number;
    };
    images: { id: string; imageUrl: string; isPrimary?: boolean }[];
    specs: { label: string; value: string }[];
    inspectionNotes: string;
    exchangePreferences: string;
  }
> = {
  "prod-1": {
    id: "prod-1",
    title: "Laptop Dell Inspiron 15 (11th Gen Core i5, 16GB RAM, 512GB NVMe)",
    category: "Laptops & Computers",
    price: 18000,
    originalPrice: 22000,
    condition: "Used • Like New",
    campus: "Addis Ababa University (4 Kilo Campus)",
    createdAt: "2 hours ago",
    seller: {
      name: "Yohannes M.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      university: "Addis Ababa University",
      department: "Software Engineering, Year 4",
      rating: 4.8,
      completedOrders: 14,
    },
    images: [
      { id: "1", imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&auto=format&fit=crop&q=80", isPrimary: true },
      { id: "2", imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900&auto=format&fit=crop&q=80" },
      { id: "3", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80" },
    ],
    specs: [
      { label: "Processor", value: "Intel Core i5-1135G7 (up to 4.2 GHz)" },
      { label: "RAM", value: "16GB DDR4 Dual-Channel" },
      { label: "Storage", value: "512GB M.2 PCIe NVMe SSD" },
      { label: "Battery Health", value: "92% original capacity (~5.5 hours)" },
    ],
    inspectionNotes: "Clean screen, 100% responsive keyboard, verified original charger included.",
    exchangePreferences: "Open to trade for iPad 9th/10th Gen or MacBook Air M1 with cash adjustment.",
  },
  "prod-2": {
    id: "prod-2",
    title: "Sony Noise-Canceling Wireless Earbuds (Extra Bass)",
    category: "Phones & Audio",
    price: 2500,
    originalPrice: 3500,
    condition: "New • Sealed",
    campus: "Addis Ababa University (AAiT 5 Kilo)",
    createdAt: "3 hours ago",
    seller: {
      name: "Alazar T.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      university: "Addis Ababa University",
      department: "Electrical Engineering, Year 3",
      rating: 4.7,
      completedOrders: 9,
    },
    images: [
      { id: "1", imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80", isPrimary: true },
      { id: "2", imageUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=900&auto=format&fit=crop&q=80" },
    ],
    specs: [
      { label: "Battery Life", value: "24 Hours (with Charging Case)" },
      { label: "Connectivity", value: "Bluetooth 5.2 (Fast Pair)" },
      { label: "Features", value: "Active Noise Cancellation + IPX4 Water Resistance" },
    ],
    inspectionNotes: "Brand new factory sealed box, unopened with warranty slip.",
    exchangePreferences: "Willing to trade for Apple Pencil (1st Gen) or Scientific Calculator.",
  },
  "prod-3": {
    id: "prod-3",
    title: "Thomas' Calculus (14th Edition Hardcover Original)",
    category: "Books & Study",
    price: 600,
    originalPrice: 900,
    condition: "Used • Good",
    campus: "Hawassa University (Main Campus)",
    createdAt: "5 hours ago",
    seller: {
      name: "Bethlehem K.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      university: "Hawassa University",
      department: "Civil Engineering, Year 2",
      rating: 4.9,
      completedOrders: 21,
    },
    images: [
      { id: "1", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80", isPrimary: true },
      { id: "2", imageUrl: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=900&auto=format&fit=crop&q=80" },
    ],
    specs: [
      { label: "Edition", value: "14th International Hardcover Edition" },
      { label: "Pages", value: "1,200 Pages (All intact)" },
      { label: "Subject", value: "Calculus I, II & Multivariable Mathematics" },
    ],
    inspectionNotes: "Clean pages with minimal pencil notes in Chapter 3. Binding is solid.",
    exchangePreferences: "Open to trade for Engineering Mechanics: Statics or Linear Algebra textbook.",
  },
  "prod-4": {
    id: "prod-4",
    title: "Waterproof Student Campus Backpack with USB Port",
    category: "Campus Fashion & Dorm",
    price: 1200,
    originalPrice: 1500,
    condition: "New • Waterproof",
    campus: "Mekelle University (Arid Campus)",
    createdAt: "1 day ago",
    seller: {
      name: "Dawit G.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      university: "Mekelle University",
      department: "Economics, Year 3",
      rating: 4.6,
      completedOrders: 8,
    },
    images: [
      { id: "1", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=80", isPrimary: true },
    ],
    specs: [
      { label: "Capacity", value: "30L (Holds up to 15.6-inch laptop)" },
      { label: "Material", value: "900D Oxford Waterproof Fabric" },
      { label: "Features", value: "External USB charging port + Anti-theft back pocket" },
    ],
    inspectionNotes: "Brand new, never used with original tags.",
    exchangePreferences: "Open to trade for study lamp or wireless mouse.",
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || "prod-1";

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "inspection" | "seller">("specs");

  // Lookup product from catalog or fall back gracefully
  const product = PRODUCT_CATALOG[productId] || {
    ...PRODUCT_CATALOG["prod-1"],
    id: productId,
    title: `Campus Listing (${productId.toUpperCase()})`,
  };

  const escrowFee = Math.round(product.price * 0.05);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-twilight-900 text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-twilight-300 mb-6 overflow-x-auto">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-twilight-300" />
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition">{product.category}</Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-twilight-300" />
          <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} title={product.title} />

            {/* Verification Guarantee Card */}
            <div className="mt-8 rounded-3xl border border-brand-500/20 bg-brand-50/50 dark:bg-twilight-800/80 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Estud 48-Hour SafeTrade Escrow Protection</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-twilight-300 leading-relaxed">
                    When you purchase through Estud, your payment is held securely in escrow. You meet the student seller at the <span className="font-semibold text-slate-900 dark:text-white">{product.campus}</span> partner desk or hub, inspect the item thoroughly, and only release payment using your secret 4-digit PIN.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-brand-700 dark:text-brand-400">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> 100% Refund Guarantee</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> No Cash Risk</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Campus Desk Handover</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="mt-8 bg-white dark:bg-twilight-800 rounded-3xl border border-slate-200/80 dark:border-twilight-700 p-6 shadow-sm">
              <div className="flex border-b border-slate-100 dark:border-twilight-700 pb-3 gap-6 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`relative pb-2 transition ${
                    activeTab === "specs"
                      ? "text-brand-600 dark:text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-600 dark:after:bg-brand-400"
                      : "text-slate-500 dark:text-twilight-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Technical Specifications
                </button>
                <button
                  onClick={() => setActiveTab("inspection")}
                  className={`relative pb-2 transition ${
                    activeTab === "inspection"
                      ? "text-brand-600 dark:text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-600 dark:after:bg-brand-400"
                      : "text-slate-500 dark:text-twilight-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Condition & Flaws
                </button>
                <button
                  onClick={() => setActiveTab("seller")}
                  className={`relative pb-2 transition ${
                    activeTab === "seller"
                      ? "text-brand-600 dark:text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-600 dark:after:bg-brand-400"
                      : "text-slate-500 dark:text-twilight-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Exchange Preferences
                </button>
              </div>

              <div className="pt-4">
                {activeTab === "specs" && (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="rounded-xl bg-slate-50/80 dark:bg-twilight-750 p-3 border border-slate-100 dark:border-twilight-700">
                        <dt className="text-xs text-slate-500 dark:text-twilight-300 font-medium">{spec.label}</dt>
                        <dd className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {activeTab === "inspection" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-700 dark:text-twilight-200 leading-relaxed bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-4 rounded-2xl">
                      {product.inspectionNotes}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-twilight-300">
                      <Info className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                      Inspected & pre-screened by Estud Campus Hub agents.
                    </div>
                  </div>
                )}

                {activeTab === "seller" && (
                  <div className="space-y-3 text-xs text-slate-600 dark:text-twilight-300">
                    <p>
                      <strong>Open for Item Exchange:</strong> {product.exchangePreferences}
                    </p>
                    <button
                      onClick={() => setIsExchangeOpen(true)}
                      className="flex items-center gap-2 rounded-full border border-brand-600 dark:border-brand-500 text-brand-700 dark:text-brand-400 px-4 py-2 font-semibold hover:bg-brand-50 dark:hover:bg-twilight-750 transition"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" /> Propose Exchange Offer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Escrow CTA & Seller Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-twilight-800 rounded-3xl border border-slate-200/80 dark:border-twilight-700 p-6 md:p-8 shadow-sm space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {product.condition}
                  </span>
                  <span className="rounded-full bg-amber-400/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 px-3 py-1 text-xs font-bold flex items-center gap-1 border border-amber-400/30 shadow-xs">
                    <Sparkles className="h-3 w-3 text-amber-500" /> Student Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-2 rounded-full border transition ${
                      isSaved ? "border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/50" : "border-slate-200 dark:border-twilight-700 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500" : ""}`} />
                  </button>
                  <button className="p-2 rounded-full border border-slate-200 dark:border-twilight-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Title & Campus */}
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {product.title}
                </h1>
                <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-500 dark:text-twilight-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-brand-500" />
                    {product.campus}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-twilight-300" />
                    {product.createdAt}
                  </span>
                </div>
              </div>

              {/* Price & Escrow Fee Transparency */}
              <div className="rounded-2xl bg-slate-50 dark:bg-twilight-750 p-4 border border-slate-200/80 dark:border-twilight-700 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500 dark:text-twilight-300">Listing Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        ETB {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-400 dark:text-twilight-300 line-through">
                          ETB {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 dark:bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                      Only 5% Escrow
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-twilight-300 mt-0.5">ETB {escrowFee.toLocaleString()} fee</p>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 dark:border-twilight-700 pt-2 flex items-center justify-between text-xs text-slate-600 dark:text-twilight-300">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-brand-500" /> Total Escrow Guarantee:
                  </span>
                  <strong className="text-brand-600 dark:text-brand-400 font-bold text-sm">
                    ETB {(product.price + escrowFee).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-600 py-4 text-sm font-bold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 active:scale-[0.99] transition"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Buy with Estud Escrow
                </button>

                <button
                  onClick={() => setIsExchangeOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-800 py-3 text-sm font-semibold text-slate-800 dark:text-white hover:border-brand-600 hover:text-brand-600 dark:hover:border-brand-500 dark:hover:text-brand-400 active:scale-[0.99] transition"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Propose Exchange Offer
                </button>

                <button
                  onClick={() => setIsQuestionOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 py-2.5 text-xs font-semibold text-slate-700 dark:text-twilight-300 hover:bg-slate-100 dark:hover:bg-twilight-700 transition"
                >
                  <MessageSquare className="h-4 w-4 text-brand-500" />
                  Ask Seller a Quick Question
                </button>
              </div>

              {/* Verified Seller Box */}
              <div className="border-t border-slate-100 dark:border-twilight-700 pt-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-500/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{product.seller.name}</h4>
                      <BadgeCheck className="h-4 w-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-twilight-300 flex items-center gap-1 mt-0.5">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400 dark:text-twilight-300" />
                      {product.seller.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {product.seller.rating}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-twilight-300">{product.seller.completedOrders} sales</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Escrow Checkout Modal */}
      <EscrowCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          campus: product.campus,
          sellerName: product.seller.name,
        }}
      />

      {/* Exchange Proposal Modal */}
      <ExchangeProposalModal
        isOpen={isExchangeOpen}
        onClose={() => setIsExchangeOpen(false)}
        targetProduct={{
          id: product.id,
          title: product.title,
          price: product.price,
          campus: product.campus,
          sellerName: product.seller.name,
        }}
      />

      {/* Quick Seller Question Modal */}
      {isQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-twilight-800 p-6 shadow-2xl border border-slate-100 dark:border-twilight-700 space-y-4">
            <button
              onClick={() => {
                setIsQuestionOpen(false);
                setQuestionSent(false);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 dark:bg-twilight-750 text-brand-600 dark:text-brand-400">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ask {product.seller.name}</h3>
                <p className="text-[11px] text-slate-500 dark:text-twilight-300">Direct message regarding this item</p>
              </div>
            </div>

            {questionSent ? (
              <div className="py-6 text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Question Sent to Seller!</h4>
                <p className="text-xs text-slate-500 dark:text-twilight-300 max-w-xs mx-auto">
                  Student {product.seller.name} will be notified via their Estud account and campus hub notification.
                </p>
                <button
                  onClick={() => {
                    setIsQuestionOpen(false);
                    setQuestionSent(false);
                    setQuestionText("");
                  }}
                  className="mt-2 rounded-full bg-brand-600 text-white px-6 py-2 text-xs font-semibold hover:bg-brand-700 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-twilight-300">Quick Prompts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Is this still available at the hub?",
                      "Can we meet at the campus cafeteria?",
                      "What is your best student cash offer?",
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuestionText(prompt)}
                        className="rounded-full bg-slate-100 dark:bg-twilight-750 px-2.5 py-1 text-[10px] text-slate-700 dark:text-twilight-300 hover:bg-brand-500/15 dark:hover:bg-twilight-700 hover:text-brand-600 dark:hover:text-brand-400 transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Type your question for the seller..."
                    className="w-full rounded-2xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-twilight-400 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  disabled={!questionText.trim()}
                  onClick={() => setQuestionSent(true)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-full bg-brand-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 transition"
                >
                  <Send className="h-3.5 w-3.5" /> Send Question
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
