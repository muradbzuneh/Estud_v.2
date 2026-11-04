import { z } from "zod";

export const assignRepSchema = z.object({
  deliveryId: z.string().uuid(),
  agentId: z.string(),
  instructions: z.string().optional(),
});

export const updateProgressSchema = z.object({
  deliveryId: z.string().uuid(),
  status: z.enum([
    "PICKED_UP",
    "IN_TRANSIT",
    "READY_FOR_PICKUP",
    "FAILED",
  ]),
  notes: z.string().optional(),
  failureReason: z.string().optional(),
});

export const confirmHandoverSchema = z.object({
  deliveryId: z.string().uuid(),
  handoverPin: z.string().length(4, "Enter 4-digit PIN"),
});

export const deliveryStatuses = [
  "SCHEDULED",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "FAILED",
  "RETURNED",
] as const;

export const adminListDeliveriesFilterSchema = z.object({
  status: z.enum(["ALL", ...deliveryStatuses]).default("ALL"),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

