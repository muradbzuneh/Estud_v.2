import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Privacy Policy | Estud Ethiopian Campus Marketplace",
  description: "How Estud protects student privacy, escrow credentials, and educational transaction data.",
};

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="h-4 w-4" />
            Verified Campus Privacy Standards
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Estud Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Last updated: November 2026 • Effective for all Ethiopian university students, faculty, and campus hubs.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-brand-500" /> 1. Commitment to Student Privacy
            </h2>
            <p>
              Estud ("we", "our", or "the platform") is committed to protecting the personal data and institutional privacy of university students across Ethiopia. This Privacy Policy details what information we collect, why we need it for safe campus trading, and how it is secured.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-500" /> 2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Student Identification:</strong> Full name, university email address (e.g., student@aau.edu.et or personal email), campus location, and optional Ethiopian phone number (e.g. 09xxxxxxxx) for Telebirr/CBE payment receipt matching.
              </li>
              <li>
                <strong>Marketplace &amp; Escrow Activity:</strong> Listings submitted, item valuations, condition photos, physical hub inspection choices, and payment transaction references submitted for admin escrow verification.
              </li>
              <li>
                <strong>Lost &amp; Found Registry:</strong> Public item inquiries and lost/found reports submitted to campus intermediary helpdesks.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-500" /> 3. How We Use Your Data
            </h2>
            <p>We use student data solely to deliver trust and security in peer-to-peer campus commerce:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Verifying student identity and enforcing campus anti-fraud measures.</li>
              <li>Holding buyer payment proof safely in escrow pending physical item inspection.</li>
              <li>Sending transactional notifications regarding order verification, PIN unlocking, and delivery status.</li>
              <li>We <strong>never sell, lease, or monetize</strong> student data to third-party marketing companies.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> 4. Escrow PIN &amp; Payment Proof Security
            </h2>
            <p>
              Telebirr and CBE transaction screenshots submitted by students are stored securely on our enterprise Cloudinary CDN storage and are only accessible by vetted Estud administrative personnel for payment matching. Secret 4-digit inspection PINs remain locked until payment receipt approval.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 dark:border-twilight-700 pt-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Contact &amp; Campus Data Officer
            </h2>
            <p>
              For data deletion requests, account security inquiries, or privacy feedback, reach our verified security desk at{" "}
              <a href="mailto:privacy@estud.et" className="text-brand-600 dark:text-brand-400 font-semibold underline">
                privacy@estud.et
              </a>{" "}
              or visit your campus Intermediary Hub desk.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
