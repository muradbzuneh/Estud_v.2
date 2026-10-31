import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";
import {
  products,
  productImages,
  productAttributes,
  listingSubmissions,
  valuations,
  listingApprovals,
  educationalMaterials,
  eq,
  and,
  desc,
  sql,
} from "@estud/db";
import { TRPCError } from "@trpc/server";

export const productsRouter = router({
  /**
   * Public marketplace catalog browsing with filters
   */
  list: publicProcedure
    .input(
      z.object({
        categoryId: z.string().uuid().optional(),
        institutionId: z.string().uuid().optional(),
        campusId: z.string().uuid().optional(),
        condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]).optional(),
        isExchangeEligible: z.boolean().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(products.status, "APPROVED")];

      if (input.categoryId) {
        conditions.push(eq(products.categoryId, input.categoryId));
      }
      if (input.institutionId) {
        conditions.push(eq(products.institutionId, input.institutionId));
      }
      if (input.campusId) {
        conditions.push(eq(products.campusId, input.campusId));
      }
      if (input.condition) {
        conditions.push(eq(products.condition, input.condition));
      }
      if (input.isExchangeEligible !== undefined) {
        conditions.push(eq(products.isExchangeEligible, input.isExchangeEligible));
      }

      const items = await ctx.db.query.products.findMany({
        where: and(...conditions),
        limit: input.limit,
        offset: input.cursor,
        orderBy: [desc(products.createdAt)],
        with: {
          images: true,
          category: true,
          institution: true,
          campus: true,
        },
      });

      return {
        items,
        nextCursor: items.length === input.limit ? input.cursor + input.limit : null,
      };
    }),

  /**
   * Public Product Details
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.id),
        with: {
          images: true,
          attributes: true,
          category: true,
          location: true,
          institution: true,
          campus: true,
          educationalMaterial: true,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      return product;
    }),

  /**
   * Seller submits product for valuation (SRS FR-VAL-01)
   */
  submitListing: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        categoryId: z.string().uuid(),
        condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]),
        proposedPrice: z.number().positive(),
        isExchangeEligible: z.boolean().default(false),
        isEducationalMaterial: z.boolean().default(false),
        locationId: z.string().uuid().optional(),
        institutionId: z.string().uuid().optional(),
        campusId: z.string().uuid().optional(),
        images: z.array(z.string().url()).min(1),
        attributes: z
          .array(z.object({ name: z.string(), value: z.string() }))
          .optional(),
        educationalDetails: z
          .object({
            materialTitle: z.string(),
            author: z.string().optional(),
            edition: z.string().optional(),
            fieldOfStudy: z.string().optional(),
            academicLevel: z.string().optional(),
            isbn: z.string().optional(),
            ownershipEvidenceUrl: z.string().url().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Create product in PENDING_VALUATION state
      const [newProduct] = await ctx.db
        .insert(products)
        .values({
          sellerId: ctx.user.id,
          categoryId: input.categoryId,
          title: input.title,
          description: input.description,
          condition: input.condition,
          proposedPrice: input.proposedPrice.toFixed(2),
          isExchangeEligible: input.isExchangeEligible,
          isEducationalMaterial: input.isEducationalMaterial,
          status: "PENDING_VALUATION",
          locationId: input.locationId,
          institutionId: input.institutionId,
          campusId: input.campusId,
        })
        .returning();

      // 2. Attach images
      if (input.images.length > 0) {
        await ctx.db.insert(productImages).values(
          input.images.map((url, index) => ({
            productId: newProduct.id,
            imageUrl: url,
            isPrimary: index === 0,
            displayOrder: index,
          }))
        );
      }

      // 3. Attach specifications/attributes
      if (input.attributes && input.attributes.length > 0) {
        await ctx.db.insert(productAttributes).values(
          input.attributes.map((attr) => ({
            productId: newProduct.id,
            name: attr.name,
            value: attr.value,
          }))
        );
      }

      // 4. Attach educational material details if applicable
      if (input.isEducationalMaterial && input.educationalDetails) {
        await ctx.db.insert(educationalMaterials).values({
          productId: newProduct.id,
          materialTitle: input.educationalDetails.materialTitle,
          author: input.educationalDetails.author,
          edition: input.educationalDetails.edition,
          fieldOfStudy: input.educationalDetails.fieldOfStudy,
          academicLevel: input.educationalDetails.academicLevel,
          isbn: input.educationalDetails.isbn,
          ownershipEvidenceUrl: input.educationalDetails.ownershipEvidenceUrl,
        });
      }

      // 5. Create listing submission record
      await ctx.db.insert(listingSubmissions).values({
        productId: newProduct.id,
        submittedByUserId: ctx.user.id,
        status: "PENDING",
      });

      return newProduct;
    }),

  /**
   * Admin sets approved item value and calculates 5% commission (SRS FR-VAL-03, FR-VAL-04)
   * Formula:
   * approvedValue = ETB X
   * commissionAmount = approvedValue * 0.05 (5%)
   * finalPrice = approvedValue + commissionAmount
   */
  adminValuate: adminProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        approvedValue: z.number().positive(),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      }

      const commissionRate = 0.05; // 5%
      const commissionAmount = Number((input.approvedValue * commissionRate).toFixed(2));
      const finalPrice = Number((input.approvedValue + commissionAmount).toFixed(2));

      // 1. Create valuation record
      const [valuation] = await ctx.db
        .insert(valuations)
        .values({
          productId: product.id,
          adminId: ctx.user.id,
          proposedPrice: product.proposedPrice,
          approvedValue: input.approvedValue.toFixed(2),
          commissionRate: "0.0500",
          commissionAmount: commissionAmount.toFixed(2),
          finalPrice: finalPrice.toFixed(2),
          adminNotes: input.adminNotes,
        })
        .returning();

      // 2. Update product valuation details
      await ctx.db
        .update(products)
        .set({
          approvedItemValue: input.approvedValue.toFixed(2),
          commissionAmount: commissionAmount.toFixed(2),
          publishedPrice: finalPrice.toFixed(2),
          status: "VALUED",
        })
        .where(eq(products.id, product.id));

      return valuation;
    }),

  /**
   * Admin publishes approved listing (SRS FR-VAL-07)
   */
  adminApproveListing: adminProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        feedbackMessage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(products)
        .set({ status: "APPROVED" })
        .where(eq(products.id, input.productId));

      await ctx.db.insert(listingApprovals).values({
        productId: input.productId,
        adminId: ctx.user.id,
        status: "APPROVED",
        feedbackMessage: input.feedbackMessage,
      });

      return { success: true };
    }),
});
