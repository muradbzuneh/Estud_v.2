"use client";

import * as React from "react";
import {
  ArrowLeftRight,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
  Building2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/trpc/client";

export default function AdminExchangesPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  // Moderate modal state
  const [selectedExchange, setSelectedExchange] = React.useState<any | null>(null);
  const [actionStatus, setActionStatus] = React.useState<"COMPLETED" | "CANCELLED" | "REJECTED">("CANCELLED");
  const [modNotes, setModNotes] = React.useState("");

  const exchangesQuery = trpc.exchanges.adminList.useQuery({
    status: statusFilter as any,
    search: search || undefined,
    page,
    pageSize: 10,
  });

  const moderateMutation = trpc.exchanges.adminModerate.useMutation({
    onSuccess: () => {
      setSelectedExchange(null);
      setModNotes("");
      exchangesQuery.refetch();
    },
  });

  const fallbackExchanges = [
    {
      id: "exc-01",
      exchangeNumber: "EST-EXC-2026-0012",
      status: "ACCEPTED",
      cashDifference: "0.00",
      createdAt: new Date().toISOString(),
      requester: {
        name: "Dawit Bekele",
        profile: { institution: { shortCode: "AAU" }, campus: { name: "4 Kilo" } },
      },
      receiver: {
        name: "Abel Kassa",
        profile: { institution: { shortCode: "AAU" }, campus: { name: "4 Kilo" } },
      },
      offeredProduct: {
        title: "Data Structures in C++ (Horowitz)",
        price: "650.00",
      },
      requestedProduct: {
        title: "Computer Networking 7th Edition",
        price: "650.00",
      },
    },
    {
      id: "exc-02",
      exchangeNumber: "EST-EXC-2026-0011",
      status: "PROPOSED",
      cashDifference: "250.00",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      requester: {
        name: "Sara Yohannes",
        profile: { institution: { shortCode: "ASTU" }, campus: { name: "Main Campus" } },
      },
      receiver: {
        name: "Hana Mengistu",
        profile: { institution: { shortCode: "ASTU" }, campus: { name: "Main Campus" } },
      },
      offeredProduct: {
        title: "Casio FX-991EX ClassWiz",
        price: "1800.00",
      },
      requestedProduct: {
        title: "Digital Multimeter + Electronic Probe Kit",
        price: "2050.00",
      },
    },
    {
      id: "exc-03",
      exchangeNumber: "EST-EXC-2026-0010",
      status: "COMPLETED",
      cashDifference: "0.00",
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      requester: {
        name: "Bereket Tadesse",
        profile: { institution: { shortCode: "HU" }, campus: { name: "Main Campus" } },
      },
      receiver: {
        name: "Marta Tadesse",
        profile: { institution: { shortCode: "HU" }, campus: { name: "Main Campus" } },
      },
      offeredProduct: {
        title: "Engineering Mechanics: Statics (Meriam)",
        price: "850.00",
      },
      requestedProduct: {
        title: "Vector Mechanics for Engineers (Beer)",
        price: "850.00",
      },
    },
  ];

  const exchangeList =
    exchangesQuery.data?.items && exchangesQuery.data.items.length > 0
      ? exchangesQuery.data.items
      : fallbackExchanges;

  const totalCount = exchangesQuery.data?.total ?? fallbackExchanges.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-200">
            Accepted
          </Badge>
        );
      case "PROPOSED":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-200">
            Proposed
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-200">
            Completed
          </Badge>
        );
      case "CANCELLED":
      case "REJECTED":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-200">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Marketplace</span>
          <span>/</span>
          <span className="text-foreground font-medium">Exchanges</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ArrowLeftRight className="w-7 h-7 text-primary" />
          Direct Student Item Exchanges & Barter
        </h1>
        <p className="text-sm text-muted-foreground">
          Moderation queue for peer-to-peer equipment and textbook trades with cash-difference settlement.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exchanges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ALL">All Statuses</option>
                <option value="PROPOSED">Proposed</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground self-center">
            Showing {exchangeList.length} of {totalCount} exchange proposals
          </p>
        </CardContent>
      </Card>

      {/* Exchanges Table */}
      <Card className="border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px]">Exchange ID</TableHead>
              <TableHead>Proposer (Offered)</TableHead>
              <TableHead>Recipient (Requested)</TableHead>
              <TableHead>Cash Difference</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Proposed Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exchangeList.map((exc: any) => (
              <TableRow key={exc.id} className="hover:bg-muted/30">
                <TableCell>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {exc.exchangeNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {exc.offeredProduct?.title}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span>{exc.requester?.name}</span>
                      <span>·</span>
                      <span className="font-medium text-foreground">
                        {exc.requester?.profile?.institution?.shortCode || "AAU"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {exc.requestedProduct?.title}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span>{exc.receiver?.name}</span>
                      <span>·</span>
                      <span className="font-medium text-foreground">
                        {exc.receiver?.profile?.institution?.shortCode || "AAU"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {parseFloat(exc.cashDifference) > 0 ? (
                    <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                      +ETB {parseFloat(exc.cashDifference).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Even trade</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(exc.status)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(exc.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedExchange(exc);
                      setActionStatus(exc.status === "PROPOSED" ? "CANCELLED" : "COMPLETED");
                    }}
                    className="text-xs h-8"
                  >
                    Moderate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Moderation Modal */}
      {selectedExchange && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" /> Moderate Exchange
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              {selectedExchange.exchangeNumber}
            </p>

            <div className="mt-4 p-3 rounded-lg bg-muted/40 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Offered:</span>
                <span className="font-semibold text-foreground text-right">{selectedExchange.offeredProduct?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested:</span>
                <span className="font-semibold text-foreground text-right">{selectedExchange.requestedProduct?.title}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5">
                <span className="text-muted-foreground">Cash Difference:</span>
                <span className="font-bold text-foreground">ETB {selectedExchange.cashDifference}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Select Administrative Action</label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value as any)}
                  className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm font-medium"
                >
                  <option value="COMPLETED">Force Complete (Handover Confirmed)</option>
                  <option value="CANCELLED">Cancel Exchange (Safety or Policy)</option>
                  <option value="REJECTED">Reject Exchange</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Admin Notes / Audit Reason</label>
                <Input
                  placeholder="e.g. Items verified at campus gate handover"
                  value={modNotes}
                  onChange={(e) => setModNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedExchange(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={moderateMutation.isPending}
                onClick={() => {
                  moderateMutation.mutate({
                    exchangeId: selectedExchange.id,
                    status: actionStatus,
                    notes: modNotes || undefined,
                  });
                }}
              >
                {moderateMutation.isPending ? "Updating..." : "Confirm Action"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
