import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Scale, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Terms of SafeTrade Service | Estud Ethiopian Campus Marketplace",
  description: "Official terms governing campus SafeTrade payments, physical inspection PIN release, and dispute resolution.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-twilight-900 text-slate-900 dark:text-twilight-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>

        {/* Header */}
        <div className="border-b border-slate-200 dark:border-twilight-700 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Scale className="h-4 w-4" />
            Binding Campus Agreement
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Terms of SafeTrade Service
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Last updated: November 2026 • Governing all student-to-student transactions across Ethiopian university hubs.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-brand-500" /> 1. Campus SafeTrade Architecture
            </h2>
            <p>
              Estud operates a dedicated campus SafeTrade buyer protection framework. When a buyer places an order and submits payment via Telebirr or Commercial Bank of Ethiopia (CBE), funds are held in secure protection custody until the item is physically verified at an authorized campus hub.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" /> 2. Payment Verification &amp; Inspection PIN Release
            </h2>
            <p>
              To ensure total transaction integrity, the 4-digit secret Inspection PIN remains <strong>strictly locked</strong> until Estud administrators confirm receipt of bank transfer proof in the Operations Portal.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Lock Rule:</strong> Neither buyer nor seller may release protected funds or mark an order completed before administrator payment verification is finalized.
              </li>
              <li>
                <strong>Physical Inspection:</strong> The buyer has 48 hours to inspect the item in person at the campus hub.
              </li>
              <li>
                <strong>Handover PIN Exchange:</strong> Once satisfied with condition, the buyer reveals the secret PIN to the seller to authorize instantaneous payout release.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" /> 3. Fee Transparency
            </h2>
            <p>
              Estud operates on an anti-exploitation, student-first economic policy:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>0% Seller Fees:</strong> University students list and sell items with zero commission deducted from listing revenue.</li>
              <li><strong>Transparent Buyer Protection Fee:</strong> An optional 5% protection fee guarantees intermediary hub storage, anti-theft screening, and immediate refund if an item fails specification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" /> 4. Dispute &amp; Rejection Protocol
            </h2>
            <p>
              If an item fails physical inspection (e.g., undisclosed laptop battery defect or broken textbook spine), the buyer reports rejection directly at the hub desk. Protected funds are refunded in full to the buyer's original payment account within 24 business hours.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 dark:border-twilight-700 pt-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Campus Jurisdiction &amp; Inquiries
            </h2>
            <p>
              These terms are governed by the commercial and consumer protection codes of the Federal Democratic Republic of Ethiopia. For support, contact{" "}
              <a href="mailto:support@estud.et" className="text-brand-600 dark:text-brand-400 font-semibold underline">
                support@estud.et
              </a>{" "}
              or contact your campus hub representative.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
