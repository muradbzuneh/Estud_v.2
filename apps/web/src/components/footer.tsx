"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, MapPin } from "lucide-react";
import { EstudLogo } from "./estud-logo";
import { useLanguage } from "./language-context";
import { CampusMapModal } from "./campus-map-modal";

export function Footer() {
  const { t } = useLanguage();
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

  return (
    <footer className="border-t border-slate-200/80 dark:border-twilight-700 bg-white dark:bg-twilight-900 pt-12 pb-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <EstudLogo size={32} showText={true} />
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {t("footer.desc")}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <ShieldCheck className="h-4 w-4" />
              {t("footer.supported")}
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Marketplace
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="#products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Textbooks & Study</Link></li>
              <li><Link href="#products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Laptops & Computers</Link></li>
              <li><Link href="#products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Calculators & Stationery</Link></li>
              <li><Link href="#products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Engineering Gear</Link></li>
              <li><Link href="#products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Dorm & Campus Living</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Campuses & Hubs</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCampus("aau-4kilo")}
                  className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 text-left transition cursor-pointer"
                >
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>Addis Ababa University (AAU)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCampus("astu")}
                  className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 text-left transition cursor-pointer"
                >
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>ASTU Adama</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCampus("hu")}
                  className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 text-left transition cursor-pointer"
                >
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>Hawassa University (HU)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCampus("ju")}
                  className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 text-left transition cursor-pointer"
                >
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>Jimma University (JU)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCampus("bdu")}
                  className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 text-left transition cursor-pointer"
                >
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>Bahir Dar University (BDU)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Trust & SafeTrade
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href={"/lost-found" as any} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"><span>Lost &amp; Found Desk</span><span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Active</span></Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">48h Escrow Guarantee</Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">Student ID Verification</Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">Hub Handover Security</Link></li>
              <li><Link href="/sell" className="hover:text-indigo-600 dark:hover:text-indigo-400">0% Seller Fee Policy</Link></li>
              <li><Link href="/mobile" className="hover:text-indigo-600 dark:hover:text-indigo-400">Mobile App Guide</Link></li>
              <li><Link href={"/download" as any} className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"><span>Download Mobile APK (v2.2.1)</span><span className="text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono">NEW</span></Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-8 sm:flex-row text-xs text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Escrow Service</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Campus Agent Support</a>
          </div>
        </div>
      </div>

      {/* Interactive Google Map Campus Hub Modal */}
      <CampusMapModal
        isOpen={!!selectedCampus}
        onClose={() => setSelectedCampus(null)}
        initialCampusId={selectedCampus || undefined}
      />
    </footer>
  );
}
