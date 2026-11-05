"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, Loader2 } from "lucide-react";
import { EstudLogo } from "@/components/estud-logo";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useSession } from "@/lib/auth-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { data: session, isPending } = useSession();

  // Auto-close sidebar on route change on mobile
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Handle loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400 mb-3" />
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          Verifying administrative credentials...
        </p>
      </div>
    );
  }

  // Check admin role or superadmin email
  const isAdmin =
    session?.user &&
    ((session.user as any).role === "admin" ||
      session.user.email === "murad@gmail.com" ||
      session.user.email === "admin@estud.et");

  if (!session?.user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-red-500/30 p-8 text-center shadow-2xl space-y-5">
          <div className="flex justify-center mb-1">
            <EstudLogo size={36} showText={true} />
          </div>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Administrator Access Restricted
            </h1>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              This portal is strictly reserved for verified Estud university and escrow operations staff. Your current account does not have administrative privileges.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              href={`/auth?callbackUrl=${encodeURIComponent(pathname)}&adminRequired=true`}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold px-4 py-3 text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Lock className="h-4 w-4" /> Sign In with Admin Account
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-medium px-4 py-3 text-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Campus Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar with mobile drawer state */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
