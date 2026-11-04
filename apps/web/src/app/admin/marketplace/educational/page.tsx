"use client";

import * as React from "react";
import { BookOpen, Search, Download, CheckCircle2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockMaterials = [
  {
    id: "mat-01",
    title: "Applied Mathematics III Lecture Notes & Past Exams",
    courseCode: "MATH-2091",
    institution: "AAiT - Addis Ababa University",
    department: "Electrical & Computer Engineering",
    uploader: "Yared Wolde",
    downloads: 342,
    fileSize: "14.2 MB PDF",
    status: "APPROVED",
  },
  {
    id: "mat-02",
    title: "Thermodynamics Lab Report & Formula Sheet",
    courseCode: "ME-2102",
    institution: "ASTU",
    department: "Mechanical Engineering",
    uploader: "Sara Yohannes",
    downloads: 189,
    fileSize: "6.8 MB PDF",
    status: "APPROVED",
  },
];

export default function AdminEducationalPage() {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Marketplace</span>
          <span>/</span>
          <span className="text-foreground font-medium">Educational Materials</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-primary" />
          University Courseware & Academic Resources
        </h1>
        <p className="text-sm text-muted-foreground">
          Review, approve, and organize verified university lecture notes, lab manuals, and exam packs.
        </p>
      </div>

      <Card className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource Title</TableHead>
              <TableHead>Course Code & Dept</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Uploader</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMaterials.map((mat) => (
              <TableRow key={mat.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{mat.title}</div>
                      <div className="text-xs text-muted-foreground">{mat.fileSize}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-mono font-bold">{mat.courseCode}</div>
                  <div className="text-xs text-muted-foreground">{mat.department}</div>
                </TableCell>
                <TableCell className="text-xs">{mat.institution}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{mat.uploader}</TableCell>
                <TableCell className="text-xs font-semibold">{mat.downloads}</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-200">
                    {mat.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
