"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  QrCode,
  ExternalLink,
  ChevronRight,
  Layers,
  Moon,
  Globe2,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function DownloadPage() {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement("a");
    link.href = "https://expo.dev/artifacts/eas/KOpOJDPTN-GKp495yQQyzROKddpMmSh_HhodhoBx7kc.apk";
    link.download = "estud-v2.2.0.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#071328] text-white selection:bg-[#FE9901] selection:text-[#071328]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Marketplace</Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="text-white font-medium">Download Mobile App</span>
        </nav>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F224A] via-[#0A1733] to-[#060E20] border border-blue-500/20 p-8 sm:p-12 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FE9901]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-3.5 py-1 text-xs font-bold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>OFFICIAL RELEASE &bull; v2.2.0 (STABLE)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Get <span className="bg-gradient-to-r from-[#FF8738] via-[#FE9901] to-[#FFA05F] bg-clip-text text-transparent">Estud Mobile</span> for Android
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Experience ultra-fast student commerce, 100% SafeTrade Escrow protection with campus pickup PINs, live Barter Exchanges, and Campus Lost & Found desk.
              </p>

              {/* Version Specs */}
              <div className="grid grid-cols-3 gap-3 py-2 text-xs">
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Version</div>
                  <div className="font-mono font-bold text-amber-300">v2.2.0 Signed</div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Format</div>
                  <div className="font-mono font-bold text-white">Android APK</div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Target OS</div>
                  <div className="font-mono font-bold text-emerald-400">Android 8.0+</div>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF8738] via-[#FE9901] to-[#FFA05F] hover:from-[#FE9901] hover:to-[#FF8738] px-6 py-4 text-sm font-black text-[#07152B] shadow-lg shadow-[#FF8738]/30 hover:shadow-xl hover:shadow-[#FF8738]/40 transition active:scale-[0.98] cursor-pointer"
                >
                  <Download className="h-5 w-5 stroke-[2.5]" />
                  <span>{downloadStarted ? "Downloading APK..." : "Download Estud v2.2.0 APK"}</span>
                </button>

                <a
                  href="https://expo.dev/accounts/muradbzuneh/projects/estud-monorepo/builds"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 px-5 py-4 text-sm font-bold text-white transition cursor-pointer"
                >
                  <span>Expo EAS Cloud Builds</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
              </div>

              {downloadStarted && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Download started! File: <code className="font-mono text-white">estud-v2.2.0.apk</code></span>
                </div>
              )}
            </div>

            {/* Right Card: QR Code & Release Card */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-xs rounded-2xl bg-[#0B1A38] border border-blue-400/20 p-5 space-y-4 shadow-xl text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-300">
                  <QrCode className="h-4 w-4 text-amber-400" />
                  <span>Direct Mobile Install Link</span>
                </div>

                <div className="mx-auto w-44 h-44 rounded-xl bg-white p-3 flex items-center justify-center shadow-inner">
                  {/* Visual QR Code Generator placeholder using SVG */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="8" height="8" rx="1" />
                    <rect x="4" y="4" width="4" height="4" fill="currentColor" />
                    <rect x="14" y="2" width="8" height="8" rx="1" />
                    <rect x="16" y="4" width="4" height="4" fill="currentColor" />
                    <rect x="2" y="14" width="8" height="8" rx="1" />
                    <rect x="4" y="16" width="4" height="4" fill="currentColor" />
                    <path d="M14 14h2v2h-2zM18 14h4v2h-4zM14 18h4v4h-4zM20 18h2v4h-2z" fill="currentColor" />
                  </svg>
                </div>

                <p className="text-[11px] text-slate-400">
                  Scan with your Android camera or open <br />
                  <span className="font-mono text-amber-300 font-semibold">https://estud.et/download</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">What&apos;s New in v2.2.0</h2>
            <p className="text-xs text-slate-400">Built specifically for Ethiopian higher education campuses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-white">SafeTrade Escrow Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Money is locked safely until you inspect your item at the campus hub. Complete handovers using your secret 4-digit PIN.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Globe2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Full Amharic (አማርኛ) Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single-toggle language switcher enables instant full localization across product listings, activity, and notifications.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Moon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Deep Midnight Dark Theme</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single ☀️/🌙 toggle for eye-friendly nighttime browsing with high-contrast text and crisp card silhouettes.
              </p>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="rounded-2xl bg-[#0B1A38]/70 border border-blue-500/20 p-6 sm:p-8 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-amber-400" />
            3-Step Android Installation Guide
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl bg-white/5 p-4 space-y-2 border border-white/5">
              <div className="h-6 w-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                1
              </div>
              <div className="font-bold text-white">Download the APK</div>
              <p className="text-slate-400 leading-relaxed">
                Tap &ldquo;Download Estud v2.2.0 APK&rdquo; above. If prompted by your browser, tap &ldquo;Download anyway&rdquo;.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 p-4 space-y-2 border border-white/5">
              <div className="h-6 w-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                2
              </div>
              <div className="font-bold text-white">Allow Unknown Sources</div>
              <p className="text-slate-400 leading-relaxed">
                Open downloaded file. If Android asks for permission, enable &ldquo;Allow from this source&rdquo; in Settings.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 p-4 space-y-2 border border-white/5">
              <div className="h-6 w-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                3
              </div>
              <div className="font-bold text-white">Install & Sign In</div>
              <p className="text-slate-400 leading-relaxed">
                Tap &ldquo;Install&rdquo;. Open Estud, select your campus (e.g. AAU 4 Kilo), and sign in with Google in one tap!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
