"use client";

import * as React from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
  Search,
  Filter,
  DollarSign,
  ChevronLeft,
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

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Selected order for detailed modal / status adjustment
  const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);

  const ordersQuery = trpc.orders.adminListOrders.useQuery({
    status: activeTab as any,
    page,
    pageSize,
  });

  const updateOrderStatusMutation = trpc.orders.adminUpdateOrderStatus.useMutation({
    onSuccess: () => {
      setSelectedOrder(null);
      ordersQuery.refetch();
    },
  });

  // Mock initial items if database has 0 orders
  const fallbackOrders = [
    {
      id: "ord-001",
      orderNumber: "EST-ORD-2026-0001",
      productTitle: "HP Laptop 15",
      productCode: "#ITM-00123",
      buyer: { name: "Kirubel Haile", handle: "@kirubel_h" },
      seller: { name: "Abel Kassa", handle: "@abelkassa" },
      totalAmount: "18,900.00",
      itemValue: "18,000.00",
      commission: "900.00",
      status: "IN_DELIVERY",
      statusVariant: "warning" as const,
      createdAt: "Nov 03, 2026 10:45 AM",
    },
    {
      id: "ord-002",
      orderNumber: "EST-ORD-2026-0002",
      productTitle: "Calculus Textbook",
      productCode: "#ITM-00124",
      buyer: { name: "Selamawit Bekele", handle: "@selam_b" },
      seller: { name: "Hana Mengistu", handle: "@hana_m" },
      totalAmount: "630.00",
      itemValue: "600.00",
      commission: "30.00",
      status: "PAYMENT_VERIFIED",
      statusVariant: "success" as const,
      createdAt: "Nov 03, 2026 11:50 AM",
    },
    {
      id: "ord-003",
      orderNumber: "EST-ORD-2026-0003",
      productTitle: "Wireless Earbuds",
      productCode: "#ITM-00126",
      buyer: { name: "Biniam Girma", handle: "@biniam_g" },
      seller: { name: "Marta Tadesse", handle: "@marta_t" },
      totalAmount: "2,625.00",
      itemValue: "2,500.00",
      commission: "125.00",
      status: "COMPLETED",
      statusVariant: "success" as const,
      createdAt: "Nov 02, 2026 04:15 PM",
    },
  ];

  const displayOrders =
    ordersQuery.data && ordersQuery.data.items.length > 0
      ? ordersQuery.data.items.map((ord) => ({
          id: ord.id,
          orderNumber: ord.orderNumber,
          productTitle: ord.product?.title || "Marketplace Item",
          productCode: `#ITM-${ord.productId.slice(0, 5).toUpperCase()}`,
          buyer: {
            name: ord.buyer?.profile?.fullName || ord.buyer?.name || "Student Buyer",
            handle: `@${ord.buyer?.email?.split("@")[0] || "buyer"}`,
          },
          seller: {
            name: ord.seller?.profile?.fullName || ord.seller?.name || "Student Seller",
            handle: `@${ord.seller?.email?.split("@")[0] || "seller"}`,
          },
          totalAmount: Number(ord.totalAmount).toLocaleString(),
          itemValue: Number(ord.itemValue).toLocaleString(),
          commission: Number(ord.commissionAmount).toLocaleString(),
          status: ord.status,
          statusVariant: (ord.status === "COMPLETED" || ord.status === "PAYMENT_VERIFIED"
            ? "success"
            : ord.status === "DISPUTED" || ord.status === "CANCELLED"
            ? "destructive"
            : "warning") as "success" | "warning" | "destructive",
          createdAt: new Date(ord.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }))
      : fallbackOrders;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Orders & Transactions</h1>
            <p className="text-xs text-muted-foreground">
              Monitor escrow transactions, buyer payments, and campus delivery progress
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <span className="hover:text-foreground cursor-pointer">Marketplace</span>
          <span>/</span>
          <span className="text-foreground">Orders</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">854</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Total Orders</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>14%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">42</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Payment Pending</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Awaiting Proof
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-sky-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">68</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">In Transit</p>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded-full">
              Rep Handover
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">744</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Completed</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Escrow Released
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 w-fit overflow-x-auto">
        {["ALL", "PAYMENT_PENDING", "PAYMENT_VERIFIED", "IN_DELIVERY", "COMPLETED", "DISPUTED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Order Number</TableHead>
              <TableHead className="text-xs font-semibold">Product</TableHead>
              <TableHead className="text-xs font-semibold">Buyer</TableHead>
              <TableHead className="text-xs font-semibold">Seller</TableHead>
              <TableHead className="text-xs font-semibold">Total (ETB)</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs font-bold text-foreground">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{order.productTitle}</p>
                    <p className="text-[11px] text-muted-foreground">{order.productCode}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs font-medium leading-tight">{order.buyer.name}</p>
                    <p className="text-[11px] text-muted-foreground">{order.buyer.handle}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs font-medium leading-tight">{order.seller.name}</p>
                    <p className="text-[11px] text-muted-foreground">{order.seller.handle}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-bold text-foreground">
                  ETB {order.totalAmount}
                </TableCell>
                <TableCell>
                  <Badge variant={order.statusVariant} className="text-[10px]">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{order.createdAt}</TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedOrder(order)}
                    className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing 1-3 of 854 transactions</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" className="h-8 w-8 p-0 text-xs font-semibold">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-xs">
              2
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Order Milestones</h3>
                <p className="text-xs text-muted-foreground">{selectedOrder.orderNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product:</span>
                  <strong className="text-foreground">{selectedOrder.productTitle}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Item Value:</span>
                  <strong className="text-foreground">ETB {selectedOrder.itemValue}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estud Fee (5%):</span>
                  <strong className="text-primary">ETB {selectedOrder.commission}</strong>
                </div>
                <div className="flex justify-between border-t border-border pt-1 font-bold">
                  <span>Total Escrow Amount:</span>
                  <span className="text-foreground">ETB {selectedOrder.totalAmount}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">
                  Override Order Status (Admin Intervention)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["PAYMENT_VERIFIED", "IN_DELIVERY", "COMPLETED", "DISPUTED"].map((st) => (
                    <Button
                      key={st}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateOrderStatusMutation.mutate({
                          orderId: selectedOrder.id,
                          status: st as any,
                          notes: "Status manually updated by admin",
                        });
                      }}
                      className="text-xs h-8"
                    >
                      Set to {st.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 text-right">
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
