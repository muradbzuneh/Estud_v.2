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

export default function AdminListingsPage() {
  const [activeTab, setActiveTab] = React.useState<"ALL" | "PENDING_REVIEW" | "ARCHIVED" | "PUBLISHED">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Fetch real aggregated stats from the tRPC API
  const statsQuery = trpc.products.adminGetStats.useQuery();

  // Fetch real list of products from the tRPC API with pagination & filters
  const productsQuery = trpc.products.adminList.useQuery({
    tab: activeTab,
    search: searchQuery,
    page,
    pageSize,
  });

  const stats = statsQuery.data ?? {
    totalItems: 1248,
    publishedItems: 892,
    pendingReviewItems: 164,
    removedItems: 92,
  };

  // Mock initial rows for instant demonstration if database has 0 products
  const mockFallbackItems = [
    {
      id: "itm-00123",
      title: "HP Laptop 15",
      code: "#ITM-00123",
      category: { name: "Electronics", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
      seller: { name: "Abel Kassa", handle: "@abelkassa" },
      price: "ETB 18,000",
      status: "Published",
      statusVariant: "success" as const,
      posted: "Oct 28, 2026 2:30 PM",
      image: "💻",
    },
    {
      id: "itm-00124",
      title: "Calculus Textbook",
      code: "#ITM-00124",
      category: { name: "Books", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
      seller: { name: "Hana Mengistu", handle: "@hana_m" },
      price: "ETB 600",
      status: "Pending",
      statusVariant: "warning" as const,
      posted: "Oct 28, 2026 1:15 PM",
      image: "📚",
    },
    {
      id: "itm-00125",
      title: "School Backpack",
      code: "#ITM-00125",
      category: { name: "Accessories", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
      seller: { name: "Sami Desta", handle: "@sami_d" },
      price: "ETB 1,200",
      status: "Archived",
      statusVariant: "neutral" as const,
      posted: "Oct 27, 2026 6:45 PM",
      image: "🎒",
    },
    {
      id: "itm-00126",
      title: "Wireless Earbuds",
      code: "#ITM-00126",
      category: { name: "Audio", color: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
      seller: { name: "Marta Tadesse", handle: "@marta_t" },
      price: "ETB 2,500",
      status: "Published",
      statusVariant: "success" as const,
      posted: "Oct 27, 2026 4:20 PM",
      image: "🎧",
    },
    {
      id: "itm-00127",
      title: "Sports Shoes",
      code: "#ITM-00127",
      category: { name: "Fashion", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
      seller: { name: "Daniel Abebe", handle: "@daniel_a" },
      price: "ETB 3,000",
      status: "Published",
      statusVariant: "success" as const,
      posted: "Oct 26, 2026 9:10 PM",
      image: "👟",
    },
  ];

  const displayItems =
    productsQuery.data && productsQuery.data.items.length > 0
      ? productsQuery.data.items.map((prod) => ({
          id: prod.id,
          title: prod.title,
          code: `#ITM-${prod.id.slice(0, 5).toUpperCase()}`,
          category: {
            name: prod.category?.name || "General",
            color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          },
          seller: {
            name: prod.seller?.profile?.fullName || prod.seller?.name || "Anonymous",
            handle: `@${prod.seller?.email?.split("@")[0] || "user"}`,
          },
          price: `ETB ${Number(prod.proposedPrice).toLocaleString()}`,
          status:
            prod.status === "APPROVED"
              ? "Published"
              : prod.status === "ARCHIVED"
              ? "Archived"
              : "Pending",
          statusVariant: (prod.status === "APPROVED"
            ? "success"
            : prod.status === "ARCHIVED"
            ? "neutral"
            : "warning") as "success" | "neutral" | "warning",
          posted: new Date(prod.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          image: "📦",
        }))
      : mockFallbackItems;

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

        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <span className="hover:text-foreground cursor-pointer">Marketplace</span>
          <span>/</span>
          <span className="text-foreground">Listings</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Items */}
        <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Package className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">{stats.totalItems.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Total Items</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>12%</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Published */}
        <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">{stats.publishedItems.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Published</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>8%</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Pending Review */}
        <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">{stats.pendingReviewItems.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Pending Review</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              <TrendingDown className="h-3 w-3" />
              <span>5%</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Removed */}
        <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-rose-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <Trash2 className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">{stats.removedItems.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Removed</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Row & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "ALL"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Items ({stats.totalItems.toLocaleString()})
          </button>
          <button
            onClick={() => setActiveTab("PENDING_REVIEW")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "PENDING_REVIEW"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Review ({stats.pendingReviewItems.toLocaleString()})
          </button>
          <button
            onClick={() => setActiveTab("ARCHIVED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "ARCHIVED"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Archived ({stats.removedItems.toLocaleString()})
          </button>
        </div>

        {/* Add Item Button */}
        <Button className="h-9 gap-1.5 text-xs font-semibold shadow-sm">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID or seller..."
                className="pl-9 h-9 text-xs bg-background/50 border-border"
              />
            </div>

            {/* Dropdowns Filter */}
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
              <select className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Accessories</option>
              </select>

              <select className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option>All Status</option>
                <option>Published</option>
                <option>Pending</option>
                <option>Archived</option>
              </select>

              <select className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option>All Conditions</option>
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
              </select>

              <select className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option>Sort by: Newest</option>
                <option>Sort by: Oldest</option>
                <option>Sort by: Price</option>
              </select>

              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-12 text-center">
                <input type="checkbox" className="rounded border-border" />
              </TableHead>
              <TableHead className="text-xs font-semibold">Item</TableHead>
              <TableHead className="text-xs font-semibold">Category</TableHead>
              <TableHead className="text-xs font-semibold">Seller</TableHead>
              <TableHead className="text-xs font-semibold">Price</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Posted</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="text-center">
                  <input type="checkbox" className="rounded border-border" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg border border-border/80 shrink-0">
                      {item.image}
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-tight">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">{item.code}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] font-medium border ${item.category.color}`}>
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
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Table Footer with Pagination & Bulk Actions */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <select className="h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none">
              <option>Bulk Actions</option>
              <option>Approve Selected</option>
              <option>Archive Selected</option>
              <option>Delete Selected</option>
            </select>
            <span>Showing 1-5 of {stats.totalItems.toLocaleString()} items</span>
          </div>

          {/* Pagination Controls */}
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
            <Button variant="default" size="sm" className="h-8 w-8 p-0 font-semibold text-xs">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-xs">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-xs">
              3
            </Button>
            <span className="px-1 text-xs">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-xs">
              250
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => p + 1)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
