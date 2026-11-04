"use client";

import * as React from "react";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
  Search as SearchIcon,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Building2,
  Lock,
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

type UserRole = "student" | "campus_rep" | "admin" | "guest";

export default function AdminRolesPage() {
  const [roleFilter, setRoleFilter] = React.useState<"ALL" | UserRole>("ALL");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  // Modal states
  const [roleModalUser, setRoleModalUser] = React.useState<any | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("student");

  const [statusModalUser, setStatusModalUser] = React.useState<any | null>(null);
  const [suspendReason, setSuspendReason] = React.useState("");

  const usersQuery = trpc.auth.adminListUsers.useQuery({
    role: roleFilter,
    search: search || undefined,
    page,
    pageSize: 10,
  });

  const updateRoleMutation = trpc.auth.adminUpdateUserRole.useMutation({
    onSuccess: () => {
      setRoleModalUser(null);
      usersQuery.refetch();
    },
  });

  const toggleActiveMutation = trpc.auth.adminToggleUserActive.useMutation({
    onSuccess: () => {
      setStatusModalUser(null);
      setSuspendReason("");
      usersQuery.refetch();
    },
  });

  const fallbackUsers = [
    {
      id: "u-01",
      name: "Murad SuperAdmin",
      email: "murad@gmail.com",
      phoneNumber: "+251911223344",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      profile: {
        institution: { name: "Addis Ababa University", shortCode: "AAU" },
        campus: { name: "6 Kilo Main Campus" },
      },
    },
    {
      id: "u-02",
      name: "Abel Kassa",
      email: "abel.kassa@astu.edu.et",
      phoneNumber: "+251922334455",
      role: "campus_rep",
      isActive: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      profile: {
        institution: { name: "Adama Science and Technology University", shortCode: "ASTU" },
        campus: { name: "Main Campus" },
      },
    },
    {
      id: "u-03",
      name: "Hana Mengistu",
      email: "hana.m@aau.edu.et",
      phoneNumber: "+251933445566",
      role: "student",
      isActive: true,
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      profile: {
        institution: { name: "Addis Ababa University", shortCode: "AAU" },
        campus: { name: "4 Kilo Science Campus" },
      },
    },
    {
      id: "u-04",
      name: "Yared Wolde",
      email: "yared.w@gmail.com",
      phoneNumber: "+251944556677",
      role: "student",
      isActive: false,
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      profile: {
        institution: { name: "Hawassa University", shortCode: "HU" },
        campus: { name: "Main Campus" },
      },
    },
  ];

  const userList = (usersQuery.data?.items && usersQuery.data.items.length > 0)
    ? usersQuery.data.items
    : fallbackUsers;

  const totalUsers = usersQuery.data?.total ?? fallbackUsers.length;
  const adminCount = userList.filter((u: any) => u.role === "admin").length;
  const repCount = userList.filter((u: any) => u.role === "campus_rep").length;
  const inactiveCount = userList.filter((u: any) => !u.isActive).length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-500/10 text-red-600 border border-red-200 dark:border-red-900 gap-1 font-semibold">
            <Lock className="w-3 h-3" /> Admin
          </Badge>
        );
      case "campus_rep":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border border-purple-200 dark:border-purple-900 gap-1 font-semibold">
            <ShieldCheck className="w-3 h-3" /> Campus Rep
          </Badge>
        );
      case "student":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-900 gap-1 font-semibold">
            <GraduationCap className="w-3 h-3" /> Student
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Roles & Permissions Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Supervise user accounts, grant campus representative or admin roles, and enforce account suspensions.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs hover:border-primary/50 transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Registered</p>
              <h3 className="text-2xl font-bold mt-0.5">{totalUsers}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Students & staff</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-primary/50 transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Campus Reps</p>
              <h3 className="text-2xl font-bold mt-0.5">{repCount}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Handover agents</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-primary/50 transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System Admins</p>
              <h3 className="text-2xl font-bold mt-0.5">{adminCount}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Full access</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-primary/50 transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suspended</p>
              <h3 className="text-2xl font-bold mt-0.5">{inactiveCount}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Under moderation</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ALL">All Roles</option>
                <option value="student">Student</option>
                <option value="campus_rep">Campus Rep</option>
                <option value="admin">System Admin</option>
                <option value="guest">Guest</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground self-center">
            Showing {userList.length} of {totalUsers} users
          </p>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">User</TableHead>
              <TableHead>Contact & Phone</TableHead>
              <TableHead>Institution & Campus</TableHead>
              <TableHead>Assigned Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user: any) => (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 uppercase">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-mono text-foreground">
                    {user.phoneNumber || "No phone linked"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      {user.profile?.institution?.name || "Unassigned"}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {user.profile?.campus?.name || "No campus set"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  {user.isActive ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900 gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900 gap-1">
                      <XCircle className="w-3 h-3" /> Suspended
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRoleModalUser(user);
                        setSelectedRole(user.role);
                      }}
                      className="text-xs h-8"
                    >
                      Change Role
                    </Button>
                    <Button
                      variant={user.isActive ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => setStatusModalUser(user)}
                      className="text-xs h-8"
                    >
                      {user.isActive ? "Suspend" : "Activate"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Role Change Modal */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Change Role for {roleModalUser.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Select the new authorization role for this user account.
            </p>

            <div className="mt-5 space-y-3">
              <label className="text-xs font-semibold text-muted-foreground">Select New Role</label>
              <div className="space-y-2">
                {[
                  { id: "student", label: "Student", desc: "Standard marketplace buyer & seller privileges" },
                  { id: "campus_rep", label: "Campus Representative", desc: "Can verify deliveries, process handovers, and hold escrow items" },
                  { id: "admin", label: "System Admin", desc: "Full administrative, financial, and moderating privileges" },
                ].map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedRole === r.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.id}
                      checked={selectedRole === r.id}
                      onChange={() => setSelectedRole(r.id as UserRole)}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoleModalUser(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={updateRoleMutation.isPending}
                onClick={() => {
                  updateRoleMutation.mutate({
                    userId: roleModalUser.id,
                    role: selectedRole,
                  });
                }}
              >
                {updateRoleMutation.isPending ? "Updating..." : "Save Role"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Account Activation/Suspension Modal */}
      {statusModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              {statusModalUser.isActive ? (
                <>
                  <UserX className="w-5 h-5 text-destructive" /> Suspend Account
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5 text-emerald-600" /> Reactivate Account
                </>
              )}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {statusModalUser.isActive
                ? `Are you sure you want to suspend ${statusModalUser.name}? They will lose access to buying, selling, and logging in.`
                : `Reactivate ${statusModalUser.name}'s account and restore marketplace privileges.`}
            </p>

            {statusModalUser.isActive && (
              <div className="mt-4 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Reason for Suspension (Audit Log)</label>
                <Input
                  placeholder="e.g. Fraudulent behavior, dispute violation, policy breach"
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusModalUser(null);
                  setSuspendReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant={statusModalUser.isActive ? "destructive" : "default"}
                size="sm"
                disabled={toggleActiveMutation.isPending}
                onClick={() => {
                  toggleActiveMutation.mutate({
                    userId: statusModalUser.id,
                    isActive: !statusModalUser.isActive,
                    reason: suspendReason || undefined,
                  });
                }}
              >
                {toggleActiveMutation.isPending
                  ? "Processing..."
                  : statusModalUser.isActive
                  ? "Confirm Suspension"
                  : "Confirm Reactivation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
