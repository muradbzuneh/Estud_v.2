"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  X,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { ImageUploader } from "./image-uploader";
import { trpc } from "@/trpc/client";
import { useSession } from "@/lib/auth-client";

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
  const { data: session } = useSession();

  // Simplified 2-step flow: 1 = Order & Pay Info, 2 = Confirm Reference
  const [step, setStep] = useState<1 | 2>(1);
  const [paymentProvider, setPaymentProvider] = useState<"telebirr" | "cbe">("telebirr");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const itemPrice = product.price;
  const escrowFee = Math.round(itemPrice * 0.05); // 5% Estud escrow fee
  const totalAmount = itemPrice + escrowFee;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

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
    if (!transactionRef.trim()) {
      setErrorMsg("Please enter your transaction reference code from your SMS receipt.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const channelMap: Record<string, "TELEBIRR" | "CBE_TRANSFER"> = {
      telebirr: "TELEBIRR",
      cbe: "CBE_TRANSFER",
    };

    try {
      await checkoutMutation.mutateAsync({
        productId: product.id,
        deliveryMethod: "hub",
        deliveryFee: 0,
        channel: channelMap[paymentProvider] || "TELEBIRR",
        bankTransactionReference: transactionRef.trim(),
        screenshotUrl: evidenceUrls[0] || "",
        senderAccountOrPhone: session?.user?.name || "Student Buyer",
        notes: `SafeTrade Escrow for ${product.title}`,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(cleanErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-twilight-900 p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-twilight-700 max-h-[92vh] overflow-y-auto text-slate-900 dark:text-twilight-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 dark:text-twilight-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-twilight-800 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Guest Restriction Gate */}
        {!session?.user ? (
          <div className="text-center py-6 space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400">
              <Lock className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Sign In Required to Pay with Escrow
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-twilight-300 max-w-sm mx-auto leading-relaxed">
                Estud SafeTrade Escrow protects your money by holding it securely until you inspect the item. Please sign in to link your order and receive your campus pickup PIN.
              </p>
            </div>

            <div className="pt-2 space-y-2.5 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push(`/auth?callbackUrl=/products/${product.id}` as any);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8738] via-[#FE9901] to-[#FFA05F] hover:from-[#FE9901] hover:to-[#FF8738] py-3 text-xs font-bold text-[#07152B] shadow-md shadow-[#FF8738]/25 hover:shadow-lg hover:shadow-[#FF8738]/35 transition cursor-pointer"
              >
                <UserCheck className="h-4 w-4" /> Sign In to Continue
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-medium text-slate-500 dark:text-twilight-400 hover:text-slate-800 dark:hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : isSuccess ? (
          /* Success Screen */
          <div className="text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-4 animate-in zoom-in-75">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Payment Submitted to Escrow!
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-twilight-300 max-w-sm mx-auto">
              Your payment of <strong className="text-slate-900 dark:text-white">ETB {totalAmount.toLocaleString()}</strong> has been locked in SafeTrade Escrow.
            </p>

            <div className="my-5 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-900/40 p-4 text-left">
              <div className="flex items-start gap-2.5">
                <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-semibold">Next Step: Verification & Pickup PIN</span>
                  <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-300/90">
                    The campus agent will confirm your reference (<strong>{transactionRef}</strong>). Once verified, your 4-digit pickup PIN will appear in <strong>My Activity</strong>.
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
                className="w-full rounded-xl bg-gradient-to-r from-[#FF8738] via-[#FE9901] to-[#FFA05F] hover:from-[#FE9901] hover:to-[#FF8738] py-3 text-xs font-bold text-[#07152B] shadow-md shadow-[#FF8738]/25 hover:shadow-lg hover:shadow-[#FF8738]/35 transition cursor-pointer"
              >
                View Order in My Activity
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Step Flow */
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-twilight-700 pb-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  SafeTrade Escrow Checkout
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-twilight-300">
                  Step {step} of 2 &bull; 100% Protected Handover
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Order Summary & Payment Account */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Item Details */}
                <div className="rounded-2xl bg-slate-50 dark:bg-twilight-800 p-3.5 border border-slate-200/70 dark:border-twilight-700">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-twilight-300 mt-0.5">
                        Seller: {product.sellerName} &bull; Campus: {product.campus}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white shrink-0">
                      ETB {itemPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-800/60 p-3 flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <div className="flex-1 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Campus Handover Desk (Free Intermediary)
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-twilight-300">
                      Inspect and verify your item at the campus library desk before releasing payment.
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-800/40 p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-twilight-300">
                    <span>Item Price:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ETB {itemPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-twilight-300">
                    <span>5% SafeTrade Escrow Protection:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ETB {escrowFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-twilight-700 pt-2 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                    <span>Total Amount to Transfer:</span>
                    <span className="text-brand-600 dark:text-brand-400">
                      ETB {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Choose Payment Method */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-twilight-300">
                    Select Transfer Wallet
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentProvider("telebirr")}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        paymentProvider === "telebirr"
                          ? "border-brand-500 bg-brand-50/30 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold"
                          : "border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-800 text-slate-600 dark:text-twilight-300"
                      }`}
                    >
                      <span className="text-xs">Telebirr SuperApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentProvider("cbe")}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        paymentProvider === "cbe"
                          ? "border-brand-500 bg-brand-50/30 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold"
                          : "border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-800 text-slate-600 dark:text-twilight-300"
                      }`}
                    >
                      <span className="text-xs">CBE Birr / Bank</span>
                    </button>
                  </div>
                </div>

                {/* Account details with 1-click copy */}
                <div className="rounded-xl border border-brand-500/30 bg-brand-50/20 dark:bg-twilight-800 p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-twilight-400">
                      Transfer to {paymentProvider === "telebirr" ? "Telebirr Merchant" : "CBE Account"}:
                    </div>
                    <div className="text-base font-mono font-bold text-slate-900 dark:text-white">
                      {paymentProvider === "telebirr" ? "0911 234 567" : "1000 4589 1234 5"}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-twilight-400">
                      Name: ESTUD TECHNOLOGIES PLC
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        paymentProvider === "telebirr" ? "0911234567" : "1000458912345",
                        paymentProvider
                      )
                    }
                    className="flex items-center gap-1.5 rounded-lg border border-brand-300 dark:border-twilight-600 bg-white dark:bg-twilight-750 px-3 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 transition cursor-pointer"
                  >
                    {copiedAccount === paymentProvider ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedAccount === paymentProvider ? "Copied" : "Copy"}
                  </button>
                </div>

                {/* Proceed button */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8738] via-[#FE9901] to-[#FFA05F] hover:from-[#FE9901] hover:to-[#FF8738] py-3 text-xs font-bold text-[#07152B] shadow-md shadow-[#FF8738]/25 hover:shadow-lg hover:shadow-[#FF8738]/35 transition cursor-pointer"
                >
                  I Have Transferred ETB {totalAmount.toLocaleString()} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step 2: Confirm Transaction Reference Code */}
            {step === 2 && (
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="rounded-xl bg-slate-50 dark:bg-twilight-800 p-3.5 border border-slate-200/70 dark:border-twilight-700 text-xs">
                  <div className="flex justify-between font-medium text-slate-600 dark:text-twilight-300">
                    <span>Order:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{product.title}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-600 dark:text-twilight-300 mt-1">
                    <span>Amount Transferred:</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">ETB {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-twilight-200 mb-1">
                    SMS Transaction Reference Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder={paymentProvider === "telebirr" ? "e.g. 7GA829104 or FT260948" : "e.g. CBE-84920194"}
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-800 px-3.5 py-2.5 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF8738] focus:ring-2 focus:ring-[#FF8738]/20 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-twilight-400 mt-1">
                    Enter the code from the confirmation SMS received from {paymentProvider === "telebirr" ? "Telebirr" : "CBE"}.
                  </p>
                </div>

                {/* Optional Screenshot */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-twilight-200 mb-1">
                    Receipt Screenshot (Optional)
                  </label>
                  <ImageUploader
                    value={evidenceUrls}
                    onChange={(urls) => setEvidenceUrls(urls)}
                    maxImages={1}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-800 px-4 py-3 text-xs font-medium text-slate-700 dark:text-twilight-200 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8738] via-[#FE9901] to-[#FFA05F] hover:from-[#FE9901] hover:to-[#FF8738] py-3 text-xs font-bold text-[#07152B] shadow-md shadow-[#FF8738]/25 hover:shadow-lg hover:shadow-[#FF8738]/35 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting to Escrow...
                      </span>
                    ) : (
                      "Confirm & Lock in Escrow"
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
