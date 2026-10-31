import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white font-black text-sm">
                E
              </div>
              <span className="text-lg font-black text-slate-900">Estud.</span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">
              The premier student-to-student marketplace in Ethiopia. Buy, sell, and exchange educational materials, electronics, and campus living goods with managed escrow security.
            </p>
            <div className="mt-4 text-xs font-semibold text-emerald-800">
              Supported Payment Channels: Telebirr • CBE Birr • Commercial Bank of Ethiopia
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Marketplace
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li><Link href="#products" className="hover:text-emerald-700">Textbooks & Study</Link></li>
              <li><Link href="#products" className="hover:text-emerald-700">Laptops & Computers</Link></li>
              <li><Link href="#products" className="hover:text-emerald-700">Calculators & Stationery</Link></li>
              <li><Link href="#products" className="hover:text-emerald-700">Engineering Gear</Link></li>
              <li><Link href="#products" className="hover:text-emerald-700">Dorm & Campus Living</Link></li>
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
              Platform & Trust
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li><Link href="#how-it-works" className="hover:text-emerald-700">How Escrow Works</Link></li>
              <li><Link href="#exchanges" className="hover:text-emerald-700">Product Exchange Policy</Link></li>
              <li><Link href="#lost-found" className="hover:text-emerald-700">Lost & Found Portal</Link></li>
              <li><span className="text-slate-500">5% Commission Transparency</span></li>
              <li><span className="text-slate-500">Dispute & Refund Guarantee</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© 2026 Estud Technologies. Dedicated to Ethiopian students.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600">Privacy Policy</span>
            <span className="hover:text-slate-600">Terms of Service</span>
            <span className="hover:text-slate-600">Campus Agent Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
