"use client";

import * as React from "react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  CreditCard,
  Building2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Sparkles,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const channelData = [
  { channel: "Telebirr", volume: 88500, count: 184 },
  { channel: "CBE Birr", volume: 38200, count: 82 },
  { channel: "CBE Transfer", volume: 16400, count: 28 },
  { channel: "BOA (Bank of Abyssinia)", volume: 5150, count: 11 },
];

const campusBreakdown = [
  { campus: "AAU 4 Kilo", orders: 112, gmv: 52000 },
  { campus: "AAU 5 Kilo (AAiT)", orders: 94, gmv: 44000 },
  { campus: "AAU 6 Kilo", orders: 68, gmv: 28000 },
  { campus: "ASTU Main", orders: 48, gmv: 18500 },
  { campus: "HU Main", orders: 20, gmv: 5750 },
];

const weeklyEscrow = [
  { day: "Mon", held: 24500, released: 18200 },
  { day: "Tue", held: 28900, released: 21400 },
  { day: "Wed", held: 35200, released: 26800 },
  { day: "Thu", held: 41000, released: 33100 },
  { day: "Fri", held: 48600, released: 39500 },
  { day: "Sat", held: 54100, released: 47200 },
  { day: "Sun", held: 51200, released: 49800 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Portal</span>
            <span>/</span>
            <span className="text-foreground font-medium">Advanced Analytics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            Marketplace Reports & Financial Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Multi-campus transaction performance, payment gateway share, and escrow liquidity insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button size="sm" className="gap-2">
            <Calendar className="w-4 h-4" /> This Semester
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Average Order Value (AOV)</p>
            <h3 className="text-2xl font-bold mt-1">ETB 1,840.00</h3>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +12.3% semester-over-semester
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Escrow Settlement Rate</p>
            <h3 className="text-2xl font-bold mt-1">98.6%</h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> &lt; 1.4% dispute rate
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Average Delivery Handover</p>
            <h3 className="text-2xl font-bold mt-1">3.2 Hours</h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-500" /> On-campus rep exchange
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Active Escrow Balance</p>
            <h3 className="text-2xl font-bold mt-1 text-purple-600">ETB 51,200.00</h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> Guaranteed until buyer PIN confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Channel Breakdown */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Ethiopian Payment Channel Share (ETB)
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Processed volume across Telebirr, CBE Birr, and Bank Transfers
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                  <XAxis dataKey="channel" stroke="currentColor" className="text-muted-foreground text-xs" />
                  <YAxis stroke="currentColor" className="text-muted-foreground text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #334155",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [`ETB ${Number(val).toLocaleString()}`, "Volume"]}
                  />
                  <Bar dataKey="volume" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Campus Order Volume */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" /> Multi-Campus Trading Volume (ETB)
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Gross merchandise value settled across university campuses
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campusBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-border/40" />
                  <XAxis type="number" stroke="currentColor" className="text-muted-foreground text-xs" />
                  <YAxis type="category" dataKey="campus" stroke="currentColor" className="text-muted-foreground text-xs" width={110} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #334155",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [`ETB ${Number(val).toLocaleString()}`, "Volume"]}
                  />
                  <Bar dataKey="gmv" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow Liquidity Chart */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Escrow Balance & Weekly Seller Payout Velocity
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Funds held securely in Estud platform accounts vs. disbursed to sellers upon delivery confirmation
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyEscrow}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                <XAxis dataKey="day" stroke="currentColor" className="text-muted-foreground text-xs" />
                <YAxis stroke="currentColor" className="text-muted-foreground text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`ETB ${Number(val).toLocaleString()}`]}
                />
                <Line type="monotone" dataKey="held" name="Escrow Funds Held" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="released" name="Released to Sellers" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
