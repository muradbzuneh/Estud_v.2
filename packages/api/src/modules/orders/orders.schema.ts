import { z } from "zod";

export const createPurchaseRequestSchema = z.object({
  productId: z.string().uuid(),
  deliveryFee: z.number().default(0),
});

export const sellerRespondOrderSchema = z.object({
  orderId: z.string().uuid(),
  accept: z.boolean(),
  rejectionReason: z.string().optional(),
});
