import { z } from "zod";
import { router, protectedProcedure } from "../../core/trpc";
import { generateUploadSignature } from "../../core/cloudinary";

export const uploadRouter = router({
  /**
   * Generates a signed upload ticket for direct browser or mobile image upload
   */
  getSignature: protectedProcedure
    .input(
      z.object({
        folder: z.enum(["products", "evidence", "avatars", "lost-found"]).default("products"),
      })
    )
    .query(({ input }) => {
      return generateUploadSignature(input.folder);
    }),
});
