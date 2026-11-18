"use client";

import * as React from "react";
import { Bell, Send, Users, Building2, CheckCircle2, Clock, AlertTriangle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/trpc/client";

export default function AdminNotificationsPage() {
  const [title, setTitle] = React.useState("");
  const [targetAudience, setTargetAudience] = React.useState("All Universities & Campuses (Ethiopia Nationwide)");
  const [priority, setPriority] = React.useState<"UPDATE" | "URGENT" | "NORMAL">("UPDATE");
  const [message, setMessage] = React.useState("");
  const [sentSuccess, setSentSuccess] = React.useState(false);

  // tRPC query and mutation
  const broadcastsQuery = trpc.broadcasts.listLive.useQuery();
  const createBroadcastMutation = trpc.broadcasts.create.useMutation({
    onSuccess: () => {
      setSentSuccess(true);
      setTitle("");
      setMessage("");
      broadcastsQuery.refetch();
      setTimeout(() => setSentSuccess(false), 4000);
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    createBroadcastMutation.mutate({
      title: title.trim(),
      message: message.trim(),
      targetAudience,
      priority,
    });
  };

  const liveBroadcasts = broadcastsQuery.data || [];

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
          Send urgent marketplace alerts, policy notices, and handover updates to registered students and campus reps. Live syncs instantly to mobile apps.
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
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Broadcast alert published live! Mobile app students can now see this announcement in real-time.</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm font-medium"
                  >
                    <option>All Universities & Campuses (Ethiopia Nationwide)</option>
                    <option>Addis Ababa University (AAU) Only</option>
                    <option>Adama Science and Technology University (ASTU) Only</option>
                    <option>Hawassa University (HU) Only</option>
                    <option>Verified Campus Representatives Only</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Priority / Type</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm font-medium"
                  >
                    <option value="UPDATE">Standard Campus Update</option>
                    <option value="URGENT">Urgent Hub / Escrow Alert</option>
                    <option value="NORMAL">General Marketplace Announcement</option>
                  </select>
                </div>
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

              <Button type="submit" disabled={createBroadcastMutation.isLoading} className="gap-2">
                <Send className="w-4 h-4" />
                {createBroadcastMutation.isLoading ? "Publishing Alert..." : "Send Announcement"}
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
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Mobile Devices Connected:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Sync Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Sent Broadcasts Feed */}
      <Card className="border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Active Campus Announcements (Live on Mobile & Web)
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Announcements broadcasted to mobile app users and campus web visitors
              </p>
            </div>
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary">
              {liveBroadcasts.length} Active Feeds
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {liveBroadcasts.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No campus broadcasts published yet.
            </div>
          ) : (
            <div className="space-y-3">
              {liveBroadcasts.map((bc) => (
                <div
                  key={bc.id}
                  className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-foreground">{bc.title}</span>
                      <Badge
                        variant="secondary"
                        className={
                          bc.priority === "URGENT"
                            ? "bg-rose-500/10 text-rose-600 text-[10px]"
                            : bc.priority === "UPDATE"
                            ? "bg-primary/10 text-primary text-[10px]"
                            : "bg-emerald-500/10 text-emerald-600 text-[10px]"
                        }
                      >
                        {bc.priority}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        Audience: {bc.targetAudience}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/85 leading-relaxed">{bc.message}</p>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-2 pt-1">
                      <span>By {bc.authorName}</span>
                      <span>•</span>
                      <span>{new Date(bc.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
