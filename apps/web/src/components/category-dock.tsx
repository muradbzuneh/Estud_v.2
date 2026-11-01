"use client";

import {
  LayoutGrid,
  BookOpen,
  Laptop,
  Smartphone,
  Shirt,
  Armchair,
  Dumbbell,
  MoreHorizontal,
} from "lucide-react";
import { useLanguage } from "./language-context";

export interface CategoryItem {
  id: string;
  nameKey: string;
  icon: typeof BookOpen;
}

const CATEGORIES: CategoryItem[] = [
  { id: "all", nameKey: "cat.all", icon: LayoutGrid },
  { id: "books", nameKey: "cat.books", icon: BookOpen },
  { id: "laptops", nameKey: "cat.laptops", icon: Laptop },
  { id: "phones", nameKey: "cat.phones", icon: Smartphone },
  { id: "fashion", nameKey: "cat.fashion", icon: Shirt },
  { id: "furniture", nameKey: "cat.furniture", icon: Armchair },
  { id: "sports", nameKey: "cat.sports", icon: Dumbbell },
  { id: "more", nameKey: "cat.more", icon: MoreHorizontal },
];

interface CategoryDockProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryDock({ selectedCategory, onSelectCategory }: CategoryDockProps) {
  const { t } = useLanguage();

  return (
    <section className="relative z-20 -mt-8 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 overflow-x-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl shadow-slate-900/5 backdrop-blur-md no-scrollbar transition-colors duration-200">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? "border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shadow-sm"
                  : "border-2 border-transparent bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`} />
              <span className="whitespace-nowrap">{t(cat.nameKey)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
