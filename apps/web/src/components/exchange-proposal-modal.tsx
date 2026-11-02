"use client";

import React, { useState } from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertCircle,
  X,
  Coins,
} from "lucide-react";
import { ImageUploader } from "./image-uploader";

interface ExchangeProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct: {
    id: string;
    title: string;
    price: number;
    campus: string;
    sellerName: string;
  };
}

export function ExchangeProposalModal({
  isOpen,
  onClose,
  targetProduct,
}: ExchangeProposalModalProps) {
  const [offeredTitle, setOfferedTitle] = useState("");
  const [offeredCondition, setOfferedCondition] = useState("Like New");
  const [offeredEstimatedValue, setOfferedEstimatedValue] = useState<number | "">("");
  const [cashBalanceType, setCashBalanceType] = useState<"none" | "buyer_pays" | "seller_pays">("none");
  const [cashDifference, setCashDifference] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [offeredImages, setOfferedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!offeredTitle.trim() || !offeredEstimatedValue) {
      setError("Please describe the item you want to trade and provide an estimated value.");
      return;
    }

    if (offeredImages.length === 0) {
      setError("Please attach at least 1 photo of your item for condition verification.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-twilight-800 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-twilight-700 text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-twilight-750 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 dark:bg-twilight-750 text-brand-600 dark:text-brand-400 mb-4 animate-in zoom-in-75">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Exchange Proposal Sent!</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-twilight-300 max-w-sm mx-auto leading-relaxed">
              Your proposal to trade <span className="font-semibold text-slate-900 dark:text-white">"{offeredTitle}"</span> for <span className="font-semibold text-slate-900 dark:text-white">"{targetProduct.title}"</span> has been delivered to {targetProduct.sellerName}.
            </p>

            <div className="my-5 rounded-2xl bg-brand-50/50 dark:bg-twilight-750/70 border border-brand-100 dark:border-twilight-700 p-4 text-left text-xs text-brand-950 dark:text-twilight-200 space-y-1">
              <p className="font-bold">Next Steps:</p>
              <p className="text-brand-800/90 dark:text-twilight-300 leading-relaxed">
                If the student seller accepts, Estud will assign a campus inspection rep at {targetProduct.campus} to verify both items simultaneously before completing the barter.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-brand-600 px-8 py-3 text-xs font-bold text-white hover:bg-brand-700 transition"
            >
              Done & Return to Product
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-twilight-700 pb-4 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 dark:bg-twilight-750 text-brand-600 dark:text-brand-400">
                <ArrowLeftRight className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Propose Item Barter / Exchange</h3>
                <p className="text-xs text-slate-500 dark:text-twilight-300">Trading for: {targetProduct.title} (ETB {targetProduct.price.toLocaleString()})</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 p-3 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Offered Item Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-twilight-300 mb-1.5">
                  Item You Are Offering *
                </label>
                <input
                  type="text"
                  required
                  value={offeredTitle}
                  onChange={(e) => setOfferedTitle(e.target.value)}
                  placeholder="e.g. iPad 9th Gen 64GB WiFi or Galaxy S21"
                  className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-750 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-twilight-400 focus:border-brand-500 focus:outline-none"
                />
              </div>

              {/* Condition & Estimated Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-twilight-300 mb-1.5">
                    Item Condition
                  </label>
                  <select
                    value={offeredCondition}
                    onChange={(e) => setOfferedCondition(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 px-3.5 py-2.5 text-xs bg-white dark:bg-twilight-750 text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Brand New">Brand New / Sealed</option>
                    <option value="Like New">Used • Like New</option>
                    <option value="Good">Used • Good Condition</option>
                    <option value="Fair">Used • Fair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-twilight-300 mb-1.5">
                    Your Item Value (ETB) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={offeredEstimatedValue}
                    onChange={(e) => setOfferedEstimatedValue(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 16000"
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-750 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-twilight-400 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cash Top-Up Adjustment */}
              <div className="rounded-2xl bg-slate-50 dark:bg-twilight-750/50 p-4 border border-slate-200/80 dark:border-twilight-700 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-twilight-200">
                  <Coins className="h-4 w-4 text-amber-500" />
                  Optional Cash Top-Up Balance
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCashBalanceType("none");
                      setCashDifference("");
                    }}
                    className={`py-2 px-2.5 rounded-xl border font-semibold text-center transition ${
                      cashBalanceType === "none"
                        ? "border-brand-600 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 shadow-xs"
                        : "border-slate-200 dark:border-twilight-700 text-slate-600 dark:text-twilight-300 bg-white dark:bg-twilight-800"
                    }`}
                  >
                    Even Trade
                  </button>

                  <button
                    type="button"
                    onClick={() => setCashBalanceType("buyer_pays")}
                    className={`py-2 px-2.5 rounded-xl border font-semibold text-center transition ${
                      cashBalanceType === "buyer_pays"
                        ? "border-brand-600 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 shadow-xs"
                        : "border-slate-200 dark:border-twilight-700 text-slate-600 dark:text-twilight-300 bg-white dark:bg-twilight-800"
                    }`}
                  >
                    + I Pay Cash
                  </button>

                  <button
                    type="button"
                    onClick={() => setCashBalanceType("seller_pays")}
                    className={`py-2 px-2.5 rounded-xl border font-semibold text-center transition ${
                      cashBalanceType === "seller_pays"
                        ? "border-brand-600 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 shadow-xs"
                        : "border-slate-200 dark:border-twilight-700 text-slate-600 dark:text-twilight-300 bg-white dark:bg-twilight-800"
                    }`}
                  >
                    + Seller Pays Cash
                  </button>
                </div>

                {cashBalanceType !== "none" && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-twilight-300 mb-1">
                      {cashBalanceType === "buyer_pays" ? "Cash amount you will add (ETB):" : "Cash amount you request from seller (ETB):"}
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={cashDifference}
                      onChange={(e) => setCashDifference(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 2000"
                      className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 px-3 py-2 text-xs bg-white dark:bg-twilight-750 text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Photos of Offered Item */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-twilight-300 mb-1.5">
                  Photos of Your Item *
                </label>
                <ImageUploader
                  folder="products"
                  maxImages={3}
                  value={offeredImages}
                  onChange={(urls) => setOfferedImages(urls)}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-twilight-300 mb-1.5">
                  Condition & Exchange Notes
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe battery condition, included accessories, or reasons for exchange..."
                  className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-750 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-twilight-400 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full border border-slate-200 dark:border-twilight-700 py-3 text-xs font-bold text-slate-700 dark:text-twilight-300 hover:bg-slate-50 dark:hover:bg-twilight-750 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-brand-600 py-3 text-xs font-bold text-white shadow-md shadow-brand-600/20 hover:bg-brand-700 transition"
                >
                  {isSubmitting ? "Submitting Proposal..." : "Send Exchange Offer"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
