"use client";

import {
  LayoutGrid,
  BookOpen,
  Laptop,
  Smartphone,
  Ruler,
  Home,
  Shirt,
  MoreHorizontal,
} from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  icon: typeof BookOpen;
}

const CATEGORIES: CategoryItem[] = [
  { id: "all", name: "All Items", icon: LayoutGrid },
  { id: "books", name: "Books & Study", icon: BookOpen },
  { id: "laptops", name: "Laptops & Tech", icon: Laptop },
  { id: "phones", name: "Phones & Audio", icon: Smartphone },
  { id: "engineering", name: "Engineering Gear", icon: Ruler },
  { id: "dorm", name: "Dorm & Living", icon: Home },
  { id: "fashion", name: "Fashion & Bags", icon: Shirt },
  { id: "more", name: "More Categories", icon: MoreHorizontal },
];

interface CategoryDockProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryDock({ selectedCategory, onSelectCategory }: CategoryDockProps) {
  return (
    <section className="relative z-20 -mt-7 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-center gap-2.5 overflow-x-auto rounded-3xl border border-slate-200/80 bg-white/95 p-2.5 shadow-xl shadow-slate-900/5 backdrop-blur-md no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold transition duration-150 ${
                isSelected
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/25"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-emerald-700"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-emerald-600"}`} />
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
