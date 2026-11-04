"use client";

import * as React from "react";
import {
  Wallet,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Send,
  Building,
  CreditCard,
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

export default function AdminFinancePage() {
  const [activeTab, setActiveTab] = React.useState<string>("PENDING_PAYOUTS");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Selected order for payout release
  const [selectedPayoutOrder, setSelectedPayoutOrder] = React.useState<any | null>(null);
  const [payoutChannel, setPayoutChannel] = React.useState<string>("TELEBIRR");
  const [accountNumber, setAccountNumber] = React.useState<string>("");
  const [accountName, setAccountName] = React.useState<string>("");
  const [proofUrl, setProofUrl] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");

  const summaryQuery = trpc.finance.getFinancialSummary.useQuery();
  const payoutsQuery = trpc.finance.adminListPayouts.useQuery({
    status: "ALL",
    page,
    pageSize,
  });

  const executePayoutMutation = trpc.finance.adminExecutePayout.useMutation({
    onSuccess: () => {
      setSelectedPayoutOrder(null);
      setAccountNumber("");
      setAccountName("");
      setNotes("");
      summaryQuery.refetch();
      payoutsQuery.refetch();
    },
  });

  // Mock initial rows if database is empty
  const fallbackPendingPayouts = [
    {
      id: "ord-del-001",
      orderNumber: "EST-ORD-2026-0001",
      itemTitle: "HP Laptop 15",
      seller: { name: "Abel Kassa", handle: "@abelkassa", phone: "+251911223344" },
      payableAmount: "18,000.00",
      deliveredAt: "Nov 03, 2026 04:30 PM",
      status: "READY_FOR_PAYOUT",
    },
    {
      id: "ord-del-002",
      orderNumber: "EST-ORD-2026-0002",
      itemTitle: "Calculus Textbook",
      seller: { name: "Hana Mengistu", handle: "@hana_m", phone: "+251922334455" },
      payableAmount: "600.00",
      deliveredAt: "Nov 03, 2026 05:15 PM",
      status: "READY_FOR_PAYOUT",
    },
  ];

  const pendingList =
    summaryQuery.data?.pendingPayouts && summaryQuery.data.pendingPayouts.length > 0
      ? summaryQuery.data.pendingPayouts.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          itemTitle: o.product?.title || "Educational Item",
          seller: {
            name: o.seller?.profile?.fullName || o.seller?.name || "Student Seller",
            handle: `@${o.seller?.email?.split("@")[0] || "seller"}`,
            phone: o.seller?.phoneNumber || "N/A",
          },
          payableAmount: Number(o.itemValue).toLocaleString(),
          deliveredAt: new Date(o.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: "READY_FOR_PAYOUT",
        }))
      : fallbackPendingPayouts;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Financial Management & Payouts</h1>
            <p className="text-xs text-muted-foreground">
              Release seller funds for delivered items and audit Estud's 5% platform commission
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <span className="hover:text-foreground cursor-pointer">Operations</span>
          <span>/</span>
          <span className="text-foreground">Finance</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  {summaryQuery.data?.pendingPayouts?.length ?? 2}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Pending Payouts</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Delivery Verified
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
                <span className="text-2xl font-bold tracking-tight">ETB 186,400</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Paid to Students</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Completed
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">ETB 9,810</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">5% Platform Revenue</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>Net Fee</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-sky-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <Building className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">ETB 45,200</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Escrow Reserve</p>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded-full">
              Safe & Held
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 w-fit">
        <button
          onClick={() => setActiveTab("PENDING_PAYOUTS")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "PENDING_PAYOUTS"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Seller Payouts ({pendingList.length})
        </button>
        <button
          onClick={() => setActiveTab("PAYOUT_HISTORY")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "PAYOUT_HISTORY"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Payout History & Records
        </button>
      </div>

      {/* Pending Payouts Table */}
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Order Ref</TableHead>
              <TableHead className="text-xs font-semibold">Delivered Product</TableHead>
              <TableHead className="text-xs font-semibold">Student Seller</TableHead>
              <TableHead className="text-xs font-semibold">Payable (100% Value)</TableHead>
              <TableHead className="text-xs font-semibold">Delivered Date</TableHead>
              <TableHead className="text-xs font-semibold">Escrow Status</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingList.map((payout) => (
              <TableRow key={payout.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs font-bold text-foreground">
                  {payout.orderNumber}
                </TableCell>
                <TableCell className="text-xs font-semibold text-foreground">
                  {payout.itemTitle}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{payout.seller.name}</p>
                    <p className="text-[11px] text-muted-foreground">{payout.seller.phone}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ETB {payout.payableAmount}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{payout.deliveredAt}</TableCell>
                <TableCell>
                  <Badge variant="success" className="text-[10px]">
                    {payout.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedPayoutOrder(payout);
                      setAccountName(payout.seller.name);
                      setAccountNumber(payout.seller.phone.replace("+251", "0"));
                    }}
                    className="h-7 text-xs gap-1.5 font-semibold"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Release Payout</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Payout Execution Modal */}
      {selectedPayoutOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Execute Seller Payout</h3>
                <p className="text-xs text-muted-foreground">{selectedPayoutOrder.orderNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedPayoutOrder(null)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Beneficiary Seller:</span>
                  <strong className="text-foreground">{selectedPayoutOrder.seller.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product Sold:</span>
                  <span className="text-foreground">{selectedPayoutOrder.itemTitle}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 font-bold text-sm">
                  <span>Payable Amount:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ETB {selectedPayoutOrder.payableAmount}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground block">
                    Payout Channel
                  </label>
                  <select
                    value={payoutChannel}
                    onChange={(e) => setPayoutChannel(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
                  >
                    <option value="TELEBIRR">Telebirr (Ethio Telecom)</option>
                    <option value="CBE_BIRR">CBE Birr (Commercial Bank of Ethiopia)</option>
                    <option value="CBE_TRANSFER">CBE Account Transfer</option>
                    <option value="BOA_TRANSFER">Bank of Abyssinia</option>
                    <option value="AWASH_BIRR">Awash Birr</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground block">
                      Account / Phone Number
                    </label>
                    <Input
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 0911223344"
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground block">
                      Beneficiary Account Name
                    </label>
                    <Input
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Full legal name"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground block">
                    Internal Payout Notes (Optional)
                  </label>
                  <Input
                    placeholder="Bank reference code or payout transaction ID..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPayoutOrder(null)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  executePayoutMutation.mutate({
                    orderId: selectedPayoutOrder.id,
                    payoutChannel: payoutChannel as any,
                    sellerAccountNumber: accountNumber || "0911223344",
                    sellerAccountName: accountName || selectedPayoutOrder.seller.name,
                    notes,
                  });
                }}
                disabled={executePayoutMutation.isLoading}
                className="font-semibold gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Confirm & Release Funds</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
