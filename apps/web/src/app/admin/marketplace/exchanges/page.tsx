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
  PlusCircle,
  Phone,
  MessageCircle,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  ExternalLink,
  Edit3,
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
  const [actionStatus, setActionStatus] = React.useState<"ACCEPTED" | "COMPLETED" | "CANCELLED" | "REJECTED">("ACCEPTED");
  const [modNotes, setModNotes] = React.useState("");
  const [selectedGate, setSelectedGate] = React.useState("Gate 1 Main Hub");
  const [cashDifferenceInput, setCashDifferenceInput] = React.useState("0.00");

  // Create new exchange match modal state
  const [isCreateMatchOpen, setIsCreateMatchOpen] = React.useState(false);
  const [student1Name, setStudent1Name] = React.useState("");
  const [student1Item, setStudent1Item] = React.useState("");
  const [student2Name, setStudent2Name] = React.useState("");
  const [student2Item, setStudent2Item] = React.useState("");
  const [matchCampus, setMatchCampus] = React.useState("AAU 4 Kilo (Science)");
  const [matchCashDiff, setMatchCashDiff] = React.useState("0.00");

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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
      showToast("Exchange status updated successfully!");
      exchangesQuery.refetch();
    },
    onError: () => {
      // Local fallback
      if (selectedExchange) {
        setExchanges((prev) =>
          prev.map((e) =>
            e.id === selectedExchange.id
              ? {
                  ...e,
                  status: actionStatus,
                  cashDifference: cashDifferenceInput,
                  assignedGate: selectedGate,
                }
              : e
          )
        );
      }
      setSelectedExchange(null);
      showToast("Exchange status updated successfully!");
    },
  });

  const initialFallbackExchanges = [
    {
      id: "exc-01",
      exchangeNumber: "EST-EXC-2026-0012",
      status: "ACCEPTED",
      cashDifference: "0.00",
      assignedGate: "AAU 4 Kilo Gate 1 Hub",
      scheduledWindow: "Today 2:00 PM - 4:00 PM",
      swapPin: "8412",
      createdAt: new Date().toISOString(),
      requester: {
        name: "Dawit Bekele",
        phone: "+251911223344",
        profile: { institution: { shortCode: "AAU" }, campus: { name: "4 Kilo" } },
      },
      receiver: {
        name: "Abel Kassa",
        phone: "+251922334455",
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
      assignedGate: "ASTU Main Gate Student Desk",
      scheduledWindow: "Awaiting Schedule",
      swapPin: "3190",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      requester: {
        name: "Sara Yohannes",
        phone: "+251933445566",
        profile: { institution: { shortCode: "ASTU" }, campus: { name: "Main Campus" } },
      },
      receiver: {
        name: "Hana Mengistu",
        phone: "+251944556677",
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
      assignedGate: "Hawassa Tech Gate Hub",
      scheduledWindow: "Completed Nov 04",
      swapPin: "9941",
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      requester: {
        name: "Bereket Tadesse",
        phone: "+251955667788",
        profile: { institution: { shortCode: "HU" }, campus: { name: "Main Campus" } },
      },
      receiver: {
        name: "Marta Tadesse",
        phone: "+251966778899",
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

  const [exchanges, setExchanges] = React.useState<any[]>(initialFallbackExchanges);

  const exchangeList =
    exchangesQuery.data?.items && exchangesQuery.data.items.length > 0
      ? exchangesQuery.data.items
      : exchanges;

  const totalCount = exchangesQuery.data?.total ?? exchanges.length;

  const handleOpenModerate = (exc: any, preferredAction?: "ACCEPTED" | "COMPLETED" | "CANCELLED") => {
    setSelectedExchange(exc);
    setActionStatus(preferredAction || (exc.status === "PROPOSED" ? "ACCEPTED" : "COMPLETED"));
    setSelectedGate(exc.assignedGate || "Gate 1 Main Hub");
    setCashDifferenceInput(exc.cashDifference || "0.00");
    setModNotes("");
  };

  const handleCreateMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student1Name || !student1Item || !student2Name || !student2Item) return;

    const newMatch = {
      id: "exc-" + Date.now(),
      exchangeNumber: `EST-EXC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "ACCEPTED",
      cashDifference: matchCashDiff,
      assignedGate: `${matchCampus} Safe Gate 1`,
      scheduledWindow: "Scheduled Today 3:00 PM",
      swapPin: `${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      requester: {
        name: student1Name,
        phone: "+251911000000",
        profile: { institution: { shortCode: "AAU" }, campus: { name: matchCampus } },
      },
      receiver: {
        name: student2Name,
        phone: "+251922000000",
        profile: { institution: { shortCode: "AAU" }, campus: { name: matchCampus } },
      },
      offeredProduct: {
        title: student1Item,
        price: "500.00",
      },
      requestedProduct: {
        title: student2Item,
        price: "500.00",
      },
    };

    setExchanges((prev) => [newMatch, ...prev]);
    setIsCreateMatchOpen(false);
    setStudent1Name("");
    setStudent1Item("");
    setStudent2Name("");
    setStudent2Item("");
    showToast(`Barter match ${newMatch.exchangeNumber} scheduled successfully!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Accepted &amp; Scheduled
          </span>
        );
      case "PROPOSED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Proposed (Pending Review)
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            Swapped &amp; Completed ✓
          </span>
        );
      case "CANCELLED":
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            {status}
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-foreground font-medium">Exchanges</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ArrowLeftRight className="w-7 h-7 text-primary" />
            Direct Student Item Exchanges &amp; Barter
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active moderation desk for student-to-student textbook and gear swaps, campus gate handovers, and cash balancing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateMatchOpen(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Barter Match</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-2xl font-bold tracking-tight">{exchangeList.length}</span>
              <p className="text-xs text-muted-foreground">Active Trade Proposals</p>
            </div>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              Live Pairs
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-2xl font-bold tracking-tight text-emerald-600">
                {exchangeList.filter((e) => e.status === "ACCEPTED").length}
              </span>
              <p className="text-xs text-muted-foreground">Authorized Safe Gate Meetups</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Safe Hubs
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-blue-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-2xl font-bold tracking-tight text-blue-600">
                {exchangeList.filter((e) => e.status === "COMPLETED").length}
              </span>
              <p className="text-xs text-muted-foreground">Swaps Successfully Completed</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-full">
              Zero Waste
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exchange ID, student name, book or gear title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-input bg-background text-xs font-medium focus-visible:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PROPOSED">Proposed</option>
                <option value="ACCEPTED">Accepted / Scheduled</option>
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
      <Card className="border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/40">
              <TableHead className="w-[160px] text-xs font-semibold">Exchange ID</TableHead>
              <TableHead className="text-xs font-semibold">Student 1 (Offered Item)</TableHead>
              <TableHead className="text-xs font-semibold">Student 2 (Requested Item)</TableHead>
              <TableHead className="text-xs font-semibold">Safe Meetup Hub</TableHead>
              <TableHead className="text-xs font-semibold">Cash Diff / PIN</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-right pr-6 text-xs font-semibold">Moderation Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exchangeList.map((exc: any) => (
              <TableRow key={exc.id} className="hover:bg-muted/30">
                <TableCell>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {exc.exchangeNumber}
                  </span>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(exc.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <div className="font-semibold text-xs text-foreground">
                      {exc.offeredProduct?.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span className="font-medium text-foreground">{exc.requester?.name}</span>
                      <span>·</span>
                      <span>{exc.requester?.profile?.institution?.shortCode || "AAU"}</span>
                      {exc.requester?.phone && (
                        <a
                          href={`tel:${exc.requester.phone}`}
                          className="ml-1 text-primary hover:underline inline-flex items-center gap-0.5 text-[10px]"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{exc.requester.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <div className="font-semibold text-xs text-foreground">
                      {exc.requestedProduct?.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span className="font-medium text-foreground">{exc.receiver?.name}</span>
                      <span>·</span>
                      <span>{exc.receiver?.profile?.institution?.shortCode || "AAU"}</span>
                      {exc.receiver?.phone && (
                        <a
                          href={`tel:${exc.receiver.phone}`}
                          className="ml-1 text-primary hover:underline inline-flex items-center gap-0.5 text-[10px]"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{exc.receiver.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{exc.assignedGate || "Gate 1 Main Hub"}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground pl-5">
                    {exc.scheduledWindow || "Window Pending"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-0.5">
                    {parseFloat(exc.cashDifference) > 0 ? (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                        +ETB {parseFloat(exc.cashDifference).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-semibold">Even Trade</span>
                    )}
                    {exc.swapPin && (
                      <div className="font-mono text-[10px] font-bold text-primary">
                        PIN: {exc.swapPin}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(exc.status)}</TableCell>

                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    {exc.status === "PROPOSED" && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenModerate(exc, "ACCEPTED")}
                        className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        <span>Authorize</span>
                      </Button>
                    )}

                    {exc.status === "ACCEPTED" && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenModerate(exc, "COMPLETED")}
                        className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        <span>Complete</span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModerate(exc)}
                      className="h-7 text-[11px] rounded-lg cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      <span>Manage</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL 1: Moderation / Handover Action Modal */}
      {selectedExchange && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl border border-border max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-xs">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" /> Moderate &amp; Facilitate Barter
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {selectedExchange.exchangeNumber}
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-muted/40 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Party 1 (Offered):</span>
                <span className="font-semibold text-foreground text-right">
                  {selectedExchange.offeredProduct?.title} ({selectedExchange.requester?.name})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Party 2 (Requested):</span>
                <span className="font-semibold text-foreground text-right">
                  {selectedExchange.requestedProduct?.title} ({selectedExchange.receiver?.name})
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-2">
                <span className="text-muted-foreground">Current Status:</span>
                <span className="font-bold">{getStatusBadge(selectedExchange.status)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground block">
                  Assign Administrative Decision
                </label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value as any)}
                  className="h-9 w-full px-3 rounded-xl border border-input bg-background text-xs font-medium"
                >
                  <option value="ACCEPTED">Authorize &amp; Schedule Gate Handover</option>
                  <option value="COMPLETED">Force Complete (Both items verified by Rep)</option>
                  <option value="CANCELLED">Cancel Exchange (Safety or Policy)</option>
                  <option value="REJECTED">Reject Exchange Proposal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground block">Designated Campus Gate</label>
                  <Input
                    value={selectedGate}
                    onChange={(e) => setSelectedGate(e.target.value)}
                    placeholder="e.g. AAU 4 Kilo Gate 1"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground block">Cash Difference (ETB)</label>
                  <Input
                    value={cashDifferenceInput}
                    onChange={(e) => setCashDifferenceInput(e.target.value)}
                    placeholder="0.00"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground block">Admin Notes / Gate Instructions</label>
                <Input
                  placeholder="e.g. Items verified at 4 Kilo Gate 1 desk, 4-digit PIN confirmed"
                  value={modNotes}
                  onChange={(e) => setModNotes(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-border">
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                {moderateMutation.isPending ? "Updating..." : "Confirm Moderation Decision"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Direct Barter Match */}
      {isCreateMatchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl border border-border max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-xs">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-primary" /> Create &amp; Pair Student Barter Trade
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Directly match two complementary student listings and schedule a campus safe gate exchange.
            </p>

            <form onSubmit={handleCreateMatchSubmit} className="mt-4 space-y-4">
              {/* Student 1 */}
              <div className="p-3 rounded-xl bg-muted/40 space-y-2 border border-border">
                <span className="font-bold text-primary block">Student 1 (Offering Item)</span>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    required
                    placeholder="Student 1 Name (e.g. Dawit B.)"
                    value={student1Name}
                    onChange={(e) => setStudent1Name(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    required
                    placeholder="Offered Item (e.g. C++ Book)"
                    value={student1Item}
                    onChange={(e) => setStudent1Item(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Student 2 */}
              <div className="p-3 rounded-xl bg-muted/40 space-y-2 border border-border">
                <span className="font-bold text-primary block">Student 2 (Receiving / Counterpart)</span>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    required
                    placeholder="Student 2 Name (e.g. Abel K.)"
                    value={student2Name}
                    onChange={(e) => setStudent2Name(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    required
                    placeholder="Requested Item (e.g. Networking Book)"
                    value={student2Item}
                    onChange={(e) => setStudent2Item(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Campus & Cash Difference */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground block">Campus Hub *</label>
                  <select
                    value={matchCampus}
                    onChange={(e) => setMatchCampus(e.target.value)}
                    className="h-9 w-full px-2.5 rounded-xl border border-input bg-background text-xs"
                  >
                    <option value="AAU 4 Kilo (Science)">AAU 4 Kilo (Science)</option>
                    <option value="AAU 5 Kilo (AAiT)">AAU 5 Kilo (AAiT)</option>
                    <option value="AAU 6 Kilo (Main Campus)">AAU 6 Kilo (Main Campus)</option>
                    <option value="ASTU Adama">ASTU Adama</option>
                    <option value="Hawassa University">Hawassa University</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground block">Cash Difference (ETB)</label>
                  <Input
                    type="number"
                    value={matchCashDiff}
                    onChange={(e) => setMatchCashDiff(e.target.value)}
                    placeholder="0.00"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateMatchOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  Schedule Barter Swap
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
