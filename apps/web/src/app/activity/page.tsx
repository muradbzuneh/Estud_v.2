"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowLeftRight,
  Package,
  Building2,
  MapPin,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface MockOrder {
  id: string;
  orderNumber: string;
  itemTitle: string;
  itemImage: string;
  price: number;
  escrowFee: number;
  total: number;
  campusHub: string;
  sellerName: string;
  status: "evidence_submitted" | "escrow_verified" | "at_hub" | "completed";
  verificationPin: string;
  transactionRef: string;
  paymentMethod: string;
  date: string;
}

const SAMPLE_ORDERS: MockOrder[] = [
  {
    id: "ord-1",
    orderNumber: "EST-84920",
    itemTitle: "Laptop Dell Inspiron 15 (11th Gen Core i5, 16GB RAM)",
    itemImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
    price: 18000,
    escrowFee: 900,
    total: 18900,
    campusHub: "AAU 4 Kilo - Science Faculty Partner Desk",
    sellerName: "Yohannes M.",
    status: "at_hub",
    verificationPin: "7294",
    transactionRef: "FT26094829104",
    paymentMethod: "Telebirr",
    date: "Today, 10:45 AM",
  },
  {
    id: "ord-2",
    orderNumber: "EST-84119",
    itemTitle: "Sony Noise-Canceling Wireless Earbuds",
    itemImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    price: 2500,
    escrowFee: 125,
    total: 2625,
    campusHub: "AAiT 5 Kilo - Engineering Hub",
    sellerName: "Alazar T.",
    status: "escrow_verified",
    verificationPin: "4108",
    transactionRef: "CBE-1092837482",
    paymentMethod: "CBE Birr",
    date: "Yesterday",
  },
];

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<"purchases" | "sales" | "exchanges">("purchases");
  const [showPin, setShowPin] = useState<Record<string, boolean>>({});
  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [completedOrderIds, setCompletedOrderIds] = useState<Record<string, boolean>>({});

  const togglePinVisibility = (orderId: string) => {
    setShowPin((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const copyPin = (pin: string, orderId: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(orderId);
    setTimeout(() => setCopiedPin(null), 2500);
  };

  const handleConfirmHandover = (orderId: string) => {
    setCompletedOrderIds((prev) => ({ ...prev, [orderId]: true }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">SafeTrade Escrow Activity</span>
        </div>

        {/* Title & Trust Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> 100% Escrow Protection
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Escrow Orders & Activity
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Manage your purchases, 4-digit inspection PINs, seller payouts, and barter proposals.
            </p>
          </div>

          <Link
            href="/sell"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="h-3.5 w-3.5" /> Sell Another Item (0% Fee)
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-8 text-sm font-bold mb-6">
          <button
            onClick={() => setActiveTab("purchases")}
            className={`pb-3 transition relative ${
              activeTab === "purchases"
                ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            My Purchases ({SAMPLE_ORDERS.length})
          </button>

          <button
            onClick={() => setActiveTab("sales")}
            className={`pb-3 transition relative ${
              activeTab === "sales"
                ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            My Sales & Payouts (1)
          </button>

          <button
            onClick={() => setActiveTab("exchanges")}
            className={`pb-3 transition relative ${
              activeTab === "exchanges"
                ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Exchange Proposals (2)
          </button>
        </div>

        {/* Tab 1: Purchases & Escrow PINs */}
        {activeTab === "purchases" && (
          <div className="space-y-6">
            {SAMPLE_ORDERS.map((order) => {
              const isCompleted = completedOrderIds[order.id] || order.status === "completed";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm transition hover:shadow-md space-y-6"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 font-mono">{order.orderNumber}</span>
                          <span className="text-xs text-slate-400">&bull; {order.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Seller: <strong className="text-slate-700">{order.sellerName}</strong></p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Order Completed & Inspected
                        </span>
                      ) : order.status === "at_hub" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 animate-pulse">
                          <Clock className="h-3.5 w-3.5" /> Ready for Inspection at Hub
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                          <ShieldCheck className="h-3.5 w-3.5" /> Escrow Payment Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Item Details */}
                    <div className="lg:col-span-6 flex gap-4">
                      <img
                        src={order.itemImage}
                        alt={order.itemTitle}
                        className="h-24 w-24 rounded-2xl object-cover bg-slate-100 shrink-0 border border-slate-200/80"
                      />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{order.itemTitle}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                          <span>{order.campusHub}</span>
                        </div>
                        <div className="text-xs text-slate-600 pt-1">
                          Payment: <span className="font-semibold text-slate-900">{order.paymentMethod}</span> ({order.transactionRef})
                        </div>
                        <div className="text-sm font-black text-slate-900 pt-1">
                          Total Escrow: ETB {order.total.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Secret 4-Digit Inspection PIN Box */}
                    <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-slate-50 p-5 border border-indigo-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-indigo-600" />
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                            Secret Inspection PIN
                          </span>
                        </div>
                        <button
                          onClick={() => togglePinVisibility(order.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:underline"
                        >
                          {showPin[order.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          {showPin[order.id] ? "Hide" : "Reveal PIN"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-indigo-200/60 shadow-xs">
                        <span className="font-mono text-xl font-black tracking-widest text-slate-900">
                          {showPin[order.id] ? order.verificationPin : "••••"}
                        </span>
                        <button
                          onClick={() => copyPin(order.verificationPin, order.id)}
                          className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                        >
                          {copiedPin === order.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedPin === order.id ? "Copied" : "Copy"}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        <strong className="text-slate-700">SafeTrade Rule:</strong> Inspect the product thoroughly at the campus desk. Only provide this 4-digit PIN to the agent once you are 100% satisfied.
                      </p>

                      {!isCompleted && order.status === "at_hub" && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleConfirmHandover(order.id)}
                            className="flex-1 rounded-full bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                          >
                            I Inspected & Accept Item
                          </button>
                          <button className="rounded-full border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition">
                            Dispute
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Sales & Payouts */}
        {activeTab === "sales" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Thomas' Calculus (14th Edition Hardcover)</h3>
                <p className="text-xs text-slate-500">Buyer: Almaz K. &bull; Campus Drop-off: AAU 4 Kilo Desk</p>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                Payout Pending PIN Handover
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-xs space-y-2 border border-slate-200/70">
              <div className="flex justify-between text-slate-600">
                <span>Approved Item Price:</span>
                <span className="font-bold text-slate-900">ETB 600</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Seller Service Fee (Estud Promotion):</span>
                <span className="font-bold text-emerald-700">0% (ETB 0.00)</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                <span>Your Net Payout (Telebirr 0911***23):</span>
                <span className="text-emerald-700 font-black">ETB 600</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Drop off this book at the AAU 4-Kilo partner desk before 5:00 PM. Once the buyer enters their 4-digit PIN, your ETB 600 will be instantly disbursed to your Telebirr wallet.
            </p>
          </div>
        )}

        {/* Tab 3: Exchange Proposals */}
        {activeTab === "exchanges" && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <ArrowLeftRight className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Trade: iPad 9th Gen 64GB ↔ Dell Inspiron 15
                  </h4>
                  <p className="text-xs text-slate-500">
                    Student Alazar offered iPad + <strong className="text-slate-900">ETB 2,000 cash balance</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition">
                  Accept Exchange
                </button>
                <button className="rounded-full border border-slate-200 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
