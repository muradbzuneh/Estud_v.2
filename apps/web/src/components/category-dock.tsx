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

export interface CategoryItem {
  id: string;
  name: string;
  icon: typeof BookOpen;
}

const CATEGORIES: CategoryItem[] = [
  { id: "all", name: "All Categories", icon: LayoutGrid },
  { id: "books", name: "Books & Study", icon: BookOpen },
  { id: "laptops", name: "Laptops & Computers", icon: Laptop },
  { id: "phones", name: "Phones & Accessories", icon: Smartphone },
  { id: "fashion", name: "Fashion", icon: Shirt },
  { id: "furniture", name: "Furniture", icon: Armchair },
  { id: "sports", name: "Sports & Fitness", icon: Dumbbell },
  { id: "more", name: "More", icon: MoreHorizontal },
];

interface CategoryDockProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryDock({ selectedCategory, onSelectCategory }: CategoryDockProps) {
  return (
    <section className="relative z-20 -mt-8 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 overflow-x-auto rounded-3xl border border-slate-200/90 bg-white p-3 shadow-xl shadow-slate-900/5 backdrop-blur-md no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? "border-2 border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm"
                  : "border-2 border-transparent bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-indigo-600" : "text-slate-500"}`} />
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
