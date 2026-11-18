"use client";

import * as React from "react";
import { CheckCircle2, Clock, Loader2, XCircle, AlertCircle, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

export type SystemStatus =
  | "IN_PROCESS"
  | "IN_REVIEW"
  | "PENDING"
  | "PENDING_VALUATION"
  | "SUBMITTED"
  | "PAYMENT_SUBMITTED"
  | "CLAIM_SUBMITTED"
  | "IN_DELIVERY"
  | "DONE"
  | "APPROVED"
  | "VERIFIED"
  | "COMPLETED"
  | "DELIVERED"
  | "VERIFIED_RECOVERED"
  | "REJECTED"
  | "CANCELLED"
  | "DISPUTED"
  | "OPEN"
  | "REQUESTED"
  | string;

interface StatusBadgeProps {
  status: SystemStatus;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

/**
 * Clean Shadcn-Style Status Badge matching ui.shadcn.com/blocks
 * Uses minimal icons with clean human-readable text labels instead of bulky custom pills.
 */
export function StatusBadge({ status, label, className, showIcon = true }: StatusBadgeProps) {
  const norm = String(status || "").toUpperCase();

  // 1. Success / Done / Verified / Approved
  if (
    norm === "DONE" ||
    norm === "APPROVED" ||
    norm === "VERIFIED" ||
    norm === "COMPLETED" ||
    norm === "DELIVERED" ||
    norm === "VERIFIED_RECOVERED"
  ) {
    const text = label || (norm === "VERIFIED" ? "Verified" : norm === "VERIFIED_RECOVERED" ? "Reunited" : "Done");
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400",
          className
        )}
      >
        {showIcon && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
        <span>{text}</span>
      </span>
    );
  }

  // 2. In Process / In Review / Pending Review / Submitted
  if (
    norm === "IN_PROCESS" ||
    norm === "IN_REVIEW" ||
    norm === "PENDING" ||
    norm === "PENDING_VALUATION" ||
    norm === "SUBMITTED" ||
    norm === "PAYMENT_SUBMITTED" ||
    norm === "CLAIM_SUBMITTED" ||
    norm === "IN_DELIVERY"
  ) {
    const text =
      label ||
      (norm === "SUBMITTED" || norm === "PAYMENT_SUBMITTED"
        ? "Pending Check"
        : norm === "CLAIM_SUBMITTED"
        ? "Claim In Review"
        : "In Process");
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400",
          className
        )}
      >
        {showIcon && <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
        <span>{text}</span>
      </span>
    );
  }

  // 3. Rejected / Cancelled / Disputed
  if (norm === "REJECTED" || norm === "CANCELLED" || norm === "DISPUTED") {
    const text = label || (norm === "REJECTED" ? "Declined" : norm === "DISPUTED" ? "Disputed" : "Cancelled");
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400",
          className
        )}
      >
        {showIcon && <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
        <span>{text}</span>
      </span>
    );
  }

  // 4. Open / Available at Hub / Requested
  const text = label || (norm === "OPEN" ? "Available at Desk" : norm === "REQUESTED" ? "Requested" : status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300",
        className
      )}
    >
      {showIcon && <CircleDot className="h-3 w-3 text-brand-500 shrink-0" />}
      <span>{text}</span>
    </span>
  );
}

/**
 * Section Type Tag matching ui.shadcn.com/blocks
 * Clean, subtle pill tag for item category or section type
 */
export function SectionTypeTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border/50",
        className
      )}
    >
      {children}
    </span>
  );
}
