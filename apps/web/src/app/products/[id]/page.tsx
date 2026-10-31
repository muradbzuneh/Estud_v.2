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

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "inspection" | "seller">("specs");

  // Mock product data (matches design in mockups)
  const product = {
    id: productId || "prod-1",
    title: "Laptop Dell Inspiron 15 (11th Gen Core i5, 16GB RAM, 512GB NVMe)",
    category: "Electronics & Computing",
    price: 24500,
    originalPrice: 27000,
    condition: "Used - Like New",
    campus: "Addis Ababa University (4 Kilo Campus)",
    createdAt: "2 hours ago",
    seller: {
      name: "Yohannes M.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      university: "Addis Ababa University",
      department: "Software Engineering, Year 4",
      rating: 4.8,
      completedOrders: 14,
      joined: "Oct 2024",
      verifiedStudent: true,
      phoneVerified: true,
    },
    images: [
      { id: "1", imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&auto=format&fit=crop&q=80", isPrimary: true },
      { id: "2", imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900&auto=format&fit=crop&q=80" },
      { id: "3", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80" },
      { id: "4", imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=900&auto=format&fit=crop&q=80" },
    ],
    specs: [
      { label: "Processor", value: "Intel Core i5-1135G7 (up to 4.2 GHz)" },
      { label: "Memory (RAM)", value: "16GB DDR4 3200MHz Dual-Channel" },
      { label: "Storage", value: "512GB M.2 PCIe NVMe SSD" },
      { label: "Display", value: '15.6" FHD (1920 x 1080) Anti-glare LED' },
      { label: "Battery Health", value: "92% original capacity (~5.5 hours)" },
      { label: "Includes", value: "Original 65W Dell Charger + Laptop Sleeve" },
    ],
    inspectionNotes:
      "Screen is 100% scratch-free. Tiny cosmetic wear on bottom rubber feet. Clean keyboard with all keys responsive. Windows 11 Pro installed & activated. Ready for engineering/coding tools (VS Code, Docker, MATLAB).",
  };

  const escrowFee = Math.round(product.price * 0.05);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto">
          <Link href="/" className="hover:text-emerald-700 transition">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link href="/" className="hover:text-emerald-700 transition">{product.category}</Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} title={product.title} />

            {/* Verification Guarantee Card */}
            <div className="mt-8 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-teal-50/30 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Estud 48-Hour SafeTrade Escrow Protection</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    When you purchase through Estud, your payment is held securely in escrow. You meet the student seller at the <span className="font-semibold text-slate-900">{product.campus}</span> partner desk or hub, inspect the item thoroughly, and only release payment using your secret 4-digit PIN.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-emerald-800">
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
                      ? "text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Technical Specifications
                </button>
                <button
                  onClick={() => setActiveTab("inspection")}
                  className={`relative pb-2 transition ${
                    activeTab === "inspection"
                      ? "text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Condition & Flaws
                </button>
                <button
                  onClick={() => setActiveTab("seller")}
                  className={`relative pb-2 transition ${
                    activeTab === "seller"
                      ? "text-emerald-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600"
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
                      <Info className="h-4 w-4 text-emerald-600" />
                      Inspected & pre-screened by Estud Campus Hub agents.
                    </div>
                  </div>
                )}

                {activeTab === "seller" && (
                  <div className="space-y-3 text-xs text-slate-600">
                    <p>
                      <strong>Open for Item Exchange:</strong> Yes, seller is willing to trade for an <span className="font-semibold text-slate-900">iPad (9th/10th Gen)</span> or <span className="font-semibold text-slate-900">MacBook Air M1</span> with appropriate cash balance adjustment.
                    </p>
                    <button className="flex items-center gap-2 rounded-full border border-emerald-600 text-emerald-700 px-4 py-2 font-semibold hover:bg-emerald-50 transition">
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
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
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
                    <Lock className="h-3 w-3 text-emerald-600" /> Total Escrow Guarantee:
                  </span>
                  <strong className="text-emerald-700 font-bold text-sm">
                    ETB {(product.price + escrowFee).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Buy with Estud Escrow
                </button>

                <button className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 hover:border-emerald-600 hover:text-emerald-700 transition">
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
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{product.seller.name}</h4>
                      <BadgeCheck className="h-4 w-4 text-emerald-600" />
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
    </div>
  );
}
