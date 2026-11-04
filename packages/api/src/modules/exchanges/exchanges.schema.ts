import { z } from "zod";

export const proposeExchangeSchema = z.object({
  offeredProductId: z.string().uuid(),
  requestedProductId: z.string().uuid(),
});

export const respondExchangeSchema = z.object({
  exchangeId: z.string().uuid(),
  accept: z.boolean(),
});

export const adminListExchangesFilterSchema = z.object({
  status: z.enum(["ALL", "PROPOSED", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"]).default("ALL"),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const adminModerateExchangeSchema = z.object({
  exchangeId: z.string().uuid(),
  status: z.enum(["PROPOSED", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
});
