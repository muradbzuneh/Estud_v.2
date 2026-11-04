"use client";

import * as React from "react";
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  GraduationCap,
  Download,
  Eye,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/trpc/client";

export default function AdminEducationalPage() {
  const [fieldFilter, setFieldFilter] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  // Moderation state
  const [selectedMaterial, setSelectedMaterial] = React.useState<any | null>(null);
  const [actionDecision, setActionDecision] = React.useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reason, setReason] = React.useState("");

  const materialsQuery = trpc.products.adminListEducationalMaterials.useQuery({
    fieldOfStudy: fieldFilter !== "ALL" ? fieldFilter : undefined,
    search: search || undefined,
    page,
    pageSize: 10,
  });

  const moderateMutation = trpc.products.adminModerateEducationalMaterial.useMutation({
    onSuccess: () => {
      setSelectedMaterial(null);
      setReason("");
      materialsQuery.refetch();
    },
  });

  const fallbackMaterials = [
    {
      id: "mat-01",
      materialTitle: "Applied Mathematics III Lecture Notes & Past Exams",
      author: "Dr. Kassa & ECE Dept",
      edition: "2025 Edition",
      fieldOfStudy: "Engineering",
      academicLevel: "2nd Year",
      isbn: "MATH-AAU-2091",
      createdAt: new Date().toISOString(),
      product: {
        id: "p-edu-01",
        price: "150.00",
        status: "APPROVED",
        seller: {
          name: "Yared Wolde",
          profile: {
            institution: { shortCode: "AAU", name: "Addis Ababa University" },
            campus: { name: "5 Kilo (AAiT)" },
          },
        },
      },
    },
    {
      id: "mat-02",
      materialTitle: "Thermodynamics & Heat Transfer Lab Manual",
      author: "Mechanical Eng Dept",
      edition: "Rev 4",
      fieldOfStudy: "Engineering",
      academicLevel: "3rd Year",
      isbn: "ME-ASTU-3102",
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      product: {
        id: "p-edu-02",
        price: "200.00",
        status: "APPROVED",
        seller: {
          name: "Sara Yohannes",
          profile: {
            institution: { shortCode: "ASTU", name: "Adama Science & Tech University" },
            campus: { name: "Main Campus" },
          },
        },
      },
    },
    {
      id: "mat-03",
      materialTitle: "Clinical Pharmacology High-Yield Summary",
      author: "Tikur Anbessa Medical Staff",
      edition: "2026",
      fieldOfStudy: "Medicine",
      academicLevel: "4th Year",
      isbn: "MED-AAU-4001",
      createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
      product: {
        id: "p-edu-03",
        price: "350.00",
        status: "PENDING_VALUATION",
        seller: {
          name: "Bethlehem Haile",
          profile: {
            institution: { shortCode: "AAU", name: "Addis Ababa University" },
            campus: { name: "Tikur Anbessa Health" },
          },
        },
      },
    },
  ];

  const materialList =
    materialsQuery.data?.items && materialsQuery.data.items.length > 0
      ? materialsQuery.data.items
      : fallbackMaterials;

  const totalMaterials = materialsQuery.data?.total ?? fallbackMaterials.length;

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Marketplace</span>
          <span>/</span>
          <span className="text-foreground font-medium">Educational Materials</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-primary" />
          University Courseware & Academic Resources
        </h1>
        <p className="text-sm text-muted-foreground">
          Review, approve, and moderate verified university lecture notes, lab manuals, and exam packs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search materials by title or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ALL">All Fields of Study</option>
                <option value="Engineering">Engineering & Technology</option>
                <option value="Medicine">Medicine & Health Sciences</option>
                <option value="Business">Business & Economics</option>
                <option value="Law">Law & Governance</option>
                <option value="Natural Sciences">Natural & Computational Sciences</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground self-center">
            Showing {materialList.length} of {totalMaterials} academic materials
          </p>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card className="border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[320px]">Resource Title & Details</TableHead>
              <TableHead>Field & Level</TableHead>
              <TableHead>Institution & Campus</TableHead>
              <TableHead>Contributor / Uploader</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materialList.map((mat: any) => (
              <TableRow key={mat.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {mat.materialTitle}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Author: {mat.author || "Faculty"} · {mat.edition || "General"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-semibold text-foreground">{mat.fieldOfStudy || "General"}</div>
                  <div className="text-[11px] text-muted-foreground">{mat.academicLevel || "All Years"}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-foreground">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{mat.product?.seller?.profile?.institution?.shortCode || "AAU"}</span>
                    <span className="text-muted-foreground text-[11px]">
                      ({mat.product?.seller?.profile?.campus?.name || "Campus"})
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  <div className="font-medium text-foreground">{mat.product?.seller?.name || "Student"}</div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-bold text-foreground">
                    ETB {parseFloat(mat.product?.price || "0").toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  {mat.product?.status === "APPROVED" ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-200">
                      Approved
                    </Badge>
                  ) : mat.product?.status === "REJECTED" ? (
                    <Badge className="bg-rose-500/10 text-rose-600 border border-rose-200">
                      Rejected
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-600 border border-amber-200">
                      Pending Review
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMaterial(mat);
                      setActionDecision(mat.product?.status === "APPROVED" ? "REJECTED" : "APPROVED");
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
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Moderate Educational Resource
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {selectedMaterial.materialTitle}
            </p>

            <div className="mt-4 p-3 rounded-lg bg-muted/40 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Field of Study:</span>
                <span className="font-semibold text-foreground">{selectedMaterial.fieldOfStudy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level / Target:</span>
                <span className="font-semibold text-foreground">{selectedMaterial.academicLevel}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-bold text-foreground">ETB {selectedMaterial.product?.price}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Moderation Decision</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActionDecision("APPROVED")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      actionDecision === "APPROVED"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Check className="w-4 h-4" /> Approve Listing
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionDecision("REJECTED")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      actionDecision === "REJECTED"
                        ? "border-rose-500 bg-rose-500/10 text-rose-600"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <X className="w-4 h-4" /> Reject Listing
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Audit Reason / Moderator Notes</label>
                <Input
                  placeholder="e.g. Verified syllabus and university copyright policy"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMaterial(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant={actionDecision === "APPROVED" ? "default" : "destructive"}
                disabled={moderateMutation.isPending}
                onClick={() => {
                  moderateMutation.mutate({
                    materialId: selectedMaterial.id,
                    status: actionDecision,
                    notes: reason || undefined,
                  });
                }}
              >
                {moderateMutation.isPending ? "Updating..." : `Confirm ${actionDecision}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
