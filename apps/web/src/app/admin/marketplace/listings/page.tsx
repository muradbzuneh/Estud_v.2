"use client";

import * as React from "react";
import {
  Package,
  CheckCircle2,
  Clock,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  RotateCcw,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  X,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Star,
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
import {
  ProductValuationModal,
  type ValuationModalProduct,
} from "@/components/admin/product-valuation-modal";

export default function AdminListingsPage() {
  const [activeTab, setActiveTab] = React.useState<"ALL" | "PENDING_REVIEW" | "ARCHIVED" | "PUBLISHED">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Selected product for Valuation / Moderation Modal
  const [selectedProduct, setSelectedProduct] = React.useState<ValuationModalProduct | null>(null);
  const [isValuationModalOpen, setIsValuationModalOpen] = React.useState(false);

  // Add Item Modal state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addTitle, setAddTitle] = React.useState("");
  const [addCategoryId, setAddCategoryId] = React.useState("");
  const [addCondition, setAddCondition] = React.useState<"NEW" | "LIKE_NEW" | "GOOD" | "FAIR">("LIKE_NEW");
  const [addPrice, setAddPrice] = React.useState("");
  const [addDescription, setAddDescription] = React.useState("");
  const [addImages, setAddImages] = React.useState<string[]>([]);
  const [addUrlInput, setAddUrlInput] = React.useState("");
  const [addStatus, setAddStatus] = React.useState<"APPROVED" | "PENDING_VALUATION">("APPROVED");
  const [addIsExchange, setAddIsExchange] = React.useState(true);

  // File upload and image ordering handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setAddImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset input
    e.target.value = "";
  };

  const handleAddUrl = () => {
    if (addUrlInput.trim()) {
      setAddImages((prev) => [...prev, addUrlInput.trim()]);
      setAddUrlInput("");
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setAddImages((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
  };

  const handleRemoveImage = (index: number) => {
    setAddImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Edit Item Modal state
  const [editProduct, setEditProduct] = React.useState<any | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editPrice, setEditPrice] = React.useState("");
  const [editStatus, setEditStatus] = React.useState<any>("APPROVED");
  const [editCondition, setEditCondition] = React.useState<any>("LIKE_NEW");

  // Delete Confirmation Modal state
  const [deleteProductTarget, setDeleteProductTarget] = React.useState<any | null>(null);

  // Fetch real aggregated stats from the tRPC API
  const statsQuery = trpc.products.adminGetStats.useQuery();

  // Fetch categories from DB
  const categoriesQuery = trpc.products.adminListCategories.useQuery();

  // Fetch real list of products from the tRPC API with pagination & filters
  const productsQuery = trpc.products.adminList.useQuery({
    tab: activeTab,
    search: searchQuery,
    page,
    pageSize,
  });

  // Mutations
  const createProductMutation = trpc.products.adminCreateProduct.useMutation({
    onSuccess: () => {
      setIsAddModalOpen(false);
      setAddTitle("");
      setAddPrice("");
      setAddDescription("");
      setAddImages([]);
      setAddUrlInput("");
      productsQuery.refetch();
      statsQuery.refetch();
    },
  });

  const updateProductMutation = trpc.products.adminUpdateProductDetails.useMutation({
    onSuccess: () => {
      setEditProduct(null);
      productsQuery.refetch();
      statsQuery.refetch();
    },
  });

  const deleteProductMutation = trpc.products.adminDeleteProduct.useMutation({
    onSuccess: () => {
      setDeleteProductTarget(null);
      productsQuery.refetch();
      statsQuery.refetch();
    },
  });

  const stats = statsQuery.data ?? {
    totalItems: 0,
    publishedItems: 0,
    pendingReviewItems: 0,
    removedItems: 0,
  };

  const statCards = [
    {
      title: "Total Items",
      count: stats.totalItems,
      trend: "+12%",
      isPositive: true,
      icon: Package,
      color: "blue",
    },
    {
      title: "Published",
      count: stats.publishedItems,
      trend: "+8%",
      isPositive: true,
      icon: CheckCircle2,
      color: "emerald",
    },
    {
      title: "Pending Review",
      count: stats.pendingReviewItems,
      trend: "-5%",
      isPositive: false,
      icon: Clock,
      color: "amber",
    },
    {
      title: "Removed",
      count: stats.removedItems,
      trend: "+2%",
      isPositive: true,
      icon: Trash2,
      color: "rose",
    },
  ];

  const categoriesList = categoriesQuery.data ?? [];

  // Set initial category for add form once categories load
  React.useEffect(() => {
    if (categoriesList.length > 0 && !addCategoryId) {
      setAddCategoryId(categoriesList[0].id);
    }
  }, [categoriesList, addCategoryId]);

  const displayItems = (productsQuery.data?.items ?? []).map((prod) => ({
    id: prod.id,
    title: prod.title,
    code: `#ITM-${prod.id.slice(0, 5).toUpperCase()}`,
    category: {
      id: prod.categoryId,
      name: prod.category?.name || "General",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    seller: {
      name: prod.seller?.profile?.fullName || prod.seller?.name || "Anonymous",
      handle: `@${prod.seller?.email?.split("@")[0] || "user"}`,
    },
    price: `ETB ${Number(prod.proposedPrice).toLocaleString()}`,
    proposedPriceNum: Number(prod.proposedPrice),
    status:
      prod.status === "APPROVED"
        ? "Published"
        : prod.status === "ARCHIVED" || prod.status === "REJECTED"
        ? "Archived"
        : "Pending",
    rawStatus: prod.status,
    rawCondition: prod.condition,
    statusVariant: (prod.status === "APPROVED"
      ? "success"
      : prod.status === "ARCHIVED" || prod.status === "REJECTED"
      ? "neutral"
      : "warning") as "success" | "neutral" | "warning",
    posted: new Date(prod.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    image: prod.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200",
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Listings & Products</h1>
            <p className="text-xs text-muted-foreground">Manage all marketplace items and listings</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>/</span>
          <span>Marketplace</span>
          <span>/</span>
          <span className="text-foreground font-medium">Listings</span>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="relative overflow-hidden border-border/80 shadow-xs">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-inner ${
                      card.color === "blue"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : card.color === "emerald"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : card.color === "amber"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">{card.count.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{card.title}</p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    card.isPositive
                      ? "text-emerald-600 bg-emerald-500/10"
                      : "text-amber-600 bg-amber-500/10"
                  }`}
                >
                  {card.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{card.trend}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter Tabs and Add Item Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="inline-flex p-1 bg-muted/60 rounded-xl border border-border/60">
          <button
            onClick={() => {
              setActiveTab("ALL");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Items ({stats.totalItems})
          </button>
          <button
            onClick={() => {
              setActiveTab("PENDING_REVIEW");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "PENDING_REVIEW"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Review ({stats.pendingReviewItems})
          </button>
          <button
            onClick={() => {
              setActiveTab("PUBLISHED");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "PUBLISHED"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Published ({stats.publishedItems})
          </button>
          <button
            onClick={() => {
              setActiveTab("ARCHIVED");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "ARCHIVED"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Archived ({stats.removedItems})
          </button>
        </div>

        {/* Add Item Button (Fully Functional) */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="h-9 gap-1.5 text-xs font-semibold shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/80">
        <CardContent className="p-3">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID or seller..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-9 bg-background/60 text-xs h-9"
              />
            </div>

            {/* Quick Filter Selects */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <select className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none">
                <option>All Categories</option>
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="PENDING_REVIEW">Pending</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <select className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none">
                <option>All Conditions</option>
                <option>Brand New</option>
                <option>Like New</option>
                <option>Good Condition</option>
                <option>Fair</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Listings Table */}
      <Card className="border-border/80 overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 pl-4">
                <input type="checkbox" className="rounded border-border" />
              </TableHead>
              <TableHead className="w-[320px]">Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-xs">
                  No listings found for the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              displayItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="pl-4">
                    <input type="checkbox" className="rounded border-border" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image.startsWith("http") ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">{item.image}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold leading-tight text-foreground line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{item.code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${item.category.color} text-[11px] font-medium`}>
                      {item.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-medium leading-tight">{item.seller.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.seller.handle}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">{item.price}</TableCell>
                  <TableCell>
                    <Badge variant={item.statusVariant} className="text-[10px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.posted}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedProduct(item);
                          setIsValuationModalOpen(true);
                        }}
                        title="Valuate & Review"
                        className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditProduct(item);
                          setEditTitle(item.title);
                          setEditPrice(item.proposedPriceNum.toString());
                          setEditStatus(item.rawStatus || "APPROVED");
                          setEditCondition(item.rawCondition || "LIKE_NEW");
                        }}
                        title="Edit Item Details"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteProductTarget(item)}
                        title="Delete / Archive Item"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>Showing {displayItems.length} of {stats.totalItems.toLocaleString()} items</span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" className="h-8 px-3 text-xs">
              {page}
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={displayItems.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Product Valuation / Moderation Modal */}
      <ProductValuationModal
        isOpen={isValuationModalOpen}
        onClose={() => {
          setIsValuationModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={() => {
          productsQuery.refetch();
          statsQuery.refetch();
        }}
      />

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl border border-border max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Add New Marketplace Item
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createProductMutation.mutate({
                  title: addTitle,
                  description: addDescription || "Directly added item by administrator.",
                  categoryId: addCategoryId,
                  condition: addCondition,
                  price: parseFloat(addPrice) || 0,
                  status: addStatus,
                  images: addImages.length > 0 ? addImages : ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800"],
                  isExchangeEligible: addIsExchange,
                });
              }}
              className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Item Title</label>
                <Input
                  placeholder="e.g. Dell Inspiron 15 (16GB RAM, 512GB SSD)"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <select
                    value={addCategoryId}
                    onChange={(e) => setAddCategoryId(e.target.value)}
                    className="h-10 w-full px-3 rounded-md border border-input bg-background text-xs font-medium"
                    required
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Condition</label>
                  <select
                    value={addCondition}
                    onChange={(e) => setAddCondition(e.target.value as any)}
                    className="h-10 w-full px-3 rounded-md border border-input bg-background text-xs font-medium"
                  >
                    <option value="NEW">Brand New / Sealed</option>
                    <option value="LIKE_NEW">Used - Like New</option>
                    <option value="GOOD">Used - Good</option>
                    <option value="FAIR">Used - Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Price (ETB)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 18500"
                    value={addPrice}
                    onChange={(e) => setAddPrice(e.target.value)}
                    required
                  />
                  {parseFloat(addPrice) > 0 && (
                    <p className="text-[11px] text-emerald-600 font-medium">
                      +5% Estud fee: ETB {(parseFloat(addPrice) * 0.05).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Initial Status</label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value as any)}
                    className="h-10 w-full px-3 rounded-md border border-input bg-background text-xs font-medium"
                  >
                    <option value="APPROVED">Published (Direct Live)</option>
                    <option value="PENDING_VALUATION">Pending Valuation</option>
                  </select>
                </div>
              </div>

              {/* Product Photos Upload & Main 1st Image Selector */}
              <div className="space-y-2 border border-border/80 rounded-xl p-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" /> Product Photos & Cover Image
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    {addImages.length} {addImages.length === 1 ? "photo" : "photos"} selected
                  </span>
                </div>

                {/* Upload Options: File or URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition cursor-pointer text-xs font-medium text-primary">
                    <Upload className="w-4 h-4" />
                    <span>Upload from device</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-1.5">
                    <Input
                      placeholder="Paste image URL..."
                      value={addUrlInput}
                      onChange={(e) => setAddUrlInput(e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddUrl}
                      className="h-9 px-3 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Image Gallery Preview with 1st Main Cover Selection */}
                {addImages.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <p className="text-[11px] text-muted-foreground">
                      Click <span className="font-semibold text-foreground">"Set as Main"</span> on any image to make it the primary visible cover photo:
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                      {addImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`group relative rounded-lg border overflow-hidden aspect-square bg-muted flex items-center justify-center ${
                            idx === 0 ? "border-primary ring-2 ring-primary/40 shadow-sm" : "border-border"
                          }`}
                        >
                          <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />

                          {/* Cover badge on 1st item */}
                          {idx === 0 ? (
                            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" /> Cover
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute bottom-1 inset-x-1 bg-black/75 hover:bg-primary text-white text-[9px] font-semibold py-0.5 rounded text-center transition"
                            >
                              Set as Main
                            </button>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[10px] shadow hover:scale-110 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea
                  rows={3}
                  placeholder="Specs, included items, warranty, condition notes..."
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="addExchange"
                  checked={addIsExchange}
                  onChange={(e) => setAddIsExchange(e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="addExchange" className="text-xs font-medium text-foreground cursor-pointer">
                  Allow student barter / item exchange
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createProductMutation.isPending}
                >
                  {createProductMutation.isPending ? "Creating..." : "Add Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl border border-border max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" /> Edit Listing
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Update listing title, price, or publication status.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProductMutation.mutate({
                  productId: editProduct.id,
                  title: editTitle,
                  price: parseFloat(editPrice) || undefined,
                  status: editStatus,
                  condition: editCondition,
                });
              }}
              className="mt-4 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Title</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Price (ETB)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="h-10 w-full px-3 rounded-md border border-input bg-background text-xs font-medium"
                  >
                    <option value="APPROVED">Published</option>
                    <option value="PENDING_VALUATION">Pending Valuation</option>
                    <option value="PAUSED">Paused</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditProduct(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateProductMutation.isPending}
                >
                  {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProductTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl border border-border max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Delete Listing
            </h3>
            <p className="text-xs text-muted-foreground mt-2">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteProductTarget.title}"</span>? If this product has previous order history, it will be safely archived instead of removed.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteProductTarget(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteProductMutation.isPending}
                onClick={() => {
                  deleteProductMutation.mutate({
                    productId: deleteProductTarget.id,
                  });
                }}
              >
                {deleteProductMutation.isPending ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
