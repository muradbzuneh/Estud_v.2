"use client";

import * as React from "react";
import { Settings, Save, CheckCircle2, Shield, Percent, Clock, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = React.useState("5.0");
  const [escrowTimeout, setEscrowTimeout] = React.useState("48");
  const [telebirrAccount, setTelebirrAccount] = React.useState("+251911002233 (Estud Escrow)");
  const [cbeAccount, setCbeAccount] = React.useState("1000234567891 (Estud Marketplace)");
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Communication & System</span>
          <span>/</span>
          <span className="text-foreground font-medium">Global Settings</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-7 h-7 text-primary" />
          System & Financial Configuration
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform commission rates, escrow holding rules, and merchant account receiving details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-200 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Platform settings saved successfully! Changes take effect immediately.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Percent className="w-4 h-4 text-primary" /> Marketplace Commission
              </CardTitle>
              <CardDescription className="text-xs">
                Base fee applied upon buyer order calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Estud Fee (%)</label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Default standard is 5.0% added on top of the seller ask price.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Handover Escrow Window (Hours)</label>
                <Input
                  type="number"
                  value={escrowTimeout}
                  onChange={(e) => setEscrowTimeout(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Time window before buyer must confirm delivery or raise a dispute.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Platform Receiving Accounts
              </CardTitle>
              <CardDescription className="text-xs">
                Official accounts where buyers send payments for Telebirr and CBE
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Telebirr Merchant / Phone</label>
                <Input
                  value={telebirrAccount}
                  onChange={(e) => setTelebirrAccount(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Commercial Bank of Ethiopia (CBE) Account</label>
                <Input
                  value={cbeAccount}
                  onChange={(e) => setCbeAccount(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" /> Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
