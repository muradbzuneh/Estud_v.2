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
  const [activeTab, setActiveTab] = useState<"specs" | "inspection" | "seller">("specs");

  // Lookup product from catalog or fall back gracefully
  const product = PRODUCT_CATALOG[productId] || {
    ...PRODUCT_CATALOG["prod-1"],
    id: productId,
    title: `Campus Listing (${productId.toUpperCase()})`,
  };

  const escrowFee = Math.round(product.price * 0.05);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto">
          <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link href="/" className="hover:text-indigo-600 transition">{product.category}</Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} title={product.title} />

            {/* Verification Guarantee Card */}
            <div className="mt-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-slate-50/50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Estud 48-Hour SafeTrade Escrow Protection</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    When you purchase through Estud, your payment is held securely in escrow. You meet the student seller at the <span className="font-semibold text-slate-900">{product.campus}</span> partner desk or hub, inspect the item thoroughly, and only release payment using your secret 4-digit PIN.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-indigo-900">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Refund Guarantee</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No Cash Risk</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Campus Desk Handover</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="mt-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex border-b border-slate-100 pb-3 gap-6 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`relative pb-2 transition ${
                    activeTab === "specs"
                      ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Technical Specifications
                </button>
                <button
                  onClick={() => setActiveTab("inspection")}
                  className={`relative pb-2 transition ${
                    activeTab === "inspection"
                      ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Condition & Flaws
                </button>
                <button
                  onClick={() => setActiveTab("seller")}
                  className={`relative pb-2 transition ${
                    activeTab === "seller"
                      ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Exchange Preferences
                </button>
              </div>

              <div className="pt-4">
                {activeTab === "specs" && (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                        <dt className="text-xs text-slate-500 font-medium">{spec.label}</dt>
                        <dd className="text-xs font-semibold text-slate-900 mt-0.5">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {activeTab === "inspection" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 border border-amber-200/60 p-4 rounded-2xl">
                      {product.inspectionNotes}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Info className="h-4 w-4 text-indigo-600" />
                      Inspected & pre-screened by Estud Campus Hub agents.
                    </div>
                  </div>
                )}

                {activeTab === "seller" && (
                  <div className="space-y-3 text-xs text-slate-600">
                    <p>
                      <strong>Open for Item Exchange:</strong> {product.exchangePreferences}
                    </p>
                    <button
                      onClick={() => setIsExchangeOpen(true)}
                      className="flex items-center gap-2 rounded-full border border-indigo-600 text-indigo-700 px-4 py-2 font-semibold hover:bg-indigo-50 transition"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" /> Submit Exchange Proposal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Escrow CTA & Seller Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {product.condition}
                  </span>
                  <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" /> Student Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-2 rounded-full border transition ${
                      isSaved ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500" : ""}`} />
                  </button>
                  <button className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 transition">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Title & Campus */}
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                  {product.title}
                </h1>
                <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                    {product.campus}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {product.createdAt}
                  </span>
                </div>
              </div>

              {/* Price & Escrow Fee Transparency */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500">Listing Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        ETB {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          ETB {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      Only 5% Escrow
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">ETB {escrowFee.toLocaleString()} fee</p>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-indigo-600" /> Total Escrow Guarantee:
                  </span>
                  <strong className="text-indigo-700 font-bold text-sm">
                    ETB {(product.price + escrowFee).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Buy with Estud Escrow
                </button>

                <button
                  onClick={() => setIsExchangeOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 hover:border-indigo-600 hover:text-indigo-700 transition"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Propose Exchange Offer
                </button>
              </div>

              {/* Verified Seller Box */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{product.seller.name}</h4>
                      <BadgeCheck className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                      {product.seller.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {product.seller.rating}
                    </div>
                    <span className="text-[10px] text-slate-400">{product.seller.completedOrders} sales</span>
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
    </div>
  );
}
