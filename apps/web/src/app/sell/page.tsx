"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tag,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  ArrowRight,
  Lock,
  UserCheck,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ImageUploader } from "@/components/image-uploader";
import { trpc } from "@/trpc/client";
import { useSession } from "@/lib/auth-client";

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
  const { data: session, isPending: sessionLoading } = useSession();

  // Form state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("like_new");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [campus, setCampus] = useState(CAMPUSES[0]);
  const [images, setImages] = useState<string[]>([]);
  const [allowExchange, setAllowExchange] = useState(true);

  const categoriesQuery = trpc.products.adminListCategories.useQuery();
  const submitListingMutation = trpc.products.submitListing.useMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const numericPrice = typeof price === "number" ? price : 0;
  const buyerServiceFee = Math.round(numericPrice * 0.05);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!session?.user) {
      setErrorMessage("Please sign in with your student account to list items.");
      return;
    }

    if (images.length === 0) {
      setErrorMessage("Please upload at least 1 clear photo of your item.");
      return;
    }

    if (!title.trim() || !numericPrice || numericPrice <= 0) {
      setErrorMessage("Please complete all required fields and set a valid price.");
      return;
    }

    setIsSubmitting(true);

    try {
      const activeCatId =
        categoriesQuery.data?.find((c) => c.slug === categoryId || c.id === categoryId)?.id ||
        categoriesQuery.data?.[0]?.id;

      if (!activeCatId) {
        throw new Error("Category not found. Please refresh.");
      }

      const conditionMap: Record<string, "NEW" | "LIKE_NEW" | "GOOD" | "FAIR"> = {
        brand_new: "NEW",
        like_new: "LIKE_NEW",
        good: "GOOD",
        fair: "FAIR",
      };

      await submitListingMutation.mutateAsync({
        title,
        description: description || `Pre-owned ${title} on ${campus}.`,
        categoryId: activeCatId,
        condition: conditionMap[condition] || "LIKE_NEW",
        proposedPrice: numericPrice,
        isExchangeEligible: allowExchange,
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800"],
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || "Failed to submit listing. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-twilight-900 text-slate-900 dark:text-twilight-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        {sessionLoading ? (
          <div className="text-center py-24">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600 mb-2" />
            <p className="text-xs text-slate-400">Loading student session...</p>
          </div>
        ) : !session?.user ? (
          /* Guest Restriction Gate */
          <div className="bg-white dark:bg-twilight-800 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-twilight-700 shadow-sm text-center max-w-lg mx-auto my-8 space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Lock className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Student Sign-In Required to Sell
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-twilight-300 leading-relaxed max-w-sm mx-auto">
                Estud protects campus buyers by ensuring every seller is an authenticated university student. Sign in or register to publish your item in seconds.
              </p>
            </div>

            <div className="pt-2 space-y-3 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => router.push("/auth?callbackUrl=/sell")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8738] via-[#FE9901] to-[#FFA05F] hover:from-[#FE9901] hover:to-[#FF8738] py-3.5 text-xs font-bold text-[#07152B] shadow-md shadow-[#FF8738]/25 hover:shadow-lg hover:shadow-[#FF8738]/35 transition-all cursor-pointer"
              >
                <UserCheck className="h-4 w-4" /> Sign In to List Items
              </button>

              <Link
                href="/"
                className="block text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-twilight-400 dark:hover:text-white transition"
              >
                Return to Marketplace
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          /* Success Screen */
          <div className="bg-white dark:bg-twilight-800 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-twilight-700 shadow-xs text-center max-w-xl mx-auto my-8 animate-in zoom-in-95 space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Listing Submitted for Campus Review!
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-twilight-300 leading-relaxed font-normal">
                Your item <strong className="text-slate-900 dark:text-white">"{title}"</strong> is now in the Estud inspection queue. Campus desks review listings in 1-2 hours.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-twilight-750 p-4 border border-slate-200/60 dark:border-twilight-700 text-left text-xs text-slate-600 dark:text-twilight-300 space-y-2">
              <div className="flex justify-between">
                <span>Net Payout to You (0% fee):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ETB {numericPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Handover Location:</span>
                <span className="font-medium text-slate-900 dark:text-white">{campus}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => router.push("/activity")}
                className="rounded-xl bg-brand-600 hover:bg-brand-500 px-6 py-3 text-xs font-semibold text-white transition cursor-pointer"
              >
                View in My Activity
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setTitle("");
                  setPrice("");
                  setDescription("");
                  setImages([]);
                }}
                className="rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-800 px-6 py-3 text-xs font-semibold text-slate-700 dark:text-twilight-200 hover:bg-slate-50 transition cursor-pointer"
              >
                List Another Item
              </button>
            </div>
          </div>
        ) : (
          /* Simplified Sell Form */
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-400/30 mb-2.5">
                0% Seller Fee &bull; 100% Cash to You
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                List an Item for Sale or Exchange
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-twilight-400">
                Sell directly to fellow students across Ethiopian universities with SafeTrade Escrow protection.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3.5 flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Card 1: Photos */}
              <div className="bg-white dark:bg-twilight-800 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-twilight-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-twilight-700 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                    1. Item Photos *
                  </span>
                  <span className="text-[11px] text-slate-400">Upload 1-4 clear photos</span>
                </div>
                <ImageUploader
                  value={images}
                  onChange={(urls) => setImages(urls)}
                  maxImages={4}
                />
              </div>

              {/* Card 2: Essential Details */}
              <div className="bg-white dark:bg-twilight-800 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-twilight-700 space-y-4">
                <div className="border-b border-slate-100 dark:border-twilight-700 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                    2. Item Details & Campus
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-twilight-200 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Casio fx-991EX Calculator or Dell Latitude 5420"
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF8738] focus:ring-2 focus:ring-[#FF8738]/20 focus:bg-white dark:focus:bg-twilight-750 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-twilight-200 mb-1">
                      Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-twilight-750 text-slate-900 dark:text-white focus:border-[#FF8738] focus:ring-2 focus:ring-[#FF8738]/20 focus:outline-none"
                    >
                      {categoriesQuery.data?.map((cat) => (
                        <option key={cat.id} value={cat.slug || cat.id}>
                          {cat.name}
                        </option>
                      )) || (
                        <>
                          <option value="electronics">Electronics & Computing</option>
                          <option value="books">Books & Study Materials</option>
                          <option value="fashion">Campus Fashion & Dorm</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-twilight-200 mb-1">
                      Condition *
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-twilight-750 text-slate-900 dark:text-white focus:border-[#FF8738] focus:ring-2 focus:ring-[#FF8738]/20 focus:outline-none"
                    >
                      <option value="like_new">Used - Like New</option>
                      <option value="brand_new">Brand New / Sealed</option>
                      <option value="good">Used - Good Condition</option>
                      <option value="fair">Used - Fair Condition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-twilight-200 mb-1">
                    University / Campus *
                  </label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-twilight-750 text-slate-900 dark:text-white focus:border-[#FF8738] focus:ring-2 focus:ring-[#FF8738]/20 focus:outline-none"
                  >
                    {CAMPUSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-twilight-200 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly state specs, includes (charger, case), or handover notes..."
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF8738] focus:ring-2 focus:ring-[#FF8738]/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 3: Pricing */}
              <div className="bg-white dark:bg-twilight-800 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-twilight-700 space-y-4">
                <div className="border-b border-slate-100 dark:border-twilight-700 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                    3. Price & Escrow Payout
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-twilight-200 mb-1">
                    Asking Price (ETB) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ETB
                    </span>
                    <input
                      type="number"
                      required
                      min={10}
                      step={10}
                      value={price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                      placeholder="e.g. 2500"
                      className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 pl-14 pr-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF8738] focus:ring-2 focus:ring-[#FF8738]/20 focus:outline-none"
                    />
                  </div>
                </div>

                {numericPrice > 0 && (
                  <div className="rounded-xl bg-brand-50/40 dark:bg-twilight-750/70 p-3.5 border border-brand-200/50 dark:border-twilight-700 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-twilight-300">Your Net Cash Payout (0% fee):</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ETB {numericPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-twilight-400 text-[11px]">
                      <span>Buyer Price (+5% Escrow Protection):</span>
                      <span>ETB {(numericPrice + buyerServiceFee).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8738] via-[#FE9901] to-[#FFA05F] hover:from-[#FE9901] hover:to-[#FF8738] py-3.5 text-xs font-bold text-[#07152B] shadow-md shadow-[#FF8738]/25 hover:shadow-lg hover:shadow-[#FF8738]/35 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting Listing...
                  </span>
                ) : (
                  <>
                    Publish Listing for Campus Review <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
