"use client";

import * as React from "react";
import {
  Building2,
  MapPin,
  Plus,
  Building,
  GraduationCap,
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
import { CampusMapModal } from "@/components/campus-map-modal";

export default function AdminCampusesPage() {
  const [isAddInstOpen, setIsAddInstOpen] = React.useState(false);
  const [isAddCampusOpen, setIsAddCampusOpen] = React.useState(false);
  const [mapModalHub, setMapModalHub] = React.useState<string | null>(null);

  // Institution form
  const [instName, setInstName] = React.useState("");
  const [shortCode, setShortCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [region, setRegion] = React.useState("");

  // Campus form
  const [selectedInstId, setSelectedInstId] = React.useState("");
  const [campusName, setCampusName] = React.useState("");
  const [details, setDetails] = React.useState("");

  const institutionsQuery = trpc.auth.listInstitutions.useQuery();

  const createInstMutation = trpc.auth.adminCreateInstitution.useMutation({
    onSuccess: () => {
      setIsAddInstOpen(false);
      setInstName("");
      setShortCode("");
      setCity("");
      setRegion("");
      institutionsQuery.refetch();
    },
  });

  const createCampusMutation = trpc.auth.adminCreateCampus.useMutation({
    onSuccess: () => {
      setIsAddCampusOpen(false);
      setCampusName("");
      setDetails("");
      institutionsQuery.refetch();
    },
  });

  const fallbackInstitutions = [
    {
      id: "inst-01",
      name: "Addis Ababa University",
      shortCode: "AAU",
      city: "Addis Ababa",
      region: "Addis Ababa",
      campuses: [
        { id: "c-01", name: "4 Kilo Science Campus", details: "Gate 1 & Gate 2" },
        { id: "c-02", name: "5 Kilo (AAiT)", details: "Engineering Gate" },
        { id: "c-03", name: "6 Kilo Main Campus", details: "Kennedy Library" },
        { id: "c-04", name: "Tikur Anbessa (Health)", details: "Medical School" },
      ],
    },
    {
      id: "inst-02",
      name: "Adama Science and Technology University",
      shortCode: "ASTU",
      city: "Adama",
      region: "Oromia",
      campuses: [
        { id: "c-05", name: "Main Campus", details: "Student Center" },
      ],
    },
    {
      id: "inst-03",
      name: "Hawassa University",
      shortCode: "HU",
      city: "Hawassa",
      region: "Sidama",
      campuses: [
        { id: "c-06", name: "Main Campus", details: "Gate 1" },
        { id: "c-07", name: "IoT Campus", details: "Tech Gate" },
      ],
    },
  ];

  const displayInstitutions =
    institutionsQuery.data && institutionsQuery.data.length > 0
      ? institutionsQuery.data
      : fallbackInstitutions;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">University & Campus Agencies</h1>
            <p className="text-xs text-muted-foreground">
              Configure higher education institutions, designated pickup gates, and campus rep delivery hubs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setMapModalHub("aau-4kilo")}
            className="h-9 gap-1.5 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10 shadow-xs"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span>Campus Google Map</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              if (displayInstitutions.length > 0) {
                setSelectedInstId(displayInstitutions[0].id);
              }
              setIsAddCampusOpen(true);
            }}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Add Campus / Gate</span>
          </Button>

          <Button
            onClick={() => setIsAddInstOpen(true)}
            className="h-9 gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add University</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">{displayInstitutions.length}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Universities & Colleges</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
              Ethiopia Wide
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">18</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Designated Delivery Hubs</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>Campus Gates</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Building className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">34</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium pl-10">Active Student Reps</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              On-Site Agents
            </span>
          </CardContent>
        </Card>
      </div>

      {/* University Directory Table */}
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Institution Name</TableHead>
              <TableHead className="text-xs font-semibold">Short Code</TableHead>
              <TableHead className="text-xs font-semibold">City / Region</TableHead>
              <TableHead className="text-xs font-semibold">Campuses & Gates</TableHead>
              <TableHead className="text-xs font-semibold text-right pr-6">Hub Map & Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayInstitutions.map((inst) => (
              <TableRow key={inst.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {inst.shortCode}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{inst.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-primary">
                  {inst.shortCode}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {inst.city}, {inst.region || "Ethiopia"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {inst.campuses?.map((c: any) => (
                      <Badge key={c.id} variant="outline" className="text-[10px]">
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMapModalHub(inst.shortCode)}
                      className="h-7 text-xs gap-1 font-semibold text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>Live Map</span>
                    </Button>
                    <Badge variant="success" className="text-[10px]">
                      Operational
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal: Add University */}
      {isAddInstOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Add Institution</h3>
                <p className="text-xs text-muted-foreground">Register new higher education institution</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAddInstOpen(false)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground block">Full University Name</label>
                <Input
                  placeholder="e.g. Jimma University"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground block">Short Code</label>
                  <Input
                    placeholder="e.g. JU"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                    className="h-9 text-xs font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground block">City</label>
                  <Input
                    placeholder="e.g. Jimma"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground block">Region</label>
                <Input
                  placeholder="e.g. Oromia"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setIsAddInstOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  createInstMutation.mutate({
                    name: instName,
                    shortCode,
                    city,
                    region,
                  });
                }}
                disabled={createInstMutation.isLoading || !instName || !shortCode}
                className="font-semibold"
              >
                Save Institution
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Campus Gate */}
      {isAddCampusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Add Campus Delivery Hub</h3>
                <p className="text-xs text-muted-foreground">Register designated campus gate or dropoff hub</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAddCampusOpen(false)} className="h-8 w-8">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground block">Select University</label>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
                >
                  {displayInstitutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.shortCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground block">Campus / Hub Name</label>
                <Input
                  placeholder="e.g. 5 Kilo (AAiT Gate 2)"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground block">Handover Details / Gate Description</label>
                <Input
                  placeholder="e.g. In front of Student Union cafeteria..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setIsAddCampusOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  createCampusMutation.mutate({
                    institutionId: selectedInstId,
                    name: campusName,
                    details,
                  });
                }}
                disabled={createCampusMutation.isLoading || !campusName}
                className="font-semibold"
              >
                Save Campus Gate
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Interactive Google Map Modal */}
      {mapModalHub && (
        <CampusMapModal
          isOpen={!!mapModalHub}
          onClose={() => setMapModalHub(null)}
          initialCampusId={mapModalHub}
        />
      )}
    </div>
  );
}
