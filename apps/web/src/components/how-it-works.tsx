"use client";

import { ShieldCheck, Lock, Truck, Banknote, Sparkles } from "lucide-react";
import { useLanguage } from "./language-context";

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      step: "01",
      title: t("hiw.step1Title"),
      description: t("hiw.step1Desc"),
      icon: ShieldCheck,
    },
    {
      step: "02",
      title: t("hiw.step2Title"),
      description: t("hiw.step2Desc"),
      icon: Lock,
    },
    {
      step: "03",
      title: t("hiw.step3Title"),
      description: t("hiw.step3Desc"),
      icon: Truck,
    },
    {
      step: "04",
      title: t("hiw.step4Title"),
      description: t("hiw.step4Desc"),
      icon: Banknote,
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-16 sm:py-24 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> {t("hiw.tag")}
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t("hiw.title")}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            {t("hiw.subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100/70 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-700">{item.step}</span>
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
