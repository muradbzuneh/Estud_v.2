"use client";

import { motion } from "framer-motion";
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
    <section id="how-it-works" className="border-t border-slate-200/80 dark:border-twilight-700 bg-white dark:bg-twilight-900 py-16 sm:py-24 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> {t("hiw.tag")}
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t("hiw.title")}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            {t("hiw.subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative flex flex-col rounded-2xl border border-slate-200/80 dark:border-twilight-700 bg-slate-50/50 dark:bg-twilight-800 p-6 shadow-xs transition duration-200 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    item.step === "02" || item.step === "04"
                      ? "bg-amber-400/15 text-amber-500 dark:text-amber-400 border border-amber-400/25"
                      : "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-700">{item.step}</span>
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
