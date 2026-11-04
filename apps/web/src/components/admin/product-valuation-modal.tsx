"use client";

import * as React from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  MapPin,
  Calendar,
  Tag,
  DollarSign,
  Percent,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/trpc/client";

export interface ValuationModalProduct {
  id: string;
  title: string;
  code: string;
  category: { name: string; color?: string };
  seller: { name: string; handle: string };
  price: string;
  proposedPriceNum: number;
  status: string;
  statusVariant: "success" | "warning" | "neutral";
  posted: string;
  description?: string;
  condition?: string;
  isEducational?: boolean;
}

interface ProductValuationModalProps {
  product: ValuationModalProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductValuationModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: ProductValuationModalProps) {
  const [approvedValue, setApprovedValue] = React.useState<number>(0);
  const [adminNotes, setAdminNotes] = React.useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = React.useState<string>("");
  const [actionError, setActionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (product) {
      setApprovedValue(product.proposedPriceNum || 0);
      setAdminNotes("");
      setFeedbackMessage("");
      setActionError(null);
    }
  }, [product]);

  // Estud Standard Fee is 5%
  const commissionRate = 0.05;
  const commissionAmount = Number((approvedValue * commissionRate).toFixed(2));
  const finalPrice = Number((approvedValue + commissionAmount).toFixed(2));

  // tRPC Mutations
  const valuateMutation = trpc.products.adminValuate.useMutation();
  const approveMutation = trpc.products.adminApproveListing.useMutation();
  const updateStatusMutation = trpc.products.adminUpdateStatus.useMutation();

  if (!isOpen || !product) return null;

  const handleValuateAndApprove = async () => {
    try {
      setActionError(null);
      // 1. Establish Valuation
      await valuateMutation.mutateAsync({
        productId: product.id,
        approvedValue: approvedValue,
        adminNotes: adminNotes || undefined,
      });

      // 2. Approve listing for marketplace catalog
      await approveMutation.mutateAsync({
        productId: product.id,
        feedbackMessage: feedbackMessage || "Approved after valuation review",
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setActionError(err.message || "Failed to valuate and approve product");
    }
  };

  const handleReject = async () => {
    try {
      setActionError(null);
      await updateStatusMutation.mutateAsync({
        productId: product.id,
        status: "REJECTED",
        notes: adminNotes || "Listing does not comply with marketplace policy",
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setActionError(err.message || "Failed to reject listing");
    }
  };

  const isSubmitting =
    valuateMutation.isLoading ||
    approveMutation.isLoading ||
    updateStatusMutation.isLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Listing Valuation & Moderation
              </h2>
              <p className="text-xs text-muted-foreground">{product.code}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {actionError && (
            <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Product Overview Card */}
          <Card className="border-border/80 bg-background/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">
                      {product.category.name}
                    </Badge>
                    <Badge variant={product.statusVariant} className="text-[10px]">
                      {product.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">
                    Seller Proposed Price
                  </span>
                  <span className="text-base font-bold text-foreground">
                    {product.price}
                  </span>
                </div>
              </div>

              {/* Seller details */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-muted-foreground text-[11px]">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Seller: <strong className="text-foreground">{product.seller.name}</strong> ({product.seller.handle})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{product.posted}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Valuation Calculation Card */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
            <h4 className="font-semibold text-foreground text-xs flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Official Valuation Breakdown (ETB)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Approved Item Value
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    value={approvedValue}
                    onChange={(e) => setApprovedValue(Number(e.target.value))}
                    className="h-8 text-xs font-semibold pl-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Estud Fee (5%)
                </label>
                <div className="h-8 px-3 rounded-lg border border-border bg-background flex items-center font-semibold text-muted-foreground">
                  ETB {commissionAmount.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Published Buyer Price
                </label>
                <div className="h-8 px-3 rounded-lg border border-primary/40 bg-primary/10 flex items-center font-bold text-primary">
                  ETB {finalPrice.toLocaleString()}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              * The seller receives 100% of the <strong>Approved Item Value</strong> upon delivery confirmation. 
              The 5% platform service fee is added to calculate the total marketplace price.
            </p>
          </div>

          {/* Admin Decision Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Admin Audit Notes (Internal Only)
              </label>
              <Input
                placeholder="Reason for valuation adjustment, serial verification, etc."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Feedback for Student Seller (Optional)
              </label>
              <Input
                placeholder="Message sent to student regarding listing status..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            disabled={isSubmitting}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs gap-1.5"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject Listing</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleValuateAndApprove}
              disabled={isSubmitting || approvedValue <= 0}
              className="h-8 text-xs gap-1.5 font-semibold"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmitting ? "Processing..." : "Valuate & Approve"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
