"use client";

import React from "react";
import { useLanguage } from "./language-context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 text-xs font-bold shadow-xs">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-full transition-all ${
          language === "en"
            ? "bg-brand-600 text-white shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("am")}
        className={`px-2.5 py-1 rounded-full transition-all ${
          language === "am"
            ? "bg-brand-600 text-white shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        አማ
      </button>
    </div>
  );
}
