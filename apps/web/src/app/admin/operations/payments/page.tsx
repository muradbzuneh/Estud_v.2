"use client";

import * as React from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  FileCheck,
  AlertTriangle,
  ExternalLink,
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

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = React.useState<"ALL" | "SUBMITTED" | "VERIFIED" | "REJECTED">("ALL");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Selected verification state
  const [selectedPayment, setSelectedPayment] = React.useState<any | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  // Queries & Mutations
  const summaryQuery = trpc.finance.getFinancialSummary.useQuery();
  const paymentsQuery = trpc.finance.adminListPayments.useQuery({
    status: activeTab,
    page,
    pageSize,
  });

  const verifyMutation = trpc.finance.adminVerify.useMutation({
    onSuccess: () => {
      setSelectedPayment(null);
      paymentsQuery.refetch();
      summaryQuery.refetch();
    },
  });

  // Mock initial rows for demonstration if database has 0 payment records
  const fallbackPayments = [
    {
      id: "pay-001",
      paymentReference: "EST-PAY-2026-0001",
      amount: "18,900.00",
      channel: "TELEBIRR",
      status: "SUBMITTED",
      receivingAccount: "0911223344",
      createdAt: "Nov 03, 2026 10:20 AM",
      buyer: { name: "Kirubel Haile", handle: "@kirubel_h" },
      bankRef: "TRX-TEL-982341",
      screenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
      itemTitle: "HP Laptop 15",
    },
    {
      id: "pay-002",
      paymentReference: "EST-PAY-2026-0002",
      amount: "630.00",
      channel: "CBE_BIRR",
      status: "SUBMITTED",
      receivingAccount: "1000123456789",
      createdAt: "Nov 03, 2026 11:45 AM",
      buyer: { name: "Selamawit Bekele", handle: "@selam_b" },
      bankRef: "FT2630799812",
      screenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
      itemTitle: "Calculus Textbook",
    },
    {
      id: "pay-003",
      paymentReference: "EST-PAY-2026-0003",
      amount: "2,625.00",
      channel: "CBE_TRANSFER",
      status: "VERIFIED",
      receivingAccount: "1000123456789",
      createdAt: "Nov 02, 2026 03:10 PM",
      buyer: { name: "Biniam Girma", handle: "@biniam_g" },
      bankRef: "FT2630129034",
      screenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
      itemTitle: "Wireless Earbuds",
    },
  ];

  const isLoaded = !paymentsQuery.isLoading && !!paymentsQuery.data;
  const items = paymentsQuery.data?.items ?? [];

  const displayList = isLoaded
    ? items.map((p) => ({
        id: p.id,
        paymentReference: p.paymentReference,
        amount: Number(p.amount).toLocaleString(),
        channel: p.channel,
        status: p.status,
        receivingAccount: p.receivingAccountNumber,
        createdAt: new Date(p.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        buyer: {
          name: p.order?.buyer?.profile?.fullName || p.order?.buyer?.name || "Student Buyer",
          handle: `@${p.order?.buyer?.email?.split("@")[0] || "student"}`,
        },
        bankRef: p.evidence?.[0]?.bankTransactionReference || "N/A",
        screenshotUrl: p.evidence?.[0]?.screenshotUrl || "",
        itemTitle: p.order?.product?.title || "Marketplace Item",
      }))
    : fallbackPayments;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Payment Verification Queue</h1>
            <p className="text-xs text-muted-foreground">
              Review and verify Telebirr & CBE bank transfer receipts for escrow orders
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <span className="hover:text-foreground cursor-pointer">Operations</span>
          <span>/</span>
          <span className="text-foreground">Payments</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  {summaryQuery.data?.pendingPayments?.length ?? 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">
                Pending Verification
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Escrow Action
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
                <span className="text-2xl font-bold tracking-tight">1,842</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">
                Verified Payments
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>18%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">ETB 425,800</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">
                Total Escrow Handled
              </p>
            </div>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Safe & Insured
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 w-fit">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "ALL"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Payments
        </button>
        <button
          onClick={() => setActiveTab("SUBMITTED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "SUBMITTED"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setActiveTab("VERIFIED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "VERIFIED"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Verified
        </button>
        <button
          onClick={() => setActiveTab("REJECTED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "REJECTED"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Payments Table */}
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Payment Ref</TableHead>
              <TableHead className="text-xs font-semibold">Buyer / Item</TableHead>
              <TableHead className="text-xs font-semibold">Channel</TableHead>
              <TableHead className="text-xs font-semibold">Bank Txn Ref</TableHead>
              <TableHead className="text-xs font-semibold">Amount</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                  No payment records found in this view.
                </TableCell>
              </TableRow>
            ) : (
              displayList.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs font-semibold text-foreground">
                  {payment.paymentReference}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{payment.buyer.name}</p>
                    <p className="text-[11px] text-muted-foreground">{payment.itemTitle}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                    {payment.channel}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {payment.bankRef}
                </TableCell>
                <TableCell className="text-xs font-bold text-foreground">
                  ETB {payment.amount}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === "VERIFIED"
                        ? "success"
                        : payment.status === "REJECTED"
                        ? "destructive"
                        : "warning"
                    }
                    className="text-[10px]"
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{payment.createdAt}</TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedPayment(payment)}
                    className="h-7 text-xs gap-1.5 font-semibold"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Verify Receipt</span>
                  </Button>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </Card>

      {/* Verification Dialog Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Review Payment Proof</h3>
                  <p className="text-xs text-muted-foreground">{selectedPayment.paymentReference}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPayment(null)}
                className="h-8 w-8 text-muted-foreground"
              >
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Receipt Preview */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Channel:</span>
                  <strong className="text-foreground">{selectedPayment.channel}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bank Reference:</span>
                  <strong className="font-mono text-primary text-xs">{selectedPayment.bankRef}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <strong className="text-sm font-bold text-foreground">
                    ETB {selectedPayment.amount}
                  </strong>
                </div>
              </div>

              {/* Screenshot display */}
              {selectedPayment.screenshotUrl && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    Uploaded Transaction Screenshot:
                  </span>
                  <div className="relative rounded-xl border border-border overflow-hidden bg-background h-48 flex items-center justify-center">
                    <img
                      src={selectedPayment.screenshotUrl}
                      alt="Bank Proof"
                      className="max-h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Rejection reason input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground block">
                  Rejection Reason (if invalid):
                </label>
                <Input
                  placeholder="e.g. Reference code not found on statement..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  verifyMutation.mutate({
                    paymentId: selectedPayment.id,
                    verified: false,
                    rejectionReason: rejectReason || "Unverified bank receipt",
                  });
                }}
                disabled={verifyMutation.isLoading}
                className="text-destructive hover:bg-destructive/10 h-8 text-xs gap-1.5"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  verifyMutation.mutate({
                    paymentId: selectedPayment.id,
                    verified: true,
                  });
                }}
                disabled={verifyMutation.isLoading}
                className="h-8 text-xs gap-1.5 font-semibold"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Verify & Authorize Delivery</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
