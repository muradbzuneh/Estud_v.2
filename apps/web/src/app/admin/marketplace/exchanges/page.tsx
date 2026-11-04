"use client";

import * as React from "react";
import { ArrowLeftRight, Search, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockExchanges = [
  {
    id: "exc-01",
    exchangeNumber: "EST-EXC-2026-0012",
    proposer: "Dawit Bekele (AAU)",
    offeredItem: "Data Structures in C++ (Horowitz)",
    targetUser: "Abel Kassa (AAU)",
    requestedItem: "Computer Networking (Tanenbaum)",
    status: "ACCEPTED",
    date: "Today, 11:20 AM",
  },
  {
    id: "exc-02",
    exchangeNumber: "EST-EXC-2026-0011",
    proposer: "Sara Yohannes (ASTU)",
    offeredItem: "Casio FX-991EX ClassWiz",
    targetUser: "Hana Mengistu (ASTU)",
    requestedItem: "Digital Multimeter + Probe Kit",
    status: "PROPOSED",
    date: "Yesterday, 4:15 PM",
  },
];

export default function AdminExchangesPage() {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Marketplace</span>
          <span>/</span>
          <span className="text-foreground font-medium">Exchanges</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ArrowLeftRight className="w-7 h-7 text-primary" />
          Direct Student Item Exchanges & Barter
        </h1>
        <p className="text-sm text-muted-foreground">
          Moderation queue for direct peer-to-peer equipment and textbook trades.
        </p>
      </div>

      <Card className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exchange ID</TableHead>
              <TableHead>Proposer & Offered Item</TableHead>
              <TableHead>Recipient & Requested Item</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockExchanges.map((exc) => (
              <TableRow key={exc.id}>
                <TableCell className="font-mono text-xs font-bold">{exc.exchangeNumber}</TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{exc.offeredItem}</div>
                  <div className="text-xs text-muted-foreground">{exc.proposer}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{exc.requestedItem}</div>
                  <div className="text-xs text-muted-foreground">{exc.targetUser}</div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-200">
                    {exc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{exc.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
