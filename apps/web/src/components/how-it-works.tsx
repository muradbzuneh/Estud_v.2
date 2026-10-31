"use client";

import { ShieldCheck, CheckCircle2, Lock, ArrowRightLeft, Truck, Banknote } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "List & Valuation",
      description: "Upload your item photos and proposed price. Estud reviews condition and sets the verified value.",
      icon: ShieldCheck,
    },
    {
      step: "02",
      title: "Escrow Payment",
      description: "Buyer transfers funds via Telebirr or CBE Birr to Estud escrow. Admin verifies receipt before release.",
      icon: Lock,
    },
    {
      step: "03",
      title: "Campus Gate Delivery",
      description: "A campus representative coordinates physical handover. The buyer inspects the item and provides a 4-digit PIN.",
      icon: Truck,
    },
    {
      step: "04",
      title: "100% Seller Payout",
      description: "Upon PIN confirmation, the seller immediately receives 100% of their approved item value with zero hidden deductions.",
      icon: Banknote,
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-slate-100 bg-slate-50/70 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            The Managed Intermediary Model
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Why Students in Ethiopia Trust Estud
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            No meeting strangers with cash. No unverified products. Estud acts as your trusted campus escrow.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/70 text-emerald-800">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">{item.step}</span>
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
