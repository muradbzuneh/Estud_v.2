"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Layers,
  ShoppingBag,
  ArrowLeftRight,
  Search,
  BookOpen,
  CreditCard,
  Wallet,
  Truck,
  ShieldAlert,
  Building2,
  Bell,
  LineChart,
  Lock,
  Settings,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { EstudLogo } from "@/components/estud-logo";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Analytics & Reports", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Marketplace Moderation",
    items: [
      { title: "Listings & Valuation", href: "/admin/marketplace/listings", icon: Package },
      { title: "Categories Taxonomy", href: "/admin/marketplace/categories", icon: Layers },
      { title: "Orders & Escrow", href: "/admin/marketplace/orders", icon: ShoppingBag },
      { title: "Barter Exchanges", href: "/admin/marketplace/exchanges", icon: ArrowLeftRight },
      { title: "Lost & Found Desk", href: "/admin/marketplace/lost-found", icon: Search },
      { title: "Educational Materials", href: "/admin/marketplace/educational", icon: BookOpen },
    ],
  },
  {
    title: "Escrow & Logistics",
    items: [
      { title: "Payment Verification", href: "/admin/operations/payments", icon: CreditCard },
      { title: "Financial Payouts", href: "/admin/operations/finance", icon: Wallet },
      { title: "Delivery & Handover", href: "/admin/operations/delivery", icon: Truck },
      { title: "Disputes & Refunds", href: "/admin/operations/disputes", icon: ShieldAlert },
      { title: "Campus Hubs & Map", href: "/admin/operations/campuses", icon: Building2 },
    ],
  },
  {
    title: "System & Governance",
    items: [
      { title: "Broadcast Alerts", href: "/admin/system/notifications", icon: Bell },
      { title: "Roles & Users", href: "/admin/system/roles", icon: Lock },
      { title: "Platform Settings", href: "/admin/system/settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 shrink-0 border-r border-border bg-card/95 backdrop-blur-md flex flex-col justify-between h-screen fixed md:sticky top-0 z-50 md:z-auto transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header with Official Estud Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <EstudLogo size={28} showText={true} />
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
            >
              ✕
            </button>
          )}
        </div>

        {/* Admin Switcher Card */}
        <div className="p-4">
          <div className="p-3 rounded-xl border border-border bg-background/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-tight">Admin Portal</span>
                <span className="text-[10px] text-muted-foreground">Super Admin</span>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 text-xs">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <h4 className="px-2 font-medium text-muted-foreground/70 uppercase tracking-wider text-[10px]">
                {section.title}
              </h4>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href as any}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        isActive &&
                          "bg-primary/10 text-primary font-semibold hover:bg-primary/15 hover:text-primary shadow-2xs"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-xs">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom System Status */}
        <div className="p-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Online</span>
          </div>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
