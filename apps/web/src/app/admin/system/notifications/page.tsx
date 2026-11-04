"use client";

import * as React from "react";
import { Bell, Send, Users, Building2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminNotificationsPage() {
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sentSuccess, setSentSuccess] = React.useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setTitle("");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Communication & System</span>
          <span>/</span>
          <span className="text-foreground font-medium">Broadcast Notifications</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Bell className="w-7 h-7 text-primary" />
          Campus Push & In-App Announcements
        </h1>
        <p className="text-sm text-muted-foreground">
          Send urgent marketplace alerts, policy notices, and handover updates to registered students and campus reps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border border-border">
          <CardHeader>
            <CardTitle className="text-base font-bold">Compose Broadcast</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              {sentSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Broadcast alert sent successfully to active students and campus reps!</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Notification Title</label>
                <Input
                  placeholder="e.g. AAU 4 Kilo Campus Gate Handover Center Maintenance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Target Audience</label>
                <select className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm font-medium">
                  <option>All Universities & Campuses (Ethiopia Nationwide)</option>
                  <option>Addis Ababa University (AAU) Only</option>
                  <option>Adama Science and Technology University (ASTU) Only</option>
                  <option>Hawassa University (HU) Only</option>
                  <option>Verified Campus Representatives Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Message Body</label>
                <textarea
                  rows={4}
                  placeholder="Type your message content here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full p-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Button type="submit" className="gap-2">
                <Send className="w-4 h-4" /> Send Announcement
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Active Audience Reach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">AAU Registered Students:</span>
                <span className="font-bold">284</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ASTU Registered Students:</span>
                <span className="font-bold">142</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">HU Registered Students:</span>
                <span className="font-bold">86</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Campus Representatives:</span>
                <span className="font-bold text-primary">14 reps</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
