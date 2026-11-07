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
  Building2,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductGallery } from "@/components/product-gallery";
import { EscrowCheckoutModal } from "@/components/escrow-checkout-modal";
import { ExchangeProposalModal } from "@/components/exchange-proposal-modal";
import { CampusMapModal } from "@/components/campus-map-modal";
import { trpc } from "@/trpc/client";

const FALLBACK_CATALOG: Record<string, any> = {
  "prod-1": {
    id: "prod-1",
    title: "HP Laptop 15 Core i5 (16GB RAM, 512GB SSD)",
    category: "Electronics & Computing",
    price: 18000,
    originalPrice: 22000,
    condition: "Used • Like New",
    campus: "Addis Ababa University (4 Kilo)",
    createdAt: "Today",
    seller: {
      name: "Abel Kassa",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      university: "AAU",
      department: "Software Engineering",
      rating: 4.9,
      completedOrders: 14,
    },
    images: [
      { id: "1", imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900", isPrimary: true },
      { id: "2", imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900" },
    ],
    description: "Fast 11th Gen Intel Core i5 laptop with 16GB RAM and pristine battery life. Ideal for coding and engineering software.",
    specs: [
      { label: "Processor", value: "Intel Core i5 (up to 4.2 GHz)" },
      { label: "RAM", value: "16GB DDR4" },
      { label: "Storage", value: "512GB NVMe SSD" },
      { label: "Battery", value: "4-5 hours backup" },
    ],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || "prod-1";

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "inspection" | "seller">("details");

  // Query DB product
  const dbProductQuery = trpc.products.getById.useQuery(
    { id: productId },
    { enabled: Boolean(productId) && productId.includes("-") && productId.length > 20 }
  );

  const dbProd = dbProductQuery.data;

  // Build unified product object
  const product = dbProd
    ? {
        id: dbProd.id,
        title: dbProd.title,
        category: dbProd.category?.name || "Marketplace Item",
        price: parseFloat(dbProd.approvedItemValue || dbProd.proposedPrice || "0"),
        originalPrice: Math.round(parseFloat(dbProd.approvedItemValue || dbProd.proposedPrice || "0") * 1.15),
        condition:
          dbProd.condition === "NEW"
            ? "Brand New • Sealed"
            : dbProd.condition === "LIKE_NEW"
            ? "Used • Like New"
            : "Used • Good",
        campus: dbProd.campus?.name || "Addis Ababa University",
        createdAt: new Date(dbProd.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        seller: {
          name: (dbProd as any).seller?.profile?.fullName || (dbProd as any).seller?.name || "Campus Student",
          avatar: (dbProd as any).seller?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          university: (dbProd as any).seller?.profile?.institution?.shortCode || "AAU",
          department: "Verified Student",
          rating: 4.9,
          completedOrders: 12,
        },
        images:
          dbProd.images && dbProd.images.length > 0
            ? dbProd.images.map((img: any) => ({
                id: img.id,
                imageUrl: img.imageUrl,
                isPrimary: img.isPrimary,
              }))
            : [{ id: "1", imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900", isPrimary: true }],
        description: dbProd.description,
        specs: [
          { label: "Item Condition", value: dbProd.condition },
          { label: "Campus Location", value: dbProd.campus?.name || "Campus Gate Hub" },
          { label: "Exchange / Barter", value: dbProd.isExchangeEligible ? "Open for trade" : "Cash purchase only" },
        ],
      }
    : FALLBACK_CATALOG[productId] || {
        ...FALLBACK_CATALOG["prod-1"],
        id: productId,
        title: `Campus Item (${productId})`,
      };

  const escrowFee = Math.round(product.price * 0.05);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-twilight-900 text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Compact Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-twilight-300 mb-4 overflow-x-auto">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Marketplace</Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-600 dark:text-twilight-200">{product.category}</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Modern Clean 2-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Compact Gallery & Specs */}
          <div className="md:col-span-7 space-y-4">
            <ProductGallery images={product.images} title={product.title} />

            {/* Escrow 48h SafeTrade Protection Pill */}
            <div className="rounded-2xl border border-brand-500/20 bg-brand-50/40 dark:bg-twilight-800/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Estud 48-Hour SafeTrade Escrow Protection
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-600 dark:text-twilight-300 leading-relaxed">
                    Payment is held safely in escrow until you inspect the item at the <span className="font-semibold text-slate-900 dark:text-white">{product.campus}</span> campus desk and confirm with your secret PIN.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-semibold text-brand-700 dark:text-brand-400">
                    <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> 100% Refundable</span>
                    <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Safe Campus Handover</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Details Tabs */}
            <div className="bg-white dark:bg-twilight-800 rounded-2xl border border-slate-200/80 dark:border-twilight-700 p-5 shadow-xs">
              <div className="flex border-b border-slate-100 dark:border-twilight-700 pb-2.5 gap-5 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-1.5 transition ${
                    activeTab === "details"
                      ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-600"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Description & Specs
                </button>
                <button
                  onClick={() => setActiveTab("inspection")}
                  className={`pb-1.5 transition ${
                    activeTab === "inspection"
                      ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-600"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Campus Handover
                </button>
                <button
                  onClick={() => setActiveTab("seller")}
                  className={`pb-1.5 transition ${
                    activeTab === "seller"
                      ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-600"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Seller Profile
                </button>
              </div>

              <div className="pt-4">
                {activeTab === "details" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 dark:text-twilight-200 leading-relaxed font-normal">
                      {product.description || "Verified pre-owned campus item in excellent working condition."}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-twilight-700">
                      {product.specs?.map((spec: any, idx: number) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-twilight-750 text-xs">
                          <span className="text-muted-foreground block text-[10px]">{spec.label}</span>
                          <span className="font-semibold text-foreground">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "inspection" && (
                  <div className="text-xs text-slate-600 dark:text-twilight-200 space-y-2">
                    <p>Meet at the official <span className="font-semibold text-foreground">{product.campus}</span> Estud partner desk.</p>
                    <p className="text-muted-foreground">Campus representatives assist in package inspection before PIN entry.</p>
                  </div>
                )}

                {activeTab === "seller" && (
                  <div className="flex items-center gap-3 pt-1">
                    <img src={product.seller.avatar} alt={product.seller.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-foreground">{product.seller.name}</div>
                      <div className="text-[11px] text-muted-foreground">{product.seller.university} · {product.seller.completedOrders} trades completed</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Purchase Actions */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white dark:bg-twilight-800 rounded-2xl border border-slate-200/80 dark:border-twilight-700 p-5 shadow-xs space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-[11px] font-semibold">
                    {product.condition}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400 bg-slate-50 dark:bg-twilight-750 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-twilight-700 transition cursor-pointer"
                    title="View Campus SafeTrade Hub on Google Map"
                  >
                    <MapPin className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                    <span className="font-medium underline underline-offset-2">{product.campus}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </button>
                </div>

                <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                  {product.title}
                </h1>
              </div>

              {/* Price Block */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-twilight-750 border border-slate-100 dark:border-twilight-700">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                    ETB {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      ETB {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>5% SafeTrade Escrow Protection:</span>
                  <span className="font-semibold text-foreground">+ETB {escrowFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full h-11 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Lock className="h-4 w-4" /> Buy with 48h SafeTrade Escrow
                </button>

                <button
                  onClick={() => setIsExchangeOpen(true)}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-twilight-700 hover:bg-slate-50 dark:hover:bg-twilight-750 text-slate-700 dark:text-twilight-200 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-primary" /> Propose Student Item Exchange
                </button>
              </div>

              {/* Seller Trust Box */}
              <div className="pt-3 border-t border-slate-100 dark:border-twilight-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    {product.seller.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">{product.seller.name}</span>
                    <span className="text-[11px] text-muted-foreground">{product.seller.university}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{product.seller.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Escrow Checkout Modal */}
      {isCheckoutOpen && (
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
      )}

      {/* Exchange Proposal Modal */}
      {isExchangeOpen && (
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
      )}

      {/* Interactive Google Map Campus Hub Modal */}
      {isMapOpen && (
        <CampusMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          initialCampusId={product.campus}
        />
      )}

      <Footer />
    </div>
  );
}
