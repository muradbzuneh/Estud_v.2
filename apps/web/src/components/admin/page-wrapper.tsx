"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminPageWrapperProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AdminPageWrapper({
  title,
  subtitle,
  icon: Icon,
  badge,
  breadcrumbs,
  actions,
  children,
  className = "",
}: AdminPageWrapperProps) {
  return (
    <div className={`space-y-6 max-w-7xl mx-auto ${className}`}>
      {/* Top Bar: Title, Icon, Breadcrumbs, Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-2 border-b border-border/40">
        <div className="space-y-1.5">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href="/admin"
              className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>

            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${crumb.label}-${idx}`}>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href as any}
                      className="hover:text-foreground transition-colors font-medium"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "font-semibold text-foreground" : "font-medium"}>
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Heading & Badge */}
          <div className="flex items-center gap-3 pt-1">
            {Icon && (
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
                {badge && (
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider py-0.5 border-primary/30 text-primary bg-primary/5">
                    {badge}
                  </Badge>
                )}
              </div>
              {subtitle && (
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Slot */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2 md:self-end">
            {actions}
          </div>
        )}
      </div>

      {/* Main Page Content */}
      {children}
    </div>
  );
}
