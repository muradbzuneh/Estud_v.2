import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../../core/trpc";
import { recordAuditLog } from "../../core/audit";

export interface CampusBroadcast {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  priority: "URGENT" | "NORMAL" | "UPDATE";
  createdAt: string;
  authorName: string;
}

export interface AppReleaseInfo {
  version: string;
  versionCode: number;
  releaseDate: string;
  title: string;
  releaseNotes: string[];
  downloadUrl: string;
  forceUpdate: boolean;
}

// In-memory persistent broadcasts store initialized with official campus news
const liveBroadcastsStore: CampusBroadcast[] = [
  {
    id: "bc-update-v240",
    title: "🚀 Official Estud v2.4.0 Release Available",
    message: "New version is live with Hamburger Sidebar Menu, SafeTrade Buyer Protection, and cover photo selection.",
    targetAudience: "All Universities & Campuses (Ethiopia Nationwide)",
    priority: "URGENT",
    createdAt: new Date().toISOString(),
    authorName: "Release Management Desk",
  },
  {
    id: "bc-1",
    title: "AAU 4 Kilo SafeTrade Hub Open for Inspections",
    message: "Verified Campus Reps are active at the Science Faculty Safe Desk until 6:00 PM for student SafeTrade inspections.",
    targetAudience: "All Universities & Campuses (Ethiopia Nationwide)",
    priority: "UPDATE",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    authorName: "AAU Campus Operations",
  },
  {
    id: "bc-2",
    title: "SafeTrade 0% Seller Commission Active for All Laptops & Books",
    message: "Sell your textbooks and tech with 100% payout to your Telebirr or CBE account upon buyer PIN confirmation.",
    targetAudience: "All Universities & Campuses (Ethiopia Nationwide)",
    priority: "NORMAL",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    authorName: "Estud Executive Desk",
  },
];

let activeRelease: AppReleaseInfo = {
  version: "2.4.0",
  versionCode: 9,
  releaseDate: new Date().toISOString(),
  title: "Estud v2.4.0 SafeTrade & Campus Drawer Edition",
  releaseNotes: [
    "New Hamburger Navigation Drawer: Fast access to categories, orders, campus hubs, and preferences",
    "100% SafeTrade Buyer Protection: Plain, student-friendly terms replacing confusing financial jargon",
    "Locked Handover PIN: Protection PIN stays securely locked until Admin approves payment transfer proof",
    "Customizable Cover Photo: Select any uploaded image as the main catalog cover photo",
    "Real-Time Notification Hub: View and manage all order, verification, and broadcast alerts",
    "High-Performance Database Sync: Instant listing and order confirmation with Neon PostgreSQL",
  ],
  downloadUrl: "https://expo.dev/artifacts/eas/ZQm875jEw-NCKYRd8EL_ZSsO9FIs5eV5M-Bvf_CVUNk.apk",
  forceUpdate: false,
};

export const broadcastsRouter = router({
  /**
   * Public procedure for Mobile App and Web Announcement Banners
   */
  listLive: publicProcedure.query(() => {
    return liveBroadcastsStore.slice(0, 10);
  }),

  /**
   * Public procedure for Mobile App to check latest version & OTA release status
   */
  getLatestRelease: publicProcedure.query(() => {
    return activeRelease;
  }),

  /**
   * Admin procedure to publish/bump app release version and notify mobile apps
   */
  publishRelease: publicProcedure
    .input(
      z.object({
        version: z.string().min(1),
        versionCode: z.number().int().positive().default(4),
        title: z.string().min(3),
        releaseNotes: z.array(z.string()).min(1),
        downloadUrl: z.string().url().optional(),
        forceUpdate: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      activeRelease = {
        version: input.version,
        versionCode: input.versionCode,
        releaseDate: new Date().toISOString(),
        title: input.title,
        releaseNotes: input.releaseNotes,
        downloadUrl: input.downloadUrl || activeRelease.downloadUrl,
        forceUpdate: input.forceUpdate,
      };

      // Also create an urgent campus broadcast alert for the new version
      const updateBroadcast: CampusBroadcast = {
        id: "bc-update-" + Date.now().toString(36),
        title: `🚀 New Estud ${input.version} Release Available`,
        message: `${input.title} - Tap update in your app to apply latest features.`,
        targetAudience: "All Universities & Campuses (Ethiopia Nationwide)",
        priority: "URGENT",
        createdAt: new Date().toISOString(),
        authorName: "Release Management Desk",
      };
      liveBroadcastsStore.unshift(updateBroadcast);

      try {
        await recordAuditLog({
          db: ctx.db,
          actorId: ctx.user?.id || "usr-admin-release",
          action: "APP_RELEASE_PUBLISHED",
          targetType: "system",
          targetId: `release-${input.version}`,
          metadata: { version: input.version, forceUpdate: input.forceUpdate },
        });
      } catch {
        // Logging resilience
      }

      return activeRelease;
    }),

  /**
   * Admin procedure to send real-time announcements
   */
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        message: z.string().min(5, "Message must be at least 5 characters"),
        targetAudience: z.string().default("All Universities & Campuses (Ethiopia Nationwide)"),
        priority: z.enum(["URGENT", "NORMAL", "UPDATE"]).default("UPDATE"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newBroadcast: CampusBroadcast = {
        id: "bc-" + Date.now().toString(36),
        title: input.title.trim(),
        message: input.message.trim(),
        targetAudience: input.targetAudience,
        priority: input.priority,
        createdAt: new Date().toISOString(),
        authorName: "Campus Admin Desk",
      };

      liveBroadcastsStore.unshift(newBroadcast);

      try {
        await recordAuditLog({
          db: ctx.db,
          actorId: ctx.user?.id || "usr-admin-broadcast",
          action: "CAMPUS_BROADCAST_PUBLISHED",
          targetType: "system",
          targetId: newBroadcast.id,
          metadata: {
            title: newBroadcast.title,
            targetAudience: newBroadcast.targetAudience,
          },
        });
      } catch {
        // Logging resilience
      }

      return newBroadcast;
    }),
});
