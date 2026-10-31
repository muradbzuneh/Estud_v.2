import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";
import { EstudLogo } from "./estud-logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <EstudLogo size={32} showText={true} />
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">
              The premier student-to-student marketplace in Ethiopia. Buy, sell, and exchange educational materials, electronics, and campus living goods with managed escrow security.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-700">
              <ShieldCheck className="h-4 w-4" />
              Supported: Telebirr &bull; CBE Birr &bull; Commercial Bank of Ethiopia
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Marketplace
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li><Link href="#products" className="hover:text-indigo-600">Textbooks & Study</Link></li>
              <li><Link href="#products" className="hover:text-indigo-600">Laptops & Computers</Link></li>
              <li><Link href="#products" className="hover:text-indigo-600">Calculators & Stationery</Link></li>
              <li><Link href="#products" className="hover:text-indigo-600">Engineering Gear</Link></li>
              <li><Link href="#products" className="hover:text-indigo-600">Dorm & Campus Living</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Campuses
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li><span className="text-slate-700">Addis Ababa University (AAU)</span></li>
              <li><span className="text-slate-700">ASTU Adama</span></li>
              <li><span className="text-slate-700">Hawassa University</span></li>
              <li><span className="text-slate-700">Jimma University</span></li>
              <li><span className="text-slate-700">Bahir Dar University</span></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Trust & SafeTrade
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li><Link href="#how-it-works" className="hover:text-indigo-600">48h Escrow Guarantee</Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-600">Student ID Verification</Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-600">Hub Handover Security</Link></li>
              <li><Link href="/sell" className="hover:text-indigo-600">0% Seller Fee Policy</Link></li>
              <li><Link href="/mobile" className="hover:text-indigo-600">Mobile App Guide</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Estud Technologies PLC. Built for Ethiopian University Students.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Escrow Service</a>
            <a href="#" className="hover:text-indigo-600">Campus Agent Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
