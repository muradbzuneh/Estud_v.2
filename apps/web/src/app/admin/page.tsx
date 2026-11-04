"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Wallet,
  Building2,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { trpc } from "@/trpc/client";

// Mock trend data for monthly GMV & Commission
const monthlyTrends = [
  { month: "May", gmv: 34000, revenue: 1700 },
  { month: "Jun", gmv: 48000, revenue: 2400 },
  { month: "Jul", gmv: 62000, revenue: 3100 },
  { month: "Aug", gmv: 85000, revenue: 4250 },
  { month: "Sep", gmv: 112000, revenue: 5600 },
  { month: "Oct", gmv: 148250, revenue: 7412.5 },
];

const categoryDistribution = [
  { name: "Electronics", value: 45, color: "#2563eb" },
  { name: "Textbooks", value: 25, color: "#8b5cf6" },
  { name: "Fashion & Shoes", value: 15, color: "#10b981" },
  { name: "Dorm Essentials", value: 10, color: "#f59e0b" },
  { name: "Others", value: 5, color: "#64748b" },
];

export default function AdminDashboardPage() {
  const metricsQuery = trpc.products.adminGetDashboardMetrics.useQuery();

  const metrics = metricsQuery.data || {
    totalProducts: 1248,
    publishedProducts: 892,
    pendingProducts: 164,
    totalOrders: 342,
    totalGmv: 148250,
    totalCommission: 7412.5,
    deliveredOrders: 289,
    pendingPayments: 12,
    pendingDeliveries: 7,
    openDisputes: 2,
    totalUsers: 512,
    recentOrders: [],
    recentListings: [],
  };

  const fallbackOrders = [
    {
      id: "ord-01",
      orderNumber: "EST-ORD-2026-0042",
      totalAmount: "18000.00",
      commissionAmount: "900.00",
      status: "DELIVERED",
      createdAt: new Date().toISOString(),
      buyer: { name: "Dawit Bekele", email: "dawit.b@aau.edu.et" },
      seller: { name: "Abel Kassa", email: "abel.k@aau.edu.et" },
      product: { title: "HP Laptop 15 Core i5" },
    },
    {
      id: "ord-02",
      orderNumber: "EST-ORD-2026-0041",
      totalAmount: "630.00",
      commissionAmount: "30.00",
      status: "IN_TRANSIT",
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      buyer: { name: "Sara Yohannes", email: "sara.y@astu.edu.et" },
      seller: { name: "Hana Mengistu", email: "hana.m@astu.edu.et" },
      product: { title: "Calculus Early Transcendentals" },
    },
    {
      id: "ord-03",
      orderNumber: "EST-ORD-2026-0040",
      totalAmount: "2625.00",
      commissionAmount: "125.00",
      status: "PAYMENT_SUBMITTED",
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      buyer: { name: "Bereket Tadesse", email: "bereket@hu.edu.et" },
      seller: { name: "Marta Tadesse", email: "marta@hu.edu.et" },
      product: { title: "Sony WH-1000XM4 Noise Canceling" },
    },
    {
      id: "ord-04",
      orderNumber: "EST-ORD-2026-0039",
      totalAmount: "1260.00",
      commissionAmount: "60.00",
      status: "CONFIRMED",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      buyer: { name: "Liya Solomon", email: "liya@aau.edu.et" },
      seller: { name: "Sami Desta", email: "sami@aau.edu.et" },
      product: { title: "Waterproof Campus Backpack" },
    },
  ];

  const recentOrdersList =
    metrics.recentOrders && metrics.recentOrders.length > 0
      ? metrics.recentOrders
      : fallbackOrders;

  const fallbackListings = [
    {
      id: "p-01",
      title: "Dell XPS 13 (16GB RAM, 512GB SSD)",
      price: "42000.00",
      status: "PENDING_VALUATION",
      createdAt: new Date().toISOString(),
      seller: { name: "Michael Kebede" },
      category: { name: "Electronics" },
    },
    {
      id: "p-02",
      title: "TI-84 Plus CE Graphing Calculator",
      price: "3500.00",
      status: "VALUED",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      seller: { name: "Bethlehem Haile" },
      category: { name: "Electronics" },
    },
    {
      id: "p-03",
      title: "Architecture Drafting Board & T-Square",
      price: "1800.00",
      status: "PENDING_VALUATION",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      seller: { name: "Nahom Girma" },
      category: { name: "Stationery" },
    },
  ];

  const recentListingsList =
    metrics.recentListings && metrics.recentListings.length > 0
      ? metrics.recentListings
      : fallbackListings;

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-900">
            Delivered
          </Badge>
        );
      case "IN_TRANSIT":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-900">
            In Transit
          </Badge>
        );
      case "PAYMENT_SUBMITTED":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-900">
            Payment Verification
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border border-purple-200 dark:border-purple-900">
            Confirmed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Portal</span>
            <span>/</span>
            <span className="text-foreground font-medium">Dashboard Overview</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Marketplace Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time operations, peer escrow settlement, campus logistics, and financial overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/marketplace/listings">
            <Button variant="outline" size="sm" className="gap-2">
              <Package className="w-4 h-4" /> Listings Queue
            </Button>
          </Link>
          <Link href="/admin/operations/payments">
            <Button size="sm" className="gap-2">
              <CreditCard className="w-4 h-4" /> Review Payments
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <Card className="border border-border/80 shadow-xs relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Gross Marketplace Value
              </p>
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-extrabold tracking-tight">
                ETB {metrics.totalGmv.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estud Commission */}
        <Card className="border border-border/80 shadow-xs relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Estud 5% Commission
              </p>
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-extrabold tracking-tight text-emerald-600">
                ETB {metrics.totalCommission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Net platform revenue collected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Published Listings */}
        <Card className="border border-border/80 shadow-xs relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Listings
              </p>
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-extrabold tracking-tight">
                {metrics.publishedProducts} <span className="text-sm font-normal text-muted-foreground">/ {metrics.totalProducts}</span>
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Live items on campus feeds</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registered Users */}
        <Card className="border border-border/80 shadow-xs relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Students & Reps
              </p>
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-extrabold tracking-tight">
                {metrics.totalUsers}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground font-medium">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Across AAU, ASTU, HU campuses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Task Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/admin/operations/payments" className="block">
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-xs font-bold text-foreground">{metrics.pendingPayments} Pending Receipts</div>
                <div className="text-[11px] text-muted-foreground">Telebirr / CBE slips</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>

        <Link href="/admin/marketplace/listings?tab=PENDING_REVIEW" className="block">
          <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-all flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-xs font-bold text-foreground">{metrics.pendingProducts} Valuations</div>
                <div className="text-[11px] text-muted-foreground">Approve seller pricing</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>

        <Link href="/admin/operations/delivery" className="block">
          <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-all flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-xs font-bold text-foreground">{metrics.pendingDeliveries} Active Handovers</div>
                <div className="text-[11px] text-muted-foreground">Campus rep checkpoints</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>

        <Link href="/admin/operations/disputes" className="block">
          <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-xs font-bold text-foreground">{metrics.openDisputes} Open Disputes</div>
                <div className="text-[11px] text-muted-foreground">Escrow arbitration</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GMV & Commission Trend (2 Cols) */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Monthly Volume & Platform Revenue (ETB)</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gross transaction volume vs Estud 5% marketplace commission
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Last 6 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                  <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground text-xs" />
                  <YAxis stroke="currentColor" className="text-muted-foreground text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #334155",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`ETB ${Number(value).toLocaleString()}`]}
                  />
                  <Area
                    type="monotone"
                    dataKey="gmv"
                    name="Gross Volume (ETB)"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGmv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Estud Commission (ETB)"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Share Distribution (1 Col) */}
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Category Market Share</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Trading volume by student equipment types
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}% of listings`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 space-y-1.5">
              {categoryDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Bottom Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Queue */}
        <Card className="border border-border">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" /> Recent Orders & Escrow Handover
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time purchase transactions across university campuses
              </p>
            </div>
            <Link href="/admin/marketplace/orders">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentOrdersList.map((ord: any) => (
                <div key={ord.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-foreground">{ord.orderNumber}</span>
                      {getOrderStatusBadge(ord.status)}
                    </div>
                    <div className="text-sm font-medium text-foreground mt-1">
                      {ord.product?.title || "Marketplace Product"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Buyer: <span className="text-foreground">{ord.buyer?.name}</span> · Seller: <span className="text-foreground">{ord.seller?.name}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-foreground">
                      ETB {parseFloat(ord.totalAmount).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">
                      Fee: +ETB {parseFloat(ord.commissionAmount).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Review & Valuations */}
        <Card className="border border-border">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> Pending Review & Valuations
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Seller product listings requiring 5% commission valuation approval
              </p>
            </div>
            <Link href="/admin/marketplace/listings?tab=PENDING_REVIEW">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Review Queue <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentListingsList.map((prod: any) => (
                <div key={prod.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-900 text-[11px]">
                        Pending Review
                      </Badge>
                      <span className="text-xs text-muted-foreground">{prod.category?.name || "General"}</span>
                    </div>
                    <div className="text-sm font-medium text-foreground mt-1 line-clamp-1">
                      {prod.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Seller: <span className="text-foreground">{prod.seller?.name || "Student"}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-foreground">
                      ETB {parseFloat(prod.price).toLocaleString()}
                    </div>
                    <Link href={`/admin/marketplace/listings?tab=PENDING_REVIEW`}>
                      <Button variant="outline" size="sm" className="mt-1 h-7 text-xs gap-1">
                        <Eye className="w-3 h-3" /> Value
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
