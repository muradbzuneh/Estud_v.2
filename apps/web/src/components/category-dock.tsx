"use client";

import { motion } from "framer-motion";
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
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative z-20 -mt-6 mx-auto max-w-7xl px-4 sm:px-6"
    >
      <div className="flex items-center justify-between gap-2.5 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-twilight-700 bg-white/90 dark:bg-twilight-800/90 p-2.5 shadow-md backdrop-blur-md no-scrollbar transition-colors duration-200">
        {CATEGORIES.map((cat, index) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors duration-200 cursor-pointer ${
                isSelected
                  ? "border border-brand-500 bg-brand-600 text-white shadow-sm shadow-brand-500/30"
                  : "border border-transparent bg-slate-50 dark:bg-twilight-750/50 text-slate-600 dark:text-twilight-300 hover:border-slate-200 dark:hover:border-twilight-700 hover:bg-slate-100 dark:hover:bg-twilight-750"
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isSelected ? "text-white" : "text-slate-400 dark:text-twilight-400"
                }`}
              />
              <span className="whitespace-nowrap">{t(cat.nameKey)}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
