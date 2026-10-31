import { auditLogs, type EstudDatabase } from "@estud/db";

export interface LogAuditOptions {
  db: EstudDatabase;
  actorId?: string;
  action: string;
  targetType: "product" | "order" | "payment" | "payout" | "dispute" | "user";
  targetId: string;
  metadata?: Record<string, unknown>;
}

export async function recordAuditLog(options: LogAuditOptions) {
  try {
    await options.db.insert(auditLogs).values({
      actorId: options.actorId,
      action: options.action,
      targetType: options.targetType,
      targetId: options.targetId,
      metadata: options.metadata,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
