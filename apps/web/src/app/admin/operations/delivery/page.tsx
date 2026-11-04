"use client";

import * as React from "react";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Search,
  Filter,
  Eye,
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

export default function AdminDeliveryPage() {
  const [activeTab, setActiveTab] = React.useState<string>("ALL");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Selected delivery for representative assignment
  const [selectedDelivery, setSelectedDelivery] = React.useState<any | null>(null);
  const [assignedAgentId, setAssignedAgentId] = React.useState("");
  const [instructions, setInstructions] = React.useState("");

  const deliveriesQuery = trpc.logistics.adminListDeliveries.useQuery({
    status: activeTab as any,
    page,
    pageSize,
  });

  const assignRepMutation = trpc.logistics.assignRep.useMutation({
    onSuccess: () => {
      setSelectedDelivery(null);
      setAssignedAgentId("");
      setInstructions("");
      deliveriesQuery.refetch();
    },
  });

  const fallbackDeliveries = [
    {
      id: "del-001",
      trackingNumber: "EST-DEL-2026-0001",
      orderNumber: "EST-ORD-2026-0001",
      productTitle: "HP Laptop 15",
      campusHub: "AAU 4 Kilo (Science Campus)",
      assignedRep: "Yared Wolde (Campus Rep)",
      status: "IN_TRANSIT",
      statusVariant: "warning" as const,
      recipientPin: "•••• (Secured)",
      createdAt: "Nov 03, 2026 11:15 AM",
    },
    {
      id: "del-002",
      trackingNumber: "EST-DEL-2026-0002",
      orderNumber: "EST-ORD-2026-0002",
      productTitle: "Calculus Textbook",
      campusHub: "AAU 5 Kilo (AAiT Gate)",
      assignedRep: "Bethelhem Assefa (Campus Rep)",
      status: "READY_FOR_PICKUP",
      statusVariant: "warning" as const,
      recipientPin: "•••• (Secured)",
      createdAt: "Nov 03, 2026 12:30 PM",
    },
    {
      id: "del-003",
      trackingNumber: "EST-DEL-2026-0003",
      orderNumber: "EST-ORD-2026-0003",
      productTitle: "Wireless Earbuds",
      campusHub: "AAU 6 Kilo (Main Campus)",
      assignedRep: "Dawit Kebede (Campus Rep)",
      status: "DELIVERED",
      statusVariant: "success" as const,
      recipientPin: "VERIFIED",
      createdAt: "Nov 02, 2026 05:00 PM",
    },
  ];

  const displayDeliveries =
    deliveriesQuery.data && deliveriesQuery.data.items.length > 0
      ? deliveriesQuery.data.items.map((d) => ({
          id: d.id,
          trackingNumber: d.trackingNumber,
          orderNumber: d.order?.orderNumber || "EST-ORD-0000",
          productTitle: d.order?.product?.title || "Educational Item",
          campusHub: d.dropoffLocation?.specificHubOrGate || "Campus Delivery Gate",
          assignedRep: d.assignedRep?.profile?.fullName || d.assignedRep?.name || "Unassigned",
          status: d.status,
          statusVariant: (d.status === "DELIVERED"
            ? "success"
            : d.status === "FAILED" || d.status === "RETURNED"
            ? "destructive"
            : "warning") as "success" | "warning" | "destructive",
          recipientPin: d.recipientHandoverCode ? "•••• (Secured)" : "Pending",
          createdAt: new Date(d.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }))
      : fallbackDeliveries;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Delivery & Campus Handover</h1>
            <p className="text-xs text-muted-foreground">
              Coordinate campus representatives, track physical deliveries, and verify 4-digit PIN handovers
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <span className="hover:text-foreground cursor-pointer">Operations</span>
          <span>/</span>
          <span className="text-foreground">Delivery</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">412</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Total Deliveries</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>9%</span>
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
                <span className="text-2xl font-bold tracking-tight">28</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">In Transit</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              En Route
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-sky-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">16</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">At Campus Hub</p>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded-full">
              Ready for PIN
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
                <span className="text-2xl font-bold tracking-tight">368</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Completed</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Handover Verified
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 w-fit overflow-x-auto">
        {["ALL", "SCHEDULED", "ASSIGNED", "IN_TRANSIT", "READY_FOR_PICKUP", "DELIVERED"].map((tab) => (
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

      {/* Deliveries Table */}
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Tracking Number</TableHead>
              <TableHead className="text-xs font-semibold">Order / Item</TableHead>
              <TableHead className="text-xs font-semibold">Campus Dropoff Hub</TableHead>
              <TableHead className="text-xs font-semibold">Assigned Rep</TableHead>
              <TableHead className="text-xs font-semibold">PIN Code</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayDeliveries.map((delivery) => (
              <TableRow key={delivery.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs font-bold text-foreground">
                  {delivery.trackingNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{delivery.productTitle}</p>
                    <p className="text-[11px] text-muted-foreground">{delivery.orderNumber}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{delivery.campusHub}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{delivery.assignedRep}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-primary font-bold">
                  {delivery.recipientPin}
                </TableCell>
                <TableCell>
                  <Badge variant={delivery.statusVariant} className="text-[10px]">
                    {delivery.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{delivery.createdAt}</TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDelivery(delivery)}
                    className="h-7 text-xs gap-1 font-medium"
                  >
                    <span>Assign Rep</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing 1-3 of 412 deliveries</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" className="h-8 w-8 p-0 text-xs font-semibold">
              1
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Assignment Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Assign Campus Representative</h3>
                <p className="text-xs text-muted-foreground">{selectedDelivery.trackingNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDelivery(null)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Select Representative User ID / Name
                </label>
                <Input
                  placeholder="Enter Campus Rep User ID..."
                  value={assignedAgentId}
                  onChange={(e) => setAssignedAgentId(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Delivery & Hub Instructions (Optional)
                </label>
                <Input
                  placeholder="e.g. Leave package at Student Union Gate 3..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSelectedDelivery(null)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  assignRepMutation.mutate({
                    deliveryId: selectedDelivery.id,
                    agentId: assignedAgentId || "default-rep-id",
                    instructions,
                  });
                }}
                disabled={assignRepMutation.isLoading}
                className="font-semibold"
              >
                Confirm Assignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
