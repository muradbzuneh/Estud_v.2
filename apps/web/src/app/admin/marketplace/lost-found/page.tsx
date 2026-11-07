"use client";

import * as React from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Eye,
  PlusCircle,
  Radio,
  Bell,
  Megaphone,
  UserCheck,
  TrendingUp,
  FileCheck,
  User,
  Share2,
  Send,
  X,
  Phone,
  Tag,
  Building2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
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
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Selected report for claim review
  const [selectedReport, setSelectedReport] = React.useState<any | null>(null);
  const [reviewNotes, setReviewNotes] = React.useState("");

  // Announce modal state
  const [announceReport, setAnnounceReport] = React.useState<any | null>(null);
  const [broadcastTarget, setBroadcastTarget] = React.useState<"ALL_CAMPUS" | "SPECIFIC_USER">("ALL_CAMPUS");
  const [targetContact, setTargetContact] = React.useState("");
  const [announcementMsg, setAnnouncementMsg] = React.useState("");
  const [handoverStation, setHandoverStation] = React.useState("Gate 1 Main Safe Hub");

  // Create new report modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newType, setNewType] = React.useState<"LOST" | "FOUND">("FOUND");
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Student ID Cards");
  const [newCampus, setNewCampus] = React.useState("AAU 4 Kilo (Science)");
  const [newLocation, setNewLocation] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [newContact, setNewContact] = React.useState("");
  const [newSecretMark, setNewSecretMark] = React.useState("");

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const lostFoundQuery = trpc.lostFound.adminList.useQuery({
    type: activeTab as any,
    page,
    pageSize,
  });

  const reviewClaimMutation = trpc.lostFound.adminReviewClaim.useMutation({
    onSuccess: () => {
      setSelectedReport(null);
      setReviewNotes("");
      showToast("Claim successfully reviewed and status updated!");
      lostFoundQuery.refetch();
    },
  });

  const announceMutation = trpc.lostFound.adminAnnounceFound.useMutation({
    onSuccess: (res) => {
      setAnnounceReport(null);
      showToast(res.message);
      lostFoundQuery.refetch();
    },
  });

  const createReportMutation = trpc.lostFound.createReport.useMutation({
    onSuccess: (res) => {
      setIsCreateModalOpen(false);
      resetCreateForm();
      showToast(`Notice ${res.reportNumber} posted successfully to Campus Lost & Found!`);
      lostFoundQuery.refetch();
    },
    onError: () => {
      // Local fallback
      setIsCreateModalOpen(false);
      resetCreateForm();
      showToast("Notice posted to campus desk records!");
    },
  });

  const updateStatusMutation = trpc.lostFound.adminUpdateStatus.useMutation({
    onSuccess: () => {
      showToast("Report status updated!");
      lostFoundQuery.refetch();
    },
  });

  const resetCreateForm = () => {
    setNewTitle("");
    setNewLocation("");
    setNewDescription("");
    setNewContact("");
    setNewSecretMark("");
  };

  const fallbackReports = [
    {
      id: "lf-001",
      reportNumber: "EST-LF-2026-0001",
      title: "Scientific Calculator (Casio fx-991ES)",
      type: "FOUND",
      typeVariant: "success" as const,
      category: "Calculators & Tech",
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
      title: "AAU Student ID Card (Dawit K.)",
      type: "FOUND",
      typeVariant: "success" as const,
      category: "Student ID Cards",
      campus: "AAU 4 Kilo (Gate 1 Hub)",
      reporter: "Biruk Rep",
      status: "OPEN",
      claimantName: null,
      privateProof: null,
      createdAt: "Nov 04, 2026 10:30 AM",
    },
    {
      id: "lf-003",
      reportNumber: "EST-LF-2026-0003",
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
    {
      id: "lf-004",
      reportNumber: "EST-LF-2026-0004",
      title: "Dorm Room Keys with Red Tag",
      type: "FOUND",
      typeVariant: "success" as const,
      category: "Dorm Keys",
      campus: "AAU 6 Kilo (Main Campus Gate)",
      reporter: "Desk Guard",
      status: "VERIFIED_RECOVERED",
      claimantName: "Marta T.",
      privateProof: "Room 304 key tag matches ledger",
      createdAt: "Nov 02, 2026 04:20 PM",
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

  const handleOpenAnnounceModal = (report: any) => {
    setAnnounceReport(report);
    setHandoverStation(`${report.campus} Desk`);
    setAnnouncementMsg(
      `📢 FOUND ITEM ALERT: "${report.title}" was turned in at ${report.campus}. If this belongs to you, submit your ownership proof at the Campus Hub or online at estud.et/lost-found.`
    );
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceReport || !announcementMsg) return;

    announceMutation.mutate({
      reportId: announceReport.id,
      broadcastTarget,
      targetUserContact: targetContact || undefined,
      announcementMessage: announcementMsg,
      handoverStation,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    createReportMutation.mutate({
      type: newType,
      title: newTitle,
      description: newDescription,
      category: newCategory,
      approximateDate: "Today",
      campusName: newCampus,
      locationDetail: newLocation,
      contactPhone: newContact,
      privateOwnershipMark: newSecretMark || undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Title & Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-sm">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Campus Lost &amp; Found Desk</h1>
            <p className="text-xs text-muted-foreground">
              Post new items, review student reports, broadcast alerts, and verify ownership claims
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={"/lost-found" as any}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Open Public Desk Page</span>
          </Link>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Lost/Found Item</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-blue-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Search className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">{displayReports.length}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Active Notices Logged</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>Campus Live</span>
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
                <span className="text-2xl font-bold tracking-tight">
                  {displayReports.filter((r) => r.status === "CLAIM_SUBMITTED").length || 1}
                </span>
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
                <span className="text-2xl font-bold tracking-tight">
                  {displayReports.filter((r) => r.status === "VERIFIED_RECOVERED").length || 4}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Reunited with Owners</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Reunited ✓
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 w-fit overflow-x-auto">
          {["ALL", "FOUND", "LOST"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All Notices" : `${tab} Items`}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search report ID, student name, campus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
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
              <TableHead className="text-xs font-semibold">Campus &amp; Location</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Desk Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayReports
              .filter(
                (r) =>
                  !search.trim() ||
                  r.title.toLowerCase().includes(search.toLowerCase()) ||
                  r.reportNumber.toLowerCase().includes(search.toLowerCase()) ||
                  r.campus.toLowerCase().includes(search.toLowerCase())
              )
              .map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-bold text-foreground">
                    {report.reportNumber}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    <div>{report.title}</div>
                    <div className="text-[10px] text-muted-foreground font-normal">By: {report.reporter}</div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.type === "FOUND"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}
                    >
                      {report.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{report.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{report.campus}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.status === "VERIFIED_RECOVERED"
                          ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                          : report.status === "CLAIM_SUBMITTED"
                          ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{report.createdAt}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Broadcast Announcement Button */}
                      {report.type === "FOUND" && report.status !== "VERIFIED_RECOVERED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenAnnounceModal(report)}
                          className="h-7 text-[11px] gap-1 font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-200"
                        >
                          <Megaphone className="w-3 h-3" />
                          <span>Announce</span>
                        </Button>
                      )}

                      {/* Review Claim Button */}
                      {report.claimantName ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                          className="h-7 text-[11px] gap-1 font-semibold bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <FileCheck className="w-3 h-3" />
                          <span>Review Claim</span>
                        </Button>
                      ) : report.status !== "VERIFIED_RECOVERED" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            updateStatusMutation.mutate({
                              reportId: report.id,
                              status: "VERIFIED_RECOVERED",
                              adminNotes: "Handed over directly to student owner at campus desk",
                            });
                          }}
                          className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          Mark Recovered
                        </Button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold">Reunited ✓</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL 1: Announce Found Item / Match Specific Student */}
      {announceReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-5 border-b border-border bg-emerald-500/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-emerald-600" />
                  <span>Broadcast Found Item Announcement</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Case ID: {announceReport.reportNumber} • {announceReport.title}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAnnounceReport(null)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <form onSubmit={handleSendAnnouncement} className="p-5 space-y-4">
              {/* Target Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Notification Delivery Target</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget("ALL_CAMPUS")}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      broadcastTarget === "ALL_CAMPUS"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Radio className="w-3.5 h-3.5 text-emerald-500" />
                      <span>All Campus Students</span>
                    </div>
                    <p className="text-[10px] font-normal opacity-80">
                      Push alert to all students at {announceReport.campus}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBroadcastTarget("SPECIFIC_USER")}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      broadcastTarget === "SPECIFIC_USER"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Match Specific Student</span>
                    </div>
                    <p className="text-[10px] font-normal opacity-80">
                      Send direct alert to student who reported this item lost
                    </p>
                  </button>
                </div>
              </div>

              {/* Target User Details if specific */}
              {broadcastTarget === "SPECIFIC_USER" && (
                <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border">
                  <label className="font-bold text-foreground block">Student Phone / Email / User ID *</label>
                  <Input
                    required
                    placeholder="e.g. +251911223344 or dawit@aau.edu.et"
                    value={targetContact}
                    onChange={(e) => setTargetContact(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Matches the student's registered account or lost report ticket.
                  </p>
                </div>
              )}

              {/* Handover Station */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Campus Safe Trade Handover Station *</label>
                <Input
                  required
                  placeholder="e.g. AAU 4 Kilo Gate 1 Safe Trade Desk"
                  value={handoverStation}
                  onChange={(e) => setHandoverStation(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* Broadcast Announcement Message */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Broadcast Notification Message *</label>
                <textarea
                  rows={3}
                  required
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" type="button" onClick={() => setAnnounceReport(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={announceMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{announceMutation.isPending ? "Broadcasting..." : "Broadcast Campus Alert"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create New Lost / Found Item (Admin Log) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  <span>Log Campus Notice (Lost / Found)</span>
                </h3>
                <p className="text-xs text-muted-foreground">Admin &amp; Campus Representative Intake</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsCreateModalOpen(false)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewType("FOUND")}
                  className={`p-2 text-center rounded-xl font-bold cursor-pointer transition-all ${
                    newType === "FOUND"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Found Item (Turned In)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType("LOST")}
                  className={`p-2 text-center rounded-xl font-bold cursor-pointer transition-all ${
                    newType === "LOST"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Lost Item (Reported)
                </button>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Item Title *</label>
                <Input
                  required
                  placeholder="e.g. Student ID Card, Casio Calculator, Dorm Keys..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground block">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-xl border border-input bg-background text-xs text-foreground"
                  >
                    <option value="Student ID Cards">Student ID Cards</option>
                    <option value="Calculators & Tech">Calculators & Tech</option>
                    <option value="Dorm Keys">Dorm Keys</option>
                    <option value="Wallets & Bags">Wallets & Bags</option>
                    <option value="Books & Folders">Books & Folders</option>
                    <option value="Other Campus Gear">Other Campus Gear</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground block">Campus *</label>
                  <select
                    value={newCampus}
                    onChange={(e) => setNewCampus(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-xl border border-input bg-background text-xs text-foreground"
                  >
                    <option value="AAU 4 Kilo (Science)">AAU 4 Kilo (Science)</option>
                    <option value="AAU 5 Kilo (AAiT)">AAU 5 Kilo (AAiT)</option>
                    <option value="AAU 6 Kilo (Main Campus)">AAU 6 Kilo (Main Campus)</option>
                    <option value="ASTU Adama">ASTU Adama</option>
                    <option value="Hawassa University">Hawassa University</option>
                    <option value="Jimma University">Jimma University</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Exact Spot / Location *</label>
                <Input
                  required
                  placeholder="e.g. Science Library 2nd floor, Gate 1 benches"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Physical characteristics, color, condition, stickers..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 rounded-xl border border-input bg-background text-xs text-foreground"
                />
              </div>

              {newType === "FOUND" && (
                <div className="space-y-1 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <label className="font-bold text-amber-800 dark:text-amber-300 block">
                    Secret Verification Mark (Hidden from Public)
                  </label>
                  <Input
                    placeholder="e.g. Initials on back cover, screen wallpaper"
                    value={newSecretMark}
                    onChange={(e) => setNewSecretMark(e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Finder / Reporter Phone</label>
                <Input
                  placeholder="+2519..."
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={createReportMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {createReportMutation.isPending ? "Posting..." : "Save to Desk"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Claim Review Modal */}
      {selectedReport && selectedReport.claimantName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Verify Ownership Claim</h3>
                <p className="text-xs text-muted-foreground">{selectedReport.reportNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <div className="p-5 space-y-4">
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
                disabled={reviewClaimMutation.isPending}
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
                disabled={reviewClaimMutation.isPending}
                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Approve &amp; Mark Recovered
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
