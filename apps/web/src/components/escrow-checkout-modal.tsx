"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Truck,
  Building2,
  Lock,
  ArrowRight,
  X,
} from "lucide-react";
import { ImageUploader } from "./image-uploader";
import { trpc } from "@/trpc/client";

interface EscrowCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    campus: string;
    sellerName: string;
  };
}

export function EscrowCheckoutModal({ isOpen, onClose, product }: EscrowCheckoutModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<"hub" | "runner">("hub");
  const [paymentProvider, setPaymentProvider] = useState<"telebirr" | "cbe" | "awash">("telebirr");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const itemPrice = product.price;
  const escrowFee = Math.round(itemPrice * 0.05); // 5% Estud escrow fee
  const deliveryFee = deliveryMethod === "runner" ? 75 : 0;
  const totalAmount = itemPrice + escrowFee + deliveryFee;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const checkoutMutation = trpc.orders.checkoutWithEscrow.useMutation();

  const cleanErrorMessage = (err: unknown): string => {
    if (!err) return "Failed to submit payment. Please verify your connection.";
    const rawMsg = (err as any)?.message || String(err);
    try {
      const parsed = JSON.parse(rawMsg);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .map((item: any) => item.message || "Invalid input")
          .filter(Boolean)
          .join(". ");
      }
    } catch {
      // not JSON
    }
    return rawMsg;
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const channelMap: Record<string, "TELEBIRR" | "CBE_TRANSFER" | "AWASH_BIRR"> = {
      telebirr: "TELEBIRR",
      cbe: "CBE_TRANSFER",
      awash: "AWASH_BIRR",
    };

    try {
      await checkoutMutation.mutateAsync({
        productId: product.id,
        deliveryMethod,
        deliveryFee,
        channel: channelMap[paymentProvider] || "TELEBIRR",
        bankTransactionReference: transactionRef.trim(),
        screenshotUrl: evidenceUrls[0] || "",
        senderAccountOrPhone: `Student (${deliveryMethod === "runner" ? "Runner" : "Hub"})`,
        notes: `SafeTrade Escrow order for ${product.title}`,
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Payment submission failed:", err);
      setErrorMsg(cleanErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-twilight-800 p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-twilight-700 text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-twilight-750 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-5 animate-in zoom-in-75">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Evidence Received!</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-twilight-300 max-w-md mx-auto">
              Your transfer for <span className="font-semibold text-slate-900 dark:text-white">ETB {totalAmount.toLocaleString()}</span> has been submitted to Estud SafeTrade Escrow.
            </p>

            <div className="my-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 p-4 text-left">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200">
                  <p className="font-semibold">Next Step: Verification & Pickup PIN</p>
                  <p className="mt-1 text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                    Our admin desk will verify your {paymentProvider.toUpperCase()} reference ({transactionRef}) within 10-20 minutes. Once confirmed, you will receive a secure 4-digit inspection PIN to unlock the product at the {product.campus} hub.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/activity" as any);
                }}
                className="rounded-xl bg-gradient-to-r from-blue-600 via-brand-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 border border-white/10 transition-all cursor-pointer"
              >
                View in My Activity
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-twilight-700 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 dark:bg-twilight-750 text-brand-600 dark:text-brand-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Estud SafeTrade Escrow Checkout</h2>
                <p className="text-xs text-slate-500 dark:text-twilight-300">100% Buyer Protection &bull; Campus Intermediary Model</p>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between my-5 text-xs font-medium text-slate-500 dark:text-twilight-300">
              <span className={`flex items-center gap-1.5 ${step >= 1 ? "text-brand-600 dark:text-brand-400 font-bold" : ""}`}>
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? "bg-brand-600 text-white" : "bg-slate-200 dark:bg-twilight-700 text-slate-600 dark:text-twilight-300"}`}>1</span>
                Order Breakdown
              </span>
              <span className="h-0.5 w-8 bg-slate-200 dark:bg-twilight-700" />
              <span className={`flex items-center gap-1.5 ${step >= 2 ? "text-brand-600 dark:text-brand-400 font-bold" : ""}`}>
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? "bg-brand-600 text-white" : "bg-slate-200 dark:bg-twilight-700 text-slate-600 dark:text-twilight-300"}`}>2</span>
                Ethiopian Payment
              </span>
              <span className="h-0.5 w-8 bg-slate-200 dark:bg-twilight-700" />
              <span className={`flex items-center gap-1.5 ${step >= 3 ? "text-brand-600 dark:text-brand-400 font-bold" : ""}`}>
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? "bg-brand-600 text-white" : "bg-slate-200 dark:bg-twilight-700 text-slate-600 dark:text-twilight-300"}`}>3</span>
                Upload Evidence
              </span>
            </div>

            {/* Step 1: Breakdown */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 dark:bg-twilight-750 p-4 border border-slate-200/70 dark:border-twilight-700">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{product.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-twilight-300 mt-0.5">Seller: {product.sellerName} &bull; Location: {product.campus}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-twilight-300">Choose Collection Method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("hub")}
                      className={`flex items-start gap-3 rounded-2xl p-3.5 text-left border-2 transition-all ${
                        deliveryMethod === "hub"
                          ? "border-brand-600 bg-brand-500/10 dark:bg-brand-500/15 text-slate-900 dark:text-white"
                          : "border-slate-200 dark:border-twilight-700 hover:border-slate-300 dark:hover:border-twilight-600 bg-white dark:bg-twilight-800"
                      }`}
                    >
                      <Building2 className={`h-5 w-5 mt-0.5 ${deliveryMethod === "hub" ? "text-brand-600 dark:text-brand-400" : "text-slate-400"}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Campus Intermediary Hub</div>
                        <div className="text-[11px] text-slate-500 dark:text-twilight-300">Pick up & inspect at campus desk</div>
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">Free</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("runner")}
                      className={`flex items-start gap-3 rounded-2xl p-3.5 text-left border-2 transition-all ${
                        deliveryMethod === "runner"
                          ? "border-brand-600 bg-brand-500/10 dark:bg-brand-500/15 text-slate-900 dark:text-white"
                          : "border-slate-200 dark:border-twilight-700 hover:border-slate-300 dark:hover:border-twilight-600 bg-white dark:bg-twilight-800"
                      }`}
                    >
                      <Truck className={`h-5 w-5 mt-0.5 ${deliveryMethod === "runner" ? "text-brand-600 dark:text-brand-400" : "text-slate-400"}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Campus Student Runner</div>
                        <div className="text-[11px] text-slate-500 dark:text-twilight-300">Hand-delivered to your dorm room</div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">ETB 75</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="rounded-2xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-800/60 p-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-twilight-300">
                    <span>Listing Item Price:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">ETB {itemPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-twilight-300">
                    <span className="flex items-center gap-1">
                      SafeTrade Escrow Fee (5%):
                      <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">Safe Inspection</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">ETB {escrowFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-twilight-300">
                    <span>Delivery:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{deliveryFee === 0 ? "Free Hub Pickup" : `ETB ${deliveryFee}`}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-twilight-700 pt-2 flex justify-between text-base font-bold text-slate-900 dark:text-white">
                    <span>Total Escrow Due:</span>
                    <span className="text-brand-600 dark:text-brand-400">ETB {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-brand-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 border border-white/10 transition cursor-pointer"
                >
                  Proceed to Payment Info <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step 2: Ethiopian Payment Provider Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-xs text-slate-600 dark:text-twilight-300">
                  Transfer <strong className="text-slate-900 dark:text-white">ETB {totalAmount.toLocaleString()}</strong> using any official Ethiopian bank or mobile wallet below:
                </div>

                {/* Tabs */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-twilight-750 p-1">
                  {(["telebirr", "cbe", "awash"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentProvider(method)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                        paymentProvider === method
                          ? "bg-white dark:bg-twilight-900 text-brand-600 dark:text-brand-400 shadow-sm"
                          : "text-slate-500 dark:text-twilight-300 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {method === "telebirr" ? "Telebirr" : method === "cbe" ? "CBE Birr / CBE" : "Awash Bank"}
                    </button>
                  ))}
                </div>

                {/* Account Details Box */}
                <div className="rounded-2xl border-2 border-brand-500/30 dark:border-twilight-700 bg-brand-50/20 dark:bg-twilight-750/70 p-5 space-y-3">
                  {paymentProvider === "telebirr" && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-slate-500 dark:text-twilight-300">Telebirr Merchant / SuperApp Account:</div>
                          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">0911 234 567</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("0911234567", "telebirr")}
                          className="flex items-center gap-1.5 rounded-lg border border-brand-300 dark:border-twilight-700 bg-white dark:bg-twilight-900 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-twilight-800 shadow-sm"
                        >
                          {copiedAccount === "telebirr" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedAccount === "telebirr" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-twilight-300">Beneficiary: <strong className="text-slate-900 dark:text-white">ESTUD TECHNOLOGIES PLC</strong></div>
                    </>
                  )}

                  {paymentProvider === "cbe" && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-slate-500 dark:text-twilight-300">Commercial Bank of Ethiopia (CBE):</div>
                          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">1000 4589 1234 5</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("1000458912345", "cbe")}
                          className="flex items-center gap-1.5 rounded-lg border border-brand-300 dark:border-twilight-700 bg-white dark:bg-twilight-900 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-twilight-800 shadow-sm"
                        >
                          {copiedAccount === "cbe" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedAccount === "cbe" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-twilight-300">Account Name: <strong className="text-slate-900 dark:text-white">ESTUD MARKETPLACE TRUST ESCROW</strong></div>
                    </>
                  )}

                  {paymentProvider === "awash" && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-slate-500 dark:text-twilight-300">Awash Bank Account:</div>
                          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">0132 0984 6543 00</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("01320984654300", "awash")}
                          className="flex items-center gap-1.5 rounded-lg border border-brand-300 dark:border-twilight-700 bg-white dark:bg-twilight-900 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-twilight-800 shadow-sm"
                        >
                          {copiedAccount === "awash" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedAccount === "awash" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-twilight-300">Account Name: <strong className="text-slate-900 dark:text-white">ESTUD TRUST ACCOUNT</strong></div>
                    </>
                  )}
                </div>

                <div className="rounded-xl bg-slate-100/80 dark:bg-twilight-750/50 p-3 flex gap-2.5 items-start text-xs text-slate-600 dark:text-twilight-300">
                  <AlertCircle className="h-4 w-4 text-slate-500 dark:text-twilight-300 shrink-0 mt-0.5" />
                  <span>
                    After sending money through your mobile app, save or screenshot the confirmation receipt and note the <strong>Transaction Reference</strong>.
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-slate-200 dark:border-twilight-600 bg-white dark:bg-twilight-750/70 hover:bg-slate-100 dark:hover:bg-twilight-700 text-slate-700 dark:text-twilight-200 px-6 py-3 text-sm font-medium transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-brand-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 border border-white/10 transition cursor-pointer"
                  >
                    I Have Transferred <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Transaction Ref & Screenshot Upload */}
            {step === 3 && (
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-twilight-300 mb-1.5">
                    {paymentProvider.toUpperCase()} Transaction Reference / Ref Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. FT26090123485 or 0911293847"
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-twilight-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-twilight-300 mt-1">This code appears on your SMS or mobile banking receipt.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-twilight-300 mb-1.5">
                    Attach Screenshot / Bank Receipt (Cloudinary Direct CDN)
                  </label>
                  <ImageUploader
                    maxImages={1}
                    folder="evidence"
                    value={evidenceUrls}
                    onChange={(urls) => setEvidenceUrls(urls)}
                  />
                </div>

                {errorMsg && (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-semibold block mb-0.5">Payment Verification Notice</span>
                      {errorMsg}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-slate-200 dark:border-twilight-600 bg-white dark:bg-twilight-750/70 hover:bg-slate-100 dark:hover:bg-twilight-700 text-slate-700 dark:text-twilight-200 px-6 py-3 text-sm font-medium transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !transactionRef.trim()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-brand-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 border border-white/10 disabled:opacity-50 transition cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Locking in Escrow...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Confirm & Lock in Escrow
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
