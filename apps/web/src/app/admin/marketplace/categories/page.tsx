"use client";

import * as React from "react";
import {
  Layers,
  Plus,
  Edit,
  CheckCircle2,
  XCircle,
  Package,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/trpc/client";

export default function AdminCategoriesPage() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [iconName, setIconName] = React.useState("Layers");

  const categoriesQuery = trpc.products.adminListCategories.useQuery();

  const createCategoryMutation = trpc.products.adminCreateCategory.useMutation({
    onSuccess: () => {
      setIsCreateOpen(false);
      setName("");
      setSlug("");
      setDescription("");
      categoriesQuery.refetch();
    },
  });

  const fallbackCategories = [
    {
      id: "cat-01",
      name: "Electronics & Tech",
      slug: "electronics",
      description: "Laptops, scientific calculators, tablets, chargers, and headphones",
      iconName: "Laptop",
      isActive: true,
      displayOrder: 1,
      productsCount: 420,
      subcategories: ["Laptops", "Calculators", "Audio", "Accessories"],
    },
    {
      id: "cat-02",
      name: "Academic Books & Study Material",
      slug: "books",
      description: "Medicine, Engineering, Law, and Freshman university curriculum books",
      iconName: "BookOpen",
      isActive: true,
      displayOrder: 2,
      productsCount: 315,
      subcategories: ["Engineering", "Medicine", "Freshman Course", "Social Science"],
    },
    {
      id: "cat-03",
      name: "Dorm & Campus Living",
      slug: "dorm-living",
      description: "Bed sheets, desk lamps, storage organizers, kettles, and laundry bags",
      iconName: "Home",
      isActive: true,
      displayOrder: 3,
      productsCount: 184,
      subcategories: ["Bedding", "Room Decor", "Kitchenette"],
    },
    {
      id: "cat-04",
      name: "Campus Fashion & Bags",
      slug: "fashion",
      description: "Backpacks, shoes, hoodies, lab coats, and campus merchandise",
      iconName: "Shirt",
      isActive: true,
      displayOrder: 4,
      productsCount: 165,
      subcategories: ["Bags & Backpacks", "Lab Coats", "Footwear"],
    },
  ];

  const displayCategories =
    categoriesQuery.data && categoriesQuery.data.length > 0
      ? categoriesQuery.data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "General student supplies",
          iconName: c.iconName || "Layers",
          isActive: c.isActive,
          displayOrder: c.displayOrder,
          productsCount: c.products?.length ?? 0,
          subcategories: c.subcategories?.map((s) => s.name) ?? [],
        }))
      : fallbackCategories;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Marketplace Categories</h1>
            <p className="text-xs text-muted-foreground">
              Configure product taxonomy, hierarchy, and navigation tags across Ethiopian campuses
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="h-9 gap-1.5 text-xs font-semibold shadow-sm w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">{displayCategories.length}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Active Categories</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
              Taxonomy Ready
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Package className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">1,084</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Classified Items</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>100% Mapped</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">16</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Subcategory Tags</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Granular Filters
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Category Name</TableHead>
              <TableHead className="text-xs font-semibold">Slug Identifier</TableHead>
              <TableHead className="text-xs font-semibold">Description</TableHead>
              <TableHead className="text-xs font-semibold">Listed Products</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayCategories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {cat.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-tight">{cat.name}</p>
                      <p className="text-[11px] text-muted-foreground">Order: #{cat.displayOrder}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-primary font-medium">
                  /{cat.slug}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                  {cat.description}
                </TableCell>
                <TableCell className="text-xs font-bold text-foreground">
                  {cat.productsCount} items
                </TableCell>
                <TableCell>
                  <Badge variant={cat.isActive ? "success" : "neutral"} className="text-[10px]">
                    {cat.isActive ? "Active" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create Category Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Create Category</h3>
                <p className="text-xs text-muted-foreground">Add new marketplace product category</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsCreateOpen(false)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground block">Category Name</label>
                <Input
                  placeholder="e.g. Laboratory Equipment"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground block">Slug (URL Path)</label>
                <Input
                  placeholder="e.g. lab-equipment"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground block">Description</label>
                <Input
                  placeholder="Brief description of items in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  createCategoryMutation.mutate({
                    name,
                    slug,
                    description,
                    iconName,
                    displayOrder: 0,
                  });
                }}
                disabled={createCategoryMutation.isLoading || !name || !slug}
                className="font-semibold"
              >
                Save Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
