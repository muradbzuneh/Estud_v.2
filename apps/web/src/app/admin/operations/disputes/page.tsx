"use client";

import * as React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
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

export default function AdminDisputesPage() {
  const [activeTab, setActiveTab] = React.useState<string>("ALL");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Selected dispute for resolution modal
  const [selectedDispute, setSelectedDispute] = React.useState<any | null>(null);
  const [resolutionSummary, setResolutionSummary] = React.useState("");

  const disputesQuery = trpc.disputes.adminListDisputes.useQuery({
    status: activeTab as any,
    page,
    pageSize,
  });

  const resolveMutation = trpc.disputes.adminResolve.useMutation({
    onSuccess: () => {
      setSelectedDispute(null);
      setResolutionSummary("");
      disputesQuery.refetch();
    },
  });

  const fallbackDisputes = [
    {
      id: "dsp-001",
      disputeNumber: "EST-DSP-2026-0001",
      orderNumber: "EST-ORD-2026-0001",
      reason: "DAMAGED_ITEM",
      raisedBy: { name: "Kirubel Haile", handle: "@kirubel_h" },
      description: "Screen flicker observed immediately upon unboxing at AAU 4 Kilo gate.",
      status: "OPEN",
      statusVariant: "destructive" as const,
      createdAt: "Nov 03, 2026 01:20 PM",
    },
    {
      id: "dsp-002",
      disputeNumber: "EST-DSP-2026-0002",
      orderNumber: "EST-ORD-2026-0002",
      reason: "WRONG_ITEM",
      raisedBy: { name: "Selamawit Bekele", handle: "@selam_b" },
      description: "Received 7th Edition textbook instead of the advertised 8th Edition.",
      status: "UNDER_REVIEW",
      statusVariant: "warning" as const,
      createdAt: "Nov 03, 2026 02:45 PM",
    },
  ];

  const displayDisputes =
    disputesQuery.data && disputesQuery.data.items.length > 0
      ? disputesQuery.data.items.map((dsp) => ({
          id: dsp.id,
          disputeNumber: dsp.disputeNumber,
          orderNumber: dsp.order?.orderNumber || "EST-ORD-0000",
          reason: dsp.reason,
          raisedBy: {
            name: dsp.raisedBy?.profile?.fullName || dsp.raisedBy?.name || "Student Buyer",
            handle: `@${dsp.raisedBy?.email?.split("@")[0] || "student"}`,
          },
          description: dsp.description,
          status: dsp.status,
          statusVariant: (dsp.status === "RESOLVED_REFUND" || dsp.status === "RESOLVED_SELLER_FAVOR"
            ? "success"
            : dsp.status === "OPEN"
            ? "destructive"
            : "warning") as "success" | "warning" | "destructive",
          createdAt: new Date(dsp.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }))
      : fallbackDisputes;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shadow-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Disputes & Refunds Resolution</h1>
            <p className="text-xs text-muted-foreground">
              Investigate buyer claims, examine photo evidence, and rule on escrow refunds or seller releases
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <span className="hover:text-foreground cursor-pointer">Operations</span>
          <span>/</span>
          <span className="text-foreground">Disputes</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-destructive/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">6</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Active Disputes</p>
            </div>
            <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
              Escrow Frozen
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">3</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Under Review</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Awaiting Evidence
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
                <span className="text-2xl font-bold tracking-tight">142</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Resolved Cases</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              98.2% Resolution Rate
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 w-fit overflow-x-auto">
        {["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED_REFUND", "RESOLVED_SELLER_FAVOR", "CLOSED"].map((tab) => (
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

      {/* Disputes Table */}
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Dispute ID</TableHead>
              <TableHead className="text-xs font-semibold">Order Ref</TableHead>
              <TableHead className="text-xs font-semibold">Claimant</TableHead>
              <TableHead className="text-xs font-semibold">Reason</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Filed Date</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayDisputes.map((dispute) => (
              <TableRow key={dispute.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs font-bold text-foreground">
                  {dispute.disputeNumber}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {dispute.orderNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{dispute.raisedBy.name}</p>
                    <p className="text-[11px] text-muted-foreground">{dispute.raisedBy.handle}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {dispute.reason.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={dispute.statusVariant} className="text-[10px]">
                    {dispute.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{dispute.createdAt}</TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDispute(dispute)}
                    className="h-7 text-xs gap-1 font-medium"
                  >
                    <span>Investigate</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Resolution Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Adjudicate Dispute</h3>
                <p className="text-xs text-muted-foreground">{selectedDispute.disputeNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDispute(null)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <span className="text-muted-foreground block text-[11px]">Claim Description:</span>
                <p className="text-foreground leading-relaxed italic">{selectedDispute.description}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Official Admin Ruling Summary
                </label>
                <Input
                  placeholder="State factual determination for buyer/seller..."
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resolveMutation.mutate({
                    disputeId: selectedDispute.id,
                    status: "RESOLVED_REFUND",
                    summary: resolutionSummary || "Item damaged/not as described. Full buyer refund authorized.",
                  });
                }}
                disabled={resolveMutation.isLoading}
                className="text-destructive hover:bg-destructive/10 text-xs"
              >
                Rule Buyer Favor (Refund)
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  resolveMutation.mutate({
                    disputeId: selectedDispute.id,
                    status: "RESOLVED_SELLER_FAVOR",
                    summary: resolutionSummary || "Item verified compliant. Payout released to seller.",
                  });
                }}
                disabled={resolveMutation.isLoading}
                className="text-xs font-semibold"
              >
                Rule Seller Favor (Release)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
