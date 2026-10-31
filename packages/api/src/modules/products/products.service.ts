import { TRPCError } from "@trpc/server";
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
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type {
  listProductsFilterSchema,
  submitListingSchema,
  adminValuationSchema,
  adminApproveSchema,
} from "./products.schema";

export class ProductsService {
  constructor(private db: EstudDatabase) {}

  async list(input: z.infer<typeof listProductsFilterSchema>) {
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

    const items = await this.db.query.products.findMany({
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
  }

  async getById(id: string) {
    const product = await this.db.query.products.findFirst({
      where: eq(products.id, id),
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
      throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
    }

    return product;
  }

  async submitListing(sellerId: string, input: z.infer<typeof submitListingSchema>) {
    const [newProduct] = await this.db
      .insert(products)
      .values({
        sellerId,
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

    if (input.images.length > 0) {
      await this.db.insert(productImages).values(
        input.images.map((url, index) => ({
          productId: newProduct.id,
          imageUrl: url,
          isPrimary: index === 0,
          displayOrder: index,
        }))
      );
    }

    if (input.attributes && input.attributes.length > 0) {
      await this.db.insert(productAttributes).values(
        input.attributes.map((attr) => ({
          productId: newProduct.id,
          name: attr.name,
          value: attr.value,
        }))
      );
    }

    if (input.isEducationalMaterial && input.educationalDetails) {
      await this.db.insert(educationalMaterials).values({
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

    await this.db.insert(listingSubmissions).values({
      productId: newProduct.id,
      submittedByUserId: sellerId,
      status: "PENDING",
    });

    await recordAuditLog({
      db: this.db,
      actorId: sellerId,
      action: "LISTING_SUBMITTED",
      targetType: "product",
      targetId: newProduct.id,
      metadata: { proposedPrice: input.proposedPrice },
    });

    return newProduct;
  }

  /**
   * Admin establishes valuation & calculates 5% Estud commission (SRS FR-VAL-03, 5.2)
   */
  async adminValuate(adminId: string, input: z.infer<typeof adminValuationSchema>) {
    const product = await this.db.query.products.findFirst({
      where: eq(products.id, input.productId),
    });

    if (!product) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
    }

    const commissionRate = 0.05; // 5%
    const commissionAmount = Number((input.approvedValue * commissionRate).toFixed(2));
    const finalPrice = Number((input.approvedValue + commissionAmount).toFixed(2));

    const [valuation] = await this.db
      .insert(valuations)
      .values({
        productId: product.id,
        adminId,
        proposedPrice: product.proposedPrice,
        approvedValue: input.approvedValue.toFixed(2),
        commissionRate: "0.0500",
        commissionAmount: commissionAmount.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
        adminNotes: input.adminNotes,
      })
      .returning();

    await this.db
      .update(products)
      .set({
        approvedItemValue: input.approvedValue.toFixed(2),
        commissionAmount: commissionAmount.toFixed(2),
        publishedPrice: finalPrice.toFixed(2),
        status: "VALUED",
      })
      .where(eq(products.id, product.id));

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: "PRODUCT_VALUED",
      targetType: "product",
      targetId: product.id,
      metadata: { approvedValue: input.approvedValue, commissionAmount, finalPrice },
    });

    return valuation;
  }

  async adminApprove(adminId: string, input: z.infer<typeof adminApproveSchema>) {
    await this.db
      .update(products)
      .set({ status: "APPROVED" })
      .where(eq(products.id, input.productId));

    await this.db.insert(listingApprovals).values({
      productId: input.productId,
      adminId,
      status: "APPROVED",
      feedbackMessage: input.feedbackMessage,
    });

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: "LISTING_APPROVED",
      targetType: "product",
      targetId: input.productId,
    });

    return { success: true };
  }
}
