"use client";

import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";
import { EstudLogo } from "./estud-logo";
import { useLanguage } from "./language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-12 pb-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <EstudLogo size={32} showText={true} />
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {t("footer.desc")}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Campuses
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><span className="text-slate-700 dark:text-slate-300">Addis Ababa University (AAU)</span></li>
              <li><span className="text-slate-700 dark:text-slate-300">ASTU Adama</span></li>
              <li><span className="text-slate-700 dark:text-slate-300">Hawassa University</span></li>
              <li><span className="text-slate-700 dark:text-slate-300">Jimma University</span></li>
              <li><span className="text-slate-700 dark:text-slate-300">Bahir Dar University</span></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Trust & SafeTrade
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">48h Escrow Guarantee</Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">Student ID Verification</Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">Hub Handover Security</Link></li>
              <li><Link href="/sell" className="hover:text-indigo-600 dark:hover:text-indigo-400">0% Seller Fee Policy</Link></li>
              <li><Link href="/mobile" className="hover:text-indigo-600 dark:hover:text-indigo-400">Mobile App Guide</Link></li>
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
    </footer>
  );
}
