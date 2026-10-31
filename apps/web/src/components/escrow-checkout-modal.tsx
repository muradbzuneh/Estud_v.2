"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Truck,
  Building2,
  Smartphone,
  Lock,
  ArrowRight,
  X,
} from "lucide-react";
import { ImageUploader } from "./image-uploader";

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

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;

    setIsSubmitting(true);
    // Simulate payment submission and verify flow
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-5 animate-in zoom-in-75">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Payment Evidence Received!</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              Your transfer for <span className="font-semibold text-slate-900">ETB {totalAmount.toLocaleString()}</span> has been submitted to Estud SafeTrade Escrow.
            </p>

            <div className="my-6 rounded-2xl bg-amber-50 border border-amber-200/70 p-4 text-left">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <p className="font-semibold">Next Step: Verification & Pickup PIN</p>
                  <p className="mt-1 text-amber-800/90 leading-relaxed">
                    Our admin desk will verify your {paymentProvider.toUpperCase()} reference ({transactionRef}) within 10-20 minutes. Once confirmed, you will receive a secure 4-digit inspection PIN to unlock the product at the {product.campus} hub.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20"
              >
                View in My Activity
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Estud SafeTrade Escrow Checkout</h2>
                <p className="text-xs text-slate-500">100% Buyer Protection &bull; Campus Intermediary Model</p>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between my-5 text-xs font-medium text-slate-500">
              <span className={`flex items-center gap-1.5 ${step >= 1 ? "text-emerald-700 font-bold" : ""}`}>
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? "bg-emerald-600 text-white" : "bg-slate-200"}`}>1</span>
                Order Breakdown
              </span>
              <span className="h-0.5 w-8 bg-slate-200" />
              <span className={`flex items-center gap-1.5 ${step >= 2 ? "text-emerald-700 font-bold" : ""}`}>
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? "bg-emerald-600 text-white" : "bg-slate-200"}`}>2</span>
                Ethiopian Payment
              </span>
              <span className="h-0.5 w-8 bg-slate-200" />
              <span className={`flex items-center gap-1.5 ${step >= 3 ? "text-emerald-700 font-bold" : ""}`}>
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? "bg-emerald-600 text-white" : "bg-slate-200"}`}>3</span>
                Upload Evidence
              </span>
            </div>

            {/* Step 1: Breakdown */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70">
                  <h4 className="font-semibold text-slate-900 text-sm">{product.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Seller: {product.sellerName} &bull; Location: {product.campus}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Choose Collection Method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("hub")}
                      className={`flex items-start gap-3 rounded-2xl p-3.5 text-left border-2 transition-all ${
                        deliveryMethod === "hub"
                          ? "border-emerald-600 bg-emerald-50/40 text-slate-900"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <Building2 className={`h-5 w-5 mt-0.5 ${deliveryMethod === "hub" ? "text-emerald-600" : "text-slate-400"}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Campus Intermediary Hub</div>
                        <div className="text-[11px] text-slate-500">Pick up & inspect at campus desk</div>
                        <div className="text-xs font-semibold text-emerald-600 mt-1">Free</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("runner")}
                      className={`flex items-start gap-3 rounded-2xl p-3.5 text-left border-2 transition-all ${
                        deliveryMethod === "runner"
                          ? "border-emerald-600 bg-emerald-50/40 text-slate-900"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <Truck className={`h-5 w-5 mt-0.5 ${deliveryMethod === "runner" ? "text-emerald-600" : "text-slate-400"}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Campus Student Runner</div>
                        <div className="text-[11px] text-slate-500">Hand-delivered to your dorm room</div>
                        <div className="text-xs font-semibold text-slate-900 mt-1">ETB 75</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Listing Item Price:</span>
                    <span className="font-semibold text-slate-900">ETB {itemPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      SafeTrade Escrow Fee (5%):
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-medium">Safe Inspection</span>
                    </span>
                    <span className="font-semibold text-slate-900">ETB {escrowFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery:</span>
                    <span className="font-semibold text-slate-900">{deliveryFee === 0 ? "Free Hub Pickup" : `ETB ${deliveryFee}`}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-bold text-slate-900">
                    <span>Total Escrow Due:</span>
                    <span className="text-emerald-700">ETB {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
                >
                  Proceed to Payment Info <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step 2: Ethiopian Payment Provider Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-xs text-slate-600">
                  Transfer <strong className="text-slate-900">ETB {totalAmount.toLocaleString()}</strong> using any official Ethiopian bank or mobile wallet below:
                </div>

                {/* Tabs */}
                <div className="flex rounded-xl bg-slate-100 p-1">
                  {(["telebirr", "cbe", "awash"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentProvider(method)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                        paymentProvider === method
                          ? "bg-white text-emerald-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {method === "telebirr" ? "Telebirr" : method === "cbe" ? "CBE Birr / CBE" : "Awash Bank"}
                    </button>
                  ))}
                </div>

                {/* Account Details Box */}
                <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/30 p-5 space-y-3">
                  {paymentProvider === "telebirr" && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-slate-500">Telebirr Merchant / SuperApp Account:</div>
                          <div className="text-lg font-mono font-bold text-slate-900">0911 234 567</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("0911234567", "telebirr")}
                          className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 shadow-sm"
                        >
                          {copiedAccount === "telebirr" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedAccount === "telebirr" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="text-xs text-slate-600">Beneficiary: <strong>ESTUD TECHNOLOGIES PLC</strong></div>
                    </>
                  )}

                  {paymentProvider === "cbe" && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-slate-500">Commercial Bank of Ethiopia (CBE):</div>
                          <div className="text-lg font-mono font-bold text-slate-900">1000 4589 1234 5</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("1000458912345", "cbe")}
                          className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 shadow-sm"
                        >
                          {copiedAccount === "cbe" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedAccount === "cbe" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="text-xs text-slate-600">Account Name: <strong>ESTUD MARKETPLACE TRUST ESCROW</strong></div>
                    </>
                  )}

                  {paymentProvider === "awash" && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-slate-500">Awash Bank Account:</div>
                          <div className="text-lg font-mono font-bold text-slate-900">0132 0984 6543 00</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("01320984654300", "awash")}
                          className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 shadow-sm"
                        >
                          {copiedAccount === "awash" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedAccount === "awash" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="text-xs text-slate-600">Account Name: <strong>ESTUD TRUST ACCOUNT</strong></div>
                    </>
                  )}
                </div>

                <div className="rounded-xl bg-slate-100/80 p-3 flex gap-2.5 items-start text-xs text-slate-600">
                  <AlertCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    After sending money through your mobile app, save or screenshot the confirmation receipt and note the <strong>Transaction Reference</strong>.
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {paymentProvider.toUpperCase()} Transaction Reference / Ref Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. FT26090123485 or 0911293847"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">This code appears on your SMS or mobile banking receipt.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Attach Screenshot / Bank Receipt (Cloudinary Direct CDN)
                  </label>
                  <ImageUploader
                    maxImages={1}
                    folder="evidence"
                    value={evidenceUrls}
                    onChange={(urls) => setEvidenceUrls(urls)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !transactionRef.trim()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
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
