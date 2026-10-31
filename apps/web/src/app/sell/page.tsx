"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Tag,
  Building2,
  DollarSign,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Camera,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ImageUploader } from "@/components/image-uploader";
import { trpc } from "@/trpc/client";

const CATEGORIES = [
  { id: "electronics", name: "Electronics & Computing" },
  { id: "books", name: "Books & Study Materials" },
  { id: "fashion", name: "Fashion & Campus Wear" },
  { id: "accessories", name: "Gadgets & Accessories" },
  { id: "sports", name: "Sports & Fitness" },
  { id: "furniture", name: "Dorm Furniture & Living" },
];

const CONDITIONS = [
  { id: "brand_new", title: "Brand New / Sealed", desc: "Never opened, in factory condition" },
  { id: "like_new", title: "Used - Like New", desc: "Flawless screen and casing, barely used" },
  { id: "good", title: "Used - Good Condition", desc: "Minor cosmetic wear, 100% functional" },
  { id: "fair", title: "Used - Fair / Workable", desc: "Noticeable scratches or wear, works properly" },
];

const CAMPUSES = [
  "Addis Ababa University - 4 Kilo (Science)",
  "Addis Ababa University - 5 Kilo (AAiT Engineering)",
  "Addis Ababa University - 6 Kilo (Main / Social)",
  "Addis Ababa University - Tikur Anbessa (Medical)",
  "Adama Science & Technology University (ASTU)",
  "Hawassa University - Main Campus",
  "Jimma University - Technology Institute (JiT)",
  "Mekelle University - Arid Campus",
  "Bahir Dar University - Poly Campus",
];

export default function SellPage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("electronics");
  const [condition, setCondition] = useState("like_new");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [campus, setCampus] = useState(CAMPUSES[0]);
  const [images, setImages] = useState<string[]>([]);
  const [allowExchange, setAllowExchange] = useState(true);
  const [exchangePreferences, setExchangePreferences] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const numericPrice = typeof price === "number" ? price : 0;
  const buyerServiceFee = Math.round(numericPrice * 0.05);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (images.length === 0) {
      setErrorMessage("Please upload at least 1 clear photo of your item to ensure verification.");
      return;
    }

    if (!title.trim() || !numericPrice || numericPrice <= 0) {
      setErrorMessage("Please complete all required fields and set a valid price.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Listing submission simulation
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || "Failed to submit listing. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm text-center max-w-xl mx-auto my-12 animate-in zoom-in-95">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Listing Submitted for Review!</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Your item <span className="font-bold text-slate-900">"{title}"</span> is now in the Estud inspection queue. Our campus agents will review photos and condition details within 1-2 hours.
            </p>

            <div className="my-6 rounded-2xl bg-slate-50 p-4 border border-slate-200/70 text-left text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Proposed Net Payout:</span>
                <span className="font-bold text-slate-900">ETB {numericPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Buyer Escrow Price (w/ 5% protection):</span>
                <span className="font-bold text-emerald-700">ETB {(numericPrice + buyerServiceFee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Handover Location:</span>
                <span className="font-medium text-slate-900">{campus}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push("/")}
                className="rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20"
              >
                Return to Marketplace
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Title Header */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/60 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> 0% Seller Fee &bull; 100% Cash to You
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                List an Item for Sale or Exchange
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Sell directly to fellow students across Ethiopian universities with safe escrow handover.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-center gap-3 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Card 1: Photos */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Upload High-Quality Photos</h3>
                      <p className="text-xs text-slate-500">Add up to 5 photos showing front, back, ports, and any cosmetic flaws.</p>
                    </div>
                  </div>
                  <Camera className="h-5 w-5 text-slate-400" />
                </div>

                <ImageUploader
                  folder="products"
                  maxImages={5}
                  value={images}
                  onChange={(urls) => setImages(urls)}
                />
              </div>

              {/* Card 2: Item Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Item Specifications & Description</h3>
                      <p className="text-xs text-slate-500">Accurate titles and descriptions sell 3x faster.</p>
                    </div>
                  </div>
                  <Tag className="h-5 w-5 text-slate-400" />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dell Inspiron 15, 11th Gen i5, 16GB RAM"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Category & Campus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm bg-white focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Campus Hub *
                    </label>
                    <select
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm bg-white focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      {CAMPUSES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Condition Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Item Condition Grade *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CONDITIONS.map((cond) => (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => setCondition(cond.id)}
                        className={`rounded-2xl p-3.5 text-left border-2 transition-all ${
                          condition === cond.id
                            ? "border-emerald-600 bg-emerald-50/40 text-slate-900"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{cond.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{cond.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Detailed Notes & Flaws (Honest description builds buyer trust)
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mention battery health, included accessories, charger condition, or any scratch..."
                    className="w-full rounded-2xl border border-slate-200 p-4 text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Card 3: Price & Escrow Transparency */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Price & Safe Payout</h3>
                      <p className="text-xs text-slate-500">You receive 100% of your asking price upon PIN inspection.</p>
                    </div>
                  </div>
                  <DollarSign className="h-5 w-5 text-slate-400" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Asking Price (ETB) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                      ETB
                    </span>
                    <input
                      type="number"
                      required
                      min={10}
                      value={price}
                      onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 15000"
                      className="w-full rounded-2xl border border-slate-200 pl-16 pr-4 py-3 text-base font-bold text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Math Breakdown Callout */}
                <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-5 space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Estud Transparent Student Math:
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1">
                    <span>Seller Fee (Deducted from you):</span>
                    <span className="font-bold text-emerald-700">ETB 0.00 (0% Promo)</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Buyer Escrow Protection Fee (+5%):</span>
                    <span className="font-medium text-slate-600">+ETB {buyerServiceFee.toLocaleString()} (Paid by buyer)</span>
                  </div>
                  <div className="border-t border-emerald-200/80 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Your Guaranteed Payout upon Pickup:</span>
                    <span className="text-emerald-700 font-black">ETB {numericPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Exchange Preference */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">
                      4
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Open for Item Barter / Exchange?</h3>
                      <p className="text-xs text-slate-500">Allow students to offer another item with cash balance.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowExchange}
                      onChange={(e) => setAllowExchange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>

                {allowExchange && (
                  <div className="pt-2 animate-in fade-in duration-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      What would you exchange this for? (Optional)
                    </label>
                    <input
                      type="text"
                      value={exchangePreferences}
                      onChange={(e) => setExchangePreferences(e.target.value)}
                      placeholder="e.g. Willing to trade for iPad 9th Gen or iPhone 11"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/25 hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting Listing to Estud...
                    </span>
                  ) : (
                    <>
                      Submit Listing for Review <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
