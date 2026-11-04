import { TRPCError } from "@trpc/server";
import {
  products,
  productImages,
  productAttributes,
  listingSubmissions,
  valuations,
  listingApprovals,
  educationalMaterials,
  categories,
  orders,
  payments,
  users,
  transactionDisputes,
  deliveries,
  eq,
  and,
  or,
  ilike,
  desc,
  asc,
  sql,
  inArray,
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type {
  listProductsFilterSchema,
  submitListingSchema,
  adminValuationSchema,
  adminApproveSchema,
  adminListProductsFilterSchema,
  adminUpdateProductStatusSchema,
  adminBulkProductActionSchema,
  adminCreateCategorySchema,
  adminUpdateCategorySchema,
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

  /**
   * Admin: List products for Listings & Products dashboard view
   */
  async adminList(input: z.infer<typeof adminListProductsFilterSchema>) {
    const conditions = [];

    // Tab filter
    if (input.tab === "PENDING_REVIEW") {
      conditions.push(
        or(
          eq(products.status, "PENDING_VALUATION"),
          eq(products.status, "VALUED"),
          eq(products.status, "DRAFT")
        )
      );
    } else if (input.tab === "ARCHIVED") {
      conditions.push(or(eq(products.status, "ARCHIVED"), eq(products.status, "REJECTED")));
    } else if (input.tab === "PUBLISHED") {
      conditions.push(eq(products.status, "APPROVED"));
    }

    if (input.status) {
      conditions.push(eq(products.status, input.status));
    }
    if (input.categoryId) {
      conditions.push(eq(products.categoryId, input.categoryId));
    }
    if (input.condition) {
      conditions.push(eq(products.condition, input.condition));
    }
    if (input.search && input.search.trim().length > 0) {
      const q = `%${input.search.trim()}%`;
      conditions.push(or(ilike(products.title, q), ilike(products.description, q)));
    }

    let orderByClause = [desc(products.createdAt)];
    if (input.sortBy === "oldest") {
      orderByClause = [asc(products.createdAt)];
    } else if (input.sortBy === "price_asc") {
      orderByClause = [asc(products.proposedPrice)];
    } else if (input.sortBy === "price_desc") {
      orderByClause = [desc(products.proposedPrice)];
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (input.page - 1) * input.pageSize;

    const [items, totalResult] = await Promise.all([
      this.db.query.products.findMany({
        where: whereClause,
        limit: input.pageSize,
        offset,
        orderBy: orderByClause,
        with: {
          images: true,
          category: true,
          seller: {
            with: {
              profile: true,
            },
          },
          institution: true,
          campus: true,
        },
      }),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(whereClause),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return {
      items,
      total,
      page: input.page,
      pageSize: input.pageSize,
      totalPages: Math.ceil(total / input.pageSize),
    };
  }

  /**
   * Admin: Get metrics cards for Listings dashboard
   */
  async adminGetStats() {
    const [totalRes, publishedRes, pendingRes, removedRes] = await Promise.all([
      this.db.select({ count: sql<number>`count(*)::int` }).from(products),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(eq(products.status, "APPROVED")),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(
          or(
            eq(products.status, "PENDING_VALUATION"),
            eq(products.status, "VALUED"),
            eq(products.status, "DRAFT")
          )
        ),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(or(eq(products.status, "REJECTED"), eq(products.status, "ARCHIVED"))),
    ]);

    return {
      totalItems: totalRes[0]?.count ?? 0,
      publishedItems: publishedRes[0]?.count ?? 0,
      pendingReviewItems: pendingRes[0]?.count ?? 0,
      removedItems: removedRes[0]?.count ?? 0,
    };
  }

  /**
   * Admin: Get high-level overview metrics for main dashboard
   */
  async adminGetDashboardMetrics() {
    const [
      totalProductsRes,
      publishedProductsRes,
      pendingProductsRes,
      totalOrdersRes,
      deliveredOrdersRes,
      pendingPaymentsRes,
      pendingDeliveriesRes,
      openDisputesRes,
      totalUsersRes,
      recentOrders,
      recentListings,
    ] = await Promise.all([
      this.db.select({ count: sql<number>`count(*)::int` }).from(products),
      this.db.select({ count: sql<number>`count(*)::int` }).from(products).where(eq(products.status, "APPROVED")),
      this.db.select({ count: sql<number>`count(*)::int` }).from(products).where(
        or(eq(products.status, "PENDING_VALUATION"), eq(products.status, "VALUED"), eq(products.status, "DRAFT"))
      ),
      this.db.select({
        count: sql<number>`count(*)::int`,
        gmv: sql<string>`coalesce(sum(total_amount::numeric), 0)`,
        commission: sql<string>`coalesce(sum(commission_amount::numeric), 0)`,
      }).from(orders),
      this.db.select({ count: sql<number>`count(*)::int` }).from(orders).where(eq(orders.status, "DELIVERED")),
      this.db.select({ count: sql<number>`count(*)::int` }).from(payments).where(eq(payments.status, "SUBMITTED")),
      this.db.select({ count: sql<number>`count(*)::int` }).from(deliveries).where(
        or(eq(deliveries.status, "ASSIGNED"), eq(deliveries.status, "PICKED_UP"), eq(deliveries.status, "IN_TRANSIT"))
      ),
      this.db.select({ count: sql<number>`count(*)::int` }).from(transactionDisputes).where(eq(transactionDisputes.status, "OPEN")),
      this.db.select({ count: sql<number>`count(*)::int` }).from(users),
      this.db.query.orders.findMany({
        limit: 5,
        orderBy: [desc(orders.createdAt)],
        with: {
          product: true,
          buyer: true,
          seller: true,
        },
      }),
      this.db.query.products.findMany({
        where: or(eq(products.status, "PENDING_VALUATION"), eq(products.status, "VALUED")),
        limit: 5,
        orderBy: [desc(products.createdAt)],
        with: {
          seller: true,
          category: true,
          images: true,
        },
      }),
    ]);

    return {
      totalProducts: totalProductsRes[0]?.count ?? 0,
      publishedProducts: publishedProductsRes[0]?.count ?? 0,
      pendingProducts: pendingProductsRes[0]?.count ?? 0,
      totalOrders: totalOrdersRes[0]?.count ?? 0,
      totalGmv: parseFloat(totalOrdersRes[0]?.gmv ?? "0"),
      totalCommission: parseFloat(totalOrdersRes[0]?.commission ?? "0"),
      deliveredOrders: deliveredOrdersRes[0]?.count ?? 0,
      pendingPayments: pendingPaymentsRes[0]?.count ?? 0,
      pendingDeliveries: pendingDeliveriesRes[0]?.count ?? 0,
      openDisputes: openDisputesRes[0]?.count ?? 0,
      totalUsers: totalUsersRes[0]?.count ?? 0,
      recentOrders,
      recentListings,
    };
  }

  /**
   * Admin: Update status of a product (pause, archive, approve, reject)
   */
  async adminUpdateStatus(adminId: string, input: z.infer<typeof adminUpdateProductStatusSchema>) {
    const product = await this.db.query.products.findFirst({
      where: eq(products.id, input.productId),
    });

    if (!product) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
    }

    await this.db
      .update(products)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(products.id, input.productId));

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: `PRODUCT_STATUS_${input.status}`,
      targetType: "product",
      targetId: input.productId,
      metadata: { previousStatus: product.status, newStatus: input.status, notes: input.notes },
    });

    return { success: true, status: input.status };
  }

  /**
   * Admin: Bulk action on products
   */
  async adminBulkAction(adminId: string, input: z.infer<typeof adminBulkProductActionSchema>) {
    if (input.action === "ARCHIVE") {
      await this.db
        .update(products)
        .set({ status: "ARCHIVED", updatedAt: new Date() })
        .where(inArray(products.id, input.productIds));
    } else if (input.action === "APPROVE") {
      await this.db
        .update(products)
        .set({ status: "APPROVED", updatedAt: new Date() })
        .where(inArray(products.id, input.productIds));
    } else if (input.action === "REJECT") {
      await this.db
        .update(products)
        .set({ status: "REJECTED", updatedAt: new Date() })
        .where(inArray(products.id, input.productIds));
    }

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: `PRODUCT_BULK_${input.action}`,
      targetType: "product",
      targetId: input.productIds.join(","),
      metadata: { count: input.productIds.length, reason: input.reason },
    });

    return { success: true, count: input.productIds.length };
  }

  /**
   * Admin: List categories with subcategory hierarchy and product counts
   */
  async adminListCategories() {
    return this.db.query.categories.findMany({
      orderBy: [asc(categories.displayOrder), asc(categories.name)],
      with: {
        subcategories: true,
        products: true,
      },
    });
  }

  /**
   * Admin: Create a product category
   */
  async adminCreateCategory(adminId: string, input: z.infer<typeof adminCreateCategorySchema>) {
    const [created] = await this.db
      .insert(categories)
      .values({
        name: input.name,
        slug: input.slug,
        description: input.description,
        iconName: input.iconName,
        parentId: input.parentId,
        displayOrder: input.displayOrder,
      })
      .returning();

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: "CATEGORY_CREATED",
      targetType: "category",
      targetId: created.id,
      metadata: { name: input.name, slug: input.slug },
    });

    return created;
  }

  /**
   * Admin: Update category details
   */
  async adminUpdateCategory(adminId: string, input: z.infer<typeof adminUpdateCategorySchema>) {
    const [updated] = await this.db
      .update(categories)
      .set({
        name: input.name,
        description: input.description,
        iconName: input.iconName,
        isActive: input.isActive,
        displayOrder: input.displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, input.categoryId))
      .returning();

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: "CATEGORY_UPDATED",
      targetType: "category",
      targetId: input.categoryId,
      metadata: input,
    });

    return updated;
  }
}
