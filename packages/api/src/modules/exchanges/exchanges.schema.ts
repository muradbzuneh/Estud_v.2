import { z } from "zod";

export const proposeExchangeSchema = z.object({
  offeredProductId: z.string().uuid(),
  requestedProductId: z.string().uuid(),
});

export const respondExchangeSchema = z.object({
  exchangeId: z.string().uuid(),
  accept: z.boolean(),
});
