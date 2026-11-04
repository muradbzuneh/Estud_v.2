"use client";

import * as React from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileCheck,
  User,
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

export default function AdminLostFoundPage() {
  const [activeTab, setActiveTab] = React.useState<string>("ALL");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Selected report for claim review
  const [selectedReport, setSelectedReport] = React.useState<any | null>(null);
  const [reviewNotes, setReviewNotes] = React.useState("");

  const lostFoundQuery = trpc.lostFound.adminList.useQuery({
    type: activeTab as any,
    page,
    pageSize,
  });

  const reviewClaimMutation = trpc.lostFound.adminReviewClaim.useMutation({
    onSuccess: () => {
      setSelectedReport(null);
      setReviewNotes("");
      lostFoundQuery.refetch();
    },
  });

  const fallbackReports = [
    {
      id: "lf-001",
      reportNumber: "EST-LF-2026-0001",
      title: "Scientific Calculator (Casio fx-991ES)",
      type: "FOUND",
      typeVariant: "success" as const,
      category: "Calculators",
      campus: "AAU 4 Kilo (Library 2nd Floor)",
      reporter: "Natnael Tsegaye",
      status: "CLAIM_SUBMITTED",
      claimantName: "Yonas Alemu",
      privateProof: "Has blue tape on the battery cover and sticker with initials 'Y.A.'",
      createdAt: "Nov 03, 2026 09:15 AM",
    },
    {
      id: "lf-002",
      reportNumber: "EST-LF-2026-0002",
      title: "HP Blue Flash Drive (64GB)",
      type: "LOST",
      typeVariant: "warning" as const,
      category: "Storage",
      campus: "AAU 5 Kilo (Computer Lab 3)",
      reporter: "Hirut Bekele",
      status: "OPEN",
      claimantName: null,
      privateProof: null,
      createdAt: "Nov 03, 2026 11:30 AM",
    },
  ];

  const displayReports =
    lostFoundQuery.data && lostFoundQuery.data.items.length > 0
      ? lostFoundQuery.data.items.map((r) => ({
          id: r.id,
          reportNumber: r.reportNumber,
          title: r.title,
          type: r.type,
          typeVariant: (r.type === "FOUND" ? "success" : "warning") as "success" | "warning",
          category: r.category,
          campus: r.campus?.name || "Campus Ground",
          reporter: r.reporter?.profile?.fullName || r.reporter?.name || "Student",
          status: r.status,
          claimantName: r.claims?.[0]?.claimant?.profile?.fullName || r.claims?.[0]?.claimant?.name || null,
          privateProof: r.claims?.[0]?.privateProofDescription || null,
          claimId: r.claims?.[0]?.id || null,
          createdAt: new Date(r.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }))
      : fallbackReports;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Campus Lost & Found Moderation</h1>
            <p className="text-xs text-muted-foreground">
              Review lost item notices, inspect found gear, and verify private ownership recovery proofs
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <span className="hover:text-foreground cursor-pointer">Marketplace</span>
          <span>/</span>
          <span className="text-foreground">Lost & Found</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Search className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">312</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Total Items Posted</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>11%</span>
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
                <span className="text-2xl font-bold tracking-tight">18</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Claims Pending Verification</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Proof Review
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
                <span className="text-2xl font-bold tracking-tight">214</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Reunited with Owners</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Campus Impact
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 w-fit overflow-x-auto">
        {["ALL", "LOST", "FOUND"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "ALL" ? "All Items" : `${tab} Items`}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Report Ref</TableHead>
              <TableHead className="text-xs font-semibold">Item Title</TableHead>
              <TableHead className="text-xs font-semibold">Type</TableHead>
              <TableHead className="text-xs font-semibold">Category</TableHead>
              <TableHead className="text-xs font-semibold">Campus Location</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayReports.map((report) => (
              <TableRow key={report.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs font-bold text-foreground">
                  {report.reportNumber}
                </TableCell>
                <TableCell className="text-xs font-semibold text-foreground">
                  {report.title}
                </TableCell>
                <TableCell>
                  <Badge variant={report.typeVariant} className="text-[10px]">
                    {report.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{report.category}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{report.campus}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={report.status === "VERIFIED_RECOVERED" ? "success" : "neutral"}
                    className="text-[10px]"
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{report.createdAt}</TableCell>
                <TableCell className="text-right pr-6">
                  {report.claimantName ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                      className="h-7 text-xs gap-1 font-semibold"
                    >
                      <span>Review Claim</span>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                      <span>No Claims</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Claim Review Modal */}
      {selectedReport && selectedReport.claimantName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Verify Ownership Claim</h3>
                <p className="text-xs text-muted-foreground">{selectedReport.reportNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <span className="text-muted-foreground block text-[11px]">
                  Claimant: <strong className="text-foreground">{selectedReport.claimantName}</strong>
                </span>
                <span className="text-muted-foreground block text-[11px]">Private Proof Provided:</span>
                <p className="text-foreground italic bg-background p-2.5 rounded-lg border border-border">
                  "{selectedReport.privateProof}"
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Admin Verification Notes
                </label>
                <Input
                  placeholder="e.g. Identity and tape match physical item verified at gate..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  reviewClaimMutation.mutate({
                    claimId: selectedReport.claimId || selectedReport.id,
                    accept: false,
                    reviewNotes: reviewNotes || "Proof did not match item characteristics",
                  });
                }}
                disabled={reviewClaimMutation.isLoading}
                className="text-destructive hover:bg-destructive/10 text-xs"
              >
                Reject Claim
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  reviewClaimMutation.mutate({
                    claimId: selectedReport.claimId || selectedReport.id,
                    accept: true,
                    reviewNotes: reviewNotes || "Confirmed genuine owner",
                  });
                }}
                disabled={reviewClaimMutation.isLoading}
                className="text-xs font-semibold"
              >
                Approve & Mark Recovered
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
